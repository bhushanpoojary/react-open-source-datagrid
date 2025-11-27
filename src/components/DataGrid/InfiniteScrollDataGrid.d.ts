/**
 * InfiniteScrollDataGrid Component
 *
 * DataGrid with server-side infinite scrolling support.
 * Handles massive datasets (100M+ rows) with:
 * - Server-side data fetching
 * - Server-side filtering
 * - Server-side sorting
 * - Local block caching
 * - Virtual scrolling
 */
import React from 'react';
import type { Column, Row, VirtualScrollConfig } from './types';
import type { ServerSideDataSourceConfig } from './ServerSideDataSource';
import { ServerSideDataSource } from './ServerSideDataSource';
import type { ThemeName } from './themes';
export interface InfiniteScrollDataGridProps {
    columns: Column[];
    dataSource: ServerSideDataSource | ServerSideDataSourceConfig;
    pageSize?: number;
    showColumnPinning?: boolean;
    virtualScrollConfig?: VirtualScrollConfig;
    theme?: ThemeName;
    onRowClick?: (row: Row) => void;
    onCellEdit?: (rowIndex: number, field: string, value: unknown) => void;
    onSelectionChange?: (selectedIds: (string | number)[]) => void;
}
/**
 * InfiniteScrollDataGrid
 *
 * A DataGrid component optimized for infinite scrolling with server-side data source.
 */
export declare const InfiniteScrollDataGrid: React.FC<InfiniteScrollDataGridProps>;
/**
 * ThemedInfiniteScrollDataGrid - Legacy alias for backward compatibility
 * @deprecated Use InfiniteScrollDataGrid directly with theme prop instead
 */
export declare const ThemedInfiniteScrollDataGrid: React.FC<InfiniteScrollDataGridProps>;
export default InfiniteScrollDataGrid;
