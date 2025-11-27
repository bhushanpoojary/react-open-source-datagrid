import React from 'react';
import type { Column, AdvancedFilterValue, Row } from './types';
interface AdvancedFilterBuilderProps {
    column: Column;
    filterValue: AdvancedFilterValue | null;
    onApply: (value: AdvancedFilterValue | null) => void;
    onClose: () => void;
    rows: Row[];
    anchorEl: HTMLElement | null;
}
export declare const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps>;
export {};
