import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const DragHandle = ({ position: _position = 'left', isDragging = false, }) => {
    return (_jsx("div", { className: "drag-handle", style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            color: 'var(--grid-text-secondary, #9ca3af)',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            userSelect: 'none',
            opacity: isDragging ? 0.5 : 1,
        }, onMouseEnter: (e) => {
            if (!isDragging) {
                e.currentTarget.style.color = 'var(--grid-primary, #3b82f6)';
                e.currentTarget.style.backgroundColor = 'var(--grid-hover, rgba(59, 130, 246, 0.05))';
            }
        }, onMouseLeave: (e) => {
            if (!isDragging) {
                e.currentTarget.style.color = 'var(--grid-text-secondary, #9ca3af)';
                e.currentTarget.style.backgroundColor = 'transparent';
            }
        }, title: "Drag to reorder", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
                pointerEvents: 'none',
            }, children: [_jsx("circle", { cx: "5", cy: "3", r: "1.5", fill: "currentColor" }), _jsx("circle", { cx: "11", cy: "3", r: "1.5", fill: "currentColor" }), _jsx("circle", { cx: "5", cy: "8", r: "1.5", fill: "currentColor" }), _jsx("circle", { cx: "11", cy: "8", r: "1.5", fill: "currentColor" }), _jsx("circle", { cx: "5", cy: "13", r: "1.5", fill: "currentColor" }), _jsx("circle", { cx: "11", cy: "13", r: "1.5", fill: "currentColor" })] }) }));
};
export default DragHandle;
