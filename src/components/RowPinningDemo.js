import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState, useCallback } from 'react';
import { DataGrid } from './DataGrid';
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
export const RowPinningDemo = () => {
    const [virtualEnabled, setVirtualEnabled] = useState(false);
    // Generate sample data
    const sampleData = useMemo(() => {
        const data = [];
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
    const columns = useMemo(() => [
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
    ], []);
    // Row pinning configuration
    const handlePinChange = useCallback((pinnedTop, pinnedBottom) => {
        console.log('Pinned rows changed:', { pinnedTop, pinnedBottom });
    }, []);
    const rowPinConfig = {
        enabled: true,
        onPinChange: handlePinChange,
    };
    // Virtual scroll configuration
    const virtualScrollConfig = virtualEnabled ? {
        enabled: true,
        rowHeight: 35,
        containerHeight: 600,
        overscanCount: 5,
    } : undefined;
    return (_jsx("div", { style: { minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px' }, children: _jsxs("div", { style: { maxWidth: '100%', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '24px' }, children: [_jsx("h1", { style: { fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }, children: "Row Pinning Demo" }), _jsx("p", { style: { fontSize: '18px', color: '#4b5563', marginBottom: '16px' }, children: "Pin important rows to the top or bottom for easy access" }), _jsxs("div", { style: {
                                backgroundColor: '#dbeafe',
                                padding: '16px',
                                borderRadius: '6px',
                                marginBottom: '20px',
                                border: '1px solid #93c5fd'
                            }, children: [_jsx("h2", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1e40af' }, children: "\u2728 Key Features:" }), _jsxs("ul", { style: {
                                        listStyle: 'disc',
                                        paddingLeft: '20px',
                                        color: '#1e3a8a',
                                        lineHeight: '1.6'
                                    }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Sticky Positioning:" }), " Pinned rows stay visible during scroll"] }), _jsxs("li", { children: [_jsx("strong", { children: "Context Menu:" }), " Right-click any row to pin/unpin"] }), _jsxs("li", { children: [_jsx("strong", { children: "Works with Sorting:" }), " Pinned rows maintain position regardless of sort"] }), _jsxs("li", { children: [_jsx("strong", { children: "Works with Filtering:" }), " Pinned rows remain visible when filters are applied"] }), _jsxs("li", { children: [_jsx("strong", { children: "Virtual Scrolling:" }), " Pinned rows work seamlessly with virtual scrolling"] })] })] }), _jsxs("div", { style: {
                                backgroundColor: '#dcfce7',
                                padding: '16px',
                                borderRadius: '6px',
                                marginBottom: '20px',
                                border: '1px solid #86efac'
                            }, children: [_jsx("h2", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#166534' }, children: "\uD83C\uDFAF How to Use:" }), _jsxs("ul", { style: {
                                        listStyle: 'disc',
                                        paddingLeft: '20px',
                                        color: '#14532d',
                                        lineHeight: '1.6'
                                    }, children: [_jsx("li", { children: "Right-click on any row to open the context menu" }), _jsx("li", { children: "Select \"Pin Row to Top\" or \"Pin Row to Bottom\"" }), _jsx("li", { children: "Pinned rows will stay at the top/bottom even when scrolling" }), _jsx("li", { children: "Try sorting or filtering - pinned rows stay in place" }), _jsx("li", { children: "Right-click a pinned row and select \"Unpin Row\" to remove it" })] })] }), _jsx("div", { style: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }, children: _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }, children: [_jsx("input", { type: "checkbox", checked: virtualEnabled, onChange: (e) => setVirtualEnabled(e.target.checked), style: { width: '16px', height: '16px', cursor: 'pointer' } }), "Enable Virtual Scrolling (for large datasets)"] }) })] }), _jsx("div", { style: { marginBottom: '32px' }, children: _jsx(DataGrid, { columns: columns, rows: sampleData, pageSize: 20, rowPinConfig: rowPinConfig, virtualScrollConfig: virtualScrollConfig, contextMenuConfig: {
                            enabled: true,
                            showCopy: true,
                            showExport: true,
                            showColumnOptions: true,
                            showFilterByValue: true,
                        }, onCellEdit: (rowIndex, field, value) => {
                            console.log(`Cell edited: Row ${rowIndex}, Field "${field}", Value: "${value}"`);
                        } }) }), _jsxs("div", { style: { marginTop: '32px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "Row Pinning Features" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', fontSize: '14px', color: '#374151' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Pin to Top:" }), " Keep important rows visible at the top"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Pin to Bottom:" }), " Keep summary or total rows at the bottom"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Sticky Positioning:" }), " Pinned rows remain visible during scroll"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Sort Compatible:" }), " Works seamlessly with column sorting"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Filter Compatible:" }), " Pinned rows remain visible with filters"] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("span", { style: { color: '#16a34a', marginRight: '8px', fontSize: '14px' }, children: "\u2713" }), _jsxs("div", { children: [_jsx("strong", { children: "Virtual Scroll:" }), " Works with virtual scrolling for performance"] })] })] })] }), _jsxs("div", { style: { marginTop: '32px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "Implementation Examples" }), _jsx(CodeBlock, { title: "Basic Row Pinning Configuration", language: "tsx", code: `import { DataGrid} from './components/DataGrid';
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
/>` }), _jsx(CodeBlock, { title: "Row Pinning with Virtual Scrolling", language: "tsx", code: `const rowPinConfig: RowPinConfig = {
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
/>` }), _jsx(CodeBlock, { title: "Programmatic Row Pinning", language: "tsx", code: `// Pin rows programmatically using dispatch
const [state, dispatch] = useReducer(gridReducer, initialState);

// Pin a row to the top
dispatch({ type: 'PIN_ROW_TOP', payload: rowId });

// Pin a row to the bottom
dispatch({ type: 'PIN_ROW_BOTTOM', payload: rowId });

// Unpin a row
dispatch({ type: 'UNPIN_ROW', payload: rowId });` })] }), _jsxs("div", { style: { marginTop: '32px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "Common Use Cases" }), _jsxs("div", { style: { display: 'grid', gap: '16px', fontSize: '14px' }, children: [_jsxs("div", { style: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }, children: "\uD83D\uDCCA Financial Reports" }), _jsx("p", { style: { color: '#4b5563', lineHeight: '1.6' }, children: "Pin header rows (category totals) to the top and summary/total rows to the bottom while scrolling through detailed transaction data." })] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }, children: "\uD83D\uDCC8 Trading Dashboards" }), _jsx("p", { style: { color: '#4b5563', lineHeight: '1.6' }, children: "Keep your most important stocks or positions pinned at the top for quick monitoring while scrolling through a large watchlist." })] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }, children: "\uD83D\uDC65 Team Management" }), _jsx("p", { style: { color: '#4b5563', lineHeight: '1.6' }, children: "Pin team leads or VIP employees to the top for quick access while managing a large employee directory with sorting and filtering." })] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }, children: "\uD83D\uDCCB Task Management" }), _jsx("p", { style: { color: '#4b5563', lineHeight: '1.6' }, children: "Keep high-priority tasks pinned at the top and completed tasks at the bottom while sorting and filtering through your task list." })] })] })] }), _jsxs("div", { style: { marginTop: '32px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "How It Works" }), _jsxs("div", { style: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsxs("p", { style: { marginBottom: '12px', color: '#374151', lineHeight: '1.6' }, children: [_jsx("strong", { children: "Separation:" }), " Pinned rows are separated from regular rows after sorting and filtering. This ensures pinned rows always stay in their designated position."] }), _jsxs("p", { style: { marginBottom: '12px', color: '#374151', lineHeight: '1.6' }, children: [_jsx("strong", { children: "Sticky Positioning:" }), " Uses CSS sticky positioning to keep pinned rows visible at the top or bottom during scroll operations."] }), _jsxs("p", { style: { marginBottom: '12px', color: '#374151', lineHeight: '1.6' }, children: [_jsx("strong", { children: "Virtual Scrolling:" }), " When virtual scrolling is enabled, pinned rows are rendered outside the virtual scroller, ensuring they remain visible at all times."] }), _jsxs("p", { style: { color: '#374151', lineHeight: '1.6' }, children: [_jsx("strong", { children: "State Management:" }), " Pinned row IDs are stored in the grid state (pinnedRowsTop and pinnedRowsBottom arrays), making it easy to persist and restore."] })] })] })] }) }));
};
