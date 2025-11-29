# Row Dragging & Reordering Feature

## Overview

The Row Dragging feature enables users to interactively reorder rows within a DataGrid by dragging and dropping them. This feature supports both simple in-table reordering and advanced cross-table drag-and-drop operations.

## Key Features

✅ **Drag to Reorder** - Drag rows up and down to change their order  
✅ **Visual Drag Handle** - Optional grip icon for explicit drag affordance  
✅ **Drop Indicators** - Visual feedback showing where rows will be dropped  
✅ **Cross-Table Drag** - Drag rows between multiple DataGrid instances  
✅ **External Drops** - Accept drops from external sources  
✅ **Event Callbacks** - Comprehensive lifecycle hooks for custom logic  
✅ **Smooth Animations** - CSS transitions for polished user experience  
✅ **Accessible** - Keyboard shortcuts and ARIA attributes (future enhancement)

## Basic Usage

### Simple Row Reordering

<details open>
<summary><b>TypeScript</b></summary>

```tsx
import { DataGrid } from 'react-open-source-grid';
import { useState } from 'react';

function MyComponent() {
  const [rows, setRows] = useState([
    { id: 1, name: 'Task A', priority: 'High' },
    { id: 2, name: 'Task B', priority: 'Medium' },
    { id: 3, name: 'Task C', priority: 'Low' },
  ]);

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      dragRowConfig={{
        enabled: true,
        showDragHandle: true,
      }}
      onRowReorder={(reorderedRows) => setRows(reorderedRows)}
    />
  );
}
```

</details>

<details>
<summary><b>JavaScript</b></summary>

```jsx
import { DataGrid } from 'react-open-source-grid';
import { useState } from 'react';

function MyComponent() {
  const [rows, setRows] = useState([
    { id: 1, name: 'Task A', priority: 'High' },
    { id: 2, name: 'Task B', priority: 'Medium' },
    { id: 3, name: 'Task C', priority: 'Low' },
  ]);

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      dragRowConfig={{
        enabled: true,
        showDragHandle: true,
      }}
      onRowReorder={(reorderedRows) => setRows(reorderedRows)}
    />
  );
}
```

</details>

## Configuration

### DragRowConfig Interface

```typescript
interface DragRowConfig {
  enabled: boolean;                    // Enable/disable drag functionality
  showDragHandle?: boolean;            // Show drag handle icon (default: true)
  allowCrossGroup?: boolean;           // Allow dragging across grouped rows (default: false)
  allowExternalDrop?: boolean;         // Accept drops from outside (default: false)
  dragHandlePosition?: 'left' | 'right'; // Handle position (default: 'left')
  
  // Event callbacks
  onDragStart?: (row: Row, rowIndex: number) => void;
  onDragEnd?: () => void;
  onRowDrop?: (sourceIndex: number, targetIndex: number, row: Row) => void;
  onRowMove?: (sourceIndex: number, targetIndex: number) => void;
  onExternalDrop?: (data: any, targetIndex: number) => void;
}
```

### DataGrid Props

```typescript
interface DataGridProps {
  // ... other props
  dragRowConfig?: DragRowConfig;       // Drag configuration
  tableId?: string;                    // Unique ID for multi-table scenarios
  onRowReorder?: (rows: Row[]) => void; // Callback with reordered rows
}
```

## Advanced Examples

### Example 1: Custom Event Handling

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  dragRowConfig={{
    enabled: true,
    showDragHandle: true,
    onDragStart: (row, index) => {
      console.log(`Dragging row ${index}:`, row);
      // Track analytics
      trackEvent('row_drag_start', { rowId: row.id });
    },
    onDragEnd: () => {
      console.log('Drag operation completed');
    },
    onRowMove: (sourceIndex, targetIndex) => {
      console.log(`Moved row from ${sourceIndex} to ${targetIndex}`);
      // Update backend
      apiUpdateRowOrder(sourceIndex, targetIndex);
    },
  }}
  onRowReorder={(reorderedRows) => {
    setRows(reorderedRows);
    // Persist to localStorage
    localStorage.setItem('rowOrder', JSON.stringify(reorderedRows));
  }}
