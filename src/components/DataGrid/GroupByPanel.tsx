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
        borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border, #e2e8f0)',
        padding: '12px 16px',
        minHeight: '52px',
        transitionProperty: 'colors',
        transitionDuration: '200ms',
        backgroundColor: isDragOver ? 'var(--grid-active, #f0f6ff)' : 'var(--grid-bg-alt, #fafafa)',
        borderBottomColor: isDragOver ? 'var(--grid-primary, #0066cc)' : 'var(--grid-border, #e2e8f0)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {groupBy.length === 0 ? (
          <div style={{ color: 'var(--grid-text-secondary, #999999)', fontSize: 'var(--grid-font-size, 13px)', display: 'flex', alignItems: 'center', gap: '8px', fontStyle: 'italic' }}>
            📊 Drag columns here to group rows
          </div>
        ) : (
          <>
            <span style={{ fontSize: '12px', color: 'var(--grid-text-secondary, #666666)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Group by:</span>
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
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    backgroundColor: 'var(--grid-primary, #0066cc)',
                    color: 'var(--grid-text-inverse, #fff)',
                    borderRadius: 'var(--grid-border-radius, 4px)',
                    fontSize: 'var(--grid-font-size, 13px)',
                    fontWeight: '500',
                    cursor: 'move',
                    boxShadow: 'var(--grid-shadow-light, 0 2px 4px rgba(0, 102, 204, 0.15))',
                    transitionProperty: 'background-color, box-shadow',
                    transitionDuration: '200ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover, #0052a3)';
                    e.currentTarget.style.boxShadow = 'var(--grid-shadow-medium, 0 4px 8px rgba(0, 102, 204, 0.2))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--grid-primary, #0066cc)';
                    e.currentTarget.style.boxShadow = 'var(--grid-shadow-light, 0 2px 4px rgba(0, 102, 204, 0.15))';
                  }}
                >
                  {index > 0 && (
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '4px' }}>→</span>
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
                      transitionDuration: '150ms',
                      color: '#fff',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
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
                color: 'var(--grid-text-secondary, #666666)',
                textDecoration: 'none',
                marginLeft: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                padding: '2px 4px',
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.color = 'var(--grid-text, #262626)'; 
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.color = 'var(--grid-text-secondary, #666666)'; 
                e.currentTarget.style.textDecoration = 'none'; 
              }}
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
