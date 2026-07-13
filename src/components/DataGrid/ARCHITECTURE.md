# Component Architecture Guide

This document explains the internal design and architecture of the DataGrid component.

## 1. State Management Pattern

The DataGrid uses `useReducer` for centralized state management. This provides several benefits:

- Single source of truth for all grid state
- Predictable state updates through actions
- Easier debugging and testing
- Better performance (fewer re-renders)

**State structure:**

- `columns` — Column configuration
- `sortConfig` — Current sort field and direction
- `filterConfig` — Filter values for each column
- `currentPage` — Active page number (0-indexed)
- `pageSize` — Rows per page
- `selection` — Selected row IDs and tracking
- `editState` — Currently editing cell info
- `focusState` — Keyboard focus position
- `columnOrder` — Display order of columns
- `columnWidths` — Width of each column in pixels

## 2. Data Flow

Data flows through the component in the following order:

```
Raw Data (props.rows)
   ↓
Apply Sorting (sortedRows)
   ↓
Apply Filtering (filteredRows)
   ↓
Apply Pagination (paginatedRows)
   ↓
Render in GridBody
```

Each transformation is done with `useMemo` for performance optimization. The transformations only recalculate when their dependencies change.

## 3. Component Hierarchy

```
DataGrid (Parent)
  │
  ├── GridHeader
  │     ├── Column Headers (sortable, draggable)
  │     ├── Column Resizers
  │     └── Filter Inputs
  │
  ├── GridBody
  │     └── Rows
  │           └── Cells (editable, focusable, selectable)
  │
  └── GridPagination
        ├── Page Size Selector
        ├── Row Count Info
        └── Page Navigation Buttons
```

## 4. Key Design Patterns

**A) Compound Component Pattern**
- Main DataGrid orchestrates sub-components
- Each sub-component has a specific responsibility
- State and dispatch are passed down as props

**B) Reducer Pattern**
- All state updates go through the reducer
- Actions are dispatched from child components
- Reducer handles state transitions

**C) Controlled Components**
- Parent component (DataGrid) owns the data
- Child components receive data and callbacks
- Edits are communicated back via callbacks

**D) Memoization Strategy**
- `useMemo` for expensive computations (sorting, filtering)
- `useCallback` for event handlers passed to children
- Prevents unnecessary re-renders

## 5. Column Resizing Implementation

Column resizing uses a custom implementation:

1. Each column has a resize handle (1px div at right edge)
2. On mousedown: store starting X position and current width, set resizing state
3. On mousemove (document level): calculate difference from start position, update column width (with minimum constraint)
4. On mouseup (document level): clear resizing state, clean up event listeners

This approach allows dragging outside the column without losing the resize.

## 6. Column Reordering Implementation

Column reordering uses the HTML5 Drag & Drop API:

1. Each column header is draggable
2. On dragstart: store which column is being dragged, set drag effect to `move`
3. On dragover: prevent default to allow drop, set drop effect to `move`
4. On drop: calculate new position, dispatch `REORDER_COLUMNS` action, update `columnOrder` array in state

## 7. Row Selection Implementation

Three selection modes:

- **Single Selection** (regular click): clear all selections, select clicked row
- **Multi Selection** (Ctrl/Cmd + click): toggle clicked row, preserve other selections
- **Range Selection** (Shift + click): find last selected row, select all rows between last and current, add to existing selection

Selection state is stored as a `Set` for O(1) lookups.

## 8. Cell Editing Implementation

Cell editing workflow:

1. **Enter Edit Mode:** double-click cell OR press Enter on focused cell → dispatch `START_EDIT` → replace cell content with input element
2. **During Editing:** input is focused and selected; value changes update `editState`; click outside or press Enter/Escape to exit
3. **Exit Edit Mode:** Enter saves changes and calls `onCellEdit`; Escape discards changes; Blur saves changes; dispatch `END_EDIT`

## 9. Keyboard Navigation Implementation

Keyboard navigation with focus tracking:

1. **Focus State:** stored as `{ rowIndex, columnIndex }`; rendered cell gets `tabIndex={0}`, others get `tabIndex={-1}`; visual indicator (ring) shows focused cell
2. **Arrow Key Handling:** calculate new position, apply boundary constraints (0 to max), update focus state; focused cell automatically receives keyboard focus
3. **Enter Key:** starts editing if cell is editable; during editing, saves and exits
4. **Escape Key:** during editing cancels and exits; otherwise clears focus

## 10. Performance Optimizations

- **useMemo for derived data:** `sortedRows`, `filteredRows`, `paginatedRows` only recalculate when dependencies change
- **useCallback for event handlers:** prevents child re-renders via stable function references
- **Early returns in reducer:** no-op actions don't create new state
- **Set for selection tracking:** O(1) lookups for "is selected" checks
- **Column map in GridHeader/GridBody:** quick column lookup by field name, avoids O(n) `array.find()` in render

Future optimization opportunities: virtual scrolling for large datasets, Web Workers for sorting/filtering, `React.memo` for sub-components, debounced filter updates.

## 11. Testing Strategy

- **Unit Tests:** `gridReducer.ts` (all action types), utility functions (sorting, filtering logic)
- **Component Tests:** GridHeader (sorting, filtering, resizing), GridBody (cell editing, selection, navigation), GridPagination (page changes, size changes)
- **Integration Tests:** full DataGrid feature interactions, e.g. Sort → Filter → Edit → Page change
- **E2E Tests:** user workflows and keyboard navigation flows

## 12. Accessibility Considerations

Current accessibility features: keyboard navigation (arrow keys, Enter, Escape), focus indicators (visible ring), semantic HTML where possible.

Recommended improvements: ARIA labels for interactive elements, `aria-sort` on column headers, `aria-selected` on selected rows, screen reader announcements for state changes, focus management when editing, proper role attributes (`grid`, `row`, `columnheader`, `gridcell`), keyboard shortcuts documentation.

## 13. Extending the Component

**A) Add new state:**
1. Update `GridState` interface in `types.ts`
2. Add to `createInitialState` in `gridReducer.ts`
3. Create new action type(s)
4. Handle in reducer switch statement

**B) Add new column feature:**
1. Update `Column` interface in `types.ts`
2. Handle in `GridHeader.tsx`
3. Update rendering logic in `GridBody.tsx`

**C) Add new UI component:**
1. Create new component file
2. Import in `DataGrid.tsx`
3. Pass necessary state and dispatch
4. Add to component hierarchy

## 14. Common Patterns in the Codebase

- **Column Lookup:** `const columnMap = new Map(columns.map(col => [col.field, col]));` — faster than `columns.find(...)`
- **Conditional Rendering:** `if (!column || column.editable === false) return;` — handle missing or disabled features
- **Event Handler:** dispatch an action then notify the parent via an optional callback
- **Style Computation:** dynamic class names based on state
- **Ref Usage:** imperative DOM operations (e.g. focus) inside `useEffect` when needed
