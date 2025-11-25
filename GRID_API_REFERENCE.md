# Grid API Reference

## Overview

The DataGrid component now exposes a comprehensive **Grid API** inspired by AG Grid, providing programmatic control over grid functionality. Access the API using React refs.

## Quick Start

```tsx
import React, { useRef } from 'react';
import { DataGrid, GridApi } from './components/DataGrid';

function MyComponent() {
  const gridRef = useRef<GridApi>(null);

  const handleExport = () => {
    gridRef.current?.exportDataAsCsv({ fileName: 'my-data' });
  };

  return (
    <>
      <button onClick={handleExport}>Export CSV</button>
      <DataGrid 
        ref={gridRef}
        columns={columns} 
        rows={rows} 
      />
    </>
  );
}
```

## API Categories

### 📊 Data & Model Operations

#### `setRowData(rows: Row[]): void`
Replace all row data in the grid.

```tsx
gridRef.current.setRowData(newRows);
```

#### `applyTransaction(transaction: RowDataTransaction): RowNodeTransaction`
Add, update, or remove rows via a transaction. More efficient than replacing all data.

```tsx
// Add rows
gridRef.current.applyTransaction({
  add: [newRow1, newRow2],
  addIndex: 0  // Optional: insert at specific index
});

// Update rows
gridRef.current.applyTransaction({
  update: [updatedRow1, updatedRow2]
});

// Remove rows
gridRef.current.applyTransaction({
  remove: [rowToRemove1, rowToRemove2]
});

// Combined operation
gridRef.current.applyTransaction({
  add: [newRow],
  update: [updatedRow],
  remove: [oldRow]
});
```

#### `applyTransactionAsync(transaction: RowDataTransaction): Promise<RowNodeTransaction>`
Asynchronous version of applyTransaction for better performance with large datasets.

#### `getModel(): RowModel`
Get the row model for low-level data access.

```tsx
const model = gridRef.current.getModel();
const rowCount = model.getRowCount();
const firstRow = model.getRow(0);
model.forEachNode((node, index) => {
  console.log(`Row ${index}:`, node.data);
});
```

#### `getDisplayedRowCount(): number`
Get the number of rows currently displayed (after filtering/sorting).

```tsx
const visibleRowCount = gridRef.current.getDisplayedRowCount();
```

#### `getDisplayedRowAtIndex(index: number): RowNode | null`
Get the row node at a specific display index.

```tsx
const row = gridRef.current.getDisplayedRowAtIndex(5);
console.log(row?.data);
```

#### `forEachNode(callback: (node: RowNode, index: number) => void): void`
Iterate through all row nodes.

```tsx
gridRef.current.forEachNode((node, index) => {
  console.log(`Row ${index}:`, node.data);
});
```

#### `forEachNodeAfterFilter(callback: (node: RowNode, index: number) => void): void`
Iterate through rows after filtering.

#### `forEachNodeAfterFilterAndSort(callback: (node: RowNode, index: number) => void): void`
Iterate through rows after filtering and sorting (display order).

---

### 📋 Column Operations

#### `getColumnDefs(): Column[]`
Get current column definitions.

```tsx
const columns = gridRef.current.getColumnDefs();
```

#### `setColumnDefs(colDefs: Column[]): void`
Replace column definitions.

```tsx
gridRef.current.setColumnDefs(newColumns);
```

#### `getAllColumns(): Column[]`
Get all columns (same as getColumnDefs).

#### `getDisplayedCenterColumns(): Column[]`
Get visible columns in the center (not pinned).

#### `getDisplayedLeftColumns(): Column[]`
Get visible left-pinned columns.

#### `getDisplayedRightColumns(): Column[]`
Get visible right-pinned columns.

#### `setColumnVisible(key: ColKey, visible: boolean): void`
Show or hide a column.

```tsx
// Hide email column
gridRef.current.setColumnVisible('email', false);

// Show email column
gridRef.current.setColumnVisible('email', true);
```

#### `setColumnsVisible(keys: ColKey[], visible: boolean): void`
Show or hide multiple columns.

```tsx
gridRef.current.setColumnsVisible(['email', 'phone'], false);
```

#### `setColumnPinned(key: ColKey, pinned: 'left' | 'right' | null): void`
Pin or unpin a column.

