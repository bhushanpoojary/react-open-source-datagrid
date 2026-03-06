import React from 'react';
import { DataGrid } from './DataGrid';
import type { Column, Row } from './DataGrid';

/**
 * HorizontalScrollBugDemo
 * 
 * Reproduces GitHub Issue #1:
 * "Table header does not scroll horizontally with body"
 * 
 * When the grid has many columns that cause horizontal overflow,
 * scrolling the body on X-axis should also scroll the header.
 * 
 * BUG: Only the body scrolls; the header stays fixed causing misalignment.
 */

// Generate 20 columns to force horizontal overflow
const generateColumns = (): Column[] => {
  const cols: Column[] = [
    { field: 'id', headerName: 'ID', width: 80, sortable: true, filterable: true },
    { field: 'firstName', headerName: 'First Name', width: 150, sortable: true, filterable: true, editable: true },
    { field: 'lastName', headerName: 'Last Name', width: 150, sortable: true, filterable: true, editable: true },
    { field: 'email', headerName: 'Email', width: 220, sortable: true, filterable: true },
    { field: 'phone', headerName: 'Phone', width: 160, sortable: true, filterable: true },
    { field: 'department', headerName: 'Department', width: 160, sortable: true, filterable: true },
    { field: 'position', headerName: 'Position', width: 180, sortable: true, filterable: true },
    { field: 'salary', headerName: 'Salary', width: 120, sortable: true, filterable: true },
    { field: 'startDate', headerName: 'Start Date', width: 140, sortable: true, filterable: true },
    { field: 'city', headerName: 'City', width: 140, sortable: true, filterable: true },
    { field: 'state', headerName: 'State', width: 120, sortable: true, filterable: true },
    { field: 'country', headerName: 'Country', width: 140, sortable: true, filterable: true },
    { field: 'zipCode', headerName: 'Zip Code', width: 120, sortable: true, filterable: true },
    { field: 'manager', headerName: 'Manager', width: 160, sortable: true, filterable: true },
    { field: 'team', headerName: 'Team', width: 150, sortable: true, filterable: true },
    { field: 'level', headerName: 'Level', width: 100, sortable: true, filterable: true },
    { field: 'rating', headerName: 'Rating', width: 100, sortable: true, filterable: true },
    { field: 'projects', headerName: 'Projects', width: 120, sortable: true, filterable: true },
    { field: 'skills', headerName: 'Skills', width: 200, sortable: true, filterable: true },
    { field: 'notes', headerName: 'Notes', width: 250, sortable: true, filterable: true },
  ];
  return cols;
};

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Legal', 'Operations', 'Support'];
const positions = ['Engineer', 'Manager', 'Director', 'VP', 'Analyst', 'Lead', 'Coordinator', 'Specialist'];
const cities = ['New York', 'San Francisco', 'Chicago', 'Austin', 'Seattle', 'Boston', 'Denver', 'Portland'];
const states = ['NY', 'CA', 'IL', 'TX', 'WA', 'MA', 'CO', 'OR'];
const teams = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'GraphQL'];

const generateRows = (count: number): Row[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `(555) ${String(100 + (i % 900)).padStart(3, '0')}-${String(1000 + (i % 9000)).padStart(4, '0')}`,
    department: departments[i % departments.length],
    position: positions[i % positions.length],
    salary: 50000 + (i * 2500) % 100000,
    startDate: `202${i % 5}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    city: cities[i % cities.length],
    state: states[i % states.length],
    country: 'USA',
    zipCode: String(10000 + (i * 111) % 89999),
    manager: `Manager${(i % 5) + 1}`,
    team: teams[i % teams.length],
    level: `L${(i % 6) + 1}`,
    rating: ((i % 5) + 1).toFixed(1),
    projects: (i % 10) + 1,
    skills: skills.slice(0, (i % skills.length) + 1).join(', '),
    notes: `Employee notes for row ${i + 1} - Lorem ipsum dolor sit amet`,
  }));
};

const columns = generateColumns();
const rows = generateRows(50);

export const HorizontalScrollBugDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          🐛 Bug #1: Header Does Not Scroll Horizontally With Body
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
          This demo reproduces the bug where the table header stays fixed while the body
          scrolls horizontally. With 20 columns, horizontal overflow is guaranteed.
          Try scrolling the table body to the right — the header should follow but doesn't.
        </p>
        <div style={{
          marginTop: '12px',
          padding: '12px 16px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#92400e',
        }}>
          <strong>Steps to reproduce:</strong> Scroll the grid body horizontally using the scrollbar
          or trackpad. Observe that the column headers become misaligned with the data columns.
        </div>
      </div>

      <DataGrid
        columns={columns}
        rows={rows}
        pageSize={20}
      />
    </div>
  );
};
