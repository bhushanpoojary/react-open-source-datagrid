# Excel Export (CSV, XLSX) - Implementation Summary

## Feature Overview

The DataGrid now includes comprehensive Excel export functionality with support for multiple export formats (CSV and XLSX) and data scopes (full dataset, filtered data, selected rows, and current page). Professional styling is available for XLSX exports.

## Features Implemented

### ✅ Core Export Capabilities
- **CSV Export**: Export data in standard CSV format for compatibility with all spreadsheet applications
- **XLSX Export**: Export data in modern Excel format with optional professional styling
- **Multiple Data Scopes**:
  - **Full Dataset**: Export all rows from the original data source
  - **Filtered Data**: Export only rows that match the current filter criteria
  - **Selected Rows**: Export only the rows selected by the user (with row count displayed)
  - **Current Page**: Export only the rows visible on the current page
- **Professional Styling** (XLSX only):
  - Dark blue header with white text
  - Alternating row colors for better readability
  - Borders on all cells
  - Frozen header row
  - Auto-sized columns with reasonable width constraints

### ✅ User Interface
- **Export Button**: Located in the toolbar next to the Column Chooser
- **Export Menu**: Dropdown interface with:
  - Format selection (CSV/XLSX)
  - Data scope selection with disabled options for unavailable data
  - Styling options (basic/professional for XLSX)
  - Data preview showing number of rows and columns to be exported
  - Cancel/Export buttons
- **Smart Defaults**: Menu remembers last selected options during session
- **Accessibility**: All options have clear labels and disabled states

## Files Created/Modified

### New Files
1. **`exportUtils.ts`**: Core export functionality
   - `exportToCSV()`: Handles CSV export with proper quote escaping
   - `exportToXLSX()`: Handles XLSX export with optional styling
   - `applyProfessionalStyling()`: Applies professional styling to XLSX
   - `handleExport()`: Orchestrates the export process
   - `generateFilename()`: Creates timestamped filenames

2. **`ExportMenu.tsx`**: React component for export UI
   - Format selection (CSV/XLSX)
   - Scope selection (All/Filtered/Selected/Page)
   - Styling options for XLSX
   - Data preview and statistics
   - Dropdown menu with proper z-index management

### Modified Files
1. **`DataGrid.tsx`**: Integrated ExportMenu component
   - Imports ExportMenu component
   - Passes necessary data props (full dataset, filtered data, selected rows, current page)
   - Filters out GroupedRows to ensure proper data typing
   - Positioned in toolbar alongside Column Chooser

2. **`index.ts`**: Updated exports
   - Exports ExportMenu component
   - Exports export utility functions and types
   - Makes API available to consuming applications

## Usage

### Basic Usage
The export feature is automatically integrated into the DataGrid component. No additional setup is required.

```tsx
import { DataGrid } from '@/components/DataGrid';

export const MyDataGrid = () => {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pageSize={10}
      // ... other props
    />
  );
};
```

### Advanced Usage - Direct Export Functions
You can also use the export functions directly in your own code:

```tsx
import { handleExport, exportToCSV, exportToXLSX, generateFilename } from '@/components/DataGrid';

// Export with custom options
handleExport(data, columns, {
  format: 'xlsx',
  scope: 'filtered',
  styling: 'professional',
  filename: 'custom_export.xlsx'
});

// Or use individual functions
exportToXLSX(data, columns, {
  filename: 'report.xlsx',
  styling: 'professional'
});

exportToCSV(data, columns, 'report.csv');
```

## Technical Details

### Data Handling
- **CSV Format**: Properly escapes quotes and wraps values containing commas or newlines
- **XLSX Format**: Maintains data types and allows for rich formatting
- **Filtered Data**: Respects current filter configuration (not sorting-dependent)
- **Selected Rows**: Uses row ID matching to identify selected items
- **Null Handling**: Converts null/undefined values to empty strings in exports

### Performance
- Export operations are client-side (no server required)
- Large datasets are handled efficiently by the browser
- Styling application only occurs when professional styling is selected

### File Naming
- Auto-generated filenames include:
  - "data_export" prefix
  - Scope identifier (full/filtered/selected/page)
  - ISO timestamp (format: YYYY-MM-DDTHH-mm-ss)
  - Appropriate extension (.csv or .xlsx)
- Example: `data_export_filtered_2025-11-23T14-30-45.xlsx`

### XLSX Styling Details
- **Header Row**:
  - Background: Dark blue (#2F5496)
  - Text color: White
  - Font size: 11pt
  - Font weight: Bold
  - Alignment: Center, vertical center
  - Word wrap: Enabled

- **Data Rows**:
  - Alternating row backgrounds: Every other row light gray (#F2F2F2)
  - Alignment: Left, vertical center
  - Borders: Thin, light gray on all sides

- **Columns**: Auto-width (15-50 characters)
- **Header Freeze**: First row frozen for easy scrolling

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (uses modern Blob API)

## Dependencies
- `xlsx` (v0.18+): For XLSX export functionality

## Export Menu Options Reference

| Option | Values | Default | Notes |
|--------|--------|---------|-------|
| Format | CSV, XLSX | CSV | Choose output format |
| Scope | All, Filtered, Selected, Page | Filtered | Select data range (disabled if no data) |
| Styling | Basic, Professional | Basic | XLSX only; Professional adds formatting |

## Known Limitations
1. **Grouped rows**: Exported data automatically filters out group row headers (only data rows exported)
2. **Cell formatting**: Only XLSX with professional styling preserves visual formatting
3. **Large files**: Very large datasets (100k+ rows) may take a few seconds to process
4. **Formulas**: XLSX export contains values, not formulas (as intended for data export)

## Future Enhancements
- [ ] Custom column selection for export
- [ ] Custom header names mapping
- [ ] Formula support in XLSX
- [ ] Template-based styling
- [ ] Schedule export functionality
- [ ] Export to Google Sheets/OneDrive integration
- [ ] PDF export option
- [ ] JSON export option

## Testing Checklist
- [x] CSV export with full dataset
- [x] CSV export with filtered data
- [x] CSV export with selected rows
- [x] CSV export with current page
- [x] XLSX export with full dataset
- [x] XLSX export with filtered data
- [x] XLSX export with selected rows
- [x] XLSX export with current page
- [x] XLSX export with basic styling
- [x] XLSX export with professional styling
- [x] Data contains special characters (quotes, commas, newlines)
- [x] Empty dataset handling
- [x] Large dataset export
- [x] Export menu UI interactions
- [x] Proper filename generation with timestamps

## Example: Complete Export Workflow

1. User clicks **Export** button in toolbar
2. Export menu appears with options:
   - Format: CSV/XLSX
   - Scope: All/Filtered/Selected/Page
   - Styling: Basic/Professional (XLSX only)
3. User selects options and clicks **Export Now**
4. File downloads to user's computer with timestamped filename
5. User can open file in Excel, Google Sheets, or any spreadsheet application

## Integration with Other Features
- **Filtering**: Export respects active filters
- **Sorting**: Export preserves current sort order
- **Column Selection**: All visible (non-hidden) columns are included
- **Pagination**: "Current Page" option exports only paginated rows
- **Row Selection**: "Selected Rows" option exports only checked rows
- **Grouping**: Group headers are filtered out; only data rows exported
