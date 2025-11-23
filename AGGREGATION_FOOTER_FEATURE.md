# DataGrid Aggregation Row / Footer Row Feature

## Overview

The DataGrid now supports powerful aggregation capabilities with footer rows that display summary statistics for your data. This feature includes:

- **Global Footer Row**: Display aggregations across all filtered data
- **Group-Level Footer Rows**: Show subtotals for each group when using row grouping
- **Multiple Aggregate Functions**: Total, Average, Min, Max, and Count
- **Flexible Configuration**: Choose which columns to aggregate and how to display them

## Supported Aggregate Functions

| Function | Description | Example Use Case |
|----------|-------------|------------------|
| `total` / `sum` | Sum of all values | Total sales, total salary |
| `avg` | Average of all values | Average salary, average rating |
| `min` | Minimum value | Lowest price, earliest date |
| `max` | Maximum value | Highest score, latest date |
| `count` | Count of rows | Number of employees, total records |

## Usage

### Basic Global Footer

Add a global footer row to display aggregations across all data:

```tsx
<DataGrid
  columns={columns}
  rows={data}
  footerConfig={{
    show: true,
    aggregates: [
      { field: 'salary', function: 'total' },
      { field: 'salary', function: 'avg' },
      { field: 'id', function: 'count' },
    ],
  }}
/>
```

### Custom Labels

Customize the labels for your aggregates:

```tsx
<DataGrid
  columns={columns}
  rows={data}
  footerConfig={{
    show: true,
    aggregates: [
      { field: 'salary', function: 'total', label: 'Total Payroll' },
      { field: 'salary', function: 'avg', label: 'Avg Compensation' },
      { field: 'salary', function: 'min', label: 'Minimum Salary' },
      { field: 'salary', function: 'max', label: 'Maximum Salary' },
      { field: 'id', function: 'count', label: 'Total Employees' },
    ],
  }}
/>
```

### Multiple Aggregates Per Column

Display multiple aggregations for the same column:

```tsx
<DataGrid
  columns={columns}
  rows={data}
  footerConfig={{
    show: true,
    aggregates: [
      { field: 'revenue', function: 'total', label: 'Total Revenue' },
      { field: 'revenue', function: 'avg', label: 'Avg Revenue' },
      { field: 'revenue', function: 'min', label: 'Min Revenue' },
      { field: 'revenue', function: 'max', label: 'Max Revenue' },
    ],
  }}
/>
```

### Group-Level Footers

When using row grouping, enable group-level footer rows to show subtotals for each group:

```tsx
<DataGrid
  columns={columns}
  rows={data}
  footerConfig={{
    show: true,
    showGroupFooters: true,  // Enable group-level footers
    aggregates: [
      { field: 'salary', function: 'total' },
      { field: 'salary', function: 'avg' },
      { field: 'id', function: 'count' },
    ],
  }}
/>
```

When users group by department, each group will display:
1. The group header (e.g., "Department: Engineering")
2. All rows in that group
3. A footer row with subtotals for that group (e.g., "Department: Engineering Subtotal")
4. The global footer at the bottom showing totals across all groups

## FooterConfig Type

```typescript
interface FooterConfig {
  show: boolean;                    // Show the global footer
  aggregates?: AggregateConfig[];   // Array of aggregate configurations
  showGroupFooters?: boolean;       // Show footers for each group (requires grouping)
}

interface AggregateConfig {
  field: string;                    // Column field to aggregate
  function: AggregateFunction;      // Aggregate function to apply
  label?: string;                   // Optional custom label
}

type AggregateFunction = 'count' | 'sum' | 'total' | 'avg' | 'min' | 'max';
```

## Visual Behavior

### Global Footer
- Displayed at the bottom of the grid, above the pagination
- Uses a distinct gray background (`bg-gray-50`) with bold text
- First column shows "Total" label by default
- Aggregate values align with their respective columns
- Respects column pinning (left/right)

### Group-Level Footers
- Displayed after all rows in each expanded group
- Uses a gray background (`bg-gray-100`) with medium font weight
- First column shows group context (e.g., "Department: Engineering Subtotal")
- Indented to match the group level for visual hierarchy
- Only visible when the group is expanded

## Complete Example

```tsx
import { DataGrid, type Column, type Row } from './DataGrid';

const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'department', headerName: 'Department', width: 160 },
  { field: 'salary', headerName: 'Salary', width: 120 },
];

const employees: Row[] = [
  { id: 1, name: 'John Doe', department: 'Engineering', salary: 95000 },
  { id: 2, name: 'Jane Smith', department: 'Product', salary: 110000 },
  { id: 3, name: 'Bob Johnson', department: 'Engineering', salary: 85000 },
  // ... more data
];

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={employees}
      footerConfig={{
        show: true,
        showGroupFooters: true,
        aggregates: [
          { field: 'salary', function: 'total', label: 'Total Salary' },
          { field: 'salary', function: 'avg', label: 'Avg Salary' },
          { field: 'salary', function: 'min', label: 'Min Salary' },
          { field: 'salary', function: 'max', label: 'Max Salary' },
          { field: 'id', function: 'count', label: 'Total Employees' },
        ],
      }}
    />
  );
}
```

## How It Works

### Data Processing Flow

1. **Filtering**: Aggregations are computed on filtered data (after applying column filters)
2. **Grouping**: When grouping is enabled:
   - Global footer aggregates all leaf rows across all groups
   - Group footers aggregate only the rows within their group
3. **Pagination**: Footer shows aggregations for ALL data, not just the current page

### Aggregate Computation

- **Numeric values only**: Only numeric values are included in calculations (non-numeric values are filtered out)
- **Null handling**: `null` and `undefined` values are excluded from calculations
- **Count**: Counts all rows regardless of null values
- **Formatting**: 
  - Count: Integer display
  - Average: 2 decimal places
  - Other functions: 2 decimal places for decimals, integer for whole numbers

## Integration with Other Features

### Works With Grouping
- Group-level footers automatically appear when `showGroupFooters: true`
- Footers are indented to match their group level
- Footers show/hide based on group expansion state

### Works With Column Pinning
- Footer cells respect column pinning (left/right)
- Pinned footer cells maintain sticky positioning
- Footer cells have matching widths with their columns

### Works With Filtering
- Aggregations update automatically when filters change
- Only filtered rows are included in calculations

### Works With Sorting
- Aggregations are independent of sort order
- Same totals regardless of how data is sorted

## Styling and Customization

The footer uses Tailwind CSS classes for styling:

- **Global Footer**: `bg-gray-50`, `font-semibold`, `border-t-2`, `border-gray-300`
- **Group Footer**: `bg-gray-100`, `font-medium`, `border-t`, `border-gray-300`
- **Labels**: Gray text with appropriate font weights
- **Values**: Darker text for better contrast

You can customize the styling by modifying the `GridFooter.tsx` and `GroupRow.tsx` (GroupFooterRow component) files.

## Performance Considerations

- Aggregations are computed using `useMemo` to prevent unnecessary recalculations
- Only recalculated when filtered data or grouping structure changes
- Efficient computation even with large datasets (tested with 1000+ rows)

## Future Enhancements

Potential improvements for future versions:

- Custom aggregate functions (e.g., median, mode, standard deviation)
- Conditional formatting based on aggregate values
- Export footer values with data export
- Aggregate-specific formatting options
- Formula-based aggregates combining multiple fields
