import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
export const ColumnChooser = ({ columns, columnOrder, hiddenColumns, onToggleVisibility, onReorderColumns, onResetLayout, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
    const [selectedAvailable, setSelectedAvailable] = useState(null);
    const [selectedVisible, setSelectedVisible] = useState(null);
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    // Split columns into available (hidden) and visible - memoize to prevent re-creation on every render
    const availableColumns = useMemo(() => {
        const hiddenSet = new Set(hiddenColumns);
        const columnMap = new Map(columns.map(col => [col.field, col]));
        return columnOrder
            .map(field => columnMap.get(field))
            .filter((col) => col !== undefined && hiddenSet.has(col.field));
    }, [columnOrder, hiddenColumns, columns]);
    const visibleColumns = useMemo(() => {
        const hiddenSet = new Set(hiddenColumns);
        const columnMap = new Map(columns.map(col => [col.field, col]));
        return columnOrder
            .map(field => columnMap.get(field))
            .filter((col) => col !== undefined && !hiddenSet.has(col.field));
    }, [columnOrder, hiddenColumns, columns]);
    // Update panel position when opened
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPanelPosition({
                top: rect.bottom + 8,
                left: Math.max(20, rect.right - 600), // 600px wide panel
            });
        }
    }, [isOpen]);
    const moveToVisible = () => {
        if (selectedAvailable) {
            onToggleVisibility(selectedAvailable);
            setSelectedAvailable(null);
        }
    };
    const moveToAvailable = () => {
        if (selectedVisible) {
            onToggleVisibility(selectedVisible);
            setSelectedVisible(null);
        }
    };
    const moveAllToVisible = () => {
        availableColumns.forEach(col => onToggleVisibility(col.field));
        setSelectedAvailable(null);
    };
    const moveAllToAvailable = () => {
        visibleColumns.forEach(col => onToggleVisibility(col.field));
        setSelectedVisible(null);
    };
    const moveVisibleUp = () => {
        if (selectedVisible) {
            const index = visibleColumns.findIndex(col => col.field === selectedVisible);
            if (index > 0) {
                const globalIndex = columnOrder.indexOf(selectedVisible);
                const targetField = visibleColumns[index - 1].field;
                const targetGlobalIndex = columnOrder.indexOf(targetField);
                onReorderColumns(globalIndex, targetGlobalIndex);
            }
        }
    };
    const moveVisibleDown = () => {
        if (selectedVisible) {
            const index = visibleColumns.findIndex(col => col.field === selectedVisible);
            if (index < visibleColumns.length - 1) {
                const globalIndex = columnOrder.indexOf(selectedVisible);
                const targetField = visibleColumns[index + 1].field;
                const targetGlobalIndex = columnOrder.indexOf(targetField);
                onReorderColumns(globalIndex, targetGlobalIndex);
            }
        }
    };
    const panelContent = isOpen && (_jsxs(_Fragment, { children: [_jsx("div", { style: { position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.3)' }, onClick: () => setIsOpen(false) }), _jsxs("div", { ref: panelRef, style: {
                    position: 'fixed',
                    backgroundColor: 'var(--grid-bg)',
                    border: '2px solid var(--grid-border)',
                    borderRadius: '8px',
                    boxShadow: 'var(--grid-shadow-heavy, 0 20px 25px -5px rgba(0, 0, 0, 0.1))',
                    zIndex: 10000,
                    opacity: 1,
                    top: `${panelPosition.top}px`,
                    left: `${panelPosition.left}px`,
                    width: '600px',
                    maxHeight: '500px',
                }, children: [_jsxs("div", { style: { paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', backgroundColor: 'var(--grid-bg-alt)', borderBottom: '1px solid var(--grid-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '600', color: 'var(--grid-text)', margin: 0 }, children: "Select Columns" }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { onClick: onResetLayout, style: { fontSize: '12px', color: '#2563eb', fontWeight: '500', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'none', padding: 0 }, onMouseEnter: (e) => { e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.textDecoration = 'underline'; }, onMouseLeave: (e) => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.textDecoration = 'none'; }, children: "Reset" }), _jsx("button", { onClick: () => setIsOpen(false), style: { color: '#6b7280', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: 0, margin: 0 }, onMouseEnter: (e) => e.currentTarget.style.color = '#374151', onMouseLeave: (e) => e.currentTarget.style.color = '#6b7280', children: "\u2715" })] })] }), _jsxs("div", { style: { padding: '16px', display: 'flex', gap: '12px', height: '400px' }, children: [_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { fontSize: '12px', fontWeight: '600', color: 'var(--grid-text)', marginBottom: '8px' }, children: ["Available Columns (", availableColumns.length, ")"] }), _jsxs("div", { style: { flex: 1, border: '1px solid var(--grid-border)', borderRadius: '4px', overflowY: 'scroll', backgroundColor: 'var(--grid-bg)' }, children: [availableColumns.map((column) => {
                                                const isSelected = selectedAvailable === column.field;
                                                return (_jsx("div", { onClick: () => {
                                                        setSelectedAvailable(column.field);
                                                        setSelectedVisible(null);
                                                    }, style: {
                                                        padding: '8px 12px',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid #e5e7eb',
                                                        backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                                                        color: isSelected ? '#ffffff' : '#111827',
                                                        fontWeight: isSelected ? '600' : '400',
                                                    }, onMouseEnter: (e) => !isSelected && (e.currentTarget.style.backgroundColor = '#eff6ff'), onMouseLeave: (e) => !isSelected && (e.currentTarget.style.backgroundColor = '#ffffff'), children: column.headerName }, column.field));
                                            }), availableColumns.length === 0 && _jsx("div", { style: { padding: '32px 12px', textAlign: 'center', color: 'var(--grid-text-secondary)', fontSize: '14px' }, children: "All columns are visible" })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }, children: [_jsx("button", { onClick: moveToVisible, disabled: !selectedAvailable, style: { paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: !selectedAvailable ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: !selectedAvailable ? 'not-allowed' : 'pointer' }, onMouseEnter: (e) => !selectedAvailable ? null : e.currentTarget.style.backgroundColor = '#1d4ed8', onMouseLeave: (e) => !selectedAvailable ? null : e.currentTarget.style.backgroundColor = '#3b82f6', title: "Add selected", children: ">" }), _jsx("button", { onClick: moveAllToVisible, disabled: availableColumns.length === 0, style: { paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: availableColumns.length === 0 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: availableColumns.length === 0 ? 'not-allowed' : 'pointer' }, onMouseEnter: (e) => availableColumns.length === 0 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8', onMouseLeave: (e) => availableColumns.length === 0 ? null : e.currentTarget.style.backgroundColor = '#3b82f6', title: "Add all", children: ">>" }), _jsx("button", { onClick: moveToAvailable, disabled: !selectedVisible || visibleColumns.length === 1, style: { paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: !selectedVisible || visibleColumns.length === 1 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: !selectedVisible || visibleColumns.length === 1 ? 'not-allowed' : 'pointer' }, onMouseEnter: (e) => !selectedVisible || visibleColumns.length === 1 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8', onMouseLeave: (e) => !selectedVisible || visibleColumns.length === 1 ? null : e.currentTarget.style.backgroundColor = '#3b82f6', title: "Remove selected", children: "<" }), _jsx("button", { onClick: moveAllToAvailable, disabled: visibleColumns.length === 0, style: { paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: visibleColumns.length === 0 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: visibleColumns.length === 0 ? 'not-allowed' : 'pointer' }, onMouseEnter: (e) => visibleColumns.length === 0 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8', onMouseLeave: (e) => visibleColumns.length === 0 ? null : e.currentTarget.style.backgroundColor = '#3b82f6', title: "Remove all", children: "<<" })] }), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { fontSize: '12px', fontWeight: '600', color: 'var(--grid-text)', marginBottom: '8px' }, children: ["Visible Columns (", visibleColumns.length, ")"] }), _jsx("div", { style: { flex: 1, border: '1px solid var(--grid-border)', borderRadius: '4px', overflowY: 'scroll', backgroundColor: 'var(--grid-bg)' }, children: visibleColumns.map((column) => {
                                            const isSelected = selectedVisible === column.field;
                                            return (_jsx("div", { onClick: () => {
                                                    setSelectedVisible(column.field);
                                                    setSelectedAvailable(null);
                                                }, style: {
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid var(--grid-border)',
                                                    backgroundColor: isSelected ? 'var(--grid-primary)' : 'var(--grid-bg)',
                                                    color: isSelected ? 'var(--grid-text-inverse)' : 'var(--grid-text)',
                                                    fontWeight: isSelected ? '600' : '400',
                                                }, onMouseEnter: (e) => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--grid-hover)'), onMouseLeave: (e) => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--grid-bg)'), children: column.headerName }, column.field));
                                        }) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }, children: [_jsx("button", { onClick: () => {
                                            moveVisibleUp();
                                        }, disabled: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0, style: { paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '18px', backgroundColor: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0 ? 'not-allowed' : 'pointer' }, onMouseEnter: (e) => !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8', onMouseLeave: (e) => !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0 ? null : e.currentTarget.style.backgroundColor = '#3b82f6', title: "Move up", children: "\u25B2" }), _jsx("button", { onClick: () => {
                                            moveVisibleDown();
                                        }, disabled: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1, style: { paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '18px', backgroundColor: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1 ? 'not-allowed' : 'pointer' }, onMouseEnter: (e) => !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8', onMouseLeave: (e) => !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1 ? null : e.currentTarget.style.backgroundColor = '#3b82f6', title: "Move down", children: "\u25BC" })] })] }), _jsx("div", { style: { paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: 'var(--grid-bg-alt)', borderTop: '1px solid var(--grid-border)', display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { onClick: () => {
                                setSelectedAvailable(null);
                                setSelectedVisible(null);
                                setIsOpen(false);
                            }, style: { paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#2563eb', color: '#fff', fontSize: '14px', borderRadius: '4px', border: 'none', cursor: 'pointer' }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#1d4ed8', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = '#2563eb', children: "Done" }) })] })] }));
    return (_jsxs(_Fragment, { children: [_jsxs("button", { ref: buttonRef, onClick: () => {
                    if (!isOpen) {
                        setSelectedAvailable(null);
                        setSelectedVisible(null);
                    }
                    setIsOpen(!isOpen);
                }, style: { paddingLeft: '12px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', fontSize: '14px', backgroundColor: 'var(--grid-bg)', border: '1px solid var(--grid-border)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', transitionProperty: 'colors', cursor: 'pointer', color: 'var(--grid-text)' }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-hover)', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg)', title: "Select Columns", children: [_jsx("svg", { style: { width: '16px', height: '16px' }, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" }) }), "Columns"] }), panelContent && createPortal(panelContent, document.body)] }));
};
