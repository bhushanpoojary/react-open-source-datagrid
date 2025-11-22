import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
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
    { field: 'salary', headerName: 'Salary', width: 120, sortable: true, filterable: true, editable: true },
    { field: 'joinDate', headerName: 'Join Date', width: 130, sortable: true, filterable: true, editable: true },
    { field: 'status', headerName: 'Status', width: 100, sortable: true, filterable: true, editable: true },
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            DataGrid Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            A fully-featured React DataGrid similar to AG-Grid
          </p>
        </div>

        {/* Features List */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Sortable columns (click header)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Column filtering (text search)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Pagination (10, 20, 50 rows)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Column resizing (drag border)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Column reordering (drag header)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Row selection (Ctrl/Shift click)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Editable cells (double-click)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Keyboard navigation (arrows)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Sticky header</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Click column header to sort (asc → desc → none)</li>
            <li>Type in filter boxes to filter data</li>
            <li>Drag column borders to resize</li>
            <li>Drag column headers to reorder</li>
            <li>Click row to select (Ctrl+click for multi, Shift+click for range)</li>
            <li>Double-click cell to edit (or press Enter on focused cell)</li>
            <li>Use arrow keys to navigate, Enter to edit, Escape to cancel</li>
          </ul>
        </div>

        {/* DataGrid */}
        <div className="mb-6">
          <DataGrid
            columns={columns}
            rows={employees}
            pageSize={10}
            onRowClick={handleRowClick}
            onCellEdit={handleCellEdit}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        {/* Event Log and Selection Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selection Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Selected Rows ({selectedIds.length})
            </h3>
            {selectedIds.length === 0 ? (
              <p className="text-gray-500 text-sm">No rows selected</p>
            ) : (
              <div className="space-y-1">
                {selectedIds.map((id) => {
                  const employee = employees.find((emp) => emp.id === id);
                  return (
                    <div key={id} className="text-sm text-gray-700">
                      ID: {id} - {employee?.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Event Log */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Event Log (Last 10)
            </h3>
            {eventLog.length === 0 ? (
              <p className="text-gray-500 text-sm">No events yet</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {eventLog.map((event, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-700 py-1 border-b border-gray-100 last:border-0"
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
