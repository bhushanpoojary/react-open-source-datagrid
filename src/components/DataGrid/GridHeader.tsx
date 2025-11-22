import React, { useState, useRef, useEffect } from 'react';
import type { Column, GridAction, SortConfig } from './types';

interface GridHeaderProps {
  columns: Column[];
  columnOrder: string[];
  columnWidths: { [field: string]: number };
  sortConfig: SortConfig;
  filterConfig: { [field: string]: string };
  dispatch: React.Dispatch<GridAction>;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  columnOrder,
  columnWidths,
  sortConfig,
  filterConfig,
  dispatch,
}) => {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = useState<number>(0);
  const headerRef = useRef<HTMLDivElement>(null);

  // Create a map for quick column lookup
  const columnMap = new Map(columns.map(col => [col.field, col]));

  // Handle column sorting
  const handleSort = (field: string) => {
    const column = columnMap.get(field);
    if (!column || column.sortable === false) return;

    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.field === field) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    dispatch({
      type: 'SET_SORT',
      payload: { field: direction ? field : '', direction },
    });
  };

  // Handle filter changes
  const handleFilterChange = (field: string, value: string) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { field, value },
    });
  };

  // Drag and drop handlers for column reordering and grouping
  const handleDragStart = (e: React.DragEvent, field: string) => {
    setDraggedColumn(field);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', field);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetField: string) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn === targetField) {
      setDraggedColumn(null);
      return;
    }

    const fromIndex = columnOrder.indexOf(draggedColumn);
    const toIndex = columnOrder.indexOf(targetField);

    dispatch({
      type: 'REORDER_COLUMNS',
      payload: { fromIndex, toIndex },
    });

    setDraggedColumn(null);
  };

  // Column resizing handlers
  const handleResizeStart = (e: React.MouseEvent, field: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(field);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[field]);
  };

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX;
      const newWidth = Math.max(50, resizeStartWidth + diff); // Minimum width of 50px

      dispatch({
        type: 'RESIZE_COLUMN',
        payload: { field: resizingColumn, width: newWidth },
      });
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, resizeStartX, resizeStartWidth, dispatch]);

  return (
    <div ref={headerRef} className="bg-gray-100 border-b border-gray-300">
      {/* Column Headers Row */}
      <div className="flex">
        {columnOrder.map((field) => {
          const column = columnMap.get(field);
          if (!column) return null;

          const isSorted = sortConfig.field === field;
          const sortDirection = isSorted ? sortConfig.direction : null;

          return (
            <div
              key={field}
              className={`relative border-r border-gray-300 flex-shrink-0 ${
                draggedColumn === field ? 'opacity-50' : ''
              }`}
              style={{ width: `${columnWidths[field]}px` }}
              draggable
              onDragStart={(e) => handleDragStart(e, field)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, field)}
            >
              {/* Column Header */}
              <div
                className="px-3 py-2 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-200 select-none flex items-center justify-between"
                onClick={() => handleSort(field)}
              >
                <span className="truncate">{column.headerName}</span>
                
                {/* Sort indicator */}
                {column.sortable !== false && (
                  <span className="ml-2 text-xs">
                    {sortDirection === 'asc' && '↑'}
                    {sortDirection === 'desc' && '↓'}
                    {!sortDirection && <span className="text-gray-400">⇅</span>}
                  </span>
                )}
              </div>

              {/* Column Resizer */}
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 z-10"
                onMouseDown={(e) => handleResizeStart(e, field)}
              />
            </div>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="flex bg-white">
        {columnOrder.map((field) => {
          const column = columnMap.get(field);
          if (!column) return null;

          return (
            <div
              key={`filter-${field}`}
              className="border-r border-gray-300 flex-shrink-0 p-1"
              style={{ width: `${columnWidths[field]}px` }}
            >
              {column.filterable !== false && (
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Filter...`}
                  value={filterConfig[field] || ''}
                  onChange={(e) => handleFilterChange(field, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
