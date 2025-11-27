import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { FilteredSearchBar } from './DataGrid/FilteredSearchBar';
import { DataGrid } from './DataGrid';
import { CodeBlock } from './CodeBlock';
/**
 * FilteredSearchDemo - Showcase of Advanced Search with Token-Based Filtering
 * Similar to GitLab/GitHub's advanced search interface
 */
export const FilteredSearchDemo = () => {
    const [searchTokens, setSearchTokens] = useState([]);
    // Sample data
    const [employees] = useState([
        { id: 1, name: 'Alice Johnson', department: 'Engineering', role: 'Senior Engineer', status: 'Active', salary: 120000, joinDate: '2020-01-15' },
        { id: 2, name: 'Bob Smith', department: 'Sales', role: 'Sales Manager', status: 'Active', salary: 95000, joinDate: '2019-06-20' },
        { id: 3, name: 'Charlie Brown', department: 'Engineering', role: 'Junior Engineer', status: 'Active', salary: 75000, joinDate: '2022-03-10' },
        { id: 4, name: 'Diana Prince', department: 'Marketing', role: 'Marketing Director', status: 'Active', salary: 110000, joinDate: '2018-09-05' },
        { id: 5, name: 'Eve Wilson', department: 'Engineering', role: 'Tech Lead', status: 'Active', salary: 135000, joinDate: '2017-11-12' },
        { id: 6, name: 'Frank Miller', department: 'Sales', role: 'Sales Rep', status: 'Inactive', salary: 65000, joinDate: '2021-07-22' },
        { id: 7, name: 'Grace Lee', department: 'HR', role: 'HR Manager', status: 'Active', salary: 90000, joinDate: '2019-02-14' },
        { id: 8, name: 'Henry Ford', department: 'Engineering', role: 'DevOps Engineer', status: 'Active', salary: 105000, joinDate: '2020-08-30' },
        { id: 9, name: 'Ivy Chen', department: 'Marketing', role: 'Content Writer', status: 'Active', salary: 70000, joinDate: '2021-12-01' },
        { id: 10, name: 'Jack Black', department: 'Engineering', role: 'Senior Engineer', status: 'On Leave', salary: 125000, joinDate: '2018-04-18' },
    ]);
    // Filter options configuration
    const filterOptions = [
        {
            field: 'department',
            label: 'Department',
            type: 'select',
            options: ['Engineering', 'Sales', 'Marketing', 'HR'],
            color: '#3b82f6',
        },
        {
            field: 'role',
            label: 'Role',
            type: 'select',
            options: ['Senior Engineer', 'Junior Engineer', 'Tech Lead', 'Sales Manager', 'Sales Rep', 'Marketing Director', 'Content Writer', 'HR Manager', 'DevOps Engineer'],
            color: '#8b5cf6',
        },
        {
            field: 'status',
            label: 'Status',
            type: 'select',
            options: ['Active', 'Inactive', 'On Leave'],
            color: '#10b981',
        },
        {
            field: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Enter name...',
            color: '#ec4899',
        },
        {
            field: 'salary',
            label: 'Salary',
            type: 'number',
            placeholder: 'Enter salary...',
            color: '#f59e0b',
        },
    ];
    // Columns configuration
    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', width: 180, sortable: true, filterable: true },
        { field: 'department', headerName: 'Department', width: 140, sortable: true, filterable: true },
        { field: 'role', headerName: 'Role', width: 180, sortable: true, filterable: true },
        { field: 'status', headerName: 'Status', width: 120, sortable: true, filterable: true },
        { field: 'salary', headerName: 'Salary', width: 120, sortable: true, filterable: true },
        { field: 'joinDate', headerName: 'Join Date', width: 130, sortable: true },
    ];
    // Filter data based on search tokens
    const filteredData = employees.filter(row => {
        return searchTokens.every(token => {
            const cellValue = String(row[token.field] || '').toLowerCase();
            const searchValue = Array.isArray(token.value)
                ? token.value.map(v => String(v).toLowerCase())
                : String(token.value).toLowerCase();
            if (token.operator === 'in' && Array.isArray(searchValue)) {
                return searchValue.includes(cellValue);
            }
            return cellValue.includes(searchValue);
        });
    });
    // Handle search
    const handleSearch = (tokens) => {
        setSearchTokens(tokens);
        console.log('Search tokens:', tokens);
    };
    return (_jsx("div", { style: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }, children: _jsxs("div", { style: { maxWidth: '1400px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '24px' }, children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }, children: "\uD83D\uDD0D Filtered Search Bar" }), _jsx("p", { style: { fontSize: '14px', color: '#64748b' }, children: "Advanced search with token-based filtering - Similar to GitLab/GitHub interface" })] }), _jsxs("div", { style: {
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        border: '1px solid #e2e8f0',
                    }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '12px' }, children: "\u2728 Features:" }), _jsxs("ul", { style: { fontSize: '14px', lineHeight: '1.8', color: '#475569', margin: 0, paddingLeft: '20px' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Token-based filters" }), " - Add multiple search criteria as visual tokens/pills"] }), _jsxs("li", { children: [_jsx("strong", { children: "Autocomplete dropdown" }), " - Smart suggestions as you type"] }), _jsxs("li", { children: [_jsx("strong", { children: "Multi-criteria search" }), " - Combine department, role, status, and more"] }), _jsxs("li", { children: [_jsx("strong", { children: "Keyboard navigation" }), " - Arrow keys, Enter, Escape, Backspace support"] }), _jsxs("li", { children: [_jsx("strong", { children: "Color-coded tokens" }), " - Visual distinction between filter types"] }), _jsxs("li", { children: [_jsx("strong", { children: "Click to remove" }), " - Easy token removal with \u00D7 button"] })] })] }), _jsx("div", { style: { marginBottom: '24px' }, children: _jsx(FilteredSearchBar, { filters: filterOptions, onSearch: handleSearch, placeholder: "Search employees by department, role, status, or name...", maxTokens: 10 }) }), searchTokens.length > 0 && (_jsxs("div", { style: {
                        backgroundColor: '#f1f5f9',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#475569',
                    }, children: [_jsx("strong", { children: "Active Filters:" }), " ", searchTokens.length, " filter(s) applied", ' • ', "Showing ", filteredData.length, " of ", employees.length, " employees"] })), _jsx("div", { style: { marginBottom: '24px' }, children: _jsx(DataGrid, { columns: columns, rows: filteredData, pageSize: 10, theme: "quartz" }) }), _jsxs("div", { style: { marginTop: '30px' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }, children: "\uD83D\uDCD8 Implementation Example" }), _jsx(CodeBlock, { title: "Using FilteredSearchBar", language: "tsx", code: `import { FilteredSearchBar } from './components/DataGrid/FilteredSearchBar';
import type { SearchToken, FilterOption } from './components/DataGrid/FilteredSearchBar';

function EmployeeSearch() {
  const [searchTokens, setSearchTokens] = useState<SearchToken[]>([]);

  // Define available filters
  const filterOptions: FilterOption[] = [
    {
      field: 'department',
      label: 'Department',
      type: 'select',
      options: ['Engineering', 'Sales', 'Marketing', 'HR'],
      color: '#3b82f6', // Blue tokens
    },
    {
      field: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Inactive', 'On Leave'],
      color: '#10b981', // Green tokens
    },
    {
      field: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name...',
      color: '#ec4899', // Pink tokens
    },
  ];

  // Handle search changes
  const handleSearch = (tokens: SearchToken[]) => {
    setSearchTokens(tokens);
    
    // Filter your data
    const filtered = employees.filter(row => {
      return tokens.every(token => {
        const cellValue = String(row[token.field]).toLowerCase();
        const searchValue = String(token.value).toLowerCase();
        return cellValue.includes(searchValue);
      });
    });
    
    setFilteredData(filtered);
  };

  return (
    <>
      <FilteredSearchBar
        filters={filterOptions}
        onSearch={handleSearch}
        placeholder="Search employees..."
        maxTokens={10}
      />
      
      <DataGrid columns={columns} rows={filteredData} />
    </>
  );
}

// Token structure returned by onSearch:
// [
//   {
//     id: 'department-1234567890',
//     field: 'department',
//     label: 'Department',
//     value: 'Engineering',
//     operator: 'contains',
//     color: '#3b82f6'
//   },
//   // ... more tokens
// ]` })] }), _jsxs("div", { style: {
                        marginTop: '24px',
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                    }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '12px' }, children: "\u2328\uFE0F Keyboard Shortcuts:" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', fontSize: '13px' }, children: [_jsxs("div", { children: [_jsx("kbd", { style: { padding: '2px 6px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontFamily: 'monospace' }, children: "\u2191 \u2193" }), " Navigate options"] }), _jsxs("div", { children: [_jsx("kbd", { style: { padding: '2px 6px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontFamily: 'monospace' }, children: "Enter" }), " Select filter/value"] }), _jsxs("div", { children: [_jsx("kbd", { style: { padding: '2px 6px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontFamily: 'monospace' }, children: "Esc" }), " Close dropdown"] }), _jsxs("div", { children: [_jsx("kbd", { style: { padding: '2px 6px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontFamily: 'monospace' }, children: "Backspace" }), " Remove last token"] })] })] })] }) }));
};
export default FilteredSearchDemo;
