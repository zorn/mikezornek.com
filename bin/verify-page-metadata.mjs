// Asserts the head metadata invariants docs/adr/0002-page-metadata.md settled,
// on every build. There is no test suite in this repo, so this check stands in
// for one, alongside verify-og-images.mjs and verify-structured-data.mjs.
//
// What it checks, per rendered page:
//
//   1. Required Open Graph tags: og:title, og:description, og:url are all
//      present. og:image is out of scope — verify-og-images.mjs owns it — and so
//      are the twitter:* tags.
//   2. Description length: no meta description exceeds 160 characters, the hard
//      ceiling from the ADR. #155 brought every page under it, so this ships
//      green and acts as a ratchet.
//   3. No unearned site default: no page emits site.Params.description except
//      404.html, which has no front matter to write one into. Every other page
//      carries an authored description (#155); this stops a new page from
//      silently rejoining the fallback.
//
// It skips the ~190 alias/redirect stubs (a bare meta refresh, no head partial)
// and the noindex bounce layouts like /random/ that emit no Open Graph tags.
// /search/ is noindex but renders the full head, so it is checked, not skipped.
//
// Usage: node bin/verify-page-metadata.mjs [publish-dir]

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const PUBLISH_DIR = process.argv[2] ?? "public";

// 404.html has no front matter to write a description into, so it is the one
// page allowed on the site-default fallback. See docs/adr/0002-page-metadata.md.
const DEFAULT_DESCRIPTION_ALLOWED = new Set(["404.html"]);

const ALIAS_STUB = /<meta\s+http-equiv="refresh"/i;
const NOINDEX = /<meta\s+name="robots"\s+content="[^"]*noindex/i;

// Precompiled once at module scope, like IMAGE_TAG in verify-og-images.mjs. Hugo
// emits these as `property="og:*"`; `name=` is tolerated for robustness.
const OG_REQUIRED = ["og:title", "og:description", "og:url"].map((name) => ({
  name,
  regex: new RegExp(
    `<meta\\s+(?:property|name)="${name}"\\s+content="([^"]*)"`,
  ),
}));

const DESCRIPTION = /<meta\s+name="description"\s+content="([^"]*)"/;

// Google clips the display around 155-160 characters but measures the text a
// reader sees, so an attribute holding `&amp;` counts one character, not five.
// Decode the common entities before measuring length or comparing against the
// site default, or a description full of ampersands reads as over-long when it
// is not. head.html emits the value through `plainify | htmlUnescape` and then
// Go re-escapes it for the attribute; this undoes that second step.
const NAMED = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&nbsp;": " ",
};
function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCodePoint(parseInt(n, 16)),
    )
    .replace(/&[a-z]+;/gi, (entity) => NAMED[entity] ?? entity);
}

// The hard ceiling from docs/adr/0002-page-metadata.md.
const MAX_DESCRIPTION = 160;

function log(message) {
  console.log(`[verify-metadata] ${message}`);
}

// Read the fallback description from config rather than hardcoding it. head.html
// emits site.Params.description for any page without its own; if that line is
// reworded here, a hardcoded copy would silently stop matching and this check
// would quietly stop catching the fallback. Same reasoning as the baseURL read
// in verify-og-images.mjs. Anchor on the params block so a top-level or nested
// `description:` cannot be picked up instead.
async function siteDefaultDescription() {
  const config = await readFile("hugo.yaml", "utf8");
  const params = config.slice(config.search(/^params:/m));
  const match = params.match(/^ {2}description:\s*(.+?)\s*$/m);
  if (!match) {
    throw new Error("Could not find params.description in hugo.yaml.");
  }
  return decodeEntities(match[1].replace(/^["']|["']$/g, ""));
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* htmlFiles(path);
    } else if (entry.name.endsWith(".html")) {
      yield path;
    }
  }
}

async function main() {
  const siteDefault = await siteDefaultDescription();
  const missingOg = [];
  const tooLong = [];
  const usesDefault = [];
  let pages = 0;
  let skipped = 0;
  let descriptionsSeen = 0;

  for await (const file of htmlFiles(PUBLISH_DIR)) {
    const html = await readFile(file, "utf8");
    if (ALIAS_STUB.test(html)) {
      skipped += 1;
      continue;
    }
    const og = Object.fromEntries(
      OG_REQUIRED.map(({ name, regex }) => [name, html.match(regex)?.[1]]),
    );
    const hasAnyOg = OG_REQUIRED.some(({ name }) => og[name]);
    if (!hasAnyOg && NOINDEX.test(html)) {
      skipped += 1;
      continue;
    }
    pages += 1;
    const rel = relative(PUBLISH_DIR, file);
    const page = "/" + rel;

    for (const { name } of OG_REQUIRED) {
      if (!og[name]) missingOg.push(`${page}  missing ${name}`);
    }

    const rawDescription = html.match(DESCRIPTION)?.[1];
    if (rawDescription !== undefined) {
      descriptionsSeen += 1;
      const description = decodeEntities(rawDescription);
      if (description.length > MAX_DESCRIPTION) {
        tooLong.push(
          `${page}  ${description.length} chars (limit ${MAX_DESCRIPTION})`,
        );
      }
      if (
        description === siteDefault &&
        !DEFAULT_DESCRIPTION_ALLOWED.has(rel)
      ) {
        usesDefault.push(page);
      }
    }
  }

  log(
    `${pages} pages, ${descriptionsSeen} descriptions checked against ${MAX_DESCRIPTION}-char limit and the site default, ${skipped} redirect/noindex pages skipped`,
  );
  let failed = false;

  const report = (label, entries) => {
    failed = true;
    log(`ERROR: ${entries.length} ${label}:`);
    for (const entry of entries.slice(0, 25)) log(`  ${entry}`);
    if (entries.length > 25) log(`  ...and ${entries.length - 25} more`);
  };

  // A run that inspected no descriptions is a broken check, not a passing one.
  // Same guard the sibling verifiers carry: without it, a change to the
  // DESCRIPTION regex or Hugo's output turns the length and site-default checks
  // into a silent no-op that prints success forever.
  if (pages > 0 && descriptionsSeen === 0) {
    failed = true;
    log(
      `ERROR: found ${pages} pages but no meta descriptions at all. Either head.html stopped emitting them or DESCRIPTION no longer matches Hugo's output.`,
    );
  }

  if (missingOg.length > 0) {
    report("required Open Graph tag(s) missing", missingOg);
  }
  if (tooLong.length > 0) {
    report(
      `meta description(s) over ${MAX_DESCRIPTION} characters (see docs/adr/0002-page-metadata.md)`,
      tooLong,
    );
  }
  if (usesDefault.length > 0) {
    report(
      "page(s) emit the site-default description instead of an authored one",
      usesDefault,
    );
  }

  if (failed) process.exit(1);
  log("all page metadata is valid");
}

try {
  await main();
} catch (error) {
  log(`ERROR: ${error.message}`);
  process.exit(1);
}
