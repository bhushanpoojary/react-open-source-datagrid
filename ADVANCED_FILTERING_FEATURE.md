# Advanced Filtering Feature - Implementation Guide

## Overview
The DataGrid now includes advanced filtering capabilities with multi-condition support per column, AND/OR logic operators, and a powerful filter builder UI similar to Excel and AG Grid.

## Features Implemented

### 1. Multi-Condition Filtering
- **Multiple conditions per column**: Add multiple filter conditions to a single column
- **AND/OR operators**: Combine conditions with AND (all must match) or OR (any must match) logic
- **Flexible condition management**: Add, remove, and modify conditions dynamically

### 2. Advanced Filter Builder UI
- **Modern, intuitive interface**: Clean, professional UI with smooth interactions
- **Condition management**: Easily add/remove filter conditions
- **Operator selection**: Toggle between AND/OR logic with clear visual feedback
- **Type-specific inputs**: Different input controls based on filter type (text, number, date, set)
- **Real-time validation**: Only valid conditions are applied
- **Action buttons**: Apply, Clear, and Reset functionality

### 3. Enhanced Filter Operations

#### Text Filters
- Contains
- Not Contains
- Equals
- Not Equals
- Starts With
- Ends With
- Is Empty
- Is Not Empty

#### Number Filters
- Equals
- Not Equals
- Greater Than
- Greater Than or Equal
- Less Than
- Less Than or Equal
- In Range
- Is Empty
- Is Not Empty

#### Date Filters
- Equals
- Before
- After
- In Range
- Is Empty
- Is Not Empty

#### Set Filters
- In (select multiple values)
- Not In (exclude multiple values)

## Usage

### Basic Usage

The advanced filter is automatically available on all filterable columns. Users can access it in two ways:

1. **Click the "Advanced" button** in any simple filter menu
2. **Shift+Click** on the filter input to open the advanced filter directly
3. **Click** a filter with existing advanced conditions

### Programmatic Usage

```typescript
import { DataGrid, AdvancedFilterValue } from './components/DataGrid';

// Define advanced filter
const advancedFilter: AdvancedFilterValue = {
  operator: 'AND', // or 'OR'
  conditions: [
    { type: 'greaterThan', value: 50000 },
    { type: 'lessThan', value: 100000 }
  ]
};

// Apply to a column
dispatch({ 
  type: 'SET_FILTER', 
  payload: { 
    field: 'salary', 
    value: advancedFilter 
  } 
});
```

### Type Definitions

```typescript
// Single filter condition
interface FilterCondition {
  type: string;           // Operation type (e.g., 'greaterThan', 'contains')
  value?: any;           // Primary value
  value2?: any;          // Secondary value (for range operations)
  values?: any[];        // Multiple values (for in/notIn operations)
}

// Advanced filter with multiple conditions
interface AdvancedFilterValue {
  operator: 'AND' | 'OR';     // How to combine conditions
  conditions: FilterCondition[]; // Array of filter conditions
}

// Filter configuration now supports both simple and advanced filters
interface FilterConfig {
  [field: string]: FilterValue | AdvancedFilterValue | null;
}
```

## Examples

### Example 1: Salary Range with AND Logic
Filter employees with salary between $50,000 and $100,000:

```typescript
{
  operator: 'AND',
  conditions: [
    { type: 'greaterThanOrEqual', value: 50000 },
    { type: 'lessThanOrEqual', value: 100000 }
  ]
}
```

### Example 2: Multiple Text Conditions with OR Logic
Find records that contain "Manager" or "Director":

```typescript
{
  operator: 'OR',
  conditions: [
    { type: 'contains', value: 'Manager' },
    { type: 'contains', value: 'Director' }
  ]
}
```

### Example 3: Date Range
Find records between two dates:

```typescript
{
  operator: 'AND',
  conditions: [
    { type: 'after', value: '2023-01-01' },
    { type: 'before', value: '2023-12-31' }
  ]
}
```

### Example 4: Set Filter with Multiple Selections
Select specific departments:

```typescript
{
  operator: 'AND',
  conditions: [
    { 
      type: 'in', 
      values: ['Engineering', 'Marketing', 'Sales'] 
    }
  ]
}
```

### Example 5: Complex Multi-Condition Filter
Find high-value customers OR recent customers:

```typescript
{
  operator: 'OR',
  conditions: [
    { type: 'greaterThan', value: 100000 },      // Total purchases > $100k
    { type: 'after', value: '2024-01-01' }       // OR joined after Jan 2024
  ]
}
```

## UI Interaction Guide

### Opening Advanced Filter
1. Click on a filter input box
2. Click the "Advanced" button in the simple filter menu
3. Or Shift+Click directly on the filter input

### Using the Advanced Filter Builder

#### Adding Conditions
1. Click "+ Add Condition" button
2. Select the operation type from the dropdown
3. Enter the value(s) based on the operation type
4. Repeat to add more conditions

