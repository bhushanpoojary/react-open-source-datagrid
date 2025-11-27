import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * InfiniteScrollDemo Component
 *
 * Demonstrates infinite scrolling with server-side data source
 * handling 100M+ rows with:
 * - Server-side filtering
 * - Server-side sorting
 * - Block caching
 * - Virtual scrolling
 */
import React, { useMemo } from 'react';
import { ThemedInfiniteScrollDataGrid } from './DataGrid/InfiniteScrollDataGrid';
import { createMockServerDataSource } from './DataGrid/ServerSideDataSource';
import { CodeBlock } from './CodeBlock';
export const InfiniteScrollDemo = () => {
    // Define columns
    const columns = useMemo(() => [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            sortable: true,
            filterable: true,
            filterType: 'number',
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            sortable: true,
            filterable: true,
            filterType: 'text',
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            sortable: true,
            filterable: true,
            filterType: 'text',
        },
        {
            field: 'age',
            headerName: 'Age',
            width: 100,
            sortable: true,
            filterable: true,
            filterType: 'number',
        },
        {
            field: 'country',
            headerName: 'Country',
            width: 150,
            sortable: true,
            filterable: true,
            filterType: 'set',
        },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 150,
            sortable: true,
            filterable: true,
            filterType: 'number',
            renderCell: (row) => `$${row.salary.toLocaleString()}`,
        },
        {
            field: 'department',
            headerName: 'Department',
            width: 150,
            sortable: true,
            filterable: true,
            filterType: 'set',
        },
    ], []);
    // Create mock server-side data source with 100M rows
    const dataSource = useMemo(() => {
        return createMockServerDataSource(100_000_000, // 100 million rows
        50 // 50ms simulated network delay (faster loading)
        );
    }, []);
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }, children: "Infinite Scrolling Demo - Server-Side Data Source" }), _jsxs("p", { style: { color: '#64748b', marginBottom: '16px' }, children: ["This demo showcases infinite scrolling with a server-side data source handling ", _jsx("strong", { children: "100 million rows" }), "."] }), _jsxs("div", { style: {
                            backgroundColor: '#f1f5f9',
                            padding: '16px',
                            borderRadius: '6px',
                            marginBottom: '20px'
                        }, children: [_jsx("h2", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' }, children: "Features:" }), _jsxs("ul", { style: {
                                    listStyle: 'disc',
                                    paddingLeft: '20px',
                                    color: '#475569',
                                    lineHeight: '1.6'
                                }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Server-side data fetching:" }), " Loads data in blocks of 100 rows"] }), _jsxs("li", { children: [_jsx("strong", { children: "Server-side filtering:" }), " Filters are applied on the server"] }), _jsxs("li", { children: [_jsx("strong", { children: "Server-side sorting:" }), " Sorting is performed on the server"] }), _jsxs("li", { children: [_jsx("strong", { children: "Block caching:" }), " Caches up to 20 blocks (2,000 rows) locally"] }), _jsxs("li", { children: [_jsx("strong", { children: "Cache timeout:" }), " Cached blocks expire after 5 minutes"] }), _jsxs("li", { children: [_jsx("strong", { children: "Concurrent requests:" }), " Max 2 parallel server requests"] }), _jsxs("li", { children: [_jsx("strong", { children: "Prefetching:" }), " Loads adjacent blocks for smooth scrolling"] }), _jsxs("li", { children: [_jsx("strong", { children: "Virtual scrolling:" }), " Only renders visible rows"] })] })] }), _jsxs("div", { style: {
                            backgroundColor: '#dbeafe',
                            padding: '16px',
                            borderRadius: '6px',
                            marginBottom: '20px',
                            border: '1px solid #93c5fd'
                        }, children: [_jsx("h2", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1e40af' }, children: "Try it out:" }), _jsxs("ul", { style: {
                                    listStyle: 'disc',
                                    paddingLeft: '20px',
                                    color: '#1e3a8a',
                                    lineHeight: '1.6'
                                }, children: [_jsx("li", { children: "Scroll down to load more data blocks" }), _jsx("li", { children: "Click column headers to sort (server-side)" }), _jsx("li", { children: "Use column filters to filter data (server-side)" }), _jsx("li", { children: "Notice the loading placeholders while data is being fetched" }), _jsx("li", { children: "Scroll back up to see cached data loads instantly" })] })] }), _jsxs("div", { style: {
                            backgroundColor: '#fef3c7',
                            padding: '16px',
                            borderRadius: '6px',
                            marginBottom: '20px',
                            border: '1px solid #fcd34d'
                        }, children: [_jsx("h2", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#92400e' }, children: "Performance Notes:" }), _jsx("p", { style: { color: '#78350f', lineHeight: '1.6' }, children: "This demo simulates a 50ms network delay with 4 concurrent requests for fast loading. In production, you would connect to your actual API endpoint. The block size, cache size, concurrent requests, and other parameters can be tuned based on your use case." })] })] }), _jsx("div", { style: { marginBottom: '60px', position: 'relative', zIndex: 1 }, children: _jsx(ThemedInfiniteScrollDataGrid, { columns: columns, dataSource: dataSource, pageSize: 100, theme: "quartz", showColumnPinning: true, virtualScrollConfig: {
                        enabled: true,
                        rowHeight: 35,
                        containerHeight: 600,
                        overscanCount: 5,
                    }, onRowClick: (row) => {
                        console.log('Row clicked:', row);
                    }, onSelectionChange: (selectedIds) => {
                        console.log('Selection changed:', selectedIds);
                    } }) }), _jsxs("div", { style: { marginTop: '80px', position: 'relative', zIndex: 0, clear: 'both' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }, children: "Implementation Example" }), _jsx(CodeBlock, { title: "Creating Server-Side Data Source", language: "typescript", code: `// 1. Create a server-side data source
import { ServerSideDataSource } from './DataGrid/ServerSideDataSource';

const dataSource = new ServerSideDataSource({
  blockSize: 100,              // Rows per block
  maxConcurrentRequests: 2,    // Max parallel requests
  cacheBlockCount: 20,         // Max blocks to cache
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  
  // Implement your data fetching logic
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
      lastRow: data.lastRow, // Optional: for infinite scrolling
    };
  },
});

// 2. Use the InfiniteScrollDataGrid component
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

// 3. Or create a mock data source for testing
import { createMockServerDataSource } from './DataGrid/ServerSideDataSource';

const mockDataSource = createMockServerDataSource(
  100_000_000, // 100M rows
  300          // 300ms delay
);` })] }), _jsxs("div", { style: { marginTop: '40px' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }, children: "Server-Side Request/Response Format" }), _jsx(CodeBlock, { title: "Request Format", language: "json", code: `{
  "startRow": 0,
  "endRow": 100,
  "sortModel": [
    { "field": "name", "direction": "asc" }
  ],
  "filterModel": {
    "age": { "type": "greaterThan", "value": 25 },
    "country": { "type": "equals", "value": "USA" }
  }
}` }), _jsx(CodeBlock, { title: "Response Format", language: "json", code: `{
  "rows": [
    { "id": 1, "name": "John", "age": 30, ... },
    { "id": 2, "name": "Jane", "age": 28, ... },
    // ... more rows
  ],
  "totalRows": 100000000,
  "lastRow": undefined  // undefined = more data available
}` })] })] }));
};
export default InfiniteScrollDemo;
