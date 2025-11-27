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
import React from 'react';
import type { Column, Row, MarketDataConfig } from './types';
import { MarketDataEngine } from './MarketDataEngine';
import './MarketDataGrid.css';
export interface MarketDataGridProps {
    columns: Column[];
    rows: Row[];
    engine: MarketDataEngine;
    config?: MarketDataConfig;
    className?: string;
    onCellClick?: (rowId: string | number, field: string, value: any) => void;
    onRowClick?: (row: Row) => void;
}
/**
 * MarketDataGrid Component
 *
 * Optimized grid for displaying live market data with minimal latency.
 * Uses direct DOM manipulation for cell updates to bypass React reconciliation.
 */
export declare const MarketDataGrid: React.FC<MarketDataGridProps>;
/**
 * Higher-order component to wrap standard DataGrid with market data capabilities
 */
export interface WithMarketDataProps {
    marketDataConfig?: MarketDataConfig;
    engine?: MarketDataEngine;
}
export declare function withMarketData<P extends object>(Component: React.ComponentType<P>): React.FC<P & WithMarketDataProps>;
