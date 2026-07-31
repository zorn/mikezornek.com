#!/usr/bin/env bash

# Tell IndexNow-participating search engines that a URL just changed, so they
# crawl it now instead of waiting to rediscover it from the sitemap. Bing,
# Yandex, Seznam, and Naver share one endpoint; a single call reaches all of
# them. Bing's index also feeds DuckDuckGo, which is most of why this is worth
# running at all.
#
# Run it by hand after a deploy is live, as part of the promotion routine in
# playbook/promotion.md:
#
#   bin/indexnow.sh https://mikezornek.com/posts/2026/7/my-new-post/
#
# Deliberately NOT wired into bin/build.sh. That script runs before Render
# publishes, so a ping from there announces URLs that are not live yet, and
# IndexNow records the failed fetch. build.sh also runs on a fresh checkout with
# no previous public/, so it has no way to know which URLs actually changed and
# would have to ping all ~500 every deploy.
#
# Because pinging a URL that is not live is the specific failure this avoids,
# the script refuses to send anything until it has seen a 200 from every URL.

set -o errexit
set -o nounset
set -o pipefail

readonly HOST="mikezornek.com"
readonly KEY="509ce3a92525b2bfc2bdba120987afa2"
readonly KEY_LOCATION="https://${HOST}/${KEY}.txt"
readonly ENDPOINT="https://api.indexnow.org/indexnow"

if [ "$#" -eq 0 ]; then
  cat >&2 <<USAGE
usage: bin/indexnow.sh <url> [url ...]

Submits one or more https://${HOST}/ URLs to IndexNow.
Every URL must already be live; the script checks before submitting.
USAGE
  exit 64
fi

# Refuse anything that is not one of our own https URLs. IndexNow answers 422
# for a host mismatch, but catching it here gives a clearer message and avoids
# burning a request.
for url in "$@"; do
  case "$url" in
    "https://${HOST}/"*) ;;
    *)
      echo "ERROR: not a https://${HOST}/ URL: ${url}" >&2
      exit 1
      ;;
  esac
done

# The whole reason this is a manual step: confirm the deploy actually landed.
echo "Checking that every URL is live..."
for url in "$@"; do
  status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$url")"
  if [ "$status" != "200" ]; then
    echo "ERROR: ${url} returned ${status}, expected 200." >&2
    echo "If you just pushed, the Render deploy may still be building." >&2
    exit 1
  fi
  echo "  200  ${url}"
done

# Confirm the key file is reachable too. IndexNow fetches it to prove we own the
# domain, and a 403 from the API with no explanation is a miserable thing to
# debug later.
key_status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$KEY_LOCATION")"
if [ "$key_status" != "200" ]; then
  echo "ERROR: key file ${KEY_LOCATION} returned ${key_status}, expected 200." >&2
  exit 1
fi

# Build the urlList array without needing jq, which is not guaranteed present.
url_list=""
for url in "$@"; do
  if [ -n "$url_list" ]; then
    url_list="${url_list},"
  fi
  url_list="${url_list}\"${url}\""
done

payload="{\"host\":\"${HOST}\",\"key\":\"${KEY}\",\"keyLocation\":\"${KEY_LOCATION}\",\"urlList\":[${url_list}]}"

echo "Submitting $# URL(s) to IndexNow..."
response="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 \
  -X POST "$ENDPOINT" \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "$payload")"

case "$response" in
  200) echo "OK (200): submitted." ;;
  202) echo "OK (202): accepted, key validation pending. Normal on first use." ;;
  400) echo "FAILED (400): bad request format." >&2; exit 1 ;;
  403) echo "FAILED (403): key rejected. Check ${KEY_LOCATION} contains exactly the key." >&2; exit 1 ;;
  422) echo "FAILED (422): URLs do not belong to ${HOST}, or key schema mismatch." >&2; exit 1 ;;
  429) echo "FAILED (429): rate limited. Wait before retrying." >&2; exit 1 ;;
  *) echo "FAILED (${response}): unexpected response." >&2; exit 1 ;;
esac
