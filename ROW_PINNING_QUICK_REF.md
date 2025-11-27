# Row Pinning - Quick Reference

## Overview

Row pinning allows you to keep important rows visible at the top or bottom of the grid, regardless of sorting, filtering, or scrolling. Pinned rows use sticky positioning and remain visible at all times.

## Basic Usage

```tsx
import { DataGrid} from './components/DataGrid';
import type { RowPinConfig } from './components/DataGrid';

const rowPinConfig: RowPinConfig = {
  enabled: true,
  onPinChange: (pinnedTop, pinnedBottom) => {
    console.log('Pinned rows:', { pinnedTop, pinnedBottom });
  },
};

<DataGrid
  columns={columns}
  rows={rows}
  rowPinConfig={rowPinConfig}
  contextMenuConfig={{ enabled: true }}
/>
```

## Configuration Options

```typescript
interface RowPinConfig {
  enabled: boolean;                 // Enable row pinning
  showPinButton?: boolean;          // Show pin button in row (default: false)
  maxPinnedTop?: number;            // Max rows at top (default: unlimited)
  maxPinnedBottom?: number;         // Max rows at bottom (default: unlimited)
  onPinChange?: (                   // Called when pinned rows change
    pinnedTop: (string | number)[], 
    pinnedBottom: (string | number)[]
  ) => void;
}
```

## User Interaction

### Context Menu (Default)
1. Right-click on any row
2. Select "Pin Row to Top" or "Pin Row to Bottom"
3. Right-click pinned row and select "Unpin Row" to remove

### Programmatic Control

```tsx
import { useReducer } from 'react';
import { gridReducer, createInitialState } from './components/DataGrid/gridReducer';

const [state, dispatch] = useReducer(gridReducer, initialState);

// Pin a row to the top
dispatch({ type: 'PIN_ROW_TOP', payload: rowId });

// Pin a row to the bottom
dispatch({ type: 'PIN_ROW_BOTTOM', payload: rowId });

// Unpin a row
dispatch({ type: 'UNPIN_ROW', payload: rowId });
```

## Features

### ✅ Fully Compatible With

- **Sorting**: Pinned rows stay in position while unpinned rows are sorted
- **Filtering**: Pinned rows remain visible even when filters are active
- **Virtual Scrolling**: Pinned rows render outside virtual scroller
- **Pagination**: Pinned rows are excluded from pagination
- **Column Pinning**: Works alongside column pinning
- **Row Selection**: Can select pinned rows
- **Cell Editing**: Can edit cells in pinned rows

### Behavior Details

1. **Position Priority**: 
   - Top pinned rows appear first
   - Regular rows appear in the middle
   - Bottom pinned rows appear last

2. **Sorting/Filtering**:
   - Pinned rows are separated from unpinned rows before sorting
   - Sorting applies only to unpinned rows
   - Pinned rows maintain their pinning order

3. **Virtual Scrolling**:
   - Pinned rows render outside the virtual scroller
   - They remain visible at all times
   - Don't affect virtual scroll calculations

4. **Pagination**:
   - Only unpinned rows are paginated
   - Pinned rows are always visible on every page

## Common Use Cases

### Financial Reports
```tsx
// Pin header/category rows to top, totals to bottom
const pinnedRows = {
  top: [headerRowId, categoryRowId],
  bottom: [totalRowId, grandTotalRowId]
};
```

### Trading Dashboard
```tsx
// Pin most important stocks to top
const rowPinConfig: RowPinConfig = {
  enabled: true,
  maxPinnedTop: 5, // Limit to top 5 stocks
};
```

### Team Management
```tsx
// Pin team leads and VIPs to top
dispatch({ type: 'PIN_ROW_TOP', payload: teamLeadId });
dispatch({ type: 'PIN_ROW_TOP', payload: vipEmployeeId });
```

## Example: Complete Implementation

