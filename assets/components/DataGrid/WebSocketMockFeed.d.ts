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
    updateFrequency?: number;
    priceVolatility?: number;
    burstProbability?: number;
    burstSize?: number;
    port?: number;
}
/**
 * Mock WebSocket Feed
 * Simulates a WebSocket server for market data
 */
export declare class WebSocketMockFeed {
    private config;
    private marketData;
    private updateIntervals;
    private clients;
    private isRunning;
    constructor(config?: MockFeedConfig);
    /**
     * Generate default symbol list
     */
    private generateDefaultSymbols;
    /**
     * Initialize market data with random values
     */
    private initializeMarketData;
    /**
     * Generate random price
     */
    private randomPrice;
    /**
     * Update market data for a symbol
     */
    private updateSymbol;
    /**
     * Trigger burst of rapid updates
     */
    private triggerBurst;
    /**
     * Broadcast update to all connected clients
     */
    private broadcastUpdate;
    /**
     * Start generating updates
     */
    start(): void;
    /**
     * Stop generating updates
     */
    stop(): void;
    /**
     * Register a mock WebSocket client
     */
    connect(client: MockWebSocket): void;
    /**
     * Unregister a mock WebSocket client
     */
    disconnect(client: MockWebSocket): void;
    /**
     * Get current market data snapshot
     */
    getSnapshot(): MockMarketData[];
    /**
     * Get data for specific symbol
     */
    getSymbolData(symbol: string): MockMarketData | undefined;
}
/**
 * Mock WebSocket client interface
 */
export interface MockWebSocket {
    readyState: number;
    send: (data: string) => void;
    onmessage: ((event: {
        data: string;
    }) => void) | null;
    onopen: (() => void) | null;
    onclose: (() => void) | null;
    onerror: ((error: any) => void) | null;
    close: () => void;
}
/**
 * Create a mock WebSocket that connects to the feed
 */
export declare function createMockWebSocket(feed: WebSocketMockFeed): MockWebSocket;
/**
 * Create and start a mock market data feed
 */
export declare function createMockFeed(config?: MockFeedConfig): {
    feed: WebSocketMockFeed;
    createConnection: () => MockWebSocket;
};
