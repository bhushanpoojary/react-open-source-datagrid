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

// Server-side request parameters
export interface ServerSideRequest {
  startRow: number;
  endRow: number;
  sortModel?: SortConfig[];
  filterModel?: FilterConfig;
  groupKeys?: string[];
}

// Server-side response
export interface ServerSideResponse {
  rows: Row[];
  totalRows: number;
  lastRow?: number; // For infinite scrolling, undefined means more data available
}

// Block cache entry
interface BlockCacheEntry {
  startRow: number;
  endRow: number;
  rows: Row[];
  timestamp: number;
}

// DataSource configuration
export interface ServerSideDataSourceConfig {
  blockSize?: number; // Rows per block (default: 100)
  maxConcurrentRequests?: number; // Max parallel requests (default: 2)
  cacheBlockCount?: number; // Max blocks to cache (default: 20)
  cacheTimeout?: number; // Cache timeout in ms (default: 5 minutes)
  getRows: (request: ServerSideRequest) => Promise<ServerSideResponse>;
}

// Block status
const BlockStatus = {
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
} as const;

type BlockStatusType = typeof BlockStatus[keyof typeof BlockStatus];

interface BlockInfo {
  status: BlockStatusType;
  rows?: Row[];
  error?: Error;
  promise?: Promise<ServerSideResponse>;
}

/**
 * ServerSideDataSource
 * 
 * Manages infinite scrolling with server-side data fetching, filtering, and sorting.
 * Similar to AG Grid's server-side row model.
 */
export class ServerSideDataSource {
  private blockSize: number;
  private maxConcurrentRequests: number;
  private cacheBlockCount: number;
  private cacheTimeout: number;
  private getRows: (request: ServerSideRequest) => Promise<ServerSideResponse>;
  
  // Cache management
  private blockCache: Map<number, BlockCacheEntry>;
  private blockStatus: Map<number, BlockInfo>;
  private activeRequests: number;
  private requestQueue: Array<() => void>;
  
  // Current state
  private totalRows: number | undefined;
  private sortModel: SortConfig[];
  private filterModel: FilterConfig;
  private observers: Set<() => void>;

  constructor(config: ServerSideDataSourceConfig) {
    this.blockSize = config.blockSize || 100;
    this.maxConcurrentRequests = config.maxConcurrentRequests || 4;
    this.cacheBlockCount = config.cacheBlockCount || 20;
    this.cacheTimeout = config.cacheTimeout || 5 * 60 * 1000; // 5 minutes
    this.getRows = config.getRows;
    
    this.blockCache = new Map();
    this.blockStatus = new Map();
    this.activeRequests = 0;
    this.requestQueue = [];
    this.totalRows = undefined;
    this.sortModel = [];
    this.filterModel = {};
    this.observers = new Set();
  }

