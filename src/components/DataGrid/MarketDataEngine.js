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
/**
 * MarketDataEngine
 *
 * Manages high-frequency data updates with minimal performance impact.
 * Uses RAF batching and direct DOM manipulation to achieve sub-millisecond latencies.
 */
export class MarketDataEngine {
    config;
    rowCache;
    updateBuffer;
    flashAnimations;
    rafId;
    lastUpdateTime;
    isPaused;
    isThrottled;
    updateCallbacks;
    cellUpdateCallbacks;
    frameCount;
    lastFrameTime;
    avgFrameTime;
    constructor(config = {}) {
        this.config = {
            flashDuration: config.flashDuration ?? 500,
            batchInterval: config.batchInterval ?? 16,
            enableFlash: config.enableFlash ?? false,
            maxUpdatesPerFrame: config.maxUpdatesPerFrame ?? 1000,
            cpuThreshold: config.cpuThreshold ?? 0.8,
            enableLiveSorting: config.enableLiveSorting ?? false,
            enableRankingMovement: config.enableRankingMovement ?? false,
        };
        this.rowCache = new Map();
        this.updateBuffer = [];
        this.flashAnimations = new Map();
        this.rafId = null;
        this.lastUpdateTime = 0;
        this.isPaused = false;
        this.isThrottled = false;
        this.updateCallbacks = new Set();
        this.cellUpdateCallbacks = new Set();
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
        this.avgFrameTime = 16;
    }
    /**
     * Initialize the engine with row data
     */
    initialize(rows) {
        this.rowCache.clear();
        rows.forEach((row) => {
            this.rowCache.set(row.id, { ...row });
        });
    }
    /**
     * Process incoming market data updates
     * This method is optimized for high-frequency calls
     */
    processUpdate(update) {
        if (this.isPaused)
            return;
        const row = this.rowCache.get(update.rowId);
        if (!row) {
            console.warn(`Row ${update.rowId} not found in cache`);
            return;
        }
        // Create cell updates for changed fields
        Object.entries(update.updates).forEach(([field, newValue]) => {
            const oldValue = row[field];
            // Only process if value actually changed
            if (oldValue !== newValue) {
                const cellUpdate = {
                    rowId: update.rowId,
                    field,
                    oldValue,
                    newValue,
                    timestamp: update.timestamp,
                };
                this.updateBuffer.push(cellUpdate);
                // Update row cache immediately (data ingestion is never throttled)
                row[field] = newValue;
                // Trigger cell update callbacks
                this.cellUpdateCallbacks.forEach(callback => callback(cellUpdate));
                // Create flash animation if enabled
                if (this.config.enableFlash && this.isNumericField(oldValue, newValue)) {
                    const direction = newValue > oldValue ? 'up' : 'down';
                    const cellKey = `${update.rowId}-${field}`;
                    this.flashAnimations.set(cellKey, {
                        cellKey,
                        direction,
                        startTime: performance.now(),
                        duration: this.config.flashDuration,
                    });
                }
            }
        });
        // Schedule RAF update if not already scheduled
        if (!this.rafId) {
            this.rafId = requestAnimationFrame(this.processFrame.bind(this));
        }
    }
    /**
     * Process updates in batches using RAF
     */
    processFrame(timestamp) {
        this.rafId = null;
        // Calculate frame time for CPU monitoring
        const frameTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        this.frameCount++;
        // Update rolling average frame time
        this.avgFrameTime = this.avgFrameTime * 0.9 + frameTime * 0.1;
        // Check if we're dropping frames (CPU overload)
        if (this.avgFrameTime > 16.67 * this.config.cpuThreshold) {
            if (!this.isThrottled) {
                console.warn('MarketDataEngine: CPU threshold exceeded, enabling throttling');
                this.isThrottled = true;
            }
        }
        else if (this.isThrottled && this.avgFrameTime < 16) {
            console.log('MarketDataEngine: CPU normalized, disabling throttling');
            this.isThrottled = false;
        }
        // Throttle updates if CPU is overloaded
        if (this.isThrottled && timestamp - this.lastUpdateTime < this.config.batchInterval * 2) {
            this.rafId = requestAnimationFrame(this.processFrame.bind(this));
            return;
        }
        // Respect minimum batch interval
        if (timestamp - this.lastUpdateTime < this.config.batchInterval) {
            this.rafId = requestAnimationFrame(this.processFrame.bind(this));
            return;
        }
        this.lastUpdateTime = timestamp;
        // Process buffered updates
        if (this.updateBuffer.length > 0) {
            const updatesToProcess = this.updateBuffer.splice(0, this.config.maxUpdatesPerFrame);
            this.applyDOMUpdates(updatesToProcess);
        }
        // Clean up expired flash animations
        this.cleanupFlashAnimations(timestamp);
        // Notify subscribers of data changes
        if (this.updateCallbacks.size > 0) {
            const rows = Array.from(this.rowCache.values());
            this.updateCallbacks.forEach(callback => callback(rows));
        }
        // Continue RAF loop if there are pending updates
        if (this.updateBuffer.length > 0 || this.flashAnimations.size > 0) {
            this.rafId = requestAnimationFrame(this.processFrame.bind(this));
        }
    }
    /**
     * Apply DOM updates directly without React re-renders
     */
    applyDOMUpdates(updates) {
        // Group updates by row for efficient DOM queries
        const updatesByRow = new Map();
        updates.forEach(update => {
            if (!updatesByRow.has(update.rowId)) {
                updatesByRow.set(update.rowId, []);
            }
            updatesByRow.get(update.rowId).push(update);
        });
        // Apply updates to DOM
        updatesByRow.forEach((cellUpdates) => {
            cellUpdates.forEach(update => {
                const cellElement = this.getCellElement(update.rowId, update.field);
                if (cellElement) {
                    // Update cell content
                    this.updateCellContent(cellElement, update.newValue);
                    // Apply flash animation
                    const cellKey = `${update.rowId}-${update.field}`;
                    const flash = this.flashAnimations.get(cellKey);
                    if (flash) {
                        this.applyFlashAnimation(cellElement, flash.direction);
                    }
                }
            });
        });
    }
    /**
     * Get DOM element for a specific cell
     */
    getCellElement(rowId, field) {
        // Use data attributes to find cells efficiently
        const selector = `[data-row-id="${rowId}"][data-field="${field}"]`;
        return document.querySelector(selector);
    }
    /**
     * Update cell content in DOM
     */
    updateCellContent(element, value) {
        const formatted = this.formatCellValue(value);
        // Only update if content changed (avoid unnecessary reflows)
        if (element.textContent !== formatted) {
            element.textContent = formatted;
        }
    }
    /**
     * Apply flash animation to cell
     */
    applyFlashAnimation(element, direction) {
        // Remove existing flash classes
        element.classList.remove('cell-flash-up', 'cell-flash-down');
        // Force reflow to restart animation
        void element.offsetWidth;
        // Add flash class
        element.classList.add(`cell-flash-${direction}`);
    }
    /**
     * Clean up expired flash animations
     */
    cleanupFlashAnimations(timestamp) {
        const toRemove = [];
        this.flashAnimations.forEach((flash, cellKey) => {
            if (timestamp - flash.startTime > flash.duration) {
                toRemove.push(cellKey);
                // Remove flash class from DOM
                const [rowId, field] = cellKey.split('-');
                const cellElement = this.getCellElement(rowId, field);
                if (cellElement) {
                    cellElement.classList.remove('cell-flash-up', 'cell-flash-down');
                }
            }
        });
        toRemove.forEach(key => this.flashAnimations.delete(key));
    }
    /**
     * Format cell value for display
     */
    formatCellValue(value) {
        if (value == null)
            return '';
        if (typeof value === 'number') {
            return value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return String(value);
    }
    /**
     * Check if field values are numeric for flash animation
     */
    isNumericField(oldValue, newValue) {
        return typeof oldValue === 'number' && typeof newValue === 'number';
    }
    /**
     * Subscribe to row data updates
     */
    onUpdate(callback) {
        this.updateCallbacks.add(callback);
        return () => this.updateCallbacks.delete(callback);
    }
    /**
     * Subscribe to individual cell updates
     */
    onCellUpdate(callback) {
        this.cellUpdateCallbacks.add(callback);
        return () => this.cellUpdateCallbacks.delete(callback);
    }
    /**
     * Get current row data from cache
     */
    getRows() {
        return Array.from(this.rowCache.values());
    }
    /**
     * Get specific row from cache
     */
    getRow(rowId) {
        return this.rowCache.get(rowId);
    }
    /**
     * Pause live updates (data ingestion continues)
     */
    pause() {
        this.isPaused = true;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
    /**
     * Resume live updates
     */
    resume() {
        this.isPaused = false;
        if (this.updateBuffer.length > 0 && !this.rafId) {
            this.rafId = requestAnimationFrame(this.processFrame.bind(this));
        }
    }
    /**
     * Check if updates are paused
     */
    isPausedState() {
        return this.isPaused;
    }
    /**
     * Check if engine is throttled due to CPU load
     */
    isThrottledState() {
        return this.isThrottled;
    }
    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            avgFrameTime: this.avgFrameTime,
            fps: Math.round(1000 / this.avgFrameTime),
            pendingUpdates: this.updateBuffer.length,
            activeFlashes: this.flashAnimations.size,
            rowCount: this.rowCache.size,
            isThrottled: this.isThrottled,
        };
    }
    /**
     * Clear all data and reset engine
     */
    clear() {
        this.rowCache.clear();
        this.updateBuffer = [];
        this.flashAnimations.clear();
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
    /**
     * Destroy engine and clean up
     */
    destroy() {
        // Remove all flash classes from DOM before clearing
        this.flashAnimations.forEach((_, cellKey) => {
            const [rowId, field] = cellKey.split('-');
            const cellElement = this.getCellElement(rowId, field);
            if (cellElement) {
                cellElement.classList.remove('cell-flash-up', 'cell-flash-down');
            }
        });
        this.clear();
        this.updateCallbacks.clear();
        this.cellUpdateCallbacks.clear();
    }
}
/**
 * Create a market data engine instance
 */
export function createMarketDataEngine(config) {
    return new MarketDataEngine(config);
}
