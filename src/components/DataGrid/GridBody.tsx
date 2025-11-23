import React, { useRef, useEffect } from 'react';
import type { Column, Row, GridAction, EditState, FocusState, GroupedRow, AggregateConfig, VirtualScrollConfig } from './types';
import { GroupRow, GroupFooterRow } from './GroupRow';
import { isGroupedRow } from './groupingUtils';
import { VirtualScroller } from './VirtualScroller';

interface GridBodyProps {
  columns: Column[];
  rows: (Row | GroupedRow)[];
  columnOrder: string[];
  displayColumnOrder: string[];
  columnWidths: { [field: string]: number };
  selectedRows: Set<string | number>;
  editState: EditState;
  focusState: FocusState | null;
  dispatch: React.Dispatch<GridAction>;
  onRowClick?: (row: Row) => void;
  onCellEdit?: (rowIndex: number, field: string, value: any) => void;
  pinnedLeft: string[];
  pinnedRight: string[];
  showGroupFooters?: boolean;
  groupAggregates?: Map<string, { [key: string]: number | null }>;
  aggregateConfigs?: AggregateConfig[];
  virtualScrollConfig?: VirtualScrollConfig;
}

export const GridBody: React.FC<GridBodyProps> = ({
  columns,
  rows,
  columnOrder,
  displayColumnOrder,
  columnWidths,
  selectedRows,
  editState,
  focusState,
  dispatch,
  onRowClick,
  onCellEdit,
  pinnedLeft,
  pinnedRight,
  showGroupFooters = false,
  groupAggregates = new Map(),
  aggregateConfigs = [],
  virtualScrollConfig,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

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

  const getPinnedCellStyle = (field: string): React.CSSProperties => {
    const width = `${columnWidths[field] || 150}px`;
    const style: React.CSSProperties = { width };

    if (pinnedLeftSet.has(field)) {
      style.position = 'sticky';
      style.left = `${leftOffsets[field]}px`;
      style.zIndex = 20;
      style.backgroundColor = '#fff';
    } else if (pinnedRightSet.has(field)) {
      style.position = 'sticky';
      style.right = `${rightOffsets[field]}px`;
      style.zIndex = 20;
      style.backgroundColor = '#fff';
    }

    return style;
  };

  // Focus edit input when editing starts
  useEffect(() => {
    if (editState.rowId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editState.rowId, editState.field]);

  // Handle row click
  const handleRowClick = (row: Row, rowIndex: number, e: React.MouseEvent) => {
    // If clicking on an input, don't trigger row selection
    if ((e.target as HTMLElement).tagName === 'INPUT') return;

    const isMulti = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    if (isShift && selectedRows.size > 0) {
      // Range selection (simplified - select all rows between last selected and current)
      const dataRows = rows.filter((r): r is Row => !isGroupedRow(r));
      const lastSelectedIndex = dataRows.findIndex(r => selectedRows.has(r.id));
      const currentDataIndex = dataRows.findIndex(r => r.id === row.id);
      const startIndex = Math.min(lastSelectedIndex, currentDataIndex);
      const endIndex = Math.max(lastSelectedIndex, currentDataIndex);
      const rowIds = dataRows.slice(startIndex, endIndex + 1).map(r => r.id);
      
      dispatch({
        type: 'SELECT_RANGE',
        payload: { startIndex, endIndex, rowIds },
      });
    } else {
      dispatch({
        type: 'TOGGLE_ROW_SELECTION',
        payload: { rowId: row.id, isMulti },
      });
    }

    // Set focus to this cell
    dispatch({
      type: 'SET_FOCUS',
      payload: { rowIndex, columnIndex: 0 },
    });

    if (onRowClick) {
      onRowClick(row);
    }
  };

  // Handle cell double-click to start editing
  const handleCellDoubleClick = (row: Row, field: string, value: any) => {
    const column = columnMap.get(field);
    if (!column || column.editable === false) return;

    dispatch({
      type: 'START_EDIT',
      payload: { rowId: row.id, field, value },
    });
  };

  // Handle edit value change
  const handleEditChange = (value: string) => {
    if (editState.rowId === null || editState.field === null) return;

    dispatch({
      type: 'START_EDIT',
      payload: {
        rowId: editState.rowId,
        field: editState.field,
        value,
      },
    });
  };

  // Handle edit completion (blur or Enter key)
  const handleEditComplete = () => {
    if (editState.rowId === null || editState.field === null) return;

    const dataRows = rows.filter((r): r is Row => !isGroupedRow(r));
    const rowIndex = dataRows.findIndex(r => r.id === editState.rowId);
    
    if (onCellEdit && rowIndex !== -1) {
      onCellEdit(rowIndex, editState.field, editState.value);
    }

    dispatch({ type: 'END_EDIT' });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, columnIndex: number) => {
    // If editing, only handle Enter and Escape
    if (editState.rowId !== null) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEditComplete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        dispatch({ type: 'END_EDIT' });
      }
      return;
    }

    const maxRowIndex = rows.length - 1;
    const maxColIndex = displayColumnOrder.length - 1;

    let newRowIndex = rowIndex;
    let newColIndex = columnIndex;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRowIndex = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRowIndex = Math.min(maxRowIndex, rowIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newColIndex = Math.max(0, columnIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newColIndex = Math.min(maxColIndex, columnIndex + 1);
        break;
      case 'Enter':
        e.preventDefault();
        // Start editing current cell
        const row = rows[rowIndex];
        if (!isGroupedRow(row)) {
          const field = displayColumnOrder[columnIndex];
          const value = row[field];
          handleCellDoubleClick(row, field, value);
        }
        break;
      default:
        return;
    }

    dispatch({
      type: 'SET_FOCUS',
      payload: { rowIndex: newRowIndex, columnIndex: newColIndex },
    });
  };

  // Render a single row (used by both virtual and non-virtual modes)
  const renderRowContent = (row: Row | GroupedRow, rowIndex: number, style?: React.CSSProperties) => {
    // Check if this is a group row
    if (isGroupedRow(row)) {
      const groupAgg = groupAggregates.get(row.groupKey) || {};
      
      return (
        <React.Fragment key={row.groupKey}>
          <GroupRow
            group={row}
            columns={columns}
            columnOrder={columnOrder}
            displayColumnOrder={displayColumnOrder}
            columnWidths={columnWidths}
            dispatch={dispatch}
            pinnedLeft={pinnedLeft}
            pinnedRight={pinnedRight}
          />
          {/* Render group footer if expanded and showGroupFooters is enabled */}
          {showGroupFooters && row.isExpanded && aggregateConfigs.length > 0 && (
            <GroupFooterRow
              group={row}
              columns={columns}
              displayColumnOrder={displayColumnOrder}
              columnWidths={columnWidths}
              aggregates={groupAgg}
              aggregateConfigs={aggregateConfigs}
              pinnedLeft={pinnedLeft}
              pinnedRight={pinnedRight}
            />
          )}
        </React.Fragment>
      );
    }

    // Regular row rendering
    const isSelected = selectedRows.has(row.id);
    const isFocused = focusState?.rowIndex === rowIndex;

    return (
      <div
        key={row.id}
        style={{
          ...style,
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: isSelected ? '#e8f0ff' : isFocused ? '#f0f6ff' : '#ffffff',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#f8f9fa')}
        onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#ffffff')}
        onClick={(e) => handleRowClick(row, rowIndex, e)}
      >
        {displayColumnOrder.map((field, columnIndex) => {
          const column = columnMap.get(field);
          if (!column) return null;

          const cellValue = row[field];
          const isEditing =
            editState.rowId === row.id && editState.field === field;
          const isCellFocused =
            focusState?.rowIndex === rowIndex &&
            focusState?.columnIndex === columnIndex;
          const cellStyle = getPinnedCellStyle(field);

          return (
            <div
              key={`${row.id}-${field}`}
              style={{
                ...cellStyle,
                paddingLeft: '12px',
                paddingRight: '12px',
                paddingTop: '10px',
                paddingBottom: '10px',
                fontSize: '13px',
                borderRight: '1px solid #e2e8f0',
                flexShrink: 0,
                outline: isCellFocused ? '2px solid #0066cc' : 'none',
                outlineOffset: '-2px',
                color: '#262626',
              }}
              onDoubleClick={() => handleCellDoubleClick(row, field, cellValue)}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, columnIndex)}
              tabIndex={isCellFocused ? 0 : -1}
            >
              {isEditing ? (
                <input
                  ref={editInputRef}
                  type="text"
                  style={{ 
                    width: '100%', 
                    padding: '6px 8px', 
                    border: '1.5px solid #0066cc', 
                    borderRadius: '3px', 
                    outline: 'none',
                    fontSize: '13px',
                    boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.1)',
                  }}
                  value={editState.value ?? ''}
                  onChange={(e) => handleEditChange(e.target.value)}
                  onBlur={handleEditComplete}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEditComplete();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      dispatch({ type: 'END_EDIT' });
                    }
                  }}
                />
              ) : (
                <span style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  display: 'block',
                  color: '#262626',
                }}>{cellValue ?? ''}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render with virtual scrolling if enabled
  if (virtualScrollConfig?.enabled) {
    // Prepare columns for virtualization
    const virtualColumns = displayColumnOrder.map(field => ({
      field,
      width: columnWidths[field] || 150,
    }));
    
    const totalColumnWidth = virtualColumns.reduce((sum, col) => sum + col.width, 0);
    
    // Determine if column virtualization is enabled
    const enableColumnVirtualization = virtualScrollConfig.enableColumnVirtualization ?? true;

    return (
      <div ref={bodyRef} style={{ position: 'relative' }}>
        <VirtualScroller<Row | GroupedRow>
          items={rows}
          itemHeight={virtualScrollConfig.rowHeight || 35}
          overscanCount={virtualScrollConfig.overscanCount || 5}
          containerHeight={virtualScrollConfig.containerHeight || 600}
          columns={enableColumnVirtualization ? virtualColumns : []}
          totalColumnWidth={enableColumnVirtualization ? totalColumnWidth : 0}
          columnOverscan={virtualScrollConfig.columnOverscan || 3}
          renderItem={(row, index, style) => renderRowContent(row, index, style)}
          renderRow={enableColumnVirtualization ? (row, index, visibleColumns, style) => {
            if (isGroupedRow(row)) {
              // For group rows, render without column virtualization
              return renderRowContent(row, index);
            }

            const isSelected = selectedRows.has(row.id);
            const isFocused = focusState?.rowIndex === index;

            return (
              <div
                style={{
                  ...style,
                  display: 'flex',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: isSelected ? '#eff6ff' : isFocused ? '#dbeafe' : '#fff',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#fff')}
                onClick={(e) => handleRowClick(row, index, e)}
              >
                {visibleColumns.map((colInfo, columnIndex) => {
                  const field = colInfo.field;
                  const column = columnMap.get(field);
                  if (!column) return null;

                  const cellValue = row[field];
                  const isEditing =
                    editState.rowId === row.id && editState.field === field;
                  const isCellFocused =
                    focusState?.rowIndex === index &&
                    focusState?.columnIndex === displayColumnOrder.indexOf(field);

                  return (
                    <div
                      key={`${row.id}-${field}`}
                      style={{
                        width: `${colInfo.width}px`,
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        fontSize: '14px',
                        borderRight: '1px solid #e5e7eb',
                        flexShrink: 0,
                        outline: isCellFocused ? '2px solid #3b82f6' : 'none',
                      }}
                      onDoubleClick={() => handleCellDoubleClick(row, field, cellValue)}
                      onKeyDown={(e) => handleKeyDown(e, index, columnIndex)}
                      tabIndex={isCellFocused ? 0 : -1}
                    >
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          style={{ width: '100%', padding: '4px', border: '1px solid #3b82f6', borderRadius: '4px', outline: 'none' }}
                          value={editState.value ?? ''}
                          onChange={(e) => handleEditChange(e.target.value)}
                          onBlur={handleEditComplete}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleEditComplete();
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              dispatch({ type: 'END_EDIT' });
                            }
                          }}
                        />
                      ) : (
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{cellValue ?? ''}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          } : undefined}
        />
      </div>
    );
  }

  // Non-virtual scrolling mode (original implementation)
  return (
    <div ref={bodyRef} style={{ overflow: 'auto', maxHeight: '500px', position: 'relative' }}>
      {rows.map((row, rowIndex) => renderRowContent(row, rowIndex))}
    </div>
  );
};
