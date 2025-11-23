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
    <div ref={headerRef} style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #d1d5db' }}>
      {/* Column Headers Row */}
      <div style={{ display: 'flex' }}>
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
              style={{
                ...headerStyle,
                position: 'relative',
                borderRight: '1px solid #d1d5db',
                flexShrink: 0,
                opacity: draggedColumn === field ? 0.5 : 1,
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, field)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, field)}
            >
              {/* Column Header */}
              <div
                style={{
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => handleSort(field)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{column.headerName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {column.sortable !== false && (
                    <span style={{ fontSize: '12px' }}>
                      {sortDirection === 'asc' && '↑'}
                      {sortDirection === 'desc' && '↓'}
                      {!sortDirection && <span style={{ color: '#d1d5db' }}>⇅</span>}
                    </span>
                  )}
                  {showPinControls && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: isPinnedLeft ? '1px solid #3b82f6' : '1px solid #d1d5db',
                          fontSize: '10px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isPinnedLeft ? '#3b82f6' : 'transparent',
                          color: isPinnedLeft ? '#fff' : '#4b5563',
                          cursor: 'pointer',
                          transitionProperty: 'colors',
                        }}
                        onMouseEnter={(e) => !isPinnedLeft && (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                        onMouseLeave={(e) => !isPinnedLeft && (e.currentTarget.style.backgroundColor = 'transparent')}
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
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: isPinnedRight ? '1px solid #3b82f6' : '1px solid #d1d5db',
                          fontSize: '10px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isPinnedRight ? '#3b82f6' : 'transparent',
                          color: isPinnedRight ? '#fff' : '#4b5563',
                          cursor: 'pointer',
                          transitionProperty: 'colors',
                        }}
                        onMouseEnter={(e) => !isPinnedRight && (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                        onMouseLeave={(e) => !isPinnedRight && (e.currentTarget.style.backgroundColor = 'transparent')}
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
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '9999px',
                            border: '1px solid #d1d5db',
                            fontSize: '10px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '4px',
                  height: '100%',
                  cursor: 'col-resize',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onMouseDown={(e) => handleResizeStart(e, field)}
              />
            </div>
          );
        })}
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', backgroundColor: '#fff' }}>
        {displayColumnOrder.map((field) => {
          const column = columnMap.get(field);
          if (!column) return null;

          return (
            <div
              key={`filter-${field}`}
              style={{
                ...getFilterCellStyle(field),
                borderRight: '1px solid #d1d5db',
                flexShrink: 0,
                padding: '4px',
              }}
            >
              {column.filterable !== false && (
                <input
                  type="text"
                  style={{ width: '100%', paddingLeft: '8px', paddingRight: '8px', paddingTop: '4px', paddingBottom: '4px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none' }}
                  placeholder={`Filter...`}
                  value={filterConfig[field] || ''}
                  onChange={(e) => handleFilterChange(field, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 1px #3b82f6'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
