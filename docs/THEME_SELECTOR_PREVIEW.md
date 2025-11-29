# Theme Selector Preview

## Visual Representation

When users open the theme selector dropdown, they will now see:

```
┌─────────────────────────────────┐
│ Theme: ▼                        │
├─────────────────────────────────┤
│ Quartz (Modern White)           │ ← Light Themes
│ Alpine (Classic Business)       │
│ Material                        │
│ Dark Mode                       │ ← Dark Themes Start
│ Nord (Arctic)                   │ 🆕 NEW
│ Dracula                         │ 🆕 NEW
│ Solarized Light                 │ 🆕 NEW
│ Solarized Dark                  │ 🆕 NEW
│ Monokai                         │ 🆕 NEW
│ One Dark                        │ 🆕 NEW
└─────────────────────────────────┘
```

## Theme Colors at a Glance

### Light Themes
```
Quartz          ░░░░░   Blue (#3b82f6)
Alpine          ░░░░░   Classic Blue (#1890ff)
Material        ░░░░░   Material Blue (#2196f3)
Nord            ░░░░░   Frost Blue (#5e81ac)       🆕
Solarized Light ░░░░░   Solarized Blue (#268bd2)   🆕
```

### Dark Themes
```
Dark Mode       ████    Bright Blue (#4a9eff)
Dracula         ████    Purple (#bd93f9)           🆕
Solarized Dark  ████    Solarized Blue (#268bd2)   🆕
Monokai         ████    Cyan (#66d9ef)             🆕
One Dark        ████    Soft Blue (#61afef)        🆕
```

## Color Palette Examples

### Nord (Arctic) 🆕
```
┌─────────────────────────────────┐
│ Background: #eceff4 (Frost)     │
│ Primary:    #5e81ac (Blue-Gray) │
│ Success:    #a3be8c (Green)     │
│ Warning:    #ebcb8b (Yellow)    │
│ Error:      #bf616a (Red)       │
└─────────────────────────────────┘
```

### Dracula 🆕
```
┌─────────────────────────────────┐
│ Background: #282a36 (Dark)      │
│ Primary:    #bd93f9 (Purple)    │
│ Success:    #50fa7b (Green)     │
│ Warning:    #f1fa8c (Yellow)    │
│ Error:      #ff5555 (Red)       │
│ Info:       #8be9fd (Cyan)      │
└─────────────────────────────────┘
```

### Solarized Light 🆕
```
┌─────────────────────────────────┐
│ Background: #fdf6e3 (Beige)     │
│ Primary:    #268bd2 (Blue)      │
│ Success:    #859900 (Green)     │
│ Warning:    #b58900 (Yellow)    │
│ Error:      #dc322f (Red)       │
└─────────────────────────────────┘
```

### Solarized Dark 🆕
```
┌─────────────────────────────────┐
│ Background: #002b36 (Deep Blue) │
│ Primary:    #268bd2 (Blue)      │
│ Success:    #859900 (Green)     │
│ Warning:    #b58900 (Yellow)    │
│ Error:      #dc322f (Red)       │
└─────────────────────────────────┘
```

### Monokai 🆕
```
┌─────────────────────────────────┐
│ Background: #272822 (Charcoal)  │
│ Primary:    #66d9ef (Cyan)      │
│ Success:    #a6e22e (Green)     │
│ Warning:    #e6db74 (Yellow)    │
│ Error:      #f92672 (Pink)      │
└─────────────────────────────────┘
```

### One Dark 🆕
```
┌─────────────────────────────────┐
│ Background: #282c34 (Soft Dark) │
│ Primary:    #61afef (Blue)      │
│ Success:    #98c379 (Green)     │
│ Warning:    #e5c07b (Yellow)    │
│ Error:      #e06c75 (Red)       │
└─────────────────────────────────┘
```

## Developer Experience

The new themes provide:
- 🎨 **More visual variety** - From arctic minimalism to vibrant coding themes
- 👨‍💻 **Developer favorites** - Dracula, Monokai, One Dark are beloved by developers
- 📚 **Academic friendly** - Solarized themes are scientifically designed for readability
- 🌍 **Broader appeal** - Norse-inspired Nord, Material Design, etc.

## Technical Implementation

All themes follow the same comprehensive structure:
- 24 color properties
- 3 spacing properties
- 5 typography properties
- 3 border properties
- 3 shadow properties

Total: **38 configurable properties per theme**

## Backward Compatibility

✅ All existing code continues to work
✅ Default theme remains 'quartz'
✅ Type-safe theme selection
✅ No breaking changes
