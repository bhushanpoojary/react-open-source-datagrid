import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import { DataGrid, DensityToggle, useDensityMode } from './DataGrid';
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
export const DensityModeDemo = () => {
    const { densityMode, setDensityMode, densityStyles } = useDensityMode({
        initialMode: 'normal',
        persist: true,
    });
    // Sample product data
    const [products] = useState([
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
    const columns = [
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
            renderCell: (row) => (_jsxs("span", { children: ["\u2B50 ", row.rating.toFixed(1)] }))
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            renderCell: (row) => {
                const statusColors = {
                    'In Stock': '#10b981',
                    'Low Stock': '#f59e0b',
                    'Out of Stock': '#ef4444',
                };
                return (_jsx("span", { style: {
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: statusColors[row.status] + '20',
                        color: statusColors[row.status],
                    }, children: row.status }));
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
      densityMode="normal"      // Initial density: ultraCompact | compact | normal | comfortable
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

/* Ultra Compact Mode */
--grid-row-height: 24px;
--grid-cell-padding: 2px 6px;
--grid-header-padding: 4px 6px;
--grid-font-size: 12px;
--grid-font-size-sm: 10px;

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
        ultraCompact: { rowHeight: '24px', cellPadding: '2px 6px', fontSize: '12px' },
        compact: { rowHeight: '32px', cellPadding: '4px 8px', fontSize: '13px' },
        normal: { rowHeight: '44px', cellPadding: '10px 12px', fontSize: '14px' },
        comfortable: { rowHeight: '56px', cellPadding: '14px 16px', fontSize: '15px' },
    };
    return (_jsx("div", { style: {
            minHeight: '100vh',
            padding: '32px',
            backgroundColor: '#f9fafb',
            color: '#111827',
        }, children: _jsxs("div", { style: { maxWidth: '1400px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '32px' }, children: [_jsx("h1", { style: { fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }, children: "Density Mode System" }), _jsx("p", { style: { fontSize: '18px', color: '#6b7280', marginBottom: '24px' }, children: "Control data density with Ultra Compact, Compact, Normal, and Comfortable modes" }), _jsxs("div", { style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '16px',
                                marginBottom: '24px'
                            }, children: [_jsxs("div", { style: {
                                        backgroundColor: '#dbeafe',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #93c5fd'
                                    }, children: [_jsx("div", { style: { fontSize: '24px', marginBottom: '8px' }, children: "\uD83C\uDFAF" }), _jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#1e40af' }, children: "Four Density Modes" }), _jsx("p", { style: { fontSize: '14px', color: '#1e3a8a' }, children: "Ultra Compact, Compact, Normal, and Comfortable spacing" })] }), _jsxs("div", { style: {
                                        backgroundColor: '#dcfce7',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #86efac'
                                    }, children: [_jsx("div", { style: { fontSize: '24px', marginBottom: '8px' }, children: "\uD83D\uDCBE" }), _jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#15803d' }, children: "Persistent Preference" }), _jsx("p", { style: { fontSize: '14px', color: '#166534' }, children: "User's choice saved to localStorage automatically" })] }), _jsxs("div", { style: {
                                        backgroundColor: '#fef3c7',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #fcd34d'
                                    }, children: [_jsx("div", { style: { fontSize: '24px', marginBottom: '8px' }, children: "\uD83C\uDFA8" }), _jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#92400e' }, children: "CSS Variables" }), _jsx("p", { style: { fontSize: '14px', color: '#78350f' }, children: "Dynamic row height, padding, and font sizes" })] })] })] }), _jsxs("div", { style: {
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        marginBottom: '32px',
                        border: '1px solid #e5e7eb',
                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }, children: [_jsxs("h2", { style: { fontSize: '20px', fontWeight: '600' }, children: ["Current Density: ", _jsx("span", { style: { color: '#3b82f6' }, children: densityMode.charAt(0).toUpperCase() + densityMode.slice(1) })] }), _jsx(DensityToggle, { value: densityMode, onChange: setDensityMode })] }), _jsxs("div", { style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px',
                                marginBottom: '24px',
                            }, children: [_jsxs("div", { style: {
                                        padding: '12px',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '6px',
                                        border: densityMode === 'compact' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                    }, children: [_jsx("div", { style: { fontSize: '12px', color: '#6b7280', marginBottom: '4px' }, children: "Row Height" }), _jsx("div", { style: { fontSize: '18px', fontWeight: '600', color: '#111827' }, children: densityConfig[densityMode].rowHeight })] }), _jsxs("div", { style: {
                                        padding: '12px',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '6px',
                                        border: densityMode === 'compact' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                    }, children: [_jsx("div", { style: { fontSize: '12px', color: '#6b7280', marginBottom: '4px' }, children: "Cell Padding" }), _jsx("div", { style: { fontSize: '18px', fontWeight: '600', color: '#111827' }, children: densityConfig[densityMode].cellPadding })] }), _jsxs("div", { style: {
                                        padding: '12px',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '6px',
                                        border: densityMode === 'compact' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                    }, children: [_jsx("div", { style: { fontSize: '12px', color: '#6b7280', marginBottom: '4px' }, children: "Font Size" }), _jsx("div", { style: { fontSize: '18px', fontWeight: '600', color: '#111827' }, children: densityConfig[densityMode].fontSize })] })] }), _jsx("div", { style: densityStyles, children: _jsx(DataGrid, { columns: columns, rows: products, pageSize: 10, theme: "quartz", densityMode: densityMode, onDensityChange: setDensityMode }) })] }), _jsxs("div", { style: {
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        marginBottom: '32px',
                        border: '1px solid #e5e7eb',
                    }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: "Built-in Toolbar Toggle" }), _jsxs("p", { style: { fontSize: '14px', color: '#6b7280', marginBottom: '16px' }, children: ["Enable the density toggle directly in the DataGrid toolbar with ", _jsx("code", { style: {
                                        backgroundColor: '#f3f4f6',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace'
                                    }, children: "showDensityToggle={true}" })] }), _jsx(DataGrid, { columns: columns, rows: products.slice(0, 5), pageSize: 5, theme: "quartz", showDensityToggle: true })] }), _jsxs("div", { style: {
                        display: 'grid',
                        gap: '24px',
                        marginBottom: '32px'
                    }, children: [_jsxs("div", { style: {
                                backgroundColor: '#ffffff',
                                padding: '24px',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e5e7eb',
                            }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: "Basic Usage" }), _jsx(CodeBlock, { code: basicUsageCode, language: "tsx" })] }), _jsxs("div", { style: {
                                backgroundColor: '#ffffff',
                                padding: '24px',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e5e7eb',
                            }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: "With useDensityMode Hook" }), _jsx(CodeBlock, { code: withHookCode, language: "tsx" })] }), _jsxs("div", { style: {
                                backgroundColor: '#ffffff',
                                padding: '24px',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e5e7eb',
                            }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: "Standalone Toggle Component" }), _jsx(CodeBlock, { code: standaloneToggleCode, language: "tsx" })] }), _jsxs("div", { style: {
                                backgroundColor: '#ffffff',
                                padding: '24px',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e5e7eb',
                            }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: "CSS Variables Reference" }), _jsx(CodeBlock, { code: cssVariablesCode, language: "css" })] })] }), _jsxs("div", { style: {
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e5e7eb',
                    }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: "When to Use Each Mode" }), _jsxs("div", { style: { display: 'grid', gap: '16px' }, children: [_jsxs("div", { style: { padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }, children: "\uD83D\uDD39 Ultra Compact Mode" }), _jsx("p", { style: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }, children: "Maximum data density for professional traders, data analysts, and power users who need to see the most information possible. Ultra-tight spacing shows 50%+ more rows than normal mode. Best for large monitors and experienced users." })] }), _jsxs("div", { style: { padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }, children: "\uD83D\uDD39 Compact Mode" }), _jsx("p", { style: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }, children: "High data density with improved readability compared to ultra compact. Ideal for power users and financial dashboards where efficiency matters." })] }), _jsxs("div", { style: { padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }, children: "\uD83D\uDD39 Normal Mode (Default)" }), _jsx("p", { style: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }, children: "Balanced spacing suitable for most use cases. Good compromise between data density and readability. Recommended for general business applications." })] }), _jsxs("div", { style: { padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }, children: "\uD83D\uDD39 Comfortable Mode" }), _jsx("p", { style: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }, children: "Generous spacing for improved accessibility and touch targets. Perfect for users with visual impairments, tablets/touch devices, and public-facing applications." })] })] })] })] }) }));
};
