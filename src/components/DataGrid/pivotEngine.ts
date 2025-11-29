/**
 * Pivot Table Engine
 * 
 * Transforms flat data into pivoted format with dynamic columns based on unique values
 * Supports aggregation functions: sum, count, avg, min, max, custom
 */

export type AggregatorType = 'sum' | 'count' | 'avg' | 'min' | 'max';

export interface PivotConfig {
  /** Column whose unique values become new columns */
  pivotColumn: string;
  /** Column to aggregate values from */
  valueColumn: string;
  /** Column to group rows by (becomes first column) */
  rowGroupColumn: string;
  /** Aggregation function to apply */
  aggregator: AggregatorType | ((values: number[]) => number);
  /** Show totals row at bottom */
  showTotals?: boolean;
  /** Show grand total column */
  showGrandTotal?: boolean;
}

export interface PivotColumn {
  field: string;
  headerName: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  isPivotColumn?: boolean;
  isTotalColumn?: boolean;
}

export interface PivotResult {
  columns: PivotColumn[];
  rows: Record<string, any>[];
  pivotValues: string[];
  totalsRow?: Record<string, any>;
}

/**
 * Built-in aggregation functions
 */
const AGGREGATORS: Record<AggregatorType, (values: number[]) => number> = {
  sum: (values) => values.reduce((acc, val) => acc + val, 0),
  count: (values) => values.length,
  avg: (values) => values.length > 0 ? values.reduce((acc, val) => acc + val, 0) / values.length : 0,
  min: (values) => values.length > 0 ? Math.min(...values) : 0,
  max: (values) => values.length > 0 ? Math.max(...values) : 0,
};

/**
 * Extract unique values from a column, sorted
 */
function getUniqueValues(data: any[], column: string): string[] {
  const uniqueSet = new Set<string>();
  data.forEach(row => {
    const value = row[column];
    if (value !== null && value !== undefined) {
      uniqueSet.add(String(value));
    }
  });
  return Array.from(uniqueSet).sort();
}

/**
 * Get aggregation function
 */
function getAggregatorFn(
  aggregator: AggregatorType | ((values: number[]) => number)
): (values: number[]) => number {
  if (typeof aggregator === 'function') {
    return aggregator;
  }
  return AGGREGATORS[aggregator] || AGGREGATORS.sum;
}

/**
 * Convert value to number safely
 */
function toNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

/**
 * Build pivot table from flat data
 * 
 * Complexity: O(n) where n is number of rows
 * Memory: O(n * m) where m is number of unique pivot values
 * 
 * @param data - Source data array
 * @param config - Pivot configuration
 * @returns Pivoted dataset with dynamic columns
 */
export function buildPivot(data: any[], config: PivotConfig): PivotResult {
  const {
    pivotColumn,
    valueColumn,
    rowGroupColumn,
    aggregator,
    showTotals = false,
    showGrandTotal = false,
  } = config;

  // Validation
  if (!data || data.length === 0) {
    return {
      columns: [],
      rows: [],
      pivotValues: [],
    };
  }

  // Step 1: Extract unique pivot values (these become column headers)
  const pivotValues = getUniqueValues(data, pivotColumn);
  
  // Step 2: Extract unique row group values
  const rowGroupValues = getUniqueValues(data, rowGroupColumn);

  // Step 3: Get aggregator function
  const aggregatorFn = getAggregatorFn(aggregator);

  // Step 4: Build data structure for grouping
  // Map: rowGroupValue -> pivotValue -> values[]
  const groupedData = new Map<string, Map<string, number[]>>();

  // Initialize structure
  rowGroupValues.forEach(rowValue => {
    const pivotMap = new Map<string, number[]>();
    pivotValues.forEach(pivotValue => {
      pivotMap.set(pivotValue, []);
    });
    groupedData.set(rowValue, pivotMap);
  });

  // Step 5: Populate grouped data
  data.forEach(row => {
    const rowValue = String(row[rowGroupColumn] ?? '');
    const pivotValue = String(row[pivotColumn] ?? '');
    const value = toNumber(row[valueColumn]);

    if (groupedData.has(rowValue)) {
      const pivotMap = groupedData.get(rowValue)!;
      if (pivotMap.has(pivotValue)) {
        pivotMap.get(pivotValue)!.push(value);
      }
    }
  });

  // Step 6: Build column definitions
  const columns: PivotColumn[] = [
    {
      field: rowGroupColumn,
      headerName: formatHeaderName(rowGroupColumn),
      width: 180,
      sortable: true,
      filterable: true,
      isPivotColumn: false,
    },
  ];

  // Add dynamic pivot columns
  pivotValues.forEach(pivotValue => {
    columns.push({
      field: pivotValue,
      headerName: pivotValue,
      width: 120,
      sortable: true,
      filterable: true,
      isPivotColumn: true,
    });
  });

  // Add grand total column if requested
  if (showGrandTotal) {
    columns.push({
      field: '__grandTotal',
      headerName: 'Grand Total',
      width: 120,
      sortable: true,
      filterable: false,
      isTotalColumn: true,
    });
  }

  // Step 7: Build pivoted rows
  const rows: Record<string, any>[] = [];

  rowGroupValues.forEach(rowValue => {
    const pivotMap = groupedData.get(rowValue)!;
    const row: Record<string, any> = {
      [rowGroupColumn]: rowValue,
      __id: rowValue, // Add unique ID for grid
    };

    let grandTotal = 0;

    pivotValues.forEach(pivotValue => {
      const values = pivotMap.get(pivotValue)!;
      const aggregatedValue = aggregatorFn(values);
      row[pivotValue] = aggregatedValue;
      grandTotal += aggregatedValue;
    });

    if (showGrandTotal) {
      row['__grandTotal'] = grandTotal;
    }

    rows.push(row);
  });

  // Step 8: Build totals row if requested
  let totalsRow: Record<string, any> | undefined;
  if (showTotals) {
    totalsRow = {
      [rowGroupColumn]: 'Total',
      __id: '__totals',
      __isTotal: true,
    };

    let overallGrandTotal = 0;

    pivotValues.forEach(pivotValue => {
      const allValues: number[] = [];
      groupedData.forEach(pivotMap => {
        const values = pivotMap.get(pivotValue)!;
        allValues.push(...values);
      });
      const total = aggregatorFn(allValues);
      totalsRow![pivotValue] = total;
      overallGrandTotal += total;
    });

    if (showGrandTotal) {
      totalsRow['__grandTotal'] = overallGrandTotal;
    }
  }

  return {
    columns,
    rows,
    pivotValues,
    totalsRow,
  };
}

/**
 * Format column name for display
 */
function formatHeaderName(field: string): string {
  return field
    .split(/(?=[A-Z])|_|-/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Export pivoted data to CSV
 */
export function exportPivotToCSV(pivotResult: PivotResult): string {
  const { columns, rows, totalsRow } = pivotResult;
  
  // Build header row
  const headers = columns.map(col => col.headerName).join(',');
  
  // Build data rows
  const dataRows = rows.map(row => {
    return columns.map(col => {
      const value = row[col.field];
      // Handle values with commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value ?? '';
    }).join(',');
  });

  // Add totals row if exists
  if (totalsRow) {
    const totalRow = columns.map(col => {
      const value = totalsRow[col.field];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value ?? '';
    }).join(',');
    dataRows.push(totalRow);
  }

  return [headers, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'pivot-table.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
