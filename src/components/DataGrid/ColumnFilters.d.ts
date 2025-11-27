import React from 'react';
import type { Column, FilterConfig, GridAction, Row } from './types';
interface ColumnFiltersProps {
    columns: Column[];
    displayColumnOrder: string[];
    columnWidths: {
        [field: string]: number;
    };
    filterConfig: FilterConfig;
    dispatch: React.Dispatch<GridAction>;
    pinnedLeft: string[];
    pinnedRight: string[];
    rows: Row[];
}
export declare const ColumnFilters: React.FC<ColumnFiltersProps>;
export {};
