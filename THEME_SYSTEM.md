# DataGrid Theme System

A comprehensive theming system for the DataGrid component that allows you to switch between multiple pre-built themes dynamically.

## Available Themes

### 1. Quartz (Modern White)
- **Description**: Clean, modern white theme with subtle shadows and rounded corners
- **Best For**: Modern web applications, SaaS platforms
- **Key Features**:
  - Soft gray backgrounds (#f3f4f6)
  - Blue primary color (#3b82f6)
  - 8px border radius
  - Subtle shadows

### 2. Alpine (Classic Business)
- **Description**: Professional, business-oriented theme with traditional styling
- **Best For**: Enterprise applications, dashboards
- **Key Features**:
  - Light gray backgrounds (#f5f5f5)
  - Classic blue primary (#1890ff)
  - 4px border radius
  - Sharp, professional appearance

### 3. Material
- **Description**: Material Design inspired theme following Google's design principles
- **Best For**: Android-style apps, Google-like interfaces
- **Key Features**:
  - Material elevation shadows
  - Roboto font family
  - Blue accent (#2196f3)
  - 52px row height for better touch targets

### 4. Dark Mode
- **Description**: Dark theme optimized for low-light environments
- **Best For**: Night mode, developer tools, reducing eye strain
- **Key Features**:
  - Dark backgrounds (#1e1e1e)
  - High contrast text (#d4d4d4)
  - Bright primary color (#4a9eff)
  - VS Code-inspired palette

### 5. Nord (Arctic)
- **Description**: Cool, arctic-inspired theme with frost-toned colors
- **Best For**: Minimalist apps, Nordic aesthetic lovers
- **Key Features**:
  - Frost white backgrounds (#eceff4)
  - Blue-gray primary (#5e81ac)
  - Muted, harmonious color palette
  - Excellent readability

### 6. Dracula
- **Description**: Popular purple-tinted dark theme beloved by developers
- **Best For**: Coding environments, creative applications
- **Key Features**:
  - Dark purple background (#282a36)
  - Vibrant purple primary (#bd93f9)
  - Cyan, pink, and green accents
  - High contrast for readability

### 7. Solarized Light
- **Description**: Precision colors designed for optimal readability
- **Best For**: Long reading sessions, academic work
- **Key Features**:
  - Warm beige background (#fdf6e3)
  - Scientifically calibrated colors
  - Reduced eye strain
  - Excellent for extended use

### 8. Solarized Dark
- **Description**: Dark variant of the precision Solarized theme
- **Best For**: Night coding, reduced glare
- **Key Features**:
  - Deep blue-green background (#002b36)
  - Same calibrated color scheme as light variant
  - Perfect contrast ratios
  - Minimal eye fatigue

### 9. Monokai
- **Description**: Vibrant colors on dark background, sublime and iconic
- **Best For**: Code editors, creative workspaces
- **Key Features**:
  - Charcoal background (#272822)
  - Neon cyan, green, and yellow accents
  - High saturation colors
  - Developer favorite

### 10. One Dark
- **Description**: Atom editor's iconic dark theme
- **Best For**: Modern development environments
- **Key Features**:
  - Soft dark background (#282c34)
  - Blue primary (#61afef)
  - Balanced, professional colors
  - Easy on the eyes

## Usage

### Basic Usage

Simply pass the `theme` prop to the DataGrid component:

```tsx
import { DataGrid } from './DataGrid';
import type { ThemeName } from './DataGrid/themes';

function MyComponent() {
  const [theme, setTheme] = useState<ThemeName>('quartz');

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      theme={theme} // Theme is applied directly!
    />
  );
}
```

### With Theme Selector

```tsx
import { DataGrid, ThemeSelector } from './DataGrid';
import type { ThemeName } from './DataGrid/themes';

function MyComponent() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('quartz');

  return (
    <div>
      <ThemeSelector 
        currentTheme={currentTheme} 
        onThemeChange={setCurrentTheme} 
      />
      
      <DataGrid
        columns={columns}
        rows={rows}
        theme={currentTheme}
      />
    </div>
  );
}
```

### Switching Themes Dynamically

```tsx
import { DataGrid } from './DataGrid';
import type { ThemeName } from './DataGrid/themes';

function MyComponent() {
  const [theme, setTheme] = useState<ThemeName>('dark');

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      theme={theme} // Change this value to switch themes instantly!
    />
  );
}
```

## Theme Structure

Each theme includes comprehensive styling definitions:

```typescript
interface GridTheme {
  name: ThemeName;
  displayName: string;
  colors: {
    // Background colors
    background: string;
    backgroundAlt: string;
    headerBackground: string;
    footerBackground: string;
    
    // Border colors
    border: string;
    borderLight: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textInverse: string;
    headerText: string;
    
    // Interactive colors
    hover: string;
    active: string;
    selected: string;
    
    // Accent colors
    primary: string;
    primaryHover: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    cellPadding: string;
    headerPadding: string;
    rowHeight: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    headerFontWeight: string;
  };
  borders: {
    width: string;
    radius: string;
    style: string;
  };
  shadows: {
    light: string;
    medium: string;
    heavy: string;
  };
}
```

## CSS Variables

The theme system generates CSS variables that can be used throughout your application:

```css
--grid-bg: /* Background color */
--grid-bg-alt: /* Alternate background */
--grid-header-bg: /* Header background */
--grid-footer-bg: /* Footer background */
--grid-border: /* Border color */
--grid-text: /* Text color */
--grid-primary: /* Primary accent color */
/* ... and many more */
```

## Creating Custom Themes

You can create your own custom theme by following the `GridTheme` interface:

```typescript
import type { GridTheme } from './DataGrid/themes';

const myCustomTheme: GridTheme = {
  name: 'custom',
  displayName: 'My Custom Theme',
  colors: {
    background: '#ffffff',
    backgroundAlt: '#f5f5f5',
    // ... define all required colors
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    headerFontWeight: '600',
  },
  borders: {
    width: '1px',
    radius: '8px',
    style: 'solid',
  },
  shadows: {
    light: '0 1px 2px rgba(0,0,0,0.05)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    heavy: '0 10px 15px rgba(0,0,0,0.1)',
  },
};

// Use it in your application
const themeStyles = generateThemeCSS(myCustomTheme);
```

## Theme Utilities

### getTheme(themeName)
Get a theme object by its name.

```typescript
import { getTheme } from './DataGrid/themes';

const quartzTheme = getTheme('quartz');
```

### getThemeNames()
Get all available theme names.

```typescript
import { getThemeNames } from './DataGrid/themes';

const names = getThemeNames(); // ['quartz', 'alpine', 'material', 'dark', 'nord', 'dracula', 'solarized-light', 'solarized-dark', 'monokai', 'one-dark']
```

### generateThemeCSS(theme)
Generate CSS variables from a theme object.

```typescript
import { generateThemeCSS } from './DataGrid/themes';

const cssVars = generateThemeCSS(quartzTheme);
// Returns: { '--grid-bg': '#ffffff', ... }
```

## Best Practices

1. **Consistent Theme Application**: Apply theme to a parent container to ensure all child components inherit the theme
2. **Theme Persistence**: Store user's theme preference in localStorage
3. **Smooth Transitions**: Use CSS transitions when switching themes
4. **Accessibility**: Ensure sufficient contrast ratios in all themes
5. **Dark Mode Detection**: Detect system preference and default to dark theme when appropriate

```typescript
// Example: Persist theme preference
useEffect(() => {
  const saved = localStorage.getItem('gridTheme');
  if (saved) setTheme(saved as ThemeName);
}, []);

useEffect(() => {
  localStorage.setItem('gridTheme', theme);
}, [theme]);
```

## Browser Support

The theme system uses CSS variables which are supported in:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

## Performance

- Theme switching is instant with no re-renders of data
- CSS variables provide optimal performance
- No inline styles recalculation on theme change

## Examples

See the `ThemesDemo` component for a complete working example showcasing all themes with:
- Theme selector
- Sample data grid
- Color palette display
- Theme-aware UI elements