```tsx
// Pin to left
gridRef.current.setColumnPinned('name', 'left');

// Pin to right
gridRef.current.setColumnPinned('actions', 'right');

// Unpin
gridRef.current.setColumnPinned('name', null);
```

#### `autoSizeColumns(keys?: ColKey[]): void`
Auto-size specific columns to fit content.

```tsx
// Auto-size specific columns
gridRef.current.autoSizeColumns(['name', 'email']);

// Auto-size all columns
gridRef.current.autoSizeColumns();
```

#### `autoSizeAllColumns(): void`
Auto-size all columns to fit their content.

#### `sizeColumnsToFit(): void`
Resize all visible columns to fill the grid's width.

```tsx
gridRef.current.sizeColumnsToFit();
```

#### `moveColumn(key: ColKey, toIndex: number): void`
Move a column to a new position.

```tsx
gridRef.current.moveColumn('email', 0); // Move to first position
```

#### `getColumnState(): ColumnState[]`
Get the current state of all columns (width, visibility, pinned, sort).

```tsx
const state = gridRef.current.getColumnState();
localStorage.setItem('columnState', JSON.stringify(state));
```

#### `applyColumnState(state: ColumnState[]): void`
Apply saved column state.

```tsx
const saved = JSON.parse(localStorage.getItem('columnState'));
gridRef.current.applyColumnState(saved);
```

#### `resetColumnState(): void`
Reset columns to initial state.

#### `getColumn(key: ColKey): Column | null`
Get a specific column definition.

---

### 🔍 Filtering & Sorting

#### `isAnyFilterPresent(): boolean`
Check if any filter is currently active.

```tsx
if (gridRef.current.isAnyFilterPresent()) {
  console.log('Filters are active');
}
```

#### `getFilterModel(): FilterConfig`
Get the current filter model.

```tsx
const filters = gridRef.current.getFilterModel();
console.log('Active filters:', filters);
```

#### `setFilterModel(model: FilterConfig): void`
Set filter model.

```tsx
// Filter by status
gridRef.current.setFilterModel({
  status: { type: 'equals', value: 'Active' }
});

// Multiple filters
gridRef.current.setFilterModel({
  status: { type: 'equals', value: 'Active' },
  score: { type: 'greaterThan', value: 80 }
});
```

#### `clearAllFilters(): void`
Clear all active filters.

```tsx
gridRef.current.clearAllFilters();
```

#### `onFilterChanged(): void`
Manually trigger filter change event.

#### `getSortModel(): SortConfig[]`
Get current sort configuration.

```tsx
const sortModel = gridRef.current.getSortModel();
```

#### `setSortModel(model: SortConfig[]): void`
Set sort configuration.

```tsx
// Single column sort
gridRef.current.setSortModel([
  { field: 'name', direction: 'asc' }
]);

// Multi-column sort
gridRef.current.setSortModel([
  { field: 'status', direction: 'asc' },
  { field: 'name', direction: 'asc' }
]);
```

#### `clearAllSorting(): void`
Clear all sorting.

```tsx
gridRef.current.clearAllSorting();
```

---

### ✅ Selection Operations

#### `getSelectedNodes(): RowNode[]`
Get selected row nodes with metadata.

```tsx
const nodes = gridRef.current.getSelectedNodes();
nodes.forEach(node => {
  console.log('Selected:', node.data, 'Index:', node.rowIndex);
});
```

#### `getSelectedRows(): Row[]`
Get selected row data.

```tsx
const rows = gridRef.current.getSelectedRows();
console.log('Selected:', rows);
```

#### `selectAll(): void`
Select all rows.

```tsx
gridRef.current.selectAll();
```

#### `deselectAll(): void`
Deselect all rows.

```tsx
gridRef.current.deselectAll();
```

#### `selectAllFiltered(): void`
Select all currently filtered rows.

```tsx
// Apply filter then select
gridRef.current.setFilterModel({ status: { value: 'Active' } });
gridRef.current.selectAllFiltered();
```

#### `deselectAllFiltered(): void`
Deselect all currently filtered rows.

#### `getSelectedRowCount(): number`
Get count of selected rows.

```tsx
const count = gridRef.current.getSelectedRowCount();
console.log(`${count} rows selected`);
```

---

### 🧭 Navigation & Focus

#### `ensureIndexVisible(index: number, position?: 'top' | 'middle' | 'bottom'): void`
Scroll to make a row visible.

