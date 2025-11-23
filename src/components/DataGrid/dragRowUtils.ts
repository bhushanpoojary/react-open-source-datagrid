import type { Row, TreeNode, GroupedRow } from './types';

/**
 * Row Dragging / Reorder Utilities
 * 
 * Utilities for implementing drag-and-drop row reordering functionality.
 */

export interface DragRowConfig {
  enabled: boolean;
  showDragHandle?: boolean; // Show explicit drag handle (default: true)
  allowCrossGroup?: boolean; // Allow dragging across groups (default: false)
  allowExternalDrop?: boolean; // Allow dropping from external sources (default: false)
  onRowDrop?: (sourceIndex: number, targetIndex: number, row: Row) => void;
  onRowMove?: (sourceIndex: number, targetIndex: number) => void;
  onExternalDrop?: (data: any, targetIndex: number) => void;
  dragHandlePosition?: 'left' | 'right'; // Position of drag handle (default: 'left')
}

export interface DragState {
  isDragging: boolean;
  draggedRowId: string | number | null;
  draggedRowIndex: number | null;
  dropTargetIndex: number | null;
  dropPosition: 'before' | 'after' | null;
}

export const initialDragState: DragState = {
  isDragging: false,
  draggedRowId: null,
  draggedRowIndex: null,
  dropTargetIndex: null,
  dropPosition: null,
};

/**
 * Reorder rows array based on drag-and-drop indices
 */
export const reorderRows = <T extends Row>(
  rows: T[],
  sourceIndex: number,
  targetIndex: number
): T[] => {
  if (sourceIndex === targetIndex) {
    return rows;
  }

  const result = [...rows];
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(targetIndex, 0, removed);
  
  return result;
};

/**
 * Get the drop position (before/after) based on mouse position within the row
 */
export const getDropPosition = (
  event: React.DragEvent,
  rowElement: HTMLElement
): 'before' | 'after' => {
  const rect = rowElement.getBoundingClientRect();
  const midpoint = rect.top + rect.height / 2;
  return event.clientY < midpoint ? 'before' : 'after';
};

/**
 * Calculate the target index based on drop position
 */
export const calculateTargetIndex = (
  dropTargetIndex: number,
  dropPosition: 'before' | 'after' | null,
  sourceIndex: number
): number => {
  if (dropPosition === null) {
    return dropTargetIndex;
  }

  let targetIndex = dropPosition === 'before' ? dropTargetIndex : dropTargetIndex + 1;
  
  // Adjust for moving within the same list
  if (sourceIndex < targetIndex) {
    targetIndex -= 1;
  }
  
  return targetIndex;
};

/**
 * Check if a row can be dropped at the target location
 */
export const canDropRow = (
  sourceIndex: number,
  targetIndex: number,
  _sourceRow: Row | TreeNode | GroupedRow,
  _targetRow: Row | TreeNode | GroupedRow,
  config: DragRowConfig
): boolean => {
  // Can't drop on itself
  if (sourceIndex === targetIndex) {
    return false;
  }

  // Check if cross-group movement is allowed
  if (!config.allowCrossGroup) {
    // Both rows should be in the same group
    // This would need to be implemented based on your grouping logic
    // For now, we allow all movements if cross-group is enabled
  }

  return true;
};

/**
 * Create drag data transfer object
 */
export const createDragData = (
  row: Row,
  rowIndex: number,
  tableId?: string
): string => {
  return JSON.stringify({
    row,
    rowIndex,
    tableId,
    timestamp: Date.now(),
  });
};

/**
 * Parse drag data transfer object
 */
export const parseDragData = (dataTransfer: string): {
  row: Row;
  rowIndex: number;
  tableId?: string;
  timestamp: number;
} | null => {
  try {
    return JSON.parse(dataTransfer);
  } catch {
    return null;
  }
};

/**
 * Check if drag data is from the same table
 */
export const isSameTable = (
  dragData: ReturnType<typeof parseDragData>,
  currentTableId?: string
): boolean => {
  if (!dragData || !currentTableId) {
    return true; // Assume same table if no ID provided
  }
  return dragData.tableId === currentTableId;
};

/**
 * Get visual drop indicator styles
 */
export const getDropIndicatorStyle = (
  isOver: boolean,
  position: 'before' | 'after' | null
): React.CSSProperties => {
  if (!isOver || !position) {
    return {};
  }

  const borderWidth = '2px';
  const borderColor = '#3b82f6';
  const style: React.CSSProperties = {};

  if (position === 'before') {
    style.borderTop = `${borderWidth} solid ${borderColor}`;
  } else {
    style.borderBottom = `${borderWidth} solid ${borderColor}`;
  }

  return style;
};

/**
 * Handle drag start event
 */
export const handleDragStart = (
  event: React.DragEvent,
  row: Row,
  rowIndex: number,
  tableId?: string
): void => {
  const dragData = createDragData(row, rowIndex, tableId);
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('application/json', dragData);
  event.dataTransfer.setData('text/plain', JSON.stringify(row));
  
  // Add visual feedback
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.style.opacity = '0.5';
  }
};

/**
 * Handle drag end event
 */
export const handleDragEnd = (event: React.DragEvent): void => {
  // Reset visual feedback
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.style.opacity = '1';
  }
};

/**
 * Handle drag over event (required for drop to work)
 */
export const handleDragOver = (event: React.DragEvent): void => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

/**
 * Validate drop operation
 */
export const validateDrop = (
  event: React.DragEvent,
  config: DragRowConfig,
  tableId?: string
): boolean => {
  const data = event.dataTransfer.getData('application/json');
  const dragData = parseDragData(data);

  if (!dragData) {
    // External data - check if external drops are allowed
    return config.allowExternalDrop ?? false;
  }

  // Check if it's from the same table
  if (!isSameTable(dragData, tableId) && !config.allowExternalDrop) {
    return false;
  }

  return true;
};

/**
 * Get draggable row props
 */
export const getDraggableRowProps = (
  row: Row,
  rowIndex: number,
  isDragging: boolean,
  config: DragRowConfig,
  tableId?: string
) => ({
  draggable: config.enabled,
  onDragStart: (e: React.DragEvent) => handleDragStart(e, row, rowIndex, tableId),
  onDragEnd: handleDragEnd,
  style: {
    cursor: config.enabled ? 'move' : 'default',
    opacity: isDragging ? 0.5 : 1,
    transition: 'opacity 0.2s ease',
  },
});

/**
 * Get drop target props
 */
export const getDropTargetProps = (
  rowIndex: number,
  onDragOver: (e: React.DragEvent, index: number) => void,
  onDragLeave: () => void,
  onDrop: (e: React.DragEvent, index: number) => void
) => ({
  onDragOver: (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e, rowIndex);
  },
  onDragLeave: onDragLeave,
  onDrop: (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, rowIndex);
  },
});
