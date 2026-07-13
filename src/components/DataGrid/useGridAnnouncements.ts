import { useEffect } from 'react';
import type { GridState, Column } from './types';
import { useScreenReaderAnnouncements } from './useScreenReaderAnnouncements';

export interface UseGridAnnouncementsParams {
  state: GridState;
  effectiveColumns: Column[];
  flattenedRows: readonly unknown[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

/**
 * Owns the DataGrid's screen-reader announcements and the parent selection
 * notification:
 * - announces (and notifies the parent of) selection changes
 * - announces sort direction changes for the active column
 * - announces pagination changes (page X of Y, N rows)
 *
 * Behavior is intentionally identical to the effects it replaces in DataGrid.
 */
export function useGridAnnouncements({
  state,
  effectiveColumns,
  flattenedRows,
  onSelectionChange,
}: UseGridAnnouncementsParams): void {
  const { announceSorting, announceSelection, announcePagination } =
    useScreenReaderAnnouncements();

  // Notify parent of selection changes and announce to screen readers
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(state.selection.selectedRows));
    }
    announceSelection(state.selection.selectedRows.size);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selection.selectedRows]);

  // Announce sorting changes to screen readers
  useEffect(() => {
    if (state.sortConfig.field) {
      const column = effectiveColumns.find((c) => c.field === state.sortConfig.field);
      if (column) {
        announceSorting(column.headerName, state.sortConfig.direction);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sortConfig.field, state.sortConfig.direction, effectiveColumns]);

  // Announce pagination changes to screen readers
  useEffect(() => {
    const totalPages = Math.ceil(flattenedRows.length / state.pageSize);
    const rowCount = Math.min(
      state.pageSize,
      flattenedRows.length - state.currentPage * state.pageSize
    );
    if (rowCount > 0) {
      announcePagination(state.currentPage, totalPages, rowCount);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.pageSize]);
}