```tsx
import React, { useMemo, useState } from 'react';
import { DataGrid} from './components/DataGrid';
import type { Column, Row, RowPinConfig } from './components/DataGrid';

export const RowPinningExample: React.FC = () => {
  const [pinnedTop, setPinnedTop] = useState<(string | number)[]>([]);
  const [pinnedBottom, setPinnedBottom] = useState<(string | number)[]>([]);

  const columns: Column[] = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80, sortable: true },
    { field: 'name', headerName: 'Name', width: 200, sortable: true },
    { field: 'value', headerName: 'Value', width: 120, sortable: true },
  ], []);

  const rows: Row[] = useMemo(() => [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
    { id: 3, name: 'Item 3', value: 300 },
    // ... more rows
  ], []);

  const rowPinConfig: RowPinConfig = {
    enabled: true,
    maxPinnedTop: 3,
    maxPinnedBottom: 2,
    onPinChange: (newPinnedTop, newPinnedBottom) => {
      setPinnedTop(newPinnedTop);
      setPinnedBottom(newPinnedBottom);
      console.log('Pinned state:', { top: newPinnedTop, bottom: newPinnedBottom });
    },
  };

  return (
    <div>
      <div>
        <h3>Pinned to Top: {pinnedTop.length} rows</h3>
        <h3>Pinned to Bottom: {pinnedBottom.length} rows</h3>
      </div>
      
      <DataGrid
        columns={columns}
        rows={rows}
        rowPinConfig={rowPinConfig}
        contextMenuConfig={{ enabled: true }}
        pageSize={20}
      />
    </div>
  );
};
```

## With Virtual Scrolling

```tsx
const rowPinConfig: RowPinConfig = {
  enabled: true,
};

const virtualScrollConfig: VirtualScrollConfig = {
  enabled: true,
  rowHeight: 35,
  containerHeight: 600,
};

<DataGrid
  columns={columns}
  rows={largeDataset}
  rowPinConfig={rowPinConfig}
  virtualScrollConfig={virtualScrollConfig}
/>
```

## Styling

Pinned rows use the same styling as regular rows but have:
- `position: sticky`
- `top: 0` (for top-pinned rows)
- `bottom: 0` (for bottom-pinned rows)
- `zIndex: 15` (to appear above regular rows)
- `backgroundColor: var(--grid-bg)` (to prevent transparency)

### Custom Styling

You can customize pinned rows by targeting them with CSS or using a custom cell renderer:

```tsx
const columns: Column[] = [
  {
    field: 'name',
    headerName: 'Name',
    renderCell: (row) => {
      const isPinned = pinnedRowIds.includes(row.id);
      return (
        <div style={{ 
          fontWeight: isPinned ? 'bold' : 'normal',
          color: isPinned ? 'var(--grid-primary)' : 'inherit'
        }}>
          {row.name}
        </div>
      );
    },
  },
];
```

## State Management

Row pinning state is stored in the grid reducer:

```typescript
interface GridState {
  // ... other state
  pinnedRowsTop: (string | number)[];      // Row IDs pinned to top
  pinnedRowsBottom: (string | number)[];   // Row IDs pinned to bottom
}
```

The pinning order is preserved based on the order in these arrays.

## Performance Considerations

- **Minimal Impact**: Pinned rows don't affect virtual scrolling performance
- **Separation Logic**: Row separation happens in a memoized function
- **Efficient Rendering**: Pinned rows only re-render when they change
- **Sticky CSS**: Uses native CSS sticky positioning for smooth scrolling

## Tips

1. **Limit Pinned Rows**: Use `maxPinnedTop` and `maxPinnedBottom` to prevent too many pinned rows
2. **Visual Indicators**: Consider adding visual styling to differentiate pinned rows
3. **Context Menu**: Enable context menu for easy user interaction
4. **State Persistence**: Save pinned row state to localStorage or server
5. **Testing**: Test with sorting, filtering, and virtual scrolling enabled

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pinned rows disappear | Check `rowPinConfig.enabled` is `true` |
| Can't pin rows | Enable context menu with `contextMenuConfig.enabled` |
| Pinned rows scroll away | Ensure `position: sticky` CSS is applied |
| Pinned rows overlap header | Adjust z-index or header positioning |
| Performance issues | Use virtual scrolling and limit pinned rows |

## See Also

- [CONTEXT_MENU_QUICK_REF.md](./CONTEXT_MENU_QUICK_REF.md) - Context menu integration
- [VIRTUAL_SCROLLING_QUICK_REF.md](./VIRTUAL_SCROLLING_QUICK_REF.md) - Virtual scrolling
- [RowPinningDemo.tsx](./src/components/RowPinningDemo.tsx) - Complete demo
