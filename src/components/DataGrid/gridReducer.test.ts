import { describe, it, expect } from 'vitest';
import { createInitialState, gridReducer } from './gridReducer';
import type { Column } from './types';

const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'age', headerName: 'Age', width: 100 },
];

const initial = () => createInitialState(columns, 10);

describe('createInitialState', () => {
  it('derives column order and widths from columns', () => {
    const state = initial();
    expect(state.columnOrder).toEqual(['id', 'name', 'age']);
    expect(state.columnWidths).toEqual({ id: 70, name: 180, age: 100 });
    expect(state.pageSize).toBe(10);
    expect(state.currentPage).toBe(0);
    expect(state.selection.selectedRows.size).toBe(0);
  });

  it('defaults width to 150 when not provided', () => {
    const state = createInitialState([{ field: 'x', headerName: 'X' }]);
    expect(state.columnWidths.x).toBe(150);
  });
});

describe('sorting', () => {
  it('SET_SORT stores config and resets to first page', () => {
    const state = { ...initial(), currentPage: 3 };
    const next = gridReducer(state, {
      type: 'SET_SORT',
      payload: { field: 'name', direction: 'asc' },
    });
    expect(next.sortConfig).toEqual({ field: 'name', direction: 'asc' });
    expect(next.currentPage).toBe(0);
  });
});

describe('filtering', () => {
  it('SET_FILTER adds a filter and resets page', () => {
    const next = gridReducer(
      { ...initial(), currentPage: 2 },
      { type: 'SET_FILTER', payload: { field: 'name', value: { type: 'contains', value: 'a' } } }
    );
    expect(next.filterConfig.name).toEqual({ type: 'contains', value: 'a' });
    expect(next.currentPage).toBe(0);
  });

  it('SET_FILTER with null removes the filter', () => {
    const withFilter = gridReducer(initial(), {
      type: 'SET_FILTER',
      payload: { field: 'name', value: { type: 'contains', value: 'a' } },
    });
    const cleared = gridReducer(withFilter, {
      type: 'SET_FILTER',
      payload: { field: 'name', value: null },
    });
    expect(cleared.filterConfig.name).toBeUndefined();
  });

  it('CLEAR_FILTERS empties the filter config', () => {
    const withFilter = gridReducer(initial(), {
      type: 'SET_FILTER',
      payload: { field: 'name', value: { type: 'contains', value: 'a' } },
    });
    expect(gridReducer(withFilter, { type: 'CLEAR_FILTERS' }).filterConfig).toEqual({});
  });
});

describe('pagination', () => {
  it('SET_PAGE updates the current page', () => {
    expect(gridReducer(initial(), { type: 'SET_PAGE', payload: 4 }).currentPage).toBe(4);
  });

  it('SET_PAGE_SIZE updates size and resets page', () => {
    const next = gridReducer({ ...initial(), currentPage: 5 }, { type: 'SET_PAGE_SIZE', payload: 50 });
    expect(next.pageSize).toBe(50);
    expect(next.currentPage).toBe(0);
  });
});

describe('selection', () => {
  it('TOGGLE_ROW_SELECTION single-select replaces the selection', () => {
    let state = gridReducer(initial(), {
      type: 'TOGGLE_ROW_SELECTION',
      payload: { rowId: 1, isMulti: false },
    });
    expect([...state.selection.selectedRows]).toEqual([1]);

    state = gridReducer(state, {
      type: 'TOGGLE_ROW_SELECTION',
      payload: { rowId: 2, isMulti: false },
    });
    expect([...state.selection.selectedRows]).toEqual([2]);
  });

  it('TOGGLE_ROW_SELECTION multi-select accumulates and toggles', () => {
    let state = gridReducer(initial(), {
      type: 'TOGGLE_ROW_SELECTION',
      payload: { rowId: 1, isMulti: true },
    });
    state = gridReducer(state, {
      type: 'TOGGLE_ROW_SELECTION',
      payload: { rowId: 2, isMulti: true },
    });
    expect(state.selection.selectedRows.size).toBe(2);

    // Toggling an already-selected row removes it
    state = gridReducer(state, {
      type: 'TOGGLE_ROW_SELECTION',
      payload: { rowId: 1, isMulti: true },
    });
    expect([...state.selection.selectedRows]).toEqual([2]);
  });

  it('SELECT_RANGE adds all provided ids', () => {
    const state = gridReducer(initial(), {
      type: 'SELECT_RANGE',
      payload: { rowIds: [1, 2, 3] },
    });
    expect(state.selection.selectedRows.size).toBe(3);
  });

  it('CLEAR_SELECTION empties the selection', () => {
    const selected = gridReducer(initial(), {
      type: 'TOGGLE_ROW_SELECTION',
      payload: { rowId: 1, isMulti: true },
    });
    const cleared = gridReducer(selected, { type: 'CLEAR_SELECTION' });
    expect(cleared.selection.selectedRows.size).toBe(0);
  });
});

