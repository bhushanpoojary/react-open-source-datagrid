import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * MARKET_DATA_EXAMPLE.tsx
 *
 * Complete working example of Market Data Mode implementation.
 * Copy this file to get started quickly with live market data.
 */
/* eslint-disable */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MarketDataGrid, createMarketDataEngine, useMarketData, createMockFeed, } from './DataGrid';
/**
 * Simple Market Data Example
 *
 * This example demonstrates:
 * - Creating a market data engine
 * - Setting up a mock WebSocket feed
 * - Configuring columns for market data
 * - Rendering the grid with live updates
 */
export const SimpleMarketExample = () => {
    const engineRef = useRef(null);
    const [engineInstance, setEngineInstance] = useState(null);
    // 1. Initialize engine
    useEffect(() => {
        engineRef.current = createMarketDataEngine({
            flashDuration: 500,
            enableFlash: true,
            batchInterval: 16,
            maxUpdatesPerFrame: 1000,
        });
        return () => {
            engineRef.current?.destroy();
        };
    }, []);
    useEffect(() => {
        setEngineInstance(engineRef.current);
    }, []);
    // 2. Setup mock feed
    useEffect(() => {
        const { feed, createConnection } = createMockFeed({
            symbols: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'],
            updateFrequency: 10,
            priceVolatility: 0.002,
        });
        feed.start();
        const mockWs = createConnection();
        // Handle messages
        mockWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'snapshot') {
                engineRef.current?.initialize(data.data);
            }
            else if (data.type === 'tick') {
                engineRef.current?.processUpdate({
                    rowId: data.symbol,
                    updates: data.updates,
                    timestamp: data.timestamp,
                });
            }
        };
        mockWs.onopen?.();
        return () => {
            feed.stop();
            mockWs.close();
        };
    }, []);
    // 3. Get rows from engine
    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (!engineRef.current)
            return;
        const unsubscribe = engineRef.current.onUpdate((updatedRows) => {
            setRows([...updatedRows]);
        });
        return unsubscribe;
    }, []);
    // 4. Define columns
    const columns = useMemo(() => [
        { field: 'symbol', headerName: 'Symbol', width: 100 },
        { field: 'price', headerName: 'Price', width: 120 },
        { field: 'change', headerName: 'Change', width: 100 },
        { field: 'changePercent', headerName: 'Change %', width: 110 },
        { field: 'bid', headerName: 'Bid', width: 110 },
        { field: 'ask', headerName: 'Ask', width: 110 },
        { field: 'volume', headerName: 'Volume', width: 120 },
    ], []);
    // 5. Grid config
    const config = useMemo(() => ({
        enabled: true,
        enableFlash: true,
        densityMode: false,
    }), []);
    return (_jsxs("div", { style: { padding: 20, height: '100vh' }, children: [_jsx("h2", { children: "Simple Market Data Example" }), _jsx("div", { style: { height: 'calc(100vh - 100px)' }, children: _jsx(MarketDataGrid, { columns: columns, rows: rows, engine: engineInstance, config: config }) })] }));
};
/**
 * Advanced Market Data Example
 *
 * This example demonstrates:
 * - Full control panel with pause/resume
 * - Performance metrics display
 * - Density mode toggle
 * - Flash animation toggle
 * - Connection status
 */
