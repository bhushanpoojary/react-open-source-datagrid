import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const TreeRow = ({ node, columns, displayColumnOrder, columnWidths, selectedRows, editState, focusState, rowIndex, dispatch, onRowClick, onCellEdit, pinnedLeft, pinnedRight, treeConfig, editInputRef, }) => {
    const isSelected = selectedRows.has(node.id);
    const isEditing = editState.rowId === node.id;
    const { indentSize = 24, showExpandIcon = true, } = treeConfig;
    // Create a map for quick column lookup
    const columnMap = new Map(columns.map(col => [col.field, col]));
    const pinnedLeftSet = new Set(pinnedLeft);
    const pinnedRightSet = new Set(pinnedRight);
    // Calculate offsets for pinned columns
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
    const getPinnedCellStyle = (field) => {
        const width = `${columnWidths[field] || 150}px`;
        const style = { width };
        if (pinnedLeftSet.has(field)) {
            style.position = 'sticky';
            style.left = `${leftOffsets[field]}px`;
            style.zIndex = 20;
            style.backgroundColor = 'var(--grid-bg)';
        }
        else if (pinnedRightSet.has(field)) {
            style.position = 'sticky';
            style.right = `${rightOffsets[field]}px`;
            style.zIndex = 20;
            style.backgroundColor = 'var(--grid-bg)';
        }
        return style;
    };
    const handleRowClick = (e) => {
        const target = e.target;
        if (target.closest('.tree-toggle-button')) {
            return; // Don't trigger row click when clicking expand/collapse
        }
        if (e.ctrlKey || e.metaKey) {
            dispatch({ type: 'TOGGLE_ROW_SELECTION', payload: { rowId: node.id, isMulti: true } });
        }
        else if (e.shiftKey) {
            // For shift-click, we'd need access to the full row list
            dispatch({ type: 'TOGGLE_ROW_SELECTION', payload: { rowId: node.id, isMulti: false } });
        }
        else {
            dispatch({ type: 'TOGGLE_ROW_SELECTION', payload: { rowId: node.id, isMulti: false } });
        }
        if (onRowClick) {
            onRowClick(node);
        }
    };
    const handleCellDoubleClick = (field) => {
        const column = columnMap.get(field);
        if (column?.editable) {
            dispatch({
                type: 'START_EDIT',
                payload: { rowId: node.id, field, value: node[field] },
            });
        }
    };
    const handleEditChange = (value) => {
        dispatch({
            type: 'START_EDIT',
            payload: { rowId: editState.rowId, field: editState.field, value },
        });
    };
    const handleEditConfirm = () => {
        if (editState.rowId !== null && editState.field !== null) {
            if (onCellEdit) {
                onCellEdit(rowIndex, editState.field, editState.value);
            }
            dispatch({ type: 'END_EDIT' });
        }
    };
    const handleEditCancel = () => {
        dispatch({ type: 'END_EDIT' });
    };
    const handleToggleExpand = (e) => {
        e.stopPropagation();
        dispatch({ type: 'TOGGLE_TREE_NODE', payload: node.nodeId });
        if (treeConfig.onNodeExpand && !node.isExpanded) {
            treeConfig.onNodeExpand(node);
        }
        if (treeConfig.onNodeCollapse && node.isExpanded) {
            treeConfig.onNodeCollapse(node);
        }
    };
    const renderCell = (field, columnIndex) => {
        const column = columnMap.get(field);
        if (!column)
            return null;
        const isFirstColumn = columnIndex === 0;
        const isFocused = focusState?.rowIndex === rowIndex && focusState?.columnIndex === columnIndex;
        const isEditingCell = isEditing && editState.field === field;
        let cellContent;
        if (isEditingCell) {
            cellContent = (_jsx("input", { ref: editInputRef, type: "text", value: editState.value ?? '', onChange: (e) => handleEditChange(e.target.value), onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        handleEditConfirm();
                    if (e.key === 'Escape')
                        handleEditCancel();
                }, onBlur: handleEditConfirm, style: {
                    width: '100%',
                    padding: '6px 8px',
                    border: '1.5px solid #3b82f6',
                    borderRadius: '4px',
                    outline: 'none',
                    fontSize: '13px',
                    backgroundColor: 'var(--grid-bg, #ffffff)',
                    color: 'var(--grid-text, #1f2937)',
                }, autoFocus: true }));
        }
        else if (column.renderCell) {
            cellContent = column.renderCell(node);
        }
        else {
            const value = node[field];
            cellContent = value !== null && value !== undefined ? String(value) : '';
        }
        // Add tree controls to the first column
        const indentation = node.level * indentSize;
        return (_jsxs("div", { style: {
                ...getPinnedCellStyle(field),
                padding: '10px 12px',
                paddingLeft: isFirstColumn ? `${indentation + 8}px` : '12px',
                borderRight: '1px solid var(--grid-border, #e5e7eb)',
                display: 'flex',
                alignItems: 'center',
                outline: isFocused ? '2px solid var(--grid-primary, #3b82f6)' : 'none',
                outlineOffset: '-2px',
                fontSize: 'var(--grid-font-size, 13px)',
                color: 'var(--grid-text, #1f2937)',
            }, onDoubleClick: () => handleCellDoubleClick(field), children: [isFirstColumn && showExpandIcon && (_jsx("div", { className: "tree-toggle-button", style: {
                        flexShrink: 0,
                        marginRight: '8px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }, children: node.hasChildren ? (_jsx("button", { onClick: handleToggleExpand, style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            color: 'var(--grid-primary, #3b82f6)',
                            transition: 'all 0.2s ease',
                            padding: 0,
                        }, onMouseEnter: (e) => {
                            e.currentTarget.style.backgroundColor = 'var(--grid-hover, rgba(59, 130, 246, 0.1))';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }, onMouseLeave: (e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                        }, "aria-label": node.isExpanded ? 'Collapse' : 'Expand', children: _jsx("svg", { style: {
                                width: '16px',
                                height: '16px',
                                transform: node.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                            }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }) }) })) : (_jsx("div", { style: {
                            width: '20px',
                            height: '20px',
                            position: 'relative',
                        }, children: _jsx("div", { style: {
                                position: 'absolute',
                                left: '9px',
                                top: '0',
                                width: '2px',
                                height: '10px',
                                backgroundColor: 'var(--grid-border, #e5e7eb)',
                            } }) })) })), _jsx("div", { style: {
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: node.level === 0 ? 600 : 400,
                    }, children: cellContent })] }, field));
    };
    return (_jsx("div", { "data-row-index": rowIndex, style: {
            display: 'flex',
            minWidth: '100%',
            borderBottom: '1px solid var(--grid-border, #e5e7eb)',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            backgroundColor: isSelected
                ? 'var(--grid-selected, rgba(59, 130, 246, 0.08))'
                : 'var(--grid-bg, #ffffff)',
        }, onClick: handleRowClick, onMouseEnter: (e) => {
            if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'var(--grid-hover, #f9fafb)';
            }
        }, onMouseLeave: (e) => {
            if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'var(--grid-bg, #ffffff)';
            }
        }, children: displayColumnOrder.map((field, idx) => renderCell(field, idx)) }));
};
