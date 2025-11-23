import type { Row, AggregateFunction, AggregateConfig, GroupedRow } from './types';

/**
 * Compute a single aggregate value for a set of rows
 */
export const computeAggregate = (
  rows: Row[],
  field: string,
  func: AggregateFunction
): number | null => {
  // Get numeric values from the field
  const values = rows
    .map(row => row[field])
    .filter(val => val != null && val !== '' && !isNaN(Number(val)))
    .map(Number);

  if (values.length === 0 && func !== 'count') return null;

  switch (func) {
    case 'count':
      return rows.length;
    case 'sum':
    case 'total':
      return values.reduce((acc, val) => acc + val, 0);
    case 'avg':
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    default:
      return null;
  }
};

/**
 * Compute all configured aggregates for a set of rows
 */
export const computeAggregations = (
  rows: Row[],
  aggregateConfigs: AggregateConfig[]
): { [key: string]: number | null } => {
  const result: { [key: string]: number | null } = {};

  aggregateConfigs.forEach(config => {
    const key = `${config.field}_${config.function}`;
    result[key] = computeAggregate(rows, config.field, config.function);
  });

  return result;
};

/**
 * Compute group-level aggregations for each group in grouped rows
 */
export const computeGroupAggregations = (
  groupedRows: (Row | GroupedRow)[],
  aggregateConfigs: AggregateConfig[]
): Map<string, { [key: string]: number | null }> => {
  const groupAggregates = new Map<string, { [key: string]: number | null }>();

  const processGroup = (item: Row | GroupedRow) => {
    if ('isGroup' in item && item.isGroup) {
      // Get all leaf rows in this group
      const leafRows = getAllLeafRows(item.children);
      
      // Compute aggregates for this group
      const aggregates = computeAggregations(leafRows, aggregateConfigs);
      groupAggregates.set(item.groupKey, aggregates);

      // Recursively process child groups
      item.children.forEach((child: Row | GroupedRow) => processGroup(child));
    }
  };

  groupedRows.forEach(item => processGroup(item));

  return groupAggregates;
};

/**
 * Get all leaf rows from a potentially nested group structure
 */
const getAllLeafRows = (rows: (Row | GroupedRow)[]): Row[] => {
  const leafRows: Row[] = [];

  rows.forEach(row => {
    if ('isGroup' in row && row.isGroup) {
      leafRows.push(...getAllLeafRows(row.children));
    } else {
      leafRows.push(row as Row);
    }
  });

  return leafRows;
};

/**
 * Format aggregate value for display
 */
export const formatAggregateValue = (
  value: number | null,
  func: AggregateFunction
): string => {
  if (value === null) return '-';

  switch (func) {
    case 'count':
      return value.toString();
    case 'avg':
      return value.toFixed(2);
    case 'sum':
    case 'total':
    case 'min':
    case 'max':
      // Check if it's a whole number
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    default:
      return value.toString();
  }
};

/**
 * Get display label for an aggregate function
 */
export const getAggregateLabel = (func: AggregateFunction): string => {
  switch (func) {
    case 'count':
      return 'Count';
    case 'sum':
    case 'total':
      return 'Total';
    case 'avg':
      return 'Average';
    case 'min':
      return 'Min';
    case 'max':
      return 'Max';
    default:
      return func;
  }
};
