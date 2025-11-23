/**
 * DataGrid Theme System
 * Provides multiple pre-built themes: Quartz, Alpine, Material, Dark
 */

export type ThemeName = 'quartz' | 'alpine' | 'material' | 'dark';

export interface GridTheme {
  name: ThemeName;
  displayName: string;
  colors: {
    // Background colors
    background: string;
    backgroundAlt: string;
    headerBackground: string;
    footerBackground: string;
    
    // Border colors
    border: string;
    borderLight: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textInverse: string;
    headerText: string;
    
    // Interactive colors
    hover: string;
    active: string;
    selected: string;
    
    // Accent colors
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    primaryBackground: string;
    
    // Muted colors
    textMuted: string;
    borderHover: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    cellPadding: string;
    headerPadding: string;
    rowHeight: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontSizeSmall: string;
    fontWeight: string;
    headerFontWeight: string;
  };
  borders: {
    width: string;
    radius: string;
    style: string;
  };
  shadows: {
    light: string;
    medium: string;
    heavy: string;
  };
}

/**
 * Quartz Theme - Modern white with clean aesthetics
 */
export const quartzTheme: GridTheme = {
  name: 'quartz',
  displayName: 'Quartz (Modern White)',
  colors: {
    background: '#ffffff',
    backgroundAlt: '#f9fafb',
    headerBackground: '#f3f4f6',
    footerBackground: '#f9fafb',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    textInverse: '#ffffff',
    headerText: '#374151',
    hover: '#f3f4f6',
    active: '#e5e7eb',
    selected: '#dbeafe',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#93c5fd',
    primaryDark: '#1e40af',
    primaryBackground: '#eff6ff',
    textMuted: '#6b7280',
    borderHover: '#9ca3af',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    fontSizeSmall: '12px',
    fontWeight: '400',
    headerFontWeight: '600',
  },
  borders: {
    width: '1px',
    radius: '8px',
    style: 'solid',
  },
  shadows: {
    light: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    heavy: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

/**
 * Alpine Theme - Classic business with professional look
 */
export const alpineTheme: GridTheme = {
  name: 'alpine',
  displayName: 'Alpine (Classic Business)',
  colors: {
    background: '#ffffff',
    backgroundAlt: '#fafafa',
    headerBackground: '#f5f5f5',
    footerBackground: '#f5f5f5',
    border: '#d9d9d9',
    borderLight: '#e8e8e8',
    text: '#262626',
    textSecondary: '#595959',
    textInverse: '#ffffff',
    headerText: '#262626',
    hover: '#f5f5f5',
    active: '#e8e8e8',
    selected: '#e6f7ff',
    primary: '#1890ff',
    primaryHover: '#096dd9',
    primaryLight: '#91d5ff',
    primaryDark: '#0050b3',
    primaryBackground: '#e6f7ff',
    textMuted: '#8c8c8c',
    borderHover: '#bfbfbf',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#1890ff',
  },
  spacing: {
    cellPadding: '10px 12px',
    headerPadding: '10px 12px',
    rowHeight: '44px',
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontSize: '13px',
    fontSizeSmall: '11px',
    fontWeight: '400',
    headerFontWeight: '600',
  },
  borders: {
    width: '1px',
    radius: '4px',
    style: 'solid',
  },
  shadows: {
    light: '0 1px 2px rgba(0, 0, 0, 0.08)',
    medium: '0 2px 8px rgba(0, 0, 0, 0.12)',
    heavy: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
};

/**
 * Material Theme - Material Design inspired
 */
export const materialTheme: GridTheme = {
  name: 'material',
  displayName: 'Material',
  colors: {
    background: '#ffffff',
    backgroundAlt: '#fafafa',
    headerBackground: '#f5f5f5',
    footerBackground: '#f5f5f5',
    border: '#e0e0e0',
    borderLight: '#eeeeee',
    text: '#212121',
    textSecondary: '#757575',
    textInverse: '#ffffff',
    headerText: '#424242',
    hover: '#f5f5f5',
    active: '#eeeeee',
    selected: '#e3f2fd',
    primary: '#2196f3',
    primaryHover: '#1976d2',
    primaryLight: '#90caf9',
    primaryDark: '#0d47a1',
    primaryBackground: '#e3f2fd',
    textMuted: '#757575',
    borderHover: '#bdbdbd',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },
  spacing: {
    cellPadding: '14px 16px',
    headerPadding: '14px 16px',
    rowHeight: '52px',
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    fontSizeSmall: '12px',
    fontWeight: '400',
    headerFontWeight: '500',
  },
  borders: {
    width: '1px',
    radius: '4px',
    style: 'solid',
  },
  shadows: {
    light: '0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)',
    medium: '0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12)',
    heavy: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)',
  },
};

/**
 * Dark Theme - Dark mode for reduced eye strain
 */
export const darkTheme: GridTheme = {
  name: 'dark',
  displayName: 'Dark Mode',
  colors: {
    background: '#1e1e1e',
    backgroundAlt: '#252526',
    headerBackground: '#2d2d30',
    footerBackground: '#252526',
    border: '#3e3e42',
    borderLight: '#333333',
    text: '#d4d4d4',
    textSecondary: '#969696',
    textInverse: '#1e1e1e',
    headerText: '#e0e0e0',
    hover: '#2a2d2e',
    active: '#37373d',
    selected: '#264f78',
    primary: '#4a9eff',
    primaryHover: '#6eb4ff',
    primaryLight: '#80b9ff',
    primaryDark: '#2d7dd2',
    primaryBackground: '#1e3a5f',
    textMuted: '#858585',
    borderHover: '#505050',
    success: '#4ec9b0',
    warning: '#dcdcaa',
    error: '#f48771',
    info: '#4a9eff',
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    fontSizeSmall: '12px',
    fontWeight: '400',
    headerFontWeight: '600',
  },
  borders: {
    width: '1px',
    radius: '6px',
    style: 'solid',
  },
  shadows: {
    light: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
    heavy: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },
};

/**
 * Theme registry - all available themes
 */
export const themes: Record<ThemeName, GridTheme> = {
  quartz: quartzTheme,
  alpine: alpineTheme,
  material: materialTheme,
  dark: darkTheme,
};

/**
 * Get theme by name
 */
export function getTheme(themeName: ThemeName): GridTheme {
  return themes[themeName] || quartzTheme;
}

/**
 * Get all available theme names
 */
export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}

/**
 * Generate CSS variables from theme
 */
export function generateThemeCSS(theme: GridTheme): Record<string, string> {
  return {
    '--grid-bg': theme.colors.background,
    '--grid-bg-alt': theme.colors.backgroundAlt,
    '--grid-header-bg': theme.colors.headerBackground,
    '--grid-footer-bg': theme.colors.footerBackground,
    '--grid-border': theme.colors.border,
    '--grid-border-light': theme.colors.borderLight,
    '--grid-text': theme.colors.text,
    '--grid-text-secondary': theme.colors.textSecondary,
    '--grid-text-inverse': theme.colors.textInverse,
    '--grid-header-text': theme.colors.headerText,
    '--grid-hover': theme.colors.hover,
    '--grid-active': theme.colors.active,
    '--grid-selected': theme.colors.selected,
    '--grid-primary': theme.colors.primary,
    '--grid-primary-hover': theme.colors.primaryHover,
    '--grid-primary-light': theme.colors.primaryLight,
    '--grid-primary-dark': theme.colors.primaryDark,
    '--grid-primary-bg': theme.colors.primaryBackground,
    '--grid-text-muted': theme.colors.textMuted,
    '--grid-border-hover': theme.colors.borderHover,
    '--grid-success': theme.colors.success,
    '--grid-warning': theme.colors.warning,
    '--grid-error': theme.colors.error,
    '--grid-info': theme.colors.info,
    '--grid-cell-padding': theme.spacing.cellPadding,
    '--grid-header-padding': theme.spacing.headerPadding,
    '--grid-row-height': theme.spacing.rowHeight,
    '--grid-font-family': theme.typography.fontFamily,
    '--grid-font-size': theme.typography.fontSize,
    '--grid-font-size-sm': theme.typography.fontSizeSmall,
    '--grid-font-weight': theme.typography.fontWeight,
    '--grid-header-font-weight': theme.typography.headerFontWeight,
    '--grid-border-width': theme.borders.width,
    '--grid-border-radius': theme.borders.radius,
    '--grid-border-style': theme.borders.style,
    '--grid-shadow-light': theme.shadows.light,
    '--grid-shadow-medium': theme.shadows.medium,
    '--grid-shadow-heavy': theme.shadows.heavy,
  };
}
