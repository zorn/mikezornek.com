# Render Static Site Constraints (Hobby workspace)

Research note, 2026-07-29. The question behind it: this site is a Hugo static
site deployed on Render from `bin/build.sh`, and we are considering adding a
Node step to that script that generates roughly 500 PNG files (roughly 50 to 75
MB total) into the publish directory on every build, using `@takumi-rs/core` (an
N-API Rust native addon that ships prebuilt platform binaries).

Everything below comes from Render's own documentation, pricing, and changelog.
No third-party write-ups were used. Each finding is tagged:

- **Documented**: Render states it, with the URL.
- **Inferred**: not stated for this exact case, but follows from adjacent
  documented facts. The reasoning is given so it can be checked.
- **Unknown**: not documented publicly. Stated as such rather than guessed.

One sourcing note up front: Render's community forum (`community.render.com`)
now 301-redirects to `render.discourse.group`, which does not resolve. So the
old forum threads are not reachable as primary sources, and several gaps below
stay gaps for that reason.

---

## 1. Build minutes

**Documented.** A Hobby workspace gets **500 pipeline minutes per month** on the
Starter pipeline tier. Pro gets 1,000, Scale gets 5,000. The Performance tier
carries no included minutes at all.

Source: https://render.com/docs/build-pipeline
Also stated on https://render.com/docs/new-workspace-plans as "500/month" for
Hobby.

**Documented.** Minutes are consumed while builds and pre-deploy tasks run, and
they are tier-specific: Starter minutes and Performance minutes are not
interchangeable.

Source: https://render.com/docs/build-pipeline

**Documented.** Static site builds are metered exactly like other service
builds. Static sites are free to deploy, but "Static sites count against your
workspace's monthly included amounts of outbound bandwidth and pipeline
minutes."

Sources: https://render.com/docs/static-sites and https://render.com/docs/free

**Documented.** On exhaustion, Render automatically buys a supplementary amount
of minutes. That does not happen if the workspace has hit a spend limit or has
no payment method on file, and in that case "Render stops running pipeline tasks
(including service builds!)" for the rest of the month. The free-tier page says
the same thing from the other direction: new builds are disabled for the
workspace for the remainder of the month, and services keep running on whatever
build artifact is already live.

So on a Hobby workspace with no card attached, the failure mode is builds
blocked, not charges and not throttling. With a card attached, it is charges.

Sources: https://render.com/docs/build-pipeline and https://render.com/docs/free

---

## 2. Build machine specs

**Documented.** The Starter pipeline tier is **2 CPU and 8 GB RAM**. It is the
default for all plans. The Performance tier (16 CPU, 64 GB RAM) requires Pro or
higher, so it is not reachable from a Hobby workspace.

Source: https://render.com/docs/build-pipeline

**Documented.** Build limits, all from the same page:

- Build command timeout: **120 minutes**.
- Pre-deploy command timeout: 30 minutes.
- Disk space usage during a build: **16 GB**. Exceeding it cancels the build.
- Exceeding the pipeline tier's memory limit cancels the build.
- One active build per service at a time.
- Builds have no access to the running service instance's resources.

Source: https://render.com/docs/build-pipeline

**Inferred.** That static site builds run on the Starter tier at 2 CPU / 8 GB.
Render does not call out static sites specifically in the pipeline tier section,
but it says Starter is the default tier for all plans, says Performance needs Pro
or higher, and says static site builds consume pipeline minutes. There is no
documented third option.

---

## 3. Build image OS, architecture, libc

**Documented, partially.** Render says it "periodically updates the underlying
version of Debian used by all native runtimes," and that minimum supported
language versions track **Debian 12.x ("bookworm")**.

Source: https://render.com/docs/language-support

**Unknown.** The exact base image URI, the pinned Debian point release, and the
glibc version are **not documented publicly**. Render names Debian 12 as the
reference point for language support, not as a published image tag.

**Inferred (strong).** The build container is **x86_64 / amd64**. Render's own
docs require prebuilt Docker images to be `linux/amd64`: "The Docker image must
be built for the `linux/amd64` platform." No arm64 option is offered anywhere in
the service docs. Render does not state the architecture of the _build_ machine
directly, so this is inference, not a citation, but there is no documented arm64
path on the platform at all.

Source for the amd64 requirement: https://render.com/docs/deploy-an-image

**Inferred (strong).** libc is **glibc**, not musl. Debian 12 is a glibc
distribution. Render never mentions Alpine or musl for native runtimes.

