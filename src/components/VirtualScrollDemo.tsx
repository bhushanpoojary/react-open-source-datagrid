import React, { useMemo, useState } from 'react';
import { DataGrid } from './DataGrid';
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Virtual Scrolling Demo
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Ultra-fast rendering with 50,000+ rows and 200+ columns
          </p>
          
          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Total Rows</div>
              <div className="text-2xl font-bold text-blue-600">
                {largeDataset.length.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Total Columns</div>
              <div className="text-2xl font-bold text-green-600">
                {columns.length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Total Cells</div>
              <div className="text-2xl font-bold text-purple-600">
                {(largeDataset.length * columns.length).toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Virtualization</div>
              <div className="text-2xl font-bold text-orange-600">
                {virtualEnabled ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Row Count Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Row Count
              </label>
              <select
                value={rowCount}
                onChange={(e) => setRowCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Column Count
              </label>
              <select
                value={columnCount}
                onChange={(e) => setColumnCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 columns</option>
                <option value={50}>50 columns</option>
                <option value={100}>100 columns</option>
                <option value={200}>200 columns</option>
              </select>
            </div>

            {/* Row Virtualization Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Row Virtualization
              </label>
              <button
                onClick={() => setVirtualEnabled(!virtualEnabled)}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  virtualEnabled
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {virtualEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Column Virtualization Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Column Virtualization
              </label>
              <button
                onClick={() => setColumnVirtualEnabled(!columnVirtualEnabled)}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  columnVirtualEnabled
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
                disabled={!virtualEnabled}
              >
                {columnVirtualEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Virtual Scrolling Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong>Windowing:</strong> Only renders visible rows in viewport
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong>Column Virtualization:</strong> Only renders visible columns
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong>Dynamic Row Heights:</strong> Supports variable row sizes
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong>Cell Recycling:</strong> Reuses DOM elements for performance
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong>Overscan:</strong> Pre-renders rows above/below viewport
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong>Smooth Scrolling:</strong> Maintains scroll position accurately
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Performance Tip:</strong> Try toggling virtualization off with a large dataset 
                to see the dramatic performance difference. With virtualization enabled, the grid can 
                handle 100,000+ rows smoothly!
              </p>
            </div>
          </div>
        </div>

        {/* DataGrid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataGrid
            columns={columns}
            rows={largeDataset}
            virtualScrollConfig={virtualScrollConfig}
            onCellEdit={handleCellEdit}
            showColumnPinning={false}
          />
        </div>

        {/* Technical Details */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Technical Implementation
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Row Virtualization:</strong> Uses binary search to quickly find the starting 
              row index based on scroll position. Only renders visible rows plus overscan buffer.
            </p>
            <p>
              <strong>Column Virtualization:</strong> Calculates visible column range based on 
              horizontal scroll position. Absolutely positions cells for smooth scrolling.
            </p>
            <p>
              <strong>Dynamic Heights:</strong> Supports both fixed and dynamic row heights. 
              Measures rendered elements and caches heights for subsequent renders.
            </p>
            <p>
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