describe('editing', () => {
  it('START_EDIT then END_EDIT sets and clears edit state', () => {
    const editing = gridReducer(initial(), {
      type: 'START_EDIT',
      payload: { rowId: 1, field: 'name', value: 'Bob' },
    });
    expect(editing.editState).toEqual({ rowId: 1, field: 'name', value: 'Bob' });

    const done = gridReducer(editing, { type: 'END_EDIT' });
    expect(done.editState).toEqual({ rowId: null, field: null, value: null });
  });
});

describe('columns', () => {
  it('REORDER_COLUMNS moves a column', () => {
    const next = gridReducer(initial(), {
      type: 'REORDER_COLUMNS',
      payload: { fromIndex: 0, toIndex: 2 },
    });
    expect(next.columnOrder).toEqual(['name', 'age', 'id']);
  });

  it('RESIZE_COLUMN updates a single width', () => {
    const next = gridReducer(initial(), {
      type: 'RESIZE_COLUMN',
      payload: { field: 'name', width: 300 },
    });
    expect(next.columnWidths.name).toBe(300);
    expect(next.columnWidths.id).toBe(70);
  });

  it('PIN_COLUMN pins to a side and moving sides is exclusive', () => {
    const left = gridReducer(initial(), {
      type: 'PIN_COLUMN',
      payload: { field: 'id', side: 'left' },
    });
    expect(left.pinnedColumnsLeft).toContain('id');

    const right = gridReducer(left, {
      type: 'PIN_COLUMN',
      payload: { field: 'id', side: 'right' },
    });
    expect(right.pinnedColumnsLeft).not.toContain('id');
    expect(right.pinnedColumnsRight).toContain('id');
  });

  it('UNPIN_COLUMN removes a column from both sides', () => {
    const pinned = gridReducer(initial(), {
      type: 'PIN_COLUMN',
      payload: { field: 'id', side: 'left' },
    });
    const unpinned = gridReducer(pinned, { type: 'UNPIN_COLUMN', payload: 'id' });
    expect(unpinned.pinnedColumnsLeft).not.toContain('id');
    expect(unpinned.pinnedColumnsRight).not.toContain('id');
  });
});

describe('grouping', () => {
  it('ADD_GROUP adds a field and ignores duplicates', () => {
    const grouped = gridReducer(initial(), { type: 'ADD_GROUP', payload: 'age' });
    expect(grouped.groupBy).toEqual(['age']);
    const again = gridReducer(grouped, { type: 'ADD_GROUP', payload: 'age' });
    expect(again).toBe(grouped); // no-op returns same reference
  });

  it('REMOVE_GROUP removes a field', () => {
    const grouped = gridReducer(initial(), { type: 'ADD_GROUP', payload: 'age' });
    const removed = gridReducer(grouped, { type: 'REMOVE_GROUP', payload: 'age' });
    expect(removed.groupBy).toEqual([]);
  });

  it('CLEAR_GROUPS resets grouping state', () => {
    const grouped = gridReducer(initial(), { type: 'ADD_GROUP', payload: 'age' });
    const cleared = gridReducer(grouped, { type: 'CLEAR_GROUPS' });
    expect(cleared.groupBy).toEqual([]);
    expect(cleared.expandedGroups).toEqual({});
  });

  it('REORDER_GROUPS moves a group field', () => {
    let state = gridReducer(initial(), { type: 'ADD_GROUP', payload: 'name' });
    state = gridReducer(state, { type: 'ADD_GROUP', payload: 'age' });
    const reordered = gridReducer(state, {
      type: 'REORDER_GROUPS',
      payload: { fromIndex: 0, toIndex: 1 },
    });
    expect(reordered.groupBy).toEqual(['age', 'name']);
  });

  it('TOGGLE_GROUP flips a group expansion flag', () => {
    const toggled = gridReducer(initial(), { type: 'TOGGLE_GROUP', payload: 'city:London:0' });
    expect(toggled.expandedGroups['city:London:0']).toBe(true);
    const again = gridReducer(toggled, { type: 'TOGGLE_GROUP', payload: 'city:London:0' });
    expect(again.expandedGroups['city:London:0']).toBe(false);
  });
});

