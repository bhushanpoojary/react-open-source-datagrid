# Faceted Search Feature

## 🎯 Overview

Faceted search is a filtering UI pattern that displays available filter options alongside their counts, providing users with instant visual feedback about data distribution. It's ideal for e-commerce product catalogs, analytics dashboards, and any scenario where users need to explore and filter categorical data.

## ✨ Key Features

### 1. **Value Counts Display**
- Shows count next to each filter option
- Updates dynamically as other filters are applied
- Helps users understand data distribution
- Prevents "zero results" frustration

### 2. **Multi-Select Filtering**
- Check multiple values per facet
- Combines selected values with OR logic within a facet
- Combines facets with AND logic
- Select All / Clear options

### 3. **Search Within Facets**
- Search box for facets with many values (configurable threshold)
- Real-time filtering of options
- Case-insensitive matching
- Persists selections during search

### 4. **Smart Sorting**
- **By Count**: Most common values first (default for discovery)
- **Alphabetically**: A-Z ordering (best for known values)
- **By Value**: Numeric or natural ordering (for ranges, ratings)

### 5. **Collapsible Sections**
- Expand/collapse individual facets
- Save screen space
- Focus on relevant filters
- Remembers state per facet

### 6. **Show More/Less**
- Configure max items to display
- "Show More" button reveals additional values
- Prevents overwhelming UI with long lists
- Customizable per facet

### 7. **Active Filter Management**
- Clear individual facets
- Clear all filters at once
- Visual badges showing active filter count
- Highlighted selected values

## 🚀 Quick Start

### Basic Implementation

<details open>
<summary><b>TypeScript</b></summary>

```typescript
import { FacetedSearch, DataGrid } from 'react-open-source-grid';
import { useState, useMemo } from 'react';

function ProductCatalog() {
  const [data] = useState(products);
  const [filterConfig, setFilterConfig] = useState({});

  // Define facets
  const facetConfigs = [
    { field: 'brand', label: 'Brand', sortBy: 'alpha', maxItems: 8 },
    { field: 'category', label: 'Category', sortBy: 'count', maxItems: 6 },
    { field: 'price_range', label: 'Price Range', sortBy: 'value' },
  ];

  // Handle filter changes
  const handleFilterChange = (field: string, values: any[] | null) => {
    setFilterConfig(prev => ({
      ...prev,
      [field]: values ? { type: 'set', values } : null,
    }));
  };

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filterConfig).every(([field, filter]) => {
        if (!filter || !filter.values || filter.values.length === 0) {
          return true;
        }
        return filter.values.includes(row[field]);
      });
    });
  }, [data, filterConfig]);

  return (
    <div className="flex">
      <FacetedSearch
        columns={columns}
        rows={data}
        facetConfigs={facetConfigs}
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onClearAll={() => setFilterConfig({})}
        className="w-80"
      />
      <DataGrid
        columns={columns}
        rows={filteredData}
        pageSize={20}
      />
    </div>
  );
}
```

</details>

<details>
<summary><b>JavaScript</b></summary>

```javascript
import { FacetedSearch, DataGrid } from 'react-open-source-grid';
import { useState, useMemo } from 'react';

function ProductCatalog() {
  const [data] = useState(products);
  const [filterConfig, setFilterConfig] = useState({});

  // Define facets
  const facetConfigs = [
    { field: 'brand', label: 'Brand', sortBy: 'alpha', maxItems: 8 },
    { field: 'category', label: 'Category', sortBy: 'count', maxItems: 6 },
    { field: 'price_range', label: 'Price Range', sortBy: 'value' },
  ];

  // Handle filter changes
  const handleFilterChange = (field, values) => {
    setFilterConfig(prev => ({
      ...prev,
      [field]: values ? { type: 'set', values } : null,
    }));
  };

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filterConfig).every(([field, filter]) => {
        if (!filter || !filter.values || filter.values.length === 0) {
          return true;
        }
        return filter.values.includes(row[field]);
      });
    });
  }, [data, filterConfig]);

  return (
    <div className="flex">
      <FacetedSearch
        columns={columns}
        rows={data}
        facetConfigs={facetConfigs}
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onClearAll={() => setFilterConfig({})}
        className="w-80"
      />
      <DataGrid
        columns={columns}
        rows={filteredData}
        pageSize={20}
      />
    </div>
  );
}
```

</details>

## 📋 API Reference

### FacetedSearch Component

