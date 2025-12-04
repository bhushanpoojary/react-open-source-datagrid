import React, { useRef, useEffect } from 'react';
import type { Column, Row, GridAction, EditState, FocusState, GroupedRow, AggregateConfig, VirtualScrollConfig, TreeNode, TreeConfig, DragRowConfig, MasterDetailConfig, ExpandedMasterRows } from './types';
import { GroupRow, GroupFooterRow } from './GroupRow';
import { isGroupedRow } from './groupingUtils';
import { isTreeNode } from './treeDataUtils';
import { TreeRow } from './TreeRow';
import { VirtualScroller } from './VirtualScroller';
import { DraggableRow } from './DraggableRow';
import { MasterDetailCell } from './MasterDetailCell';
import { DetailRow } from './DetailRow';

interface GridBodyProps {
  columns: Column[];
  rows: (Row | GroupedRow | TreeNode)[];
  pinnedRowsTop?: (Row | GroupedRow | TreeNode)[];
  pinnedRowsBottom?: (Row | GroupedRow | TreeNode)[];
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
  masterDetailConfig?: MasterDetailConfig;
  expandedMasterRows?: ExpandedMasterRows;
  tableId?: string;
  onRowReorder?: (rows: Row[]) => void;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  currentPage?: number;
  pageSize?: number;
  totalRows?: number;
  onContextMenu?: (event: React.MouseEvent, row: Row, column: Column, rowIndex: number, columnIndex: number) => void;
  onCellMouseEnter?: (event: React.MouseEvent, row: Row, column: Column, value: any) => void;
  onCellMouseLeave?: () => void;
  onRowMouseEnter?: (event: React.MouseEvent, row: Row, rowIndex: number) => void;
  onRowMouseLeave?: () => void;
}

