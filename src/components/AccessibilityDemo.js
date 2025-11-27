import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AccessibilityDemo.tsx
 *
 * Comprehensive demonstration of DataGrid accessibility features
 * including keyboard navigation, ARIA support, and screen reader compatibility.
 */
import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
import { CodeBlock } from './CodeBlock';
export const AccessibilityDemo = () => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [eventLog, setEventLog] = useState([]);
    const addLog = (message) => {
        setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 19)]);
    };
    // Sample data
    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
        { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
        { field: 'email', headerName: 'Email', width: 250, editable: true },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'role', headerName: 'Role', width: 150 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];
    const rows = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', department: 'Engineering', role: 'Senior Developer', status: 'Active' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', department: 'Design', role: 'Lead Designer', status: 'Active' },
        { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', department: 'Engineering', role: 'DevOps Engineer', status: 'Active' },
        { id: 4, firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com', department: 'Product', role: 'Product Manager', status: 'Active' },
        { id: 5, firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', department: 'Sales', role: 'Account Executive', status: 'Inactive' },
        { id: 6, firstName: 'Diana', lastName: 'Davis', email: 'diana.davis@example.com', department: 'Marketing', role: 'Marketing Manager', status: 'Active' },
        { id: 7, firstName: 'Eve', lastName: 'Miller', email: 'eve.miller@example.com', department: 'Engineering', role: 'Frontend Developer', status: 'Active' },
        { id: 8, firstName: 'Frank', lastName: 'Wilson', email: 'frank.wilson@example.com', department: 'HR', role: 'HR Specialist', status: 'Active' },
        { id: 9, firstName: 'Grace', lastName: 'Moore', email: 'grace.moore@example.com', department: 'Engineering', role: 'Backend Developer', status: 'Active' },
        { id: 10, firstName: 'Henry', lastName: 'Taylor', email: 'henry.taylor@example.com', department: 'Finance', role: 'Financial Analyst', status: 'Active' },
    ];
    return (_jsxs("div", { style: { padding: '32px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f9fafb' }, children: [_jsxs("div", { style: { marginBottom: '32px' }, children: [_jsx("h1", { style: { fontSize: '36px', fontWeight: '700', marginBottom: '12px', color: '#111827' }, children: "DataGrid Accessibility (A11y)" }), _jsx("p", { style: { fontSize: '18px', color: '#6b7280', lineHeight: '1.6' }, children: "Comprehensive keyboard navigation, ARIA support, and screen reader compatibility demonstration." })] }), _jsxs("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                }, children: [_jsx(FeatureCard, { icon: "\u2328\uFE0F", title: "Keyboard Navigation", items: [
                            'Arrow keys for cell navigation',
                            'Tab/Shift+Tab for sequential focus',
                            'Home/End for row navigation',
                            'Ctrl+Home/End for grid edges',
                            'PageUp/PageDown for pagination',
                            'Space to select rows',
                            'Enter to edit cells',
                        ] }), _jsx(FeatureCard, { icon: "\u267F", title: "ARIA Support", items: [
                            'role="grid" on container',
                            'role="row" on all rows',
                            'role="columnheader" on headers',
                            'role="gridcell" on cells',
                            'aria-selected for selection',
                            'aria-sort for sorting',
                            'aria-rowindex/colindex',
                        ] }), _jsx(FeatureCard, { icon: "\uD83D\uDD0A", title: "Screen Readers", items: [
                            'Live region announcements',
                            'Selection state changes',
                            'Sorting notifications',
                            'Pagination updates',
                            'Filter status',
                            'Edit mode feedback',
                            'Focus position',
                        ] })] }), _jsxs("div", { style: {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    marginBottom: '32px'
                }, children: [_jsxs("div", { style: {
                            padding: '16px 20px',
                            backgroundColor: '#f3f4f6',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }, children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: '600', margin: 0, color: '#111827' }, children: "Interactive Accessible DataGrid" }), _jsx("div", { style: { fontSize: '14px', color: '#6b7280' }, children: selectedIds.length > 0 ? `${selectedIds.length} row${selectedIds.length === 1 ? '' : 's'} selected` : 'No selection' })] }), _jsx(DataGrid, { columns: columns, rows: rows, pageSize: 5, theme: "quartz", onRowClick: (row) => addLog(`Row clicked: ${row.firstName} ${row.lastName}`), onCellEdit: (rowIndex, field, value) => addLog(`Cell edited: Row ${rowIndex + 1}, ${field} = ${value}`), onSelectionChange: (ids) => {
                            setSelectedIds(ids);
                            addLog(`Selection changed: ${ids.length} row${ids.length === 1 ? '' : 's'}`);
                        } })] }), _jsxs("div", { style: {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    marginBottom: '32px'
                }, children: [_jsxs("div", { style: {
                            padding: '16px 20px',
                            backgroundColor: '#f3f4f6',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }, children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: '600', margin: 0, color: '#111827' }, children: "Event Log" }), _jsx("button", { onClick: () => setEventLog([]), style: {
                                    padding: '6px 12px',
                                    fontSize: '13px',
                                    backgroundColor: 'white',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    color: '#374151',
                                }, children: "Clear Log" })] }), _jsx("div", { style: {
                            padding: '16px 20px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            fontFamily: 'monospace',
                            fontSize: '13px'
                        }, children: eventLog.length === 0 ? (_jsx("div", { style: { color: '#9ca3af', textAlign: 'center', padding: '20px' }, children: "No events logged yet. Interact with the grid above to see events." })) : (eventLog.map((log, index) => (_jsx("div", { style: {
                                padding: '6px 0',
                                borderBottom: index < eventLog.length - 1 ? '1px solid #f3f4f6' : 'none',
                                color: '#374151'
                            }, children: log }, index)))) })] }), _jsxs("div", { style: { marginBottom: '32px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#111827' }, children: "Keyboard Shortcuts Guide" }), _jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '16px'
                        }, children: [_jsx(ShortcutCard, { category: "Navigation", shortcuts: [
                                    { keys: '↑ ↓ ← →', description: 'Move between cells' },
                                    { keys: 'Tab', description: 'Move to next cell (with wrapping)' },
                                    { keys: 'Shift + Tab', description: 'Move to previous cell' },
                                    { keys: 'Home', description: 'Go to first column' },
                                    { keys: 'End', description: 'Go to last column' },
                                    { keys: 'Ctrl + Home', description: 'Go to first cell' },
                                    { keys: 'Ctrl + End', description: 'Go to last cell' },
                                    { keys: 'PageUp', description: 'Previous page' },
                                    { keys: 'PageDown', description: 'Next page' },
                                ] }), _jsx(ShortcutCard, { category: "Actions", shortcuts: [
                                    { keys: 'Space', description: 'Toggle row selection' },
                                    { keys: 'Enter', description: 'Start editing cell' },
                                    { keys: 'Escape', description: 'Cancel editing' },
                                    { keys: 'Ctrl + Click', description: 'Multi-select rows' },
                                    { keys: 'Shift + Click', description: 'Range select rows' },
                                ] })] })] }), _jsxs("div", { children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#111827' }, children: "Implementation Examples" }), _jsx(CodeBlock, { title: "Basic Accessible Grid", language: "tsx", code: `import { DataGrid} from './DataGrid';

function AccessibleGrid() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pageSize={10}
      // Grid automatically includes:
      // - role="grid" with ARIA attributes
      // - Keyboard navigation (arrows, tab, space, enter)
      // - Screen reader announcements
      // - Focus management
    />
  );
}` }), _jsx(CodeBlock, { title: "ARIA Attributes in Grid", language: "tsx", code: `// Container
<div role="grid" aria-label="Data Grid" aria-rowcount={100} aria-colcount={7}>
  
  // Header
  <div role="rowgroup">
    <div role="row">
      <div role="columnheader" aria-colindex={1} aria-sort="ascending">
        Column Name
      </div>
    </div>
  </div>
  
  // Body
  <div role="rowgroup">
    <div role="row" aria-rowindex={2} aria-selected="true">
      <div role="gridcell" aria-colindex={1} aria-readonly="false">
        Cell Content
      </div>
    </div>
  </div>
