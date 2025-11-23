import type {
  LayoutPreset,
  StorageAdapter,
  ServerConfig,
  UserProfileConfig,
  PersistenceConfig,
} from './types';

/**
 * LocalStorage Adapter
 * Stores layout presets in browser's localStorage
 */
export class LocalStorageAdapter implements StorageAdapter {
  async save(key: string, preset: LayoutPreset): Promise<void> {
    try {
      const existingData = localStorage.getItem(key);
      const presets: LayoutPreset[] = existingData ? JSON.parse(existingData) : [];
      
      const index = presets.findIndex(p => p.id === preset.id);
      if (index !== -1) {
        presets[index] = preset;
      } else {
        presets.push(preset);
      }
      
      localStorage.setItem(key, JSON.stringify(presets));
    } catch (error) {
      console.error('Failed to save preset to localStorage:', error);
      throw error;
    }
  }

  async load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null> {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const presets: LayoutPreset[] = JSON.parse(data);
      
      if (presetId) {
        return presets.find(p => p.id === presetId) || null;
      }
      
      return presets;
    } catch (error) {
      console.error('Failed to load preset from localStorage:', error);
      throw error;
    }
  }

  async delete(key: string, presetId: string): Promise<void> {
    try {
      const data = localStorage.getItem(key);
      if (!data) return;
      
      const presets: LayoutPreset[] = JSON.parse(data);
      const filtered = presets.filter(p => p.id !== presetId);
      
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete preset from localStorage:', error);
      throw error;
    }
  }

  async list(key: string): Promise<LayoutPreset[]> {
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to list presets from localStorage:', error);
      throw error;
    }
  }
}

/**
 * Server Adapter
 * Stores layout presets on a remote server via REST API
 */
export class ServerAdapter implements StorageAdapter {
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
  }

  async save(key: string, preset: LayoutPreset): Promise<void> {
    const endpoint = this.config.saveEndpoint || `${this.config.baseUrl}/layouts`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
        body: JSON.stringify({ key, preset }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to save preset to server:', error);
      throw error;
    }
  }

  async load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null> {
    const endpoint = this.config.loadEndpoint || `${this.config.baseUrl}/layouts`;
    const url = presetId ? `${endpoint}/${key}/${presetId}` : `${endpoint}/${key}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to load preset from server:', error);
      throw error;
    }
  }

  async delete(key: string, presetId: string): Promise<void> {
    const endpoint = this.config.deleteEndpoint || `${this.config.baseUrl}/layouts`;
    const url = `${endpoint}/${key}/${presetId}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.config.headers,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete preset from server:', error);
      throw error;
    }
  }

  async list(key: string): Promise<LayoutPreset[]> {
    const endpoint = this.config.listEndpoint || `${this.config.baseUrl}/layouts`;
    const url = `${endpoint}/${key}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
      });

      if (response.status === 404) {
        return [];
      }

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to list presets from server:', error);
      throw error;
    }
  }
}

/**
 * User Profile Adapter
 * Stores layout presets associated with a specific user
 * Uses localStorage with user-specific keys by default, but can use custom adapter
 */
export class UserProfileAdapter implements StorageAdapter {
  private config: UserProfileConfig;
  private baseAdapter: StorageAdapter;

  constructor(config: UserProfileConfig) {
    this.config = config;
    this.baseAdapter = config.adapter || new LocalStorageAdapter();
  }

  private getUserKey(key: string): string {
    const profileKey = this.config.profileKey || 'user-layouts';
    return `${profileKey}:${this.config.userId}:${key}`;
  }

  async save(key: string, preset: LayoutPreset): Promise<void> {
    return this.baseAdapter.save(this.getUserKey(key), preset);
  }

  async load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null> {
    return this.baseAdapter.load(this.getUserKey(key), presetId);
  }

  async delete(key: string, presetId: string): Promise<void> {
    return this.baseAdapter.delete(this.getUserKey(key), presetId);
  }

  async list(key: string): Promise<LayoutPreset[]> {
    return this.baseAdapter.list(this.getUserKey(key));
  }
}

/**
 * Get storage adapter based on configuration
 */
export function getStorageAdapter(config: PersistenceConfig): StorageAdapter {
  if (config.customAdapter) {
    return config.customAdapter;
  }

  switch (config.strategy) {
    case 'server':
      if (!config.serverConfig) {
        throw new Error('Server configuration is required for server storage strategy');
      }
      return new ServerAdapter(config.serverConfig);
    
    case 'userProfile':
      if (!config.userProfileConfig) {
        throw new Error('User profile configuration is required for userProfile storage strategy');
      }
      return new UserProfileAdapter(config.userProfileConfig);
    
    case 'localStorage':
    default:
      return new LocalStorageAdapter();
  }
}

/**
 * Generate a unique ID for a preset
 */
export function generatePresetId(): string {
  return `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new layout preset from current grid state
 */
export function createPreset(
  name: string,
  layout: LayoutPreset['layout'],
  description?: string,
  id?: string
): LayoutPreset {
  const now = Date.now();
  
  return {
    id: id || generatePresetId(),
    name,
    description,
    createdAt: now,
    updatedAt: now,
    layout,
  };
}

/**
 * Layout Persistence Manager
 * Main API for saving, loading, and managing layout presets
 */
export class LayoutPersistenceManager {
  private adapter: StorageAdapter;
  private storageKey: string;

  constructor(config: PersistenceConfig) {
    this.adapter = getStorageAdapter(config);
    this.storageKey = config.storageKey;
  }

  /**
   * Save a layout preset
   */
  async savePreset(preset: LayoutPreset): Promise<void> {
    const updatedPreset = {
      ...preset,
      updatedAt: Date.now(),
    };
    
    await this.adapter.save(this.storageKey, updatedPreset);
  }

  /**
   * Load a specific preset by ID
   */
  async loadPreset(presetId: string): Promise<LayoutPreset | null> {
    const result = await this.adapter.load(this.storageKey, presetId);
    
    if (Array.isArray(result)) {
      return result.find(p => p.id === presetId) || null;
    }
    
    return result;
  }

  /**
   * Load the most recently updated preset
   */
  async loadLastPreset(): Promise<LayoutPreset | null> {
    const presets = await this.listPresets();
    
    if (presets.length === 0) {
      return null;
    }
    
    return presets.reduce((latest, current) => 
      current.updatedAt > latest.updatedAt ? current : latest
    );
  }

  /**
   * Delete a preset
   */
  async deletePreset(presetId: string): Promise<void> {
    await this.adapter.delete(this.storageKey, presetId);
  }

  /**
   * List all presets
   */
  async listPresets(): Promise<LayoutPreset[]> {
    return await this.adapter.list(this.storageKey);
  }

  /**
   * Check if a preset exists
   */
  async hasPreset(presetId: string): Promise<boolean> {
    const preset = await this.loadPreset(presetId);
    return preset !== null;
  }

  /**
   * Save current layout as auto-save (with special ID)
   */
  async autoSave(layout: LayoutPreset['layout']): Promise<void> {
    const autoSaveId = '__autosave__';
    const preset = createPreset('Auto-saved Layout', layout, 'Automatically saved layout', autoSaveId);
    await this.savePreset(preset);
  }

  /**
   * Load auto-saved layout
   */
  async loadAutoSave(): Promise<LayoutPreset | null> {
    return await this.loadPreset('__autosave__');
  }
}

/**
 * Debounce helper for auto-save functionality
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}
