import type { GridState, GridAction } from './types';

/**
 * Handles inline cell editing and cell focus state.
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
