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
import type { Column, Row, VirtualScrollConfig } from './types';
import type { ServerSideDataSourceConfig } from './ServerSideDataSource';
import { ServerSideDataSource } from './ServerSideDataSource';
import { gridReducer, createInitialState } from './gridReducer';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { GroupByPanel } from './GroupByPanel';
import { ColumnChooser } from './ColumnChooser';
import { ColumnFilters } from './ColumnFilters';
import { getTheme, generateThemeCSS } from './themes';
import type { ThemeName } from './themes';

export interface InfiniteScrollDataGridProps {
  columns: Column[];
  dataSource: ServerSideDataSource | ServerSideDataSourceConfig;
  pageSize?: number;
  showColumnPinning?: boolean;
  virtualScrollConfig?: VirtualScrollConfig;
  theme?: ThemeName;
  onRowClick?: (row: Row) => void;
  onCellEdit?: (rowIndex: number, field: string, value: unknown) => void;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

/**
 * InfiniteScrollDataGrid
 * 
 * A DataGrid component optimized for infinite scrolling with server-side data source.
 */
export const InfiniteScrollDataGrid: React.FC<InfiniteScrollDataGridProps> = ({
  columns,
  dataSource,
  pageSize = 100,
  showColumnPinning = true,
  virtualScrollConfig,
  theme: _theme = 'quartz',
  onRowClick,
  onCellEdit,
  onSelectionChange,
}) => {
  // Initialize grid state with reducer
  const [state, dispatch] = useReducer(
    gridReducer,
    { columns, pageSize },
    (args) => createInitialState(args.columns, args.pageSize)
  );

  // Initialize or use provided data source
  const [dataSourceInstance, setDataSourceInstance] = useState<ServerSideDataSource | null>(null);
  const [totalRows, setTotalRows] = useState<number | undefined>(undefined);

  // Initialize data source
  useEffect(() => {
    let ds: ServerSideDataSource;
    
    if (dataSource instanceof ServerSideDataSource) {
      ds = dataSource;
    } else {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selection.selectedRows]);

  // Track loaded row range for infinite scrolling
  const [loadedRange, setLoadedRange] = useState({ start: 0, end: pageSize * 10 }); // Start with 10 pages
  
  // Force re-render when data source updates
  const [dataVersion, setDataVersion] = useState(0);

  // Get rows for display - use data source to fetch on-demand
  const visibleRows = useMemo(() => {
    if (!dataSourceInstance) return [];
    
    // Get rows in the loaded range
    // dataVersion is included to force recalculation when data arrives
    return dataSourceInstance.getRowsInRange(loadedRange.start, loadedRange.end);
  }, [dataSourceInstance, loadedRange, dataVersion]);

  // Subscribe to data source changes to trigger re-renders
  useEffect(() => {
    if (!dataSourceInstance) return;
    
    const unsubscribe = dataSourceInstance.subscribe(() => {
      setDataVersion(v => v + 1);
    });
    
    return unsubscribe;
  }, [dataSourceInstance]);

  // Handle scroll to load more data
  const handleScroll = useCallback((scrollTop: number) => {
    if (!dataSourceInstance || totalRows === undefined) return;
    
    const containerHeight = virtualScrollConfig?.containerHeight || 600;
    const rowHeight = typeof virtualScrollConfig?.rowHeight === 'number' ? virtualScrollConfig.rowHeight : 35;
    const visibleRows = Math.ceil(containerHeight / rowHeight);
    const currentRow = Math.floor(scrollTop / rowHeight);
    
    // Calculate buffer (3x visible rows)
    const buffer = visibleRows * 3;
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
      } else {
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

  // Handle cell edit
  const handleCellEdit = useCallback(
    (rowIndex: number, field: string, value: unknown) => {
      if (onCellEdit) {
        const actualRowIndex = state.currentPage * pageSize + rowIndex;
        onCellEdit(actualRowIndex, field, value);
      }
    },
    [onCellEdit, state.currentPage, pageSize]
  );

  // Show loading indicator
  if (!dataSourceInstance) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        border: '1px solid #e2e8f0', 
        borderRadius: '6px' 
      }}>
        Loading data source...
      </div>
    );
  }

  return (
    <div style={{ 
      border: 'var(--grid-border-width, 1px) solid var(--grid-border)', 
      borderRadius: 'var(--grid-border-radius, 6px)', 
      backgroundColor: 'var(--grid-bg)', 
      boxShadow: 'var(--grid-shadow-light, 0 1px 3px 0 rgba(0, 0, 0, 0.08))',
      fontFamily: 'var(--grid-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      display: 'flex',
      flexDirection: 'column',
      height: virtualScrollConfig?.containerHeight ? `${virtualScrollConfig.containerHeight + 150}px` : 'auto'
    }}>
      {/* Toolbar */}
      <div style={{ 
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
      }}>
        <div style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
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

          {/* Total rows indicator */}
          <div style={{ 
            fontSize: '14px', 
            color: '#64748b', 
            marginLeft: '12px' 
          }}>
            {totalRows !== undefined 
              ? `${totalRows.toLocaleString()} total rows` 
              : 'Loading...'}
          </div>
        </div>
      </div>

      {/* Group By Panel */}
      <GroupByPanel
        columns={columns}
        groupBy={state.groupBy}
        dispatch={dispatch}
      />

      {/* Sticky Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20 }}>
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
          rows={visibleRows}
        />
      </div>

      {/* Grid Body with Virtual Scrolling */}
      <GridBody
        columns={columns}
        rows={visibleRows}
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
        onScroll={handleScroll}
        virtualScrollConfig={{
          ...virtualScrollConfig,
          enabled: true,
        }}
      />

      {/* Status bar */}
      <div style={{ 
        padding: '8px 16px', 
        backgroundColor: 'var(--grid-footer-bg)', 
        borderTop: 'var(--grid-border-width, 1px) solid var(--grid-border)', 
        fontSize: 'var(--grid-font-size-sm, 12px)', 
        color: 'var(--grid-text-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          Server-side infinite scrolling enabled
        </div>
        <div>
          Rows loaded: {visibleRows.length}
        </div>
      </div>
    </div>
  );
};

/**
 * ThemedInfiniteScrollDataGrid - InfiniteScrollDataGrid wrapper with theme support
 * Applies theme CSS variables to the grid container
 */
export const ThemedInfiniteScrollDataGrid: React.FC<InfiniteScrollDataGridProps> = (props) => {
  const { theme = 'quartz', ...restProps } = props;
  const currentTheme = getTheme(theme);
  const themeStyles = generateThemeCSS(currentTheme);

  return (
    <div style={themeStyles as React.CSSProperties}>
      <InfiniteScrollDataGrid {...restProps} theme={theme} />
    </div>
  );
};

export default InfiniteScrollDataGrid;
