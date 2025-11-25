# Density Mode Feature

## Overview

The Density Mode system provides four display modes (Ultra Compact, Compact, Normal, Comfortable) to control the spacing and sizing of grid elements. Users can toggle between modes using a segmented control, and their preference is automatically saved to localStorage.

## Features

✅ **Three Density Modes**
- **Compact**: Minimal spacing for maximum data density (32px rows)
- **Normal**: Balanced spacing for general use (44px rows) 
- **Comfortable**: Generous spacing for accessibility (56px rows)

✅ **CSS Variables**
- Dynamic row height, cell padding, header padding
- Responsive font sizes
- Consistent spacing across all grid components

✅ **Persistent Preference**
- User's choice automatically saved to localStorage
- Loads saved preference on mount
- Customizable storage key

✅ **Segmented Control UI**
- Clean, modern toggle interface
- Keyboard accessible (Tab + Enter/Space)
- Visual feedback for active state
- Hover and focus states

✅ **Integration Options**
- Built-in toolbar toggle
- Standalone DensityToggle component
- useDensityMode hook for custom implementations

## Quick Start

### Basic Usage with Built-in Toggle

```tsx
import { DataGrid } from './DataGrid';

function MyComponent() {
  return (
    <DataGrid
      columns={columns}
      rows={data}
      showDensityToggle={true}  // Show density toggle in toolbar
      densityMode="normal"      // Initial density mode
      onDensityChange={(mode) => console.log('Density changed to:', mode)}
    />
  );
}
```

### Using the Hook

```tsx
import { DataGrid, useDensityMode } from './DataGrid';

function MyComponent() {
  const { densityMode, setDensityMode, densityStyles } = useDensityMode({
    initialMode: 'normal',
    persist: true,
  });

  return (
    <div style={densityStyles}>
      <DataGrid columns={columns} rows={data} />
    </div>
  );
}
```

### Standalone Toggle Component

```tsx
import { DensityToggle } from './DataGrid';
import type { DensityMode } from './DataGrid';

function MyToolbar() {
  const [density, setDensity] = useState<DensityMode>('normal');
  
  return (
    <div>
      <h3>Density Settings</h3>
      <DensityToggle value={density} onChange={setDensity} />
    </div>
  );
}
```

## API Reference

### DensityMode Type

```typescript
type DensityMode = 'ultraCompact' | 'compact' | 'normal' | 'comfortable';
```

### DensityConfig Interface

```typescript
interface DensityConfig {
  mode: DensityMode;
  rowHeight: string;
  cellPadding: string;
  headerPadding: string;
  fontSize: string;
  fontSizeSmall: string;
}
```

### DataGrid Props

```typescript
interface DataGridProps {
  // ... other props
  densityMode?: DensityMode;           // Initial density mode (default: 'normal')
  showDensityToggle?: boolean;         // Show toggle in toolbar (default: false)
  onDensityChange?: (mode: DensityMode) => void;  // Callback when density changes
}
```

### DensityToggle Props

```typescript
interface DensityToggleProps {
  value: DensityMode;                  // Current density mode
  onChange: (mode: DensityMode) => void; // Handler for mode changes
  className?: string;                  // Additional CSS classes
  disabled?: boolean;                  // Disable the toggle (default: false)
}
```

### useDensityMode Hook

```typescript
function useDensityMode(options?: UseDensityModeOptions): UseDensityModeReturn;

interface UseDensityModeOptions {
  initialMode?: DensityMode;           // Initial mode (default: 'normal')
  persist?: boolean;                   // Save to localStorage (default: true)
  persistenceKey?: string;             // localStorage key (default: 'grid-density-mode')
  onChange?: (mode: DensityMode) => void; // Callback when mode changes
}

interface UseDensityModeReturn {
  densityMode: DensityMode;            // Current density mode
  setDensityMode: (mode: DensityMode) => void; // Update density mode
  densityConfig: DensityConfig;        // Current density configuration
  densityStyles: Record<string, string>; // CSS variables object
}
```

## CSS Variables

Each density mode sets the following CSS variables:

### Compact Mode
```css
--grid-row-height: 32px;
--grid-cell-padding: 4px 8px;
--grid-header-padding: 6px 8px;
--grid-font-size: 13px;
--grid-font-size-sm: 11px;
```

### Normal Mode
```css
--grid-row-height: 44px;
--grid-cell-padding: 10px 12px;
--grid-header-padding: 10px 12px;
--grid-font-size: 14px;
--grid-font-size-sm: 12px;
```

### Comfortable Mode
```css
--grid-row-height: 56px;
--grid-cell-padding: 14px 16px;
--grid-header-padding: 14px 16px;
--grid-font-size: 15px;
--grid-font-size-sm: 13px;
```

## Utility Functions

### getDensityConfig

Get the configuration for a specific density mode.

```typescript
import { getDensityConfig } from './DataGrid';

const config = getDensityConfig('compact');
// Returns: { mode: 'compact', rowHeight: '32px', ... }
```

### getDensityModes

Get all available density modes.

```typescript
import { getDensityModes } from './DataGrid';

const modes = getDensityModes();
// Returns: ['compact', 'normal', 'comfortable']
```

### getDensityLabel

Get display label for a density mode.

```typescript
import { getDensityLabel } from './DataGrid';

const label = getDensityLabel('compact');
// Returns: 'Compact'
```

### generateDensityCSS

Generate CSS variables for a density mode.

```typescript
import { generateDensityCSS } from './DataGrid';

const styles = generateDensityCSS('normal');
// Returns: { '--grid-row-height': '44px', ... }
```

