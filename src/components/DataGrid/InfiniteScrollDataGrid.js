import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * InfiniteScrollDataGrid Component
 *
 * DataGrid with server-side infinite scrolling support.
 * Handles massive datasets (100M+ rows) with:
 * - Server-side data fetching
 * - Server-side filtering
 * - Server-side sorting
 * - Local block caching
 * - Virtual scrolling
 */
import React, { useReducer, useMemo, useEffect, useCallback, useState } from 'react';
import { ServerSideDataSource } from './ServerSideDataSource';
import { gridReducer, createInitialState } from './gridReducer';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { GroupByPanel } from './GroupByPanel';
import { ColumnChooser } from './ColumnChooser';
import { ColumnFilters } from './ColumnFilters';
import { getTheme, generateThemeCSS } from './themes';
/**
 * InfiniteScrollDataGrid
 *
 * A DataGrid component optimized for infinite scrolling with server-side data source.
 */
export const InfiniteScrollDataGrid = ({ columns, dataSource, pageSize = 100, showColumnPinning = true, virtualScrollConfig, theme: _theme = 'quartz', onRowClick, onCellEdit, onSelectionChange, }) => {
    // Initialize grid state with reducer
    const [state, dispatch] = useReducer(gridReducer, { columns, pageSize }, (args) => createInitialState(args.columns, args.pageSize));
    // Initialize or use provided data source
    const [dataSourceInstance, setDataSourceInstance] = useState(null);
    const [totalRows, setTotalRows] = useState(undefined);
    // Theme styles - generate CSS variables from theme
    const themeStyles = useMemo(() => {
        const currentTheme = getTheme(_theme);
        return generateThemeCSS(currentTheme);
    }, [_theme]);
    // Initialize data source
    useEffect(() => {
        let ds;
        if (dataSource instanceof ServerSideDataSource) {
            ds = dataSource;
        }
        else {
            ds = new ServerSideDataSource(dataSource);
        }
        setDataSourceInstance(ds);
        // Subscribe to data changes
        const unsubscribe = ds.subscribe(() => {
            setTotalRows(ds.getTotalRows());
        });
        // Initial load
        setTotalRows(ds.getTotalRows());
        return () => {
            unsubscribe();
            if (!(dataSource instanceof ServerSideDataSource)) {
                ds.destroy();
            }
        };
    }, [dataSource]);
    // Update data source when sort changes
    useEffect(() => {
        if (dataSourceInstance && state.sortConfig.field) {
            dataSourceInstance.setSortModel([state.sortConfig]);
        }
    }, [dataSourceInstance, state.sortConfig]);
    // Update data source when filter changes
    useEffect(() => {
        if (dataSourceInstance) {
            dataSourceInstance.setFilterModel(state.filterConfig);
        }
    }, [dataSourceInstance, state.filterConfig]);
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
        // ...existing code...
    }, [state.selection.selectedRows]);
    // Track loaded row range for infinite scrolling
    const [loadedRange, setLoadedRange] = useState({ start: 0, end: pageSize * 15 }); // Start with 15 pages
    // Force re-render when data source updates
    const [dataVersion, setDataVersion] = useState(0);
    // Get rows for display - use data source to fetch on-demand
    const visibleRows = useMemo(() => {
        if (!dataSourceInstance)
            return [];
        // Get rows in the loaded range
        // dataVersion is included to force recalculation when data arrives
        return dataSourceInstance.getRowsInRange(loadedRange.start, loadedRange.end);
    }, [dataSourceInstance, loadedRange, dataVersion]);
    // Subscribe to data source changes to trigger re-renders
    useEffect(() => {
        if (!dataSourceInstance)
            return;
        const unsubscribe = dataSourceInstance.subscribe(() => {
            setDataVersion(v => v + 1);
        });
        return unsubscribe;
    }, [dataSourceInstance]);
    // Handle scroll to load more data
    const handleScroll = useCallback((scrollTop) => {
        if (!dataSourceInstance || totalRows === undefined)
            return;
        const containerHeight = virtualScrollConfig?.containerHeight || 600;
        const rowHeight = typeof virtualScrollConfig?.rowHeight === 'number' ? virtualScrollConfig.rowHeight : 35;
        const visibleRows = Math.ceil(containerHeight / rowHeight);
        const currentRow = Math.floor(scrollTop / rowHeight);
        // Calculate buffer (5x visible rows for more aggressive prefetching)
        const buffer = visibleRows * 5;
        const newStart = Math.max(0, currentRow - buffer);
        const newEnd = Math.min(totalRows, currentRow + visibleRows + buffer);
        // Only update if we need to expand the range
        if (newStart < loadedRange.start || newEnd > loadedRange.end) {
            const expandedStart = Math.max(0, Math.min(newStart, loadedRange.start));
            const expandedEnd = Math.max(newEnd, loadedRange.end);
            setLoadedRange({ start: expandedStart, end: expandedEnd });
        }
    }, [dataSourceInstance, totalRows, virtualScrollConfig, loadedRange]);
    // Auto-adjust column width based on content
    useEffect(() => {
        const updatedWidths = { ...state.columnWidths };
        let hasChanges = false;
        columns.forEach((column) => {
            if (column.width) {
                if (updatedWidths[column.field] !== column.width) {
                    updatedWidths[column.field] = column.width;
                    hasChanges = true;
                }
            }
            else {
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
        // ...existing code...
    }, [columns]);
    // Handle cell edit
    const handleCellEdit = useCallback((rowIndex, field, value) => {
        if (onCellEdit) {
            const actualRowIndex = state.currentPage * pageSize + rowIndex;
            onCellEdit(actualRowIndex, field, value);
        }
    }, [onCellEdit, state.currentPage, pageSize]);
    // Show loading indicator
    if (!dataSourceInstance) {
        return (_jsx("div", { style: {
                padding: '20px',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                borderRadius: '6px'
            }, children: "Loading data source..." }));
    }
    return (_jsxs("div", { style: {
            ...themeStyles,
            border: 'var(--grid-border-width, 1px) solid var(--grid-border)',
            borderRadius: 'var(--grid-border-radius, 6px)',
            backgroundColor: 'var(--grid-bg)',
            boxShadow: 'var(--grid-shadow-light, 0 1px 3px 0 rgba(0, 0, 0, 0.08))',
            fontFamily: 'var(--grid-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
            display: 'flex',
            flexDirection: 'column',
            height: virtualScrollConfig?.containerHeight ? `${virtualScrollConfig.containerHeight + 150}px` : 'auto'
        }, children: [_jsx("div", { style: {
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    backgroundColor: 'var(--grid-bg-alt)',
                    borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                    zIndex: 30
                }, children: _jsxs("div", { style: {
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }, children: [_jsx(ColumnChooser, { columns: columns, columnOrder: state.columnOrder, hiddenColumns: state.hiddenColumns, onToggleVisibility: (field) => dispatch({ type: 'TOGGLE_COLUMN_VISIBILITY', payload: field }), onReorderColumns: (fromIndex, toIndex) => dispatch({ type: 'REORDER_COLUMNS', payload: { fromIndex, toIndex } }), onResetLayout: () => dispatch({ type: 'RESET_COLUMN_LAYOUT' }) }), _jsx("div", { style: {
                                fontSize: '14px',
                                color: '#64748b',
                                marginLeft: '12px'
                            }, children: totalRows !== undefined
                                ? `${totalRows.toLocaleString()} total rows`
                                : 'Loading...' })] }) }), _jsx(GroupByPanel, { columns: columns, groupBy: state.groupBy, dispatch: dispatch }), _jsxs("div", { style: { position: 'sticky', top: 0, zIndex: 20 }, children: [_jsx(GridHeader, { columns: columns, columnOrder: state.columnOrder, displayColumnOrder: displayColumnOrder, columnWidths: state.columnWidths, sortConfig: state.sortConfig, dispatch: dispatch, pinnedLeft: pinnedLeftFields, pinnedRight: pinnedRightFields, showColumnPinning: showColumnPinning }), _jsx(ColumnFilters, { columns: columns, displayColumnOrder: displayColumnOrder, columnWidths: state.columnWidths, filterConfig: state.filterConfig, dispatch: dispatch, pinnedLeft: pinnedLeftFields, pinnedRight: pinnedRightFields, rows: visibleRows })] }), _jsx(GridBody, { columns: columns, rows: visibleRows, columnOrder: state.columnOrder, displayColumnOrder: displayColumnOrder, columnWidths: state.columnWidths, selectedRows: state.selection.selectedRows, editState: state.editState, focusState: state.focusState, dispatch: dispatch, onRowClick: onRowClick, onCellEdit: handleCellEdit, pinnedLeft: pinnedLeftFields, pinnedRight: pinnedRightFields, onScroll: handleScroll, virtualScrollConfig: {
                    ...virtualScrollConfig,
                    enabled: true,
                } }), _jsxs("div", { style: {
                    padding: '8px 16px',
                    backgroundColor: 'var(--grid-footer-bg)',
                    borderTop: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                    fontSize: 'var(--grid-font-size-sm, 12px)',
                    color: 'var(--grid-text-secondary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }, children: [_jsx("div", { children: "Server-side infinite scrolling enabled" }), _jsxs("div", { children: ["Rows loaded: ", visibleRows.length] })] })] }));
};
/**
 * ThemedInfiniteScrollDataGrid - Legacy alias for backward compatibility
 * @deprecated Use InfiniteScrollDataGrid directly with theme prop instead
 */
export const ThemedInfiniteScrollDataGrid = InfiniteScrollDataGrid;
export default InfiniteScrollDataGrid;
