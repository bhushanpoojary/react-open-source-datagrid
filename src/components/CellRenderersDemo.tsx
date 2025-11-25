import React, { useState } from 'react';
import { ThemedDataGrid } from './DataGrid';
import type { Column, Row } from './DataGrid/types';
import { CodeBlock } from './CodeBlock';
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Page Header */}
      <div style={{ 
        padding: '32px 40px 24px', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#111827', 
          marginBottom: '8px',
          letterSpacing: '-0.01em'
        }}>
          Cell Renderer Framework Demo
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          Showcase of custom cell renderers for rich, interactive data visualization
        </p>
      </div>

      {/* Cell Renderer Features */}
      <div style={{ 
        padding: '24px 40px',
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Features:
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>💠</span>
            <div>
              <strong>StatusChip:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Color-coded status badges with dynamic styling</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <div>
              <strong>ProgressBar:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Visual progress indicators with percentage labels</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🎨</span>
            <div>
              <strong>IconCell:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Cells with icons and optional text</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>👤</span>
            <div>
              <strong>ImageCell:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Avatar/image cells with rounded styling</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🔘</span>
            <div>
              <strong>ButtonCell:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Actionable buttons with multiple variants</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🏷️</span>
            <div>
              <strong>BadgeCell:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Generic badges with custom colors</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>⚡</span>
            <div>
              <strong>PriorityIndicator:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Priority levels with color indicators</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>⭐</span>
            <div>
              <strong>Rating:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Star rating display component</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>💰</span>
            <div>
              <strong>CurrencyCell:</strong>{' '}
              <span style={{ color: '#2563eb' }}>Formatted currency with locale support</span>
            </div>
          </div>
        </div>
      </div>

      {/* DataGrid Container */}
      <div style={{ flex: 1, padding: '24px 40px', overflow: 'auto' }}>
        <ThemedDataGrid
          columns={columns}
          rows={projects}
          pageSize={10}
          theme="quartz"
          footerConfig={{
            show: true,
            aggregates: [
              { field: 'budget', function: 'sum', label: 'Total Budget' },
              { field: 'progress', function: 'avg', label: 'Avg Progress' },
            ],
          }}
        />

        {/* Event Log */}
        {eventLog.length > 0 && (
          <div style={{ 
            marginTop: '24px', 
            padding: '20px', 
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Event Log
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {eventLog.map((event, index) => (
                <div
                  key={index}
                  style={{ 
                    fontSize: '13px', 
                    color: '#1f2937', 
                    fontFamily: 'monospace', 
                    padding: '10px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px'
                  }}
                >
                  {event}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Example */}
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '16px'
          }}>
            Usage Example
          </h3>
          <CodeBlock
            title="Using Cell Renderer Components"
            language="tsx"
            code={`import { DataGrid, StatusChip, ProgressBar, ButtonCell } from './DataGrid';

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

<DataGrid columns={columns} rows={data} />`}
          />
        </div>
      </div>
    </div>
  );
};
