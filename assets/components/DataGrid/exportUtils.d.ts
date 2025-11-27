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
export declare const exportToCSV: (data: Row[], columns: Column[], filename?: string) => void;
/**
 * Converts a dataset to XLSX format with optional styling and triggers download
 */
export declare const exportToXLSX: (data: Row[], columns: Column[], options?: {
    filename?: string;
    styling?: ExcelStyling;
}) => Promise<void>;
/**
 * Generates a filename with timestamp
 */
export declare const generateFilename: (format: ExportFormat, scope: ExportScope) => string;
/**
 * Handles the complete export process
 */
export declare const handleExport: (data: Row[], columns: Column[], options: ExportOptions) => Promise<void>;
