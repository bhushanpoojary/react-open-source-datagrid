import React from 'react';
import type { TreeNode, Column, GridAction, TreeConfig } from './types';
interface TreeRowProps {
    node: TreeNode;
    columns: Column[];
    columnOrder: string[];
    displayColumnOrder: string[];
    columnWidths: {
        [field: string]: number;
    };
    selectedRows: Set<string | number>;
    editState: {
        rowId: string | number | null;
        field: string | null;
        value: any;
    };
    focusState: {
        rowIndex: number;
        columnIndex: number;
    } | null;
    rowIndex: number;
    dispatch: React.Dispatch<GridAction>;
    onRowClick?: (row: TreeNode) => void;
    onCellEdit?: (rowIndex: number, field: string, value: any) => void;
    pinnedLeft: string[];
    pinnedRight: string[];
    treeConfig: TreeConfig;
    editInputRef?: React.RefObject<HTMLInputElement | null>;
}
export declare const TreeRow: React.FC<TreeRowProps>;
export {};
