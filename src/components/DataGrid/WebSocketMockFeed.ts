/**
 * WebSocketMockFeed.ts
 * 
 * Mock WebSocket server that simulates live market data feed.
 * Generates realistic tick updates for testing market data mode.
 * 
 * Features:
 * - Simulates 1000+ ticks/sec
 * - Random price movements
 * - Bid/Ask spreads
 * - Volume tracking
 * - Burst updates
 * - Configurable update frequency
 */

export interface MockMarketData {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  size: number;
  volume: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  lastUpdate: number;
}

export interface MockFeedConfig {
  symbols?: string[];
  updateFrequency?: number; // Updates per second per symbol
  priceVolatility?: number; // Price change volatility (0-1)
  burstProbability?: number; // Probability of burst updates (0-1)
  burstSize?: number; // Number of rapid updates in a burst
  port?: number;
}

/**
 * Mock WebSocket Feed
 * Simulates a WebSocket server for market data
 */
export class WebSocketMockFeed {
  private config: Required<MockFeedConfig>;
  private marketData: Map<string, MockMarketData>;
  private updateIntervals: Map<string, number>;
  private clients: Set<MockWebSocket>;
  private isRunning: boolean;

  constructor(config: MockFeedConfig = {}) {
    this.config = {
      symbols: config.symbols || this.generateDefaultSymbols(),
      updateFrequency: config.updateFrequency ?? 10, // 10 updates/sec per symbol
      priceVolatility: config.priceVolatility ?? 0.002, // 0.2% volatility
      burstProbability: config.burstProbability ?? 0.1, // 10% chance of burst
      burstSize: config.burstSize ?? 5,
      port: config.port ?? 8080,
    };

    this.marketData = new Map();
    this.updateIntervals = new Map();
    this.clients = new Set();
    this.isRunning = false;

    this.initializeMarketData();
  }

  /**
   * Generate default symbol list
   */
  private generateDefaultSymbols(): string[] {
    const prefixes = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 
                     'NFLX', 'DIS', 'BA', 'GS', 'JPM', 'V', 'MA', 'PYPL', 'SQ', 'SHOP',
                     'BABA', 'JD', 'PDD', 'NIO', 'XPEV', 'LI', 'BIDU', 'IBM', 'ORCL',
                     'SAP', 'ADBE', 'CRM', 'NOW', 'SNOW', 'PLTR', 'U', 'DDOG', 'ZS',
                     'CRWD', 'S', 'TWLO', 'NET', 'MDB', 'ESTC', 'FSLY', 'OKTA', 'ZM',
                     'DOCU', 'WORK', 'TEAM', 'ATLR', 'WDAY'];
    return prefixes.slice(0, 50);
  }

  /**
   * Initialize market data with random values
   */
  private initializeMarketData(): void {
    this.config.symbols.forEach(symbol => {
      const price = this.randomPrice(50, 500);
      const spread = price * 0.001; // 0.1% spread
      
      this.marketData.set(symbol, {
        symbol,
        price,
        bid: price - spread / 2,
        ask: price + spread / 2,
        size: Math.floor(Math.random() * 1000) + 100,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        change: 0,
        changePercent: 0,
        high: price * 1.02,
        low: price * 0.98,
        open: price,
        lastUpdate: Date.now(),
      });
    });
  }

  /**
   * Generate random price
   */
  private randomPrice(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Update market data for a symbol
   */
  private updateSymbol(symbol: string): void {
    const data = this.marketData.get(symbol);
    if (!data) return;

    // Calculate price change
    const volatility = this.config.priceVolatility;
    const changePercent = (Math.random() - 0.5) * 2 * volatility;
    const priceChange = data.price * changePercent;
    const newPrice = Math.max(0.01, data.price + priceChange);

    // Update bid/ask with new price
    const spread = newPrice * 0.001;
    const newBid = newPrice - spread / 2;
    const newAsk = newPrice + spread / 2;

    // Update volume
    const sizeChange = Math.floor((Math.random() - 0.5) * 200);
    const newSize = Math.max(10, data.size + sizeChange);

    // Calculate changes from open
    const changeFromOpen = newPrice - data.open;
    const changePercentFromOpen = (changeFromOpen / data.open) * 100;

    // Update high/low
    const newHigh = Math.max(data.high, newPrice);
    const newLow = Math.min(data.low, newPrice);

    // Create updated data
    const updated: MockMarketData = {
      ...data,
      price: newPrice,
      bid: newBid,
      ask: newAsk,
      size: newSize,
      volume: data.volume + newSize,
      change: changeFromOpen,
      changePercent: changePercentFromOpen,
      high: newHigh,
      low: newLow,
      lastUpdate: Date.now(),
    };

    this.marketData.set(symbol, updated);

    // Broadcast update to clients
    this.broadcastUpdate(symbol, updated);

    // Random burst updates
    if (Math.random() < this.config.burstProbability) {
      this.triggerBurst(symbol);
    }
  }

  /**
   * Trigger burst of rapid updates
   */
  private triggerBurst(symbol: string): void {
    let burstCount = 0;
    const burstInterval = setInterval(() => {
      if (burstCount >= this.config.burstSize) {
        clearInterval(burstInterval);
        return;
      }
      this.updateSymbol(symbol);
      burstCount++;
    }, 10); // 10ms between burst updates
  }

  /**
   * Broadcast update to all connected clients
   */
  private broadcastUpdate(symbol: string, data: MockMarketData): void {
    const message = {
      type: 'tick',
      symbol,
      timestamp: Date.now(),
      updates: {
        price: data.price,
        bid: data.bid,
        ask: data.ask,
        size: data.size,
        volume: data.volume,
        change: data.change,
        changePercent: data.changePercent,
        high: data.high,
        low: data.low,
      },
    };

    this.clients.forEach(client => {
      if (client.readyState === 1 && client.onmessage) { // OPEN
        client.onmessage({ data: JSON.stringify(message) });
      }
    });
  }

  /**
   * Start generating updates
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log(`Mock feed started with ${this.config.symbols.length} symbols`);

    // Start update intervals for each symbol
    this.config.symbols.forEach(symbol => {
      const interval = 1000 / this.config.updateFrequency;
      const intervalId = setInterval(() => {
        this.updateSymbol(symbol);
      }, interval);
      
      this.updateIntervals.set(symbol, intervalId);
    });
  }

  /**
   * Stop generating updates
   */
  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    console.log('Mock feed stopped');

    // Clear all intervals
    this.updateIntervals.forEach(intervalId => clearInterval(intervalId));
    this.updateIntervals.clear();
  }

  /**
   * Register a mock WebSocket client
   */
  public connect(client: MockWebSocket): void {
    this.clients.add(client);
    console.log(`Client connected (${this.clients.size} total)`);

    // Send initial snapshot via onmessage (server -> client)
    const snapshot = {
      type: 'snapshot',
      timestamp: Date.now(),
      data: Array.from(this.marketData.values()).map(data => ({
        id: data.symbol,
        symbol: data.symbol,
        price: data.price,
        bid: data.bid,
        ask: data.ask,
        size: data.size,
        volume: data.volume,
        change: data.change,
        changePercent: data.changePercent,
        high: data.high,
        low: data.low,
        open: data.open,
      })),
    };

    // Trigger client's onmessage to simulate server sending data
    if (client.onmessage) {
      client.onmessage({ data: JSON.stringify(snapshot) });
    }
  }

  /**
   * Unregister a mock WebSocket client
   */
  public disconnect(client: MockWebSocket): void {
    this.clients.delete(client);
    console.log(`Client disconnected (${this.clients.size} total)`);
  }

  /**
   * Get current market data snapshot
   */
  public getSnapshot(): MockMarketData[] {
    return Array.from(this.marketData.values());
  }

  /**
   * Get data for specific symbol
   */
  public getSymbolData(symbol: string): MockMarketData | undefined {
    return this.marketData.get(symbol);
  }
}

