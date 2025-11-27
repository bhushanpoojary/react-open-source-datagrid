import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from 'react';
import { DataGrid } from './DataGrid';
import { CodeBlock } from './CodeBlock';
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
export const VirtualScrollDemo = () => {
    const [rowCount, setRowCount] = useState(50000);
    const [columnCount, setColumnCount] = useState(50);
    const [virtualEnabled, setVirtualEnabled] = useState(true);
    const [columnVirtualEnabled, setColumnVirtualEnabled] = useState(true);
    // Generate large dataset
    const largeDataset = useMemo(() => {
        console.time('Generate Dataset');
        const data = [];
        for (let i = 0; i < rowCount; i++) {
            const row = {
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
    const columns = useMemo(() => {
        const cols = [
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
    const virtualScrollConfig = {
        enabled: virtualEnabled,
        rowHeight: 35, // Fixed row height for maximum performance
        containerHeight: 600,
        overscanCount: 5,
        enableColumnVirtualization: columnCount > 50 ? columnVirtualEnabled : false,
        columnOverscan: 3,
    };
    // Handle cell edit
    const handleCellEdit = (rowIndex, field, value) => {
        console.log(`Cell edited: Row ${rowIndex}, Field "${field}", Value: "${value}"`);
    };
    return (_jsx("div", { style: { minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px' }, children: _jsxs("div", { style: { maxWidth: '100%', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '24px' }, children: [_jsx("h1", { style: { fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }, children: "Virtual Scrolling Demo" }), _jsx("p", { style: { fontSize: '18px', color: '#4b5563', marginBottom: '16px' }, children: "Ultra-fast rendering with 50,000+ rows and 200+ columns" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }, children: [_jsxs("div", { style: { backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("div", { style: { fontSize: '14px', color: '#6b7280' }, children: "Total Rows" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }, children: largeDataset.length.toLocaleString() })] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("div", { style: { fontSize: '14px', color: '#6b7280' }, children: "Total Columns" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }, children: columns.length })] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("div", { style: { fontSize: '14px', color: '#6b7280' }, children: "Total Cells" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#9333ea' }, children: (largeDataset.length * columns.length).toLocaleString() })] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("div", { style: { fontSize: '14px', color: '#6b7280' }, children: "Virtualization" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#ea580c' }, children: virtualEnabled ? 'ON' : 'OFF' })] })] })] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }, children: [_jsx("h2", { style: { fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#111827" }, children: "Controls" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }, children: "Row Count" }), _jsxs("select", { value: rowCount, onChange: (e) => setRowCount(Number(e.target.value)), style: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }, children: [_jsx("option", { value: 100, children: "100 rows" }), _jsx("option", { value: 1000, children: "1,000 rows" }), _jsx("option", { value: 10000, children: "10,000 rows" }), _jsx("option", { value: 50000, children: "50,000 rows" }), _jsx("option", { value: 100000, children: "100,000 rows" })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }, children: "Column Count" }), _jsxs("select", { value: columnCount, onChange: (e) => setColumnCount(Number(e.target.value)), style: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }, children: [_jsx("option", { value: 10, children: "10 columns" }), _jsx("option", { value: 50, children: "50 columns" }), _jsx("option", { value: 100, children: "100 columns" }), _jsx("option", { value: 200, children: "200 columns" })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }, children: "Row Virtualization" }), _jsx("button", { onClick: () => setVirtualEnabled(!virtualEnabled), style: {
                                                width: '100%',
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                fontWeight: '500',
                                                border: 'none',
                                                cursor: 'pointer',
                                                backgroundColor: virtualEnabled ? '#16a34a' : '#d1d5db',
                                                color: virtualEnabled ? 'white' : '#374151',
                                                transition: 'all 0.2s',
                                            }, children: virtualEnabled ? 'Enabled' : 'Disabled' })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }, children: "Column Virtualization" }), _jsx("button", { onClick: () => setColumnVirtualEnabled(!columnVirtualEnabled), style: {
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
                                            }, disabled: !virtualEnabled, children: columnVirtualEnabled ? 'Enabled' : 'Disabled' })] })] })] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }, children: "Virtual Scrolling Features" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', fontSize: '14px', color: '#374151' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Windowing:" }), " Only renders visible rows in viewport"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Column Virtualization:" }), " Only renders visible columns"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Dynamic Row Heights:" }), " Supports variable row sizes"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Cell Recycling:" }), " Reuses DOM elements for performance"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Overscan:" }), " Pre-renders rows above/below viewport"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Smooth Scrolling:" }), " Maintains scroll position accurately"] })] })] })] }), _jsx("div", { style: { backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '16px', marginBottom: '24px' }, children: _jsxs("div", { style: { display: 'flex' }, children: [_jsx("div", { style: { flexShrink: 0 }, children: _jsx("svg", { style: { height: '16px', width: '16px', color: '#3b82f6' }, viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }) }), _jsx("div", { style: { marginLeft: '12px' }, children: _jsxs("p", { style: { fontSize: '14px', color: '#1d4ed8' }, children: [_jsx("strong", { children: "Performance Tip:" }), " Try toggling virtualization off with a large dataset to see the dramatic performance difference. With virtualization enabled, the grid can handle 100,000+ rows smoothly!"] }) })] }) }), _jsx("div", { style: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }, children: _jsx(DataGrid, { columns: columns, rows: largeDataset, theme: "quartz", virtualScrollConfig: virtualScrollConfig, onCellEdit: handleCellEdit, showColumnPinning: false }) }), _jsxs("div", { style: { marginTop: '24px', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }, children: "Technical Implementation" }), _jsxs("div", { style: { fontSize: '14px', color: '#374151' }, children: [_jsxs("p", { style: { marginBottom: '8px' }, children: [_jsx("strong", { children: "Row Virtualization:" }), " Uses binary search to quickly find the starting row index based on scroll position. Only renders visible rows plus overscan buffer."] }), _jsxs("p", { style: { marginBottom: '8px' }, children: [_jsx("strong", { children: "Column Virtualization:" }), " Calculates visible column range based on horizontal scroll position. Absolutely positions cells for smooth scrolling."] }), _jsxs("p", { style: { marginBottom: '8px' }, children: [_jsx("strong", { children: "Dynamic Heights:" }), " Supports both fixed and dynamic row heights. Measures rendered elements and caches heights for subsequent renders."] }), _jsxs("p", { style: { marginBottom: '8px' }, children: [_jsx("strong", { children: "Cell Recycling:" }), " DOM elements are reused as you scroll, dramatically reducing memory usage and improving performance."] }), _jsxs("p", { children: [_jsx("strong", { children: "Optimizations:" }), " Uses React.memo, useMemo, and useCallback extensively to prevent unnecessary re-renders. Scroll events are throttled for performance."] })] })] }), _jsxs("div", { style: { marginTop: '24px' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }, children: "Implementation Example" }), _jsx(CodeBlock, { title: "Virtual Scrolling Configuration", language: "tsx", code: `import { DataGrid} from './components/DataGrid';

const virtualScrollConfig = {
  enabled: true,
  rowHeight: 35, // Fixed row height for best performance
  containerHeight: 600,
  overscanCount: 5, // Extra rows to render above/below viewport
  enableColumnVirtualization: true,
  columnOverscan: 3, // Extra columns to render
};

<DataGrid
  columns={columns}
  rows={largeDataset}
  pageSize={50000}
  virtualScrollConfig={virtualScrollConfig}
  onCellEdit={(rowIndex, field, value) => {
    console.log('Cell edited:', { rowIndex, field, value });
  }}
/>` })] })] }) }));
};
export default VirtualScrollDemo;
