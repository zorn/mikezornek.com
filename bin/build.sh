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
hugo --logLevel info
