// Reducer state and action types for the DataGrid.
import type {
  Column,
  Row,
  SortConfig,
  FilterConfig,
  FilterValue,
  AdvancedFilterValue,
  SelectionState,
  EditState,
  FocusState,
  ExpandedGroups,
  ExpandedNodes,
  DragState,
  DetailRowState,
  ExpandedMasterRows,
} from './types.model';
import type { LayoutPreset } from './types.persistence';

export interface GridState {
  columns: Column[];
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  currentPage: number;
  pageSize: number;
  selection: SelectionState;
  editState: EditState;
  focusState: FocusState | null;
  columnOrder: string[]; // Array of field names in display order
  columnWidths: { [field: string]: number };
  groupBy: string[]; // Array of field names to group by
  expandedGroups: ExpandedGroups; // Track which groups are expanded
  pinnedColumnsLeft: string[];
  pinnedColumnsRight: string[];
  hiddenColumns: string[]; // Array of field names that are hidden
  expandedNodes: ExpandedNodes; // Track which tree nodes are expanded
  dragState: DragState; // Track drag-and-drop state
  pinnedRowsTop: (string | number)[]; // Array of row IDs pinned to top
  pinnedRowsBottom: (string | number)[]; // Array of row IDs pinned to bottom
  detailRowState: DetailRowState; // Track expanded master rows
  editHistory: Array<{ rowId: string | number; field: string; oldValue: unknown; newValue: unknown }>; // Undo/redo stack
  editFuture:  Array<{ rowId: string | number; field: string; oldValue: unknown; newValue: unknown }>; // Redo stack
}

// Action types for reducer
export type GridAction =
  | { type: 'SET_SORT'; payload: SortConfig }
  | { type: 'SET_FILTER'; payload: { field: string; value: FilterValue | AdvancedFilterValue | null } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'TOGGLE_ROW_SELECTION'; payload: { rowId: string | number; isMulti: boolean } }
  | { type: 'SELECT_RANGE'; payload: { startIndex: number; endIndex: number; rowIds: (string | number)[] } }
  | { type: 'CLEAR_SELECTION' }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'START_EDIT'; payload: { rowId: string | number; field: string; value: any } }
  | { type: 'END_EDIT' }
  | { type: 'SET_FOCUS'; payload: FocusState | null }
  | { type: 'REORDER_COLUMNS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'RESIZE_COLUMN'; payload: { field: string; width: number } }
  | { type: 'RESET_COLUMNS'; payload: Column[] }
  | { type: 'ADD_GROUP'; payload: string }
  | { type: 'REMOVE_GROUP'; payload: string }
  | { type: 'REORDER_GROUPS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'TOGGLE_GROUP'; payload: string }
  | { type: 'CLEAR_GROUPS' }
  | { type: 'PIN_COLUMN'; payload: { field: string; side: 'left' | 'right' } }
  | { type: 'UNPIN_COLUMN'; payload: string }
  | { type: 'TOGGLE_COLUMN_VISIBILITY'; payload: string }
  | { type: 'SET_COLUMN_VISIBILITY'; payload: { field: string; visible: boolean } }
  | { type: 'RESET_COLUMN_LAYOUT' }
  | { type: 'LOAD_LAYOUT_PRESET'; payload: LayoutPreset['layout'] }
  | { type: 'APPLY_LAYOUT'; payload: Partial<LayoutPreset['layout']> }
  | { type: 'TOGGLE_TREE_NODE'; payload: string | number }
  | { type: 'EXPAND_ALL_NODES' }
  | { type: 'COLLAPSE_ALL_NODES' }
  | { type: 'SET_EXPANDED_NODES'; payload: ExpandedNodes }
  | { type: 'SET_DRAG_STATE'; payload: DragState }
  | { type: 'START_DRAG'; payload: { rowId: string | number; rowIndex: number } }
  | { type: 'END_DRAG' }
  | { type: 'PIN_ROW_TOP'; payload: string | number }
  | { type: 'PIN_ROW_BOTTOM'; payload: string | number }
  | { type: 'UNPIN_ROW'; payload: string | number }
  | { type: 'TOGGLE_MASTER_ROW'; payload: string | number }
  | { type: 'EXPAND_MASTER_ROW'; payload: string | number }
  | { type: 'COLLAPSE_MASTER_ROW'; payload: string | number }
  | { type: 'SET_EXPANDED_MASTER_ROWS'; payload: ExpandedMasterRows }
  // Grid API actions
  | { type: 'SET_ROW_DATA'; payload: Row[] }
  | { type: 'SET_COLUMN_DEFS'; payload: Column[] }
  | { type: 'SORT_COLUMN'; payload: string }
  | { type: 'SET_SORT_MODEL'; payload: SortConfig[] }
  | { type: 'CLEAR_ALL_FILTERS' }
  | { type: 'CLEAR_ALL_SORTING' }
  | { type: 'SELECT_ROW'; payload: { rowId: string | number; ctrlKey: boolean } }
  | { type: 'DESELECT_ROW'; payload: string | number }
  | { type: 'SELECT_ALL_ROWS' }
  | { type: 'DESELECT_ALL_ROWS' }
  | { type: 'CLEAR_FOCUS' }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'START_EDITING'; payload: { rowId: string | number; field: string; value: any } }
  | { type: 'CANCEL_EDITING' }
  | { type: 'SAVE_EDIT' }
  | { type: 'REFRESH_CELLS'; payload?: unknown }
  | { type: 'REFRESH_HEADER' }
  | { type: 'REDRAW_ROWS'; payload?: unknown }
  | { type: 'SHOW_OVERLAY'; payload: 'loading' | 'noRows' }
  | { type: 'HIDE_OVERLAY' }
  | { type: 'SET_GROUP_BY'; payload: string[] }
  | { type: 'RECALCULATE_LAYOUT' }
  | { type: 'RESET_COLUMN_STATE' }
  | { type: 'RECORD_EDIT'; payload: { rowId: string | number; field: string; oldValue: unknown; newValue: unknown } }
  | { type: 'UNDO_EDIT' }
  | { type: 'REDO_EDIT' };
