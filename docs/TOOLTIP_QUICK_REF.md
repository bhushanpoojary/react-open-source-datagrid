# Tooltip Feature - Quick Reference

## Overview
Row-level and cell-level tooltips with smart placement, delays, and support for both string and custom React content.

## Features
✅ **Cell-level tooltips** - Show tooltips on specific cells  
✅ **Row-level tooltips** - Show tooltips when hovering over row  
✅ **Smart placement** - Auto-adjust to stay within viewport (auto, top, bottom, left, right)  
✅ **Configurable delays** - Show/hide delays to prevent flickering  
✅ **Portal rendering** - Proper z-index layering using React portals  
✅ **Custom content** - Support for both string and React node content  
✅ **Responsive** - Auto-hides on scroll

## Basic Usage

<details open>
<summary><strong>TypeScript</strong></summary>

```tsx
import { DataGrid, type TooltipConfig } from 'react-open-source-grid';

const tooltipConfig: TooltipConfig = {
  enabled: true,
  showDelay: 500,          // ms before showing tooltip
  hideDelay: 200,          // ms before hiding tooltip
  placement: 'auto',       // 'auto' | 'top' | 'bottom' | 'left' | 'right'
  maxWidth: 300,           // max tooltip width in pixels
  offset: 8,               // offset from target element in pixels
  
  // Cell-level tooltip callback
  getCellTooltip: (row, column, value) => {
    if (column.field === 'price') {
      return `Current price: $${row.price}`;
    }
    return null; // No tooltip
  },
  
  // Row-level tooltip callback
  getRowTooltip: (row) => {
    return `Row ID: ${row.id}`;
  }
};

<DataGrid
  columns={columns}
  rows={data}
  tooltipConfig={tooltipConfig}
/>
```

</details>

<details>
<summary><strong>JavaScript</strong></summary>

```jsx
import { DataGrid } from 'react-open-source-grid';

const tooltipConfig = {
  enabled: true,
  showDelay: 500,          // ms before showing tooltip
  hideDelay: 200,          // ms before hiding tooltip
  placement: 'auto',       // 'auto' | 'top' | 'bottom' | 'left' | 'right'
  maxWidth: 300,           // max tooltip width in pixels
  offset: 8,               // offset from target element in pixels
  
  // Cell-level tooltip callback
  getCellTooltip: (row, column, value) => {
    if (column.field === 'price') {
      return `Current price: $${row.price}`;
    }
    return null; // No tooltip
  },
  
  // Row-level tooltip callback
  getRowTooltip: (row) => {
    return `Row ID: ${row.id}`;
  }
};

<DataGrid
  columns={columns}
  rows={data}
  tooltipConfig={tooltipConfig}
/>
```

</details>

## String Tooltips

Simple string tooltips with multi-line support:

```tsx
getCellTooltip: (row, column) => {
  if (column.field === 'symbol') {
    return `${row.symbol} - ${row.company}`;
  }
  
  // Multi-line with \n
  if (column.field === 'price') {
    return `Current: $${row.price}\nHigh: $${row.high}\nLow: $${row.low}`;
  }
  
  return null;
}
```

## Custom React Content

Return an object with `content` and optional `placement`:

```tsx
getCellTooltip: (row, column) => {
  if (column.field === 'change') {
    return {
      content: (
        <div>
          <strong>{row.change >= 0 ? 'Gain' : 'Loss'}</strong>
          <div style={{ color: row.change >= 0 ? 'green' : 'red' }}>
            {row.change.toFixed(2)}%
          </div>
        </div>
      ),
      placement: 'right' // Override default placement
    };
  }
  return null;
}
```

## Row-Level Tooltips

```tsx
getRowTooltip: (row) => {
  return {
    content: (
      <div>
        <strong>{row.name}</strong>
        <table>
          <tbody>
            <tr><td>ID:</td><td>{row.id}</td></tr>
            <tr><td>Status:</td><td>{row.status}</td></tr>
            <tr><td>Created:</td><td>{row.createdAt}</td></tr>
          </tbody>
        </table>
      </div>
    ),
    placement: 'right'
  };
}
```

## Configuration Options

### TooltipConfig Interface

