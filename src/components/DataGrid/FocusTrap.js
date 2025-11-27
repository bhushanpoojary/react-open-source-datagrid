import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useFocusTrap } from './useFocusTrap';
export const FocusTrap = ({ children, className, style, ...options }) => {
    const trapRef = useFocusTrap(options);
    return (_jsx("div", { ref: trapRef, className: className, style: style, children: children }));
};
