/**
 * Grid API Types
 * AG Grid-inspired API surface for programmatic grid control
 */

import type { Column, Row, FilterConfig, SortConfig, LayoutPreset } from './types';

/**
 * Column key - can be field name or column index
 */
export type ColKey = string | number;

/**
 * Row node representing a single row in the grid with metadata
 */
export interface RowNode<T = Row> {
  /** Unique row ID */
  id: string | number;
  /** The actual row data */
  data: T;
  /** Row index in the current display order (after filter/sort) */
  rowIndex: number;
  /** Whether this row is currently selected */
  selected: boolean;
  /** For grouped rows */
  group?: boolean;
  /** For tree rows */
  level?: number;
  /** Parent node for tree/group */
  parent?: RowNode<T> | null;
  /** Child nodes for tree/group */
  childrenAfterGroup?: RowNode<T>[];
  /** Whether group/tree node is expanded */
  expanded?: boolean;
  /** Set selection state for this row */
  setSelected(selected: boolean, clearOther?: boolean): void;
  /** Set expanded state (for groups/tree) */
  setExpanded?(expanded: boolean): void;
}

/**
 * Row model providing access to grid data
 */
export interface RowModel {
  /** Total number of rows (before filter) */
  getRowCount(): number;
  /** Get row node at specific index (after filter/sort) */
  getRow(index: number): RowNode | null;
  /** Iterate through all rows */
  forEachNode(callback: (node: RowNode, index: number) => void): void;
}

/**
 * Column state for persistence
 */
export interface ColumnState {
  colId: string;
  width?: number;
  hide?: boolean;
  pinned?: 'left' | 'right' | null;
  sort?: 'asc' | 'desc' | null;
  sortIndex?: number;
}

/**
 * Parameters for refreshing cells
 */
export interface RefreshCellsParams {
  /** Specific row nodes to refresh */
  rowNodes?: RowNode[];
  /** Specific columns to refresh */
  columns?: ColKey[];
  /** Force refresh even if data hasn't changed */
  force?: boolean;
}

/**
 * Parameters for redrawing rows
 */
export interface RedrawRowsParams {
  /** Specific row nodes to redraw */
  rowNodes?: RowNode[];
}

/**
 * CSV export parameters
 */
export interface CsvExportParams {
  /** Filename for the export (without extension) */
  fileName?: string;
  /** Column keys to include (default: all visible) */
  columnKeys?: ColKey[];
  /** Skip column headers */
  skipHeader?: boolean;
  /** Skip column group headers */
  skipColumnGroupHeaders?: boolean;
  /** Skip pinned top rows */
  skipPinnedTop?: boolean;
  /** Skip pinned bottom rows */
  skipPinnedBottom?: boolean;
  /** Only export selected rows */
  onlySelected?: boolean;
  /** Only export filtered rows */
  onlyFiltered?: boolean;
  /** Custom column separator (default: ',') */
  columnSeparator?: string;
  /** Suppress quotes around values */
  suppressQuotes?: boolean;
  /** Custom value processor */
  processCellCallback?: (params: { 
    value: unknown; 
    column: Column; 
    node: RowNode;
  }) => string;
}

/**
 * Excel export parameters
 */
export interface ExcelExportParams extends CsvExportParams {
  /** Sheet name */
  sheetName?: string;
  /** Author metadata */
  author?: string;
}

/**
 * Transaction for updating row data
 */
export interface RowDataTransaction<T = Row> {
  /** Rows to add */
  add?: T[];
  /** Rows to update (matched by ID) */
  update?: T[];
  /** Rows to remove (matched by ID) */
  remove?: T[];
  /** Index to add rows at */
  addIndex?: number;
}

/**
 * Result of a transaction
 */
export interface RowNodeTransaction<T = Row> {
  add: RowNode<T>[];
  remove: RowNode<T>[];
  update: RowNode<T>[];
}

/**
 * Cell range for clipboard operations
 */
export interface CellRange {
  startRow: RowNode;
  endRow: RowNode;
  columns: Column[];
}

/**
 * Parameters for starting cell editing
 */
export interface StartEditingCellParams {
  rowIndex: number;
  colKey: ColKey;
  /** Keyboard event that triggered editing */
  key?: string;
  /** Character to populate cell with */
  charPress?: string;
}

/**
 * Main Grid API Interface
 * Provides programmatic access to grid functionality
 */
