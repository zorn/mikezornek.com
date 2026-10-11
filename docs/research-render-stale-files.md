# Research: removing stale files from a Render static site

The question: how can a Render static site owner remove files that a previous
deploy published but the current build no longer produces?

This file is **evidence, not a decision.** The decision (if one is made) belongs
in `docs/adr/`.

**Sources accessed 2026-10-11.** Findings are tagged:

- **Documented**: stated in current Render docs, API reference, or changelog,
  with the URL.
- **Folklore**: a community report or a staff reply on the old forum or the
  feedback board. Staff replies are first-party but dated and not docs, so they
  can describe behavior that has since changed. Each carries its date.
- **Unknown**: not documented publicly. Stated as such rather than guessed.

No SEO or blog write-ups are cited as authority.

---

## What this settles

1. **Render's docs do not say that static deploys keep old files.** Nothing in
   the static site, deploys, rollbacks, or Blueprint docs describes publishing
   as additive. The static sites page says the opposite in spirit: each build is
   "fully atomic" and caches are invalidated "immediately". Retention of deleted
   files is described only by Render staff on the forum (2021 and 2022), as a
   deliberate fallback "so that clients that don't have the latest version can
   continue operating properly."
2. **The observed behavior matches that staff description, today.** Re-checked
   with curl on 2026-10-11: three files deleted from the repo are still served
   with HTTP 200 from the origin (`cf-cache-status: MISS`), stamped with the
   previous deploy's time, while the rest of the site carries the new deploy's
   time.
3. **"Clear build cache & deploy" is the only path any Render source names for
   removing the retained files.** A Render staff member said in February 2022
   that it "will clear both your build cache and the cached deleted assets."
   The current deploys doc says only that it refreshes "stale static assets",
   which is consistent but vaguer. It costs one ordinary build. **Confirmed on
   2026-10-11:** after one clear-and-deploy (live at 16:27:37 UTC), the three
   stale files return 404, while the post and its PDF still return 200.
4. **Redirect and rewrite rules cannot shadow a stale file.** The docs are
   explicit: "Render does not apply redirect or rewrite rules to a path if a
   resource exists at that path." Custom headers can only decorate the stale
   response (for example `X-Robots-Tag: noindex`); they do not stop it.
5. **There is no documented API or dashboard purge for static sites.** The API's
   only purge endpoint is for web service edge caching. A feature request for
   selective invalidation (2021) and one for clearing on every deploy (2022)
   are both still `open` on the feedback board.
6. **`docs/render-static-site-constraints.md` §7 is right about the build box
   and silent about served files.** Its "deleted files do not carry over" line
   is about the `public/` directory inside the build environment. It does not
   cover what the CDN origin serves. That section now adds an "Observed" note
   saying so and linking here.

---

## Observation, re-verified 2026-10-11 16:08 UTC

Each request used a random query string to sidestep any Cloudflare cache entry.
Deploy times come from a read-only `list_deploys` call against service
`srv-cjg0q336fquc73a2qhk0`.

| Path                        | Status | `last-modified` | `cf-cache-status` |
| --------------------------- | ------ | --------------- | ----------------- |
| `.../outline/outliner.js`   | 200    | 16:00:18 UTC    | MISS              |
| `.../outline/metadata.xml`  | 200    | 16:00:18 UTC    | MISS              |
| `.../outline/Checked.png`   | 200    | 16:00:18 UTC    | MISS              |
| `.../outline/`              | 404    | 16:03:34 UTC    | BYPASS            |
| `/`                         | 200    | 16:03:34 UTC    | MISS              |
| `/definitely-not-here-xyz/` | 404    | 16:03:34 UTC    | BYPASS            |

`...` is `https://mikezornek.com/posts/2020/5/how-much-does-it-cost-to-build-an-ios-app`.

The deploy history lines up:

- `dep-db5r4nrbc2fs739r63a0`, trigger `manual`, finished 16:00:10 UTC, commit
  `a2d91e7`. This build still produced the `outline/` files.
- `dep-db5r6aqvcj2c73eunjtg`, trigger `new_commit`, finished 16:03:41 UTC,
  commit `546d2ed`, which deleted `content/.../outline/`. Status `live`.

What this shows:

- The stale files come from the origin, not from Cloudflare's edge cache. Every
  response is a MISS, and all responses carry `s-maxage=300`, so an edge copy
  would have expired by the time of the re-check anyway.
- Every file is re-stamped on each deploy. The home page carries the 16:03 time
  even though its content did not change. So the 16:00 stamp on the outline
  files means "last written by the 16:00 deploy and never touched since".
- The 404 page itself comes from the new deploy (16:03 stamp). The origin falls
  back to older deploys' files only for paths the live deploy does not have.
- The API's deploy record does not say whether the 16:00 `manual` deploy was a
  "Clear build cache & deploy". **Unknown.** If it was, then the files survived
  a cache clear on the deploy _before_ the deletion, which is expected: that
  build still produced them.

---

## Q1. Does Render document static publishing as additive?

