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
      className={`
        border-b border-gray-300 p-3 min-h-[60px]
        transition-colors duration-200
        ${isDragOver ? 'bg-blue-50 border-blue-400' : 'bg-gray-50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2 flex-wrap">
        {groupBy.length === 0 ? (
          <div className="text-gray-500 text-sm flex items-center gap-2">
            Drag columns here to group rows
          </div>
        ) : (
          <>
            <span className="text-xs text-gray-600 font-medium">Group by:</span>
            {groupBy.map((field, index) => {
              const column = columnMap.get(field);
              return (
                <div
                  key={field}
                  draggable
                  onDragStart={(e) => handleGroupDragStart(e, index)}
                  onDrop={(e) => handleGroupDrop(e, index)}
                  onDragOver={handleGroupDragOver}
                  className="
                    flex items-center gap-1 px-3 py-1 
                    bg-blue-600 text-white rounded-md text-sm
                    cursor-move hover:bg-blue-700 transition-colors
                    shadow-sm
                  "
                >
                  {index > 0 && (
                    <span className="text-blue-200 mr-1">→</span>
                  )}
                  <span>{column?.headerName || field}</span>
                  <button
                    onClick={() => handleRemoveGroup(field)}
                    className="
                      ml-1 hover:bg-blue-800 rounded-full p-0.5
                      transition-colors
                    "
                    title="Remove grouping"
                  >
                    <svg
                      className="w-3 h-3"
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
              className="
                text-xs text-gray-600 hover:text-gray-800 
                underline ml-2
              "
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
