/**
 * MARKET_DATA_EXAMPLE.tsx
 * 
 * Complete working example of Market Data Mode implementation.
 * Copy this file to get started quickly with live market data.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  MarketDataGrid,
  createMarketDataEngine,
  useMarketData,
  createMockFeed,
} from './DataGrid';
import type { 
  MarketDataEngine,
  Column,
  MarketDataConfig
} from './DataGrid';

/**
 * Simple Market Data Example
 * 
 * This example demonstrates:
 * - Creating a market data engine
 * - Setting up a mock WebSocket feed
 * - Configuring columns for market data
 * - Rendering the grid with live updates
 */
export const SimpleMarketExample: React.FC = () => {
  const engineRef = useRef<MarketDataEngine | null>(null);

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
    mockWs.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data);
      if (data.type === 'snapshot') {
        engineRef.current?.initialize(data.data);
      } else if (data.type === 'tick') {
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
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (!engineRef.current) return;

    const unsubscribe = engineRef.current.onUpdate((updatedRows: any) => {
      setRows([...updatedRows]);
    });

    return unsubscribe;
  }, []);

  // 4. Define columns
  const columns: Column[] = useMemo(() => [
    { field: 'symbol', headerName: 'Symbol', width: 100 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'change', headerName: 'Change', width: 100 },
    { field: 'changePercent', headerName: 'Change %', width: 110 },
    { field: 'bid', headerName: 'Bid', width: 110 },
    { field: 'ask', headerName: 'Ask', width: 110 },
    { field: 'volume', headerName: 'Volume', width: 120 },
  ], []);

  // 5. Grid config
  const config: MarketDataConfig = useMemo(() => ({
    enabled: true,
    enableFlash: true,
    densityMode: false,
  }), []);

  return (
    <div style={{ padding: 20, height: '100vh' }}>
      <h2>Simple Market Data Example</h2>
      <div style={{ height: 'calc(100vh - 100px)' }}>
        <MarketDataGrid
          columns={columns}
          rows={rows}
          engine={engineRef.current!}
          config={config}
        />
      </div>
    </div>
  );
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
export const AdvancedMarketExample: React.FC = () => {
  const [densityMode, setDensityMode] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const engineRef = useRef<MarketDataEngine | null>(null);

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

  // Setup mock feed
  useEffect(() => {
    const { feed, createConnection } = createMockFeed({
      updateFrequency: 20,
      priceVolatility: 0.003,
      burstProbability: 0.15,
    });

    feed.start();
    const mockWs = createConnection();

    mockWs.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data);
      if (data.type === 'snapshot') {
        engineRef.current?.initialize(data.data);
      } else if (data.type === 'tick') {
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
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (!engineRef.current) return;
    const unsubscribe = engineRef.current.onUpdate((updatedRows: any) => {
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
    if (!engineRef.current) return;
    if (isPaused) {
      engineRef.current.resume();
    } else {
      engineRef.current.pause();
    }
    setIsPaused(!isPaused);
  };

  // Columns
  const columns: Column[] = useMemo(() => [
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

  const config: MarketDataConfig = useMemo(() => ({
    enabled: true,
    enableFlash: flashEnabled,
    densityMode,
  }), [flashEnabled, densityMode]);

  return (
    <div style={{ padding: 20, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2>Advanced Market Data Example</h2>
      
      {/* Control Panel */}
      <div style={{ 
        display: 'flex', 
        gap: 10, 
        marginBottom: 20,
        padding: 15,
        background: '#f5f5f5',
        borderRadius: 8,
      }}>
        <button onClick={handlePauseResume}>
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button onClick={() => setDensityMode(!densityMode)}>
          {densityMode ? '□ Normal' : '▪ Compact'}
        </button>
        <button onClick={() => setFlashEnabled(!flashEnabled)}>
          {flashEnabled ? '✓ Flash On' : '✗ Flash Off'}
        </button>
        
        {/* Metrics */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 15 }}>
          <span>FPS: <strong>{metrics.fps}</strong></span>
          <span>Frame: <strong>{metrics.avgFrameTime.toFixed(1)}ms</strong></span>
          <span>Pending: <strong>{metrics.pendingUpdates}</strong></span>
          <span>Flashes: <strong>{metrics.activeFlashes}</strong></span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <MarketDataGrid
          columns={columns}
          rows={rows}
          engine={engineRef.current!}
          config={config}
        />
      </div>
    </div>
  );
};

/**
 * Real WebSocket Example
 * 
 * This example shows how to connect to a real WebSocket server.
 * Replace the URL with your actual WebSocket endpoint.
 */
export const RealWebSocketExample: React.FC = () => {
  const engineRef = useRef<MarketDataEngine | null>(null);

  // Initialize engine
  useEffect(() => {
    engineRef.current = createMarketDataEngine();
    return () => engineRef.current?.destroy();
  }, []);

  // Use market data hook with real WebSocket
  const marketData = useMarketData({
    engine: engineRef.current!,
    wsConfig: {
      url: 'wss://your-market-data-server.com/ws', // Replace with your URL
      reconnect: true,
      reconnectDelay: 1000,
      maxReconnectDelay: 30000,
      reconnectAttempts: 10,
      onConnect: () => console.log('Connected to market feed'),
      onDisconnect: () => console.log('Disconnected from feed'),
      onError: (error: any) => console.error('WebSocket error:', error),
      onMessage: (data: any) => console.log('Received:', data),
    },
    subscription: {
      symbols: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'],
    },
  });

  const columns: Column[] = useMemo(() => [
    { field: 'symbol', headerName: 'Symbol', width: 100 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'change', headerName: 'Change', width: 100 },
    { field: 'bid', headerName: 'Bid', width: 110 },
    { field: 'ask', headerName: 'Ask', width: 110 },
    { field: 'volume', headerName: 'Volume', width: 120 },
  ], []);

  return (
    <div style={{ padding: 20, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Real WebSocket Example</h2>
        <div>
          <span style={{ 
            padding: '5px 15px',
            borderRadius: 15,
            background: marketData.isConnected ? '#4caf50' : '#f44336',
            color: 'white',
            fontWeight: 'bold',
          }}>
            {marketData.connectionState.toUpperCase()}
          </span>
          <span style={{ marginLeft: 15 }}>
            {marketData.metrics.updatesPerSecond} updates/s
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <MarketDataGrid
          columns={columns}
          rows={marketData.rows}
          engine={engineRef.current!}
          config={{ enabled: true, enableFlash: true }}
        />
      </div>
    </div>
  );
};

/**
 * Custom Formatting Example
 * 
 * Shows how to customize cell rendering for market data.
 */
export const CustomFormattingExample: React.FC = () => {
  const engineRef = useRef<MarketDataEngine | null>(null);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    engineRef.current = createMarketDataEngine();
    
    const { feed, createConnection } = createMockFeed();
    feed.start();
    const mockWs = createConnection();

    mockWs.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data);
      if (data.type === 'snapshot') {
        engineRef.current?.initialize(data.data);
      } else if (data.type === 'tick') {
        engineRef.current?.processUpdate({
          rowId: data.symbol,
          updates: data.updates,
          timestamp: data.timestamp,
        });
      }
    };

    mockWs.onopen?.();

    const unsubscribe = engineRef.current.onUpdate((updatedRows: any) => {
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
  const columns: Column[] = useMemo(() => [
    { 
      field: 'symbol', 
      headerName: 'Symbol', 
      width: 120,
      renderCell: (row: any) => (
        <strong style={{ color: '#1976d2' }}>{row.symbol}</strong>
      ),
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 140,
      renderCell: (row: any) => (
        <span style={{ fontSize: 16, fontWeight: 'bold' }}>
          ${row.price?.toFixed(2)}
        </span>
      ),
    },
    { 
      field: 'change', 
      headerName: 'Change', 
      width: 120,
      renderCell: (row: any) => {
        const value = row.change || 0;
        return (
          <span style={{ 
            color: value >= 0 ? '#4caf50' : '#f44336',
            fontWeight: 'bold',
          }}>
            {value >= 0 ? '+' : ''}{value.toFixed(2)}
          </span>
        );
      },
    },
    { 
      field: 'volume', 
      headerName: 'Volume', 
      width: 120,
      renderCell: (row: any) => {
        const vol = row.volume || 0;
        return <span>{(vol / 1000000).toFixed(2)}M</span>;
      },
    },
  ], []);

  return (
    <div style={{ padding: 20, height: '100vh' }}>
      <h2>Custom Formatting Example</h2>
      <div style={{ height: 'calc(100vh - 100px)' }}>
        <MarketDataGrid
          columns={columns}
          rows={rows}
          engine={engineRef.current!}
          config={{ enabled: true, enableFlash: true }}
        />
      </div>
    </div>
  );
};

export default SimpleMarketExample;
