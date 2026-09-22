# The "/colors.sh: No such file" line in every deploy log

Every Render deploy prints this line during the Tailwind step, and it is
harmless:

```
INFO  tailwindcss: /home/render/common.sh: line 3: /colors.sh: No such file or directory
```

Tailwind reports its version and finishes on the very next lines, the CSS
ships, and the site renders. It is Render's own build noise, not a fault in
this repo, and nothing is degraded. This note explains why, so that the next
genuine error in that log is not mistaken for it. It closes #165, which asked
for exactly this: an explanation rather than a fix.

Findings are tagged the same way as `render-static-site-constraints.md`:

- **Confirmed**: observed directly in this repo's build or logs.
- **Inferred**: not seen directly, but follows from what was observed. The
  reasoning is given so it can be checked.
- **Unknown**: not observable from here. Stated as such rather than guessed.

---

## What produces it

**Confirmed.** The message comes from `/home/render/common.sh`, which lives
outside the project checkout (`/opt/render/project/src`). It is one of Render's
build-image scripts, and it sources a log-coloring helper, `colors.sh`, the same
file another Render user hit when its `tput` call failed. Nothing in this repo
references either file.

**Confirmed.** It appears exactly once per deploy, only on the Tailwind
subprocess's output (prefixed `INFO tailwindcss:`), and it is still present in
the deploy of the current `main` tip. The `npm install` step and this repo's own
`node bin/*.mjs` steps never print it.

**Inferred.** `common.sh` line 3 loads `colors.sh` from a path built out of a
Render environment variable, something close to `. "${SOMEVAR}/colors.sh"`. In a
normal build shell that variable is set, so the path resolves to
`/home/render/colors.sh` and the load is silent. That is why every other step in
`bin/build.sh`, which runs with the full environment, stays quiet. The reasoning:
a second Render user saw the same helper as `/home/render/colors.sh`, the full
path, while we see it collapsed to `/colors.sh`. The difference is a leading path
segment that is present in one environment and empty in the other.

**Confirmed.** The one step that runs with a *restricted* environment is
Tailwind. Hugo runs the Tailwind CLI through its `security.exec.osEnv` sandbox,
which passes only an allowlisted set of environment variables to the subprocess.
The repo sets no `security` config in `hugo.yaml`, so Hugo's default applies:

```
(?i)^((HTTPS?|NO)_PROXY|PATH(EXT)?|APPDATA|TE?MP|TERM|GO\w+|(XDG_CONFIG_)?HOME|USERPROFILE|SSH_AUTH_SOCK|DISPLAY|LANG|SYSTEMDRIVE|PROGRAMDATA)$
```

**Inferred.** The Render variable that locates `colors.sh` is not on that
allowlist, so inside Tailwind's subprocess it is empty. The path collapses to
`/colors.sh`, which does not exist, and Render's script prints the "No such file"
line. Hugo captures the subprocess's stderr and relays it to the deploy log with
the `tailwindcss:` prefix. So the line is a side effect of Hugo's environment
sandbox meeting Render's build scripts, and it is specific to the sandboxed step.

**Unknown.** The exact contents of `common.sh` line 3 and the exact variable it
uses. `common.sh` is on Render's build image, not in a repo we can read, and
Render's old forum (`community.render.com`) now 301-redirects to
`render.discourse.group`, which does not resolve, so those threads are not
reachable as primary sources. This is the same sourcing gap noted in
`render-static-site-constraints.md`.

## Why it is not silently breaking the CSS

**Confirmed.** On the same deploys that print the line, Tailwind reports its
version (`≈ tailwindcss v4.1.8`) and a completion time (`Done in ~250ms`)
immediately after it, the build reaches `live`, and the site renders with its
styles. The line is printed *before* Tailwind's own banner, which fits a shell
that sources `common.sh` at startup and then runs Tailwind normally. A
byte-for-byte diff of the deployed CSS against a local build was not done; the
successful build and the live styled site are the evidence that the CSS is
whole.

## The fix we did not take

There is a repo-side change that would silence the line: widen Hugo's
`security.exec.osEnv` in `hugo.yaml` so the Tailwind subprocess inherits the
Render variable that locates `colors.sh`. It was not taken, for two reasons.

1. It trades away a Hugo security default to remove cosmetic noise. The default
   sandbox stops an exec'd binary from reading the full build environment;
   widening it to quiet a log line is the wrong side of that trade for a
   personal static site.
2. It cannot be verified before it merges. This service has pull-request
   previews off (see the service settings), so the effect on the real Render
   environment is only visible after a change reaches `main` and deploys.

If the line ever needs to go, that is the lever, and the verification is the
next production deploy's log, not a local build.
