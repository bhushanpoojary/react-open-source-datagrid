# Row Pinning Feature - Complete Documentation

## Overview

Row pinning is a powerful feature that allows users to keep important rows visible at the top or bottom of the grid, regardless of sorting, filtering, pagination, or scrolling. Pinned rows use CSS sticky positioning to remain fixed in place while other rows scroll normally.

## Key Features

- **Pin to Top or Bottom**: Pin rows to either the top or bottom of the grid
- **Sticky Positioning**: Pinned rows remain visible during scroll operations
- **Works with Sorting**: Pinned rows maintain their position while unpinned rows are sorted
- **Works with Filtering**: Pinned rows remain visible even when filters are applied
- **Works with Virtual Scrolling**: Fully compatible with high-performance virtual scrolling
- **Context Menu Integration**: Easy right-click access to pin/unpin operations
- **Pagination Compatible**: Pinned rows are excluded from pagination and visible on all pages
- **Programmatic Control**: Full API for programmatic row pinning

## Architecture

### Component Flow

```
DataGrid
  ├── Separate pinned rows from unpinned rows (after sorting/filtering)
  ├── Pass pinnedRowsTop, pinnedRowsBottom to GridBody
  └── GridBody
      ├── Render pinned top rows (sticky top)
      ├── Render unpinned rows (scrollable)
      └── Render pinned bottom rows (sticky bottom)
```

### State Management

Row pinning state is managed in the grid reducer:

```typescript
interface GridState {
  pinnedRowsTop: (string | number)[];      // Array of row IDs pinned to top
  pinnedRowsBottom: (string | number)[];   // Array of row IDs pinned to bottom
  // ... other state
}
```

Three actions control row pinning:
- `PIN_ROW_TOP`: Add a row to the top pinned list
- `PIN_ROW_BOTTOM`: Add a row to the bottom pinned list
- `UNPIN_ROW`: Remove a row from both pinned lists

### Row Separation Logic

The DataGrid component separates rows into three groups in a memoized calculation:

1. **Pinned Top Rows**: Rows whose IDs are in `state.pinnedRowsTop`
2. **Unpinned Rows**: Regular rows that are sorted, filtered, and paginated
3. **Pinned Bottom Rows**: Rows whose IDs are in `state.pinnedRowsBottom`

This separation happens AFTER sorting and filtering, ensuring:
- Pinned rows maintain their order
- Unpinned rows are sorted correctly
- Filters apply to all rows
- Pagination only affects unpinned rows

## Implementation Details

### 1. Type Definitions (types.ts)

```typescript
export interface RowPinConfig {
  enabled: boolean;
  showPinButton?: boolean;
  maxPinnedTop?: number;
  maxPinnedBottom?: number;
  onPinChange?: (pinnedTop: (string | number)[], pinnedBottom: (string | number)[]) => void;
}

// Added to GridState
interface GridState {
  // ... existing state
  pinnedRowsTop: (string | number)[];
  pinnedRowsBottom: (string | number)[];
}

// Added to GridAction
type GridAction = 
  // ... existing actions
  | { type: 'PIN_ROW_TOP'; payload: string | number }
  | { type: 'PIN_ROW_BOTTOM'; payload: string | number }
  | { type: 'UNPIN_ROW'; payload: string | number };
```

### 2. Reducer Actions (gridReducer.ts)

```typescript
case 'PIN_ROW_TOP': {
  const rowId = action.payload;
  // Remove from bottom if already there
  const pinnedRowsBottom = state.pinnedRowsBottom.filter(id => id !== rowId);
  // Add to top if not already there
  const pinnedRowsTop = state.pinnedRowsTop.includes(rowId)
    ? state.pinnedRowsTop
    : [...state.pinnedRowsTop, rowId];
  
  return { ...state, pinnedRowsTop, pinnedRowsBottom };
}

case 'PIN_ROW_BOTTOM': {
  const rowId = action.payload;
  // Remove from top if already there
  const pinnedRowsTop = state.pinnedRowsTop.filter(id => id !== rowId);
  // Add to bottom if not already there
  const pinnedRowsBottom = state.pinnedRowsBottom.includes(rowId)
    ? state.pinnedRowsBottom
    : [...state.pinnedRowsBottom, rowId];
  
  return { ...state, pinnedRowsTop, pinnedRowsBottom };
}

case 'UNPIN_ROW': {
  const rowId = action.payload;
  return {
    ...state,
    pinnedRowsTop: state.pinnedRowsTop.filter(id => id !== rowId),
    pinnedRowsBottom: state.pinnedRowsBottom.filter(id => id !== rowId),
  };
}
```

### 3. Row Separation (DataGrid.tsx)

