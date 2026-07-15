import React, { useReducer, useMemo, useEffect, useCallback, useRef, useState, forwardRef } from 'react';
import type { DataGridProps, Row, Column, GroupedRow, TreeNode, ExpandedMasterRows, ColumnOrGroup } from './types';
import { gridReducer, createInitialState } from './gridReducer';
import { flattenColumns, isColumnGroup } from './types.model';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { GridPagination } from './GridPagination';
import { GroupByPanel } from './GroupByPanel';
import { GridFooter } from './GridFooter';
import { ColumnChooser } from './ColumnChooser';
import { ExportMenu } from './ExportMenu';
import { ColumnFilters } from './ColumnFilters';
import { LayoutPresetsManager } from './LayoutPresetsManager';
import { ContextMenu } from './ContextMenu';
import { useContextMenu } from './useContextMenu';
import { Tooltip } from './Tooltip';
import { useTooltip } from './useTooltip';
import { DensityToggle } from './DensityToggle';
import { useDensityMode } from './useDensityMode';
import { groupRows, flattenGroupedRows } from './groupingUtils';
import { computeAggregations, computeGroupAggregations } from './aggregationUtils';
import { applyFilters, hasActiveFilters } from './filterUtils';
import { sortRows, separatePinnedRows, clampColumnWidth, resolveCellValue } from './gridDataUtils';
import { useGridPersistence } from './useGridPersistence';
import { useGridApiBinding } from './useGridApiBinding';
import { useServerSideCallbacks } from './useServerSideCallbacks';
import { useGridAnnouncements } from './useGridAnnouncements';
import { getTheme, generateThemeCSS } from './themes';
import { buildTreeFromFlat, flattenTree } from './treeDataUtils';
import { ScreenReaderAnnouncer } from './ScreenReaderAnnouncer';
import type { GridApi } from './gridApi.types';
import { buildPivot } from './pivotEngine';
import type { PivotResult, PivotColumn } from './pivotEngine';

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
 * - Grid API: Programmatic control via ref (AG Grid-inspired API)
 */
