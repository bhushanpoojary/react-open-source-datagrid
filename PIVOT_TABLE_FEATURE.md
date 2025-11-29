# Pivot Table Feature

## Overview

The Pivot Table feature transforms flat data into dynamic, multi-dimensional summaries with automatic column generation and powerful aggregation capabilities. Perfect for sales analysis, financial reporting, and data exploration.

## ✨ Features

- **Dynamic Column Generation**: Pivot column values automatically become new columns
- **Multiple Aggregation Functions**: Sum, Average, Count, Min, Max, and custom functions
- **Visual Styling**: Styled pivot and total columns for better data clarity
- **Export Support**: Export pivoted data directly to CSV
- **Totals & Subtotals**: Show row totals and grand total columns
- **High Performance**: Optimized O(n) algorithm handles large datasets efficiently
- **Fully Typed**: Complete TypeScript support with comprehensive interfaces
- **Exportable Components**: Use independently via npm package

## 🚀 Quick Start

### Basic Implementation

```tsx
import { DataGrid, PivotToolbar } from 'react-open-source-grid';
import type { PivotConfig } from 'react-open-source-grid';

function SalesPivot() {
  const [pivotConfig, setPivotConfig] = useState<PivotConfig | null>(null);
  const [isPivotMode, setIsPivotMode] = useState(false);

  const data = [
    { id: 1, region: 'North', product: 'Laptop', revenue: 45000 },
    { id: 2, region: 'South', product: 'Laptop', revenue: 38000 },
    { id: 3, region: 'North', product: 'Phone', revenue: 25000 },
    // ... more data
  ];

  const columns = [
    { field: 'region', headerName: 'Region' },
    { field: 'product', headerName: 'Product' },
    { field: 'revenue', headerName: 'Revenue' },
  ];

  return (
    <>
      <PivotToolbar
        columns={columns}
        pivotConfig={pivotConfig}
        onPivotToggle={setIsPivotMode}
        onConfigChange={setPivotConfig}
        isPivotMode={isPivotMode}
      />
      
      <DataGrid
        columns={columns}
        rows={data}
        pivotConfig={isPivotMode ? pivotConfig : null}
      />
    </>
  );
}
```

### Programmatic Pivot Configuration

```tsx
import type { PivotConfig } from 'react-open-source-grid';

// Create a pivot configuration
const pivotConfig: PivotConfig = {
  rowGroupColumn: 'region',      // Group rows by region
  pivotColumn: 'product',         // Product values become columns
  valueColumn: 'revenue',         // Revenue values to aggregate
  aggregator: 'sum',              // sum | avg | count | min | max
  showTotals: true,               // Show totals row at bottom
  showGrandTotal: true,           // Show grand total column
};

// Apply to grid
<DataGrid
  columns={columns}
  rows={data}
  pivotConfig={pivotConfig}
/>
```

## 📊 API Reference

### PivotConfig Interface

```typescript
interface PivotConfig {
  /** Column to group rows by (becomes first column) */
  rowGroupColumn: string;
  
  /** Column whose unique values become new columns */
  pivotColumn: string;
  
  /** Column containing values to aggregate */
  valueColumn: string;
  
  /** Aggregation function to apply */
  aggregator: AggregatorType | ((values: number[]) => number);
  
  /** Show totals row at bottom (default: false) */
  showTotals?: boolean;
  
  /** Show grand total column (default: false) */
  showGrandTotal?: boolean;
}
```

### Aggregator Types

```typescript
type AggregatorType = 'sum' | 'count' | 'avg' | 'min' | 'max';
```

### PivotToolbar Props

```typescript
interface PivotToolbarProps {
  /** Available columns for pivot configuration */
  columns: Array<{ field: string; headerName: string }>;
  
  /** Current pivot configuration */
  pivotConfig?: Partial<PivotConfig> | null;
  
  /** Callback when pivot is enabled/disabled */
  onPivotToggle: (enabled: boolean) => void;
  
  /** Callback when configuration changes */
  onConfigChange: (config: PivotConfig | null) => void;
  
  /** Whether pivot mode is currently active */
  isPivotMode?: boolean;
  
  /** Custom styles */
  style?: React.CSSProperties;
  
  /** Custom class name */
  className?: string;
}
```

## 🔧 Advanced Usage

### Custom Aggregation Function

```tsx
import { buildPivot } from 'react-open-source-grid';

// Custom aggregator: Weighted average
const weightedAverage = (values: number[]) => {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  const count = values.length;
  return sum / count * 1.15; // Apply 15% weight
};

const pivotConfig: PivotConfig = {
  rowGroupColumn: 'product',
  pivotColumn: 'region',
  valueColumn: 'revenue',
  aggregator: weightedAverage,  // Use custom function
  showTotals: true,
  showGrandTotal: true,
};
```

### Using buildPivot Directly

```tsx
import { buildPivot } from 'react-open-source-grid';
import type { PivotResult } from 'react-open-source-grid';

// Transform data programmatically
const pivotResult: PivotResult = buildPivot(data, pivotConfig);

console.log('Generated columns:', pivotResult.columns);
console.log('Pivoted rows:', pivotResult.rows);
console.log('Pivot values:', pivotResult.pivotValues);
console.log('Totals row:', pivotResult.totalsRow);
```