</div>` }), _jsx(CodeBlock, { title: "Keyboard Navigation Handling", language: "tsx", code: `const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      // Navigate between cells
      break;
    case 'Home':
      // Go to first column (or Ctrl+Home for first cell)
      break;
    case 'End':
      // Go to last column (or Ctrl+End for last cell)
      break;
    case ' ':
      // Toggle row selection
      break;
    case 'Enter':
      // Start editing
      break;
    case 'Tab':
      // Move focus with wrapping
      break;
  }
};` }), _jsx(CodeBlock, { title: "Screen Reader Announcements", language: "tsx", code: `// Live region for announcements
<div role="status" aria-live="polite" aria-atomic="true">
  {announcements}
</div>

// Announce on selection change
announceSelection(selectedCount);
// "3 rows selected"

// Announce on sorting
announceSorting(columnName, direction);
// "Sorted by Name ascending"

// Announce on pagination
announcePagination(currentPage, totalPages, rowCount);
// "Page 2 of 5, showing 10 rows"` })] }), _jsxs("div", { style: {
                    marginTop: '48px',
                    padding: '24px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px'
                }, children: [_jsx("h3", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1e40af' }, children: "\uD83D\uDCA1 Testing Accessibility" }), _jsxs("ul", { style: { margin: 0, paddingLeft: '24px', color: '#1e3a8a', lineHeight: '1.8' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Keyboard Only:" }), " Try navigating without using a mouse"] }), _jsxs("li", { children: [_jsx("strong", { children: "Screen Readers:" }), " Test with NVDA (Windows), JAWS (Windows), or VoiceOver (Mac)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Browser DevTools:" }), " Check the Accessibility tree in Chrome/Firefox DevTools"] }), _jsxs("li", { children: [_jsx("strong", { children: "WAVE Tool:" }), " Use the WAVE browser extension to audit accessibility"] }), _jsxs("li", { children: [_jsx("strong", { children: "axe DevTools:" }), " Install axe DevTools extension for detailed ARIA validation"] }), _jsxs("li", { children: [_jsx("strong", { children: "Tab Order:" }), " Verify logical tab order through all interactive elements"] }), _jsxs("li", { children: [_jsx("strong", { children: "Focus Visible:" }), " Ensure focus indicators are visible and clear"] })] })] })] }));
};
const FeatureCard = ({ icon, title, items }) => (_jsxs("div", { style: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }, children: [_jsx("div", { style: { fontSize: '32px', marginBottom: '12px' }, children: icon }), _jsx("h3", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#111827' }, children: title }), _jsx("ul", { style: { margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }, children: items.map((item, index) => (_jsx("li", { children: item }, index))) })] }));
const ShortcutCard = ({ category, shortcuts }) => (_jsxs("div", { style: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }, children: category }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: shortcuts.map((shortcut, index) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsx("kbd", { style: {
                            padding: '4px 8px',
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            color: '#374151',
                            fontWeight: '600'
                        }, children: shortcut.keys }), _jsx("span", { style: { fontSize: '13px', color: '#6b7280', marginLeft: '12px', flex: 1, textAlign: 'right' }, children: shortcut.description })] }, index))) })] }));
