/**
 * DataGrid Density Mode System
 * Provides Compact, Normal, and Comfortable display modes with CSS variables
 */

export type DensityMode = 'compact' | 'normal' | 'comfortable';

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
export const densityConfigs: Record<DensityMode, DensityConfig> = {
  compact: {
    mode: 'compact',
    rowHeight: '32px',
    cellPadding: '4px 8px',
    headerPadding: '6px 8px',
    fontSize: '13px',
    fontSizeSmall: '11px',
  },
  normal: {
    mode: 'normal',
    rowHeight: '44px',
    cellPadding: '10px 12px',
    headerPadding: '10px 12px',
    fontSize: '14px',
    fontSizeSmall: '12px',
  },
  comfortable: {
    mode: 'comfortable',
    rowHeight: '56px',
    cellPadding: '14px 16px',
    headerPadding: '14px 16px',
    fontSize: '15px',
    fontSizeSmall: '13px',
  },
};

/**
 * Get density configuration by mode
 */
export function getDensityConfig(mode: DensityMode = 'normal'): DensityConfig {
  return densityConfigs[mode];
}

/**
 * Generate CSS variables from density configuration
 */
export function generateDensityCSS(mode: DensityMode): Record<string, string> {
  const config = getDensityConfig(mode);
  
  return {
    '--grid-row-height': config.rowHeight,
    '--grid-cell-padding': config.cellPadding,
    '--grid-header-padding': config.headerPadding,
    '--grid-font-size': config.fontSize,
    '--grid-font-size-sm': config.fontSizeSmall,
  };
}

/**
 * Get all density mode names
 */
export function getDensityModes(): DensityMode[] {
  return ['compact', 'normal', 'comfortable'];
}

/**
 * Get display label for density mode
 */
export function getDensityLabel(mode: DensityMode): string {
  const labels: Record<DensityMode, string> = {
    compact: 'Compact',
    normal: 'Normal',
    comfortable: 'Comfortable',
  };
  return labels[mode];
}

/**
 * Persist density mode to localStorage
 */
export function saveDensityMode(mode: DensityMode, key = 'grid-density-mode'): void {
  try {
    localStorage.setItem(key, mode);
  } catch (error) {
    console.warn('Failed to save density mode:', error);
  }
}

/**
 * Load density mode from localStorage
 */
export function loadDensityMode(key = 'grid-density-mode'): DensityMode | null {
  try {
    const saved = localStorage.getItem(key);
    if (saved && (saved === 'compact' || saved === 'normal' || saved === 'comfortable')) {
      return saved as DensityMode;
    }
  } catch (error) {
    console.warn('Failed to load density mode:', error);
  }
  return null;
}
