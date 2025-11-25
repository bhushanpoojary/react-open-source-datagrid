import React, { useState } from 'react';

export const CompleteApiReferencePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📖' },
    { id: 'data', title: 'Data & Model', icon: '📊' },
    { id: 'columns', title: 'Columns', icon: '📋' },
    { id: 'filtering', title: 'Filtering & Sorting', icon: '🔍' },
    { id: 'selection', title: 'Selection', icon: '✅' },
    { id: 'navigation', title: 'Navigation & Focus', icon: '🧭' },
    { id: 'editing', title: 'Editing', icon: '✏️' },
    { id: 'rendering', title: 'Rendering', icon: '🔄' },
    { id: 'export', title: 'Export & Clipboard', icon: '📤' },
    { id: 'pagination', title: 'Pagination', icon: '📑' },
    { id: 'grouping', title: 'Grouping & Tree', icon: '🌳' },
    { id: 'layout', title: 'Layout Persistence', icon: '💾' },
    { id: 'overlays', title: 'Overlays', icon: '🔧' },
    { id: 'events', title: 'Events', icon: '🎯' },
    { id: 'lifecycle', title: 'Lifecycle', icon: '🗑️' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#ffffff' }}>
      {/* Table of Contents Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        overflow: 'auto',
        flexShrink: 0
      }}>
        <div style={{ padding: '24px 20px' }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '16px'
          }}>
            Contents
          </h3>
          <nav>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  fontSize: '14px',
                  backgroundColor: activeSection === section.id ? '#eff6ff' : 'transparent',
                  color: activeSection === section.id ? '#2563eb' : '#475569',
                  border: 'none',
                  borderLeft: activeSection === section.id ? '3px solid #2563eb' : '3px solid transparent',
                  borderRadius: '0 6px 6px 0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontWeight: activeSection === section.id ? '600' : '500'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '18px' }}>{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        overflow: 'auto',
        padding: '40px 60px',
        maxWidth: '1200px'
      }}>
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'data' && <DataSection />}
        {activeSection === 'columns' && <ColumnsSection />}
        {activeSection === 'filtering' && <FilteringSection />}
        {activeSection === 'selection' && <SelectionSection />}
        {activeSection === 'navigation' && <NavigationSection />}
        {activeSection === 'editing' && <EditingSection />}
        {activeSection === 'rendering' && <RenderingSection />}
        {activeSection === 'export' && <ExportSection />}
        {activeSection === 'pagination' && <PaginationSection />}
        {activeSection === 'grouping' && <GroupingSection />}
        {activeSection === 'layout' && <LayoutSection />}
        {activeSection === 'overlays' && <OverlaysSection />}
        {activeSection === 'events' && <EventsSection />}
        {activeSection === 'lifecycle' && <LifecycleSection />}
      </main>
    </div>
  );
};

// Section Components
const OverviewSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      Grid API Reference
    </h1>
    <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      The DataGrid component exposes a comprehensive Grid API inspired by AG Grid, providing programmatic control over grid functionality via React refs.
    </p>

    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f0f9ff', 
      borderLeft: '4px solid #3b82f6',
      borderRadius: '6px',
      marginBottom: '32px'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1e40af' }}>
        Quick Start
      </h3>
      <CodeBlock code={`import React, { useRef } from 'react';
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
}`} />
    </div>

    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
      API Categories
    </h2>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
      The Grid API is organized into 15 categories with over 100 methods:
    </p>

    <div style={{ display: 'grid', gap: '16px' }}>
      {apiOverview.map(category => (
        <div key={category.name} style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'start',
          gap: '16px'
        }}>
          <div style={{ fontSize: '32px' }}>{category.icon}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
              {category.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', lineHeight: '1.5' }}>
              {category.description}
            </p>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
              {category.count} methods
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DataSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      📊 Data & Model Operations
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Methods for managing row data, applying transactions, and iterating through grid data.
    </p>

    <ApiMethod
      name="setRowData"
      signature="setRowData(rows: Row[]): void"
      description="Replace all row data in the grid."
      example={`gridRef.current.setRowData(newRows);`}
    />

    <ApiMethod
      name="applyTransaction"
      signature="applyTransaction(transaction: RowDataTransaction): RowNodeTransaction"
      description="Add, update, or remove rows via a transaction. More efficient than replacing all data."
      example={`// Add rows
gridRef.current.applyTransaction({
  add: [newRow1, newRow2],
  addIndex: 0
});

// Update rows
gridRef.current.applyTransaction({
  update: [updatedRow1, updatedRow2]
});

// Remove rows
gridRef.current.applyTransaction({
  remove: [rowToRemove]
});`}
    />

    <ApiMethod
      name="getModel"
      signature="getModel(): RowModel"
      description="Get the row model for low-level data access."
      example={`const model = gridRef.current.getModel();
const rowCount = model.getRowCount();
const firstRow = model.getRow(0);`}
    />

    <ApiMethod
      name="getDisplayedRowCount"
      signature="getDisplayedRowCount(): number"
      description="Get the number of rows currently displayed (after filtering/sorting)."
      example={`const count = gridRef.current.getDisplayedRowCount();`}
    />

    <ApiMethod
      name="forEachNode"
      signature="forEachNode(callback: (node: RowNode, index: number) => void): void"
      description="Iterate through all row nodes."
      example={`gridRef.current.forEachNode((node, index) => {
  console.log(\`Row \${index}:\`, node.data);
});`}
    />
  </div>
);

const ColumnsSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      📋 Column Operations
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Control column visibility, pinning, sizing, and state persistence.
    </p>

    <ApiMethod
      name="setColumnVisible"
      signature="setColumnVisible(key: ColKey, visible: boolean): void"
      description="Show or hide a column."
      example={`// Hide email column
gridRef.current.setColumnVisible('email', false);

// Show email column
gridRef.current.setColumnVisible('email', true);`}
    />

    <ApiMethod
      name="setColumnPinned"
      signature="setColumnPinned(key: ColKey, pinned: 'left' | 'right' | null): void"
      description="Pin or unpin a column."
      example={`// Pin to left
gridRef.current.setColumnPinned('name', 'left');

// Unpin
gridRef.current.setColumnPinned('name', null);`}
    />

    <ApiMethod
      name="autoSizeAllColumns"
      signature="autoSizeAllColumns(): void"
      description="Auto-size all columns to fit their content."
      example={`gridRef.current.autoSizeAllColumns();`}
    />

    <ApiMethod
      name="sizeColumnsToFit"
      signature="sizeColumnsToFit(): void"
      description="Resize all visible columns to fill the grid's width."
      example={`gridRef.current.sizeColumnsToFit();`}
    />

    <ApiMethod
      name="getColumnState"
      signature="getColumnState(): ColumnState[]"
      description="Get the current state of all columns (width, visibility, pinned, sort)."
      example={`const state = gridRef.current.getColumnState();
localStorage.setItem('columnState', JSON.stringify(state));`}
    />

    <ApiMethod
      name="applyColumnState"
      signature="applyColumnState(state: ColumnState[]): void"
      description="Apply saved column state."
      example={`const saved = JSON.parse(localStorage.getItem('columnState'));
gridRef.current.applyColumnState(saved);`}
    />
  </div>
);

const FilteringSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      🔍 Filtering & Sorting
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Apply filters and sorting programmatically.
    </p>

    <ApiMethod
      name="setFilterModel"
      signature="setFilterModel(model: FilterConfig): void"
      description="Set filter model."
      example={`// Filter by status
gridRef.current.setFilterModel({
  status: { type: 'equals', value: 'Active' }
});

// Multiple filters
gridRef.current.setFilterModel({
  status: { type: 'equals', value: 'Active' },
  score: { type: 'greaterThan', value: 80 }
});`}
    />

    <ApiMethod
      name="clearAllFilters"
      signature="clearAllFilters(): void"
      description="Clear all active filters."
      example={`gridRef.current.clearAllFilters();`}
    />

    <ApiMethod
      name="setSortModel"
      signature="setSortModel(model: SortConfig[]): void"
      description="Set sort configuration."
      example={`// Single column sort
gridRef.current.setSortModel([
  { field: 'name', direction: 'asc' }
]);

// Multi-column sort
gridRef.current.setSortModel([
  { field: 'status', direction: 'asc' },
  { field: 'name', direction: 'asc' }
]);`}
    />

    <ApiMethod
      name="clearAllSorting"
      signature="clearAllSorting(): void"
      description="Clear all sorting."
      example={`gridRef.current.clearAllSorting();`}
    />
  </div>
);

const SelectionSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      ✅ Selection Operations
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Manage row selection programmatically.
    </p>

    <ApiMethod
      name="getSelectedRows"
      signature="getSelectedRows(): Row[]"
      description="Get selected row data."
      example={`const rows = gridRef.current.getSelectedRows();
console.log('Selected:', rows);`}
    />

    <ApiMethod
      name="selectAll"
      signature="selectAll(): void"
      description="Select all rows."
      example={`gridRef.current.selectAll();`}
    />

    <ApiMethod
      name="deselectAll"
      signature="deselectAll(): void"
      description="Deselect all rows."
      example={`gridRef.current.deselectAll();`}
    />

    <ApiMethod
      name="selectAllFiltered"
      signature="selectAllFiltered(): void"
      description="Select all currently filtered rows."
      example={`gridRef.current.setFilterModel({ status: { value: 'Active' } });
gridRef.current.selectAllFiltered();`}
    />

    <ApiMethod
      name="getSelectedRowCount"
      signature="getSelectedRowCount(): number"
      description="Get count of selected rows."
      example={`const count = gridRef.current.getSelectedRowCount();`}
    />
  </div>
);

const NavigationSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      🧭 Navigation & Focus
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Control scrolling and cell focus.
    </p>

    <ApiMethod
      name="ensureIndexVisible"
      signature="ensureIndexVisible(index: number, position?: 'top' | 'middle' | 'bottom'): void"
      description="Scroll to make a row visible."
      example={`// Scroll to row 10 at top
gridRef.current.ensureIndexVisible(10, 'top');

// Scroll to row 20 in middle
gridRef.current.ensureIndexVisible(20, 'middle');`}
    />

    <ApiMethod
      name="setFocusedCell"
      signature="setFocusedCell(rowIndex: number, colKey: ColKey): void"
      description="Set keyboard focus to a specific cell."
      example={`gridRef.current.setFocusedCell(5, 'name');`}
    />

    <ApiMethod
      name="clearFocusedCell"
      signature="clearFocusedCell(): void"
      description="Clear cell focus."
      example={`gridRef.current.clearFocusedCell();`}
    />
  </div>
);

const EditingSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      ✏️ Editing Operations
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Programmatically control cell editing.
    </p>

    <ApiMethod
      name="startEditingCell"
      signature="startEditingCell(params: StartEditingCellParams): void"
      description="Programmatically start editing a cell."
      example={`gridRef.current.startEditingCell({
  rowIndex: 2,
  colKey: 'name'
});`}
    />

    <ApiMethod
      name="stopEditing"
      signature="stopEditing(cancel?: boolean): void"
      description="Stop editing (save or cancel)."
      example={`// Save changes
gridRef.current.stopEditing();

// Cancel changes
gridRef.current.stopEditing(true);`}
    />
  </div>
);

const RenderingSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      🔄 Rendering & Refresh
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Control grid rendering and refresh operations.
    </p>

    <ApiMethod
      name="refreshCells"
      signature="refreshCells(params?: RefreshCellsParams): void"
      description="Re-render specific cells."
      example={`// Refresh all cells
gridRef.current.refreshCells();

// Refresh specific columns
gridRef.current.refreshCells({ columns: ['status', 'score'] });`}
    />

    <ApiMethod
      name="refreshHeader"
      signature="refreshHeader(): void"
      description="Re-render column headers."
      example={`gridRef.current.refreshHeader();`}
    />

    <ApiMethod
      name="redrawRows"
      signature="redrawRows(params?: RedrawRowsParams): void"
      description="Trigger full re-render of rows."
      example={`gridRef.current.redrawRows();`}
    />
  </div>
);

const ExportSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      📤 Export & Clipboard
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Export grid data and clipboard operations.
    </p>

    <ApiMethod
      name="exportDataAsCsv"
      signature="exportDataAsCsv(params?: CsvExportParams): void"
      description="Export grid data to CSV file."
      example={`// Basic export
gridRef.current.exportDataAsCsv();

// Custom export
gridRef.current.exportDataAsCsv({
  fileName: 'my-export',
  onlySelected: true,
  onlyFiltered: true,
  skipHeader: false
});`}
    />

    <ApiMethod
      name="getDataAsCsv"
      signature="getDataAsCsv(params?: CsvExportParams): string"
      description="Get CSV data as string (no download)."
      example={`const csv = gridRef.current.getDataAsCsv();
console.log(csv);`}
    />

    <ApiMethod
      name="copySelectedRowsToClipboard"
      signature="copySelectedRowsToClipboard(): void"
      description="Copy selected rows to clipboard."
      example={`gridRef.current.copySelectedRowsToClipboard();`}
    />
  </div>
);

const PaginationSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      📑 Pagination
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Control pagination programmatically.
    </p>

    <ApiMethod
      name="paginationGoToPage"
      signature="paginationGoToPage(page: number): void"
      description="Navigate to specific page."
      example={`gridRef.current.paginationGoToPage(2); // Go to page 3`}
    />

    <ApiMethod
      name="paginationGoToNextPage"
      signature="paginationGoToNextPage(): void"
      description="Go to next page."
      example={`gridRef.current.paginationGoToNextPage();`}
    />

    <ApiMethod
      name="paginationSetPageSize"
      signature="paginationSetPageSize(size: number): void"
      description="Set page size."
      example={`gridRef.current.paginationSetPageSize(50);`}
    />
  </div>
);

const GroupingSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      🌳 Grouping & Tree
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Manage row grouping and tree structures.
    </p>

    <ApiMethod
      name="setRowGroupColumns"
      signature="setRowGroupColumns(colKeys: ColKey[]): void"
      description="Set columns to group by."
      example={`gridRef.current.setRowGroupColumns(['department', 'role']);`}
    />

    <ApiMethod
      name="expandAll"
      signature="expandAll(): void"
      description="Expand all groups/tree nodes."
      example={`gridRef.current.expandAll();`}
    />

    <ApiMethod
      name="collapseAll"
      signature="collapseAll(): void"
      description="Collapse all groups/tree nodes."
      example={`gridRef.current.collapseAll();`}
    />
  </div>
);

const LayoutSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      💾 Layout Persistence
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Save and restore grid layouts.
    </p>

    <ApiMethod
      name="saveLayout"
      signature="saveLayout(name: string): Promise<void>"
      description="Save current layout with a name."
      example={`await gridRef.current.saveLayout('My Layout');`}
    />

    <ApiMethod
      name="loadLayout"
      signature="loadLayout(name: string): Promise<void>"
      description="Load saved layout."
      example={`await gridRef.current.loadLayout('My Layout');`}
    />

    <ApiMethod
      name="getLayoutState"
      signature="getLayoutState(): LayoutPreset['layout']"
      description="Get current layout state."
      example={`const layout = gridRef.current.getLayoutState();`}
    />
  </div>
);

const OverlaysSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      🔧 Overlays
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Control loading and empty state overlays.
    </p>

    <ApiMethod
      name="showLoadingOverlay"
      signature="showLoadingOverlay(): void"
      description="Show loading overlay."
      example={`gridRef.current.showLoadingOverlay();`}
    />

    <ApiMethod
      name="showNoRowsOverlay"
      signature="showNoRowsOverlay(): void"
      description="Show 'no rows' overlay."
      example={`gridRef.current.showNoRowsOverlay();`}
    />

    <ApiMethod
      name="hideOverlay"
      signature="hideOverlay(): void"
      description="Hide all overlays."
      example={`gridRef.current.hideOverlay();`}
    />
  </div>
);

const EventsSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      🎯 Events
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Subscribe to grid events.
    </p>

    <ApiMethod
      name="addEventListener"
      signature="addEventListener(eventType: string, listener: (event: unknown) => void): void"
      description="Add event listener."
      example={`gridRef.current.addEventListener('selectionChanged', (event) => {
  console.log('Selection changed', event);
});`}
    />

    <ApiMethod
      name="removeEventListener"
      signature="removeEventListener(eventType: string, listener: (event: unknown) => void): void"
      description="Remove event listener."
      example={`gridRef.current.removeEventListener('selectionChanged', handler);`}
    />
  </div>
);

const LifecycleSection: React.FC = () => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      🗑️ Lifecycle
    </h1>
    <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
      Grid lifecycle management.
    </p>

    <ApiMethod
      name="destroy"
      signature="destroy(): void"
      description="Clean up grid resources."
      example={`gridRef.current.destroy();`}
    />

    <ApiMethod
      name="isDestroyed"
      signature="isDestroyed(): boolean"
      description="Check if grid has been destroyed."
      example={`if (gridRef.current.isDestroyed()) {
  console.log('Grid destroyed');
}`}
    />
  </div>
);

// Helper Components
const ApiMethod: React.FC<{ name: string; signature: string; description: string; example: string }> = ({
  name,
  signature,
  description,
  example
}) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ 
      fontSize: '20px', 
      fontWeight: '600', 
      marginBottom: '8px',
      color: '#1e293b',
      fontFamily: 'monospace'
    }}>
      {name}
    </h3>
    <div style={{
      padding: '8px 12px',
      backgroundColor: '#f1f5f9',
      borderRadius: '6px',
      marginBottom: '12px',
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#475569'
    }}>
      {signature}
    </div>
    <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '16px', lineHeight: '1.6' }}>
      {description}
    </p>
    <CodeBlock code={example} />
  </div>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre style={{
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: '16px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: 0
  }}>
    <code>{code}</code>
  </pre>
);

const apiOverview = [
  { name: 'Data & Model', icon: '📊', description: 'Row data management, transactions, iteration', count: 12 },
  { name: 'Columns', icon: '📋', description: 'Visibility, pinning, sizing, reordering, state', count: 20 },
  { name: 'Filtering & Sorting', icon: '🔍', description: 'Filter and sort model management', count: 12 },
  { name: 'Selection', icon: '✅', description: 'Row selection operations', count: 7 },
  { name: 'Navigation & Focus', icon: '🧭', description: 'Scrolling and cell focus', count: 6 },
  { name: 'Editing', icon: '✏️', description: 'Cell editing control', count: 3 },
  { name: 'Rendering', icon: '🔄', description: 'Refresh and redraw operations', count: 7 },
  { name: 'Export & Clipboard', icon: '📤', description: 'CSV export, clipboard ops', count: 5 },
  { name: 'Pagination', icon: '📑', description: 'Page navigation and sizing', count: 7 },
  { name: 'Grouping & Tree', icon: '🌳', description: 'Group and tree operations', count: 7 },
  { name: 'Layout Persistence', icon: '💾', description: 'Save/load layouts', count: 4 },
  { name: 'Overlays', icon: '🔧', description: 'Loading/empty overlays', count: 3 },
  { name: 'Events', icon: '🎯', description: 'Event listeners', count: 2 },
  { name: 'Lifecycle', icon: '🗑️', description: 'Cleanup and state', count: 2 }
];