**Practical consequence.** `@takumi-rs/core` publishes
`@takumi-rs/core-linux-x64-gnu` as an optional dependency, and that package's own
registry metadata declares `cpu: ["x64"]`, `os: ["linux"]`, `libc: ["glibc"]`.
That is the artifact npm should resolve on a Debian 12 amd64 build box, so the
addon should install prebuilt rather than compile.

This matters because there is **no Rust toolchain in Render's preinstalled tool
list**. The list (see section 4) includes `gcc`, `g++`, and `make`, but no
`cargo` and no `rustc`. If the prebuilt binary ever fails to resolve, the
fallback build-from-source path has nothing to build with, and the build fails
rather than degrading.

Source for the tool list: https://render.com/docs/native-runtimes

---

## 4. Node and npm availability, and version pinning

**Documented.** `node`, `npm`, `yarn`, `pnpm`, `bun`, and `typescript` are all in
Render's preinstalled tools list for native builds and deploys, alongside `gcc`,
`g++`, `make`, `git`, `wget`, `curl`, `libvips-dev`, `libvips-tools`,
`imagemagick`, and `ffmpeg`.

Source: https://render.com/docs/native-runtimes

**Documented.** Render automatically detects and installs a static site's
dependencies by default, and `SKIP_INSTALL_DEPS=true` opts out so the build
command can do it instead. That is a static-site-specific statement, and it only
makes sense if npm is present in the static site build image.

Source: https://render.com/docs/static-sites

**Inferred.** That the static site build image is the same image described on
the native runtimes page. The native runtimes page frames itself around service
runtimes and lists static sites as a separate service type, so it does not say
this in so many words. The evidence for it: the static sites page documents npm
dependency installation, the Hugo and Gatsby and Next.js quickstarts all use npm
build commands on static sites, and `bin/build.sh` already runs `npm install`
and `wget` successfully on this very site today.

**Documented.** The default Node version is **24.14.1** for services created on
or after 2026-04-21. Services created earlier keep the default from their
creation date.

Source: https://render.com/docs/node-version

**Documented.** All four pinning mechanisms are supported, in this precedence
order:

1. `NODE_VERSION` environment variable (set in the Render dashboard)
2. `.node-version` file at the repo root
3. `.nvmrc` file at the repo root
4. `engines` field in `package.json`

Values may be a semver version (`18.18.0`) or an alias (`lts`), resolved through
the `node-version-alias` module. Render explicitly warns to "Always include an
upper bound in your version range" when using `engines`, because an unbounded
range like `>=20` resolves to the newest Node release.

Source: https://render.com/docs/node-version

**Unknown.** Whether these pinning mechanisms are honored on **static sites**
specifically. The node-version page never mentions static sites. The mechanisms
are documented at the service level, and `NODE_VERSION` is a plain environment
variable, so it very likely applies, but Render does not say so. Treat a pin as
something to verify in a build log rather than assume.

---

## 5. Published output size and file count

**Unknown.** **Not documented publicly.** Render publishes no limit on the total
size of a static site's publish directory and no limit on the number of files in
it. The static sites page, the free tier page, the pricing page, the FAQ, and the
build pipeline page were all checked and none of them state one.

Sources checked: https://render.com/docs/static-sites,
https://render.com/docs/free, https://render.com/pricing,
https://render.com/docs/faq, https://render.com/docs/build-pipeline

The nearest documented ceiling is not a publish-directory limit at all: it is the
**16 GB build disk limit**, which the whole checkout plus `node_modules` plus the
Hugo binary plus the generated output has to fit inside.

Source: https://render.com/docs/build-pipeline

Older community threads on this topic exist by title but are unreachable, since
the forum host no longer resolves. So there is no staff answer to cite either.

---

## 6. Bandwidth

**Documented.** A Hobby workspace includes **5 GB of outbound bandwidth per
month**. Pro includes 25 GB, Scale includes 1 TB.

Sources: https://render.com/docs/outbound-bandwidth and
https://render.com/docs/new-workspace-plans (the latter phrases it as "5 GB
included ($0.15 for each additional GB)" and notes this was reduced from the
previous 100 GB).

**Documented.** What counts: HTTP responses sent from web services and static
sites to clients over the public internet, WebSocket responses, service-initiated
outbound traffic, database query responses leaving Render, and private link
traffic at reduced rates. What does not count: inbound traffic, internal private
network traffic, same-region traffic to S3 or Google Cloud Storage, and
observability log and metric streams.

Source: https://render.com/docs/outbound-bandwidth

**Documented.** Overage is **$0.15 per additional GB**.

Source: https://render.com/docs/new-workspace-plans

**Documented.** On overage with a payment method on file, Render bills for each
additional GB. Without one, the outbound bandwidth page says Render "spins down
your workspace's services until the start of the next month," and the free tier
page says Render "suspends all of your Free services for the remainder of the
month." So the answer is: charged if a card is on file, suspended if not. Not
throttled.

