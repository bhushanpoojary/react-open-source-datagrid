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
