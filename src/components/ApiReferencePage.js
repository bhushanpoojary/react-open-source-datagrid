import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const ApiReferencePage = () => {
    return (_jsxs("div", { style: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }, children: [_jsxs("div", { style: { marginBottom: '40px' }, children: [_jsx("h1", { style: {
                            fontSize: '36px',
                            fontWeight: '700',
                            marginBottom: '12px',
                            color: '#1e293b'
                        }, children: "Grid API Reference" }), _jsx("p", { style: {
                            fontSize: '18px',
                            color: '#64748b',
                            lineHeight: '1.6'
                        }, children: "Complete programmatic control over the DataGrid using React refs" })] }), _jsxs("section", { style: {
                    marginBottom: '48px',
                    padding: '24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                }, children: [_jsx("h2", { style: {
                            fontSize: '24px',
                            fontWeight: '600',
                            marginBottom: '16px',
                            color: '#1e293b'
                        }, children: "Quick Start" }), _jsx("pre", { style: {
                            backgroundColor: '#1e293b',
                            color: '#e2e8f0',
                            padding: '20px',
                            borderRadius: '6px',
                            overflow: 'auto',
                            fontSize: '14px',
                            lineHeight: '1.6'
                        }, children: `import React, { useRef } from 'react';
import { DataGrid, GridApi } from './components/DataGrid';

function MyComponent() {
  const gridRef = useRef<GridApi>(null);

  const handleExport = () => {
    gridRef.current?.exportDataAsCsv({ fileName: 'my-data' });
  };

  return (
    <>
      <button onClick={handleExport}>Export CSV</button>
      <DataGrid ref={gridRef} columns={columns} rows={rows} />
    </>
  );
}` })] }), _jsxs("section", { style: { marginBottom: '48px' }, children: [_jsx("h2", { style: {
                            fontSize: '28px',
                            fontWeight: '600',
                            marginBottom: '24px',
                            color: '#1e293b'
                        }, children: "API Categories" }), _jsx("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '20px'
                        }, children: apiCategories.map((category) => (_jsxs("div", { style: {
                                padding: '20px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                            }, children: [_jsx("div", { style: {
                                        fontSize: '24px',
                                        marginBottom: '12px'
                                    }, children: category.icon }), _jsx("h3", { style: {
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '8px',
                                        color: '#1e293b'
                                    }, children: category.name }), _jsx("p", { style: {
                                        fontSize: '14px',
                                        color: '#64748b',
                                        marginBottom: '12px',
                                        lineHeight: '1.5'
                                    }, children: category.description }), _jsxs("div", { style: {
                                        fontSize: '13px',
                                        color: '#94a3b8',
                                        fontWeight: '500'
                                    }, children: [category.count, " methods"] })] }, category.name))) })] }), _jsxs("section", { style: { marginBottom: '48px' }, children: [_jsx("h2", { style: {
                            fontSize: '28px',
                            fontWeight: '600',
                            marginBottom: '24px',
                            color: '#1e293b'
                        }, children: "Common Operations" }), commonOperations.map((operation) => (_jsxs("div", { style: {
                            marginBottom: '32px',
                            padding: '24px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }, children: [_jsx("h3", { style: {
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    marginBottom: '12px',
                                    color: '#1e293b'
                                }, children: operation.title }), _jsx("p", { style: {
                                    fontSize: '14px',
                                    color: '#64748b',
                                    marginBottom: '16px',
                                    lineHeight: '1.6'
                                }, children: operation.description }), _jsx("pre", { style: {
                                    backgroundColor: '#f8fafc',
                                    padding: '16px',
                                    borderRadius: '6px',
                                    overflow: 'auto',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    border: '1px solid #e2e8f0'
                                }, children: _jsx("code", { children: operation.code }) })] }, operation.title)))] }), _jsxs("section", { children: [_jsx("h2", { style: {
                            fontSize: '28px',
                            fontWeight: '600',
                            marginBottom: '24px',
                            color: '#1e293b'
                        }, children: "Full Documentation" }), _jsx("div", { style: {
                            display: 'grid',
                            gap: '16px'
                        }, children: docLinks.map((link) => (_jsxs("a", { href: link.url, target: "_blank", rel: "noopener noreferrer", style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '20px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'all 0.2s'
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.backgroundColor = 'white';
                            }, children: [_jsx("div", { style: { fontSize: '32px' }, children: link.icon }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h3", { style: {
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                marginBottom: '4px',
                                                color: '#1e293b'
                                            }, children: link.title }), _jsx("p", { style: {
                                                fontSize: '14px',
                                                color: '#64748b',
                                                lineHeight: '1.5'
                                            }, children: link.description })] }), _jsx("svg", { style: { width: '20px', height: '20px', color: '#94a3b8' }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] }, link.title))) })] })] }));
};
const apiCategories = [
    {
        name: 'Data & Model',
        icon: '📊',
        description: 'Row data management, transactions, and iteration methods',
        count: 12
    },
    {
        name: 'Columns',
        icon: '📋',
        description: 'Visibility, pinning, sizing, reordering, and state persistence',
        count: 20
    },
    {
        name: 'Filtering & Sorting',
        icon: '🔍',
        description: 'Filter and sort model management',
        count: 12
    },
    {
        name: 'Selection',
        icon: '✅',
        description: 'Row selection operations and queries',
        count: 7
    },
    {
        name: 'Navigation',
        icon: '🧭',
        description: 'Scrolling, cell focus, and keyboard navigation',
        count: 6
    },
    {
        name: 'Editing',
        icon: '✏️',
        description: 'Cell editing control and state',
        count: 3
    },
    {
        name: 'Export',
        icon: '📤',
        description: 'CSV export and clipboard operations',
        count: 5
    },
    {
        name: 'Pagination',
        icon: '📑',
        description: 'Page navigation and sizing',
        count: 7
    },
    {
        name: 'Layout',
        icon: '💾',
        description: 'Save and restore grid layouts',
        count: 4
    }
];
const commonOperations = [
    {
        title: 'Add, Update, Remove Rows',
        description: 'Efficiently modify grid data using transactions',
        code: `// Add rows
gridRef.current.applyTransaction({ add: [newRow] });

// Update rows
gridRef.current.applyTransaction({ update: [updatedRow] });

// Remove rows
gridRef.current.applyTransaction({ remove: [rowToDelete] });`
    },
    {
        title: 'Column Visibility & Pinning',
        description: 'Control column visibility and pin columns to left or right',
        code: `// Hide column
gridRef.current.setColumnVisible('email', false);

// Pin column to left
gridRef.current.setColumnPinned('name', 'left');

// Auto-size columns
gridRef.current.autoSizeAllColumns();`
    },
    {
        title: 'Filter & Sort Data',
        description: 'Apply filters and sorting programmatically',
        code: `// Apply filter
gridRef.current.setFilterModel({
  status: { type: 'equals', value: 'Active' }
});

// Apply sort
gridRef.current.setSortModel([
  { field: 'name', direction: 'asc' }
]);`
    },
    {
        title: 'Selection Management',
        description: 'Select rows and retrieve selected data',
        code: `// Select all rows
gridRef.current.selectAll();

// Get selected rows
const selected = gridRef.current.getSelectedRows();

// Select filtered rows only
gridRef.current.selectAllFiltered();`
    },
    {
        title: 'Export Data',
        description: 'Export grid data to CSV with options',
        code: `// Export to CSV
gridRef.current.exportDataAsCsv({
  fileName: 'data-export',
  onlySelected: true,
  onlyFiltered: true
});

// Copy to clipboard
gridRef.current.copySelectedRowsToClipboard();`
    }
];
const docLinks = [
    {
        title: 'Complete API Reference',
        icon: '📖',
        description: 'Full documentation with all 100+ methods, examples, and type definitions',
        url: '#' // This would link to the full markdown docs
    },
    {
        title: 'Quick Reference Guide',
        icon: '⚡',
        description: 'Quick lookup for common operations and copy-paste examples',
        url: '#'
    },
    {
        title: 'Implementation Summary',
        icon: '🏗️',
        description: 'Technical overview of architecture and what was built',
        url: '#'
    }
];