**Unknown / not documented.** No current Render doc says that a static deploy
keeps files absent from the new publish directory. Pages checked: Static Sites,
Deploys, Rollbacks, Blueprint spec, Redirects and Rewrites, Static Site Headers,
the Hugo and Gatsby quickstarts, and the docs index (`/docs/llms.txt`).

**Documented, and in tension with the observation.** The static sites page:
"each build is fully atomic. As soon as a build succeeds, we deploy it and
_immediately_ invalidate our CDN caches so your users always see the latest
working version of your site."

Source: https://render.com/docs/static-sites

**Documented.** Render stores static site assets per region and serves them
through a global CDN: "Render now builds your static sites and persists their
assets in the same region where you deployed your first non-static Render
service." This is the only changelog entry found about how static assets are
stored. It says nothing about deletion. (April 9, 2024.)

Source:
https://render.com/changelog/static-site-assets-now-built-and-persisted-in-the-same-region-as-other-services

**Documented.** Rollbacks reuse retained build artifacts: "Render retains a
fixed number of recent build artifacts for each service, based on your
workspace plan." A rollback "kicks off a _new_ deploy using the target deploy's
build artifact." That is retention of whole past builds for redeploying. It
does not say that past builds are merged into what is served, so it does not
explain the observation on its own.

Source: https://render.com/docs/rollbacks

**Folklore (Render staff, 2021-01-05).** Forum thread "Deleted files are still
served?", staff member shantanu: "Render holds on to past assets for static
sites so that clients that don't have the latest version can continue operating
properly. In this case, files that were deleted were present in a past deploy
and hence it looked like deleted files were still accessible." On 2021-05-12,
staff member david added: "we're planning to fix this by giving you the ability
to clear out these cached deleted assets with a click. In the meantime, we can
clear them out for you when you run into issues."

Source (archived; the forum was sunset on 2026-03-24 and its URLs now
redirect to a dead host):
https://web.archive.org/web/20220625190834/https://community.render.com/t/deleted-files-are-still-served/399/4

**Folklore (community report, 2021-01-14).** "My static site is still serving
old, deleted content": files from a publish directory the user had stopped
using over a year earlier were still served "as long as a file of the same name
doesn't exist in public", and Google had indexed them. The user said clearing
the build cache did not help. That predates the 2022 staff answer below.

Source:
https://web.archive.org/web/2021/https://community.render.com/t/my-static-site-is-still-serving-old-deleted-content/484

**Documented.** The forum is gone: "The community forum was sunset on March 24,
2026." Discussion moved to Discord, which Render says "is not an official
support channel."

Source: https://render.com/docs/community

---

## Q2. Does "Clear build cache & deploy" affect served files?

**Documented, but vague.** The deploys doc: "Similar to _Deploy latest commit_,
but first clears the service's build cache. This way, the new deploy doesn't
reuse any artifacts generated during a previous build. Use this option to
incorporate changes to your service's build command, or to refresh stale static
assets." It does not say "deleted files".

Source: https://render.com/docs/deploys