```typescript
// Separate pinned and unpinned rows
const { pinnedRowsTopData, pinnedRowsBottomData, unpinnedRows } = useMemo(() => {
  const pinnedTopSet = new Set(state.pinnedRowsTop);
  const pinnedBottomSet = new Set(state.pinnedRowsBottom);
  
  const pinnedTop: (Row | GroupedRow)[] = [];
  const pinnedBottom: (Row | GroupedRow)[] = [];
  const unpinned: (Row | GroupedRow)[] = [];
  
  // Separate rows based on pinning status
  flattenedRows.forEach(row => {
    const rowId = 'id' in row ? row.id : ('groupKey' in row ? row.groupKey : null);
    if (rowId !== null) {
      if (pinnedTopSet.has(rowId)) {
        pinnedTop.push(row);
      } else if (pinnedBottomSet.has(rowId)) {
        pinnedBottom.push(row);
      } else {
        unpinned.push(row);
      }
    } else {
      unpinned.push(row);
    }
  });
  
  // Maintain order of pinned rows as stored in state
  const orderedPinnedTop = state.pinnedRowsTop
    .map(id => pinnedTop.find(row => getRowId(row) === id))
    .filter(row => row !== undefined);
  
  const orderedPinnedBottom = state.pinnedRowsBottom
    .map(id => pinnedBottom.find(row => getRowId(row) === id))
    .filter(row => row !== undefined);
  
  return {
    pinnedRowsTopData: orderedPinnedTop,
    pinnedRowsBottomData: orderedPinnedBottom,
    unpinnedRows: unpinned,
  };
}, [flattenedRows, state.pinnedRowsTop, state.pinnedRowsBottom]);
```

### 4. Rendering Pinned Rows (GridBody.tsx)

```typescript
// Render pinned rows with sticky positioning
const renderPinnedTopRows = () => {
  if (pinnedRowsTop.length === 0) return null;
  
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 15, backgroundColor: 'var(--grid-bg)' }}>
      {pinnedRowsTop.map((row, rowIndex) => renderRowContent(row, rowIndex))}
    </div>
  );
};

const renderPinnedBottomRows = () => {
  if (pinnedRowsBottom.length === 0) return null;
  
  return (
    <div style={{ position: 'sticky', bottom: 0, zIndex: 15, backgroundColor: 'var(--grid-bg)' }}>
      {pinnedRowsBottom.map((row, rowIndex) => 
        renderRowContent(row, rowIndex + rows.length + pinnedRowsTop.length)
      )}
    </div>
  );
};

// Virtual scrolling mode
return (
  <div>
    {renderPinnedTopRows()}
    <VirtualScroller items={rows} ... />
    {renderPinnedBottomRows()}
  </div>
);

// Non-virtual mode
return (
  <div>
    {renderPinnedTopRows()}
    {rows.map((row, index) => renderRowContent(row, index + pinnedRowsTop.length))}
    {renderPinnedBottomRows()}
  </div>
);
```

### 5. Context Menu Integration (useContextMenu.tsx)

```typescript
const buildCellMenuItems = (row: Row, column: Column) => {
  const rowId = row.id;
  const isPinnedTop = pinnedRowsTop.includes(rowId);
  const isPinnedBottom = pinnedRowsBottom.includes(rowId);
  const isPinned = isPinnedTop || isPinnedBottom;

  if (!isPinned) {
    items.push({
      id: 'pin-row-top',
      label: 'Pin Row to Top',
      icon: '📌',
      onClick: () => onPinRowTop(rowId),
    });
    items.push({
      id: 'pin-row-bottom',
      label: 'Pin Row to Bottom',
      icon: '📌',
      onClick: () => onPinRowBottom(rowId),
    });
  } else {
    items.push({
      id: 'unpin-row',
      label: 'Unpin Row',
      icon: '📍',
      onClick: () => onUnpinRow(rowId),
    });
  }
  
  // ... other menu items
};
```

## Usage Examples

### Basic Setup

```tsx
import { DataGrid} from './components/DataGrid';
import type { RowPinConfig } from './components/DataGrid';

const App = () => {
  const rowPinConfig: RowPinConfig = {
    enabled: true,
  };

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowPinConfig={rowPinConfig}
      contextMenuConfig={{ enabled: true }}
    />
  );
};
```

### With Callbacks

```tsx
const rowPinConfig: RowPinConfig = {
  enabled: true,
  maxPinnedTop: 5,
  maxPinnedBottom: 3,
  onPinChange: (pinnedTop, pinnedBottom) => {
    console.log('Pinned rows changed:', { pinnedTop, pinnedBottom });
    // Save to localStorage, state, or server
    localStorage.setItem('pinnedRows', JSON.stringify({ pinnedTop, pinnedBottom }));
  },
};
```

### With Virtual Scrolling

```tsx
const rowPinConfig: RowPinConfig = {
  enabled: true,
};

const virtualScrollConfig: VirtualScrollConfig = {
  enabled: true,
  rowHeight: 35,
  containerHeight: 600,
  overscanCount: 5,
};

<DataGrid
  columns={columns}
  rows={largeDataset}
  rowPinConfig={rowPinConfig}
  virtualScrollConfig={virtualScrollConfig}
/>
```

