/**
 * DataGrid Density Mode System
 * Provides Ultra Compact, Compact, Normal, and Comfortable display modes with CSS variables
 */
export type DensityMode = 'ultraCompact' | 'compact' | 'normal' | 'comfortable';
export interface DensityConfig {
    mode: DensityMode;
    rowHeight: string;
    cellPadding: string;
    headerPadding: string;
    fontSize: string;
    fontSizeSmall: string;
}
/**
 * Density mode configurations
 * Defines row height, padding, and font sizes for each density mode
 */
export declare const densityConfigs: Record<DensityMode, DensityConfig>;
/**
 * Get density configuration by mode
 */
export declare function getDensityConfig(mode?: DensityMode): DensityConfig;
/**
 * Generate CSS variables from density configuration
 */
export declare function generateDensityCSS(mode: DensityMode): Record<string, string>;
/**
 * Get all density mode names
 */
export declare function getDensityModes(): DensityMode[];
/**
 * Get display label for density mode
 */
export declare function getDensityLabel(mode: DensityMode): string;
/**
 * Persist density mode to localStorage
 */
export declare function saveDensityMode(mode: DensityMode, key?: string): void;
/**
 * Load density mode from localStorage
 */
export declare function loadDensityMode(key?: string): DensityMode | null;