export const GridBody: React.FC<GridBodyProps> = ({
  columns,
  rows,
  pinnedRowsTop = [],
  pinnedRowsBottom = [],
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
  masterDetailConfig,
  expandedMasterRows = {},
  tableId,
  onRowReorder,
  onScroll,
  currentPage = 0,
  pageSize = 10,
  totalRows = 0,
  onContextMenu,
  onCellMouseEnter,
  onCellMouseLeave,
  onRowMouseEnter,
  onRowMouseLeave,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const focusedCellRef = useRef<HTMLDivElement>(null);

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

  // Focus the cell when focus state changes
  useEffect(() => {
    if (focusState && focusedCellRef.current) {
      focusedCellRef.current.focus();
    }
  }, [focusState]);

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
        // If at first row and not on first page, go to previous page
        if (rowIndex === 0 && currentPage > 0 && !virtualScrollConfig?.enabled) {
          dispatch({ type: 'SET_PAGE', payload: currentPage - 1 });
          // Set focus to last row of previous page
          newRowIndex = Math.min(pageSize - 1, totalRows - currentPage * pageSize - 1);
        } else {
          newRowIndex = Math.max(0, rowIndex - 1);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        // If at last row and not on last page, go to next page
        const totalPages = Math.ceil(totalRows / pageSize);
        if (rowIndex === maxRowIndex && currentPage < totalPages - 1 && !virtualScrollConfig?.enabled) {
          dispatch({ type: 'SET_PAGE', payload: currentPage + 1 });
          // Set focus to first row of next page
          newRowIndex = 0;
        } else {
          newRowIndex = Math.min(maxRowIndex, rowIndex + 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newColIndex = Math.max(0, columnIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newColIndex = Math.min(maxColIndex, columnIndex + 1);
        break;
      case 'Home':
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          // Ctrl+Home: Go to first cell
          newRowIndex = 0;
          newColIndex = 0;
        } else {
          // Home: Go to first column in current row
          newColIndex = 0;
        }
        break;
      case 'End':
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          // Ctrl+End: Go to last cell
          newRowIndex = maxRowIndex;
          newColIndex = maxColIndex;
        } else {
          // End: Go to last column in current row
          newColIndex = maxColIndex;
        }
        break;
      case 'PageUp':
        e.preventDefault();
        if (currentPage > 0 && !virtualScrollConfig?.enabled) {
          dispatch({ type: 'SET_PAGE', payload: currentPage - 1 });
          newRowIndex = 0;
        } else {
          newRowIndex = Math.max(0, rowIndex - Math.floor(pageSize / 2));
        }
        break;
      case 'PageDown':
        e.preventDefault();
        const totalPagesForPageDown = Math.ceil(totalRows / pageSize);
        if (currentPage < totalPagesForPageDown - 1 && !virtualScrollConfig?.enabled) {
          dispatch({ type: 'SET_PAGE', payload: currentPage + 1 });
          newRowIndex = 0;
        } else {
          newRowIndex = Math.min(maxRowIndex, rowIndex + Math.floor(pageSize / 2));
        }
        break;
      case ' ':
      case 'Spacebar': // For older browsers
        e.preventDefault();
        // Space: Toggle row selection
        const row = rows[rowIndex];
        if (!isGroupedRow(row)) {
          const isMulti = e.ctrlKey || e.metaKey;
          dispatch({
            type: 'TOGGLE_ROW_SELECTION',
            payload: { rowId: row.id, isMulti },
          });
        }
        return; // Don't update focus
      case 'Enter':
        e.preventDefault();
        // Start editing current cell
        const rowForEdit = rows[rowIndex];
        if (!isGroupedRow(rowForEdit)) {
          const field = displayColumnOrder[columnIndex];
          const value = rowForEdit[field];
          handleCellDoubleClick(rowForEdit, field, value);
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Tab: Move to previous cell (with wrapping)
          if (columnIndex === 0) {
            if (rowIndex > 0) {
              newRowIndex = rowIndex - 1;
              newColIndex = maxColIndex;
            }
          } else {
            newColIndex = columnIndex - 1;
          }
        } else {
          // Tab: Move to next cell (with wrapping)
          if (columnIndex === maxColIndex) {
            if (rowIndex < maxRowIndex) {
              newRowIndex = rowIndex + 1;
              newColIndex = 0;
            }
          } else {
            newColIndex = columnIndex + 1;
          }
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
    const isDragEnabled = dragRowConfig?.enabled && !isLoadingRow;
    const showDragHandle = isDragEnabled && dragRowConfig.showDragHandle !== false;
    const handlePosition = dragRowConfig?.dragHandlePosition || 'left';

    const rowContent = (
      <div
        key={row.id}
        role="row"
        aria-rowindex={rowIndex + 2}
        aria-selected={isSelected}
        data-row-index={rowIndex}
        style={{
          ...style,
          display: 'flex',
          minWidth: '100%',
          borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)',
          backgroundColor: isLoadingRow ? 'var(--grid-bg-alt)' : isSelected ? 'var(--grid-selected)' : isFocused ? 'var(--grid-active)' : 'var(--grid-bg)',
          cursor: isLoadingRow ? 'wait' : isDragEnabled ? 'grab' : 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => !isSelected && !isLoadingRow && (e.currentTarget.style.backgroundColor = 'var(--grid-hover)')}
        onMouseLeave={(e) => !isSelected && !isLoadingRow && (e.currentTarget.style.backgroundColor = 'var(--grid-bg)')}
        onClick={(e) => !isLoadingRow && handleRowClick(row, rowIndex, e)}
      >
        {/* Master/Detail Toggle Cell */}
        {masterDetailConfig?.enabled && (
          <div
            style={{
              width: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
            }}
          >
            <MasterDetailCell
              row={row}
              isExpanded={expandedMasterRows[String(row.id)] || false}
              isMasterRow={masterDetailConfig.isRowMaster ? masterDetailConfig.isRowMaster(row) : true}
              onToggle={() => {
                dispatch({ type: 'TOGGLE_MASTER_ROW', payload: row.id });
                if (masterDetailConfig.onDetailRowToggled) {
                  const isCurrentlyExpanded = expandedMasterRows[String(row.id)] || false;
                  masterDetailConfig.onDetailRowToggled({
                    masterRow: row,
                    rowIndex,
                    isOpen: !isCurrentlyExpanded,
                  });
                }
              }}
            />
          </div>
        )}

        {/* Drag Handle - Left */}
        {showDragHandle && handlePosition === 'left' && (
          <div
            style={{
              width: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
              cursor: 'grab',
              color: 'var(--grid-text-secondary, #9ca3af)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--grid-primary, #3b82f6)';
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--grid-text-secondary, #9ca3af)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="7" cy="5" r="1.5" />
              <circle cx="13" cy="5" r="1.5" />
              <circle cx="7" cy="10" r="1.5" />
              <circle cx="13" cy="10" r="1.5" />
              <circle cx="7" cy="15" r="1.5" />
              <circle cx="13" cy="15" r="1.5" />
            </svg>
          </div>
        )}

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
              ref={isCellFocused ? focusedCellRef : null}
              role="gridcell"
              aria-colindex={columnIndex + 1}
              aria-readonly={column.editable === false}
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
              onContextMenu={(e) => onContextMenu?.(e, row, column, rowIndex, columnIndex)}
              onMouseEnter={(e) => onCellMouseEnter?.(e, row, column, cellValue)}
              onMouseLeave={() => onCellMouseLeave?.()}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, columnIndex)}
              tabIndex={isCellFocused ? 0 : -1}
            >
              {isEditing ? (
                column.editor ? (
                  column.editor({
                    value: editState.value,
                    row: row,
                    column: column,
                    onChange: handleEditChange,
                    onCommit: handleEditComplete,
                    onCancel: () => dispatch({ type: 'END_EDIT' }),
                    autoFocus: true,
                    ...column.editorParams,
                  })
                ) : (
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
                )
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

        {/* Drag Handle - Right */}
        {showDragHandle && handlePosition === 'right' && (
          <div
            style={{
              width: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderLeft: 'var(--grid-border-width, 1px) solid var(--grid-border)',
              cursor: 'grab',
              color: 'var(--grid-text-secondary, #9ca3af)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--grid-primary, #3b82f6)';
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--grid-text-secondary, #9ca3af)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="7" cy="5" r="1.5" />
              <circle cx="13" cy="5" r="1.5" />
              <circle cx="7" cy="10" r="1.5" />
              <circle cx="13" cy="10" r="1.5" />
              <circle cx="7" cy="15" r="1.5" />
              <circle cx="13" cy="15" r="1.5" />
            </svg>
          </div>
        )}
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

  // Render pinned rows (top)
  const renderPinnedTopRows = () => {
    if (pinnedRowsTop.length === 0) return null;
    
    return (
      <div style={{ position: 'sticky', top: 0, zIndex: 15, backgroundColor: 'var(--grid-bg)' }}>
        {pinnedRowsTop.map((row, rowIndex) => renderRowContent(row, rowIndex))}
      </div>
    );
  };

  // Render pinned rows (bottom)
  const renderPinnedBottomRows = () => {
    if (pinnedRowsBottom.length === 0) return null;
    
    return (
      <div style={{ position: 'sticky', bottom: 0, zIndex: 15, backgroundColor: 'var(--grid-bg)' }}>
        {pinnedRowsBottom.map((row, rowIndex) => renderRowContent(row, rowIndex + rows.length + pinnedRowsTop.length))}
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
      <div ref={bodyRef} role="rowgroup" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: 'var(--grid-bg)' }}>
        {renderPinnedTopRows()}
        <VirtualScroller<Row | GroupedRow>
          items={rows}
          itemHeight={virtualScrollConfig.rowHeight || 35}
          overscanCount={virtualScrollConfig.overscanCount || 5}
          containerHeight={virtualScrollConfig.containerHeight || 600}
          columns={enableColumnVirtualization ? virtualColumns : []}
          totalColumnWidth={enableColumnVirtualization ? totalColumnWidth : 0}
          columnOverscan={virtualScrollConfig.columnOverscan || 3}
          onScroll={onScroll}
          renderItem={(row, index, style) => renderRowContent(row, index + pinnedRowsTop.length, style)}
          renderRow={enableColumnVirtualization ? (row, index, visibleColumns, style) => {
            if (isGroupedRow(row)) {
              // For group rows, render without column virtualization
              return renderRowContent(row, index);
            }

            const isSelected = selectedRows.has(row.id);
            const isFocused = focusState?.rowIndex === index;

            return (
              <div
                role="row"
                aria-rowindex={index + 2}
                aria-selected={isSelected}
                style={{
                  ...style,
                  display: 'flex',
                  minWidth: '100%',
                  borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                  backgroundColor: isSelected ? 'var(--grid-selected)' : isFocused ? 'var(--grid-active)' : 'var(--grid-bg)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--grid-hover)';
                  onRowMouseEnter?.(e, row, index);
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--grid-bg)';
                  onRowMouseLeave?.();
                }}
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
                      ref={isCellFocused ? focusedCellRef : null}
                      role="gridcell"
                      aria-colindex={displayColumnOrder.indexOf(field) + 1}
                      aria-readonly={column.editable === false}
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
                      onContextMenu={(e) => onContextMenu?.(e, row, column, index, columnIndex)}
                      onMouseEnter={(e) => onCellMouseEnter?.(e, row, column, cellValue)}
                      onMouseLeave={() => onCellMouseLeave?.()}
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
        {renderPinnedBottomRows()}
      </div>
    );
  }

  // Helper function to render master rows with detail rows
  const renderRowsWithDetails = () => {
    const elements: React.ReactElement[] = [];
    
    rows.forEach((row, rowIndex) => {
      const rowId = isGroupedRow(row) ? row.groupKey : row.id;
      
      // Render master row
      elements.push(
        <React.Fragment key={`row-${rowId}`}>
          {renderRowContent(row, rowIndex + pinnedRowsTop.length)}
        </React.Fragment>
      );

      // Check if this is a master row and if it's expanded
      if (
        masterDetailConfig?.enabled &&
        !isGroupedRow(row) &&
        !isTreeNode(row)
      ) {
        const isMasterRow = masterDetailConfig.isRowMaster
          ? masterDetailConfig.isRowMaster(row as Row)
          : true;
        const isExpanded = expandedMasterRows[String(row.id)] || false;

        if (isMasterRow && isExpanded) {
          // Calculate total column count including special columns
          let columnCount = displayColumnOrder.length;
          if (masterDetailConfig?.enabled) columnCount += 1; // Master/detail toggle column
          if (dragRowConfig?.enabled && dragRowConfig.showDragHandle !== false) columnCount += 1; // Drag handle column
          
          // Render detail row
          elements.push(
            <DetailRow
              key={`detail-${row.id}`}
              masterRow={row as Row}
              rowIndex={rowIndex}
              renderDetailRow={masterDetailConfig.renderDetailRow}
              columnCount={columnCount}
              detailRowHeight={masterDetailConfig.detailRowHeight}
              detailRowAutoHeight={masterDetailConfig.detailRowAutoHeight}
            />
          );
        }
      }
    });

    return elements;
  };

  // Non-virtual scrolling mode (original implementation)
  return (
    <div ref={bodyRef} role="rowgroup" style={{ overflow: 'auto', maxHeight: '500px', position: 'relative', backgroundColor: 'var(--grid-bg)', width: '100%' }}>
      {renderPinnedTopRows()}
      {masterDetailConfig?.enabled ? renderRowsWithDetails() : rows.map((row, rowIndex) => renderRowContent(row, rowIndex + pinnedRowsTop.length))}
      {renderPinnedBottomRows()}
    </div>
  );
};
