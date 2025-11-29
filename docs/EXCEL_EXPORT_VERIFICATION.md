# Excel Export - Visual Verification Guide

## Component Visibility

### Export Button Location
- **Position**: DataGrid toolbar (top-left area)
- **Next to**: Column Chooser component
- **Color**: Blue (#1D4ED8)
- **Icon**: Download icon (SVG)
- **Label**: "Export"
- **Size**: Medium button with padding

### Visual Layout
```
┌─────────────────────────────────────────────────┐
│ DataGrid Toolbar                                │
├─────────────────────────────────────────────────┤
│ [Column Chooser] [Export] <-- HERE             │
│                                                  │
│ Group By Panel                                   │
├─────────────────────────────────────────────────┤
│ Sticky Header (Columns)                         │
├─────────────────────────────────────────────────┤
│ Grid Body (Data Rows)                           │
├─────────────────────────────────────────────────┤
│ Pagination Controls                             │
└─────────────────────────────────────────────────┘
```

## Menu Layout When Clicked

```
┌─────────────────────────────────────────────────┐
│ Format Section                                   │
│ ○ CSV    ○ XLSX (Excel)                        │
├─────────────────────────────────────────────────┤
│ Data Scope Section                              │
│ ○ Full Dataset           (always available)     │
│ ○ Filtered Data          (disabled if no filter)│
│ ○ Selected Rows (0)      (disabled if 0 rows)   │
│ ○ Current Page           (disabled if no page)  │
├─────────────────────────────────────────────────┤
│ Styling Section (XLSX only)                    │
│ ○ Basic    ○ Professional                      │
│ Professional adds colors, borders, frozen header│
├─────────────────────────────────────────────────┤
│ Data Preview                                    │
│ Data to export: 15 row(s)                       │
│ Columns: 7                                       │
├─────────────────────────────────────────────────┤
│ [Cancel]  [Export Now]                         │
└─────────────────────────────────────────────────┘
```

## Step-by-Step Visual Check

### Check 1: Button Appears in Toolbar
1. Open `http://localhost:5175`
2. Wait for DataGrid to render
3. **Look for**: Blue "Export" button with download icon
4. **Should be**: Left of center, in toolbar area
5. **Expected**: Button is clickable

### Check 2: Menu Appears on Click
1. Click the "Export" button
2. **Expected**: Dropdown menu appears below button
3. **Check**: 
   - ✓ Format options visible (CSV, XLSX)
   - ✓ Scope options visible (4 options)
   - ✓ Styling options visible (if XLSX selected)
   - ✓ Preview area shows row/column count
   - ✓ Buttons visible (Cancel, Export Now)

### Check 3: Format Selection Works
1. Menu open, observe "Format" section
2. Click on "XLSX (Excel)" radio button
3. **Expected**: "Styling" section appears
4. Click on "CSV" radio button
5. **Expected**: "Styling" section disappears

### Check 4: Scope Selection Works
1. Try clicking each scope option:
   - Full Dataset (should always work)
   - Filtered Data (should show disabled state if no filter)
   - Selected Rows (should show disabled state and count)
   - Current Page (should show disabled state if pagination off)
2. **Expected**: Can select available options, disabled ones are grayed out

### Check 5: Styling Selection Works
1. Select XLSX format
2. Choose "Professional" styling
3. **Expected**: Preview updates, no errors
4. Switch to "Basic"
5. **Expected**: Preview still shows accurate row count

### Check 6: Preview Shows Correct Data
1. Apply a filter (e.g., "Engineering" in department)
2. Select 5 rows
3. Navigate to page 2
4. Open Export menu
5. **Check each scope**:
   - "Full Dataset": Shows 25 rows
   - "Filtered Data": Shows ~8 rows (Engineering only)
   - "Selected Rows": Shows 5 rows
   - "Current Page": Shows 10 rows (or less on last page)

### Check 7: Export Functionality
1. Click "Export Now" with default settings
2. **Expected**: File downloads immediately
3. **Check browser downloads**: File name includes timestamp
4. **Check file**:
   - CSV file: Can open in text editor, see comma-separated values
   - XLSX file: Can open in Excel, see formatted spreadsheet

### Check 8: Menu Closes After Export
1. Click "Export" to open menu
2. Click "Export Now"
3. **Expected**: Menu closes automatically
4. **Expected**: File downloaded without errors

### Check 9: Menu Closes on Cancel
1. Click "Export" to open menu
2. Click "Cancel"
3. **Expected**: Menu closes
4. **Expected**: No export occurs

### Check 10: Menu Closes on Outside Click
1. Click "Export" to open menu
2. Click elsewhere on page (not on menu)
3. **Expected**: Menu closes
4. **Expected**: No export occurs

## File Quality Checks

### CSV File Verification
1. Download CSV file
2. Open in text editor:
   - **First line**: Column headers
   - **Data lines**: Values separated by commas
   - **Special chars**: Quotes escaped as ""
3. Open in Excel:
   - **Columns**: Auto-width, readable
   - **Data**: Properly formatted rows

### XLSX File Verification (Basic)
1. Download XLSX file (Basic styling)
2. Open in Excel:
   - **Headers**: First row visible
   - **Data**: All rows visible
   - **Columns**: Auto-width, readable
   - **Colors**: Plain (no formatting)
   - **Borders**: None or minimal

### XLSX File Verification (Professional)
1. Download XLSX file (Professional styling)
2. Open in Excel:
   - **Header**: Dark blue background ✓
   - **Header text**: White, bold ✓
   - **Data rows**: Alternating white/gray ✓
   - **Borders**: Visible on all cells ✓
   - **Frozen header**: Scroll down, header stays visible ✓
   - **Column width**: Auto-sized appropriately ✓

## Responsive Design Checks

### Desktop (Full Width)
1. Open at full screen width (1920px or wider)
2. **Check**: Export button is clearly visible
3. **Check**: Menu aligns properly
4. **Check**: All options readable

### Tablet (768px)
1. Resize window to tablet size
2. **Check**: Export button still visible
3. **Check**: Menu is readable
4. **Check**: No content overflow

### Mobile (375px)
1. Resize window to mobile size
2. **Check**: Export button still accessible
3. **Check**: Menu fits on screen
4. **Check**: Can scroll to see all options

## Error Scenarios

### Scenario 1: No Data to Export
1. Apply filter that returns 0 rows
2. Click "Export" button
3. **Expected**: Menu opens
4. **Expected**: "Export Now" button is disabled (grayed out)
5. **Expected**: Clicking still disabled button shows no export

### Scenario 2: No Selected Rows
1. Don't select any rows
2. Click "Export" button
3. **Expected**: "Selected Rows (0)" is disabled
4. **Expected**: Cannot click it

### Scenario 3: Browser Console Clean
1. Open browser dev tools (F12)
2. Click Export button
3. Select options
4. Click Export Now
5. **Expected**: No red errors in console
6. **Expected**: File downloads successfully

## Performance Checks

### Check 1: Menu Opens Quickly
1. Click Export button
2. **Expected**: Menu appears instantly (< 100ms)
3. **Check**: No lag or delay

### Check 2: Export Completes Quickly
1. Click Export Now on full dataset
2. **Expected**: File downloads within 1 second
3. **Check**: No "not responding" warnings

### Check 3: Professional Styling Completes Quickly
1. Export 100+ rows with professional styling
2. **Expected**: Completes within 3 seconds
3. **Check**: No freezing or lag

## Accessibility Checks

### Check 1: Keyboard Navigation
1. Tab through page
2. **Expected**: Export button is focusable
3. **Expected**: Can press Enter to open menu
4. **Expected**: Tab through menu options

### Check 2: Screen Reader
1. Use screen reader (if available)
2. **Expected**: Button label readable
3. **Expected**: Menu options readable
4. **Expected**: Radio buttons announced correctly

### Check 3: Color Contrast
1. Check export button text contrast
2. **Expected**: White text on blue background is clear
3. **Expected**: Menu text is readable on white background

## Browser Developer Tools

### Check Console for Errors
1. Open F12 Developer Tools
2. Go to Console tab
3. Perform export actions
4. **Expected**: No red error messages
5. **Expected**: No warnings about undefined functions

### Check Network Tab
1. Open F12 Developer Tools
2. Go to Network tab
3. Click Export Now
4. **Expected**: File download shows in network (if applicable)
5. **Expected**: Response is successful (no 404s or 500s)

## Successful Completion

✅ **All checks pass when**:
- Export button is visible in toolbar
- Menu opens/closes correctly
- All export formats work (CSV, XLSX)
- All data scopes work correctly
- Professional styling applies correctly
- Files download with correct names
- Files open properly in Excel/text editor
- No console errors
- Responsive design works
- Performance is acceptable
- Accessibility is adequate

🎉 **If all above checks pass, the Excel Export feature is working correctly!**
