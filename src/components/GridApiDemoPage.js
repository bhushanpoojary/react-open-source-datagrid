import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { GridApiDemo } from './DataGrid/GridApiDemo';
export const GridApiDemoPage = () => {
    return (_jsx("div", { style: {
            height: '100%',
            overflow: 'auto',
            backgroundColor: '#f8fafc'
        }, children: _jsx(GridApiDemo, {}) }));
};
