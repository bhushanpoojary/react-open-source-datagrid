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
// ...existing code...
import { useEffect, useRef, useState, useCallback } from 'react';
import { MarketDataEngine } from './MarketDataEngine';
/**
 * Hook for managing market data with WebSocket connection and engine integration
 */
export function useMarketData(options) {
    const { engine, wsConfig, initialData, autoConnect = true, subscription } = options;
    const [rows, setRows] = useState(initialData || []);
    const [connectionState, setConnectionState] = useState('disconnected');
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectDelayRef = useRef(wsConfig?.reconnectDelay || 1000);
    const reconnectCountRef = useRef(0);
    const subscribedSymbolsRef = useRef(new Set(subscription?.symbols || []));
    // Metrics tracking
    const metricsRef = useRef({
        updatesPerSecond: 0,
        totalUpdates: 0,
        lastUpdateTime: 0,
        updateCountInSecond: 0,
    });
    const [metrics, setMetrics] = useState({
        updatesPerSecond: 0,
        totalUpdates: 0,
        reconnectCount: 0,
    });
    // Initialize lastUpdateTime after render
    useEffect(() => {
        if (metricsRef.current.lastUpdateTime === 0) {
            metricsRef.current.lastUpdateTime = Date.now();
        }
    }, []);
    // Update metrics state periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                updatesPerSecond: metricsRef.current.updatesPerSecond,
                totalUpdates: metricsRef.current.totalUpdates,
                reconnectCount: reconnectCountRef.current,
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);
    /**
     * Update metrics
     */
    const updateMetrics = useCallback(() => {
        metricsRef.current.totalUpdates++;
        metricsRef.current.updateCountInSecond++;
        const now = Date.now();
        const timeDiff = now - metricsRef.current.lastUpdateTime;
        if (timeDiff >= 1000) {
            metricsRef.current.updatesPerSecond = Math.round((metricsRef.current.updateCountInSecond * 1000) / timeDiff);
            metricsRef.current.updateCountInSecond = 0;
            metricsRef.current.lastUpdateTime = now;
        }
    }, []);
    /**
     * Handle incoming WebSocket message
     */
    const handleMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.data);
            // Call user's onMessage handler
            wsConfig?.onMessage?.(data);
            // Handle different message types
            if (data.type === 'update' || data.type === 'tick') {
                const update = {
                    rowId: data.symbol || data.id,
                    updates: data.updates || data.data || data,
                    timestamp: data.timestamp || Date.now(),
                };
                // Process update through engine
                engine.processUpdate(update);
                // Update metrics
                updateMetrics();
                // Call subscription callback
                subscription?.onUpdate?.(update);
            }
            else if (data.type === 'snapshot') {
                // Handle snapshot data
                if (Array.isArray(data.data)) {
                    engine.initialize(data.data);
                }
            }
            else if (data.type === 'subscribed') {
                console.log('Subscription confirmed:', data.symbols);
            }
            else if (data.type === 'error') {
                console.error('WebSocket error message:', data.message);
            }
        }
        catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }, [engine, wsConfig, subscription, updateMetrics]);
    /**
     * Connect to WebSocket
     */
    const connect = useCallback(() => {
        if (!wsConfig?.url) {
            console.warn('No WebSocket URL provided');
            return;
        }
        if (wsRef.current?.readyState === WebSocket.OPEN ||
            wsRef.current?.readyState === WebSocket.CONNECTING) {
            return;
        }
        setConnectionState('connecting');
        try {
            const ws = new WebSocket(wsConfig.url);
            ws.onopen = () => {
                console.log('WebSocket connected');
                setConnectionState('connected');
                reconnectCountRef.current = 0;
                reconnectDelayRef.current = wsConfig.reconnectDelay || 1000;
                wsConfig.onConnect?.();
                // Subscribe to symbols after connection
                if (subscribedSymbolsRef.current.size > 0) {
                    ws.send(JSON.stringify({
                        type: 'subscribe',
                        symbols: Array.from(subscribedSymbolsRef.current),
                    }));
                }
            };
            ws.onmessage = handleMessage;
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                wsConfig.onError?.(error);
            };
            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setConnectionState('disconnected');
                wsConfig.onDisconnect?.();
                wsRef.current = null;
                // Attempt reconnect if enabled
                if (wsConfig.reconnect &&
                    reconnectCountRef.current < (wsConfig.reconnectAttempts || Infinity)) {
                    const delay = Math.min(reconnectDelayRef.current, wsConfig.maxReconnectDelay || 30000);
                    console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectCountRef.current + 1})`);
                    setConnectionState('reconnecting');
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectCountRef.current++;
                        reconnectDelayRef.current *= 2; // Exponential backoff
                        // Reconnect will be triggered by the useEffect that watches connectionState
                        setConnectionState('reconnecting');
                    }, delay);
                }
                else if (reconnectCountRef.current >= (wsConfig.reconnectAttempts || Infinity)) {
                    setConnectionState('failed');
                    console.error('Max reconnection attempts reached');
                }
            };
            wsRef.current = ws;
        }
        catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            setConnectionState('failed');
        }
    }, [wsConfig, handleMessage]);
    /**
     * Disconnect from WebSocket
     */
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setConnectionState('disconnected');
    }, []);
    /**
     * Subscribe to symbols
     */
    const subscribe = useCallback((symbols) => {
        symbols.forEach(symbol => subscribedSymbolsRef.current.add(symbol));
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'subscribe',
                symbols,
            }));
        }
    }, []);
    /**
     * Unsubscribe from symbols
     */
    const unsubscribe = useCallback((symbols) => {
        symbols.forEach(symbol => subscribedSymbolsRef.current.delete(symbol));
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'unsubscribe',
                symbols,
            }));
        }
    }, []);
    /**
     * Send custom message through WebSocket
     */
    const sendMessage = useCallback((message) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
        }
        else {
            console.warn('WebSocket is not connected');
        }
    }, []);
    /**
     * Subscribe to engine updates
     */
    useEffect(() => {
        const unsubscribe = engine.onUpdate((updatedRows) => {
            setRows([...updatedRows]);
        });
        return unsubscribe;
    }, [engine]);
    /**
     * Initialize engine with initial data
     */
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            engine.initialize(initialData);
        }
    }, [engine, initialData]); // Only run on mount
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setTimeout(() => setRows([...initialData]), 0);
        }
    }, [initialData]);
    /**
     * Auto-connect on mount
     */
    useEffect(() => {
        if (autoConnect && wsConfig) {
            setTimeout(() => connect(), 0);
        }
        return () => {
            disconnect();
        };
    }, [autoConnect, wsConfig, connect, disconnect]); // Only run on mount/unmount
    return {
        rows,
        connectionState,
        isConnected: connectionState === 'connected',
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        sendMessage,
        metrics,
    };
}
