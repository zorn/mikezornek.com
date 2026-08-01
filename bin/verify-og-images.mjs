// Asserts that every social image the built site advertises actually exists.
//
// This is the invariant that matters: a card that is off-brand is cosmetic, but
// a card that 404s is a broken share, which is the condition issue #103 exists
// to remove. There is no test suite in this repo, so this check is what stands
// in for one, and it runs on every build.
//
// It checks two things per rendered page:
//
//   1. An `og:image` is present at all.
//   2. Every `og:image` and `twitter:image` URL resolves to a file on disk.
//
// The second is not hypothetical. Three posts had been shipping broken paths in
// their `images` front matter for months and nothing caught it, because that
// front matter is a plain string Hugo runs `absURL` over without checking a file
// is there. Two had a doubled `posts/` segment; the third named a bundle that
// does not exist, and a hand search for the first pattern missed it. See #159.
//
// Usage: node bin/verify-og-images.mjs [publish-dir]

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const PUBLISH_DIR = process.argv[2] ?? "public";

// Read from hugo.yaml rather than hardcoding it. A wrong base URL here would be
// invisible and total: every advertised URL would fail the prefix test, get
// filed as off-site, and the check would announce success having verified
// nothing at all.
async function siteBaseUrl() {
  const config = await readFile("hugo.yaml", "utf8");
  const match = config.match(/^baseURL:\s*["']?([^"'\s]+)["']?\s*$/m);
  if (!match) {
    throw new Error("Could not find baseURL in hugo.yaml.");
  }
  return match[1].replace(/\/+$/, "");
}

const IMAGE_TAG =
  /<meta\s+(?:property|name)="(og:image|twitter:image)"\s+content="([^"]*)"/g;

// Hugo writes a bare refresh stub for every `aliases` entry: a title, a
// canonical link, and a meta refresh, with none of the theme's head partial.
// There are around 190 of them for the pre-2020 URL scheme. They are redirects
// rather than pages, so having no social image is correct, not a defect.
const ALIAS_STUB = /<meta\s+http-equiv="refresh"/i;

// Some noindex pages do not load the theme's head partial at all and so emit no
// social tags. `/random/` is the example: a standalone layout that bounces the
// visitor straight to a random post. Having no card is correct for those.
//
// This deliberately excuses only a *missing* `og:image`, never a present one.
// The rule used to skip any noindex page outright, using "noindex" as a proxy
// for "emits no social tags". `/search/` broke that proxy: it is noindex, and it
// renders through head.html, so it advertises a real card that the manifest
// really generates. Under the old rule that card silently left coverage, which
// is exactly the broken-share failure this script exists to catch.
const NOINDEX = /<meta\s+name="robots"\s+content="[^"]*noindex/i;

function log(message) {
  console.log(`[verify-og] ${message}`);
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

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

// Maps an advertised URL back to the file that should satisfy it. Returns null
// for anything on another host, which cannot be checked from disk.
function localPathFor(url, baseUrl) {
  if (!url.startsWith(baseUrl)) return null;
  const path = decodeURIComponent(url.slice(baseUrl.length)).replace(
    /^\/+/,
    "",
  );
  return join(PUBLISH_DIR, path);
}

async function main() {
  const baseUrl = await siteBaseUrl();
  const missingImage = [];
  const brokenUrls = [];
  const offsite = new Set();
  let pages = 0;
  let skipped = 0;
  let checked = 0;

  for await (const file of htmlFiles(PUBLISH_DIR)) {
    const html = await readFile(file, "utf8");

    if (ALIAS_STUB.test(html)) {
      skipped += 1;
      continue;
    }

    const matches = [...html.matchAll(IMAGE_TAG)];
    const hasOgImage = matches.some(([, tag]) => tag === "og:image");

    if (!hasOgImage && NOINDEX.test(html)) {
      skipped += 1;
      continue;
    }
    pages += 1;

    const page = "/" + relative(PUBLISH_DIR, file);

    if (!hasOgImage) {
      missingImage.push(page);
      continue;
    }

    for (const [, tag, url] of matches) {
      const local = localPathFor(url, baseUrl);
      if (local === null) {
        offsite.add(`${page}  ${tag}  ->  ${url}`);
        continue;
      }
      checked += 1;
      if (!(await exists(local))) {
        brokenUrls.push(`${page}  ${tag}  ->  ${url}`);
      }
    }
  }

  log(
    `${pages} pages, ${checked} image URLs checked against ${baseUrl}, ${skipped} redirect/noindex pages skipped`,
  );
  let failed = false;

  // A run that checked nothing is a broken check, not a passing one. Without
  // this the whole verifier degrades silently into a no-op that prints success.
  if (pages > 0 && checked === 0) {
    failed = true;
    log(
      `ERROR: found ${pages} pages but verified no image URLs. Every URL was treated as off-site, which usually means the baseURL read from hugo.yaml (${baseUrl}) does not match the URLs the site emits.`,
    );
  }

  const report = (label, entries) => {
    failed = true;
    log(`ERROR: ${entries.length} ${label}:`);
    for (const entry of entries.slice(0, 20)) log(`  ${entry}`);
    if (entries.length > 20) log(`  ...and ${entries.length - 20} more`);
  };

  if (missingImage.length > 0)
    report("page(s) emit no og:image at all", missingImage);
  if (brokenUrls.length > 0) {
    report("image URL(s) point at a file that does not exist", brokenUrls);
  }

  // An image on another host cannot be checked from disk, so tolerating it
  // would be a hole in the invariant rather than a convenience. No page on this
  // site legitimately points elsewhere. In practice this fires when a stray
  // `hugo server` has rewritten public/ with `localhost:1313` URLs, which is the
  // built-output twin of the dev-server check bin/build.sh already runs over
  // content. If a genuinely external image is ever wanted, allow it explicitly
  // rather than by weakening this.
  if (offsite.size > 0) {
    report(
      `image URL(s) point at another host, so nothing could verify them (expected ${baseUrl})`,
      [...offsite],
    );
  }

  if (failed) process.exit(1);
  log("all social images resolve");
}

try {
  await main();
} catch (error) {
  log(`ERROR: ${error.message}`);
  process.exit(1);
}
