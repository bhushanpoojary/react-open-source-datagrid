# DataGrid Accessibility (A11y) Guide

## 🎯 Overview

The DataGrid component is fully accessible and compliant with WCAG 2.1 Level AA standards. It provides comprehensive keyboard navigation, ARIA support, and screen reader compatibility out of the box.

## ✨ Features

### 1. **Keyboard Navigation** ⌨️

#### Basic Navigation
- **Arrow Keys** (↑ ↓ ← →): Navigate between cells in any direction
- **Tab**: Move to next cell with automatic row wrapping
- **Shift + Tab**: Move to previous cell with automatic row wrapping

#### Extended Navigation
- **Home**: Jump to first column in current row
- **End**: Jump to last column in current row
- **Ctrl/Cmd + Home**: Jump to first cell in grid (top-left)
- **Ctrl/Cmd + End**: Jump to last cell in grid (bottom-right)
- **PageUp**: Navigate to previous page
- **PageDown**: Navigate to next page

#### Actions
- **Space**: Toggle row selection
- **Enter**: Start editing the focused cell
- **Escape**: Cancel editing and revert changes
- **Ctrl/Cmd + Click**: Multi-select rows (non-contiguous)
- **Shift + Click**: Range select rows (contiguous)

### 2. **ARIA Support** ♿

The DataGrid implements a complete ARIA grid pattern with proper roles and attributes:

#### Grid Container
```html
<div role="grid" aria-label="Data Grid" aria-rowcount={100} aria-colcount={7}>
```

#### Header Section
```html
<div role="rowgroup">
  <div role="row">
    <div role="columnheader" 
         aria-colindex={1}
         aria-sort="ascending"
         aria-label="Name column, sorted ascending">
      Name
    </div>
  </div>
</div>
```

#### Body Section
```html
<div role="rowgroup">
  <div role="row" 
       aria-rowindex={2} 
       aria-selected="true">
    <div role="gridcell" 
         aria-colindex={1}
         aria-readonly="false">
      Cell Content
    </div>
  </div>
</div>
```

#### Key ARIA Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `role="grid"` | Identifies the grid container | Container element |
| `role="rowgroup"` | Groups header and body sections | Header/body wrappers |
| `role="row"` | Identifies each row | All row elements |
| `role="columnheader"` | Identifies column headers | Header cells |
| `role="gridcell"` | Identifies data cells | Body cells |
| `aria-rowindex` | Indicates row position | `aria-rowindex="5"` |
| `aria-colindex` | Indicates column position | `aria-colindex="3"` |
| `aria-selected` | Indicates selection state | `aria-selected="true"` |
| `aria-sort` | Indicates sort direction | `aria-sort="ascending"` |
| `aria-readonly` | Indicates if cell is editable | `aria-readonly="true"` |
| `aria-label` | Provides accessible name | Column descriptions |

### 3. **Screen Reader Support** 🔊

#### Live Region Announcements

The grid includes an ARIA live region that announces important state changes:

```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {announcements}
</div>
```

#### Announcement Types

**Selection Changes**
- "1 row selected"
- "5 rows selected"
- "All rows deselected"

**Sorting Changes**
- "Sorted by Name ascending"
- "Sorted by Date descending"
- "Sorting cleared"

**Pagination Changes**
- "Page 2 of 5, showing 10 rows"
- "Page 1 of 3, showing 8 rows"

**Filtering Changes**
- "Filter applied to Department column, 15 results found"
- "Filter cleared from Status column"

**Editing Actions**
- "Editing Email. Press Enter to save, Escape to cancel"
- "Edit saved for Email"

#### Focus Announcements

When navigating with keyboard, the screen reader announces:
- Current row number
- Column name
- Cell value (if applicable)

Example: "Row 3, Department, Engineering"

### 4. **Focus Management** 🎯

#### Focus Indicators

All focusable elements have clear, visible focus indicators:
- **Cells**: 2px solid blue outline (`--grid-primary`)
- **Buttons**: Background color change and border highlight
- **Inputs**: Blue border and shadow

#### Focus Traps

Modal dialogs and popups include focus traps to keep keyboard navigation contained:

```tsx
import { useFocusTrap } from './DataGrid';

function MyModal() {
  const trapRef = useFocusTrap({
    enabled: true,
    initialFocus: 'first',
    returnFocus: true,
    escapeDeactivates: true,
  });

  return <div ref={trapRef}>Modal content</div>;
}
```

#### Roving TabIndex

The grid uses roving tabindex pattern:
- Only one cell in the grid has `tabIndex={0}` at a time (the focused cell)
- All other cells have `tabIndex={-1}`
- This allows single Tab stop for entire grid while maintaining arrow key navigation

## 📖 Usage Guide

### Basic Implementation

```tsx
import { DataGrid} from './DataGrid';

function MyApp() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pageSize={10}
      // Accessibility is enabled by default
      // No additional configuration needed
    />
  );
}
```

### Custom ARIA Labels

You can customize ARIA labels for better context:

```tsx
const columns: Column[] = [
  {
    field: 'status',
    headerName: 'Status',
    // Column header gets aria-label automatically
    // "Status column" + sort state if applicable
  },
];
```

