/**
 * MarketDataEngine.ts
 *
 * High-performance market data update engine for handling 1000+ updates/sec
 * with minimal React re-renders and optimal DOM patching.
 *
 * Features:
 * - RequestAnimationFrame batching for smooth 60fps updates
 * - Diff buffer for tracking changed cells
 * - Direct DOM manipulation to bypass React reconciliation
 * - Cell flash animations (green/red for up/down)
 * - Memory-efficient row cache
 * - CPU usage monitoring and auto-throttling
 */
export interface CellUpdate {
    rowId: string | number;
    field: string;
    oldValue: any;
    newValue: any;
    timestamp: number;
}
export interface FlashAnimation {
    cellKey: string;
    direction: 'up' | 'down';
    startTime: number;
    duration: number;
}
export interface MarketDataRow {
    id: string | number;
    [key: string]: any;
}
export interface MarketDataEngineConfig {
    flashDuration?: number;
    batchInterval?: number;
    enableFlash?: boolean;
    maxUpdatesPerFrame?: number;
    cpuThreshold?: number;
    enableLiveSorting?: boolean;
    enableRankingMovement?: boolean;
}
export interface RowUpdate {
    rowId: string | number;
    updates: {
        [field: string]: any;
    };
    timestamp: number;
}
/**
 * MarketDataEngine
 *
 * Manages high-frequency data updates with minimal performance impact.
 * Uses RAF batching and direct DOM manipulation to achieve sub-millisecond latencies.
 */
export declare class MarketDataEngine {
    private config;
    private rowCache;
    private updateBuffer;
    private flashAnimations;
    private rafId;
    private lastUpdateTime;
    private isPaused;
    private isThrottled;
    private updateCallbacks;
    private cellUpdateCallbacks;
    private frameCount;
    private lastFrameTime;
    private avgFrameTime;
    constructor(config?: MarketDataEngineConfig);
    /**
     * Initialize the engine with row data
     */
    initialize(rows: MarketDataRow[]): void;
    /**
     * Process incoming market data updates
     * This method is optimized for high-frequency calls
     */
    processUpdate(update: RowUpdate): void;
    /**
     * Process updates in batches using RAF
     */
    private processFrame;
    /**
     * Apply DOM updates directly without React re-renders
     */
    private applyDOMUpdates;
    /**
     * Get DOM element for a specific cell
     */
    private getCellElement;
    /**
     * Update cell content in DOM
     */
    private updateCellContent;
    /**
     * Apply flash animation to cell
     */
    private applyFlashAnimation;
    /**
     * Clean up expired flash animations
     */
    private cleanupFlashAnimations;
    /**
     * Format cell value for display
     */
    private formatCellValue;
    /**
     * Check if field values are numeric for flash animation
     */
    private isNumericField;
    /**
     * Subscribe to row data updates
     */
    onUpdate(callback: (rows: MarketDataRow[]) => void): () => void;
    /**
     * Subscribe to individual cell updates
     */
    onCellUpdate(callback: (update: CellUpdate) => void): () => void;
    /**
     * Get current row data from cache
     */
    getRows(): MarketDataRow[];
    /**
     * Get specific row from cache
     */
    getRow(rowId: string | number): MarketDataRow | undefined;
    /**
     * Pause live updates (data ingestion continues)
     */
    pause(): void;
    /**
     * Resume live updates
     */
    resume(): void;
    /**
     * Check if updates are paused
     */
    isPausedState(): boolean;
    /**
     * Check if engine is throttled due to CPU load
     */
    isThrottledState(): boolean;
    /**
     * Get performance metrics
     */
    getMetrics(): {
        avgFrameTime: number;
        fps: number;
        pendingUpdates: number;
        activeFlashes: number;
        rowCount: number;
        isThrottled: boolean;
    };
    /**
     * Clear all data and reset engine
     */
    clear(): void;
    /**
     * Destroy engine and clean up
     */
    destroy(): void;
}
/**
 * Create a market data engine instance
 */
export declare function createMarketDataEngine(config?: MarketDataEngineConfig): MarketDataEngine;
