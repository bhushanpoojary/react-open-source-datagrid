// NumericEditor - Numeric input editor with stepper buttons and validation

import React, { useState, useEffect } from 'react';
import type { DataGridEditorProps } from './editorTypes';
import {
  useEditorKeyboardNavigation,
  useEditorAutoFocus,
  formatNumber,
  parseFormattedNumber,
} from './editorUtils';
import './editors.css';

export interface NumericEditorProps<TRow = any>
  extends DataGridEditorProps<number | null, TRow> {
  /** Minimum allowed value */
  min?: number;
  
  /** Maximum allowed value */
  max?: number;
  
  /** Step size for increment/decrement */
  step?: number;
  
  /** Number of decimal places to display */
  decimals?: number;
  
  /** Prefix text (e.g., "$", "€") */
  prefix?: string;
  
  /** Suffix text (e.g., "kg", "%", "USD") */
  suffix?: string;
  
  /** Allow negative numbers */
  allowNegative?: boolean;
  
  /** Show stepper buttons */
  showSteppers?: boolean;
  
  /** Thousands separator character */
  thousandsSeparator?: string;
  
  /** Decimal separator character */
  decimalSeparator?: string;
}

/**
 * NumericEditor component for DataGrid cells.
 * Provides numeric input with optional stepper buttons and validation.
 */
export function NumericEditor<TRow = any>(
  props: NumericEditorProps<TRow>
): React.ReactElement {
  const {
    value,
    onChange,
    onCommit,
    onCancel,
    autoFocus = true,
    min,
    max,
    step = 1,
    decimals = 0,
    prefix = '',
    suffix = '',
    allowNegative = true,
    showSteppers = true,
    thousandsSeparator = ',',
    decimalSeparator = '.',
  } = props;

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(true);
  
  const inputRef = useEditorAutoFocus<HTMLInputElement>(autoFocus, true);

  // Initialize and format value
  useEffect(() => {
    if (value !== null && value !== undefined) {
      if (isFocused) {
        // Show raw number while editing
        queueMicrotask(() => setInputValue(String(value)));
      } else {
        // Show formatted number when not focused
        queueMicrotask(() => setInputValue(formatNumber(value, decimals, thousandsSeparator, decimalSeparator)));
      }
    } else {
      queueMicrotask(() => setInputValue(''));
    }
  }, [value, isFocused, decimals, thousandsSeparator, decimalSeparator]);

  // Clamp value to min/max
  const clampValue = (val: number): number => {
    let clamped = val;
    if (min !== undefined && clamped < min) clamped = min;
    if (max !== undefined && clamped > max) clamped = max;
    return clamped;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Allow empty input
    if (newValue === '' || newValue === '-') {
      onChange(null);
      return;
    }

    // Remove prefix/suffix and thousands separators
    let cleaned = newValue;
    if (prefix) cleaned = cleaned.replace(prefix, '');
    if (suffix) cleaned = cleaned.replace(suffix, '');
    
    const parsed = parseFormattedNumber(cleaned, thousandsSeparator, decimalSeparator);
    
    if (parsed !== null && !isNaN(parsed)) {
      // Validate negative numbers
      if (!allowNegative && parsed < 0) {
        return;
      }
      
      const clamped = clampValue(parsed);
      onChange(clamped);
    }
  };

  // Handle increment/decrement
  const handleIncrement = () => {
    const currentValue = value ?? 0;
    const newValue = clampValue(currentValue + step);
    onChange(newValue);
    setInputValue(String(newValue));
  };

  const handleDecrement = () => {
    const currentValue = value ?? 0;
    const newValue = clampValue(currentValue - step);
    onChange(newValue);
    setInputValue(String(newValue));
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (value !== null && value !== undefined) {
      setInputValue(String(value));
    }
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    
    // Format the value on blur
    if (value !== null && value !== undefined) {
      const formatted = formatNumber(value, decimals, thousandsSeparator, decimalSeparator);
      setInputValue(formatted);
    }
    
    // Commit on blur
    setTimeout(() => onCommit(), 100);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Arrow up/down to increment/decrement
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  // Keyboard navigation for commit/cancel
  const { handleKeyDown: handleEditorKeyDown } = useEditorKeyboardNavigation(
    {
      onEnter: onCommit,
      onEscape: onCancel,
    },
    {
      commitOnTab: true,
      commitOnBlur: false,
      preventDefault: false, // Let handleKeyDown handle arrow keys
    }
  );

  // Combine key handlers
  const handleCombinedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e);
    handleEditorKeyDown(e);
  };

  // Display value with prefix/suffix
  const displayValue = isFocused
    ? inputValue
    : inputValue
    ? `${prefix}${inputValue}${suffix}`
    : '';

  return (
    <div className="editor-container editor-numeric-container">
      <div className="editor-input-wrapper">
        {prefix && !isFocused && (
          <span className="editor-numeric-prefix">{prefix}</span>
        )}
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          className="editor-input editor-numeric-input"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleCombinedKeyDown}
          aria-label="Numeric input"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value ?? undefined}
          autoComplete="off"
        />
        {suffix && !isFocused && (
          <span className="editor-numeric-suffix">{suffix}</span>
        )}
        
        {showSteppers && (
          <div className="editor-numeric-steppers">
            <button
              type="button"
              className="editor-numeric-stepper editor-numeric-increment"
              onClick={handleIncrement}
              onMouseDown={(e) => e.preventDefault()}
              disabled={max !== undefined && (value ?? 0) >= max}
              aria-label="Increment"
              tabIndex={-1}
            >
              ▲
            </button>
            <button
              type="button"
              className="editor-numeric-stepper editor-numeric-decrement"
              onClick={handleDecrement}
              onMouseDown={(e) => e.preventDefault()}
              disabled={min !== undefined && (value ?? 0) <= min}
              aria-label="Decrement"
              tabIndex={-1}
            >
              ▼
            </button>
          </div>
        )}
      </div>
      
      {(min !== undefined || max !== undefined) && (
        <div className="editor-numeric-range">
          {min !== undefined && <span>Min: {min}</span>}
          {max !== undefined && <span>Max: {max}</span>}
        </div>
      )}
    </div>
  );
}

NumericEditor.displayName = 'NumericEditor';
