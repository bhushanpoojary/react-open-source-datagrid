# Market Data Mode - Documentation

## Overview

The Market Data Mode is a high-performance extension to the React DataGrid that enables real-time streaming of market data with ultra-low latency updates. It's designed to handle 1000+ updates per second while maintaining smooth UI performance and visual stability.

## Key Features

### 1. **High-Performance Update Engine**
- **RequestAnimationFrame batching** - Smooth 60fps updates
- **Differential updates** - Only changed cells are updated
- **Direct DOM manipulation** - Bypasses React reconciliation for speed
- **Memory-efficient row cache** - No deep cloning overhead
- **CPU usage monitoring** - Auto-throttles under heavy load

### 2. **Visual Feedback**
- **Cell flash animations** - Green for price increases, red for decreases
- **Bid/Ask spread coloring** - Visual distinction between bid (blue) and ask (red)
- **Change indicators** - Color-coded positive/negative changes
- **Compact density mode** - Display more data on screen

### 3. **WebSocket Integration**
- **Auto-reconnect** - Exponential backoff strategy
- **Connection state tracking** - Visual status indicators
- **Message batching** - Efficient data ingestion
- **Mock feed included** - Test without real WebSocket server

### 4. **Performance Optimizations**
- **Row recycling** - Reuse DOM nodes
- **Cell virtualization** - Only render visible cells
- **Update throttling** - Prevent CPU overload
- **RAF batching** - Smooth animations
- **Memory management** - Efficient data structures

## Architecture

### Components

```
MarketDataEngine.ts          - Core update engine with RAF batching
├── processUpdate()          - Ingests market data updates
├── processFrame()           - RAF loop for DOM updates
├── applyDOMUpdates()        - Direct DOM manipulation
└── getMetrics()             - Performance monitoring

useMarketData.ts             - React hook for WebSocket management
├── connect()                - WebSocket connection
├── subscribe()              - Symbol subscription
└── metrics                  - Update statistics

WebSocketMockFeed.ts         - Mock market data generator
├── start()                  - Begin generating updates
├── updateSymbol()           - Random price movements
└── broadcastUpdate()        - Send to clients

MarketDataGrid.tsx           - Optimized grid component
├── Enhanced column formatting
├── Cell flash animations
└── Market-specific styling
```

## Quick Start

### Basic Usage

```typescript
import { 
  MarketDataGrid, 
  MarketDataEngine, 
  createMarketDataEngine,
  useMarketData,
  createMockFeed 
} from 'react-open-source-grid';

function MarketDataPage() {
  // 1. Create engine
  const engineRef = useRef(createMarketDataEngine({
    flashDuration: 500,
    enableFlash: true,
    batchInterval: 16,
    maxUpdatesPerFrame: 1000,
  }));

  // 2. Create mock feed
  useEffect(() => {
    const { feed, createConnection } = createMockFeed({
      updateFrequency: 20, // 20 updates/sec per symbol
      priceVolatility: 0.003,
    });
    
    feed.start();
    return () => feed.stop();
  }, []);

  // 3. Use market data hook
  const { rows, connectionState, isConnected, metrics } = useMarketData({
    engine: engineRef.current,
    wsConfig: {
      url: 'ws://localhost:8080',
      reconnect: true,
    },
    initialData: symbols,
  });

  // 4. Define columns
  const columns = [
    { field: 'symbol', headerName: 'Symbol', width: 100 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'change', headerName: 'Change', width: 100 },
    { field: 'changePercent', headerName: 'Change %', width: 110 },
    { field: 'bid', headerName: 'Bid', width: 110 },
    { field: 'ask', headerName: 'Ask', width: 110 },
    { field: 'volume', headerName: 'Volume', width: 120 },
  ];

  // 5. Render grid
  return (
    <MarketDataGrid
      columns={columns}
      rows={rows}
      engine={engineRef.current}
      config={{ 
        enabled: true,
        densityMode: false,
        enableFlash: true,
      }}
    />
  );
}
```

## API Reference

### MarketDataEngine

#### Configuration

```typescript
interface MarketDataEngineConfig {
  flashDuration?: number;        // Flash animation duration (default: 500ms)
  batchInterval?: number;        // Min time between updates (default: 16ms)
  enableFlash?: boolean;         // Enable flash animations (default: true)
  maxUpdatesPerFrame?: number;   // Max updates per RAF (default: 1000)
  cpuThreshold?: number;         // CPU threshold for throttling (default: 0.8)
  enableLiveSorting?: boolean;   // Real-time sorting (default: false)
  enableRankingMovement?: boolean; // Allow row position changes (default: false)
}
```

#### Methods

```typescript
// Initialize with data
engine.initialize(rows: MarketDataRow[]): void

// Process incoming update
engine.processUpdate(update: RowUpdate): void

// Subscribe to updates
engine.onUpdate(callback: (rows: MarketDataRow[]) => void): () => void

// Get current data
engine.getRows(): MarketDataRow[]

// Pause/Resume updates
engine.pause(): void
engine.resume(): void
engine.isPausedState(): boolean

// Performance metrics
engine.getMetrics(): {
  avgFrameTime: number;
  fps: number;
  pendingUpdates: number;
  activeFlashes: number;
  rowCount: number;
  isThrottled: boolean;
}

// Cleanup
engine.clear(): void
engine.destroy(): void
```

### useMarketData Hook

#### Options

```typescript
interface UseMarketDataOptions {
  engine: MarketDataEngine;
  wsConfig?: WebSocketConfig;
  initialData?: MarketDataRow[];
  autoConnect?: boolean;
  subscription?: MarketDataSubscription;
}

interface WebSocketConfig {
  url: string;
  reconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectDelay?: number;
  reconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (data: any) => void;
}
```

