import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
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
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
export const FilteredSearchBar = ({ filters, onSearch, placeholder = 'Search or add filters...', maxTokens = 10, }) => {
    const [tokens, setTokens] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilterField, setSelectedFilterField] = useState(null);
    const filteredOptions = React.useMemo(() => {
        if (!selectedFilterField) {
            return filters.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                f.field.toLowerCase().includes(inputValue.toLowerCase()));
        }
        else {
            const selectedFilter = filters.find(f => f.field === selectedFilterField);
            if (selectedFilter?.type === 'select' || selectedFilter?.type === 'multiselect') {
                const filtered = selectedFilter.options?.filter(opt => opt.toLowerCase().includes(inputValue.toLowerCase())) || [];
                return [{ ...selectedFilter, options: filtered }];
            }
        }
        return filters;
    }, [inputValue, selectedFilterField, filters]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    // Add token
    const addToken = (field, value) => {
        const filter = filters.find(f => f.field === field);
        if (!filter || tokens.length >= maxTokens)
            return;
        const newToken = {
            id: `${field}-${uuidv4()}`,
            field,
            label: filter.label,
            value,
            operator: Array.isArray(value) ? 'in' : 'contains',
            color: filter.color || getDefaultColor(filters.indexOf(filter)),
        };
        const newTokens = [...tokens, newToken];
        setTokens(newTokens);
        onSearch(newTokens);
        setInputValue('');
        setSelectedFilterField(null);
        setShowDropdown(false);
    };
    // Remove token
    const removeToken = (tokenId) => {
        const newTokens = tokens.filter(t => t.id !== tokenId);
        setTokens(newTokens);
        onSearch(newTokens);
    };
    // Handle filter selection
    const handleFilterSelect = (filter) => {
        if (filter.type === 'text' || filter.type === 'number' || filter.type === 'date') {
            setSelectedFilterField(filter.field);
            setInputValue('');
            setShowDropdown(true);
        }
        else if (filter.type === 'select') {
            setSelectedFilterField(filter.field);
            setInputValue('');
            setShowDropdown(true);
        }
    };
    // Handle value selection
    const handleValueSelect = (value) => {
        if (selectedFilterField) {
            addToken(selectedFilterField, value);
        }
    };
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.min(prev + 1, (selectedFilterField ? filteredOptions[0]?.options?.length || 0 : filteredOptions.length) - 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.max(prev - 1, 0));
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedFilterField) {
                const options = filteredOptions[0]?.options || [];
                if (options[highlightedIndex]) {
                    handleValueSelect(options[highlightedIndex]);
                }
                else if (inputValue.trim()) {
                    addToken(selectedFilterField, inputValue.trim());
                }
            }
            else {
                if (filteredOptions[highlightedIndex]) {
                    handleFilterSelect(filteredOptions[highlightedIndex]);
                }
            }
        }
        else if (e.key === 'Escape') {
            setShowDropdown(false);
            setSelectedFilterField(null);
            setInputValue('');
        }
        else if (e.key === 'Backspace' && !inputValue && tokens.length > 0) {
            removeToken(tokens[tokens.length - 1].id);
        }
    };
    // Get default color for token
    const getDefaultColor = (index) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        return colors[index % colors.length];
    };
    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (_jsxs("div", { style: { position: 'relative', width: '100%' }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    minHeight: '44px',
                    cursor: 'text',
                    transition: 'border-color 0.2s',
                    ...(showDropdown && { borderColor: '#3b82f6' }),
                }, onClick: () => inputRef.current?.focus(), children: [tokens.map((token) => (_jsxs("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 8px',
                            backgroundColor: token.color,
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                        }, children: [_jsxs("span", { style: { fontWeight: '600' }, children: [token.label, ":"] }), _jsx("span", { children: Array.isArray(token.value) ? token.value.join(', ') : token.value }), _jsx("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    removeToken(token.id);
                                }, style: {
                                    background: 'none',
                                    border: 'none',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    padding: '0 2px',
                                    fontSize: '16px',
                                    lineHeight: '1',
                                    opacity: 0.8,
                                }, onMouseEnter: (e) => (e.currentTarget.style.opacity = '1'), onMouseLeave: (e) => (e.currentTarget.style.opacity = '0.8'), children: "\u00D7" })] }, token.id))), _jsx("input", { ref: inputRef, type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), onFocus: () => setShowDropdown(true), onKeyDown: handleKeyDown, placeholder: tokens.length === 0 ? placeholder : '', style: {
                            flex: 1,
                            minWidth: '200px',
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            padding: '4px',
                            backgroundColor: 'transparent',
                        }, disabled: tokens.length >= maxTokens })] }), showDropdown && (_jsx("div", { ref: dropdownRef, style: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000,
                }, children: selectedFilterField ? (
                // Show values for selected filter
                _jsxs("div", { children: [_jsxs("div", { style: {
                                padding: '8px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#64748b',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }, children: [_jsx("button", { onClick: () => {
                                        setSelectedFilterField(null);
                                        setInputValue('');
                                    }, style: {
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px',
                                        fontSize: '16px',
                                        color: '#64748b',
                                    }, children: "\u2190" }), filters.find(f => f.field === selectedFilterField)?.label] }), filteredOptions[0]?.options?.map((option, index) => (_jsx("div", { onClick: () => handleValueSelect(option), style: {
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                backgroundColor: highlightedIndex === index ? '#f1f5f9' : 'transparent',
                                transition: 'background-color 0.15s',
                            }, onMouseEnter: () => setHighlightedIndex(index), children: option }, option)))] })) : (
                // Show filter options
                _jsxs("div", { children: [_jsx("div", { style: {
                                padding: '8px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#64748b',
                                borderBottom: '1px solid #e2e8f0',
                            }, children: "Filter by" }), filteredOptions.map((filter, index) => (_jsxs("div", { onClick: () => handleFilterSelect(filter), style: {
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: highlightedIndex === index ? '#f1f5f9' : 'transparent',
                                transition: 'background-color 0.15s',
                            }, onMouseEnter: () => setHighlightedIndex(index), children: [_jsx("div", { style: {
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: filter.color || getDefaultColor(filters.indexOf(filter)),
                                    } }), _jsx("span", { style: { fontWeight: '500' }, children: filter.label }), _jsx("span", { style: { marginLeft: 'auto', fontSize: '12px', color: '#94a3b8' }, children: filter.type })] }, filter.field)))] })) }))] }));
};
export default FilteredSearchBar;
