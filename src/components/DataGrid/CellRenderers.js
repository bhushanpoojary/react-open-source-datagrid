import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const StatusChip = ({ status }) => {
    const getStatusStyles = (status) => {
        const normalized = status.toLowerCase();
        switch (normalized) {
            case 'active':
                return {
                    bg: '#dcfce7',
                    text: '#15803d',
                    border: '#86efac',
                };
            case 'inactive':
                return {
                    bg: '#fee2e2',
                    text: '#991b1b',
                    border: '#fca5a5',
                };
            case 'pending':
                return {
                    bg: '#fef3c7',
                    text: '#92400e',
                    border: '#fde047',
                };
            case 'completed':
                return {
                    bg: '#dbeafe',
                    text: '#1e40af',
                    border: '#93c5fd',
                };
            default:
                return {
                    bg: '#f3f4f6',
                    text: '#374151',
                    border: '#d1d5db',
                };
        }
    };
    const styles = getStatusStyles(status);
    return (_jsx("span", { style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: styles.bg,
            color: styles.text,
            border: `1px solid ${styles.border}`,
        }, children: status }));
};
export const ProgressBar = ({ value, color = '#3b82f6', showLabel = true, }) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }, children: [_jsx("div", { style: {
                    flex: 1,
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }, children: _jsx("div", { style: {
                        width: `${clampedValue}%`,
                        height: '100%',
                        backgroundColor: color,
                        transition: 'width 0.3s ease',
                    } }) }), showLabel && (_jsxs("span", { style: { fontSize: '12px', fontWeight: 500, color: '#6b7280', minWidth: '35px' }, children: [clampedValue, "%"] }))] }));
};
export const IconCell = ({ icon, text, iconColor }) => {
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '16px', color: iconColor }, children: icon }), text && _jsx("span", { style: { fontSize: '13px' }, children: text })] }));
};
export const ImageCell = ({ src, alt, text, size = 32, }) => {
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("img", { src: src, alt: alt, style: {
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #e5e7eb',
                } }), text && _jsx("span", { style: { fontSize: '13px' }, children: text })] }));
};
export const ButtonCell = ({ label, onClick, variant = 'primary', disabled = false, }) => {
    const getButtonStyles = () => {
        if (disabled) {
            return {
                bg: '#e5e7eb',
                text: '#9ca3af',
                border: '#d1d5db',
                cursor: 'not-allowed',
            };
        }
        switch (variant) {
            case 'primary':
                return {
                    bg: '#3b82f6',
                    text: '#ffffff',
                    border: '#2563eb',
                    cursor: 'pointer',
                };
            case 'secondary':
                return {
                    bg: '#ffffff',
                    text: '#374151',
                    border: '#d1d5db',
                    cursor: 'pointer',
                };
            case 'danger':
                return {
                    bg: '#ef4444',
                    text: '#ffffff',
                    border: '#dc2626',
                    cursor: 'pointer',
                };
        }
    };
    const styles = getButtonStyles();
    return (_jsx("button", { onClick: (e) => {
            e.stopPropagation(); // Prevent row selection
            if (!disabled)
                onClick(e);
        }, disabled: disabled, style: {
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: styles.bg,
            color: styles.text,
            border: `1px solid ${styles.border}`,
            borderRadius: '4px',
            cursor: styles.cursor,
            transition: 'all 0.2s ease',
        }, onMouseEnter: (e) => {
            if (!disabled && variant === 'primary') {
                e.currentTarget.style.backgroundColor = '#2563eb';
            }
            else if (!disabled && variant === 'secondary') {
                e.currentTarget.style.backgroundColor = '#f9fafb';
            }
            else if (!disabled && variant === 'danger') {
                e.currentTarget.style.backgroundColor = '#dc2626';
            }
        }, onMouseLeave: (e) => {
            if (!disabled) {
                e.currentTarget.style.backgroundColor = styles.bg;
            }
        }, children: label }));
};
export const BadgeCell = ({ text, color = '#1f2937', backgroundColor = '#f3f4f6', }) => {
    return (_jsx("span", { style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor,
            color,
        }, children: text }));
};
export const PriorityIndicator = ({ priority }) => {
    const getPriorityStyles = () => {
        switch (priority) {
            case 'low':
                return { icon: '●', color: '#10b981', text: 'Low' };
            case 'medium':
                return { icon: '●', color: '#f59e0b', text: 'Medium' };
            case 'high':
                return { icon: '●', color: '#ef4444', text: 'High' };
            case 'critical':
                return { icon: '●', color: '#991b1b', text: 'Critical' };
        }
    };
    const styles = getPriorityStyles();
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("span", { style: { color: styles.color, fontSize: '18px' }, children: styles.icon }), _jsx("span", { style: { fontSize: '13px', fontWeight: 500 }, children: styles.text })] }));
};
export const Rating = ({ rating, maxRating = 5 }) => {
    const stars = Array.from({ length: maxRating }, (_, i) => i < rating ? '★' : '☆');
    return (_jsx("div", { style: { display: 'flex', gap: '2px', fontSize: '14px', color: '#f59e0b' }, children: stars.map((star, i) => (_jsx("span", { children: star }, i))) }));
};
export const CurrencyCell = ({ amount, currency = 'USD', locale = 'en-US', }) => {
    const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
    return (_jsx("span", { style: { fontWeight: 500, color: amount < 0 ? '#ef4444' : '#059669' }, children: formatted }));
};
