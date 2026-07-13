// Layout persistence types for the DataGrid.
import type { SortConfig, FilterConfig } from './types.model';

// Layout Preset - represents a saved grid layout
export interface LayoutPreset {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  layout: {
    columnOrder: string[];
    columnWidths: { [field: string]: number };
    pinnedColumnsLeft: string[];
    pinnedColumnsRight: string[];
    hiddenColumns: string[];
    sortConfig: SortConfig;
    filterConfig: FilterConfig;
    pageSize: number;
    groupBy?: string[];
  };
}

// Storage strategy type
export type StorageStrategy = 'localStorage' | 'server' | 'userProfile';

// Storage adapter interface for different persistence strategies
export interface StorageAdapter {
  save(key: string, preset: LayoutPreset): Promise<void>;
  load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null>;
  delete(key: string, presetId: string): Promise<void>;
  list(key: string): Promise<LayoutPreset[]>;
}

// Server configuration for server-based persistence
export interface ServerConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  saveEndpoint?: string;
  loadEndpoint?: string;
  deleteEndpoint?: string;
  listEndpoint?: string;
}

// User profile configuration for user-based persistence
export interface UserProfileConfig {
  userId: string;
  profileKey?: string;
  adapter?: StorageAdapter;
}

// Persistence configuration
export interface PersistenceConfig {
  enabled: boolean;
  storageKey: string; // Unique key to identify this grid's layouts
  strategy?: StorageStrategy;
  autoSave?: boolean; // Auto-save on layout changes
  autoSaveDelay?: number; // Debounce delay in ms (default: 1000)
  autoLoad?: boolean; // Auto-load last saved preset on mount
  serverConfig?: ServerConfig;
  userProfileConfig?: UserProfileConfig;
  customAdapter?: StorageAdapter;
}
