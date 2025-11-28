# DataGrid Accessibility Quick Reference

## 🎹 Keyboard Shortcuts

### Navigation
| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` | Navigate between cells |
| `Tab` | Move to next cell (wraps to next row) |
| `Shift` + `Tab` | Move to previous cell (wraps to previous row) |
| `Home` | Jump to first column in row |
| `End` | Jump to last column in row |
| `Ctrl/Cmd` + `Home` | Jump to first cell (top-left) |
| `Ctrl/Cmd` + `End` | Jump to last cell (bottom-right) |
| `PageUp` | Previous page |
| `PageDown` | Next page |

### Actions
| Key | Action |
|-----|--------|
| `Space` | Toggle row selection |
| `Enter` | Start editing cell |
| `Escape` | Cancel editing |
| `Ctrl/Cmd` + `Click` | Multi-select rows |
| `Shift` + `Click` | Range select rows |

## 🏷️ ARIA Attributes

### Container
```html
<div role="grid" aria-label="Data Grid" aria-rowcount={100} aria-colcount={7}>
```

### Header
```html
<div role="rowgroup">
  <div role="row">
    <div role="columnheader" aria-colindex={1} aria-sort="ascending">
```

### Body
```html
<div role="rowgroup">
  <div role="row" aria-rowindex={2} aria-selected="true">
    <div role="gridcell" aria-colindex={1} aria-readonly="false">
```

## 📢 Screen Reader Announcements

- **Selection**: "5 rows selected"
- **Sorting**: "Sorted by Name ascending"
- **Pagination**: "Page 2 of 5, showing 10 rows"
- **Filtering**: "Filter applied to Department, 15 results"
- **Editing**: "Editing Email. Press Enter to save, Escape to cancel"

## ✅ Testing Checklist

- [ ] Tab through all interactive elements
- [ ] Arrow keys navigate cells
- [ ] Space selects rows
- [ ] Enter starts editing
- [ ] Escape cancels editing
- [ ] Home/End work correctly
- [ ] PageUp/PageDown change pages
- [ ] Focus indicators visible
- [ ] Screen reader announces changes
- [ ] No keyboard traps
- [ ] Works with NVDA/JAWS/VoiceOver

## 🔧 Usage

```tsx
import { DataGrid } from 'react-open-source-grid';

// Accessibility features are built-in
<DataGrid
  columns={columns}
  rows={rows}
  pageSize={10}
/>
```

## 📚 Resources

- Full Guide: [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md)
- Demo: Navigate to Accessibility section in app
- ARIA Spec: [W3C Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
