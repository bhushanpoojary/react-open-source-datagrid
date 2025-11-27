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
    filterType?: FilterType;
    renderCell?: (row: Row) => React.ReactNode;
}
export interface Row {
    id: string | number;
    [key: string]: any;
}
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
    idField?: string;
    parentIdField?: string;
    childrenField?: string;
    indentSize?: number;
    showExpandIcon?: boolean;
    showConnectors?: boolean;
    lazyLoad?: boolean;
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
export interface FilterValue {
    type?: string;
    value?: any;
    value2?: any;
    values?: any[];
}
export interface FilterCondition {
    type: string;
    value?: any;
    value2?: any;
    values?: any[];
}
export interface AdvancedFilterValue {
    operator: 'AND' | 'OR';
    conditions: FilterCondition[];
}
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
    value: any;
}
export interface FocusState {
    rowIndex: number;
    columnIndex: number;
}
export type AggregateFunction = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'total';
export interface GroupConfig {
    field: string;
    aggregates?: {
        field: string;
        function: AggregateFunction;
    }[];
}
export interface AggregateConfig {
    field: string;
    function: AggregateFunction;
    label?: string;
}
export interface FooterConfig {
    show: boolean;
    aggregates?: AggregateConfig[];
    showGroupFooters?: boolean;
}
export interface GroupedRow {
    isGroup: true;
    groupKey: string;
    groupValue: any;
    field: string;
    level: number;
    children: (Row | GroupedRow)[];
    isExpanded: boolean;
    aggregates?: {
        [key: string]: any;
    };
}
export interface ExpandedGroups {
    [groupKey: string]: boolean;
}
export interface GridState {
    columns: Column[];
    sortConfig: SortConfig;
    filterConfig: FilterConfig;
    currentPage: number;
    pageSize: number;
    selection: SelectionState;
    editState: EditState;
    focusState: FocusState | null;
    columnOrder: string[];
    columnWidths: {
        [field: string]: number;
    };
    groupBy: string[];
    expandedGroups: ExpandedGroups;
    pinnedColumnsLeft: string[];
    pinnedColumnsRight: string[];
    hiddenColumns: string[];
    expandedNodes: ExpandedNodes;
    dragState: DragState;
    pinnedRowsTop: (string | number)[];
    pinnedRowsBottom: (string | number)[];
}
export type GridAction = {
    type: 'SET_SORT';
    payload: SortConfig;
} | {
    type: 'SET_FILTER';
    payload: {
        field: string;
        value: FilterValue | AdvancedFilterValue | null;
    };
} | {
    type: 'CLEAR_FILTERS';
} | {
    type: 'SET_PAGE';
    payload: number;
} | {
    type: 'SET_PAGE_SIZE';
    payload: number;
} | {
    type: 'TOGGLE_ROW_SELECTION';
    payload: {
        rowId: string | number;
        isMulti: boolean;
    };
} | {
    type: 'SELECT_RANGE';
    payload: {
        startIndex: number;
        endIndex: number;
        rowIds: (string | number)[];
    };
} | {
    type: 'CLEAR_SELECTION';
} | {
    type: 'START_EDIT';
    payload: {
        rowId: string | number;
        field: string;
        value: any;
    };
} | {
    type: 'END_EDIT';
} | {
    type: 'SET_FOCUS';
    payload: FocusState | null;
} | {
    type: 'REORDER_COLUMNS';
    payload: {
        fromIndex: number;
        toIndex: number;
    };
} | {
    type: 'RESIZE_COLUMN';
    payload: {
        field: string;
        width: number;
    };
} | {
    type: 'RESET_COLUMNS';
    payload: Column[];
} | {
    type: 'ADD_GROUP';
    payload: string;
} | {
    type: 'REMOVE_GROUP';
    payload: string;
} | {
    type: 'REORDER_GROUPS';
    payload: {
        fromIndex: number;
        toIndex: number;
    };
} | {
    type: 'TOGGLE_GROUP';
    payload: string;
} | {
    type: 'CLEAR_GROUPS';
} | {
    type: 'PIN_COLUMN';
    payload: {
        field: string;
        side: 'left' | 'right';
    };
} | {
    type: 'UNPIN_COLUMN';
    payload: string;
} | {
    type: 'TOGGLE_COLUMN_VISIBILITY';
    payload: string;
} | {
    type: 'SET_COLUMN_VISIBILITY';
    payload: {
        field: string;
        visible: boolean;
    };
} | {
    type: 'RESET_COLUMN_LAYOUT';
} | {
    type: 'LOAD_LAYOUT_PRESET';
    payload: LayoutPreset['layout'];
} | {
    type: 'APPLY_LAYOUT';
    payload: Partial<LayoutPreset['layout']>;
} | {
    type: 'TOGGLE_TREE_NODE';
    payload: string | number;
} | {
    type: 'EXPAND_ALL_NODES';
} | {
    type: 'COLLAPSE_ALL_NODES';
} | {
    type: 'SET_EXPANDED_NODES';
    payload: ExpandedNodes;
} | {
    type: 'SET_DRAG_STATE';
    payload: DragState;
} | {
    type: 'START_DRAG';
    payload: {
        rowId: string | number;
        rowIndex: number;
    };
} | {
    type: 'END_DRAG';
} | {
    type: 'PIN_ROW_TOP';
    payload: string | number;
} | {
    type: 'PIN_ROW_BOTTOM';
    payload: string | number;
} | {
    type: 'UNPIN_ROW';
    payload: string | number;
} | {
    type: 'SET_ROW_DATA';
    payload: Row[];
} | {
    type: 'SET_COLUMN_DEFS';
    payload: Column[];
} | {
    type: 'SORT_COLUMN';
    payload: string;
} | {
    type: 'SET_SORT_MODEL';
    payload: SortConfig[];
} | {
    type: 'CLEAR_ALL_FILTERS';
} | {
    type: 'CLEAR_ALL_SORTING';
} | {
    type: 'SELECT_ROW';
    payload: {
        rowId: string | number;
        ctrlKey: boolean;
    };
} | {
    type: 'DESELECT_ROW';
    payload: string | number;
} | {
    type: 'SELECT_ALL_ROWS';
} | {
    type: 'DESELECT_ALL_ROWS';
} | {
    type: 'CLEAR_FOCUS';
} | {
    type: 'START_EDITING';
    payload: {
        rowId: string | number;
        field: string;
        value: any;
    };
} | {
    type: 'CANCEL_EDITING';
} | {
    type: 'SAVE_EDIT';
} | {
    type: 'REFRESH_CELLS';
    payload?: unknown;
} | {
    type: 'REFRESH_HEADER';
} | {
    type: 'REDRAW_ROWS';
    payload?: unknown;
} | {
    type: 'SHOW_OVERLAY';
    payload: 'loading' | 'noRows';
} | {
    type: 'HIDE_OVERLAY';
} | {
    type: 'SET_GROUP_BY';
    payload: string[];
} | {
    type: 'RECALCULATE_LAYOUT';
} | {
    type: 'RESET_COLUMN_STATE';
};
export interface VirtualScrollConfig {
    enabled: boolean;
    rowHeight?: number | ((index: number, row: Row | GroupedRow) => number);
    containerHeight?: number;
    overscanCount?: number;
    enableColumnVirtualization?: boolean;
    columnOverscan?: number;
}
export interface LayoutPreset {
    id: string;
    name: string;
    description?: string;
    createdAt: number;
    updatedAt: number;
    layout: {
        columnOrder: string[];
        columnWidths: {
            [field: string]: number;
        };
        pinnedColumnsLeft: string[];
        pinnedColumnsRight: string[];
        hiddenColumns: string[];
        sortConfig: SortConfig;
        filterConfig: FilterConfig;
        pageSize: number;
        groupBy?: string[];
    };
}
export type StorageStrategy = 'localStorage' | 'server' | 'userProfile';
export interface StorageAdapter {
    save(key: string, preset: LayoutPreset): Promise<void>;
    load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null>;
    delete(key: string, presetId: string): Promise<void>;
    list(key: string): Promise<LayoutPreset[]>;
}
export interface ServerConfig {
    baseUrl: string;
    headers?: Record<string, string>;
    saveEndpoint?: string;
    loadEndpoint?: string;
    deleteEndpoint?: string;
    listEndpoint?: string;
}
export interface UserProfileConfig {
    userId: string;
    profileKey?: string;
    adapter?: StorageAdapter;
}
export interface PersistenceConfig {
    enabled: boolean;
    storageKey: string;
    strategy?: StorageStrategy;
    autoSave?: boolean;
    autoSaveDelay?: number;
    autoLoad?: boolean;
    serverConfig?: ServerConfig;
    userProfileConfig?: UserProfileConfig;
    customAdapter?: StorageAdapter;
}
export interface RowPinConfig {
    enabled: boolean;
    showPinButton?: boolean;
    maxPinnedTop?: number;
    maxPinnedBottom?: number;
    onPinChange?: (pinnedTop: (string | number)[], pinnedBottom: (string | number)[]) => void;
}
export interface DragRowConfig {
    enabled: boolean;
    showDragHandle?: boolean;
    allowCrossGroup?: boolean;
    allowExternalDrop?: boolean;
    dragHandlePosition?: 'left' | 'right';
    onDragStart?: (row: Row, rowIndex: number) => void;
    onDragEnd?: () => void;
    onRowDrop?: (sourceIndex: number, targetIndex: number, row: Row) => void;
    onRowMove?: (sourceIndex: number, targetIndex: number) => void;
    onExternalDrop?: (data: any, targetIndex: number) => void;
}
export interface DragState {
    isDragging: boolean;
    draggedRowId: string | number | null;
    draggedRowIndex: number | null;
    dropTargetIndex: number | null;
    dropPosition: 'before' | 'after' | null;
}
export interface MarketDataConfig {
    enabled: boolean;
    flashDuration?: number;
    enableFlash?: boolean;
    enableLiveSorting?: boolean;
    enableRankingMovement?: boolean;
    batchInterval?: number;
    maxUpdatesPerFrame?: number;
    cpuThreshold?: number;
    densityMode?: boolean;
}
export interface CellUpdate {
    rowId: string | number;
    field: string;
    oldValue: any;
    newValue: any;
    timestamp: number;
}
export interface FlashAnimation {
    cellKey: string;
    direction: 'up' | 'down';
    startTime: number;
    duration: number;
}
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
    enabled?: boolean;
    showCopy?: boolean;
    showExport?: boolean;
    showColumnOptions?: boolean;
    showFilterByValue?: boolean;
    customItems?: ContextMenuItem[];
    onBeforeShow?: (event: ContextMenuEvent) => ContextMenuItem[] | null;
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
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export interface TooltipContent {
    title?: string;
    content: React.ReactNode;
}
export interface TooltipConfig {
    enabled?: boolean;
    showDelay?: number;
    hideDelay?: number;
    placement?: TooltipPlacement;
    offset?: number;
    maxWidth?: number;
    showCellTooltips?: boolean;
    showRowTooltips?: boolean;
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
export interface DataGridProps {
    columns: Column[];
    rows: Row[];
    pageSize?: number;
    showColumnPinning?: boolean;
    footerConfig?: FooterConfig;
    virtualScrollConfig?: VirtualScrollConfig;
    persistenceConfig?: PersistenceConfig;
    treeConfig?: TreeConfig;
    dragRowConfig?: DragRowConfig;
    rowPinConfig?: RowPinConfig;
    marketDataConfig?: MarketDataConfig;
    contextMenuConfig?: ContextMenuConfig;
    tooltipConfig?: TooltipConfig;
    tableId?: string;
    theme?: ThemeName;
    densityMode?: DensityMode;
    showDensityToggle?: boolean;
    onDensityChange?: (mode: DensityMode) => void;
    onRowClick?: (row: Row) => void;
    onCellEdit?: (rowIndex: number, field: string, value: any) => void;
    onSelectionChange?: (selectedIds: (string | number)[]) => void;
    onLayoutChange?: (layout: LayoutPreset['layout']) => void;
    onRowReorder?: (rows: Row[]) => void;
    onGridReady?: (api: GridApi) => void;
}
