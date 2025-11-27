const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'dist', 'assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const content = "export * from './components/DataGrid/index';\n";
const filePath = path.join(outDir, 'index.d.ts');
fs.writeFileSync(filePath, content, { encoding: 'utf8' });
console.log('Wrote', filePath);

// Create a stable ESM entrypoint `index.js` that re-exports the generated hashed bundle
const files = fs.readdirSync(outDir);
const jsBundle = files.find((f) => /^index-.*\.js$/.test(f));
if (jsBundle) {
  const jsContent = `export * from './${jsBundle}';\n`;
  const jsPath = path.join(outDir, 'index.js');
  fs.writeFileSync(jsPath, jsContent, { encoding: 'utf8' });
  console.log('Wrote', jsPath);
} else {
  console.warn('No hashed index-*.js bundle found in', outDir);
}
