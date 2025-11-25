import React, { useState } from 'react';
import { DataGrid, DensityToggle, useDensityMode } from './DataGrid';
import type { Column, Row } from './DataGrid';
import { CodeBlock } from './CodeBlock';

/**
 * DensityModeDemo - Showcase of DataGrid Density Modes
 * 
 * Demonstrates:
 * - Compact mode: Minimal spacing for maximum data density
 * - Normal mode: Balanced spacing for general use
 * - Comfortable mode: Generous spacing for accessibility
 * - Persistent density preference (localStorage)
 * - Segmented control UI
 */
export const DensityModeDemo: React.FC = () => {
  const { densityMode, setDensityMode, densityStyles } = useDensityMode({
    initialMode: 'normal',
    persist: true,
  });

  // Sample product data
  const [products] = useState<Row[]>([
    {
      id: 1,
      name: 'Laptop Pro 15',
      category: 'Electronics',
      price: 1299.99,
      stock: 45,
      rating: 4.8,
      status: 'In Stock',
      sku: 'LAP-PRO-15',
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      category: 'Accessories',
      price: 29.99,
      stock: 150,
      rating: 4.5,
      status: 'In Stock',
      sku: 'MOU-WIR-01',
    },
    {
      id: 3,
      name: 'USB-C Hub',
      category: 'Accessories',
      price: 49.99,
      stock: 8,
      rating: 4.2,
      status: 'Low Stock',
      sku: 'HUB-USC-12',
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 149.99,
      stock: 32,
      rating: 4.9,
      status: 'In Stock',
      sku: 'KEY-MEC-99',
    },
    {
      id: 5,
      name: '4K Monitor 27"',
      category: 'Electronics',
      price: 399.99,
      stock: 0,
      rating: 4.7,
      status: 'Out of Stock',
      sku: 'MON-4K-27',
    },
    {
      id: 6,
      name: 'Webcam HD',
      category: 'Electronics',
      price: 79.99,
      stock: 65,
      rating: 4.4,
      status: 'In Stock',
      sku: 'CAM-HD-01',
    },
    {
      id: 7,
      name: 'Laptop Stand',
      category: 'Accessories',
      price: 39.99,
      stock: 120,
      rating: 4.6,
      status: 'In Stock',
      sku: 'STA-LAP-05',
    },
    {
      id: 8,
      name: 'Headphones Wireless',
      category: 'Electronics',
      price: 199.99,
      stock: 42,
      rating: 4.8,
      status: 'In Stock',
      sku: 'HDP-WIR-88',
    },
  ]);

  const columns: Column[] = [
    { field: 'sku', headerName: 'SKU', width: 120 },
    { field: 'name', headerName: 'Product Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 140 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      renderCell: (row) => `$${row.price.toFixed(2)}`
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { 
      field: 'rating', 
      headerName: 'Rating', 
      width: 100,
      renderCell: (row) => (
        <span>
          ⭐ {row.rating.toFixed(1)}
        </span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (row) => {
        const statusColors: Record<string, string> = {
          'In Stock': '#10b981',
          'Low Stock': '#f59e0b',
          'Out of Stock': '#ef4444',
        };
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: statusColors[row.status] + '20',
            color: statusColors[row.status],
          }}>
            {row.status}
          </span>
        );
      }
    },
  ];

  const basicUsageCode = `import { DataGrid } from './DataGrid';

function MyComponent() {
  return (
    <DataGrid
      columns={columns}
      rows={data}
      showDensityToggle={true}  // Show density toggle in toolbar
      densityMode="normal"      // Initial density: compact | normal | comfortable
    />
  );
}`;

  const withHookCode = `import { DataGrid, useDensityMode } from './DataGrid';

function MyComponent() {
  const { densityMode, setDensityMode, densityStyles } = useDensityMode({
    initialMode: 'normal',
    persist: true,  // Save to localStorage
  });

  return (
    <div style={densityStyles}>
      <DensityToggle value={densityMode} onChange={setDensityMode} />
      <DataGrid columns={columns} rows={data} />
    </div>
  );
}`;

  const standaloneToggleCode = `import { DensityToggle } from './DataGrid';

function MyToolbar() {
  const [density, setDensity] = useState<DensityMode>('normal');
  
  return (
    <DensityToggle value={density} onChange={setDensity} />
  );
}`;

  const cssVariablesCode = `/* CSS Variables set by density mode */

/* Compact Mode */
--grid-row-height: 32px;
--grid-cell-padding: 4px 8px;
--grid-header-padding: 6px 8px;
--grid-font-size: 13px;
--grid-font-size-sm: 11px;

/* Normal Mode */
--grid-row-height: 44px;
--grid-cell-padding: 10px 12px;
--grid-header-padding: 10px 12px;
--grid-font-size: 14px;
--grid-font-size-sm: 12px;

/* Comfortable Mode */
--grid-row-height: 56px;
--grid-cell-padding: 14px 16px;
--grid-header-padding: 14px 16px;
--grid-font-size: 15px;
--grid-font-size-sm: 13px;`;

  const densityConfig = {
    compact: { rowHeight: '32px', cellPadding: '4px 8px', fontSize: '13px' },
    normal: { rowHeight: '44px', cellPadding: '10px 12px', fontSize: '14px' },
    comfortable: { rowHeight: '56px', cellPadding: '14px 16px', fontSize: '15px' },
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        padding: '32px',
        backgroundColor: '#f9fafb',
        color: '#111827',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
            Density Mode System
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>
            Control data density with Compact, Normal, and Comfortable modes
          </p>

          {/* Feature Highlights */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px',
            marginBottom: '24px' 
          }}>
            <div style={{ 
              backgroundColor: '#dbeafe', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #93c5fd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#1e40af' }}>
                Three Density Modes
              </h3>
              <p style={{ fontSize: '14px', color: '#1e3a8a' }}>
                Compact, Normal, and Comfortable spacing options
              </p>
            </div>

            <div style={{ 
              backgroundColor: '#dcfce7', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #86efac'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💾</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#15803d' }}>
                Persistent Preference
              </h3>
              <p style={{ fontSize: '14px', color: '#166534' }}>
                User's choice saved to localStorage automatically
              </p>
            </div>

            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #fcd34d'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎨</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#92400e' }}>
                CSS Variables
              </h3>
              <p style={{ fontSize: '14px', color: '#78350f' }}>
                Dynamic row height, padding, and font sizes
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo - Current Density Display */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
              Current Density: <span style={{ color: '#3b82f6' }}>{densityMode.charAt(0).toUpperCase() + densityMode.slice(1)}</span>
            </h2>
            <DensityToggle value={densityMode} onChange={setDensityMode} />
          </div>

          {/* Density Configuration Display */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '6px',
              border: densityMode === 'compact' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Row Height</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                {densityConfig[densityMode].rowHeight}
              </div>
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '6px',
              border: densityMode === 'compact' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Cell Padding</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                {densityConfig[densityMode].cellPadding}
              </div>
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '6px',
              border: densityMode === 'compact' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Font Size</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                {densityConfig[densityMode].fontSize}
              </div>
            </div>
          </div>

          {/* DataGrid with density applied */}
          <div style={densityStyles as React.CSSProperties}>
            <DataGrid
              columns={columns}
              rows={products}
              pageSize={10}
              theme="quartz"
              densityMode={densityMode}
              onDensityChange={setDensityMode}
            />
          </div>
        </div>

        {/* Built-in Toggle Example */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
          border: '1px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Built-in Toolbar Toggle
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Enable the density toggle directly in the DataGrid toolbar with <code style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontFamily: 'monospace' 
            }}>showDensityToggle=&#123;true&#125;</code>
          </p>
          <DataGrid
            columns={columns}
            rows={products.slice(0, 5)}
            pageSize={5}
            theme="quartz"
            showDensityToggle={true}
          />
        </div>

        {/* Usage Examples */}
        <div style={{ 
          display: 'grid', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              Basic Usage
            </h2>
            <CodeBlock code={basicUsageCode} language="tsx" />
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              With useDensityMode Hook
            </h2>
            <CodeBlock code={withHookCode} language="tsx" />
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              Standalone Toggle Component
            </h2>
            <CodeBlock code={standaloneToggleCode} language="tsx" />
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              CSS Variables Reference
            </h2>
            <CodeBlock code={cssVariablesCode} language="css" />
          </div>
        </div>

        {/* Use Cases */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            When to Use Each Mode
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                🔹 Compact Mode
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                Ideal for power users, financial trading dashboards, and scenarios where maximum data density is needed. 
                Displays more rows on screen with minimal spacing.
              </p>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                🔹 Normal Mode (Default)
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                Balanced spacing suitable for most use cases. Good compromise between data density and readability. 
                Recommended for general business applications.
              </p>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                🔹 Comfortable Mode
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                Generous spacing for improved accessibility and touch targets. Perfect for users with visual impairments, 
                tablets/touch devices, and public-facing applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