### saveDensityMode / loadDensityMode

Manually save or load density preference.

```typescript
import { saveDensityMode, loadDensityMode } from './DataGrid';

// Save preference
saveDensityMode('compact', 'my-custom-key');

// Load preference
const saved = loadDensityMode('my-custom-key');
// Returns: 'compact' or null
```

## Advanced Examples

### Custom Density Toggle with Label

```tsx
function CustomDensityControl() {
  const { densityMode, setDensityMode } = useDensityMode();
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <label style={{ fontWeight: '500', color: '#374151' }}>
        Display Density:
      </label>
      <DensityToggle value={densityMode} onChange={setDensityMode} />
      <span style={{ fontSize: '12px', color: '#6b7280' }}>
        {getDensityLabel(densityMode)} mode active
      </span>
    </div>
  );
}
```

### Conditional Density Based on Device

```tsx
function ResponsiveDensity() {
  const isMobile = window.innerWidth < 768;
  const initialMode = isMobile ? 'comfortable' : 'normal';
  
  const { densityMode, setDensityMode, densityStyles } = useDensityMode({
    initialMode,
    persist: true,
  });

  return (
    <div style={densityStyles}>
      <DataGrid columns={columns} rows={data} />
    </div>
  );
}
```

### Multiple Grids with Shared Density

```tsx
function DashboardWithMultipleGrids() {
  const { densityMode, setDensityMode, densityStyles } = useDensityMode({
    persist: true,
  });

  return (
    <div style={densityStyles}>
      <div style={{ marginBottom: '16px' }}>
        <DensityToggle value={densityMode} onChange={setDensityMode} />
      </div>
      
      <div style={{ display: 'grid', gap: '24px' }}>
        <DataGrid columns={columns1} rows={data1} />
        <DataGrid columns={columns2} rows={data2} />
        <DataGrid columns={columns3} rows={data3} />
      </div>
    </div>
  );
}
```

### Programmatic Density Control

```tsx
function DensityWithKeyboardShortcut() {
  const { densityMode, setDensityMode, densityStyles } = useDensityMode();
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        // Cycle through modes
        const modes: DensityMode[] = ['compact', 'normal', 'comfortable'];
        const currentIndex = modes.indexOf(densityMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setDensityMode(nextMode);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [densityMode, setDensityMode]);

  return (
    <div style={densityStyles}>
      <p>Press Ctrl+D to cycle density modes</p>
      <DataGrid columns={columns} rows={data} />
    </div>
  );
}
```

## Use Cases

### 📊 Financial Trading Dashboards
Use **Compact** mode to display maximum number of market data rows on screen. Traders need to monitor hundreds of instruments simultaneously.

### 📝 Business Applications
Use **Normal** mode (default) for general business applications like CRM, inventory management, or reporting tools. Provides good balance.

### ♿ Accessibility Applications
Use **Comfortable** mode for applications where accessibility is paramount, such as government portals, healthcare systems, or public-facing tools.

### 📱 Touch Devices
Use **Comfortable** mode on tablets and touch devices to provide larger touch targets and prevent accidental selections.

### 👥 User Preference
Let users choose their preferred density and persist the choice. Power users may prefer compact, while others prefer comfortable.

## Browser Support

The density mode system uses CSS variables and localStorage:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

## Performance

- ✅ **Zero Re-renders**: Mode changes only update CSS variables
- ✅ **Instant Switching**: No data recalculation needed
- ✅ **Lightweight**: Minimal overhead (~2KB gzipped)
- ✅ **Efficient**: Uses native CSS variable cascade

## Accessibility

The DensityToggle component is fully accessible:

- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ ARIA labels and roles
- ✅ Focus indicators
- ✅ Screen reader announcements
- ✅ High contrast support

## Best Practices

1. **Default to Normal**: Use 'normal' mode as the default for most applications
2. **Persist Preference**: Enable persistence so users don't need to re-select
3. **Show Toggle**: Make the toggle visible and easy to find
4. **Label Clearly**: Use "Compact / Normal / Comfortable" naming for clarity
5. **Test Touch**: Verify comfortable mode on touch devices
6. **Consider Context**: Auto-detect device type for initial mode
7. **Document Options**: Educate users about available density options

## Troubleshooting

### Density not applying?

Ensure you're applying the `densityStyles` to a parent container:

```tsx
const { densityStyles } = useDensityMode();

return (
  <div style={densityStyles}>  {/* Apply here */}
    <DataGrid ... />
  </div>
);
```

### Preference not persisting?

Check localStorage is enabled and accessible:

```typescript
// Test localStorage
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  console.error('localStorage not available');
}
```

### Custom styles conflicting?

CSS variables can be overridden. Check your custom styles:

```css
/* Don't do this */
.my-grid {
  row-height: 50px !important;  /* Overrides density */
}

/* Do this instead */
.my-grid {
  /* Let CSS variables control sizing */
  min-height: var(--grid-row-height);
}
```

## Related Features

- **Theme System**: Combine with themes for complete visual customization
- **Virtual Scrolling**: Works seamlessly with virtual scrolling for large datasets
- **Layout Persistence**: Save density preference along with column layout
- **Responsive Design**: Adjust density based on viewport size

## Roadmap

Future enhancements planned:

- 🔄 More density presets (Extra Compact, Extra Comfortable)
- 🎯 Per-column density overrides
- 📱 Auto-density based on device detection
- 🎨 Density-aware custom cell renderers
- 💾 Backend persistence for multi-device sync

## Demo

See `DensityModeDemo.tsx` for a complete interactive demonstration of all features.
