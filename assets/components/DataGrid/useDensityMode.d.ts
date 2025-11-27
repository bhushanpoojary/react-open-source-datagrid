import type { DensityMode } from './densityModes';
import { getDensityConfig } from './densityModes';
export interface UseDensityModeOptions {
    initialMode?: DensityMode;
    persist?: boolean;
    persistenceKey?: string;
    onChange?: (mode: DensityMode) => void;
}
export interface UseDensityModeReturn {
    densityMode: DensityMode;
    setDensityMode: (mode: DensityMode) => void;
    densityConfig: ReturnType<typeof getDensityConfig>;
    densityStyles: Record<string, string>;
}
/**
 * useDensityMode Hook
 *
 * Manages density mode state and provides CSS variables for styling.
 * Supports persistence to localStorage.
 *
 * @example
 * ```tsx
 * const { densityMode, setDensityMode, densityStyles } = useDensityMode({
 *   initialMode: 'normal',
 *   persist: true
 * });
 *
 * return (
 *   <div style={densityStyles}>
 *     <DensityToggle value={densityMode} onChange={setDensityMode} />
 *     <DataGrid ... />
 *   </div>
 * );
 * ```
 */
export declare function useDensityMode(options?: UseDensityModeOptions): UseDensityModeReturn;
