# Context Menu Feature

## Overview

The DataGrid now includes a comprehensive right-click context menu system that provides quick access to common operations like copying data, exporting selections, managing columns, and filtering. The context menu is highly customizable and supports custom menu items.

## Features

### Cell Context Menu (Right-click on cells)

- **Copy** - Copy selected cells to clipboard (Tab-separated values)
- **Copy with Headers** - Copy selection with column headers
- **Export Selected Range** - Export selected rows to CSV file
- **Filter by Value** - Quick filter shortcut for the clicked cell value

### Header Context Menu (Right-click on column headers)

- **Pin Left/Pin Right** - Pin column to left or right side
- **Unpin Column** - Remove column pinning
- **Auto-size This Column** - Automatically resize column based on content
- **Resize to Fit** - Same as auto-size (alternative label)
- **Auto-size All Columns** - Automatically resize all columns to fit content
- **Hide Column** - Hide the column from view
- **Filter by Value** - Show unique values in column for quick filtering

## Basic Usage

<details open>
<summary><b>TypeScript</b></summary>

```typescript
import { DataGrid } from 'react-open-source-grid';
import type { Column, Row, ContextMenuConfig } from 'react-open-source-grid';

const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
];

const rows: Row[] = [
  { id: 1, name: 'Alice', email: 'alice@company.com' },
  { id: 2, name: 'Bob', email: 'bob@company.com' },
];

// Basic context menu (all features enabled)
<DataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={{ enabled: true }}
/>
```

</details>

<details>
<summary><b>JavaScript</b></summary>

```javascript
import { DataGrid } from 'react-open-source-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
];

const rows = [
  { id: 1, name: 'Alice', email: 'alice@company.com' },
  { id: 2, name: 'Bob', email: 'bob@company.com' },
];

// Basic context menu (all features enabled)
<DataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={{ enabled: true }}
/>
```

</details>

## Configuration

### ContextMenuConfig Interface

```typescript
interface ContextMenuConfig {
  enabled?: boolean;              // Enable/disable context menu (default: true)
  showCopy?: boolean;             // Show copy options (default: true)
  showExport?: boolean;           // Show export options (default: true)
  showColumnOptions?: boolean;    // Show pin/hide/resize options (default: true)
  showFilterByValue?: boolean;    // Show filter by value option (default: true)
  customItems?: ContextMenuItem[]; // Additional custom menu items
  onBeforeShow?: (event: ContextMenuEvent) => ContextMenuItem[] | null;
}
```

### Customizing Menu Options

```typescript
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  showCopy: true,           // Show copy/copy with headers
  showExport: true,         // Show export selected range
  showColumnOptions: true,  // Show pin/hide/resize options
  showFilterByValue: true,  // Show filter by value
};

<DataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={contextMenuConfig}
/>
```

### Disabling Specific Features

```typescript
// Only show copy and column options
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  showCopy: true,
  showExport: false,        // Disable export
  showColumnOptions: true,
  showFilterByValue: false, // Disable filter by value
};
```

### Disabling Context Menu Entirely

```typescript
// Disable context menu
const contextMenuConfig: ContextMenuConfig = {
  enabled: false,
};

// Or simply omit the prop (context menu is enabled by default)
```

## Custom Menu Items

### Adding Custom Menu Items

```typescript
const customMenuItems: ContextMenuItem[] = [
  {
    id: 'custom-action-1',
    label: 'Custom Action',
    icon: '⭐',
    onClick: () => {
      console.log('Custom action triggered!');
    },
  },
  {
    id: 'custom-action-2',
    label: 'Another Action',
    icon: '🎯',
    onClick: () => {
      console.log('Another action triggered!');
    },
  },
  {
    type: 'separator', // Add a separator line
  },
  {
    id: 'danger-action',
    label: 'Delete',
    icon: '🗑️',
    danger: true, // Red styling for dangerous actions
    onClick: () => {
      if (confirm('Are you sure?')) {
        console.log('Deleting...');
      }
    },
  },
];

const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  customItems: customMenuItems,
};
```

