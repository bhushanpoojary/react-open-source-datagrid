import { jsx as _jsx } from "react/jsx-runtime";
import { MarketDataEngine } from './MarketDataEngine';
import React from 'react';
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
// Helper functions for formatting
export const getColumnClass = (field) => {
    const numericFields = ['price', 'bid', 'ask', 'size', 'volume', 'change', 'changePercent', 'high', 'low', 'open'];
    return numericFields.includes(field) ? 'numeric-cell' : '';
};
export const formatCellValue = (value) => {
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
export const formatPrice = (value) => {
    if (value == null)
        return '';
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
export const formatChange = (value, isPercent) => {
    if (value == null)
        return _jsx("span", { children: "-" });
    const formatted = isPercent
        ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
        : `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
    const className = value >= 0 ? 'change-positive' : 'change-negative';
    return _jsx("span", { className: className, children: formatted });
};
export const formatVolume = (value) => {
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
