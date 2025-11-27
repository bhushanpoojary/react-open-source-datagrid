import React from 'react';
import type { Column, Row, GridAction, EditState, FocusState, GroupedRow, AggregateConfig, VirtualScrollConfig, TreeNode, TreeConfig, DragRowConfig } from './types';
interface GridBodyProps {
    columns: Column[];
    rows: (Row | GroupedRow | TreeNode)[];
    pinnedRowsTop?: (Row | GroupedRow | TreeNode)[];
    pinnedRowsBottom?: (Row | GroupedRow | TreeNode)[];
    columnOrder: string[];
    displayColumnOrder: string[];
    columnWidths: {
        [field: string]: number;
    };
    selectedRows: Set<string | number>;
    editState: EditState;
    focusState: FocusState | null;
    dispatch: React.Dispatch<GridAction>;
    onRowClick?: (row: Row) => void;
    onCellEdit?: (rowIndex: number, field: string, value: any) => void;
    pinnedLeft: string[];
    pinnedRight: string[];
    showGroupFooters?: boolean;
    groupAggregates?: Map<string, {
        [key: string]: number | null;
    }>;
    aggregateConfigs?: AggregateConfig[];
    virtualScrollConfig?: VirtualScrollConfig;
    treeConfig?: TreeConfig;
    dragRowConfig?: DragRowConfig;
    tableId?: string;
    onRowReorder?: (rows: Row[]) => void;
    onScroll?: (scrollTop: number, scrollLeft: number) => void;
    currentPage?: number;
    pageSize?: number;
    totalRows?: number;
    onContextMenu?: (event: React.MouseEvent, row: Row, column: Column, rowIndex: number, columnIndex: number) => void;
    onCellMouseEnter?: (event: React.MouseEvent, row: Row, column: Column, value: any) => void;
    onCellMouseLeave?: () => void;
    onRowMouseEnter?: (event: React.MouseEvent, row: Row, rowIndex: number) => void;
    onRowMouseLeave?: () => void;
}
export declare const GridBody: React.FC<GridBodyProps>;
export {};