  /**
   * Subscribe to data changes
   */
  subscribe(callback: () => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  /**
   * Notify observers of data changes
   */
  private notifyObservers(): void {
    this.observers.forEach(callback => callback());
  }

  /**
   * Get block index for a given row index
   */
  private getBlockIndex(rowIndex: number): number {
    return Math.floor(rowIndex / this.blockSize);
  }

  /**
   * Get start row for a block
   */
  private getBlockStartRow(blockIndex: number): number {
    return blockIndex * this.blockSize;
  }

  /**
   * Get end row for a block
   */
  private getBlockEndRow(blockIndex: number): number {
    return (blockIndex + 1) * this.blockSize;
  }

  /**
   * Check if a block is cached and valid
   */
  private isBlockCached(blockIndex: number): boolean {
    const cached = this.blockCache.get(blockIndex);
    if (!cached) return false;
    
    const now = Date.now();
    const isExpired = now - cached.timestamp > this.cacheTimeout;
    
    if (isExpired) {
      this.blockCache.delete(blockIndex);
      this.blockStatus.delete(blockIndex);
      return false;
    }
    
    return true;
  }

  /**
   * Purge old cache entries to maintain cache size limit
   */
  private purgeCache(): void {
    if (this.blockCache.size <= this.cacheBlockCount) return;
    
    // Sort by timestamp and remove oldest entries
    const entries = Array.from(this.blockCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, entries.length - this.cacheBlockCount);
    toRemove.forEach(([blockIndex]) => {
      this.blockCache.delete(blockIndex);
      this.blockStatus.delete(blockIndex);
    });
  }

  /**
   * Fetch a block from the server
   */
  private async fetchBlock(blockIndex: number): Promise<void> {
    const startRow = this.getBlockStartRow(blockIndex);
    const endRow = this.getBlockEndRow(blockIndex);
    
    const request: ServerSideRequest = {
      startRow,
      endRow,
      sortModel: this.sortModel,
      filterModel: this.filterModel,
    };

    try {
      const response = await this.getRows(request);
      
      // Cache the block
      this.blockCache.set(blockIndex, {
        startRow,
        endRow,
        rows: response.rows,
        timestamp: Date.now(),
      });
      
      // Update block status
      this.blockStatus.set(blockIndex, {
        status: BlockStatus.LOADED,
        rows: response.rows,
      });
      
      // Update total row count
      if (response.lastRow !== undefined) {
        this.totalRows = response.lastRow;
      } else if (response.totalRows !== undefined) {
        this.totalRows = response.totalRows;
      }
      
      // Purge old cache entries
      this.purgeCache();
      
      // Notify observers
      this.notifyObservers();
    } catch (error) {
      console.error(`Failed to fetch block ${blockIndex}:`, error);
      this.blockStatus.set(blockIndex, {
        status: BlockStatus.FAILED,
        error: error as Error,
      });
      
      // Notify observers even on error
      this.notifyObservers();
    }
  }

  /**
   * Queue a block request
   */
  private queueBlockRequest(blockIndex: number): void {
    // Skip if already loading or loaded
    const status = this.blockStatus.get(blockIndex);
    if (status?.status === BlockStatus.LOADING || this.isBlockCached(blockIndex)) {
      return;
    }

    const executeRequest = async () => {
      this.activeRequests++;
      this.blockStatus.set(blockIndex, { status: BlockStatus.LOADING });
      
      try {
        await this.fetchBlock(blockIndex);
      } finally {
        this.activeRequests--;
        this.processQueue();
      }
    };

    if (this.activeRequests < this.maxConcurrentRequests) {
      executeRequest();
    } else {
      this.requestQueue.push(executeRequest);
    }
  }

  /**
   * Process queued requests
   */
  private processQueue(): void {
    while (this.activeRequests < this.maxConcurrentRequests && this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) request();
    }
  }

  /**
   * Ensure blocks are loaded for a given range
   */
  private ensureBlocksLoaded(startRow: number, endRow: number): void {
    const startBlock = this.getBlockIndex(startRow);
    const endBlock = this.getBlockIndex(endRow);
    
    // Request blocks in range
    for (let blockIndex = startBlock; blockIndex <= endBlock; blockIndex++) {
      this.queueBlockRequest(blockIndex);
    }
    
    // Prefetch adjacent blocks for smooth scrolling
    this.queueBlockRequest(startBlock - 1);
    this.queueBlockRequest(endBlock + 1);
  }

  /**
   * Get rows for a given range
   */
  getRowsInRange(startRow: number, endRow: number): Row[] {
    this.ensureBlocksLoaded(startRow, endRow);
    
    const rows: Row[] = [];
    const startBlock = this.getBlockIndex(startRow);
    const endBlock = this.getBlockIndex(endRow);
    
    for (let blockIndex = startBlock; blockIndex <= endBlock; blockIndex++) {
      const cached = this.blockCache.get(blockIndex);
      if (cached) {
        const blockStartRow = this.getBlockStartRow(blockIndex);
        
        cached.rows.forEach((row, idx) => {
          const rowIndex = blockStartRow + idx;
          if (rowIndex >= startRow && rowIndex < endRow) {
            rows.push(row);
          }
        });
      } else {
        // Return placeholder rows for loading blocks
        const blockStartRow = this.getBlockStartRow(blockIndex);
        const blockEndRow = this.getBlockEndRow(blockIndex);
        
        for (let rowIndex = Math.max(startRow, blockStartRow); rowIndex < Math.min(endRow, blockEndRow); rowIndex++) {
          rows.push({
            id: `loading-${rowIndex}`,
            _loading: true,
          } as Row);
        }
      }
    }
    
    return rows;
  }

