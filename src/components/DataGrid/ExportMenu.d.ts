import React from 'react';
import type { Column, Row } from './types';
interface ExportMenuProps {
    columns: Column[];
    fullDataset: Row[];
    filteredData: Row[];
    selectedRows: Set<string | number>;
    currentPageData: Row[];
    onExport?: (exported: boolean) => void;
}
export declare const ExportMenu: React.FC<ExportMenuProps>;
export {};
