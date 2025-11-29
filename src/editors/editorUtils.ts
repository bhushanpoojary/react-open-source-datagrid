// Shared utilities and hooks for DataGrid cell editors

import { useEffect, useRef, useCallback } from 'react';
import type { EditorKeyboardHandlers, EditorKeyboardConfig } from './editorTypes';

/**
 * Hook for standardized keyboard navigation in cell editors.
 * Handles common editor keyboard interactions (Enter, Escape, Tab, etc.)
 */
export function useEditorKeyboardNavigation(
  handlers: EditorKeyboardHandlers,
  config: EditorKeyboardConfig = {}
) {
  const {
    commitOnEnter = true,
    cancelOnEscape = true,
    commitOnTab = true,
    preventDefault = true,
    stopPropagation = true,
  } = config;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      let handled = false;

      switch (event.key) {
        case 'Enter':
          if (commitOnEnter && handlers.onEnter) {
            handlers.onEnter();
            handled = true;
          }
          break;

        case 'Escape':
          if (cancelOnEscape && handlers.onEscape) {
            handlers.onEscape();
            handled = true;
          }
          break;

        case 'Tab':
          if (commitOnTab && handlers.onTab) {
            handlers.onTab(event.shiftKey);
            handled = true;
          }
          break;

        case 'ArrowUp':
          if (handlers.onArrowUp) {
            handlers.onArrowUp();
            handled = true;
          }
          break;

        case 'ArrowDown':
          if (handlers.onArrowDown) {
            handlers.onArrowDown();
            handled = true;
          }
          break;
      }

      if (handled) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
      }
    },
    [
      handlers,
      commitOnEnter,
      cancelOnEscape,
      commitOnTab,
      preventDefault,
      stopPropagation,
    ]
  );

  return { handleKeyDown };
}

/**
 * Hook for auto-focusing an element when the editor mounts
 */
export function useEditorAutoFocus<T extends HTMLElement>(
  autoFocus: boolean = true,
  selectAll: boolean = false
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (autoFocus && elementRef.current) {
      elementRef.current.focus();
      
      // Select all text if requested and element is an input
      if (selectAll && elementRef.current instanceof HTMLInputElement) {
        elementRef.current.select();
      }
    }
  }, [autoFocus, selectAll]);

  return elementRef;
}

/**
 * Hook for handling click outside to commit editor
 */
export function useEditorClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClickOutside: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    // Use timeout to avoid immediate trigger
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside, enabled]);
}

/**
 * Hook for positioning a popup/dropdown relative to an anchor element
 */
export function usePopupPosition(
  anchorRef: React.RefObject<HTMLElement | null>,
  popupRef: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  placement: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'auto'
) {
  useEffect(() => {
    if (!isOpen || !anchorRef.current || !popupRef.current) return;

    const anchor = anchorRef.current;
    const popup = popupRef.current;
    const anchorRect = anchor.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = 0;
    let left = 0;
    let actualPlacement = placement;

    // Auto-detect best placement if 'auto'
    if (placement === 'auto') {
      const spaceBelow = viewportHeight - anchorRect.bottom;
      const spaceAbove = anchorRect.top;
      const spaceRight = viewportWidth - anchorRect.right;
      const spaceLeft = anchorRect.left;

      if (spaceBelow >= popupRect.height || spaceBelow >= spaceAbove) {
        actualPlacement = 'bottom';
      } else if (spaceAbove >= popupRect.height) {
        actualPlacement = 'top';
      } else if (spaceRight >= popupRect.width) {
        actualPlacement = 'right';
      } else if (spaceLeft >= popupRect.width) {
        actualPlacement = 'left';
      } else {
        actualPlacement = 'bottom'; // Default fallback
      }
    }

    // Calculate position based on placement
    switch (actualPlacement) {
      case 'bottom':
        top = anchorRect.bottom + window.scrollY;
        left = anchorRect.left + window.scrollX;
        break;
      case 'top':
        top = anchorRect.top + window.scrollY - popupRect.height;
        left = anchorRect.left + window.scrollX;
        break;
      case 'right':
        top = anchorRect.top + window.scrollY;
        left = anchorRect.right + window.scrollX;
        break;
      case 'left':
        top = anchorRect.top + window.scrollY;
        left = anchorRect.left + window.scrollX - popupRect.width;
        break;
    }

    // Ensure popup stays within viewport bounds
    const margin = 8;
    if (left + popupRect.width > viewportWidth) {
      left = viewportWidth - popupRect.width - margin;
    }
    if (left < margin) {
      left = margin;
    }
    if (top + popupRect.height > viewportHeight + window.scrollY) {
      top = viewportHeight + window.scrollY - popupRect.height - margin;
    }
    if (top < window.scrollY + margin) {
      top = window.scrollY + margin;
    }

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.minWidth = `${anchorRect.width}px`;
  }, [isOpen, anchorRef, popupRef, placement]);
}

/**
 * Debounce utility for editor operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format number with thousands separator and decimal places
 */
export function formatNumber(
  value: number,
  decimals: number = 0,
  thousandsSeparator: string = ',',
  decimalSeparator: string = '.'
): string {
  const fixed = value.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split('.');
  
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator
  );
  
  return decimalPart
    ? `${formattedInteger}${decimalSeparator}${decimalPart}`
    : formattedInteger;
}

/**
 * Parse formatted number string back to number
 */
export function parseFormattedNumber(
  value: string,
  thousandsSeparator: string = ',',
  decimalSeparator: string = '.'
): number | null {
  if (!value || typeof value !== 'string') return null;
  
  // Remove thousands separators and replace decimal separator with '.'
  const normalized = value
    .replace(new RegExp(`\\${thousandsSeparator}`, 'g'), '')
    .replace(new RegExp(`\\${decimalSeparator}`), '.');
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Filter options based on search query
 */
export function filterOptions<T extends { label: string }>(
  options: T[],
  searchQuery: string
): T[] {
  if (!searchQuery.trim()) return options;
  
  const lowerQuery = searchQuery.toLowerCase();
  return options.filter((option) =>
    option.label.toLowerCase().includes(lowerQuery)
  );
}
