# React DataGrid Component

A fully-featured, reusable DataGrid component built with React, TypeScript, and Tailwind CSS - similar to AG-Grid.

## Features

- ✅ Sortable columns (click header to sort)
- ✅ Column filtering (text search)
- ✅ Pagination (10, 20, 50 rows per page)
- ✅ Column resizing (drag borders)
- ✅ Column reordering (drag & drop)
- ✅ Row selection (single/multi/range)
- ✅ Editable cells (double-click to edit)
- ✅ Keyboard navigation (arrow keys)
- ✅ Sticky header
- ✅ Column pinning (freeze left/right columns)
- ✅ Row grouping (drag columns to group area)
- ✅ **Aggregation footer rows** (Total, Average, Min, Max, Count)
- ✅ **Group-level footers** (subtotals for each group)
- ✅ **Virtual Scrolling** (50,000+ rows, 200+ columns with ultra-fast rendering)
- ✅ **Cell Renderer Framework** (custom components: badges, progress bars, buttons, images, icons)
- ✅ **Layout Persistence** (save/load layouts with localStorage, server, or user profile storage)
- ✅ **Infinite Scrolling with Server-Side DataSource** (100M+ rows with server-side filtering, sorting, and caching)
- ✅ **Accessibility (A11y)** (WCAG 2.1 AA compliant with full keyboard navigation, ARIA support, and screen reader compatibility)
- ✅ **Context Menu** (right-click menu with copy, export, pin/unpin, auto-size, hide, filter by value, and custom actions)
- ✅ **Density Modes** (Ultra Compact/Compact/Normal/Comfortable spacing with segmented control and persistent preferences)
- ✅ **10 Beautiful Themes** (Quartz, Alpine, Material, Dark Mode, Nord, Dracula, Solarized Light/Dark, Monokai, One Dark) 🆕

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 to see the demo.

## Usage

```tsx
import { DataGrid } from 'react-open-source-grid';
import type { Column, Row } from 'react-open-source-grid';

const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180, editable: true },
];

const rows: Row[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

<DataGrid 
  columns={columns} 
  rows={rows}
  onCellEdit={(rowIndex, field, value) => {
    console.log('Edited:', rowIndex, field, value);
  }}
/>
```

## Documentation

- **Full Documentation**: See [DATAGRID_README.md](./DATAGRID_README.md)
- **Quick Start Guide**: See [QUICKSTART.md](./QUICKSTART.md)
- **Architecture Guide**: See [src/components/DataGrid/ARCHITECTURE.md.ts](./src/components/DataGrid/ARCHITECTURE.md.ts)
- **Aggregation Footer Feature**: See [AGGREGATION_FOOTER_FEATURE.md](./AGGREGATION_FOOTER_FEATURE.md)
- **Footer Quick Reference**: See [FOOTER_QUICK_REFERENCE.md](./FOOTER_QUICK_REFERENCE.md)
- **Cell Renderer Framework**: See [CELL_RENDERER_FRAMEWORK.md](./CELL_RENDERER_FRAMEWORK.md)
- **Cell Renderer Quick Reference**: See [CELL_RENDERER_QUICK_REF.md](./CELL_RENDERER_QUICK_REF.md)
- **Layout Persistence**: See [LAYOUT_PERSISTENCE_INDEX.md](./LAYOUT_PERSISTENCE_INDEX.md)
- **Layout Persistence Feature Guide**: See [LAYOUT_PERSISTENCE_FEATURE.md](./LAYOUT_PERSISTENCE_FEATURE.md)
- **Layout Persistence Quick Reference**: See [LAYOUT_PERSISTENCE_QUICK_REF.md](./LAYOUT_PERSISTENCE_QUICK_REF.md)
- **Context Menu**: See [CONTEXT_MENU_FEATURE.md](./CONTEXT_MENU_FEATURE.md)
- **Context Menu Quick Reference**: See [CONTEXT_MENU_QUICK_REF.md](./CONTEXT_MENU_QUICK_REF.md)
- **Density Modes**: See [DENSITY_MODE_INDEX.md](./DENSITY_MODE_INDEX.md)
- **Density Mode Quick Reference**: See [DENSITY_MODE_QUICK_REF.md](./DENSITY_MODE_QUICK_REF.md)
- **Theme System**: See [THEME_SYSTEM.md](./THEME_SYSTEM.md) 🆕
- **Themes Overview**: See [THEMES_OVERVIEW.md](./THEMES_OVERVIEW.md) 🆕
- **Theme Integration**: See [THEME_INTEGRATION_MIGRATION.md](./THEME_INTEGRATION_MIGRATION.md) - Migration guide

