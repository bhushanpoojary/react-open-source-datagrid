/**
 * DataGrid Theme System
 * Provides multiple pre-built themes: Quartz, Alpine, Material, Dark
 */

export type ThemeName = 'quartz' | 'alpine' | 'material' | 'dark' | 'nord' | 'dracula' | 'solarized-light' | 'solarized-dark' | 'monokai' | 'one-dark';

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
 * Nord Theme - Cool, arctic-inspired colors
 */
export const nordTheme: GridTheme = {
  name: 'nord',
  displayName: 'Nord (Arctic)',
  colors: {
    background: '#eceff4',
    backgroundAlt: '#e5e9f0',
    headerBackground: '#d8dee9',
    footerBackground: '#e5e9f0',
    border: '#d8dee9',
    borderLight: '#e5e9f0',
    text: '#2e3440',
    textSecondary: '#4c566a',
    textInverse: '#eceff4',
    headerText: '#2e3440',
    hover: '#e5e9f0',
    active: '#d8dee9',
    selected: '#d8dee9',
    primary: '#5e81ac',
    primaryHover: '#81a1c1',
    primaryLight: '#88c0d0',
    primaryDark: '#5e81ac',
    primaryBackground: '#d8dee9',
    textMuted: '#4c566a',
    borderHover: '#4c566a',
    success: '#a3be8c',
    warning: '#ebcb8b',
    error: '#bf616a',
    info: '#88c0d0',
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
    light: '0 1px 3px rgba(0, 0, 0, 0.12)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.15)',
    heavy: '0 8px 16px rgba(0, 0, 0, 0.18)',
  },
};

/**
 * Dracula Theme - Popular purple-tinted dark theme
 */
export const draculaTheme: GridTheme = {
  name: 'dracula',
  displayName: 'Dracula',
  colors: {
    background: '#282a36',
    backgroundAlt: '#21222c',
    headerBackground: '#44475a',
    footerBackground: '#21222c',
    border: '#44475a',
    borderLight: '#6272a4',
    text: '#f8f8f2',
    textSecondary: '#6272a4',
    textInverse: '#282a36',
    headerText: '#f8f8f2',
    hover: '#44475a',
    active: '#6272a4',
    selected: '#44475a',
    primary: '#bd93f9',
    primaryHover: '#caa9fa',
    primaryLight: '#d6bcfb',
    primaryDark: '#9b72dd',
    primaryBackground: '#44475a',
    textMuted: '#6272a4',
    borderHover: '#bd93f9',
    success: '#50fa7b',
    warning: '#f1fa8c',
    error: '#ff5555',
    info: '#8be9fd',
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: '"Fira Code", "Consolas", monospace, -apple-system, BlinkMacSystemFont, "Segoe UI"',
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
    light: '0 2px 4px rgba(0, 0, 0, 0.4)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.5)',
    heavy: '0 8px 16px rgba(0, 0, 0, 0.6)',
  },
};

/**
 * Solarized Light Theme - Precision colors for readability
 */
