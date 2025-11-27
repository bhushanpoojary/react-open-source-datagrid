import React from 'react';
import type { Column, GridAction } from './types';
interface GroupByPanelProps {
    columns: Column[];
    groupBy: string[];
    dispatch: React.Dispatch<GridAction>;
}
export declare const GroupByPanel: React.FC<GroupByPanelProps>;
export {};
