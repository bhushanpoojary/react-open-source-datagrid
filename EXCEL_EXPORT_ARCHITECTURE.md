# Excel Export - Architecture & Flow Diagrams

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          DataGrid Component                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                        Toolbar                            │  │
│  │  [Column Chooser]  [Export Button] ◄── NEW              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      ExportMenu.tsx                       │  │
│  │  (NEW COMPONENT)                                         │  │
│  │  - Format selection (CSV/XLSX)                           │  │
│  │  - Scope selection (All/Filtered/Selected/Page)         │  │
│  │  - Styling selection (Basic/Professional)               │  │
│  │  - Preview & Statistics                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    exportUtils.ts                         │  │
│  │  (NEW MODULE)                                            │  │
│  │  - exportToCSV()                                         │  │
│  │  - exportToXLSX()                                        │  │
│  │  - applyProfessionalStyling()                            │  │
│  │  - handleExport()                                        │  │
│  │  - generateFilename()                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Browser Download API                    │  │
│  │  (File Download)                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Data Flow:                                                     │
│  - GridState (filters, selections, pagination)                 │
│  - Row data (full dataset, filtered, selected, page)           │
│  - Column definitions                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Export Flow Diagram

```
START
  │
  ▼
User clicks [Export]
  │
  ▼
ExportMenu opens
  │
  ├─ Show format options: CSV / XLSX
  ├─ Show scope options: All / Filtered / Selected / Page
  ├─ Show styling options: Basic / Professional (XLSX only)
  ├─ Display preview: row count & column count
  │
  ▼
User selects options
  │
  ├─ Format: CSV or XLSX
  ├─ Scope: Determines data source
  └─ Styling: Colors and formatting (XLSX only)
  │
  ▼
User clicks [Export Now]
  │
  ▼
getDataByScope()
  │
  ├─ 'all'      → fullDataset
  ├─ 'filtered' → filteredData (respects filters)
  ├─ 'selected' → filteredData.filter(in selectedRows)
  └─ 'page'     → currentPageData
  │
  ▼
Check if data empty?
  │
  ├─ YES → Show alert, stay in menu
  │
  └─ NO → Continue
     │
     ▼
  handleExport(data, columns, options)
     │
     ├─ Generate filename with timestamp
     │
     ├─ Format === 'csv'?
     │  │
     │  ├─ YES → exportToCSV()
     │  │         ├─ Create headers row
     │  │         ├─ Create data rows with escaping
     │  │         ├─ Join with newlines
     │  │         └─ Download CSV file
     │  │
     │  └─ NO → exportToXLSX()
     │          ├─ Create XLSX worksheet
     │          ├─ Add data rows
     │          ├─ Styling === 'professional'?
     │          │  ├─ YES → applyProfessionalStyling()
     │          │  │        ├─ Header: Blue bg, white text
     │          │  │        ├─ Rows: Alternating colors
     │          │  │        ├─ Borders: All cells
     │          │  │        └─ Freeze: First row
     │          │  │
     │          │  └─ NO → Skip styling
     │          │
     │          ├─ Set column widths
     │          └─ Download XLSX file
     │
     ▼
Menu closes
  │
  ▼
File appears in downloads
  │
  ▼
END
```

## 📊 Data Scope Resolution

```
DataGrid State & Props
      │
      ├─► filteredRows (after sorting + filtering)
      │    │
      │    ├─ "All" scope ───────► fullDataset (original rows)
      │    │
      │    ├─ "Filtered" scope ──► filteredRows (filter applied)
      │    │
      │    ├─ "Selected" scope ──► filteredRows.filter(id in selectedRows)
      │    │                       
      │    └─ "Page" scope ───────► paginatedRows (current page only)
      │
      ▼
  Export Data
```

## 🎨 Component Hierarchy

```
DataGrid
  │
  ├─ Toolbar
  │  ├─ ColumnChooser (existing)
  │  └─ ExportMenu (NEW)
  │     │
  │     ├─ Export Button
  │     │  └─ Download Icon
  │     │
  │     └─ Dropdown Menu (when open)
  │        ├─ Format Section
  │        │  ├─ CSV Radio
  │        │  └─ XLSX Radio
  │        │
  │        ├─ Scope Section
  │        │  ├─ Full Dataset Radio
  │        │  ├─ Filtered Data Radio
  │        │  ├─ Selected Rows Radio
  │        │  └─ Current Page Radio
  │        │
  │        ├─ Styling Section (XLSX only)
  │        │  ├─ Basic Radio
  │        │  └─ Professional Radio
  │        │
  │        ├─ Preview Box
  │        │  ├─ Row count
  │        │  └─ Column count
  │        │
  │        └─ Action Buttons
  │           ├─ Cancel
  │           └─ Export Now
  │
  ├─ GroupByPanel (existing)
  ├─ GridHeader (existing)
  ├─ GridBody (existing)
  ├─ GridFooter (existing)
  └─ GridPagination (existing)
```

