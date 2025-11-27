import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable */
import React, { useState } from 'react';
import { DataGrid, StatusChip, CurrencyCell } from './DataGrid';
import { CodeBlock } from './CodeBlock';
/**
 * DemoGridPage - Example usage of the DataGrid component
 *
 * This page demonstrates all the features of the DataGrid:
 * - Sample data with multiple columns and rows
 * - Event handlers for row clicks, cell edits, and selection changes
 * - Customizable column configuration
 */
// Helper function to generate employee data
const generateEmployeeData = (count) => {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George', 'Hannah',
        'Ian', 'Julia', 'Kevin', 'Laura', 'Michael', 'Nina', 'Oscar', 'Paula', 'Quinn', 'Rachel',
        'Samuel', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zoe', 'Adam', 'Beth',
        'Chris', 'Debbie', 'Edward', 'Faith', 'Gary', 'Helen', 'Isaac', 'Jenny', 'Keith', 'Lisa'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Prince', 'Davis', 'Garcia', 'Miller', 'Wilson',
        'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Lee', 'Walker',
        'Hall', 'Allen', 'Young', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Carter',
        'Mitchell', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart'];
    const positions = ['Software Engineer', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Data Analyst',
        'Marketing Manager', 'Sales Representative', 'HR Specialist', 'QA Engineer', 'Content Writer',
        'Backend Developer', 'Frontend Developer', 'Business Analyst', 'UI Designer', 'System Administrator',
        'Customer Support', 'Senior Engineer', 'Scrum Master', 'Security Analyst', 'Finance Manager',
        'Legal Counsel', 'Technical Writer', 'Cloud Architect', 'Mobile Developer', 'Account Manager'];
    const departments = ['Engineering', 'Product', 'Design', 'Analytics', 'Marketing', 'Sales',
        'Human Resources', 'Support', 'IT', 'Security', 'Finance', 'Legal', 'Documentation'];
    const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Pending'];
    const employees = [];
    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[(i - 1) % firstNames.length];
        const lastName = lastNames[Math.floor((i - 1) / firstNames.length) % lastNames.length];
        const name = `${firstName} ${lastName} ${i > 40 ? i : ''}`.trim();
        // Generate a date within the last 5 years
        const year = 2019 + (i % 6);
        const month = (i % 12) + 1;
        const day = ((i * 7) % 28) + 1;
        const joinDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        employees.push({
            id: i,
            name,
            position: positions[(i - 1) % positions.length],
            department: departments[(i - 1) % departments.length],
            salary: 50000 + ((i * 1234) % 100000),
            joinDate,
            status: statuses[(i - 1) % statuses.length],
        });
    }
    return employees;
};
export const DemoGridPage = () => {
    // Sample data: Employee records - Generate 100 employees
    const [employees, setEmployees] = useState(generateEmployeeData(100));
    // Column definitions
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, sortable: true, filterable: true, editable: false },
        { field: 'name', headerName: 'Name', width: 180, sortable: true, filterable: true, editable: true },
        { field: 'position', headerName: 'Position', width: 200, sortable: true, filterable: true, editable: true },
        { field: 'department', headerName: 'Department', width: 160, sortable: true, filterable: true, editable: true },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 120,
            sortable: true,
            filterable: true,
            editable: true,
            renderCell: (row) => _jsx(CurrencyCell, { amount: row.salary })
        },
        { field: 'joinDate', headerName: 'Join Date', width: 130, sortable: true, filterable: true, editable: true },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            sortable: true,
            filterable: true,
            editable: true,
            renderCell: (row) => _jsx(StatusChip, { status: row.status })
        },
    ];
    // State for event logs
    const [eventLog, setEventLog] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    // Add event to log
    const addToLog = (message) => {
        setEventLog((prev) => [message, ...prev].slice(0, 10)); // Keep last 10 events
    };
    // Handle row click
    const handleRowClick = (row) => {
        addToLog(`Row clicked: ${row.name} (ID: ${row.id})`);
    };
    // Handle cell edit
    const handleCellEdit = (rowIndex, field, value) => {
        setEmployees((prev) => {
            const updated = [...prev];
            updated[rowIndex] = { ...updated[rowIndex], [field]: value };
            return updated;
        });
        addToLog(`Cell edited: Row ${rowIndex + 1}, Field "${field}", New value: "${value}"`);
    };
    // Handle selection change
    const handleSelectionChange = (ids) => {
        setSelectedIds(ids);
        addToLog(`Selection changed: ${ids.length} row(s) selected`);
    };
    return (_jsx("div", { style: { height: '100%', backgroundColor: '#f9fafb', padding: '24px', overflow: 'auto' }, children: _jsxs("div", { style: { maxWidth: '100%', margin: '0 auto', minHeight: '100%', display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { marginBottom: '24px', flexShrink: 0 }, children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }, children: "Employee Directory" }), _jsx("p", { style: { color: '#6b7280', fontSize: '14px' }, children: "Manage and explore employee information with sorting, filtering, and advanced features" })] }), _jsxs("div", { style: { marginBottom: '24px', flexShrink: 0, backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }, children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }, children: "Available Features" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', fontSize: '14px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Sortable columns" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Column filtering" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Pagination controls" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Column resizing" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Column reordering" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Row selection" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Editable cells" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Keyboard navigation" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Sticky headers" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Row grouping" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Aggregations" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Footer aggregates" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#2563eb', fontWeight: '600', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { style: { color: '#374151' }, children: "Context menu" })] })] })] }), _jsxs("div", { style: { marginBottom: '24px', flexShrink: 0, backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px' }, children: [_jsx("h3", { style: { fontWeight: '600', color: '#111827', marginBottom: '12px', fontSize: '14px' }, children: "How to use:" }), _jsxs("ul", { style: { fontSize: '14px', color: '#374151', listStyle: 'disc', paddingLeft: '20px' }, children: [_jsx("li", { style: { marginBottom: '6px' }, children: "Click column headers to sort data" }), _jsx("li", { style: { marginBottom: '6px' }, children: "Use filter boxes to search within columns" }), _jsx("li", { style: { marginBottom: '6px' }, children: "Drag column borders to resize columns" }), _jsx("li", { style: { marginBottom: '6px' }, children: "Drag headers to reorder columns" }), _jsx("li", { style: { marginBottom: '6px' }, children: "Click rows to select them (Ctrl+click for multiple)" }), _jsx("li", { style: { marginBottom: '6px' }, children: "Double-click cells to edit content" }), _jsx("li", { style: { marginBottom: '6px' }, children: "Right-click on cells or headers for context menu (copy, export, pin, auto-size, etc.)" }), _jsx("li", { style: { marginBottom: '0' }, children: "Drag headers to the Group By area to group data" })] })] }), _jsx("div", { style: { marginBottom: '24px', flex: '1 1 auto', minHeight: '500px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }, children: _jsx("div", { style: { height: '100%', overflow: 'auto' }, children: _jsx(DataGrid, { columns: columns, rows: employees, pageSize: 10, theme: "quartz", onRowClick: handleRowClick, onCellEdit: handleCellEdit, onSelectionChange: handleSelectionChange, contextMenuConfig: { enabled: true }, footerConfig: {
                                show: true,
                                showGroupFooters: true,
                                aggregates: [
                                    { field: 'salary', function: 'total', label: 'Total Salary' },
                                    { field: 'salary', function: 'avg', label: 'Avg Salary' },
                                    { field: 'salary', function: 'min', label: 'Min Salary' },
                                    { field: 'salary', function: 'max', label: 'Max Salary' },
                                    { field: 'id', function: 'count', label: 'Total Employees' },
                                ],
                            } }) }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', flexShrink: 0 }, children: [_jsxs("div", { style: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }, children: [_jsxs("h3", { style: { fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111827' }, children: ["Selected Rows ", _jsxs("span", { style: { color: '#2563eb', fontWeight: 'bold' }, children: ["(", selectedIds.length, ")"] })] }), selectedIds.length === 0 ? (_jsx("p", { style: { color: '#6b7280', fontSize: '14px' }, children: "No rows selected. Click on rows to select them." })) : (_jsx("div", { style: { maxHeight: '160px', overflowY: 'auto' }, children: selectedIds.map((id) => {
                                        const employee = employees.find((emp) => emp.id === id);
                                        return (_jsxs("div", { style: { fontSize: '14px', color: '#374151', padding: '8px', backgroundColor: '#eff6ff', borderRadius: '4px', border: '1px solid #dbeafe', marginBottom: '8px' }, children: [_jsxs("span", { style: { fontWeight: '500', color: '#2563eb' }, children: ["ID ", id] }), " - ", employee?.name] }, id));
                                    }) }))] }), _jsxs("div", { style: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }, children: [_jsxs("h3", { style: { fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111827' }, children: ["Event Log ", _jsx("span", { style: { color: '#6b7280', fontWeight: 'normal' }, children: "(Last 10)" })] }), eventLog.length === 0 ? (_jsx("p", { style: { color: '#6b7280', fontSize: '14px' }, children: "No events yet. Try interacting with the grid." })) : (_jsx("div", { style: { maxHeight: '160px', overflowY: 'auto' }, children: eventLog.map((event, index) => (_jsx("div", { style: { fontSize: '12px', color: '#4b5563', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', border: '1px solid #e5e7eb', fontFamily: 'monospace', marginBottom: '8px' }, children: event }, index))) }))] })] }), _jsxs("div", { style: { marginTop: '40px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }, children: "Implementation Examples" }), _jsx(CodeBlock, { title: "Installation & Basic Setup", language: "tsx", code: `
// Import the DataGrid
import { DataGrid} from 'react-open-source-grid';
import type { Column, Row } from 'react-open-source-grid';

// Define your data
const employees: Row[] = [
  { id: 1, name: 'John Doe', position: 'Software Engineer', salary: 95000 },
  { id: 2, name: 'Jane Smith', position: 'Product Manager', salary: 110000 },
  // ... more rows
];

// Define columns
const columns: Column[] = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 70, 
    sortable: true 
  },
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 180, 
    sortable: true,
    filterable: true,
    editable: true 
  },
  { 
    field: 'position', 
    headerName: 'Position', 
    width: 200, 
    sortable: true 
  },
  { 
    field: 'salary', 
    headerName: 'Salary', 
    width: 130,
    sortable: true,
    filterable: true
  },
];

<DataGrid
  columns={columns}
  rows={employees}
  pageSize={10}
  theme="quartz"
/>` }), _jsx(CodeBlock, { title: "Using Custom Cell Renderers", language: "tsx", code: `import { DataGrid, StatusChip, CurrencyCell } from 'react-open-source-grid';

const columns: Column[] = [
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 180 
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 120,
    // Custom renderer using StatusChip component
    renderCell: (row: Row) => <StatusChip status={row.status} />
  },
  { 
    field: 'salary', 
    headerName: 'Salary', 
    width: 130,
    // Custom renderer using CurrencyCell component
    renderCell: (row: Row) => <CurrencyCell value={row.salary} />
  },
];

<DataGrid
  columns={columns}
  rows={data}
  pageSize={10}
/>` }), _jsx(CodeBlock, { title: "Handling Events", language: "tsx", code: `import { useState } from 'react';
import { DataGrid} from 'react-open-source-grid';

function MyComponent() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [data, setData] = useState<Row[]>(initialData);

  return (
    <DataGrid
      columns={columns}
      rows={data}
      pageSize={10}
      
      // Handle row selection
      onSelectionChange={(ids) => {
        setSelectedIds(ids);
        console.log('Selected IDs:', ids);
      }}
      
      // Handle row clicks
      onRowClick={(row) => {
        console.log('Clicked row:', row);
      }}
      
      // Handle cell edits
      onCellEdit={(rowIndex, field, value) => {
        const updatedData = [...data];
        updatedData[rowIndex] = {
          ...updatedData[rowIndex],
          [field]: value
        };
        setData(updatedData);
        console.log('Cell edited:', { rowIndex, field, value });
      }}
    />
  );
}` }), _jsx(CodeBlock, { title: "Footer Aggregations", language: "tsx", code: `import { DataGrid} from 'react-open-source-grid';