```typescript
interface FacetedSearchProps {
  columns: Column[];              // Column definitions
  rows: Row[];                    // All data rows (unfiltered)
  facetConfigs: FacetConfig[];    // Facet configuration
  filterConfig: FilterConfig;     // Current filter state
  onFilterChange: (field: string, values: any[] | null) => void;
  onClearAll?: () => void;        // Optional clear all handler
  className?: string;             // Additional CSS classes
  showSearch?: boolean;           // Show search within facets (default: true)
  collapsible?: boolean;          // Allow collapsing facets (default: true)
}
```

### FacetConfig

```typescript
interface FacetConfig {
  field: string;                  // Field name from data
  label?: string;                 // Display label (defaults to field)
  maxItems?: number;              // Max items before "Show More" (default: 10)
  sortBy?: 'count' | 'value' | 'alpha';  // Sort method (default: 'count')
  expanded?: boolean;             // Initial expanded state (default: true)
}
```

### FilterConfig

```typescript
interface FilterConfig {
  [field: string]: {
    type: 'set';
    values: any[];
  } | null;
}
```

## 🎨 Styling

The component uses Tailwind CSS classes and is fully customizable:

```typescript
// Custom width
<FacetedSearch className="w-64 bg-gray-50" />

// Full height sidebar
<FacetedSearch className="h-screen w-80 shadow-lg" />

// Compact mode
<FacetedSearch className="w-56 text-sm" />
```

## 💡 Usage Patterns

### E-commerce Product Catalog

```typescript
const facetConfigs = [
  { field: 'brand', label: 'Brand', sortBy: 'alpha', maxItems: 10 },
  { field: 'category', label: 'Category', sortBy: 'count', maxItems: 8 },
  { field: 'price_range', label: 'Price Range', sortBy: 'value', maxItems: 5 },
  { field: 'rating', label: 'Customer Rating', sortBy: 'value', maxItems: 5 },
  { field: 'inStock', label: 'Availability', sortBy: 'count', maxItems: 2 },
  { field: 'color', label: 'Color', sortBy: 'alpha', maxItems: 8 },
];
```

### Analytics Dashboard

```typescript
const facetConfigs = [
  { field: 'region', label: 'Region', sortBy: 'alpha', maxItems: 6 },
  { field: 'channel', label: 'Marketing Channel', sortBy: 'count', maxItems: 6 },
  { field: 'device', label: 'Device Type', sortBy: 'count', maxItems: 3 },
  { field: 'browser', label: 'Browser', sortBy: 'count', maxItems: 5 },
  { field: 'status', label: 'Campaign Status', sortBy: 'count', maxItems: 4 },
];
```

### Data Explorer

```typescript
const facetConfigs = [
  { field: 'department', label: 'Department', sortBy: 'alpha' },
  { field: 'location', label: 'Location', sortBy: 'count', maxItems: 15 },
  { field: 'status', label: 'Status', sortBy: 'count' },
  { field: 'priority', label: 'Priority', sortBy: 'value' },
];
```

## 🔧 Advanced Configuration

### Dynamic Facet Generation

```typescript
// Generate facets from column configuration
const facetConfigs = columns
  .filter(col => col.filterable && col.filterType === 'set')
  .map(col => ({
    field: col.field,
    label: col.headerName,
    sortBy: 'count' as const,
    maxItems: 10,
  }));
```

### Conditional Facet Display

```typescript
// Show different facets based on data type
const facetConfigs = dataType === 'products'
  ? productFacets
  : dataType === 'analytics'
  ? analyticsFacets
  : defaultFacets;
```

### Custom Filter Logic

```typescript
// More complex filtering with ranges and special cases
const filteredData = useMemo(() => {
  return data.filter(row => {
    // Apply faceted filters
    const facetMatch = Object.entries(filterConfig).every(([field, filter]) => {
      if (!filter || !filter.values || filter.values.length === 0) return true;
      
      // Special handling for price ranges
      if (field === 'price_range') {
        const price = row.price;
        return filter.values.some(range => {
          const [min, max] = range.split('-').map(Number);
          return price >= min && price <= max;
        });
      }
      
      return filter.values.includes(row[field]);
    });

    // Apply additional custom filters
    return facetMatch && customFilterLogic(row);
  });
}, [data, filterConfig]);
```

## 🎯 Best Practices

### 1. **Choose the Right Fields**
- Use categorical data with limited unique values
- Ideal: 3-50 unique values per facet
- Avoid: Continuous data, free text, unique IDs

### 2. **Sort Strategically**
- **Count**: Best for discovery, shows popular options
- **Alpha**: Best when users know what they're looking for
- **Value**: Best for numeric ranges, ratings, or ordered categories

### 3. **Set Appropriate Max Items**
- 5-8 items: Compact, focused facets
- 10-15 items: Standard, good balance
- 20+ items: Enable search within facet

### 4. **Order Facets by Importance**
- Most commonly used filters first
- Related filters grouped together
- Less common filters at the bottom

