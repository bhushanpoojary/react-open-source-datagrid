// Core type definitions for the DataGrid component

export interface Column {
  field: string;
  headerName: string;
  width?: number;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface Row {
  id: string | number;
  [key: string]: any;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc' | null;
}

export interface FilterConfig {
  [field: string]: string;
}

export interface SelectionState {
  selectedRows: Set<string | number>;
  lastSelectedIndex: number | null;
}

export interface EditState {
  rowId: string | number | null;
  field: string | null;
  value: any;
}

export interface FocusState {
  rowIndex: number;
  columnIndex: number;
}

// Main grid state interface
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
}

// Action types for reducer
export type GridAction =
  | { type: 'SET_SORT'; payload: SortConfig }
  | { type: 'SET_FILTER'; payload: { field: string; value: string } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'TOGGLE_ROW_SELECTION'; payload: { rowId: string | number; isMulti: boolean } }
  | { type: 'SELECT_RANGE'; payload: { startIndex: number; endIndex: number; rowIds: (string | number)[] } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'START_EDIT'; payload: { rowId: string | number; field: string; value: any } }
  | { type: 'END_EDIT' }
  | { type: 'SET_FOCUS'; payload: FocusState | null }
  | { type: 'REORDER_COLUMNS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'RESIZE_COLUMN'; payload: { field: string; width: number } }
  | { type: 'RESET_COLUMNS'; payload: Column[] };

// Props for the main DataGrid component
export interface DataGridProps {
  columns: Column[];
  rows: Row[];
  pageSize?: number;
  onRowClick?: (row: Row) => void;
  onCellEdit?: (rowIndex: number, field: string, value: any) => void;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}
