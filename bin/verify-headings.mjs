// Asserts that every rendered page has exactly one `<h1>`.
//
// `decisions/headings.md` settled that the layout owns the h1 and markdown
// bodies start at `##`. Enforcing that took a sweep of 23 content files, and
// nothing about the setup keeps it swept: a post that opens with a `#` renders a
// second h1, and a new layout that forgets the heading renders none. Neither
// shows up as an error, and neither is visible to anyone reading the page.
//
// That is the same class of silent failure as a 404ing og:image (#159) or
// malformed JSON-LD, and it gets the same treatment: a check on every build.
// See #186 for the audit that prompted it and #156 for the wider page-metadata
// check this belongs with.
//
// Usage: node bin/verify-headings.mjs [publish-dir]

import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const PUBLISH_DIR = process.argv[2] ?? "public";

// Matches an opening `<h1>` or `<h1 class="...">`, and nothing else. Without the
// trailing character class this would also count `<h1abc`, and without the
// leading `<` it would count the closing tag, doubling every page's total.
const H1_OPEN = /<h1[\s>]/gi;

// Hugo writes a bare refresh stub for every `aliases` entry: a title, a
// canonical link, and a meta refresh, with none of the theme's layout. There are
// around 190 of them for the pre-2020 URL scheme. They are redirects rather than
// pages, so having no heading is correct, not a defect.
//
// The refresh tag alone is not enough to identify one. A post writing about
// redirects could emit that tag as raw inline HTML, and matching on it by itself
// would drop that page out of the check silently — the worst failure available
// to a script whose whole job is to notice. Hugo's stub is a `<head>` and
// nothing else, so requiring no `<body>` separates the two exactly.
const REFRESH_TAG = /<meta\s+http-equiv="refresh"/i;
const BODY_TAG = /<body[\s>]/i;

function isAliasStub(html) {
  return REFRESH_TAG.test(html) && !BODY_TAG.test(html);
}

// Files allowed to render no h1, by path under the publish dir. Two things end
// up here: a page that genuinely should not have one, and a standalone HTML
// asset that is not a page at all (see the missing-h1 report below).
//
// `/random/` is the only one and is not really a page: it is a redirect shim
// that bounces the visitor to a random post, whose body exists only as a
// fallback link for when the script does not run. It gets an entry here rather
// than a broader "skip noindex pages" rule, because `/search/` is noindex too
// and does carry an h1 — a rule loose enough to excuse `/random/` by category
// would quietly stop checking `/search/` as well.
const NO_H1_ALLOWED = new Set(["random/index.html"]);

function log(message) {
  console.log(`[verify-headings] ${message}`);
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
  const missing = [];
  const duplicated = [];
  const unusedAllowances = new Set(NO_H1_ALLOWED);
  let pages = 0;
  let skipped = 0;

  for await (const file of htmlFiles(PUBLISH_DIR)) {
    const html = await readFile(file, "utf8");

    if (isAliasStub(html)) {
      skipped += 1;
      continue;
    }
    pages += 1;

    const key = relative(PUBLISH_DIR, file).split(sep).join("/");
    const count = (html.match(H1_OPEN) ?? []).length;

    if (count === 1) continue;

    if (count === 0) {
      if (NO_H1_ALLOWED.has(key)) {
        unusedAllowances.delete(key);
        continue;
      }
      missing.push(`/${key}`);
    } else {
      duplicated.push(`/${key}  (${count} h1s)`);
    }
  }

  log(`${pages} pages checked, ${skipped} alias redirect stubs skipped`);
  let failed = false;

  const report = (label, entries) => {
    failed = true;
    log(`ERROR: ${entries.length} ${label}:`);
    for (const entry of entries.slice(0, 20)) log(`  ${entry}`);
    if (entries.length > 20) log(`  ...and ${entries.length - 20} more`);
  };

  // A run that found no pages is a broken check, not a passing one — the same
  // no-op-that-prints-success failure bin/verify-og-images.mjs guards against.
  if (pages === 0) {
    failed = true;
    log(
      `ERROR: found no pages to check under ${PUBLISH_DIR}. Either the site did not build or the publish dir is wrong.`,
    );
  }

  // This walks every `.html` under the publish dir, so a standalone HTML asset
  // shipped alongside a post — an OmniOutliner or Keynote export, say — reads as
  // a page with no heading and lands here. There is no reliable marker that
  // separates a rendered page from one of those, and failing on the unknown case
  // beats guessing past it, so the message carries the alternative instead.
  if (missing.length > 0) {
    report(
      "page(s) render no h1. The layout owns it: see decisions/headings.md. " +
        "If one of these is not a page but an HTML asset, add it to NO_H1_ALLOWED",
      missing,
    );
  }
  if (duplicated.length > 0) {
    report(
      "page(s) render more than one h1, usually a `#` in markdown that should be `##`",
      duplicated,
    );
  }

  // An allowance nobody uses is a stale exception that would silently excuse a
  // future page at that path. Fail so it gets deleted with the page it covered.
  if (unusedAllowances.size > 0) {
    report("stale entr(ies) in NO_H1_ALLOWED — the page(s) now have an h1", [
      ...unusedAllowances,
    ]);
  }

  if (failed) process.exit(1);
  log("every page has exactly one h1");
}

try {
  await main();
} catch (error) {
  log(`ERROR: ${error.message}`);
  process.exit(1);
}
