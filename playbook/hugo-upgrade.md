# Upgrading Hugo

How to move the site to a newer Hugo release. Do it one minor release at a time, soon after each one ships: one short changelog to read and one small output diff to check is cheaper than catching up on six at once, which is what the 0.161 to 0.167 upgrade in #232 cost.

## When

The "Hugo release check" workflow runs on the 1st of each month. When `bin/build.sh` pins an older Hugo than the latest release, it keeps one open issue, labeled `hugo-update`, listing every newer release. Upgrading closes that issue: put `Closes #<n>` in the upgrade PR, or let the next monthly run close it. To check right now, run the workflow by hand from the Actions tab.

## Where the version lives

Production's Hugo version is the `HUGO_VERSION` line in `bin/build.sh`. Render and the CI Build check both run that script, so they always agree. The laptop runs whatever Homebrew installed and is allowed to drift ahead; a newer laptop Hugo is the cue to bump the pin.

Node is pinned in `.node-version`, which Render and CI both read. Render's dashboard has no `NODE_VERSION` variable, on purpose: it would override the file (see #160).

## Steps

1. **Read the release notes** for every release between the pin and the target, patch releases included. Look for breaking changes, deprecations, and new security defaults, then search `themes/reborn/`, `hugo.yaml`, and `bin/` for anything they name.
2. **Build with the pinned version first**, so there is something to compare against. The laptop may have drifted ahead of the pin, and a baseline built on the wrong Hugo hides exactly the changes this step exists to catch. So check `hugo version` against `HUGO_VERSION` in `bin/build.sh`. If they match, build with it:

   ```bash
   hugo --logLevel info --cleanDestinationDir -d /tmp/hugo-before
   ```

   If they differ, fetch the pinned release into a scratch directory, check it, and build with that binary instead. Releases from 0.161 on ship macOS only as a `.pkg`, which `pkgutil` unpacks without installing anything. Run these in bash or zsh, not fish:

   ```bash
   PIN=$(sed -n 's/^HUGO_VERSION="\(.*\)"$/\1/p' bin/build.sh)
   gh release download "v$PIN" -R gohugoio/hugo -D /tmp/hugo-pin \
     -p "hugo_extended_${PIN}_darwin-universal.pkg" -p "hugo_${PIN}_checksums.txt"
   (cd /tmp/hugo-pin && grep "hugo_extended_${PIN}_darwin-universal.pkg" "hugo_${PIN}_checksums.txt" | shasum -a 256 -c)
   pkgutil --expand-full "/tmp/hugo-pin/hugo_extended_${PIN}_darwin-universal.pkg" /tmp/hugo-pin/pkg
   /tmp/hugo-pin/pkg/Payload/hugo --logLevel info --cleanDestinationDir -d /tmp/hugo-before
   ```

3. **Upgrade the laptop** with `brew upgrade hugo`. Hugo ships macOS only as `.pkg` installers now, not tarballs, so Homebrew is the easy path.
4. **Build with the new version** and fix any errors. `--logLevel info` surfaces deprecation warnings before they turn into errors in a later release.

   ```bash
   hugo --logLevel info --cleanDestinationDir -d /tmp/hugo-after
   ```

5. **Compare the output.** Files that differ only in whitespace are usually Hugo reformatting its embedded templates, and the generator tag always changes. Anything else deserves a look.

   ```bash
   diff -rqw /tmp/hugo-before /tmp/hugo-after
   ```

6. **Bump `HUGO_VERSION` in `bin/build.sh`** and open a PR.
7. **Trust CI over the laptop for Node.** A Hugo release can raise the Node version it needs without saying so in its notes. Hugo 0.167 needed Node 22.15 or later, and the laptop's newer Node hid that. The PR's Build check runs on `.node-version`, so if it fails inside a Node tool such as Tailwind, bump `.node-version` in the same PR.
8. **After merging, check the deploy log** for the new `hugo v…` line and the `Using Node.js version … via .node-version` line.

## If the upgrade removes files from the output

A deploy does not take down files the new build stopped producing: Render keeps serving them from the previous deploy. If the output diff shows removed files that must actually go offline, run **Manual Deploy → Clear build cache & deploy** once after merging. The evidence is in `docs/research-render-stale-files.md`.
