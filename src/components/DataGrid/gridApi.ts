/**
 * Grid API Implementation
 * Concrete implementation of the GridApi interface
 */

import type { Dispatch } from 'react';
import type {
  GridApi,
  RowNode,
  RowModel,
  ColumnState,
  RefreshCellsParams,
  RedrawRowsParams,
  CsvExportParams,
  ExcelExportParams,
  RowDataTransaction,
  RowNodeTransaction,
  StartEditingCellParams,
  ColKey,
} from './gridApi.types';
import type { Column, Row, FilterConfig, SortConfig, LayoutPreset } from './types';
import type { GridAction, GridState } from './gridReducer';
import { LayoutPersistenceManager } from './layoutPersistence';

/**
 * Grid API Implementation
 */
export class GridApiImpl implements GridApi {
  private state: GridState;
  private dispatch: Dispatch<GridAction>;
  private columns: Column[];
  private rows: Row[];
  private persistenceManager: LayoutPersistenceManager | null = null;
  private destroyed = false;
  private containerRef: React.RefObject<HTMLDivElement | null>;
  private eventListeners: Map<string, Set<(event: unknown) => void>> = new Map();
  private setInternalRows?: (rows: Row[]) => void;

  constructor(
    state: GridState,
    dispatch: Dispatch<GridAction>,
    columns: Column[],
    rows: Row[],
    containerRef: React.RefObject<HTMLDivElement | null>,
    persistenceManager?: LayoutPersistenceManager | null,
    setInternalRows?: (rows: Row[]) => void
  ) {
    this.state = state;
    this.dispatch = dispatch;
    this.columns = columns;
    this.rows = rows;
    this.containerRef = containerRef;
    this.persistenceManager = persistenceManager || null;
    this.setInternalRows = setInternalRows;
  }

  /**
   * Update internal state reference (called by parent component on state change)
   */
  updateState(state: GridState): void {
    this.state = state;
  }

  /**
   * Update internal data references
   */
  updateData(columns: Column[], rows: Row[]): void {
    this.columns = columns;
    this.rows = rows;
  }

  /**
   * Update callback references
   */
  updateCallbacks(setInternalRows?: (rows: Row[]) => void): void {
    this.setInternalRows = setInternalRows;
  }

  // ==================== DATA / MODEL ====================

  setRowData(rows: Row[]): void {
    this.ensureNotDestroyed();
    this.rows = rows;
    if (this.setInternalRows) {
      this.setInternalRows(rows);
    }
    this.dispatch({ type: 'SET_ROW_DATA', payload: rows });
    this.fireEvent('rowDataChanged', { api: this, rows });
  }

  applyTransaction(transaction: RowDataTransaction): RowNodeTransaction {
    this.ensureNotDestroyed();
    const result: RowNodeTransaction = {
      add: [],
      remove: [],
      update: [],
    };

    let updatedRows = [...this.rows];

    // Remove rows
    if (transaction.remove && transaction.remove.length > 0) {
      const removeIds = new Set(transaction.remove.map(r => r.id));
      const removed = updatedRows.filter(r => removeIds.has(r.id));
      updatedRows = updatedRows.filter(r => !removeIds.has(r.id));
      result.remove = removed.map((r, idx) => this.createRowNode(r, idx));
    }

    // Update rows
    if (transaction.update && transaction.update.length > 0) {
      const updateMap = new Map(transaction.update.map(r => [r.id, r]));
      updatedRows = updatedRows.map(r => {
        const update = updateMap.get(r.id);
        if (update) {
          result.update.push(this.createRowNode(update, 0));
          return { ...r, ...update };
        }
        return r;
      });
    }

    // Add rows
    if (transaction.add && transaction.add.length > 0) {
      const addIndex = transaction.addIndex ?? updatedRows.length;
      updatedRows.splice(addIndex, 0, ...transaction.add);
      result.add = transaction.add.map((r, idx) => 
        this.createRowNode(r, addIndex + idx)
      );
    }

    this.setRowData(updatedRows);
    this.fireEvent('rowDataUpdated', { api: this, transaction: result });

    return result;
  }

  async applyTransactionAsync(transaction: RowDataTransaction): Promise<RowNodeTransaction> {
    return Promise.resolve(this.applyTransaction(transaction));
  }

