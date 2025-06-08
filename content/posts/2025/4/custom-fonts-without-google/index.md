---
title: "How I Got Rid of My Google-Hosted Web Fonts"
date: 2025-04-15T08:19:13-04:00
description: Some background on how I replaced Google-linked web fonts on this site with self-hosted ones to improve privacy concerns.
---

Over the last few weeks, I've been doing some infrastructure updates to the website, and one of those changes was to drop the use of [Google's linked web fonts](https://fonts.google.com/) and instead host custom fonts from my own server in the spirit of improving the privacy of my site visitors.

Here is how I did it and some of the problems I ran into.

## Picking your font

The first custom font I had in mind was `Ubuntu`, a bold sans-serif font that I like for my name in the header. You can see samples of this [on Google's site](https://fonts.google.com/specimen/Ubuntu), but to download it, I take advantage of the [google-webfont-helper](https://gwfh.mranftl.com/fonts/ubuntu) site, which lets me quickly customize the exact styles I am interested in using and offers me a list of various CSS methods of use. I use the more modern CSS approach, as seen in the following snippet.

```css
/* ubuntu-regular - latin */
@font-face {
  font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  src: url("../fonts/ubuntu-v20-latin-regular.woff2") format("woff2"); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
}

/* ubuntu-700 - latin */
@font-face {
  font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 700;
  src: url("../fonts/ubuntu-v20-latin-700.woff2") format("woff2"); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
}
```

Source: [assets/css/main.css](https://github.com/zorn/mikezornek.com/blob/4f3faf6c41540e93ae3cd61e28a7a09bcd08749d/assets/css/main.css)

**Aside:** I still need to add a proper [license](https://assets.ubuntu.com/v1/81e5605d-ubuntu-font-licence-1.0.txt) display for this font usage. That is still forthcoming.

## Using your font with Tailwind

The other notable infrastructure update was to make it so I could use Tailwind within my Hugo templates. To reference my font, I use the following [Tailwind utility class](https://tailwindcss.com/docs/font-family#using-a-custom-value):

```html
<h1 class="font-[Ubuntu] text-6xl font-bold">{{ site.Title }}</h1>
```

If you want to use a font more broadly, I'd recommend [editing Tailwind configuration](https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme) so you can express fonts with better abstractions at call sites, but for this one-off header, this is fine.

## Avoiding Flash of Unstyled Content (FOUC)

After deploying my new self-hosted fonts, I observed flashes of unstyled content. Specifically, Safari would display the header copy in a serif font and then swap it into Ubuntu. Both Safari and Firefox would flash the new header background texture image as I clicked from page to page.

I did a little reading and landed on the following solution, which has me use [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link) elements included in my `<head>` to help hint to the web rendering systems more early in the drawing process that it will need these resources before the first paint.

```html
<link
  rel="preload"
  href="/fonts/ubuntu-v20-latin-700.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
<link
  rel="preload"
  href="/fonts/ubuntu-v20-latin-regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
<link rel="preload" href="/images/dark-mosaic.png" as="image">
```

I think these are working well.

The font preload [explicitly](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload#cors-enabled_fetches) needs `crossorigin` for CORS things, but the image did not, which I find interesting.

---

I'll probably be doing more with my fonts and the overall design of the site in the coming weeks, but this was a good nugget of progress.

## Resources

- If you want to avoid hosting a font, consider limiting your options to more likely supported options from the OS. Dreamhost has [a blog post](https://www.dreamhost.com/blog/web-safe-fonts/) outlining some good choices for each family style.
- If you want to learn more about fonts (and basic design), I highly recommend [The Non-Designer's Design Book](https://www.goodreads.com/book/show/22251142-the-non-designer-s-design-book) by Robin P. Williams. Its teachings stand the test of time.
- I mentioned background textures, and if you are looking for some, check out this [helpful gallery](https://www.transparenttextures.com/).
