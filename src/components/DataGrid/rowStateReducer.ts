import type { GridState, GridAction } from './types';

/**
 * Handles row-level state: drag-and-drop reordering, row pinning (top/bottom),
 * master-detail expansion, and external row-data updates.
 */
export const rowStateReducer = (state: GridState, action: GridAction): GridState => {
  switch (action.type) {
    case 'SET_DRAG_STATE': {
      return {
        ...state,
        dragState: action.payload,
      };
    }

    case 'START_DRAG': {
      return {
        ...state,
        dragState: {
          ...state.dragState,
          isDragging: true,
          draggedRowId: action.payload.rowId,
          draggedRowIndex: action.payload.rowIndex,
        },
      };
    }

    case 'END_DRAG': {
      return {
        ...state,
        dragState: {
          isDragging: false,
          draggedRowId: null,
          draggedRowIndex: null,
          dropTargetIndex: null,
          dropPosition: null,
        },
      };
    }

    case 'PIN_ROW_TOP': {
      const rowId = action.payload;
      // Remove from bottom if already pinned there
      const pinnedRowsBottom = state.pinnedRowsBottom.filter((id) => id !== rowId);
      // Add to top if not already there
      const pinnedRowsTop = state.pinnedRowsTop.includes(rowId)
        ? state.pinnedRowsTop
        : [...state.pinnedRowsTop, rowId];

      return {
        ...state,
        pinnedRowsTop,
        pinnedRowsBottom,
      };
    }

    case 'PIN_ROW_BOTTOM': {
      const rowId = action.payload;
      // Remove from top if already pinned there
      const pinnedRowsTop = state.pinnedRowsTop.filter((id) => id !== rowId);
      // Add to bottom if not already there
      const pinnedRowsBottom = state.pinnedRowsBottom.includes(rowId)
        ? state.pinnedRowsBottom
        : [...state.pinnedRowsBottom, rowId];

      return {
        ...state,
        pinnedRowsTop,
        pinnedRowsBottom,
      };
    }

    case 'UNPIN_ROW': {
      const rowId = action.payload;
      return {
        ...state,
        pinnedRowsTop: state.pinnedRowsTop.filter((id) => id !== rowId),
        pinnedRowsBottom: state.pinnedRowsBottom.filter((id) => id !== rowId),
      };
    }

    case 'TOGGLE_MASTER_ROW': {
      const rowId = action.payload;
      const currentExpanded = state.detailRowState.expandedMasterRows[String(rowId)] || false;
      return {
        ...state,
        detailRowState: {
          ...state.detailRowState,
          expandedMasterRows: {
            ...state.detailRowState.expandedMasterRows,
            [String(rowId)]: !currentExpanded,
          },
        },
      };
    }

    case 'EXPAND_MASTER_ROW': {
      const rowId = action.payload;
      return {
        ...state,
        detailRowState: {
          ...state.detailRowState,
          expandedMasterRows: {
            ...state.detailRowState.expandedMasterRows,
            [String(rowId)]: true,
          },
        },
      };
    }

    case 'COLLAPSE_MASTER_ROW': {
      const rowId = action.payload;
      return {
        ...state,
        detailRowState: {
          ...state.detailRowState,
          expandedMasterRows: {
            ...state.detailRowState.expandedMasterRows,
            [String(rowId)]: false,
          },
        },
      };
    }

    case 'SET_EXPANDED_MASTER_ROWS': {
      return {
        ...state,
        detailRowState: {
          ...state.detailRowState,
          expandedMasterRows: action.payload,
        },
      };
    }

    case 'SET_ROW_DATA': {
      // Update row data - typically called from applyTransaction
      // Note: rows are managed externally, this just triggers a re-render
      return { ...state };
    }

    default:
      return state;
  }
};