  getModel(): RowModel {
    return {
      getRowCount: () => this.rows.length,
      getRow: (index: number) => {
        const row = this.rows[index];
        return row ? this.createRowNode(row, index) : null;
      },
      forEachNode: (callback) => {
        this.rows.forEach((row, index) => {
          callback(this.createRowNode(row, index), index);
        });
      },
    };
  }

  getDisplayedRowCount(): number {
    this.ensureNotDestroyed();
    // After filtering and pagination
    return this.getDisplayedRows().length;
  }

  getDisplayedRowAtIndex(index: number): RowNode | null {
    this.ensureNotDestroyed();
    const displayedRows = this.getDisplayedRows();
    const row = displayedRows[index];
    return row ? this.createRowNode(row, index) : null;
  }

  forEachNode(callback: (node: RowNode, index: number) => void): void {
    this.ensureNotDestroyed();
    this.rows.forEach((row, index) => {
      callback(this.createRowNode(row, index), index);
    });
  }

  forEachNodeAfterFilter(callback: (node: RowNode, index: number) => void): void {
    this.ensureNotDestroyed();
    const filteredRows = this.getFilteredRows();
    filteredRows.forEach((row, index) => {
      callback(this.createRowNode(row, index), index);
    });
  }

  forEachNodeAfterFilterAndSort(callback: (node: RowNode, index: number) => void): void {
    this.ensureNotDestroyed();
    const displayedRows = this.getDisplayedRows();
    displayedRows.forEach((row, index) => {
      callback(this.createRowNode(row, index), index);
    });
  }

  getFirstDisplayedRow(): number {
    return 0;
  }

  getLastDisplayedRow(): number {
    return Math.max(0, this.getDisplayedRowCount() - 1);
  }

  // ==================== COLUMNS ====================

  getColumnDefs(): Column[] {
    this.ensureNotDestroyed();
    return [...this.columns];
  }

  setColumnDefs(colDefs: Column[]): void {
    this.ensureNotDestroyed();
    this.columns = colDefs;
    this.dispatch({ type: 'SET_COLUMN_DEFS', payload: colDefs });
    this.fireEvent('columnDefsChanged', { api: this, columnDefs: colDefs });
  }

  getAllColumns(): Column[] {
    return this.getColumnDefs();
  }

  getDisplayedCenterColumns(): Column[] {
    this.ensureNotDestroyed();
    const pinnedLeft = new Set(this.state.pinnedColumnsLeft);
    const pinnedRight = new Set(this.state.pinnedColumnsRight);
    const hidden = new Set(this.state.hiddenColumns);
    
    return this.state.columnOrder
      .filter((field: string) => !pinnedLeft.has(field) && !pinnedRight.has(field) && !hidden.has(field))
      .map((field: string) => this.columns.find(col => col.field === field))
      .filter((col: Column | undefined): col is Column => col !== undefined);
  }

  getDisplayedLeftColumns(): Column[] {
    this.ensureNotDestroyed();
    const hidden = new Set(this.state.hiddenColumns);
    
    return this.state.pinnedColumnsLeft
      .filter((field: string) => !hidden.has(field))
      .map((field: string) => this.columns.find(col => col.field === field))
      .filter((col: Column | undefined): col is Column => col !== undefined);
  }

  getDisplayedRightColumns(): Column[] {
    this.ensureNotDestroyed();
    const hidden = new Set(this.state.hiddenColumns);
    
    return this.state.pinnedColumnsRight
      .filter((field: string) => !hidden.has(field))
      .map((field: string) => this.columns.find(col => col.field === field))
      .filter((col: Column | undefined): col is Column => col !== undefined);
  }

  setColumnVisible(key: ColKey, visible: boolean): void {
    this.ensureNotDestroyed();
    const field = this.resolveColKey(key);
    if (field) {
      this.dispatch({ type: 'SET_COLUMN_VISIBILITY', payload: { field, visible } });
      this.fireEvent('columnVisible', { api: this, column: field, visible });
    }
  }

  setColumnsVisible(keys: ColKey[], visible: boolean): void {
    this.ensureNotDestroyed();
    keys.forEach(key => this.setColumnVisible(key, visible));
  }

