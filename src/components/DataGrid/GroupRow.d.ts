import React from 'react';
import type { GroupedRow, Column, GridAction, AggregateConfig } from './types';
interface GroupRowProps {
    group: GroupedRow;
    columns: Column[];
    columnOrder: string[];
    displayColumnOrder: string[];
    columnWidths: {
        [field: string]: number;
    };
    dispatch: React.Dispatch<GridAction>;
    pinnedLeft: string[];
    pinnedRight: string[];
}
export declare const GroupRow: React.FC<GroupRowProps>;
interface GroupFooterRowProps {
    group: GroupedRow;
    columns: Column[];
    displayColumnOrder: string[];
    columnWidths: {
        [field: string]: number;
    };
    aggregates: {
        [key: string]: number | null;
    };
    aggregateConfigs: AggregateConfig[];
    pinnedLeft: string[];
    pinnedRight: string[];
}
export declare const GroupFooterRow: React.FC<GroupFooterRowProps>;
export {};
