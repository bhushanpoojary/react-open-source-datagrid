/**
 * Pivot Table Demo Page
 * 
 * Demonstrates the pivot table functionality with multiple examples
 */

import React, { useState, useMemo } from 'react';
import { DataGrid } from './DataGrid';
import { PivotToolbar } from './DataGrid/PivotToolbar';
import type { PivotConfig } from './DataGrid/pivotEngine';
import { CodeBlock } from './CodeBlock';
import { exportPivotToCSV, downloadCSV, buildPivot } from './DataGrid/pivotEngine';

// Sample sales data for pivot demo
interface SalesRecord {
  id: number;
  region: string;
  product: string;
  category: string;
  salesperson: string;
  quarter: string;
  month: string;
  revenue: number;
  units: number;
  year: number;
}

// Generate comprehensive sales data
const generateSalesData = (): SalesRecord[] => {
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const products = ['Laptop', 'Desktop', 'Tablet', 'Phone', 'Monitor', 'Keyboard', 'Mouse'];
  const salespeople = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2023, 2024, 2025];

  const data: SalesRecord[] = [];
  let id = 1;

  regions.forEach(region => {
    products.forEach(product => {
      quarters.forEach(quarter => {
        const year = years[Math.floor(Math.random() * years.length)];
        const revenue = Math.floor(Math.random() * 50000) + 10000;
        const units = Math.floor(Math.random() * 500) + 50;
        const month = months[Math.floor(Math.random() * 12)];
        const salesperson = salespeople[Math.floor(Math.random() * salespeople.length)];
        
        let category = 'Electronics';
        if (product === 'Keyboard' || product === 'Mouse') category = 'Accessories';
        if (product === 'Laptop' || product === 'Desktop') category = 'Computing';

        data.push({
          id: id++,
          region,
          product,
          category,
          salesperson,
          quarter,
          month,
          revenue,
          units,
          year,
        });
      });
    });
  });

  return data;
};

