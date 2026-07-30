// Asserts that the JSON-LD the built site emits is well formed, internally
// consistent, and actually present where it is supposed to be.
//
// JSON-LD fails the same way the broken `og:image` paths in #159 did: silently.
// Nothing renders wrong, no reader notices, and a typo can ship for a year. The
// difference is that JSON-LD is worse — it is never displayed at all, so the
// only way to see it is to go looking. This check is that looking, on every
// build. There is no test suite in this repo; this stands in for one.
//
// What it checks, per rendered page:
//
//   1. Every `application/ld+json` block parses as JSON.
//   2. Coverage: the homepage declares a ProfilePage, and every blog post
//      declares a BlogPosting. A template regression that silently stopped
//      emitting anything would otherwise pass, since "no markup" is not
//      "invalid markup".
//   3. Reference integrity: every `{"@id": ...}` reference resolves to a node
//      declared in the same page's graph. This is the invariant the whole
//      design rests on — see decisions/structured-data.md — and it is the one
//      thing no amount of reading the template will confirm.
//   4. Required properties are present on each node type.
//   5. The BlogPosting `image` matches the page's `twitter:image`, proving the
//      two really do come from the shared og/image-url.html partial.
//
// Usage: node bin/verify-structured-data.mjs [publish-dir]

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const PUBLISH_DIR = process.argv[2] ?? "public";

const LD_BLOCK =
  /<script\s+type="application\/ld\+json"\s*>([\s\S]*?)<\/script>/g;

const TWITTER_IMAGE = /<meta\s+name="twitter:image"\s+content="([^"]*)"/;

// Same two exclusions verify-og-images.mjs makes, for the same reasons: Hugo
// writes ~190 bare meta-refresh stubs for `aliases`, and /random/ is a
// noindex bounce page with its own layout. Neither loads the head partial, so
// neither has structured data, and that is correct rather than a defect.
const ALIAS_STUB = /<meta\s+http-equiv="refresh"/i;
const NOINDEX = /<meta\s+name="robots"\s+content="[^"]*noindex/i;

// Content lives at content/posts/YYYY/M/slug/index.md, so the built post pages
// are exactly posts/YYYY/M/slug/index.html. Anchoring on that shape excludes
// the section list at /posts/ and the paginated /posts/page/N/ pages, which are
// not posts and carry no BlogPosting.
const POST_PATH = /^posts\/\d{4}\/\d{1,2}\/[^/]+\/index\.html$/;

// Google rejects an Article headline over 110 characters. The longest post
// title today is 97, so this is a guard against a future title rather than a
// present failure.
const MAX_HEADLINE = 110;

const REQUIRED = {
  Person: ["name", "url", "sameAs"],
  ProfilePage: ["mainEntity"],
  BlogPosting: [
    "headline",
    "datePublished",
    "dateModified",
    "author",
    "publisher",
    "image",
    "url",
  ],
};

function log(message) {
  console.log(`[verify-schema] ${message}`);
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

// Walks the parsed graph and separates the two kinds of object that carry an
// `@id`. A node that also has `@type` is a *declaration* — it says what that
// id is. One without a `@type` is a *reference* — it points at a declaration
// and expects something else to supply the meaning. That distinction is the
// whole basis of check 3.
function collectIds(value, declared, referenced) {
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, declared, referenced);
    return;
  }
  if (value === null || typeof value !== "object") return;

  if (typeof value["@id"] === "string") {
    if (value["@type"]) {
      declared.add(value["@id"]);
    } else {
      referenced.add(value["@id"]);
    }
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "@id" || key === "@type") continue;
    collectIds(child, declared, referenced);
  }
}

function nodesOf(parsed) {
  const graph = parsed["@graph"];
  return Array.isArray(graph) ? graph : [parsed];
}

