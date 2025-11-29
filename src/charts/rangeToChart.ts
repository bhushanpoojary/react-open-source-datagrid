/**
 * Utilities for converting grid cell ranges to chart configurations
 */

import type {
  ChartConfig,
  ChartSeries,
  GridCellRange,
  NormalizedRange,
  RangeToChartOptions,
} from './types';

/**
 * Normalize a grid cell range so that start is always top-left and end is bottom-right
 */
export function normalizeRange(range: GridCellRange): NormalizedRange {
  const startRow = Math.min(range.start.rowIndex, range.end.rowIndex);
  const endRow = Math.max(range.start.rowIndex, range.end.rowIndex);
  const startCol = Math.min(range.start.colIndex, range.end.colIndex);
  const endCol = Math.max(range.start.colIndex, range.end.colIndex);

  return { startRow, endRow, startCol, endCol };
}

/**
 * Check if a value is numeric
 */
function isNumeric(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Convert value to number, or return 0 if not numeric
 */
function toNumber(value: unknown): number {
  if (isNumeric(value)) {
    return Number(value);
  }
  return 0;
}

/**
 * Generate a unique ID for the chart
 */
function generateChartId(): string {
  return `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get default colors for chart series
 */
const DEFAULT_COLORS = [
  '#8884d8', // blue
  '#82ca9d', // green
  '#ffc658', // yellow
  '#ff7c7c', // red
  '#a28fd0', // purple
  '#ff9f40', // orange
  '#4bc0c0', // teal
  '#ff6384', // pink
];

/**
 * Build a chart configuration from a grid cell range
 * 
 * @param options - Configuration options including range, data, and chart type
 * @returns ChartConfig ready to be rendered
 */
export function buildChartConfigFromRange(
  options: RangeToChartOptions
): ChartConfig {
  const {
    range,
    rows,
    columns,
    chartType,
    useFirstColumnAsCategory = true,
    title,
    theme = 'light',
  } = options;

  // Normalize the range
  const normalized = normalizeRange(range);
  const { startRow, endRow, startCol, endCol } = normalized;

  // Validate range
  if (startRow < 0 || endRow >= rows.length) {
    throw new Error('Invalid row range');
  }
  if (startCol < 0 || endCol >= columns.length) {
    throw new Error('Invalid column range');
  }

  // Get the selected rows and columns
  const selectedRows = rows.slice(startRow, endRow + 1);
  const selectedColumns = columns.slice(startCol, endCol + 1);

  // Determine category column and data columns
  let categoryColumnIndex = 0;
  let dataColumnStartIndex = 0;

  if (useFirstColumnAsCategory && selectedColumns.length > 1) {
    categoryColumnIndex = 0;
    dataColumnStartIndex = 1;
  } else {
    // Use row indices as categories
    categoryColumnIndex = -1;
    dataColumnStartIndex = 0;
  }

  // Extract X-axis labels (categories)
  const xLabels: (string | number)[] = [];
  
  if (categoryColumnIndex >= 0) {
    // Use first column values as categories
    const categoryField = selectedColumns[categoryColumnIndex].field;
    selectedRows.forEach((row) => {
      const value = row[categoryField];
      xLabels.push(value !== null && value !== undefined ? String(value) : '');
    });
  } else {
    // Use row indices as categories
    for (let i = 0; i < selectedRows.length; i++) {
      xLabels.push(i + 1);
    }
  }

  // Extract series data
  const series: ChartSeries[] = [];
  const dataColumns = selectedColumns.slice(dataColumnStartIndex);

  dataColumns.forEach((column, index) => {
    const seriesData: number[] = [];
    const field = column.field;

    // Check if column has numeric data
    let hasNumericData = false;
    selectedRows.forEach((row) => {
      const value = row[field];
      if (isNumeric(value)) {
        hasNumericData = true;
        seriesData.push(toNumber(value));
      } else {
        seriesData.push(0);
      }
    });

    // Only add series if it has at least some numeric data
    if (hasNumericData) {
      series.push({
        name: column.headerName || field,
        data: seriesData,
        color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      });
    }
  });

  // If no numeric series found, throw error
  if (series.length === 0) {
    throw new Error('No numeric data found in the selected range');
  }

  // For pie charts, we need to handle data differently
  if (chartType === 'pie') {
    // For pie charts, we typically want one series
    // Sum up all series or use the first series
    if (series.length === 1) {
      // Use the single series as-is
    } else {
      // Sum all series into one
      const summedData: number[] = new Array(xLabels.length).fill(0);
      series.forEach((s) => {
        s.data.forEach((value, idx) => {
          summedData[idx] += value;
        });
      });
      series.length = 0;
      series.push({
        name: 'Total',
        data: summedData,
        color: DEFAULT_COLORS[0],
      });
    }
  }

  return {
    id: generateChartId(),
    type: chartType,
    title: title || `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
    xLabels,
    series,
    theme,
  };
}

/**
 * Update an existing chart config with a new chart type
 */
export function updateChartType(
  config: ChartConfig,
  newType: ChartConfig['type']
): ChartConfig {
  return {
    ...config,
    type: newType,
    title: config.title?.replace(
      /^(Line|Bar|Area|Pie)/i,
      newType.charAt(0).toUpperCase() + newType.slice(1)
    ) || `${newType.charAt(0).toUpperCase() + newType.slice(1)} Chart`,
  };
}

/**
 * Update an existing chart config with a new theme
 */
export function updateChartTheme(
  config: ChartConfig,
  newTheme: 'light' | 'dark'
): ChartConfig {
  return {
    ...config,
    theme: newTheme,
  };
}
