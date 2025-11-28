import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
import type { Column, Row } from './DataGrid/types';
import { CodeBlock } from './CodeBlock';

// Demo data for task prioritization
const initialTasks: Row[] = [
  { id: 1, task: 'Review PR #245', assignee: 'Alice', priority: 'High', status: 'In Progress', effort: '2h' },
  { id: 2, task: 'Fix login bug', assignee: 'Bob', priority: 'Critical', status: 'To Do', effort: '4h' },
  { id: 3, task: 'Update documentation', assignee: 'Carol', priority: 'Low', status: 'In Progress', effort: '1h' },
  { id: 4, task: 'Implement search feature', assignee: 'Dave', priority: 'Medium', status: 'To Do', effort: '8h' },
  { id: 5, task: 'Write unit tests', assignee: 'Eve', priority: 'Medium', status: 'In Progress', effort: '3h' },
  { id: 6, task: 'Design new dashboard', assignee: 'Frank', priority: 'High', status: 'To Do', effort: '6h' },
];

// Demo data for sprint planning
const initialBacklog: Row[] = [
  { id: 101, feature: 'User Authentication', team: 'Backend', estimate: '5 days', complexity: 'High' },
  { id: 102, feature: 'Dashboard Analytics', team: 'Frontend', estimate: '3 days', complexity: 'Medium' },
  { id: 103, feature: 'Email Notifications', team: 'Backend', estimate: '2 days', complexity: 'Low' },
  { id: 104, feature: 'Mobile Responsive', team: 'Frontend', estimate: '4 days', complexity: 'Medium' },
];

const initialSprint: Row[] = [
  { id: 201, feature: 'Fix Critical Bugs', team: 'Full Stack', estimate: '1 day', complexity: 'High' },
  { id: 202, feature: 'Code Review', team: 'Full Stack', estimate: '1 day', complexity: 'Low' },
];

const taskColumns: Column[] = [
  { field: 'task', headerName: 'Task', width: 220 },
  { field: 'assignee', headerName: 'Assignee', width: 120 },
  { field: 'priority', headerName: 'Priority', width: 100 },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'effort', headerName: 'Effort', width: 80 },
];

const sprintColumns: Column[] = [
  { field: 'feature', headerName: 'Feature', width: 200 },
  { field: 'team', headerName: 'Team', width: 130 },
  { field: 'estimate', headerName: 'Estimate', width: 100 },
  { field: 'complexity', headerName: 'Complexity', width: 120 },
];

export const RowDraggingDemo: React.FC = () => {
  const [tasks, setTasks] = useState<Row[]>(initialTasks);
  const [backlog, setBacklog] = useState<Row[]>(initialBacklog);
  const [sprint, setSprint] = useState<Row[]>(initialSprint);
  const [dragEvents, setDragEvents] = useState<string[]>([]);

  const addEvent = (event: string) => {
    setDragEvents(prev => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev.slice(0, 9)]);
  };

  const handleTaskReorder = (reorderedRows: Row[]) => {
    setTasks(reorderedRows);
    addEvent('Tasks reordered');
  };

  const handleBacklogReorder = (reorderedRows: Row[]) => {
    setBacklog(reorderedRows);
    addEvent('Backlog reordered');
  };

  const handleSprintReorder = (reorderedRows: Row[]) => {
    setSprint(reorderedRows);
    addEvent('Sprint reordered');
  };

  const resetData = () => {
    setTasks(initialTasks);
    setBacklog(initialBacklog);
    setSprint(initialSprint);
    setDragEvents([]);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
          Row Dragging & Reordering Demo
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
          Drag rows to reorder them within the same table or move them between tables.
        </p>
        <button
          onClick={resetData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Reset Data
        </button>
      </div>

      {/* Example 1: Simple Task Prioritization */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          1. Task Priority Reordering
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          Drag tasks up or down to adjust their priority order. Notice the drag handle on the left.
        </p>
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          <DataGrid
            columns={taskColumns}
            rows={tasks}
            dragRowConfig={{
              enabled: true,
              showDragHandle: true,
              dragHandlePosition: 'left',
              onDragStart: (row) => addEvent(`Started dragging: ${row.task}`),
              onDragEnd: () => addEvent('Drag ended'),
            }}
            tableId="tasks"
            onRowReorder={handleTaskReorder}
          />
        </div>
      </section>

      {/* Example 2: Cross-Table Drag (Sprint Planning) */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          2. Sprint Planning (Cross-Table Drag)
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          Drag features from Backlog to Sprint or reorder within each table. Drag handle positioned on the right.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Backlog */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
              📋 Backlog ({backlog.length} items)
            </h3>
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}>
              <DataGrid
                columns={sprintColumns}
                rows={backlog}
                dragRowConfig={{
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
                    } catch (e) {
                      console.error('Failed to parse dropped data', e);
                    }
                  },
                }}
                tableId="backlog"
                onRowReorder={handleBacklogReorder}
              />
            </div>
          </div>

          {/* Sprint */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
              🚀 Current Sprint ({sprint.length} items)
            </h3>
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f0fdf4',
            }}>
              <DataGrid
                columns={sprintColumns}
                rows={sprint}
                dragRowConfig={{
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
                    } catch (e) {
                      console.error('Failed to parse dropped data', e);
                    }
                  },
                }}
                tableId="sprint"
                onRowReorder={handleSprintReorder}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Event Log */}
      <section>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Event Log
        </h2>
        <div style={{ 
          backgroundColor: '#1f2937', 
          color: '#d1d5db', 
          padding: '16px', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '13px',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {dragEvents.length === 0 ? (
            <div style={{ color: '#9ca3af' }}>No events yet. Try dragging some rows!</div>
          ) : (
            dragEvents.map((event, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                {event}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Implementation Example */}
      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Implementation Example
        </h2>
        <CodeBlock
          title="Row Dragging Configuration"
          examples={[
            {
              label: 'TypeScript',
              code: `import { DataGrid } from 'react-open-source-grid';

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
/>`,
              language: 'tsx',
            },
            {
              label: 'JavaScript',
              code: `import { DataGrid } from 'react-open-source-grid';

const [tasks, setTasks] = useState(initialTasks);

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
/>`,
              language: 'jsx',
            },
          ]}
        />
      </section>
    </div>
  );
};

export default RowDraggingDemo;
