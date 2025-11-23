import React, { useReducer, useMemo, useEffect, useCallback, useRef, useState } from 'react';
import type { DataGridProps, Row, GroupedRow, LayoutPreset, TreeNode } from './types';
import { gridReducer, createInitialState } from './gridReducer';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { GridPagination } from './GridPagination';
import { GroupByPanel } from './GroupByPanel';
import { GridFooter } from './GridFooter';
import { ColumnChooser } from './ColumnChooser';
import { ExportMenu } from './ExportMenu';
import { ColumnFilters } from './ColumnFilters';
import { LayoutPresetsManager } from './LayoutPresetsManager';
import { groupRows, flattenGroupedRows } from './groupingUtils';
import { computeAggregations, computeGroupAggregations } from './aggregationUtils';
import { applyFilters, hasActiveFilters } from './filterUtils';
import { LayoutPersistenceManager, debounce } from './layoutPersistence';
import { getTheme, generateThemeCSS } from './themes';
import { buildTreeFromFlat, flattenTree } from './treeDataUtils';

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
  persistenceConfig,
  treeConfig,
  dragRowConfig,
  tableId,
  theme: _theme = 'quartz',
  onRowClick,
  onCellEdit,
  onSelectionChange,
  onLayoutChange,
  onRowReorder,
}) => {
  // Initialize grid state with reducer
  const [state, dispatch] = useReducer(
    gridReducer,
    { columns, pageSize },
    (args) => createInitialState(args.columns, args.pageSize)
  );

  // Persistence manager instance
  const [persistenceManager, setPersistenceManager] = useState<LayoutPersistenceManager | null>(null);
  const autoSaveRef = useRef<(() => void) | null>(null);
  const previousLayoutRef = useRef<string | null>(null);

  // Initialize persistence manager
  useEffect(() => {
    if (persistenceConfig?.enabled) {
      const manager = new LayoutPersistenceManager(persistenceConfig);
      setPersistenceManager(manager);

      // Auto-load last saved preset on mount
      if (persistenceConfig.autoLoad) {
        manager.loadAutoSave().then((preset) => {
          if (preset) {
            dispatch({ type: 'LOAD_LAYOUT_PRESET', payload: preset.layout });
          }
        }).catch((error) => {
          console.error('Failed to load auto-saved layout:', error);
        });
      }
    }
  }, [persistenceConfig]);

  // Memoize serialized versions of complex objects
  const sortConfigStr = useMemo(() => JSON.stringify(state.sortConfig), [state.sortConfig]);
  const filterConfigStr = useMemo(() => JSON.stringify(state.filterConfig), [state.filterConfig]);

  // Get current layout state - using a stable reference
  const getCurrentLayout = useCallback((): LayoutPreset['layout'] => {
    return {
      columnOrder: state.columnOrder,
      columnWidths: state.columnWidths,
      pinnedColumnsLeft: state.pinnedColumnsLeft,
      pinnedColumnsRight: state.pinnedColumnsRight,
      hiddenColumns: state.hiddenColumns,
      sortConfig: state.sortConfig,
      filterConfig: state.filterConfig,
      pageSize: state.pageSize,
      groupBy: state.groupBy,
    };
  }, [
    state.columnOrder,
    state.columnWidths,
    state.pinnedColumnsLeft,
    state.pinnedColumnsRight,
    state.hiddenColumns,
    state.sortConfig,
    state.filterConfig,
    state.pageSize,
    state.groupBy,
  ]);

  // Auto-save functionality
  useEffect(() => {
    if (!persistenceConfig?.enabled || !persistenceConfig.autoSave || !persistenceManager) {
      return;
    }

    // Create debounced auto-save function
    const delay = persistenceConfig.autoSaveDelay || 1000;
    const debouncedAutoSave = debounce(() => {
      const layout = getCurrentLayout();
      persistenceManager.autoSave(layout).catch((error) => {
        console.error('Failed to auto-save layout:', error);
      });
    }, delay);

    autoSaveRef.current = debouncedAutoSave;

    // Trigger auto-save on layout changes
    debouncedAutoSave();

    return () => {
      autoSaveRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    persistenceConfig,
    persistenceManager,
    state.columnOrder,
    state.columnWidths,
    state.pinnedColumnsLeft,
    state.pinnedColumnsRight,
    state.hiddenColumns,
    sortConfigStr,
    filterConfigStr,
    state.pageSize,
    state.groupBy,
  ]);

  // Notify parent of layout changes
  useEffect(() => {
    if (onLayoutChange) {
      const layout = getCurrentLayout();
      const layoutStr = JSON.stringify(layout);
      
      // Only trigger if layout actually changed
      if (previousLayoutRef.current !== layoutStr) {
        previousLayoutRef.current = layoutStr;
        onLayoutChange(layout);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    onLayoutChange,
    state.columnOrder,
    state.columnWidths,
    state.pinnedColumnsLeft,
    state.pinnedColumnsRight,
    state.hiddenColumns,
    sortConfigStr,
    filterConfigStr,
    state.pageSize,
    state.groupBy,
  ]);

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

  // Apply filtering using the new filter utilities
  const filteredRows = useMemo(() => {
    if (!hasActiveFilters(state.filterConfig)) {
      return sortedRows;
    }
    return applyFilters(sortedRows, state.filterConfig);
  }, [sortedRows, state.filterConfig]);

  // Apply tree structure if tree mode is enabled
  const treeRows = useMemo(() => {
    if (!treeConfig?.enabled) {
      return filteredRows;
    }

    const treeNodes = buildTreeFromFlat(filteredRows, treeConfig);
    return flattenTree(treeNodes, state.expandedNodes, treeConfig) as (Row | TreeNode)[];
  }, [filteredRows, treeConfig, state.expandedNodes]);

  // Apply grouping
  const groupedRows = useMemo(() => {
    // Don't apply grouping if tree mode is enabled
    if (treeConfig?.enabled) {
      return treeRows;
    }

    if (state.groupBy.length === 0) {
      return filteredRows;
    }
    return groupRows(filteredRows, state.groupBy, state.expandedGroups);
  }, [filteredRows, treeRows, treeConfig, state.groupBy, state.expandedGroups]);

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
    (rowIndex: number, field: string, value: unknown) => {
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
    <div style={{ border: 'var(--grid-border-width, 1px) solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', overflow: 'hidden', backgroundColor: 'var(--grid-bg)', boxShadow: 'var(--grid-shadow-light, 0 1px 3px 0 rgba(0, 0, 0, 0.08))', fontFamily: 'var(--grid-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)' }}>
      {/* Toolbar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '16px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', backgroundColor: 'var(--grid-bg-alt)', borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)', zIndex: 30 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

          {/* Export Menu */}
          <ExportMenu
            columns={columns}
            fullDataset={rows}
            filteredData={filteredRows.filter((r): r is Row => !('isGroup' in r))}
            selectedRows={state.selection.selectedRows}
            currentPageData={paginatedRows.filter((r): r is Row => !('isGroup' in r))}
          />

          {/* Layout Presets Manager */}
          {persistenceConfig?.enabled && persistenceManager && (
            <LayoutPresetsManager
              manager={persistenceManager}
              currentLayout={getCurrentLayout()}
              onLoadPreset={(layout) => dispatch({ type: 'LOAD_LAYOUT_PRESET', payload: layout })}
              onResetLayout={() => dispatch({ type: 'RESET_COLUMN_LAYOUT' })}
            />
          )}
        </div>
      </div>

      {/* Group By Panel */}
      <GroupByPanel
        columns={columns}
        groupBy={state.groupBy}
        dispatch={dispatch}
      />

      {/* Sticky Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, width: '100%' }}>
        <GridHeader
          columns={columns}
          columnOrder={state.columnOrder}
          displayColumnOrder={displayColumnOrder}
          columnWidths={state.columnWidths}
          sortConfig={state.sortConfig}
          dispatch={dispatch}
          pinnedLeft={pinnedLeftFields}
          pinnedRight={pinnedRightFields}
          showColumnPinning={showColumnPinning}
        />
        
        {/* Floating Filter Row */}
        <ColumnFilters
          columns={columns}
          displayColumnOrder={displayColumnOrder}
          columnWidths={state.columnWidths}
          filterConfig={state.filterConfig}
          dispatch={dispatch}
          pinnedLeft={pinnedLeftFields}
          pinnedRight={pinnedRightFields}
          rows={filteredRows}
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
        treeConfig={treeConfig}
        dragRowConfig={dragRowConfig}
        tableId={tableId}
        onRowReorder={onRowReorder}
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

/**
 * ThemedDataGrid - DataGrid wrapper with theme support
 * Applies theme CSS variables to the grid container
 */
export const ThemedDataGrid: React.FC<DataGridProps> = (props) => {
  const { theme = 'quartz', ...restProps } = props;
  const currentTheme = getTheme(theme);
  const themeStyles = generateThemeCSS(currentTheme);

  return (
    <div style={themeStyles as React.CSSProperties}>
      <DataGrid {...restProps} theme={theme} />
    </div>
  );
};