describe('column visibility', () => {
  it('TOGGLE_COLUMN_VISIBILITY hides then shows a column', () => {
    const hidden = gridReducer(initial(), { type: 'TOGGLE_COLUMN_VISIBILITY', payload: 'age' });
    expect(hidden.hiddenColumns).toContain('age');
    const shown = gridReducer(hidden, { type: 'TOGGLE_COLUMN_VISIBILITY', payload: 'age' });
    expect(shown.hiddenColumns).not.toContain('age');
  });

  it('TOGGLE_COLUMN_VISIBILITY keeps at least one column visible', () => {
    let state = initial();
    state = gridReducer(state, { type: 'TOGGLE_COLUMN_VISIBILITY', payload: 'id' });
    state = gridReducer(state, { type: 'TOGGLE_COLUMN_VISIBILITY', payload: 'name' });
    // Attempt to hide the last remaining visible column ('age') should be ignored
    state = gridReducer(state, { type: 'TOGGLE_COLUMN_VISIBILITY', payload: 'age' });
    expect(state.hiddenColumns).not.toContain('age');
  });

  it('SET_COLUMN_VISIBILITY explicitly toggles visibility', () => {
    const hidden = gridReducer(initial(), {
      type: 'SET_COLUMN_VISIBILITY',
      payload: { field: 'age', visible: false },
    });
    expect(hidden.hiddenColumns).toContain('age');
    const shown = gridReducer(hidden, {
      type: 'SET_COLUMN_VISIBILITY',
      payload: { field: 'age', visible: true },
    });
    expect(shown.hiddenColumns).not.toContain('age');
  });

  it('RESET_COLUMN_LAYOUT restores order and clears hidden/pinned', () => {
    let state = gridReducer(initial(), {
      type: 'REORDER_COLUMNS',
      payload: { fromIndex: 0, toIndex: 2 },
    });
    state = gridReducer(state, { type: 'PIN_COLUMN', payload: { field: 'name', side: 'left' } });
    state = gridReducer(state, { type: 'TOGGLE_COLUMN_VISIBILITY', payload: 'age' });
    const reset = gridReducer(state, { type: 'RESET_COLUMN_LAYOUT' });
    expect(reset.columnOrder).toEqual(['id', 'name', 'age']);
    expect(reset.hiddenColumns).toEqual([]);
    expect(reset.pinnedColumnsLeft).toEqual([]);
    expect(reset.pinnedColumnsRight).toEqual([]);
  });
});

describe('editing focus and reset', () => {
  it('SET_FOCUS stores the focus position', () => {
    const focused = gridReducer(initial(), {
      type: 'SET_FOCUS',
      payload: { rowIndex: 2, columnIndex: 1 },
    });
    expect(focused.focusState).toEqual({ rowIndex: 2, columnIndex: 1 });
  });

  it('RESET_COLUMNS rebuilds order/widths and drops stale pins', () => {
    const pinned = gridReducer(initial(), {
      type: 'PIN_COLUMN',
      payload: { field: 'age', side: 'left' },
    });
    const reset = gridReducer(pinned, {
      type: 'RESET_COLUMNS',
      payload: [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 180 },
      ],
    });
    expect(reset.columnOrder).toEqual(['id', 'name']);
    // 'age' no longer exists, so it must be dropped from pins
    expect(reset.pinnedColumnsLeft).not.toContain('age');
  });
});

