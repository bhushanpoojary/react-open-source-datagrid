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
import { DataGrid } from './components/DataGrid';
import type { Column, Row } from './components/DataGrid';

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
