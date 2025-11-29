# Infinite Scrolling - Quick Reference

## 🚀 Quick Start

```typescript
import { InfiniteScrollDataGrid, createMockServerDataSource } from 'react-open-source-grid';

// Create mock data source (100M rows)
const dataSource = createMockServerDataSource(100_000_000, 300);

// Use the grid
<InfiniteScrollDataGrid
  columns={columns}
  dataSource={dataSource}
  pageSize={100}
  virtualScrollConfig={{ enabled: true }}
/>
```

## 📋 Configuration Cheat Sheet

### Server-Side DataSource Config

```typescript
new ServerSideDataSource({
  blockSize: 100,              // Rows per block (50-200 recommended)
  maxConcurrentRequests: 2,    // Parallel requests (2-3 recommended)
  cacheBlockCount: 20,         // Blocks to cache (10-30 recommended)
  cacheTimeout: 5 * 60 * 1000, // Cache expiry (3-10 min recommended)
  getRows: async (request) => {
    // Your API call
  },
})
```

### Recommended Settings by Dataset Size

| Dataset Size | blockSize | maxRequests | cacheBlocks | timeout |
|--------------|-----------|-------------|-------------|---------|
| < 1M rows    | 100       | 3           | 30          | 10 min  |
| 1M - 10M     | 100       | 2           | 20          | 5 min   |
| > 10M rows   | 100       | 2           | 15          | 3 min   |

## 🔌 Server API Contract

### Request Format
```typescript
{
  startRow: 0,
  endRow: 100,
  sortModel: [{ field: "name", direction: "asc" }],
  filterModel: {
    age: { type: "greaterThan", value: 25 },
    country: { type: "equals", value: "USA" }
  }
}
```

### Response Format
```typescript
{
  rows: [...],              // Array of row objects
  totalRows: 100000000,     // Total count
  lastRow: undefined        // undefined = infinite
}
```

## 💡 Common Use Cases

### 1. Basic Setup
```typescript
const dataSource = new ServerSideDataSource({
  getRows: async (req) => {
    const res = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(req)
    });
    return await res.json();
  },
});
```

### 2. With Authentication
```typescript
const dataSource = new ServerSideDataSource({
  getRows: async (req) => {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });
    return await res.json();
  },
});
```

### 3. With Error Handling
```typescript
const dataSource = new ServerSideDataSource({
  getRows: async (req) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        body: JSON.stringify(req)
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      console.error('Data fetch error:', error);
      return { rows: [], totalRows: 0 };
    }
  },
});
```

### 4. Programmatic Control
```typescript
// Subscribe to changes
const unsubscribe = dataSource.subscribe(() => {
  console.log('Data updated');
});

// Update sort
dataSource.setSortModel([
  { field: 'name', direction: 'asc' }
]);

// Update filter
dataSource.setFilterModel({
  age: { type: 'greaterThan', value: 25 }
});

// Refresh data
dataSource.refresh();

// Cleanup
unsubscribe();
dataSource.destroy();
```

## 🎯 Key Methods

```typescript
// Get rows in range
const rows = dataSource.getRowsInRange(0, 100);

// Get single row
const row = dataSource.getRow(42);

// Get total count
const total = dataSource.getTotalRows();

// Check loading state
const isLoading = dataSource.isBlockLoading(5);

// Force refresh
dataSource.refresh();
```

## ⚡ Performance Tips

1. **Enable Virtual Scrolling**
   ```typescript
   virtualScrollConfig={{
     enabled: true,
     rowHeight: 35,
     containerHeight: 600,
     overscanCount: 5
   }}
   ```

2. **Optimize Block Size**
   - Smaller blocks (50-75): Faster initial load, more requests
   - Larger blocks (150-200): Fewer requests, slower initial load
   - Sweet spot: 100 rows

3. **Server Optimization**
   - Add database indexes on sortable/filterable columns
   - Implement server-side caching
   - Use pagination in SQL queries
   - Consider read replicas for high load

4. **Monitor Performance**
   ```typescript
   dataSource.subscribe(() => {
     console.log('Cache size:', dataSource.blockCache.size);
     console.log('Active requests:', dataSource.activeRequests);
   });
   ```

## 🐛 Common Issues

### Issue: Slow scrolling
**Solution:** 
- Enable virtual scrolling
- Reduce block size
- Increase overscan count

### Issue: Too many requests
**Solution:**
- Reduce maxConcurrentRequests
- Increase block size
- Add debouncing to filters

### Issue: High memory usage
**Solution:**
- Reduce cacheBlockCount
- Reduce cacheTimeout
- Reduce block size

### Issue: Stale data
**Solution:**
- Reduce cacheTimeout
- Call `dataSource.refresh()` when needed
- Implement cache invalidation

## 📊 Server Implementation Examples

### SQL Server Query
```sql
SELECT *
FROM users
WHERE age > @age AND country = @country
ORDER BY name ASC
OFFSET @startRow ROWS
FETCH NEXT @pageSize ROWS ONLY;
```

### PostgreSQL Query
```sql
SELECT *
FROM users
WHERE age > $1 AND country = $2
ORDER BY name ASC
LIMIT $3 OFFSET $4;
```

### MongoDB Query
```javascript
db.users
  .find({ age: { $gt: 25 }, country: "USA" })
  .sort({ name: 1 })
  .skip(startRow)
  .limit(pageSize);
```

## 🔄 Filter Types

| Type | Description | Example |
|------|-------------|---------|
| `equals` | Exact match | `{ type: "equals", value: "USA" }` |
| `contains` | Substring | `{ type: "contains", value: "john" }` |
| `greaterThan` | Greater than | `{ type: "greaterThan", value: 25 }` |
| `lessThan` | Less than | `{ type: "lessThan", value: 65 }` |
| `between` | Range | `{ type: "between", value: 25, value2: 65 }` |

## 📱 Component Props

```typescript
<InfiniteScrollDataGrid
  columns={columns}                    // Required
  dataSource={dataSource}              // Required
  pageSize={100}                       // Optional, default: 100
  showColumnPinning={true}             // Optional, default: true
  virtualScrollConfig={{...}}          // Optional
  onRowClick={(row) => {...}}          // Optional
  onCellEdit={(idx, field, val) => {...}} // Optional
  onSelectionChange={(ids) => {...}}   // Optional
/>
```

## 📦 Memory Estimation

```
Row size (avg):        ~1 KB
Block (100 rows):      ~100 KB
Cache (20 blocks):     ~2 MB
UI components:         ~5 MB
Total (estimated):     ~7 MB
```

## 🎓 Learn More

- Full documentation: `INFINITE_SCROLLING_FEATURE.md`
- Demo: Run `npm run dev` → Navigate to "Infinite Scroll"
- Source: `src/components/DataGrid/ServerSideDataSource.ts`
