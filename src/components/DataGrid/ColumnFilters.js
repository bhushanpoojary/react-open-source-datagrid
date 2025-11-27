import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { AdvancedFilterBuilder } from './AdvancedFilterBuilder';
// Helper function to check if filter is advanced
const isAdvancedFilter = (filter) => {
    return filter != null && 'operator' in filter && 'conditions' in filter;
};
// Text Filter Component
const TextFilterMenu = ({ filterValue, onApplyFilter, onClose, anchorEl, showAdvancedButton: _showAdvancedButton, onSwitchToAdvanced: _onSwitchToAdvanced }) => {
    // Skip if it's an advanced filter
    const simpleFilter = !isAdvancedFilter(filterValue) ? filterValue : null;
    const initialFilterType = simpleFilter?.type || 'contains';
    const initialValue = simpleFilter?.value || '';
    const [filterType, setFilterType] = useState(initialFilterType);
    const [value, setValue] = useState(initialValue);
    const handleApply = () => {
        if (value) {
            onApplyFilter({ type: filterType, value });
        }
        else {
            onApplyFilter(null);
        }
        onClose();
    };
    const handleClear = () => {
        setValue('');
        onApplyFilter(null);
        onClose();
    };
    return (_jsxs("div", { style: {
            position: 'fixed',
            top: anchorEl ? anchorEl.getBoundingClientRect().bottom + 5 : 0,
            left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
            minWidth: '280px',
            backgroundColor: 'var(--grid-bg)',
            boxShadow: 'var(--grid-shadow-medium, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
            borderRadius: 'var(--grid-border-radius, 8px)',
            border: 'var(--grid-border-width, 1px) solid var(--grid-border)',
            padding: '16px',
            zIndex: 1000,
        }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)', marginBottom: '4px' }, children: "Filter Type" }), _jsxs("select", { style: {
                            width: '100%',
                            padding: '8px 12px',
                            border: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            fontSize: 'var(--grid-font-size, 14px)',
                            outline: 'none',
                            backgroundColor: 'var(--grid-bg)',
                            color: 'var(--grid-text)',
                        }, value: filterType, onChange: (e) => setFilterType(e.target.value), children: [_jsx("option", { value: "contains", children: "Contains" }), _jsx("option", { value: "notContains", children: "Not Contains" }), _jsx("option", { value: "equals", children: "Equals" }), _jsx("option", { value: "startsWith", children: "Starts With" }), _jsx("option", { value: "endsWith", children: "Ends With" })] })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)', marginBottom: '4px' }, children: "Value" }), _jsx("input", { type: "text", style: {
                            width: '100%',
                            padding: '8px 12px',
                            border: 'var(--grid-border-width, 1px) solid var(--grid-border)',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            fontSize: 'var(--grid-font-size, 14px)',
                            outline: 'none',
                            backgroundColor: 'var(--grid-bg)',
                            color: 'var(--grid-text)',
                        }, value: value, onChange: (e) => setValue(e.target.value), placeholder: "Enter text...", autoFocus: true })] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx("button", { style: {
                            padding: '6px 12px',
                            fontSize: 'var(--grid-font-size, 14px)',
                            color: 'var(--grid-text)',
                            backgroundColor: 'var(--grid-bg-alt)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                        }, onClick: handleClear, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg-alt)', children: "Clear" }), _jsx("button", { style: {
                            padding: '6px 12px',
                            fontSize: 'var(--grid-font-size, 14px)',
                            color: 'var(--grid-text-inverse)',
                            backgroundColor: 'var(--grid-primary)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                        }, onClick: handleApply, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary)', children: "Apply" })] })] }));
};
// Number Filter Component
const NumberFilterMenu = ({ filterValue, onApplyFilter, onClose, anchorEl, showAdvancedButton: _showAdvancedButton, onSwitchToAdvanced: _onSwitchToAdvanced }) => {
    const simpleFilter = !isAdvancedFilter(filterValue) ? filterValue : null;
    const initialFilterType = simpleFilter?.type || 'equals';
    const initialValue = simpleFilter?.value || '';
    const initialValue2 = simpleFilter?.value2 || '';
    const [filterType, setFilterType] = useState(initialFilterType);
    const [value, setValue] = useState(initialValue);
    const [value2, setValue2] = useState(initialValue2);
    const handleApply = () => {
        if (value) {
            const filterData = { type: filterType, value: parseFloat(value) };
            if (filterType === 'inRange' && value2) {
                filterData.value2 = parseFloat(value2);
            }
            onApplyFilter(filterData);
        }
        else {
            onApplyFilter(null);
        }
        onClose();
    };
    const handleClear = () => {
        setValue('');
        setValue2('');
        onApplyFilter(null);
        onClose();
    };
    return (_jsxs("div", { style: {
            position: 'fixed',
            top: anchorEl ? anchorEl.getBoundingClientRect().bottom + 5 : 0,
            left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
            minWidth: '280px',
            backgroundColor: 'var(--grid-bg)',
            boxShadow: 'var(--grid-shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05))',
            borderRadius: 'var(--grid-border-radius, 8px)',
            border: '1px solid var(--grid-border)',
            padding: '16px',
            zIndex: 1000,
        }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)', marginBottom: '4px' }, children: "Filter Type" }), _jsxs("select", { style: { width: '100%', padding: '8px 12px', border: '1px solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', fontSize: 'var(--grid-font-size, 14px)', outline: 'none', backgroundColor: 'var(--grid-bg)', color: 'var(--grid-text)' }, value: filterType, onChange: (e) => setFilterType(e.target.value), children: [_jsx("option", { value: "equals", children: "Equals" }), _jsx("option", { value: "notEquals", children: "Not Equals" }), _jsx("option", { value: "greaterThan", children: "Greater Than" }), _jsx("option", { value: "greaterThanOrEqual", children: "Greater Than or Equal" }), _jsx("option", { value: "lessThan", children: "Less Than" }), _jsx("option", { value: "lessThanOrEqual", children: "Less Than or Equal" }), _jsx("option", { value: "inRange", children: "In Range" })] })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)', marginBottom: '4px' }, children: "Value" }), _jsx("input", { type: "number", style: { width: '100%', padding: '8px 12px', border: '1px solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', fontSize: 'var(--grid-font-size, 14px)', outline: 'none', backgroundColor: 'var(--grid-bg)', color: 'var(--grid-text)' }, value: value, onChange: (e) => setValue(e.target.value), placeholder: "Enter number...", autoFocus: true })] }), filterType === 'inRange' && (_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)', marginBottom: '4px' }, children: "To" }), _jsx("input", { type: "number", style: { width: '100%', padding: '8px 12px', border: '1px solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', fontSize: 'var(--grid-font-size, 14px)', outline: 'none', backgroundColor: 'var(--grid-bg)', color: 'var(--grid-text)' }, value: value2, onChange: (e) => setValue2(e.target.value), placeholder: "Enter max value..." })] })), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx("button", { style: {
                            padding: '6px 12px',
                            fontSize: 'var(--grid-font-size, 14px)',
                            color: 'var(--grid-text)',
                            backgroundColor: 'var(--grid-bg-alt)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                        }, onClick: handleClear, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg-alt)', children: "Clear" }), _jsx("button", { style: {
                            padding: '6px 12px',
                            fontSize: 'var(--grid-font-size, 14px)',
                            color: 'var(--grid-text-inverse)',
                            backgroundColor: 'var(--grid-primary)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                        }, onClick: handleApply, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary)', children: "Apply" })] })] }));
};
// Date Filter Component
const DateFilterMenu = ({ filterValue, onApplyFilter, onClose, anchorEl, showAdvancedButton: _showAdvancedButton, onSwitchToAdvanced: _onSwitchToAdvanced }) => {
    const simpleFilter = !isAdvancedFilter(filterValue) ? filterValue : null;
    const initialFilterType = simpleFilter?.type || 'equals';
    const initialValue = simpleFilter?.value || '';
    const initialValue2 = simpleFilter?.value2 || '';
    const [filterType, setFilterType] = useState(initialFilterType);
    const [value, setValue] = useState(initialValue);
    const [value2, setValue2] = useState(initialValue2);
    const handleApply = () => {
        if (value) {
            const filterData = { type: filterType, value };
            if (filterType === 'inRange' && value2) {
                filterData.value2 = value2;
            }
            onApplyFilter(filterData);
        }
        else {
            onApplyFilter(null);
        }
        onClose();
    };
    const handleClear = () => {
        setValue('');
        setValue2('');
        onApplyFilter(null);
        onClose();
    };
    return (_jsxs("div", { style: {
            position: 'fixed',
            top: anchorEl ? anchorEl.getBoundingClientRect().bottom + 5 : 0,
            left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
            minWidth: '280px',
            backgroundColor: 'var(--grid-bg)',
            boxShadow: 'var(--grid-shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05))',
            borderRadius: 'var(--grid-border-radius, 8px)',
            border: '1px solid var(--grid-border)',
            padding: '16px',
            zIndex: 1000,
        }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)', marginBottom: '4px' }, children: "Filter Type" }), _jsxs("select", { style: { width: '100%', padding: '8px 12px', border: '1px solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', fontSize: 'var(--grid-font-size, 14px)', outline: 'none', backgroundColor: 'var(--grid-bg)', color: 'var(--grid-text)' }, value: filterType, onChange: (e) => setFilterType(e.target.value), children: [_jsx("option", { value: "equals", children: "Equals" }), _jsx("option", { value: "before", children: "Before" }), _jsx("option", { value: "after", children: "After" }), _jsx("option", { value: "inRange", children: "In Range" })] })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)', marginBottom: '4px' }, children: "Date" }), _jsx("input", { type: "date", style: { width: '100%', padding: '8px 12px', border: '1px solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', fontSize: 'var(--grid-font-size, 14px)', outline: 'none', backgroundColor: 'var(--grid-bg)', color: 'var(--grid-text)' }, value: value, onChange: (e) => setValue(e.target.value), autoFocus: true })] }), filterType === 'inRange' && (_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("label", { style: { display: 'block', fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)', marginBottom: '4px' }, children: "To" }), _jsx("input", { type: "date", style: { width: '100%', padding: '8px 12px', border: '1px solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', fontSize: 'var(--grid-font-size, 14px)', outline: 'none', backgroundColor: 'var(--grid-bg)', color: 'var(--grid-text)' }, value: value2, onChange: (e) => setValue2(e.target.value) })] })), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx("button", { style: {
                            padding: '6px 12px',
                            fontSize: 'var(--grid-font-size, 14px)',
                            color: 'var(--grid-text)',
                            backgroundColor: 'var(--grid-bg-alt)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                        }, onClick: handleClear, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg-alt)', children: "Clear" }), _jsx("button", { style: {
                            padding: '6px 12px',
                            fontSize: 'var(--grid-font-size, 14px)',
                            color: 'var(--grid-text-inverse)',
                            backgroundColor: 'var(--grid-primary)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                        }, onClick: handleApply, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary)', children: "Apply" })] })] }));
};
// Set Filter Component (Unique dropdown values)
const SetFilterMenu = ({ column, filterValue, onApplyFilter, onClose, rows, anchorEl, showAdvancedButton: _showAdvancedButton, onSwitchToAdvanced: _onSwitchToAdvanced }) => {
    const uniqueValues = Array.from(new Set(rows.map(row => row[column.field]).filter(v => v != null)));
    const simpleFilter = !isAdvancedFilter(filterValue) ? filterValue : null;
    const [selectedValues, setSelectedValues] = useState(simpleFilter && simpleFilter.values ? new Set(simpleFilter.values) : new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const filteredValues = uniqueValues.filter(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
    const handleToggle = (value) => {
        const newSelected = new Set(selectedValues);
        if (newSelected.has(value)) {
            newSelected.delete(value);
        }
        else {
            newSelected.add(value);
        }
        setSelectedValues(newSelected);
    };
    const handleSelectAll = () => {
        if (selectedValues.size === filteredValues.length) {
            setSelectedValues(new Set());
        }
        else {
            setSelectedValues(new Set(filteredValues));
        }
    };
    const handleApply = () => {
        if (selectedValues.size > 0) {
            onApplyFilter({ type: 'set', values: Array.from(selectedValues) });
        }
        else {
            onApplyFilter(null);
        }
        onClose();
    };
    const handleClear = () => {
        setSelectedValues(new Set());
        onApplyFilter(null);
        onClose();
    };
    return (_jsxs("div", { style: {
            position: 'fixed',
            top: anchorEl ? anchorEl.getBoundingClientRect().bottom + 5 : 0,
            left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
            minWidth: '280px',
            maxHeight: '400px',
            backgroundColor: 'var(--grid-bg)',
            boxShadow: 'var(--grid-shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05))',
            borderRadius: 'var(--grid-border-radius, 8px)',
            border: '1px solid var(--grid-border)',
            padding: '16px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
        }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { style: { marginBottom: '12px' }, children: _jsx("input", { type: "text", style: { width: '100%', padding: '8px 12px', border: '1px solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', fontSize: 'var(--grid-font-size, 14px)', outline: 'none', backgroundColor: 'var(--grid-bg)', color: 'var(--grid-text)' }, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search values...", autoFocus: true }) }), _jsx("div", { style: { marginBottom: '8px' }, children: _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '4px' }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent', children: [_jsx("input", { type: "checkbox", checked: selectedValues.size === filteredValues.length && filteredValues.length > 0, onChange: handleSelectAll, style: { width: '16px', height: '16px', cursor: 'pointer' } }), _jsx("span", { style: { fontSize: 'var(--grid-font-size, 14px)', fontWeight: 500, color: 'var(--grid-text)' }, children: "(Select All)" })] }) }), _jsx("div", { style: { flex: 1, overflowY: 'auto', marginBottom: '12px', border: '1px solid var(--grid-border)', borderRadius: 'var(--grid-border-radius, 6px)', maxHeight: '200px' }, children: filteredValues.map((value, idx) => (_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent', children: [_jsx("input", { type: "checkbox", checked: selectedValues.has(value), onChange: () => handleToggle(value), style: { width: '16px', height: '16px', cursor: 'pointer' } }), _jsx("span", { style: { fontSize: 'var(--grid-font-size, 14px)', color: 'var(--grid-text)' }, children: String(value) })] }, idx))) }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--grid-border)' }, children: [_jsx("button", { style: {
                            padding: '6px 12px',
                            fontSize: 'var(--grid-font-size, 14px)',
                            color: 'var(--grid-text)',
                            backgroundColor: 'var(--grid-bg-alt)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                        }, onClick: handleClear, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg-alt)', children: "Clear" }), _jsxs("button", { style: {
                            padding: '6px 12px',
                            fontSize: 'var(--grid-font-size, 14px)',
                            color: 'var(--grid-text-inverse)',
                            backgroundColor: 'var(--grid-primary)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                        }, onClick: handleApply, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary)', children: ["Apply (", selectedValues.size, ")"] })] })] }));
};
// Multi-Select Filter Component
const MultiSelectFilterMenu = ({ column, filterValue, onApplyFilter, onClose, rows, anchorEl }) => {
    // Similar to SetFilter but with different UI/UX
    return _jsx(SetFilterMenu, { column: column, filterValue: filterValue, onApplyFilter: onApplyFilter, onClose: onClose, rows: rows, anchorEl: anchorEl });
};
// Floating Filter Row Component
export const ColumnFilters = ({ columns, displayColumnOrder, columnWidths, filterConfig, dispatch, pinnedLeft, pinnedRight, rows, }) => {
    const [openFilterMenu, setOpenFilterMenu] = useState(null);
    const [filterAnchors, setFilterAnchors] = useState({});
    const [advancedFilterField, setAdvancedFilterField] = useState(null);
    const pinnedLeftSet = new Set(pinnedLeft);
    const pinnedRightSet = new Set(pinnedRight);
    const leftOffsets = {};
    let leftAccumulator = 0;
    pinnedLeft.forEach((field) => {
        leftOffsets[field] = leftAccumulator;
        leftAccumulator += columnWidths[field] || 150;
    });
    const rightOffsets = {};
    let rightAccumulator = 0;
    [...pinnedRight].reverse().forEach((field) => {
        rightOffsets[field] = rightAccumulator;
        rightAccumulator += columnWidths[field] || 150;
    });
    const columnMap = new Map(columns.map(col => [col.field, col]));
    const getStickyStyle = (field) => {
        const width = `${columnWidths[field] || 150}px`;
        const style = { width };
        if (pinnedLeftSet.has(field)) {
            style.position = 'sticky';
            style.left = `${leftOffsets[field]}px`;
            style.zIndex = 20;
            style.backgroundColor = 'var(--grid-header-bg)';
        }
        else if (pinnedRightSet.has(field)) {
            style.position = 'sticky';
            style.right = `${rightOffsets[field]}px`;
            style.zIndex = 20;
            style.backgroundColor = 'var(--grid-header-bg)';
        }
        return style;
    };
    const getFilterType = (column) => {
        // Check if column has explicit filterType
        if (column.filterType)
            return column.filterType;
        // Otherwise infer from field name
        const field = column.field.toLowerCase();
        if (field.includes('date') || field.includes('time'))
            return 'date';
        if (field.includes('salary') || field.includes('price') || field.includes('amount') || field.includes('count'))
            return 'number';
        if (field.includes('status') || field.includes('department') || field.includes('category'))
            return 'set';
        return 'text';
    };
    const handleFilterClick = (field, event) => {
        event.stopPropagation();
        const filterValue = filterConfig[field];
        // If it's already an advanced filter or right-clicked, show advanced
        if (isAdvancedFilter(filterValue) || event.shiftKey) {
            setFilterAnchors({ ...filterAnchors, [field]: event.currentTarget });
            setAdvancedFilterField(field);
            setOpenFilterMenu(null);
        }
        else {
            setFilterAnchors({ ...filterAnchors, [field]: event.currentTarget });
            setOpenFilterMenu(field);
            setAdvancedFilterField(null);
        }
    };
    const handleCloseFilter = () => {
        setOpenFilterMenu(null);
        setAdvancedFilterField(null);
    };
    const handleApplyFilter = (field, value) => {
        dispatch({ type: 'SET_FILTER', payload: { field, value } });
    };
    const handleSwitchToAdvanced = (field) => {
        setOpenFilterMenu(null);
        setAdvancedFilterField(field);
    };
    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (openFilterMenu) {
                setOpenFilterMenu(null);
            }
        };
        if (openFilterMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openFilterMenu]);
    const renderFilterMenu = (column) => {
        const filterType = getFilterType(column);
        const filterValue = filterConfig[column.field];
        const anchorEl = filterAnchors[column.field];
        const commonProps = {
            column,
            filterValue,
            onApplyFilter: (value) => handleApplyFilter(column.field, value),
            onClose: handleCloseFilter,
            rows,
            anchorEl,
            showAdvancedButton: true,
            onSwitchToAdvanced: () => handleSwitchToAdvanced(column.field),
        };
        switch (filterType) {
            case 'number':
                return _jsx(NumberFilterMenu, { ...commonProps });
            case 'date':
                return _jsx(DateFilterMenu, { ...commonProps });
            case 'set':
                return _jsx(SetFilterMenu, { ...commonProps });
            case 'multi':
                return _jsx(MultiSelectFilterMenu, { ...commonProps });
            default:
                return _jsx(TextFilterMenu, { ...commonProps });
        }
    };
    const renderAdvancedFilterMenu = (column) => {
        const filterValue = filterConfig[column.field];
        const anchorEl = filterAnchors[column.field];
        const advancedFilter = isAdvancedFilter(filterValue) ? filterValue : null;
        return (_jsx(AdvancedFilterBuilder, { column: column, filterValue: advancedFilter, onApply: (value) => handleApplyFilter(column.field, value), onClose: handleCloseFilter, rows: rows, anchorEl: anchorEl }));
    };
    const getFilterDisplayText = (field) => {
        const filterValue = filterConfig[field];
        if (!filterValue)
            return '';
        // Handle advanced filter
        if (isAdvancedFilter(filterValue)) {
            const condCount = filterValue.conditions.length;
            return `${condCount} condition${condCount > 1 ? 's' : ''} (${filterValue.operator})`;
        }
        if (filterValue.type === 'set' && filterValue.values) {
            return `${filterValue.values.length} selected`;
        }
        if (filterValue.type === 'inRange') {
            return `${filterValue.value} - ${filterValue.value2}`;
        }
        return String(filterValue.value || '');
    };
    const hasActiveFilter = (field) => {
        return !!filterConfig[field];
    };
    return (_jsx(_Fragment, { children: _jsx("div", { style: { display: 'flex', minWidth: '100%', borderBottom: '1px solid var(--grid-border)', backgroundColor: 'var(--grid-header-bg)' }, children: displayColumnOrder.map((field) => {
                const column = columnMap.get(field);
                if (!column || column.filterable === false) {
                    return (_jsx("div", { style: {
                            ...getStickyStyle(field),
                            borderRight: '1px solid var(--grid-border)',
                            flexShrink: 0,
                            minHeight: '38px',
                        } }, field));
                }
                const isActive = hasActiveFilter(field);
                return (_jsxs("div", { style: {
                        ...getStickyStyle(field),
                        borderRight: '1px solid var(--grid-border)',
                        flexShrink: 0,
                        padding: '6px 8px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                    }, children: [_jsx("div", { style: {
                                width: '100%',
                                cursor: 'pointer',
                            }, onClick: (e) => handleFilterClick(field, e), title: "Click to filter, Shift+Click for advanced filter", children: _jsxs("div", { style: {
                                    width: '100%',
                                    padding: '4px 8px',
                                    fontSize: 'var(--grid-font-size-sm, 12px)',
                                    border: '1px solid',
                                    borderColor: isActive ? 'var(--grid-primary)' : 'var(--grid-border)',
                                    borderRadius: 'var(--grid-border-radius, 4px)',
                                    backgroundColor: isActive ? 'var(--grid-primary-bg)' : 'var(--grid-bg)',
                                    color: isActive ? 'var(--grid-primary)' : 'var(--grid-text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '6px',
                                    transition: 'border-color 0.15s',
                                }, onMouseEnter: (e) => {
                                    if (!isActive)
                                        e.currentTarget.style.borderColor = 'var(--grid-border-hover)';
                                }, onMouseLeave: (e) => {
                                    if (!isActive)
                                        e.currentTarget.style.borderColor = 'var(--grid-border)';
                                }, children: [_jsx("span", { style: {
                                            flex: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }, children: isActive ? getFilterDisplayText(field) : 'Filter...' }), _jsx("svg", { style: {
                                            flexShrink: 0,
                                            color: isActive ? 'var(--grid-primary)' : 'var(--grid-text-muted)',
                                        }, width: "12", height: "12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: "2.5", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 4h18v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V20l-4-2v-3.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" }) })] }) }), openFilterMenu === field && renderFilterMenu(column), advancedFilterField === field && renderAdvancedFilterMenu(column)] }, field));
            }) }) }));
};