describe('deselect / select all', () => {
  it('DESELECT_ALL_ROWS clears the selection', () => {
    const selected = gridReducer(initial(), {
      type: 'TOGGLE_ROW_SELECTION',
      payload: { rowId: 1, isMulti: true },
    });
    const cleared = gridReducer(selected, { type: 'DESELECT_ALL_ROWS' });
    expect(cleared.selection.selectedRows.size).toBe(0);
  });
});

describe('tree nodes', () => {
  it('TOGGLE_TREE_NODE collapses an expanded node then re-expands', () => {
    const collapsed = gridReducer(initial(), { type: 'TOGGLE_TREE_NODE', payload: 5 });
    expect(collapsed.expandedNodes['5']).toBe(false);
    const expanded = gridReducer(collapsed, { type: 'TOGGLE_TREE_NODE', payload: 5 });
    expect(expanded.expandedNodes['5']).toBe(true);
  });

  it('SET_EXPANDED_NODES replaces the expanded map', () => {
    const next = gridReducer(initial(), {
      type: 'SET_EXPANDED_NODES',
      payload: { '1': true, '2': false },
    });
    expect(next.expandedNodes).toEqual({ '1': true, '2': false });
  });
});

describe('row dragging', () => {
  it('START_DRAG then END_DRAG sets and clears drag state', () => {
    const dragging = gridReducer(initial(), {
      type: 'START_DRAG',
      payload: { rowId: 3, rowIndex: 2 },
    });
    expect(dragging.dragState.isDragging).toBe(true);
    expect(dragging.dragState.draggedRowId).toBe(3);

    const ended = gridReducer(dragging, { type: 'END_DRAG' });
    expect(ended.dragState.isDragging).toBe(false);
    expect(ended.dragState.draggedRowId).toBeNull();
  });
});

describe('row pinning', () => {
  it('PIN_ROW_TOP and PIN_ROW_BOTTOM are mutually exclusive', () => {
    const top = gridReducer(initial(), { type: 'PIN_ROW_TOP', payload: 7 });
    expect(top.pinnedRowsTop).toContain(7);

    const bottom = gridReducer(top, { type: 'PIN_ROW_BOTTOM', payload: 7 });
    expect(bottom.pinnedRowsTop).not.toContain(7);
    expect(bottom.pinnedRowsBottom).toContain(7);
  });

  it('UNPIN_ROW removes from both ends', () => {
    const pinned = gridReducer(initial(), { type: 'PIN_ROW_TOP', payload: 7 });
    const unpinned = gridReducer(pinned, { type: 'UNPIN_ROW', payload: 7 });
    expect(unpinned.pinnedRowsTop).not.toContain(7);
    expect(unpinned.pinnedRowsBottom).not.toContain(7);
  });
});

describe('master/detail rows', () => {
  it('TOGGLE_MASTER_ROW flips expansion', () => {
    const expanded = gridReducer(initial(), { type: 'TOGGLE_MASTER_ROW', payload: 9 });
    expect(expanded.detailRowState.expandedMasterRows['9']).toBe(true);
    const collapsed = gridReducer(expanded, { type: 'TOGGLE_MASTER_ROW', payload: 9 });
    expect(collapsed.detailRowState.expandedMasterRows['9']).toBe(false);
  });

  it('EXPAND_MASTER_ROW and COLLAPSE_MASTER_ROW set explicit state', () => {
    const expanded = gridReducer(initial(), { type: 'EXPAND_MASTER_ROW', payload: 9 });
    expect(expanded.detailRowState.expandedMasterRows['9']).toBe(true);
    const collapsed = gridReducer(expanded, { type: 'COLLAPSE_MASTER_ROW', payload: 9 });
    expect(collapsed.detailRowState.expandedMasterRows['9']).toBe(false);
  });

  it('SET_EXPANDED_MASTER_ROWS replaces the map', () => {
    const next = gridReducer(initial(), {
      type: 'SET_EXPANDED_MASTER_ROWS',
      payload: { '1': true },
    });
    expect(next.detailRowState.expandedMasterRows).toEqual({ '1': true });
  });
});

describe('unknown action', () => {
  it('returns the same state reference for an unhandled action', () => {
    const state = initial();
    // @ts-expect-error deliberately unknown action type
    expect(gridReducer(state, { type: 'DOES_NOT_EXIST' })).toBe(state);
  });
});