```tsx
// Scroll to row 10 at top
gridRef.current.ensureIndexVisible(10, 'top');

// Scroll to row 20 in middle
gridRef.current.ensureIndexVisible(20, 'middle');
```

#### `ensureNodeVisible(node: RowNode, position?: 'top' | 'middle' | 'bottom'): void`
Scroll to make a specific node visible.

#### `setFocusedCell(rowIndex: number, colKey: ColKey): void`
Set keyboard focus to a specific cell.

```tsx
gridRef.current.setFocusedCell(5, 'name');
```

#### `clearFocusedCell(): void`
Clear cell focus.

#### `getFocusedCell(): { rowIndex: number; column: Column } | null`
Get currently focused cell.

---

### ✏️ Editing Operations

#### `startEditingCell(params: StartEditingCellParams): void`
Programmatically start editing a cell.

```tsx
gridRef.current.startEditingCell({
  rowIndex: 2,
  colKey: 'name'
});
```

#### `stopEditing(cancel?: boolean): void`
Stop editing (save or cancel).

```tsx
// Save changes
gridRef.current.stopEditing();

// Cancel changes
gridRef.current.stopEditing(true);
```

#### `getEditingCells(): Array<{ rowIndex: number; column: Column }>`
Get cells currently being edited.

---

### 🔄 Rendering & Refresh

#### `refreshCells(params?: RefreshCellsParams): void`
Re-render specific cells.

```tsx
// Refresh all cells
gridRef.current.refreshCells();

// Refresh specific columns
gridRef.current.refreshCells({ columns: ['status', 'score'] });

// Force refresh
gridRef.current.refreshCells({ force: true });
```

#### `refreshHeader(): void`
Re-render column headers.

#### `redrawRows(params?: RedrawRowsParams): void`
Trigger full re-render of rows.

#### `doLayout(): void`
Force layout recalculation.

---

### 📤 Export & Clipboard

#### `exportDataAsCsv(params?: CsvExportParams): void`
Export grid data to CSV file.

```tsx
// Basic export
gridRef.current.exportDataAsCsv();

// Custom export
gridRef.current.exportDataAsCsv({
  fileName: 'my-export',
  onlySelected: true,
  onlyFiltered: true,
  skipHeader: false,
  columnSeparator: ';',
  processCellCallback: ({ value, column }) => {
    // Custom formatting
    return String(value).toUpperCase();
  }
});
```

#### `getDataAsCsv(params?: CsvExportParams): string`
Get CSV data as string (no download).

```tsx
const csv = gridRef.current.getDataAsCsv();
console.log(csv);
```

#### `copySelectedRowsToClipboard(): void`
Copy selected rows to clipboard as tab-separated values.

```tsx
gridRef.current.copySelectedRowsToClipboard();
```

#### `copySelectedRangeToClipboard(): void`
Copy selected cell range to clipboard.

---

### 📑 Pagination

#### `paginationGetCurrentPage(): number`
Get current page index (0-based).

#### `paginationGoToPage(page: number): void`
Navigate to specific page.

```tsx
gridRef.current.paginationGoToPage(2); // Go to page 3
```

#### `paginationGoToNextPage(): void`
Go to next page.

#### `paginationGoToPreviousPage(): void`
Go to previous page.

#### `paginationGetTotalPages(): number`
Get total number of pages.

#### `paginationGetPageSize(): number`
Get current page size.

#### `paginationSetPageSize(size: number): void`
Set page size.

```tsx
gridRef.current.paginationSetPageSize(50);
```

---

### 🌳 Grouping & Tree

#### `setRowGroupColumns(colKeys: ColKey[]): void`
Set columns to group by.

```tsx
gridRef.current.setRowGroupColumns(['department', 'role']);
```

#### `addRowGroupColumn(colKey: ColKey): void`
Add a column to grouping.

#### `removeRowGroupColumn(colKey: ColKey): void`
Remove a column from grouping.

#### `getRowGroupColumns(): Column[]`
Get columns used for grouping.

#### `expandAll(): void`
Expand all groups/tree nodes.

#### `collapseAll(): void`
Collapse all groups/tree nodes.

---

### 💾 Layout Persistence

#### `saveLayout(name: string): Promise<void>`
Save current layout with a name.

```tsx
await gridRef.current.saveLayout('My Layout');
```

#### `loadLayout(name: string): Promise<void>`
Load saved layout.

```tsx
await gridRef.current.loadLayout('My Layout');
```