export const PivotDemo: React.FC = () => {
  const [salesData] = useState<SalesRecord[]>(generateSalesData());
  const [pivotConfig, setPivotConfig] = useState<PivotConfig | null>(null);
  const [isPivotMode, setIsPivotMode] = useState(false);

  // Available columns for pivot configuration
  const availableColumns = useMemo(() => [
    { field: 'region', headerName: 'Region' },
    { field: 'product', headerName: 'Product' },
    { field: 'category', headerName: 'Category' },
    { field: 'salesperson', headerName: 'Salesperson' },
    { field: 'quarter', headerName: 'Quarter' },
    { field: 'month', headerName: 'Month' },
    { field: 'year', headerName: 'Year' },
    { field: 'revenue', headerName: 'Revenue' },
    { field: 'units', headerName: 'Units Sold' },
  ], []);

  // Original columns for non-pivot view
  const originalColumns = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 70, sortable: true },
    { field: 'region', headerName: 'Region', width: 100, sortable: true, filterable: true },
    { field: 'product', headerName: 'Product', width: 120, sortable: true, filterable: true },
    { field: 'category', headerName: 'Category', width: 120, sortable: true, filterable: true },
    { field: 'salesperson', headerName: 'Salesperson', width: 130, sortable: true, filterable: true },
    { field: 'quarter', headerName: 'Quarter', width: 90, sortable: true, filterable: true },
    { field: 'month', headerName: 'Month', width: 90, sortable: true, filterable: true },
    { field: 'year', headerName: 'Year', width: 80, sortable: true, filterable: true },
    { 
      field: 'revenue', 
      headerName: 'Revenue', 
      width: 120, 
      sortable: true, 
      filterable: true,
      renderCell: (row: any) => (
        <span style={{ fontWeight: '600', color: '#059669' }}>
          ${row.revenue?.toLocaleString() || '0'}
        </span>
      ),
    },
    { 
      field: 'units', 
      headerName: 'Units', 
      width: 100, 
      sortable: true, 
      filterable: true,
      renderCell: (row: any) => (
        <span>{row.units?.toLocaleString() || '0'}</span>
      ),
    },
  ], []);

  // Handle pivot configuration change
  const handlePivotConfigChange = (config: PivotConfig | null) => {
    setPivotConfig(config);
  };

  // Handle pivot mode toggle
  const handlePivotToggle = (enabled: boolean) => {
    setIsPivotMode(enabled);
  };

  // Quick pivot presets
  const applyPreset = (presetName: string) => {
    let config: PivotConfig | null = null;

    switch (presetName) {
      case 'revenue-by-region-quarter':
        config = {
          rowGroupColumn: 'region',
          pivotColumn: 'quarter',
          valueColumn: 'revenue',
          aggregator: 'sum',
          showTotals: true,
          showGrandTotal: true,
        };
        break;
      case 'units-by-product-region':
        config = {
          rowGroupColumn: 'product',
          pivotColumn: 'region',
          valueColumn: 'units',
          aggregator: 'sum',
          showTotals: true,
          showGrandTotal: true,
        };
        break;
      case 'revenue-by-salesperson-quarter':
        config = {
          rowGroupColumn: 'salesperson',
          pivotColumn: 'quarter',
          valueColumn: 'revenue',
          aggregator: 'avg',
          showTotals: true,
          showGrandTotal: false,
        };
        break;
      case 'category-analysis':
        config = {
          rowGroupColumn: 'category',
          pivotColumn: 'year',
          valueColumn: 'revenue',
          aggregator: 'sum',
          showTotals: true,
          showGrandTotal: true,
        };
        break;
    }

    if (config) {
      setPivotConfig(config);
      setIsPivotMode(true);
    }
  };

  // Export pivot data to CSV
  const handleExportCSV = () => {
    if (!pivotConfig) return;

    const pivotResult = buildPivot(salesData, pivotConfig);
    const csvContent = exportPivotToCSV(pivotResult);
    downloadCSV(csvContent, 'pivot-table-export.csv');
  };

  return (
    <div style={{ 
      height: '100%', 
      backgroundColor: '#f9fafb', 
      padding: '24px', 
      overflow: 'auto' 
    }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '8px' 
          }}>
            📊 Pivot Table
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Transform your data with dynamic pivot tables. Group, aggregate, and analyze data 
            from multiple dimensions with powerful aggregation functions.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ 
          marginBottom: '24px', 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
          border: '1px solid #e5e7eb' 
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px', 
            color: '#111827' 
          }}>
            ✨ Features
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '16px', 
            fontSize: '14px' 
          }}>
            <div>
              <div style={{ fontWeight: '600', color: '#2563eb', marginBottom: '4px' }}>
                🎯 Dynamic Columns
              </div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>
                Pivot column values automatically become new columns
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#2563eb', marginBottom: '4px' }}>
                📈 Multiple Aggregations
              </div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>
                Sum, Average, Count, Min, Max, or custom functions
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#2563eb', marginBottom: '4px' }}>
                🎨 Visual Styling
              </div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>
                Styled pivot and total columns for better clarity
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#2563eb', marginBottom: '4px' }}>
                💾 Export to CSV
              </div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>
                Export pivoted data directly to CSV file
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#2563eb', marginBottom: '4px' }}>
                🔢 Totals & Subtotals
              </div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>
                Show row totals and grand total column
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#2563eb', marginBottom: '4px' }}>
                ⚡ High Performance
              </div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>
                Optimized O(n) algorithm for large datasets
              </div>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div style={{ 
          marginBottom: '24px', 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
          border: '1px solid #e5e7eb' 
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '12px', 
            color: '#111827' 
          }}>
            🚀 Quick Presets
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => applyPreset('revenue-by-region-quarter')}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dbeafe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
            >
              Revenue by Region × Quarter
            </button>
            <button
              onClick={() => applyPreset('units-by-product-region')}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#059669',
                backgroundColor: '#d1fae5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#a7f3d0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#d1fae5';
              }}
            >
              Units by Product × Region
            </button>
            <button
              onClick={() => applyPreset('revenue-by-salesperson-quarter')}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#7c3aed',
                backgroundColor: '#f3e8ff',
                border: '1px solid #d8b4fe',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9d5ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3e8ff';
              }}
            >
              Avg Revenue by Salesperson × Quarter
            </button>
            <button
              onClick={() => applyPreset('category-analysis')}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#dc2626',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fecaca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
              }}
            >
              Category Analysis by Year
            </button>
            {isPivotMode && (
              <button
                onClick={handleExportCSV}
                style={{
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#0f766e',
                  border: '1px solid #0f766e',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  marginLeft: 'auto',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d9488';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0f766e';
                }}
              >
                💾 Export to CSV
              </button>
            )}
          </div>
        </div>

        {/* Pivot Toolbar */}
        <div style={{ marginBottom: '24px' }}>
          <PivotToolbar
            columns={availableColumns}
            pivotConfig={pivotConfig}
            onPivotToggle={handlePivotToggle}
            onConfigChange={handlePivotConfigChange}
            isPivotMode={isPivotMode}
          />
        </div>

        {/* Data Grid */}
        <div style={{ 
          marginBottom: '24px', 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <DataGrid
            columns={originalColumns}
            rows={salesData}
            pageSize={20}
            theme="quartz"
            pivotConfig={isPivotMode ? pivotConfig : null}
            footerConfig={{
              show: !isPivotMode, // Hide footer in pivot mode as pivot has its own totals
              aggregates: [
                { field: 'revenue', function: 'total', label: 'Total Revenue' },
                { field: 'units', function: 'total', label: 'Total Units' },
              ],
            }}
          />
        </div>

        {/* Usage Examples */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px', 
            color: '#111827' 
          }}>
            💻 Implementation Examples
          </h2>

          <CodeBlock
            title="Basic Pivot Setup"
            language="tsx"
            code={`import { DataGrid, PivotToolbar } from 'react-open-source-grid';
import type { PivotConfig } from 'react-open-source-grid';

function MyPivotDemo() {
  const [pivotConfig, setPivotConfig] = useState<PivotConfig | null>(null);
  const [isPivotMode, setIsPivotMode] = useState(false);

  const columns = [
    { field: 'region', headerName: 'Region' },
    { field: 'product', headerName: 'Product' },
    { field: 'revenue', headerName: 'Revenue' },
  ];

  const data = [
    { id: 1, region: 'North', product: 'Laptop', revenue: 45000 },
    { id: 2, region: 'South', product: 'Laptop', revenue: 38000 },
    // ... more data
  ];

  return (
    <>
      <PivotToolbar
        columns={columns}
        pivotConfig={pivotConfig}
        onPivotToggle={setIsPivotMode}
        onConfigChange={setPivotConfig}
        isPivotMode={isPivotMode}
      />
      
      <DataGrid
        columns={columns}
        rows={data}
        pivotConfig={isPivotMode ? pivotConfig : null}
      />
    </>
  );
}`}
          />

          <CodeBlock
            title="Programmatic Pivot Configuration"
            language="tsx"
            code={`import type { PivotConfig } from 'react-open-source-grid';

// Create a pivot configuration
const pivotConfig: PivotConfig = {
  rowGroupColumn: 'region',      // Group rows by this field
  pivotColumn: 'quarter',         // Values become columns
  valueColumn: 'revenue',         // Values to aggregate
  aggregator: 'sum',              // sum | avg | count | min | max
  showTotals: true,               // Show totals row
  showGrandTotal: true,           // Show grand total column
};

// Apply to grid
<DataGrid
  columns={columns}
  rows={data}
  pivotConfig={pivotConfig}
/>`}
          />

          <CodeBlock
            title="Custom Aggregation Function"
            language="tsx"
            code={`import { buildPivot } from 'react-open-source-grid';
import type { PivotConfig } from 'react-open-source-grid';

// Custom aggregator: Weighted average
const weightedAverage = (values: number[]) => {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  const count = values.length;
  return sum / count * 1.15; // Apply 15% weight
};

const pivotConfig: PivotConfig = {
  rowGroupColumn: 'product',
  pivotColumn: 'region',
  valueColumn: 'revenue',
  aggregator: weightedAverage,  // Use custom function
  showTotals: true,
  showGrandTotal: true,
};

// Use the buildPivot function directly for custom processing
const pivotResult = buildPivot(data, pivotConfig);
console.log(pivotResult.rows);
console.log(pivotResult.columns);`}
          />

          <CodeBlock
            title="Export Pivot Data to CSV"
            language="tsx"
            code={`import { buildPivot, exportPivotToCSV, downloadCSV } from 'react-open-source-grid';

function exportPivotData() {
  // Build pivot result
  const pivotResult = buildPivot(data, pivotConfig);
  
  // Convert to CSV
  const csvContent = exportPivotToCSV(pivotResult);
  
  // Download file
  downloadCSV(csvContent, 'my-pivot-table.csv');
}

// Use in a button
<button onClick={exportPivotData}>
  Export Pivot to CSV
</button>`}
          />

          <CodeBlock
            title="TypeScript Interfaces"
            language="typescript"
            code={`// Pivot Configuration
interface PivotConfig {
  rowGroupColumn: string;        // Column to group rows by
  pivotColumn: string;           // Column whose values become columns
  valueColumn: string;           // Column to aggregate
  aggregator: AggregatorType | ((values: number[]) => number);
  showTotals?: boolean;          // Show totals row (default: false)
  showGrandTotal?: boolean;      // Show grand total column (default: false)
}

// Aggregator types
type AggregatorType = 'sum' | 'count' | 'avg' | 'min' | 'max';

// Pivot Result
interface PivotResult {
  columns: PivotColumn[];        // Generated column definitions
  rows: Record<string, any>[];   // Pivoted data rows
  pivotValues: string[];         // Unique pivot values
  totalsRow?: Record<string, any>; // Optional totals row
}

// Pivot Column
interface PivotColumn {
  field: string;
  headerName: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  isPivotColumn?: boolean;       // Marks dynamically created columns
  isTotalColumn?: boolean;       // Marks grand total column
}`}
          />
        </div>

        {/* Key Concepts */}
        <div style={{ 
          marginBottom: '24px', 
          backgroundColor: '#eff6ff', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid #bfdbfe' 
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px', 
            color: '#1e40af' 
          }}>
            📚 Key Concepts
          </h3>
          <div style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Row Group Column:</strong> The field used to group and organize rows. 
              Each unique value becomes a row in the pivot table.
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Pivot Column:</strong> The field whose unique values become column headers. 
              This creates the "wide" format of the pivot table.
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Value Column:</strong> The field containing numeric values to aggregate. 
              Values are grouped and aggregated based on row and pivot combinations.
            </p>
            <p style={{ marginBottom: '0' }}>
              <strong>Aggregator:</strong> The function used to combine multiple values into a single result. 
              Built-in options include sum, average, count, min, and max. Custom functions are also supported.
            </p>
          </div>
        </div>

        {/* Performance Note */}
        <div style={{ 
          backgroundColor: '#fefce8', 
          border: '1px solid #fde047',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          color: '#713f12'
        }}>
          <strong>⚡ Performance:</strong> The pivot engine uses an optimized O(n) algorithm 
          and can handle large datasets efficiently. Pivot results are memoized to prevent 
          unnecessary recalculations.
        </div>
      </div>
    </div>
  );
};

export default PivotDemo;
