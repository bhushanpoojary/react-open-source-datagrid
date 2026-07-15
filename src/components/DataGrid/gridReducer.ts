import type { GridState, GridAction, Column, SortConfig } from './types';
import { dataViewReducer } from './dataViewReducer';
import { selectionReducer } from './selectionReducer';
import { editReducer } from './editReducer';
import { columnReducer } from './columnReducer';
import { treeReducer } from './treeReducer';
import { rowStateReducer } from './rowStateReducer';
import { resolveInitialColumnWidth } from './gridDataUtils';

// Re-export types for convenience
export type { GridState, GridAction };

// Initial state factory
export const createInitialState = (columns: Column[], pageSize: number = 10): GridState => {
  const columnWidths: { [field: string]: number } = {};
  const columnOrder: string[] = [];
  const hiddenColumns: string[] = [];

  columns.forEach(col => {
    columnWidths[col.field] = resolveInitialColumnWidth(col);
    columnOrder.push(col.field);
    if (col.hide) {
      hiddenColumns.push(col.field);
    }
  });

  // Seed the initial sort from any column that declares `sort`. The grid uses
  // single-column sort, so when several columns declare it, the lowest
  // `sortIndex` wins (ties fall back to column order).
  let initialSort: SortConfig = { field: '', direction: null };
  const sortedColumns = columns
    .filter((col) => col.sort === 'asc' || col.sort === 'desc')
    .sort(
      (a, b) =>
        (a.sortIndex ?? Number.MAX_SAFE_INTEGER) - (b.sortIndex ?? Number.MAX_SAFE_INTEGER)
    );
  if (sortedColumns.length > 0) {
    const first = sortedColumns[0];
    initialSort = { field: first.field, direction: first.sort as 'asc' | 'desc' };
  }

  return {
    columns,
    sortConfig: initialSort,
    filterConfig: {},
    currentPage: 0,
    pageSize,
    selection: {
      selectedRows: new Set(),
      lastSelectedIndex: null,
    },
    editState: {
      rowId: null,
      field: null,
      value: null,
    },
    focusState: null,
    columnOrder,
    columnWidths,
    groupBy: [],
    expandedGroups: {},
    pinnedColumnsLeft: [],
    pinnedColumnsRight: [],
    hiddenColumns,
    expandedNodes: {},
    dragState: {
      isDragging: false,
      draggedRowId: null,
      draggedRowIndex: null,
      dropTargetIndex: null,
      dropPosition: null,
    },
    pinnedRowsTop: [],
    pinnedRowsBottom: [],
    detailRowState: {
      expandedMasterRows: {},
    },
    editHistory: [],
    editFuture: [],
  };
};

/**
 * Domain slice reducers. Each one handles only the action types it owns and
 * returns the received state unchanged for every other action. Folding the
 * dispatched action through all slices therefore applies exactly the single
 * slice that owns the action, leaving the state otherwise untouched.
 *
 * Actions that are not owned by any slice (e.g. the Grid API's
 * `SORT_COLUMN`/`START_EDITING` aliases) fall through every slice and return
 * the state unchanged, matching the previous switch's `default` behavior.
 */
const sliceReducers: Array<(state: GridState, action: GridAction) => GridState> = [
  dataViewReducer,
  selectionReducer,
  editReducer,
  columnReducer,
  treeReducer,
  rowStateReducer,
];

// Reducer function for managing grid state
export const gridReducer = (state: GridState, action: GridAction): GridState =>
  sliceReducers.reduce((current, reducer) => reducer(current, action), state);
