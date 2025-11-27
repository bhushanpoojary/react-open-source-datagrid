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
import { getColumnClass, formatCellValue, formatPrice, formatChange, formatVolume } from './MarketDataGridUtils';
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
    const containerClassName = `market-data-grid ${config?.densityMode ? 'density-compact' : ''} ${className}`.trim();
    return (_jsxs("div", { ref: tableRef, className: containerClassName, "data-testid": "data-grid", children: [renderHeader(), renderBody()] }));
};