  setColumnPinned(key: ColKey, pinned: 'left' | 'right' | null): void {
    this.ensureNotDestroyed();
    const field = this.resolveColKey(key);
    if (field) {
      if (pinned) {
        this.dispatch({ type: 'PIN_COLUMN', payload: { field, side: pinned } });
      } else {
        this.dispatch({ type: 'UNPIN_COLUMN', payload: field });
      }
      this.fireEvent('columnPinned', { api: this, column: field, pinned });
    }
  }

  autoSizeColumns(keys?: ColKey[]): void {
    this.ensureNotDestroyed();
    if (!keys || keys.length === 0) {
      this.autoSizeAllColumns();
      return;
    }

    // Auto-size specific columns
    keys.forEach(key => {
      const field = this.resolveColKey(key);
      if (field) {
        const width = this.calculateColumnWidth(field);
        this.dispatch({ type: 'RESIZE_COLUMN', payload: { field, width } });
      }
    });
    this.fireEvent('columnResized', { api: this, columns: keys });
  }

  autoSizeAllColumns(): void {
    this.ensureNotDestroyed();
    const widths: Record<string, number> = {};
    
    this.columns.forEach(col => {
      widths[col.field] = this.calculateColumnWidth(col.field);
    });

    Object.entries(widths).forEach(([field, width]) => {
      this.dispatch({ type: 'RESIZE_COLUMN', payload: { field, width } });
    });
    this.fireEvent('columnResized', { api: this, columns: Object.keys(widths) });
  }

  moveColumn(key: ColKey, toIndex: number): void {
    this.ensureNotDestroyed();
    const field = this.resolveColKey(key);
    if (field) {
      const fromIndex = this.state.columnOrder.indexOf(field);
      if (fromIndex !== -1) {
        this.dispatch({ type: 'REORDER_COLUMNS', payload: { fromIndex, toIndex } });
        this.fireEvent('columnMoved', { api: this, column: field, toIndex });
      }
    }
  }

  moveColumns(keys: ColKey[], toIndex: number): void {
    this.ensureNotDestroyed();
    keys.forEach((key, offset) => {
      this.moveColumn(key, toIndex + offset);
    });
  }

  getColumnState(): ColumnState[] {
    this.ensureNotDestroyed();
    const pinnedLeft = new Set(this.state.pinnedColumnsLeft);
    const pinnedRight = new Set(this.state.pinnedColumnsRight);
    
    return this.state.columnOrder.map((field: string) => {
      const isHidden = this.state.hiddenColumns.includes(field);
      const isSorted = this.state.sortConfig.field === field;
      
      return {
        colId: field,
        width: this.state.columnWidths[field],
        hide: isHidden,
        pinned: pinnedLeft.has(field) ? 'left' : pinnedRight.has(field) ? 'right' : null,
        sort: isSorted ? this.state.sortConfig.direction : null,
        sortIndex: isSorted ? 0 : undefined,
      };
    });
  }

  applyColumnState(state: ColumnState[]): void {
    this.ensureNotDestroyed();
    
    state.forEach(colState => {
      const { colId, width, hide, pinned, sort } = colState;
      
      if (width !== undefined) {
        this.dispatch({ type: 'RESIZE_COLUMN', payload: { field: colId, width } });
      }
      
      if (hide !== undefined) {
        const currentlyHidden = this.state.hiddenColumns.includes(colId);
        if (hide !== currentlyHidden) {
          this.dispatch({ type: 'TOGGLE_COLUMN_VISIBILITY', payload: colId });
        }
      }
      
      if (pinned !== undefined) {
        this.setColumnPinned(colId, pinned);
      }
      
      if (sort !== undefined && sort !== null) {
        this.dispatch({ type: 'SORT_COLUMN', payload: colId });
      }
    });
    
    this.fireEvent('columnStateChanged', { api: this, state });
  }

