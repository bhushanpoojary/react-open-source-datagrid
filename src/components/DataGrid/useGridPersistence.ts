import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { Dispatch } from 'react';
import type {
  GridState,
  GridAction,
  LayoutPreset,
  PersistenceConfig,
} from './types';
import { LayoutPersistenceManager, debounce } from './layoutPersistence';

export interface UseGridPersistenceParams {
  state: GridState;
  dispatch: Dispatch<GridAction>;
  persistenceConfig?: PersistenceConfig;
  onLayoutChange?: (layout: LayoutPreset['layout']) => void;
}

export interface UseGridPersistenceResult {
  persistenceManager: LayoutPersistenceManager | null;
  getCurrentLayout: () => LayoutPreset['layout'];
}

/**
 * Encapsulates layout persistence for the DataGrid:
 * - creates the {@link LayoutPersistenceManager} when persistence is enabled
 * - auto-loads the last saved preset on mount (when `autoLoad` is set)
 * - exposes a stable `getCurrentLayout` snapshot
 * - debounced auto-save on layout changes (when `autoSave` is set)
 * - notifies the parent via `onLayoutChange` when the layout actually changes
 *
 * Behavior is intentionally identical to the effects it replaces in DataGrid.
 */
export function useGridPersistence({
  state,
  dispatch,
  persistenceConfig,
  onLayoutChange,
}: UseGridPersistenceParams): UseGridPersistenceResult {
  const [persistenceManager, setPersistenceManager] =
    useState<LayoutPersistenceManager | null>(null);
  const autoSaveRef = useRef<(() => void) | null>(null);
  const previousLayoutRef = useRef<string | null>(null);

  // Initialize persistence manager
  useEffect(() => {
    if (persistenceConfig?.enabled) {
      const manager = new LayoutPersistenceManager(persistenceConfig);
      const t = setTimeout(() => setPersistenceManager(manager), 0); // defer to avoid sync setState in effect

      // Auto-load last saved preset on mount
      if (persistenceConfig.autoLoad) {
        manager
          .loadAutoSave()
          .then((preset) => {
            if (preset) {
              dispatch({ type: 'LOAD_LAYOUT_PRESET', payload: preset.layout });
            }
          })
          .catch((error) => {
            console.error('Failed to load auto-saved layout:', error);
          });
      }
      return () => clearTimeout(t);
    }
  }, [persistenceConfig]);

  // Memoize serialized versions of complex objects
  const sortConfigStr = useMemo(
    () => JSON.stringify(state.sortConfig),
    [state.sortConfig]
  );
  const filterConfigStr = useMemo(
    () => JSON.stringify(state.filterConfig),
    [state.filterConfig]
  );

  // Get current layout state - using a stable reference
  const getCurrentLayout = useCallback((): LayoutPreset['layout'] => {
    return {
      columnOrder: state.columnOrder,
      columnWidths: state.columnWidths,
      pinnedColumnsLeft: state.pinnedColumnsLeft,
      pinnedColumnsRight: state.pinnedColumnsRight,
      hiddenColumns: state.hiddenColumns,
      sortConfig: state.sortConfig,
      filterConfig: state.filterConfig,
      pageSize: state.pageSize,
      groupBy: state.groupBy,
    };
  }, [
    state.columnOrder,
    state.columnWidths,
    state.pinnedColumnsLeft,
    state.pinnedColumnsRight,
    state.hiddenColumns,
    state.sortConfig,
    state.filterConfig,
    state.pageSize,
    state.groupBy,
  ]);

  // Auto-save functionality
  useEffect(() => {
    if (
      !persistenceConfig?.enabled ||
      !persistenceConfig.autoSave ||
      !persistenceManager
    ) {
      return;
    }

    // Create debounced auto-save function
    const delay = persistenceConfig.autoSaveDelay || 1000;
    const debouncedAutoSave = debounce(() => {
      const layout = getCurrentLayout();
      persistenceManager.autoSave(layout).catch((error) => {
        console.error('Failed to auto-save layout:', error);
      });
    }, delay);

    autoSaveRef.current = debouncedAutoSave;

    // Trigger auto-save on layout changes
    debouncedAutoSave();

    return () => {
      autoSaveRef.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    persistenceConfig,
    persistenceManager,
    state.columnOrder,
    state.columnWidths,
    state.pinnedColumnsLeft,
    state.pinnedColumnsRight,
    state.hiddenColumns,
    sortConfigStr,
    filterConfigStr,
    state.pageSize,
    state.groupBy,
  ]);

  // Notify parent of layout changes
  useEffect(() => {
    if (onLayoutChange) {
      const layout = getCurrentLayout();
      const layoutStr = JSON.stringify(layout);

      // Only trigger if layout actually changed
      if (previousLayoutRef.current !== layoutStr) {
        previousLayoutRef.current = layoutStr;
        onLayoutChange(layout);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    onLayoutChange,
    state.columnOrder,
    state.columnWidths,
    state.pinnedColumnsLeft,
    state.pinnedColumnsRight,
    state.hiddenColumns,
    sortConfigStr,
    filterConfigStr,
    state.pageSize,
    state.groupBy,
  ]);

  return { persistenceManager, getCurrentLayout };
}
