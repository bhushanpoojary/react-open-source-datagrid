# Context Menu Documentation Index

## Quick Links

- **🚀 Quick Start** → [Quick Reference](./CONTEXT_MENU_QUICK_REF.md)
- **📖 Full Documentation** → [Feature Guide](./CONTEXT_MENU_FEATURE.md)
- **📝 Implementation Details** → [Implementation Summary](./CONTEXT_MENU_IMPLEMENTATION_SUMMARY.md)
- **💻 Live Demo** → Run `npm run dev` and navigate to "Context Menu" in the sidebar

## What's Included

### Context Menu Features

The DataGrid context menu provides right-click access to:

**Cell Context Menu** (Right-click on any cell)
- Copy selected cells
- Copy with headers
- Export selected range to CSV
- Filter by cell value

**Header Context Menu** (Right-click on column headers)
- Pin column (left or right)
- Unpin column
- Auto-size this column
- Resize to fit
- Auto-size all columns
- Hide column
- Filter by value (shows unique values)

**Custom Actions**
- Add your own menu items
- Full control over appearance and behavior
- Dynamic menus based on context
- Separators and danger styling

### Configuration & Customization

- Enable/disable entire context menu
- Toggle individual feature groups
- Add custom menu items with icons
- Dynamic menu generation with `onBeforeShow`
- Full TypeScript support

## Documentation Files

### 1. Quick Reference
**File:** [CONTEXT_MENU_QUICK_REF.md](./CONTEXT_MENU_QUICK_REF.md)

Quick lookup for:
- Configuration options
- Available actions
- Code snippets
- Common patterns
- Usage tips

**Best for:** Quick answers and copy-paste examples

### 2. Full Feature Guide
**File:** [CONTEXT_MENU_FEATURE.md](./CONTEXT_MENU_FEATURE.md)

Comprehensive documentation covering:
- Feature overview and capabilities
- Basic and advanced usage
- Configuration reference
- Custom menu items guide
- API documentation
- Best practices
- Troubleshooting
- Examples and patterns

**Best for:** Learning the feature and understanding all options

### 3. Implementation Summary
**File:** [CONTEXT_MENU_IMPLEMENTATION_SUMMARY.md](./CONTEXT_MENU_IMPLEMENTATION_SUMMARY.md)

Technical details including:
- Implementation architecture
- Files created
- Integration points
- Type definitions
- Testing checklist
- Future enhancements

**Best for:** Developers working on the codebase

## Getting Started

### 1. Basic Setup (30 seconds)

```typescript
import { ThemedDataGrid } from './DataGrid';

<ThemedDataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={{ enabled: true }}
/>
```

That's it! Right-click on cells or headers to see the context menu.

### 2. Customize Features (2 minutes)

```typescript
const contextMenuConfig = {
  enabled: true,
  showCopy: true,           // Show copy options
  showExport: true,         // Show export options
  showColumnOptions: true,  // Show pin/hide/resize
  showFilterByValue: true,  // Show filter by value
};

<ThemedDataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={contextMenuConfig}
/>
```

### 3. Add Custom Actions (5 minutes)

```typescript
const contextMenuConfig = {
  enabled: true,
  customItems: [
    {
      id: 'my-action',
      label: 'My Custom Action',
      icon: '⭐',
      onClick: () => {
        console.log('Custom action clicked!');
      },
    },
  ],
};
```

### 4. Dynamic Menus (10 minutes)

```typescript
const contextMenuConfig = {
  enabled: true,
  onBeforeShow: (event) => {
    // Customize based on context
    if (event.type === 'cell' && event.row) {
      return [
        {
          label: `Action for ${event.row.name}`,
          onClick: () => handleAction(event.row),
        },
      ];
    }
    return null; // Use default menu
  },
};
```

## Examples

### Example 1: Minimal Setup
```typescript
<ThemedDataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={{ enabled: true }}
/>
```

### Example 2: Copy and Export Only
```typescript
<ThemedDataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={{
    enabled: true,
    showCopy: true,
    showExport: true,
    showColumnOptions: false,
    showFilterByValue: false,
  }}
/>
```

### Example 3: Custom Menu Items
```typescript
<ThemedDataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={{
    enabled: true,
    customItems: [
      {
        id: 'email',
        label: 'Send Email',
        icon: '📧',
        onClick: () => sendEmail(),
      },
      { type: 'separator' },
      {
        id: 'delete',
        label: 'Delete',
        icon: '🗑️',
        danger: true,
        onClick: () => confirmDelete(),
      },
    ],
  }}
/>
```

## Live Demo

To see the context menu in action:

```bash
npm run dev
```

Then navigate to **"Context Menu"** in the sidebar menu.

The demo includes:
- Interactive configuration toggles
- All built-in actions
- Custom menu items examples
- Live code examples
- Usage tips and patterns

## API Reference

### Main Types

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

## Features at a Glance

| Feature | Description | Configurable |
|---------|-------------|--------------|
| **Copy** | Copy cells to clipboard | ✅ Yes |
| **Copy with Headers** | Include column names | ✅ Yes |
| **Export Selected** | Download as CSV | ✅ Yes |
| **Pin Column** | Freeze to left/right | ✅ Yes |
| **Auto-size** | Fit column width | ✅ Yes |
| **Hide Column** | Remove from view | ✅ Yes |
| **Filter by Value** | Quick filtering | ✅ Yes |
| **Custom Items** | Your own actions | ✅ Yes |
| **Dynamic Menus** | Context-aware | ✅ Yes |
| **Keyboard Support** | Escape, Tab, Enter | Built-in |
| **Accessibility** | ARIA & screen readers | Built-in |
| **Theming** | Matches grid theme | Built-in |

## Support & Resources

- **Report Issues:** [GitHub Issues](https://github.com/bhushanpoojary/react-open-source-datagrid/issues)
- **View Source:** [GitHub Repository](https://github.com/bhushanpoojary/react-open-source-datagrid)
- **API Types:** [types.ts](./src/components/DataGrid/types.ts)
- **Implementation:** [ContextMenu.tsx](./src/components/DataGrid/ContextMenu.tsx)
- **Demo Code:** [ContextMenuDemo.tsx](./src/components/ContextMenuDemo.tsx)

## Version Information

- **Feature Version:** 1.0.0
- **Status:** ✅ Production Ready
- **Browser Support:** All modern browsers
- **Accessibility:** WCAG 2.1 Level AA

## Next Steps

1. **Try the demo** → `npm run dev` → Click "Context Menu"
2. **Read Quick Reference** → [CONTEXT_MENU_QUICK_REF.md](./CONTEXT_MENU_QUICK_REF.md)
3. **Explore examples** → [CONTEXT_MENU_FEATURE.md](./CONTEXT_MENU_FEATURE.md)
4. **Integrate into your app** → Copy examples and customize

---

**Questions?** Check the [Full Feature Guide](./CONTEXT_MENU_FEATURE.md) or the [Quick Reference](./CONTEXT_MENU_QUICK_REF.md).
