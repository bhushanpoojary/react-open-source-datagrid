/**
 * Charts module exports
 * 
 * This module provides integrated charting functionality for the DataGrid.
 * Includes types, utilities, and components for creating charts from grid selections.
 */

// Types
export type {
  CellAddress,
  GridCellRange,
  ChartType,
  ChartSeries,
  ChartConfig,
  RangeToChartOptions,
  NormalizedRange,
} from './types';

// Utilities
export {
  buildChartConfigFromRange,
  normalizeRange,
  updateChartType,
  updateChartTheme,
} from './rangeToChart';

// Components
export { QuickChart } from './QuickChart';
export type { QuickChartProps } from './QuickChart';

export { ChartOverlay } from './ChartOverlay';
export type { ChartOverlayProps } from './ChartOverlay';
