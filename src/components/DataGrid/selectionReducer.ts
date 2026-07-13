import type { GridState, GridAction } from './types';

/**
 * Handles row selection actions.
 *
 * `SELECT_ALL_ROWS` is a deliberate no-op here: the grid needs the full row
 * list to know which ids to select, so that is handled at the component level.
 */
export const selectionReducer = (state: GridState, action: GridAction): GridState => {
  switch (action.type) {
    case 'TOGGLE_ROW_SELECTION': {
      const { rowId, isMulti } = action.payload;
      const newSelectedRows = new Set(state.selection.selectedRows);

      if (isMulti) {
        // Multi-select: toggle the row
        if (newSelectedRows.has(rowId)) {
          newSelectedRows.delete(rowId);
        } else {
          newSelectedRows.add(rowId);
        }
      } else {
        // Single select: clear others and select this one
        if (newSelectedRows.size === 1 && newSelectedRows.has(rowId)) {
          newSelectedRows.clear();
        } else {
          newSelectedRows.clear();
          newSelectedRows.add(rowId);
        }
      }

      return {
        ...state,
        selection: {
          ...state.selection,
          selectedRows: newSelectedRows,
        },
      };
    }

    case 'SELECT_RANGE': {
      const { rowIds } = action.payload;
      const newSelectedRows = new Set(state.selection.selectedRows);

      rowIds.forEach((id) => newSelectedRows.add(id));

      return {
        ...state,
        selection: {
          ...state.selection,
          selectedRows: newSelectedRows,
        },
      };
    }

    case 'SELECT_ALL_ROWS': {
      // This will be populated by the grid with all row IDs
      // For now, return state as the API handles selection differently
      return state;
    }

    case 'DESELECT_ALL_ROWS': {
      return {
        ...state,
        selection: {
          selectedRows: new Set(),
          lastSelectedIndex: null,
        },
      };
    }

    case 'CLEAR_SELECTION': {
      return {
        ...state,
        selection: {
          selectedRows: new Set(),
          lastSelectedIndex: null,
        },
      };
    }

    default:
      return state;
  }
};
