# Running Lighthouse by hand

How to audit this site's performance with Lighthouse when I want the numbers.

This used to run in CI on every push and pull request. It was noise more than signal: the budgets rarely moved, a flaky run would post a red check on a content-only change, and I never made a decision off the report. So the workflow is gone and the check is a deliberate, occasional one I run myself. The tuned budget it checked against still lives next to this file as `budget.json`, so nothing about the thresholds was lost.

## Quick check: PageSpeed Insights

Lighthouse only runs on Chromium, so Firefox has no built-in Lighthouse panel. PageSpeed Insights runs the same audit in the cloud, which makes it the fastest "am I still okay?" pass from any browser and needs no install.

1. Open <https://pagespeed.web.dev/> and enter the live URL.
2. Run it and read the Performance score and the Core Web Vitals.

This audits a public URL, so it cannot reach a local `hugo server` build. For a local run, use the CLI below.

There is a [Lighthouse Firefox add-on](https://addons.mozilla.org/firefox/addon/google-lighthouse/) that runs this from a toolbar button instead of the website, but it calls the same PageSpeed Insights service, so it carries the same public-URL limit and does nothing the website does not.

## Real pass/fail: the CLI

To reproduce what CI did (the same two URLs, checked against the same budget), run Lighthouse from the command line against `playbook/budget.json`:

```bash
npx lighthouse https://mikezornek.com/ \
  --budget-path=playbook/budget.json \
  --only-categories=performance \
  --chrome-flags="--headless" \
  --view

npx lighthouse https://mikezornek.com/posts/ \
  --budget-path=playbook/budget.json \
  --only-categories=performance \
  --chrome-flags="--headless" \
  --view
```

The CLI launches its own headless Chromium to run the audit, so a Chrome or Chromium build has to be installed even though you browse with Firefox. `--view` opens the HTML report in your default browser when the run finishes; drop it for a headless-only run. The budget's `path: "/*"` applies the thresholds to whatever URL you point at, so these two commands are a starting set, not a fixed list. Audit any page the same way.

## The budget

`playbook/budget.json` holds the thresholds, in the [Lighthouse budget format](https://github.com/GoogleChrome/lighthouse/blob/main/docs/performance-budgets.md): 200KB total page weight (50KB script, 100KB image), 50 total requests, and timing limits of FCP 1800ms, LCP 2000ms, CLS 0.1, TBT 200ms, and speed-index 1800ms. Edit that file to retune, and the CLI commands above pick up the change on the next run.
