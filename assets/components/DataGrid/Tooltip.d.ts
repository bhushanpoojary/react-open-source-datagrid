import React from 'react';
import type { TooltipState } from './types';
interface TooltipProps {
    state: TooltipState;
    maxWidth?: number;
    offset?: number;
}
/**
 * Tooltip Component
 *
 * Renders tooltips using React portals for proper z-index layering.
 * Includes smart placement logic to keep tooltips within viewport bounds.
 */
export declare const Tooltip: React.FC<TooltipProps>;
export {};
