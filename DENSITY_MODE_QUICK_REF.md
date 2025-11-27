# Density Mode Quick Reference

## 🎯 Four Modes

```
Ultra Compact  →  24px rows, 2px/6px padding, 12px font
Compact        →  32px rows, 4px/8px padding, 13px font
Normal         →  44px rows, 10px/12px padding, 14px font
Comfortable    →  56px rows, 14px/16px padding, 15px font
```

## ⚡ Quick Setup

### Built-in Toggle (Easiest)
```tsx
<DataGrid 
  columns={columns} 
  rows={data}
  showDensityToggle={true}
/>
```

### With Hook (More Control)
```tsx
const { densityMode, setDensityMode, densityStyles } = useDensityMode();

<div style={densityStyles}>
  <DataGrid columns={columns} rows={data} />
</div>
```

### Standalone Toggle
```tsx
<DensityToggle value={densityMode} onChange={setDensityMode} />
```

## 📦 Imports

```tsx
import { 
  DataGrid,
  DensityToggle,
  useDensityMode,
  getDensityConfig,
  generateDensityCSS
} from './DataGrid';
import type { DensityMode } from './DataGrid';
```

## 🎨 CSS Variables Set

```css
--grid-row-height
--grid-cell-padding
--grid-header-padding
--grid-font-size
--grid-font-size-sm
```

## 🔧 Common Patterns

### With Theme
```tsx
<DataGrid
  theme="quartz"
  showDensityToggle={true}
  columns={columns}
  rows={data}
/>
```

### Custom Persistence Key
```tsx
useDensityMode({
  initialMode: 'normal',
  persist: true,
  persistenceKey: 'my-app-density'
})
```

### Callback on Change
```tsx
<DataGrid
  showDensityToggle={true}
  onDensityChange={(mode) => analytics.track('density_changed', { mode })}
/>
```

### Mobile First
```tsx
const isMobile = window.innerWidth < 768;
useDensityMode({ initialMode: isMobile ? 'comfortable' : 'normal' })
```

## 💾 Storage

Automatically saved to `localStorage` with key `'grid-density-mode'`

## ♿ Accessibility

- ✅ Keyboard: Tab + Enter/Space
- ✅ ARIA: Full screen reader support
- ✅ Focus: Visible focus indicators
- ✅ Labels: Clear mode descriptions

## 📱 Use Cases

| Mode | Best For |
|------|----------|
| **Compact** | Trading dashboards, power users, maximum data |
| **Normal** | General business apps, balanced view |
| **Comfortable** | Accessibility, touch devices, public apps |

## 🎯 Utilities

```tsx
getDensityConfig('compact')        // Get config object
getDensityModes()                  // ['compact', 'normal', 'comfortable']
getDensityLabel('normal')          // 'Normal'
generateDensityCSS('comfortable')  // CSS variables object
saveDensityMode('compact')         // Manual save
loadDensityMode()                  // Manual load → 'compact' | null
```

## 🐛 Troubleshooting

**Not applying?** → Apply `densityStyles` to parent container  
**Not persisting?** → Check localStorage is available  
**Conflicts?** → Don't use `!important` on row heights/padding

## 🔗 Related

- Theme System (combine for full customization)
- Virtual Scrolling (works seamlessly)
- Layout Persistence (save with column layout)