export interface GridApi {
  // ==================== DATA / MODEL ====================
  
  /** Replace all row data */
  setRowData(rows: Row[]): void;
  
  /** Apply a transaction to add/remove/update rows */
  applyTransaction(transaction: RowDataTransaction): RowNodeTransaction;
  
  /** Apply transaction asynchronously (for better performance with large datasets) */
  applyTransactionAsync(transaction: RowDataTransaction): Promise<RowNodeTransaction>;
  
  /** Get the row model */
  getModel(): RowModel;
  
  /** Get number of displayed rows (after filter/sort) */
  getDisplayedRowCount(): number;
  
  /** Get row node at specific display index */
  getDisplayedRowAtIndex(index: number): RowNode | null;
  
  /** Iterate through all row nodes */
  forEachNode(callback: (node: RowNode, index: number) => void): void;
  
  /** Iterate through nodes after filter */
  forEachNodeAfterFilter(callback: (node: RowNode, index: number) => void): void;
  
  /** Iterate through nodes after filter and sort */
  forEachNodeAfterFilterAndSort(callback: (node: RowNode, index: number) => void): void;
  
  /** Get first displayed row index */
  getFirstDisplayedRow(): number;
  
  /** Get last displayed row index */
  getLastDisplayedRow(): number;

  // ==================== COLUMNS ====================
  
  /** Get current column definitions */
  getColumnDefs(): Column[];
  
  /** Replace column definitions */
  setColumnDefs(colDefs: Column[]): void;
  
  /** Get all columns */
  getAllColumns(): Column[];
  
  /** Get displayed columns in center (not pinned) */
  getDisplayedCenterColumns(): Column[];
  
  /** Get displayed left pinned columns */
  getDisplayedLeftColumns(): Column[];
  
  /** Get displayed right pinned columns */
  getDisplayedRightColumns(): Column[];
  
  /** Show or hide a column */
  setColumnVisible(key: ColKey, visible: boolean): void;
  
  /** Show or hide multiple columns */
  setColumnsVisible(keys: ColKey[], visible: boolean): void;
  
  /** Pin or unpin a column */
  setColumnPinned(key: ColKey, pinned: 'left' | 'right' | null): void;
  
  /** Auto-size specific columns to fit content */
  autoSizeColumns(keys?: ColKey[]): void;
  
  /** Auto-size all columns to fit content */
  autoSizeAllColumns(): void;
  
  /** Move column to new position */
  moveColumn(key: ColKey, toIndex: number): void;
  
  /** Move columns to new positions */
  moveColumns(keys: ColKey[], toIndex: number): void;
  
  /** Get current column state */
  getColumnState(): ColumnState[];
  
  /** Apply column state (restore from saved state) */
  applyColumnState(state: ColumnState[]): void;
  
  /** Reset column state to initial */
  resetColumnState(): void;
  
  /** Get column by key */
  getColumn(key: ColKey): Column | null;

  // ==================== FILTERING ====================
  
  /** Check if any filter is currently active */
  isAnyFilterPresent(): boolean;
  
  /** Get current filter model */
  getFilterModel(): FilterConfig;
  
  /** Set filter model */
  setFilterModel(model: FilterConfig): void;
  
  /** Trigger filter changed event */
  onFilterChanged(): void;
  
  /** Destroy filter for specific column */
  destroyFilter(colKey: ColKey): void;
  
  /** Get filter instance for a column */
  getFilterInstance(colKey: ColKey): unknown;
  
  /** Clear all filters */
  clearAllFilters(): void;

  // ==================== SORTING ====================
  
  /** Get current sort model */
  getSortModel(): SortConfig[];
  
  /** Set sort model */
  setSortModel(model: SortConfig[]): void;
  
  /** Trigger sort changed event */
  onSortChanged(): void;
  
  /** Clear all sorting */
  clearAllSorting(): void;

  // ==================== SELECTION ====================
  
  /** Get selected row nodes */
  getSelectedNodes(): RowNode[];
  
  /** Get selected row data */
  getSelectedRows(): Row[];
  
  /** Select all rows */
  selectAll(): void;
  
  /** Deselect all rows */
  deselectAll(): void;
  
  /** Select all filtered rows */
  selectAllFiltered(): void;
  
  /** Deselect all filtered rows */
  deselectAllFiltered(): void;
  
  /** Get number of selected rows */
  getSelectedRowCount(): number;

  // ==================== NAVIGATION / FOCUS ====================
  
