import React from 'react';
import type { ThemeName } from './themes';
interface ThemeSelectorProps {
    currentTheme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
}
/**
 * ThemeSelector Component
 * Dropdown to switch between available themes
 */
export declare const ThemeSelector: React.FC<ThemeSelectorProps>;
export {};
