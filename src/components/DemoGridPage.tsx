/* eslint-disable */
import React, { useState } from 'react';
import '../index.css';
import { DataGrid, StatusChip, CurrencyCell } from './DataGrid';
import type { Column, Row } from './DataGrid';
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
const generateEmployeeData = (count: number): Row[] => {
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
  
  const employees: Row[] = [];
  
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

export const DemoGridPage: React.FC = () => {
  // Sample data: Employee records - Generate 100 employees
  const [employees, setEmployees] = useState<Row[]>(generateEmployeeData(100));

  // Column definitions
  const columns: Column[] = [
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
      renderCell: (row) => <CurrencyCell amount={row.salary} />
    },
    { field: 'joinDate', headerName: 'Join Date', width: 130, sortable: true, filterable: true, editable: true },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120, 
      sortable: true, 
      filterable: true, 
      editable: true,
      renderCell: (row) => <StatusChip status={row.status} />
    },
  ];

  // State for event logs
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Add event to log
  const addToLog = (message: string) => {
    setEventLog((prev) => [message, ...prev].slice(0, 10)); // Keep last 10 events
  };

  // Handle row click
  const handleRowClick = (row: Row) => {
    addToLog(`Row clicked: ${row.name} (ID: ${row.id})`);
  };

  // Handle cell edit
  const handleCellEdit = (rowIndex: number, field: string, value: any) => {
    setEmployees((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return updated;
    });
    addToLog(`Cell edited: Row ${rowIndex + 1}, Field "${field}", New value: "${value}"`);
  };

  // Handle selection change
  const handleSelectionChange = (ids: (string | number)[]) => {
    setSelectedIds(ids);
    addToLog(`Selection changed: ${ids.length} row(s) selected`);
  };

  return (
    <div style={{ height: '100%', backgroundColor: '#f9fafb', padding: '24px', overflow: 'auto' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '24px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Employee Directory
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Manage and explore employee information with sorting, filtering, and advanced features
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ marginBottom: '24px', flexShrink: 0, backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Available Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Sortable columns</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Column filtering</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Pagination controls</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Column resizing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Column reordering</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Row selection</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Editable cells</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Keyboard navigation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Sticky headers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Row grouping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Aggregations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Footer aggregates</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>✓</span>
              <span style={{ color: '#374151' }}>Context menu</span>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div style={{ marginBottom: '24px', flexShrink: 0, backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '12px', fontSize: '14px' }}>How to use:</h3>
          <ul style={{ fontSize: '14px', color: '#374151', listStyle: 'disc', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '6px' }}>Click column headers to sort data</li>
            <li style={{ marginBottom: '6px' }}>Use filter boxes to search within columns</li>
            <li style={{ marginBottom: '6px' }}>Drag column borders to resize columns</li>
            <li style={{ marginBottom: '6px' }}>Drag headers to reorder columns</li>
            <li style={{ marginBottom: '6px' }}>Click rows to select them (Ctrl+click for multiple)</li>
            <li style={{ marginBottom: '6px' }}>Double-click cells to edit content</li>
            <li style={{ marginBottom: '6px' }}>Right-click on cells or headers for context menu (copy, export, pin, auto-size, etc.)</li>
            <li style={{ marginBottom: '0' }}>Drag headers to the Group By area to group data</li>
          </ul>
          <div style={{ marginTop: '12px' }}>
            <p style={{ marginTop: '12px', color: '#374151', fontSize: '13px' }}>
              Note: import the library stylesheet into your app so the demo styles match the package:
            </p>
          </div>
        </div>

        {/* DataGrid Container */}
        <div style={{ marginBottom: '24px', height: '600px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <div style={{ height: '100%' }}>
            <DataGrid
              columns={columns}
              rows={employees}
              pageSize={10}
              theme="quartz"
              onRowClick={handleRowClick}
              onCellEdit={handleCellEdit}
              onSelectionChange={handleSelectionChange}
              contextMenuConfig={{ enabled: true }}
              footerConfig={{
                show: true,
                showGroupFooters: true,
                aggregates: [
                  { field: 'salary', function: 'total', label: 'Total Salary' },
                  { field: 'salary', function: 'avg', label: 'Avg Salary' },
                  { field: 'salary', function: 'min', label: 'Min Salary' },
                  { field: 'salary', function: 'max', label: 'Max Salary' },
                  { field: 'id', function: 'count', label: 'Total Employees' },
                ],
              }}
            />
          </div>
        </div>

        {/* Info Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', flexShrink: 0 }}>
          {/* Selection Info */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
              Selected Rows <span style={{ color: '#2563eb', fontWeight: 'bold' }}>({selectedIds.length})</span>
            </h3>
            {selectedIds.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>No rows selected. Click on rows to select them.</p>
            ) : (
              <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                {selectedIds.map((id) => {
                  const employee = employees.find((emp) => emp.id === id);
                  return (
                    <div key={id} style={{ fontSize: '14px', color: '#374151', padding: '8px', backgroundColor: '#eff6ff', borderRadius: '4px', border: '1px solid #dbeafe', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#2563eb' }}>ID {id}</span> - {employee?.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Event Log */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
              Event Log <span style={{ color: '#6b7280', fontWeight: 'normal' }}>(Last 10)</span>
            </h3>
            {eventLog.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>No events yet. Try interacting with the grid.</p>
            ) : (
              <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                {eventLog.map((event, index) => (
                  <div
                    key={index}
                    style={{ fontSize: '12px', color: '#4b5563', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', border: '1px solid #e5e7eb', fontFamily: 'monospace', marginBottom: '8px' }}
                  >
                    {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code Examples */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>
            Implementation Examples
          </h2>

          <CodeBlock
            title="Installation & Basic Setup"
            language="tsx"
            code={`
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
/>`}
          />

          <CodeBlock
            title="Using Custom Cell Renderers"
            language="tsx"
            code={`import { DataGrid, StatusChip, CurrencyCell } from 'react-open-source-grid';

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
/>`}
          />

          <CodeBlock
            title="Handling Events"
            language="tsx"
            code={`import { useState } from 'react';
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
}`}
          />

          <CodeBlock
            title="Footer Aggregations"
            language="tsx"
            code={`import { DataGrid} from 'react-open-source-grid';

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
/>`}
          />

          <CodeBlock
            title="Complete Example with All Features"
            language="tsx"
            code={`import React, { useState } from 'react';
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
};`}
          />
        </div>
      </div>
    </div>
  );
};