### ContextMenuItem Interface

```typescript
interface ContextMenuItem {
  id?: string;                    // Unique identifier
  label: string;                  // Display text
  icon?: React.ReactNode;         // Icon (emoji, SVG, etc.)
  onClick?: () => void;           // Click handler
  disabled?: boolean;             // Disable the item
  danger?: boolean;               // Red styling for dangerous actions
  type?: 'item' | 'separator';    // Item type
  shortcut?: string;              // Keyboard shortcut display
  submenu?: ContextMenuItem[];    // Nested submenu items
}
```

## Advanced Customization

### Dynamic Menu Customization

Use `onBeforeShow` to dynamically customize the menu based on the context:

```typescript
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  onBeforeShow: (event) => {
    // event.type: 'cell' | 'header' | 'row'
    // event.row: The clicked row (for cell context)
    // event.column: The clicked column
    // event.rowIndex: Row index
    // event.columnIndex: Column index
    // event.event: The original MouseEvent
    
    if (event.type === 'cell' && event.row) {
      // Customize menu for specific rows
      if (event.row.status === 'Inactive') {
        return [
          {
            id: 'activate',
            label: 'Activate User',
            icon: '✅',
            onClick: () => {
              console.log('Activating user:', event.row.id);
            },
          },
        ];
      }
      
      // Show different menu for high-value items
      if (event.row.salary > 100000) {
        return [
          {
            id: 'review',
            label: 'Schedule Review',
            icon: '📅',
            onClick: () => {
              console.log('Scheduling review for:', event.row.name);
            },
          },
        ];
      }
    }
    
    if (event.type === 'header' && event.column) {
      // Customize menu for specific columns
      if (event.column.field === 'salary') {
        return [
          {
            id: 'format-currency',
            label: 'Format as Currency',
            icon: '💰',
            onClick: () => {
              console.log('Formatting salary column');
            },
          },
          {
            id: 'show-stats',
            label: 'Show Statistics',
            icon: '📊',
            onClick: () => {
              console.log('Showing salary statistics');
            },
          },
        ];
      }
    }
    
    // Return null to use the default menu
    return null;
  },
};
```

### Context-Aware Custom Items

```typescript
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  customItems: [], // Will be set dynamically
  onBeforeShow: (event) => {
    const items: ContextMenuItem[] = [];
    
    // Add row-specific actions
    if (event.type === 'cell' && event.row) {
      items.push({
        id: 'view-details',
        label: `View Details for ${event.row.name}`,
        icon: '👁️',
        onClick: () => {
          console.log('Viewing details:', event.row);
        },
      });
      
      items.push({
        id: 'send-email',
        label: `Email ${event.row.email}`,
        icon: '📧',
        onClick: () => {
          window.location.href = `mailto:${event.row.email}`;
        },
      });
    }
    
    // Add column-specific actions
    if (event.type === 'header' && event.column) {
      items.push({
        id: 'sort-column',
        label: `Sort by ${event.column.headerName}`,
        icon: '🔀',
        onClick: () => {
          console.log('Sorting by:', event.column.field);
        },
      });
    }
    
    return items.length > 0 ? items : null;
  },
};
```

## Usage Patterns

### Copy and Export Workflow

1. **Single Cell**: Right-click on a cell → Click "Copy" to copy the cell value
2. **Multiple Cells**: Select multiple rows (Ctrl/Cmd+Click) → Right-click → "Copy" or "Copy with Headers"
3. **Export Selection**: Select rows → Right-click → "Export Selected Range" to download CSV

### Column Management Workflow

1. **Pin Column**: Right-click header → "Pin Left" or "Pin Right"
2. **Auto-size**: Right-click header → "Auto-size This Column" or "Resize to Fit"
3. **Auto-size All**: Right-click any header → "Auto-size All Columns"
4. **Hide Column**: Right-click header → "Hide Column" (use Column Chooser to show again)