  resetColumnState(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'RESET_COLUMN_STATE' });
    this.fireEvent('columnStateReset', { api: this });
  }

  getColumn(key: ColKey): Column | null {
    const field = this.resolveColKey(key);
    return field ? this.columns.find(col => col.field === field) || null : null;
  }

  // ==================== FILTERING ====================

  isAnyFilterPresent(): boolean {
    this.ensureNotDestroyed();
    return Object.keys(this.state.filterConfig).length > 0;
  }

  getFilterModel(): FilterConfig {
    this.ensureNotDestroyed();
    return { ...this.state.filterConfig };
  }

  setFilterModel(model: FilterConfig): void {
    this.ensureNotDestroyed();
    Object.entries(model).forEach(([field, value]) => {
      this.dispatch({ type: 'SET_FILTER', payload: { field, value } });
    });
    this.fireEvent('filterChanged', { api: this, filterModel: model });
  }

  onFilterChanged(): void {
    this.ensureNotDestroyed();
    this.fireEvent('filterChanged', { api: this, filterModel: this.getFilterModel() });
  }

  destroyFilter(colKey: ColKey): void {
    this.ensureNotDestroyed();
    const field = this.resolveColKey(colKey);
    if (field) {
      this.dispatch({ type: 'SET_FILTER', payload: { field, value: null } });
    }
  }

  getFilterInstance(_colKey: ColKey): unknown {
    // This would return filter component instance in a full implementation
    return null;
  }

  clearAllFilters(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'CLEAR_FILTERS' });
    this.fireEvent('filterChanged', { api: this, filterModel: {} });
  }

  // ==================== SORTING ====================

  getSortModel(): SortConfig[] {
    this.ensureNotDestroyed();
    // GridState uses a single sortConfig, wrap in array for AG Grid compatibility
    if (this.state.sortConfig.field && this.state.sortConfig.direction) {
      return [this.state.sortConfig];
    }
    return [];
  }

  setSortModel(model: SortConfig[]): void {
    this.ensureNotDestroyed();
    // GridState uses a single sortConfig, use first item from array
    const sortConfig = model.length > 0 ? model[0] : { field: '', direction: null };
    this.dispatch({ type: 'SET_SORT', payload: sortConfig });
    this.fireEvent('sortChanged', { api: this, sortModel: model });
  }

  onSortChanged(): void {
    this.ensureNotDestroyed();
    this.fireEvent('sortChanged', { api: this, sortModel: this.getSortModel() });
  }

  clearAllSorting(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'SET_SORT', payload: { field: '', direction: null } });
    this.fireEvent('sortChanged', { api: this, sortModel: [] });
  }

  // ==================== SELECTION ====================

  getSelectedNodes(): RowNode[] {
    this.ensureNotDestroyed();
    const selectedIds = Array.from(this.state.selection.selectedRows);
    return this.rows
      .filter(row => selectedIds.includes(row.id))
      .map((row, index) => this.createRowNode(row, index, true));
  }

  getSelectedRows(): Row[] {
    this.ensureNotDestroyed();
    const selectedIds = Array.from(this.state.selection.selectedRows);
    return this.rows.filter(row => selectedIds.includes(row.id));
  }

  selectAll(): void {
    this.ensureNotDestroyed();
    // Select all rows at once using SELECT_RANGE action for efficiency
    const rowIds = this.rows.map(row => row.id);
    this.dispatch({ 
      type: 'SELECT_RANGE', 
      payload: { 
        startIndex: 0, 
        endIndex: this.rows.length - 1, 
        rowIds 
      } 
    });
    this.fireEvent('selectionChanged', { api: this });
  }

  deselectAll(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'DESELECT_ALL_ROWS' });
    this.fireEvent('selectionChanged', { api: this });
  }

  selectAllFiltered(): void {
    this.ensureNotDestroyed();
    const filteredRows = this.getFilteredRows();
    const rowIds = filteredRows.map(row => row.id);
    this.dispatch({ 
      type: 'SELECT_RANGE', 
      payload: { 
        startIndex: 0, 
        endIndex: filteredRows.length - 1, 
        rowIds 
      } 
    });
    this.fireEvent('selectionChanged', { api: this });
  }

  deselectAllFiltered(): void {
    this.ensureNotDestroyed();
    const filteredRows = this.getFilteredRows();
    const filteredIds = new Set(filteredRows.map(r => r.id));
    
    Array.from(this.state.selection.selectedRows).forEach(id => {
      if (filteredIds.has(id as string | number)) {
        this.dispatch({ type: 'DESELECT_ROW', payload: id });
      }
    });
    this.fireEvent('selectionChanged', { api: this });
  }

  getSelectedRowCount(): number {
    return this.state.selection.selectedRows.size;
  }

  // ==================== NAVIGATION / FOCUS ====================

  ensureIndexVisible(index: number, position?: 'top' | 'middle' | 'bottom'): void {
    this.ensureNotDestroyed();
    if (!this.containerRef.current) return;

    const rowElement = this.containerRef.current.querySelector(
      `[data-row-index="${index}"]`
    ) as HTMLElement;

    if (rowElement) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: 'smooth',
        block: position === 'top' ? 'start' : position === 'bottom' ? 'end' : 'center',
      };
      rowElement.scrollIntoView(scrollOptions);
    }
  }

  ensureNodeVisible(node: RowNode, position?: 'top' | 'middle' | 'bottom'): void {
    this.ensureIndexVisible(node.rowIndex, position);
  }

  setFocusedCell(rowIndex: number, colKey: ColKey): void {
    this.ensureNotDestroyed();
    const field = this.resolveColKey(colKey);
    if (field) {
      const columnIndex = this.state.columnOrder.indexOf(field);
      if (columnIndex !== -1) {
        this.dispatch({ 
          type: 'SET_FOCUS', 
          payload: { rowIndex, columnIndex } 
        });
        this.fireEvent('cellFocused', { api: this, rowIndex, column: field });
      }
    }
  }

  clearFocusedCell(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'CLEAR_FOCUS' });
    this.fireEvent('cellFocusCleared', { api: this });
  }

  getFocusedCell(): { rowIndex: number; column: Column } | null {
    if (!this.state.focusState) return null;
    const field = this.state.columnOrder[this.state.focusState.columnIndex];
    const column = this.columns.find(c => c.field === field);
    return column ? {
      rowIndex: this.state.focusState.rowIndex,
      column,
    } : null;
  }

  // ==================== EDITING ====================

  startEditingCell(params: StartEditingCellParams): void {
    this.ensureNotDestroyed();
    const field = this.resolveColKey(params.colKey);
    if (field) {
      const row = this.getDisplayedRowAtIndex(params.rowIndex);
      if (row) {
        this.dispatch({
          type: 'START_EDITING',
          payload: { rowId: row.id, field, value: row.data[field] },
        });
        this.fireEvent('cellEditingStarted', { api: this, ...params });
      }
    }
  }

  stopEditing(cancel = false): void {
    this.ensureNotDestroyed();
    if (cancel) {
      this.dispatch({ type: 'CANCEL_EDITING' });
    } else {
      this.dispatch({ type: 'SAVE_EDIT' });
    }
    this.fireEvent('cellEditingStopped', { api: this, cancel });
  }

  getEditingCells(): Array<{ rowIndex: number; column: Column }> {
    if (!this.state.editState.rowId) return [];
    
    const column = this.columns.find(c => c.field === this.state.editState.field);
    if (!column) return [];

    const rowIndex = this.rows.findIndex(r => r.id === this.state.editState.rowId);
    if (rowIndex === -1) return [];

    return [{ rowIndex, column }];
  }

  // ==================== RENDERING / REFRESH ====================

  refreshCells(params?: RefreshCellsParams): void {
    this.ensureNotDestroyed();
    // Trigger a re-render by updating state
    this.dispatch({ type: 'REFRESH_CELLS', payload: params });
    this.fireEvent('cellsRefreshed', { api: this, params });
  }

  refreshHeader(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'REFRESH_HEADER' });
    this.fireEvent('headerRefreshed', { api: this });
  }

  refreshToolPanel(): void {
    this.ensureNotDestroyed();
    this.fireEvent('toolPanelRefreshed', { api: this });
  }

  redrawRows(params?: RedrawRowsParams): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'REDRAW_ROWS', payload: params });
    this.fireEvent('rowsRedrawn', { api: this, params });
  }

  sizeColumnsToFit(): void {
    this.ensureNotDestroyed();
    if (!this.containerRef.current) return;

    const containerWidth = this.containerRef.current.clientWidth;
    const visibleColumns = this.getDisplayedCenterColumns()
      .concat(this.getDisplayedLeftColumns())
      .concat(this.getDisplayedRightColumns());

    if (visibleColumns.length === 0) return;

    const totalCurrentWidth = visibleColumns.reduce(
      (sum, col) => sum + (this.state.columnWidths[col.field] || col.width || 150),
      0
    );

    const ratio = containerWidth / totalCurrentWidth;

    visibleColumns.forEach(col => {
      const currentWidth = this.state.columnWidths[col.field] || col.width || 150;
      const newWidth = Math.max(50, Math.floor(currentWidth * ratio));
      this.dispatch({ type: 'RESIZE_COLUMN', payload: { field: col.field, width: newWidth } });
    });

    this.fireEvent('columnResized', { api: this, reason: 'sizeColumnsToFit' });
  }

  doLayout(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'RECALCULATE_LAYOUT' });
    this.fireEvent('layoutChanged', { api: this });
  }

  // ==================== EXPORT / CLIPBOARD ====================

  exportDataAsCsv(params?: CsvExportParams): void {
    this.ensureNotDestroyed();
    const csv = this.getDataAsCsv(params);
    const fileName = (params?.fileName || 'export') + '.csv';
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.fireEvent('csvExported', { api: this, params });
  }

  getDataAsCsv(params?: CsvExportParams): string {
    this.ensureNotDestroyed();
    
    const separator = params?.columnSeparator || ',';
    const suppressQuotes = params?.suppressQuotes || false;
    
    // Get columns to export
    let columnsToExport = this.columns;
    if (params?.columnKeys) {
      const keys = params.columnKeys.map(k => this.resolveColKey(k)).filter(Boolean) as string[];
      columnsToExport = keys
        .map(field => this.columns.find(c => c.field === field))
        .filter((col): col is Column => col !== undefined);
    }

    // Get rows to export
    const rowsToExport = params?.onlySelected 
      ? this.getSelectedRows()
      : params?.onlyFiltered
      ? this.getFilteredRows()
      : this.rows;

    // Build CSV
    const lines: string[] = [];

    // Add header
    if (!params?.skipHeader) {
      const headerLine = columnsToExport
        .map(col => this.formatCsvValue(col.headerName, suppressQuotes))
        .join(separator);
      lines.push(headerLine);
    }

    // Add rows
    rowsToExport.forEach((row, index) => {
      const node = this.createRowNode(row, index);
      const rowLine = columnsToExport
        .map(col => {
          const value = row[col.field];
          let formatted = value;
          
          if (params?.processCellCallback) {
            formatted = params.processCellCallback({ value, column: col, node });
          }
          
          return this.formatCsvValue(formatted, suppressQuotes);
        })
        .join(separator);
      lines.push(rowLine);
    });

    return lines.join('\n');
  }

  exportDataAsExcel(params?: ExcelExportParams): void {
    this.ensureNotDestroyed();
    // For now, export as CSV (Excel can open CSV files)
    // In a full implementation, you would use a library like ExcelJS
    console.warn('Excel export not fully implemented, exporting as CSV instead');
    this.exportDataAsCsv(params);
  }

  copySelectedRowsToClipboard(): void {
    this.ensureNotDestroyed();
    const csv = this.getDataAsCsv({ onlySelected: true });
    this.copyToClipboard(csv);
    this.fireEvent('clipboardCopy', { api: this, type: 'selectedRows' });
  }

  copySelectedRangeToClipboard(): void {
    this.ensureNotDestroyed();
    // For now, same as copySelectedRowsToClipboard
    this.copySelectedRowsToClipboard();
  }

  // ==================== OVERLAYS ====================

  showLoadingOverlay(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'SHOW_OVERLAY', payload: 'loading' });
    this.fireEvent('overlayChanged', { api: this, overlay: 'loading' });
  }

  showNoRowsOverlay(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'SHOW_OVERLAY', payload: 'noRows' });
    this.fireEvent('overlayChanged', { api: this, overlay: 'noRows' });
  }

  hideOverlay(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'HIDE_OVERLAY' });
    this.fireEvent('overlayChanged', { api: this, overlay: null });
  }

  // ==================== PAGINATION ====================

  paginationGetCurrentPage(): number {
    return this.state.currentPage;
  }

  paginationGoToPage(page: number): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'SET_PAGE', payload: page });
    this.fireEvent('paginationChanged', { api: this, currentPage: page });
  }

  paginationGoToNextPage(): void {
    const totalPages = this.paginationGetTotalPages();
    const currentPage = this.paginationGetCurrentPage();
    if (currentPage < totalPages - 1) {
      this.paginationGoToPage(currentPage + 1);
    }
  }

  paginationGoToPreviousPage(): void {
    const currentPage = this.paginationGetCurrentPage();
    if (currentPage > 0) {
      this.paginationGoToPage(currentPage - 1);
    }
  }

  paginationGetTotalPages(): number {
    const pageSize = this.paginationGetPageSize();
    const rowCount = this.getFilteredRows().length;
    return Math.ceil(rowCount / pageSize);
  }

  paginationGetPageSize(): number {
    return this.state.pageSize;
  }

  paginationSetPageSize(size: number): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'SET_PAGE_SIZE', payload: size });
    this.fireEvent('paginationChanged', { api: this, pageSize: size });
  }

  // ==================== GROUPING / TREE ====================

  setRowGroupColumns(colKeys: ColKey[]): void {
    this.ensureNotDestroyed();
    const fields = colKeys.map(k => this.resolveColKey(k)).filter(Boolean) as string[];
    this.dispatch({ type: 'SET_GROUP_BY', payload: fields });
    this.fireEvent('columnRowGroupChanged', { api: this, columns: fields });
  }

  addRowGroupColumn(colKey: ColKey): void {
    this.ensureNotDestroyed();
    const field = this.resolveColKey(colKey);
    if (field && !this.state.groupBy.includes(field)) {
      this.dispatch({ type: 'SET_GROUP_BY', payload: [...this.state.groupBy, field] });
      this.fireEvent('columnRowGroupChanged', { api: this, columns: this.state.groupBy });
    }
  }

  removeRowGroupColumn(colKey: ColKey): void {
    this.ensureNotDestroyed();
    const field = this.resolveColKey(colKey);
    if (field) {
      const newGroupBy = this.state.groupBy.filter((f: string) => f !== field);
      this.dispatch({ type: 'SET_GROUP_BY', payload: newGroupBy });
      this.fireEvent('columnRowGroupChanged', { api: this, columns: newGroupBy });
    }
  }

  getRowGroupColumns(): Column[] {
    return this.state.groupBy
      .map((field: string) => this.columns.find(c => c.field === field))
      .filter((col: Column | undefined): col is Column => col !== undefined);
  }

  expandAll(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'EXPAND_ALL_NODES' });
    this.fireEvent('expandedChanged', { api: this, expanded: true });
  }

  collapseAll(): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'COLLAPSE_ALL_NODES' });
    this.fireEvent('expandedChanged', { api: this, expanded: false });
  }

  onGroupExpandedOrCollapsed(node?: RowNode): void {
    this.ensureNotDestroyed();
    this.fireEvent('rowGroupOpened', { api: this, node });
  }

  // ==================== LAYOUT PERSISTENCE ====================

  async saveLayout(name: string): Promise<void> {
    this.ensureNotDestroyed();
    if (!this.persistenceManager) {
      throw new Error('Persistence not enabled');
    }

    const layout = this.getLayoutState();
    const preset = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      layout,
    };
    await this.persistenceManager.savePreset(preset);
    this.fireEvent('layoutSaved', { api: this, name });
  }

  async loadLayout(name: string): Promise<void> {
    this.ensureNotDestroyed();
    if (!this.persistenceManager) {
      throw new Error('Persistence not enabled');
    }

    const preset = await this.persistenceManager.loadPreset(name);
    if (preset) {
      this.applyLayoutState(preset.layout);
      this.fireEvent('layoutLoaded', { api: this, name });
    }
  }

  getLayoutState(): LayoutPreset['layout'] {
    return {
      columnOrder: this.state.columnOrder,
      columnWidths: this.state.columnWidths,
      pinnedColumnsLeft: this.state.pinnedColumnsLeft,
      pinnedColumnsRight: this.state.pinnedColumnsRight,
      hiddenColumns: this.state.hiddenColumns,
      sortConfig: this.state.sortConfig,
      filterConfig: this.state.filterConfig,
      pageSize: this.state.pageSize,
      groupBy: this.state.groupBy,
    };
  }

  applyLayoutState(layout: LayoutPreset['layout']): void {
    this.ensureNotDestroyed();
    this.dispatch({ type: 'LOAD_LAYOUT_PRESET', payload: layout });
    this.fireEvent('layoutApplied', { api: this, layout });
  }

  // ==================== LIFECYCLE ====================

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.eventListeners.clear();
    this.fireEvent('gridDestroyed', { api: this });
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }

  // ==================== EVENTS ====================

  addEventListener(eventType: string, listener: (event: unknown) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(listener);
  }

  removeEventListener(eventType: string, listener: (event: unknown) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  // ==================== PRIVATE HELPERS ====================

  private ensureNotDestroyed(): void {
    if (this.destroyed) {
      throw new Error('Grid API has been destroyed');
    }
  }

  private createRowNode(row: Row, index: number, selected = false): RowNode {
    const isSelected = selected || this.state.selection.selectedRows.has(row.id);
    
    return {
      id: row.id,
      data: row,
      rowIndex: index,
      selected: isSelected,
      setSelected: (sel: boolean, clearOther = false) => {
        if (clearOther) {
          this.deselectAll();
        }
        if (sel) {
          this.dispatch({ type: 'SELECT_ROW', payload: { rowId: row.id, ctrlKey: true } });
        } else {
          this.dispatch({ type: 'DESELECT_ROW', payload: row.id });
        }
      },
    };
  }

  private resolveColKey(key: ColKey): string | null {
    if (typeof key === 'string') {
      return key;
    }
    if (typeof key === 'number') {
      return this.state.columnOrder[key] || null;
    }
    return null;
  }

  private getDisplayedRows(): Row[] {
    // Apply filters
    let displayedRows = this.getFilteredRows();
    
    // Apply sorting
    if (this.state.sortConfig.field && this.state.sortConfig.direction) {
      displayedRows = this.applySorting(displayedRows);
    }

    return displayedRows;
  }

  private getFilteredRows(): Row[] {
    // Simple filtering implementation
    if (Object.keys(this.state.filterConfig).length === 0) {
      return this.rows;
    }

    return this.rows.filter(row => {
      return Object.entries(this.state.filterConfig).every(([field, filterValue]) => {
        if (!filterValue) return true;
        
        const cellValue = row[field];
        
        // Handle AdvancedFilterValue
        if ('operator' in filterValue && 'conditions' in filterValue) {
          // Skip advanced filters for simple implementation
          return true;
        }
        
        // Handle FilterValue
        const searchValue = (filterValue as { value?: unknown }).value;
        if (searchValue == null) return true;

        if (cellValue == null) return false;
        
        return String(cellValue)
          .toLowerCase()
          .includes(String(searchValue).toLowerCase());
      });
    });
  }

  private applySorting(rows: Row[]): Row[] {
    const sort = this.state.sortConfig;
    if (!sort.field || !sort.direction) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }

  private calculateColumnWidth(field: string): number {
    // Simple width calculation based on content
    const column = this.columns.find(c => c.field === field);
    if (!column) return 150;

    // Header width
    const headerWidth = column.headerName.length * 8 + 40;

    // Sample content width (check first 10 rows)
    const sampleRows = this.rows.slice(0, 10);
    const maxContentWidth = sampleRows.reduce((max, row) => {
      const value = String(row[field] || '');
      return Math.max(max, value.length * 8 + 20);
    }, 0);

    return Math.max(100, Math.min(400, Math.max(headerWidth, maxContentWidth)));
  }

  private formatCsvValue(value: unknown, suppressQuotes: boolean): string {
    if (value == null) return '';
    
    const strValue = String(value);
    
    if (suppressQuotes) {
      return strValue;
    }

    // Quote if contains comma, quotes, or newlines
    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
      return `"${strValue.replace(/"/g, '""')}"`;
    }

    return strValue;
  }

  private copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  private fireEvent(eventType: string, event: unknown): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in ${eventType} listener:`, error);
        }
      });
    }
  }
}
