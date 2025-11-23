import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
import type { Column, Row } from './DataGrid';
import {
  StatusChip,
  ProgressBar,
  ImageCell,
  ButtonCell,
  BadgeCell,
  PriorityIndicator,
  Rating,
  CurrencyCell,
} from './DataGrid';

/**
 * CellRenderersDemo - Showcase of Custom Cell Renderer Framework
 * 
 * This demo demonstrates all available custom cell renderers:
 * - StatusChip: Color-coded status badges
 * - ProgressBar: Visual progress indicators
 * - IconCell: Cells with icons
 * - ImageCell: Cells with images/avatars
 * - ButtonCell: Actionable buttons
 * - BadgeCell: Generic badge component
 * - PriorityIndicator: Priority levels
 * - Rating: Star ratings
 * - CurrencyCell: Formatted currency values
 */
export const CellRenderersDemo: React.FC = () => {
  const [eventLog, setEventLog] = useState<string[]>([]);

  // Sample data showcasing different cell renderers
  const [projects] = useState<Row[]>([
    {
      id: 1,
      name: 'Website Redesign',
      status: 'Active',
      priority: 'high',
      progress: 75,
      assignee: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      budget: 50000,
      rating: 4,
      category: 'Design',
      department: 'Engineering',
    },
    {
      id: 2,
      name: 'Mobile App Development',
      status: 'Pending',
      priority: 'critical',
      progress: 45,
      assignee: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      budget: 120000,
      rating: 5,
      category: 'Development',
      department: 'Engineering',
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      status: 'Completed',
      priority: 'medium',
      progress: 100,
      assignee: 'Bob Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      budget: 30000,
      rating: 3,
      category: 'Marketing',
      department: 'Marketing',
    },
    {
      id: 4,
      name: 'Database Migration',
      status: 'Active',
      priority: 'high',
      progress: 60,
      assignee: 'Alice Williams',
      avatar: 'https://i.pravatar.cc/150?img=4',
      budget: 80000,
      rating: 4,
      category: 'Infrastructure',
      department: 'Engineering',
    },
    {
      id: 5,
      name: 'Security Audit',
      status: 'Pending',
      priority: 'critical',
      progress: 20,
      assignee: 'Charlie Brown',
      avatar: 'https://i.pravatar.cc/150?img=5',
      budget: 65000,
      rating: 5,
      category: 'Security',
      department: 'Security',
    },
    {
      id: 6,
      name: 'Customer Portal',
      status: 'Active',
      priority: 'high',
      progress: 85,
      assignee: 'Diana Prince',
      avatar: 'https://i.pravatar.cc/150?img=6',
      budget: 95000,
      rating: 4,
      category: 'Development',
      department: 'Engineering',
    },
    {
      id: 7,
      name: 'Content Management System',
      status: 'Inactive',
      priority: 'low',
      progress: 10,
      assignee: 'Evan Davis',
      avatar: 'https://i.pravatar.cc/150?img=7',
      budget: 45000,
      rating: 2,
      category: 'Development',
      department: 'Engineering',
    },
    {
      id: 8,
      name: 'API Integration',
      status: 'Active',
      priority: 'medium',
      progress: 55,
      assignee: 'Fiona Garcia',
      avatar: 'https://i.pravatar.cc/150?img=8',
      budget: 70000,
      rating: 4,
      category: 'Development',
      department: 'Engineering',
    },
    {
      id: 9,
      name: 'Analytics Dashboard',
      status: 'Completed',
      priority: 'medium',
      progress: 100,
      assignee: 'George Miller',
      avatar: 'https://i.pravatar.cc/150?img=9',
      budget: 55000,
      rating: 5,
      category: 'Analytics',
      department: 'Analytics',
    },
    {
      id: 10,
      name: 'Cloud Infrastructure',
      status: 'Active',
      priority: 'critical',
      progress: 70,
      assignee: 'Hannah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=10',
      budget: 150000,
      rating: 4,
      category: 'Infrastructure',
      department: 'Engineering',
    },
  ]);

  // Add event to log
  const addToLog = (message: string) => {
    setEventLog((prev) => [message, ...prev].slice(0, 10));
  };

  // Handle button clicks
  const handleViewDetails = (row: Row) => {
    addToLog(`View details clicked for: ${row.name}`);
  };

  const handleEdit = (row: Row) => {
    addToLog(`Edit clicked for: ${row.name}`);
  };

  const handleDelete = (row: Row) => {
    addToLog(`Delete clicked for: ${row.name}`);
  };

  // Column definitions with custom cell renderers
  const columns: Column[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      sortable: true,
      filterable: true,
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      width: 200,
      sortable: true,
      filterable: true,
      renderCell: (row) => (
        <ImageCell
          src={row.avatar}
          alt={row.assignee}
          text={row.assignee}
          size={28}
        />
      ),
    },
    {
      field: 'name',
      headerName: 'Project Name',
      width: 220,
      sortable: true,
      filterable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: true,
      filterable: true,
      renderCell: (row) => <StatusChip status={row.status} />,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 140,
      sortable: true,
      filterable: true,
      renderCell: (row) => <PriorityIndicator priority={row.priority} />,
    },
    {
      field: 'progress',
      headerName: 'Progress',
      width: 180,
      sortable: true,
      renderCell: (row) => <ProgressBar value={row.progress} />,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 140,
      sortable: true,
      filterable: true,
      renderCell: (row) => (
        <BadgeCell
          text={row.category}
          backgroundColor="#e0e7ff"
          color="#3730a3"
        />
      ),
    },
    {
      field: 'budget',
      headerName: 'Budget',
      width: 130,
      sortable: true,
      renderCell: (row) => <CurrencyCell amount={row.budget} />,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 130,
      sortable: true,
      renderCell: (row) => <Rating rating={row.rating} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 280,
      renderCell: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <ButtonCell
            label="View"
            onClick={() => handleViewDetails(row)}
            variant="secondary"
          />
          <ButtonCell
            label="Edit"
            onClick={() => handleEdit(row)}
            variant="primary"
          />
          <ButtonCell
            label="Delete"
            onClick={() => handleDelete(row)}
            variant="danger"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="h-full bg-white p-8">
      <div className="max-w-full mx-auto h-full flex flex-col">
        {/* Page Header */}
        <div className="mb-6">
          <h1 style={{fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '4px'}}>
            Cell Renderer Framework Demo
          </h1>
          <p style={{fontSize: '14px', color: '#666'}}>
            Showcase of custom cell renderers for rich, interactive data visualization
          </p>
        </div>

        {/* Cell Renderer Features */}
        <div style={{marginBottom: '20px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px'}}>
          <h3 style={{fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '12px'}}>
            Features:
          </h3>
          <ul style={{margin: 0, paddingLeft: '20px', lineHeight: '1.8'}}>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>StatusChip:</strong> <span style={{color: '#0066cc'}}>Color-coded status badges with dynamic styling</span>
            </li>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>ProgressBar:</strong> <span style={{color: '#0066cc'}}>Visual progress indicators with percentage labels</span>
            </li>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>IconCell:</strong> <span style={{color: '#0066cc'}}>Cells with icons and optional text</span>
            </li>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>ImageCell:</strong> <span style={{color: '#0066cc'}}>Avatar/image cells with rounded styling</span>
            </li>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>ButtonCell:</strong> <span style={{color: '#0066cc'}}>Actionable buttons with multiple variants</span>
            </li>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>BadgeCell:</strong> <span style={{color: '#0066cc'}}>Generic badges with custom colors</span>
            </li>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>PriorityIndicator:</strong> <span style={{color: '#0066cc'}}>Priority levels with color indicators</span>
            </li>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>Rating:</strong> <span style={{color: '#0066cc'}}>Star rating display component</span>
            </li>
            <li style={{fontSize: '14px', color: '#333'}}>
              <strong>CurrencyCell:</strong> <span style={{color: '#0066cc'}}>Formatted currency with locale support</span>
            </li>
          </ul>
        </div>

        {/* DataGrid */}
        <div className="flex-1" style={{border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px'}}>
          <DataGrid
            columns={columns}
            rows={projects}
            pageSize={10}
            footerConfig={{
              show: true,
              aggregates: [
                { field: 'budget', function: 'sum', label: 'Total Budget' },
                { field: 'progress', function: 'avg', label: 'Avg Progress' },
              ],
            }}
          />
        </div>

        {/* Event Log */}
        <div style={{marginTop: '20px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px'}}>
          <h3 style={{fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px'}}>Event Log</h3>
          <div style={{fontSize: '13px'}}>
            {eventLog.length === 0 ? (
              <p style={{color: '#999', fontStyle: 'italic'}}>
                Click on buttons to see events...
              </p>
            ) : (
              eventLog.map((event, index) => (
                <div
                  key={index}
                  style={{fontSize: '12px', color: '#333', fontFamily: 'monospace', padding: '8px', marginBottom: '4px', backgroundColor: '#f5f5f5', borderRadius: '2px'}}
                >
                  {event}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Usage Example */}
        <div style={{marginTop: '20px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#f9f9f9'}}>
          <h3 style={{fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px'}}>Usage Example</h3>
          <pre style={{backgroundColor: '#2d2d2d', color: '#f8f8f2', padding: '12px', borderRadius: '4px', fontSize: '13px', overflow: 'auto', margin: 0}}>
            <code>{`import { DataGrid, StatusChip, ProgressBar, ButtonCell } from './DataGrid';

const columns = [
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (row) => <StatusChip status={row.status} />
  },
  {
    field: 'progress',
    headerName: 'Progress',
    renderCell: (row) => <ProgressBar value={row.progress} />
  },
  {
    field: 'actions',
    headerName: 'Actions',
    renderCell: (row) => (
      <ButtonCell 
        label="View" 
        onClick={() => handleView(row)} 
        variant="primary"
      />
    )
  }
];

<DataGrid columns={columns} rows={data} />`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
