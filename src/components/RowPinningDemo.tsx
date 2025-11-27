import React, { useMemo, useState, useCallback } from 'react';
import { DataGrid} from './DataGrid';
import type { Column, Row, RowPinConfig, VirtualScrollConfig } from './DataGrid';
import { CodeBlock } from './CodeBlock';

/**
 * RowPinningDemo - Demonstrates row pinning feature
 * 
 * This demo showcases:
 * - Pin rows to top or bottom
 * - Pinned rows remain sticky during scroll
 * - Works with sorting and filtering
 * - Works with virtual scrolling
 * - Context menu integration
 */
export const RowPinningDemo: React.FC = () => {
  const [virtualEnabled, setVirtualEnabled] = useState(false);

  // Generate sample data
  const sampleData = useMemo((): Row[] => {
    const data: Row[] = [];
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
    const positions = ['Manager', 'Senior', 'Junior', 'Lead', 'Director', 'VP'];
    
    // Use deterministic values based on index for stable renders
    for (let i = 1; i <= 100; i++) {
      data.push({
        id: i,
        name: `Employee ${i}`,
        email: `employee${i}@company.com`,
        department: departments[i % departments.length],
        position: positions[(i * 3) % positions.length],
        salary: ((i * 1234) % 100000) + 40000,
        startDate: new Date(2020 + (i % 4), (i % 12), ((i % 28) + 1)).toISOString().split('T')[0],
        performance: ((i % 50) / 10).toFixed(1),
      });
    }
    
    return data;
  }, []);

  // Define columns
  const columns: Column[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 80,
        sortable: true,
        filterable: true,
      },
      {
        field: 'name',
        headerName: 'Name',
        width: 180,
        sortable: true,
        filterable: true,
        editable: true,
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 220,
        sortable: true,
        filterable: true,
        editable: true,
      },
      {
        field: 'department',
        headerName: 'Department',
        width: 140,
        sortable: true,
        filterable: true,
        filterType: 'set',
      },
      {
        field: 'position',
        headerName: 'Position',
        width: 120,
        sortable: true,
        filterable: true,
        filterType: 'set',
      },
      {
        field: 'salary',
        headerName: 'Salary',
        width: 120,
        sortable: true,
        filterable: true,
        filterType: 'number',
        renderCell: (row) => `$${row.salary.toLocaleString()}`,
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        width: 130,
        sortable: true,
        filterable: true,
        filterType: 'date',
      },
      {
        field: 'performance',
        headerName: 'Performance',
        width: 120,
        sortable: true,
        filterable: true,
        filterType: 'number',
        renderCell: (row) => `⭐ ${row.performance}`,
      },
    ],
    []
  );

  // Row pinning configuration
  const handlePinChange = useCallback((pinnedTop: (string | number)[], pinnedBottom: (string | number)[]) => {
    console.log('Pinned rows changed:', { pinnedTop, pinnedBottom });
  }, []);

  const rowPinConfig: RowPinConfig = {
    enabled: true,
    onPinChange: handlePinChange,
  };

  // Virtual scroll configuration
  const virtualScrollConfig: VirtualScrollConfig | undefined = virtualEnabled ? {
    enabled: true,
    rowHeight: 35,
    containerHeight: 600,
    overscanCount: 5,
  } : undefined;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Row Pinning Demo
          </h1>
          <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '16px' }}>
            Pin important rows to the top or bottom for easy access
          </p>

          {/* Feature Highlights */}
          <div style={{ 
            backgroundColor: '#dbeafe', 
            padding: '16px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            border: '1px solid #93c5fd'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1e40af' }}>
              ✨ Key Features:
            </h2>
            <ul style={{ 
              listStyle: 'disc', 
              paddingLeft: '20px', 
              color: '#1e3a8a',
              lineHeight: '1.6'
            }}>
              <li><strong>Sticky Positioning:</strong> Pinned rows stay visible during scroll</li>
              <li><strong>Context Menu:</strong> Right-click any row to pin/unpin</li>
              <li><strong>Works with Sorting:</strong> Pinned rows maintain position regardless of sort</li>
              <li><strong>Works with Filtering:</strong> Pinned rows remain visible when filters are applied</li>
              <li><strong>Virtual Scrolling:</strong> Pinned rows work seamlessly with virtual scrolling</li>
            </ul>
          </div>

          {/* Instructions */}
          <div style={{ 
            backgroundColor: '#dcfce7', 
            padding: '16px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            border: '1px solid #86efac'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#166534' }}>
              🎯 How to Use:
            </h2>
            <ul style={{ 
              listStyle: 'disc', 
              paddingLeft: '20px', 
              color: '#14532d',
              lineHeight: '1.6'
            }}>
              <li>Right-click on any row to open the context menu</li>
              <li>Select "Pin Row to Top" or "Pin Row to Bottom"</li>
              <li>Pinned rows will stay at the top/bottom even when scrolling</li>
              <li>Try sorting or filtering - pinned rows stay in place</li>
              <li>Right-click a pinned row and select "Unpin Row" to remove it</li>
            </ul>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
              <input
                type="checkbox"
                checked={virtualEnabled}
                onChange={(e) => setVirtualEnabled(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              Enable Virtual Scrolling (for large datasets)
            </label>
          </div>
        </div>

        {/* Data Grid */}
        <div style={{ marginBottom: '32px' }}>
          <DataGrid
            columns={columns}
            rows={sampleData}
            pageSize={20}
            rowPinConfig={rowPinConfig}
            virtualScrollConfig={virtualScrollConfig}
            contextMenuConfig={{
              enabled: true,
              showCopy: true,
              showExport: true,
              showColumnOptions: true,
              showFilterByValue: true,
            }}
            onCellEdit={(rowIndex, field, value) => {
              console.log(`Cell edited: Row ${rowIndex}, Field "${field}", Value: "${value}"`);
            }}
          />
        </div>

        {/* Features Section */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Row Pinning Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', fontSize: '14px', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Pin to Top:</strong> Keep important rows visible at the top
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Pin to Bottom:</strong> Keep summary or total rows at the bottom
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Sticky Positioning:</strong> Pinned rows remain visible during scroll
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Sort Compatible:</strong> Works seamlessly with column sorting
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Filter Compatible:</strong> Pinned rows remain visible with filters
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Virtual Scroll:</strong> Works with virtual scrolling for performance
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Implementation Examples
          </h2>

          <CodeBlock
            title="Basic Row Pinning Configuration"
            language="tsx"
            code={`import { DataGrid} from './components/DataGrid';
import type { RowPinConfig } from './components/DataGrid';

const rowPinConfig: RowPinConfig = {
  enabled: true,
  onPinChange: (pinnedTop, pinnedBottom) => {
    console.log('Pinned rows:', { pinnedTop, pinnedBottom });
  },
};

<DataGrid
  columns={columns}
  rows={rows}
  rowPinConfig={rowPinConfig}
  contextMenuConfig={{
    enabled: true, // Enable context menu for pinning
  }}
/>`}
          />

          <CodeBlock
            title="Row Pinning with Virtual Scrolling"
            language="tsx"
            code={`const rowPinConfig: RowPinConfig = {
  enabled: true,
  maxPinnedTop: 5,    // Limit to 5 rows pinned at top
  maxPinnedBottom: 3, // Limit to 3 rows pinned at bottom
};

const virtualScrollConfig: VirtualScrollConfig = {
  enabled: true,
  rowHeight: 35,
  containerHeight: 600,
};

<DataGrid
  columns={columns}
  rows={largeDataset}
  rowPinConfig={rowPinConfig}
  virtualScrollConfig={virtualScrollConfig}
/>`}
          />

          <CodeBlock
            title="Programmatic Row Pinning"
            language="tsx"
            code={`// Pin rows programmatically using dispatch
const [state, dispatch] = useReducer(gridReducer, initialState);

// Pin a row to the top
dispatch({ type: 'PIN_ROW_TOP', payload: rowId });

// Pin a row to the bottom
dispatch({ type: 'PIN_ROW_BOTTOM', payload: rowId });

// Unpin a row
dispatch({ type: 'UNPIN_ROW', payload: rowId });`}
          />
        </div>

        {/* Use Cases */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Common Use Cases
          </h2>
          <div style={{ display: 'grid', gap: '16px', fontSize: '14px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                📊 Financial Reports
              </h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Pin header rows (category totals) to the top and summary/total rows to the bottom 
                while scrolling through detailed transaction data.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                📈 Trading Dashboards
              </h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Keep your most important stocks or positions pinned at the top for quick monitoring 
                while scrolling through a large watchlist.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                👥 Team Management
              </h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Pin team leads or VIP employees to the top for quick access while managing 
                a large employee directory with sorting and filtering.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                📋 Task Management
              </h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Keep high-priority tasks pinned at the top and completed tasks at the bottom 
                while sorting and filtering through your task list.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            How It Works
          </h2>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ marginBottom: '12px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Separation:</strong> Pinned rows are separated from regular rows after 
              sorting and filtering. This ensures pinned rows always stay in their designated position.
            </p>
            <p style={{ marginBottom: '12px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Sticky Positioning:</strong> Uses CSS sticky positioning to keep pinned 
              rows visible at the top or bottom during scroll operations.
            </p>
            <p style={{ marginBottom: '12px', color: '#374151', lineHeight: '1.6' }}>
              <strong>Virtual Scrolling:</strong> When virtual scrolling is enabled, pinned rows 
              are rendered outside the virtual scroller, ensuring they remain visible at all times.
            </p>
            <p style={{ color: '#374151', lineHeight: '1.6' }}>
              <strong>State Management:</strong> Pinned row IDs are stored in the grid state 
              (pinnedRowsTop and pinnedRowsBottom arrays), making it easy to persist and restore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
