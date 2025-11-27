/**
 * FacetedSearch Component
 *
 * A filter panel that shows value counts for categorical fields.
 * Perfect for e-commerce and analytics dashboards.
 * Provides instant visual feedback about data distribution and filtering options.
 */
import React from 'react';
import type { Column, Row, FilterConfig } from './types';
export interface FacetConfig {
    field: string;
    label?: string;
    maxItems?: number;
    sortBy?: 'count' | 'value' | 'alpha';
    expanded?: boolean;
}
export interface FacetedSearchProps {
    columns: Column[];
    rows: Row[];
    facetConfigs: FacetConfig[];
    filterConfig: FilterConfig;
    onFilterChange: (field: string, values: any[] | null) => void;
    onClearAll?: () => void;
    className?: string;
    showSearch?: boolean;
    collapsible?: boolean;
}
export declare const FacetedSearch: React.FC<FacetedSearchProps>;
export default FacetedSearch;
