// RichSelectEditor - Searchable dropdown editor for selecting a single option

import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { DataGridEditorProps, EditorOption } from './editorTypes';
import {
  useEditorKeyboardNavigation,
  useEditorAutoFocus,
  useEditorClickOutside,
  usePopupPosition,
  filterOptions,
} from './editorUtils';
import './editors.css';

export interface RichSelectOption extends EditorOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface RichSelectEditorProps<TValue = any, TRow = any>
  extends DataGridEditorProps<TValue, TRow> {
  /** Array of options to select from */
  options: RichSelectOption[];
  
  /** Placeholder text when no value selected */
  placeholder?: string;
  
  /** Allow clearing the selected value */
  allowClear?: boolean;
  
  /** Enable filtering/search functionality */
  filterable?: boolean;
  
  /** Custom render function for option labels */
  renderOptionLabel?: (option: RichSelectOption) => React.ReactNode;
  
  /** Maximum height of dropdown in pixels */
  maxDropdownHeight?: number;
}

/**
 * RichSelectEditor component for DataGrid cells.
 * Provides a searchable dropdown for selecting a single option from a list.
 */
export function RichSelectEditor<TValue = any, TRow = any>(
  props: RichSelectEditorProps<TValue, TRow>
): React.ReactElement {
  const {
    value,
    onChange,
    onCommit,
    onCancel,
    autoFocus = true,
    options,
    placeholder = 'Select...',
    allowClear = false,
    filterable = true,
    renderOptionLabel,
    maxDropdownHeight = 300,
  } = props;

  const [isOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useEditorAutoFocus<HTMLInputElement>(autoFocus, true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filter options based on search query
  const filteredOptions = useMemo(
    () => (filterable ? filterOptions(options, searchQuery) : options),
    [options, searchQuery, filterable]
  );

  // Find currently selected option
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // Initialize focused index to selected option
  useEffect(() => {
    if (selectedOption) {
      const index = filteredOptions.findIndex(
        (opt) => opt.value === selectedOption.value
      );
      if (index !== -1 && focusedIndex === -1) {
        queueMicrotask(() => setFocusedIndex(index));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, filteredOptions]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex]);

  // Position dropdown
  usePopupPosition(containerRef, dropdownRef, isOpen, 'auto');

  // Handle click outside
  useEditorClickOutside(
    containerRef,
    () => {
      if (isOpen) {
        onCommit();
      }
    },
    true
  );

  // Handle option selection
  const handleSelectOption = (option: RichSelectOption) => {
    if (!option.disabled) {
      onChange(option.value as TValue);
      onCommit();
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null as TValue);
    setSearchQuery('');
    setFocusedIndex(-1);
  };

  // Handle arrow navigation
  const handleArrowDown = () => {
    setFocusedIndex((prev) => {
      let next = prev + 1;
      // Skip disabled options
      while (
        next < filteredOptions.length &&
        filteredOptions[next]?.disabled
      ) {
        next++;
      }
      return next < filteredOptions.length ? next : prev;
    });
  };

  const handleArrowUp = () => {
    setFocusedIndex((prev) => {
      let next = prev - 1;
      // Skip disabled options
      while (next >= 0 && filteredOptions[next]?.disabled) {
        next--;
      }
      return next >= 0 ? next : prev;
    });
  };

  // Handle Enter to select focused option
  const handleEnter = () => {
    if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
      const option = filteredOptions[focusedIndex];
      if (option && !option.disabled) {
        handleSelectOption(option);
      }
    } else {
      onCommit();
    }
  };

  // Keyboard navigation
  const { handleKeyDown } = useEditorKeyboardNavigation(
    {
      onEnter: handleEnter,
      onEscape: onCancel,
      onArrowUp: handleArrowUp,
      onArrowDown: handleArrowDown,
    },
    {
      commitOnTab: true,
      commitOnBlur: false,
    }
  );

  // Render option label
  const renderLabel = (option: RichSelectOption) => {
    if (renderOptionLabel) {
      return renderOptionLabel(option);
    }
    return (
      <div className="editor-option-content">
        {option.icon && <span className="editor-option-icon">{option.icon}</span>}
        <div className="editor-option-text">
          <div className="editor-option-label">{option.label}</div>
          {option.description && (
            <div className="editor-option-description">{option.description}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="editor-container editor-richselect-container"
      onKeyDown={handleKeyDown}
    >
      <div className="editor-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="editor-input editor-richselect-input"
          value={filterable ? searchQuery : selectedOption?.label || ''}
          onChange={(e) => {
            if (filterable) {
              setSearchQuery(e.target.value);
              setFocusedIndex(-1);
            }
          }}
          placeholder={selectedOption?.label || placeholder}
          aria-label="Select option"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="richselect-dropdown"
          autoComplete="off"
        />
        <div className="editor-input-actions">
          {allowClear && value !== null && value !== undefined && (
            <button
              type="button"
              className="editor-clear-btn"
              onClick={handleClear}
              aria-label="Clear selection"
              tabIndex={-1}
            >
              ×
            </button>
          )}
          <span className="editor-dropdown-icon" aria-hidden="true">
            ▼
          </span>
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          id="richselect-dropdown"
          className="editor-dropdown"
          role="listbox"
          style={{ maxHeight: maxDropdownHeight }}
        >
          {filteredOptions.length === 0 ? (
            <div className="editor-dropdown-empty">No options found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                ref={(el) => { optionRefs.current[index] = el; }}
                className={`editor-dropdown-option ${
                  option.value === value ? 'selected' : ''
                } ${option.disabled ? 'disabled' : ''} ${
                  index === focusedIndex ? 'focused' : ''
                }`}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
              >
                {renderLabel(option)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

RichSelectEditor.displayName = 'RichSelectEditor';
