# Column Chooser / Show-Hide Columns Feature

## Overview
The Column Chooser feature allows users to control column visibility and reorder columns in the DataGrid. It's integrated into the toolbar area for easy access.

## Features

### 1. **Checkboxes for Column Visibility**
- Each column has a checkbox to toggle its visibility
- At least one column must remain visible (last visible column cannot be hidden)
- Visual feedback shows which columns are visible/hidden with eye icons

### 2. **Drag to Reorder**
- Drag any column item to reorder columns in the grid
- Visual feedback during drag operation with highlighted drop zones
- Changes reflect immediately in the grid

### 3. **Toggle Visibility**
- Click checkboxes or the entire row to toggle column visibility
- Hidden columns are indicated with a "closed eye" icon
- Visible columns are indicated with an "open eye" icon

### 4. **Reset Layout**
- "Reset Layout" button restores original column order
- Shows all columns
- Resets column widths to defaults
- Removes any column pinning

### 5. **Column Counter**
- Shows "X of Y visible" to track how many columns are displayed
- Updates in real-time as you toggle columns

## Usage

### Basic Implementation
The ColumnChooser is automatically integrated into the DataGrid toolbar:

```tsx
import { DataGrid } from './components/DataGrid';

<DataGrid
  columns={columns}
  rows={rows}
  pageSize={20}
/>
```

### Programmatic Access
You can also use the ColumnChooser component standalone:

```tsx
import { ColumnChooser } from './components/DataGrid';

<ColumnChooser
  columns={columns}
  columnOrder={columnOrder}
  hiddenColumns={hiddenColumns}
  onToggleVisibility={(field) => console.log('Toggle', field)}
  onReorderColumns={(from, to) => console.log('Reorder', from, to)}
  onResetLayout={() => console.log('Reset layout')}
/>
```

## User Interface

### Toolbar Button
- Located in the top toolbar of the DataGrid
- Icon shows stacked columns
- Label: "Columns"
- Opens a dropdown panel when clicked

### Dropdown Panel
- **Header**: Shows "Column Visibility" title and visible count
- **Reset Button**: Top-right corner for quick layout reset
- **Column List**: Scrollable list of all columns with:
  - Drag handle icon (for reordering)
  - Checkbox (for visibility toggle)
  - Column name
  - Eye icon (visual indicator)
- **Footer**: Tips and "Done" button

## Keyboard & Mouse Interactions

### Mouse Interactions
- **Click Button**: Open/close the column chooser panel
- **Click Checkbox**: Toggle column visibility
- **Drag Column Item**: Reorder columns
- **Click Reset**: Restore original layout
- **Click Outside Panel**: Close the panel

### Drag & Drop
1. Click and hold on any column item
2. Drag up or down to desired position
3. Visual indicator shows drop target
4. Release to apply new order

## State Management

### GridState Updates
The feature adds a new `hiddenColumns` property to GridState:

```typescript
interface GridState {
  // ... other properties
  hiddenColumns: string[]; // Array of hidden column field names
}
```

### Actions
Two new actions are available:

```typescript
// Toggle a column's visibility
dispatch({ 
  type: 'TOGGLE_COLUMN_VISIBILITY', 
  payload: 'columnField' 
});

// Reset entire layout
dispatch({ 
  type: 'RESET_COLUMN_LAYOUT' 
});
```

## Implementation Details

### Files Added
- `src/components/DataGrid/ColumnChooser.tsx` - Main component

### Files Modified
- `src/components/DataGrid/types.ts` - Added `hiddenColumns` to GridState and new action types
- `src/components/DataGrid/gridReducer.ts` - Added action handlers and initialized `hiddenColumns`
- `src/components/DataGrid/DataGrid.tsx` - Integrated ColumnChooser in toolbar and filtered hidden columns
- `src/components/DataGrid/index.ts` - Exported ColumnChooser component

### Column Filtering Logic
Hidden columns are filtered out before rendering:

```typescript
const hiddenSet = new Set(state.hiddenColumns);
const visibleColumnOrder = state.columnOrder.filter(
  field => !hiddenSet.has(field)
);
```

## Styling
The component uses Tailwind CSS classes for styling:
- Dropdown panel with shadow and border
- Hover effects on interactive elements
- Smooth transitions for drag operations
- Responsive design that adapts to content

## Best Practices

1. **Always Keep One Column Visible**: The component prevents hiding the last visible column
2. **Use Reset When Confused**: If column layout becomes complex, use "Reset Layout" to start fresh
3. **Combine with Pinning**: Hidden columns work seamlessly with column pinning
4. **Persist User Preferences**: Consider saving `hiddenColumns` state to localStorage for user preferences

## Example Scenarios

### Scenario 1: Hide Unnecessary Columns
```
1. Click "Columns" button
2. Uncheck columns you don't need
3. Click "Done" or outside to close
```

### Scenario 2: Reorder Important Columns
```
1. Click "Columns" button
2. Drag important columns to the top
3. Changes reflect immediately in grid
```

### Scenario 3: Reset After Experimentation
```
1. Click "Columns" button
2. Click "Reset Layout" in top-right
3. All columns visible in original order
```

## Future Enhancements

Possible improvements for future versions:
- Save/load column layouts by name
- Quick "Show All" / "Hide All" buttons
- Search/filter columns in the panel
- Column groups/categories
- Keyboard navigation within the panel
- Persist preferences to backend
