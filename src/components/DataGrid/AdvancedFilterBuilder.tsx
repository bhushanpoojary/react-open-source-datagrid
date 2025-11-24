import React, { useState } from 'react';
import type { Column, FilterCondition, AdvancedFilterValue, Row } from './types';

interface AdvancedFilterBuilderProps {
  column: Column;
  filterValue: AdvancedFilterValue | null;
  onApply: (value: AdvancedFilterValue | null) => void;
  onClose: () => void;
  rows: Row[];
  anchorEl: HTMLElement | null;
}

// Helper to get filter type based on column
const getColumnFilterType = (column: Column): 'text' | 'number' | 'date' | 'set' => {
  if (column.filterType) {
    if (column.filterType === 'multi') return 'set';
    return column.filterType as 'text' | 'number' | 'date' | 'set';
  }
  
  const field = column.field.toLowerCase();
  if (field.includes('date') || field.includes('time')) return 'date';
  if (field.includes('salary') || field.includes('price') || field.includes('amount') || field.includes('count')) return 'number';
  if (field.includes('status') || field.includes('department') || field.includes('category')) return 'set';
  return 'text';
};

// Get filter operations based on filter type
const getFilterOperations = (filterType: 'text' | 'number' | 'date' | 'set'): { value: string; label: string }[] => {
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
const requiresValue = (type: string): boolean => {
  return !['isEmpty', 'isNotEmpty'].includes(type);
};

// Check if operation requires second value (range)
const requiresSecondValue = (type: string): boolean => {
  return type === 'inRange';
};

// Check if operation supports multi-select values
const supportsMultipleValues = (type: string): boolean => {
  return ['in', 'notIn'].includes(type);
};

export const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps> = ({
  column,
  filterValue,
  onApply,
  onClose,
  rows,
  anchorEl,
}) => {
  const filterType = getColumnFilterType(column);
  const operations = getFilterOperations(filterType);

  // Initialize conditions
  const initialConditions: FilterCondition[] = filterValue?.conditions || [
    { type: operations[0]?.value || 'contains', value: '', value2: '', values: [] }
  ];

  const [operator, setOperator] = useState<'AND' | 'OR'>(filterValue?.operator || 'AND');
  const [conditions, setConditions] = useState<FilterCondition[]>(initialConditions);
  const [tempStates, setTempStates] = useState<Record<number, any>>({});

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

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
      const newTempStates = { ...tempStates };
      delete newTempStates[index];
      setTempStates(newTempStates);
    }
  };

  const updateCondition = (index: number, updates: Partial<FilterCondition>) => {
    setConditions(conditions.map((cond, i) => 
      i === index ? { ...cond, ...updates } : cond
    ));
  };

  const updateTempState = (index: number, state: any) => {
    setTempStates({ ...tempStates, [index]: state });
  };

  const handleApply = () => {
    // Validate conditions
    const validConditions = conditions.filter(cond => {
      if (!requiresValue(cond.type)) return true;
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
    } else {
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

  const renderConditionInput = (condition: FilterCondition, index: number) => {
    // Set/Multi-select filter
    if (supportsMultipleValues(condition.type)) {
      const selectedValues = new Set(condition.values || []);
      const searchTerm = tempStates[index]?.searchTerm || '';
      
      const filteredValues = uniqueValues.filter(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

      const handleToggle = (value: any) => {
        const newSelected = new Set(selectedValues);
        if (newSelected.has(value)) {
          newSelected.delete(value);
        } else {
          newSelected.add(value);
        }
        updateCondition(index, { values: Array.from(newSelected) });
      };

      const handleSelectAll = () => {
        if (selectedValues.size === filteredValues.length) {
          updateCondition(index, { values: [] });
        } else {
          updateCondition(index, { values: filteredValues });
        }
      };

      return (
        <div style={{ marginTop: '8px' }}>
          <input
            type="text"
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid var(--grid-border)',
              borderRadius: 'var(--grid-border-radius, 4px)',
              fontSize: 'var(--grid-font-size-sm, 12px)',
              outline: 'none',
              backgroundColor: 'var(--grid-bg)',
              color: 'var(--grid-text)',
              marginBottom: '8px',
            }}
            value={searchTerm}
            onChange={(e) => updateTempState(index, { searchTerm: e.target.value })}
            placeholder="Search values..."
          />
          <div style={{ 
            maxHeight: '150px', 
            overflowY: 'auto', 
            border: '1px solid var(--grid-border)', 
            borderRadius: 'var(--grid-border-radius, 4px)',
            padding: '4px'
          }}>
            <label
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                cursor: 'pointer', 
                padding: '4px 6px',
                fontSize: 'var(--grid-font-size-sm, 12px)',
              }}
            >
              <input
                type="checkbox"
                checked={selectedValues.size === filteredValues.length && filteredValues.length > 0}
                onChange={handleSelectAll}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 500, color: 'var(--grid-text)' }}>(Select All)</span>
            </label>
            {filteredValues.map((value, idx) => (
              <label
                key={idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  cursor: 'pointer', 
                  padding: '4px 6px',
                  fontSize: 'var(--grid-font-size-sm, 12px)',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.has(value)}
                  onChange={() => handleToggle(value)}
                  style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--grid-text)' }}>{String(value)}</span>
              </label>
            ))}
          </div>
          {selectedValues.size > 0 && (
            <div style={{ 
              marginTop: '6px', 
              fontSize: 'var(--grid-font-size-sm, 12px)', 
              color: 'var(--grid-primary)',
              fontWeight: 500
            }}>
              {selectedValues.size} selected
            </div>
          )}
        </div>
      );
    }

    // No input needed for isEmpty/isNotEmpty
    if (!requiresValue(condition.type)) {
      return null;
    }

    // Range inputs
    if (requiresSecondValue(condition.type)) {
      return (
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type={filterType === 'date' ? 'date' : filterType === 'number' ? 'number' : 'text'}
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid var(--grid-border)',
              borderRadius: 'var(--grid-border-radius, 4px)',
              fontSize: 'var(--grid-font-size-sm, 12px)',
              outline: 'none',
              backgroundColor: 'var(--grid-bg)',
              color: 'var(--grid-text)',
            }}
            value={condition.value || ''}
            onChange={(e) => updateCondition(index, { value: e.target.value })}
            placeholder="From"
          />
          <span style={{ color: 'var(--grid-text-secondary)', fontSize: 'var(--grid-font-size-sm, 12px)' }}>to</span>
          <input
            type={filterType === 'date' ? 'date' : filterType === 'number' ? 'number' : 'text'}
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid var(--grid-border)',
              borderRadius: 'var(--grid-border-radius, 4px)',
              fontSize: 'var(--grid-font-size-sm, 12px)',
              outline: 'none',
              backgroundColor: 'var(--grid-bg)',
              color: 'var(--grid-text)',
            }}
            value={condition.value2 || ''}
            onChange={(e) => updateCondition(index, { value2: e.target.value })}
            placeholder="To"
          />
        </div>
      );
    }

    // Single value input
    return (
      <div style={{ marginTop: '8px' }}>
        <input
          type={filterType === 'date' ? 'date' : filterType === 'number' ? 'number' : 'text'}
          style={{
            width: '100%',
            padding: '6px 10px',
            border: '1px solid var(--grid-border)',
            borderRadius: 'var(--grid-border-radius, 4px)',
            fontSize: 'var(--grid-font-size-sm, 12px)',
            outline: 'none',
            backgroundColor: 'var(--grid-bg)',
            color: 'var(--grid-text)',
          }}
          value={condition.value || ''}
          onChange={(e) => updateCondition(index, { value: e.target.value })}
          placeholder={`Enter ${filterType}...`}
        />
      </div>
    );
  };

  return (
    <div
      style={{
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
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ 
        marginBottom: '16px', 
        paddingBottom: '12px', 
        borderBottom: '1px solid var(--grid-border)' 
      }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: 'var(--grid-font-size, 14px)', 
          fontWeight: 600, 
          color: 'var(--grid-text)' 
        }}>
          Advanced Filter: {column.headerName}
        </h4>
        <p style={{ 
          margin: '4px 0 0 0', 
          fontSize: 'var(--grid-font-size-sm, 12px)', 
          color: 'var(--grid-text-secondary)' 
        }}>
          Add multiple conditions with AND/OR logic
        </p>
      </div>

      {/* Operator Selection */}
      {conditions.length > 1 && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: 'var(--grid-font-size-sm, 12px)', 
            fontWeight: 500, 
            color: 'var(--grid-text)', 
            marginBottom: '6px' 
          }}>
            Combine Conditions
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
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
              }}
              onClick={() => setOperator('AND')}
            >
              AND
            </button>
            <button
              style={{
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
              }}
              onClick={() => setOperator('OR')}
            >
              OR
            </button>
          </div>
        </div>
      )}

      {/* Conditions */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
        {conditions.map((condition, index) => (
          <div
            key={index}
            style={{
              marginBottom: '12px',
              padding: '12px',
              backgroundColor: 'var(--grid-bg-alt)',
              borderRadius: 'var(--grid-border-radius, 6px)',
              border: '1px solid var(--grid-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ 
                fontSize: 'var(--grid-font-size-sm, 12px)', 
                fontWeight: 500, 
                color: 'var(--grid-text)' 
              }}>
                Condition {index + 1}
              </label>
              {conditions.length > 1 && (
                <button
                  style={{
                    padding: '2px 8px',
                    fontSize: 'var(--grid-font-size-sm, 12px)',
                    color: 'var(--grid-danger, #dc2626)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 'var(--grid-border-radius, 4px)',
                  }}
                  onClick={() => removeCondition(index)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-danger-bg, rgba(220, 38, 38, 0.1))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Remove condition"
                >
                  ✕
                </button>
              )}
            </div>
            
            <select
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid var(--grid-border)',
                borderRadius: 'var(--grid-border-radius, 4px)',
                fontSize: 'var(--grid-font-size-sm, 12px)',
                outline: 'none',
                backgroundColor: 'var(--grid-bg)',
                color: 'var(--grid-text)',
              }}
              value={condition.type}
              onChange={(e) => updateCondition(index, { type: e.target.value, value: '', value2: '', values: [] })}
            >
              {operations.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>

            {renderConditionInput(condition, index)}

            {index < conditions.length - 1 && conditions.length > 1 && (
              <div style={{
                marginTop: '12px',
                padding: '4px 8px',
                textAlign: 'center',
                fontSize: 'var(--grid-font-size-sm, 12px)',
                fontWeight: 600,
                color: 'var(--grid-primary)',
                backgroundColor: 'var(--grid-primary-bg)',
                borderRadius: 'var(--grid-border-radius, 4px)',
              }}>
                {operator}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Condition Button */}
      <button
        style={{
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
        }}
        onClick={addCondition}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover-bg)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-bg)'}
      >
        + Add Condition
      </button>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        paddingTop: '12px', 
        borderTop: '1px solid var(--grid-border)' 
      }}>
        <button
          style={{
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
          }}
          onClick={handleReset}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg-alt)'}
        >
          Reset
        </button>
        <button
          style={{
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
          }}
          onClick={handleClear}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg-alt)'}
        >
          Clear
        </button>
        <button
          style={{
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
          }}
          onClick={handleApply}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-primary)'}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
