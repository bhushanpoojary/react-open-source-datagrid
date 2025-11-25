#!/bin/bash

# Release script for creating Git tags and triggering deployment
# Usage: ./release.sh [version]
# Example: ./release.sh 1.0.6
# If no version provided, auto-increments patch version from latest tag

set -e

# Get the latest tag
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
LATEST_VERSION=${LATEST_TAG#v}

if [ -z "$1" ]; then
  # Auto-increment patch version
  IFS='.' read -r -a VERSION_PARTS <<< "$LATEST_VERSION"
  MAJOR=${VERSION_PARTS[0]}
  MINOR=${VERSION_PARTS[1]}
  PATCH=${VERSION_PARTS[2]}
  PATCH=$((PATCH + 1))
  VERSION="$MAJOR.$MINOR.$PATCH"
  echo "No version specified. Auto-incrementing from $LATEST_VERSION to $VERSION"
else
  VERSION=$1
fi

TAG="v${VERSION}"

# Check if version already exists on npm
if npm view react-open-source-grid@${VERSION} version 2>/dev/null; then
  echo "Error: Version ${VERSION} already exists on npm"
  echo "Latest version: ${LATEST_VERSION}"
  echo "Please use a higher version number"
  exit 1
fi

echo "Creating release ${TAG}..."

# Check if tag already exists
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Error: Tag ${TAG} already exists"
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "Error: You have uncommitted changes. Please commit or stash them first."
  exit 1
fi

# Create and push tag
echo "Creating tag ${TAG}..."
git tag -a "$TAG" -m "Release version ${VERSION}"

echo "Pushing tag to origin..."
git push origin "$TAG"

echo ""
echo "✅ Release ${TAG} created successfully!"
echo "GitHub Actions will now:"
echo "  1. Run all tests (Playwright, Cypress, Lint)"
echo "  2. Build the project"
echo "  3. Publish to npm"
echo "  4. Deploy to GitHub Pages"
echo "  5. Create GitHub Release"
echo ""
echo "Monitor progress at: https://github.com/bhushanpoojary/react-open-source-datagrid/actions"