### 5. **Label Clearly**
- Use clear, descriptive labels
- Avoid technical field names
- Add counts to show data volume

### 6. **Performance Considerations**
- Memoize filtered data calculations
- Debounce search input (if many facets)
- Consider virtualization for very large datasets
- Cache facet value calculations

## ⚡ Performance Optimization

```typescript
// Memoize facet value extraction
const facetValues = useMemo(() => {
  return extractFacetValues(data, field, filterConfig);
}, [data, field, filterConfig]);

// Debounce search
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

// Lazy load facets
const visibleFacets = useMemo(() => {
  return facetConfigs.slice(0, expandedFacetCount);
}, [facetConfigs, expandedFacetCount]);
```

## 🧪 Testing

### Test Scenarios

1. **Value Counting**
   - Verify counts are accurate
   - Counts update when other filters applied
   - Zero counts handled correctly

2. **Multi-Select Behavior**
   - Multiple values can be selected
   - Selections persist during search
   - Clear individual/all works

3. **Search Functionality**
   - Case-insensitive matching
   - Real-time filtering
   - No results message

4. **Expand/Collapse**
   - State persists per facet
   - Content shows/hides correctly
   - Smooth transitions

5. **Show More/Less**
   - Respects maxItems setting
   - Button shows/hides appropriately
   - Correct count in button text

## 🔗 Integration

### With DataGrid Filtering

```typescript
// Combine faceted search with column filters
const combinedFilters = {
  ...facetedFilters,  // From faceted search
  ...columnFilters,   // From grid column filters
};

const filteredData = applyFilters(data, combinedFilters);
```

### With URL State

```typescript
// Sync filters with URL for sharing
const [searchParams, setSearchParams] = useSearchParams();

const handleFilterChange = (field: string, values: any[] | null) => {
  const newFilters = { ...filterConfig };
  
  if (values) {
    newFilters[field] = { type: 'set', values };
    searchParams.set(field, values.join(','));
  } else {
    delete newFilters[field];
    searchParams.delete(field);
  }
  
  setFilterConfig(newFilters);
  setSearchParams(searchParams);
};
```

### With Server-Side Filtering

```typescript
// Pass facet selections to API
const fetchData = async (filters: FilterConfig) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([field, filter]) => {
    if (filter && filter.values) {
      params.append(field, filter.values.join(','));
    }
  });
  
  const response = await fetch(`/api/products?${params}`);
  return response.json();
};
```

## 📊 Analytics Integration

```typescript
// Track facet usage
const handleFilterChange = (field: string, values: any[] | null) => {
  // Update filters
  setFilterConfig(prev => ({
    ...prev,
    [field]: values ? { type: 'set', values } : null,
  }));
  
  // Track analytics
  analytics.track('Facet Used', {
    facet: field,
    valueCount: values?.length || 0,
    values: values,
  });
};
```

## 🎓 Advanced Examples

### Dynamic Facet Loading

```typescript
// Load facet values from API
const useFacetValues = (field: string) => {
  return useQuery(['facetValues', field], async () => {
    const response = await fetch(`/api/facets/${field}`);
    return response.json();
  });
};
```

### Hierarchical Facets

```typescript
// Category > Subcategory structure
const hierarchicalFacets = [
  { 
    field: 'mainCategory', 
    label: 'Category',
    children: [
      { field: 'subCategory', label: 'Subcategory' }
    ]
  },
];
```

## 🐛 Troubleshooting

### Counts Not Updating
- Ensure you pass unfiltered data to `rows` prop
- Check filterConfig is properly maintained
- Verify memoization dependencies

### Performance Issues
- Limit number of facets (< 10 recommended)
- Use maxItems to limit displayed values
- Implement virtualization for large datasets
- Debounce search input

### Zero Results
- Verify AND/OR logic matches expectations
- Check data types match (string vs number)
- Consider showing disabled options with 0 counts

## 📚 Related Features

- **Column Filters**: Inline filtering within grid
- **Advanced Filtering**: Complex multi-condition filters
- **Search**: Global text search across all fields
- **Sorting**: Order results by any column
- **Pagination**: Navigate large result sets

## 🎉 Summary

Faceted search provides an intuitive, visual way to filter data that:
- ✅ Shows data distribution at a glance
- ✅ Prevents zero-result dead ends
- ✅ Enables powerful multi-select filtering
- ✅ Works seamlessly with existing filters
- ✅ Perfect for e-commerce and analytics

**Requirements**: Solid filtering foundation (column filters or advanced filtering)
**Best For**: Categorical data exploration, product catalogs, analytics dashboards
**Works With**: All DataGrid features including sorting, pagination, grouping

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 24, 2025
