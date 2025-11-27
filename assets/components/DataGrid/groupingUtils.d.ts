import type { Row, GroupedRow, AggregateFunction, ExpandedGroups } from './types';
/**
 * Compute aggregate value for a group of rows
 */
export declare const computeAggregate: (rows: Row[], field: string, func: AggregateFunction) => number;
/**
 * Group rows by specified fields recursively
 */
export declare const groupRows: (rows: Row[], groupByFields: string[], expandedGroups: ExpandedGroups, level?: number) => (Row | GroupedRow)[];
/**
 * Flatten grouped rows for rendering
 */
export declare const flattenGroupedRows: (groupedRows: (Row | GroupedRow)[]) => (Row | GroupedRow)[];
/**
 * Check if a row is a grouped row
 */
export declare const isGroupedRow: (row: Row | GroupedRow) => row is GroupedRow;
