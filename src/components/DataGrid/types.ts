// Core type definitions for the DataGrid component
import React from 'react';
import type { ThemeName } from './themes';
import type { DensityMode } from './densityModes';
import type { GridApi } from './gridApi.types';

export type FilterType = 'text' | 'number' | 'date' | 'set' | 'multi';

export interface Column {
  field: string;
  headerName: string;
  width?: number;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pinnable?: boolean;
  filterType?: FilterType; // Specify filter type for the column
  renderCell?: (row: Row) => React.ReactNode; // Custom cell renderer
}

export interface Row {
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Tree data types
export interface TreeNode extends Row {
  isTreeNode: true;
  nodeId: string | number;
  parentId: string | number | null;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  children?: TreeNode[];
}

export interface TreeConfig {
  enabled: boolean;
  idField?: string; // Field name for node ID (default: 'id')
  parentIdField?: string; // Field name for parent ID (default: 'parentId')
  childrenField?: string; // Field name for children array (default: 'children')
  indentSize?: number; // Pixels to indent per level (default: 24)
  showExpandIcon?: boolean; // Show expand/collapse icons (default: true)
  showConnectors?: boolean; // Show tree connectors (default: false)
  lazyLoad?: boolean; // Support lazy loading of children (default: false)
  onNodeExpand?: (node: TreeNode) => void | Promise<TreeNode[]>;
  onNodeCollapse?: (node: TreeNode) => void;
}

export interface ExpandedNodes {
  [nodeKey: string]: boolean;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc' | null;
}

// Enhanced filter configuration supporting multiple filter types
export interface FilterValue {
  type?: string; // Filter operation type (e.g., 'contains', 'equals', 'greaterThan', etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;   // Primary filter value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value2?: any;  // Secondary value for range filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values?: any[]; // Array of values for set/multi-select filters
}

// Multi-condition filter - supports multiple conditions with AND/OR logic
export interface FilterCondition {
  type: string; // Filter operation type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value2?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values?: any[];
}

export interface AdvancedFilterValue {
  operator: 'AND' | 'OR'; // How to combine multiple conditions
  conditions: FilterCondition[]; // Array of filter conditions
}

// FilterConfig now supports both simple and advanced filters
export interface FilterConfig {
  [field: string]: FilterValue | AdvancedFilterValue | null;
}

export interface SelectionState {
  selectedRows: Set<string | number>;
  lastSelectedIndex: number | null;
}

export interface EditState {
  rowId: string | number | null;
  field: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export interface FocusState {
  rowIndex: number;
  columnIndex: number;
}

// Grouping types
export type AggregateFunction = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'total';

export interface GroupConfig {
  field: string;
  aggregates?: {
    field: string;
    function: AggregateFunction;
  }[];
}

// Footer/Aggregation types
export interface AggregateConfig {
  field: string;
  function: AggregateFunction;
  label?: string; // Optional custom label for the aggregate
}

export interface FooterConfig {
  show: boolean;
  aggregates?: AggregateConfig[]; // Aggregates to compute for global footer
  showGroupFooters?: boolean; // Show footers for each group
}

export interface GroupedRow {
  isGroup: true;
  groupKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupValue: any;
  field: string;
  level: number;
  children: (Row | GroupedRow)[];
  isExpanded: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aggregates?: { [key: string]: any };
}

export interface ExpandedGroups {
  [groupKey: string]: boolean;
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
  groupBy: string[]; // Array of field names to group by
  expandedGroups: ExpandedGroups; // Track which groups are expanded
  pinnedColumnsLeft: string[];
  pinnedColumnsRight: string[];
  hiddenColumns: string[]; // Array of field names that are hidden
  expandedNodes: ExpandedNodes; // Track which tree nodes are expanded
  dragState: DragState; // Track drag-and-drop state
  pinnedRowsTop: (string | number)[]; // Array of row IDs pinned to top
  pinnedRowsBottom: (string | number)[]; // Array of row IDs pinned to bottom
}

// Action types for reducer
export type GridAction =
  | { type: 'SET_SORT'; payload: SortConfig }
  | { type: 'SET_FILTER'; payload: { field: string; value: FilterValue | AdvancedFilterValue | null } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'TOGGLE_ROW_SELECTION'; payload: { rowId: string | number; isMulti: boolean } }
  | { type: 'SELECT_RANGE'; payload: { startIndex: number; endIndex: number; rowIds: (string | number)[] } }
  | { type: 'CLEAR_SELECTION' }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'START_EDIT'; payload: { rowId: string | number; field: string; value: any } }
  | { type: 'END_EDIT' }
  | { type: 'SET_FOCUS'; payload: FocusState | null }
  | { type: 'REORDER_COLUMNS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'RESIZE_COLUMN'; payload: { field: string; width: number } }
  | { type: 'RESET_COLUMNS'; payload: Column[] }
  | { type: 'ADD_GROUP'; payload: string }
  | { type: 'REMOVE_GROUP'; payload: string }
  | { type: 'REORDER_GROUPS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'TOGGLE_GROUP'; payload: string }
  | { type: 'CLEAR_GROUPS' }
  | { type: 'PIN_COLUMN'; payload: { field: string; side: 'left' | 'right' } }
  | { type: 'UNPIN_COLUMN'; payload: string }
  | { type: 'TOGGLE_COLUMN_VISIBILITY'; payload: string }
  | { type: 'SET_COLUMN_VISIBILITY'; payload: { field: string; visible: boolean } }
  | { type: 'RESET_COLUMN_LAYOUT' }
  | { type: 'LOAD_LAYOUT_PRESET'; payload: LayoutPreset['layout'] }
  | { type: 'APPLY_LAYOUT'; payload: Partial<LayoutPreset['layout']> }
  | { type: 'TOGGLE_TREE_NODE'; payload: string | number }
  | { type: 'EXPAND_ALL_NODES' }
  | { type: 'COLLAPSE_ALL_NODES' }
  | { type: 'SET_EXPANDED_NODES'; payload: ExpandedNodes }
  | { type: 'SET_DRAG_STATE'; payload: DragState }
  | { type: 'START_DRAG'; payload: { rowId: string | number; rowIndex: number } }
  | { type: 'END_DRAG' }
  | { type: 'PIN_ROW_TOP'; payload: string | number }
  | { type: 'PIN_ROW_BOTTOM'; payload: string | number }
  | { type: 'UNPIN_ROW'; payload: string | number }
  // Grid API actions
  | { type: 'SET_ROW_DATA'; payload: Row[] }
  | { type: 'SET_COLUMN_DEFS'; payload: Column[] }
  | { type: 'SORT_COLUMN'; payload: string }
  | { type: 'SET_SORT_MODEL'; payload: SortConfig[] }
  | { type: 'CLEAR_ALL_FILTERS' }
  | { type: 'CLEAR_ALL_SORTING' }
  | { type: 'SELECT_ROW'; payload: { rowId: string | number; ctrlKey: boolean } }
  | { type: 'DESELECT_ROW'; payload: string | number }
  | { type: 'SELECT_ALL_ROWS' }
  | { type: 'DESELECT_ALL_ROWS' }
  | { type: 'CLEAR_FOCUS' }
  | { type: 'START_EDITING'; payload: { rowId: string | number; field: string; value: any } }
  | { type: 'CANCEL_EDITING' }
  | { type: 'SAVE_EDIT' }
  | { type: 'REFRESH_CELLS'; payload?: unknown }
  | { type: 'REFRESH_HEADER' }
  | { type: 'REDRAW_ROWS'; payload?: unknown }
  | { type: 'SHOW_OVERLAY'; payload: 'loading' | 'noRows' }
  | { type: 'HIDE_OVERLAY' }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_GROUP_BY'; payload: string[] }
  | { type: 'RECALCULATE_LAYOUT' }
  | { type: 'RESET_COLUMN_STATE' };

// Virtual scrolling configuration
export interface VirtualScrollConfig {
  enabled: boolean;
  rowHeight?: number | ((index: number, row: Row | GroupedRow) => number);
  containerHeight?: number;
  overscanCount?: number;
  enableColumnVirtualization?: boolean;
  columnOverscan?: number;
}

// Layout Preset - represents a saved grid layout
export interface LayoutPreset {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  layout: {
    columnOrder: string[];
    columnWidths: { [field: string]: number };
    pinnedColumnsLeft: string[];
    pinnedColumnsRight: string[];
    hiddenColumns: string[];
    sortConfig: SortConfig;
    filterConfig: FilterConfig;
    pageSize: number;
    groupBy?: string[];
  };
}

// Storage strategy type
export type StorageStrategy = 'localStorage' | 'server' | 'userProfile';

// Storage adapter interface for different persistence strategies
export interface StorageAdapter {
  save(key: string, preset: LayoutPreset): Promise<void>;
  load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null>;
  delete(key: string, presetId: string): Promise<void>;
  list(key: string): Promise<LayoutPreset[]>;
}

// Server configuration for server-based persistence
export interface ServerConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  saveEndpoint?: string;
  loadEndpoint?: string;
  deleteEndpoint?: string;
  listEndpoint?: string;
}

// User profile configuration for user-based persistence
export interface UserProfileConfig {
  userId: string;
  profileKey?: string;
  adapter?: StorageAdapter;
}

// Persistence configuration
export interface PersistenceConfig {
  enabled: boolean;
  storageKey: string; // Unique key to identify this grid's layouts
  strategy?: StorageStrategy;
  autoSave?: boolean; // Auto-save on layout changes
  autoSaveDelay?: number; // Debounce delay in ms (default: 1000)
  autoLoad?: boolean; // Auto-load last saved preset on mount
  serverConfig?: ServerConfig;
  userProfileConfig?: UserProfileConfig;
  customAdapter?: StorageAdapter;
}

// Row pinning configuration
export interface RowPinConfig {
  enabled: boolean; // Enable row pinning feature
  showPinButton?: boolean; // Show pin button in row (default: false)
  maxPinnedTop?: number; // Max rows pinned to top (default: unlimited)
  maxPinnedBottom?: number; // Max rows pinned to bottom (default: unlimited)
  onPinChange?: (pinnedTop: (string | number)[], pinnedBottom: (string | number)[]) => void;
}

// Row dragging configuration
export interface DragRowConfig {
  enabled: boolean;
  showDragHandle?: boolean; // Show explicit drag handle (default: true)
  allowCrossGroup?: boolean; // Allow dragging across groups (default: false)
  allowExternalDrop?: boolean; // Allow dropping from external sources (default: false)
  dragHandlePosition?: 'left' | 'right'; // Position of drag handle (default: 'left')
  onDragStart?: (row: Row, rowIndex: number) => void; // Called when drag starts
  onDragEnd?: () => void; // Called when drag ends
  onRowDrop?: (sourceIndex: number, targetIndex: number, row: Row) => void;
  onRowMove?: (sourceIndex: number, targetIndex: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onExternalDrop?: (data: any, targetIndex: number) => void;
}

export interface DragState {
  isDragging: boolean;
  draggedRowId: string | number | null;
  draggedRowIndex: number | null;
  dropTargetIndex: number | null;
  dropPosition: 'before' | 'after' | null;
}

// Market Data Mode Configuration
export interface MarketDataConfig {
  enabled: boolean; // Enable market data mode
  flashDuration?: number; // Flash animation duration in ms
  enableFlash?: boolean; // Enable cell flash animations
  enableLiveSorting?: boolean; // Enable real-time sorting
  enableRankingMovement?: boolean; // Enable row position changes
  batchInterval?: number; // Update batching interval in ms
  maxUpdatesPerFrame?: number; // Max updates per RAF
  cpuThreshold?: number; // CPU usage threshold for throttling
  densityMode?: boolean; // Use compact layout
}

// Cell Update for Market Data
export interface CellUpdate {
  rowId: string | number;
  field: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oldValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newValue: any;
  timestamp: number;
}

// Flash Animation
export interface FlashAnimation {
  cellKey: string;
  direction: 'up' | 'down';
  startTime: number;
  duration: number;
}

// Context Menu types
export interface ContextMenuItem {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  type?: 'item' | 'separator';
  shortcut?: string;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuConfig {
  enabled?: boolean; // Enable/disable context menu (default: true)
  showCopy?: boolean; // Show copy options (default: true)
  showExport?: boolean; // Show export options (default: true)
  showColumnOptions?: boolean; // Show pin/hide/resize options (default: true)
  showFilterByValue?: boolean; // Show filter by value option (default: true)
  customItems?: ContextMenuItem[]; // Additional custom menu items
  onBeforeShow?: (event: ContextMenuEvent) => ContextMenuItem[] | null; // Customize menu before showing
}

export interface ContextMenuEvent {
  type: 'cell' | 'header' | 'row';
  row?: Row;
  column?: Column;
  rowIndex?: number;
  columnIndex?: number;
  event: React.MouseEvent;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  contextType: 'cell' | 'header' | 'row' | null;
  targetRow?: Row;
  targetColumn?: Column;
  targetRowIndex?: number;
  targetColumnIndex?: number;
}

// Tooltip types
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipContent {
  title?: string;
  content: React.ReactNode;
}

export interface TooltipConfig {
  enabled?: boolean; // Enable/disable tooltips (default: true)
  showDelay?: number; // Delay before showing tooltip in ms (default: 500)
  hideDelay?: number; // Delay before hiding tooltip in ms (default: 0)
  placement?: TooltipPlacement; // Preferred placement (default: 'auto')
  offset?: number; // Distance from target in pixels (default: 8)
  maxWidth?: number; // Max width of tooltip in pixels (default: 300)
  showCellTooltips?: boolean; // Show tooltips on cell hover (default: false)
  showRowTooltips?: boolean; // Show tooltips on row hover (default: false)
  getCellTooltip?: (row: Row, column: Column, value: any) => TooltipContent | string | null;
  getRowTooltip?: (row: Row, rowIndex: number) => TooltipContent | string | null;
}

export interface TooltipState {
  isVisible: boolean;
  x: number;
  y: number;
  placement: TooltipPlacement;
  content: TooltipContent | null;
  targetRect: DOMRect | null;
}

// Props for the main DataGrid component
export interface DataGridProps {
  columns: Column[];
  rows: Row[];
  pageSize?: number;
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
  tableId?: string; // Unique ID for multi-table drag-and-drop
  theme?: ThemeName; // Theme to apply to the grid
  densityMode?: DensityMode; // Density mode: compact, normal, or comfortable
  showDensityToggle?: boolean; // Show density mode toggle control (default: false)
  onDensityChange?: (mode: DensityMode) => void; // Callback when density changes
  onRowClick?: (row: Row) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCellEdit?: (rowIndex: number, field: string, value: any) => void;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  onLayoutChange?: (layout: LayoutPreset['layout']) => void;
  onRowReorder?: (rows: Row[]) => void;
  onGridReady?: (api: GridApi) => void; // Called when grid API is ready
}
