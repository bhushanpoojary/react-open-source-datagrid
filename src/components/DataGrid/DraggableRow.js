import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
import { getDropPosition, createDragData, parseDragData, reorderRows } from './dragRowUtils';
export const DraggableRow = ({ row, rowIndex, config, sourceTableId, onRowReorder, rows, style, children, }) => {
    const [dropPosition, setDropPosition] = useState(null);
    const [isOver, setIsOver] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const rowRef = useRef(null);
    const handleDragStart = (e) => {
        const dragData = createDragData(row, rowIndex, sourceTableId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', dragData);
        e.dataTransfer.setData('text/plain', JSON.stringify(row));
        setIsDragging(true);
        if (config.onDragStart) {
            config.onDragStart(row, rowIndex);
        }
        // Create drag image
        if (rowRef.current) {
            const clone = rowRef.current.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.top = '-9999px';
            clone.style.opacity = '0.8';
            clone.style.width = `${rowRef.current.offsetWidth}px`;
            document.body.appendChild(clone);
            e.dataTransfer.setDragImage(clone, 0, 0);
            setTimeout(() => document.body.removeChild(clone), 0);
        }
    };
    const handleDragEnd = () => {
        setIsDragging(false);
        setIsOver(false);
        setDropPosition(null);
        if (config.onDragEnd) {
            config.onDragEnd();
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!rowRef.current)
            return;
        const position = getDropPosition(e, rowRef.current);
        setDropPosition(position);
        setIsOver(true);
        e.dataTransfer.dropEffect = 'move';
    };
    const handleDragLeave = (e) => {
        // Only clear if we're actually leaving the row (not entering a child)
        if (e.currentTarget === e.target) {
            setIsOver(false);
            setDropPosition(null);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = e.dataTransfer.getData('application/json');
        const dragData = parseDragData(data);
        if (!dragData) {
            // External drop
            if (config.allowExternalDrop && config.onExternalDrop) {
                const externalData = e.dataTransfer.getData('text/plain');
                config.onExternalDrop(externalData, rowIndex);
            }
        }
        else {
            // Internal drop - calculate target index
            const sourceIndex = dragData.rowIndex;
            let targetIndex = rowIndex;
            if (dropPosition === 'after') {
                targetIndex += 1;
            }
            // Adjust if moving down in the same list
            if (sourceIndex < targetIndex && dragData.tableId === sourceTableId) {
                targetIndex -= 1;
            }
            // Trigger callbacks
            if (config.onRowDrop) {
                config.onRowDrop(sourceIndex, targetIndex, dragData.row);
            }
            if (config.onRowMove) {
                config.onRowMove(sourceIndex, targetIndex);
            }
            // Reorder rows if callback provided
            if (onRowReorder && dragData.tableId === sourceTableId) {
                const reorderedRows = reorderRows(rows, sourceIndex, targetIndex);
                onRowReorder(reorderedRows);
            }
        }
        setIsOver(false);
        setDropPosition(null);
    };
    const getDropIndicatorStyle = () => {
        if (!isOver || !dropPosition)
            return {};
        const borderStyle = '2px solid var(--grid-primary, #3b82f6)';
        return dropPosition === 'before'
            ? { borderTop: borderStyle }
            : { borderBottom: borderStyle };
    };
    const wrapperStyle = {
        ...style,
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s ease',
        ...getDropIndicatorStyle(),
    };
    return (_jsx("div", { ref: rowRef, style: wrapperStyle, draggable: config.enabled, onDragStart: handleDragStart, onDragEnd: handleDragEnd, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, children: children }));
};
export default DraggableRow;
