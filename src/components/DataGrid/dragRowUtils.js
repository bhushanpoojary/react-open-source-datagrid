export const initialDragState = {
    isDragging: false,
    draggedRowId: null,
    draggedRowIndex: null,
    dropTargetIndex: null,
    dropPosition: null,
};
/**
 * Reorder rows array based on drag-and-drop indices
 */
export const reorderRows = (rows, sourceIndex, targetIndex) => {
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
export const getDropPosition = (event, rowElement) => {
    const rect = rowElement.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    return event.clientY < midpoint ? 'before' : 'after';
};
/**
 * Calculate the target index based on drop position
 */
export const calculateTargetIndex = (dropTargetIndex, dropPosition, sourceIndex) => {
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
export const canDropRow = (sourceIndex, targetIndex, _sourceRow, _targetRow, config) => {
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
export const createDragData = (row, rowIndex, tableId) => {
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
export const parseDragData = (dataTransfer) => {
    try {
        return JSON.parse(dataTransfer);
    }
    catch {
        return null;
    }
};
/**
 * Check if drag data is from the same table
 */
export const isSameTable = (dragData, currentTableId) => {
    if (!dragData || !currentTableId) {
        return true; // Assume same table if no ID provided
    }
    return dragData.tableId === currentTableId;
};
/**
 * Get visual drop indicator styles
 */
export const getDropIndicatorStyle = (isOver, position) => {
    if (!isOver || !position) {
        return {};
    }
    const borderWidth = '2px';
    const borderColor = '#3b82f6';
    const style = {};
    if (position === 'before') {
        style.borderTop = `${borderWidth} solid ${borderColor}`;
    }
    else {
        style.borderBottom = `${borderWidth} solid ${borderColor}`;
    }
    return style;
};
/**
 * Handle drag start event
 */
export const handleDragStart = (event, row, rowIndex, tableId) => {
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
export const handleDragEnd = (event) => {
    // Reset visual feedback
    if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.style.opacity = '1';
    }
};
/**
 * Handle drag over event (required for drop to work)
 */
export const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};
/**
 * Validate drop operation
 */
export const validateDrop = (event, config, tableId) => {
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
export const getDraggableRowProps = (row, rowIndex, isDragging, config, tableId) => ({
    draggable: config.enabled,
    onDragStart: (e) => handleDragStart(e, row, rowIndex, tableId),
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
export const getDropTargetProps = (rowIndex, onDragOver, onDragLeave, onDrop) => ({
    onDragOver: (e) => {
        e.preventDefault();
        onDragOver(e, rowIndex);
    },
    onDragLeave: onDragLeave,
    onDrop: (e) => {
        e.preventDefault();
        onDrop(e, rowIndex);
    },
});