export const solarizedLightTheme: GridTheme = {
  name: 'solarized-light',
  displayName: 'Solarized Light',
  colors: {
    background: '#fdf6e3',
    backgroundAlt: '#eee8d5',
    headerBackground: '#eee8d5',
    footerBackground: '#eee8d5',
    border: '#93a1a1',
    borderLight: '#eee8d5',
    text: '#657b83',
    textSecondary: '#93a1a1',
    textInverse: '#fdf6e3',
    headerText: '#586e75',
    hover: '#eee8d5',
    active: '#93a1a1',
    selected: '#d3cbb7',
    primary: '#268bd2',
    primaryHover: '#2aa198',
    primaryLight: '#6c71c4',
    primaryDark: '#073642',
    primaryBackground: '#eee8d5',
    textMuted: '#93a1a1',
    borderHover: '#657b83',
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#268bd2',
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: '"Source Code Pro", "Menlo", "Monaco", monospace',
    fontSize: '14px',
    fontSizeSmall: '12px',
    fontWeight: '400',
    headerFontWeight: '600',
  },
  borders: {
    width: '1px',
    radius: '4px',
    style: 'solid',
  },
  shadows: {
    light: '0 1px 3px rgba(0, 0, 0, 0.08)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.12)',
    heavy: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
};

/**
 * Solarized Dark Theme - Dark variant of Solarized
 */
export const solarizedDarkTheme: GridTheme = {
  name: 'solarized-dark',
  displayName: 'Solarized Dark',
  colors: {
    background: '#002b36',
    backgroundAlt: '#073642',
    headerBackground: '#073642',
    footerBackground: '#073642',
    border: '#586e75',
    borderLight: '#073642',
    text: '#839496',
    textSecondary: '#657b83',
    textInverse: '#002b36',
    headerText: '#93a1a1',
    hover: '#073642',
    active: '#586e75',
    selected: '#094757',
    primary: '#268bd2',
    primaryHover: '#2aa198',
    primaryLight: '#6c71c4',
    primaryDark: '#073642',
    primaryBackground: '#073642',
    textMuted: '#657b83',
    borderHover: '#839496',
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#268bd2',
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: '"Source Code Pro", "Menlo", "Monaco", monospace',
    fontSize: '14px',
    fontSizeSmall: '12px',
    fontWeight: '400',
    headerFontWeight: '600',
  },
  borders: {
    width: '1px',
    radius: '4px',
    style: 'solid',
  },
  shadows: {
    light: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
    heavy: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },
};

/**
 * Monokai Theme - Vibrant colors on dark background
 */
export const monokaiTheme: GridTheme = {
  name: 'monokai',
  displayName: 'Monokai',
  colors: {
    background: '#272822',
    backgroundAlt: '#1e1f1c',
    headerBackground: '#3e3d32',
    footerBackground: '#1e1f1c',
    border: '#49483e',
    borderLight: '#3e3d32',
    text: '#f8f8f2',
    textSecondary: '#75715e',
    textInverse: '#272822',
    headerText: '#f8f8f2',
    hover: '#3e3d32',
    active: '#49483e',
    selected: '#49483e',
    primary: '#66d9ef',
    primaryHover: '#a6e22e',
    primaryLight: '#e6db74',
    primaryDark: '#ae81ff',
    primaryBackground: '#3e3d32',
    textMuted: '#75715e',
    borderHover: '#66d9ef',
    success: '#a6e22e',
    warning: '#e6db74',
    error: '#f92672',
    info: '#66d9ef',
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
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
    light: '0 2px 4px rgba(0, 0, 0, 0.5)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.6)',
    heavy: '0 8px 16px rgba(0, 0, 0, 0.7)',
  },
};

/**
 * One Dark Theme - Atom's iconic dark theme
 */
export const oneDarkTheme: GridTheme = {
  name: 'one-dark',
  displayName: 'One Dark',
  colors: {
    background: '#282c34',
    backgroundAlt: '#21252b',
    headerBackground: '#2c313c',
    footerBackground: '#21252b',
    border: '#3e4451',
    borderLight: '#2c313c',
    text: '#abb2bf',
    textSecondary: '#5c6370',
    textInverse: '#282c34',
    headerText: '#abb2bf',
    hover: '#2c313c',
    active: '#3e4451',
    selected: '#3e4451',
    primary: '#61afef',
    primaryHover: '#528bff',
    primaryLight: '#84b9f0',
    primaryDark: '#4e88c7',
    primaryBackground: '#2c313c',
    textMuted: '#5c6370',
    borderHover: '#528bff',
    success: '#98c379',
    warning: '#e5c07b',
    error: '#e06c75',
    info: '#61afef',
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: '"Fira Code", "Menlo", "Monaco", "Consolas", monospace',
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
    light: '0 2px 4px rgba(0, 0, 0, 0.4)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.5)',
    heavy: '0 8px 16px rgba(0, 0, 0, 0.6)',
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
  nord: nordTheme,
  dracula: draculaTheme,
  'solarized-light': solarizedLightTheme,
  'solarized-dark': solarizedDarkTheme,
  monokai: monokaiTheme,
  'one-dark': oneDarkTheme,
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