### Quick Filtering Workflow

1. **Cell Filter**: Right-click on a cell → "Filter by 'value'" to filter column
2. **Header Filter**: Right-click header → "Filter by Value" → Select value from list

## Keyboard Support

The context menu supports keyboard navigation:

- **Escape** - Close the menu
- **Tab** - Navigate between items (when focused)
- **Enter** - Activate focused item

## Styling and Theming

The context menu automatically adapts to the grid's theme:

```css
/* Context menu CSS variables */
--context-menu-bg: #ffffff;
--context-menu-border: #d0d0d0;
--context-menu-text: #333333;
--context-menu-hover-bg: #f0f0f0;
--context-menu-active-bg: #e5e5e5;
--context-menu-separator: #e0e0e0;
--context-menu-shortcut: #888888;
--context-menu-danger: #dc3545;
```

The menu automatically adjusts for dark theme and respects the grid's theme configuration.

## Accessibility

The context menu is built with accessibility in mind:

- Proper ARIA roles and labels
- Keyboard navigation support
- Focus management
- Screen reader announcements
- High contrast mode support

## Best Practices

1. **Keep menus concise** - Don't overwhelm users with too many options
2. **Use clear labels** - Make action names descriptive and actionable
3. **Group related items** - Use separators to organize menu items
4. **Use icons sparingly** - Icons should enhance, not clutter
5. **Test on mobile** - Context menus may not work well on touch devices
6. **Provide alternatives** - Ensure actions are available through other UI elements

## Examples

### Example 1: Basic Context Menu

```typescript
<DataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={{ enabled: true }}
/>
```

### Example 2: Custom Menu Only

```typescript
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  showCopy: false,
  showExport: false,
  showColumnOptions: false,
  showFilterByValue: false,
  customItems: [
    {
      id: 'custom-1',
      label: 'My Action',
      onClick: () => console.log('Action!'),
    },
  ],
};
```

### Example 3: Conditional Menu

```typescript
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  onBeforeShow: (event) => {
    if (event.type === 'cell' && event.row?.status === 'Draft') {
      return [
        { id: 'publish', label: 'Publish', onClick: () => publish(event.row) },
        { id: 'delete', label: 'Delete', danger: true, onClick: () => deleteDraft(event.row) },
      ];
    }
    return null; // Use default menu
  },
};
```

## Troubleshooting

### Context menu not appearing

- Check that `contextMenuConfig.enabled` is `true` (or not set, as it defaults to true)
- Ensure you're using the `DataGrid` component
- Check browser console for errors

### Menu items not working

- Verify `onClick` handlers are defined for custom items
- Check that items are not marked as `disabled`
- Ensure the menu closes after clicking (default behavior)

### Menu positioned incorrectly

- The menu automatically adjusts to stay within viewport
- Check for CSS conflicts with `position: fixed` or `z-index`
- Ensure parent containers don't have `overflow: hidden`

## API Reference

### Types

```typescript
interface ContextMenuConfig {
  enabled?: boolean;
  showCopy?: boolean;
  showExport?: boolean;
  showColumnOptions?: boolean;
  showFilterByValue?: boolean;
  customItems?: ContextMenuItem[];
  onBeforeShow?: (event: ContextMenuEvent) => ContextMenuItem[] | null;
}

interface ContextMenuItem {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  type?: 'item' | 'separator';
  shortcut?: string;
  submenu?: ContextMenuItem[];
}

interface ContextMenuEvent {
  type: 'cell' | 'header' | 'row';
  row?: Row;
  column?: Column;
  rowIndex?: number;
  columnIndex?: number;
  event: React.MouseEvent;
}
```

## Demo

See the `ContextMenuDemo` component for a full interactive demonstration of all context menu features.

```typescript
// See the full demo in the examples section
// Context menu functionality is built into DataGrid via contextMenuConfig prop
```
