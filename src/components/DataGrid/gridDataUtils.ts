import type { Row, GroupedRow, SortConfig } from './types';

/**
 * Pure data-pipeline helpers used by the DataGrid.
 *
 * These functions are intentionally free of React so they can be unit-tested in
 * isolation and reused by the DataGrid's memoized pipeline stages.
 */

/**
 * Sort rows by the given sort config.
 *
 * Null/undefined values sort last (regardless of direction). Strings are
 * compared with `localeCompare`; other comparable values use `<`/`>`.
 * Returns the original array reference when there is nothing to sort.
 */
export const sortRows = <T extends Row>(rows: T[], sortConfig: SortConfig): T[] => {
  if (!sortConfig.field || !sortConfig.direction) {
    return rows;
  }

  const { field, direction } = sortConfig;

  const sorted = [...rows].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    // Null/undefined always sort to the end
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue);
    }

    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  });

  if (direction === 'desc') {
    sorted.reverse();
  }

  return sorted;
};

/**
 * Resolve the identity of a row or grouped row (its `id`, or a group's
 * `groupKey`). Returns `null` when neither is present.
 */
const getRowIdentity = (row: Row | GroupedRow): string | number | null => {
  if ('id' in row) return row.id;
  if ('groupKey' in row) return row.groupKey;
  return null;
};

export interface SeparatedPinnedRows {
  pinnedRowsTopData: (Row | GroupedRow)[];
  pinnedRowsBottomData: (Row | GroupedRow)[];
  unpinnedRows: (Row | GroupedRow)[];
}

/**
 * Split rows into top-pinned, bottom-pinned, and unpinned buckets.
 *
 * Pinned rows preserve the order given by `pinnedRowsTop`/`pinnedRowsBottom`
 * (the order the user pinned them), while unpinned rows keep their original
 * order.
 */
export const separatePinnedRows = (
  rows: (Row | GroupedRow)[],
  pinnedRowsTop: (string | number)[],
  pinnedRowsBottom: (string | number)[]
): SeparatedPinnedRows => {
  const pinnedTopSet = new Set(pinnedRowsTop);
  const pinnedBottomSet = new Set(pinnedRowsBottom);

  const pinnedTop: (Row | GroupedRow)[] = [];
  const pinnedBottom: (Row | GroupedRow)[] = [];
  const unpinned: (Row | GroupedRow)[] = [];

  rows.forEach((row) => {
    const rowId = getRowIdentity(row);
    if (rowId !== null && pinnedTopSet.has(rowId)) {
      pinnedTop.push(row);
    } else if (rowId !== null && pinnedBottomSet.has(rowId)) {
      pinnedBottom.push(row);
    } else {
      unpinned.push(row);
    }
  });

  // Preserve the pin order stored in state
  const orderedPinnedTop = pinnedRowsTop
    .map((id) => pinnedTop.find((row) => getRowIdentity(row) === id))
    .filter((row): row is Row | GroupedRow => row !== undefined);

  const orderedPinnedBottom = pinnedRowsBottom
    .map((id) => pinnedBottom.find((row) => getRowIdentity(row) === id))
    .filter((row): row is Row | GroupedRow => row !== undefined);

  return {
    pinnedRowsTopData: orderedPinnedTop,
    pinnedRowsBottomData: orderedPinnedBottom,
    unpinnedRows: unpinned,
  };
};
