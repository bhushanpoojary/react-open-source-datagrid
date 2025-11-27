import { useState, useCallback, useMemo } from 'react';
import { copyToClipboard, exportSelectedToCSV, calculateOptimalWidth, autoSizeAllColumns, createFilterByValue, getUniqueColumnValues } from './contextMenuUtils';
/**
 * Hook to manage context menu state and actions
 */
export const useContextMenu = ({ config = {}, columns, rows, selectedRows, onPinColumn, onUnpinColumn, onToggleColumnVisibility, onResizeColumn, onAutoSizeAllColumns, onSetFilter, onPinRowTop, onPinRowBottom, onUnpinRow, pinnedColumnsLeft = [], pinnedColumnsRight = [], pinnedRowsTop = [], pinnedRowsBottom = [], }) => {
    const [contextMenu, setContextMenu] = useState({
        isOpen: false,
        x: 0,
        y: 0,
        items: [],
        contextType: null,
    });
    // Configuration with defaults
    const menuConfig = useMemo(() => ({
        enabled: config?.enabled !== false,
        showCopy: config?.showCopy !== false,
        showExport: config?.showExport !== false,
        showColumnOptions: config?.showColumnOptions !== false,
        showFilterByValue: config?.showFilterByValue !== false,
        customItems: config?.customItems || [],
        onBeforeShow: config?.onBeforeShow,
    }), [
        config?.enabled,
        config?.showCopy,
        config?.showExport,
        config?.showColumnOptions,
        config?.showFilterByValue,
        config?.customItems,
        config?.onBeforeShow,
    ]);
    // Build menu items for cell context menu
    const buildCellMenuItems = useCallback((row, column) => {
        const items = [];
        const hasSelection = selectedRows.size > 0;
        const rowId = row.id;
        const isPinnedTop = pinnedRowsTop.includes(rowId);
        const isPinnedBottom = pinnedRowsBottom.includes(rowId);
        const isPinned = isPinnedTop || isPinnedBottom;
        // Row pinning options
        if (onPinRowTop && onPinRowBottom && onUnpinRow) {
            if (!isPinned) {
                items.push({
                    id: 'pin-row-top',
                    label: 'Pin Row to Top',
                    icon: '📌',
                    onClick: () => onPinRowTop(rowId),
                });
                items.push({
                    id: 'pin-row-bottom',
                    label: 'Pin Row to Bottom',
                    icon: '📌',
                    onClick: () => onPinRowBottom(rowId),
                });
            }
            else {
                items.push({
                    id: 'unpin-row',
                    label: 'Unpin Row',
                    icon: '📍',
                    onClick: () => onUnpinRow(rowId),
                });
            }
            items.push({ type: 'separator' });
        }
        // Copy options
        if (menuConfig.showCopy) {
            items.push({
                id: 'copy',
                label: 'Copy',
                icon: '📋',
                shortcut: 'Ctrl+C',
                onClick: () => {
                    if (hasSelection) {
                        copyToClipboard(selectedRows, columns, rows, false);
                    }
                    else {
                        // Copy single cell value
                        const value = row[column.field];
                        const text = value == null ? '' : String(value);
                        navigator.clipboard.writeText(text);
                    }
                },
            });
            items.push({
                id: 'copy-with-headers',
                label: 'Copy with Headers',
                icon: '📋',
                onClick: () => {
                    if (hasSelection) {
                        copyToClipboard(selectedRows, columns, rows, true);
                    }
                },
                disabled: !hasSelection,
            });
        }
        // Export options
        if (menuConfig.showExport && hasSelection) {
            items.push({
                id: 'export-selected',
                label: 'Export Selected Range',
                icon: '📤',
                onClick: () => {
                    exportSelectedToCSV(selectedRows, columns, rows);
                },
            });
        }
        if (items.length > 0 && (menuConfig.showFilterByValue || menuConfig.customItems.length > 0)) {
            items.push({ type: 'separator' });
        }
        // Filter by value
        if (menuConfig.showFilterByValue && onSetFilter) {
            const cellValue = row[column.field];
            items.push({
                id: 'filter-by-value',
                label: `Filter by "${String(cellValue)}"`,
                icon: '🔍',
                onClick: () => {
                    onSetFilter(column.field, createFilterByValue(cellValue));
                },
                disabled: cellValue == null,
            });
        }
        // Add custom items
        if (menuConfig.customItems.length > 0) {
            if (items.length > 0) {
                items.push({ type: 'separator' });
            }
            items.push(...menuConfig.customItems);
        }
        return items;
    }, [menuConfig, selectedRows, columns, rows, onSetFilter, onPinRowTop, onPinRowBottom, onUnpinRow, pinnedRowsTop, pinnedRowsBottom]);
    // Build menu items for header context menu
    const buildHeaderMenuItems = useCallback((column) => {
        const items = [];
        const isPinnedLeft = pinnedColumnsLeft.includes(column.field);
        const isPinnedRight = pinnedColumnsRight.includes(column.field);
        const isPinned = isPinnedLeft || isPinnedRight;
        // Pin/Unpin options
        if (menuConfig.showColumnOptions && column.pinnable !== false) {
            if (!isPinned) {
                items.push({
                    id: 'pin-left',
                    label: 'Pin Left',
                    icon: '📌',
                    onClick: () => onPinColumn?.(column.field, 'left'),
                });
                items.push({
                    id: 'pin-right',
                    label: 'Pin Right',
                    icon: '📌',
                    onClick: () => onPinColumn?.(column.field, 'right'),
                });
            }
            else {
                items.push({
                    id: 'unpin',
                    label: 'Unpin Column',
                    icon: '📍',
                    onClick: () => onUnpinColumn?.(column.field),
                });
            }
            items.push({ type: 'separator' });
        }
        // Auto-size and resize options
        if (menuConfig.showColumnOptions) {
            items.push({
                id: 'auto-size',
                label: 'Auto-size This Column',
                icon: '↔️',
                onClick: () => {
                    const width = calculateOptimalWidth(column, rows);
                    onResizeColumn?.(column.field, width);
                },
            });
            items.push({
                id: 'resize-to-fit',
                label: 'Resize to Fit',
                icon: '↔️',
                onClick: () => {
                    const width = calculateOptimalWidth(column, rows);
                    onResizeColumn?.(column.field, width);
                },
            });
            items.push({
                id: 'auto-size-all',
                label: 'Auto-size All Columns',
                icon: '⇔',
                onClick: () => {
                    const widths = autoSizeAllColumns(columns, rows);
                    onAutoSizeAllColumns?.(widths);
                },
            });
            items.push({ type: 'separator' });
        }
        // Hide column
        if (menuConfig.showColumnOptions) {
            items.push({
                id: 'hide',
                label: 'Hide Column',
                icon: '👁️',
                onClick: () => onToggleColumnVisibility?.(column.field),
            });
        }
        // Filter by value shortcut (show unique values)
        if (menuConfig.showFilterByValue && onSetFilter && column.filterable !== false) {
            items.push({ type: 'separator' });
            const uniqueValues = getUniqueColumnValues(column, rows, 10);
            if (uniqueValues.length > 0) {
                items.push({
                    id: 'filter-by-value-header',
                    label: 'Filter by Value',
                    icon: '🔍',
                    submenu: uniqueValues.map((value, index) => ({
                        id: `filter-value-${index}`,
                        label: String(value),
                        onClick: () => {
                            onSetFilter(column.field, createFilterByValue(value));
                        },
                    })),
                });
            }
        }
        // Add custom items
        if (menuConfig.customItems.length > 0) {
            items.push({ type: 'separator' });
            items.push(...menuConfig.customItems);
        }
        return items;
    }, [
        menuConfig,
        pinnedColumnsLeft,
        pinnedColumnsRight,
        columns,
        rows,
        onPinColumn,
        onUnpinColumn,
        onResizeColumn,
        onAutoSizeAllColumns,
        onToggleColumnVisibility,
        onSetFilter,
    ]);
    // Handle context menu open
    const handleContextMenu = useCallback((event) => {
        if (!menuConfig.enabled) {
            return;
        }
        event.event.preventDefault();
        let items = [];
        if (event.type === 'cell' && event.row && event.column) {
            items = buildCellMenuItems(event.row, event.column);
        }
        else if (event.type === 'header' && event.column) {
            items = buildHeaderMenuItems(event.column);
        }
        // Allow custom modification of menu items
        if (menuConfig.onBeforeShow) {
            const customItems = menuConfig.onBeforeShow(event);
            if (customItems !== null) {
                items = customItems;
            }
        }
        if (items.length > 0) {
            setContextMenu({
                isOpen: true,
                x: event.event.clientX,
                y: event.event.clientY,
                items,
                contextType: event.type,
                targetRow: event.row,
                targetColumn: event.column,
                targetRowIndex: event.rowIndex,
                targetColumnIndex: event.columnIndex,
            });
        }
    }, [menuConfig, buildCellMenuItems, buildHeaderMenuItems]);
    // Close context menu
    const closeContextMenu = useCallback(() => {
        setContextMenu({
            isOpen: false,
            x: 0,
            y: 0,
            items: [],
            contextType: null,
        });
    }, []);
    return {
        contextMenu,
        handleContextMenu,
        closeContextMenu,
    };
};
