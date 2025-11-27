import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * FacetedSearch Component
 *
 * A filter panel that shows value counts for categorical fields.
 * Perfect for e-commerce and analytics dashboards.
 * Provides instant visual feedback about data distribution and filtering options.
 */
import React, { useState, useMemo } from 'react';
// Simple icon components using inline SVG
const XIcon = () => (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }));
const SearchIcon = () => (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35" })] }));
const ChevronDownIcon = () => (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) }));
const ChevronRightIcon = () => (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "9 18 15 12 9 6" }) }));
const FilterIcon = () => (_jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" }) }));
/**
 * Extract unique values with counts from rows
 */
const extractFacetValues = (rows, field, filterConfig, currentField) => {
    const valueCounts = new Map();
    // Apply all filters EXCEPT the current field to get accurate counts
    const filteredRows = rows.filter(row => {
        return Object.entries(filterConfig).every(([filterField, filterValue]) => {
            // Skip current field and null filters
            if (filterField === currentField || !filterValue)
                return true;
            // Handle set filters (multi-select)
            if (filterValue && 'values' in filterValue && filterValue.values) {
                const rowValue = row[filterField];
                return filterValue.values.includes(rowValue);
            }
            return true;
        });
    });
    // Count values in filtered rows
    filteredRows.forEach(row => {
        const value = row[field];
        if (value != null) {
            const count = valueCounts.get(value) || 0;
            valueCounts.set(value, count + 1);
        }
    });
    return valueCounts;
};
/**
 * Sort facet values
 */
const sortFacetValues = (values, sortBy) => {
    const sorted = [...values];
    switch (sortBy) {
        case 'count':
            // Sort by count descending, then by label
            sorted.sort((a, b) => {
                if (b.count !== a.count)
                    return b.count - a.count;
                return a.label.localeCompare(b.label);
            });
            break;
        case 'alpha':
            // Sort alphabetically by label
            sorted.sort((a, b) => a.label.localeCompare(b.label));
            break;
        case 'value':
            // Sort by value (for numbers)
            sorted.sort((a, b) => {
                if (typeof a.value === 'number' && typeof b.value === 'number') {
                    return a.value - b.value;
                }
                return String(a.value).localeCompare(String(b.value));
            });
            break;
    }
    return sorted;
};
export const FacetedSearch = ({ columns, rows, facetConfigs, filterConfig, onFilterChange, onClearAll, className = '', showSearch = true, collapsible = true, }) => {
    // Track expanded state, search terms, and show-all state for each facet
    const [facetStates, setFacetStates] = useState(new Map());
    // Build facet groups with values and counts
    const facetGroups = useMemo(() => {
        return facetConfigs.map(config => {
            const column = columns.find(c => c.field === config.field);
            const label = config.label || column?.headerName || config.field;
            // Get current filter values for this field
            const currentFilter = filterConfig[config.field];
            const selectedValues = currentFilter && 'values' in currentFilter
                ? new Set(currentFilter.values || [])
                : new Set();
            // Extract value counts
            const valueCounts = extractFacetValues(rows, config.field, filterConfig, config.field);
            // Build facet values
            const values = [];
            valueCounts.forEach((count, value) => {
                values.push({
                    value,
                    label: String(value),
                    count,
                    selected: selectedValues.has(value),
                });
            });
            // Sort values
            const sortedValues = sortFacetValues(values, config.sortBy || 'count');
            // Get state for this facet
            const state = facetStates.get(config.field) || {
                expanded: config.expanded !== false,
                searchTerm: '',
                showAll: false,
            };
            return {
                field: config.field,
                label,
                values: sortedValues,
                expanded: state.expanded,
                searchTerm: state.searchTerm,
                showAll: state.showAll,
            };
        });
    }, [facetConfigs, columns, rows, filterConfig, facetStates]);
    // Update facet state
    const updateFacetState = (field, update) => {
        setFacetStates(prev => {
            const newStates = new Map(prev);
            const current = newStates.get(field) || {
                expanded: true,
                searchTerm: '',
                showAll: false,
            };
            newStates.set(field, { ...current, ...update });
            return newStates;
        });
    };
    // Toggle facet value selection
    const toggleValue = (field, value) => {
        const currentFilter = filterConfig[field];
        const currentValues = currentFilter && 'values' in currentFilter
            ? new Set(currentFilter.values || [])
            : new Set();
        if (currentValues.has(value)) {
            currentValues.delete(value);
        }
        else {
            currentValues.add(value);
        }
        // If no values selected, clear the filter
        if (currentValues.size === 0) {
            onFilterChange(field, null);
        }
        else {
            onFilterChange(field, Array.from(currentValues));
        }
    };
    // Select all values in a facet
    const selectAll = (field, values) => {
        onFilterChange(field, values);
    };
    // Clear a specific facet
    const clearFacet = (field) => {
        onFilterChange(field, null);
    };
    // Count total active filters
    const activeFilterCount = useMemo(() => {
        return Object.values(filterConfig).filter(f => {
            if (!f)
                return false;
            if ('values' in f && f.values && f.values.length > 0)
                return true;
            return false;
        }).length;
    }, [filterConfig]);
    return (_jsxs("div", { className: `faceted-search ${className || ''}`, style: {
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }, children: [_jsx("div", { style: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '16px',
                    flexShrink: 0
                }, children: _jsxs("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                    }, children: [_jsxs("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }, children: [_jsx(FilterIcon, {}), _jsx("h3", { style: {
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: '#111827',
                                        margin: 0
                                    }, children: "Filters" }), activeFilterCount > 0 && (_jsx("span", { style: {
                                        padding: '2px 8px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        backgroundColor: '#dbeafe',
                                        color: '#1e40af',
                                        borderRadius: '9999px'
                                    }, children: activeFilterCount }))] }), activeFilterCount > 0 && onClearAll && (_jsx("button", { onClick: onClearAll, style: {
                                fontSize: '14px',
                                color: '#2563eb',
                                fontWeight: 500,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0
                            }, onMouseOver: (e) => e.currentTarget.style.color = '#1d4ed8', onMouseOut: (e) => e.currentTarget.style.color = '#2563eb', children: "Clear All" }))] }) }), _jsxs("div", { style: {
                    overflowY: 'auto',
                    flex: 1
                }, children: [facetGroups.map(group => {
                        const maxItems = facetConfigs.find(c => c.field === group.field)?.maxItems || 10;
                        // Filter values by search term
                        const filteredValues = group.searchTerm
                            ? group.values.filter(v => v.label.toLowerCase().includes(group.searchTerm.toLowerCase()))
                            : group.values;
                        // Limit displayed values
                        const displayedValues = group.showAll
                            ? filteredValues
                            : filteredValues.slice(0, maxItems);
                        const hasMore = filteredValues.length > maxItems;
                        const selectedCount = group.values.filter(v => v.selected).length;
                        return (_jsxs("div", { style: {
                                borderBottom: '1px solid #e5e7eb'
                            }, children: [_jsxs("div", { style: {
                                        padding: '16px',
                                        backgroundColor: '#f9fafb'
                                    }, children: [_jsxs("div", { style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }, children: [_jsxs("button", { onClick: () => updateFacetState(group.field, { expanded: !group.expanded }), disabled: !collapsible, style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: '#111827',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: collapsible ? 'pointer' : 'default',
                                                        padding: 0
                                                    }, onMouseOver: (e) => collapsible && (e.currentTarget.style.color = '#374151'), onMouseOut: (e) => collapsible && (e.currentTarget.style.color = '#111827'), children: [collapsible && (group.expanded
                                                            ? _jsx(ChevronDownIcon, {})
                                                            : _jsx(ChevronRightIcon, {})), _jsx("span", { children: group.label }), selectedCount > 0 && (_jsx("span", { style: {
                                                                padding: '2px 8px',
                                                                fontSize: '12px',
                                                                fontWeight: 500,
                                                                backgroundColor: '#dbeafe',
                                                                color: '#1e40af',
                                                                borderRadius: '9999px'
                                                            }, children: selectedCount }))] }), selectedCount > 0 && (_jsx("button", { onClick: () => clearFacet(group.field), style: {
                                                        fontSize: '12px',
                                                        color: '#6b7280',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }, onMouseOver: (e) => e.currentTarget.style.color = '#374151', onMouseOut: (e) => e.currentTarget.style.color = '#6b7280', children: _jsx(XIcon, {}) }))] }), showSearch && group.expanded && group.values.length > 5 && (_jsxs("div", { style: {
                                                marginTop: '8px',
                                                position: 'relative'
                                            }, children: [_jsx("div", { style: {
                                                        position: 'absolute',
                                                        left: '8px',
                                                        top: '8px',
                                                        color: '#9ca3af'
                                                    }, children: _jsx(SearchIcon, {}) }), _jsx("input", { type: "text", value: group.searchTerm, onChange: (e) => updateFacetState(group.field, { searchTerm: e.target.value }), placeholder: "Search...", style: {
                                                        width: '100%',
                                                        paddingLeft: '32px',
                                                        paddingRight: '12px',
                                                        paddingTop: '6px',
                                                        paddingBottom: '6px',
                                                        fontSize: '14px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '4px',
                                                        outline: 'none'
                                                    }, onFocus: (e) => e.currentTarget.style.boxShadow = '0 0 0 2px #3b82f6', onBlur: (e) => e.currentTarget.style.boxShadow = 'none' })] }))] }), group.expanded && (_jsx("div", { style: {
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px'
                                    }, children: displayedValues.length === 0 ? (_jsx("div", { style: {
                                            fontSize: '14px',
                                            color: '#6b7280',
                                            fontStyle: 'italic'
                                        }, children: "No values found" })) : (_jsxs(_Fragment, { children: [filteredValues.length > 1 && selectedCount < filteredValues.length && (_jsxs("button", { onClick: () => selectAll(group.field, filteredValues.map(v => v.value)), style: {
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontSize: '14px',
                                                    color: '#2563eb',
                                                    fontWeight: 500,
                                                    padding: '4px 0',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }, onMouseOver: (e) => e.currentTarget.style.color = '#1d4ed8', onMouseOut: (e) => e.currentTarget.style.color = '#2563eb', children: ["Select All (", filteredValues.length, ")"] })), displayedValues.map((facetValue, idx) => (_jsxs("label", { style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    paddingTop: '6px',
                                                    paddingBottom: '6px',
                                                    paddingLeft: '8px',
                                                    paddingRight: '8px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = '#f9fafb', onMouseOut: (e) => e.currentTarget.style.backgroundColor = 'transparent', children: [_jsxs("div", { style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            flex: 1,
                                                            minWidth: 0
                                                        }, children: [_jsx("input", { type: "checkbox", checked: facetValue.selected, onChange: () => toggleValue(group.field, facetValue.value), style: {
                                                                    width: '16px',
                                                                    height: '16px',
                                                                    cursor: 'pointer',
                                                                    accentColor: '#2563eb'
                                                                } }), _jsx("span", { style: {
                                                                    fontSize: '14px',
                                                                    color: '#374151',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    flex: 1
                                                                }, children: facetValue.label })] }), _jsx("span", { style: {
                                                            fontSize: '12px',
                                                            color: '#6b7280',
                                                            fontWeight: 500,
                                                            marginLeft: '8px',
                                                            flexShrink: 0
                                                        }, children: facetValue.count })] }, `${facetValue.value}-${idx}`))), hasMore && !group.searchTerm && (_jsx("button", { onClick: () => updateFacetState(group.field, { showAll: !group.showAll }), style: {
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontSize: '14px',
                                                    color: '#2563eb',
                                                    fontWeight: 500,
                                                    padding: '4px 0',
                                                    marginTop: '8px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }, onMouseOver: (e) => e.currentTarget.style.color = '#1d4ed8', onMouseOut: (e) => e.currentTarget.style.color = '#2563eb', children: group.showAll
                                                    ? 'Show Less'
                                                    : `Show More (${filteredValues.length - maxItems} more)` }))] })) }))] }, group.field));
                    }), facetGroups.length === 0 && (_jsxs("div", { style: {
                            padding: '32px',
                            textAlign: 'center',
                            color: '#6b7280'
                        }, children: [_jsx("div", { style: {
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    color: '#9ca3af'
                                }, children: _jsx("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" }) }) }), _jsx("p", { style: {
                                    fontSize: '14px',
                                    margin: 0
                                }, children: "No facets configured" })] }))] })] }));
};
export default FacetedSearch;
