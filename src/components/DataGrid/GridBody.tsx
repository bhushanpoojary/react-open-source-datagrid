import React, { useRef, useEffect } from 'react';
import type { Column, Row, GridAction, EditState, FocusState, GroupedRow, AggregateConfig, VirtualScrollConfig, TreeNode, TreeConfig, DragRowConfig } from './types';
import { GroupRow, GroupFooterRow } from './GroupRow';
import { isGroupedRow } from './groupingUtils';
import { isTreeNode } from './treeDataUtils';
import { TreeRow } from './TreeRow';
import { VirtualScroller } from './VirtualScroller';
import { DraggableRow } from './DraggableRow';

interface GridBodyProps {
  columns: Column[];
  rows: (Row | GroupedRow | TreeNode)[];
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
  treeConfig?: TreeConfig;
  dragRowConfig?: DragRowConfig;
  tableId?: string;
  onRowReorder?: (rows: Row[]) => void;
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
  treeConfig,
  dragRowConfig,
  tableId,
  onRowReorder,
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
      style.backgroundColor = 'var(--grid-bg)';
    } else if (pinnedRightSet.has(field)) {
      style.position = 'sticky';
      style.right = `${rightOffsets[field]}px`;
      style.zIndex = 20;
      style.backgroundColor = 'var(--grid-bg)';
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
  const renderRowContent = (row: Row | GroupedRow | TreeNode, rowIndex: number, style?: React.CSSProperties) => {
    // Check if this is a group row first (before tree check, as groups take precedence)
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

    // Check if this is a tree node
    if (treeConfig?.enabled && isTreeNode(row)) {
      return (
        <TreeRow
          key={row.id}
          node={row as TreeNode}
          columns={columns}
          columnOrder={columnOrder}
          displayColumnOrder={displayColumnOrder}
          columnWidths={columnWidths}
          selectedRows={selectedRows}
          editState={editState}
          focusState={focusState}
          rowIndex={rowIndex}
          dispatch={dispatch}
          onRowClick={onRowClick}
          onCellEdit={onCellEdit}
          pinnedLeft={pinnedLeft}
          pinnedRight={pinnedRight}
          treeConfig={treeConfig}
          editInputRef={editInputRef}
        />
      );
    }

    // Regular row rendering
    const isSelected = selectedRows.has(row.id);
    const isFocused = focusState?.rowIndex === rowIndex;
    const isLoadingRow = (row as any)._loading === true;

    const rowContent = (
      <div
        key={row.id}
        style={{
          ...style,
          display: 'flex',
          minWidth: '100%',
          borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)',
          backgroundColor: isLoadingRow ? 'var(--grid-bg-alt)' : isSelected ? 'var(--grid-selected)' : isFocused ? 'var(--grid-active)' : 'var(--grid-bg)',
          cursor: isLoadingRow ? 'wait' : 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => !isSelected && !isLoadingRow && (e.currentTarget.style.backgroundColor = 'var(--grid-hover)')}
        onMouseLeave={(e) => !isSelected && !isLoadingRow && (e.currentTarget.style.backgroundColor = 'var(--grid-bg)')}
        onClick={(e) => !isLoadingRow && handleRowClick(row, rowIndex, e)}
      >
        {displayColumnOrder.map((field, columnIndex) => {
          const column = columnMap.get(field);
          if (!column) return null;

          const cellValue = isLoadingRow ? '' : row[field];
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
                padding: 'var(--grid-cell-padding, 10px 12px)',
                fontSize: 'var(--grid-font-size, 13px)',
                borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                flexShrink: 0,
                outline: isCellFocused ? '2px solid var(--grid-primary)' : 'none',
                outlineOffset: '-2px',
                color: 'var(--grid-text)',
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
                    border: '1.5px solid var(--grid-primary)', 
                    borderRadius: 'var(--grid-border-radius, 3px)', 
                    outline: 'none',
                    fontSize: 'var(--grid-font-size, 13px)',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    backgroundColor: 'var(--grid-bg)',
                    color: 'var(--grid-text)',
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
                <div style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  display: 'block',
                  color: isLoadingRow ? 'var(--grid-text-secondary)' : 'var(--grid-text)',
                }}>
                  {isLoadingRow ? (
                    <span style={{ 
                      display: 'inline-block',
                      width: '80%',
                      height: '12px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '2px',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}></span>
                  ) : (
                    column.renderCell ? column.renderCell(row) : (cellValue ?? '')
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

    // Wrap in DraggableRow if drag is enabled
    if (dragRowConfig?.enabled && !isLoadingRow) {
      return (
        <DraggableRow
          key={row.id}
          row={row as Row}
          rowIndex={rowIndex}
          config={dragRowConfig}
          sourceTableId={tableId}
          onRowReorder={onRowReorder}
          rows={rows as Row[]}
          style={style}
        >
          {rowContent}
        </DraggableRow>
      );
    }

    return rowContent;
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
      <div ref={bodyRef} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: 'var(--grid-bg)' }}>
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
                  minWidth: '100%',
                  borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                  backgroundColor: isSelected ? 'var(--grid-selected)' : isFocused ? 'var(--grid-active)' : 'var(--grid-bg)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--grid-hover)')}
                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--grid-bg)')}
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
                        fontSize: 'var(--grid-font-size, 14px)',
                        borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                        flexShrink: 0,
                        outline: isCellFocused ? '2px solid var(--grid-primary)' : 'none',
                        color: 'var(--grid-text)',
                      }}
                      onDoubleClick={() => handleCellDoubleClick(row, field, cellValue)}
                      onKeyDown={(e) => handleKeyDown(e, index, columnIndex)}
                      tabIndex={isCellFocused ? 0 : -1}
                    >
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          style={{ width: '100%', padding: '4px', border: '1px solid var(--grid-primary)', borderRadius: 'var(--grid-border-radius, 4px)', outline: 'none', backgroundColor: 'var(--grid-bg)', color: 'var(--grid-text)' }}
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
    <div ref={bodyRef} style={{ overflow: 'auto', maxHeight: '500px', position: 'relative', backgroundColor: 'var(--grid-bg)', width: '100%' }}>
      {rows.map((row, rowIndex) => renderRowContent(row, rowIndex))}
    </div>
  );
};