export const DataGrid = forwardRef<GridApi, DataGridProps>(({
  columns: columnDefsRaw,
  rows,
  pageSize = 10,
  showColumnPinning = true,
  footerConfig,
  virtualScrollConfig,
  persistenceConfig,
  treeConfig,
  dragRowConfig,
  rowPinConfig,
  contextMenuConfig,
  tooltipConfig,
  pivotConfig,
  masterDetailConfig,
  tableId,
  theme: _theme = 'quartz',
  densityMode: _densityMode = 'normal',
  showDensityToggle = false,
  hideToolbar = false,
  hideFilters = false,
  showFilterCount = true,
  className,
  texts,
  defaultColDef,
  singleClickEdit = false,
  quickFilterText,
  rowStyle,
  rowClass,
  rowClassRules,
  getRowHeight,
  loading = false,
  loadingOverlay,
  noRowsOverlay,
  undoRedoCellEditing = false,
  onDensityChange,
  onRowClick,
  onCellEdit,
  onSelectionChange,
  onLayoutChange,
  onRowReorder,
  onGridReady,
  onSortChange,
  onFilterChange,
  onPageChanged,
  paginationConfig,
}, ref) => {
  // Place hooks here
  const [announcementMessage] = useState('');

  // Separate column groups from leaf columns. Groups are used only by GridHeader
  // to render the spanning top row; everything else uses the flat leaf columns.
  const columnGroups = useMemo<ColumnOrGroup[]>(() => columnDefsRaw, [columnDefsRaw]);

  // Flatten groups → leaf columns (what all existing state/body logic consumes).
  const flatColumnDefs = useMemo<Column[]>(
    () => flattenColumns(columnDefsRaw),
    [columnDefsRaw]
  );

  // Merge grid-level `defaultColDef` into every leaf column.
  const columnDefs = useMemo(
    () =>
      defaultColDef
        ? flatColumnDefs.map((col) => ({ ...defaultColDef, ...col }))
        : flatColumnDefs,
    [flatColumnDefs, defaultColDef]
  );

  // Alias so existing references to `columns` throughout this file still work.
  const columns = columnDefs;

  // Initialize grid state with reducer
  const [state, dispatch] = useReducer(
    gridReducer,
    { columns, pageSize },
    (args) => createInitialState(args.columns, args.pageSize)
  );

  // Internal rows state for API transactions (overrides props.rows when set)
  const [internalRows, setInternalRows] = useState<Row[] | null>(null);
  const activeRows = internalRows !== null ? internalRows : rows;

  // Apply pivot transformation if pivot mode is enabled (must be early in the pipeline)
  const { pivotedData, effectiveColumns } = useMemo<{
    pivotedData: Row[];
    effectiveColumns: (Column | PivotColumn)[];
  }>(() => {
    if (!pivotConfig) {
      return { pivotedData: activeRows, effectiveColumns: columns };
    }

    const pivotResult: PivotResult = buildPivot(activeRows, pivotConfig);

    // Convert PivotColumns to regular Columns format for grid
    const pivotColumns: Column[] = pivotResult.columns.map((col: PivotColumn) => ({
      field: col.field,
      headerName: col.headerName,
      width: col.width || 120,
      sortable: col.sortable !== false,
      filterable: col.filterable !== false,
      editable: false,
      renderCell: col.isTotalColumn || col.isPivotColumn ? (row: Row) => {
        const value = row[col.field];
        if (typeof value === 'number') {
          return <span style={{ 
            fontWeight: col.isTotalColumn ? '700' : '600',
            color: col.isTotalColumn ? '#0f766e' : '#475569'
          }}>{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
        }
        return value;
      } : undefined,
    }));

    // Combine pivot rows with totals row if present
    const allRows = pivotResult.totalsRow 
      ? [...pivotResult.rows, pivotResult.totalsRow]
      : pivotResult.rows;

    // Ensure rows have 'id' field for grid compatibility
    const rowsWithId = allRows.map((row, index) => ({
      ...row,
      id: row.__id || row.id || `pivot-row-${index}`
    }));

    return { pivotedData: rowsWithId, effectiveColumns: pivotColumns };
  }, [activeRows, columns, pivotConfig]);

  // Reset internal rows when external rows prop changes
  const rowsRef = useRef(rows);
  useEffect(() => {
    if (rows !== rowsRef.current) {
      rowsRef.current = rows;
      const t = setTimeout(() => setInternalRows(null), 0); // defer to avoid sync setState in effect
      return () => clearTimeout(t);
    }
  }, [rows]);

  // Container ref for Grid API

  // Density mode hook
  const { densityMode, setDensityMode, densityStyles } = useDensityMode({
    initialMode: _densityMode,
    persist: true,
    onChange: onDensityChange,
  });

  // Sync external densityMode prop with internal state
  useEffect(() => {
    if (_densityMode && _densityMode !== densityMode) {
      setDensityMode(_densityMode);
    }
  }, [_densityMode, densityMode, setDensityMode]);

  // Initialize default expanded master rows
  useEffect(() => {
    if (masterDetailConfig?.enabled && masterDetailConfig.defaultExpandedMasterRowKeys) {
      const expandedRows: ExpandedMasterRows = {};
      masterDetailConfig.defaultExpandedMasterRowKeys.forEach((key) => {
        expandedRows[String(key)] = true;
      });
      dispatch({ type: 'SET_EXPANDED_MASTER_ROWS', payload: expandedRows });
    }
  }, [masterDetailConfig?.enabled, masterDetailConfig?.defaultExpandedMasterRowKeys]);

  // Theme styles - generate CSS variables from theme
  const themeStyles = useMemo(() => {
    const currentTheme = getTheme(_theme);
    return generateThemeCSS(currentTheme);
  }, [_theme]);

  // Persistence: manager, auto-load, auto-save, and layout-change notification.
  const { persistenceManager, getCurrentLayout } = useGridPersistence({
    state,
    dispatch,
    persistenceConfig,
    onLayoutChange,
  });

  // Serialized configs used by column sort/filter sync effects below.
  const sortConfigStr = useMemo(() => JSON.stringify(state.sortConfig), [state.sortConfig]);
  const filterConfigStr = useMemo(() => JSON.stringify(state.filterConfig), [state.filterConfig]);

  // Tooltip hook
  const { tooltipState, tooltipHandlers } = useTooltip({ config: tooltipConfig });

  // Context menu hook
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu({
    config: contextMenuConfig,
    columns,
    rows,
    selectedRows: state.selection.selectedRows,
    onPinColumn: (field, side) => dispatch({ type: 'PIN_COLUMN', payload: { field, side } }),
    onUnpinColumn: (field) => dispatch({ type: 'UNPIN_COLUMN', payload: field }),
    onToggleColumnVisibility: (field) => dispatch({ type: 'TOGGLE_COLUMN_VISIBILITY', payload: field }),
    onResizeColumn: (field, width) => dispatch({ type: 'RESIZE_COLUMN', payload: { field, width } }),
    onAutoSizeAllColumns: (widths) => {
      Object.entries(widths).forEach(([field, width]) => {
        dispatch({ type: 'RESIZE_COLUMN', payload: { field, width } });
      });
    },
    onSetFilter: (field, value) => dispatch({ type: 'SET_FILTER', payload: { field, value } }),
    onPinRowTop: rowPinConfig?.enabled ? (rowId) => dispatch({ type: 'PIN_ROW_TOP', payload: rowId }) : undefined,
    onPinRowBottom: rowPinConfig?.enabled ? (rowId) => dispatch({ type: 'PIN_ROW_BOTTOM', payload: rowId }) : undefined,
    onUnpinRow: rowPinConfig?.enabled ? (rowId) => dispatch({ type: 'UNPIN_ROW', payload: rowId }) : undefined,
    pinnedColumnsLeft: state.pinnedColumnsLeft,
    pinnedColumnsRight: state.pinnedColumnsRight,
    pinnedRowsTop: state.pinnedRowsTop,
    pinnedRowsBottom: state.pinnedRowsBottom,
  });

  // Grid API binding: create/sync GridApiImpl, expose via ref, onGridReady, cleanup.
  const { containerRef } = useGridApiBinding({
    ref,
    state,
    dispatch,
    effectiveColumns: effectiveColumns as Column[],
    pivotedData,
    persistenceManager,
    setInternalRows,
    onGridReady,
  });

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

  // Update columns when props change or pivot mode changes
  useEffect(() => {
    dispatch({ type: 'RESET_COLUMNS', payload: effectiveColumns });
  }, [effectiveColumns]);

  // Flex column sizing: distribute the space left after fixed-width columns across
  // any columns that declare a `flex` factor, proportionally and clamped to min/max.
  // Recomputes on container resize and whenever the relevant layout inputs change.
  const columnByField = useMemo(
    () => new Map((effectiveColumns as Column[]).map((c) => [c.field, c])),
    [effectiveColumns]
  );
  const flexSignature = (effectiveColumns as Column[])
    .map((c) => `${c.field}:${c.flex ?? ''}:${c.minWidth ?? ''}:${c.maxWidth ?? ''}`)
    .join('|');
  const displayOrderKey = displayColumnOrder.join(',');
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const flexFields = displayColumnOrder.filter((f) => {
      const c = columnByField.get(f);
      return !!c && typeof c.flex === 'number' && c.flex > 0;
    });
    if (flexFields.length === 0) return;

    const applyFlex = () => {
      const available = el.clientWidth;
      if (available <= 0) return;

      // Fixed non-column UI widths that also consume horizontal space.
      let uiExtra = 0;
      if (masterDetailConfig?.enabled) uiExtra += 48; // master/detail toggle cell
      if (dragRowConfig?.enabled && dragRowConfig.showDragHandle !== false) uiExtra += 32; // drag handle

      const flexSet = new Set(flexFields);
      const fixedWidth = displayColumnOrder
        .filter((f) => !flexSet.has(f))
        .reduce((sum, f) => {
          const c = columnByField.get(f);
          return sum + (state.columnWidths[f] || c?.width || 150);
        }, 0);

      const totalFlex = flexFields.reduce(
        (s, f) => s + (columnByField.get(f)?.flex ?? 0),
        0
      );
      const remaining = available - uiExtra - fixedWidth - 2; // small buffer to avoid overflow
      if (remaining <= 0 || totalFlex <= 0) return;

      flexFields.forEach((f) => {
        const col = columnByField.get(f);
        if (!col) return;
        const share = Math.floor(remaining * ((col.flex ?? 0) / totalFlex));
        const next = clampColumnWidth(col, share);
        if (state.columnWidths[f] !== next) {
          dispatch({ type: 'RESIZE_COLUMN', payload: { field: f, width: next } });
        }
      });
    };

    applyFlex();

    const observer = new ResizeObserver(applyFlex);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    displayOrderKey,
    flexSignature,
    state.columnWidths,
    masterDetailConfig?.enabled,
    dragRowConfig?.enabled,
    dragRowConfig?.showDragHandle,
  ]);

  // Server-side data callbacks: notify parent of sort/filter/page/pin changes.
  useServerSideCallbacks({
    state,
    sortConfigStr,
    filterConfigStr,
    onSortChange,
    onFilterChange,
    onPageChanged,
    rowPinConfig,
  });

  // Apply sorting
  const sortedRows = useMemo(
    () => sortRows(pivotedData, state.sortConfig),
    [pivotedData, state.sortConfig]
  );

  // Apply filtering using the new filter utilities
  const filteredRows = useMemo(() => {
    let result = hasActiveFilters(state.filterConfig)
      ? applyFilters(sortedRows, state.filterConfig)
      : sortedRows;

    // Global quick filter: keep rows where any column's value contains the text.
    const query = quickFilterText?.trim().toLowerCase();
    if (query) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = resolveCellValue(col, row);
          return value != null && String(value).toLowerCase().includes(query);
        })
      );
    }
    return result;
  }, [sortedRows, state.filterConfig, quickFilterText, columns]);

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

  // Screen reader announcements + parent selection notification.
  useGridAnnouncements({
    state,
    effectiveColumns,
    flattenedRows,
    onSelectionChange,
  });

  // Separate pinned and unpinned rows
  const { pinnedRowsTopData, pinnedRowsBottomData, unpinnedRows } = useMemo(
    () => separatePinnedRows(flattenedRows, state.pinnedRowsTop, state.pinnedRowsBottom),
    [flattenedRows, state.pinnedRowsTop, state.pinnedRowsBottom]
  );

  // Apply pagination to unpinned rows only.
  // In server-side pagination mode (paginationConfig.totalRows provided) the
  // parent supplies the already-paged data, so we render rows as-is without
  // slicing.
  const isServerSidePagination = paginationConfig?.totalRows !== undefined;

  // Sync controlled currentPage from paginationConfig into internal state.
  useEffect(() => {
    if (
      paginationConfig?.currentPage !== undefined &&
      paginationConfig.currentPage !== state.currentPage
    ) {
      dispatch({ type: 'SET_PAGE', payload: paginationConfig.currentPage });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationConfig?.currentPage]);

  const paginatedRows = useMemo(() => {
    if (isServerSidePagination) {
      return unpinnedRows;
    }
    const startIndex = state.currentPage * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    return unpinnedRows.slice(startIndex, endIndex);
  }, [unpinnedRows, state.currentPage, state.pageSize, isServerSidePagination]);

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
    
  }, [columns]);

  // Handle cell edit with callback
  const handleCellEdit = useCallback(
    (rowIndex: number, field: string, value: unknown) => {
      if (undoRedoCellEditing) {
        // Record the old value for undo before updating.
        const actualRow = paginatedRows[rowIndex];
        if (actualRow && 'id' in actualRow) {
          const oldValue = actualRow[field];
          dispatch({ type: 'RECORD_EDIT', payload: { rowId: actualRow.id, field, oldValue, newValue: value } });
        }
      }
      if (onCellEdit) {
        // Find the actual row index in the original data
        const actualRow = paginatedRows[rowIndex];
        if ('id' in actualRow) {
          const actualRowIndex = rows.findIndex((r) => r.id === actualRow.id);
          onCellEdit(actualRowIndex, field, value);
        }
      }
    },
    [onCellEdit, paginatedRows, rows, undoRedoCellEditing]
  );

  return (
    <div 
      ref={containerRef}
      data-testid="data-grid"
      role="grid" 
      aria-label="Data Grid"
      aria-rowcount={flattenedRows.length}
      aria-colcount={displayColumnOrder.length}
      style={{ 
        ...themeStyles as React.CSSProperties,
        ...densityStyles as React.CSSProperties,
        border: 'var(--grid-border-width, 1px) solid var(--grid-border)', 
        borderRadius: 'var(--grid-border-radius, 6px)', 
        overflow: 'hidden', 
        backgroundColor: 'var(--grid-bg)', 
        boxShadow: 'var(--grid-shadow-light, 0 1px 3px 0 rgba(0, 0, 0, 0.08))', 
        fontFamily: 'var(--grid-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      className={`data-grid density-${densityMode}${className ? ` ${className}` : ''}`}
      onKeyDown={undoRedoCellEditing ? (e: React.KeyboardEvent) => {
        const ctrl = e.ctrlKey || e.metaKey;
        if (ctrl && e.key === 'z') { e.preventDefault(); dispatch({ type: 'UNDO_EDIT' }); }
        if (ctrl && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); dispatch({ type: 'REDO_EDIT' }); }
      } : undefined}
    >
      {/* Screen Reader Announcements - Live Region */}
      <ScreenReaderAnnouncer message={announcementMessage} priority="polite" />
        
      
      {/* Toolbar */}
      {!hideToolbar && (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '16px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', backgroundColor: 'var(--grid-bg-alt)', borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)', zIndex: 30, flexShrink: 0 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Column Chooser */}
          <ColumnChooser
            columns={effectiveColumns}
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
            columns={effectiveColumns}
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

        {/* Density Toggle */}
        {showDensityToggle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--grid-text-secondary)', fontWeight: '500' }}>
              Density:
            </span>
            <DensityToggle value={densityMode} onChange={setDensityMode} />
          </div>
        )}
      </div>
      )}

      {/* Group By Panel */}
      {!hideToolbar && (
      <GroupByPanel
        columns={effectiveColumns}
        groupBy={state.groupBy}
        dispatch={dispatch}
      />
      )}

      {/* Horizontal scroll wrapper — keeps header, body & footer in a single scroll context */}
      <div style={{ overflowX: 'auto', overflowY: 'auto', width: '100%', flex: 1, minHeight: 0, position: 'relative' }}>
        {/* Sticky Header */}
        <div role="rowgroup" style={{ position: 'sticky', top: 0, zIndex: 20, width: 'fit-content', minWidth: '100%' }}>
          <GridHeader
            columns={effectiveColumns}
            columnGroups={columnGroups.some(isColumnGroup) ? columnGroups : undefined}
            columnOrder={state.columnOrder}
            displayColumnOrder={displayColumnOrder}
            columnWidths={state.columnWidths}
            sortConfig={state.sortConfig}
            dispatch={dispatch}
            pinnedLeft={pinnedLeftFields}
            pinnedRight={pinnedRightFields}
            showColumnPinning={showColumnPinning}
            masterDetailConfig={masterDetailConfig}
            dragRowConfig={dragRowConfig}
            onContextMenu={(event, column, columnIndex) =>
              handleContextMenu({
                type: 'header',
                column,
                columnIndex,
                event,
              })
            }
          />
          
          {/* Floating Filter Row */}
          {!hideFilters && (
          <ColumnFilters
            columns={effectiveColumns}
            displayColumnOrder={displayColumnOrder}
            columnWidths={state.columnWidths}
            filterConfig={state.filterConfig}
            dispatch={dispatch}
            pinnedLeft={pinnedLeftFields}
            pinnedRight={pinnedRightFields}
            rows={filteredRows}
            masterDetailConfig={masterDetailConfig}
            dragRowConfig={dragRowConfig}
            showFilterCount={showFilterCount}
          />
          )}
        </div>

        {/* Grid Body */}
        <GridBody
          columns={effectiveColumns}
          rows={virtualScrollConfig?.enabled ? unpinnedRows : paginatedRows}
          pinnedRowsTop={pinnedRowsTopData}
          pinnedRowsBottom={pinnedRowsBottomData}
          columnOrder={state.columnOrder}
          displayColumnOrder={displayColumnOrder}
          columnWidths={state.columnWidths}
          selectedRows={state.selection.selectedRows}
          editState={state.editState}
          focusState={state.focusState}
          dispatch={dispatch}
          onRowClick={onRowClick}
          onCellEdit={handleCellEdit}
          singleClickEdit={singleClickEdit}
          rowStyle={rowStyle}
          rowClass={rowClass}
          rowClassRules={rowClassRules}
          getRowHeight={getRowHeight}
          pinnedLeft={pinnedLeftFields}
          pinnedRight={pinnedRightFields}
          showGroupFooters={footerConfig?.showGroupFooters}
          groupAggregates={groupAggregates}
          aggregateConfigs={footerConfig?.aggregates}
          virtualScrollConfig={virtualScrollConfig}
          treeConfig={treeConfig}
          dragRowConfig={dragRowConfig}
          masterDetailConfig={masterDetailConfig}
          expandedMasterRows={state.detailRowState.expandedMasterRows}
          tableId={tableId}
          onRowReorder={onRowReorder}
          currentPage={state.currentPage}
          pageSize={state.pageSize}
          totalRows={paginationConfig?.totalRows ?? unpinnedRows.length}
          onContextMenu={(event, row, column, rowIndex, columnIndex) =>
            handleContextMenu({
              type: 'cell',
              row,
              column,
              rowIndex,
              columnIndex,
              event,
            })
          }
          {...tooltipHandlers}
        />

        {/* Global Footer */}
        {footerConfig?.show && footerConfig.aggregates && (
          <GridFooter
            columns={effectiveColumns}
            displayColumnOrder={displayColumnOrder}
            columnWidths={state.columnWidths}
            aggregates={globalAggregates}
            aggregateConfigs={footerConfig.aggregates}
            pinnedLeft={pinnedLeftFields}
            pinnedRight={pinnedRightFields}
          />
        )}

        {/* Loading / No-rows overlay (below the sticky header, which keeps its z-index) */}
        {(loading || (paginatedRows.length === 0 && !virtualScrollConfig?.enabled)) && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--grid-bg)',
              opacity: loading ? 0.85 : 1,
              pointerEvents: loading ? 'auto' : 'none',
              color: 'var(--grid-text-secondary, #6b7280)',
              fontSize: 'var(--grid-font-size, 14px)',
            }}
          >
            {loading
              ? (loadingOverlay ?? 'Loading…')
              : (noRowsOverlay ?? 'No rows to show')}
          </div>
        )}
      </div>

      {/* Pagination - Hide when virtual scrolling is enabled */}
      {!virtualScrollConfig?.enabled && (
        <GridPagination
          currentPage={state.currentPage}
          pageSize={state.pageSize}
          totalRows={paginationConfig?.totalRows ?? unpinnedRows.length}
          dispatch={dispatch}
          paginationTexts={texts?.pagination}
          pageSizeOptions={paginationConfig?.pageSizeOptions}
          hidePageSizeSelector={paginationConfig?.hidePageSizeSelector}
          disablePageSizeSelector={paginationConfig?.disablePageSizeSelector}
          onPageSizeChanged={paginationConfig?.onPageSizeChanged}
        />
      )}

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={closeContextMenu}
        />
      )}

      {/* Tooltip */}
      {(tooltipConfig?.enabled || columns.some((c) => c.tooltipField || c.tooltipValueGetter)) && (
        <Tooltip 
          state={tooltipState}
          maxWidth={tooltipConfig?.maxWidth}
          offset={tooltipConfig?.offset}
        />
      )}
    </div>
  );
});

// Set display name for better debugging
DataGrid.displayName = 'DataGrid';


