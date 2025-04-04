#!/usr/bin/env bash

# This script is used by Render to build the app for production deployment.

# set up an exit on error
set -o errexit

# Save the initial directory
ORIGINAL_DIR="$PWD"

# Install specific version of Hugo
HUGO_VERSION="0.124.1"  # Change this to your required version
echo "Installing Hugo ${HUGO_VERSION}..."

# Create directory for Hugo download
mkdir -p /tmp/hugo
cd /tmp/hugo

# Download and install specific Hugo version
wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz
tar -xzf hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz
mv hugo /usr/local/bin/

# Verify installation
hugo version

# Return to project directory
cd "$ORIGINAL_DIR"

# Now you can add your Hugo build commands here
# For example:
HUGO_ENV=production hugo -v -t zornek
