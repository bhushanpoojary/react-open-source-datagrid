import React, { useState } from 'react';
import { DataGrid, StatusChip, CurrencyCell } from './DataGrid';
import type { Column, Row } from './DataGrid';
import { CodeBlock } from './CodeBlock';

/**
 * GroupByDemo - Demonstrates the Group By feature
 * 
 * Shows how to use drag-and-drop grouping to organize data hierarchically
 */

// Helper function to generate employee data
const generateEmployeeData = (count: number): Row[] => {
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Evan', 'Fiona'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Garcia', 'Miller', 'Wilson'];
  const positions = ['Software Engineer', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Data Analyst'];
  const departments = ['Engineering', 'Product', 'Design', 'Analytics', 'Marketing'];
  const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Pending'];
  
  const employees: Row[] = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[(i - 1) % firstNames.length];
    const lastName = lastNames[Math.floor((i - 1) / firstNames.length) % lastNames.length];
    const name = `${firstName} ${lastName}`;
    
    const year = 2020 + (i % 5);
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

export const GroupByDemo: React.FC = () => {
  const [employees] = useState<Row[]>(generateEmployeeData(50));

  // Column definitions
  const columns: Column[] = [
    { field: 'id', headerName: 'ID', width: 70, sortable: true, filterable: true },
    { field: 'name', headerName: 'Name', width: 180, sortable: true, filterable: true },
    { field: 'position', headerName: 'Position', width: 200, sortable: true, filterable: true },
    { field: 'department', headerName: 'Department', width: 160, sortable: true, filterable: true },
    { 
      field: 'salary', 
      headerName: 'Salary', 
      width: 120, 
      sortable: true, 
      filterable: true,
      renderCell: (row) => <CurrencyCell amount={row.salary} />
    },
    { field: 'joinDate', headerName: 'Join Date', width: 130, sortable: true, filterable: true },
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
    <div style={{ height: '100%', backgroundColor: '#f9fafb', padding: '24px', overflow: 'auto' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            🗂️ Group By Feature
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Organize data hierarchically by dragging column headers to the Group By panel
          </p>
        </div>

        {/* Feature Overview */}
        <div style={{ 
          marginBottom: '24px', 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
          border: '1px solid #e5e7eb' 
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            ✨ Key Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🎯</span>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Drag & Drop Grouping</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Simply drag column headers to the Group By panel to create hierarchical views
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Multiple Levels</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Group by multiple columns to create nested hierarchies
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🔢</span>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Aggregation Support</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Automatically calculates totals, averages, min, max for each group
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>↕️</span>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Reorder Groups</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Drag grouped columns to reorder hierarchy levels
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🎨</span>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Visual Indicators</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Clear expand/collapse icons and indentation for grouped rows
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>⚡</span>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>High Performance</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Efficiently handles large datasets with virtual scrolling
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div style={{ 
          marginBottom: '24px', 
          backgroundColor: '#eff6ff', 
          border: '1px solid #bfdbfe', 
          padding: '20px', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>
            📖 How to Use Group By
          </h3>
          <ol style={{ fontSize: '14px', color: '#1e3a8a', paddingLeft: '20px', lineHeight: '1.8', margin: 0 }}>
            <li><strong>Drag a column header</strong> to the "Group By" panel at the top of the grid</li>
            <li><strong>Add multiple columns</strong> to create nested groupings (e.g., Department → Position)</li>
            <li><strong>Click the expand/collapse icons</strong> (▶/▼) to show or hide group contents</li>
            <li><strong>Reorder groups</strong> by dragging them within the Group By panel</li>
            <li><strong>Remove a group</strong> by clicking the × icon next to the grouped column</li>
            <li><strong>View aggregations</strong> in the footer to see totals, averages, and counts per group</li>
          </ol>
        </div>

        {/* Interactive Demo */}
        <div style={{ 
          marginBottom: '24px', 
          height: '600px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
          border: '1px solid #e5e7eb' 
        }}>
          <div style={{ height: '100%' }}>
            <DataGrid
              columns={columns}
              rows={employees}
              pageSize={50}
              theme="quartz"
              footerConfig={{
                show: true,
                showGroupFooters: true,
                aggregates: [
                  { field: 'salary', function: 'total', label: 'Total Salary' },
                  { field: 'salary', function: 'avg', label: 'Avg Salary' },
                  { field: 'id', function: 'count', label: 'Count' },
                ],
              }}
            />
          </div>
        </div>

        {/* Code Examples */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            💻 Code Examples
          </h2>
          
          {/* Basic Setup */}
          <div style={{ marginBottom: '24px' }}>
            <CodeBlock
              title="Basic Setup with Group By"
              examples={[
                {
                  label: 'TypeScript',
                  code: `import { DataGrid } from 'react-open-source-grid';
import type { Column, Row } from 'react-open-source-grid';

const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'department', headerName: 'Department', width: 160 },
  { field: 'position', headerName: 'Position', width: 200 },
  { field: 'salary', headerName: 'Salary', width: 120 },
];

const rows: Row[] = [
  { id: 1, name: 'John Doe', department: 'Engineering', position: 'Software Engineer', salary: 85000 },
  { id: 2, name: 'Jane Smith', department: 'Engineering', position: 'Senior Engineer', salary: 110000 },
  { id: 3, name: 'Bob Johnson', department: 'Product', position: 'Product Manager', salary: 95000 },
  // ... more rows
];

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pageSize={25}
    />
  );
}`,
                  language: 'tsx',
                },
                {
                  label: 'JavaScript',
                  code: `import { DataGrid } from 'react-open-source-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'department', headerName: 'Department', width: 160 },
  { field: 'position', headerName: 'Position', width: 200 },
  { field: 'salary', headerName: 'Salary', width: 120 },
];

const rows = [
  { id: 1, name: 'John Doe', department: 'Engineering', position: 'Software Engineer', salary: 85000 },
  { id: 2, name: 'Jane Smith', department: 'Engineering', position: 'Senior Engineer', salary: 110000 },
  { id: 3, name: 'Bob Johnson', department: 'Product', position: 'Product Manager', salary: 95000 },
  // ... more rows
];

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pageSize={25}
    />
  );
}`,
                  language: 'jsx',
                },
              ]}
            />
          </div>

          {/* With Aggregations */}
          <div style={{ marginBottom: '24px' }}>
            <CodeBlock
              title="Group By with Footer Aggregations"
              examples={[
                {
                  label: 'TypeScript',
                  code: `import { DataGrid } from 'react-open-source-grid';
import type { Column, Row, FooterConfig } from 'react-open-source-grid';

const columns: Column[] = [
  { field: 'department', headerName: 'Department', width: 160 },
  { field: 'position', headerName: 'Position', width: 200 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'salary', headerName: 'Salary', width: 120 },
];

const rows: Row[] = [
  // ... your data
];

const footerConfig: FooterConfig = {
  show: true,
  showGroupFooters: true, // Enable group-level aggregations
  aggregates: [
    { field: 'salary', function: 'total', label: 'Total Salary' },
    { field: 'salary', function: 'avg', label: 'Average Salary' },
    { field: 'salary', function: 'min', label: 'Min Salary' },
    { field: 'salary', function: 'max', label: 'Max Salary' },
    { field: 'id', function: 'count', label: 'Employee Count' },
  ],
};

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      footerConfig={footerConfig}
    />
  );
}`,
                  language: 'tsx',
                },
                {
                  label: 'JavaScript',
                  code: `import { DataGrid } from 'react-open-source-grid';

const columns = [
  { field: 'department', headerName: 'Department', width: 160 },
  { field: 'position', headerName: 'Position', width: 200 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'salary', headerName: 'Salary', width: 120 },
];

const rows = [
  // ... your data
];

const footerConfig = {
  show: true,
  showGroupFooters: true, // Enable group-level aggregations
  aggregates: [
    { field: 'salary', function: 'total', label: 'Total Salary' },
    { field: 'salary', function: 'avg', label: 'Average Salary' },
    { field: 'salary', function: 'min', label: 'Min Salary' },
    { field: 'salary', function: 'max', label: 'Max Salary' },
    { field: 'id', function: 'count', label: 'Employee Count' },
  ],
};

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      footerConfig={footerConfig}
    />
  );
}`,
                  language: 'jsx',
                },
              ]}
            />
          </div>

          {/* Programmatic Group By */}
          <div style={{ marginBottom: '24px' }}>
            <CodeBlock
              title="Programmatic Group By Control"
              examples={[
                {
                  label: 'TypeScript',
                  code: `import { DataGrid } from 'react-open-source-grid';
import type { Column, Row, GridApi } from 'react-open-source-grid';
import { useRef, useEffect } from 'react';

function App() {
  const gridApiRef = useRef<GridApi | null>(null);

  const columns: Column[] = [
    { field: 'department', headerName: 'Department', width: 160 },
    { field: 'position', headerName: 'Position', width: 200 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'salary', headerName: 'Salary', width: 120 },
  ];

  const rows: Row[] = [
    // ... your data
  ];

  useEffect(() => {
    if (gridApiRef.current) {
      // Programmatically set grouping by department
      gridApiRef.current.setGroupBy(['department']);
      
      // Or group by multiple columns
      // gridApiRef.current.setGroupBy(['department', 'position']);
    }
  }, []);

  const handleGroupByDepartment = () => {
    gridApiRef.current?.setGroupBy(['department']);
  };

  const handleGroupByDepartmentAndPosition = () => {
    gridApiRef.current?.setGroupBy(['department', 'position']);
  };

  const handleClearGrouping = () => {
    gridApiRef.current?.setGroupBy([]);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button onClick={handleGroupByDepartment}>
          Group by Department
        </button>
        <button onClick={handleGroupByDepartmentAndPosition}>
          Group by Department & Position
        </button>
        <button onClick={handleClearGrouping}>
          Clear Grouping
        </button>
      </div>
      
      <DataGrid
        columns={columns}
        rows={rows}
        gridApiRef={gridApiRef}
      />
    </div>
  );
}`,
                  language: 'tsx',
                },
                {
                  label: 'JavaScript',
                  code: `import { DataGrid } from 'react-open-source-grid';
import { useRef, useEffect } from 'react';

function App() {
  const gridApiRef = useRef(null);

  const columns = [
    { field: 'department', headerName: 'Department', width: 160 },
    { field: 'position', headerName: 'Position', width: 200 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'salary', headerName: 'Salary', width: 120 },
  ];

  const rows = [
    // ... your data
  ];

  useEffect(() => {
    if (gridApiRef.current) {
      // Programmatically set grouping by department
      gridApiRef.current.setGroupBy(['department']);
      
      // Or group by multiple columns
      // gridApiRef.current.setGroupBy(['department', 'position']);
    }
  }, []);

  const handleGroupByDepartment = () => {
    gridApiRef.current?.setGroupBy(['department']);
  };

  const handleGroupByDepartmentAndPosition = () => {
    gridApiRef.current?.setGroupBy(['department', 'position']);
  };

  const handleClearGrouping = () => {
    gridApiRef.current?.setGroupBy([]);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button onClick={handleGroupByDepartment}>
          Group by Department
        </button>
        <button onClick={handleGroupByDepartmentAndPosition}>
          Group by Department & Position
        </button>
        <button onClick={handleClearGrouping}>
          Clear Grouping
        </button>
      </div>
      
      <DataGrid
        columns={columns}
        rows={rows}
        gridApiRef={gridApiRef}
      />
    </div>
  );
}`,
                  language: 'jsx',
                },
              ]}
            />
          </div>
        </div>

        {/* Additional Tips */}
        <div style={{ 
          marginBottom: '24px', 
          backgroundColor: '#fef3c7', 
          border: '1px solid #fcd34d', 
          padding: '20px', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>
            💡 Pro Tips
          </h3>
          <ul style={{ fontSize: '14px', color: '#78350f', paddingLeft: '20px', lineHeight: '1.8', margin: 0 }}>
            <li>Group by lower cardinality columns first (e.g., Department before Employee Name) for better performance</li>
            <li>Use <code style={{ padding: '2px 6px', backgroundColor: '#fed7aa', borderRadius: '3px', fontFamily: 'monospace', fontSize: '13px' }}>showGroupFooters: true</code> to display aggregations for each group</li>
            <li>Combine grouping with sorting and filtering for powerful data analysis</li>
            <li>The Group By panel supports keyboard navigation for accessibility</li>
            <li>Grouped state persists across data updates automatically</li>
          </ul>
        </div>

        {/* Use Cases */}
        <div style={{ 
          marginBottom: '24px', 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
          border: '1px solid #e5e7eb' 
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            🎯 Common Use Cases
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', fontSize: '14px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>📊 Sales Analysis</div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Group by Region → Country → Sales Rep to analyze sales hierarchy
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>👥 HR Reports</div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Group by Department → Position to view organizational structure
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>💰 Financial Data</div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Group by Category → Sub-category to analyze expenses
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>📦 Inventory</div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Group by Warehouse → Category → Product for stock overview
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>📅 Project Management</div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Group by Status → Priority → Assignee for task organization
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>🛒 E-commerce</div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Group by Category → Brand → Product for catalog management
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupByDemo;
