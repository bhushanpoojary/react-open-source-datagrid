import React, { useState, useRef, useEffect } from 'react';
import type { Column, GridAction, SortConfig, MasterDetailConfig, DragRowConfig } from './types';

interface GridHeaderProps {
  columns: Column[];
  columnOrder: string[];
  displayColumnOrder: string[];
  columnWidths: { [field: string]: number };
  sortConfig: SortConfig;
  dispatch: React.Dispatch<GridAction>;
  pinnedLeft: string[];
  pinnedRight: string[];
  showColumnPinning: boolean;
  masterDetailConfig?: MasterDetailConfig;
  dragRowConfig?: DragRowConfig;
  onContextMenu?: (event: React.MouseEvent, column: Column, columnIndex: number) => void;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  columnOrder,
  displayColumnOrder,
  columnWidths,
  sortConfig,
  dispatch,
  pinnedLeft,
  pinnedRight,
  showColumnPinning,
  masterDetailConfig,
  dragRowConfig,
  onContextMenu,
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
      style.backgroundColor = 'var(--grid-header-bg)';
    } else if (pinnedRightSet.has(field)) {
      style.position = 'sticky';
      style.right = `${rightOffsets[field]}px`;
      style.zIndex = 30;
      style.backgroundColor = 'var(--grid-header-bg)';
    }

    return style;
  };

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
    <div ref={headerRef} style={{ borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)', width: '100%', backgroundColor: 'var(--grid-header-bg)' }}>
      {/* Column Headers Row */}
      <div role="row" style={{ display: 'flex', minWidth: '100%', backgroundColor: 'var(--grid-header-bg)' }}>
        {/* Master/Detail Header Cell */}
        {masterDetailConfig?.enabled && (
          <div
            role="columnheader"
            style={{
              width: '48px',
              flexShrink: 0,
              borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
              backgroundColor: 'var(--grid-header-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{
              padding: 'var(--grid-header-padding, 10px 12px)',
              fontWeight: 'var(--grid-header-font-weight, 600)',
              fontSize: 'var(--grid-font-size, 13px)',
              color: 'var(--grid-header-text)',
            }}>
              {/* Empty header for detail toggle column */}
            </div>
          </div>
        )}

        {/* Drag Handle Header Cell */}
        {dragRowConfig?.enabled && dragRowConfig.showDragHandle !== false && dragRowConfig.dragHandlePosition === 'left' && (
          <div
            role="columnheader"
            style={{
              width: '32px',
              flexShrink: 0,
              borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
              backgroundColor: 'var(--grid-header-bg)',
            }}
          />
        )}

        {displayColumnOrder.map((field, colIndex) => {
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
              role="columnheader"
              aria-colindex={colIndex + 1}
              aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none'}
              aria-label={`${column.headerName} column${sortDirection ? `, sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}` : ''}`}
              style={{
                ...headerStyle,
                position: 'relative',
                borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
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
                  padding: 'var(--grid-header-padding, 10px 12px)',
                  fontWeight: 'var(--grid-header-font-weight, 600)',
                  fontSize: 'var(--grid-font-size, 13px)',
                  color: 'var(--grid-header-text)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '36px',
                  backgroundColor: 'var(--grid-header-bg)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-header-bg)'}
                onClick={() => handleSort(field)}
                onContextMenu={(e) => onContextMenu?.(e, column, colIndex)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{column.headerName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {column.sortable !== false && (
                    <span style={{ fontSize: '12px', color: sortDirection ? 'var(--grid-primary)' : 'var(--grid-text-secondary)' }}>
                      {sortDirection === 'asc' && '↑'}
                      {sortDirection === 'desc' && '↓'}
                      {!sortDirection && '⇅'}
                    </span>
                  )}
                  {showPinControls && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '3px',
                          border: isPinnedLeft ? '1.5px solid var(--grid-primary)' : '1px solid var(--grid-border)',
                          fontSize: '10px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isPinnedLeft ? 'var(--grid-primary)' : 'transparent',
                          color: isPinnedLeft ? 'var(--grid-text-inverse)' : 'var(--grid-text-secondary)',
                          cursor: 'pointer',
                          transitionProperty: 'colors',
                        }}
                        onMouseEnter={(e) => !isPinnedLeft && (e.currentTarget.style.backgroundColor = 'var(--grid-hover)')}
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
                          border: isPinnedRight ? '1.5px solid var(--grid-primary)' : '1px solid var(--grid-border)',
                          fontSize: '10px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isPinnedRight ? 'var(--grid-primary)' : 'transparent',
                          color: isPinnedRight ? 'var(--grid-text-inverse)' : 'var(--grid-text-secondary)',
                          cursor: 'pointer',
                          transitionProperty: 'colors',
                        }}
                        onMouseEnter={(e) => !isPinnedRight && (e.currentTarget.style.backgroundColor = 'var(--grid-hover)')}
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
                            border: '1px solid var(--grid-border)',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            color: 'var(--grid-text-secondary)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--grid-hover)';
                            e.currentTarget.style.borderColor = 'var(--grid-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'var(--grid-border)';
                          }}
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onMouseDown={(e) => handleResizeStart(e, field)}
              />
            </div>
          );
        })}
      </div>

    </div>
  );
};
