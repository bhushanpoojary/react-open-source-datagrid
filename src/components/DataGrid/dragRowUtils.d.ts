import type { Row, TreeNode, GroupedRow } from './types';
/**
 * Row Dragging / Reorder Utilities
 *
 * Utilities for implementing drag-and-drop row reordering functionality.
 */
export interface DragRowConfig {
    enabled: boolean;
    showDragHandle?: boolean;
    allowCrossGroup?: boolean;
    allowExternalDrop?: boolean;
    onRowDrop?: (sourceIndex: number, targetIndex: number, row: Row) => void;
    onRowMove?: (sourceIndex: number, targetIndex: number) => void;
    onExternalDrop?: (data: any, targetIndex: number) => void;
    dragHandlePosition?: 'left' | 'right';
}
export interface DragState {
    isDragging: boolean;
    draggedRowId: string | number | null;
    draggedRowIndex: number | null;
    dropTargetIndex: number | null;
    dropPosition: 'before' | 'after' | null;
}
export declare const initialDragState: DragState;
/**
 * Reorder rows array based on drag-and-drop indices
 */
export declare const reorderRows: <T extends Row>(rows: T[], sourceIndex: number, targetIndex: number) => T[];
/**
 * Get the drop position (before/after) based on mouse position within the row
 */
export declare const getDropPosition: (event: React.DragEvent, rowElement: HTMLElement) => "before" | "after";
/**
 * Calculate the target index based on drop position
 */
export declare const calculateTargetIndex: (dropTargetIndex: number, dropPosition: "before" | "after" | null, sourceIndex: number) => number;
/**
 * Check if a row can be dropped at the target location
 */
export declare const canDropRow: (sourceIndex: number, targetIndex: number, _sourceRow: Row | TreeNode | GroupedRow, _targetRow: Row | TreeNode | GroupedRow, config: DragRowConfig) => boolean;
/**
 * Create drag data transfer object
 */
export declare const createDragData: (row: Row, rowIndex: number, tableId?: string) => string;
/**
 * Parse drag data transfer object
 */
export declare const parseDragData: (dataTransfer: string) => {
    row: Row;
    rowIndex: number;
    tableId?: string;
    timestamp: number;
} | null;
/**
 * Check if drag data is from the same table
 */
export declare const isSameTable: (dragData: ReturnType<typeof parseDragData>, currentTableId?: string) => boolean;
/**
 * Get visual drop indicator styles
 */
export declare const getDropIndicatorStyle: (isOver: boolean, position: "before" | "after" | null) => React.CSSProperties;
/**
 * Handle drag start event
 */
export declare const handleDragStart: (event: React.DragEvent, row: Row, rowIndex: number, tableId?: string) => void;
/**
 * Handle drag end event
 */
export declare const handleDragEnd: (event: React.DragEvent) => void;
/**
 * Handle drag over event (required for drop to work)
 */
export declare const handleDragOver: (event: React.DragEvent) => void;
/**
 * Validate drop operation
 */
export declare const validateDrop: (event: React.DragEvent, config: DragRowConfig, tableId?: string) => boolean;
/**
 * Get draggable row props
 */
export declare const getDraggableRowProps: (row: Row, rowIndex: number, isDragging: boolean, config: DragRowConfig, tableId?: string) => {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (event: React.DragEvent) => void;
    style: {
        cursor: string;
        opacity: number;
        transition: string;
    };
};
/**
 * Get drop target props
 */
export declare const getDropTargetProps: (rowIndex: number, onDragOver: (e: React.DragEvent, index: number) => void, onDragLeave: () => void, onDrop: (e: React.DragEvent, index: number) => void) => {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
};
