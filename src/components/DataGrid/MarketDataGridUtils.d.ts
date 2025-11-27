import type { MarketDataConfig } from './types';
import { MarketDataEngine } from './MarketDataEngine';
import React from 'react';
export interface WithMarketDataProps {
    marketDataConfig?: MarketDataConfig;
    engine?: MarketDataEngine;
}
export declare function withMarketData<P extends object>(Component: React.ComponentType<P>): React.FC<P & WithMarketDataProps>;
export declare const getColumnClass: (field: string) => string;
export declare const formatCellValue: (value: unknown) => string;
export declare const formatPrice: (value: number) => string;
export declare const formatChange: (value: number, isPercent: boolean) => React.ReactElement;
export declare const formatVolume: (value: number) => string;
