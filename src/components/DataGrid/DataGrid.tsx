import React, { useReducer, useMemo, useEffect, useCallback } from 'react';
import type { DataGridProps, Row, GroupedRow } from './types';
import { gridReducer, createInitialState } from './gridReducer';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { GridPagination } from './GridPagination';
import { GroupByPanel } from './GroupByPanel';
import { GridFooter } from './GridFooter';
import { ColumnChooser } from './ColumnChooser';
import { groupRows, flattenGroupedRows } from './groupingUtils';
import { computeAggregations, computeGroupAggregations } from './aggregationUtils';

/**
 * DataGrid Component
 * 
 * A feature-rich data grid component with sorting, filtering, pagination,
 * column resizing, column reordering, row selection, cell editing, and keyboard navigation.
 * 
 * Features:
 * - Sortable columns (click header to sort asc/desc/none)
 * - Column filtering (text filter for each column)
 * - Pagination with configurable page size (10, 20, 50)
 * - Column resizing (drag column border to resize)
 * - Column reorder (drag and drop column headers)
 * - Row selection (single click, Ctrl+click for multi, Shift+click for range)
 * - Editable cells (double-click to edit, Enter to confirm, Escape to cancel)
 * - Keyboard navigation (arrow keys to move focus, Enter to edit)
 * - Sticky header (header stays visible when scrolling)
 */
