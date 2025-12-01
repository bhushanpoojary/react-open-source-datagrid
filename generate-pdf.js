// Simple script to trigger PDF generation via VS Code command
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mdFile = path.join(__dirname, 'docs', 'ACCESSIBILITY_VPAT.md');
const tempPdfFile = path.join(__dirname, 'docs', 'ACCESSIBILITY_VPAT.pdf');
const finalPdfFile = path.join(__dirname, 'docs', 'VPAT-2.4-ReactDataGrid.pdf');

console.log('🔧 Generating PDF from VPAT markdown...');
console.log('📄 Source:', mdFile);

// Execute the VS Code command to export markdown to PDF
try {
    // Open the file in VS Code
    execSync(`code "${mdFile}"`, { stdio: 'inherit' });
    
    console.log('\n✅ File opened in VS Code');
    console.log('\n📝 MANUAL STEP REQUIRED:');
    console.log('   1. In VS Code, press F1 (or Ctrl+Shift+P)');
    console.log('   2. Type: "Markdown PDF: Export (pdf)"');
    console.log('   3. Press Enter');
    console.log('   4. Wait for PDF generation to complete');
    console.log('   5. Run this script again to rename the file\n');
    
    // Check if the temporary PDF already exists (from previous run)
    if (fs.existsSync(tempPdfFile)) {
        console.log('✅ Found generated PDF, renaming...');
        
        // Rename to final filename
        if (fs.existsSync(finalPdfFile)) {
            fs.unlinkSync(finalPdfFile); // Remove old version
        }
        fs.renameSync(tempPdfFile, finalPdfFile);
        
        const stats = fs.statSync(finalPdfFile);
        const fileSizeInKB = (stats.size / 1024).toFixed(2);
        
        console.log(`✅ PDF created successfully: ${finalPdfFile}`);
        console.log(`📊 File size: ${fileSizeInKB} KB`);
        console.log('\n🎉 Done! Your VPAT PDF is ready for distribution.');
    } else {
        console.log('⏳ Waiting for PDF generation...');
        console.log('   After generating the PDF in VS Code, run this script again.');
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
