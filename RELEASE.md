# Release Process

## Overview

This project uses **Git tags** for version management instead of manually updating `package.json`. When you push a version tag, GitHub Actions automatically:

1. ✅ Runs all tests (Playwright + Cypress)
2. 🔍 Runs linting
3. 🏗️ Builds the project
4. 📦 Publishes to npm
5. 🚀 Deploys to GitHub Pages
6. 📋 Creates GitHub Release with notes

## How to Release

### Option 1: Using the release script (Recommended)

**On Windows (PowerShell):**
```powershell
.\release.ps1 1.0.6
```

**On Linux/Mac:**
```bash
./release.sh 1.0.6
```

The script will:
- Check for uncommitted changes
- Create a Git tag (e.g., `v1.0.6`)
- Push the tag to GitHub
- Trigger the release workflow

### Option 2: Manual Git tag

```bash
# Create an annotated tag
git tag -a v1.0.6 -m "Release version 1.0.6"

# Push the tag
git push origin v1.0.6
```

## Workflow Structure

### 1. **test.yml** - Continuous Testing
- **Triggers:** Push to `main`/`develop`, Pull Requests
- **Runs:** Playwright tests, Cypress tests, Lint, Build
- **Purpose:** Validate every commit

### 2. **ci-cd.yml** - Continuous Deployment (Development)
- **Triggers:** Push to `main`/`develop` (non-tag commits)
- **Runs:** Build, Deploy to npm, Deploy to GitHub Pages
- **Purpose:** Auto-deploy latest changes

### 3. **release.yml** - Production Release
- **Triggers:** Push of version tags (e.g., `v1.0.6`)
- **Runs:** Full test suite → Build → Publish → Deploy → Create Release
- **Purpose:** Official versioned releases

## Version Management

### No more manual package.json updates!

The `package.json` version is **automatically updated** by the release workflow from the Git tag. You never need to manually change it.

### Semantic Versioning

Follow [semver](https://semver.org/) for version numbers:
- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes

## Example Release Flow

```bash
# Make your changes
git add .
git commit -m "feat: add new awesome feature"
git push origin main

# Tests pass on GitHub Actions ✅

# Ready to release?
.\release.ps1 1.1.0

# GitHub Actions automatically:
# - Tests everything
# - Builds the project
# - Updates package.json to 1.1.0
# - Publishes to npm as v1.1.0
# - Deploys to GitHub Pages
# - Creates GitHub Release v1.1.0
```

## Monitoring Releases

View release progress:
- **Actions:** https://github.com/bhushanpoojary/react-open-source-datagrid/actions
- **Releases:** https://github.com/bhushanpoojary/react-open-source-datagrid/releases
- **npm:** https://www.npmjs.com/package/react-open-source-grid

## Troubleshooting

### Tag already exists
```bash
# Delete local tag
git tag -d v1.0.6

# Delete remote tag
git push origin --delete v1.0.6

# Create it again
.\release.ps1 1.0.6
```

### Release failed
- Check GitHub Actions logs
- Fix the issue
- Delete the failed tag (see above)
- Create a new patch version

### Rollback
```bash
# Publish previous version to npm
npm publish --tag latest v1.0.5
```
