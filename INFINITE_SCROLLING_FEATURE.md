# Infinite Scrolling with Server-Side DataSource

## Overview

This implementation provides AG Grid-style infinite scrolling capabilities for handling massive datasets (100M+ rows) with:

- **Server-side data fetching**: Load data in configurable blocks
- **Server-side filtering**: Apply filters on the server for optimal performance
- **Server-side sorting**: Sort data on the server side
- **Block caching**: Cache recently loaded blocks locally with configurable timeout
- **Concurrent requests**: Control parallel server requests
- **Prefetching**: Automatically load adjacent blocks for smooth scrolling
- **Virtual scrolling**: Render only visible rows for optimal performance

## Architecture

### Components

1. **ServerSideDataSource**: Core data source class that manages block loading, caching, and server communication
2. **InfiniteScrollDataGrid**: React component that integrates the data source with the DataGrid
3. **InfiniteScrollDemo**: Demo component showcasing the functionality

### Key Features

#### Block-Based Loading
- Data is loaded in configurable blocks (default: 100 rows per block)
- Blocks are requested on-demand as user scrolls
- Adjacent blocks are prefetched for smooth scrolling

#### Intelligent Caching
- Configurable cache size (default: 20 blocks = 2,000 rows)
- LRU (Least Recently Used) cache eviction
- Configurable cache timeout (default: 5 minutes)
- Automatic cache purging to maintain memory limits

#### Concurrency Control
- Configurable max concurrent requests (default: 2)
- Request queue for managing multiple block requests
- Prevents overwhelming the server with simultaneous requests

#### Server-Side Operations
- Filtering applied on server side
- Sorting performed on server side
- Group by operations (coming soon)

## Usage

### Basic Usage

<details open>
<summary><b>TypeScript</b></summary>

```typescript
import { InfiniteScrollDataGrid, ServerSideDataSource } from 'react-open-source-grid';

// Create a data source
const dataSource = new ServerSideDataSource({
  blockSize: 100,              // Rows per block
  maxConcurrentRequests: 2,    // Max parallel requests
  cacheBlockCount: 20,         // Cache up to 20 blocks
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  
  // Implement server communication
  getRows: async (request) => {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startRow: request.startRow,
        endRow: request.endRow,
        sortModel: request.sortModel,
        filterModel: request.filterModel,
      }),
    });
    
    const data = await response.json();
    
    return {
      rows: data.rows,
      totalRows: data.totalRows,
      lastRow: data.lastRow, // Optional: undefined means more data available
    };
  },
});

// Use the component
<InfiniteScrollDataGrid
  columns={columns}
  dataSource={dataSource}
  pageSize={100}
  virtualScrollConfig={{
    enabled: true,
    rowHeight: 35,
    containerHeight: 600,
  }}
/>
```

</details>

<details>
<summary><b>JavaScript</b></summary>

```javascript
import { InfiniteScrollDataGrid, ServerSideDataSource } from 'react-open-source-grid';

// Create a data source
const dataSource = new ServerSideDataSource({
  blockSize: 100,              // Rows per block
  maxConcurrentRequests: 2,    // Max parallel requests
  cacheBlockCount: 20,         // Cache up to 20 blocks
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  
  // Implement server communication
  getRows: async (request) => {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startRow: request.startRow,
        endRow: request.endRow,
        sortModel: request.sortModel,
        filterModel: request.filterModel,
      }),
    });
    
    const data = await response.json();
    
    return {
      rows: data.rows,
      totalRows: data.totalRows,
      lastRow: data.lastRow, // Optional: undefined means more data available
    };
  },
});

// Use the component
<InfiniteScrollDataGrid
  columns={columns}
  dataSource={dataSource}
  pageSize={100}
  virtualScrollConfig={{
    enabled: true,
    rowHeight: 35,
    containerHeight: 600,
  }}
/>
```

</details>

### Server API Requirements

Your server endpoint should accept requests in this format:

**Request:**
```json
{
  "startRow": 0,
  "endRow": 100,
  "sortModel": [
    { "field": "name", "direction": "asc" }
  ],
  "filterModel": {
    "age": { "type": "greaterThan", "value": 25 },
    "country": { "type": "equals", "value": "USA" }
  }
}
```

**Response:**
```json
{
  "rows": [
    { "id": 1, "name": "John", "age": 30, ... },
    { "id": 2, "name": "Jane", "age": 28, ... }
  ],
  "totalRows": 100000000,
  "lastRow": undefined  // undefined = more data available
}
```

