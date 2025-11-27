import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
/**
 * Helper component to render the live region for screen readers
 */
export const ScreenReaderAnnouncer = ({ message, priority = 'polite' }) => {
    return (_jsx("div", { role: priority === 'assertive' ? 'alert' : 'status', "aria-live": priority, "aria-atomic": "true", style: {
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
        }, children: message }));
};