export const DataGrid: React.FC<DataGridProps> = ({
  columns,
  rows,
  pageSize = 10,
  showColumnPinning = true,
  footerConfig,
  virtualScrollConfig,
  onRowClick,
  onCellEdit,
  onSelectionChange,
}) => {
  // Initialize grid state with reducer
  const [state, dispatch] = useReducer(
    gridReducer,
    { columns, pageSize },
    (args) => createInitialState(args.columns, args.pageSize)
  );

  // Filter out hidden columns and arrange pinned columns
  const hiddenSet = new Set(state.hiddenColumns);
  const visibleColumnOrder = state.columnOrder.filter(field => !hiddenSet.has(field));
  
  const pinnedLeftFields = state.pinnedColumnsLeft.filter(field => visibleColumnOrder.includes(field));
  const pinnedRightFields = state.pinnedColumnsRight.filter(field => visibleColumnOrder.includes(field));
  const pinnedLeftSet = new Set(pinnedLeftFields);
  const pinnedRightSet = new Set(pinnedRightFields);
  const middleColumns = visibleColumnOrder.filter(field => !pinnedLeftSet.has(field) && !pinnedRightSet.has(field));
  const displayColumnOrder = [
    ...pinnedLeftFields,
    ...middleColumns,
    ...pinnedRightFields,
  ];

  // Update columns when props change
  useEffect(() => {
    dispatch({ type: 'RESET_COLUMNS', payload: columns });
  }, [columns]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(state.selection.selectedRows));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selection.selectedRows]);

  // Apply sorting
  const sortedRows = useMemo(() => {
    if (!state.sortConfig.field || !state.sortConfig.direction) {
      return rows;
    }

    const sorted = [...rows].sort((a, b) => {
      const aValue = a[state.sortConfig.field];
      const bValue = b[state.sortConfig.field];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    // Reverse if descending
    if (state.sortConfig.direction === 'desc') {
      sorted.reverse();
    }

    return sorted;
  }, [rows, state.sortConfig]);

  // Apply filtering
  const filteredRows = useMemo(() => {
    const filterEntries = Object.entries(state.filterConfig).filter(
      ([, value]) => value.trim() !== ''
    );

    if (filterEntries.length === 0) {
      return sortedRows;
    }

    return sortedRows.filter((row) => {
      return filterEntries.every(([field, filterValue]) => {
        const cellValue = row[field];
        
        if (cellValue == null) return false;

        // Case-insensitive partial match
        return String(cellValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    });
  }, [sortedRows, state.filterConfig]);

  // Apply grouping
  const groupedRows = useMemo(() => {
    if (state.groupBy.length === 0) {
      return filteredRows;
    }
    return groupRows(filteredRows, state.groupBy, state.expandedGroups);
  }, [filteredRows, state.groupBy, state.expandedGroups]);

  // Flatten grouped rows for display
  const flattenedRows = useMemo(() => {
    if (state.groupBy.length === 0) {
      return groupedRows as Row[];
    }
    return flattenGroupedRows(groupedRows as (Row | GroupedRow)[]);
  }, [groupedRows, state.groupBy]);

  // Apply pagination
  const paginatedRows = useMemo(() => {
    const startIndex = state.currentPage * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    return flattenedRows.slice(startIndex, endIndex);
  }, [flattenedRows, state.currentPage, state.pageSize]);

  // Compute global footer aggregations
  const globalAggregates = useMemo(() => {
    if (!footerConfig?.show || !footerConfig.aggregates) {
      return {};
    }
    
    // Get all data rows (non-grouped)
    const dataRows = filteredRows.filter((r): r is Row => !('isGroup' in r));
    return computeAggregations(dataRows, footerConfig.aggregates);
  }, [filteredRows, footerConfig]);

  // Compute group-level aggregations
  const groupAggregates = useMemo(() => {
    if (!footerConfig?.showGroupFooters || !footerConfig.aggregates || state.groupBy.length === 0) {
      return new Map();
    }
    
    return computeGroupAggregations(groupedRows as (Row | GroupedRow)[], footerConfig.aggregates);
  }, [groupedRows, footerConfig, state.groupBy]);

  // Auto-adjust column width based on content (simplified implementation)
  useEffect(() => {
    // This is a basic implementation. In a production app, you might want to:
    // 1. Measure actual content width using canvas or DOM elements
    // 2. Set min/max width constraints
    // 3. Handle this more efficiently
    
    const updatedWidths = { ...state.columnWidths };
    let hasChanges = false;

    columns.forEach((column) => {
      if (column.width) {
        // If width is explicitly set, use it
        if (updatedWidths[column.field] !== column.width) {
          updatedWidths[column.field] = column.width;
          hasChanges = true;
        }
      } else {
        // Auto-size based on header name length (basic heuristic)
        const headerLength = column.headerName.length;
        const estimatedWidth = Math.max(150, Math.min(300, headerLength * 10 + 50));
        
        if (!updatedWidths[column.field]) {
          updatedWidths[column.field] = estimatedWidth;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      columns.forEach((column) => {
        dispatch({
          type: 'RESIZE_COLUMN',
          payload: { field: column.field, width: updatedWidths[column.field] },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  // Handle cell edit with callback
  const handleCellEdit = useCallback(
    (rowIndex: number, field: string, value: any) => {
      if (onCellEdit) {
        // Find the actual row index in the original data
        const actualRow = paginatedRows[rowIndex];
        if ('id' in actualRow) {
          const actualRowIndex = rows.findIndex((r) => r.id === actualRow.id);
          onCellEdit(actualRowIndex, field, value);
        }
      }
    },
    [onCellEdit, paginatedRows, rows]
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="relative flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 z-30">
        <div className="relative flex items-center gap-2">
          {/* Column Chooser */}
          <ColumnChooser
            columns={columns}
            columnOrder={state.columnOrder}
            hiddenColumns={state.hiddenColumns}
            onToggleVisibility={(field: string) =>
              dispatch({ type: 'TOGGLE_COLUMN_VISIBILITY', payload: field })
            }
            onReorderColumns={(fromIndex: number, toIndex: number) =>
              dispatch({ type: 'REORDER_COLUMNS', payload: { fromIndex, toIndex } })
            }
            onResetLayout={() => dispatch({ type: 'RESET_COLUMN_LAYOUT' })}
          />
        </div>
      </div>

      {/* Group By Panel */}
      <GroupByPanel
        columns={columns}
        groupBy={state.groupBy}
        dispatch={dispatch}
      />

      {/* Sticky Header */}
      <div className="sticky top-0 z-20">
        <GridHeader
          columns={columns}
          columnOrder={state.columnOrder}
          displayColumnOrder={displayColumnOrder}
          columnWidths={state.columnWidths}
          sortConfig={state.sortConfig}
          filterConfig={state.filterConfig}
          dispatch={dispatch}
          pinnedLeft={pinnedLeftFields}
          pinnedRight={pinnedRightFields}
          showColumnPinning={showColumnPinning}
        />
      </div>

      {/* Grid Body */}
      <GridBody
        columns={columns}
        rows={virtualScrollConfig?.enabled ? flattenedRows : paginatedRows}
        columnOrder={state.columnOrder}
        displayColumnOrder={displayColumnOrder}
        columnWidths={state.columnWidths}
        selectedRows={state.selection.selectedRows}
        editState={state.editState}
        focusState={state.focusState}
        dispatch={dispatch}
        onRowClick={onRowClick}
        onCellEdit={handleCellEdit}
        pinnedLeft={pinnedLeftFields}
        pinnedRight={pinnedRightFields}
        showGroupFooters={footerConfig?.showGroupFooters}
        groupAggregates={groupAggregates}
        aggregateConfigs={footerConfig?.aggregates}
        virtualScrollConfig={virtualScrollConfig}
      />

      {/* Global Footer */}
      {footerConfig?.show && footerConfig.aggregates && (
        <GridFooter
          columns={columns}
          displayColumnOrder={displayColumnOrder}
          columnWidths={state.columnWidths}
          aggregates={globalAggregates}
          aggregateConfigs={footerConfig.aggregates}
          pinnedLeft={pinnedLeftFields}
          pinnedRight={pinnedRightFields}
        />
      )}

      {/* Pagination - Hide when virtual scrolling is enabled */}
      {!virtualScrollConfig?.enabled && (
        <GridPagination
          currentPage={state.currentPage}
          pageSize={state.pageSize}
          totalRows={flattenedRows.length}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};