#### `getLayoutState(): LayoutPreset['layout']`
Get current layout state.

#### `applyLayoutState(layout: LayoutPreset['layout']): void`
Apply layout state.

---

### 🔧 Overlays

#### `showLoadingOverlay(): void`
Show loading overlay.

#### `showNoRowsOverlay(): void`
Show "no rows" overlay.

#### `hideOverlay(): void`
Hide all overlays.

---

### 🎯 Events

#### `addEventListener(eventType: string, listener: (event: unknown) => void): void`
Add event listener.

```tsx
gridRef.current.addEventListener('selectionChanged', (event) => {
  console.log('Selection changed', event);
});
```

#### `removeEventListener(eventType: string, listener: (event: unknown) => void): void`
Remove event listener.

---

### 🗑️ Lifecycle

#### `destroy(): void`
Clean up grid resources.

#### `isDestroyed(): boolean`
Check if grid has been destroyed.

---

## Types

### `ColKey`
```typescript
type ColKey = string | number;
```

### `RowNode`
```typescript
interface RowNode<T = Row> {
  id: string | number;
  data: T;
  rowIndex: number;
  selected: boolean;
  setSelected(selected: boolean, clearOther?: boolean): void;
}
```

### `RowDataTransaction`
```typescript
interface RowDataTransaction<T = Row> {
  add?: T[];
  update?: T[];
  remove?: T[];
  addIndex?: number;
}
```

### `CsvExportParams`
```typescript
interface CsvExportParams {
  fileName?: string;
  columnKeys?: ColKey[];
  skipHeader?: boolean;
  onlySelected?: boolean;
  onlyFiltered?: boolean;
  columnSeparator?: string;
  suppressQuotes?: boolean;
  processCellCallback?: (params: { 
    value: unknown; 
    column: Column; 
    node: RowNode;
  }) => string;
}
```

---

## Complete Example

```tsx
import React, { useRef, useEffect } from 'react';
import { DataGrid, GridApi } from './components/DataGrid';

function App() {
  const gridRef = useRef<GridApi>(null);

  useEffect(() => {
    // Setup event listeners
    const api = gridRef.current;
    if (!api) return;

    const handleSelectionChanged = () => {
      const count = api.getSelectedRowCount();
      console.log(`${count} rows selected`);
    };

    api.addEventListener('selectionChanged', handleSelectionChanged);

    return () => {
      api.removeEventListener('selectionChanged', handleSelectionChanged);
    };
  }, []);

  const handleExportSelected = () => {
    gridRef.current?.exportDataAsCsv({
      fileName: 'selected-data',
      onlySelected: true
    });
  };

  const handleBulkUpdate = () => {
    const api = gridRef.current;
    if (!api) return;

    // Get selected rows
    const selected = api.getSelectedRows();
    
    // Update them
    const updates = selected.map(row => ({
      ...row,
      status: 'Processed'
    }));

    // Apply transaction
    api.applyTransaction({ update: updates });
  };

  const handleFilterActive = () => {
    gridRef.current?.setFilterModel({
      status: { type: 'equals', value: 'Active' }
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleExportSelected}>Export Selected</button>
        <button onClick={handleBulkUpdate}>Mark as Processed</button>
        <button onClick={handleFilterActive}>Show Active Only</button>
      </div>

      <DataGrid
        ref={gridRef}
        columns={columns}
        rows={rows}
        pageSize={20}
      />
    </div>
  );
}
```

---

## Migration from Props to API

Before (using props):
```tsx
<DataGrid
  columns={columns}
  rows={rows}
  onSelectionChange={handleSelection}
/>
```

After (using API):
```tsx
const gridRef = useRef<GridApi>(null);

// Get selection programmatically
const selected = gridRef.current?.getSelectedRows();

<DataGrid
  ref={gridRef}
  columns={columns}
  rows={rows}
/>
```

---

## Performance Tips

1. **Use transactions for bulk updates**: More efficient than `setRowData()`
2. **Batch operations**: Group multiple API calls together
3. **Use `applyTransactionAsync`** for large datasets
4. **Minimize re-renders**: Cache API results when possible

---

## See Also

- [GridApiDemo Component](./GridApiDemo.tsx) - Interactive demo
- [AG Grid API Documentation](https://www.ag-grid.com/react-data-grid/grid-api/) - Inspiration source
- [DataGrid Props](./types.ts) - Component props reference
