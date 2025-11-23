import React, { useState } from 'react';
import { ThemedDataGrid, StatusChip, CurrencyCell } from './DataGrid';
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
export const DemoGridPage: React.FC = () => {
  // Sample data: Employee records
  const [employees, setEmployees] = useState<Row[]>([
    { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'Engineering', salary: 95000, joinDate: '2020-03-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', position: 'Product Manager', department: 'Product', salary: 110000, joinDate: '2019-07-22', status: 'Active' },
    { id: 3, name: 'Bob Johnson', position: 'UX Designer', department: 'Design', salary: 85000, joinDate: '2021-01-10', status: 'Active' },
    { id: 4, name: 'Alice Williams', position: 'DevOps Engineer', department: 'Engineering', salary: 100000, joinDate: '2020-09-05', status: 'Active' },
    { id: 5, name: 'Charlie Brown', position: 'Data Analyst', department: 'Analytics', salary: 80000, joinDate: '2021-06-12', status: 'Active' },
    { id: 6, name: 'Diana Prince', position: 'Marketing Manager', department: 'Marketing', salary: 95000, joinDate: '2019-11-30', status: 'Active' },
    { id: 7, name: 'Evan Davis', position: 'Sales Representative', department: 'Sales', salary: 70000, joinDate: '2022-02-14', status: 'Active' },
    { id: 8, name: 'Fiona Garcia', position: 'HR Specialist', department: 'Human Resources', salary: 75000, joinDate: '2020-05-20', status: 'Active' },
    { id: 9, name: 'George Miller', position: 'QA Engineer', department: 'Engineering', salary: 82000, joinDate: '2021-08-03', status: 'Active' },
    { id: 10, name: 'Hannah Wilson', position: 'Content Writer', department: 'Marketing', salary: 65000, joinDate: '2022-01-25', status: 'Active' },
    { id: 11, name: 'Ian Moore', position: 'Backend Developer', department: 'Engineering', salary: 98000, joinDate: '2020-10-12', status: 'Active' },
    { id: 12, name: 'Julia Taylor', position: 'Frontend Developer', department: 'Engineering', salary: 92000, joinDate: '2021-03-08', status: 'Active' },
    { id: 13, name: 'Kevin Anderson', position: 'Business Analyst', department: 'Analytics', salary: 88000, joinDate: '2019-12-15', status: 'Active' },
    { id: 14, name: 'Laura Thomas', position: 'UI Designer', department: 'Design', salary: 83000, joinDate: '2021-05-19', status: 'Active' },
    { id: 15, name: 'Michael Jackson', position: 'System Administrator', department: 'IT', salary: 79000, joinDate: '2020-07-30', status: 'Active' },
    { id: 16, name: 'Nina White', position: 'Customer Support', department: 'Support', salary: 60000, joinDate: '2022-03-11', status: 'Active' },
    { id: 17, name: 'Oscar Harris', position: 'Senior Engineer', department: 'Engineering', salary: 120000, joinDate: '2018-04-20', status: 'Active' },
    { id: 18, name: 'Paula Martin', position: 'Scrum Master', department: 'Engineering', salary: 105000, joinDate: '2020-08-15', status: 'Active' },
    { id: 19, name: 'Quinn Lee', position: 'Security Analyst', department: 'Security', salary: 93000, joinDate: '2021-11-05', status: 'Active' },
    { id: 20, name: 'Rachel Walker', position: 'Finance Manager', department: 'Finance', salary: 115000, joinDate: '2019-06-10', status: 'Active' },
    { id: 21, name: 'Samuel Hall', position: 'Legal Counsel', department: 'Legal', salary: 125000, joinDate: '2019-01-15', status: 'Active' },
    { id: 22, name: 'Tina Allen', position: 'Technical Writer', department: 'Documentation', salary: 72000, joinDate: '2021-09-20', status: 'Active' },
    { id: 23, name: 'Uma Young', position: 'Cloud Architect', department: 'Engineering', salary: 135000, joinDate: '2018-11-12', status: 'Active' },
    { id: 24, name: 'Victor King', position: 'Mobile Developer', department: 'Engineering', salary: 96000, joinDate: '2020-12-08', status: 'Active' },
    { id: 25, name: 'Wendy Scott', position: 'Account Manager', department: 'Sales', salary: 85000, joinDate: '2021-04-22', status: 'Active' },
  ]);

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
            <li style={{ marginBottom: '0' }}>Drag headers to the Group By area to group data</li>
          </ul>
        </div>

        {/* DataGrid Container */}
        <div style={{ marginBottom: '24px', flex: '1 1 auto', minHeight: '500px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ height: '100%', overflow: 'auto' }}>
            <ThemedDataGrid
              columns={columns}
              rows={employees}
              pageSize={10}
              theme="quartz"
              onRowClick={handleRowClick}
              onCellEdit={handleCellEdit}
              onSelectionChange={handleSelectionChange}
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
            code={`// Install the package
npm install react-open-source-grid

// Import the DataGrid
import { ThemedDataGrid } from 'react-open-source-grid';
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

<ThemedDataGrid
  columns={columns}
  rows={employees}
  pageSize={10}
  theme="quartz"
/>`}
          />

          <CodeBlock
            title="Using Custom Cell Renderers"
            language="tsx"
            code={`import { ThemedDataGrid, StatusChip, CurrencyCell } from 'react-open-source-grid';

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

<ThemedDataGrid
  columns={columns}
  rows={data}
  pageSize={10}
/>`}
          />

          <CodeBlock
            title="Handling Events"
            language="tsx"
            code={`import { useState } from 'react';
import { ThemedDataGrid } from 'react-open-source-grid';

function MyComponent() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [data, setData] = useState<Row[]>(initialData);

  return (
    <ThemedDataGrid
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
            code={`import { ThemedDataGrid } from 'react-open-source-grid';

<ThemedDataGrid
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
import { ThemedDataGrid, StatusChip, CurrencyCell } from 'react-open-source-grid';
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
    <ThemedDataGrid
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
