import type { Row, Column, FilterValue } from './types';
/**
 * Context Menu Utility Functions
 *
 * Helper functions for context menu actions like copy, export, etc.
 */
/**
 * Copy selected cells to clipboard
 */
export declare const copyToClipboard: (selectedRows: Set<string | number>, columns: Column[], rows: Row[], includeHeaders?: boolean) => Promise<void>;
/**
 * Copy a specific cell range to clipboard
 */
export declare const copyCellRange: (startRow: number, endRow: number, startCol: number, endCol: number, columns: Column[], rows: Row[], includeHeaders?: boolean) => Promise<void>;
/**
 * Export selected rows to CSV
 */
export declare const exportSelectedToCSV: (selectedRows: Set<string | number>, columns: Column[], rows: Row[], filename?: string) => void;
/**
 * Calculate optimal column width based on content
 */
export declare const calculateOptimalWidth: (column: Column, rows: Row[], minWidth?: number, maxWidth?: number, padding?: number) => number;
/**
 * Auto-size all columns
 */
export declare const autoSizeAllColumns: (columns: Column[], rows: Row[]) => {
    [field: string]: number;
};
/**
 * Create a "filter by value" filter configuration
 */
export declare const createFilterByValue: (value: unknown) => FilterValue;
/**
 * Get unique values for a column (for filter suggestions)
 */
export declare const getUniqueColumnValues: (column: Column, rows: Row[], maxValues?: number) => unknown[];
