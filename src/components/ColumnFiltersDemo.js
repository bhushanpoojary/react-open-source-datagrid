import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { DataGrid } from './DataGrid';
import { CodeBlock } from './CodeBlock';
/**
 * Demo component showcasing the Column Filters feature
 */
export const ColumnFiltersDemo = () => {
    // Sample data with various data types
    const columns = [
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
    const rows = [
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
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }, children: "Column Filters Demo" }), _jsx("p", { style: { color: '#666', marginBottom: '10px' }, children: "Click on the \"Filter...\" boxes below each column header to apply filters." }), _jsxs("div", { style: {
                            backgroundColor: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            borderRadius: '6px',
                            padding: '12px',
                            marginBottom: '15px'
                        }, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#0369a1' }, children: "Available Filter Types:" }), _jsxs("ul", { style: { listStyle: 'disc', paddingLeft: '20px', fontSize: '13px', color: '#075985' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Text Filter" }), " (Name, Position, Email): Contains, Equals, Starts With, Ends With, Not Contains"] }), _jsxs("li", { children: [_jsx("strong", { children: "Number Filter" }), " (Salary): Equals, Greater Than, Less Than, In Range, etc."] }), _jsxs("li", { children: [_jsx("strong", { children: "Date Filter" }), " (Join Date): Equals, Before, After, In Range"] }), _jsxs("li", { children: [_jsx("strong", { children: "Set Filter" }), " (Department, Status): Multi-select from unique values"] })] })] })] }), _jsx("div", { style: {
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }, children: _jsx(DataGrid, { columns: columns, rows: rows, pageSize: 10, theme: "quartz", showColumnPinning: true }) }), _jsxs("div", { style: {
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#fefce8',
                    border: '1px solid #fef08a',
                    borderRadius: '6px'
                }, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#854d0e' }, children: "\uD83D\uDCA1 Tips:" }), _jsxs("ul", { style: { listStyle: 'disc', paddingLeft: '20px', fontSize: '13px', color: '#a16207' }, children: [_jsx("li", { children: "Combine multiple filters - they work with AND logic" }), _jsx("li", { children: "Active filters are highlighted in blue" }), _jsx("li", { children: "Use \"Clear\" button to remove individual filters" }), _jsx("li", { children: "Try the range filters for Salary and Join Date" }), _jsx("li", { children: "Set filters show the count of selected values" })] })] }), _jsxs("div", { style: { marginTop: '32px' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "Implementation Example" }), _jsx(CodeBlock, { title: "Column Filter Configuration", language: "tsx", code: `import { DataGrid} from './components/DataGrid';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 180,
    sortable: true,
    filterable: true,
    filterType: 'text', // Text filter with contains/equals/startsWith/endsWith
  },
  {
    field: 'age',
    headerName: 'Age',
    width: 100,
    sortable: true,
    filterable: true,
    filterType: 'number', // Number filter with equals/greaterThan/lessThan/between
  },
  {
    field: 'department',
    headerName: 'Department',
    width: 150,
    sortable: true,
    filterable: true,
    filterType: 'set', // Set filter with checkbox selection
  },
  {
    field: 'joinDate',
    headerName: 'Join Date',
    width: 130,
    sortable: true,
    filterable: true,
    filterType: 'date', // Date filter with before/after/between
  },
];

<DataGrid
  columns={columns}
  rows={data}
  pageSize={10}
  theme="quartz"
/>` })] })] }));
};
