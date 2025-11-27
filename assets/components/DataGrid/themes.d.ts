/**
 * DataGrid Theme System
 * Provides multiple pre-built themes: Quartz, Alpine, Material, Dark
 */
export type ThemeName = 'quartz' | 'alpine' | 'material' | 'dark' | 'nord' | 'dracula' | 'solarized-light' | 'solarized-dark' | 'monokai' | 'one-dark';
export interface GridTheme {
    name: ThemeName;
    displayName: string;
    colors: {
        background: string;
        backgroundAlt: string;
        headerBackground: string;
        footerBackground: string;
        border: string;
        borderLight: string;
        text: string;
        textSecondary: string;
        textInverse: string;
        headerText: string;
        hover: string;
        active: string;
        selected: string;
        primary: string;
        primaryHover: string;
        primaryLight: string;
        primaryDark: string;
        primaryBackground: string;
        textMuted: string;
        borderHover: string;
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
export declare const quartzTheme: GridTheme;
/**
 * Alpine Theme - Classic business with professional look
 */
export declare const alpineTheme: GridTheme;
/**
 * Material Theme - Material Design inspired
 */
export declare const materialTheme: GridTheme;
/**
 * Dark Theme - Dark mode for reduced eye strain
 */
export declare const darkTheme: GridTheme;
/**
 * Nord Theme - Cool, arctic-inspired colors
 */
export declare const nordTheme: GridTheme;
/**
 * Dracula Theme - Popular purple-tinted dark theme
 */
export declare const draculaTheme: GridTheme;
/**
 * Solarized Light Theme - Precision colors for readability
 */
export declare const solarizedLightTheme: GridTheme;
/**
 * Solarized Dark Theme - Dark variant of Solarized
 */
export declare const solarizedDarkTheme: GridTheme;
/**
 * Monokai Theme - Vibrant colors on dark background
 */
export declare const monokaiTheme: GridTheme;
/**
 * One Dark Theme - Atom's iconic dark theme
 */
export declare const oneDarkTheme: GridTheme;
/**
 * Theme registry - all available themes
 */
export declare const themes: Record<ThemeName, GridTheme>;
/**
 * Get theme by name
 */
export declare function getTheme(themeName: ThemeName): GridTheme;
/**
 * Get all available theme names
 */
export declare function getThemeNames(): ThemeName[];
/**
 * Generate CSS variables from theme
 */
export declare function generateThemeCSS(theme: GridTheme): Record<string, string>;
