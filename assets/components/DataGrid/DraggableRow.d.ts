import React from 'react';
import type { Row, DragRowConfig } from './types';
interface DraggableRowProps {
    row: Row;
    rowIndex: number;
    config: DragRowConfig;
    sourceTableId?: string;
    onRowReorder?: (rows: Row[]) => void;
    rows: Row[];
    style?: React.CSSProperties;
    children: React.ReactNode;
}
export declare const DraggableRow: React.FC<DraggableRowProps>;
export default DraggableRow;
