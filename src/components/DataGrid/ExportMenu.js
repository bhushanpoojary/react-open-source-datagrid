import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { handleExport } from './exportUtils';
export const ExportMenu = ({ columns, fullDataset, filteredData, selectedRows, currentPageData, onExport, }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [format, setFormat] = useState('csv');
    const [scope, setScope] = useState('filtered');
    const [styling, setStyling] = useState('basic');
    const [buttonRect, setButtonRect] = useState(null);
    const buttonRef = React.useRef(null);
    const getDataByScope = () => {
        switch (scope) {
            case 'all':
                return fullDataset;
            case 'filtered':
                return filteredData;
            case 'selected':
                return selectedRows.size > 0
                    ? filteredData.filter(row => selectedRows.has(row.id))
                    : [];
            case 'page':
                return currentPageData;
            default:
                return filteredData;
        }
    };
    const handleExportClick = () => {
        const data = getDataByScope();
        if (data.length === 0) {
            alert(`No ${scope === 'selected' ? 'selected' : scope} data to export`);
            return;
        }
        handleExport(data, columns, {
            format,
            scope,
            styling: format === 'xlsx' ? styling : undefined,
        });
        onExport?.(true);
        setShowMenu(false);
    };
    const scopeOptions = [
        { value: 'all', label: 'Full Dataset', disabled: false },
        {
            value: 'filtered',
            label: 'Filtered Data',
            disabled: filteredData.length === 0
        },
        {
            value: 'selected',
            label: `Selected Rows (${selectedRows.size})`,
            disabled: selectedRows.size === 0
        },
        {
            value: 'page',
            label: 'Current Page',
            disabled: currentPageData.length === 0
        },
    ];
    return (_jsxs("div", { style: { position: 'relative' }, children: [_jsxs("button", { ref: buttonRef, onClick: () => {
                    if (!showMenu) {
                        const rect = buttonRef.current?.getBoundingClientRect();
                        if (rect) {
                            setButtonRect(rect);
                        }
                    }
                    setShowMenu(!showMenu);
                }, style: {
                    padding: '8px 12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                }, onMouseEnter: (e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                }, onMouseLeave: (e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                }, title: "Export data to CSV or XLSX format", children: [_jsx("svg", { style: { width: '16px', height: '16px' }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" }) }), "Export"] }), showMenu && buttonRect && (_jsxs("div", { style: {
                    position: 'fixed',
                    left: `${buttonRect.left}px`,
                    top: `${buttonRect.bottom + 8}px`,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    zIndex: 50,
                    padding: '20px',
                    width: '420px',
                    minWidth: '420px',
                    maxWidth: '420px',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }, children: [_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }, children: "Format" }), _jsxs("div", { style: { display: 'flex', gap: '16px' }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "radio", name: "format", value: "csv", checked: format === 'csv', onChange: (e) => setFormat(e.target.value), style: { width: '16px', height: '16px', cursor: 'pointer' } }), _jsx("span", { style: { fontSize: '14px', color: '#374151' }, children: "CSV" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "radio", name: "format", value: "xlsx", checked: format === 'xlsx', onChange: (e) => setFormat(e.target.value), style: { width: '16px', height: '16px', cursor: 'pointer' } }), _jsx("span", { style: { fontSize: '14px', color: '#374151' }, children: "XLSX (Excel)" })] })] })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }, children: "Data Scope" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: scopeOptions.map((option) => (_jsxs("label", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        cursor: option.disabled ? 'not-allowed' : 'pointer',
                                        opacity: option.disabled ? 0.5 : 1,
                                        backgroundColor: 'transparent',
                                        transition: 'background-color 0.15s',
                                        userSelect: 'none'
                                    }, onMouseEnter: (e) => {
                                        if (!option.disabled) {
                                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                                        }
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }, children: [_jsx("input", { type: "radio", name: "scope", value: option.value, checked: scope === option.value, onChange: (e) => setScope(e.target.value), disabled: option.disabled, style: { width: '16px', height: '16px', cursor: option.disabled ? 'not-allowed' : 'pointer' } }), _jsx("span", { style: { fontSize: '14px', color: '#374151' }, children: option.label })] }, option.value))) })] }), format === 'xlsx' && (_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }, children: "Styling" }), _jsx("div", { style: { marginBottom: '10px' }, children: _jsxs("div", { style: { display: 'flex', gap: '16px' }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "radio", name: "styling", value: "basic", checked: styling === 'basic', onChange: (e) => setStyling(e.target.value), style: { width: '16px', height: '16px', cursor: 'pointer' } }), _jsx("span", { style: { fontSize: '14px', color: '#374151' }, children: "Basic" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }, children: [_jsx("input", { type: "radio", name: "styling", value: "professional", checked: styling === 'professional', onChange: (e) => setStyling(e.target.value), style: { width: '16px', height: '16px', cursor: 'pointer' } }), _jsx("span", { style: { fontSize: '14px', color: '#374151' }, children: "Professional" })] })] }) }), _jsx("p", { style: { fontSize: '12px', color: '#6b7280', margin: '0' }, children: "Professional adds colors, borders, and frozen header row" })] })), _jsxs("div", { style: { backgroundColor: '#f3f4f6', borderRadius: '6px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#4b5563' }, children: [_jsxs("p", { style: { margin: '6px 0' }, children: [_jsx("strong", { children: "Data to export:" }), " ", getDataByScope().length, " row(s)"] }), _jsxs("p", { style: { margin: '6px 0' }, children: [_jsx("strong", { children: "Columns:" }), " ", columns.length] })] }), _jsxs("div", { style: { display: 'flex', gap: '10px', justifyContent: 'flex-end' }, children: [_jsx("button", { onClick: () => setShowMenu(false), style: {
                                    padding: '10px 16px',
                                    border: '1px solid #d1d5db',
                                    color: '#374151',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                }, children: "Cancel" }), _jsx("button", { onClick: handleExportClick, disabled: getDataByScope().length === 0, style: {
                                    padding: '10px 16px',
                                    backgroundColor: getDataByScope().length === 0 ? '#9ca3af' : '#2563eb',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: getDataByScope().length === 0 ? 'not-allowed' : 'pointer',
                                    opacity: getDataByScope().length === 0 ? 0.6 : 1,
                                    transition: 'background-color 0.2s'
                                }, onMouseEnter: (e) => {
                                    if (getDataByScope().length > 0) {
                                        e.currentTarget.style.backgroundColor = '#1d4ed8';
                                    }
                                }, onMouseLeave: (e) => {
                                    if (getDataByScope().length > 0) {
                                        e.currentTarget.style.backgroundColor = '#2563eb';
                                    }
                                }, children: "Export Now" })] })] })), showMenu && (_jsx("div", { style: {
                    position: 'fixed',
                    inset: 0,
                    zIndex: 40
                }, onClick: () => setShowMenu(false) }))] }));
};
