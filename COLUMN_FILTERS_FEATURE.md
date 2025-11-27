# Column Filters Feature - Implementation Guide

## Overview
The DataGrid now includes comprehensive AG-Grid style column filtering with support for multiple filter types and a floating filter UI.

## Filter Types Implemented

### 1. Text Filter
**Operations:**
- Contains
- Not Contains
- Equals
- Starts With
- Ends With

**Usage:**
```typescript
const columns: Column[] = [
  {
    field: 'name',
    headerName: 'Name',
    filterType: 'text', // Optional, auto-detected
    filterable: true
  }
];
```

### 2. Number Filter
**Operations:**
- Equals
- Not Equals
- Greater Than
- Greater Than or Equal
- Less Than
- Less Than or Equal
- In Range (requires two values)

**Usage:**
```typescript
const columns: Column[] = [
  {
    field: 'salary',
    headerName: 'Salary',
    filterType: 'number',
    filterable: true
  }
];
```

### 3. Date Filter
**Operations:**
- Equals
- Before
- After
- In Range

**Usage:**
```typescript
const columns: Column[] = [
  {
    field: 'joinDate',
    headerName: 'Join Date',
    filterType: 'date',
    filterable: true
  }
];
```

### 4. Set Filter (Unique Dropdown Values)
**Features:**
- Shows all unique values from the column
- Multi-select with checkboxes
- Search functionality to filter values
- Select All / Deselect All
- Shows count of selected items

**Usage:**
```typescript
const columns: Column[] = [
  {
    field: 'department',
    headerName: 'Department',
    filterType: 'set',
    filterable: true
  }
];
```

### 5. Multi-Select Filter
Similar to Set Filter with enhanced UI for multiple selections.

## Features

### Floating Filter UI
- Appears below column headers
- Shows "Filter..." placeholder when no filter active
- Displays active filter summary (e.g., "3 selected", "50 - 100")
- Blue highlight when filter is active
- Filter icon for visual indication
- Click to open filter menu

### Filter Menu
- Modal popup with filter options
- Context-aware positioning
- Apply and Clear buttons
- Auto-closes on apply or clicking outside
- Remembers filter state

### Filter State Management
The filter system uses a sophisticated state structure:

```typescript
interface FilterValue {
  type?: string;        // Operation type
  value?: any;          // Primary value
  value2?: any;         // Secondary value (for ranges)
  values?: any[];       // Array of values (for set/multi-select)
}

interface FilterConfig {
  [field: string]: FilterValue | null;
}
```

## Auto-Detection

If `filterType` is not specified, the system auto-detects based on field name:
- Fields containing 'date' or 'time' → Date Filter
- Fields containing 'salary', 'price', 'amount', 'count' → Number Filter
- Fields containing 'status', 'department', 'category' → Set Filter
- Default → Text Filter

## API Usage

### Setting Filters Programmatically

```typescript
// Text filter
dispatch({ 
  type: 'SET_FILTER', 
  payload: { 
    field: 'name', 
    value: { type: 'contains', value: 'John' } 
  } 
});

// Number range filter
dispatch({ 
  type: 'SET_FILTER', 
  payload: { 
    field: 'salary', 
    value: { type: 'inRange', value: 50000, value2: 100000 } 
  } 
});

// Set filter
dispatch({ 
  type: 'SET_FILTER', 
  payload: { 
    field: 'department', 
    value: { type: 'set', values: ['Engineering', 'Sales'] } 
  } 
});

// Clear specific filter
dispatch({ 
  type: 'SET_FILTER', 
  payload: { field: 'name', value: null } 
});

// Clear all filters
dispatch({ type: 'CLEAR_FILTERS' });
```

### Checking Filter State

```typescript
import { hasActiveFilters, getActiveFilterCount } from './filterUtils';

// Check if any filters are active
const hasFilters = hasActiveFilters(state.filterConfig);

// Get count of active filters
const filterCount = getActiveFilterCount(state.filterConfig);
```

## Filter Logic

The filtering is implemented in `filterUtils.ts` with the following logic:

1. **Text Filters**: Case-insensitive string matching
2. **Number Filters**: Numeric comparison with type coercion
3. **Date Filters**: Date comparison normalized to midnight
4. **Set Filters**: Value inclusion check

All filters are applied using AND logic (row must match ALL active filters).

## Components

### ColumnFilters
Main component that renders the floating filter row.

