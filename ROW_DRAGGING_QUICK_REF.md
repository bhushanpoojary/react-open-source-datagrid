# Row Dragging Quick Reference

## Basic Setup

```tsx
import { DataGrid } from './components/DataGrid';
import { useState } from 'react';

const [rows, setRows] = useState(myData);

<DataGrid
  columns={columns}
  rows={rows}
  dragRowConfig={{ enabled: true }}
  onRowReorder={(reorderedRows) => setRows(reorderedRows)}
/>
```

## Configuration Options

```typescript
dragRowConfig={{
  enabled: true,                      // Turn on/off
  showDragHandle: true,               // Show grip icon
  dragHandlePosition: 'left',         // 'left' | 'right'
  allowCrossGroup: false,             // Drag across groups
  allowExternalDrop: false,           // Accept external drops
  
  // Callbacks
  onDragStart: (row, index) => {},
  onDragEnd: () => {},
  onRowDrop: (srcIdx, tgtIdx, row) => {},
  onRowMove: (srcIdx, tgtIdx) => {},
  onExternalDrop: (data, index) => {},
}}
```

## Common Patterns

### 1. Simple Reordering

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  dragRowConfig={{ enabled: true }}
  onRowReorder={setRows}
/>
```

### 2. Cross-Table Drag

```tsx
// Table 1
<DataGrid
  tableId="list1"
  dragRowConfig={{
    enabled: true,
    allowExternalDrop: true,
    onExternalDrop: (data, targetIdx) => {
      const row = JSON.parse(data);
      // Handle row from another table
    },
  }}
  onRowReorder={setList1}
/>

// Table 2
<DataGrid
  tableId="list2"
  dragRowConfig={{
    enabled: true,
    allowExternalDrop: true,
    onExternalDrop: (data, targetIdx) => {
      const row = JSON.parse(data);
      // Handle row from another table
    },
  }}
  onRowReorder={setList2}
/>
```

### 3. Event Tracking

```tsx
<DataGrid
  dragRowConfig={{
    enabled: true,
    onDragStart: (row, idx) => console.log('Start', row),
    onDragEnd: () => console.log('End'),
    onRowMove: (src, tgt) => console.log(`${src} → ${tgt}`),
  }}
  onRowReorder={(rows) => {
    setRows(rows);
    saveToBackend(rows); // Persist changes
  }}
/>
```

### 4. Right-Side Handle

```tsx
<DataGrid
  dragRowConfig={{
    enabled: true,
    dragHandlePosition: 'right',
  }}
  onRowReorder={setRows}
/>
```

### 5. No Handle (Full Row Drag)

```tsx
<DataGrid
  dragRowConfig={{
    enabled: true,
    showDragHandle: false,
  }}
  onRowReorder={setRows}
/>
```

## Visual Indicators

| State | Visual Feedback |
|-------|-----------------|
| Default | Six-dot grip icon (gray) |
| Hover | Blue color + background |
| Dragging | Opacity 50% |
| Drop Before | Top border (blue) |
| Drop After | Bottom border (blue) |

## Key Props

| Prop | Type | Purpose |
|------|------|---------|
| `dragRowConfig` | `DragRowConfig` | Enable & configure dragging |
| `tableId` | `string` | Unique ID for multi-table |
| `onRowReorder` | `(rows) => void` | Get reordered rows |

## Event Callbacks

```typescript
// When drag starts
onDragStart: (row: Row, rowIndex: number) => void

// When drag ends (regardless of drop)
onDragEnd: () => void

// When row is dropped (includes row data)
onRowDrop: (sourceIndex: number, targetIndex: number, row: Row) => void

// When row position changes
onRowMove: (sourceIndex: number, targetIndex: number) => void

// When external data is dropped
onExternalDrop: (data: any, targetIndex: number) => void
```

## Utility Functions

```typescript
import { reorderRows } from './dragRowUtils';

// Manually reorder an array
const newRows = reorderRows(rows, sourceIndex, targetIndex);
```

## CSS Customization

```css
:root {
  --grid-primary: #3b82f6;           /* Drop indicator color */
  --drag-handle-size: 20px;          /* Icon size */
  --drop-indicator-width: 2px;       /* Border thickness */
}

.drag-handle {
  cursor: grab;
  opacity: 0.4;
  transition: all 0.2s ease;
}

.drag-handle:hover {
  opacity: 1;
  color: var(--grid-primary);
}
```

## Use Cases

- ✅ Task prioritization
- ✅ Sprint planning (backlog → sprint)
- ✅ File/folder organization
- ✅ Playlist management
- ✅ Form field ordering
- ✅ Kanban boards

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Drag not working | Set `dragRowConfig.enabled: true` |
| Cross-table not working | Add unique `tableId` to each grid |
| No drop indicator | Ensure `allowExternalDrop: true` on target |
| Performance issues | Enable virtual scrolling |

## Best Practices

1. **Unique tableId**: Always provide `tableId` for multi-table scenarios
2. **Persist changes**: Save reordered rows to backend/localStorage
3. **Loading states**: Disable drag during data loading
4. **Error handling**: Wrap external drop parsing in try/catch
5. **Performance**: Use `onRowReorder` instead of `onRowMove` for large lists

## Complete Example

```tsx
import { DataGrid } from './components/DataGrid';
import { useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, task: 'Design mockups', priority: 'High' },
    { id: 2, task: 'Code review', priority: 'Medium' },
    { id: 3, task: 'Update docs', priority: 'Low' },
  ]);

  const handleReorder = (reorderedRows) => {
    setTasks(reorderedRows);
    
    // Optional: Persist to backend
    fetch('/api/tasks/reorder', {
      method: 'POST',
      body: JSON.stringify({ tasks: reorderedRows }),
    });
  };

  return (
    <DataGrid
      columns={[
        { field: 'task', headerName: 'Task', width: 200 },
        { field: 'priority', headerName: 'Priority', width: 100 },
      ]}
      rows={tasks}
      dragRowConfig={{
        enabled: true,
        showDragHandle: true,
        dragHandlePosition: 'left',
        onDragStart: (row) => console.log('Dragging:', row.task),
      }}
      onRowReorder={handleReorder}
    />
  );
}
```

## Related Docs

- [Full Feature Documentation](./ROW_DRAGGING_FEATURE.md)
- [Demo Component](../src/components/RowDraggingDemo.tsx)
- [API Types](../src/components/DataGrid/types.ts)
