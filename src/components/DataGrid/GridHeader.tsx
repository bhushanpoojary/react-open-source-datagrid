import React, { useState, useRef, useEffect } from 'react';
import type { Column, GridAction, SortConfig } from './types';

interface GridHeaderProps {
  columns: Column[];
  columnOrder: string[];
  displayColumnOrder: string[];
  columnWidths: { [field: string]: number };
  sortConfig: SortConfig;
  filterConfig: { [field: string]: string };
  dispatch: React.Dispatch<GridAction>;
  pinnedLeft: string[];
  pinnedRight: string[];
  showColumnPinning: boolean;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  columnOrder,
  displayColumnOrder,
  columnWidths,
  sortConfig,
  filterConfig,
  dispatch,
  pinnedLeft,
  pinnedRight,
  showColumnPinning,
}) => {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = useState<number>(0);
  const headerRef = useRef<HTMLDivElement>(null);

  // Create a map for quick column lookup
  const columnMap = new Map(columns.map(col => [col.field, col]));

  const pinnedLeftSet = new Set(pinnedLeft);
  const pinnedRightSet = new Set(pinnedRight);

  const leftOffsets: { [field: string]: number } = {};
  let leftAccumulator = 0;
  pinnedLeft.forEach((field) => {
    leftOffsets[field] = leftAccumulator;
    leftAccumulator += columnWidths[field] || 150;
  });

  const rightOffsets: { [field: string]: number } = {};
  let rightAccumulator = 0;
  [...pinnedRight].reverse().forEach((field) => {
    rightOffsets[field] = rightAccumulator;
    rightAccumulator += columnWidths[field] || 150;
  });

  const pinColumn = (field: string, side: 'left' | 'right') => {
    dispatch({ type: 'PIN_COLUMN', payload: { field, side } });
  };

  const unpinColumn = (field: string) => {
    dispatch({ type: 'UNPIN_COLUMN', payload: field });
  };

  const getStickyHeaderStyle = (field: string): React.CSSProperties => {
    const width = `${columnWidths[field] || 150}px`;
    const style: React.CSSProperties = { width };

    if (pinnedLeftSet.has(field)) {
      style.position = 'sticky';
      style.left = `${leftOffsets[field]}px`;
      style.zIndex = 30;
      style.backgroundColor = '#f8fafc';
    } else if (pinnedRightSet.has(field)) {
      style.position = 'sticky';
      style.right = `${rightOffsets[field]}px`;
      style.zIndex = 30;
      style.backgroundColor = '#f8fafc';
    }

    return style;
  };

  const getFilterCellStyle = (field: string): React.CSSProperties => ({
    ...getStickyHeaderStyle(field),
    backgroundColor: '#fff',
  });

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
        {displayColumnOrder.map((field) => {
          const column = columnMap.get(field);
          if (!column) return null;

          const isSorted = sortConfig.field === field;
          const sortDirection = isSorted ? sortConfig.direction : null;
          const isPinnedLeft = pinnedLeft.includes(field);
          const isPinnedRight = pinnedRight.includes(field);
          const showPinControls = showColumnPinning && column.pinnable !== false;
          const headerStyle = getStickyHeaderStyle(field);

          return (
            <div
              key={field}
              className={`relative border-r border-gray-300 flex-shrink-0 ${
                draggedColumn === field ? 'opacity-50' : ''
              }`}
              style={headerStyle}
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
                <div className="flex items-center gap-1">
                  {column.sortable !== false && (
                    <span className="text-xs">
                      {sortDirection === 'asc' && '↑'}
                      {sortDirection === 'desc' && '↓'}
                      {!sortDirection && <span className="text-gray-400">⇅</span>}
                    </span>
                  )}
                  {showPinControls && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className={`w-5 h-5 rounded border text-[10px] font-semibold flex items-center justify-center transition-colors ${
                          isPinnedLeft ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          pinColumn(field, 'left');
                        }}
                        aria-label={`Pin ${column.headerName} to left`}
                      >
                        ⇤
                      </button>
                      <button
                        type="button"
                        className={`w-5 h-5 rounded border text-[10px] font-semibold flex items-center justify-center transition-colors ${
                          isPinnedRight ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          pinColumn(field, 'right');
                        }}
                        aria-label={`Pin ${column.headerName} to right`}
                      >
                        ⇥
                      </button>
                      {(isPinnedLeft || isPinnedRight) && (
                        <button
                          type="button"
                          className="w-5 h-5 rounded-full border border-gray-300 text-[10px] font-semibold flex items-center justify-center hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            unpinColumn(field);
                          }}
                          aria-label={`Unpin ${column.headerName}`}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                </div>
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
        {displayColumnOrder.map((field) => {
          const column = columnMap.get(field);
          if (!column) return null;

          return (
            <div
              key={`filter-${field}`}
              className="border-r border-gray-300 flex-shrink-0 p-1"
              style={getFilterCellStyle(field)}
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
