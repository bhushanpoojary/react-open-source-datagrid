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
import { InfiniteScrollDataGrid } from './DataGrid/InfiniteScrollDataGrid';
import { createMockServerDataSource } from './DataGrid/ServerSideDataSource';
import type { Column } from './DataGrid/types';

export const InfiniteScrollDemo: React.FC = () => {
  // Define columns
  const columns: Column[] = useMemo(
    () => [
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
    ],
    []
  );

  // Create mock server-side data source with 100M rows
  const dataSource = useMemo(() => {
    return createMockServerDataSource(
      100_000_000, // 100 million rows
      300 // 300ms simulated network delay
    );
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Infinite Scrolling Demo - Server-Side Data Source
        </h1>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>
          This demo showcases infinite scrolling with a server-side data source handling <strong>100 million rows</strong>.
        </p>
        
        <div style={{ 
          backgroundColor: '#f1f5f9', 
          padding: '16px', 
          borderRadius: '6px', 
          marginBottom: '20px' 
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            Features:
          </h2>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '20px', 
            color: '#475569',
            lineHeight: '1.6'
          }}>
            <li><strong>Server-side data fetching:</strong> Loads data in blocks of 100 rows</li>
            <li><strong>Server-side filtering:</strong> Filters are applied on the server</li>
            <li><strong>Server-side sorting:</strong> Sorting is performed on the server</li>
            <li><strong>Block caching:</strong> Caches up to 20 blocks (2,000 rows) locally</li>
            <li><strong>Cache timeout:</strong> Cached blocks expire after 5 minutes</li>
            <li><strong>Concurrent requests:</strong> Max 2 parallel server requests</li>
            <li><strong>Prefetching:</strong> Loads adjacent blocks for smooth scrolling</li>
            <li><strong>Virtual scrolling:</strong> Only renders visible rows</li>
          </ul>
        </div>

        <div style={{ 
          backgroundColor: '#dbeafe', 
          padding: '16px', 
          borderRadius: '6px', 
          marginBottom: '20px',
          border: '1px solid #93c5fd'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1e40af' }}>
            Try it out:
          </h2>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '20px', 
            color: '#1e3a8a',
            lineHeight: '1.6'
          }}>
            <li>Scroll down to load more data blocks</li>
            <li>Click column headers to sort (server-side)</li>
            <li>Use column filters to filter data (server-side)</li>
            <li>Notice the loading placeholders while data is being fetched</li>
            <li>Scroll back up to see cached data loads instantly</li>
          </ul>
        </div>

        <div style={{ 
          backgroundColor: '#fef3c7', 
          padding: '16px', 
          borderRadius: '6px', 
          marginBottom: '20px',
          border: '1px solid #fcd34d'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#92400e' }}>
            Performance Notes:
          </h2>
          <p style={{ color: '#78350f', lineHeight: '1.6' }}>
            This demo simulates a 300ms network delay. In production, you would connect to your actual API endpoint.
            The block size, cache size, and other parameters can be tuned based on your use case.
          </p>
        </div>
      </div>

      {/* DataGrid with infinite scrolling */}
      <div style={{ marginBottom: '60px', position: 'relative', zIndex: 1 }}>
        <InfiniteScrollDataGrid
          columns={columns}
          dataSource={dataSource}
          pageSize={100}
          showColumnPinning={true}
          virtualScrollConfig={{
            enabled: true,
            rowHeight: 35,
            containerHeight: 600,
            overscanCount: 5,
          }}
          onRowClick={(row) => {
            console.log('Row clicked:', row);
          }}
          onSelectionChange={(selectedIds) => {
            console.log('Selection changed:', selectedIds);
          }}
        />
      </div>

      {/* Implementation Code Example */}
      <div style={{ marginTop: '80px', position: 'relative', zIndex: 0, clear: 'both' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          Implementation Example
        </h2>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          color: '#e2e8f0', 
          padding: '16px', 
          borderRadius: '6px', 
          fontFamily: 'monospace',
          fontSize: '14px',
          overflowX: 'auto'
        }}>
          <pre style={{ margin: 0 }}>{`// 1. Create a server-side data source
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
);`}</pre>
        </div>
      </div>

      {/* API Documentation */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          Server-Side Request/Response Format
        </h2>
        
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '16px', 
          borderRadius: '6px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Request:
          </h3>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: '#e2e8f0', 
            padding: '12px', 
            borderRadius: '4px', 
            fontFamily: 'monospace',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            <pre style={{ margin: 0 }}>{`{
  "startRow": 0,
  "endRow": 100,
  "sortModel": [
    { "field": "name", "direction": "asc" }
  ],
  "filterModel": {
    "age": { "type": "greaterThan", "value": 25 },
    "country": { "type": "equals", "value": "USA" }
  }
}`}</pre>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Response:
          </h3>
          <div style={{ 
            backgroundColor: '#1e293b', 
            color: '#e2e8f0', 
            padding: '12px', 
            borderRadius: '4px', 
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            <pre style={{ margin: 0 }}>{`{
  "rows": [
    { "id": 1, "name": "John", "age": 30, ... },
    { "id": 2, "name": "Jane", "age": 28, ... },
    // ... more rows
  ],
  "totalRows": 100000000,
  "lastRow": undefined  // undefined = more data available
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollDemo;