## 🔌 Integration Points

```
ExportMenu Props (Input)
  │
  ├─ columns: Column[]
  │  └─ Used for: Header creation, column count, column order
  │
  ├─ fullDataset: Row[]
  │  └─ Used for: "All" scope export
  │
  ├─ filteredData: Row[]
  │  └─ Used for: "Filtered" scope export
  │
  ├─ selectedRows: Set<string | number>
  │  └─ Used for: "Selected" scope export
  │
  └─ currentPageData: Row[]
     └─ Used for: "Page" scope export
```

## 💾 CSV Export Flow

```
Source Data
  │
  ▼
Extract Column Headers
  │
  ├─ Map columns to headerName
  └─ Join with commas
     │
     ▼
  "Name,Department,Salary,..."
     │
     ▼
Process Each Row
  │
  ├─ For each column:
  │  ├─ Get cell value
  │  ├─ Convert to string
  │  ├─ Check for special chars (comma, newline, quote)
  │  └─ Wrap in quotes if needed, escape quotes as ""
  │
  ├─ Join values with commas
  └─ Join rows with newlines
     │
     ▼
CSV String: "Name,Dept,Salary\nJohn,Eng,95000\n..."
     │
     ▼
Create Blob
  │
  ├─ Blob type: text/csv;charset=utf-8
     │
     ▼
Download File
  │
  ├─ Create download link
  ├─ Set href to blob URL
  ├─ Click link programmatically
  └─ Revoke blob URL
     │
     ▼
Browser Download
```

## 📊 XLSX Export Flow (Professional Styling)

```
Source Data
  │
  ▼
Convert to Array of Arrays
  │
  ├─ [0] = Headers
  ├─ [1] = First data row
  ├─ [2] = Second data row
  └─ ...
     │
     ▼
Create XLSX Worksheet
  │
  ├─ Use xlsx.utils.aoa_to_sheet()
  ├─ Convert array to worksheet
     │
     ▼
Apply Professional Styling
  │
  ├─ Header Row (Row 0)
  │  ├─ Background: Dark Blue (#2F5496)
  │  ├─ Text: White, Bold
  │  ├─ Alignment: Center
  │  └─ Applied to: All header cells
  │
  ├─ Data Rows (Rows 1+)
  │  ├─ Alternating rows (every 2nd row)
  │  │  ├─ Even rows: Light gray (#F2F2F2)
  │  │  └─ Odd rows: White
  │  │
  │  ├─ All rows: Thin borders
  │  └─ Alignment: Left, vertical center
  │
  ├─ Column Widths
  │  ├─ Calculate from header + data
  │  ├─ Min 15 chars, Max 50 chars
  │  └─ Apply to all columns
  │
  └─ Freeze Header Row
     ├─ First row frozen
     └─ Scrollable from row 2
        │
        ▼
Create Workbook
  │
  ├─ Create new workbook
  ├─ Add styled worksheet
  ├─ Set sheet name: "Sheet1"
     │
     ▼
Generate XLSX File
  │
  ├─ Use xlsx.writeFile()
  ├─ Generate binary XLSX
     │
     ▼
Download File
  │
  ├─ Browser download
  │
  ▼
User opens in Excel
  │
  ├─ Sees blue header
  ├─ Sees alternating row colors
  ├─ Sees borders
  ├─ Can scroll with frozen header
  │
  ▼
SUCCESS
```

## 🎯 Scope Data Selection Logic