#### Returns

```typescript
interface UseMarketDataReturn {
  rows: MarketDataRow[];
  connectionState: ConnectionState;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
  sendMessage: (message: any) => void;
  metrics: {
    updatesPerSecond: number;
    totalUpdates: number;
    reconnectCount: number;
  };
}
```

### WebSocketMockFeed

#### Configuration

```typescript
interface MockFeedConfig {
  symbols?: string[];           // List of symbols (default: 50 symbols)
  updateFrequency?: number;     // Updates/sec per symbol (default: 10)
  priceVolatility?: number;     // Price volatility 0-1 (default: 0.002)
  burstProbability?: number;    // Burst chance 0-1 (default: 0.1)
  burstSize?: number;           // Updates per burst (default: 5)
}
```

#### Usage

```typescript
const { feed, createConnection } = createMockFeed({
  updateFrequency: 20,
  priceVolatility: 0.003,
});

feed.start();
const mockWs = createConnection();

// Clean up
feed.stop();
```

## Performance Tips

### 1. **Optimize Update Frequency**
```typescript
// Balance between data freshness and performance
const engine = createMarketDataEngine({
  batchInterval: 16,  // 60fps
  maxUpdatesPerFrame: 1000,
});
```

### 2. **Enable CPU Throttling**
```typescript
// Automatically reduce update rate under load
const engine = createMarketDataEngine({
  cpuThreshold: 0.8,  // 80% threshold
});
```

### 3. **Use Density Mode**
```typescript
// Display more data in less space
<MarketDataGrid
  config={{ densityMode: true }}
/>
```

### 4. **Pause When Not Visible**
```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      engine.pause();
    } else {
      engine.resume();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);
```

### 5. **Monitor Performance**
```typescript
// Track metrics to identify bottlenecks
const metrics = engine.getMetrics();
console.log(`FPS: ${metrics.fps}`);
console.log(`Pending: ${metrics.pendingUpdates}`);
console.log(`Throttled: ${metrics.isThrottled}`);
```

## Styling

### Cell Flash Animations

```css
/* Green flash for price increase */
@keyframes flashUp {
  0% { background-color: rgba(76, 175, 80, 0); }
  20% { background-color: rgba(76, 175, 80, 0.4); }
  100% { background-color: rgba(76, 175, 80, 0); }
}

/* Red flash for price decrease */
@keyframes flashDown {
  0% { background-color: rgba(244, 67, 54, 0); }
  20% { background-color: rgba(244, 67, 54, 0.4); }
  100% { background-color: rgba(244, 67, 54, 0); }
}
```

### Color Coding

```css
/* Positive change - green */
.change-positive {
  color: #4caf50;
  font-weight: 600;
}

/* Negative change - red */
.change-negative {
  color: #f44336;
  font-weight: 600;
}

/* Bid price - blue */
.market-grid-cell[data-field="bid"] {
  color: #2196f3;
}

/* Ask price - red */
.market-grid-cell[data-field="ask"] {
  color: #ff5722;
}
```

## WebSocket Protocol

### Message Types

#### 1. Snapshot (Initial Data)
```json
{
  "type": "snapshot",
  "timestamp": 1700000000000,
  "data": [
    {
      "id": "AAPL",
      "symbol": "AAPL",
      "price": 150.25,
      "bid": 150.20,
      "ask": 150.30,
      "volume": 1000000
    }
  ]
}
```

#### 2. Tick Update
```json
{
  "type": "tick",
  "symbol": "AAPL",
  "timestamp": 1700000000100,
  "updates": {
    "price": 150.30,
    "bid": 150.25,
    "ask": 150.35,
    "size": 100,
    "volume": 1000100
  }
}
```

#### 3. Subscribe
```json
{
  "type": "subscribe",
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```

#### 4. Unsubscribe
```json
{
  "type": "unsubscribe",
  "symbols": ["AAPL"]
}
```

## Best Practices

### 1. **Data Ingestion vs. UI Updates**
- Never throttle data ingestion
- Only throttle UI rendering
- Keep row cache always up-to-date

### 2. **Memory Management**
- Reuse DOM nodes when possible
- Avoid deep cloning data
- Clean up subscriptions on unmount

### 3. **Error Handling**
```typescript
wsConfig: {
  onError: (error) => {
    console.error('WebSocket error:', error);
    // Implement fallback strategy
  },
  reconnect: true,
  maxReconnectAttempts: 5,
}
```

### 4. **Testing**
```typescript
// Use mock feed for testing
const { feed } = createMockFeed({
  symbols: ['TEST1', 'TEST2'],
  updateFrequency: 100, // High frequency for stress testing
  priceVolatility: 0.05, // High volatility
});
```

## Troubleshooting

### Low FPS
- Check `metrics.avgFrameTime` - should be < 16ms
- Reduce `updateFrequency` in mock feed
- Enable CPU throttling
- Use density mode to reduce DOM elements

### High Memory Usage
- Check for memory leaks in subscriptions
- Verify engine.destroy() is called on unmount
- Reduce number of active symbols

### Updates Not Appearing
- Check connection state
- Verify WebSocket messages are arriving
- Check if engine is paused
- Inspect browser console for errors

### Flash Animations Not Working
- Verify `enableFlash: true` in config
- Check CSS is loaded
- Ensure data-row-id and data-field attributes exist

## Examples

See `LiveMarketDemo.tsx` for a complete implementation with:
- 50 symbols streaming live data
- Pause/Resume controls
- Performance metrics overlay
- Connection status indicators
- Density mode toggle
- Flash animation toggle

## License

MIT License - see LICENSE file for details
