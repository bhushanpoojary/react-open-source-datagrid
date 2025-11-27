/**
 * Server-Side DataSource for Infinite Scrolling
 *
 * Handles:
 * - Fetching data blocks from server
 * - Server-side filtering
 * - Server-side sorting
 * - Local block caching
 * - Infinite scrolling for massive datasets (100M+ rows)
 */
import type { Row, SortConfig, FilterConfig } from './types';
export interface ServerSideRequest {
    startRow: number;
    endRow: number;
    sortModel?: SortConfig[];
    filterModel?: FilterConfig;
    groupKeys?: string[];
}
export interface ServerSideResponse {
    rows: Row[];
    totalRows: number;
    lastRow?: number;
}
export interface ServerSideDataSourceConfig {
    blockSize?: number;
    maxConcurrentRequests?: number;
    cacheBlockCount?: number;
    cacheTimeout?: number;
    getRows: (request: ServerSideRequest) => Promise<ServerSideResponse>;
}
/**
 * ServerSideDataSource
 *
 * Manages infinite scrolling with server-side data fetching, filtering, and sorting.
 * Similar to AG Grid's server-side row model.
 */
export declare class ServerSideDataSource {
    private blockSize;
    private maxConcurrentRequests;
    private cacheBlockCount;
    private cacheTimeout;
    private getRows;
    private blockCache;
    private blockStatus;
    private activeRequests;
    private requestQueue;
    private totalRows;
    private sortModel;
    private filterModel;
    private observers;
    constructor(config: ServerSideDataSourceConfig);
    /**
     * Subscribe to data changes
     */
    subscribe(callback: () => void): () => void;
    /**
     * Notify observers of data changes
     */
    private notifyObservers;
    /**
     * Get block index for a given row index
     */
    private getBlockIndex;
    /**
     * Get start row for a block
     */
    private getBlockStartRow;
    /**
     * Get end row for a block
     */
    private getBlockEndRow;
    /**
     * Check if a block is cached and valid
     */
    private isBlockCached;
    /**
     * Purge old cache entries to maintain cache size limit
     */
    private purgeCache;
    /**
     * Fetch a block from the server
     */
    private fetchBlock;
    /**
     * Queue a block request
     */
    private queueBlockRequest;
    /**
     * Process queued requests
     */
    private processQueue;
    /**
     * Ensure blocks are loaded for a given range
     */
    private ensureBlocksLoaded;
    /**
     * Get rows for a given range
     */
    getRowsInRange(startRow: number, endRow: number): Row[];
    /**
     * Get a single row by index
     */
    getRow(rowIndex: number): Row | undefined;
    /**
     * Get total row count (may be undefined until first response)
     */
    getTotalRows(): number | undefined;
    /**
     * Check if a block is loading
     */
    isBlockLoading(blockIndex: number): boolean;
    /**
     * Update sort model and refresh data
     */
    setSortModel(sortModel: SortConfig[]): void;
    /**
     * Update filter model and refresh data
     */
    setFilterModel(filterModel: FilterConfig): void;
    /**
     * Refresh all data (clears cache and reloads)
     */
    refresh(): void;
    /**
     * Purge a specific block from cache
     */
    purgeBlock(blockIndex: number): void;
    /**
     * Destroy the data source (cleanup)
     */
    destroy(): void;
}
/**
 * Create a mock server-side data source for testing
 */
export declare function createMockServerDataSource(totalRows?: number, delay?: number): ServerSideDataSource;
