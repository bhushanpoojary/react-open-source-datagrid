import { useRef, useEffect } from 'react';
import type { GridState, FilterConfig, RowPinConfig } from './types';

export interface UseServerSideCallbacksParams {
  state: GridState;
  sortConfigStr: string;
  filterConfigStr: string;
  onSortChange?: (field: string, direction: 'asc' | 'desc' | null) => void;
  onFilterChange?: (filters: FilterConfig) => void;
  onPageChanged?: (page: number, pageSize: number) => void;
  rowPinConfig?: RowPinConfig;
}

/**
 * Notifies the parent of sort, filter, page, and pinned-row changes so it can
 * drive server-side data fetching. Each notification skips the initial mount so
 * the parent is only called on genuine user-initiated changes.
 *
 * Behavior is intentionally identical to the effects it replaces in DataGrid.
 */
export function useServerSideCallbacks({
  state,
  sortConfigStr,
  filterConfigStr,
  onSortChange,
  onFilterChange,
  onPageChanged,
  rowPinConfig,
}: UseServerSideCallbacksParams): void {
  // Notify parent of sort changes (server-side sorting hook). Skip initial mount.
  const sortChangeMountedRef = useRef(false);
  useEffect(() => {
    if (!sortChangeMountedRef.current) {
      sortChangeMountedRef.current = true;
      return;
    }
    if (onSortChange) {
      onSortChange(state.sortConfig.field, state.sortConfig.direction);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortConfigStr]);

  // Notify parent of filter changes (server-side filtering hook). Skip initial mount.
  const filterChangeMountedRef = useRef(false);
  useEffect(() => {
    if (!filterChangeMountedRef.current) {
      filterChangeMountedRef.current = true;
      return;
    }
    if (onFilterChange) {
      onFilterChange(state.filterConfig);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterConfigStr]);

  // Notify parent of page changes (server-side pagination hook). Skip initial mount.
  const pageChangeMountedRef = useRef(false);
  useEffect(() => {
    if (!pageChangeMountedRef.current) {
      pageChangeMountedRef.current = true;
      return;
    }
    if (onPageChanged) {
      onPageChanged(state.currentPage, state.pageSize);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.pageSize]);

  // Notify parent of pinned row changes (skip initial mount)
  const pinnedRowsMountedRef = useRef(false);
  useEffect(() => {
    if (pinnedRowsMountedRef.current && rowPinConfig?.onPinChange) {
      rowPinConfig.onPinChange(state.pinnedRowsTop, state.pinnedRowsBottom);
    }
    pinnedRowsMountedRef.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pinnedRowsTop, state.pinnedRowsBottom]);
}
