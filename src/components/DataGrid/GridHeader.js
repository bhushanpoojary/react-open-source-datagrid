import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from 'react';
export const GridHeader = ({ columns, columnOrder, displayColumnOrder, columnWidths, sortConfig, dispatch, pinnedLeft, pinnedRight, showColumnPinning, onContextMenu, }) => {
    const [draggedColumn, setDraggedColumn] = useState(null);
    const [resizingColumn, setResizingColumn] = useState(null);
    const [resizeStartX, setResizeStartX] = useState(0);
    const [resizeStartWidth, setResizeStartWidth] = useState(0);
    const headerRef = useRef(null);
    // Create a map for quick column lookup
    const columnMap = new Map(columns.map(col => [col.field, col]));
    const pinnedLeftSet = new Set(pinnedLeft);
    const pinnedRightSet = new Set(pinnedRight);
    const leftOffsets = {};
    let leftAccumulator = 0;
    pinnedLeft.forEach((field) => {
        leftOffsets[field] = leftAccumulator;
        leftAccumulator += columnWidths[field] || 150;
    });
    const rightOffsets = {};
    let rightAccumulator = 0;
    [...pinnedRight].reverse().forEach((field) => {
        rightOffsets[field] = rightAccumulator;
        rightAccumulator += columnWidths[field] || 150;
    });
    const pinColumn = (field, side) => {
        dispatch({ type: 'PIN_COLUMN', payload: { field, side } });
    };
    const unpinColumn = (field) => {
        dispatch({ type: 'UNPIN_COLUMN', payload: field });
    };
    const getStickyHeaderStyle = (field) => {
        const width = `${columnWidths[field] || 150}px`;
        const style = { width };
        if (pinnedLeftSet.has(field)) {
            style.position = 'sticky';
            style.left = `${leftOffsets[field]}px`;
            style.zIndex = 30;
            style.backgroundColor = 'var(--grid-header-bg)';
        }
        else if (pinnedRightSet.has(field)) {
            style.position = 'sticky';
            style.right = `${rightOffsets[field]}px`;
            style.zIndex = 30;
            style.backgroundColor = 'var(--grid-header-bg)';
        }
        return style;
    };
    // Handle column sorting
    const handleSort = (field) => {
        const column = columnMap.get(field);
        if (!column || column.sortable === false)
            return;
        let direction = 'asc';
        if (sortConfig.field === field) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            }
            else if (sortConfig.direction === 'desc') {
                direction = null;
            }
        }
        dispatch({
            type: 'SET_SORT',
            payload: { field: direction ? field : '', direction },
        });
    };
    // Drag and drop handlers for column reordering and grouping
    const handleDragStart = (e, field) => {
        setDraggedColumn(field);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', field);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    const handleDrop = (e, targetField) => {
        e.preventDefault();
        if (!draggedColumn || draggedColumn === targetField) {
            setDraggedColumn(null);
            return;
        }
        const fromIndex = columnOrder.indexOf(draggedColumn);
        const toIndex = columnOrder.indexOf(targetField);
        dispatch({
            type: 'REORDER_COLUMNS',
            payload: { fromIndex, toIndex },
        });
        setDraggedColumn(null);
    };
    // Column resizing handlers
    const handleResizeStart = (e, field) => {
        e.preventDefault();
        e.stopPropagation();
        setResizingColumn(field);
        setResizeStartX(e.clientX);
        setResizeStartWidth(columnWidths[field]);
    };
    useEffect(() => {
        if (!resizingColumn)
            return;
        const handleMouseMove = (e) => {
            const diff = e.clientX - resizeStartX;
            const newWidth = Math.max(50, resizeStartWidth + diff); // Minimum width of 50px
            dispatch({
                type: 'RESIZE_COLUMN',
                payload: { field: resizingColumn, width: newWidth },
            });
        };
        const handleMouseUp = () => {
            setResizingColumn(null);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingColumn, resizeStartX, resizeStartWidth, dispatch]);
    return (_jsx("div", { ref: headerRef, style: { borderBottom: 'var(--grid-border-width, 1px) solid var(--grid-border)', width: '100%', backgroundColor: 'var(--grid-header-bg)' }, children: _jsx("div", { role: "row", style: { display: 'flex', minWidth: '100%', backgroundColor: 'var(--grid-header-bg)' }, children: displayColumnOrder.map((field, colIndex) => {
                const column = columnMap.get(field);
                if (!column)
                    return null;
                const isSorted = sortConfig.field === field;
                const sortDirection = isSorted ? sortConfig.direction : null;
                const isPinnedLeft = pinnedLeft.includes(field);
                const isPinnedRight = pinnedRight.includes(field);
                const showPinControls = showColumnPinning && column.pinnable !== false;
                const headerStyle = getStickyHeaderStyle(field);
                return (_jsxs("div", { role: "columnheader", "aria-colindex": colIndex + 1, "aria-sort": sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none', "aria-label": `${column.headerName} column${sortDirection ? `, sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}` : ''}`, style: {
                        ...headerStyle,
                        position: 'relative',
                        borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                        flexShrink: 0,
                        opacity: draggedColumn === field ? 0.5 : 1,
                    }, draggable: true, onDragStart: (e) => handleDragStart(e, field), onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, field), children: [_jsxs("div", { style: {
                                padding: 'var(--grid-header-padding, 10px 12px)',
                                fontWeight: 'var(--grid-header-font-weight, 600)',
                                fontSize: 'var(--grid-font-size, 13px)',
                                color: 'var(--grid-header-text)',
                                cursor: 'pointer',
                                userSelect: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '36px',
                                backgroundColor: 'var(--grid-header-bg)',
                            }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-header-bg)', onClick: () => handleSort(field), onContextMenu: (e) => onContextMenu?.(e, column, colIndex), children: [_jsx("span", { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: column.headerName }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '4px' }, children: [column.sortable !== false && (_jsxs("span", { style: { fontSize: '12px', color: sortDirection ? 'var(--grid-primary)' : 'var(--grid-text-secondary)' }, children: [sortDirection === 'asc' && '↑', sortDirection === 'desc' && '↓', !sortDirection && '⇅'] })), showPinControls && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '4px' }, children: [_jsx("button", { type: "button", style: {
                                                        width: '22px',
                                                        height: '22px',
                                                        borderRadius: '3px',
                                                        border: isPinnedLeft ? '1.5px solid var(--grid-primary)' : '1px solid var(--grid-border)',
                                                        fontSize: '10px',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: isPinnedLeft ? 'var(--grid-primary)' : 'transparent',
                                                        color: isPinnedLeft ? 'var(--grid-text-inverse)' : 'var(--grid-text-secondary)',
                                                        cursor: 'pointer',
                                                        transitionProperty: 'colors',
                                                    }, onMouseEnter: (e) => !isPinnedLeft && (e.currentTarget.style.backgroundColor = 'var(--grid-hover)'), onMouseLeave: (e) => !isPinnedLeft && (e.currentTarget.style.backgroundColor = 'transparent'), onClick: (e) => {
                                                        e.stopPropagation();
                                                        pinColumn(field, 'left');
                                                    }, "aria-label": `Pin ${column.headerName} to left`, children: "\u21E4" }), _jsx("button", { type: "button", style: {
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '4px',
                                                        border: isPinnedRight ? '1.5px solid var(--grid-primary)' : '1px solid var(--grid-border)',
                                                        fontSize: '10px',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: isPinnedRight ? 'var(--grid-primary)' : 'transparent',
                                                        color: isPinnedRight ? 'var(--grid-text-inverse)' : 'var(--grid-text-secondary)',
                                                        cursor: 'pointer',
                                                        transitionProperty: 'colors',
                                                    }, onMouseEnter: (e) => !isPinnedRight && (e.currentTarget.style.backgroundColor = 'var(--grid-hover)'), onMouseLeave: (e) => !isPinnedRight && (e.currentTarget.style.backgroundColor = 'transparent'), onClick: (e) => {
                                                        e.stopPropagation();
                                                        pinColumn(field, 'right');
                                                    }, "aria-label": `Pin ${column.headerName} to right`, children: "\u21E5" }), (isPinnedLeft || isPinnedRight) && (_jsx("button", { type: "button", style: {
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '9999px',
                                                        border: '1px solid var(--grid-border)',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        backgroundColor: 'transparent',
                                                        color: 'var(--grid-text-secondary)',
                                                    }, onMouseEnter: (e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--grid-hover)';
                                                        e.currentTarget.style.borderColor = 'var(--grid-primary)';
                                                    }, onMouseLeave: (e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                        e.currentTarget.style.borderColor = 'var(--grid-border)';
                                                    }, onClick: (e) => {
                                                        e.stopPropagation();
                                                        unpinColumn(field);
                                                    }, "aria-label": `Unpin ${column.headerName}`, children: "\u00D7" }))] }))] })] }), _jsx("div", { style: {
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '4px',
                                height: '100%',
                                cursor: 'col-resize',
                                zIndex: 10,
                            }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#0066cc', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent', onMouseDown: (e) => handleResizeStart(e, field) })] }, field));
            }) }) }));
};
