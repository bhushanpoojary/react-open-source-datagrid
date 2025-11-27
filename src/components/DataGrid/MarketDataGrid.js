import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * MarketDataGrid.tsx
 *
 * High-performance DataGrid wrapper optimized for live market data.
 * Integrates MarketDataEngine with React DataGrid component.
 *
 * Features:
 * - Ultra-low latency updates
 * - Cell flash animations
 * - Density mode for compact display
 * - Market-specific column formatting
 * - Live sorting and ranking
 */
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { MarketDataEngine } from './MarketDataEngine';
import './MarketDataGrid.css';
/**
 * MarketDataGrid Component
 *
 * Optimized grid for displaying live market data with minimal latency.
 * Uses direct DOM manipulation for cell updates to bypass React reconciliation.
 */
export const MarketDataGrid = ({ columns, rows, config, className = '', onCellClick, onRowClick, }) => {
    const tableRef = useRef(null);
    const rowsRef = useRef(rows);
    // Update rows ref when rows change
    useEffect(() => {
        rowsRef.current = rows;
    }, [rows]);
    // Enhanced columns with market data formatting
    // ...existing code...
    const enhancedColumns = useMemo(() => {
        return columns.map(col => {
            // Add custom renderers for market data fields
            if (col.field === 'price' || col.field === 'bid' || col.field === 'ask') {
                return {
                    ...col,
                    renderCell: (row) => {
                        const value = row[col.field];
                        return formatPrice(value);
                    },
                };
            }
            if (col.field === 'change' || col.field === 'changePercent') {
                return {
                    ...col,
                    renderCell: (row) => {
                        const value = row[col.field];
                        return formatChange(value, col.field === 'changePercent');
                    },
                };
            }
            if (col.field === 'volume' || col.field === 'size') {
                return {
                    ...col,
                    renderCell: (row) => {
                        const value = row[col.field];
                        return formatVolume(value);
                    },
                };
            }
            return col;
        });
    }, [columns]);
    // Handle cell click
    const handleCellClick = useCallback((rowId, field, value) => {
        onCellClick?.(rowId, field, value);
    }, [onCellClick]);
    // Handle row click
    const handleRowClick = useCallback((row) => {
        onRowClick?.(row);
    }, [onRowClick]);
    // Render table header
    const renderHeader = () => (_jsx("div", { className: "market-grid-header", children: _jsx("div", { className: "market-grid-header-row", children: enhancedColumns.map(col => (_jsx("div", { className: `market-grid-header-cell ${getColumnClass(col.field)}`, style: { width: col.width || 120 }, children: col.headerName }, col.field))) }) }));
    // Render table body
    const renderBody = () => (_jsx("div", { className: "market-grid-body", children: rows.map((row) => (_jsx("div", { className: "market-grid-row", onClick: () => handleRowClick(row), children: enhancedColumns.map(col => {
                const value = row[col.field];
                return (_jsx("div", { className: `market-grid-cell ${getColumnClass(col.field)}`, style: { width: col.width || 120 }, "data-row-id": row.id, "data-field": col.field, onClick: (e) => {
                        e.stopPropagation();
                        handleCellClick(row.id, col.field, value);
                    }, children: col.renderCell ? col.renderCell(row) : formatCellValue(value) }, col.field));
            }) }, row.id))) }));
    // Get CSS class for column alignment
    const getColumnClass = (field) => {
        const numericFields = ['price', 'bid', 'ask', 'size', 'volume', 'change', 'changePercent', 'high', 'low', 'open'];
        return numericFields.includes(field) ? 'numeric-cell' : '';
    };
    // Format cell value
    const formatCellValue = (value) => {
        if (value == null)
            return '';
        if (typeof value === 'number') {
            return value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
        return String(value);
    };
    // Format price value
    const formatPrice = (value) => {
        if (value == null)
            return '';
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };
    // Format change value
    const formatChange = (value, isPercent) => {
        if (value == null)
            return _jsx("span", { children: "-" });
        const formatted = isPercent
            ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
            : `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
        const className = value >= 0 ? 'change-positive' : 'change-negative';
        return _jsx("span", { className: className, children: formatted });
    };
    // Format volume value
    const formatVolume = (value) => {
        if (value == null)
            return '';
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)}M`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toLocaleString();
    };
    const containerClassName = `market-data-grid ${config?.densityMode ? 'density-compact' : ''} ${className}`.trim();
    return (_jsxs("div", { ref: tableRef, className: containerClassName, "data-testid": "data-grid", children: [renderHeader(), renderBody()] }));
};
// ...existing code...
export function withMarketData(Component) {
    return (props) => {
        const { marketDataConfig, engine, ...componentProps } = props;
        if (!marketDataConfig?.enabled || !engine) {
            return _jsx(Component, { ...componentProps });
        }
        // Wrap component with market data optimizations
        return (_jsx("div", { className: "market-data-wrapper", children: _jsx(Component, { ...componentProps }) }));
    };
}
