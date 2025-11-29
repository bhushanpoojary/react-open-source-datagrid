# DataGrid Component - Quick Start Guide

## 🎯 What You Have

A production-ready, feature-rich DataGrid component for React with:

### ✨ Core Features
1. **Sorting** - Click column headers (asc/desc/none)
2. **Filtering** - Text search in column filters
3. **Pagination** - 10/20/50 rows per page
4. **Column Resizing** - Drag column borders
5. **Column Reordering** - Drag & drop headers
6. **Row Selection** - Single/Multi/Range selection
7. **Cell Editing** - Double-click or Enter to edit
8. **Keyboard Navigation** - Arrow keys + Enter/Escape
9. **Sticky Header** - Always visible when scrolling

## 🚀 Quick Start

### View the Demo
```bash
npm run dev
# Navigate to http://localhost:5173
```

### Use in Your Project

<details open>
<summary><strong>TypeScript</strong></summary>

```tsx
import { DataGrid } from 'react-open-source-grid';
import type { Column, Row } from 'react-open-source-grid';

// Define columns
const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
];

// Define data
const rows: Row[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Render
<DataGrid columns={columns} rows={rows} />
```

</details>

<details>
<summary><strong>JavaScript</strong></summary>

```jsx
import { DataGrid } from 'react-open-source-grid';

// Define columns
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
];

// Define data
const rows = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Render
<DataGrid columns={columns} rows={rows} />
```

</details>

## 📁 File Structure

```
src/components/DataGrid/
├── DataGrid.tsx           → Main component
├── GridHeader.tsx         → Header (sort/filter/resize)
├── GridBody.tsx           → Body (cells/selection/edit)
├── GridPagination.tsx     → Pagination controls
├── gridReducer.ts         → State management
├── types.ts               → TypeScript types
└── index.ts               → Exports
```

## 🎮 How to Use

### Basic Usage
```tsx
<DataGrid 
  columns={columns} 
  rows={rows} 
/>
```

### With Callbacks
```tsx
<DataGrid 
  columns={columns} 
  rows={rows}
  pageSize={20}
  onRowClick={(row) => console.log('Clicked:', row)}
  onCellEdit={(rowIndex, field, value) => {
    // Update your data source
    updateData(rowIndex, field, value);
  }}
  onSelectionChange={(ids) => console.log('Selected:', ids)}
/>
```

### Column Configuration
```tsx
const columns: Column[] = [
  {
    field: 'id',              // Field name in data
    headerName: 'ID',         // Display name
    width: 70,                // Width in pixels
    sortable: true,           // Allow sorting (default: true)
    filterable: true,         // Allow filtering (default: true)
    editable: false,          // Allow editing (default: true)
  },
];
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑ ↓ ← →` | Navigate cells |
| `Enter` | Edit focused cell |
| `Escape` | Cancel editing |
| `Ctrl + Click` | Multi-select rows |
| `Shift + Click` | Range-select rows |

## 🎨 Customization

### Styling
The component uses Tailwind CSS. To customize:

1. **Colors**: Edit classes in component files
2. **Sizes**: Modify width/height values
3. **Theme**: Update `tailwind.config.js`

### Behavior
Configure via props:
- `pageSize` - Initial rows per page
- `columns[].editable` - Enable/disable editing per column
- `columns[].sortable` - Enable/disable sorting per column
- `columns[].filterable` - Enable/disable filtering per column

## 📊 Example: Employee Grid

See `src/components/DemoGridPage.tsx` for a complete example with:
- 25 employee records
- 7 columns
- Event logging
- Selection tracking
- All features demonstrated

## 🔧 Advanced Usage

### Managing Edited Data
```tsx
const [data, setData] = useState(initialData);

const handleCellEdit = (rowIndex, field, value) => {
  setData(prev => {
    const updated = [...prev];
    updated[rowIndex] = { ...updated[rowIndex], [field]: value };
    return updated;
  });
};

<DataGrid rows={data} onCellEdit={handleCellEdit} />
```

### Handling Selection
```tsx
const [selected, setSelected] = useState<(string | number)[]>([]);

<DataGrid 
  rows={data}
  onSelectionChange={setSelected}
/>

// Later, do something with selected rows
const selectedRows = data.filter(row => selected.includes(row.id));
```

## 🐛 Troubleshooting

### Issue: Tailwind styles not working
**Solution**: Ensure `@tailwind` directives are in `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: Edits not saving
**Solution**: Implement `onCellEdit` callback to update your data source:
```tsx
onCellEdit={(rowIndex, field, value) => {
  // Update your state/database here
}}
```

### Issue: Column widths not persisting
**Solution**: Column widths are stored in component state. To persist:
- Save to localStorage in a useEffect
- Load from localStorage when initializing

## 📚 Documentation

- **Full Documentation**: See `DATAGRID_README.md`
- **Architecture Guide**: See `src/components/DataGrid/ARCHITECTURE.md.ts`
- **Demo Code**: See `src/components/DemoGridPage.tsx`

## 🎯 Next Steps

1. **Try the Demo**: Run `npm run dev`
2. **Read Full Docs**: Check `DATAGRID_README.md`
3. **Customize**: Modify styles in component files
4. **Integrate**: Import into your project
5. **Extend**: Add custom features as needed

## ✅ What's Included

- ✅ Full TypeScript support
- ✅ Responsive design
- ✅ Production-ready code
- ✅ Comprehensive comments
- ✅ Example implementation
- ✅ No external grid dependencies

## 🚀 Performance

- Uses `useReducer` for efficient state management
- `useMemo` for expensive computations
- Optimized rendering with conditional updates
- Handles 1000+ rows smoothly (with pagination)

## 📝 License

MIT - Free to use and modify

---

**You're all set!** Start the dev server and see it in action:
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.
