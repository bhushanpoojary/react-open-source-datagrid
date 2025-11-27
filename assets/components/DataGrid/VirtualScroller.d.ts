import React from 'react';
export interface VirtualScrollerProps<T = unknown> {
    items: T[];
    itemHeight?: number | ((index: number, item: T) => number);
    overscanCount?: number;
    containerHeight?: number;
    containerWidth?: number;
    columns?: Array<{
        field: string;
        width: number;
    }>;
    totalColumnWidth?: number;
    columnOverscan?: number;
    renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
    renderRow?: (item: T, index: number, visibleColumns: Array<{
        field: string;
        width: number;
        offset: number;
    }>, style: React.CSSProperties) => React.ReactNode;
    onScroll?: (scrollTop: number, scrollLeft: number) => void;
    className?: string;
    innerClassName?: string;
}
/**
 * VirtualScroller Component
 *
 * High-performance virtual scrolling with:
 * - Row virtualization (windowing)
 * - Column virtualization
 * - Dynamic row heights
 * - Cell recycling
 * - Optimized for 50,000+ rows and 200+ columns
 */
export declare const VirtualScroller: <T = unknown>({ items, itemHeight, overscanCount, containerHeight, containerWidth, columns, totalColumnWidth, columnOverscan, renderItem, renderRow, onScroll, className, innerClassName, }: VirtualScrollerProps<T>) => import("react/jsx-runtime").JSX.Element;
export default VirtualScroller;
