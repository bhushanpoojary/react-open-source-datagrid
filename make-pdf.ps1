# Simple VPAT PDF Generator
Write-Host "VPAT PDF Generator" -ForegroundColor Cyan
Write-Host ""

$md = "docs\ACCESSIBILITY_VPAT.md"
$tempPdf = "docs\ACCESSIBILITY_VPAT.pdf"
$finalPdf = "docs\VPAT-2.4-ReactDataGrid.pdf"

if (-not (Test-Path $md)) {
    Write-Host "Error: $md not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Opening file in VS Code..." -ForegroundColor Green
code $md

Write-Host ""
Write-Host "MANUAL STEPS:" -ForegroundColor Yellow
Write-Host "1. Press F1 in VS Code"
Write-Host "2. Type: Markdown PDF: Export (pdf)"
Write-Host "3. Press Enter"
Write-Host "4. Wait for success message"
Write-Host ""
Read-Host "Press Enter when done"

if (Test-Path $tempPdf) {
    if (Test-Path $finalPdf) { Remove-Item $finalPdf -Force }
    Rename-Item $tempPdf $finalPdf
    Write-Host ""
    Write-Host "SUCCESS! PDF created: $finalPdf" -ForegroundColor Green
    Start-Process $finalPdf
} else {
    Write-Host ""
    Write-Host "PDF not found. Please try again." -ForegroundColor Red
}
