// Renders sample social cards to look at while iterating on the design.
//
// The layout itself lives in bin/og-card.mjs, the same module the build step
// uses, so what you see here is what ships. This file only chooses what content
// to put through it.
//
// The set below is deliberately unflattering. Almost every entry is real
// content from the archive, picked for where the design breaks rather than
// where it looks good: the longest title, the shortest, curly quotes, a page
// with no description. A preview that only renders a comfortable headline
// teaches you nothing.
//
// Usage: node bin/og-preview.mjs <output-dir>

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { loadAssets, renderCard } from "./og-card.mjs";

const OUT = process.argv[2];

if (!OUT) {
  console.error("Usage: node bin/og-preview.mjs <output-dir>");
  process.exit(1);
}

const SAMPLES = [
  {
    key: "longest-title",
    title:
      "Using Schemaless Changesets to Separate Concerns Between the Web Context and the Business Context",
    description:
      "Schemaless changesets let you hand craft validations for a web form and keep a firm boundary between web and business contexts.",
  },
  {
    key: "longest-both",
    // This pairing exists on no real page. It is the compound worst case: the
    // archive's longest title against the site's longest description.
    title:
      "Using Schemaless Changesets to Separate Concerns Between the Web Context and the Business Context",
    description:
      "I'm using a public Trello board to keep track of my Clubhouse project's roadmap. Check it out. Feedback on the roadmap style and content itself very welcome.",
  },
  {
    key: "shortest-title",
    title: "Baseball",
    description:
      "With the season on hold, I have been working through Ken Burns' Baseball documentary. The passage that opens it still gets me.",
  },
  {
    key: "curly-quotes",
    // If entity handling breaks anywhere in the chain, this card shows it as
    // literal &rsquo; text rather than an apostrophe.
    title: "Updating Homebrew’s “httpListenAddress” Default for Jenkins",
    description:
      "Homebrew's Jenkins install binds to localhost only. How to change httpListenAddress so you can reach the server from another Mac.",
  },
  {
    key: "tag-page",
    // Composed by the og/card-title partial, because the page's own title is
    // the bare lowercase term.
    title: "Posts tagged elixir",
    description:
      "Posts on Elixir and Phoenix, from LiveView and Ecto to typespecs, testing, code aesthetics, and upgrade notes.",
  },
  {
    key: "no-description",
    // What a new post looks like before its description is written, which is
    // the state the archetype invites.
    title: "A Post Whose Description Has Not Been Written Yet",
    description: "",
  },
  {
    key: "overlong-description",
    // Nothing enforces the documented 160-character ceiling at write time, so
    // this checks that the two-line clamp catches an author who types past it.
    title: "A Post With A Perfectly Reasonable Title",
    description:
      "A description that badly overshoots the documented ceiling, because nothing in the toolchain actually enforces it at write time, and an author in a hurry can simply type past it without ever noticing.",
  },
  {
    key: "static-card",
    // The words the static card carries. In a real build these come from the
    // manifest, which takes them from the home page; repeated here only so the
    // fallback card can be eyeballed alongside the rest.
    title: "Elixir, Phoenix, and the craft of shipping software",
    description:
      "Blogging since 2012 from a developer and teacher in the suburbs of Philadelphia, plus Elixir consulting and a pile of side projects.",
  },
];

await mkdir(OUT, { recursive: true });
const assets = await loadAssets();

for (const sample of SAMPLES) {
  const startedAt = process.hrtime.bigint();
  const png = await renderCard(assets, sample);
  const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
  await writeFile(join(OUT, `${sample.key}.png`), png);
  console.log(
    `${sample.key.padEnd(18)} ${String(Math.round(png.length / 1024)).padStart(4)} KB  ${ms.toFixed(0)}ms`,
  );
}

console.log(`\n${SAMPLES.length} samples written to ${OUT}`);
