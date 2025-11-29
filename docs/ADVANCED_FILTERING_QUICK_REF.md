# Advanced Filtering - Quick Reference

## Overview
Multi-condition filtering with AND/OR logic operators, similar to Excel and AG Grid.

## Quick Access
- **Click filter** → Click "Advanced" button
- **Shift+Click filter** → Open advanced filter directly
- **Click filtered column** → Opens advanced if already advanced

## UI Controls

### Main Actions
| Button | Action |
|--------|--------|
| **Apply** | Save and apply filters |
| **Clear** | Remove all filters and close |
| **Reset** | Clear conditions (stay open) |
| **+ Add Condition** | Add another condition |
| **✕** | Remove specific condition |

### Operators
- **AND**: All conditions must match (more restrictive)
- **OR**: Any condition must match (more inclusive)

## Filter Types

### Text Filters
```
Contains, Not Contains, Equals, Not Equals
Starts With, Ends With, Is Empty, Is Not Empty
```

### Number Filters
```
Equals, Not Equals, Greater Than, Greater Than or Equal
Less Than, Less Than or Equal, In Range, Is Empty, Is Not Empty
```

### Date Filters
```
Equals, Before, After, In Range, Is Empty, Is Not Empty
```

### Set Filters
```
In (select values), Not In (exclude values)
```

## Examples

### Salary Range (50K-100K)
```typescript
Operator: AND
Condition 1: Greater Than or Equal → 50000
Condition 2: Less Than or Equal → 100000
```

### Multiple Departments
```typescript
Operator: OR
Condition 1: Contains → "Engineering"
Condition 2: Contains → "Marketing"
```

### Complex Filter
```typescript
Operator: OR
Condition 1: Greater Than → 100000  (high value)
Condition 2: After → 2024-01-01     (recent)
```

## Display

### Filter Indicators
- **Active simple**: Shows value (e.g., "test", "50-100")
- **Active advanced**: Shows count (e.g., "2 conditions (AND)")
- **Inactive**: Shows "Filter..."

### Visual Cues
- 🔵 Blue border/background = Active filter
- Hover = Interactive feedback
- Tooltip = Instructions

## Programmatic Usage

```typescript
import { AdvancedFilterValue } from 'react-open-source-grid';

const filter: AdvancedFilterValue = {
  operator: 'AND',  // or 'OR'
  conditions: [
    { type: 'greaterThan', value: 50 },
    { type: 'lessThan', value: 100 }
  ]
};

dispatch({ 
  type: 'SET_FILTER', 
  payload: { field: 'salary', value: filter } 
});
```

## Type Definitions

```typescript
interface FilterCondition {
  type: string;
  value?: any;
  value2?: any;     // For ranges
  values?: any[];   // For in/notIn
}

interface AdvancedFilterValue {
  operator: 'AND' | 'OR';
  conditions: FilterCondition[];
}
```

## Compatibility
✅ Works with: Sorting, Pagination, Virtual Scroll, Groups, Tree Data, Row Pinning, Export, Layout Persistence

## Best Practices
1. **AND** for narrowing, **OR** for broadening results
2. Use **In Range** instead of two conditions for ranges
3. Use **Set filters** for columns with few distinct values
4. **Is Empty/Is Not Empty** for null checks
5. Put specific conditions first for clarity

## Keyboard Shortcuts
- **Shift+Click**: Open advanced filter
- **Enter**: Apply (in simple mode)
- **Escape**: Close menu

## Tips
💡 Advanced filters are automatically saved in layout presets
💡 All conditions are validated before applying
💡 Empty values are ignored during Apply
💡 Backward compatible with simple filters

## Common Patterns

### Range Filter
```
AND + Greater Than or Equal + Less Than or Equal
OR
In Range operation
```

### Exclusion Filter
```
AND + Not Contains + Not Contains
OR
Not In operation (for set filters)
```

### Flexible Search
```
OR + Contains + Contains + Contains
Search multiple terms, any match
```

### Precise Filter
```
AND + Equals + Equals (on different fields)
Must match all criteria exactly
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Filter not working | Check column is `filterable: true` |
| No Advanced button | Imported AdvancedFilterBuilder? |
| Performance slow | Use Set filters, reduce conditions |
| Filter not saved | Check layout persistence config |

## Quick Checklist
- [ ] Column has `filterable: true`
- [ ] Import types if needed
- [ ] At least one valid condition
- [ ] Correct operator selected
- [ ] Values entered for operations that need them
- [ ] Applied the filter

## API Quick Reference

### Check Filter Type
```typescript
isAdvancedFilter(filter): boolean
```

### Apply Filters
```typescript
applyFilters(rows, filterConfig): Row[]
```

### Check Active
```typescript
hasActiveFilters(filterConfig): boolean
getActiveFilterCount(filterConfig): number
```

## Component Props

```typescript
<AdvancedFilterBuilder
  column={column}
  filterValue={advancedFilter}
  onApply={(value) => handleApply(value)}
  onClose={() => handleClose()}
  rows={rows}
  anchorEl={element}
/>
```

---

**Need more details?** See `ADVANCED_FILTERING_FEATURE.md` for complete documentation.
