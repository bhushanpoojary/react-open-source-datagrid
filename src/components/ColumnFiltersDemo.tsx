import React from 'react';
import { DataGrid } from './DataGrid';
import type { Column, Row } from './DataGrid';

/**
 * Demo component showcasing the Column Filters feature
 */
export const ColumnFiltersDemo: React.FC = () => {
  // Sample data with various data types
  const columns: Column[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      filterable: false, // ID column without filter
    },
    {
      field: 'name',
      headerName: 'Employee Name',
      width: 180,
      filterType: 'text',
      filterable: true,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150,
      filterType: 'set',
      filterable: true,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 150,
      filterType: 'text',
      filterable: true,
    },
    {
      field: 'salary',
      headerName: 'Salary',
      width: 130,
      filterType: 'number',
      filterable: true,
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      width: 140,
      filterType: 'date',
      filterable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      filterType: 'set',
      filterable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      filterType: 'text',
      filterable: true,
    },
  ];

  const rows: Row[] = [
    {
      id: 1,
      name: 'John Doe',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 95000,
      joinDate: '2020-01-15',
      status: 'Active',
      email: 'john.doe@company.com',
    },
    {
      id: 2,
      name: 'Jane Smith',
      department: 'Sales',
      position: 'Sales Manager',
      salary: 85000,
      joinDate: '2019-03-22',
      status: 'Active',
      email: 'jane.smith@company.com',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      department: 'Engineering',
      position: 'Junior Developer',
      salary: 65000,
      joinDate: '2021-06-10',
      status: 'Active',
      email: 'bob.johnson@company.com',
    },
    {
      id: 4,
      name: 'Alice Williams',
      department: 'Marketing',
      position: 'Marketing Director',
      salary: 92000,
      joinDate: '2018-09-05',
      status: 'Active',
      email: 'alice.williams@company.com',
    },
    {
      id: 5,
      name: 'Charlie Brown',
      department: 'Sales',
      position: 'Sales Representative',
      salary: 55000,
      joinDate: '2022-01-20',
      status: 'Active',
      email: 'charlie.brown@company.com',
    },
    {
      id: 6,
      name: 'Diana Prince',
      department: 'Engineering',
      position: 'Tech Lead',
      salary: 110000,
      joinDate: '2017-11-12',
      status: 'Active',
      email: 'diana.prince@company.com',
    },
    {
      id: 7,
      name: 'Eve Davis',
      department: 'HR',
      position: 'HR Manager',
      salary: 78000,
      joinDate: '2019-07-18',
      status: 'On Leave',
      email: 'eve.davis@company.com',
    },
    {
      id: 8,
      name: 'Frank Miller',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 72000,
      joinDate: '2020-05-25',
      status: 'Active',
      email: 'frank.miller@company.com',
    },
    {
      id: 9,
      name: 'Grace Lee',
      department: 'Marketing',
      position: 'Content Strategist',
      salary: 68000,
      joinDate: '2021-02-14',
      status: 'Active',
      email: 'grace.lee@company.com',
    },
    {
      id: 10,
      name: 'Henry Wilson',
      department: 'Engineering',
      position: 'DevOps Engineer',
      salary: 88000,
      joinDate: '2020-08-30',
      status: 'Active',
      email: 'henry.wilson@company.com',
    },
    {
      id: 11,
      name: 'Ivy Chen',
      department: 'Sales',
      position: 'Account Executive',
      salary: 62000,
      joinDate: '2021-11-05',
      status: 'Active',
      email: 'ivy.chen@company.com',
    },
    {
      id: 12,
      name: 'Jack Taylor',
      department: 'Engineering',
      position: 'QA Engineer',
      salary: 70000,
      joinDate: '2021-04-12',
      status: 'Inactive',
      email: 'jack.taylor@company.com',
    },
    {
      id: 13,
      name: 'Kate Anderson',
      department: 'Marketing',
      position: 'Brand Manager',
      salary: 82000,
      joinDate: '2019-12-01',
      status: 'Active',
      email: 'kate.anderson@company.com',
    },
    {
      id: 14,
      name: 'Liam Martinez',
      department: 'Finance',
      position: 'Accountant',
      salary: 64000,
      joinDate: '2022-03-15',
      status: 'Active',
      email: 'liam.martinez@company.com',
    },
    {
      id: 15,
      name: 'Mia Robinson',
      department: 'HR',
      position: 'Recruiter',
      salary: 58000,
      joinDate: '2021-09-08',
      status: 'Active',
      email: 'mia.robinson@company.com',
    },
    {
      id: 16,
      name: 'Noah White',
      department: 'Engineering',
      position: 'Software Architect',
      salary: 125000,
      joinDate: '2016-04-20',
      status: 'Active',
      email: 'noah.white@company.com',
    },
    {
      id: 17,
      name: 'Olivia Harris',
      department: 'Sales',
      position: 'Sales Director',
      salary: 105000,
      joinDate: '2018-02-28',
      status: 'Active',
      email: 'olivia.harris@company.com',
    },
    {
      id: 18,
      name: 'Paul Clark',
      department: 'Marketing',
      position: 'SEO Specialist',
      salary: 66000,
      joinDate: '2020-10-10',
      status: 'Active',
      email: 'paul.clark@company.com',
    },
    {
      id: 19,
      name: 'Quinn Lewis',
      department: 'Finance',
      position: 'Finance Director',
      salary: 115000,
      joinDate: '2017-06-15',
      status: 'Active',
      email: 'quinn.lewis@company.com',
    },
    {
      id: 20,
      name: 'Rachel Young',
      department: 'HR',
      position: 'HR Director',
      salary: 98000,
      joinDate: '2018-08-22',
      status: 'On Leave',
      email: 'rachel.young@company.com',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          Column Filters Demo
        </h1>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Click on the "Filter..." boxes below each column header to apply filters.
        </p>
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '15px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#0369a1' }}>
            Available Filter Types:
          </h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '13px', color: '#075985' }}>
            <li><strong>Text Filter</strong> (Name, Position, Email): Contains, Equals, Starts With, Ends With, Not Contains</li>
            <li><strong>Number Filter</strong> (Salary): Equals, Greater Than, Less Than, In Range, etc.</li>
            <li><strong>Date Filter</strong> (Join Date): Equals, Before, After, In Range</li>
            <li><strong>Set Filter</strong> (Department, Status): Multi-select from unique values</li>
          </ul>
        </div>
      </div>

      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <DataGrid
          columns={columns}
          rows={rows}
          pageSize={10}
          showColumnPinning={true}
        />
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fefce8',
        border: '1px solid #fef08a',
        borderRadius: '6px'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#854d0e' }}>
          💡 Tips:
        </h3>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '13px', color: '#a16207' }}>
          <li>Combine multiple filters - they work with AND logic</li>
          <li>Active filters are highlighted in blue</li>
          <li>Use "Clear" button to remove individual filters</li>
          <li>Try the range filters for Salary and Join Date</li>
          <li>Set filters show the count of selected values</li>
        </ul>
      </div>
    </div>
  );
};
