# Context Menu Quick Reference

## Enable Context Menu

```typescript
<DataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={{ enabled: true }}
/>
```

## Cell Context Menu Actions

| Action | Description | Keyboard |
|--------|-------------|----------|
| **Copy** | Copy selected cells to clipboard | - |
| **Copy with Headers** | Include column headers | - |
| **Export Selected Range** | Download selection as CSV | - |
| **Filter by "value"** | Quick filter by cell value | - |

## Header Context Menu Actions

| Action | Description |
|--------|-------------|
| **Pin Left** | Pin column to left side |
| **Pin Right** | Pin column to right side |
| **Unpin Column** | Remove column pinning |
| **Auto-size This Column** | Fit column to content |
| **Resize to Fit** | Same as auto-size |
| **Auto-size All Columns** | Fit all columns to content |
| **Hide Column** | Hide column (use Column Chooser to show) |
| **Filter by Value** | Show unique values for filtering |

## Configuration Options

```typescript
interface ContextMenuConfig {
  enabled?: boolean;              // Default: true
  showCopy?: boolean;             // Default: true
  showExport?: boolean;           // Default: true
  showColumnOptions?: boolean;    // Default: true
  showFilterByValue?: boolean;    // Default: true
  customItems?: ContextMenuItem[];
  onBeforeShow?: (event: ContextMenuEvent) => ContextMenuItem[] | null;
}
```

## Custom Menu Items

```typescript
const customItems: ContextMenuItem[] = [
  {
    id: 'my-action',
    label: 'My Action',
    icon: '⭐',
    onClick: () => console.log('Clicked!'),
  },
  {
    type: 'separator', // Divider line
  },
  {
    id: 'danger-action',
    label: 'Delete',
    icon: '🗑️',
    danger: true, // Red styling
    onClick: () => console.log('Delete!'),
  },
];

<DataGrid
  contextMenuConfig={{ customItems }}
/>
```

## Dynamic Customization

```typescript
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  onBeforeShow: (event) => {
    // Customize based on context
    if (event.type === 'cell' && event.row?.status === 'Inactive') {
      return [
        {
          id: 'activate',
          label: 'Activate',
          onClick: () => activate(event.row),
        },
      ];
    }
    return null; // Use default menu
  },
};
```

## Disable Specific Features

```typescript
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  showCopy: true,
  showExport: false,        // Hide export
  showColumnOptions: true,
  showFilterByValue: false, // Hide filter
};
```

## Disable All Context Menus

```typescript
const contextMenuConfig: ContextMenuConfig = {
  enabled: false,
};
```

## Usage Tips

1. **Select multiple rows** (Ctrl/Cmd+Click) before right-clicking for batch operations
2. **Right-click headers** for column management options
3. **Use "Auto-size All"** to optimize all column widths at once
4. **Filter by value** provides quick access to filtering without using filter row
5. **Custom items** appear at the end of the menu (or use `onBeforeShow` for full control)

## Keyboard Support

- **Escape** - Close menu
- **Tab** - Navigate items
- **Enter** - Activate item

## Events

```typescript
interface ContextMenuEvent {
  type: 'cell' | 'header' | 'row';
  row?: Row;              // Available for cell context
  column?: Column;        // Available for cell/header context
  rowIndex?: number;      // Available for cell context
  columnIndex?: number;   // Available for cell/header context
  event: React.MouseEvent; // Original event
}
```

## Common Patterns

### Copy Workflow
```
1. Select rows (Ctrl+Click)
2. Right-click → "Copy" or "Copy with Headers"
3. Paste in Excel/Google Sheets
```

### Column Management
```
1. Right-click header
2. Choose action:
   - Pin Left/Right
   - Auto-size
   - Hide
   - Filter by Value
```

### Custom Actions
```typescript
customItems: [
  {
    id: 'email',
    label: 'Send Email',
    icon: '📧',
    onClick: () => {
      const selected = getSelectedRows();
      sendEmail(selected);
    },
  },
]
```

## See Also

- [Full Documentation](./CONTEXT_MENU_FEATURE.md)
- [Demo Component](./src/components/ContextMenuDemo.tsx)
- [API Types](./src/components/DataGrid/types.ts)
