# Grid API Quick Reference

## Setup

```tsx
import { DataGrid, GridApi } from './components/DataGrid';

const gridRef = useRef<GridApi>(null);

<DataGrid ref={gridRef} columns={columns} rows={rows} />
```

## Common Operations

### Data Management
```tsx
// Replace all data
gridRef.current.setRowData(newRows);

// Add rows
gridRef.current.applyTransaction({ add: [newRow] });

// Update rows
gridRef.current.applyTransaction({ update: [updatedRow] });

// Remove rows
gridRef.current.applyTransaction({ remove: [rowToDelete] });

// Get row count
const count = gridRef.current.getDisplayedRowCount();
```

### Column Control
```tsx
// Hide/show column
gridRef.current.setColumnVisible('email', false);

// Pin column
gridRef.current.setColumnPinned('name', 'left');

// Auto-size columns
gridRef.current.autoSizeAllColumns();

// Fit to width
gridRef.current.sizeColumnsToFit();
```

### Filtering
```tsx
// Apply filter
gridRef.current.setFilterModel({
  status: { type: 'equals', value: 'Active' }
});

// Clear filters
gridRef.current.clearAllFilters();

// Check if filtered
const hasFilters = gridRef.current.isAnyFilterPresent();
```

### Sorting
```tsx
// Apply sort
gridRef.current.setSortModel([
  { field: 'name', direction: 'asc' }
]);

// Clear sort
gridRef.current.clearAllSorting();
```

### Selection
```tsx
// Select all
gridRef.current.selectAll();

// Deselect all
gridRef.current.deselectAll();

// Get selected
const selected = gridRef.current.getSelectedRows();
const count = gridRef.current.getSelectedRowCount();
```

### Export
```tsx
// Export CSV
gridRef.current.exportDataAsCsv({
  fileName: 'data',
  onlySelected: true
});

// Copy to clipboard
gridRef.current.copySelectedRowsToClipboard();
```

### Navigation
```tsx
// Scroll to row
gridRef.current.ensureIndexVisible(10, 'middle');

// Focus cell
gridRef.current.setFocusedCell(5, 'name');
```

### Pagination
```tsx
// Change page
gridRef.current.paginationGoToPage(2);
gridRef.current.paginationGoToNextPage();

// Change page size
gridRef.current.paginationSetPageSize(50);
```

### State Management
```tsx
// Save state
const state = gridRef.current.getColumnState();
localStorage.setItem('gridState', JSON.stringify(state));

// Restore state
const saved = JSON.parse(localStorage.getItem('gridState'));
gridRef.current.applyColumnState(saved);
```

## Full API Categories

| Category | Methods |
|----------|---------|
| **Data** | `setRowData`, `applyTransaction`, `getModel`, `getDisplayedRowCount`, `forEachNode` |
| **Columns** | `getColumnDefs`, `setColumnVisible`, `setColumnPinned`, `autoSizeColumns`, `sizeColumnsToFit` |
| **Filtering** | `getFilterModel`, `setFilterModel`, `clearAllFilters`, `isAnyFilterPresent` |
| **Sorting** | `getSortModel`, `setSortModel`, `clearAllSorting` |
| **Selection** | `getSelectedRows`, `selectAll`, `deselectAll`, `getSelectedRowCount` |
| **Navigation** | `ensureIndexVisible`, `setFocusedCell`, `clearFocusedCell` |
| **Editing** | `startEditingCell`, `stopEditing`, `getEditingCells` |
| **Export** | `exportDataAsCsv`, `getDataAsCsv`, `copySelectedRowsToClipboard` |
| **Pagination** | `paginationGoToPage`, `paginationSetPageSize`, `paginationGetCurrentPage` |
| **Rendering** | `refreshCells`, `refreshHeader`, `redrawRows` |
| **Events** | `addEventListener`, `removeEventListener` |

## See Full Documentation
- [Complete API Reference](./GRID_API_REFERENCE.md)
- [Interactive Demo](./src/components/DataGrid/GridApiDemo.tsx)
