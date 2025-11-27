# Column Filters - Quick Reference

## 🎯 Quick Start

```typescript
import { DataGrid } from 'react-open-source-grid';
import type { Column } from 'react-open-source-grid';

const columns: Column[] = [
  { 
    field: 'name', 
    headerName: 'Name',
    filterType: 'text',  // Auto-detected if omitted
    filterable: true     // Enable filtering
  },
  { 
    field: 'salary', 
    headerName: 'Salary',
    filterType: 'number'
  },
  { 
    field: 'department', 
    headerName: 'Department',
    filterType: 'set'  // Dropdown with unique values
  }
];
```

## 📋 Filter Types

| Type | Auto-Detect Keywords | Operations |
|------|---------------------|------------|
| **text** | default | Contains, Not Contains, Equals, Starts With, Ends With |
| **number** | salary, price, amount, count | Equals, Not Equals, >, >=, <, <=, In Range |
| **date** | date, time | Equals, Before, After, In Range |
| **set** | status, department, category | Multi-select from unique values |
| **multi** | - | Enhanced multi-selection |

## 🎨 UI Components

### Floating Filter Bar
- Appears below column headers
- Shows "Filter..." when inactive
- Blue highlight when active
- Click to open filter menu

### Filter Menus
- **Text**: Dropdown + text input
- **Number**: Dropdown + number input(s)
- **Date**: Dropdown + date picker(s)
- **Set**: Search + checkboxes + Select All

## 🔧 Programmatic API

### Set Filter
```typescript
// Text filter
dispatch({ 
  type: 'SET_FILTER', 
  payload: { 
    field: 'name', 
    value: { type: 'contains', value: 'John' } 
  } 
});

// Number range
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
    field: 'status', 
    value: { type: 'set', values: ['Active', 'Pending'] } 
  } 
});

// Clear filter
dispatch({ 
  type: 'SET_FILTER', 
  payload: { field: 'name', value: null } 
});

// Clear all filters
dispatch({ type: 'CLEAR_FILTERS' });
```

### Check Filter State
```typescript
import { hasActiveFilters, getActiveFilterCount } from './filterUtils';

const hasFilters = hasActiveFilters(filterConfig);
const count = getActiveFilterCount(filterConfig);
```

## 📊 Filter Operations

### Text Filter Operations
```typescript
{ type: 'contains', value: 'John' }
{ type: 'notContains', value: 'Test' }
{ type: 'equals', value: 'John Doe' }
{ type: 'startsWith', value: 'John' }
{ type: 'endsWith', value: 'Doe' }
```

### Number Filter Operations
```typescript
{ type: 'equals', value: 100 }
{ type: 'notEquals', value: 0 }
{ type: 'greaterThan', value: 50 }
{ type: 'greaterThanOrEqual', value: 50 }
{ type: 'lessThan', value: 100 }
{ type: 'lessThanOrEqual', value: 100 }
{ type: 'inRange', value: 50, value2: 100 }
```

### Date Filter Operations
```typescript
{ type: 'equals', value: '2024-01-15' }
{ type: 'before', value: '2024-12-31' }
{ type: 'after', value: '2024-01-01' }
{ type: 'inRange', value: '2024-01-01', value2: '2024-12-31' }
```

### Set Filter Operations
```typescript
{ type: 'set', values: ['Active', 'Pending', 'Completed'] }
```

## 🎭 Column Configuration

### Enable/Disable Filtering
```typescript
// Enable (default for most columns)
{ field: 'name', headerName: 'Name', filterable: true }

// Disable
{ field: 'id', headerName: 'ID', filterable: false }
```

### Specify Filter Type
```typescript
// Explicit type
{ field: 'custom', headerName: 'Custom', filterType: 'set' }

// Auto-detect (based on field name)
{ field: 'salary', headerName: 'Salary' }  // → 'number'
{ field: 'joinDate', headerName: 'Date' }  // → 'date'
```

## 🔍 Filter Logic

- **Multiple Filters**: Combined with AND logic (row must match ALL filters)
- **Case Sensitivity**: Text filters are case-insensitive
- **Null Handling**: Null/undefined values excluded from results
- **Type Coercion**: Automatic for numbers and dates

## 💡 Best Practices

1. **Set filterType explicitly** for better UX
2. **Use Set filters** for columns with limited unique values
3. **Disable filters** on ID or action columns
4. **Test range filters** with edge cases
5. **Combine with sorting** for better data exploration

## 🎨 Styling

Active filters have blue highlight:
- Border: `border-blue-300`
- Background: `bg-blue-50`
- Text: `text-blue-700`

Inactive filters are neutral gray:
- Border: `border-gray-300`
- Background: `bg-white`
- Text: `text-gray-500`

## 📦 Files

| File | Purpose |
|------|---------|
| `ColumnFilters.tsx` | Main component with filter UI |
| `filterUtils.ts` | Filter logic and utilities |
| `types.ts` | TypeScript types |
| `gridReducer.ts` | State management |

## 🐛 Common Issues

**Filter not showing?**
- Check `filterable: true` on column
- Verify column is not hidden

**Filter not working?**
- Check data type matches filter type
- Verify field name matches data key

**Menu positioning off?**
- Check for CSS transform/position parents
- Verify z-index hierarchy

**Set filter empty?**
- Check rows array is not empty
- Verify field has non-null values

## 🚀 Performance Tips

1. Filters use `useMemo` - data filtered once per state change
2. Filter menus lazy-loaded - only render when opened
3. Set filters cache unique values
4. Large datasets? Consider server-side filtering

## 🔗 Related Features

- **Sorting**: Click headers to sort filtered data
- **Grouping**: Group filtered results
- **Pagination**: Pages show filtered data only
- **Export**: Export includes filtered data
- **Column Pinning**: Filters respect pinned columns

## ✅ Testing Checklist

- [ ] Text filters (all operations)
- [ ] Number filters (all operations)
- [ ] Date filters (all operations)
- [ ] Set filters (search, select all, multi-select)
- [ ] Multiple filters combined
- [ ] Clear individual filters
- [ ] Clear all filters
- [ ] Filter + sort combination
- [ ] Filter + grouping
- [ ] Filter + pagination
- [ ] Filter + column pinning
- [ ] Filter + export

## 📝 Example: Complete Setup

```typescript
const columns: Column[] = [
  { field: 'id', headerName: 'ID', filterable: false },
  { field: 'name', headerName: 'Name', filterType: 'text' },
  { field: 'email', headerName: 'Email', filterType: 'text' },
  { field: 'department', headerName: 'Department', filterType: 'set' },
  { field: 'salary', headerName: 'Salary', filterType: 'number' },
  { field: 'joinDate', headerName: 'Join Date', filterType: 'date' },
  { field: 'status', headerName: 'Status', filterType: 'set' },
];

<DataGrid columns={columns} rows={data} pageSize={20} />
```

## 🎓 Advanced Usage

### Custom Filter Detection
Extend `getFilterType` in `ColumnFilters.tsx`:
```typescript
const getFilterType = (column: Column): FilterType => {
  if (column.filterType) return column.filterType;
  // Add custom logic here
  return 'text';
};
```

### Server-Side Filtering
```typescript
// Capture filter changes
useEffect(() => {
  if (hasActiveFilters(filterConfig)) {
    fetchFilteredData(filterConfig);
  }
}, [filterConfig]);
```

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Status**: ✅ Production Ready