Sources: https://render.com/docs/outbound-bandwidth and
https://render.com/docs/free

---

## 7. Build cache and persistence between builds

**Documented.** Every build starts fresh. Render's Gatsby guide states it
directly: "Render starts each build in a fresh environment, and only cache the
`.cache` directory." The same guide notes the `public` directory is deliberately
**not** persisted between builds, so deleted files do not carry over.

Source: https://render.com/docs/deploy-gatsby

**Documented.** Render caches well-known paths for the native language
environments (root-level `node_modules` for Node) and nothing else. From Render
staff on their own feedback site: "Render already caches well known paths for all
native language environments. No other directories are cached."

Source:
https://feedback.render.com/features/p/specify-additional-directories-to-cache-after-build

**Documented.** There is one general-purpose escape hatch: Render persists the
directory named by `$XDG_CACHE_HOME` between builds. The Next.js guide says
Render services "do not persist" `.next/cache` by default, but that Render "does
persist the directory specified by `$XDG_CACHE_HOME` between builds," and shows a
copy-out/copy-in build script pattern around it.

Source: https://render.com/docs/deploy-nextjs-app

**Documented.** The cache can be discarded on demand with "Clear build cache &
deploy" in the dashboard, recommended when the build command changes or static
assets go stale.

Source: https://render.com/docs/deploys

**Unknown.** The size limit on the build cache, how long it is retained when a
service sits idle, and whether `$XDG_CACHE_HOME` is set on static site builds
specifically. `XDG_CACHE_HOME` is not in the default environment variables
reference, so its value is documented only by example in the Next.js guide.

Source checked: https://render.com/docs/environment-variables

---

## What this means for build-time image generation

**Verdict: viable on the Hobby plan, with one real risk and one soft ceiling.**

The generation step itself fits comfortably:

- 2 CPU and 8 GB RAM is enough to render 500 PNGs with a native Rust addon.
- 50 to 75 MB of output against a 16 GB build disk is not close to a limit.
- The 120-minute build timeout is not close either, unless generation somehow
  averages more than 14 seconds per image.
- There is no documented publish-directory size or file-count limit to breach,
  and 500 extra files is a small delta on a site that already publishes 519
  pages.
- `@takumi-rs/core` publishes a `linux-x64-gnu` prebuild whose declared
  `cpu`/`os`/`libc` match a Debian 12 amd64 glibc build box, so it should install
  prebuilt rather than compile.

The specific risk to name: **there is no Rust toolchain in the build image.**
Render's preinstalled tool list has `gcc`, `g++`, and `make` but no `cargo` and
no `rustc`. If npm ever fails to resolve the prebuilt platform package (an
`--omit=optional` flag creeping into the install, a lockfile that pinned the
wrong platform package, a future release that drops or renames the glibc x64
artifact, or a Render base-image move to a glibc newer than the prebuild
targets), there is no source-build fallback. The build does not degrade, it
fails, and it fails at the point where the site can no longer deploy at all. That
argues for pinning the `@takumi-rs/core` version rather than floating it, and for
treating a version bump as something to watch a build log through.

The second constraint is arithmetic, not a limit: **500 minutes of build time per
month**. Every deploy regenerates all 500 PNGs from scratch, because the publish
directory does not survive between builds and only root `node_modules` is cached.
Current builds run npm install, download Hugo over the network, and run Hugo. Say
they land near 2 minutes. Adding a step that costs N minutes per build means the
monthly budget is roughly `500 / (2 + N)` deploys. At 1 extra minute, that is
about 165 deploys a month, fine. At 5 extra minutes, about 70. At 15 extra
minutes, about 29, which starts to bite on a blog where a typo fix is a deploy.
Measure the step locally before committing to it. If it is slow, the documented
fix is to stash the generated PNGs under `$XDG_CACHE_HOME` and regenerate only
what changed, which is the same pattern Render documents for `.next/cache`.

Worth knowing about the downside: with no payment method on the workspace,
running out of pipeline minutes blocks new builds for the rest of the month while
the last successful deploy keeps serving. That is a survivable failure mode, but
it means a mid-month blowout freezes publishing until the first of the month.

The bandwidth line is separate and is the one worth watching independently of
this feature. Hobby includes 5 GB per month, and Render cut that from 100 GB. If
these PNGs are Open Graph images that get fetched by social crawlers and shown in
timelines, they are new outbound bytes on a small allowance. 75 MB of assets does
not have to be requested many times to matter against 5 GB. Overage is $0.15/GB
with a card on file, and suspension without one.
