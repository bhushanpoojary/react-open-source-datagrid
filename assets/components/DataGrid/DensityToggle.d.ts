import React from 'react';
import type { DensityMode } from './densityModes';
export interface DensityToggleProps {
    value: DensityMode;
    onChange: (mode: DensityMode) => void;
    className?: string;
    disabled?: boolean;
}
/**
 * DensityToggle Component
 *
 * A segmented control for switching between Compact, Normal, and Comfortable density modes.
 * Displays as a horizontal button group with clear visual feedback.
 *
 * @example
 * ```tsx
 * <DensityToggle
 *   value={densityMode}
 *   onChange={setDensityMode}
 * />
 * ```
 */
export declare const DensityToggle: React.FC<DensityToggleProps>;
