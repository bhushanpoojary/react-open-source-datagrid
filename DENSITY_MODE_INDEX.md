# Density Mode System - Index

## 📖 Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| [Quick Reference](./DENSITY_MODE_QUICK_REF.md) | Cheat sheet with common patterns | Developers (quick lookup) |
| [Feature Guide](./DENSITY_MODE_FEATURE.md) | Complete documentation with examples | All users |
| [Implementation Summary](./DENSITY_MODE_IMPLEMENTATION_SUMMARY.md) | Technical overview | Contributors/maintainers |

## 🎯 Quick Links

### Getting Started
- [Basic Usage](#basic-usage) - Get started in 30 seconds
- [Interactive Demo](#demo) - Try it live
- [API Reference](#api) - Complete API docs

### Common Tasks
- [Enable Built-in Toggle](#built-in-toggle)
- [Use the Hook](#with-hook)
- [Customize Persistence](#persistence)
- [Style the Toggle](#styling)

## 🚀 Basic Usage

### 1. Built-in Toggle (Recommended)
```tsx
import { DataGrid } from 'react-open-source-grid';

<DataGrid 
  columns={columns} 
  rows={data}
  showDensityToggle={true}  // Add this line
/>
```

### 2. With Hook
```tsx
import { DataGrid, useDensityMode } from 'react-open-source-grid';

function MyComponent() {
  const { densityMode, setDensityMode, densityStyles } = useDensityMode();
  
  return (
    <div style={densityStyles}>
      <DataGrid columns={columns} rows={data} />
    </div>
  );
}
```

### 3. Standalone Toggle
```tsx
import { DensityToggle } from 'react-open-source-grid';

<DensityToggle value={densityMode} onChange={setDensityMode} />
```

## 📦 What's Included

### Components
- **`DensityToggle`** - Segmented control UI component
- **`DataGrid`** - Enhanced with density support

### Hooks
- **`useDensityMode`** - Manage density state and persistence

### Types
- **`DensityMode`** - `'ultraCompact' | 'compact' | 'normal' | 'comfortable'`
- **`DensityConfig`** - Configuration object interface

### Utilities
- **`getDensityConfig(mode)`** - Get config for a mode
- **`generateDensityCSS(mode)`** - Generate CSS variables
- **`getDensityModes()`** - Get all available modes
- **`getDensityLabel(mode)`** - Get display label
- **`saveDensityMode(mode)`** - Save to localStorage
- **`loadDensityMode()`** - Load from localStorage

## 🎨 Density Modes

| Mode | Row Height | Padding | Font | Best For |
|------|-----------|---------|------|----------|
| **Compact** | 32px | 4px 8px | 13px | Trading, power users |
| **Normal** | 44px | 10px 12px | 14px | General apps (default) |
| **Comfortable** | 56px | 14px 16px | 15px | Accessibility, touch |

## 📱 Demo

Run the interactive demo:
```bash
npm run dev
```

Then navigate to **Customization → Density Modes** in the sidebar.

## 🔧 API

### DensityToggle Component

```tsx
interface DensityToggleProps {
  value: DensityMode;                    // Current mode
  onChange: (mode: DensityMode) => void; // Handler
  className?: string;                    // Additional classes
  disabled?: boolean;                    // Disable toggle
}
```

### useDensityMode Hook

```tsx
function useDensityMode(options?: {
  initialMode?: DensityMode;            // Default: 'normal'
  persist?: boolean;                    // Default: true
  persistenceKey?: string;              // Default: 'grid-density-mode'
  onChange?: (mode: DensityMode) => void;
}): {
  densityMode: DensityMode;             // Current mode
  setDensityMode: (mode: DensityMode) => void; // Update function
  densityConfig: DensityConfig;         // Current config
  densityStyles: Record<string, string>; // CSS variables
}
```

### DataGrid Props

```tsx
interface DataGridProps {
  // ... other props
  densityMode?: DensityMode;            // Initial mode
  showDensityToggle?: boolean;          // Show toggle in toolbar
  onDensityChange?: (mode: DensityMode) => void; // Callback
}
```

## 💡 Examples

### With Theme
```tsx
<DataGrid
  theme="quartz"
  showDensityToggle={true}
  columns={columns}
  rows={data}
/>
```

### Custom Label
```tsx
<div>
  <label>Display Density:</label>
  <DensityToggle value={densityMode} onChange={setDensityMode} />
</div>
```

### Mobile First
```tsx
const isMobile = window.innerWidth < 768;
const { densityMode, densityStyles } = useDensityMode({
  initialMode: isMobile ? 'comfortable' : 'normal'
});
```

### With Callback
```tsx
<DataGrid
  showDensityToggle={true}
  onDensityChange={(mode) => {
    console.log('Density changed to:', mode);
    analytics.track('density_change', { mode });
  }}
/>
```

## 🎓 Tutorials

1. **[Getting Started](./DENSITY_MODE_FEATURE.md#quick-start)** - First steps
2. **[Advanced Usage](./DENSITY_MODE_FEATURE.md#advanced-examples)** - Complex patterns
3. **[Accessibility](./DENSITY_MODE_FEATURE.md#accessibility)** - A11y features
4. **[Troubleshooting](./DENSITY_MODE_FEATURE.md#troubleshooting)** - Common issues

## 🔗 Related Features

- **[Theme System](./THEME_SYSTEM.md)** - Color schemes and styling
- **[Layout Persistence](./LAYOUT_PERSISTENCE_FEATURE.md)** - Save layouts
- **[Virtual Scrolling](./VIRTUAL_SCROLLING.md)** - Performance
- **[Accessibility](./ACCESSIBILITY_GUIDE.md)** - A11y features

## 📞 Support

### Common Questions

**Q: Does density affect performance?**  
A: No, it only updates CSS variables with zero re-renders.

**Q: Can I customize the density values?**  
A: Yes, you can override the CSS variables in your own styles.

**Q: Does it work with virtual scrolling?**  
A: Yes, fully compatible with all DataGrid features.

**Q: Can I save density to a backend?**  
A: Yes, use the `onDensityChange` callback to send to your API.

### Need Help?

- 📖 Check the [Feature Guide](./DENSITY_MODE_FEATURE.md)
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

## 🎉 Summary

The Density Mode system provides:
- ✅ Three carefully designed modes
- ✅ Persistent user preferences
- ✅ Accessible segmented control UI
- ✅ Zero-performance impact
- ✅ Full keyboard support
- ✅ Seamless integration

Perfect for applications that need to support different user preferences, from compact dashboards to accessible interfaces.

---

**Ready to use?** Start with the [Quick Reference](./DENSITY_MODE_QUICK_REF.md) or jump into the [Interactive Demo](#demo)!
