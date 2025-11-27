import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { DataGrid } from './DataGrid';
const generateData = (count) => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT'];
    const companies = [
        'Apple Inc.',
        'Microsoft Corporation',
        'Alphabet Inc.',
        'Amazon.com Inc.',
        'Meta Platforms Inc.',
        'Tesla Inc.',
        'NVIDIA Corporation',
        'JPMorgan Chase & Co.',
        'Visa Inc.',
        'Walmart Inc.',
    ];
    const sectors = ['Technology', 'Consumer', 'Finance', 'Healthcare', 'Energy'];
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        symbol: symbols[i % symbols.length],
        company: companies[i % companies.length],
        price: Math.random() * 500 + 50,
        change: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 100000000),
        marketCap: `${(Math.random() * 2000 + 100).toFixed(0)}B`,
        sector: sectors[Math.floor(Math.random() * sectors.length)],
    }));
};
export const TooltipDemo = () => {
    const [data] = useState(generateData(20));
    const [showDelay, setShowDelay] = useState(500);
    const [hideDelay, setHideDelay] = useState(200);
    const [defaultPlacement, setDefaultPlacement] = useState('auto');
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
        },
        {
            field: 'symbol',
            headerName: 'Symbol',
            width: 100,
        },
        {
            field: 'company',
            headerName: 'Company',
            width: 200,
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 120,
            renderCell: (row) => `$${row.price.toFixed(2)}`
        },
        {
            field: 'change',
            headerName: 'Change',
            width: 120,
            renderCell: (row) => {
                const data = row;
                return (_jsxs("span", { style: { color: data.change >= 0 ? 'green' : 'red' }, children: [data.change >= 0 ? '+' : '', data.change.toFixed(2), "%"] }));
            }
        },
        {
            field: 'volume',
            headerName: 'Volume',
            width: 150,
            renderCell: (row) => row.volume.toLocaleString()
        },
        {
            field: 'marketCap',
            headerName: 'Market Cap',
            width: 120,
        },
        {
            field: 'sector',
            headerName: 'Sector',
            width: 150,
        },
    ];
    const tooltipConfig = {
        enabled: true,
        showCellTooltips: true,
        showRowTooltips: true,
        showDelay,
        hideDelay,
        placement: defaultPlacement,
        maxWidth: 300,
        offset: 8,
        // Cell-level tooltips
        getCellTooltip: (row, column) => {
            const data = row;
            if (column.field === 'symbol') {
                return `${data.symbol} - ${data.company}`;
            }
            if (column.field === 'price') {
                return `Current price: $${data.price.toFixed(2)}\n52-week range: $${(data.price * 0.8).toFixed(2)} - $${(data.price * 1.2).toFixed(2)}`;
            }
            if (column.field === 'change') {
                return {
                    content: (_jsxs("div", { children: [_jsxs("strong", { children: [data.change >= 0 ? 'Gain' : 'Loss', ": ", Math.abs(data.change).toFixed(2), "%"] }), _jsxs("div", { style: { marginTop: '4px', fontSize: '0.9em' }, children: ["$", Math.abs(data.price * data.change / 100).toFixed(2), " per share"] })] })),
                    placement: 'right'
                };
            }
            if (column.field === 'volume') {
                return {
                    content: `Trading Volume: ${data.volume.toLocaleString()} shares\nAvg Daily: ${(data.volume * 0.8).toLocaleString()}`,
                    placement: 'top'
                };
            }
            return null;
        },
        // Row-level tooltips
        getRowTooltip: (row) => {
            const data = row;
            return {
                content: (_jsxs("div", { style: { padding: '4px' }, children: [_jsxs("div", { style: { fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1em' }, children: [data.symbol, " - ", data.company] }), _jsx("table", { style: { width: '100%', fontSize: '0.9em' }, children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { style: { paddingRight: '16px', color: '#888' }, children: "Price:" }), _jsxs("td", { style: { fontWeight: 'bold' }, children: ["$", data.price.toFixed(2)] })] }), _jsxs("tr", { children: [_jsx("td", { style: { paddingRight: '16px', color: '#888' }, children: "Change:" }), _jsxs("td", { style: { color: data.change >= 0 ? 'green' : 'red', fontWeight: 'bold' }, children: [data.change >= 0 ? '+' : '', data.change.toFixed(2), "%"] })] }), _jsxs("tr", { children: [_jsx("td", { style: { paddingRight: '16px', color: '#888' }, children: "Volume:" }), _jsx("td", { children: data.volume.toLocaleString() })] }), _jsxs("tr", { children: [_jsx("td", { style: { paddingRight: '16px', color: '#888' }, children: "Market Cap:" }), _jsx("td", { children: data.marketCap })] }), _jsxs("tr", { children: [_jsx("td", { style: { paddingRight: '16px', color: '#888' }, children: "Sector:" }), _jsx("td", { children: data.sector })] })] }) })] })),
                placement: 'right',
            };
        },
    };
    return (_jsxs("div", { style: { padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }, children: [_jsx("h2", { style: { marginBottom: '8px' }, children: "Tooltip Feature" }), _jsx("p", { style: { marginBottom: '16px', color: '#666' }, children: "Hover over cells or rows to see tooltips. Both string and custom React content are supported." }), _jsxs("div", { style: {
                    marginBottom: '16px',
                    padding: '16px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap'
                }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontWeight: 'bold' }, children: "Show Delay (ms)" }), _jsx("input", { type: "number", value: showDelay, onChange: (e) => setShowDelay(Number(e.target.value)), style: { padding: '4px 8px', width: '100px' }, min: "0", max: "2000", step: "100" })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontWeight: 'bold' }, children: "Hide Delay (ms)" }), _jsx("input", { type: "number", value: hideDelay, onChange: (e) => setHideDelay(Number(e.target.value)), style: { padding: '4px 8px', width: '100px' }, min: "0", max: "2000", step: "100" })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontWeight: 'bold' }, children: "Default Placement" }), _jsxs("select", { value: defaultPlacement, onChange: (e) => setDefaultPlacement(e.target.value), style: { padding: '4px 8px', width: '120px' }, children: [_jsx("option", { value: "auto", children: "Auto" }), _jsx("option", { value: "top", children: "Top" }), _jsx("option", { value: "bottom", children: "Bottom" }), _jsx("option", { value: "left", children: "Left" }), _jsx("option", { value: "right", children: "Right" })] })] })] }), _jsxs("div", { style: {
                    marginBottom: '16px',
                    padding: '16px',
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    fontSize: '0.9em'
                }, children: [_jsx("strong", { children: "Tooltip Features:" }), _jsxs("ul", { style: { margin: '8px 0', paddingLeft: '20px' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Symbol:" }), " Simple string tooltip with company name"] }), _jsxs("li", { children: [_jsx("strong", { children: "Price:" }), " Multi-line string tooltip with price range"] }), _jsxs("li", { children: [_jsx("strong", { children: "Change:" }), " Custom React content with styled gain/loss (placement: right)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Volume:" }), " Custom placement (top) with volume details"] }), _jsxs("li", { children: [_jsx("strong", { children: "Row Hover:" }), " Hover over row number or empty space to see comprehensive row tooltip"] }), _jsxs("li", { children: [_jsx("strong", { children: "Smart Placement:" }), " Tooltips automatically adjust to stay within viewport"] })] })] }), _jsx("div", { style: { flex: 1, minHeight: 0 }, children: _jsx(DataGrid, { columns: columns, rows: data, theme: "quartz", tooltipConfig: tooltipConfig }) })] }));
};