## Technology Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Virtual Scrolling

For large datasets (50,000+ rows, 200+ columns), enable virtual scrolling:

```tsx
import { DataGrid, VirtualScrollConfig } from 'react-open-source-grid';

const virtualConfig: VirtualScrollConfig = {
  enabled: true,
  rowHeight: 35,
  containerHeight: 600,
  enableColumnVirtualization: true,
};

<DataGrid
  columns={columns}
  rows={largeDataset}
  virtualScrollConfig={virtualConfig}
/>
```

**Benefits:**
- Handles 100,000+ rows smoothly
- Supports 200+ columns with column virtualization
- 100x faster rendering vs non-virtual mode
- 100x less memory usage
- Smooth 60 FPS scrolling

**See also:**
- [VIRTUAL_SCROLLING.md](./VIRTUAL_SCROLLING.md) - Complete documentation
- [VIRTUAL_SCROLLING_QUICK_REF.md](./VIRTUAL_SCROLLING_QUICK_REF.md) - Quick reference guide

## Infinite Scrolling with Server-Side DataSource

For massive datasets (100M+ rows), use server-side infinite scrolling:

```tsx
import { InfiniteScrollDataGrid, ServerSideDataSource } from 'react-open-source-grid';

// Create data source
const dataSource = new ServerSideDataSource({
  blockSize: 100,              // Rows per block
  maxConcurrentRequests: 2,    // Max parallel requests
  cacheBlockCount: 20,         // Cache up to 20 blocks
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  
  // Implement server communication
  getRows: async (request) => {
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(request)
    });
    return await response.json();
  },
});

// Use the grid
<InfiniteScrollDataGrid
  columns={columns}
  dataSource={dataSource}
  pageSize={100}
  virtualScrollConfig={{ enabled: true }}
/>
```

**Features:**
- Handles 100M+ rows efficiently
- Server-side filtering and sorting
- Intelligent block caching with LRU eviction
- Prefetching for smooth scrolling
- Configurable concurrent requests
- AG Grid-like API

**Server API Format:**

Request:
```json
{
  "startRow": 0,
  "endRow": 100,
  "sortModel": [{ "field": "name", "direction": "asc" }],
  "filterModel": { "age": { "type": "greaterThan", "value": 25 } }
}
```

Response:
```json
{
  "rows": [...],
  "totalRows": 100000000,
  "lastRow": undefined
}
```

**See also:**
- [INFINITE_SCROLLING_INDEX.md](./INFINITE_SCROLLING_INDEX.md) - Documentation index
- [INFINITE_SCROLLING_FEATURE.md](./INFINITE_SCROLLING_FEATURE.md) - Complete guide
- [INFINITE_SCROLLING_QUICK_REF.md](./INFINITE_SCROLLING_QUICK_REF.md) - Quick reference

## Themes

Choose from **10 beautiful pre-built themes** to match your application's design:

```tsx
import { DataGrid, ThemeSelector } from 'react-open-source-grid';
import type { ThemeName } from 'react-open-source-grid';

function App() {
  const [theme, setTheme] = useState<ThemeName>('quartz');
  
  return (
    <>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      <DataGrid
        columns={columns}
        rows={rows}
        theme={theme}
      />
    </>
  );
}
```

**Available Themes:**

**Light Themes:**
- `quartz` - Modern white with clean aesthetics
- `alpine` - Classic business professional
- `material` - Material Design inspired
- `nord` - Arctic-inspired minimalist
- `solarized-light` - Precision colors for readability

**Dark Themes:**
- `dark` - VS Code inspired dark mode
- `dracula` - Popular purple-tinted theme
- `solarized-dark` - Dark variant of Solarized
- `monokai` - Vibrant Sublime-style colors
- `one-dark` - Atom editor's iconic theme

**Features:**
- Instant theme switching with CSS variables
- Comprehensive color palettes
- Consistent spacing and typography
- Custom shadows and borders per theme
- Easy theme customization

**See also:**
- [THEME_SYSTEM.md](./THEME_SYSTEM.md) - Complete theme documentation
- [THEMES_OVERVIEW.md](./THEMES_OVERVIEW.md) - Visual comparison of all themes
