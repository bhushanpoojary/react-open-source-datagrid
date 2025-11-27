# Faceted Search - Quick Reference

## 🚀 Quick Start

```typescript
import { FacetedSearch } from './components/DataGrid/FacetedSearch';

const facetConfigs = [
  { field: 'brand', label: 'Brand', sortBy: 'alpha', maxItems: 8 },
  { field: 'category', label: 'Category', sortBy: 'count' },
];

<FacetedSearch
  columns={columns}
  rows={data}
  facetConfigs={facetConfigs}
  filterConfig={filterConfig}
  onFilterChange={(field, values) => handleFilter(field, values)}
  onClearAll={() => clearFilters()}
/>
```

## 📋 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `Column[]` | ✅ | Column definitions |
| `rows` | `Row[]` | ✅ | All data rows (unfiltered) |
| `facetConfigs` | `FacetConfig[]` | ✅ | Facet configuration |
| `filterConfig` | `FilterConfig` | ✅ | Current filter state |
| `onFilterChange` | `(field, values) => void` | ✅ | Filter change handler |
| `onClearAll` | `() => void` | ❌ | Clear all filters handler |
| `className` | `string` | ❌ | Additional CSS classes |
| `showSearch` | `boolean` | ❌ | Show search (default: true) |
| `collapsible` | `boolean` | ❌ | Allow collapse (default: true) |

## ⚙️ FacetConfig

```typescript
interface FacetConfig {
  field: string;              // Field name
  label?: string;             // Display label
  maxItems?: number;          // Max items (default: 10)
  sortBy?: 'count' | 'value' | 'alpha';  // Sort method
  expanded?: boolean;         // Initial state (default: true)
}
```

## 🎯 Sort Options

| Sort | Best For | Description |
|------|----------|-------------|
| `count` | Discovery | Most common values first |
| `alpha` | Known values | Alphabetical A-Z |
| `value` | Ranges/Numbers | Numeric or natural order |

## 💾 Filter State Management

```typescript
// State
const [filterConfig, setFilterConfig] = useState({});

// Handle changes
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
```

## 🎨 Common Layouts

### Sidebar Layout
```typescript
<div className="flex h-screen">
  <FacetedSearch className="w-80" {...props} />
  <div className="flex-1">
    <DataGrid rows={filteredData} />
  </div>
</div>
```

### Panel Layout
```typescript
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-3">
    <FacetedSearch {...props} />
  </div>
  <div className="col-span-9">
    <DataGrid rows={filteredData} />
  </div>
</div>
```

### Modal/Drawer Layout
```typescript
<Drawer open={showFilters}>
  <FacetedSearch className="h-full w-80" {...props} />
</Drawer>
```

## 📊 Common Facet Configs

### E-commerce
```typescript
const facets = [
  { field: 'brand', label: 'Brand', sortBy: 'alpha', maxItems: 10 },
  { field: 'category', label: 'Category', sortBy: 'count', maxItems: 8 },
  { field: 'price_range', label: 'Price', sortBy: 'value', maxItems: 5 },
  { field: 'rating', label: 'Rating', sortBy: 'value', maxItems: 5 },
  { field: 'inStock', label: 'Availability', sortBy: 'count', maxItems: 2 },
];
```

### Analytics
```typescript
const facets = [
  { field: 'region', label: 'Region', sortBy: 'alpha', maxItems: 6 },
  { field: 'channel', label: 'Channel', sortBy: 'count', maxItems: 6 },
  { field: 'device', label: 'Device', sortBy: 'count', maxItems: 3 },
  { field: 'status', label: 'Status', sortBy: 'count', maxItems: 4 },
];
```

### HR/Employee
```typescript
const facets = [
  { field: 'department', label: 'Department', sortBy: 'alpha' },
  { field: 'location', label: 'Office', sortBy: 'count', maxItems: 10 },
  { field: 'level', label: 'Level', sortBy: 'value', maxItems: 5 },
  { field: 'status', label: 'Status', sortBy: 'count', maxItems: 3 },
];
```

## 🎯 Best Practices

### ✅ DO
- Use for categorical data (3-50 unique values)
- Sort by 'count' for discovery
- Sort by 'alpha' for known values
- Set reasonable maxItems (5-15)
- Enable search for 10+ values
- Order facets by importance
- Clear labels and descriptions

