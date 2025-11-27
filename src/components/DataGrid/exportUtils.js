import ExcelJS from 'exceljs';
/**
 * Converts a dataset to CSV format and triggers download
 */
export const exportToCSV = (data, columns, filename = 'export.csv') => {
    // Create header row
    const headers = columns.map(col => col.headerName);
    // Create data rows
    const rows = data.map(row => columns.map(col => {
        const value = row[col.field];
        // Escape quotes and wrap in quotes if contains comma or newline
        if (value == null)
            return '';
        const strValue = String(value);
        if (strValue.includes(',') || strValue.includes('\n') || strValue.includes('"')) {
            return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
    }).join(','));
    // Combine header and data
    const csv = [headers.join(','), ...rows].join('\n');
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, filename);
};
/**
 * Converts a dataset to XLSX format with optional styling and triggers download
 */
export const exportToXLSX = async (data, columns, options = {}) => {
    const { filename = 'export.xlsx', styling = 'basic' } = options;
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    // Add header row
    const headers = columns.map(col => col.headerName);
    worksheet.addRow(headers);
    // Add data rows
    data.forEach(row => {
        const rowData = columns.map(col => row[col.field] ?? '');
        worksheet.addRow(rowData);
    });
    // Set column widths
    worksheet.columns = columns.map(col => {
        const headerLength = col.headerName.length;
        const maxDataLength = Math.max(...data.map(row => String(row[col.field] ?? '').length));
        const width = Math.max(headerLength, maxDataLength) + 2;
        return { width: Math.min(width, 50) };
    });
    // Apply styling if professional is selected
    if (styling === 'professional') {
        applyProfessionalStylingExcelJS(worksheet, columns);
    }
    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    downloadFile(blob, filename);
};
/**
 * Applies professional styling to ExcelJS worksheet
 */
const applyProfessionalStylingExcelJS = (worksheet, _columns) => {
    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2F5496' } // Dark blue
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRow.height = 20;
    // Apply borders and styling to all cells
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            // Add borders to all cells
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
            };
            // Alternate row coloring for data rows
            if (rowNumber > 1 && rowNumber % 2 === 0) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF2F2F2' } // Light gray
                };
            }
            // Left align data cells
            if (rowNumber > 1) {
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
            }
        });
    });
    // Freeze header row
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
};
/**
 * Triggers file download
 */
const downloadFile = (blob, filename) => {
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
export const generateFilename = (format, scope) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const scopeLabel = scope === 'all' ? 'full' : scope;
    return `data_export_${scopeLabel}_${timestamp}.${format}`;
};
/**
 * Handles the complete export process
 */
export const handleExport = async (data, columns, options) => {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }
    const filename = options.filename || generateFilename(options.format, options.scope);
    if (options.format === 'csv') {
        exportToCSV(data, columns, filename);
    }
    else if (options.format === 'xlsx') {
        await exportToXLSX(data, columns, {
            filename,
            styling: options.styling,
        });
    }
};
