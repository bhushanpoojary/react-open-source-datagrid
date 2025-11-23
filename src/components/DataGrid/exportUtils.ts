import * as XLSX from 'xlsx';
import type { Column, Row } from './types';

export type ExportFormat = 'csv' | 'xlsx';
export type ExportScope = 'all' | 'filtered' | 'selected' | 'page';
export type ExcelStyling = 'basic' | 'professional';

export interface ExportOptions {
  format: ExportFormat;
  scope: ExportScope;
  includeHeader?: boolean;
  styling?: ExcelStyling;
  filename?: string;
}

/**
 * Converts a dataset to CSV format and triggers download
 */
export const exportToCSV = (
  data: Row[],
  columns: Column[],
  filename: string = 'export.csv'
): void => {
  // Create header row
  const headers = columns.map(col => col.headerName);
  
  // Create data rows
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.field];
      // Escape quotes and wrap in quotes if contains comma or newline
      if (value == null) return '';
      const strValue = String(value);
      if (strValue.includes(',') || strValue.includes('\n') || strValue.includes('"')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    }).join(',')
  );

  // Combine header and data
  const csv = [headers.join(','), ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
};

/**
 * Converts a dataset to XLSX format with optional styling and triggers download
 */
export const exportToXLSX = (
  data: Row[],
  columns: Column[],
  options: {
    filename?: string;
    styling?: ExcelStyling;
  } = {}
): void => {
  const { filename = 'export.xlsx', styling = 'basic' } = options;

  // Create worksheet data
  const headers = columns.map(col => col.headerName);
  const rows = data.map(row =>
    columns.map(col => {
      const value = row[col.field];
      return value ?? '';
    })
  );

  const worksheetData = [headers, ...rows];

  // Create workbook and worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Apply styling if professional is selected
  if (styling === 'professional') {
    applyProfessionalStyling(worksheet, worksheetData, columns);
  }

  // Set column widths
  const colWidths = columns.map(col => {
    const headerLength = col.headerName.length;
    const maxDataLength = Math.max(
      ...data.map(row => String(row[col.field] ?? '').length)
    );
    return Math.max(headerLength, maxDataLength) + 2;
  });
  worksheet['!cols'] = colWidths.map(w => ({ wch: Math.min(w, 50) }));

  // Download
  XLSX.writeFile(workbook, filename);
};

/**
 * Applies professional styling to XLSX worksheet
 */
const applyProfessionalStyling = (
  worksheet: XLSX.WorkSheet,
  data: any[][],
  columns: Column[]
): void => {
  // Header styling
  const headerFill = {
    patternType: 'solid',
    fgColor: { rgb: 'FF2F5496' }, // Dark blue
  };

  const headerFont = {
    bold: true,
    color: { rgb: 'FFFFFFFF' }, // White text
    size: 11,
  };

  const headerAlignment = {
    horizontal: 'center' as const,
    vertical: 'center' as const,
    wrapText: true,
  };

  const borderStyle = {
    style: 'thin' as const,
    color: { rgb: 'FFD3D3D3' },
  };

  const border = {
    left: borderStyle,
    right: borderStyle,
    top: borderStyle,
    bottom: borderStyle,
  };

  // Apply header styling
  for (let colIndex = 0; colIndex < columns.length; colIndex++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    if (!worksheet[cellRef]) {
      worksheet[cellRef] = { t: 's', v: '' };
    }
    worksheet[cellRef].s = {
      fill: headerFill as any,
      font: headerFont,
      alignment: headerAlignment,
      border,
    };
  }

  // Apply data row styling
  const altRowFill = {
    patternType: 'solid',
    fgColor: { rgb: 'FFF2F2F2' }, // Light gray for alternating rows
  };

  const dataAlignment = {
    horizontal: 'left' as const,
    vertical: 'center' as const,
  };

  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      if (!worksheet[cellRef]) {
        worksheet[cellRef] = { t: 's', v: '' };
      }
      
      const isAltRow = rowIndex % 2 === 0;
      worksheet[cellRef].s = {
        fill: isAltRow ? (altRowFill as any) : undefined,
        alignment: dataAlignment,
        border,
      };
    }
  }

  // Freeze header row
  worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
};

/**
 * Triggers file download
 */
const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates a filename with timestamp
 */
export const generateFilename = (
  format: ExportFormat,
  scope: ExportScope
): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const scopeLabel = scope === 'all' ? 'full' : scope;
  return `data_export_${scopeLabel}_${timestamp}.${format}`;
};

/**
 * Handles the complete export process
 */
export const handleExport = (
  data: Row[],
  columns: Column[],
  options: ExportOptions
): void => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const filename = options.filename || generateFilename(options.format, options.scope);

  if (options.format === 'csv') {
    exportToCSV(data, columns, filename);
  } else if (options.format === 'xlsx') {
    exportToXLSX(data, columns, {
      filename,
      styling: options.styling,
    });
  }
};
