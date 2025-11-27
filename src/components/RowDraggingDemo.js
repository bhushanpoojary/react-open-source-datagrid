import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
import { CodeBlock } from './CodeBlock';
// Demo data for task prioritization
const initialTasks = [
    { id: 1, task: 'Review PR #245', assignee: 'Alice', priority: 'High', status: 'In Progress', effort: '2h' },
    { id: 2, task: 'Fix login bug', assignee: 'Bob', priority: 'Critical', status: 'To Do', effort: '4h' },
    { id: 3, task: 'Update documentation', assignee: 'Carol', priority: 'Low', status: 'In Progress', effort: '1h' },
    { id: 4, task: 'Implement search feature', assignee: 'Dave', priority: 'Medium', status: 'To Do', effort: '8h' },
    { id: 5, task: 'Write unit tests', assignee: 'Eve', priority: 'Medium', status: 'In Progress', effort: '3h' },
    { id: 6, task: 'Design new dashboard', assignee: 'Frank', priority: 'High', status: 'To Do', effort: '6h' },
];
// Demo data for sprint planning
const initialBacklog = [
    { id: 101, feature: 'User Authentication', team: 'Backend', estimate: '5 days', complexity: 'High' },
    { id: 102, feature: 'Dashboard Analytics', team: 'Frontend', estimate: '3 days', complexity: 'Medium' },
    { id: 103, feature: 'Email Notifications', team: 'Backend', estimate: '2 days', complexity: 'Low' },
    { id: 104, feature: 'Mobile Responsive', team: 'Frontend', estimate: '4 days', complexity: 'Medium' },
];
const initialSprint = [
    { id: 201, feature: 'Fix Critical Bugs', team: 'Full Stack', estimate: '1 day', complexity: 'High' },
    { id: 202, feature: 'Code Review', team: 'Full Stack', estimate: '1 day', complexity: 'Low' },
];
const taskColumns = [
    { field: 'task', headerName: 'Task', width: 220 },
    { field: 'assignee', headerName: 'Assignee', width: 120 },
    { field: 'priority', headerName: 'Priority', width: 100 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'effort', headerName: 'Effort', width: 80 },
];
const sprintColumns = [
    { field: 'feature', headerName: 'Feature', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'estimate', headerName: 'Estimate', width: 100 },
    { field: 'complexity', headerName: 'Complexity', width: 120 },
];
export const RowDraggingDemo = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [backlog, setBacklog] = useState(initialBacklog);
    const [sprint, setSprint] = useState(initialSprint);
    const [dragEvents, setDragEvents] = useState([]);
    const addEvent = (event) => {
        setDragEvents(prev => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev.slice(0, 9)]);
    };
    const handleTaskReorder = (reorderedRows) => {
        setTasks(reorderedRows);
        addEvent('Tasks reordered');
    };
    const handleBacklogReorder = (reorderedRows) => {
        setBacklog(reorderedRows);
        addEvent('Backlog reordered');
    };
    const handleSprintReorder = (reorderedRows) => {
        setSprint(reorderedRows);
        addEvent('Sprint reordered');
    };
    const resetData = () => {
        setTasks(initialTasks);
        setBacklog(initialBacklog);
        setSprint(initialSprint);
        setDragEvents([]);
    };
    return (_jsxs("div", { style: { padding: '32px', maxWidth: '1600px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '32px' }, children: [_jsx("h1", { style: { fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }, children: "Row Dragging & Reordering Demo" }), _jsx("p", { style: { fontSize: '16px', color: '#6b7280', marginBottom: '8px' }, children: "Drag rows to reorder them within the same table or move them between tables." }), _jsx("button", { onClick: resetData, style: {
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                        }, children: "Reset Data" })] }), _jsxs("section", { style: { marginBottom: '48px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "1. Task Priority Reordering" }), _jsx("p", { style: { fontSize: '14px', color: '#6b7280', marginBottom: '16px' }, children: "Drag tasks up or down to adjust their priority order. Notice the drag handle on the left." }), _jsx("div", { style: {
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }, children: _jsx(DataGrid, { columns: taskColumns, rows: tasks, dragRowConfig: {
                                enabled: true,
                                showDragHandle: true,
                                dragHandlePosition: 'left',
                                onDragStart: (row) => addEvent(`Started dragging: ${row.task}`),
                                onDragEnd: () => addEvent('Drag ended'),
                            }, tableId: "tasks", onRowReorder: handleTaskReorder }) })] }), _jsxs("section", { style: { marginBottom: '48px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "2. Sprint Planning (Cross-Table Drag)" }), _jsx("p", { style: { fontSize: '14px', color: '#6b7280', marginBottom: '16px' }, children: "Drag features from Backlog to Sprint or reorder within each table. Drag handle positioned on the right." }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }, children: [_jsxs("div", { children: [_jsxs("h3", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#374151' }, children: ["\uD83D\uDCCB Backlog (", backlog.length, " items)"] }), _jsx("div", { style: {
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                        }, children: _jsx(DataGrid, { columns: sprintColumns, rows: backlog, dragRowConfig: {
                                                enabled: true,
                                                showDragHandle: true,
                                                dragHandlePosition: 'right',
                                                allowExternalDrop: true,
                                                onDragStart: (row) => addEvent(`Dragging from Backlog: ${row.feature}`),
                                                onExternalDrop: (data, targetIndex) => {
                                                    try {
                                                        const droppedRow = JSON.parse(data);
                                                        // Remove from sprint
                                                        setSprint(prev => prev.filter(r => r.id !== droppedRow.id));
                                                        // Add to backlog at target position
                                                        setBacklog(prev => {
                                                            const newBacklog = [...prev];
                                                            newBacklog.splice(targetIndex, 0, droppedRow);
                                                            return newBacklog;
                                                        });
                                                        addEvent(`Moved ${droppedRow.feature} from Sprint to Backlog`);
                                                    }
                                                    catch (e) {
                                                        console.error('Failed to parse dropped data', e);
                                                    }
                                                },
                                            }, tableId: "backlog", onRowReorder: handleBacklogReorder }) })] }), _jsxs("div", { children: [_jsxs("h3", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#374151' }, children: ["\uD83D\uDE80 Current Sprint (", sprint.length, " items)"] }), _jsx("div", { style: {
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#f0fdf4',
                                        }, children: _jsx(DataGrid, { columns: sprintColumns, rows: sprint, dragRowConfig: {
                                                enabled: true,
                                                showDragHandle: true,
                                                dragHandlePosition: 'right',
                                                allowExternalDrop: true,
                                                onDragStart: (row) => addEvent(`Dragging from Sprint: ${row.feature}`),
                                                onExternalDrop: (data, targetIndex) => {
                                                    try {
                                                        const droppedRow = JSON.parse(data);
                                                        // Remove from backlog
                                                        setBacklog(prev => prev.filter(r => r.id !== droppedRow.id));
                                                        // Add to sprint at target position
                                                        setSprint(prev => {
                                                            const newSprint = [...prev];
                                                            newSprint.splice(targetIndex, 0, droppedRow);
                                                            return newSprint;
                                                        });
                                                        addEvent(`Moved ${droppedRow.feature} from Backlog to Sprint`);
                                                    }
                                                    catch (e) {
                                                        console.error('Failed to parse dropped data', e);
                                                    }
                                                },
                                            }, tableId: "sprint", onRowReorder: handleSprintReorder }) })] })] })] }), _jsxs("section", { children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "Event Log" }), _jsx("div", { style: {
                            backgroundColor: '#1f2937',
                            color: '#d1d5db',
                            padding: '16px',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '13px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                        }, children: dragEvents.length === 0 ? (_jsx("div", { style: { color: '#9ca3af' }, children: "No events yet. Try dragging some rows!" })) : (dragEvents.map((event, index) => (_jsx("div", { style: { marginBottom: '4px' }, children: event }, index)))) })] }), _jsxs("section", { style: { marginTop: '40px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "Implementation Example" }), _jsx(CodeBlock, { title: "Row Dragging Configuration", language: "tsx", code: `import { DataGrid } from './components/DataGrid';

const [tasks, setTasks] = useState<Row[]>(initialTasks);

<DataGrid
  columns={columns}
  rows={tasks}
  rowDragging={{
    enabled: true,
    handleField: 'drag-handle',
    onRowReorder: (reorderedRows) => {
      setTasks(reorderedRows);
      console.log('Tasks reordered:', reorderedRows);
    },
    // Optional: Enable drag between tables
    onRowDragEnd: (draggedRow, sourceTable, targetTable) => {
      if (sourceTable !== targetTable) {
        console.log('Row moved between tables');
      }
    }
  }}
  tableId="task-list"
/>` })] })] }));
};
export default RowDraggingDemo;
