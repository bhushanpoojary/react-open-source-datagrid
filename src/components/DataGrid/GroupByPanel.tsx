import React, { useState } from 'react';
import type { Column, GridAction } from './types';

interface GroupByPanelProps {
  columns: Column[];
  groupBy: string[];
  dispatch: React.Dispatch<GridAction>;
}

export const GroupByPanel: React.FC<GroupByPanelProps> = ({
  columns,
  groupBy,
  dispatch,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // Create a map for quick column lookup
  const columnMap = new Map(columns.map(col => [col.field, col]));

  // Handle drag over the panel
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Handle drop on the panel
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const field = e.dataTransfer.getData('text/plain');
    if (field && !groupBy.includes(field)) {
      dispatch({ type: 'ADD_GROUP', payload: field });
    }
  };

  // Handle removing a group
  const handleRemoveGroup = (field: string) => {
    dispatch({ type: 'REMOVE_GROUP', payload: field });
  };

  // Handle drag start for reordering groups
  const handleGroupDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('groupIndex', index.toString());
  };

  // Handle drop for reordering groups
  const handleGroupDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const fromIndex = parseInt(e.dataTransfer.getData('groupIndex'), 10);
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      dispatch({
        type: 'REORDER_GROUPS',
        payload: { fromIndex, toIndex },
      });
    }
  };

  // Handle group drop over
  const handleGroupDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  // Clear all groups
  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_GROUPS' });
  };

  return (
    <div
      style={{
        borderBottom: '1px solid #d1d5db',
        padding: '12px',
        minHeight: '60px',
        transitionProperty: 'colors',
        transitionDuration: '200ms',
        backgroundColor: isDragOver ? '#eff6ff' : '#f9fafb',
        borderBottomColor: isDragOver ? '#3b82f6' : '#d1d5db',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {groupBy.length === 0 ? (
          <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Drag columns here to group rows
          </div>
        ) : (
          <>
            <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>Group by:</span>
            {groupBy.map((field, index) => {
              const column = columnMap.get(field);
              return (
                <div
                  key={field}
                  draggable
                  onDragStart={(e) => handleGroupDragStart(e, index)}
                  onDrop={(e) => handleGroupDrop(e, index)}
                  onDragOver={handleGroupDragOver}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'move',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    transitionProperty: 'background-color',
                    transitionDuration: '200ms',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  {index > 0 && (
                    <span style={{ color: '#bfdbfe', marginRight: '4px' }}>→</span>
                  )}
                  <span>{column?.headerName || field}</span>
                  <button
                    onClick={() => handleRemoveGroup(field)}
                    style={{
                      marginLeft: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transitionProperty: 'background-color',
                      transitionDuration: '200ms',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Remove grouping"
                  >
                    <svg
                      style={{ width: '12px', height: '12px' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
            <button
              onClick={handleClearAll}
              style={{
                fontSize: '12px',
                color: '#4b5563',
                textDecoration: 'none',
                marginLeft: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.textDecoration = 'none'; }}
              title="Clear all groupings"
            >
              Clear all
            </button>
          </>
        )}
      </div>
    </div>
  );
};
