import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * LiveMarketDemo.tsx
 *
 * Full demo page showcasing high-performance market data grid with:
 * - Live streaming data (WebSocket mock feed)
 * - 50 symbols with continuous updates
 * - Pause/Resume controls
 * - Performance metrics
 * - Connection status
 * - Density mode toggle
 * - Flash animations
 */
/* eslint-disable */
// ...existing code...
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MarketDataGrid } from './DataGrid/MarketDataGrid';
import { MarketDataEngine, createMarketDataEngine } from './DataGrid/MarketDataEngine';
import { createMockFeed } from './DataGrid/WebSocketMockFeed';
import { CodeBlock } from './CodeBlock';
import './LiveMarketDemo.css';
/**
 * LiveMarketDemo Component
 */
export const LiveMarketDemo = () => {
    const [densityMode, setDensityMode] = useState(false);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [freezeMovement, setFreezeMovement] = useState(false);
    const [showMetrics, setShowMetrics] = useState(true);
    const engineRef = useRef(null);
    const [engineInstance, setEngineInstance] = useState(null);
    const feedRef = useRef(null);
    const mockConnectionRef = useRef(null);
    // Initialize engine on mount
    useEffect(() => {
        if (!engineRef.current) {
            const engine = createMarketDataEngine({
                flashDuration: 250, // Even shorter flash
                enableFlash: flashEnabled,
                batchInterval: 50, // Slower DOM updates to reduce CPU load (~20 FPS)
                maxUpdatesPerFrame: 3000, // Allow more updates per frame
                cpuThreshold: 0.95, // Very high threshold before throttling
                enableLiveSorting: false,
                enableRankingMovement: !freezeMovement,
            });
            engineRef.current = engine;
        }
        return () => {
            if (engineRef.current) {
                engineRef.current.destroy();
                engineRef.current = null;
            }
        };
    }, []);
    // Set engineInstance after engineRef is created
    useEffect(() => {
        setTimeout(() => setEngineInstance(engineRef.current ?? null), 0);
    }, []);
    // Update engine config when settings change
    useEffect(() => {
        if (engineRef.current) {
            // Update config dynamically
            engineRef.current.config.enableFlash = flashEnabled;
            engineRef.current.config.enableRankingMovement = !freezeMovement;
        }
    }, [flashEnabled, freezeMovement]);
    // State for rows
    const [rows, setRows] = useState([]);
    // State for tracking updates
    const updateCountRef = useRef(0);
    const totalUpdatesRef = useRef(0);
    const lastUpdateTimeRef = useRef(0);
    const updatesPerSecondRef = useRef(0);
    // Update updates/sec counter periodically (without triggering re-render)
    useEffect(() => {
        lastUpdateTimeRef.current = Date.now();
        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = (now - lastUpdateTimeRef.current) / 1000;
            const rate = elapsed > 0 ? Math.round(updateCountRef.current / elapsed) : 0;
            updatesPerSecondRef.current = rate;
            updateCountRef.current = 0;
            lastUpdateTimeRef.current = now;
            // Update the DOM directly without triggering React re-render
            const badge = document.querySelector('.updates-per-sec-badge');
            if (badge) {
                badge.textContent = `${rate} updates/s`;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    // Cancel market data updates when route changes away from this page
    const location = useLocation();
    useEffect(() => {
        if (!engineRef.current)
            return;
        const { feed, createConnection } = createMockFeed({
            symbols: undefined,
            updateFrequency: 30,
            priceVolatility: 0.003,
            burstProbability: 0.05,
            burstSize: 3,
        });
        feedRef.current = feed;
        const mockConnection = createConnection();
        mockConnectionRef.current = mockConnection;
        const unsubscribe = engineRef.current.onUpdate((updatedRows) => {
            setRows([...updatedRows]);
        });
        mockConnection.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'snapshot') {
                    engineRef.current?.initialize(data.data);
                    setRows([...data.data]);
                }
                else if (data.type === 'tick') {
                    updateCountRef.current++;
                    totalUpdatesRef.current++;
                    engineRef.current?.processUpdate({
                        rowId: data.symbol,
                        updates: data.updates,
                        timestamp: data.timestamp,
                    });
                }
            }
            catch (error) {
                console.error('Error processing message:', error);
            }
        };
        mockConnection.onopen = () => { };
        mockConnection.onerror = () => { };
        // Cleanup when route changes away from /demo/market-data
        return () => {
            unsubscribe();
            feed.stop();
            if (mockConnection.readyState === 1) {
                mockConnection.close();
            }
        };
    }, [location.pathname]);
    // Define columns for market data
    const columns = useMemo(() => [
        {
            field: 'symbol',
            headerName: 'Symbol',
            width: 100,
            sortable: true,
            filterable: true,
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 120,
            sortable: true,
            filterable: true,
        },
        {
            field: 'change',
            headerName: 'Change',
            width: 100,
            sortable: true,
        },
        {
            field: 'changePercent',
            headerName: 'Change %',
            width: 110,
            sortable: true,
        },
        {
            field: 'bid',
            headerName: 'Bid',
            width: 110,
            sortable: true,
        },
        {
            field: 'ask',
            headerName: 'Ask',
            width: 110,
            sortable: true,
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 100,
            sortable: true,
        },
        {
            field: 'volume',
            headerName: 'Volume',
            width: 120,
            sortable: true,
        },
        {
            field: 'high',
            headerName: 'High',
            width: 110,
            sortable: true,
        },
        {
            field: 'low',
            headerName: 'Low',
            width: 110,
            sortable: true,
        },
        {
            field: 'open',
            headerName: 'Open',
            width: 110,
            sortable: true,
        },
    ], []);
    // Market data config
    const marketConfig = useMemo(() => ({
        enabled: true,
        flashDuration: 500,
        enableFlash: flashEnabled,
        enableLiveSorting: false,
        enableRankingMovement: !freezeMovement,
        densityMode,
    }), [flashEnabled, freezeMovement, densityMode]);
    // Metrics for display (using refs to avoid re-renders)
    const [metrics, setMetrics] = useState({
        updatesPerSecond: 0,
        totalUpdates: 0,
        reconnectCount: 0,
    });
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                updatesPerSecond: updatesPerSecondRef.current,
                totalUpdates: totalUpdatesRef.current,
                reconnectCount: 0,
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);
    const connectionState = 'connected';
    // Performance metrics
    const [engineMetrics, setEngineMetrics] = useState({
        fps: 0,
        avgFrameTime: 0,
        pendingUpdates: 0,
        activeFlashes: 0,
        rowCount: 0,
        isThrottled: false,
    });
    // Update metrics periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (engineRef.current) {
                setEngineMetrics(engineRef.current.getMetrics());
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);
    // Control handlers
    const handlePauseResume = () => {
        if (engineRef.current) {
            if (engineRef.current.isPausedState()) {
                engineRef.current.resume();
            }
            else {
                engineRef.current.pause();
            }
            // Force re-render
            setEngineMetrics(engineRef.current.getMetrics());
        }
    };
    const handleToggleDensity = () => {
        setDensityMode(prev => !prev);
    };
    const handleToggleFlash = () => {
        setFlashEnabled(prev => !prev);
    };
    const handleToggleFreeze = () => {
        setFreezeMovement(prev => !prev);
    };
    const handleToggleMetrics = () => {
        setShowMetrics(prev => !prev);
    };
    const [isPaused, setIsPaused] = useState(false);
    useEffect(() => {
        const checkPaused = () => {
            setIsPaused(engineRef.current?.isPausedState() || false);
        };
        const interval = setInterval(checkPaused, 500);
        return () => clearInterval(interval);
    }, []);
    const isThrottled = engineMetrics.isThrottled;
    return (_jsxs("div", { className: "live-market-demo", children: [_jsxs("div", { className: "demo-header", children: [_jsx("h1", { children: "Live Market Data Grid" }), _jsx("p", { className: "demo-description", children: "High-performance streaming market data with 1000+ updates/sec" })] }), _jsxs("div", { className: "demo-controls", children: [_jsxs("div", { className: "control-group", children: [_jsx("button", { className: `control-btn ${isPaused ? 'paused' : 'active'}`, onClick: handlePauseResume, title: isPaused ? 'Resume live data streaming' : 'Pause live data streaming', children: isPaused ? '▶ Resume' : '⏸ Pause' }), _jsx("button", { className: `control-btn ${densityMode ? 'active' : ''}`, onClick: handleToggleDensity, title: densityMode ? 'Switch to normal row height' : 'Switch to compact row height', children: densityMode ? '□ Normal' : '▪ Compact' }), _jsx("button", { className: `control-btn ${flashEnabled ? 'active' : ''}`, onClick: handleToggleFlash, title: flashEnabled ? 'Disable cell flash animations on value changes' : 'Enable cell flash animations on value changes', children: flashEnabled ? '✓ Flash On' : '✗ Flash Off' }), _jsx("button", { className: `control-btn ${freezeMovement ? 'active' : ''}`, onClick: handleToggleFreeze, title: freezeMovement ? 'Enable live ranking - rows reorder by rank' : 'Freeze ranking - prevent row reordering', children: freezeMovement ? '🔒 Frozen' : '🔓 Live Rank' }), _jsx("button", { className: `control-btn ${showMetrics ? 'active' : ''}`, onClick: handleToggleMetrics, title: showMetrics ? 'Hide performance statistics' : 'Show performance statistics', children: showMetrics ? '📊 Hide Stats' : '📊 Show Stats' })] }), _jsxs("div", { className: "connection-info", children: [_jsx("span", { className: `status-badge ${connectionState}`, children: connectionState.toUpperCase() }), _jsx("span", { className: "metric-badge updates-per-sec-badge", children: "0 updates/s" }), _jsxs("span", { className: "metric-badge", children: [rows.length, " symbols"] })] })] }), showMetrics && (_jsxs("div", { className: "metrics-panel", children: [_jsxs("div", { className: "metric-item", children: [_jsx("span", { className: "metric-label", children: "FPS:" }), _jsx("span", { className: `metric-value ${engineMetrics.fps < 50 ? 'warning' : ''}`, children: engineMetrics.fps })] }), _jsxs("div", { className: "metric-item", children: [_jsx("span", { className: "metric-label", children: "Frame Time:" }), _jsxs("span", { className: `metric-value ${engineMetrics.avgFrameTime > 20 ? 'warning' : ''}`, children: [engineMetrics.avgFrameTime.toFixed(2), "ms"] })] }), _jsxs("div", { className: "metric-item", children: [_jsx("span", { className: "metric-label", children: "Pending Updates:" }), _jsx("span", { className: `metric-value ${engineMetrics.pendingUpdates > 100 ? 'warning' : ''}`, children: engineMetrics.pendingUpdates })] }), _jsxs("div", { className: "metric-item", children: [_jsx("span", { className: "metric-label", children: "Active Flashes:" }), _jsx("span", { className: "metric-value", children: engineMetrics.activeFlashes })] }), _jsxs("div", { className: "metric-item", children: [_jsx("span", { className: "metric-label", children: "Total Updates:" }), _jsx("span", { className: "metric-value", children: metrics.totalUpdates })] }), isThrottled && (_jsxs("div", { className: "metric-item warning", children: [_jsx("span", { className: "metric-label", children: "\u26A0 Status:" }), _jsx("span", { className: "metric-value critical", children: "CPU THROTTLED" })] }))] })), _jsx("div", { className: `grid-container ${isPaused ? 'paused' : ''} ${isThrottled ? 'throttled' : ''}`, children: engineInstance && (_jsx(MarketDataGrid, { columns: columns, rows: rows, engine: engineInstance, config: marketConfig, onRowClick: (row) => console.log('Row clicked:', row), onCellClick: (rowId, field, value) => console.log('Cell clicked:', rowId, field, value) })) }), _jsx("div", { className: "demo-footer", children: _jsxs("p", { children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Tips:" }), " Use Pause to freeze updates \u2022 Enable Compact mode for more data \u2022 Flash animations show price direction \u2022 Watch CPU throttling in action"] }) }), _jsxs("div", { style: { marginTop: '32px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }, children: "Implementation Example" }), _jsx(CodeBlock, { title: "Market Data Configuration", language: "tsx", code: `import { MarketDataGrid, createMarketDataEngine } from './components/DataGrid';

// Create market data engine
const engine = createMarketDataEngine({
  updateThrottleMs: 16, // 60 FPS
  flashDuration: 500,
  maxUpdatesPerCycle: 1000,
});

// Configure market data
const config = {
  flashEnabled: true,
  densityMode: false,
  freezeMovement: false,
  bidAskColors: {
    bid: '#10b981',
    ask: '#ef4444',
  },
};

// Connect to WebSocket feed
const feed = createMockFeed();
feed.subscribe((updates) => {
  updates.forEach(update => {
    engine.queueUpdate(update.rowId, update.field, update.value);
  });
});

<MarketDataGrid
  columns={columns}
  rows={rows}
  engine={engine}
  config={config}
  onCellClick={(rowId, field, value) => {
    console.log('Cell clicked:', { rowId, field, value });
  }}
/>` })] })] }));
};