/>
```

### Example 2: Cross-Table Drag & Drop

Perfect for Kanban boards, sprint planning, or any multi-list scenario:

```tsx
function SprintPlanning() {
  const [backlog, setBacklog] = useState(backlogItems);
  const [sprint, setSprint] = useState(sprintItems);

  const handleExternalDropToBacklog = (data: string, targetIndex: number) => {
    const droppedRow = JSON.parse(data);
    // Remove from sprint
    setSprint(prev => prev.filter(r => r.id !== droppedRow.id));
    // Add to backlog
    setBacklog(prev => {
      const newBacklog = [...prev];
      newBacklog.splice(targetIndex, 0, droppedRow);
      return newBacklog;
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Backlog Table */}
      <DataGrid
        columns={columns}
        rows={backlog}
        tableId="backlog"
        dragRowConfig={{
          enabled: true,
          allowExternalDrop: true,
          onExternalDrop: handleExternalDropToBacklog,
        }}
        onRowReorder={setBacklog}
      />

      {/* Sprint Table */}
      <DataGrid
        columns={columns}
        rows={sprint}
        tableId="sprint"
        dragRowConfig={{
          enabled: true,
          allowExternalDrop: true,
          onExternalDrop: handleExternalDropToSprint,
        }}
        onRowReorder={setSprint}
      />
    </div>
  );
}
```

### Example 3: Right-Positioned Drag Handle

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  dragRowConfig={{
    enabled: true,
    showDragHandle: true,
    dragHandlePosition: 'right', // Position handle on the right
  }}
  onRowReorder={setRows}
/>
```

### Example 4: No Drag Handle (Full Row Draggable)

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  dragRowConfig={{
    enabled: true,
    showDragHandle: false, // Entire row becomes draggable
  }}
  onRowReorder={setRows}
/>
```

## Visual Feedback

### Drag Handle States

The drag handle provides visual feedback:

- **Default**: Gray six-dot grip icon
- **Hover**: Blue color with light background
- **Dragging**: Cursor changes to `grabbing`

### Drop Indicators

When hovering over a drop target:

- **Before**: Blue border on top of the row
- **After**: Blue border on bottom of the row
- **Invalid**: No indicator shown for invalid drop targets

### Row States

During drag operations:

- **Dragging Row**: Opacity reduced to 50%
- **Drop Target**: Border indicator shows drop position
- **Other Rows**: Normal appearance

## Implementation Details

### Component Architecture

```
DataGrid
  └─ GridBody
      └─ DraggableRow (when dragRowConfig.enabled)
          └─ DragHandle (optional)
          └─ Row Content
```

### State Management

Drag state is managed through the grid reducer:

```typescript
interface DragState {
  isDragging: boolean;
  draggedRowId: string | number | null;
  draggedRowIndex: number | null;
  dropTargetIndex: number | null;
  dropPosition: 'before' | 'after' | null;
}
```

### Drag Data Transfer

Row data is transferred using the HTML5 Drag and Drop API:

```typescript
// Data format
{
  row: Row,           // The full row object
  rowIndex: number,   // Original index
  tableId?: string    // Source table identifier
}
```

### Utility Functions

Core utilities in `dragRowUtils.ts`:

- `createDragData()` - Serialize row data for transfer
- `parseDragData()` - Deserialize transferred data
- `getDropPosition()` - Calculate drop position based on mouse Y
- `reorderRows()` - Reorder array based on source and target indices
- `canDropRow()` - Validate if drop is allowed (future enhancement)

## Styling

### CSS Variables

Customize drag-related styles using CSS variables:

```css
:root {
  --grid-primary: #3b82f6;      /* Drop indicator color */
  --grid-hover: #f9fafb;        /* Hover background */
  --drag-handle-size: 20px;     /* Drag handle icon size */
  --drop-indicator-width: 2px;  /* Border width for drop zones */
}
```

### Custom Drag Handle

Override the drag handle appearance:

```tsx
.drag-handle {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  opacity: 0.4;
  transition: all 0.2s ease;
}

.drag-handle:hover {
  opacity: 1;
  color: var(--grid-primary);
  background-color: rgba(59, 130, 246, 0.05);
}
```

## Browser Compatibility

The Row Dragging feature uses the HTML5 Drag and Drop API:

- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 3.1+
- ✅ Edge (all versions)
- ⚠️ Mobile browsers have limited support (touch events need separate handling)

## Performance Considerations

1. **Large Lists**: For grids with 1000+ rows, consider:
   - Enabling virtual scrolling
   - Debouncing onRowMove callbacks
   - Using onRowReorder only (called once at the end)

2. **Complex Rows**: If rows contain heavy components:
   - Use React.memo for row components
   - Avoid re-rendering during drag (opacity changes only)

3. **Cross-Table Operations**: When dragging between tables:
   - Use tableId to differentiate sources
   - Batch state updates to minimize re-renders

## Accessibility (Future Enhancement)

Planned keyboard support:

- `Space` - Pick up / Drop row
- `↑` / `↓` - Move up / down
- `Esc` - Cancel drag operation
- `Tab` - Navigate between rows

## Common Use Cases

### 1. Task Prioritization
Reorder tasks by priority with visual indicators.

### 2. Sprint Planning
Drag features between backlog and sprint.

### 3. File Organization
Reorder files or folders in a file manager.

### 4. Playlist Management
Reorder songs in a music playlist.

### 5. Form Builder
Arrange form fields in desired order.

### 6. Kanban Board
Move cards between columns (To Do, In Progress, Done).

## Troubleshooting

### Drag Not Working

1. **Check dragRowConfig.enabled**: Must be `true`
2. **Verify row data**: Ensure rows have unique `id` field
3. **Check browser console**: Look for JavaScript errors

### Cross-Table Drag Not Working

1. **Verify tableId**: Each table must have a unique `tableId` prop
2. **Check allowExternalDrop**: Must be `true` on target table
3. **Implement onExternalDrop**: Required callback for handling external drops

### Performance Issues

1. **Enable virtual scrolling**: For large datasets
2. **Use onRowReorder instead of onRowMove**: Reduces callback frequency
3. **Memoize heavy components**: Use React.memo for row content

## API Reference

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `dragRowConfig` | `DragRowConfig` | No | Drag configuration object |
| `tableId` | `string` | No | Unique identifier for multi-table scenarios |
| `onRowReorder` | `(rows: Row[]) => void` | No | Callback with reordered rows array |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `onDragStart` | `(row: Row, rowIndex: number)` | Fired when drag starts |
| `onDragEnd` | `()` | Fired when drag ends |
| `onRowDrop` | `(sourceIndex, targetIndex, row)` | Fired when row is dropped |
| `onRowMove` | `(sourceIndex, targetIndex)` | Fired when row position changes |
| `onExternalDrop` | `(data: any, targetIndex)` | Fired when external data is dropped |

## Related Features

- **Virtual Scrolling** - Improves performance with large datasets
- **Row Selection** - Select multiple rows (future: bulk drag support)
- **Grouping** - Drag rows within/across groups (with `allowCrossGroup`)
- **Tree Data** - Drag nodes within tree hierarchies (future enhancement)

## Next Steps

1. Try the [RowDraggingDemo](../RowDraggingDemo.tsx) component
2. Check out [ROW_DRAGGING_QUICK_REF.md](./ROW_DRAGGING_QUICK_REF.md) for a condensed reference
3. Explore cross-table drag examples in the demo

## Changelog

- **v1.0.0** (Initial Release)
  - Basic drag and drop within single table
  - Visual drag handle with configurable position
  - Drop indicators
  - Cross-table drag support
  - Event callbacks for custom logic
  - onRowReorder helper callback
