import React from 'react';
import type { Column, GridAction, SortConfig } from './types';
interface GridHeaderProps {
    columns: Column[];
    columnOrder: string[];
    displayColumnOrder: string[];
    columnWidths: {
        [field: string]: number;
    };
    sortConfig: SortConfig;
    dispatch: React.Dispatch<GridAction>;
    pinnedLeft: string[];
    pinnedRight: string[];
    showColumnPinning: boolean;
    onContextMenu?: (event: React.MouseEvent, column: Column, columnIndex: number) => void;
}
export declare const GridHeader: React.FC<GridHeaderProps>;
export {};
