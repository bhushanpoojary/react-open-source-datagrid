// Core data-model and per-domain state types for the DataGrid.
import React from 'react';

export type FilterType = 'text' | 'number' | 'date' | 'set' | 'multi';

export interface Column {
  field: string;
  headerName: string;
  width?: number;
  minWidth?: number; // Minimum width in px. Clamps the initial width and drag-resizing (default floor: 50px).
  maxWidth?: number; // Maximum width in px. Clamps the initial width and drag-resizing.
  flex?: number; // Flex-grow factor. Flex columns share the space left after fixed-width columns, in proportion to their flex value (respecting min/max). When set, `width` acts only as a fallback.
  editable?: boolean | ((row: Row) => boolean); // Whether cells are editable. Boolean, or a per-row callback.
  singleClickEdit?: boolean; // Start editing on a single click (per-column). Overrides the grid-level default.
  sortable?: boolean;
  sort?: 'asc' | 'desc' | null; // Initial sort direction applied on first render.
  sortIndex?: number; // When multiple columns declare `sort`, the one with the lowest sortIndex is applied (grid uses single-column sort).
  filterable?: boolean;
  pinnable?: boolean;
  hide?: boolean; // Hide this column initially. Users can still re-show it via the Column Chooser / API.
  filterType?: FilterType; // Specify filter type for the column
  renderCell?: (row: Row) => React.ReactNode; // Custom cell renderer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellStyle?: React.CSSProperties | ((row: Row, value: any) => React.CSSProperties | undefined); // Inline style for cells, static or per-row.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellClass?: string | string[] | ((row: Row, value: any) => string | string[] | undefined); // CSS class(es) for cells, static or per-row.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellClassRules?: { [className: string]: (row: Row, value: any) => boolean }; // Conditional CSS classes keyed by class name.
  tooltipField?: string; // Field whose value is shown as the cell's tooltip.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipValueGetter?: (row: Row, value: any) => string | null; // Dynamic cell tooltip text (takes precedence over tooltipField).
  headerTooltip?: string; // Native tooltip shown when hovering the column header.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueGetter?: (row: Row) => any; // Derive the cell value from the row (computed columns). Takes precedence over `field` for display.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueFormatter?: (value: any, row: Row) => string; // Format the resolved value into a display string. Applied after `valueGetter`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor?: (props: any) => React.ReactElement; // Custom cell editor component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorParams?: any; // Additional parameters for custom editor
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

export interface DragState {
  isDragging: boolean;
  draggedRowId: string | number | null;
  draggedRowIndex: number | null;
  dropTargetIndex: number | null;
  dropPosition: 'before' | 'after' | null;
}

export interface ExpandedMasterRows {
  [rowKey: string]: boolean;
}

export interface DetailRowState {
  expandedMasterRows: ExpandedMasterRows; // Track which master rows are expanded
}

// Virtual scrolling configuration
export interface VirtualScrollConfig {
  enabled: boolean;
  rowHeight?: number | ((index: number, row: Row | GroupedRow) => number);
  containerHeight?: number;
  overscanCount?: number;
  enableColumnVirtualization?: boolean;
  columnOverscan?: number;
}
