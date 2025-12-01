# Quick VPAT PDF Generation Script
# This script helps you convert the VPAT markdown to PDF

Write-Host "================================" -ForegroundColor Cyan
Write-Host "VPAT PDF Generation Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$vpatMd = "docs\ACCESSIBILITY_VPAT.md"
$vpatPdf = "docs\VPAT-2.4-ReactDataGrid.pdf"

# Check if markdown file exists
if (-not (Test-Path $vpatMd)) {
    Write-Host "❌ Error: $vpatMd not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found VPAT markdown file" -ForegroundColor Green
Write-Host ""
Write-Host "Choose your PDF generation method:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. VS Code Extension (Recommended - Best Quality)" -ForegroundColor White
Write-Host "   - Install: yzane.markdown-pdf" -ForegroundColor Gray
Write-Host "   - Then: F1 → 'Markdown PDF: Export (pdf)'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Pandoc (Advanced - Requires Installation)" -ForegroundColor White
Write-Host "   - Requires: pandoc + wkhtmltopdf" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Chrome/Edge Print (Simple - Good Quality)" -ForegroundColor White
Write-Host "   - Open in browser → Ctrl+P → Save as PDF" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Opening VS Code Extension Marketplace..." -ForegroundColor Cyan
        code --install-extension yzane.markdown-pdf
        Write-Host ""
        Write-Host "📝 Next Steps:" -ForegroundColor Yellow
        Write-Host "1. Restart VS Code if needed" -ForegroundColor White
        Write-Host "2. Open: $vpatMd" -ForegroundColor White
        Write-Host "3. Press F1 or Ctrl+Shift+P" -ForegroundColor White
        Write-Host "4. Type: 'Markdown PDF: Export (pdf)'" -ForegroundColor White
        Write-Host "5. The PDF will be created in the same folder" -ForegroundColor White
        Write-Host "6. Rename it to: $vpatPdf" -ForegroundColor White
    }
    
    "2" {
        Write-Host ""
        # Check if pandoc is installed
        $pandocInstalled = $null -ne (Get-Command pandoc -ErrorAction SilentlyContinue)
        
        if (-not $pandocInstalled) {
            Write-Host "Installing Pandoc via winget..." -ForegroundColor Cyan
            winget install --id JohnMacFarlane.Pandoc -e
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Failed to install Pandoc" -ForegroundColor Red
                Write-Host "Please install manually from: https://pandoc.org/installing.html" -ForegroundColor Yellow
                exit 1
            }
        }
        
        Write-Host "✅ Pandoc is available" -ForegroundColor Green
        Write-Host ""
        Write-Host "Generating PDF with Pandoc..." -ForegroundColor Cyan
        
        pandoc $vpatMd `
            -o $vpatPdf `
            --pdf-engine=pdflatex `
            -V geometry:margin=1in `
            --metadata title="VPAT 2.4 - React Open Source DataGrid" `
            --toc
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PDF generated successfully: $vpatPdf" -ForegroundColor Green
        } else {
            Write-Host "❌ PDF generation failed" -ForegroundColor Red
            Write-Host "Note: Pandoc requires LaTeX installation for PDF output" -ForegroundColor Yellow
            Write-Host "Alternative: Use method 1 or 3" -ForegroundColor Yellow
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "📝 Manual Steps for Chrome/Edge Print:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Open $vpatMd in VS Code" -ForegroundColor White
        Write-Host "2. Press Ctrl+Shift+V to preview" -ForegroundColor White
        Write-Host "3. Right-click in preview → 'Open in Browser'" -ForegroundColor White
        Write-Host "4. In browser, press Ctrl+P" -ForegroundColor White
        Write-Host "5. Select 'Save as PDF'" -ForegroundColor White
        Write-Host "6. Configure:" -ForegroundColor White
        Write-Host "   - Layout: Portrait" -ForegroundColor Gray
        Write-Host "   - Margins: Default" -ForegroundColor Gray
        Write-Host "   - Background graphics: Enabled" -ForegroundColor Gray
        Write-Host "7. Save as: $vpatPdf" -ForegroundColor White
        Write-Host ""
        
        # Open the file in VS Code
        Write-Host "Opening $vpatMd in VS Code..." -ForegroundColor Cyan
        code $vpatMd
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "After generating the PDF:" -ForegroundColor Yellow
Write-Host "1. Verify the PDF looks good" -ForegroundColor White
Write-Host "2. Check that it's saved as: $vpatPdf" -ForegroundColor White
Write-Host "3. Test the download link on your accessibility demo page" -ForegroundColor White
Write-Host "4. Commit both .md and .pdf files to git" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
