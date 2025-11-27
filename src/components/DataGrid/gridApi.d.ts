/**
 * Grid API Implementation
 * Concrete implementation of the GridApi interface
 */
import type { Dispatch } from 'react';
import type { GridApi, RowNode, RowModel, ColumnState, RefreshCellsParams, RedrawRowsParams, CsvExportParams, ExcelExportParams, RowDataTransaction, RowNodeTransaction, StartEditingCellParams, ColKey } from './gridApi.types';
import type { Column, Row, FilterConfig, SortConfig, LayoutPreset } from './types';
import type { GridAction, GridState } from './gridReducer';
import { LayoutPersistenceManager } from './layoutPersistence';
/**
 * Grid API Implementation
 */
export declare class GridApiImpl implements GridApi {
    private state;
    private dispatch;
    private columns;
    private rows;
    private persistenceManager;
    private destroyed;
    private containerRef;
    private eventListeners;
    private setInternalRows?;
    constructor(state: GridState, dispatch: Dispatch<GridAction>, columns: Column[], rows: Row[], containerRef: React.RefObject<HTMLDivElement | null>, persistenceManager?: LayoutPersistenceManager | null, setInternalRows?: (rows: Row[]) => void);
    /**
     * Update internal state reference (called by parent component on state change)
     */
    updateState(state: GridState): void;
    /**
     * Update internal data references
     */
    updateData(columns: Column[], rows: Row[]): void;
    /**
     * Update callback references
     */
    updateCallbacks(setInternalRows?: (rows: Row[]) => void): void;
    setRowData(rows: Row[]): void;
    applyTransaction(transaction: RowDataTransaction): RowNodeTransaction;
    applyTransactionAsync(transaction: RowDataTransaction): Promise<RowNodeTransaction>;
    getModel(): RowModel;
    getDisplayedRowCount(): number;
    getDisplayedRowAtIndex(index: number): RowNode | null;
    forEachNode(callback: (node: RowNode, index: number) => void): void;
    forEachNodeAfterFilter(callback: (node: RowNode, index: number) => void): void;
    forEachNodeAfterFilterAndSort(callback: (node: RowNode, index: number) => void): void;
    getFirstDisplayedRow(): number;
    getLastDisplayedRow(): number;
    getColumnDefs(): Column[];
    setColumnDefs(colDefs: Column[]): void;
    getAllColumns(): Column[];
    getDisplayedCenterColumns(): Column[];
    getDisplayedLeftColumns(): Column[];
    getDisplayedRightColumns(): Column[];
    setColumnVisible(key: ColKey, visible: boolean): void;
    setColumnsVisible(keys: ColKey[], visible: boolean): void;
    setColumnPinned(key: ColKey, pinned: 'left' | 'right' | null): void;
    autoSizeColumns(keys?: ColKey[]): void;
    autoSizeAllColumns(): void;
    moveColumn(key: ColKey, toIndex: number): void;
    moveColumns(keys: ColKey[], toIndex: number): void;
    getColumnState(): ColumnState[];
    applyColumnState(state: ColumnState[]): void;
    resetColumnState(): void;
    getColumn(key: ColKey): Column | null;
    isAnyFilterPresent(): boolean;
    getFilterModel(): FilterConfig;
    setFilterModel(model: FilterConfig): void;
    onFilterChanged(): void;
    destroyFilter(colKey: ColKey): void;
    getFilterInstance(_colKey: ColKey): unknown;
    clearAllFilters(): void;
    getSortModel(): SortConfig[];
    setSortModel(model: SortConfig[]): void;
    onSortChanged(): void;
    clearAllSorting(): void;
    getSelectedNodes(): RowNode[];
    getSelectedRows(): Row[];
    selectAll(): void;
    deselectAll(): void;
    selectAllFiltered(): void;
    deselectAllFiltered(): void;
    getSelectedRowCount(): number;
    ensureIndexVisible(index: number, position?: 'top' | 'middle' | 'bottom'): void;
    ensureNodeVisible(node: RowNode, position?: 'top' | 'middle' | 'bottom'): void;
    setFocusedCell(rowIndex: number, colKey: ColKey): void;
    clearFocusedCell(): void;
    getFocusedCell(): {
        rowIndex: number;
        column: Column;
    } | null;
    startEditingCell(params: StartEditingCellParams): void;
    stopEditing(cancel?: boolean): void;
    getEditingCells(): Array<{
        rowIndex: number;
        column: Column;
    }>;
    refreshCells(params?: RefreshCellsParams): void;
    refreshHeader(): void;
    refreshToolPanel(): void;
    redrawRows(params?: RedrawRowsParams): void;
    sizeColumnsToFit(): void;
    doLayout(): void;
    exportDataAsCsv(params?: CsvExportParams): void;
    getDataAsCsv(params?: CsvExportParams): string;
    exportDataAsExcel(params?: ExcelExportParams): void;
    copySelectedRowsToClipboard(): void;
    copySelectedRangeToClipboard(): void;
    showLoadingOverlay(): void;
    showNoRowsOverlay(): void;
    hideOverlay(): void;
    paginationGetCurrentPage(): number;
    paginationGoToPage(page: number): void;
    paginationGoToNextPage(): void;
    paginationGoToPreviousPage(): void;
    paginationGetTotalPages(): number;
    paginationGetPageSize(): number;
    paginationSetPageSize(size: number): void;
    setRowGroupColumns(colKeys: ColKey[]): void;
    addRowGroupColumn(colKey: ColKey): void;
    removeRowGroupColumn(colKey: ColKey): void;
    getRowGroupColumns(): Column[];
    expandAll(): void;
    collapseAll(): void;
    onGroupExpandedOrCollapsed(node?: RowNode): void;
    saveLayout(name: string): Promise<void>;
    loadLayout(name: string): Promise<void>;
    getLayoutState(): LayoutPreset['layout'];
    applyLayoutState(layout: LayoutPreset['layout']): void;
    destroy(): void;
    isDestroyed(): boolean;
    addEventListener(eventType: string, listener: (event: unknown) => void): void;
    removeEventListener(eventType: string, listener: (event: unknown) => void): void;
    private ensureNotDestroyed;
    private createRowNode;
    private resolveColKey;
    private getDisplayedRows;
    private getFilteredRows;
    private applySorting;
    private calculateColumnWidth;
    private formatCsvValue;
    private copyToClipboard;
    private fireEvent;
}