async function main() {
  const errors = [];
  let pages = 0;
  let skipped = 0;
  let blocks = 0;
  let postsSeen = 0;
  let homeSeen = false;

  for await (const file of htmlFiles(PUBLISH_DIR)) {
    const html = await readFile(file, "utf8");
    if (ALIAS_STUB.test(html) || NOINDEX.test(html)) {
      skipped += 1;
      continue;
    }
    pages += 1;

    const rel = relative(PUBLISH_DIR, file);
    const page = "/" + rel;
    const isHome = rel === "index.html";
    const isPost = POST_PATH.test(rel);

    const parsedBlocks = [];
    for (const [, body] of html.matchAll(LD_BLOCK)) {
      blocks += 1;
      try {
        parsedBlocks.push(JSON.parse(body));
      } catch (error) {
        errors.push(`${page}  invalid JSON in ld+json block: ${error.message}`);
      }
    }

    const types = new Set();
    const declared = new Set();
    const referenced = new Set();

    for (const parsed of parsedBlocks) {
      collectIds(parsed, declared, referenced);
      for (const node of nodesOf(parsed)) {
        if (!node || typeof node !== "object") continue;
        const type = node["@type"];
        types.add(type);

        for (const property of REQUIRED[type] ?? []) {
          const present =
            node[property] !== undefined &&
            node[property] !== null &&
            node[property] !== "" &&
            !(Array.isArray(node[property]) && node[property].length === 0);
          if (!present) {
            errors.push(`${page}  ${type} is missing required "${property}"`);
          }
        }

        if (type === "BlogPosting") {
          if (
            typeof node.headline === "string" &&
            node.headline.length > MAX_HEADLINE
          ) {
            errors.push(
              `${page}  BlogPosting headline is ${node.headline.length} chars, over Google's ${MAX_HEADLINE} limit. Shorten the post title.`,
            );
          }
          const twitter = html.match(TWITTER_IMAGE)?.[1];
          if (twitter && node.image !== twitter) {
            errors.push(
              `${page}  BlogPosting image (${node.image}) does not match twitter:image (${twitter}). They should both come from og/image-url.html.`,
            );
          }
        }
      }
    }

    for (const id of referenced) {
      if (!declared.has(id)) {
        errors.push(
          `${page}  references @id "${id}" but no node on this page declares it. Google parses each page on its own, so the reference is unresolvable here.`,
        );
      }
    }

    if (isHome) {
      homeSeen = true;
      if (!types.has("ProfilePage")) {
        errors.push(`${page}  homepage declares no ProfilePage`);
      }
    }
    if (isPost) {
      postsSeen += 1;
      if (!types.has("BlogPosting")) {
        errors.push(`${page}  post declares no BlogPosting`);
      }
    }
  }

  log(
    `${pages} pages, ${blocks} ld+json blocks, ${postsSeen} posts, ${skipped} redirect/noindex pages skipped`,
  );

  // A run that inspected nothing is a broken check, not a passing one. Same
  // guard verify-og-images.mjs carries: without it, a path or regex change
  // turns this into a no-op that prints success forever.
  if (pages > 0 && blocks === 0) {
    errors.push(
      `found ${pages} pages but no ld+json blocks at all. Either the head partial stopped emitting them or LD_BLOCK no longer matches Hugo's output.`,
    );
  }
  if (pages > 0 && !homeSeen) {
    errors.push(
      `never saw ${PUBLISH_DIR}/index.html, so the homepage was not checked.`,
    );
  }
  if (pages > 0 && postsSeen === 0) {
    errors.push(
      `matched no post pages against ${POST_PATH}. If the content layout changed, this check has been silently verifying nothing.`,
    );
  }

  if (errors.length > 0) {
    log(`ERROR: ${errors.length} problem(s):`);
    for (const error of errors.slice(0, 25)) log(`  ${error}`);
    if (errors.length > 25) log(`  ...and ${errors.length - 25} more`);
    process.exit(1);
  }

  log("all structured data is valid and every @id resolves");
}

try {
  await main();
} catch (error) {
  log(`ERROR: ${error.message}`);
  process.exit(1);
}
