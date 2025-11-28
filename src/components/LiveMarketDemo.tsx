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

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MarketDataGrid } from './DataGrid/MarketDataGrid';
import { MarketDataEngine, createMarketDataEngine } from './DataGrid/MarketDataEngine';
import { createMockFeed } from './DataGrid/WebSocketMockFeed';
import type { WebSocketMockFeed } from './DataGrid/WebSocketMockFeed';
import type { Column, MarketDataConfig } from './DataGrid/types';
import { CodeBlock } from './CodeBlock';
import './LiveMarketDemo.css';

/**
 * LiveMarketDemo Component
 */
export const LiveMarketDemo: React.FC = () => {
  const [densityMode, setDensityMode] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [freezeMovement, setFreezeMovement] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const engineRef = useRef<MarketDataEngine | null>(null);
  const [engineInstance, setEngineInstance] = useState<MarketDataEngine | null>(null);
  const feedRef = useRef<WebSocketMockFeed | null>(null);
  const mockConnectionRef = useRef<any>(null);

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
      (engineRef.current as any).config.enableFlash = flashEnabled;
      (engineRef.current as any).config.enableRankingMovement = !freezeMovement;
    }
  }, [flashEnabled, freezeMovement]);

  // State for rows
  const [rows, setRows] = useState<any[]>([]);

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
    if (!engineRef.current) return;

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
    const unsubscribe = engineRef.current.onUpdate((updatedRows: any) => {
      setRows([...updatedRows]);
    });
    mockConnection.onmessage = (event: { data: string }) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'snapshot') {
          engineRef.current?.initialize(data.data);
          setRows([...data.data]);
        } else if (data.type === 'tick') {
          updateCountRef.current++;
          totalUpdatesRef.current++;
          engineRef.current?.processUpdate({
            rowId: data.symbol,
            updates: data.updates,
            timestamp: data.timestamp,
          });
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };
    mockConnection.onopen = () => {};
    mockConnection.onerror = () => {};

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
  const columns: Column[] = useMemo(() => [
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
  const marketConfig: MarketDataConfig = useMemo(() => ({
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

  const connectionState = 'connected' as const;

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
      } else {
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

  return (
    <div className="live-market-demo">
      <div className="demo-header">
        <h1>Live Market Data Grid</h1>
        <p className="demo-description">
          High-performance streaming market data with 1000+ updates/sec
        </p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <button
            className={`control-btn ${isPaused ? 'paused' : 'active'}`}
            onClick={handlePauseResume}
            title={isPaused ? 'Resume live data streaming' : 'Pause live data streaming'}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          
          <button
            className={`control-btn ${densityMode ? 'active' : ''}`}
            onClick={handleToggleDensity}
            title={densityMode ? 'Switch to normal row height' : 'Switch to compact row height'}
          >
            {densityMode ? '□ Normal' : '▪ Compact'}
          </button>
          
          <button
            className={`control-btn ${flashEnabled ? 'active' : ''}`}
            onClick={handleToggleFlash}
            title={flashEnabled ? 'Disable cell flash animations on value changes' : 'Enable cell flash animations on value changes'}
          >
            {flashEnabled ? '✓ Flash On' : '✗ Flash Off'}
          </button>
          
          <button
            className={`control-btn ${freezeMovement ? 'active' : ''}`}
            onClick={handleToggleFreeze}
            title={freezeMovement ? 'Enable live ranking - rows reorder by rank' : 'Freeze ranking - prevent row reordering'}
          >
            {freezeMovement ? '🔒 Frozen' : '🔓 Live Rank'}
          </button>
          
          <button
            className={`control-btn ${showMetrics ? 'active' : ''}`}
            onClick={handleToggleMetrics}
            title={showMetrics ? 'Hide performance statistics' : 'Show performance statistics'}
          >
            {showMetrics ? '📊 Hide Stats' : '📊 Show Stats'}
          </button>
        </div>

        <div className="connection-info">
          <span className={`status-badge ${connectionState}`}>
            {connectionState.toUpperCase()}
          </span>
          <span className="metric-badge updates-per-sec-badge">
            0 updates/s
          </span>
          <span className="metric-badge">
            {rows.length} symbols
          </span>
        </div>
      </div>

      {showMetrics && (
        <div className="metrics-panel">
          <div className="metric-item">
            <span className="metric-label">FPS:</span>
            <span className={`metric-value ${engineMetrics.fps < 50 ? 'warning' : ''}`}>
              {engineMetrics.fps}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Frame Time:</span>
            <span className={`metric-value ${engineMetrics.avgFrameTime > 20 ? 'warning' : ''}`}>
              {engineMetrics.avgFrameTime.toFixed(2)}ms
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Pending Updates:</span>
            <span className={`metric-value ${engineMetrics.pendingUpdates > 100 ? 'warning' : ''}`}>
              {engineMetrics.pendingUpdates}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Active Flashes:</span>
            <span className="metric-value">{engineMetrics.activeFlashes}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Total Updates:</span>
            <span className="metric-value">{metrics.totalUpdates}</span>
          </div>
          {isThrottled && (
            <div className="metric-item warning">
              <span className="metric-label">⚠ Status:</span>
              <span className="metric-value critical">CPU THROTTLED</span>
            </div>
          )}
        </div>
      )}

      <div className={`grid-container ${isPaused ? 'paused' : ''} ${isThrottled ? 'throttled' : ''}`}>
        {engineInstance && (
          <MarketDataGrid
            columns={columns}
            rows={rows}
            engine={engineInstance}
            config={marketConfig}
            onRowClick={(row) => console.log('Row clicked:', row)}
            onCellClick={(rowId, field, value) => console.log('Cell clicked:', rowId, field, value)}
          />
        )}
      </div>

      <div className="demo-footer">
        <p>
          💡 <strong>Tips:</strong> Use Pause to freeze updates • Enable Compact mode for more data • 
          Flash animations show price direction • Watch CPU throttling in action
        </p>
      </div>

      {/* Code Example */}
      <div style={{ marginTop: '32px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Implementation Example
        </h2>
        <CodeBlock
          title="Market Data Configuration"
          language="tsx"
          code={`import { MarketDataGrid, createMarketDataEngine } from 'react-open-source-grid';

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
/>`}
        />
      </div>
    </div>
  );
};
