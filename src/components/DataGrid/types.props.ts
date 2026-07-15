// Top-level props and text-override types for the DataGrid component.
import type React from 'react';
import type { ThemeName } from './themes';
import type { DensityMode } from './densityModes';
import type { GridApi } from './gridApi.types';
import type { PivotConfig } from './pivotEngine';
import type {
  Column,
  Row,
  FooterConfig,
  VirtualScrollConfig,
  TreeConfig,
  FilterConfig,
} from './types.model';
import type { PersistenceConfig, LayoutPreset } from './types.persistence';
import type {
  DragRowConfig,
  RowPinConfig,
  MarketDataConfig,
  ContextMenuConfig,
  TooltipConfig,
  MasterDetailConfig,
} from './types.features';

/** Customizable text overrides for the pagination bar. */
export interface PaginationTexts {
  /** Label before the page-size selector. Default: "Rows per page:" */
  rowsPerPage?: string;
  /** Text shown when there are no rows. Default: "No rows" */
  noRows?: string;
  /**
   * Formats the row-range indicator.
   * Default renders: `{startRow}-{endRow} of {totalRows}`
   * Example: `(s, e, t) => \`Showing ${s} to ${e} of ${t} entries\``
   */
  rowRange?: (startRow: number, endRow: number, totalRows: number) => string;
}

/** Top-level container for all UI text overrides. Extend this interface for future areas. */
export interface GridTexts {
  pagination?: PaginationTexts;
}

/**
 * Configuration for pagination behavior.
 *
 * Supports both client-side (default) and server-side pagination.
 *
 * Server-side mode is enabled by providing `totalRows`. In that mode the grid
 * assumes the `rows` prop already contains the current page of data and will
 * NOT slice it. Combine with `currentPage` (controlled) and `onPageChanged` /
 * `onPageSizeChanged` to drive fetches from the parent component.
 */
export interface PaginationConfig {
  /**
   * Total number of rows across all pages. When provided, the grid switches to
   * server-side pagination mode and uses this value (rather than the length of
   * `rows`) to compute the total page count.
   */
  totalRows?: number;
  /**
   * Controlled current page index (0-based). When provided, the grid uses this
   * value instead of its internal page state and parents are expected to update
   * it in response to `onPageChanged`.
   */
  currentPage?: number;
  /**
   * Options shown in the "Rows per page" selector. Defaults to `[10, 20, 50]`.
   */
  pageSizeOptions?: number[];
  /** Hide the "Rows per page" selector entirely. */
  hidePageSizeSelector?: boolean;
  /** Render the "Rows per page" selector as disabled. */
  disablePageSizeSelector?: boolean;
  /**
   * Called when the user picks a new page size from the selector.
   * Fires in addition to `onPageChanged` (which also reports page-size changes).
   */
  onPageSizeChanged?: (pageSize: number) => void;
}

// Props for the main DataGrid component
export interface DataGridProps {
  columns: Column[];
  rows: Row[];
  pageSize?: number;
  /**
   * Default column definition merged into every column. Properties set on an
   * individual column take precedence over the defaults (shallow merge).
   */
  defaultColDef?: Partial<Column>;
  showColumnPinning?: boolean;
  footerConfig?: FooterConfig;
  virtualScrollConfig?: VirtualScrollConfig;
  persistenceConfig?: PersistenceConfig;
  treeConfig?: TreeConfig; // Configuration for tree/hierarchical data
  dragRowConfig?: DragRowConfig; // Configuration for row dragging
  rowPinConfig?: RowPinConfig; // Configuration for row pinning
  marketDataConfig?: MarketDataConfig; // Configuration for market data mode
  contextMenuConfig?: ContextMenuConfig; // Configuration for context menu
  tooltipConfig?: TooltipConfig; // Configuration for tooltips
  pivotConfig?: PivotConfig | null; // Configuration for pivot table mode
  masterDetailConfig?: MasterDetailConfig; // Configuration for master/detail rows
  tableId?: string; // Unique ID for multi-table drag-and-drop
  theme?: ThemeName; // Theme to apply to the grid
  densityMode?: DensityMode; // Density mode: compact, normal, or comfortable
  showDensityToggle?: boolean; // Show density mode toggle control (default: false)
  hideToolbar?: boolean; // Hide the toolbar (columns, export, group by) - useful for nested grids
  hideFilters?: boolean; // Hide the column filter row independently of the toolbar
  showFilterCount?: boolean; // Show/hide the selected values count on the Apply button in set/multi-select filters (default: true)
  className?: string; // Additional CSS class name(s) applied to the root container element
  singleClickEdit?: boolean; // Start editing on a single click (grid-wide). Columns can override via `Column.singleClickEdit`.
  quickFilterText?: string; // Global quick-filter text. Rows are kept when any column's value contains this text (case-insensitive).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowStyle?: React.CSSProperties | ((row: Row, rowIndex: number) => React.CSSProperties | undefined); // Inline style applied to each data row.
  rowClass?: string | string[] | ((row: Row, rowIndex: number) => string | string[] | undefined); // CSS class(es) applied to each data row.
  rowClassRules?: { [className: string]: (row: Row, rowIndex: number) => boolean }; // Conditional row CSS classes keyed by class name.
  getRowHeight?: (row: Row, rowIndex: number) => number | undefined | null; // Per-row height in px (non-virtualized rows).
  loading?: boolean; // Show the loading overlay over the grid body.
  loadingOverlay?: React.ReactNode; // Custom loading overlay content (default: "Loading…").
  noRowsOverlay?: React.ReactNode; // Custom overlay content shown when there are no rows (default: "No rows to show").
  onDensityChange?: (mode: DensityMode) => void; // Callback when density changes
  onRowClick?: (row: Row) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCellEdit?: (rowIndex: number, field: string, value: any) => void;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  onLayoutChange?: (layout: LayoutPreset['layout']) => void;
  onRowReorder?: (rows: Row[]) => void;
  onGridReady?: (api: GridApi) => void; // Called when grid API is ready
  /**
   * Called when sort changes (user clicks a column header to sort).
   * Useful for server-side sorting where the parent component fetches sorted data.
   * Fires only in response to user actions, not on the initial render.
   */
  onSortChange?: (field: string, direction: 'asc' | 'desc' | null) => void;
  /**
   * Called when column filters change.
   * Useful for server-side filtering where the parent component fetches filtered data.
   * Fires only in response to user actions, not on the initial render.
   */
  onFilterChange?: (filters: FilterConfig) => void;
  /**
   * Called when the current page changes (pagination).
   * Receives the new page index (0-based) and the current page size.
   * Useful for server-side pagination where the parent component fetches the page of data.
   * Fires only in response to user actions, not on the initial render.
   */
  onPageChanged?: (page: number, pageSize: number) => void;
  /** Pagination configuration (server-side mode, customization, callbacks). */
  paginationConfig?: PaginationConfig;
  texts?: GridTexts; // Custom text overrides for UI labels
}
