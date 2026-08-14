// The social card design, and the takumi plumbing to render it.
//
// Single source of truth for what a card looks like. `bin/og-images.mjs` uses
// it to write every card during a build; `bin/og-preview.mjs` uses it to render
// samples while iterating on the design. Keeping the layout here means those
// two cannot drift apart.
//
// The design and the reasoning behind it are recorded in docs/adr/0007-og-images.md.

import { readFile } from "node:fs/promises";
import { Renderer } from "@takumi-rs/core";
import { fromHtml } from "@takumi-rs/helpers/html";

export const WIDTH = 1200;
export const HEIGHT = 630;

// Tailwind's purple-600, which is what the site header uses.
const PURPLE = "#9333ea";
const PAPER = "#faf9fb";
const INK = "#1c1420";
const MUTED = "#5b5266";

// Settled over four prototype rounds. The band mirrors the site's own header,
// and the wordmark deliberately outweighs the avatar: at the size a feed
// actually displays a card, the name is what carries, and a smaller avatar was
// measured too small to read as a face at all.
const BAND_HEIGHT = 200;
const TILE_HEIGHT = 200;
const AVATAR = 120;
const RING = 7;
const WORDMARK = 72;
const PAD = 72;
const CONTENT_WIDTH = WIDTH - PAD * 2;

// Largest first. The title takes the biggest size that fits its box, and is
// never truncated: a cut-off title is a broken promise, where a cut-off
// description is just a summary trailing off.
const TITLE_LADDER = [64, 58, 52, 46, 40];
const TITLE_LINE_HEIGHT = 1.12;
const MAX_TITLE_LINES = 3;

// Hard ceiling on the title block, independent of line count, so the title can
// never eat the space the description needs.
const TITLE_BOX_HEIGHT = HEIGHT - BAND_HEIGHT - 190;

// The description is capped at two lines. This is the deliberate asymmetry with
// the title: a truncated title is a broken promise, but a description is
// already a summary and readers expect summaries to trail off. Without it, an
// over-long description simply grows until it runs off the bottom of the card,
// and nothing enforces the documented 160-character ceiling at write time.
const MAX_DESCRIPTION_LINES = 2;

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// takumi does not clip a repeating background to its element's box: it paints
// whole tiles and lets the overflow spill onto whatever is underneath. On a
// full-bleed element the canvas hides that, but the band would visibly leak
// texture into the white body below. So the tile is sized to divide the box
// evenly. The mosaic is natively 300x295 and the card is 1200 wide, so a 300px
// tile width always gives exactly four columns; only the height needs choosing.
function texture(tileHeight) {
  return [
    `background-color:${PURPLE}`,
    `background-image:url('/images/dark-mosaic.png')`,
    `background-repeat:repeat`,
    `background-size:300px ${tileHeight}px`,
  ].join(";");
}

// Reads the site's own font and image files, so cards inherit the real look
// rather than an approximation of it. Called once per process: the fonts are a
// few hundred KB and re-reading them per card would dominate the runtime.
export async function loadAssets() {
  const [bold, regular, mosaic, avatar] = await Promise.all([
    readFile("themes/reborn/static/fonts/ubuntu-v20-latin-700.woff2"),
    readFile("themes/reborn/static/fonts/ubuntu-v20-latin-regular.woff2"),
    readFile("themes/reborn/static/images/dark-mosaic.png"),
    readFile("static/images/zorn_square.png"),
  ]);

  return {
    renderer: new Renderer(),
    fonts: [bold, regular],
    // Images must be handed to the renderer keyed by `src`, and the markup then
    // references that `src`. A `data:` URI renders nothing at all, silently.
    images: [
      { src: "/images/dark-mosaic.png", data: mosaic },
      { src: "/images/zorn_square.png", data: avatar },
    ],
  };
}

async function draw(assets, html) {
  const { node, stylesheets } = await fromHtml(html);
  return assets.renderer.render(node, {
    width: WIDTH,
    height: HEIGHT,
    fonts: assets.fonts,
    images: assets.images,
    stylesheets,
  });
}

