# Bug Fixes v1.7.2

## Issues Fixed

### 1. Pie Chart Colors Not Working
**Problem:** Pie chart was still showing all blue colors instead of using the new vibrant color palette.

**Root Cause:** The `QuickChart.tsx` component was using hardcoded old colors array:
```tsx
['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a28fd0'][index % 5]
```

**Solution:**
- Exported `DEFAULT_COLORS` from `rangeToChart.ts`
- Imported `DEFAULT_COLORS` into `QuickChart.tsx`
- Updated pie chart Cell component to use: `fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}`

### 2. Context Menu Submenu Not Rendering
**Problem:** Right-click context menu showed "Create Chart ▶" but no submenu appeared when clicked.

**Root Cause:** The `ContextMenu.tsx` component displayed the submenu arrow but didn't actually render the submenu items.

**Solution:**
- Added state tracking for open submenu: `const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null)`
- Updated `handleItemClick` to toggle submenu instead of executing onClick for items with submenus
- Modified `renderMenuItem` to:
  - Wrap items in `context-menu-item-wrapper` div
  - Conditionally render submenu when `openSubmenu === item.id`
  - Recursively call `renderMenuItem` for submenu items
- Added CSS styles for submenu positioning and animation:
  - `.context-menu-item-wrapper` for relative positioning
  - `.context-menu-submenu` for absolute positioning with slide-in animation
  - `.context-menu-item.has-submenu` for proper padding

## Files Modified

1. **src/charts/rangeToChart.ts**
   - Changed `const DEFAULT_COLORS` to `export const DEFAULT_COLORS`

2. **src/charts/QuickChart.tsx**
   - Added import: `import { DEFAULT_COLORS } from './rangeToChart';`
   - Updated pie chart cells to use `DEFAULT_COLORS`

3. **src/components/DataGrid/ContextMenu.tsx**
   - Added submenu state management
   - Implemented submenu rendering logic
   - Updated click handler for submenu toggle

4. **src/components/DataGrid/ContextMenu.css**
   - Added `.context-menu-item-wrapper` styles
   - Added `.context-menu-submenu` styles with animation
   - Added `.context-menu-item.has-submenu` styles

## Testing

To test the fixes:
1. Visit http://localhost:5174/demo/charts (or port shown in terminal)
2. **Test Pie Chart Colors:**
   - Select multiple rows
   - Click "Create Pie Chart" button (or use context menu)
   - Verify pie chart shows distinct colors: blue, green, amber, red, purple, pink, cyan, etc.
3. **Test Context Menu Submenu:**
   - Select one or more rows
   - Right-click on a selected row
   - Hover or click "Create Chart ▶"
   - Verify submenu appears with 4 options: Line Chart 📈, Bar Chart 📊, Area Chart 📉, Pie Chart 🥧
   - Click any chart type to create that chart

## Version Update

Update `package.json` version to `1.7.2` after testing confirms fixes work correctly.
