# DataGrid Themes - Visual Overview

## 🎨 All Available Themes (10 Total)

### Light Themes

#### 1. **Quartz (Modern White)** ☀️
```
Background: #ffffff → #f9fafb
Primary: #3b82f6 (Blue)
Style: Modern, rounded (8px), clean shadows
Perfect for: SaaS, modern web apps
```

#### 2. **Alpine (Classic Business)** 💼
```
Background: #ffffff → #fafafa
Primary: #1890ff (Classic Blue)
Style: Professional, sharp (4px), traditional
Perfect for: Enterprise, dashboards
```

#### 3. **Material** 📱
```
Background: #ffffff → #fafafa
Primary: #2196f3 (Material Blue)
Style: Material Design, elevation shadows
Perfect for: Android-style apps
```

#### 4. **Nord (Arctic)** ❄️
```
Background: #eceff4 → #e5e9f0
Primary: #5e81ac (Frost Blue)
Style: Cool, muted, harmonious
Perfect for: Minimalist, Nordic aesthetic
```

#### 5. **Solarized Light** 🌅
```
Background: #fdf6e3 → #eee8d5
Primary: #268bd2 (Solarized Blue)
Style: Precision colors, warm beige
Perfect for: Long reading, reduced eye strain
```

---

### Dark Themes

#### 6. **Dark Mode** 🌙
```
Background: #1e1e1e → #252526
Primary: #4a9eff (Bright Blue)
Style: VS Code inspired, high contrast
Perfect for: Night mode, coding
```

#### 7. **Dracula** 🧛
```
Background: #282a36 → #21222c
Primary: #bd93f9 (Purple)
Style: Purple-tinted, vibrant accents
Perfect for: Creative work, developer favorite
```

#### 8. **Solarized Dark** 🌃
```
Background: #002b36 → #073642
Primary: #268bd2 (Solarized Blue)
Style: Deep blue-green, calibrated colors
Perfect for: Night coding, minimal fatigue
```

#### 9. **Monokai** 🎨
```
Background: #272822 → #1e1f1c
Primary: #66d9ef (Cyan)
Style: Neon colors, high saturation
Perfect for: Sublime-style coding
```

#### 10. **One Dark** ⚛️
```
Background: #282c34 → #21252b
Primary: #61afef (Soft Blue)
Style: Atom editor, balanced colors
Perfect for: Modern development
```

---

## Quick Comparison

| Theme | Type | Primary Color | Style | Best For |
|-------|------|---------------|-------|----------|
| Quartz | Light | Blue | Modern & Clean | SaaS Applications |
| Alpine | Light | Classic Blue | Professional | Enterprise |
| Material | Light | Material Blue | Google Design | Mobile-first |
| Nord | Light | Frost Blue | Minimalist | Nordic Style |
| Solarized Light | Light | Solarized Blue | Precision | Reading |
| Dark Mode | Dark | Bright Blue | VS Code | Night Coding |
| Dracula | Dark | Purple | Vibrant | Creative Work |
| Solarized Dark | Dark | Solarized Blue | Calibrated | Low Fatigue |
| Monokai | Dark | Cyan | Neon | Code Editing |
| One Dark | Dark | Soft Blue | Balanced | Modern Dev |

---

## Color Families

### Blue Themes
- **Quartz**: Modern blue (#3b82f6)
- **Alpine**: Classic blue (#1890ff)
- **Material**: Material blue (#2196f3)
- **Nord**: Frost blue (#5e81ac)
- **Solarized**: Solarized blue (#268bd2)
- **Dark Mode**: Bright blue (#4a9eff)
- **One Dark**: Soft blue (#61afef)

### Special Color Themes
- **Dracula**: Purple (#bd93f9)
- **Monokai**: Cyan (#66d9ef)

---

## Usage Examples

### Switch Between Themes
```tsx
import { ThemedDataGrid } from './components/DataGrid';

function App() {
  const [theme, setTheme] = useState('quartz');
  
  return (
    <ThemedDataGrid
      columns={columns}
      rows={rows}
      theme={theme} // Try: 'nord', 'dracula', 'monokai', etc.
    />
  );
}
```

### With Theme Selector
```tsx
import { DataGrid, ThemeSelector } from './components/DataGrid';

function App() {
  const [theme, setTheme] = useState('one-dark');
  
  return (
    <>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      <DataGrid columns={columns} rows={rows} theme={theme} />
    </>
  );
}
```

---

## Theme Selection Guide

### Choose by Use Case

**For Business Applications:**
- Alpine (Classic Business)
- Quartz (Modern White)

**For Developer Tools:**
- Dark Mode (VS Code)
- One Dark (Atom)
- Monokai (Sublime)

**For Creative/Design Apps:**
- Dracula (Purple vibes)
- Nord (Minimalist)

**For Long Reading Sessions:**
- Solarized Light
- Solarized Dark

**For Mobile/Touch Interfaces:**
- Material (Larger touch targets)

**For Modern Web Apps:**
- Quartz (Clean & modern)
- One Dark (If dark mode)

---

## Accessibility

All themes provide:
- ✅ Sufficient color contrast ratios
- ✅ Clear focus indicators
- ✅ Readable text sizes
- ✅ Distinct interactive states

**Note**: Solarized themes are specifically designed with precision colors for optimal readability and reduced eye strain.

---

## Customization

Each theme can be extended or modified. See `THEME_SYSTEM.md` for details on creating custom themes.

---

**Total Themes**: 10 (5 Light + 5 Dark)
**New Additions**: Nord, Dracula, Solarized Light, Solarized Dark, Monokai, One Dark