**Documented, and more specific (Gatsby quickstart).** "If you remove a file
you'll need to do a manual deploy in the Render Dashboard with the `Clear build
cache & deploy` option to remove the entire build cache." The context is a
user-built `$XDG_CACHE_HOME/public` cache, so this reads as advice about the
build environment, but it is the only doc that ties the option to removed files.

Source: https://render.com/docs/deploy-gatsby

**Folklore (Render staff, 2022-02-15).** Same thread, staff member david: "now
there's actually an easier way to clear out deleted assets. Just click the
'Manual Deploy' dropdown and then 'Clear build cache & deploy'. This will clear
both your build cache and the cached deleted assets that Render holds on to as
a fallback mechanism." A user confirmed on 2022-06-07 that it "works nicely",
and staff said on 2022-06-13 that the option also exists for PR previews.

Source:
https://web.archive.org/web/20220625190834/https://community.render.com/t/deleted-files-are-still-served/399/4

**Documented.** The same action is available through the API: the Trigger
deploy endpoint takes `clearCache: "clear"`.

Source: https://api-docs.render.com/reference/create-deploy

**Unknown.** Whether the 2022 behavior still holds in 2026. No current doc
states it. It is cheap to test: run it once and re-curl the three files.

---

## Q3. Is there a purge or reset path for served files?

**Documented: no static-site purge in the API.** The API reference has one purge
endpoint, `POST /services/{serviceId}/cache/purge`, described as "Trigger cache
purge for the web service if caching is enabled." The Static Sites section of
the API lists only header rules and redirect/rewrite rules.

Sources: https://api-docs.render.com/reference/purge-cache and
https://api-docs.render.com/llms.txt

**Documented.** The dashboard's manual purge is on the web service edge-caching
page and applies to web services: "You can trigger a cache purge for your web
service from its Settings page."

Source: https://render.com/docs/web-service-caching

**Folklore (feature requests, both `open` on 2026-10-11).**

- "Dashboard: Allow inspecting the cache and selective invalidation"
  (2021-01-05): "Render keeps artifacts from previous builds in the cache (in
  case an outdated client is being used). Let us see what's cached and select
  files to invalidate." Source:
  https://feedback.render.com/features/p/dashboard-allow-inspecting-the-cache-and-selective-invalidation
- "Always clear cache for static sites" (2022-11-24) calls the "fully atomic"
  wording "misleading as render will still serve deleted assets" and asks for
  every build to invalidate. Source:
  https://feedback.render.com/features/p/always-clear-cache-for-static-sites

**Folklore (Render staff, 2022-06-22).** Asked about clearing on every deploy:
"We don't yet support this natively ... You could turn off auto-deploys on your
service and instead trigger a 'clear cache & deploy' programmatically with the
API." Source: thread 399, linked above.

**Folklore (Render staff, 2021-05-12).** "we can clear them out for you when you
run into issues." So support is a path, at least historically. Support is
reached from the dashboard's contact link (https://render.com/docs/community).

---

## Q4. Workarounds within our control

### Clear build cache & deploy

- **Stops the file being served?** Yes. The 2022 staff answer said so, and a
  run on 2026-10-11 confirmed it: `outliner.js`, `metadata.xml`, and
  `Checked.png` went from 200 to 404 once the clear-and-deploy went live at
  16:27:37 UTC. No current doc states this outright.
- **Cost.** One build: about 50 seconds of pipeline minutes at today's deploy
  times, plus a slower `npm install` once because root `node_modules` is no
  longer cached. It is a one-off: files deleted by later commits need another
  clear. Automating it means turning off auto-deploy and calling the API with
  `clearCache: "clear"` from CI, which also adds an API key to manage.

### Redirect or rewrite rules (dashboard, API, or `render.yaml` `routes`)

- **Stops the file being served?** No, per the docs. "Render does not apply
  redirect or rewrite rules to a path if a resource exists at that path.
  Instead, Render simply serves the resource at that path." The flowchart on
  the same page checks "Does a resource exist" before any rule.
- **Unknown.** Whether a file retained from an older deploy counts as "a
  resource exists" for this check. The docs do not mention retained files at
  all. A community user (2022-02-15) reported that redirects plus re-enabling
  the site stopped a deleted page. That report is confounded (the site was also
  disabled and re-enabled) and should be treated as folklore.
- **Cost.** Free and reversible, but a rule per path to maintain.

Sources: https://render.com/docs/redirects-rewrites and
https://render.com/docs/blueprint-spec (`routes`)

### Custom response headers

- **Stops the file being served?** No. A header rule only adds a header to the
  response: "The value of the header is sent as-is in the response." A path
  rule such as `/posts/2020/5/how-much-does-it-cost-to-build-an-ios-app/outline/*`
  with `X-Robots-Tag: noindex` would keep the files out of search indexes, but
  they would still return 200.
- **Cost.** Free.

Source: https://render.com/docs/static-site-headers

### Publish a file at the same path

- **Stops the file being served?** It replaces it. The live deploy wins over
  retained files (the 404 page above proves the live deploy is consulted
  first). A tiny placeholder or an HTML meta-refresh would hide the old content,
  but the URL would still return 200.
- **Cost.** Clutter in `static/`, one file per stale path, kept forever.

### Suspend and resume

- **Stops the file being served?** **Unknown / not documented** for static
  sites. The API has Suspend and Resume service endpoints, but no doc describes
  their effect on a static site's stored assets. A community user (2022-02-15)
  reported "I've even disabled the site but the whole site is still rendering."
- **Cost.** Downtime while suspended, if suspend works at all.

Source: https://api-docs.render.com/llms.txt (Suspend service, Resume service)

### Change the publish directory

- **Stops the file being served?** Unknown, and the folklore says no. The 2021
  report above changed the publish directory from `build` to `public`, and the
  old files were still served a year later.
- **Cost.** A build script change for no documented benefit.

Source: https://render.com/docs/blueprint-spec (`staticPublishPath`)

### Delete and recreate the service

- **Stops the file being served?** **Inferred** yes. A new service has no past
  deploys to fall back to. Not documented.
- **Cost.** High. A new `onrender.com` subdomain, so the Cloudflare CNAMEs must
  be repointed, set to "DNS only" while Render verifies the domain and issues
  certificates, then set back to proxied. Plus re-entering build settings,
  environment variables, redirect rules, and header rules, and losing deploy
  history and rollback artifacts. Downtime is likely during the domain move.

Sources: https://render.com/docs/custom-domains and
https://render.com/docs/configure-cloudflare-dns

---

## Q5. What `render-static-site-constraints.md` says, and how to correct it

Section 7 (around line 242) reads: "The same guide notes the `public` directory
is deliberately **not** persisted between builds, so deleted files do not carry
over."

That is accurate for the **build environment**: each build starts with no
`public/` directory, so Hugo cannot inherit a deleted file from an earlier
build. It says nothing about the **served** site, and the observation above
shows that a deleted file does carry over there.

Recommended correction (not applied here): keep the sentence, scope it to the
build box ("deleted files do not carry over into the next build's `public/`"),
and add a sentence that served files are different: Render keeps serving files
from earlier deploys at paths the live deploy does not have, and "Clear build
cache & deploy" is the documented-by-staff way to drop them. Link to this file.
