/**
 * FilteredSearchBar Component
 *
 * Advanced search bar with token-based filtering (similar to GitLab/GitHub)
 * Features:
 * - Token/pill-based filters
 * - Autocomplete dropdown
 * - Multi-criteria search
 * - Visual feedback with colored tokens
 * - Keyboard navigation
 */
import React from 'react';
export interface SearchToken {
    id: string;
    field: string;
    label: string;
    value: string | string[];
    operator?: 'equals' | 'contains' | 'startsWith' | 'in';
    color?: string;
}
export interface FilterOption {
    field: string;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'date' | 'number';
    options?: string[];
    placeholder?: string;
    color?: string;
}
export interface FilteredSearchBarProps {
    filters: FilterOption[];
    onSearch: (tokens: SearchToken[]) => void;
    placeholder?: string;
    maxTokens?: number;
}
export declare const FilteredSearchBar: React.FC<FilteredSearchBarProps>;
export default FilteredSearchBar;