### Mock Data Source for Testing

For testing and development, use the mock data source:

```typescript
import { createMockServerDataSource } from 'react-open-source-grid';

const mockDataSource = createMockServerDataSource(
  100_000_000, // 100 million rows
  300          // 300ms simulated network delay
);

<InfiniteScrollDataGrid
  columns={columns}
  dataSource={mockDataSource}
  pageSize={100}
/>
```

## Configuration Options

### ServerSideDataSourceConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `blockSize` | number | 100 | Number of rows per block |
| `maxConcurrentRequests` | number | 2 | Maximum parallel server requests |
| `cacheBlockCount` | number | 20 | Maximum number of blocks to cache |
| `cacheTimeout` | number | 300000 | Cache timeout in milliseconds (5 min) |
| `getRows` | function | required | Function to fetch data from server |

### InfiniteScrollDataGridProps

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columns` | Column[] | required | Column definitions |
| `dataSource` | ServerSideDataSource or Config | required | Data source instance or config |
| `pageSize` | number | 100 | Rows per page |
| `showColumnPinning` | boolean | true | Enable column pinning |
| `virtualScrollConfig` | VirtualScrollConfig | undefined | Virtual scroll configuration |
| `onRowClick` | function | undefined | Row click handler |
| `onCellEdit` | function | undefined | Cell edit handler |
| `onSelectionChange` | function | undefined | Selection change handler |

## Server-Side Request Interface

```typescript
interface ServerSideRequest {
  startRow: number;           // Starting row index
  endRow: number;            // Ending row index (exclusive)
  sortModel?: SortConfig[];  // Array of sort configurations
  filterModel?: FilterConfig; // Filter configurations
  groupKeys?: string[];      // Group by keys (future)
}
```

## Server-Side Response Interface

```typescript
interface ServerSideResponse {
  rows: Row[];              // Array of row data
  totalRows: number;        // Total number of rows (for pagination info)
  lastRow?: number;         // Last row index (undefined = infinite)
}
```

## Methods

### ServerSideDataSource Methods

#### `getRowsInRange(startRow: number, endRow: number): Row[]`
Get rows for a specific range. Automatically loads blocks if not cached.

#### `getRow(rowIndex: number): Row | undefined`
Get a single row by index.

#### `getTotalRows(): number | undefined`
Get total row count (may be undefined until first response).

#### `setSortModel(sortModel: SortConfig[]): void`
Update sort model and refresh data.

#### `setFilterModel(filterModel: FilterConfig): void`
Update filter model and refresh data.

#### `refresh(): void`
Refresh all data (clears cache and reloads).

#### `subscribe(callback: () => void): () => void`
Subscribe to data changes. Returns unsubscribe function.

#### `destroy(): void`
Cleanup and destroy the data source.

## Performance Considerations

### Optimal Configuration

For datasets of different sizes:

**Small to Medium (< 1M rows):**
```typescript
{
  blockSize: 100,
  maxConcurrentRequests: 3,
  cacheBlockCount: 30,
  cacheTimeout: 10 * 60 * 1000, // 10 minutes
}
```

**Large (1M - 10M rows):**
```typescript
{
  blockSize: 100,
  maxConcurrentRequests: 2,
  cacheBlockCount: 20,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
}
```

**Very Large (> 10M rows):**
```typescript
{
  blockSize: 100,
  maxConcurrentRequests: 2,
  cacheBlockCount: 15,
  cacheTimeout: 3 * 60 * 1000, // 3 minutes
}
```

### Best Practices

1. **Block Size**: Keep between 50-200 rows. Smaller blocks = more requests but faster initial load.
2. **Cache Size**: Balance memory usage vs. performance. Monitor cache hit rate.
3. **Concurrent Requests**: Too many can overwhelm server. 2-3 is optimal for most cases.
4. **Prefetching**: Enabled by default. Loads adjacent blocks for smooth scrolling.
5. **Virtual Scrolling**: Always enable for datasets > 1000 rows.

### Memory Usage

Estimated memory per cached block:
- Average row: ~1KB
- Block of 100 rows: ~100KB
- Cache of 20 blocks: ~2MB

## Server Implementation Examples

### Node.js/Express

```javascript
app.post('/api/data', async (req, res) => {
  const { startRow, endRow, sortModel, filterModel } = req.body;
  
  // Build SQL query
  let query = 'SELECT * FROM users';
  const params = [];
  
  // Apply filters
  if (filterModel && Object.keys(filterModel).length > 0) {
    const filters = Object.entries(filterModel).map(([field, filter]) => {
      if (filter.type === 'contains') {
        params.push(`%${filter.value}%`);
        return `${field} LIKE ?`;
      } else if (filter.type === 'equals') {
        params.push(filter.value);
        return `${field} = ?`;
      }
      return null;
    }).filter(Boolean);
    
    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }
  }
  
  // Apply sorting
  if (sortModel && sortModel.length > 0) {
    const sort = sortModel[0];
    query += ` ORDER BY ${sort.field} ${sort.direction.toUpperCase()}`;
  }
  
  // Apply pagination
  query += ` LIMIT ${endRow - startRow} OFFSET ${startRow}`;
  
  // Execute query
  const rows = await db.query(query, params);
  const totalRows = await db.query('SELECT COUNT(*) as count FROM users')[0].count;
  
  res.json({
    rows,
    totalRows,
    lastRow: rows.length < (endRow - startRow) ? startRow + rows.length : undefined,
  });
});
```

### Python/FastAPI

```python
@app.post("/api/data")
async def get_data(request: ServerSideRequest):
    query = "SELECT * FROM users"
    params = []
    
    # Apply filters
    if request.filterModel:
        filters = []
        for field, filter_val in request.filterModel.items():
            if filter_val.type == "contains":
                filters.append(f"{field} LIKE %s")
                params.append(f"%{filter_val.value}%")
            elif filter_val.type == "equals":
                filters.append(f"{field} = %s")
                params.append(filter_val.value)
        
        if filters:
            query += " WHERE " + " AND ".join(filters)
    
    # Apply sorting
    if request.sortModel and len(request.sortModel) > 0:
        sort = request.sortModel[0]
        query += f" ORDER BY {sort.field} {sort.direction.upper()}"
    
    # Apply pagination
    query += f" LIMIT {request.endRow - request.startRow} OFFSET {request.startRow}"
    
    # Execute query
    rows = await db.fetch_all(query, params)
    total_rows = await db.fetch_one("SELECT COUNT(*) as count FROM users")
    
    return {
        "rows": rows,
        "totalRows": total_rows["count"],
        "lastRow": None if len(rows) == (request.endRow - request.startRow) else request.startRow + len(rows)
    }