// Picks the largest ladder size whose title still fits, using takumi's own
// layout pass rather than guessing from character counts. Titles in this
// archive run from 8 to 106 characters, so one fixed size cannot serve both.
//
// A size has to clear two independent limits: at most MAX_TITLE_LINES lines,
// which is what keeps the shape recognisable across the archive, and the
// absolute box height, which is what stops the title crowding out the
// description. Testing only the box would accept five lines at the smallest
// size, since smaller type fits more lines into the same height.
//
// If nothing fits, the smallest size is used and the title still renders in
// full: the title is never truncated, so an unprecedented title overflows
// visibly rather than losing words silently.
//
// The fonts must be passed here as well as at render time. Measuring without
// them silently falls back to a different face, and the metrics are not close:
// the archive's longest title measures 260px unfonted against 195px in Ubuntu,
// which is a whole extra line and enough to pick the wrong size. The mistake
// hides well, because a Renderer that has already drawn something retains its
// fonts, so only the first card of a run measures wrong.
async function fitTitleSize(assets, title) {
  for (const size of TITLE_LADDER) {
    const html = `<div style="display:flex;width:${CONTENT_WIDTH}px"><span style="font-family:Ubuntu;font-weight:700;font-size:${size}px;line-height:${TITLE_LINE_HEIGHT}">${escapeHtml(title)}</span></div>`;
    const { node } = await fromHtml(html);
    const measured = await assets.renderer.measure(node, {
      width: CONTENT_WIDTH,
      height: HEIGHT,
      fonts: assets.fonts,
    });
    // The +1 absorbs sub-pixel rounding, so a title that lands exactly on the
    // line limit is not bumped down a size by a fraction of a pixel.
    const lineLimit = size * TITLE_LINE_HEIGHT * MAX_TITLE_LINES + 1;
    if (measured.height <= Math.min(lineLimit, TITLE_BOX_HEIGHT)) return size;
  }
  return TITLE_LADDER[TITLE_LADDER.length - 1];
}

export async function renderCard(assets, { title, description }) {
  const titleSize = await fitTitleSize(assets, title);
  const bodyHeight = HEIGHT - BAND_HEIGHT;

  // The gap scales with the avatar so the lockup keeps reading as one unit.
  const gap = Math.round(AVATAR * 0.3);

  const html = `<div style="display:flex;flex-direction:column;width:100%;height:100%;background-color:${PAPER}">
    <div style="display:flex;align-items:center;height:${BAND_HEIGHT}px;padding:0 ${PAD}px;${texture(TILE_HEIGHT)}">
      <div style="display:flex;padding:${RING}px;border-radius:50%;background-color:rgba(255,255,255,0.92)">
        <img src="/images/zorn_square.png" style="width:${AVATAR}px;height:${AVATAR}px;border-radius:50%" />
      </div>
      <span style="margin-left:${gap}px;font-family:Ubuntu;font-weight:700;font-size:${WORDMARK}px;color:#ffffff;text-shadow:0 3px 10px rgba(0,0,0,0.38)">Mike Zornek</span>
    </div>
    <div style="display:flex;align-items:center;height:${bodyHeight}px;padding:0 ${PAD}px;background-color:${PAPER}">
      <div style="display:flex;flex-direction:column;width:${CONTENT_WIDTH}px">
        <span style="font-family:Ubuntu;font-weight:700;font-size:${titleSize}px;line-height:1.12;color:${INK}">${escapeHtml(title)}</span>
        ${description ? `<span style="margin-top:24px;font-family:Ubuntu;font-size:27px;line-height:1.4;color:${MUTED};line-clamp:${MAX_DESCRIPTION_LINES};overflow:hidden">${escapeHtml(description)}</span>` : ""}
      </div>
    </div>
  </div>`;

  return draw(assets, html);
}
