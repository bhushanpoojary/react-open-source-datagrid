#!/bin/bash

# Release script for creating Git tags and triggering deployment
# Usage: ./release.sh <version>
# Example: ./release.sh 1.0.6

set -e

if [ -z "$1" ]; then
  echo "Error: Version number required"
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh 1.0.6"
  exit 1
fi

VERSION=$1
TAG="v${VERSION}"

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