#### Removing Conditions
- Click the "✕" button on any condition (except if it's the only one)

#### Changing Operators
- Toggle between "AND" and "OR" buttons to change how conditions are combined
- Only visible when you have 2+ conditions

#### Applying Filters
- **Apply**: Save and apply the current filter configuration
- **Clear**: Remove all filters for this column and close
- **Reset**: Clear all conditions and reset to default state (without closing)

### Visual Indicators

- **Active filters** are highlighted with blue border and background
- **Filter count** shown for advanced filters: "2 conditions (AND)"
- **Hover effects** provide interactive feedback
- **Condition separator** shows the operator (AND/OR) between conditions

## Implementation Details

### Filter Evaluation Logic

The advanced filtering system uses the following evaluation logic:

1. **AND operator**: All conditions must be true for a row to pass
   ```typescript
   conditions.every(condition => evaluateCondition(row, condition))
   ```

2. **OR operator**: At least one condition must be true
   ```typescript
   conditions.some(condition => evaluateCondition(row, condition))
   ```

3. **Mixed with other columns**: All column filters must pass (implicit AND between columns)

### Backward Compatibility

The implementation is fully backward compatible:
- Simple filters (FilterValue) continue to work as before
- Advanced filters (AdvancedFilterValue) are a new addition
- The system automatically detects and handles both types

### Performance Considerations

- **Efficient evaluation**: Conditions are evaluated using early exit logic
- **Validation**: Only valid conditions are included in filtering
- **Type-specific optimization**: Different filter types use optimized comparison methods

## Integration with Other Features

### Works With:
- ✅ Column sorting
- ✅ Pagination
- ✅ Virtual scrolling
- ✅ Row selection
- ✅ Grouping
- ✅ Tree data
- ✅ Row pinning
- ✅ Layout persistence
- ✅ Export (filtered data)
- ✅ Context menu

### Layout Persistence

Advanced filters are automatically saved and restored with layout presets:

```typescript
const layout = {
  filterConfig: {
    salary: {
      operator: 'AND',
      conditions: [
        { type: 'greaterThan', value: 50000 },
        { type: 'lessThan', value: 100000 }
      ]
    }
  },
  // ... other layout properties
};
```

## Best Practices

### 1. Choose the Right Operator
- Use **AND** for narrowing results (more restrictive)
- Use **OR** for broadening results (more inclusive)

### 2. Condition Order
- Order doesn't affect AND logic but can affect readability
- Put more specific conditions first for clarity

### 3. Empty Value Handling
- Use "Is Empty" / "Is Not Empty" for null/undefined checks
- These operations don't require value input

### 4. Range Operations
- Use "In Range" for numbers and dates instead of two separate conditions
- More concise and easier to understand

### 5. Set Filters
- Use for columns with limited distinct values
- Better performance than multiple OR conditions

## Keyboard Shortcuts

- **Shift+Click** on filter: Open advanced filter directly
- **Enter** in input: Apply filter (in simple mode)
- **Escape**: Close filter menu (when focused)

## Accessibility

- Full keyboard navigation support
- ARIA labels for screen readers
- Clear visual feedback for all interactions
- Tooltip hints for advanced features

## Troubleshooting

### Filter Not Working
1. Check that the column is marked as `filterable: true`
2. Verify data types match the filter type
3. Ensure at least one valid condition exists

### Advanced Filter Not Appearing
1. Verify imports are correct
2. Check that AdvancedFilterBuilder is exported
3. Ensure filterUtils includes advanced filter logic

### Performance Issues
1. Reduce number of conditions if possible
2. Use set filters for columns with limited values
3. Consider pagination for large datasets

## API Reference

### AdvancedFilterBuilder Component

```typescript
interface AdvancedFilterBuilderProps {
  column: Column;                              // Column configuration
  filterValue: AdvancedFilterValue | null;     // Current filter value
  onApply: (value: AdvancedFilterValue | null) => void;  // Apply callback
  onClose: () => void;                         // Close callback
  rows: Row[];                                 // All rows (for set filters)
  anchorEl: HTMLElement | null;               // Anchor element for positioning
}
```

### Helper Functions

```typescript
// Check if filter is advanced
isAdvancedFilter(filter: FilterConfig[string]): filter is AdvancedFilterValue

// Apply filters to rows
applyFilters(rows: Row[], filterConfig: FilterConfig): Row[]

// Check for active filters
hasActiveFilters(filterConfig: FilterConfig): boolean

// Get active filter count
getActiveFilterCount(filterConfig: FilterConfig): number
```

## Future Enhancements

Potential improvements for future versions:
- [ ] Save filter templates/presets
- [ ] Copy/paste filters between columns
- [ ] Bulk filter operations
- [ ] Filter expressions/formulas
- [ ] Custom filter functions
- [ ] Filter history/undo
- [ ] Export filter configuration

## Migration Guide

### From Simple to Advanced Filters

No migration needed! The system automatically handles both:

```typescript
// Old simple filter (still works)
{ type: 'contains', value: 'test' }

// New advanced filter
{
  operator: 'AND',
  conditions: [
    { type: 'contains', value: 'test' }
  ]
}
```

### Updating Filter Logic

If you have custom filter logic:

```typescript
// Before
if (filter.type && filter.value) {
  // filter logic
}

// After
if (isAdvancedFilter(filter)) {
  // Handle advanced filter
} else if (filter.type && filter.value) {
  // Handle simple filter
}
```

## Support

For issues or questions:
1. Check this documentation
2. Review the examples
3. Examine the implementation in ColumnFilters.tsx and AdvancedFilterBuilder.tsx
4. Check filterUtils.ts for filter evaluation logic

## Summary

The advanced filtering feature provides:
- ✅ Multi-condition filtering per column
- ✅ AND/OR operators
- ✅ Modern filter builder UI
- ✅ Apply/Clear/Reset actions
- ✅ Backward compatibility
- ✅ Full type safety
- ✅ Excellent performance
- ✅ Integration with all grid features

This brings the DataGrid to parity with enterprise solutions like AG Grid and Excel, while maintaining simplicity and ease of use.
