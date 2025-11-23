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

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MarketDataGrid } from './DataGrid/MarketDataGrid';
import { MarketDataEngine, createMarketDataEngine } from './DataGrid/MarketDataEngine';
import { createMockFeed } from './DataGrid/WebSocketMockFeed';
import type { WebSocketMockFeed } from './DataGrid/WebSocketMockFeed';
import type { Column, MarketDataConfig } from './DataGrid/types';
import './LiveMarketDemo.css';

/**
 * LiveMarketDemo Component
 */
export const LiveMarketDemo: React.FC = () => {
  const [densityMode, setDensityMode] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [freezeMovement, setFreezeMovement] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const engineRef = useRef<MarketDataEngine | null>(null);
  const feedRef = useRef<WebSocketMockFeed | null>(null);
  const mockConnectionRef = useRef<any>(null);

  // Initialize engine on mount
  useEffect(() => {
    if (!engineRef.current) {
      const engine = createMarketDataEngine({
        flashDuration: 500,
        enableFlash: flashEnabled,
        batchInterval: 16,
        maxUpdatesPerFrame: 1000,
        cpuThreshold: 0.8,
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

  // Update engine config when settings change
  useEffect(() => {
    if (engineRef.current) {
      // Engine config is immutable, so we'd need to recreate or expose setters
      // For now, settings apply on next mount
    }
  }, [flashEnabled, freezeMovement]);

  // State for rows
  const [rows, setRows] = useState<any[]>([]);

  // Create mock feed, connection, and set up data flow
  useEffect(() => {
    if (!engineRef.current) return;

    const { feed, createConnection } = createMockFeed({
      updateFrequency: 20, // 20 updates/sec per symbol
      priceVolatility: 0.003, // 0.3% volatility
      burstProbability: 0.15, // 15% burst chance
      burstSize: 8,
    });

    feedRef.current = feed;

    // Create mock WebSocket-like connection
    const mockConnection = createConnection();
    mockConnectionRef.current = mockConnection;

    // Subscribe to engine updates
    const unsubscribe = engineRef.current.onUpdate((updatedRows: any) => {
      setRows([...updatedRows]);
    });

    // Set up message handler
    mockConnection.onmessage = (event: { data: string }) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'snapshot') {
          console.log('Received snapshot with', data.data?.length, 'rows');
          engineRef.current?.initialize(data.data);
          setRows([...data.data]); // Also set initial rows
        } else if (data.type === 'tick') {
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

    // Trigger connection to send snapshot
    if (mockConnection.onopen) {
      mockConnection.onopen();
    }

    return () => {
      unsubscribe();
      feed.stop();
      if (mockConnection.readyState === 1) {
        mockConnection.close();
      }
    };
  }, []); // Run once after engine is initialized

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

  // Mock metrics since we're not using the hook
  const metrics = useMemo(() => ({
    updatesPerSecond: 0,
    totalUpdates: 0,
    reconnectCount: 0,
  }), []);

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

  const isPaused = engineRef.current?.isPausedState() || false;
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
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          
          <button
            className={`control-btn ${densityMode ? 'active' : ''}`}
            onClick={handleToggleDensity}
          >
            {densityMode ? '□ Normal' : '▪ Compact'}
          </button>
          
          <button
            className={`control-btn ${flashEnabled ? 'active' : ''}`}
            onClick={handleToggleFlash}
          >
            {flashEnabled ? '✓ Flash On' : '✗ Flash Off'}
          </button>
          
          <button
            className={`control-btn ${freezeMovement ? 'active' : ''}`}
            onClick={handleToggleFreeze}
          >
            {freezeMovement ? '🔒 Frozen' : '🔓 Live Rank'}
          </button>
          
          <button
            className={`control-btn ${showMetrics ? 'active' : ''}`}
            onClick={handleToggleMetrics}
          >
            {showMetrics ? '📊 Hide Stats' : '📊 Show Stats'}
          </button>
        </div>

        <div className="connection-info">
          <span className={`status-badge ${connectionState}`}>
            {connectionState.toUpperCase()}
          </span>
          <span className="metric-badge">
            {metrics.updatesPerSecond} updates/s
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
        {engineRef.current && (
          <MarketDataGrid
            columns={columns}
            rows={rows}
            engine={engineRef.current}
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
    </div>
  );
};
