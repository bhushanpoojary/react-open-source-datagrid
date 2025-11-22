# Custom DataGrid Component for React

A fully-featured, reusable DataGrid component built with React, TypeScript, and Tailwind CSS - similar to AG-Grid.

## 🚀 Features

### Core Functionality
- ✅ **Sortable Columns** - Click column headers to sort (ascending → descending → none)
- ✅ **Column Filtering** - Text-based filtering for each column
- ✅ **Pagination** - Configurable page sizes (10, 20, 50 rows per page)
- ✅ **Column Resizing** - Drag column borders to adjust width
- ✅ **Column Reordering** - Drag and drop column headers to reorder
- ✅ **Row Selection** - Single, multi (Ctrl+click), and range (Shift+click) selection
- ✅ **Editable Cells** - Double-click to edit, Enter to save, Escape to cancel
- ✅ **Keyboard Navigation** - Arrow keys to move focus, Enter to edit
- ✅ **Sticky Header** - Header remains visible when scrolling
- ✅ **Auto Column Width** - Intelligent column width adjustment

## 🏗️ Architecture

### Component Structure
```
DataGrid/
├── DataGrid.tsx          # Main component (orchestrates everything)
├── GridHeader.tsx        # Header with sorting, filtering, resizing
├── GridBody.tsx          # Body with editable cells, selection, navigation
├── GridPagination.tsx    # Pagination controls
├── gridReducer.ts        # State management with useReducer
├── types.ts              # TypeScript interfaces
└── index.ts              # Exports
```

### State Management
The DataGrid uses **`useReducer`** for centralized state management:
- Sort configuration
- Filter values
- Pagination state
- Row selection
- Cell editing state
- Keyboard focus
- Column order & widths

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd react-open-source-datagrid

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Usage

### Basic Example

```tsx
import { DataGrid } from './components/DataGrid';
import type { Column, Row } from './components/DataGrid';

const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'role', headerName: 'Role', width: 150 },
];

const rows: Row[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  // ... more rows
];

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pageSize={10}
      onRowClick={(row) => console.log('Row clicked:', row)}
      onCellEdit={(rowIndex, field, value) => {
        console.log(`Cell edited: Row ${rowIndex}, Field ${field}, Value ${value}`);
      }}
      onSelectionChange={(selectedIds) => {
        console.log('Selected:', selectedIds);
      }}
    />
  );
}
```

## 🔧 API Reference

### DataGrid Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `columns` | `Column[]` | ✅ | - | Array of column definitions |
| `rows` | `Row[]` | ✅ | - | Array of data rows |
| `pageSize` | `number` | ❌ | `10` | Initial page size |
| `onRowClick` | `(row: Row) => void` | ❌ | - | Callback when row is clicked |
| `onCellEdit` | `(rowIndex: number, field: string, value: any) => void` | ❌ | - | Callback when cell is edited |
| `onSelectionChange` | `(selectedIds: (string \| number)[]) => void` | ❌ | - | Callback when selection changes |

### Column Interface

```typescript
interface Column {
  field: string;           // Field name in data
  headerName: string;      // Display name in header
  width?: number;          // Column width in pixels (default: 150)
  editable?: boolean;      // Allow cell editing (default: true)
  sortable?: boolean;      // Allow column sorting (default: true)
  filterable?: boolean;    // Allow column filtering (default: true)
}
```

### Row Interface

```typescript
interface Row {
  id: string | number;     // Unique identifier
  [key: string]: any;      // Any additional fields
}
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Arrow Keys` | Navigate between cells |
| `Enter` | Start editing focused cell |
| `Escape` | Cancel editing |
| `Ctrl/Cmd + Click` | Toggle row selection (multi-select) |
| `Shift + Click` | Range selection |

## 🎨 Styling

The component uses **Tailwind CSS** for styling. You can customize:

- Colors: Modify Tailwind classes in component files
- Dimensions: Adjust width, height, padding in component files
- Theme: Extend Tailwind configuration in `tailwind.config.js`

## 🧪 Demo

The project includes a full demo page (`DemoGridPage.tsx`) with:
- 25 sample employee records
- All features demonstrated
- Event logging
- Selection tracking
- Usage instructions

Run `npm run dev` and navigate to `http://localhost:5173` to see it in action.

## 📂 Project Structure

```
src/
├── components/
│   ├── DataGrid/
│   │   ├── DataGrid.tsx           # Main grid component
│   │   ├── GridHeader.tsx         # Header with sort/filter/resize
│   │   ├── GridBody.tsx           # Body with cells/selection
│   │   ├── GridPagination.tsx     # Pagination controls
│   │   ├── gridReducer.ts         # State reducer
│   │   ├── types.ts               # TypeScript types
│   │   └── index.ts               # Exports
│   └── DemoGridPage.tsx           # Demo page
├── App.tsx                        # Main app component
├── main.tsx                       # Entry point
└── index.css                      # Global styles
```

## 🔍 Key Implementation Details

### 1. State Management with useReducer
All grid state is managed through a single reducer, making state changes predictable and debuggable.

### 2. Column Reordering
Uses native HTML5 drag-and-drop API for smooth column reordering without external libraries.

### 3. Column Resizing
Implemented with mouse event listeners that track drag distance and update column widths in real-time.

### 4. Keyboard Navigation
Focus state is tracked in the reducer, and keyboard events move focus between cells with proper boundary checks.

### 5. Row Selection
Supports three selection modes:
- Single: Regular click
- Multi: Ctrl/Cmd + click
- Range: Shift + click

### 6. Cell Editing
Double-click or Enter key starts editing. Changes are committed on blur or Enter, cancelled on Escape.

### 7. Filtering & Sorting
Applied as useMemo chains: raw data → sorted → filtered → paginated for optimal performance.

## 🚀 Future Enhancements

Potential features to add:
- Column pinning (freeze columns)
- Row grouping
- Cell renderers (custom cell content)
- Export to CSV/Excel
- Virtualization for large datasets
- Context menu
- Column visibility toggle
- Advanced filters (date, number ranges)
- Cell validation
- Undo/redo for edits

## 🛠️ Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using React + TypeScript + Vite**
