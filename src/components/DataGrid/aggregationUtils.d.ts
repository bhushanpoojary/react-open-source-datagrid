import type { Row, AggregateFunction, AggregateConfig, GroupedRow } from './types';
/**
 * Compute a single aggregate value for a set of rows
 */
export declare const computeAggregate: (rows: Row[], field: string, func: AggregateFunction) => number | null;
/**
 * Compute all configured aggregates for a set of rows
 */
export declare const computeAggregations: (rows: Row[], aggregateConfigs: AggregateConfig[]) => {
    [key: string]: number | null;
};
/**
 * Compute group-level aggregations for each group in grouped rows
 */
export declare const computeGroupAggregations: (groupedRows: (Row | GroupedRow)[], aggregateConfigs: AggregateConfig[]) => Map<string, {
    [key: string]: number | null;
}>;
/**
 * Format aggregate value for display
 */
export declare const formatAggregateValue: (value: number | null, func: AggregateFunction) => string;
/**
 * Get display label for an aggregate function
 */
export declare const getAggregateLabel: (func: AggregateFunction) => string;