```
                                    ┌─────────────────────────┐
                                    │   Full Dataset Scope    │
                                    │                         │
                                    │  Returns: rows          │
                                    │  (Original unfiltered)  │
                                    └─────────────────────────┘
                                              ▲
                                              │
                                    ┌─────────────────────────┐
                                    │ Filtered Data Scope     │
                                    │                         │
                                    │ Returns: filteredRows   │
                                    │ (After filter applied)  │
                                    └─────────────────────────┘
                                              ▲
                                              │
        ┌─────────────────────────────────────┼──────────────────────────┐
        │                                     │                          │
┌───────▼─────────┐              ┌──────────▼──────────┐      ┌─────────▼─────────┐
│ Selected Rows   │              │  Current Page      │      │  Other Features   │
│ Scope           │              │  Scope             │      │                   │
│                 │              │                    │      │  - Sorting order  │
│ Returns:        │              │ Returns:           │      │  - Column order   │
│ filteredRows    │              │ paginatedRows      │      │  - Column widths  │
│ .filter(id in   │              │ (Page 1, 2, etc.)  │      │  - Column pin     │
│  selectedRows)  │              │                    │      │  - Hidden columns │
└─────────────────┘              └────────────────────┘      └───────────────────┘
       ▲                                  ▲
       │                                  │
   From state                         From state
```

## 🔧 Type Flow

```
Row (type)
  │
  ├─ id: string | number (required)
  ├─ [key: string]: any (other properties)
  │
  ▼
Export Data
  │
  ├─ Filter GroupedRows out
  │  (GroupedRow has 'isGroup' property)
  │
  ├─ Ensure type safety with filters
  │  selectedData as Row[]
  │
  ▼
exportToCSV() or exportToXLSX()
  │
  ├─ Iterate over Rows
  │
  ├─ Access row[column.field]
  │
  ├─ Convert to string
  │
  ▼
Download
```

## 📈 State Dependencies

```
GridState
  │
  ├─ selection.selectedRows (Set<string | number>)
  │  └─ Used in: "Selected Rows" scope
  │
  ├─ filterConfig ({ field: string; value: string })
  │  └─ Used in: DataGrid creates filteredRows
  │     └─ Used in: "Filtered Data" scope
  │
  ├─ sortConfig (field, direction)
  │  └─ Used in: DataGrid creates sortedRows
  │     └─ Used in: All scopes preserve sort order
  │
  ├─ currentPage (number)
  │  └─ Used in: DataGrid creates paginatedRows
  │     └─ Used in: "Current Page" scope
  │
  ├─ pageSize (number)
  │  └─ Used in: Pagination calculation
  │     └─ Used in: "Current Page" scope
  │
  └─ columnOrder (string[])
     └─ Used in: Column iteration order
        └─ Used in: All exports maintain order
```

## 🔀 Conditional Logic: Disabled States

```
"Full Dataset" Button
  │
  └─ Always ENABLED

"Filtered Data" Button
  │
  ├─ ENABLED if: filteredData.length > 0
  │  AND (filters active OR full dataset shown)
  │
  └─ DISABLED if: filteredData.length === 0

"Selected Rows" Button
  │
  ├─ ENABLED if: selectedRows.size > 0
  │
  └─ DISABLED if: selectedRows.size === 0

"Current Page" Button
  │
  ├─ ENABLED if: currentPageData.length > 0
  │  AND (pagination enabled)
  │
  └─ DISABLED if: pagination disabled OR no rows on page

"Styling" Options (XLSX format)
  │
  ├─ VISIBLE if: format === 'xlsx'
  │
  └─ HIDDEN if: format === 'csv'
```

## 🎬 User Interaction Sequence

```
User
  │
  ├─ Click [Export]
  │  └─ ExportMenu appears
  │
  ├─ Select Format (CSV/XLSX)
  │  └─ Styling section shows/hides
  │
  ├─ Select Scope (All/Filtered/Selected/Page)
  │  └─ Preview updates row count
  │
  ├─ (If XLSX) Select Styling (Basic/Professional)
  │  └─ No visible change (styling applied on export)
  │
  ├─ Review Preview
  │  └─ Check row/column count
  │
  ├─ Click [Export Now] or [Cancel]
  │  ├─ Export: File downloads, menu closes
  │  └─ Cancel: Menu closes, no file
  │
  └─ Open downloaded file
     └─ File displays in Excel/text editor
```

## 📱 Responsive Behavior

```
Desktop (1920px+)
  │
  ├─ Export button visible
  ├─ Menu aligns right
  ├─ Full width menu (w-96)
  └─ All options readable

Tablet (768px)
  │
  ├─ Export button visible
  ├─ Menu scrolls if needed
  ├─ Width adjusted with padding
  └─ Readable text

Mobile (375px)
  │
  ├─ Export button visible
  ├─ Menu positioned carefully
  ├─ Text may wrap
  └─ Still functional
```

## ✨ This completes the Excel Export feature implementation!
