import type { ContextMenuState, ContextMenuConfig, ContextMenuEvent, Column, Row, FilterValue } from './types';
interface UseContextMenuProps {
    config?: ContextMenuConfig;
    columns: Column[];
    rows: Row[];
    selectedRows: Set<string | number>;
    onPinColumn?: (field: string, side: 'left' | 'right') => void;
    onUnpinColumn?: (field: string) => void;
    onToggleColumnVisibility?: (field: string) => void;
    onResizeColumn?: (field: string, width: number) => void;
    onAutoSizeAllColumns?: (widths: {
        [field: string]: number;
    }) => void;
    onSetFilter?: (field: string, value: FilterValue | null) => void;
    onPinRowTop?: (rowId: string | number) => void;
    onPinRowBottom?: (rowId: string | number) => void;
    onUnpinRow?: (rowId: string | number) => void;
    pinnedColumnsLeft?: string[];
    pinnedColumnsRight?: string[];
    pinnedRowsTop?: (string | number)[];
    pinnedRowsBottom?: (string | number)[];
}
/**
 * Hook to manage context menu state and actions
 */
export declare const useContextMenu: ({ config, columns, rows, selectedRows, onPinColumn, onUnpinColumn, onToggleColumnVisibility, onResizeColumn, onAutoSizeAllColumns, onSetFilter, onPinRowTop, onPinRowBottom, onUnpinRow, pinnedColumnsLeft, pinnedColumnsRight, pinnedRowsTop, pinnedRowsBottom, }: UseContextMenuProps) => {
    contextMenu: ContextMenuState;
    handleContextMenu: (event: ContextMenuEvent) => void;
    closeContextMenu: () => void;
};
export {};
