import React from 'react';
import type { Column } from './types';
interface ColumnChooserProps {
    columns: Column[];
    columnOrder: string[];
    hiddenColumns: string[];
    onToggleVisibility: (field: string) => void;
    onReorderColumns: (fromIndex: number, toIndex: number) => void;
    onResetLayout: () => void;
}
export declare const ColumnChooser: React.FC<ColumnChooserProps>;
export {};
