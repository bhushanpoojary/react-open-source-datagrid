import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { getTheme } from './themes';
/**
 * ThemeSelector Component
 * Dropdown to switch between available themes
 */
export const ThemeSelector = ({ currentTheme, onThemeChange, }) => {
    const themes = [
        { value: 'quartz', label: 'Quartz (Modern White)' },
        { value: 'alpine', label: 'Alpine (Classic Business)' },
        { value: 'material', label: 'Material' },
        { value: 'dark', label: 'Dark Mode' },
        { value: 'nord', label: 'Nord (Arctic)' },
        { value: 'dracula', label: 'Dracula' },
        { value: 'solarized-light', label: 'Solarized Light' },
        { value: 'solarized-dark', label: 'Solarized Dark' },
        { value: 'monokai', label: 'Monokai' },
        { value: 'one-dark', label: 'One Dark' },
    ];
    const handleChange = (event) => {
        onThemeChange(event.target.value);
    };
    const theme = getTheme(currentTheme);
    return (_jsxs("div", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' }, children: [_jsx("label", { htmlFor: "theme-selector", style: {
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.colors.text,
                }, children: "Theme:" }), _jsx("select", { id: "theme-selector", value: currentTheme, onChange: handleChange, style: {
                    padding: '6px 32px 6px 12px',
                    fontSize: '14px',
                    fontFamily: theme.typography.fontFamily,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borders.radius,
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    transition: 'border-color 0.2s',
                }, onMouseEnter: (e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                }, onMouseLeave: (e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                }, children: themes.map((themeOption) => (_jsx("option", { value: themeOption.value, children: themeOption.label }, themeOption.value))) })] }));
};
