import type { GridState, GridAction } from './types';

/** Maximum undo/redo steps kept in memory. */
const MAX_HISTORY = 100;

/**
 * Handles inline cell editing, cell focus state, and undo/redo history.
 */
export const editReducer = (state: GridState, action: GridAction): GridState => {
  switch (action.type) {
    case 'START_EDIT': {
      const { rowId, field, value } = action.payload;
      return {
        ...state,
        editState: {
          rowId,
          field,
          value,
        },
      };
    }

    case 'END_EDIT': {
      return {
        ...state,
        editState: {
          rowId: null,
          field: null,
          value: null,
        },
      };
    }

    case 'RECORD_EDIT': {
      // Called after a successful edit to push onto the history stack.
      const entry = action.payload;
      const history = [entry, ...state.editHistory].slice(0, MAX_HISTORY);
      return {
        ...state,
        editHistory: history,
        editFuture: [], // Clear redo stack when a new edit is recorded.
      };
    }

    case 'UNDO_EDIT': {
      if (state.editHistory.length === 0) return state;
      const [last, ...rest] = state.editHistory;
      return {
        ...state,
        editHistory: rest,
        editFuture: [last, ...state.editFuture].slice(0, MAX_HISTORY),
      };
    }

    case 'REDO_EDIT': {
      if (state.editFuture.length === 0) return state;
      const [next, ...remainingFuture] = state.editFuture;
      return {
        ...state,
        editHistory: [next, ...state.editHistory].slice(0, MAX_HISTORY),
        editFuture: remainingFuture,
      };
    }

    case 'SET_FOCUS': {
      return {
        ...state,
        focusState: action.payload,
      };
    }

    default:
      return state;
  }
};
