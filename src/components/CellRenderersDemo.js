import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
import { CodeBlock } from './CodeBlock';
import { StatusChip, ProgressBar, ImageCell, ButtonCell, BadgeCell, PriorityIndicator, Rating, CurrencyCell, } from './DataGrid';
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
export const CellRenderersDemo = () => {
    const [eventLog, setEventLog] = useState([]);
    // Sample data showcasing different cell renderers
    const [projects] = useState([
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
    const addToLog = (message) => {
        setEventLog((prev) => [message, ...prev].slice(0, 10));
    };
    // Handle button clicks
    const handleViewDetails = (row) => {
        addToLog(`View details clicked for: ${row.name}`);
    };
    const handleEdit = (row) => {
        addToLog(`Edit clicked for: ${row.name}`);
    };
    const handleDelete = (row) => {
        addToLog(`Delete clicked for: ${row.name}`);
    };
    // Column definitions with custom cell renderers
    const columns = [
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
            renderCell: (row) => (_jsx(ImageCell, { src: row.avatar, alt: row.assignee, text: row.assignee, size: 28 })),
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
            renderCell: (row) => _jsx(StatusChip, { status: row.status }),
        },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 140,
            sortable: true,
            filterable: true,
            renderCell: (row) => _jsx(PriorityIndicator, { priority: row.priority }),
        },
        {
            field: 'progress',
            headerName: 'Progress',
            width: 180,
            sortable: true,
            renderCell: (row) => _jsx(ProgressBar, { value: row.progress }),
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 140,
            sortable: true,
            filterable: true,
            renderCell: (row) => (_jsx(BadgeCell, { text: row.category, backgroundColor: "#e0e7ff", color: "#3730a3" })),
        },
        {
            field: 'budget',
            headerName: 'Budget',
            width: 130,
            sortable: true,
            renderCell: (row) => _jsx(CurrencyCell, { amount: row.budget }),
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 130,
            sortable: true,
            renderCell: (row) => _jsx(Rating, { rating: row.rating }),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 280,
            renderCell: (row) => (_jsxs("div", { style: { display: 'flex', gap: '6px' }, children: [_jsx(ButtonCell, { label: "View", onClick: () => handleViewDetails(row), variant: "secondary" }), _jsx(ButtonCell, { label: "Edit", onClick: () => handleEdit(row), variant: "primary" }), _jsx(ButtonCell, { label: "Delete", onClick: () => handleDelete(row), variant: "danger" })] })),
        },
    ];
    return (_jsxs("div", { style: { height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }, children: [_jsxs("div", { style: {
                    padding: '32px 40px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff'
                }, children: [_jsx("h1", { style: {
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#111827',
                            marginBottom: '8px',
                            letterSpacing: '-0.01em'
                        }, children: "Cell Renderer Framework Demo" }), _jsx("p", { style: {
                            fontSize: '15px',
                            color: '#6b7280',
                            lineHeight: '1.5'
                        }, children: "Showcase of custom cell renderers for rich, interactive data visualization" })] }), _jsxs("div", { style: {
                    padding: '24px 40px',
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb'
                }, children: [_jsx("h3", { style: {
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }, children: "Features:" }), _jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '12px'
                        }, children: [_jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\uD83D\uDCA0" }), _jsxs("div", { children: [_jsx("strong", { children: "StatusChip:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Color-coded status badges with dynamic styling" })] })] }), _jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\uD83D\uDCCA" }), _jsxs("div", { children: [_jsx("strong", { children: "ProgressBar:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Visual progress indicators with percentage labels" })] })] }), _jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\uD83C\uDFA8" }), _jsxs("div", { children: [_jsx("strong", { children: "IconCell:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Cells with icons and optional text" })] })] }), _jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\uD83D\uDC64" }), _jsxs("div", { children: [_jsx("strong", { children: "ImageCell:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Avatar/image cells with rounded styling" })] })] }), _jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\uD83D\uDD18" }), _jsxs("div", { children: [_jsx("strong", { children: "ButtonCell:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Actionable buttons with multiple variants" })] })] }), _jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\uD83C\uDFF7\uFE0F" }), _jsxs("div", { children: [_jsx("strong", { children: "BadgeCell:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Generic badges with custom colors" })] })] }), _jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\u26A1" }), _jsxs("div", { children: [_jsx("strong", { children: "PriorityIndicator:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Priority levels with color indicators" })] })] }), _jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\u2B50" }), _jsxs("div", { children: [_jsx("strong", { children: "Rating:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Star rating display component" })] })] }), _jsxs("div", { style: { fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px' }, children: "\uD83D\uDCB0" }), _jsxs("div", { children: [_jsx("strong", { children: "CurrencyCell:" }), ' ', _jsx("span", { style: { color: '#2563eb' }, children: "Formatted currency with locale support" })] })] })] })] }), _jsxs("div", { style: { flex: 1, padding: '24px 40px', overflow: 'auto' }, children: [_jsx(DataGrid, { columns: columns, rows: projects, pageSize: 10, theme: "quartz", footerConfig: {
                            show: true,
                            aggregates: [
                                { field: 'budget', function: 'sum', label: 'Total Budget' },
                                { field: 'progress', function: 'avg', label: 'Avg Progress' },
                            ],
                        } }), eventLog.length > 0 && (_jsxs("div", { style: {
                            marginTop: '24px',
                            padding: '20px',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }, children: [_jsx("h3", { style: {
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }, children: "Event Log" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: eventLog.map((event, index) => (_jsx("div", { style: {
                                        fontSize: '13px',
                                        color: '#1f2937',
                                        fontFamily: 'monospace',
                                        padding: '10px 12px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px'
                                    }, children: event }, index))) })] })), _jsxs("div", { style: { marginTop: '32px' }, children: [_jsx("h3", { style: {
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#111827',
                                    marginBottom: '16px'
                                }, children: "Usage Example" }), _jsx(CodeBlock, { title: "Using Cell Renderer Components", language: "tsx", code: `import { DataGrid, StatusChip, ProgressBar, ButtonCell } from './DataGrid';

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

<DataGrid columns={columns} rows={data} />` })] })] })] }));
};
