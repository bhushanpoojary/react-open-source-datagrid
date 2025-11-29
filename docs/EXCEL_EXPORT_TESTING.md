# Excel Export Feature - Testing Guide

## How to Test the Export Feature

### Test Environment Setup
1. Navigate to `http://localhost:5175` (or the running dev server port)
2. The DataGrid demo page should display with sample employee data
3. You should see an **"Export"** button in the toolbar next to the Column Chooser

### Test Scenarios

#### Test 1: CSV Export - Full Dataset
1. Click the **Export** button
2. In the menu, ensure **Format** is set to "CSV"
3. Ensure **Scope** is set to "Full Dataset"
4. Click **Export Now**
5. **Expected Result**: `data_export_all_TIMESTAMP.csv` downloads
6. **Verify**: Open in Excel/text editor, all 25 rows + headers should be present

#### Test 2: CSV Export - Filtered Data
1. In the DataGrid, click on the "Department" column header filter
2. Enter "Engineering" to filter
3. Click **Export** button
4. Set **Format** to "CSV" and **Scope** to "Filtered Data"
5. Verify the preview shows filtered row count
6. Click **Export Now**
7. **Expected Result**: File downloads with only Engineering department employees (should be ~8 rows)

#### Test 3: CSV Export - Selected Rows
1. Click checkboxes in the grid to select 3-5 rows
2. Click **Export** button
3. Set **Format** to "CSV" and **Scope** to "Selected Rows"
4. Verify the row count shows your selected count
5. Click **Export Now**
6. **Expected Result**: File contains only selected rows

#### Test 4: CSV Export - Current Page
1. Ensure pagination is active (default page size is 10)
2. Navigate to page 2
3. Click **Export** button
4. Set **Format** to "CSV" and **Scope** to "Current Page"
5. Verify preview shows 10 rows (or fewer on last page)
6. Click **Export Now**
7. **Expected Result**: File contains only the rows on current page

#### Test 5: XLSX Export - Full Dataset Basic
1. Click **Export** button
2. Set **Format** to "XLSX (Excel)" and **Scope** to "Full Dataset"
3. Set **Styling** to "Basic"
4. Click **Export Now**
5. **Expected Result**: `data_export_all_TIMESTAMP.xlsx` downloads
6. **Verify**: Open in Excel
   - All columns should be present
   - All 25 rows of data
   - Column widths auto-fitted
   - No special formatting

#### Test 6: XLSX Export - Filtered Data Professional
1. Apply a filter (e.g., salary > 90000)
2. Click **Export** button
3. Set **Format** to "XLSX (Excel)", **Scope** to "Filtered Data", **Styling** to "Professional"
4. Click **Export Now**
5. **Expected Result**: File downloads with professional formatting
6. **Verify** in Excel:
   - Header row has dark blue background with white text
   - Alternating row colors (white/light gray)
   - Borders on all cells
   - Header row is frozen (scroll down, header stays)
   - Only filtered rows included

#### Test 7: XLSX Export - Selected Rows Professional
1. Select 5 specific rows using checkboxes
2. Click **Export** button
3. Set **Format** to "XLSX (Excel)", **Scope** to "Selected Rows", **Styling** to "Professional"
4. Verify preview shows correct row count
5. Click **Export Now**
6. **Expected Result**: File contains selected rows with professional styling

#### Test 8: XLSX Export - Current Page Professional
1. Navigate to page 2
2. Click **Export** button
3. Set **Format** to "XLSX (Excel)", **Scope** to "Current Page", **Styling** to "Professional"
4. Click **Export Now**
5. **Expected Result**: File contains current page data with professional formatting

#### Test 9: UI Behavior - Disabled Options
1. Click **Export** button
2. **Verify**:
   - "Current Page" is only enabled when pagination is active
   - "Selected Rows" shows current count in label, disabled if 0 selected
   - Options are grayed out when not available
   - Preview shows "0 rows" for disabled options if clicked

#### Test 10: Special Characters in Data
1. Filter to show all rows
2. Export to CSV
3. **Expected Result**: Values with commas are quoted, quotes are escaped ("""")
4. Verify in text editor: `"John ""Jack"" Smith"` format for quotes

#### Test 11: Menu Interactions
1. Click **Export** button to open menu
2. **Verify**:
   - Menu appears below button
   - Clicking outside closes menu
   - Menu closes after export
   - Multiple exports work correctly

#### Test 12: Empty Dataset
1. Apply a filter that returns 0 rows
2. Click **Export** button
3. Set **Scope** to "Filtered Data"
4. **Expected Result**: "Export Now" button is disabled, no export occurs

#### Test 13: Filename Format
1. Export multiple times with different scopes
2. **Verify** filenames follow pattern:
   - `data_export_all_2025-11-23T14-30-45.csv`
   - `data_export_filtered_2025-11-23T14-31-12.xlsx`
   - `data_export_selected_2025-11-23T14-31-45.xlsx`
   - Timestamps are unique and in correct format

#### Test 14: Column Visibility Integration
1. Hide some columns using Column Chooser
2. Export data
3. **Expected Result**: Only visible columns are exported

#### Test 15: Sorting Integration
1. Click column header to sort (ascending, descending)
2. Export data
3. **Expected Result**: Data is exported in sorted order

#### Test 16: Data Types in XLSX
1. Export with salary column (numeric)
2. Open in Excel
3. **Expected Result**: Numbers are numeric type, can be formatted as currency

#### Test 17: Large Dataset Export
1. If demo data includes many rows, export full dataset
2. **Verify**: Export completes in reasonable time (< 5 seconds)
3. Open file to verify integrity

#### Test 18: Professional Styling Verification
1. Export with professional styling
2. Open in Excel and verify:
   - Header: Dark blue background (#2F5496)
   - Header text: White, bold
   - Data rows: Alternating white/light gray
   - All cells have thin borders
   - Column widths are reasonable (15-50 chars)
   - First row is frozen

## Visual Checklist

### Export Menu Appearance
- [ ] Export button is visible in toolbar (blue color)
- [ ] Export button has download icon
- [ ] Menu has clear sections for Format, Scope, Styling
- [ ] Disabled options appear grayed out
- [ ] Preview shows accurate row/column count
- [ ] Cancel and Export buttons are visible

### CSV File Quality
- [ ] Opens correctly in Excel
- [ ] Data rows match expected count
- [ ] Column headers are present
- [ ] Special characters are properly escaped
- [ ] Numbers are recognized as text (as expected for CSV)

### XLSX File Quality
- [ ] Opens correctly in Excel
- [ ] Professional styling applied correctly
- [ ] Header is frozen and readable
- [ ] Colors are consistent
- [ ] Borders are visible
- [ ] Data is complete and accurate

## Known Issues to Watch For
- None identified in initial testing

## Performance Benchmarks
- Full dataset export (25 rows): < 1 second
- Filtered export (8 rows): < 1 second
- XLSX with professional styling: < 2 seconds

## Success Criteria
✅ All 18 test scenarios pass
✅ No errors in browser console
✅ Files download correctly
✅ Files open properly in Excel/Sheets
✅ Data integrity is maintained
✅ UI is responsive and intuitive
