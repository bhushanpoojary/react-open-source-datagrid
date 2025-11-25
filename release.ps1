# Release script for creating Git tags and triggering deployment
# Usage: .\release.ps1 [version]
# Example: .\release.ps1 1.0.6
# If no version provided, auto-increments patch version from latest tag

param(
    [Parameter(Mandatory=$false)]
    [string]$Version
)

$ErrorActionPreference = "Stop"

# Get the latest tag
try {
    $LatestTag = git describe --tags --abbrev=0 2>$null
    if (-not $LatestTag) {
        $LatestTag = "v0.0.0"
    }
} catch {
    $LatestTag = "v0.0.0"
}

$LatestVersion = $LatestTag -replace '^v', ''

if (-not $Version) {
    # Auto-increment patch version
    $VersionParts = $LatestVersion -split '\.'
    $Major = [int]$VersionParts[0]
    $Minor = [int]$VersionParts[1]
    $Patch = [int]$VersionParts[2]
    $Patch++
    $Version = "$Major.$Minor.$Patch"
    Write-Host "No version specified. Auto-incrementing from $LatestVersion to $Version" -ForegroundColor Yellow
}

$TAG = "v$Version"

# Check if version already exists on npm
try {
    $NpmVersion = npm view react-open-source-grid@$Version version 2>$null
    if ($NpmVersion) {
        Write-Host "Error: Version $Version already exists on npm" -ForegroundColor Red
        Write-Host "Latest version: $LatestVersion" -ForegroundColor Yellow
        Write-Host "Please use a higher version number" -ForegroundColor Yellow
        exit 1
    }
} catch {
    # Version doesn't exist, continue
}

Write-Host "Creating release $TAG..." -ForegroundColor Cyan

# Check if tag already exists
try {
    git rev-parse $TAG 2>$null
    Write-Host "Error: Tag $TAG already exists" -ForegroundColor Red
    exit 1
} catch {
    # Tag doesn't exist, continue
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "Error: You have uncommitted changes. Please commit or stash them first." -ForegroundColor Red
    exit 1
}

# Create and push tag
Write-Host "Creating tag $TAG..." -ForegroundColor Yellow
git tag -a $TAG -m "Release version $Version"

Write-Host "Pushing tag to origin..." -ForegroundColor Yellow
git push origin $TAG

Write-Host ""
Write-Host "✅ Release $TAG created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "GitHub Actions will now:" -ForegroundColor Cyan
Write-Host "  1. Run all tests (Playwright, Cypress, Lint)"
Write-Host "  2. Build the project"
Write-Host "  3. Publish to npm"
Write-Host "  4. Deploy to GitHub Pages"
Write-Host "  5. Create GitHub Release"
Write-Host ""
Write-Host "Monitor progress at: https://github.com/bhushanpoojary/react-open-source-datagrid/actions" -ForegroundColor Cyan
