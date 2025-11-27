import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
import { ThemeSelector } from './DataGrid/ThemeSelector';
import { getTheme, generateThemeCSS } from './DataGrid/themes';
import { CodeBlock } from './CodeBlock';
/**
 * ThemesDemo - Showcase of DataGrid Theme System
 *
 * Demonstrates all available themes:
 * - Quartz (Modern White)
 * - Alpine (Classic Business)
 * - Material
 * - Dark Mode
 * - Nord (Arctic)
 * - Dracula
 * - Solarized Light
 * - Solarized Dark
 * - Monokai
 * - One Dark
 */
export const ThemesDemo = () => {
    const [currentTheme, setCurrentTheme] = useState('quartz');
    // Sample data
    const [products] = useState([
        {
            id: 1,
            name: 'Laptop Pro 15',
            category: 'Electronics',
            price: 1299.99,
            stock: 45,
            rating: 4.8,
            status: 'In Stock',
            lastUpdated: '2025-11-20',
        },
        {
            id: 2,
            name: 'Wireless Mouse',
            category: 'Accessories',
            price: 29.99,
            stock: 156,
            rating: 4.5,
            status: 'In Stock',
            lastUpdated: '2025-11-19',
        },
        {
            id: 3,
            name: 'USB-C Hub',
            category: 'Accessories',
            price: 49.99,
            stock: 0,
            rating: 4.3,
            status: 'Out of Stock',
            lastUpdated: '2025-11-18',
        },
        {
            id: 4,
            name: 'Mechanical Keyboard',
            category: 'Accessories',
            price: 159.99,
            stock: 23,
            rating: 4.9,
            status: 'In Stock',
            lastUpdated: '2025-11-22',
        },
        {
            id: 5,
            name: '4K Monitor 27"',
            category: 'Electronics',
            price: 449.99,
            stock: 12,
            rating: 4.7,
            status: 'Low Stock',
            lastUpdated: '2025-11-21',
        },
        {
            id: 6,
            name: 'Webcam HD',
            category: 'Electronics',
            price: 89.99,
            stock: 67,
            rating: 4.4,
            status: 'In Stock',
            lastUpdated: '2025-11-20',
        },
        {
            id: 7,
            name: 'Desk Lamp LED',
            category: 'Office',
            price: 39.99,
            stock: 88,
            rating: 4.6,
            status: 'In Stock',
            lastUpdated: '2025-11-19',
        },
        {
            id: 8,
            name: 'Ergonomic Chair',
            category: 'Furniture',
            price: 299.99,
            stock: 8,
            rating: 4.8,
            status: 'Low Stock',
            lastUpdated: '2025-11-23',
        },
    ]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
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
            renderCell: (row) => `⭐ ${row.rating}`
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
        { field: 'lastUpdated', headerName: 'Last Updated', width: 140 },
    ];
    const theme = getTheme(currentTheme);
    const themeStyles = generateThemeCSS(theme);
    return (_jsx("div", { style: {
            ...themeStyles,
            minHeight: '100vh',
            padding: '24px',
            backgroundColor: theme.colors.backgroundAlt,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            transition: 'all 0.3s ease',
        }, children: _jsxs("div", { style: { maxWidth: '1400px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '24px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }, children: [_jsx("h1", { style: {
                                        fontSize: '28px',
                                        fontWeight: '700',
                                        color: theme.colors.text,
                                        margin: 0,
                                    }, children: "DataGrid Theme System" }), _jsx(ThemeSelector, { currentTheme: currentTheme, onThemeChange: setCurrentTheme })] }), _jsx("p", { style: {
                                fontSize: '14px',
                                color: theme.colors.textSecondary,
                                margin: '8px 0 0 0',
                            }, children: "Switch between different themes to see how the grid adapts to various design systems" })] }), _jsxs("div", { style: {
                        padding: '20px',
                        marginBottom: '24px',
                        backgroundColor: theme.colors.background,
                        border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}`,
                        borderRadius: theme.borders.radius,
                        boxShadow: theme.shadows.light,
                    }, children: [_jsxs("h3", { style: {
                                fontSize: '16px',
                                fontWeight: theme.typography.headerFontWeight,
                                color: theme.colors.text,
                                marginTop: 0,
                                marginBottom: '12px',
                            }, children: ["Current Theme: ", theme.displayName] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }, children: [_jsxs("div", { children: [_jsx("strong", { style: { color: theme.colors.textSecondary, fontSize: '13px' }, children: "Features:" }), _jsxs("ul", { style: {
                                                margin: '8px 0 0 0',
                                                paddingLeft: '20px',
                                                fontSize: '13px',
                                                lineHeight: '1.6',
                                                color: theme.colors.text,
                                            }, children: [_jsx("li", { children: _jsx("span", { style: { color: theme.colors.primary }, children: "Sortable columns" }) }), _jsx("li", { children: _jsx("span", { style: { color: theme.colors.primary }, children: "Column filtering" }) }), _jsx("li", { children: _jsx("span", { style: { color: theme.colors.primary }, children: "Column resizing" }) }), _jsx("li", { children: _jsx("span", { style: { color: theme.colors.primary }, children: "Row selection" }) })] })] }), _jsxs("div", { children: [_jsx("strong", { style: { color: theme.colors.textSecondary, fontSize: '13px' }, children: "Try it out:" }), _jsxs("ul", { style: {
                                                margin: '8px 0 0 0',
                                                paddingLeft: '20px',
                                                fontSize: '13px',
                                                lineHeight: '1.6',
                                                color: theme.colors.text,
                                            }, children: [_jsx("li", { children: "Click headers to sort" }), _jsx("li", { children: "Hover over rows" }), _jsx("li", { children: "Select rows by clicking" }), _jsx("li", { children: "Resize columns by dragging" })] })] })] })] }), _jsx(DataGrid, { columns: columns, rows: products, pageSize: 10, theme: currentTheme, footerConfig: {
                        show: true,
                        aggregates: [
                            { field: 'price', function: 'avg', label: 'Avg Price' },
                            { field: 'stock', function: 'sum', label: 'Total Stock' },
                        ],
                    } }), _jsxs("div", { style: {
                        marginTop: '24px',
                        padding: '20px',
                        backgroundColor: theme.colors.background,
                        border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}`,
                        borderRadius: theme.borders.radius,
                        boxShadow: theme.shadows.light,
                    }, children: [_jsx("h3", { style: {
                                fontSize: '16px',
                                fontWeight: theme.typography.headerFontWeight,
                                color: theme.colors.text,
                                marginTop: 0,
                                marginBottom: '16px',
                            }, children: "Theme Color Palette" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }, children: [
                                { name: 'Primary', color: theme.colors.primary },
                                { name: 'Success', color: theme.colors.success },
                                { name: 'Warning', color: theme.colors.warning },
                                { name: 'Error', color: theme.colors.error },
                                { name: 'Info', color: theme.colors.info },
                                { name: 'Text', color: theme.colors.text },
                                { name: 'Border', color: theme.colors.border },
                                { name: 'Background', color: theme.colors.background },
                            ].map((item) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("div", { style: {
                                            width: '32px',
                                            height: '32px',
                                            backgroundColor: item.color,
                                            border: `1px solid ${theme.colors.border}`,
                                            borderRadius: '4px',
                                            boxShadow: theme.shadows.light,
                                        } }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '12px', fontWeight: '600', color: theme.colors.text }, children: item.name }), _jsx("div", { style: { fontSize: '10px', color: theme.colors.textSecondary, fontFamily: 'monospace' }, children: item.color })] })] }, item.name))) })] }), _jsxs("div", { style: { marginTop: '24px' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: theme.colors.text }, children: "Implementation Example" }), _jsx(CodeBlock, { title: "Using Custom Themes", language: "tsx", code: `import { DataGrid, ThemeSelector } from './components/DataGrid';
import type { ThemeName } from './components/DataGrid/themes';

function App() {
  const [theme, setTheme] = useState<ThemeName>('quartz');
  
  return (
    <>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      
      <DataGrid
        columns={columns}
        rows={data}
        theme={theme} // Themes applied directly!
      />
    </>
  );
}

// Available themes:
// 'quartz', 'alpine', 'material', 'dark', 
// 'nord', 'dracula', 'solarized-light', 
// 'solarized-dark', 'monokai', 'one-dark'

// Switch themes dynamically
<DataGrid theme="nord" columns={columns} rows={data} />
<DataGrid theme="dracula" columns={columns} rows={data} />
<DataGrid theme="monokai" columns={columns} rows={data} />` })] })] }) }));
};
