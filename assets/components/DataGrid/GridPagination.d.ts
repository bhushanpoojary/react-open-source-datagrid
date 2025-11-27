import React from 'react';
import type { GridAction } from './types';
interface GridPaginationProps {
    currentPage: number;
    pageSize: number;
    totalRows: number;
    dispatch: React.Dispatch<GridAction>;
}
export declare const GridPagination: React.FC<GridPaginationProps>;
export {};
