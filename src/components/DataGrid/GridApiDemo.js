import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef, useState } from 'react';
import { DataGrid } from './DataGrid';
/**
 * Grid API Demo Component
 * Demonstrates how to use the GridApi ref to programmatically control the grid
 */
export const GridApiDemo = () => {
    const gridRef = useRef(null);
    const [logs, setLogs] = useState([]);
    const [isGridReady, setIsGridReady] = useState(false);
    const addLog = (message) => {
        setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
    };
    // onGridReady callback - called when grid API is initialized
    const handleGridReady = (_api) => {
        setIsGridReady(true);
        addLog('✅ Grid API is ready! You can now call API methods.');
    };
    // Sample data
    const [columns] = useState([
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', width: 150, sortable: true, filterable: true },
        { field: 'email', headerName: 'Email', width: 200, sortable: true, filterable: true },
        { field: 'role', headerName: 'Role', width: 120, sortable: true, filterable: true },
        { field: 'status', headerName: 'Status', width: 100, sortable: true, filterable: true },
        { field: 'score', headerName: 'Score', width: 100, sortable: true, filterable: true },
    ]);
    const [rows] = useState(() => {
        const roles = ['Admin', 'User', 'Manager'];
        const statuses = ['Active', 'Inactive', 'Pending'];
        const names = [
            'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson', 'Frank Miller', 'Grace Lee', 'Henry Ford',
            'Ivy Green', 'Jack Black', 'Karen White', 'Leo King', 'Mona Lisa', 'Nina Brown', 'Oscar Wilde', 'Paul Allen',
            'Quinn Fox', 'Rita Ora', 'Sam Hunt', 'Tina Fey', 'Uma Thurman', 'Victor Hugo', 'Wendy Wu', 'Xander Cage',
            'Yara Shahidi', 'Zane Grey'
        ];
        const rows = [];
        for (let i = 1; i <= 100; i++) {
            const name = names[i % names.length] + ' ' + i;
            rows.push({
                id: i,
                name,
                email: name.replace(/\s+/g, '').toLowerCase() + '@example.com',
                role: roles[i % roles.length],
                status: statuses[i % statuses.length],
                score: Math.floor(Math.random() * 100),
            });
        }
        return rows;
    });
    // Data operations
    const handleAddRow = () => {
        const api = gridRef.current;
        if (!api)
            return;
        const newRow = {
            id: Date.now(),
            name: `New User ${Math.floor(Math.random() * 1000)}`,
            email: `user${Date.now()}@example.com`,
            role: 'User',
            status: 'Pending',
            score: Math.floor(Math.random() * 100),
        };
        api.applyTransaction({ add: [newRow] });
        addLog(`Added new row: ${newRow.name}`);
    };
    const handleUpdateSelectedRows = () => {
        const api = gridRef.current;
        if (!api)
            return;
        const selectedRows = api.getSelectedRows();
        if (selectedRows.length === 0) {
            addLog('No rows selected');
            return;
        }
        const updates = selectedRows.map(row => ({
            ...row,
            score: Math.floor(Math.random() * 100),
        }));
        api.applyTransaction({ update: updates });
        addLog(`Updated ${updates.length} row(s)`);
    };
    const handleRemoveSelectedRows = () => {
        const api = gridRef.current;
        if (!api)
            return;
        const selectedRows = api.getSelectedRows();
        if (selectedRows.length === 0) {
            addLog('No rows selected');
            return;
        }
        api.applyTransaction({ remove: selectedRows });
        addLog(`Removed ${selectedRows.length} row(s)`);
    };
    // Column operations
    const handleHideColumn = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.setColumnVisible('email', false);
        addLog('Hidden Email column');
    };
    const handleShowColumn = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.setColumnVisible('email', true);
        addLog('Shown Email column');
    };
    const handlePinColumn = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.setColumnPinned('name', 'left');
        addLog('Pinned Name column to left');
    };
    const handleUnpinColumn = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.setColumnPinned('name', null);
        addLog('Unpinned Name column');
    };
    const handleAutoSizeColumns = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.autoSizeAllColumns();
        addLog('Auto-sized all columns');
    };
    const handleSizeColumnsToFit = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.sizeColumnsToFit();
        addLog('Resized columns to fit grid width');
    };
    // Filter & Sort operations
    const handleApplyFilter = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.setFilterModel({
            status: { type: 'equals', value: 'Active' },
        });
        addLog('Filtered by Status = Active');
    };
    const handleClearFilters = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.clearAllFilters();
        addLog('Cleared all filters');
    };
    const handleApplySort = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.setSortModel([{ field: 'score', direction: 'desc' }]);
        addLog('Sorted by Score descending');
    };
    const handleClearSort = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.clearAllSorting();
        addLog('Cleared sorting');
    };
    // Selection operations
    const handleSelectAll = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.selectAll();
        addLog('Selected all rows');
    };
    const handleDeselectAll = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.deselectAll();
        addLog('Deselected all rows');
    };
    const handleSelectFiltered = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.selectAllFiltered();
        addLog('Selected all filtered rows');
    };
    const handleGetSelection = () => {
        const api = gridRef.current;
        if (!api)
            return;
        const selectedRows = api.getSelectedRows();
        addLog(`Selected ${selectedRows.length} row(s)`);
    };
    // Export operations
    const handleExportCSV = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.exportDataAsCsv({
            fileName: 'grid-export',
            onlySelected: false,
            onlyFiltered: true,
        });
        addLog('Exported to CSV');
    };
    const handleCopyToClipboard = () => {
        const api = gridRef.current;
        if (!api)
            return;
        const selectedCount = api.getSelectedRowCount();
        if (selectedCount === 0) {
            addLog('⚠️ No rows selected! Please select rows first.');
            return;
        }
        api.copySelectedRowsToClipboard();
        addLog(`✓ Copied ${selectedCount} selected row(s) to clipboard`);
    };
    // Navigation operations
    const handleScrollToRow = () => {
        const api = gridRef.current;
        if (!api)
            return;
        // Get current page info
        const currentPage = api.paginationGetCurrentPage();
        const pageSize = api.paginationGetPageSize();
        // Calculate the middle row index of the current page
        const pageStartIndex = currentPage * pageSize;
        const rowsOnPage = Math.min(pageSize, api.getDisplayedRowCount() - pageStartIndex);
        const middleIndex = Math.floor(rowsOnPage / 2);
        api.ensureIndexVisible(middleIndex, 'middle');
        addLog(`Scrolled to row ${middleIndex} (middle of page ${currentPage + 1})`);
    };
    const handleFocusCell = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.setFocusedCell(2, 'name');
        addLog('Focused cell at row 2, column Name');
    };
    // Pagination operations
    const handleNextPage = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.paginationGoToNextPage();
        const currentPage = api.paginationGetCurrentPage();
        addLog(`Navigated to page ${currentPage + 1}`);
    };
    const handlePreviousPage = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.paginationGoToPreviousPage();
        const currentPage = api.paginationGetCurrentPage();
        addLog(`Navigated to page ${currentPage + 1}`);
    };
    const handleSetPageSize = () => {
        const api = gridRef.current;
        if (!api)
            return;
        api.paginationSetPageSize(20);
        addLog('Set page size to 20');
    };
    // Info operations
    const handleGetInfo = () => {
        const api = gridRef.current;
        if (!api)
            return;
        const totalRows = api.getDisplayedRowCount();
        const selectedCount = api.getSelectedRowCount();
        const hasFilters = api.isAnyFilterPresent();
        const currentPage = api.paginationGetCurrentPage();
        const totalPages = api.paginationGetTotalPages();
        addLog(`Rows: ${totalRows}, Selected: ${selectedCount}, Filters: ${hasFilters}, Page: ${currentPage + 1}/${totalPages}`);
    };
    return (_jsxs("div", { style: { padding: '20px', maxWidth: '1400px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h2", { children: "Grid API Demo" }), _jsx("p", { style: { color: '#666' }, children: "Demonstrates programmatic control of the DataGrid using the GridApi ref (AG Grid-inspired API)" })] }), _jsxs("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                }, children: [_jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }, children: "Data Operations" }), _jsx("button", { onClick: handleAddRow, style: buttonStyle, children: "Add Row" }), _jsx("button", { onClick: handleUpdateSelectedRows, style: buttonStyle, children: "Update Selected" }), _jsx("button", { onClick: handleRemoveSelectedRows, style: buttonStyle, children: "Remove Selected" })] }), _jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }, children: "Column Operations" }), _jsx("button", { onClick: handleHideColumn, style: buttonStyle, children: "Hide Email" }), _jsx("button", { onClick: handleShowColumn, style: buttonStyle, children: "Show Email" }), _jsx("button", { onClick: handlePinColumn, style: buttonStyle, children: "Pin Name" }), _jsx("button", { onClick: handleUnpinColumn, style: buttonStyle, children: "Unpin Name" }), _jsx("button", { onClick: handleAutoSizeColumns, style: buttonStyle, children: "Auto-size Columns" }), _jsx("button", { onClick: handleSizeColumnsToFit, style: buttonStyle, children: "Fit to Width" })] }), _jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }, children: "Filter & Sort" }), _jsx("button", { onClick: handleApplyFilter, style: buttonStyle, children: "Filter Active" }), _jsx("button", { onClick: handleClearFilters, style: buttonStyle, children: "Clear Filters" }), _jsx("button", { onClick: handleApplySort, style: buttonStyle, children: "Sort by Score" }), _jsx("button", { onClick: handleClearSort, style: buttonStyle, children: "Clear Sort" })] }), _jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }, children: "Selection" }), _jsx("button", { onClick: handleSelectAll, style: buttonStyle, children: "Select All" }), _jsx("button", { onClick: handleDeselectAll, style: buttonStyle, children: "Deselect All" }), _jsx("button", { onClick: handleSelectFiltered, style: buttonStyle, children: "Select Filtered" }), _jsx("button", { onClick: handleGetSelection, style: buttonStyle, children: "Get Selection" })] }), _jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }, children: "Export & Clipboard" }), _jsx("button", { onClick: handleExportCSV, style: buttonStyle, children: "Export CSV" }), _jsx("button", { onClick: handleCopyToClipboard, style: buttonStyle, children: "Copy to Clipboard" })] }), _jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }, children: "Navigation" }), _jsx("button", { onClick: handleScrollToRow, style: buttonStyle, children: "Scroll to Middle" }), _jsx("button", { onClick: handleFocusCell, style: buttonStyle, children: "Focus Cell" }), _jsx("button", { onClick: handleNextPage, style: buttonStyle, children: "Next Page" }), _jsx("button", { onClick: handlePreviousPage, style: buttonStyle, children: "Previous Page" }), _jsx("button", { onClick: handleSetPageSize, style: buttonStyle, children: "Page Size: 20" })] }), _jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }, children: "Info" }), _jsx("button", { onClick: handleGetInfo, style: buttonStyle, children: "Get Grid Info" })] })] }), _jsxs("div", { style: {
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    height: '120px',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                }, children: [_jsx("div", { style: { fontWeight: '600', marginBottom: '5px' }, children: "Activity Log:" }), logs.length === 0 ? (_jsx("div", { style: { color: '#999' }, children: "No actions yet. Click buttons above to interact with the grid." })) : (logs.map((log, i) => (_jsx("div", { style: { padding: '2px 0' }, children: log }, i))))] }), _jsxs("div", { style: { marginBottom: '10px', padding: '10px', backgroundColor: isGridReady ? '#d4edda' : '#f8d7da', borderRadius: '4px', border: `1px solid ${isGridReady ? '#c3e6cb' : '#f5c6cb'}` }, children: [_jsx("strong", { children: "Grid Status:" }), " ", isGridReady ? '✅ Ready' : '⏳ Initializing...'] }), _jsx(DataGrid, { ref: gridRef, columns: columns, rows: rows, pageSize: 10, theme: "quartz", densityMode: "normal", showDensityToggle: true, onGridReady: handleGridReady, onSelectionChange: (selectedIds) => {
                    addLog(`Selection changed: ${selectedIds.length} row(s)`);
                } }), _jsxs("div", { style: { marginTop: '30px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "\uD83D\uDCD8 Using onGridReady Event" }), _jsxs("p", { style: { fontSize: '14px', lineHeight: '1.6' }, children: ["The ", _jsx("code", { children: "onGridReady" }), " callback is fired when the grid API is fully initialized and ready to use. This is similar to AG-Grid's ", _jsx("code", { children: "onGridReady" }), " event."] }), _jsx("pre", { style: { backgroundColor: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto', fontSize: '13px' }, children: `// Example usage
const MyComponent = () => {
  const gridRef = useRef<GridApi>(null);

  const handleGridReady = (api: GridApi) => {
    // Grid is ready - now you can safely call API methods
    api.sizeColumnsToFit();
    api.setFilterModel({ name: { value: 'John' } });
  };

  return (
    <DataGrid
      ref={gridRef}
      columns={columns}
      rows={rows}
      onGridReady={handleGridReady}  // ✅ Called when API is ready
    />
  );
};` })] }), _jsxs("div", { style: {
                    marginTop: '30px',
                    padding: '24px',
                    background: 'linear-gradient(to bottom right, #ffffff, #f9fafb)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }, children: [_jsxs("h3", { style: {
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            color: '#111827',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }, children: [_jsx("span", { style: {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: '#3b82f6',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '18px'
                                }, children: "\u26A1" }), "Grid API Methods Available"] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }, children: [_jsxs("div", { style: {
                                    padding: '16px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }, children: [_jsxs("h4", { style: {
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#3b82f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }, children: [_jsx("span", { children: "\uD83D\uDCCA" }), " Data & Model"] }), _jsxs("ul", { style: { fontSize: '13px', lineHeight: '1.8', listStyle: 'none', padding: 0, margin: 0 }, children: [_jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#10b981', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "setRowData(rows)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#10b981', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "applyTransaction(tx)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#10b981', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "getModel()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#10b981', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "getDisplayedRowCount()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#10b981', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "forEachNode(callback)" })] })] })] }), _jsxs("div", { style: {
                                    padding: '16px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }, children: [_jsxs("h4", { style: {
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#8b5cf6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }, children: [_jsx("span", { children: "\uD83D\uDCCB" }), " Columns"] }), _jsxs("ul", { style: { fontSize: '13px', lineHeight: '1.8', listStyle: 'none', padding: 0, margin: 0 }, children: [_jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#8b5cf6', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "getColumnDefs()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#8b5cf6', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "setColumnVisible(key, visible)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#8b5cf6', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "setColumnPinned(key, pinned)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#8b5cf6', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "autoSizeColumns(keys?)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#8b5cf6', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "sizeColumnsToFit()" })] })] })] }), _jsxs("div", { style: {
                                    padding: '16px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }, children: [_jsxs("h4", { style: {
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#f59e0b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }, children: [_jsx("span", { children: "\uD83D\uDD0D" }), " Filtering & Sorting"] }), _jsxs("ul", { style: { fontSize: '13px', lineHeight: '1.8', listStyle: 'none', padding: 0, margin: 0 }, children: [_jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#f59e0b', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "getFilterModel()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#f59e0b', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "setFilterModel(model)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#f59e0b', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "getSortModel()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#f59e0b', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "setSortModel(model)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#f59e0b', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "clearAllFilters()" })] })] })] }), _jsxs("div", { style: {
                                    padding: '16px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }, children: [_jsxs("h4", { style: {
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#ec4899',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }, children: [_jsx("span", { children: "\u2705" }), " Selection"] }), _jsxs("ul", { style: { fontSize: '13px', lineHeight: '1.8', listStyle: 'none', padding: 0, margin: 0 }, children: [_jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#ec4899', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "getSelectedRows()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#ec4899', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "selectAll()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#ec4899', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "deselectAll()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#ec4899', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "selectAllFiltered()" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#ec4899', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "getSelectedRowCount()" })] })] })] }), _jsxs("div", { style: {
                                    padding: '16px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }, children: [_jsxs("h4", { style: {
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#14b8a6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }, children: [_jsx("span", { children: "\uD83E\uDDED" }), " Navigation"] }), _jsxs("ul", { style: { fontSize: '13px', lineHeight: '1.8', listStyle: 'none', padding: 0, margin: 0 }, children: [_jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#14b8a6', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "ensureIndexVisible(index)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#14b8a6', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "setFocusedCell(row, col)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#14b8a6', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "clearFocusedCell()" })] })] })] }), _jsxs("div", { style: {
                                    padding: '16px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }, children: [_jsxs("h4", { style: {
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            color: '#06b6d4',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }, children: [_jsx("span", { children: "\uD83D\uDCE4" }), " Export"] }), _jsxs("ul", { style: { fontSize: '13px', lineHeight: '1.8', listStyle: 'none', padding: 0, margin: 0 }, children: [_jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#06b6d4', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "exportDataAsCsv(params?)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#06b6d4', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "getDataAsCsv(params?)" })] }), _jsxs("li", { style: { padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: '#06b6d4', fontSize: '10px' }, children: "\u25CF" }), _jsx("code", { style: { backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }, children: "copySelectedRowsToClipboard()" })] })] })] })] })] })] }));
};
const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '6px 12px',
    marginBottom: '6px',
    fontSize: '13px',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
};
