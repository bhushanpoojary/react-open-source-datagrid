import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { formatAggregateValue, getAggregateLabel } from './aggregationUtils';
export const GridFooter = ({ columns, displayColumnOrder, columnWidths, aggregates, aggregateConfigs, pinnedLeft, pinnedRight, label = 'Total', }) => {
    // Create a map for quick column lookup
    const columnMap = new Map(columns.map(col => [col.field, col]));
    // Create a map of field -> aggregate configs
    const fieldAggregateMap = new Map();
    aggregateConfigs.forEach(config => {
        if (!fieldAggregateMap.has(config.field)) {
            fieldAggregateMap.set(config.field, []);
        }
        fieldAggregateMap.get(config.field).push(config);
    });
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
    const getPinnedCellStyle = (field) => {
        const width = `${columnWidths[field] || 150}px`;
        const style = { width };
        if (pinnedLeftSet.has(field)) {
            style.position = 'sticky';
            style.left = `${leftOffsets[field]}px`;
            style.zIndex = 20;
            style.backgroundColor = 'var(--grid-footer-bg)';
        }
        else if (pinnedRightSet.has(field)) {
            style.position = 'sticky';
            style.right = `${rightOffsets[field]}px`;
            style.zIndex = 20;
            style.backgroundColor = 'var(--grid-footer-bg)';
        }
        return style;
    };
    const isFirstColumn = (field) => {
        return displayColumnOrder[0] === field;
    };
    return (_jsx("div", { style: { display: 'flex', minWidth: '100%', borderTop: '2px solid var(--grid-border)', backgroundColor: 'var(--grid-footer-bg)', fontWeight: 'var(--grid-header-font-weight, 600)' }, children: displayColumnOrder.map((field, columnIndex) => {
            const column = columnMap.get(field);
            if (!column)
                return null;
            const cellStyle = getPinnedCellStyle(field);
            const configs = fieldAggregateMap.get(field);
            // For the first column, show the label
            let cellContent;
            if (isFirstColumn(field) && columnIndex === 0) {
                cellContent = _jsx("span", { style: { color: 'var(--grid-text)', fontWeight: 'var(--grid-header-font-weight, 600)' }, children: label });
            }
            else if (configs && configs.length > 0) {
                // Show aggregates for this field
                cellContent = (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '3px' }, children: configs.map((config, idx) => {
                        const key = `${config.field}_${config.function}`;
                        const value = aggregates[key];
                        const formattedValue = formatAggregateValue(value, config.function);
                        const displayLabel = config.label || getAggregateLabel(config.function);
                        return (_jsxs("div", { style: { fontSize: '12px' }, children: [configs.length > 1 && (_jsxs("span", { style: { color: 'var(--grid-text-secondary)', marginRight: '4px', fontWeight: '500' }, children: [displayLabel, ":"] })), _jsx("span", { style: { color: 'var(--grid-text)', fontWeight: 'var(--grid-header-font-weight, 600)' }, children: formattedValue })] }, idx));
                    }) }));
            }
            else {
                cellContent = null;
            }
            return (_jsx("div", { style: {
                    ...cellStyle,
                    padding: 'var(--grid-cell-padding, 10px 12px)',
                    fontSize: 'var(--grid-font-size, 13px)',
                    borderRight: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                    flexShrink: 0,
                    backgroundColor: 'var(--grid-footer-bg)',
                }, children: cellContent }, `footer-${field}`));
        }) }));
};
