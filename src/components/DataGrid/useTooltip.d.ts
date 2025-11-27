import type { TooltipState, TooltipConfig, Row, Column } from './types';
interface UseTooltipProps {
    config?: TooltipConfig;
}
interface TooltipHandlers {
    onCellMouseEnter: (event: React.MouseEvent, row: Row, column: Column, value: any) => void;
    onCellMouseLeave: () => void;
    onRowMouseEnter: (event: React.MouseEvent, row: Row, rowIndex: number) => void;
    onRowMouseLeave: () => void;
}
/**
 * useTooltip Hook
 *
 * Manages tooltip state with hover detection, delay handling, and smart positioning.
 */
export declare const useTooltip: ({ config }?: UseTooltipProps) => {
    tooltipState: TooltipState;
    tooltipHandlers: TooltipHandlers;
    hideTooltip: () => void;
};
export {};
