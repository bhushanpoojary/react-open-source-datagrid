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
        style={{
          padding: '6px 12px',
          fontSize: '14px',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        disabled={loading}
      >
        <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        Layout Presets
        <svg style={{ width: '14px', height: '14px', flexShrink: 0, transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10,
            }}
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu Content */}
          <div style={{
            position: 'absolute',
            right: 0,
            marginTop: '8px',
            width: '320px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 20,
            maxHeight: '384px',
            overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <h3 style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>Layout Presets</h3>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
                <p style={{ fontSize: '14px', color: '#dc2626' }}>{error}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowSaveDialog(true);
                  setShowMenu(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '14px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Current
              </button>
              <button
                onClick={() => {
                  onResetLayout();
                  setShowMenu(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '14px',
                  backgroundColor: '#4b5563',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>

            {/* Presets List */}
            <div style={{ maxHeight: '256px', overflowY: 'auto' }}>
              {loading && presets.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  Loading presets...
                </div>
              ) : presets.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  No saved presets. Save your current layout to get started.
                </div>
              ) : (
                <div>
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      style={{
                        padding: '12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                      onClick={() => handleLoadPreset(preset.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        const buttons = e.currentTarget.querySelector('.preset-actions') as HTMLElement;
                        if (buttons) buttons.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        const buttons = e.currentTarget.querySelector('.preset-actions') as HTMLElement;
                        if (buttons) buttons.style.opacity = '0';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {preset.name}
                          </h4>
                          {preset.description && (
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {preset.description}
                            </p>
                          )}
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            Updated: {formatDate(preset.updatedAt)}
                          </p>
                        </div>
                        <div className="preset-actions" style={{ display: 'flex', gap: '4px', marginLeft: '8px', opacity: 0, transition: 'opacity 0.2s' }}>
                          <button
                            onClick={(e) => handleUpdatePreset(preset, e)}
                            style={{
                              padding: '4px',
                              color: '#2563eb',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            title="Update with current layout"
                          >
                            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleDeletePreset(preset.id, e)}
                            style={{
                              padding: '4px',
                              color: '#dc2626',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            title="Delete preset"
                          >
                            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setShowSaveDialog(false)}
          />
          
          {/* Dialog */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxWidth: '448px',
                width: '100%',
                padding: '24px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Save Layout Preset</h2>
              
              {error && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px' }}>
                  <p style={{ fontSize: '14px', color: '#dc2626' }}>{error}</p>
                </div>
              )}

              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="preset-name" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Preset Name *
                  </label>
                  <input
                    id="preset-name"
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    placeholder="e.g., Sales Dashboard Layout"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="preset-description" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Description (optional)
                  </label>
                  <textarea
                    id="preset-description"
                    value={presetDescription}
                    onChange={(e) => setPresetDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    placeholder="Add a description..."
                    rows={3}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setPresetName('');
                    setPresetDescription('');
                    setError(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreset}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: 'white',
                    backgroundColor: '#2563eb',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
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
