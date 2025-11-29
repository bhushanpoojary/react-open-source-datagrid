// Base types and interfaces for DataGrid cell editors

import type { ReactNode } from 'react';
import type { Column } from '../components/DataGrid/types';

/**
 * Base props interface for all DataGrid cell editors.
 * This interface matches the grid's editing API expectations.
 */
export interface DataGridEditorProps<TValue = any, TRow = any> {
  /** Current value being edited */
  value: TValue;
  
  /** The row data object */
  row: TRow;
  
  /** Column definition for this cell */
  column: Column;
  
  /** Callback to update the value during editing */
  onChange: (value: TValue) => void;
  
  /** Callback to commit the edit and close the editor */
  onCommit: () => void;
  
  /** Callback to cancel the edit and close the editor */
  onCancel: () => void;
  
  /** Whether the editor should auto-focus on mount */
  autoFocus?: boolean;
}

/**
 * Keyboard event handlers for editor navigation
 */
export interface EditorKeyboardHandlers {
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: (shiftKey: boolean) => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onBlur?: () => void;
}

/**
 * Configuration for editor keyboard navigation behavior
 */
export interface EditorKeyboardConfig {
  /** Commit on Enter key (default: true) */
  commitOnEnter?: boolean;
  
  /** Cancel on Escape key (default: true) */
  cancelOnEscape?: boolean;
  
  /** Commit on Tab key (default: true) */
  commitOnTab?: boolean;
  
  /** Commit on blur/focus loss (default: true) */
  commitOnBlur?: boolean;
  
  /** Prevent default for handled keys (default: true) */
  preventDefault?: boolean;
  
  /** Stop propagation for handled keys (default: true) */
  stopPropagation?: boolean;
}

/**
 * Option interface for select-based editors
 */
export interface EditorOption {
  label: string;
  value: string | number;
  icon?: ReactNode;
  disabled?: boolean;
  description?: string;
}