**Props:**
```typescript
interface ColumnFiltersProps {
  columns: Column[];
  displayColumnOrder: string[];
  columnWidths: { [field: string]: number };
  filterConfig: FilterConfig;
  dispatch: React.Dispatch<GridAction>;
  pinnedLeft: string[];
  pinnedRight: string[];
  rows: any[];
}
```

### Filter Menu Components
- `TextFilterMenu` - Text filtering UI
- `NumberFilterMenu` - Number filtering UI with range support
- `DateFilterMenu` - Date picker UI with range support
- `SetFilterMenu` - Checkbox list with search
- `MultiSelectFilterMenu` - Enhanced multi-selection

## Styling

Filters use Tailwind CSS classes for styling:
- Active filters: Blue highlight (`bg-blue-50`, `border-blue-300`)
- Inactive filters: Gray neutral (`bg-white`, `border-gray-300`)
- Hover states: Subtle gray (`group-hover:border-gray-400`)

## Column Pinning Integration

Filters respect column pinning:
- Pinned left columns have sticky positioning
- Pinned right columns stay on the right
- Filter menus position correctly relative to pinned columns

## Performance Considerations

1. **Memoization**: Filter application uses `useMemo` to avoid re-filtering on every render
2. **Efficient Filtering**: Single-pass filter application
3. **Lazy Menu Rendering**: Filter menus only render when opened
4. **Optimized Re-renders**: Filter state changes only trigger necessary updates

## Example: Complete Filter Setup

```typescript
import { DataGrid } from 'react-open-source-grid';

const columns: Column[] = [
  { 
    field: 'name', 
    headerName: 'Employee Name',
    filterType: 'text',
    filterable: true 
  },
  { 
    field: 'department', 
    headerName: 'Department',
    filterType: 'set',
    filterable: true 
  },
  { 
    field: 'salary', 
    headerName: 'Salary',
    filterType: 'number',
    filterable: true 
  },
  { 
    field: 'joinDate', 
    headerName: 'Join Date',
    filterType: 'date',
    filterable: true 
  },
  { 
    field: 'status', 
    headerName: 'Status',
    filterType: 'set',
    filterable: true 
  },
];

function App() {
  return (
    <DataGrid 
      columns={columns} 
      rows={employeeData}
      pageSize={20}
    />
  );
}
```

## Disabling Filters

To disable filtering for specific columns:

```typescript
const columns: Column[] = [
  { 
    field: 'id', 
    headerName: 'ID',
    filterable: false  // No filter for this column
  },
];
```

## Future Enhancements

Potential improvements:
1. Custom filter components
2. Filter presets/saved filters
3. Advanced filter combinations (OR logic)
4. Filter templates
5. Server-side filtering integration
6. Export filters with data
7. Filter history/undo
8. Keyboard shortcuts for filter operations

## Testing

Test scenarios to validate:
1. Apply each filter type and verify results
2. Combine multiple filters (AND logic)
3. Range filters with edge cases
4. Set filters with large datasets
5. Date filters with various formats
6. Clear individual and all filters
7. Filter interaction with sorting
8. Filter interaction with grouping
9. Filter interaction with pagination
10. Column pinning with active filters

## Integration Checklist

✅ Filter types (text, number, date, set, multi-select)  
✅ Floating filter UI  
✅ Filter menu components  
✅ Filter state management in reducer  
✅ Filter utilities for applying logic  
✅ Auto-detection of filter types  
✅ Integration with DataGrid  
✅ Column pinning support  
✅ Export to index.ts  
✅ TypeScript types  
✅ Documentation  

## Files Modified/Created

1. **Created:**
   - `ColumnFilters.tsx` - Main filter component
   - `filterUtils.ts` - Filter logic utilities
   - `COLUMN_FILTERS_FEATURE.md` - This documentation

2. **Modified:**
   - `types.ts` - Added FilterValue, FilterType types
   - `gridReducer.ts` - Added CLEAR_FILTERS action
   - `DataGrid.tsx` - Integrated ColumnFilters
   - `GridHeader.tsx` - Removed old filter row
   - `index.ts` - Exported new components and types

## Summary

The column filters feature provides a complete, production-ready filtering solution inspired by AG-Grid. It supports multiple filter types, auto-detection, a clean floating filter UI, and seamless integration with existing DataGrid features like sorting, grouping, pagination, and column pinning.