  /** Ensure row index is visible in viewport */
  ensureIndexVisible(index: number, position?: 'top' | 'middle' | 'bottom'): void;
  
  /** Ensure row node is visible in viewport */
  ensureNodeVisible(node: RowNode, position?: 'top' | 'middle' | 'bottom'): void;
  
  /** Set focused cell */
  setFocusedCell(rowIndex: number, colKey: ColKey): void;
  
  /** Clear focused cell */
  clearFocusedCell(): void;
  
  /** Get currently focused cell */
  getFocusedCell(): { rowIndex: number; column: Column } | null;

  // ==================== EDITING ====================
  
  /** Start editing a cell */
  startEditingCell(params: StartEditingCellParams): void;
  
  /** Stop editing (save or cancel) */
  stopEditing(cancel?: boolean): void;
  
  /** Get cells currently being edited */
  getEditingCells(): Array<{ rowIndex: number; column: Column }>;

  // ==================== RENDERING / REFRESH ====================
  
  /** Re-render specific cells */
  refreshCells(params?: RefreshCellsParams): void;
  
  /** Re-render column headers */
  refreshHeader(): void;
  
  /** Refresh tool panel */
  refreshToolPanel(): void;
  
  /** Redraw rows (full re-render) */
  redrawRows(params?: RedrawRowsParams): void;
  
  /** Resize columns to fit grid width */
  sizeColumnsToFit(): void;
  
  /** Force layout recalculation */
  doLayout(): void;

  // ==================== EXPORT / CLIPBOARD ====================
  
  /** Export data as CSV file */
  exportDataAsCsv(params?: CsvExportParams): void;
  
  /** Get data as CSV string */
  getDataAsCsv(params?: CsvExportParams): string;
  
  /** Export data as Excel file */
  exportDataAsExcel(params?: ExcelExportParams): void;
  
  /** Copy selected rows to clipboard */
  copySelectedRowsToClipboard(): void;
  
  /** Copy selected range to clipboard */
  copySelectedRangeToClipboard(): void;

  // ==================== OVERLAYS ====================
  
  /** Show loading overlay */
  showLoadingOverlay(): void;
  
  /** Show no rows overlay */
  showNoRowsOverlay(): void;
  
  /** Hide all overlays */
  hideOverlay(): void;

  // ==================== PAGINATION ====================
  
  /** Get current page */
  paginationGetCurrentPage(): number;
  
  /** Go to specific page */
  paginationGoToPage(page: number): void;
  
  /** Go to next page */
  paginationGoToNextPage(): void;
  
  /** Go to previous page */
  paginationGoToPreviousPage(): void;
  
  /** Get total number of pages */
  paginationGetTotalPages(): number;
  
  /** Get page size */
  paginationGetPageSize(): number;
  
  /** Set page size */
  paginationSetPageSize(size: number): void;

  // ==================== GROUPING / TREE ====================
  
  /** Set columns to group by */
  setRowGroupColumns(colKeys: ColKey[]): void;
  
  /** Add column to grouping */
  addRowGroupColumn(colKey: ColKey): void;
  
  /** Remove column from grouping */
  removeRowGroupColumn(colKey: ColKey): void;
  
  /** Get columns used for grouping */
  getRowGroupColumns(): Column[];
  
  /** Expand all groups/tree nodes */
  expandAll(): void;
  
  /** Collapse all groups/tree nodes */
  collapseAll(): void;
  
  /** Expand specific node */
  onGroupExpandedOrCollapsed(node?: RowNode): void;

  // ==================== LAYOUT PERSISTENCE ====================
  
  /** Save current layout with name */
  saveLayout(name: string): Promise<void>;
  
  /** Load layout by name */
  loadLayout(name: string): Promise<void>;
  
  /** Get current layout state */
  getLayoutState(): LayoutPreset['layout'];
  
  /** Apply layout state */
  applyLayoutState(layout: LayoutPreset['layout']): void;

  // ==================== LIFECYCLE ====================
  
  /** Destroy grid and clean up resources */
  destroy(): void;
  
  /** Check if grid has been destroyed */
  isDestroyed(): boolean;

  // ==================== EVENTS ====================
  
  /** Add event listener */
  addEventListener(eventType: string, listener: (event: unknown) => void): void;
  
  /** Remove event listener */
  removeEventListener(eventType: string, listener: (event: unknown) => void): void;
}
