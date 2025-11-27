import type { LayoutPreset, StorageAdapter, ServerConfig, UserProfileConfig, PersistenceConfig } from './types';
/**
 * LocalStorage Adapter
 * Stores layout presets in browser's localStorage
 */
export declare class LocalStorageAdapter implements StorageAdapter {
    save(key: string, preset: LayoutPreset): Promise<void>;
    load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null>;
    delete(key: string, presetId: string): Promise<void>;
    list(key: string): Promise<LayoutPreset[]>;
}
/**
 * Server Adapter
 * Stores layout presets on a remote server via REST API
 */
export declare class ServerAdapter implements StorageAdapter {
    private config;
    constructor(config: ServerConfig);
    save(key: string, preset: LayoutPreset): Promise<void>;
    load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null>;
    delete(key: string, presetId: string): Promise<void>;
    list(key: string): Promise<LayoutPreset[]>;
}
/**
 * User Profile Adapter
 * Stores layout presets associated with a specific user
 * Uses localStorage with user-specific keys by default, but can use custom adapter
 */
export declare class UserProfileAdapter implements StorageAdapter {
    private config;
    private baseAdapter;
    constructor(config: UserProfileConfig);
    private getUserKey;
    save(key: string, preset: LayoutPreset): Promise<void>;
    load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null>;
    delete(key: string, presetId: string): Promise<void>;
    list(key: string): Promise<LayoutPreset[]>;
}
/**
 * Get storage adapter based on configuration
 */
export declare function getStorageAdapter(config: PersistenceConfig): StorageAdapter;
/**
 * Generate a unique ID for a preset
 */
export declare function generatePresetId(): string;
/**
 * Create a new layout preset from current grid state
 */
export declare function createPreset(name: string, layout: LayoutPreset['layout'], description?: string, id?: string): LayoutPreset;
/**
 * Layout Persistence Manager
 * Main API for saving, loading, and managing layout presets
 */
export declare class LayoutPersistenceManager {
    private adapter;
    private storageKey;
    constructor(config: PersistenceConfig);
    /**
     * Save a layout preset
     */
    savePreset(preset: LayoutPreset): Promise<void>;
    /**
     * Load a specific preset by ID
     */
    loadPreset(presetId: string): Promise<LayoutPreset | null>;
    /**
     * Load the most recently updated preset
     */
    loadLastPreset(): Promise<LayoutPreset | null>;
    /**
     * Delete a preset
     */
    deletePreset(presetId: string): Promise<void>;
    /**
     * List all presets
     */
    listPresets(): Promise<LayoutPreset[]>;
    /**
     * Check if a preset exists
     */
    hasPreset(presetId: string): Promise<boolean>;
    /**
     * Save current layout as auto-save (with special ID)
     */
    autoSave(layout: LayoutPreset['layout']): Promise<void>;
    /**
     * Load auto-saved layout
     */
    loadAutoSave(): Promise<LayoutPreset | null>;
}
/**
 * Debounce helper for auto-save functionality
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void;