### Handling Keyboard Events

The grid handles keyboard events internally, but you can extend functionality:

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  onRowClick={(row) => {
    // Called on click or Enter key
    console.log('Row activated:', row);
  }}
  onCellEdit={(rowIndex, field, value) => {
    // Called when editing completes (Enter or blur)
    console.log('Cell edited:', { rowIndex, field, value });
  }}
/>
```

## 🧪 Testing Accessibility

### Automated Testing

#### Using axe-core

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('DataGrid has no accessibility violations', async () => {
  const { container } = render(
    <DataGridcolumns={columns} rows={rows} />
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Using React Testing Library

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('keyboard navigation works', async () => {
  render(<DataGridcolumns={columns} rows={rows} />);
  
  const firstCell = screen.getAllByRole('gridcell')[0];
  firstCell.focus();
  
  // Test arrow key navigation
  await userEvent.keyboard('{ArrowDown}');
  // Assert focus moved to next row
  
  // Test space for selection
  await userEvent.keyboard(' ');
  // Assert row selected
  
  // Test Enter for editing
  await userEvent.keyboard('{Enter}');
  // Assert edit mode activated
});
```

### Manual Testing

#### Screen Reader Testing

**Windows (NVDA)**
1. Download NVDA from https://www.nvaccess.org/
2. Start NVDA
3. Navigate to the grid with Tab
4. Use arrow keys to navigate cells
5. Listen for announcements on sort/filter/select

**Windows (JAWS)**
1. Start JAWS
2. Navigate to grid
3. Press Insert + Down Arrow to read continuously
4. Use arrow keys for cell-by-cell navigation

**macOS (VoiceOver)**
1. Press Cmd + F5 to start VoiceOver
2. Use VO + arrow keys to navigate
3. Press Control + Option + Shift + Down Arrow to interact with grid
4. Use arrow keys within grid

#### Keyboard-Only Testing

1. **Tab Navigation**: Press Tab repeatedly to ensure logical focus order
2. **Arrow Keys**: Verify you can navigate to all cells
3. **Action Keys**: Test Space (select), Enter (edit), Escape (cancel)
4. **Extended Nav**: Test Home/End, PageUp/PageDown, Ctrl+Home/End
5. **Focus Visible**: Ensure focus indicator is always visible
6. **No Keyboard Traps**: Verify you can Tab out of the grid

#### Browser Tools

**Chrome DevTools**
1. Right-click grid → Inspect
2. Go to "Accessibility" tab
3. View ARIA tree structure
4. Check computed ARIA properties

**Firefox DevTools**
1. Right-click grid → Inspect
2. Click "Accessibility" panel
3. View role and properties
4. Check contrast ratios

**WAVE Extension**
1. Install WAVE from WebAIM
2. Click WAVE icon in browser
3. View errors, alerts, and features
4. Check ARIA usage

## 🎨 Customization

### Custom Focus Styles

```css
/* In your CSS */
.data-grid [role="gridcell"]:focus {
  outline: 3px solid #your-brand-color;
  outline-offset: -3px;
}
```

### Custom Announcements

```tsx
import { useScreenReaderAnnouncements } from './DataGrid';

function MyGrid() {
  const { announce } = useScreenReaderAnnouncements();
  
  const handleCustomAction = () => {
    // Custom announcement
    announce('Custom action completed successfully');
  };
  
  return <DataGrid{...props} />;
}
```

## 📋 Checklist

Use this checklist to verify accessibility:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible on all focusable elements
- [ ] Grid has proper ARIA roles (grid, row, columnheader, gridcell)
- [ ] Grid has aria-rowcount and aria-colcount
- [ ] Rows have aria-rowindex
- [ ] Cells have aria-colindex
- [ ] Selected rows have aria-selected="true"
- [ ] Sorted columns have aria-sort attribute
- [ ] Screen reader announces selection changes
- [ ] Screen reader announces sort changes
- [ ] Screen reader announces pagination
- [ ] Tab navigation follows logical order
- [ ] Space key toggles row selection
- [ ] Enter key starts editing
- [ ] Escape key cancels editing
- [ ] Arrow keys navigate cells
- [ ] Home/End keys work as expected
- [ ] Ctrl+Home/End jump to grid edges
- [ ] PageUp/PageDown change pages
- [ ] No keyboard traps
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus is never lost
- [ ] Works with NVDA screen reader
- [ ] Works with JAWS screen reader
- [ ] Works with VoiceOver screen reader

## 📚 Resources

### Standards & Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [MDN ARIA: grid role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/grid_role)

### Tools
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Accessibility Insights](https://accessibilityinsights.io/)

### Testing
- [WebAIM Keyboard Testing](https://webaim.org/articles/keyboard/)
- [Screen Reader Testing Guide](https://webaim.org/articles/screenreader_testing/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

## 🤝 Contributing

Found an accessibility issue? Please:
1. Open an issue on GitHub with details
2. Include screen reader name/version
3. Describe the expected vs actual behavior
4. Provide steps to reproduce

## 📝 License

MIT

---

**Built with accessibility in mind** ♿
