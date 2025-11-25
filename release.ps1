# Release script for creating Git tags and triggering deployment
# Usage: .\release.ps1 <version>
# Example: .\release.ps1 1.0.6

param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$ErrorActionPreference = "Stop"

$TAG = "v$Version"

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
