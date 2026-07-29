// Generates the social card image for every page that needs one.
//
// Runs from bin/build.sh after Hugo, reading the work list Hugo wrote to
// public/og-manifest.json and writing PNGs into public/ at the exact paths the
// pages advertise in their `og:image` tags. Nothing is committed: cards are a
// pure function of a page's title, description, and the design, so they are
// rebuilt every deploy rather than stored.
//
// Usage: node bin/og-images.mjs [publish-dir]   (default: public)
//
// See decisions/og-images.md.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { loadAssets, renderCard } from "./og-card.mjs";

const PUBLISH_DIR = process.argv[2] ?? "public";
const MANIFEST = join(PUBLISH_DIR, "og-manifest.json");

// The static card stands in whenever a single card fails to render, so a
// pathological page cannot leave a live `og:image` pointing at a 404. But a
// silent fallback nobody notices is its own failure: a warning scrolls past in
// a build log unread. Past this many, the build stops instead, on the reasoning
// that a handful of odd pages is tolerable and a systematic regression is not.
const MAX_FALLBACKS = 5;

function log(message) {
  console.log(`[og-images] ${message}`);
}

async function writeCard(publishDir, path, bytes) {
  const target = join(publishDir, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
}

async function readManifest() {
  let raw;
  try {
    raw = await readFile(MANIFEST, "utf8");
  } catch (cause) {
    throw new Error(
      `Could not read ${MANIFEST}. Hugo writes it via the 'ogmanifest' output format, so this usually means the Hugo build did not run or that output format was removed from hugo.yaml.`,
      { cause },
    );
  }

  const manifest = JSON.parse(raw);
  if (!Array.isArray(manifest.cards)) {
    throw new Error(`${MANIFEST} has no 'cards' array.`);
  }
  if (!manifest.default?.path) {
    throw new Error(
      `${MANIFEST} has no 'default' card. It is the 404 page's image and the fallback for every failed render, so there is nothing safe to do without it.`,
    );
  }
  return manifest;
}

async function main() {
  const startedAt = process.hrtime.bigint();

  const manifest = await readManifest();
  const assets = await loadAssets();

  // Rendered first and held in memory: it is both the 404 page's card and the
  // fallback for any card that fails below, so nothing else can proceed without
  // it. If this throws, the build should stop, and it will.
  //
  // Its path and wording come from the manifest rather than from a constant
  // here, so the version segment lives only in hugo.yaml and the words cannot
  // drift from the home page they are taken from.
  const defaultBytes = await renderCard(assets, manifest.default);
  await writeCard(PUBLISH_DIR, manifest.default.path, defaultBytes);

  // Starts at one because the static card just written counts toward both the
  // total and the byte average.
  let written = 1;
  let bytesTotal = defaultBytes.length;
  const fallbacks = [];

  for (const card of manifest.cards) {
    let bytes;
    try {
      bytes = await renderCard(assets, card);
    } catch (error) {
      // One bad page must not take the whole site offline, but it must be
      // loud, and it must still leave a resolvable URL behind.
      fallbacks.push(card.url);
      log(
        `WARNING: ${card.url} failed to render, using the static card. ${error.message}`,
      );
      bytes = defaultBytes;
    }
    await writeCard(PUBLISH_DIR, card.path, bytes);
    written += 1;
    bytesTotal += bytes.length;
  }

  // `written` counts the manifest rows plus the static card, so it is only zero
  // if the site has no pages at all. Guarded anyway, because a divide-by-zero
  // here would report NaN in the one line Render's build log actually shows.
  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
  const megabytes = (bytesTotal / 1024 / 1024).toFixed(1);
  const perCardMs = written > 0 ? (elapsedMs / written).toFixed(1) : "n/a";
  const averageKb = written > 0 ? Math.round(bytesTotal / written / 1024) : 0;

  log(
    `${written} cards in ${(elapsedMs / 1000).toFixed(1)}s ` +
      `(${perCardMs}ms each, ${megabytes}MB total, ~${averageKb}KB average)`,
  );

  if (fallbacks.length > MAX_FALLBACKS) {
    log(
      `ERROR: ${fallbacks.length} cards fell back to the static card, above the limit of ${MAX_FALLBACKS}.`,
    );
    for (const url of fallbacks) log(`  ${url}`);
    process.exit(1);
  }

  if (fallbacks.length > 0) {
    log(
      `${fallbacks.length} card(s) fell back to the static card. Within the limit of ${MAX_FALLBACKS}, but worth a look.`,
    );
  }
}

try {
  await main();
} catch (error) {
  // A systematic failure here (takumi missing, fonts unreadable, no manifest)
  // would ship hundreds of pages whose og:image points at nothing, which is
  // worse than not shipping. bin/build.sh sets errexit for exactly this.
  log(`ERROR: ${error.message}`);
  if (error.cause) log(`  caused by: ${error.cause.message}`);
  process.exit(1);
}
