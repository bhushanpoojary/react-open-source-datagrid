import React, { useState, useEffect } from 'react';
import type { LayoutPreset } from './types';
import { LayoutPersistenceManager } from './layoutPersistence';

interface LayoutPresetsManagerProps {
  manager: LayoutPersistenceManager;
  currentLayout: LayoutPreset['layout'];
  onLoadPreset: (layout: LayoutPreset['layout']) => void;
  onResetLayout: () => void;
}

export const LayoutPresetsManager: React.FC<LayoutPresetsManagerProps> = ({
  manager,
  currentLayout,
  onLoadPreset,
  onResetLayout,
}) => {
  const [presets, setPresets] = useState<LayoutPreset[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load presets on mount
  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      setLoading(true);
      const loadedPresets = await manager.listPresets();
      // Filter out auto-save preset from the list
      setPresets(loadedPresets.filter(p => p.id !== '__autosave__'));
      setError(null);
    } catch (err) {
      setError('Failed to load presets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      setError('Please enter a preset name');
      return;
    }

    try {
      setLoading(true);
      const { createPreset } = await import('./layoutPersistence');
      const preset = createPreset(presetName.trim(), currentLayout, presetDescription.trim());
      await manager.savePreset(preset);
      await loadPresets();
      setShowSaveDialog(false);
      setPresetName('');
      setPresetDescription('');
      setError(null);
    } catch (err) {
      setError('Failed to save preset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = async (presetId: string) => {
    try {
      setLoading(true);
      const preset = await manager.loadPreset(presetId);
      if (preset) {
        onLoadPreset(preset.layout);
        setShowMenu(false);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load preset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePreset = async (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this preset?')) {
      return;
    }

    try {
      setLoading(true);
      await manager.deletePreset(presetId);
      await loadPresets();
      setError(null);
    } catch (err) {
      setError('Failed to delete preset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreset = async (preset: LayoutPreset, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Update this preset with current layout?')) {
      return;
    }

    try {
      setLoading(true);
      const updatedPreset = {
        ...preset,
        layout: currentLayout,
      };
      await manager.savePreset(updatedPreset);
      await loadPresets();
      setError(null);
    } catch (err) {
      setError('Failed to update preset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="relative inline-block">
      {/* Main Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
        disabled={loading}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        Layout Presets
        <svg className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-sm text-gray-900">Layout Presets</h3>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border-b border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="p-2 border-b border-gray-200 flex gap-2">
              <button
                onClick={() => {
                  setShowSaveDialog(true);
                  setShowMenu(false);
                }}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Current
              </button>
              <button
                onClick={() => {
                  onResetLayout();
                  setShowMenu(false);
                }}
                className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>

            {/* Presets List */}
            <div className="max-h-64 overflow-y-auto">
              {loading && presets.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Loading presets...
                </div>
              ) : presets.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No saved presets. Save your current layout to get started.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer group"
                      onClick={() => handleLoadPreset(preset.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {preset.name}
                          </h4>
                          {preset.description && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {preset.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Updated: {formatDate(preset.updatedAt)}
                          </p>
                        </div>
                        <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleUpdatePreset(preset, e)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Update with current layout"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleDeletePreset(preset.id, e)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete preset"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center"
            onClick={() => setShowSaveDialog(false)}
          />
          
          {/* Dialog */}
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Save Layout Preset</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="preset-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Preset Name *
                  </label>
                  <input
                    id="preset-name"
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sales Dashboard Layout"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="preset-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="preset-description"
                    value={presetDescription}
                    onChange={(e) => setPresetDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a description..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setPresetName('');
                    setPresetDescription('');
                    setError(null);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreset}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Preset'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
