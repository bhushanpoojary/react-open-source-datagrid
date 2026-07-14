import type { Row, GroupedRow, SortConfig, Column } from './types';
import type { CSSProperties } from 'react';

/**
 * Pure data-pipeline helpers used by the DataGrid.
 *
 * These functions are intentionally free of React so they can be unit-tested in
 * isolation and reused by the DataGrid's memoized pipeline stages.
 */

/**
 * Resolve the raw value of a cell for a column.
 *
 * Uses the column's `valueGetter` when provided (computed columns); otherwise
 * reads `row[column.field]`.
 */
export const resolveCellValue = (column: Column, row: Row): unknown =>
  column.valueGetter ? column.valueGetter(row) : row[column.field];

/**
 * Resolve the display value of a cell for a column.
 *
 * Applies `valueFormatter` (when provided) to the resolved raw value. Returns
 * the raw value unchanged when no formatter is set.
 */
export const resolveDisplayValue = (column: Column, row: Row): unknown => {
  const value = resolveCellValue(column, row);
  return column.valueFormatter ? column.valueFormatter(value, row) : value;
};

/** Default minimum column width (px) used when a column has no explicit `minWidth`. */
export const DEFAULT_MIN_COLUMN_WIDTH = 50;

/**
 * Clamp a width to a column's `minWidth`/`maxWidth` bounds.
 *
 * Falls back to {@link DEFAULT_MIN_COLUMN_WIDTH} when no `minWidth` is set. When
 * `maxWidth` is present it takes precedence over the minimum (so a `maxWidth`
 * smaller than the floor still wins).
 */
export const clampColumnWidth = (column: Column | undefined, width: number): number => {
  const min = column?.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
  let next = Math.max(min, width);
  if (column?.maxWidth != null) {
    next = Math.min(column.maxWidth, next);
  }
  return next;
};

/**
 * Resolve a column's initial width, applying its `minWidth`/`maxWidth` bounds.
 * Uses `column.width` when set, otherwise a 150px default.
 */
export const resolveInitialColumnWidth = (column: Column): number =>
  clampColumnWidth(column, column.width ?? 150);

/**
 * Resolve the inline style to apply to a cell from a column's `cellStyle`
 * (static object or per-row function). Returns `undefined` when not set.
 */
export const resolveCellStyle = (
  column: Column,
  row: Row,
  value: unknown
): CSSProperties | undefined => {
  const cellStyle = column.cellStyle;
  if (!cellStyle) return undefined;
  return typeof cellStyle === 'function' ? cellStyle(row, value) : cellStyle;
};

/**
 * Resolve the CSS class string to apply to a cell, combining `cellClass`
 * (static/array/function) with any matching `cellClassRules`. Returns
 * `undefined` when no classes apply.
 */
export const resolveCellClass = (
  column: Column,
  row: Row,
  value: unknown
): string | undefined => {
  const classes: string[] = [];

  const cellClass = column.cellClass;
  if (cellClass) {
    const resolved = typeof cellClass === 'function' ? cellClass(row, value) : cellClass;
    if (Array.isArray(resolved)) {
      classes.push(...resolved.filter(Boolean));
    } else if (resolved) {
      classes.push(resolved);
    }
  }

  const rules = column.cellClassRules;
  if (rules) {
    for (const className of Object.keys(rules)) {
      if (rules[className](row, value)) {
        classes.push(className);
      }
    }
  }

  return classes.length > 0 ? classes.join(' ') : undefined;
};


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
