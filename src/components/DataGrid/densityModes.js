/**
 * DataGrid Density Mode System
 * Provides Ultra Compact, Compact, Normal, and Comfortable display modes with CSS variables
 */
/**
 * Density mode configurations
 * Defines row height, padding, and font sizes for each density mode
 */
export const densityConfigs = {
    ultraCompact: {
        mode: 'ultraCompact',
        rowHeight: '24px',
        cellPadding: '2px 6px',
        headerPadding: '4px 6px',
        fontSize: '12px',
        fontSizeSmall: '10px',
    },
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
export function getDensityConfig(mode = 'normal') {
    return densityConfigs[mode];
}
/**
 * Generate CSS variables from density configuration
 */
export function generateDensityCSS(mode) {
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
export function getDensityModes() {
    return ['ultraCompact', 'compact', 'normal', 'comfortable'];
}
/**
 * Get display label for density mode
 */
export function getDensityLabel(mode) {
    const labels = {
        ultraCompact: 'Ultra Compact',
        compact: 'Compact',
        normal: 'Normal',
        comfortable: 'Comfortable',
    };
    return labels[mode];
}
/**
 * Persist density mode to localStorage
 */
export function saveDensityMode(mode, key = 'grid-density-mode') {
    try {
        localStorage.setItem(key, mode);
    }
    catch (error) {
        console.warn('Failed to save density mode:', error);
    }
}
/**
 * Load density mode from localStorage
 */
export function loadDensityMode(key = 'grid-density-mode') {
    try {
        const saved = localStorage.getItem(key);
        if (saved && (saved === 'ultraCompact' || saved === 'compact' || saved === 'normal' || saved === 'comfortable')) {
            return saved;
        }
    }
    catch (error) {
        console.warn('Failed to load density mode:', error);
    }
    return null;
}