export const AdvancedMarketExample = () => {
    const [densityMode, setDensityMode] = useState(false);
    const [flashEnabled, setFlashEnabled] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const engineRef = useRef(null);
    const [engineInstance, setEngineInstance] = useState(null);
    // Initialize engine
    useEffect(() => {
        engineRef.current = createMarketDataEngine({
            flashDuration: 500,
            enableFlash: flashEnabled,
            batchInterval: 16,
            maxUpdatesPerFrame: 1000,
            cpuThreshold: 0.8,
        });
        return () => {
            engineRef.current?.destroy();
        };
    }, []);
    useEffect(() => {
        setEngineInstance(engineRef.current);
    }, []);
    // Setup mock feed
    useEffect(() => {
        const { feed, createConnection } = createMockFeed({
            updateFrequency: 20,
            priceVolatility: 0.003,
            burstProbability: 0.15,
        });
        feed.start();
        const mockWs = createConnection();
        mockWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'snapshot') {
                engineRef.current?.initialize(data.data);
            }
            else if (data.type === 'tick') {
                engineRef.current?.processUpdate({
                    rowId: data.symbol,
                    updates: data.updates,
                    timestamp: data.timestamp,
                });
            }
        };
        mockWs.onopen?.();
        return () => {
            feed.stop();
            mockWs.close();
        };
    }, []);
    // Get rows from engine
    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (!engineRef.current)
            return;
        const unsubscribe = engineRef.current.onUpdate((updatedRows) => {
            setRows([...updatedRows]);
        });
        return unsubscribe;
    }, []);
    // Performance metrics
    const [metrics, setMetrics] = useState({
        fps: 0,
        avgFrameTime: 0,
        pendingUpdates: 0,
        activeFlashes: 0,
    });
    useEffect(() => {
        const interval = setInterval(() => {
            if (engineRef.current) {
                setMetrics(engineRef.current.getMetrics());
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);
    // Control handlers
    const handlePauseResume = () => {
        if (!engineRef.current)
            return;
        if (isPaused) {
            engineRef.current.resume();
        }
        else {
            engineRef.current.pause();
        }
        setIsPaused(!isPaused);
    };
    // Columns
    const columns = useMemo(() => [
        { field: 'symbol', headerName: 'Symbol', width: 100 },
        { field: 'price', headerName: 'Price', width: 120 },
        { field: 'change', headerName: 'Change', width: 100 },
        { field: 'changePercent', headerName: 'Change %', width: 110 },
        { field: 'bid', headerName: 'Bid', width: 110 },
        { field: 'ask', headerName: 'Ask', width: 110 },
        { field: 'size', headerName: 'Size', width: 100 },
        { field: 'volume', headerName: 'Volume', width: 120 },
        { field: 'high', headerName: 'High', width: 110 },
        { field: 'low', headerName: 'Low', width: 110 },
    ], []);
    const config = useMemo(() => ({
        enabled: true,
        enableFlash: flashEnabled,
        densityMode,
    }), [flashEnabled, densityMode]);
    return (_jsxs("div", { style: { padding: 20, height: '100vh', display: 'flex', flexDirection: 'column' }, children: [_jsx("h2", { children: "Advanced Market Data Example" }), _jsxs("div", { style: {
                    display: 'flex',
                    gap: 10,
                    marginBottom: 20,
                    padding: 15,
                    background: '#f5f5f5',
                    borderRadius: 8,
                }, children: [_jsx("button", { onClick: handlePauseResume, children: isPaused ? '▶ Resume' : '⏸ Pause' }), _jsx("button", { onClick: () => setDensityMode(!densityMode), children: densityMode ? '□ Normal' : '▪ Compact' }), _jsx("button", { onClick: () => setFlashEnabled(!flashEnabled), children: flashEnabled ? '✓ Flash On' : '✗ Flash Off' }), _jsxs("div", { style: { marginLeft: 'auto', display: 'flex', gap: 15 }, children: [_jsxs("span", { children: ["FPS: ", _jsx("strong", { children: metrics.fps })] }), _jsxs("span", { children: ["Frame: ", _jsxs("strong", { children: [metrics.avgFrameTime.toFixed(1), "ms"] })] }), _jsxs("span", { children: ["Pending: ", _jsx("strong", { children: metrics.pendingUpdates })] }), _jsxs("span", { children: ["Flashes: ", _jsx("strong", { children: metrics.activeFlashes })] })] })] }), _jsx("div", { style: { flex: 1, overflow: 'hidden' }, children: _jsx(MarketDataGrid, { columns: columns, rows: rows, engine: engineInstance, config: config }) })] }));
};
/**
 * Real WebSocket Example
 *
 * This example shows how to connect to a real WebSocket server.
 * Replace the URL with your actual WebSocket endpoint.
 */
export const RealWebSocketExample = () => {
    const engineRef = useRef(null);
    const [engineInstance, setEngineInstance] = useState(null);
    // Initialize engine
    useEffect(() => {
        engineRef.current = createMarketDataEngine();
        return () => {
            engineRef.current?.destroy();
        };
    }, []);
    useEffect(() => {
        setEngineInstance(engineRef.current);
    }, []);
    // Use market data hook with real WebSocket
    const marketData = useMarketData({
        engine: engineInstance,
        wsConfig: {
            url: 'wss://your-market-data-server.com/ws', // Replace with your URL
            reconnect: true,
            reconnectDelay: 1000,
            maxReconnectDelay: 30000,
            reconnectAttempts: 10,
            onConnect: () => console.log('Connected to market feed'),
            onDisconnect: () => console.log('Disconnected from feed'),
            onError: (error) => console.error('WebSocket error:', error),
            onMessage: (data) => console.log('Received:', data),
        },
        subscription: {
            symbols: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'],
        },
    });
    const columns = useMemo(() => [
        { field: 'symbol', headerName: 'Symbol', width: 100 },
        { field: 'price', headerName: 'Price', width: 120 },
        { field: 'change', headerName: 'Change', width: 100 },
        { field: 'bid', headerName: 'Bid', width: 110 },
        { field: 'ask', headerName: 'Ask', width: 110 },
        { field: 'volume', headerName: 'Volume', width: 120 },
    ], []);
    return (_jsxs("div", { style: { padding: 20, height: '100vh', display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 20 }, children: [_jsx("h2", { children: "Real WebSocket Example" }), _jsxs("div", { children: [_jsx("span", { style: {
                                    padding: '5px 15px',
                                    borderRadius: 15,
                                    background: marketData.isConnected ? '#4caf50' : '#f44336',
                                    color: 'white',
                                    fontWeight: 'bold',
                                }, children: marketData.connectionState.toUpperCase() }), _jsxs("span", { style: { marginLeft: 15 }, children: [marketData.metrics.updatesPerSecond, " updates/s"] })] })] }), _jsx("div", { style: { flex: 1 }, children: _jsx(MarketDataGrid, { columns: columns, rows: marketData.rows, engine: engineInstance, config: { enabled: true, enableFlash: true } }) })] }));
};
/**
 * Custom Formatting Example
 *
 * Shows how to customize cell rendering for market data.
 */
