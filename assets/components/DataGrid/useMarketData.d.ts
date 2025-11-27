/**
 * useMarketData.ts
 *
 * React hook for managing market data subscriptions, WebSocket connections,
 * and integrating with MarketDataEngine.
 *
 * Features:
 * - WebSocket connection management
 * - Auto-reconnect with exponential backoff
 * - Data ingestion pipeline
 * - Subscription management
 * - Connection state tracking
 */
import { MarketDataEngine } from './MarketDataEngine';
import type { RowUpdate, MarketDataRow } from './MarketDataEngine';
export interface WebSocketConfig {
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
export interface MarketDataSubscription {
    symbols: string[];
    onUpdate?: (update: RowUpdate) => void;
}
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed';
export interface UseMarketDataOptions {
    engine: MarketDataEngine;
    wsConfig?: WebSocketConfig;
    initialData?: MarketDataRow[];
    autoConnect?: boolean;
    subscription?: MarketDataSubscription;
}
export interface UseMarketDataReturn {
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
/**
 * Hook for managing market data with WebSocket connection and engine integration
 */
export declare function useMarketData(options: UseMarketDataOptions): UseMarketDataReturn;
