import { useRef, useEffect, useImperativeHandle } from 'react';
import type { Dispatch, ForwardedRef, RefObject } from 'react';
import type { GridState, GridAction, Column, Row } from './types';
import type { GridApi } from './gridApi.types';
import { GridApiImpl } from './gridApi';
import type { LayoutPersistenceManager } from './layoutPersistence';

export interface UseGridApiBindingParams {
  ref: ForwardedRef<GridApi>;
  state: GridState;
  dispatch: Dispatch<GridAction>;
  effectiveColumns: Column[];
  pivotedData: Row[];
  persistenceManager: LayoutPersistenceManager | null;
  setInternalRows: (rows: Row[]) => void;
  onGridReady?: (api: GridApi) => void;
}

export interface UseGridApiBindingResult {
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Wires the imperative {@link GridApi} to the DataGrid:
 * - creates a single {@link GridApiImpl} instance (recreating it if StrictMode
 *   destroyed the previous one)
 * - keeps the API's state/data/callbacks in sync after each render
 * - exposes the API through the forwarded ref via `useImperativeHandle`
 * - invokes `onGridReady` exactly once when the API is first available
 * - destroys the API on unmount
 *
 * Returns the `containerRef` that must be attached to the grid's root element.
 * Behavior is intentionally identical to the effects it replaces in DataGrid.
 */
export function useGridApiBinding({
  ref,
  state,
  dispatch,
  effectiveColumns,
  pivotedData,
  persistenceManager,
  setInternalRows,
  onGridReady,
}: UseGridApiBindingParams): UseGridApiBindingResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridApiRef = useRef<GridApiImpl | null>(null);

  // Initialize Grid API once (or recreate if destroyed by StrictMode)
  useEffect(() => {
    if (!gridApiRef.current || gridApiRef.current.isDestroyed()) {
      gridApiRef.current = new GridApiImpl(
        state,
        dispatch,
        effectiveColumns,
        pivotedData,
        containerRef,
        persistenceManager,
        setInternalRows
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update API state after render to avoid accessing refs during render
  useEffect(() => {
    if (gridApiRef.current && !gridApiRef.current.isDestroyed()) {
      gridApiRef.current.updateState(state);
      gridApiRef.current.updateData(effectiveColumns, pivotedData);
      gridApiRef.current.updateCallbacks(setInternalRows);
    }
  }, [state, effectiveColumns, pivotedData, setInternalRows]);

  // Expose Grid API via ref
  useImperativeHandle(
    ref,
    () => {
      if (!gridApiRef.current || gridApiRef.current.isDestroyed()) {
        gridApiRef.current = new GridApiImpl(
          state,
          dispatch,
          effectiveColumns,
          pivotedData,
          containerRef,
          persistenceManager,
          setInternalRows
        );
      }
      return gridApiRef.current;
    },
    [state, effectiveColumns, pivotedData, persistenceManager]
  );

  // Call onGridReady when API is initialized (only once)
  const onGridReadyCalledRef = useRef(false);
  const onGridReadyCallbackRef = useRef(onGridReady);

  // Update callback ref when it changes
  useEffect(() => {
    onGridReadyCallbackRef.current = onGridReady;
  }, [onGridReady]);

  useEffect(() => {
    if (
      gridApiRef.current &&
      onGridReadyCallbackRef.current &&
      !onGridReadyCalledRef.current
    ) {
      onGridReadyCalledRef.current = true;
      onGridReadyCallbackRef.current(gridApiRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gridApiRef.current) {
        gridApiRef.current.destroy();
      }
    };
  }, []);

  return { containerRef };
}
