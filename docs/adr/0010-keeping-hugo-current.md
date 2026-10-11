# Keeping Hugo current

Production's Hugo version is the `HUGO_VERSION` line in `bin/build.sh`, which
Render and the CI Build check both run. A monthly GitHub Actions workflow
(`.github/workflows/hugo-release-check.yaml`) keeps one open `hugo-update` issue
while that pin is behind the latest release. Upgrades follow
`playbook/hugo-upgrade.md` soon after each release, so the gap is normally one
minor release; a gap that has grown anyway is closed in one upgrade, not
stepped through. The laptop is not
pinned. These choices were made after a six-release catch-up, from 0.161 to
0.167 in #232, showed what letting the pin drift costs.

## Considered and rejected

- **Renovate.** It would open the bump PRs itself, with release notes and a CI
  run. But it means installing a third-party GitHub App on the repo and
  maintaining a regex manager for one version string in a shell script. An
  issue that says "a release is out" is enough, because the upgrade still needs
  a human to read the changelog and compare the output.
- **Dependabot.** It cannot track a version string inside a shell script.
- **A `.hugo-version` file.** It would mirror `.node-version`, but no tool reads
  it, so it would only move the pin somewhere `bin/build.sh` would then have to
  read it from.
- **Pinning the laptop** with mise, or warning when the laptop and the pin
  disagree. Either one adds a tool to a one-person site. Homebrew moving the
  laptop ahead is treated as the cue to bump the pin.

## Consequences

- A local build is not proof that production will build. The laptop can run a
  newer Hugo, and a newer Node, than production. Hugo 0.167 needed Node 22.15
  or later, and the laptop's Node 25 hid that until CI failed on the pinned
  `.node-version`. The PR's Build check is the authoritative test.
- Node has one source too. The `NODE_VERSION` variable in the Render dashboard
  was deleted so that `.node-version` alone controls Node for Render and CI
  (#160).
