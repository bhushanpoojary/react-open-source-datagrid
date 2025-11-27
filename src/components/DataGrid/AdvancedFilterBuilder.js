import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
// Helper to get filter type based on column
const getColumnFilterType = (column) => {
    if (column.filterType) {
        if (column.filterType === 'multi')
            return 'set';
        return column.filterType;
    }
    const field = column.field.toLowerCase();
    if (field.includes('date') || field.includes('time'))
        return 'date';
    if (field.includes('salary') || field.includes('price') || field.includes('amount') || field.includes('count'))
        return 'number';
    if (field.includes('status') || field.includes('department') || field.includes('category'))
        return 'set';
    return 'text';
};
// Get filter operations based on filter type
const getFilterOperations = (filterType) => {
    switch (filterType) {
        case 'text':
            return [
                { value: 'contains', label: 'Contains' },
                { value: 'notContains', label: 'Not Contains' },
                { value: 'equals', label: 'Equals' },
                { value: 'notEquals', label: 'Not Equals' },
                { value: 'startsWith', label: 'Starts With' },
                { value: 'endsWith', label: 'Ends With' },
                { value: 'isEmpty', label: 'Is Empty' },
                { value: 'isNotEmpty', label: 'Is Not Empty' },
            ];
        case 'number':
            return [
                { value: 'equals', label: 'Equals' },
                { value: 'notEquals', label: 'Not Equals' },
                { value: 'greaterThan', label: 'Greater Than' },
                { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
                { value: 'lessThan', label: 'Less Than' },
                { value: 'lessThanOrEqual', label: 'Less Than or Equal' },
                { value: 'inRange', label: 'In Range' },
                { value: 'isEmpty', label: 'Is Empty' },
                { value: 'isNotEmpty', label: 'Is Not Empty' },
            ];
        case 'date':
            return [
                { value: 'equals', label: 'Equals' },
                { value: 'before', label: 'Before' },
                { value: 'after', label: 'After' },
                { value: 'inRange', label: 'In Range' },
                { value: 'isEmpty', label: 'Is Empty' },
                { value: 'isNotEmpty', label: 'Is Not Empty' },
            ];
        case 'set':
            return [
                { value: 'in', label: 'In' },
                { value: 'notIn', label: 'Not In' },
            ];
        default:
            return [];
    }
};
// Check if operation requires value input
const requiresValue = (type) => {
    return !['isEmpty', 'isNotEmpty'].includes(type);
};
// Check if operation requires second value (range)
const requiresSecondValue = (type) => {
    return type === 'inRange';
};
// Check if operation supports multi-select values
const supportsMultipleValues = (type) => {
    return ['in', 'notIn'].includes(type);
};
export const AdvancedFilterBuilder = ({ column, filterValue, onApply, onClose, rows, anchorEl, }) => {
    const filterType = getColumnFilterType(column);
    const operations = getFilterOperations(filterType);
    // Initialize conditions
    const initialConditions = filterValue?.conditions || [
        { type: operations[0]?.value || 'contains', value: '', value2: '', values: [] }
    ];
    const [operator, setOperator] = useState(filterValue?.operator || 'AND');
    const [conditions, setConditions] = useState(initialConditions);
    const [tempStates, setTempStates] = useState({});
    // Get unique values for set filter
    const uniqueValues = filterType === 'set'
        ? Array.from(new Set(rows.map(row => row[column.field]).filter(v => v != null)))
        : [];
    const addCondition = () => {
        setConditions([
            ...conditions,
            { type: operations[0]?.value || 'contains', value: '', value2: '', values: [] }
        ]);
    };
    const removeCondition = (index) => {
        if (conditions.length > 1) {
            setConditions(conditions.filter((_, i) => i !== index));
            const newTempStates = { ...tempStates };
            delete newTempStates[index];
            setTempStates(newTempStates);
        }
    };
    const updateCondition = (index, updates) => {
        setConditions(conditions.map((cond, i) => i === index ? { ...cond, ...updates } : cond));
    };
    const updateTempState = (index, state) => {
        setTempStates({ ...tempStates, [index]: state });
    };
    const handleApply = () => {
        // Validate conditions
        const validConditions = conditions.filter(cond => {
            if (!requiresValue(cond.type))
                return true;
            if (supportsMultipleValues(cond.type)) {
                return cond.values && cond.values.length > 0;
            }
            if (requiresSecondValue(cond.type)) {
                return cond.value != null && cond.value !== '' && cond.value2 != null && cond.value2 !== '';
            }
            return cond.value != null && cond.value !== '';
        });
        if (validConditions.length === 0) {
            onApply(null);
        }
        else {
            onApply({
                operator,
                conditions: validConditions
            });
        }
        onClose();
    };
    const handleClear = () => {
        setConditions([{ type: operations[0]?.value || 'contains', value: '', value2: '', values: [] }]);
        setTempStates({});
        onApply(null);
    };
    const handleReset = () => {
        setConditions([{ type: operations[0]?.value || 'contains', value: '', value2: '', values: [] }]);
        setOperator('AND');
        setTempStates({});
    };
    const renderConditionInput = (condition, index) => {
        // Set/Multi-select filter
        if (supportsMultipleValues(condition.type)) {
            const selectedValues = new Set(condition.values || []);
            const searchTerm = tempStates[index]?.searchTerm || '';
            const filteredValues = uniqueValues.filter(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
            const handleToggle = (value) => {
                const newSelected = new Set(selectedValues);
                if (newSelected.has(value)) {
                    newSelected.delete(value);
                }
                else {
                    newSelected.add(value);
                }
                updateCondition(index, { values: Array.from(newSelected) });
            };
            const handleSelectAll = () => {
                if (selectedValues.size === filteredValues.length) {
                    updateCondition(index, { values: [] });
                }
                else {
                    updateCondition(index, { values: filteredValues });
                }
            };
            return (_jsxs("div", { style: { marginTop: '8px' }, children: [_jsx("input", { type: "text", style: {
                            width: '100%',
                            padding: '6px 10px',
                            border: '1px solid var(--grid-border)',
                            borderRadius: 'var(--grid-border-radius, 4px)',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            outline: 'none',
                            backgroundColor: 'var(--grid-bg)',
                            color: 'var(--grid-text)',
                            marginBottom: '8px',
                        }, value: searchTerm, onChange: (e) => updateTempState(index, { searchTerm: e.target.value }), placeholder: "Search values..." }), _jsxs("div", { style: {
                            maxHeight: '150px',
                            overflowY: 'auto',
                            border: '1px solid var(--grid-border)',
                            borderRadius: 'var(--grid-border-radius, 4px)',
                            padding: '4px'
                        }, children: [_jsxs("label", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    padding: '4px 6px',
                                    fontSize: 'var(--grid-font-size-sm, 12px)',
                                }, children: [_jsx("input", { type: "checkbox", checked: selectedValues.size === filteredValues.length && filteredValues.length > 0, onChange: handleSelectAll, style: { width: '14px', height: '14px', cursor: 'pointer' } }), _jsx("span", { style: { fontWeight: 500, color: 'var(--grid-text)' }, children: "(Select All)" })] }), filteredValues.map((value, idx) => (_jsxs("label", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    padding: '4px 6px',
                                    fontSize: 'var(--grid-font-size-sm, 12px)',
                                }, children: [_jsx("input", { type: "checkbox", checked: selectedValues.has(value), onChange: () => handleToggle(value), style: { width: '14px', height: '14px', cursor: 'pointer' } }), _jsx("span", { style: { color: 'var(--grid-text)' }, children: String(value) })] }, idx)))] }), selectedValues.size > 0 && (_jsxs("div", { style: {
                            marginTop: '6px',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            color: 'var(--grid-primary)',
                            fontWeight: 500
                        }, children: [selectedValues.size, " selected"] }))] }));
        }
        // No input needed for isEmpty/isNotEmpty
        if (!requiresValue(condition.type)) {
            return null;
        }
        // Range inputs
        if (requiresSecondValue(condition.type)) {
            return (_jsxs("div", { style: { marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }, children: [_jsx("input", { type: filterType === 'date' ? 'date' : filterType === 'number' ? 'number' : 'text', style: {
                            flex: 1,
                            padding: '6px 10px',
                            border: '1px solid var(--grid-border)',
                            borderRadius: 'var(--grid-border-radius, 4px)',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            outline: 'none',
                            backgroundColor: 'var(--grid-bg)',
                            color: 'var(--grid-text)',
                        }, value: condition.value || '', onChange: (e) => updateCondition(index, { value: e.target.value }), placeholder: "From" }), _jsx("span", { style: { color: 'var(--grid-text-secondary)', fontSize: 'var(--grid-font-size-sm, 12px)' }, children: "to" }), _jsx("input", { type: filterType === 'date' ? 'date' : filterType === 'number' ? 'number' : 'text', style: {
                            flex: 1,
                            padding: '6px 10px',
                            border: '1px solid var(--grid-border)',
                            borderRadius: 'var(--grid-border-radius, 4px)',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            outline: 'none',
                            backgroundColor: 'var(--grid-bg)',
                            color: 'var(--grid-text)',
                        }, value: condition.value2 || '', onChange: (e) => updateCondition(index, { value2: e.target.value }), placeholder: "To" })] }));
        }
        // Single value input
        return (_jsx("div", { style: { marginTop: '8px' }, children: _jsx("input", { type: filterType === 'date' ? 'date' : filterType === 'number' ? 'number' : 'text', style: {
                    width: '100%',
                    padding: '6px 10px',
                    border: '1px solid var(--grid-border)',
                    borderRadius: 'var(--grid-border-radius, 4px)',
                    fontSize: 'var(--grid-font-size-sm, 12px)',
                    outline: 'none',
                    backgroundColor: 'var(--grid-bg)',
                    color: 'var(--grid-text)',
                }, value: condition.value || '', onChange: (e) => updateCondition(index, { value: e.target.value }), placeholder: `Enter ${filterType}...` }) }));
    };
    return (_jsxs("div", { style: {
            position: 'fixed',
            top: anchorEl ? anchorEl.getBoundingClientRect().bottom + 5 : 0,
            left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
            minWidth: '380px',
            maxWidth: '450px',
            maxHeight: '600px',
            backgroundColor: 'var(--grid-bg)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            borderRadius: 'var(--grid-border-radius, 8px)',
            border: '1px solid var(--grid-border)',
            padding: '16px',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { style: {
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--grid-border)'
                }, children: [_jsxs("h4", { style: {
                            margin: 0,
                            fontSize: 'var(--grid-font-size, 14px)',
                            fontWeight: 600,
                            color: 'var(--grid-text)'
                        }, children: ["Advanced Filter: ", column.headerName] }), _jsx("p", { style: {
                            margin: '4px 0 0 0',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            color: 'var(--grid-text-secondary)'
                        }, children: "Add multiple conditions with AND/OR logic" })] }), conditions.length > 1 && (_jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: {
                            display: 'block',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            fontWeight: 500,
                            color: 'var(--grid-text)',
                            marginBottom: '6px'
                        }, children: "Combine Conditions" }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { style: {
                                    flex: 1,
                                    padding: '6px 12px',
                                    fontSize: 'var(--grid-font-size-sm, 12px)',
                                    fontWeight: 500,
                                    color: operator === 'AND' ? 'var(--grid-text-inverse)' : 'var(--grid-text)',
                                    backgroundColor: operator === 'AND' ? 'var(--grid-primary)' : 'var(--grid-bg-alt)',
                                    border: operator === 'AND' ? 'none' : '1px solid var(--grid-border)',
                                    borderRadius: 'var(--grid-border-radius, 6px)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }, onClick: () => setOperator('AND'), children: "AND" }), _jsx("button", { style: {
                                    flex: 1,
                                    padding: '6px 12px',
                                    fontSize: 'var(--grid-font-size-sm, 12px)',
                                    fontWeight: 500,
                                    color: operator === 'OR' ? 'var(--grid-text-inverse)' : 'var(--grid-text)',
                                    backgroundColor: operator === 'OR' ? 'var(--grid-primary)' : 'var(--grid-bg-alt)',
                                    border: operator === 'OR' ? 'none' : '1px solid var(--grid-border)',
                                    borderRadius: 'var(--grid-border-radius, 6px)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }, onClick: () => setOperator('OR'), children: "OR" })] })] })), _jsx("div", { style: { flex: 1, overflowY: 'auto', marginBottom: '12px' }, children: conditions.map((condition, index) => (_jsxs("div", { style: {
                        marginBottom: '12px',
                        padding: '12px',
                        backgroundColor: 'var(--grid-bg-alt)',
                        borderRadius: 'var(--grid-border-radius, 6px)',
                        border: '1px solid var(--grid-border)',
                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }, children: [_jsxs("label", { style: {
                                        fontSize: 'var(--grid-font-size-sm, 12px)',
                                        fontWeight: 500,
                                        color: 'var(--grid-text)'
                                    }, children: ["Condition ", index + 1] }), conditions.length > 1 && (_jsx("button", { style: {
                                        padding: '2px 8px',
                                        fontSize: 'var(--grid-font-size-sm, 12px)',
                                        color: 'var(--grid-danger, #dc2626)',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: 'var(--grid-border-radius, 4px)',
                                    }, onClick: () => removeCondition(index), onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-danger-bg, rgba(220, 38, 38, 0.1))', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent', title: "Remove condition", children: "\u2715" }))] }), _jsx("select", { style: {
                                width: '100%',
                                padding: '6px 10px',
                                border: '1px solid var(--grid-border)',
                                borderRadius: 'var(--grid-border-radius, 4px)',
                                fontSize: 'var(--grid-font-size-sm, 12px)',
                                outline: 'none',
                                backgroundColor: 'var(--grid-bg)',
                                color: 'var(--grid-text)',
                            }, value: condition.type, onChange: (e) => updateCondition(index, { type: e.target.value, value: '', value2: '', values: [] }), children: operations.map((op) => (_jsx("option", { value: op.value, children: op.label }, op.value))) }), renderConditionInput(condition, index), index < conditions.length - 1 && conditions.length > 1 && (_jsx("div", { style: {
                                marginTop: '12px',
                                padding: '4px 8px',
                                textAlign: 'center',
                                fontSize: 'var(--grid-font-size-sm, 12px)',
                                fontWeight: 600,
                                color: 'var(--grid-primary)',
                                backgroundColor: 'var(--grid-primary-bg)',
                                borderRadius: 'var(--grid-border-radius, 4px)',
                            }, children: operator }))] }, index))) }), _jsx("button", { style: {
                    width: '100%',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    fontSize: 'var(--grid-font-size-sm, 12px)',
                    fontWeight: 500,
                    color: 'var(--grid-primary)',
                    backgroundColor: 'var(--grid-primary-bg)',
                    border: '1px dashed var(--grid-primary)',
                    borderRadius: 'var(--grid-border-radius, 6px)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                }, onClick: addCondition, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover-bg)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-bg)', children: "+ Add Condition" }), _jsxs("div", { style: {
                    display: 'flex',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--grid-border)'
                }, children: [_jsx("button", { style: {
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            fontWeight: 500,
                            color: 'var(--grid-text)',
                            backgroundColor: 'var(--grid-bg-alt)',
                            border: '1px solid var(--grid-border)',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }, onClick: handleReset, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg-alt)', children: "Reset" }), _jsx("button", { style: {
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            fontWeight: 500,
                            color: 'var(--grid-text)',
                            backgroundColor: 'var(--grid-bg-alt)',
                            border: '1px solid var(--grid-border)',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }, onClick: handleClear, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg-alt)', children: "Clear" }), _jsx("button", { style: {
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: 'var(--grid-font-size-sm, 12px)',
                            fontWeight: 500,
                            color: 'var(--grid-text-inverse)',
                            backgroundColor: 'var(--grid-primary)',
                            border: 'none',
                            borderRadius: 'var(--grid-border-radius, 6px)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }, onClick: handleApply, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary)', children: "Apply" })] })] }));
};