/**
 * Mock WebSocket client interface
 */
export interface MockWebSocket {
  readyState: number;
  send: (data: string) => void;
  onmessage: ((event: { data: string }) => void) | null;
  onopen: (() => void) | null;
  onclose: (() => void) | null;
  onerror: ((error: any) => void) | null;
  close: () => void;
}

/**
 * Create a mock WebSocket that connects to the feed
 */
export function createMockWebSocket(feed: WebSocketMockFeed): MockWebSocket {
  let readyState = 0; // CONNECTING
  
  const mockWS: MockWebSocket = {
    readyState,
    onmessage: null,
    onopen: null,
    onclose: null,
    onerror: null,
    
    send(data: string) {
      try {
        const message = JSON.parse(data);
        
        // Handle subscription messages
        if (message.type === 'subscribe') {
          console.log('Subscribed to:', message.symbols);
          // Send confirmation
          if (mockWS.onmessage) {
            mockWS.onmessage({
              data: JSON.stringify({
                type: 'subscribed',
                symbols: message.symbols,
              }),
            });
          }
        } else if (message.type === 'unsubscribe') {
          console.log('Unsubscribed from:', message.symbols);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    },
    
    close() {
      if (mockWS.readyState === 1) {
        mockWS.readyState = 3; // CLOSED
        feed.disconnect(mockWS);
        if (mockWS.onclose) mockWS.onclose();
      }
    },
  };

  // Simulate async connection
  setTimeout(() => {
    mockWS.readyState = 1; // OPEN
    if (mockWS.onopen) mockWS.onopen();
    
    // Send snapshot after onopen so client can set up onmessage handler
    setTimeout(() => {
      feed.connect(mockWS);
    }, 10);
  }, 100);

  // Override send method to inject messages
  const originalSend = mockWS.send.bind(mockWS);
  mockWS.send = (data: string) => {
    if (mockWS.readyState === 1) {
      originalSend(data);
    }
  };

  return mockWS;
}

/**
 * Create and start a mock market data feed
 */
export function createMockFeed(config?: MockFeedConfig): {
  feed: WebSocketMockFeed;
  createConnection: () => MockWebSocket;
} {
  const feed = new WebSocketMockFeed(config);
  feed.start();

  return {
    feed,
    createConnection: () => createMockWebSocket(feed),
  };
}