```typescript
interface TooltipConfig {
  enabled: boolean;              // Enable/disable tooltips
  showDelay?: number;            // Delay before showing (default: 500ms)
  hideDelay?: number;            // Delay before hiding (default: 200ms)
  placement?: TooltipPlacement;  // Default placement (default: 'auto')
  maxWidth?: number;             // Max width in pixels (default: 300)
  offset?: number;               // Offset from target (default: 8px)
  
  getCellTooltip?: (
    row: Row,
    column: Column,
    value: any
  ) => string | TooltipContent | null;
  
  getRowTooltip?: (
    row: Row
  ) => string | TooltipContent | null;
}
```

### TooltipPlacement

```typescript
type TooltipPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right';
```

- `'auto'` - Smart placement based on available viewport space
- `'top'` - Always show above
- `'bottom'` - Always show below
- `'left'` - Always show to the left
- `'right'` - Always show to the right

### TooltipContent Interface

```typescript
interface TooltipContent {
  content: React.ReactNode;      // Custom React content
  placement?: TooltipPlacement;  // Override default placement
}
```

## Smart Placement Logic

When `placement: 'auto'` is used:

1. **Horizontal priority**: 
   - Prefers right if space available
   - Falls back to left if not enough space on right

2. **Vertical priority**:
   - Prefers bottom if space available
   - Falls back to top if not enough space below

3. **Viewport boundary detection**:
   - Automatically adjusts to keep tooltip visible
   - Considers tooltip dimensions and offset

## Best Practices

### Performance
- Return `null` from callbacks when no tooltip needed
- Keep tooltip content lightweight
- Use `showDelay` to prevent tooltips on quick mouse movements

### UX
- Use consistent delays across your application
- Use row tooltips for comprehensive row info
- Use cell tooltips for specific field details
- Keep tooltip content concise and scannable
- Use appropriate placement for dense grids

### Styling
- Tooltip uses CSS variables from theme system
- Default background: semi-transparent black
- Default text color: white
- Customize via theme or inline styles in custom content

## Examples

### Conditional Tooltips
```tsx
getCellTooltip: (row, column) => {
  // Only show tooltip for negative values
  if (column.field === 'profit' && row.profit < 0) {
    return `Loss: $${Math.abs(row.profit)}`;
  }
  return null;
}
```

### Dynamic Placement Based on Field
```tsx
getCellTooltip: (row, column) => {
  const content = `Value: ${row[column.field]}`;
  
  // First columns: tooltip on right
  if (column.field === 'id' || column.field === 'name') {
    return { content, placement: 'right' };
  }
  
  // Last columns: tooltip on left
  if (column.field === 'actions' || column.field === 'status') {
    return { content, placement: 'left' };
  }
  
  return content; // Auto placement for middle columns
}
```

### Combining Cell and Row Tooltips
```tsx
const tooltipConfig: TooltipConfig = {
  enabled: true,
  
  // Specific cell tooltips
  getCellTooltip: (row, column) => {
    if (column.field === 'price') {
      return `$${row.price} (${row.currency})`;
    }
    // No cell tooltip for other columns
    return null;
  },
  
  // Row tooltip as fallback
  getRowTooltip: (row) => {
    return `Click to view details for ${row.name}`;
  }
};
```

## Demo

View live demo at: `http://localhost:5173` → Customization → Tooltips

The demo showcases:
- String tooltips with multi-line support
- Custom React content with styled components
- Different placement strategies
- Configurable show/hide delays
- Row-level and cell-level tooltips

## Architecture

### Components
- **Tooltip.tsx** - Portal-based tooltip component with smart placement
- **useTooltip.tsx** - Hook managing tooltip state and hover detection
- **GridBody.tsx** - Integrates hover handlers on cells and rows
- **DataGrid.tsx** - Wires tooltip config to GridBody and renders Tooltip

### Flow
1. User hovers over cell/row
2. GridBody triggers `onCellMouseEnter` or `onRowMouseEnter`
3. useTooltip hook calls `getCellTooltip` or `getRowTooltip`
4. After `showDelay`, tooltip state updates
5. Tooltip component renders via portal with smart placement
6. On mouse leave, hides after `hideDelay`
7. Auto-hides on scroll

## Types Export

```tsx
import type { 
  TooltipConfig, 
  TooltipContent, 
  TooltipPlacement 
} from 'react-open-source-grid';
```

## Related Features
- **Context Menu** - Right-click menus on rows/cells
- **Cell Renderers** - Custom cell rendering
- **Theme System** - Consistent styling across features
