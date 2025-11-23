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
    <div className="h-full bg-neutral-50 p-6">
      <div className="max-w-full mx-auto h-full flex flex-col">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Cell Renderer Framework Demo
          </h1>
          <p className="text-neutral-600 text-sm">
            Showcase of custom cell renderers for rich, interactive data visualization
          </p>
        </div>

        {/* Cell Renderer Features */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 text-neutral-900">
            Available Cell Renderers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">StatusChip</span>
              <span className="text-xs text-neutral-600">
                Color-coded status badges with dynamic styling
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">ProgressBar</span>
              <span className="text-xs text-neutral-600">
                Visual progress indicators with percentage labels
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">IconCell</span>
              <span className="text-xs text-neutral-600">
                Cells with icons and optional text
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">ImageCell</span>
              <span className="text-xs text-neutral-600">
                Avatar/image cells with rounded styling
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">ButtonCell</span>
              <span className="text-xs text-neutral-600">
                Actionable buttons with multiple variants
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">BadgeCell</span>
              <span className="text-xs text-neutral-600">
                Generic badges with custom colors
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">PriorityIndicator</span>
              <span className="text-xs text-neutral-600">
                Priority levels with color indicators
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">Rating</span>
              <span className="text-xs text-neutral-600">
                Star rating display component
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-neutral-900">CurrencyCell</span>
              <span className="text-xs text-neutral-600">
                Formatted currency with locale support
              </span>
            </div>
          </div>
        </div>

        {/* DataGrid */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
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
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-sm font-semibold mb-2 text-neutral-900">Event Log</h3>
          <div className="space-y-1">
            {eventLog.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">
                Click on buttons to see events...
              </p>
            ) : (
              eventLog.map((event, index) => (
                <div
                  key={index}
                  className="text-xs text-neutral-700 font-mono bg-neutral-50 p-2 rounded"
                >
                  {event}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold mb-3 text-neutral-900">Usage Example</h3>
          <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg text-xs overflow-x-auto">
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