### Programmatic Control

```tsx
const MyGrid = () => {
  const [state, dispatch] = useReducer(gridReducer, initialState);

  const pinRowToTop = (rowId: string | number) => {
    dispatch({ type: 'PIN_ROW_TOP', payload: rowId });
  };

  const pinRowToBottom = (rowId: string | number) => {
    dispatch({ type: 'PIN_ROW_BOTTOM', payload: rowId });
  };

  const unpinRow = (rowId: string | number) => {
    dispatch({ type: 'UNPIN_ROW', payload: rowId });
  };

  return (
    <div>
      <button onClick={() => pinRowToTop(1)}>Pin Row 1 to Top</button>
      <button onClick={() => pinRowToBottom(100)}>Pin Row 100 to Bottom</button>
      <DataGrid ... />
    </div>
  );
};
```

## Feature Compatibility

### ✅ Fully Compatible

- **Sorting**: Pinned rows stay in position, unpinned rows sort normally
- **Filtering**: Both pinned and unpinned rows are filtered
- **Virtual Scrolling**: Pinned rows render outside virtual scroller
- **Pagination**: Pinned rows excluded from pagination
- **Column Pinning**: Works alongside column pinning
- **Row Selection**: Can select pinned rows
- **Cell Editing**: Can edit cells in pinned rows
- **Row Dragging**: Can drag unpinned rows (pinned rows not draggable)
- **Context Menu**: Full integration for pin/unpin operations
- **Keyboard Navigation**: Arrow keys work across pinned and unpinned rows

### Behavior Details

1. **Sorting Behavior**:
   - Pinned rows maintain their position and order
   - Only unpinned rows are sorted
   - Sorting direction applies to unpinned rows only

2. **Filtering Behavior**:
   - Filters apply to all rows (pinned and unpinned)
   - Pinned rows that don't match filters are removed from view
   - Unpinned rows that match filters are displayed normally

3. **Virtual Scrolling Behavior**:
   - Pinned rows render outside the VirtualScroller component
   - They're always visible and don't participate in virtualization
   - Row indices account for pinned rows in callbacks

4. **Pagination Behavior**:
   - Only unpinned rows are paginated
   - Pinned rows are visible on every page
   - Total row count excludes pinned rows

## Performance Considerations

- **Efficient Separation**: Row separation uses memoized calculations
- **Minimal Re-renders**: Pinned rows only re-render when they change
- **Virtual Scrolling**: Pinned rows don't affect virtual scroll performance
- **CSS Sticky**: Native browser sticky positioning for smooth scrolling
- **Memory Impact**: Minimal - only stores row IDs in state

### Best Practices

1. **Limit Pinned Rows**: Use `maxPinnedTop` and `maxPinnedBottom` to prevent too many pinned rows
2. **Monitor Performance**: With 1000+ rows, use virtual scrolling
3. **State Persistence**: Save pinned row state for user convenience
4. **Visual Indicators**: Consider highlighting pinned rows differently
5. **User Feedback**: Show count of pinned rows in UI

## Accessibility

- **Keyboard Navigation**: Full keyboard support across pinned and unpinned rows
- **Screen Readers**: Pinned rows announced correctly with ARIA attributes
- **Focus Management**: Focus works correctly when moving between sections

## Testing

Key test scenarios:
1. Pin row to top, verify position
2. Pin row to bottom, verify position
3. Sort unpinned rows, verify pinned rows stay in place
4. Filter rows, verify pinned rows respect filters
5. Enable virtual scrolling, verify pinned rows always visible
6. Paginate, verify pinned rows on all pages
7. Pin multiple rows, verify order maintained
8. Unpin row, verify it returns to correct position
9. Context menu operations work correctly
10. Keyboard navigation across pinned boundaries

## Known Limitations

1. **Row Dragging**: Pinned rows are not draggable (by design)
2. **Group Rows**: Cannot pin group header rows (only data rows)
3. **Z-Index**: May need adjustment if custom overlays are used
4. **Mobile**: Sticky positioning may have browser-specific behavior

## Future Enhancements

- Pin row button in row (when `showPinButton: true`)
- Drag to reorder pinned rows
- Pin limit enforcement with user feedback
- Animation when pinning/unpinning
- Visual separator between pinned and unpinned rows
- Bulk pin/unpin operations

## See Also

- [ROW_PINNING_QUICK_REF.md](./ROW_PINNING_QUICK_REF.md) - Quick reference guide
- [RowPinningDemo.tsx](./src/components/RowPinningDemo.tsx) - Interactive demo
- [CONTEXT_MENU_FEATURE.md](./CONTEXT_MENU_FEATURE.md) - Context menu integration
- [VIRTUAL_SCROLLING.md](./VIRTUAL_SCROLLING.md) - Virtual scrolling compatibility
