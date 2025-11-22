import React, { useRef, useEffect } from 'react';
import type { Column, Row, GridAction, EditState, FocusState, GroupedRow } from './types';
import { GroupRow } from './GroupRow';
import { isGroupedRow } from './groupingUtils';

interface GridBodyProps {
  columns: Column[];
  rows: (Row | GroupedRow)[];
  columnOrder: string[];
  columnWidths: { [field: string]: number };
  selectedRows: Set<string | number>;
  editState: EditState;
  focusState: FocusState | null;
  dispatch: React.Dispatch<GridAction>;
  onRowClick?: (row: Row) => void;
  onCellEdit?: (rowIndex: number, field: string, value: any) => void;
}

export const GridBody: React.FC<GridBodyProps> = ({
  columns,
  rows,
  columnOrder,
  columnWidths,
  selectedRows,
  editState,
  focusState,
  dispatch,
  onRowClick,
  onCellEdit,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Create a map for quick column lookup
  const columnMap = new Map(columns.map(col => [col.field, col]));

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
    const maxColIndex = columnOrder.length - 1;

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
          const field = columnOrder[columnIndex];
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

  return (
    <div ref={bodyRef} className="overflow-auto" style={{ maxHeight: '500px' }}>
      {rows.map((row, rowIndex) => {
        // Check if this is a group row
        if (isGroupedRow(row)) {
          return (
            <GroupRow
              key={row.groupKey}
              group={row}
              columns={columns}
              columnOrder={columnOrder}
              columnWidths={columnWidths}
              dispatch={dispatch}
            />
          );
        }

        // Regular row rendering
        const isSelected = selectedRows.has(row.id);
        const isFocused = focusState?.rowIndex === rowIndex;

        return (
          <div
            key={row.id}
            className={`flex border-b border-gray-200 hover:bg-gray-50 ${
              isSelected ? 'bg-blue-50' : ''
            } ${isFocused ? 'ring-2 ring-blue-300' : ''}`}
            onClick={(e) => handleRowClick(row, rowIndex, e)}
          >
            {columnOrder.map((field, columnIndex) => {
              const column = columnMap.get(field);
              if (!column) return null;

              const cellValue = row[field];
              const isEditing =
                editState.rowId === row.id && editState.field === field;
              const isCellFocused =
                focusState?.rowIndex === rowIndex &&
                focusState?.columnIndex === columnIndex;

              return (
                <div
                  key={`${row.id}-${field}`}
                  className={`px-3 py-2 text-sm border-r border-gray-200 flex-shrink-0 ${
                    isCellFocused ? 'ring-2 ring-inset ring-blue-500' : ''
                  }`}
                  style={{ width: `${columnWidths[field]}px` }}
                  onDoubleClick={() => handleCellDoubleClick(row, field, cellValue)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, columnIndex)}
                  tabIndex={isCellFocused ? 0 : -1}
                >
                  {isEditing ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      className="w-full px-1 py-0 border border-blue-500 rounded focus:outline-none"
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
                    <span className="truncate block">{cellValue ?? ''}</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