<DataGrid
  columns={columns}
  rows={data}
  pageSize={10}
  
  // Enable footer with aggregations
  footerConfig={{
    show: true,
    aggregates: [
      { 
        field: 'salary', 
        function: 'avg', 
        label: 'Avg Salary' 
      },
      { 
        field: 'salary', 
        function: 'sum', 
        label: 'Total Payroll' 
      },
      { 
        field: 'salary', 
        function: 'min', 
        label: 'Min Salary' 
      },
      { 
        field: 'salary', 
        function: 'max', 
        label: 'Max Salary' 
      },
      { 
        field: 'id', 
        function: 'count', 
        label: 'Total Employees' 
      },
    ],
  }}
/>` }), _jsx(CodeBlock, { title: "Complete Example with All Features", language: "tsx", code: `import React, { useState } from 'react';
import { DataGrid, StatusChip, CurrencyCell } from 'react-open-source-grid';
import type { Column, Row } from 'react-open-source-grid';

export const EmployeeGrid: React.FC = () => {
  const [employees, setEmployees] = useState<Row[]>([
    { id: 1, name: 'John Doe', position: 'Engineer', salary: 95000, status: 'Active' },
    { id: 2, name: 'Jane Smith', position: 'Manager', salary: 110000, status: 'Active' },
    // ... more data
  ]);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const columns: Column[] = [
    { field: 'id', headerName: 'ID', width: 70, sortable: true },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 180, 
      sortable: true, 
      filterable: true,
      editable: true 
    },
    { 
      field: 'position', 
      headerName: 'Position', 
      width: 200, 
      sortable: true,
      filterable: true 
    },
    { 
      field: 'salary', 
      headerName: 'Salary', 
      width: 130,
      sortable: true,
      filterable: true,
      renderCell: (row) => <CurrencyCell value={row.salary} />
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      sortable: true,
      filterable: true,
      renderCell: (row) => <StatusChip status={row.status} />
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={employees}
      pageSize={10}
      theme="quartz"
      showColumnPinning={true}
      
      onRowClick={(row) => console.log('Row clicked:', row)}
      
      onSelectionChange={(ids) => setSelectedIds(ids)}
      
      onCellEdit={(rowIndex, field, value) => {
        const updated = [...employees];
        updated[rowIndex] = { ...updated[rowIndex], [field]: value };
        setEmployees(updated);
      }}
      
      footerConfig={{
        show: true,
        aggregates: [
          { field: 'salary', function: 'avg', label: 'Avg Salary' },
          { field: 'id', function: 'count', label: 'Total' },
        ],
      }}
    />
  );
};` })] })] }) }));
};
