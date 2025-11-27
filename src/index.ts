// Top-level public entry for the package.
// Import library styles so builds include `dist/lib/index.css` and consumers can use the `style` field.
import './index.css';

// Re-export DataGrid public API so bundlers can statically analyze named exports.
export * from './components/DataGrid/index';

