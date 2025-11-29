// MultiSelectEditor - Multiple selection editor with tags/chips

import React, { useState, useRef, useMemo } from 'react';
import type { DataGridEditorProps, EditorOption } from './editorTypes';
import {
  useEditorKeyboardNavigation,
  useEditorAutoFocus,
  useEditorClickOutside,
  usePopupPosition,
  filterOptions,
} from './editorUtils';
import './editors.css';

export interface MultiSelectOption extends EditorOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface MultiSelectEditorProps<TValue = any, TRow = any>
  extends DataGridEditorProps<TValue[], TRow> {
  /** Array of options to select from */
  options: MultiSelectOption[];
  
  /** Placeholder text when no values selected */
  placeholder?: string;
  
  /** Maximum number of tags to display before collapsing */
  maxTagCount?: number;
  
  /** Enable filtering/search functionality */
  filterable?: boolean;
  
  /** Maximum height of dropdown in pixels */
  maxDropdownHeight?: number;
  
  /** Allow deselecting all values */
  allowEmpty?: boolean;
}

/**
 * MultiSelectEditor component for DataGrid cells.
 * Allows selecting multiple values displayed as chips/tags.
 */
export function MultiSelectEditor<TValue = any, TRow = any>(
  props: MultiSelectEditorProps<TValue, TRow>
): React.ReactElement {
  const {
    value = [],
    onChange,
    onCommit,
    onCancel,
    autoFocus = true,
    options,
    placeholder = 'Select...',
    maxTagCount = 3,
    filterable = true,
    maxDropdownHeight = 300,
    allowEmpty = true,
  } = props;

  const [isOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useEditorAutoFocus<HTMLInputElement>(autoFocus);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  // Ensure value is an array
  const selectedValues = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value]
  );

  // Filter options based on search query
  const filteredOptions = useMemo(
    () => (filterable ? filterOptions(options, searchQuery) : options),
    [options, searchQuery, filterable]
  );

  // Get selected options
  const selectedOptions = useMemo(
    () => options.filter((opt) => selectedValues.includes(opt.value as TValue)),
    [options, selectedValues]
  );

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

  // Toggle option selection
  const handleToggleOption = (option: MultiSelectOption) => {
    if (option.disabled) return;

    const isSelected = selectedValues.includes(option.value as TValue);
    let newValues: TValue[];

    if (isSelected) {
      if (!allowEmpty && selectedValues.length === 1) {
        return; // Don't allow deselecting the last value
      }
      newValues = selectedValues.filter((v) => v !== option.value);
    } else {
      newValues = [...selectedValues, option.value as TValue];
    }

    onChange(newValues);
  };

  // Remove tag
  const handleRemoveTag = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!allowEmpty && selectedValues.length === 1) {
      return;
    }
    
    const newValues = selectedValues.filter((v) => v !== optionValue);
    onChange(newValues);
  };

  // Handle backspace to remove last tag
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Backspace' &&
      searchQuery === '' &&
      selectedValues.length > 0
    ) {
      e.preventDefault();
      if (allowEmpty || selectedValues.length > 1) {
        const newValues = selectedValues.slice(0, -1);
        onChange(newValues);
      }
    }
  };

  // Handle arrow navigation
  const handleArrowDown = () => {
    setFocusedIndex((prev) => {
      let next = prev + 1;
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
      while (next >= 0 && filteredOptions[next]?.disabled) {
        next--;
      }
      return next >= 0 ? next : prev;
    });
  };

  // Handle Enter to toggle focused option
  const handleEnter = () => {
    if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
      const option = filteredOptions[focusedIndex];
      if (option && !option.disabled) {
        handleToggleOption(option);
      }
    } else {
      onCommit();
    }
  };

  // Keyboard navigation
  const { handleKeyDown: handleEditorKeyDown } = useEditorKeyboardNavigation(
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

  // Combine key handlers
  const handleCombinedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e);
    handleEditorKeyDown(e);
  };

  // Calculate visible and collapsed tags
  const visibleTags = selectedOptions.slice(0, maxTagCount);
  const collapsedCount = Math.max(0, selectedOptions.length - maxTagCount);

  return (
    <div
      ref={containerRef}
      className="editor-container editor-multiselect-container"
      onKeyDown={handleCombinedKeyDown}
    >
      <div
        ref={tagContainerRef}
        className="editor-input-wrapper editor-multiselect-wrapper"
      >
        <div className="editor-multiselect-tags">
          {visibleTags.map((option) => (
            <div key={option.value} className="editor-tag">
              {option.icon && <span className="editor-tag-icon">{option.icon}</span>}
              <span className="editor-tag-label">{option.label}</span>
              <button
                type="button"
                className="editor-tag-remove"
                onClick={(e) => handleRemoveTag(option.value, e)}
                aria-label={`Remove ${option.label}`}
                tabIndex={-1}
              >
                ×
              </button>
            </div>
          ))}
          {collapsedCount > 0 && (
            <div className="editor-tag editor-tag-collapsed">
              +{collapsedCount}
            </div>
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="editor-input editor-multiselect-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setFocusedIndex(-1);
          }}
          placeholder={selectedValues.length === 0 ? placeholder : ''}
          aria-label="Search options"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="multiselect-dropdown"
          autoComplete="off"
        />
        
        <span className="editor-dropdown-icon" aria-hidden="true">
          ▼
        </span>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          id="multiselect-dropdown"
          className="editor-dropdown"
          role="listbox"
          aria-multiselectable="true"
          style={{ maxHeight: maxDropdownHeight }}
        >
          {filteredOptions.length === 0 ? (
            <div className="editor-dropdown-empty">No options found</div>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option.value as TValue);
              return (
                <div
                  key={option.value}
                  className={`editor-dropdown-option editor-multiselect-option ${
                    isSelected ? 'selected' : ''
                  } ${option.disabled ? 'disabled' : ''} ${
                    index === focusedIndex ? 'focused' : ''
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  onClick={() => handleToggleOption(option)}
                  onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
                >
                  <input
                    type="checkbox"
                    className="editor-multiselect-checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    disabled={option.disabled}
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <div className="editor-option-content">
                    {option.icon && (
                      <span className="editor-option-icon">{option.icon}</span>
                    )}
                    <span className="editor-option-label">{option.label}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

MultiSelectEditor.displayName = 'MultiSelectEditor';
