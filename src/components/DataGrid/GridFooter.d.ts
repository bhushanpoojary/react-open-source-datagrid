import React from 'react';
import type { Column, AggregateConfig } from './types';
interface GridFooterProps {
    columns: Column[];
    displayColumnOrder: string[];
    columnWidths: {
        [field: string]: number;
    };
    aggregates: {
        [key: string]: number | null;
    };
    aggregateConfigs: AggregateConfig[];
    pinnedLeft: string[];
    pinnedRight: string[];
    label?: string;
}
export declare const GridFooter: React.FC<GridFooterProps>;
export {};