  /**
   * Get a single row by index
   */
  getRow(rowIndex: number): Row | undefined {
    const blockIndex = this.getBlockIndex(rowIndex);
    
    if (!this.isBlockCached(blockIndex)) {
      this.queueBlockRequest(blockIndex);
      return {
        id: `loading-${rowIndex}`,
        _loading: true,
      } as Row;
    }
    
    const cached = this.blockCache.get(blockIndex);
    if (!cached) return undefined;
    
    const blockStartRow = this.getBlockStartRow(blockIndex);
    const indexInBlock = rowIndex - blockStartRow;
    
    return cached.rows[indexInBlock];
  }

  /**
   * Get total row count (may be undefined until first response)
   */
  getTotalRows(): number | undefined {
    return this.totalRows;
  }

  /**
   * Check if a block is loading
   */
  isBlockLoading(blockIndex: number): boolean {
    const status = this.blockStatus.get(blockIndex);
    return status?.status === BlockStatus.LOADING;
  }

  /**
   * Update sort model and refresh data
   */
  setSortModel(sortModel: SortConfig[]): void {
    this.sortModel = sortModel;
    this.refresh();
  }

  /**
   * Update filter model and refresh data
   */
  setFilterModel(filterModel: FilterConfig): void {
    this.filterModel = filterModel;
    this.refresh();
  }

  /**
   * Refresh all data (clears cache and reloads)
   */
  refresh(): void {
    this.blockCache.clear();
    this.blockStatus.clear();
    this.totalRows = undefined;
    this.notifyObservers();
  }

  /**
   * Purge a specific block from cache
   */
  purgeBlock(blockIndex: number): void {
    this.blockCache.delete(blockIndex);
    this.blockStatus.delete(blockIndex);
  }

  /**
   * Destroy the data source (cleanup)
   */
  destroy(): void {
    this.blockCache.clear();
    this.blockStatus.clear();
    this.requestQueue = [];
    this.observers.clear();
  }
}

/**
 * Create a mock server-side data source for testing
 */
export function createMockServerDataSource(
  totalRows: number = 1000000,
  delay: number = 300
): ServerSideDataSource {
  const getRows = async (request: ServerSideRequest): Promise<ServerSideResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const { startRow, endRow, sortModel, filterModel } = request;
    const rows: Row[] = [];
    
    // Generate mock data
    for (let i = startRow; i < Math.min(endRow, totalRows); i++) {
      rows.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        age: 20 + (i % 50),
        country: ['USA', 'UK', 'Canada', 'Germany', 'France'][i % 5],
        salary: 30000 + (i % 100) * 1000,
        department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'][i % 5],
      });
    }
    
    // Apply server-side filtering (simplified)
    let filteredRows = rows;
    if (filterModel && Object.keys(filterModel).length > 0) {
      filteredRows = rows.filter(row => {
        return Object.entries(filterModel).every(([field, filterValue]) => {
          if (!filterValue) return true;
          
          const value = row[field];
          const filterVal = filterValue.value;
          
          if (filterValue.type === 'contains') {
            return String(value).toLowerCase().includes(String(filterVal).toLowerCase());
          } else if (filterValue.type === 'equals') {
            return value === filterVal;
          } else if (filterValue.type === 'greaterThan') {
            return value > filterVal;
          } else if (filterValue.type === 'lessThan') {
            return value < filterVal;
          }
          
          return true;
        });
      });
    }
    
    // Apply server-side sorting
    if (sortModel && sortModel.length > 0) {
      const sort = sortModel[0];
      if (sort.field && sort.direction) {
        filteredRows.sort((a, b) => {
          const aVal = a[sort.field];
          const bVal = b[sort.field];
          
          if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }
    
    return {
      rows: filteredRows,
      totalRows: totalRows,
      lastRow: rows.length < (endRow - startRow) ? startRow + rows.length : undefined,
    };
  };
  
  return new ServerSideDataSource({
    blockSize: 100,
    maxConcurrentRequests: 2,
    cacheBlockCount: 20,
    getRows,
  });
}
