import React, { useState, useMemo } from 'react';
import { DataGrid} from './DataGrid';
import type { Column, Row, ContextMenuConfig, ContextMenuItem } from './DataGrid';
import { CodeBlock } from './CodeBlock';

/**
 * ContextMenuDemo Component
 * 
 * Demonstrates the context menu feature with:
 * - Right-click on cells: Copy, Copy with Headers, Export Selected Range, Filter by Value
 * - Right-click on headers: Pin/Unpin, Auto-size, Resize to Fit, Hide Column, Filter by Value
 * - Custom menu items
 * - Enable/disable context menu options
 */
export const ContextMenuDemo: React.FC = () => {
  const [showCopy, setShowCopy] = useState(true);
  const [showExport, setShowExport] = useState(true);
  const [showColumnOptions, setShowColumnOptions] = useState(true);
  const [showFilterByValue, setShowFilterByValue] = useState(true);
  const [enableContextMenu, setEnableContextMenu] = useState(true);
  const [showCustomItems, setShowCustomItems] = useState(false);

  // Sample data
  const columns: Column[] = [
    { field: 'id', headerName: 'ID', width: 80, sortable: true },
    { field: 'name', headerName: 'Name', width: 150, sortable: true, editable: true },
    { field: 'email', headerName: 'Email', width: 200, sortable: true },
    { field: 'department', headerName: 'Department', width: 150, sortable: true, filterType: 'text' },
    { field: 'salary', headerName: 'Salary', width: 120, sortable: true, filterType: 'number' },
    { field: 'country', headerName: 'Country', width: 130, sortable: true },
    { field: 'status', headerName: 'Status', width: 120, sortable: true },
  ];

  const rows: Row[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@company.com', department: 'Engineering', salary: 95000, country: 'USA', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@company.com', department: 'Marketing', salary: 75000, country: 'UK', status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@company.com', department: 'Sales', salary: 82000, country: 'Canada', status: 'Active' },
    { id: 4, name: 'Diana Prince', email: 'diana@company.com', department: 'Engineering', salary: 105000, country: 'USA', status: 'Active' },
    { id: 5, name: 'Eve Wilson', email: 'eve@company.com', department: 'HR', salary: 68000, country: 'Australia', status: 'On Leave' },
    { id: 6, name: 'Frank Miller', email: 'frank@company.com', department: 'Engineering', salary: 98000, country: 'Germany', status: 'Active' },
    { id: 7, name: 'Grace Lee', email: 'grace@company.com', department: 'Marketing', salary: 79000, country: 'Singapore', status: 'Active' },
    { id: 8, name: 'Henry Taylor', email: 'henry@company.com', department: 'Sales', salary: 85000, country: 'USA', status: 'Active' },
    { id: 9, name: 'Iris Chen', email: 'iris@company.com', department: 'Engineering', salary: 102000, country: 'USA', status: 'Active' },
    { id: 10, name: 'Jack Davis', email: 'jack@company.com', department: 'Finance', salary: 91000, country: 'UK', status: 'Active' },
    { id: 11, name: 'Kate Martinez', email: 'kate@company.com', department: 'HR', salary: 72000, country: 'Spain', status: 'Active' },
    { id: 12, name: 'Leo Anderson', email: 'leo@company.com', department: 'Sales', salary: 88000, country: 'Canada', status: 'Active' },
  ];

  // Custom menu items example
  const customMenuItems: ContextMenuItem[] = useMemo(() => [
    {
      id: 'custom-action-1',
      label: 'Custom Action 1',
      icon: '⭐',
      onClick: () => alert('Custom Action 1 clicked!'),
    },
    {
      id: 'custom-action-2',
      label: 'Custom Action 2',
      icon: '🎯',
      onClick: () => alert('Custom Action 2 clicked!'),
    },
    {
      type: 'separator',
    } as ContextMenuItem,
    {
      id: 'custom-danger',
      label: 'Danger Action',
      icon: '⚠️',
      danger: true,
      onClick: () => alert('Danger action clicked!'),
    },
  ], []);

  // Context menu configuration - memoize to prevent recreating on every render
  const contextMenuConfig: ContextMenuConfig = useMemo(() => ({
    enabled: enableContextMenu,
    showCopy,
    showExport,
    showColumnOptions,
    showFilterByValue,
    customItems: showCustomItems ? customMenuItems : [],
  }), [enableContextMenu, showCopy, showExport, showColumnOptions, showFilterByValue, showCustomItems, customMenuItems]);

  const exampleCode = `import { DataGrid } from 'react-open-source-grid';
import type { Column, Row, ContextMenuConfig } from 'react-open-source-grid';

const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
];

const rows: Row[] = [
  { id: 1, name: 'Alice', email: 'alice@company.com' },
  { id: 2, name: 'Bob', email: 'bob@company.com' },
];

// Configure context menu
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  showCopy: true,           // Show copy/copy with headers
  showExport: true,         // Show export selected range
  showColumnOptions: true,  // Show pin/hide/resize options
  showFilterByValue: true,  // Show filter by value
  customItems: [           // Add custom menu items
    {
      id: 'custom-action',
      label: 'Custom Action',
      icon: '⭐',
      onClick: () => console.log('Custom action!'),
    },
  ],
};

<DataGrid
  columns={columns}
  rows={rows}
  contextMenuConfig={contextMenuConfig}
  theme="quartz"
/>`;

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ marginBottom: '10px' }}>Context Menu Demo</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Right-click on cells or column headers to see the context menu. Select multiple rows to test copy/export features.
      </p>

      {/* Configuration Controls */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Context Menu Configuration</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={enableContextMenu}
              onChange={(e) => setEnableContextMenu(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Enable Context Menu</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showCopy}
              onChange={(e) => setShowCopy(e.target.checked)}
              disabled={!enableContextMenu}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Show Copy Options</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showExport}
              onChange={(e) => setShowExport(e.target.checked)}
              disabled={!enableContextMenu}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Show Export Options</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showColumnOptions}
              onChange={(e) => setShowColumnOptions(e.target.checked)}
              disabled={!enableContextMenu}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Show Column Options</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showFilterByValue}
              onChange={(e) => setShowFilterByValue(e.target.checked)}
              disabled={!enableContextMenu}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Show Filter by Value</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showCustomItems}
              onChange={(e) => setShowCustomItems(e.target.checked)}
              disabled={!enableContextMenu}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Show Custom Items</span>
          </label>
        </div>

        <div style={{ 
          padding: '12px', 
          backgroundColor: '#fff', 
          borderRadius: '6px', 
          fontSize: '14px',
          border: '1px solid #e0e0e0'
        }}>
          <strong>💡 Try these actions:</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
            <li>Right-click on any cell to copy, export, or filter</li>
            <li>Right-click on column headers to pin, auto-size, hide, or filter</li>
            <li>Select multiple rows (Ctrl/Cmd+Click) and right-click to copy/export selection</li>
            <li>Use "Auto-size All Columns" from header context menu to optimize all column widths</li>
            <li>Use "Resize to Fit" to auto-size a single column based on content</li>
          </ul>
        </div>
      </div>

      {/* DataGrid */}
      <div style={{ height: '600px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <DataGrid
          columns={columns}
          rows={rows}
          pageSize={20}
          contextMenuConfig={contextMenuConfig}
          theme="quartz"
        />
      </div>

      {/* Feature List */}
      <div style={{ marginTop: '40px' }}>
        <h2>Context Menu Features</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>📋 Cell Context Menu</h3>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
              <li><strong>Copy</strong> - Copy selected cells to clipboard</li>
              <li><strong>Copy with Headers</strong> - Include column headers</li>
              <li><strong>Export Selected Range</strong> - Export to CSV</li>
              <li><strong>Filter by Value</strong> - Quick filter shortcut</li>
            </ul>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>📌 Header Context Menu</h3>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
              <li><strong>Pin Left/Right</strong> - Pin column to side</li>
              <li><strong>Unpin Column</strong> - Remove pin</li>
              <li><strong>Auto-size This Column</strong> - Fit content</li>
              <li><strong>Resize to Fit</strong> - Optimal width</li>
              <li><strong>Auto-size All Columns</strong> - Fit all columns</li>
              <li><strong>Hide Column</strong> - Hide from view</li>
              <li><strong>Filter by Value</strong> - Show unique values</li>
            </ul>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>⚙️ Configuration</h3>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
              <li><strong>enabled</strong> - Enable/disable menu</li>
              <li><strong>showCopy</strong> - Toggle copy options</li>
              <li><strong>showExport</strong> - Toggle export options</li>
              <li><strong>showColumnOptions</strong> - Toggle column ops</li>
              <li><strong>showFilterByValue</strong> - Toggle filter</li>
              <li><strong>customItems</strong> - Add custom actions</li>
              <li><strong>onBeforeShow</strong> - Customize menu dynamically</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div style={{ marginTop: '40px' }}>
        <h2>Code Example</h2>
        <CodeBlock code={exampleCode} language="typescript" />
      </div>

      {/* Custom Menu Items Example */}
      <div style={{ marginTop: '40px' }}>
        <h2>Custom Menu Items Example</h2>
        <CodeBlock
          code={`const customMenuItems: ContextMenuItem[] = [
  {
    id: 'custom-action-1',
    label: 'Custom Action 1',
    icon: '⭐',
    onClick: () => alert('Custom Action 1 clicked!'),
  },
  {
    id: 'custom-action-2',
    label: 'Custom Action 2',
    icon: '🎯',
    onClick: () => alert('Custom Action 2 clicked!'),
  },
  {
    type: 'separator',
  },
  {
    id: 'custom-danger',
    label: 'Danger Action',
    icon: '⚠️',
    danger: true,
    onClick: () => alert('Danger action clicked!'),
  },
];

const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  customItems: customMenuItems,
};`}
          language="typescript"
        />
      </div>

      {/* Advanced Customization */}
      <div style={{ marginTop: '40px' }}>
        <h2>Advanced Customization</h2>
        <CodeBlock
          code={`// Dynamically customize menu based on context
const contextMenuConfig: ContextMenuConfig = {
  enabled: true,
  onBeforeShow: (event) => {
    // event contains: type, row, column, rowIndex, columnIndex, event
    
    if (event.type === 'cell' && event.row) {
      // Customize menu for specific rows
      if (event.row.status === 'Inactive') {
        return [
          {
            id: 'activate',
            label: 'Activate User',
            icon: '✅',
            onClick: () => console.log('Activating user:', event.row.id),
          },
        ];
      }
    }
    
    if (event.type === 'header' && event.column) {
      // Customize menu for specific columns
      if (event.column.field === 'salary') {
        return [
          {
            id: 'format-currency',
            label: 'Format as Currency',
            icon: '💰',
            onClick: () => console.log('Formatting salary column'),
          },
        ];
      }
    }
    
    // Return null to use default menu
    return null;
  },
};`}
          language="typescript"
        />
      </div>
    </div>
  );
};

export default ContextMenuDemo;
