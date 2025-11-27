import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { DataGrid } from './DataGrid';
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
export const ContextMenuDemo = () => {
    const [showCopy, setShowCopy] = useState(true);
    const [showExport, setShowExport] = useState(true);
    const [showColumnOptions, setShowColumnOptions] = useState(true);
    const [showFilterByValue, setShowFilterByValue] = useState(true);
    const [enableContextMenu, setEnableContextMenu] = useState(true);
    const [showCustomItems, setShowCustomItems] = useState(false);
    // Sample data
    const columns = [
        { field: 'id', headerName: 'ID', width: 80, sortable: true },
        { field: 'name', headerName: 'Name', width: 150, sortable: true, editable: true },
        { field: 'email', headerName: 'Email', width: 200, sortable: true },
        { field: 'department', headerName: 'Department', width: 150, sortable: true, filterType: 'text' },
        { field: 'salary', headerName: 'Salary', width: 120, sortable: true, filterType: 'number' },
        { field: 'country', headerName: 'Country', width: 130, sortable: true },
        { field: 'status', headerName: 'Status', width: 120, sortable: true },
    ];
    const rows = [
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
    const customMenuItems = useMemo(() => [
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
    ], []);
    // Context menu configuration - memoize to prevent recreating on every render
    const contextMenuConfig = useMemo(() => ({
        enabled: enableContextMenu,
        showCopy,
        showExport,
        showColumnOptions,
        showFilterByValue,
        customItems: showCustomItems ? customMenuItems : [],
    }), [enableContextMenu, showCopy, showExport, showColumnOptions, showFilterByValue, showCustomItems, customMenuItems]);
    const exampleCode = `import { DataGrid} from './DataGrid';
import type { Column, Row, ContextMenuConfig } from './DataGrid';

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
    return (_jsxs("div", { style: { padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }, children: [_jsx("h1", { style: { marginBottom: '10px' }, children: "Context Menu Demo" }), _jsx("p", { style: { color: '#666', marginBottom: '30px' }, children: "Right-click on cells or column headers to see the context menu. Select multiple rows to test copy/export features." }), _jsxs("div", { style: {
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    border: '1px solid #e0e0e0'
                }, children: [_jsx("h3", { style: { marginTop: 0, marginBottom: '15px' }, children: "Context Menu Configuration" }), _jsxs("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '15px' }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "checkbox", checked: enableContextMenu, onChange: (e) => setEnableContextMenu(e.target.checked), style: { width: '18px', height: '18px', cursor: 'pointer' } }), _jsx("span", { children: "Enable Context Menu" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "checkbox", checked: showCopy, onChange: (e) => setShowCopy(e.target.checked), disabled: !enableContextMenu, style: { width: '18px', height: '18px', cursor: 'pointer' } }), _jsx("span", { children: "Show Copy Options" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "checkbox", checked: showExport, onChange: (e) => setShowExport(e.target.checked), disabled: !enableContextMenu, style: { width: '18px', height: '18px', cursor: 'pointer' } }), _jsx("span", { children: "Show Export Options" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "checkbox", checked: showColumnOptions, onChange: (e) => setShowColumnOptions(e.target.checked), disabled: !enableContextMenu, style: { width: '18px', height: '18px', cursor: 'pointer' } }), _jsx("span", { children: "Show Column Options" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "checkbox", checked: showFilterByValue, onChange: (e) => setShowFilterByValue(e.target.checked), disabled: !enableContextMenu, style: { width: '18px', height: '18px', cursor: 'pointer' } }), _jsx("span", { children: "Show Filter by Value" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "checkbox", checked: showCustomItems, onChange: (e) => setShowCustomItems(e.target.checked), disabled: !enableContextMenu, style: { width: '18px', height: '18px', cursor: 'pointer' } }), _jsx("span", { children: "Show Custom Items" })] })] }), _jsxs("div", { style: {
                            padding: '12px',
                            backgroundColor: '#fff',
                            borderRadius: '6px',
                            fontSize: '14px',
                            border: '1px solid #e0e0e0'
                        }, children: [_jsx("strong", { children: "\uD83D\uDCA1 Try these actions:" }), _jsxs("ul", { style: { marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }, children: [_jsx("li", { children: "Right-click on any cell to copy, export, or filter" }), _jsx("li", { children: "Right-click on column headers to pin, auto-size, hide, or filter" }), _jsx("li", { children: "Select multiple rows (Ctrl/Cmd+Click) and right-click to copy/export selection" }), _jsx("li", { children: "Use \"Auto-size All Columns\" from header context menu to optimize all column widths" }), _jsx("li", { children: "Use \"Resize to Fit\" to auto-size a single column based on content" })] })] })] }), _jsx("div", { style: { height: '600px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }, children: _jsx(DataGrid, { columns: columns, rows: rows, pageSize: 20, contextMenuConfig: contextMenuConfig, theme: "quartz" }) }), _jsxs("div", { style: { marginTop: '40px' }, children: [_jsx("h2", { children: "Context Menu Features" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }, children: [_jsxs("div", { style: { padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }, children: [_jsx("h3", { style: { marginTop: 0, fontSize: '16px' }, children: "\uD83D\uDCCB Cell Context Menu" }), _jsxs("ul", { style: { paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Copy" }), " - Copy selected cells to clipboard"] }), _jsxs("li", { children: [_jsx("strong", { children: "Copy with Headers" }), " - Include column headers"] }), _jsxs("li", { children: [_jsx("strong", { children: "Export Selected Range" }), " - Export to CSV"] }), _jsxs("li", { children: [_jsx("strong", { children: "Filter by Value" }), " - Quick filter shortcut"] })] })] }), _jsxs("div", { style: { padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }, children: [_jsx("h3", { style: { marginTop: 0, fontSize: '16px' }, children: "\uD83D\uDCCC Header Context Menu" }), _jsxs("ul", { style: { paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Pin Left/Right" }), " - Pin column to side"] }), _jsxs("li", { children: [_jsx("strong", { children: "Unpin Column" }), " - Remove pin"] }), _jsxs("li", { children: [_jsx("strong", { children: "Auto-size This Column" }), " - Fit content"] }), _jsxs("li", { children: [_jsx("strong", { children: "Resize to Fit" }), " - Optimal width"] }), _jsxs("li", { children: [_jsx("strong", { children: "Auto-size All Columns" }), " - Fit all columns"] }), _jsxs("li", { children: [_jsx("strong", { children: "Hide Column" }), " - Hide from view"] }), _jsxs("li", { children: [_jsx("strong", { children: "Filter by Value" }), " - Show unique values"] })] })] }), _jsxs("div", { style: { padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }, children: [_jsx("h3", { style: { marginTop: 0, fontSize: '16px' }, children: "\u2699\uFE0F Configuration" }), _jsxs("ul", { style: { paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "enabled" }), " - Enable/disable menu"] }), _jsxs("li", { children: [_jsx("strong", { children: "showCopy" }), " - Toggle copy options"] }), _jsxs("li", { children: [_jsx("strong", { children: "showExport" }), " - Toggle export options"] }), _jsxs("li", { children: [_jsx("strong", { children: "showColumnOptions" }), " - Toggle column ops"] }), _jsxs("li", { children: [_jsx("strong", { children: "showFilterByValue" }), " - Toggle filter"] }), _jsxs("li", { children: [_jsx("strong", { children: "customItems" }), " - Add custom actions"] }), _jsxs("li", { children: [_jsx("strong", { children: "onBeforeShow" }), " - Customize menu dynamically"] })] })] })] })] }), _jsxs("div", { style: { marginTop: '40px' }, children: [_jsx("h2", { children: "Code Example" }), _jsx(CodeBlock, { code: exampleCode, language: "typescript" })] }), _jsxs("div", { style: { marginTop: '40px' }, children: [_jsx("h2", { children: "Custom Menu Items Example" }), _jsx(CodeBlock, { code: `const customMenuItems: ContextMenuItem[] = [
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
};`, language: "typescript" })] }), _jsxs("div", { style: { marginTop: '40px' }, children: [_jsx("h2", { children: "Advanced Customization" }), _jsx(CodeBlock, { code: `// Dynamically customize menu based on context
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
};`, language: "typescript" })] })] }));
};
export default ContextMenuDemo;
