import React, { useRef, useState } from 'react';
import { DataGrid } from './DataGrid';
import type { GridApi, Column, Row } from './index';

/**
 * Grid API Demo Component
 * Demonstrates how to use the GridApi ref to programmatically control the grid
 */
export const GridApiDemo: React.FC = () => {
  const gridRef = useRef<GridApi>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isGridReady, setIsGridReady] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // onGridReady callback - called when grid API is initialized
  const handleGridReady = (_api: GridApi) => {
    setIsGridReady(true);
    addLog('✅ Grid API is ready! You can now call API methods.');
  };

  // Sample data
  const [columns] = useState<Column[]>([
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150, sortable: true, filterable: true },
    { field: 'email', headerName: 'Email', width: 200, sortable: true, filterable: true },
    { field: 'role', headerName: 'Role', width: 120, sortable: true, filterable: true },
    { field: 'status', headerName: 'Status', width: 100, sortable: true, filterable: true },
    { field: 'score', headerName: 'Score', width: 100, sortable: true, filterable: true },
  ]);

  const [rows] = useState<Row[]>(() => {
    const roles = ['Admin', 'User', 'Manager'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    const names = [
      'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson', 'Frank Miller', 'Grace Lee', 'Henry Ford',
      'Ivy Green', 'Jack Black', 'Karen White', 'Leo King', 'Mona Lisa', 'Nina Brown', 'Oscar Wilde', 'Paul Allen',
      'Quinn Fox', 'Rita Ora', 'Sam Hunt', 'Tina Fey', 'Uma Thurman', 'Victor Hugo', 'Wendy Wu', 'Xander Cage',
      'Yara Shahidi', 'Zane Grey'
    ];
    const rows: Row[] = [];
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
    if (!api) return;

    const newRow: Row = {
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
    if (!api) return;

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
    if (!api) return;

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
    if (!api) return;

    api.setColumnVisible('email', false);
    addLog('Hidden Email column');
  };

  const handleShowColumn = () => {
    const api = gridRef.current;
    if (!api) return;

    api.setColumnVisible('email', true);
    addLog('Shown Email column');
  };

  const handlePinColumn = () => {
    const api = gridRef.current;
    if (!api) return;

    api.setColumnPinned('name', 'left');
    addLog('Pinned Name column to left');
  };

  const handleUnpinColumn = () => {
    const api = gridRef.current;
    if (!api) return;

    api.setColumnPinned('name', null);
    addLog('Unpinned Name column');
  };

  const handleAutoSizeColumns = () => {
    const api = gridRef.current;
    if (!api) return;

    api.autoSizeAllColumns();
    addLog('Auto-sized all columns');
  };

  const handleSizeColumnsToFit = () => {
    const api = gridRef.current;
    if (!api) return;

    api.sizeColumnsToFit();
    addLog('Resized columns to fit grid width');
  };

  // Filter & Sort operations
  const handleApplyFilter = () => {
    const api = gridRef.current;
    if (!api) return;

    api.setFilterModel({
      status: { type: 'equals', value: 'Active' },
    });
    addLog('Filtered by Status = Active');
  };

  const handleClearFilters = () => {
    const api = gridRef.current;
    if (!api) return;

    api.clearAllFilters();
    addLog('Cleared all filters');
  };

  const handleApplySort = () => {
    const api = gridRef.current;
    if (!api) return;

    api.setSortModel([{ field: 'score', direction: 'desc' }]);
    addLog('Sorted by Score descending');
  };

  const handleClearSort = () => {
    const api = gridRef.current;
    if (!api) return;

    api.clearAllSorting();
    addLog('Cleared sorting');
  };

  // Selection operations
  const handleSelectAll = () => {
    const api = gridRef.current;
    if (!api) return;

    api.selectAll();
    addLog('Selected all rows');
  };

  const handleDeselectAll = () => {
    const api = gridRef.current;
    if (!api) return;

    api.deselectAll();
    addLog('Deselected all rows');
  };

  const handleSelectFiltered = () => {
    const api = gridRef.current;
    if (!api) return;

    api.selectAllFiltered();
    addLog('Selected all filtered rows');
  };

  const handleGetSelection = () => {
    const api = gridRef.current;
    if (!api) return;

    const selectedRows = api.getSelectedRows();
    addLog(`Selected ${selectedRows.length} row(s)`);
  };

  // Export operations
  const handleExportCSV = () => {
    const api = gridRef.current;
    if (!api) return;

    api.exportDataAsCsv({
      fileName: 'grid-export',
      onlySelected: false,
      onlyFiltered: true,
    });
    addLog('Exported to CSV');
  };

  const handleCopyToClipboard = () => {
    const api = gridRef.current;
    if (!api) return;

    api.copySelectedRowsToClipboard();
    addLog('Copied selected rows to clipboard');
  };

  // Navigation operations
  const handleScrollToRow = () => {
    const api = gridRef.current;
    if (!api) return;

    const rowCount = api.getDisplayedRowCount();
    const middleIndex = Math.floor(rowCount / 2);
    api.ensureIndexVisible(middleIndex, 'middle');
    addLog(`Scrolled to row ${middleIndex}`);
  };

  const handleFocusCell = () => {
    const api = gridRef.current;
    if (!api) return;

    api.setFocusedCell(2, 'name');
    addLog('Focused cell at row 2, column Name');
  };

  // Pagination operations
  const handleNextPage = () => {
    const api = gridRef.current;
    if (!api) return;

    api.paginationGoToNextPage();
    const currentPage = api.paginationGetCurrentPage();
    addLog(`Navigated to page ${currentPage + 1}`);
  };

  const handlePreviousPage = () => {
    const api = gridRef.current;
    if (!api) return;

    api.paginationGoToPreviousPage();
    const currentPage = api.paginationGetCurrentPage();
    addLog(`Navigated to page ${currentPage + 1}`);
  };

  const handleSetPageSize = () => {
    const api = gridRef.current;
    if (!api) return;

    api.paginationSetPageSize(20);
    addLog('Set page size to 20');
  };

  // Info operations
  const handleGetInfo = () => {
    const api = gridRef.current;
    if (!api) return;

    const totalRows = api.getDisplayedRowCount();
    const selectedCount = api.getSelectedRowCount();
    const hasFilters = api.isAnyFilterPresent();
    const currentPage = api.paginationGetCurrentPage();
    const totalPages = api.paginationGetTotalPages();

    addLog(`Rows: ${totalRows}, Selected: ${selectedCount}, Filters: ${hasFilters}, Page: ${currentPage + 1}/${totalPages}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Grid API Demo</h2>
        <p style={{ color: '#666' }}>
          Demonstrates programmatic control of the DataGrid using the GridApi ref (AG Grid-inspired API)
        </p>
      </div>

      {/* Control Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}>
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Data Operations</h4>
          <button onClick={handleAddRow} style={buttonStyle}>Add Row</button>
          <button onClick={handleUpdateSelectedRows} style={buttonStyle}>Update Selected</button>
          <button onClick={handleRemoveSelectedRows} style={buttonStyle}>Remove Selected</button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Column Operations</h4>
          <button onClick={handleHideColumn} style={buttonStyle}>Hide Email</button>
          <button onClick={handleShowColumn} style={buttonStyle}>Show Email</button>
          <button onClick={handlePinColumn} style={buttonStyle}>Pin Name</button>
          <button onClick={handleUnpinColumn} style={buttonStyle}>Unpin Name</button>
          <button onClick={handleAutoSizeColumns} style={buttonStyle}>Auto-size Columns</button>
          <button onClick={handleSizeColumnsToFit} style={buttonStyle}>Fit to Width</button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Filter & Sort</h4>
          <button onClick={handleApplyFilter} style={buttonStyle}>Filter Active</button>
          <button onClick={handleClearFilters} style={buttonStyle}>Clear Filters</button>
          <button onClick={handleApplySort} style={buttonStyle}>Sort by Score</button>
          <button onClick={handleClearSort} style={buttonStyle}>Clear Sort</button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Selection</h4>
          <button onClick={handleSelectAll} style={buttonStyle}>Select All</button>
          <button onClick={handleDeselectAll} style={buttonStyle}>Deselect All</button>
          <button onClick={handleSelectFiltered} style={buttonStyle}>Select Filtered</button>
          <button onClick={handleGetSelection} style={buttonStyle}>Get Selection</button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Export & Clipboard</h4>
          <button onClick={handleExportCSV} style={buttonStyle}>Export CSV</button>
          <button onClick={handleCopyToClipboard} style={buttonStyle}>Copy to Clipboard</button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Navigation</h4>
          <button onClick={handleScrollToRow} style={buttonStyle}>Scroll to Middle</button>
          <button onClick={handleFocusCell} style={buttonStyle}>Focus Cell</button>
          <button onClick={handleNextPage} style={buttonStyle}>Next Page</button>
          <button onClick={handlePreviousPage} style={buttonStyle}>Previous Page</button>
          <button onClick={handleSetPageSize} style={buttonStyle}>Page Size: 20</button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Info</h4>
          <button onClick={handleGetInfo} style={buttonStyle}>Get Grid Info</button>
        </div>
      </div>

      {/* Activity Log */}
      <div style={{
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        border: '1px solid #ddd',
        height: '120px',
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '12px',
      }}>
        <div style={{ fontWeight: '600', marginBottom: '5px' }}>Activity Log:</div>
        {logs.length === 0 ? (
          <div style={{ color: '#999' }}>No actions yet. Click buttons above to interact with the grid.</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ padding: '2px 0' }}>{log}</div>
          ))
        )}
      </div>

      {/* DataGrid with API ref */}
      <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: isGridReady ? '#d4edda' : '#f8d7da', borderRadius: '4px', border: `1px solid ${isGridReady ? '#c3e6cb' : '#f5c6cb'}` }}>
        <strong>Grid Status:</strong> {isGridReady ? '✅ Ready' : '⏳ Initializing...'}
      </div>
      <DataGrid
        ref={gridRef}
        columns={columns}
        rows={rows}
        pageSize={10}
        theme="quartz"
        densityMode="normal"
        showDensityToggle
        onGridReady={handleGridReady}
        onSelectionChange={(selectedIds) => {
          addLog(`Selection changed: ${selectedIds.length} row(s)`);
        }}
      />

      {/* API Documentation */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>📘 Using onGridReady Event</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
          The <code>onGridReady</code> callback is fired when the grid API is fully initialized and ready to use. 
          This is similar to AG-Grid's <code>onGridReady</code> event.
        </p>
        <pre style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto', fontSize: '13px' }}>
{`// Example usage
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
};`}</pre>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Grid API Methods Available</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          <div>
            <h4>Data & Model</h4>
            <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <li><code>setRowData(rows)</code></li>
              <li><code>applyTransaction(tx)</code></li>
              <li><code>getModel()</code></li>
              <li><code>getDisplayedRowCount()</code></li>
              <li><code>forEachNode(callback)</code></li>
            </ul>
          </div>
          <div>
            <h4>Columns</h4>
            <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <li><code>getColumnDefs()</code></li>
              <li><code>setColumnVisible(key, visible)</code></li>
              <li><code>setColumnPinned(key, pinned)</code></li>
              <li><code>autoSizeColumns(keys?)</code></li>
              <li><code>sizeColumnsToFit()</code></li>
            </ul>
          </div>
          <div>
            <h4>Filtering & Sorting</h4>
            <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <li><code>getFilterModel()</code></li>
              <li><code>setFilterModel(model)</code></li>
              <li><code>getSortModel()</code></li>
              <li><code>setSortModel(model)</code></li>
              <li><code>clearAllFilters()</code></li>
            </ul>
          </div>
          <div>
            <h4>Selection</h4>
            <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <li><code>getSelectedRows()</code></li>
              <li><code>selectAll()</code></li>
              <li><code>deselectAll()</code></li>
              <li><code>selectAllFiltered()</code></li>
              <li><code>getSelectedRowCount()</code></li>
            </ul>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <li><code>ensureIndexVisible(index)</code></li>
              <li><code>setFocusedCell(row, col)</code></li>
              <li><code>clearFocusedCell()</code></li>
            </ul>
          </div>
          <div>
            <h4>Export</h4>
            <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <li><code>exportDataAsCsv(params?)</code></li>
              <li><code>getDataAsCsv(params?)</code></li>
              <li><code>copySelectedRowsToClipboard()</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
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
