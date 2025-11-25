# Theme Integration - Migration Guide

## What Changed?

We've simplified the theme system by **integrating theme support directly into the `DataGrid` component**. You no longer need to use the `ThemedDataGrid` wrapper component.

## Benefits

✅ **Simpler API** - One component instead of two  
✅ **Less boilerplate** - No wrapper div needed  
✅ **Better DX** - More intuitive to use  
✅ **Consistent pattern** - Matches other popular UI libraries  
✅ **Fully backward compatible** - `ThemedDataGrid` still works as an alias

## Migration

### Before (Old Way)

```tsx
import { ThemedDataGrid } from './components/DataGrid';

function App() {
  return (
    <ThemedDataGrid
      columns={columns}
      rows={rows}
      theme="quartz"
    />
  );
}
```

### After (New Way - Recommended)

```tsx
import { DataGrid } from './components/DataGrid';

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      theme="quartz"  // Theme applied directly!
    />
  );
}
```

## No Breaking Changes

**Important:** `ThemedDataGrid` is now an alias to `DataGrid`, so all existing code continues to work without any changes. You can migrate at your own pace.

```tsx
// This still works! (but we recommend using DataGrid directly)
<ThemedDataGrid theme="nord" columns={columns} rows={rows} />

// Equivalent to:
<DataGrid theme="nord" columns={columns} rows={rows} />
```

## With Theme Selector

### Before

```tsx
import { ThemedDataGrid, ThemeSelector } from './components/DataGrid';
import { getTheme, generateThemeCSS } from './components/DataGrid/themes';

function App() {
  const [theme, setTheme] = useState('quartz');
  const themeStyles = generateThemeCSS(getTheme(theme));
  
  return (
    <div style={themeStyles}>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      <ThemedDataGrid columns={columns} rows={rows} theme={theme} />
    </div>
  );
}
```

### After

```tsx
import { DataGrid, ThemeSelector } from './components/DataGrid';

function App() {
  const [theme, setTheme] = useState('quartz');
  
  return (
    <div>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      <DataGrid columns={columns} rows={rows} theme={theme} />
    </div>
  );
}
```

Much cleaner! 🎉

## How It Works

The `DataGrid` component now:
1. Accepts a `theme` prop (defaults to `'quartz'`)
2. Automatically generates CSS variables from the theme
3. Applies them directly to the grid container
4. Updates instantly when theme changes

```tsx
// Theme CSS variables are automatically applied
<DataGrid theme="dracula" /> // Purple dark theme
<DataGrid theme="nord" />    // Arctic light theme
<DataGrid theme="monokai" /> // Vibrant code editor theme
```

## InfiniteScrollDataGrid

The same changes apply to `InfiniteScrollDataGrid`:

```tsx
// Old way (still works)
<ThemedInfiniteScrollDataGrid theme="dark" dataSource={ds} columns={cols} />

// New way (recommended)
<InfiniteScrollDataGrid theme="dark" dataSource={ds} columns={cols} />
```

## TypeScript

No TypeScript changes needed - all types remain the same. Both components accept the same `DataGridProps` interface.

## Deprecation Notice

`ThemedDataGrid` and `ThemedInfiniteScrollDataGrid` are marked as deprecated but will remain as aliases for backward compatibility. We recommend updating to use `DataGrid` and `InfiniteScrollDataGrid` directly with the `theme` prop.

## Summary

- ✅ Use `<DataGrid theme="..." />` instead of `<ThemedDataGrid theme="..." />`
- ✅ No wrapper div needed
- ✅ All existing code still works (backward compatible)
- ✅ Simpler, cleaner API
- ✅ Same features, better DX
