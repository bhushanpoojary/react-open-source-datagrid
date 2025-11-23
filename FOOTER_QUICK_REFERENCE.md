# Aggregation Footer - Quick Reference

## Basic Setup

```tsx
import { DataGrid } from './DataGrid';

<DataGrid
  columns={columns}
  rows={data}
  footerConfig={{
    show: true,
    aggregates: [
      { field: 'amount', function: 'total' }
    ]
  }}
/>
```

## All Aggregate Functions

```tsx
footerConfig={{
  show: true,
  aggregates: [
    { field: 'price', function: 'total' },    // Sum of all values
    { field: 'price', function: 'avg' },      // Average
    { field: 'price', function: 'min' },      // Minimum
    { field: 'price', function: 'max' },      // Maximum
    { field: 'id', function: 'count' }        // Row count
  ]
}}
```

## Custom Labels

```tsx
footerConfig={{
  show: true,
  aggregates: [
    { field: 'salary', function: 'total', label: 'Total Payroll' },
    { field: 'salary', function: 'avg', label: 'Average Salary' }
  ]
}}
```

## Group-Level Footers

```tsx
footerConfig={{
  show: true,
  showGroupFooters: true,  // Enable subtotals for groups
  aggregates: [
    { field: 'revenue', function: 'total' },
    { field: 'revenue', function: 'avg' }
  ]
}}
```

## TypeScript Types

```tsx
import type { FooterConfig, AggregateConfig } from './DataGrid';

const footerConfig: FooterConfig = {
  show: boolean,
  showGroupFooters?: boolean,
  aggregates?: AggregateConfig[]
};

const aggregateConfig: AggregateConfig = {
  field: string,
  function: 'count' | 'sum' | 'total' | 'avg' | 'min' | 'max',
  label?: string
};
```

## Real-World Examples

### Sales Dashboard
```tsx
footerConfig={{
  show: true,
  aggregates: [
    { field: 'revenue', function: 'total', label: 'Total Revenue' },
    { field: 'units', function: 'total', label: 'Units Sold' },
    { field: 'revenue', function: 'avg', label: 'Avg Sale' }
  ]
}}
```

### Employee Directory
```tsx
footerConfig={{
  show: true,
  showGroupFooters: true,
  aggregates: [
    { field: 'salary', function: 'total', label: 'Total Payroll' },
    { field: 'salary', function: 'avg', label: 'Avg Salary' },
    { field: 'id', function: 'count', label: 'Employee Count' }
  ]
}}
```

### Inventory Management
```tsx
footerConfig={{
  show: true,
  aggregates: [
    { field: 'quantity', function: 'total', label: 'Total Stock' },
    { field: 'value', function: 'total', label: 'Inventory Value' },
    { field: 'price', function: 'min', label: 'Lowest Price' },
    { field: 'price', function: 'max', label: 'Highest Price' }
  ]
}}
```

## Tips

1. **Numeric Fields Only**: Aggregates work best with numeric data
2. **Null Handling**: Null/undefined values are automatically excluded
3. **Filtering**: Aggregates reflect filtered data
4. **Grouping**: Use `showGroupFooters` to see subtotals per group
5. **Performance**: Uses memoization for efficient recalculation
6. **Multiple Aggregates**: Stack multiple functions on the same column

## Visual Result

```
┌─────────────────────────────────────────────┐
│ Header Row                                  │
├─────────────────────────────────────────────┤
│ Data Row 1                                  │
│ Data Row 2                                  │
│ Data Row 3                                  │
├─────────────────────────────────────────────┤
│ Footer: Total | $1,000 | Avg: $333.33      │ ← NEW
└─────────────────────────────────────────────┘
```

With grouping:
```
┌─────────────────────────────────────────────┐
│ Group: Department A                         │
│   Data Row 1                                │
│   Data Row 2                                │
│   Group Footer: Subtotal | $500             │ ← NEW
│ Group: Department B                         │
│   Data Row 3                                │
│   Group Footer: Subtotal | $500             │ ← NEW
├─────────────────────────────────────────────┤
│ Global Footer: Total | $1,000               │ ← NEW
└─────────────────────────────────────────────┘
```
