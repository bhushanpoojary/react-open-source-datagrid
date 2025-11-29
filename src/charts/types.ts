/**
 * Chart types and interfaces for integrated charting functionality
 */

import type { Column, Row } from '../components/DataGrid/types';

/**
 * Represents a cell address in the grid
 */
export interface CellAddress {
  rowIndex: number;
  colIndex: number;
}

/**
 * Represents a rectangular range of cells in the grid
 * start and end can be in any order (normalized during processing)
 */
export interface GridCellRange {
  start: CellAddress;
  end: CellAddress;
}

/**
 * Supported chart types
 */
export type ChartType = 'line' | 'bar' | 'area' | 'pie';

/**
 * Represents a data series in the chart
 */
export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

/**
 * Complete chart configuration
 */
export interface ChartConfig {
  id: string;
  type: ChartType;
  title?: string;
  xLabels: (string | number)[];
  series: ChartSeries[];
  theme?: 'light' | 'dark';
}

/**
 * Options for converting a grid range to a chart configuration
 */
export interface RangeToChartOptions {
  range: GridCellRange;
  rows: Row[];
  columns: Column[];
  chartType: ChartType;
  useFirstColumnAsCategory?: boolean; // Treat first column as X-axis categories (default: true)
  title?: string;
  theme?: 'light' | 'dark';
}

/**
 * Result of normalizing a grid cell range
 */
export interface NormalizedRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}
