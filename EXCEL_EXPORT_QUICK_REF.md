# Excel Export - Quick Reference

## 🚀 Quick Start

The export feature is built-in to the DataGrid. Simply click the **Export** button in the toolbar.

## 📊 Export Formats

| Format | Extension | Use Case | Professional Styling |
|--------|-----------|----------|----------------------|
| **CSV** | .csv | Universal compatibility, simple data | N/A |
| **XLSX** | .xlsx | Excel features, formatting | Available |

## 📋 Data Scopes

| Scope | What It Includes | When Available |
|-------|-----------------|-----------------|
| **Full Dataset** | All original rows | Always |
| **Filtered Data** | Rows matching current filters | When filters applied |
| **Selected Rows** | Only checked rows | When rows selected |
| **Current Page** | Rows on current page | When pagination active |

## 🎨 Styling Options (XLSX Only)

### Basic
- No special formatting
- Auto-sized columns
- Plain data layout

### Professional
- **Header**: Dark blue background with white text
- **Rows**: Alternating row colors for readability
- **Borders**: All cells have thin borders
- **Frozen Header**: Header stays visible when scrolling
- **Column Width**: Auto-fitted (15-50 characters)

## 💾 Generated Filenames

Format: `data_export_[SCOPE]_[TIMESTAMP].[EXT]`

Examples:
- `data_export_all_2025-11-23T14-30-45.csv`
- `data_export_filtered_2025-11-23T14-31-12.xlsx`
- `data_export_selected_2025-11-23T14-31-45.xlsx`
- `data_export_page_2025-11-23T14-32-00.csv`

## 🛠️ Using Export Functions Directly

```tsx
import { handleExport, exportToCSV, exportToXLSX } from '@/components/DataGrid';

// Method 1: Use handleExport (automatic)
handleExport(data, columns, {
  format: 'xlsx',
  scope: 'filtered',
  styling: 'professional'
});

// Method 2: Use specific export function
exportToXLSX(data, columns, {
  filename: 'custom_report.xlsx',
  styling: 'professional'
});

exportToCSV(data, columns, 'report.csv');
```

## 🔧 API Reference

### `handleExport(data, columns, options)`
Orchestrates the complete export process.

**Parameters:**
- `data: Row[]` - Array of data rows to export
- `columns: Column[]` - Column definitions
- `options: ExportOptions` - Export configuration

**Options:**
```tsx
{
  format: 'csv' | 'xlsx',
  scope: 'all' | 'filtered' | 'selected' | 'page',
  includeHeader?: boolean,
  styling?: 'basic' | 'professional',
  filename?: string
}
```

### `exportToCSV(data, columns, filename)`
Exports data to CSV format.

**Parameters:**
- `data: Row[]` - Data to export
- `columns: Column[]` - Column definitions
- `filename: string` - Output filename (default: 'export.csv')

### `exportToXLSX(data, columns, options)`
Exports data to XLSX format with optional styling.

**Parameters:**
- `data: Row[]` - Data to export
- `columns: Column[]` - Column definitions
- `options.filename: string` - Output filename (default: 'export.xlsx')
- `options.styling: 'basic' | 'professional'` - Styling option

### `generateFilename(format, scope)`
Generates a timestamped filename.

**Parameters:**
- `format: 'csv' | 'xlsx'` - File format
- `scope: 'all' | 'filtered' | 'selected' | 'page'` - Data scope

**Returns:** `string` - Filename with timestamp

## 📝 Integration with DataGrid Features

| Feature | Impact on Export |
|---------|------------------|
| **Filters** | Only filtered rows exported if "Filtered Data" scope selected |
| **Sorting** | Export preserves current sort order |
| **Pagination** | "Current Page" scope exports only visible page |
| **Selection** | "Selected Rows" scope exports only checked rows |
| **Column Visibility** | Hidden columns are not exported |
| **Grouping** | Group headers filtered out; only data rows exported |
| **Row Pinning** | No impact; all rows exported equally |

## 🎯 Best Practices

1. **CSV for Compatibility**: Use CSV when sharing with non-technical users
2. **XLSX for Reporting**: Use XLSX with professional styling for formal reports
3. **Filter Before Export**: Apply filters to reduce export size for large datasets
4. **Check Row Count**: Preview shows exact row count before export
5. **Professional Styling**: Provides best-looking output for management/clients

## ⚠️ Limitations

- ❌ Cannot export cell formulas (values only)
- ❌ Cannot export cell comments
- ❌ Very large datasets (100k+ rows) may be slow
- ❌ Custom cell-level styling not preserved
- ⚠️ Group row headers are excluded from export

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Export button not visible | Check if DataGrid is properly rendered |
| "No data to export" message | Ensure data exists for selected scope |
| File won't open | Try different app (Excel, Google Sheets, etc.) |
| Professional styling not visible | Ensure XLSX format and "Professional" selected |
| Very slow export | Try exporting smaller dataset or page instead of full dataset |
| Timestamps incorrect | Check browser system time |

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Works perfectly |
| Safari | ✅ Full | Works perfectly |
| Edge | ✅ Full | Recommended |
| IE 11 | ❌ Not supported | Uses modern Blob API |

## 📈 Feature Scope

✅ **Included:**
- CSV export
- XLSX export
- Full dataset export
- Filtered data export
- Selected rows export
- Current page export
- Professional styling
- Auto-generated filenames
- Auto-sized columns
- Data type handling

❌ **Not Included (Future):**
- PDF export
- JSON export
- Custom templates
- Server-side export
- Email delivery
- Cloud storage integration

## 📞 Support

For issues or feature requests related to the export functionality, check:
1. This quick reference
2. `EXCEL_EXPORT_FEATURE.md` (detailed documentation)
3. `EXCEL_EXPORT_TESTING.md` (testing guide)
4. Application logs in browser console (F12)
