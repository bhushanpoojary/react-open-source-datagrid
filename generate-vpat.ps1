#!/usr/bin/env pwsh
# Automated VPAT PDF Generator

$mdFile = "docs\ACCESSIBILITY_VPAT.md"
$tempPdf = "docs\ACCESSIBILITY_VPAT.pdf"
$finalPdf = "docs\VPAT-2.4-ReactDataGrid.pdf"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "VPAT PDF Generator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if markdown file exists
if (-not (Test-Path $mdFile)) {
    Write-Host "❌ Error: $mdFile not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found VPAT markdown file" -ForegroundColor Green
Write-Host "📄 Source: $mdFile" -ForegroundColor Gray
Write-Host ""

# Check if extension is installed
$extensionList = code --list-extensions
$extensionInstalled = $extensionList | Select-String "yzane.markdown-pdf"
if (-not $extensionInstalled) {
    Write-Host "📦 Installing Markdown PDF extension..." -ForegroundColor Yellow
    code --install-extension yzane.markdown-pdf
    Write-Host "✅ Extension installed" -ForegroundColor Green
    Write-Host ""
}

# Open file in VS Code
Write-Host "🚀 Opening file in VS Code..." -ForegroundColor Cyan
Start-Process code -ArgumentList $mdFile

Write-Host ""
Write-Host "================================" -ForegroundColor Yellow
Write-Host "MANUAL STEPS (Do this now):" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host "1. In VS Code, press: F1 (or Ctrl+Shift+P)" -ForegroundColor White
Write-Host "2. Type: Markdown PDF: Export (pdf)" -ForegroundColor White
Write-Host "3. Press: Enter" -ForegroundColor White
Write-Host "4. Wait for 'success' notification" -ForegroundColor White
Write-Host ""
Write-Host "Then press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "🔍 Checking for generated PDF..." -ForegroundColor Cyan

# Wait a moment for file system to update
Start-Sleep -Seconds 1

# Check if PDF was generated
if (Test-Path $tempPdf) {
    Write-Host "✅ Found generated PDF!" -ForegroundColor Green
    Write-Host ""
    
    # Remove old final PDF if exists
    if (Test-Path $finalPdf) {
        Remove-Item $finalPdf -Force
        Write-Host "🗑️  Removed old PDF" -ForegroundColor Gray
    }
    
    # Rename to final name
    Rename-Item $tempPdf $finalPdf
    
    $fileInfo = Get-Item $finalPdf
    $fileSizeKB = [math]::Round($fileInfo.Length / 1KB, 2)
    
    Write-Host "✅ PDF renamed successfully!" -ForegroundColor Green
    Write-Host "📁 Location: $finalPdf" -ForegroundColor Cyan
    Write-Host "📊 File size: $fileSizeKB KB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "🎉 SUCCESS!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your VPAT PDF is ready for distribution." -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Open the PDF to verify it looks good" -ForegroundColor White
    Write-Host "2. Test the download link on your demo page" -ForegroundColor White
    Write-Host "3. Commit the PDF to git" -ForegroundColor White
    Write-Host ""
    
    # Ask if user wants to open the PDF
    Write-Host "Open the PDF now? (Y/N): " -ForegroundColor Cyan -NoNewline
    $response = Read-Host
    if ($response -eq 'Y' -or $response -eq 'y') {
        Start-Process $finalPdf
    }
    
} 
else {
    Write-Host "❌ PDF not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "• PDF export command not executed" -ForegroundColor White
    Write-Host "• Export failed (check VS Code notifications)" -ForegroundColor White
    Write-Host "• File saved to different location" -ForegroundColor White
    Write-Host ""
    Write-Host "Try again or use alternative method:" -ForegroundColor Yellow
    Write-Host "Ctrl+Shift+V (preview) → Right-click → Open in Browser → Ctrl+P → Save as PDF" -ForegroundColor White
    Write-Host ""
}
