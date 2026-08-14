# Running Lighthouse by hand

How to audit this site's performance with Lighthouse when I want the numbers.

This used to run in CI on every push and pull request. It was noise more than signal: the budgets rarely moved, a flaky run would post a red check on a content-only change, and I never made a decision off the report. So the workflow is gone and the check is a deliberate, occasional one I run myself. The tuned budget it checked against still lives next to this file as `budget.json`, so nothing about the thresholds was lost.

## Quick check: Chrome DevTools

For an "am I still okay?" pass, this is the fastest path and needs no install.

1. Open the page in Chrome (the live site, or `hugo server` locally).
2. Open DevTools, then the **Lighthouse** panel.
3. Pick **Performance** (add the others if you care), choose **Navigation** mode, and **Analyze page load**.
4. Read the score and the metrics. Run it against an incognito window or the local build so extensions don't skew the result.

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

`--view` opens the HTML report in a browser when the run finishes; drop it for a headless-only run. The budget's `path: "/*"` applies the thresholds to whatever URL you point at, so these two commands are a starting set, not a fixed list. Audit any page the same way.

## The budget

`playbook/budget.json` holds the thresholds, in the [Lighthouse budget format](https://github.com/GoogleChrome/lighthouse/blob/main/docs/performance-budgets.md): 200KB total page weight (50KB script, 100KB image), 50 total requests, and timing limits of FCP 1800ms, LCP 2000ms, CLS 0.1, TBT 200ms, and speed-index 1800ms. Edit that file to retune, and the CLI commands above pick up the change on the next run.
