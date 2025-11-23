import React, { useState } from 'react';
import { DataGrid, StatusChip, CurrencyCell } from './DataGrid';
import type { Column, Row } from './DataGrid';

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
    <div className="h-full bg-neutral-50 p-6">
      <div className="max-w-full mx-auto h-full flex flex-col">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Employee Directory
          </h1>
          <p className="text-neutral-600 text-sm">
            Manage and explore employee information with sorting, filtering, and advanced features
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 text-neutral-900">Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Sortable columns</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Column filtering</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Pagination controls</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Column resizing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Column reordering</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Row selection</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Editable cells</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Keyboard navigation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Sticky headers</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Row grouping</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Aggregations</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-500 font-semibold mt-0.5">✓</span>
              <span className="text-neutral-700">Footer aggregates</span>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="mb-6 bg-primary-50 border border-primary-200 p-5 rounded-lg">
          <h3 className="font-semibold text-primary-900 mb-3 text-sm">How to use:</h3>
          <ul className="text-sm text-primary-800 space-y-1.5 list-disc list-outside ml-5">
            <li>Click column headers to sort data</li>
            <li>Use filter boxes to search within columns</li>
            <li>Drag column borders to resize columns</li>
            <li>Drag headers to reorder columns</li>
            <li>Click rows to select them (Ctrl+click for multiple)</li>
            <li>Double-click cells to edit content</li>
            <li>Drag headers to the Group By area to group data</li>
          </ul>
        </div>

        {/* DataGrid Container */}
        <div className="mb-6 flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="h-full overflow-auto">
            <DataGrid
              columns={columns}
              rows={employees}
              pageSize={10}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selection Info */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-semibold mb-4 text-neutral-900">
              Selected Rows <span className="text-primary-600 font-bold">({selectedIds.length})</span>
            </h3>
            {selectedIds.length === 0 ? (
              <p className="text-neutral-500 text-sm">No rows selected. Click on rows to select them.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedIds.map((id) => {
                  const employee = employees.find((emp) => emp.id === id);
                  return (
                    <div key={id} className="text-sm text-neutral-700 p-2 bg-primary-50 rounded border border-primary-100">
                      <span className="font-medium text-primary-600">ID {id}</span> - {employee?.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Event Log */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
            <h3 className="text-sm font-semibold mb-4 text-neutral-900">
              Event Log <span className="text-neutral-500 font-normal">(Last 10)</span>
            </h3>
            {eventLog.length === 0 ? (
              <p className="text-neutral-500 text-sm">No events yet. Try interacting with the grid.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {eventLog.map((event, index) => (
                  <div
                    key={index}
                    className="text-xs text-neutral-600 p-2 bg-neutral-100 rounded border border-neutral-200 font-mono"
                  >
                    {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
