import type { Row, FilterConfig } from './types';
/**
 * Apply all filters to rows
 */
export declare const applyFilters: (rows: Row[], filterConfig: FilterConfig) => Row[];
/**
 * Check if any filters are active
 */
export declare const hasActiveFilters: (filterConfig: FilterConfig) => boolean;
/**
 * Get count of active filters
 */
export declare const getActiveFilterCount: (filterConfig: FilterConfig) => number;
/**
 * Clear all filters
 */
export declare const clearAllFilters: () => FilterConfig;
