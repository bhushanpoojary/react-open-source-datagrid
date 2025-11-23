import React, { useMemo, useState } from 'react';
import { ThemedDataGrid } from './DataGrid';
import type { Column, Row, VirtualScrollConfig } from './DataGrid';

/**
 * VirtualScrollDemo - Demonstrates virtual scrolling with large datasets
 * 
 * This demo showcases:
 * - 50,000+ rows
 * - 200+ columns
 * - Ultra-fast rendering with windowing
 * - Dynamic row heights
 * - Cell recycling
 */
export const VirtualScrollDemo: React.FC = () => {
  const [rowCount, setRowCount] = useState(50000);
  const [columnCount, setColumnCount] = useState(50);
  const [virtualEnabled, setVirtualEnabled] = useState(true);
  const [columnVirtualEnabled, setColumnVirtualEnabled] = useState(true);

  // Generate large dataset
  const largeDataset = useMemo((): Row[] => {
    console.time('Generate Dataset');
    const data: Row[] = [];
    
    for (let i = 0; i < rowCount; i++) {
      const row: Row = {
        id: i + 1,
        name: `Employee ${i + 1}`,
        email: `employee${i + 1}@company.com`,
        department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'][i % 6],
        position: ['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director'][i % 6],
        salary: 50000 + (i % 100) * 1000,
        age: 22 + (i % 40),
        joinDate: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
        status: i % 10 === 0 ? 'Inactive' : 'Active',
        country: ['USA', 'UK', 'Canada', 'Germany', 'France', 'Japan', 'Australia'][i % 7],
      };
      
      // Add additional columns dynamically
      for (let j = 10; j < columnCount; j++) {
        row[`col${j}`] = `Value ${i}-${j}`;
      }
      
      data.push(row);
    }
    
    console.timeEnd('Generate Dataset');
    return data;
  }, [rowCount, columnCount]);

  // Generate column definitions
  const columns = useMemo((): Column[] => {
    const cols: Column[] = [
      { field: 'id', headerName: 'ID', width: 80, sortable: true, filterable: true },
      { field: 'name', headerName: 'Name', width: 150, sortable: true, filterable: true, editable: true },
      { field: 'email', headerName: 'Email', width: 220, sortable: true, filterable: true, editable: true },
      { field: 'department', headerName: 'Department', width: 130, sortable: true, filterable: true },
      { field: 'position', headerName: 'Position', width: 120, sortable: true, filterable: true },
      { field: 'salary', headerName: 'Salary', width: 110, sortable: true, filterable: true, editable: true },
      { field: 'age', headerName: 'Age', width: 80, sortable: true, filterable: true },
      { field: 'joinDate', headerName: 'Join Date', width: 120, sortable: true, filterable: true },
      { field: 'status', headerName: 'Status', width: 100, sortable: true, filterable: true },
      { field: 'country', headerName: 'Country', width: 120, sortable: true, filterable: true },
    ];
    
    // Add dynamic columns
    for (let i = 10; i < columnCount; i++) {
      cols.push({
        field: `col${i}`,
        headerName: `Column ${i}`,
        width: 150,
        sortable: true,
        filterable: true,
        editable: true,
      });
    }
    
    return cols;
  }, [columnCount]);

  // Virtual scroll configuration
  const virtualScrollConfig: VirtualScrollConfig = {
    enabled: virtualEnabled,
    rowHeight: 35, // Fixed row height for maximum performance
    containerHeight: 600,
    overscanCount: 5,
    enableColumnVirtualization: columnCount > 50 ? columnVirtualEnabled : false,
    columnOverscan: 3,
  };

  // Handle cell edit
  const handleCellEdit = (rowIndex: number, field: string, value: any) => {
    console.log(`Cell edited: Row ${rowIndex}, Field "${field}", Value: "${value}"`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Virtual Scrolling Demo
          </h1>
          <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '16px' }}>
            Ultra-fast rendering with 50,000+ rows and 200+ columns
          </p>
          
          {/* Performance Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Rows</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                {largeDataset.length.toLocaleString()}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Columns</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {columns.length}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Cells</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333ea' }}>
                {(largeDataset.length * columns.length).toLocaleString()}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Virtualization</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c' }}>
                {virtualEnabled ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>Controls</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Row Count Control */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Row Count
              </label>
              <select
                value={rowCount}
                onChange={(e) => setRowCount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value={100}>100 rows</option>
                <option value={1000}>1,000 rows</option>
                <option value={10000}>10,000 rows</option>
                <option value={50000}>50,000 rows</option>
                <option value={100000}>100,000 rows</option>
              </select>
            </div>

            {/* Column Count Control */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Column Count
              </label>
              <select
                value={columnCount}
                onChange={(e) => setColumnCount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value={10}>10 columns</option>
                <option value={50}>50 columns</option>
                <option value={100}>100 columns</option>
                <option value={200}>200 columns</option>
              </select>
            </div>

            {/* Row Virtualization Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Row Virtualization
              </label>
              <button
                onClick={() => setVirtualEnabled(!virtualEnabled)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: virtualEnabled ? '#16a34a' : '#d1d5db',
                  color: virtualEnabled ? 'white' : '#374151',
                  transition: 'all 0.2s',
                }}
              >
                {virtualEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Column Virtualization Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Column Virtualization
              </label>
              <button
                onClick={() => setColumnVirtualEnabled(!columnVirtualEnabled)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: virtualEnabled ? 'pointer' : 'not-allowed',
                  backgroundColor: columnVirtualEnabled ? '#2563eb' : '#d1d5db',
                  color: columnVirtualEnabled ? 'white' : '#374151',
                  transition: 'all 0.2s',
                  opacity: virtualEnabled ? 1 : 0.5,
                }}
                disabled={!virtualEnabled}
              >
                {columnVirtualEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
            Virtual Scrolling Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', fontSize: '14px', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Windowing:</strong> Only renders visible rows in viewport
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Column Virtualization:</strong> Only renders visible columns
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Dynamic Row Heights:</strong> Supports variable row sizes
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Cell Recycling:</strong> Reuses DOM elements for performance
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Overscan:</strong> Pre-renders rows above/below viewport
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>✓</span>
              <div>
                <strong>Smooth Scrolling:</strong> Maintains scroll position accurately
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ flexShrink: 0 }}>
              <svg style={{ height: '16px', width: '16px', color: '#3b82f6' }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div style={{ marginLeft: '12px' }}>
              <p style={{ fontSize: '14px', color: '#1d4ed8' }}>
                <strong>Performance Tip:</strong> Try toggling virtualization off with a large dataset 
                to see the dramatic performance difference. With virtualization enabled, the grid can 
                handle 100,000+ rows smoothly!
              </p>
            </div>
          </div>
        </div>

        {/* DataGrid */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <ThemedDataGrid
            columns={columns}
            rows={largeDataset}
            theme="quartz"
            virtualScrollConfig={virtualScrollConfig}
            onCellEdit={handleCellEdit}
            showColumnPinning={false}
          />
        </div>

        {/* Technical Details */}
        <div style={{ marginTop: '24px', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
            Technical Implementation
          </h2>
          <div style={{ fontSize: '14px', color: '#374151' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Row Virtualization:</strong> Uses binary search to quickly find the starting 
              row index based on scroll position. Only renders visible rows plus overscan buffer.
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Column Virtualization:</strong> Calculates visible column range based on 
              horizontal scroll position. Absolutely positions cells for smooth scrolling.
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Dynamic Heights:</strong> Supports both fixed and dynamic row heights. 
              Measures rendered elements and caches heights for subsequent renders.
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Cell Recycling:</strong> DOM elements are reused as you scroll, dramatically 
              reducing memory usage and improving performance.
            </p>
            <p>
              <strong>Optimizations:</strong> Uses React.memo, useMemo, and useCallback extensively 
              to prevent unnecessary re-renders. Scroll events are throttled for performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualScrollDemo;
