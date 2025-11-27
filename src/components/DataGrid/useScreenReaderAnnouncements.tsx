/**
 * useScreenReaderAnnouncements Hook
 * 
 * Manages live region announcements for screen readers.
 * Provides accessible feedback for grid actions like sorting, filtering, selection, and navigation.
 */

import React, { useRef, useCallback, useEffect } from 'react';
// If you need the announcer component, import it from './ScreenReaderAnnouncer'

export const useScreenReaderAnnouncements = () => {
  const announcementRef = React.useRef<string>('');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, options: { priority?: 'polite' | 'assertive'; delay?: number } = {}) => {
    const { delay = 0 } = options;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        announcementRef.current = message;
      }, delay);
    } else {
      announcementRef.current = message;
    }
  }, []);

  /**
   * Announce sorting changes
   */
  const announceSorting = useCallback((columnName: string, direction: 'asc' | 'desc' | null) => {
    if (!direction) {
      announce(`Sorting cleared`);
    } else {
      const directionText = direction === 'asc' ? 'ascending' : 'descending';
      announce(`Sorted by ${columnName} ${directionText}`);
    }
  }, [announce]);

  /**
   * Announce selection changes
   */
  const announceSelection = useCallback((count: number) => {
    if (count === 0) {
      announce('All rows deselected');
    } else if (count === 1) {
      announce('1 row selected');
    } else {
      announce(`${count} rows selected`);
    }
  }, [announce]);

  /**
   * Announce filtering changes
   */
  const announceFiltering = useCallback((columnName: string, hasFilter: boolean, resultCount?: number) => {
    if (hasFilter) {
      const countText = resultCount !== undefined ? `, ${resultCount} results found` : '';
      announce(`Filter applied to ${columnName}${countText}`);
    } else {
      announce(`Filter cleared from ${columnName}`);
    }
  }, [announce]);

  /**
   * Announce pagination changes
   */
  const announcePagination = useCallback((currentPage: number, totalPages: number, rowCount: number) => {
    announce(`Page ${currentPage + 1} of ${totalPages}, showing ${rowCount} rows`);
  }, [announce]);

  /**
   * Announce focus changes (for navigation)
   */
  const announceFocus = useCallback((rowIndex: number, columnName: string, value?: any) => {
    const valueText = value !== undefined && value !== null ? `, value: ${value}` : '';
    announce(`Row ${rowIndex + 1}, ${columnName}${valueText}`, { delay: 100 });
  }, [announce]);

  /**
   * Announce editing state
   */
  const announceEditing = useCallback((columnName: string, isStarting: boolean) => {
    if (isStarting) {
      announce(`Editing ${columnName}. Press Enter to save, Escape to cancel`);
    } else {
      announce(`Edit saved for ${columnName}`);
    }
  }, [announce]);

  /**
   * Announce row reordering
   */
  const announceRowReorder = useCallback((fromIndex: number, toIndex: number) => {
    announce(`Row moved from position ${fromIndex + 1} to position ${toIndex + 1}`);
  }, [announce]);

  /**
   * Announce column visibility changes
   */
  const announceColumnVisibility = useCallback((columnName: string, isVisible: boolean) => {
    if (isVisible) {
      announce(`${columnName} column shown`);
    } else {
      announce(`${columnName} column hidden`);
    }
  }, [announce]);

  /**
   * Announce data loading
   */
  const announceLoading = useCallback((isLoading: boolean, message?: string) => {
    if (isLoading) {
      announce(message || 'Loading data...', { priority: 'assertive' });
    } else {
      announce('Data loaded', { priority: 'polite' });
    }
  }, [announce]);

  return {
    announcementRef,
    announce,
    announceSorting,
    announceSelection,
    announceFiltering,
    announcePagination,
    announceFocus,
    announceEditing,
    announceRowReorder,
    announceColumnVisibility,
    announceLoading,
  };
};

// ...existing code...