### ❌ DON'T
- Use for continuous data (dates, prices)
- Use for unique identifiers
- Use for free text fields
- Show 50+ values without search
- Mix different data types
- Overcomplicate with too many facets

## 🔧 Performance Tips

```typescript
// 1. Memoize filtered data
const filteredData = useMemo(() => {
  return applyFilters(data, filterConfig);
}, [data, filterConfig]);

// 2. Memoize facet values
const facetValues = useMemo(() => {
  return extractValues(data, field);
}, [data, field]);

// 3. Debounce search
const debouncedSearch = useDebounce(searchTerm, 300);

// 4. Limit facet count
const maxFacets = 8; // Keep under 10
```

## 🐛 Common Issues

### Counts Not Updating
```typescript
// ❌ Wrong - passing filtered data
<FacetedSearch rows={filteredData} />

// ✅ Correct - pass all data
<FacetedSearch rows={allData} />
```

### Performance Slow
```typescript
// Limit facets and values
const facetConfigs = [
  { field: 'category', maxItems: 10 },  // Limit displayed items
  { field: 'brand', maxItems: 8 },
  // Max 6-8 facets total
];
```

### Filters Not Clearing
```typescript
// Ensure filter value is set to null
const clearFilter = (field: string) => {
  setFilterConfig(prev => ({
    ...prev,
    [field]: null,  // Not undefined, not empty array
  }));
};
```

## 📦 Complete Example

```typescript
import { useState, useMemo } from 'react';
import { FacetedSearch } from './components/DataGrid/FacetedSearch';
import { DataGrid} from 'react-open-source-grid';

function ProductCatalog() {
  const [products] = useState(loadProducts());
  const [filterConfig, setFilterConfig] = useState({});

  const columns = [
    { field: 'name', headerName: 'Product', width: 200 },
    { field: 'brand', headerName: 'Brand', width: 120 },
    { field: 'category', headerName: 'Category', width: 140 },
    { field: 'price', headerName: 'Price', width: 100 },
  ];

  const facetConfigs = [
    { field: 'brand', label: 'Brand', sortBy: 'alpha', maxItems: 8 },
    { field: 'category', label: 'Category', sortBy: 'count', maxItems: 6 },
    { field: 'inStock', label: 'Availability', sortBy: 'count' },
  ];

  const handleFilterChange = (field: string, values: any[] | null) => {
    setFilterConfig(prev => ({
      ...prev,
      [field]: values ? { type: 'set', values } : null,
    }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(row => {
      return Object.entries(filterConfig).every(([field, filter]) => {
        if (!filter || !filter.values || filter.values.length === 0) {
          return true;
        }
        return filter.values.includes(row[field]);
      });
    });
  }, [products, filterConfig]);

  return (
    <div className="flex h-screen">
      {/* Faceted Search Sidebar */}
      <FacetedSearch
        columns={columns}
        rows={products}
        facetConfigs={facetConfigs}
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onClearAll={() => setFilterConfig({})}
        className="w-80 border-r"
        showSearch={true}
        collapsible={true}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Stats */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="text-lg font-semibold">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
          <DataGrid
            columns={columns}
            rows={filteredProducts}
            pageSize={20}
          />
        </div>
      </div>
    </div>
  );
}
```

## 🔗 Related Docs

- **Full Documentation**: `FACETED_SEARCH_FEATURE.md`
- **Implementation**: `FACETED_SEARCH_IMPLEMENTATION.md`
- **Column Filters**: `COLUMN_FILTERS_FEATURE.md`
- **Advanced Filtering**: `ADVANCED_FILTERING_FEATURE.md`

## ⚡ Quick Commands

```bash
# Run demo
npm run dev

# Navigate to Faceted Search demo in app
```

## 📊 Feature Checklist

- [x] Value counts display
- [x] Multi-select with checkboxes
- [x] Search within facets
- [x] Sort by count/alpha/value
- [x] Collapsible sections
- [x] Show More/Less
- [x] Select All
- [x] Clear individual/all
- [x] Active filter badges
- [x] Dynamic count updates
- [x] Responsive design

---

**Quick Tip**: Start with 4-6 facets, sorted by 'count'. Enable search for facets with 10+ values. Keep it simple!

**Version**: 1.0.0 | **Status**: ✅ Ready | **Updated**: Nov 24, 2025