```

## Comparison with AG Grid

This implementation provides similar functionality to AG Grid's Server-Side Row Model:

| Feature | Our Implementation | AG Grid |
|---------|-------------------|---------|
| Block loading | ✅ Yes | ✅ Yes |
| Server-side filtering | ✅ Yes | ✅ Yes |
| Server-side sorting | ✅ Yes | ✅ Yes |
| Block caching | ✅ Yes | ✅ Yes |
| Prefetching | ✅ Yes | ✅ Yes |
| Virtual scrolling | ✅ Yes | ✅ Yes |
| Concurrent requests | ✅ Configurable | ✅ Yes |
| Group by (server-side) | 🚧 Planned | ✅ Yes |
| Aggregation (server-side) | 🚧 Planned | ✅ Yes |

## Demo

See `InfiniteScrollDemo.tsx` for a complete working example with 100M rows.

Run the demo:
```bash
npm run dev
```

Navigate to the "Infinite Scroll" tab to see it in action.

## Troubleshooting

### Slow Loading
- Reduce `blockSize` for faster initial load
- Increase `maxConcurrentRequests` (but watch server load)
- Optimize server queries with indexes
- Add server-side caching

### High Memory Usage
- Reduce `cacheBlockCount`
- Reduce `blockSize`
- Implement cache timeout

### Choppy Scrolling
- Enable virtual scrolling
- Increase `overscanCount` in virtual scroll config
- Ensure blocks are small enough to load quickly
- Check network latency

### Cache Misses
- Increase `cacheBlockCount`
- Increase `cacheTimeout`
- Optimize prefetching strategy

## Future Enhancements

- [ ] Server-side group by
- [ ] Server-side aggregations
- [ ] Progressive loading indicators
- [ ] Retry logic for failed requests
- [ ] Request debouncing for filters/sorts
- [ ] WebSocket support for real-time updates
- [ ] IndexedDB for larger client-side cache
- [ ] Tree data support
- [ ] Master-detail rows
- [ ] Custom loading cell renderers