### Export to CSV

```tsx
import { 
  buildPivot, 
  exportPivotToCSV, 
  downloadCSV 
} from 'react-open-source-grid';

function exportPivotData() {
  // Build pivot result
  const pivotResult = buildPivot(data, pivotConfig);
  
  // Convert to CSV
  const csvContent = exportPivotToCSV(pivotResult);
  
  // Download file
  downloadCSV(csvContent, 'sales-pivot-table.csv');
}

<button onClick={exportPivotData}>
  Export Pivot to CSV
</button>
```

## 💡 Common Use Cases

### Sales Analysis by Region and Quarter

```tsx
const salesPivot: PivotConfig = {
  rowGroupColumn: 'region',
  pivotColumn: 'quarter',
  valueColumn: 'revenue',
  aggregator: 'sum',
  showTotals: true,
  showGrandTotal: true,
};
```

**Result:**
```
Region | Q1      | Q2      | Q3      | Q4      | Grand Total
-------|---------|---------|---------|---------|------------
North  | 45,000  | 52,000  | 48,000  | 55,000  | 200,000
South  | 38,000  | 42,000  | 40,000  | 45,000  | 165,000
Total  | 83,000  | 94,000  | 88,000  | 100,000 | 365,000
```

### Product Performance by Salesperson

```tsx
const performancePivot: PivotConfig = {
  rowGroupColumn: 'product',
  pivotColumn: 'salesperson',
  valueColumn: 'units',
  aggregator: 'sum',
  showTotals: true,
  showGrandTotal: false,
};
```

### Average Revenue Analysis

```tsx
const avgRevenuePivot: PivotConfig = {
  rowGroupColumn: 'category',
  pivotColumn: 'year',
  valueColumn: 'revenue',
  aggregator: 'avg',
  showTotals: true,
  showGrandTotal: true,
};
```

## 🎨 Styling

Pivot columns and totals are automatically styled for better visual distinction:

- **Pivot Columns**: Bold text with darker color (#475569)
- **Total Columns**: Bolder text with teal color (#0f766e)
- **Numeric Values**: Formatted with locale-specific separators and decimals

### Custom Styling

```tsx
<PivotToolbar
  columns={columns}
  pivotConfig={pivotConfig}
  onPivotToggle={setIsPivotMode}
  onConfigChange={setPivotConfig}
  isPivotMode={isPivotMode}
  style={{
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
    padding: '16px',
  }}
  className="custom-pivot-toolbar"
/>
```

## ⚡ Performance

The pivot engine is optimized for high performance:

- **Time Complexity**: O(n) where n is the number of rows
- **Space Complexity**: O(n × m) where m is the number of unique pivot values
- **Memoization**: Results are automatically memoized to prevent unnecessary recalculations
- **Large Datasets**: Efficiently handles datasets with 100,000+ rows

### Performance Tips

1. **Minimize Pivot Values**: Choose pivot columns with reasonable cardinality
2. **Use Appropriate Aggregators**: Simple aggregators (sum, count) are faster than custom functions
3. **Enable Memoization**: Let React's useMemo handle caching automatically
4. **Filter Before Pivoting**: Apply filters to reduce dataset size before pivot transformation

## 📦 NPM Package Usage

All pivot components and utilities are exported from the main package:

```tsx
// Import everything you need
import {
  DataGrid,
  PivotToolbar,
  buildPivot,
  exportPivotToCSV,
  downloadCSV,
  PivotConfig,
  PivotResult,
  PivotColumn,
  AggregatorType,
} from 'react-open-source-grid';
```

## 🔑 Key Concepts

### Row Group Column
The field used to group and organize rows. Each unique value becomes a row in the pivot table. Think of this as your "category" or "dimension" for rows.

### Pivot Column
The field whose unique values become column headers. This creates the "wide" format of the pivot table. Each unique value in this column becomes a new column in the output.

### Value Column
The field containing numeric values to aggregate. Values are grouped and aggregated based on the combination of row group and pivot column values.

### Aggregator
The function used to combine multiple values into a single result:
- **sum**: Add all values together
- **avg**: Calculate the average
- **count**: Count the number of values
- **min**: Find the minimum value
- **max**: Find the maximum value
- **custom**: Provide your own function

## 🐛 Troubleshooting

### Issue: Pivot table is empty
- **Solution**: Ensure your data has values for all three required columns (rowGroupColumn, pivotColumn, valueColumn)
- Check that the column names match exactly (case-sensitive)

### Issue: Numbers showing as NaN
- **Solution**: Verify that your valueColumn contains numeric values
- Use `toNumber()` function in pivot engine to safely convert values

### Issue: Too many columns generated
- **Solution**: Choose a pivot column with fewer unique values
- Consider filtering your data before pivoting
- Group similar values together in preprocessing

### Issue: Performance is slow
- **Solution**: Reduce dataset size with filters
- Use simpler aggregation functions
- Consider pagination or virtual scrolling

## 📚 Examples

Visit the live demo at `/demo/pivot-table` to see:
- Multiple preset configurations
- Interactive pivot toolbar
- Real-time data transformation
- CSV export functionality
- Various aggregation examples

## 🤝 Contributing

Found a bug or have a feature request? Please open an issue on GitHub!

## 📄 License

MIT License - see LICENSE file for details
