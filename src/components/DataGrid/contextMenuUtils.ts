import type { Row, Column, FilterValue } from './types';

/**
 * Context Menu Utility Functions
 * 
 * Helper functions for context menu actions like copy, export, etc.
 */

/**
 * Copy selected cells to clipboard
 */
export const copyToClipboard = async (
  selectedRows: Set<string | number>,
  columns: Column[],
  rows: Row[],
  includeHeaders: boolean = false
): Promise<void> => {
  const selectedRowIds = Array.from(selectedRows);
  const selectedData = rows.filter(row => selectedRowIds.includes(row.id));

  if (selectedData.length === 0) {
    return;
  }

  // Create TSV (Tab-separated values) format for better Excel compatibility
  let text = '';
  
  if (includeHeaders) {
    text += columns.map(col => col.headerName).join('\t') + '\n';
  }

  text += selectedData.map(row => {
    return columns.map(col => {
      const value = row[col.field];
      // Handle null/undefined
      if (value == null) return '';
      // Handle objects/arrays
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    }).join('\t');
  }).join('\n');

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

/**
 * Copy a specific cell range to clipboard
 */
export const copyCellRange = async (
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  columns: Column[],
  rows: Row[],
  includeHeaders: boolean = false
): Promise<void> => {
  const selectedColumns = columns.slice(startCol, endCol + 1);
  const selectedRows = rows.slice(startRow, endRow + 1);

  let text = '';
  
  if (includeHeaders) {
    text += selectedColumns.map(col => col.headerName).join('\t') + '\n';
  }

  text += selectedRows.map(row => {
    return selectedColumns.map(col => {
      const value = row[col.field];
      if (value == null) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    }).join('\t');
  }).join('\n');

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy cell range:', error);
  }
};

/**
 * Export selected rows to CSV
 */
export const exportSelectedToCSV = (
  selectedRows: Set<string | number>,
  columns: Column[],
  rows: Row[],
  filename: string = 'export.csv'
): void => {
  const selectedRowIds = Array.from(selectedRows);
  const selectedData = rows.filter(row => selectedRowIds.includes(row.id));

  if (selectedData.length === 0) {
    return;
  }

  // Create CSV content
  let csv = '';
  
  // Add headers
  csv += columns.map(col => `"${col.headerName}"`).join(',') + '\n';

  // Add data rows
  csv += selectedData.map(row => {
    return columns.map(col => {
      const value = row[col.field];
      if (value == null) return '""';
      if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  }).join('\n');

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Calculate optimal column width based on content
 */
export const calculateOptimalWidth = (
  column: Column,
  rows: Row[],
  minWidth: number = 60,
  maxWidth: number = 500,
  padding: number = 32
): number => {
  // Create a temporary canvas to measure text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    return column.width || 150;
  }

  // Set font to match grid styling
  context.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // Measure header
  const headerWidth = context.measureText(column.headerName).width + padding;

  // Sample up to 100 rows for performance
  const sampleSize = Math.min(rows.length, 100);
  const sampleRows = rows.slice(0, sampleSize);

  // Measure content
  let maxContentWidth = 0;
  for (const row of sampleRows) {
    const value = row[column.field];
    const text = value == null ? '' : String(value);
    const width = context.measureText(text).width + padding;
    maxContentWidth = Math.max(maxContentWidth, width);
  }

  // Return the maximum of header and content, within bounds
  const optimalWidth = Math.max(headerWidth, maxContentWidth);
  return Math.max(minWidth, Math.min(maxWidth, optimalWidth));
};

/**
 * Auto-size all columns
 */
export const autoSizeAllColumns = (
  columns: Column[],
  rows: Row[]
): { [field: string]: number } => {
  const widths: { [field: string]: number } = {};
  
  columns.forEach(column => {
    widths[column.field] = calculateOptimalWidth(column, rows);
  });

  return widths;
};

/**
 * Create a "filter by value" filter configuration
 */
export const createFilterByValue = (
  value: unknown
): FilterValue => {
  return {
    type: 'equals',
    value: value,
  };
};

/**
 * Get unique values for a column (for filter suggestions)
 */
export const getUniqueColumnValues = (
  column: Column,
  rows: Row[],
  maxValues: number = 100
): unknown[] => {
  const values = new Set<unknown>();
  
  for (const row of rows) {
    const value = row[column.field];
    if (value != null) {
      values.add(value);
    }
    
    if (values.size >= maxValues) {
      break;
    }
  }

  return Array.from(values).sort((a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    // For other types, convert to string for comparison
    const aStr = String(a);
    const bStr = String(b);
    return aStr.localeCompare(bStr);
  });
};