export const CustomFormattingExample = () => {
    const engineRef = useRef(null);
    const [engineInstance, setEngineInstance] = useState(null);
    const [rows, setRows] = useState([]);
    useEffect(() => {
        engineRef.current = createMarketDataEngine();
        setEngineInstance(engineRef.current);
        const { feed, createConnection } = createMockFeed();
        feed.start();
        const mockWs = createConnection();
        mockWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'snapshot') {
                engineRef.current?.initialize(data.data);
            }
            else if (data.type === 'tick') {
                engineRef.current?.processUpdate({
                    rowId: data.symbol,
                    updates: data.updates,
                    timestamp: data.timestamp,
                });
            }
        };
        mockWs.onopen?.();
        const unsubscribe = engineRef.current.onUpdate((updatedRows) => {
            setRows([...updatedRows]);
        });
        return () => {
            feed.stop();
            mockWs.close();
            engineRef.current?.destroy();
            unsubscribe();
        };
    }, []);
    // Custom columns with renderCell
    const columns = useMemo(() => [
        {
            field: 'symbol',
            headerName: 'Symbol',
            width: 120,
            renderCell: (row) => (_jsx("strong", { style: { color: '#1976d2' }, children: row.symbol })),
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 140,
            renderCell: (row) => (_jsxs("span", { style: { fontSize: 16, fontWeight: 'bold' }, children: ["$", row.price?.toFixed(2)] })),
        },
        {
            field: 'change',
            headerName: 'Change',
            width: 120,
            renderCell: (row) => {
                const value = row.change || 0;
                return (_jsxs("span", { style: {
                        color: value >= 0 ? '#4caf50' : '#f44336',
                        fontWeight: 'bold',
                    }, children: [value >= 0 ? '+' : '', value.toFixed(2)] }));
            },
        },
        {
            field: 'volume',
            headerName: 'Volume',
            width: 120,
            renderCell: (row) => {
                const vol = row.volume || 0;
                return _jsxs("span", { children: [(vol / 1000000).toFixed(2), "M"] });
            },
        },
    ], []);
    return (_jsxs("div", { style: { padding: 20, height: '100vh' }, children: [_jsx("h2", { children: "Custom Formatting Example" }), _jsx("div", { style: { height: 'calc(100vh - 100px)' }, children: _jsx(MarketDataGrid, { columns: columns, rows: rows, engine: engineInstance, config: { enabled: true, enableFlash: true } }) })] }));
};
export default SimpleMarketExample;
