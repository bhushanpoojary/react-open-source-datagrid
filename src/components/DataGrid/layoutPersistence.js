/**
 * LocalStorage Adapter
 * Stores layout presets in browser's localStorage
 */
export class LocalStorageAdapter {
    async save(key, preset) {
        try {
            const existingData = localStorage.getItem(key);
            const presets = existingData ? JSON.parse(existingData) : [];
            const index = presets.findIndex(p => p.id === preset.id);
            if (index !== -1) {
                presets[index] = preset;
            }
            else {
                presets.push(preset);
            }
            localStorage.setItem(key, JSON.stringify(presets));
        }
        catch (error) {
            console.error('Failed to save preset to localStorage:', error);
            throw error;
        }
    }
    async load(key, presetId) {
        try {
            const data = localStorage.getItem(key);
            if (!data)
                return null;
            const presets = JSON.parse(data);
            if (presetId) {
                return presets.find(p => p.id === presetId) || null;
            }
            return presets;
        }
        catch (error) {
            console.error('Failed to load preset from localStorage:', error);
            throw error;
        }
    }
    async delete(key, presetId) {
        try {
            const data = localStorage.getItem(key);
            if (!data)
                return;
            const presets = JSON.parse(data);
            const filtered = presets.filter(p => p.id !== presetId);
            localStorage.setItem(key, JSON.stringify(filtered));
        }
        catch (error) {
            console.error('Failed to delete preset from localStorage:', error);
            throw error;
        }
    }
    async list(key) {
        try {
            const data = localStorage.getItem(key);
            if (!data)
                return [];
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Failed to list presets from localStorage:', error);
            throw error;
        }
    }
}
/**
 * Server Adapter
 * Stores layout presets on a remote server via REST API
 */
export class ServerAdapter {
    config;
    constructor(config) {
        this.config = config;
    }
    async save(key, preset) {
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
        }
        catch (error) {
            console.error('Failed to save preset to server:', error);
            throw error;
        }
    }
    async load(key, presetId) {
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
        }
        catch (error) {
            console.error('Failed to load preset from server:', error);
            throw error;
        }
    }
    async delete(key, presetId) {
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
        }
        catch (error) {
            console.error('Failed to delete preset from server:', error);
            throw error;
        }
    }
    async list(key) {
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
        }
        catch (error) {
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
export class UserProfileAdapter {
    config;
    baseAdapter;
    constructor(config) {
        this.config = config;
        this.baseAdapter = config.adapter || new LocalStorageAdapter();
    }
    getUserKey(key) {
        const profileKey = this.config.profileKey || 'user-layouts';
        return `${profileKey}:${this.config.userId}:${key}`;
    }
    async save(key, preset) {
        return this.baseAdapter.save(this.getUserKey(key), preset);
    }
    async load(key, presetId) {
        return this.baseAdapter.load(this.getUserKey(key), presetId);
    }
    async delete(key, presetId) {
        return this.baseAdapter.delete(this.getUserKey(key), presetId);
    }
    async list(key) {
        return this.baseAdapter.list(this.getUserKey(key));
    }
}
/**
 * Get storage adapter based on configuration
 */
export function getStorageAdapter(config) {
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
export function generatePresetId() {
    return `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Create a new layout preset from current grid state
 */
export function createPreset(name, layout, description, id) {
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
    adapter;
    storageKey;
    constructor(config) {
        this.adapter = getStorageAdapter(config);
        this.storageKey = config.storageKey;
    }
    /**
     * Save a layout preset
     */
    async savePreset(preset) {
        const updatedPreset = {
            ...preset,
            updatedAt: Date.now(),
        };
        await this.adapter.save(this.storageKey, updatedPreset);
    }
    /**
     * Load a specific preset by ID
     */
    async loadPreset(presetId) {
        const result = await this.adapter.load(this.storageKey, presetId);
        if (Array.isArray(result)) {
            return result.find(p => p.id === presetId) || null;
        }
        return result;
    }
    /**
     * Load the most recently updated preset
     */
    async loadLastPreset() {
        const presets = await this.listPresets();
        if (presets.length === 0) {
            return null;
        }
        return presets.reduce((latest, current) => current.updatedAt > latest.updatedAt ? current : latest);
    }
    /**
     * Delete a preset
     */
    async deletePreset(presetId) {
        await this.adapter.delete(this.storageKey, presetId);
    }
    /**
     * List all presets
     */
    async listPresets() {
        return await this.adapter.list(this.storageKey);
    }
    /**
     * Check if a preset exists
     */
    async hasPreset(presetId) {
        const preset = await this.loadPreset(presetId);
        return preset !== null;
    }
    /**
     * Save current layout as auto-save (with special ID)
     */
    async autoSave(layout) {
        const autoSaveId = '__autosave__';
        const preset = createPreset('Auto-saved Layout', layout, 'Automatically saved layout', autoSaveId);
        await this.savePreset(preset);
    }
    /**
     * Load auto-saved layout
     */
    async loadAutoSave() {
        return await this.loadPreset('__autosave__');
    }
}
/**
 * Debounce helper for auto-save functionality
 */
export function debounce(func, delay) {
    let timeoutId = null;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, delay);
    };
}
