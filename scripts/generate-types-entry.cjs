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

// Copy any .d.ts files from src into dist/assets so they are packaged with the tarball.
const srcDir = path.resolve(__dirname, '..', 'src');
const targetComponentsDir = path.join(outDir, 'components');

function copyDtsFiles(srcRoot, destRoot) {
  if (!fs.existsSync(srcRoot)) return;
  const entries = fs.readdirSync(srcRoot, { withFileTypes: true });
  for (const ent of entries) {
    const srcPath = path.join(srcRoot, ent.name);
    const destPath = path.join(destRoot, ent.name);
    if (ent.isDirectory()) {
      copyDtsFiles(srcPath, destPath);
    } else if (ent.isFile() && srcPath.endsWith('.d.ts')) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      console.log('Copied', srcPath, '->', destPath);
    }
  }
}

copyDtsFiles(path.join(srcDir, 'components'), targetComponentsDir);
