import type { GridState, GridAction } from './types';

/**
 * Handles column layout actions: reordering, resizing, pinning, visibility, and
 * loading/applying/resetting saved layout presets.
 */
export const columnReducer = (state: GridState, action: GridAction): GridState => {
  switch (action.type) {
    case 'REORDER_COLUMNS': {
      const { fromIndex, toIndex } = action.payload;
      const newOrder = [...state.columnOrder];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);

      return {
        ...state,
        columnOrder: newOrder,
      };
    }

    case 'RESIZE_COLUMN': {
      const { field, width } = action.payload;
      return {
        ...state,
        columnWidths: {
          ...state.columnWidths,
          [field]: width,
        },
      };
    }

    case 'RESET_COLUMNS': {
      const columns = action.payload;
      const columnWidths: { [field: string]: number } = {};
      const columnOrder: string[] = [];

      columns.forEach((col) => {
        columnWidths[col.field] = col.width || 150;
        columnOrder.push(col.field);
      });

      const validFields = new Set(columnOrder);
      const pinnedColumnsLeft = state.pinnedColumnsLeft.filter((field) => validFields.has(field));
      const pinnedColumnsRight = state.pinnedColumnsRight.filter((field) => validFields.has(field));

      return {
        ...state,
        columns,
        columnOrder,
        columnWidths,
        pinnedColumnsLeft,
        pinnedColumnsRight,
      };
    }

    case 'PIN_COLUMN': {
      const { field, side } = action.payload;
      const column = state.columns.find((col) => col.field === field);
      if (column?.pinnable === false) {
        return state;
      }

      const pinnedColumnsLeft = state.pinnedColumnsLeft.filter((f) => f !== field);
      const pinnedColumnsRight = state.pinnedColumnsRight.filter((f) => f !== field);

      if (side === 'left') {
        return {
          ...state,
          pinnedColumnsLeft: [...pinnedColumnsLeft, field],
          pinnedColumnsRight,
        };
      }

      return {
        ...state,
        pinnedColumnsLeft,
        pinnedColumnsRight: [...pinnedColumnsRight, field],
      };
    }

    case 'UNPIN_COLUMN': {
      const field = action.payload;
      return {
        ...state,
        pinnedColumnsLeft: state.pinnedColumnsLeft.filter((f) => f !== field),
        pinnedColumnsRight: state.pinnedColumnsRight.filter((f) => f !== field),
      };
    }

    case 'TOGGLE_COLUMN_VISIBILITY': {
      const field = action.payload;
      const hiddenSet = new Set(state.hiddenColumns);

      if (hiddenSet.has(field)) {
        // Show the column
        hiddenSet.delete(field);
      } else {
        // Hide the column (but ensure at least one column remains visible)
        const visibleColumns = state.columnOrder.filter((f) => !hiddenSet.has(f));
        if (visibleColumns.length > 1) {
          hiddenSet.add(field);
        }
      }

      return {
        ...state,
        hiddenColumns: Array.from(hiddenSet),
      };
    }

    case 'SET_COLUMN_VISIBILITY': {
      const { field, visible } = action.payload;
      const hiddenSet = new Set(state.hiddenColumns);

      if (visible) {
        // Show the column
        hiddenSet.delete(field);
      } else {
        // Hide the column (but ensure at least one column remains visible)
        const visibleColumns = state.columnOrder.filter((f) => !hiddenSet.has(f));
        if (visibleColumns.length > 1) {
          hiddenSet.add(field);
        }
      }

      return {
        ...state,
        hiddenColumns: Array.from(hiddenSet),
      };
    }

    case 'RESET_COLUMN_LAYOUT': {
      // Reset to original column order and show all columns
      const columnOrder = state.columns.map((col) => col.field);
      const columnWidths: { [field: string]: number } = {};

      state.columns.forEach((col) => {
        columnWidths[col.field] = col.width || 150;
      });

      return {
        ...state,
        columnOrder,
        columnWidths,
        hiddenColumns: [],
        pinnedColumnsLeft: [],
        pinnedColumnsRight: [],
      };
    }

    case 'LOAD_LAYOUT_PRESET': {
      const layout = action.payload;

      return {
        ...state,
        columnOrder: layout.columnOrder,
        columnWidths: layout.columnWidths,
        pinnedColumnsLeft: layout.pinnedColumnsLeft,
        pinnedColumnsRight: layout.pinnedColumnsRight,
        hiddenColumns: layout.hiddenColumns,
        sortConfig: layout.sortConfig,
        filterConfig: layout.filterConfig,
        pageSize: layout.pageSize,
        groupBy: layout.groupBy || [],
        currentPage: 0, // Reset to first page when loading a preset
      };
    }

    case 'APPLY_LAYOUT': {
      const partialLayout = action.payload;

      return {
        ...state,
        ...(partialLayout.columnOrder && { columnOrder: partialLayout.columnOrder }),
        ...(partialLayout.columnWidths && { columnWidths: partialLayout.columnWidths }),
        ...(partialLayout.pinnedColumnsLeft && { pinnedColumnsLeft: partialLayout.pinnedColumnsLeft }),
        ...(partialLayout.pinnedColumnsRight && { pinnedColumnsRight: partialLayout.pinnedColumnsRight }),
        ...(partialLayout.hiddenColumns && { hiddenColumns: partialLayout.hiddenColumns }),
        ...(partialLayout.sortConfig && { sortConfig: partialLayout.sortConfig }),
        ...(partialLayout.filterConfig && { filterConfig: partialLayout.filterConfig }),
        ...(partialLayout.pageSize && { pageSize: partialLayout.pageSize }),
        ...(partialLayout.groupBy && { groupBy: partialLayout.groupBy }),
      };
    }

    default:
      return state;
  }
};
