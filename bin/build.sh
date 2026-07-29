#!/usr/bin/env bash

# This script is used by Render to build the app for production deployment.

# set up an exit on error
set -o errexit

# Save the initial directory
ORIGINAL_DIR="$PWD"

# Install npm dependencies
echo "Installing npm dependencies..."
npm install --verbose

# Install specific version of Hugo.
# When bumping HUGO_VERSION, run `hugo --logLevel info` locally first to
# surface any new deprecations before they become hard errors.
HUGO_VERSION="0.161.1"
echo "Installing Hugo ${HUGO_VERSION}..."

# Create directory for Hugo download and installation
mkdir -p "${HOME}/bin"
mkdir -p /tmp/hugo
cd /tmp/hugo

# Download and install specific Hugo version
wget -q https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz
tar -xzf hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz

# Move Hugo to a directory you have permission for
mv hugo "${HOME}/bin/"

# Add the bin directory to PATH
export PATH="${HOME}/bin:${PATH}"

# Verify installation
hugo version

# Return to project directory
cd "$ORIGINAL_DIR"

# Guard against dev-server URLs shipping to production. A link pasted from
# `hugo server` is broken for every visitor, so fail the build instead.
echo "Checking for dev-server URLs..."
if grep -rn -E 'https?://(localhost|127\.0\.0\.1):1313' content static themes data; then
  echo "ERROR: found dev-server URL(s) above. Use a root-relative link instead."
  exit 1
fi

# Now you can add your Hugo build commands here
#
# `--cleanDestinationDir` removes anything in public/ that this build did not
# produce. Render and CI always start from a fresh checkout so it changes
# nothing there, but locally public/ accumulates: draft posts rendered by a past
# `hugo server`, pages whose source has since been deleted. Those stale files
# carry dev-server URLs and archetype placeholder text, and they make the
# verification step below report failures that do not exist in a real build.
hugo --logLevel info --cleanDestinationDir

# Draw the social card for every page that does not supply an image of its own.
# Reads the work list Hugo just wrote to public/og-manifest.json and writes PNGs
# at the exact paths those pages advertise in their og:image tags.
#
# This regenerates every card on every deploy. Cards are a pure function of a
# page's title, description, and the design, so there is nothing to lose by
# rebuilding, and it means an edited title can never ship a stale card. The step
# prints its own duration because Render meters build minutes: see
# docs/render-static-site-constraints.md.
echo "Generating social cards..."
node bin/og-images.mjs

# Fail the build if any page advertises a social image that is not there. A card
# that 404s is a broken share, which is the whole condition this work removes,
# and it is invisible without a check like this: `images` front matter is a
# plain string that Hugo runs absURL over without confirming a file exists. Three
# posts had shipped broken paths this way before the check existed. See #159.
echo "Verifying social images..."
node bin/verify-og-images.mjs
