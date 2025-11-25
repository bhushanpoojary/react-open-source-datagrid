import type { GridState, GridAction, Column } from './types';

// Re-export types for convenience
export type { GridState, GridAction };

// Initial state factory
export const createInitialState = (columns: Column[], pageSize: number = 10): GridState => {
  const columnWidths: { [field: string]: number } = {};
  const columnOrder: string[] = [];
  
  columns.forEach(col => {
    columnWidths[col.field] = col.width || 150;
    columnOrder.push(col.field);
  });

  return {
    columns,
    sortConfig: { field: '', direction: null },
    filterConfig: {},
    currentPage: 0,
    pageSize,
    selection: {
      selectedRows: new Set(),
      lastSelectedIndex: null,
    },
    editState: {
      rowId: null,
      field: null,
      value: null,
    },
    focusState: null,
    columnOrder,
    columnWidths,
    groupBy: [],
    expandedGroups: {},
    pinnedColumnsLeft: [],
    pinnedColumnsRight: [],
    hiddenColumns: [],
    expandedNodes: {},
    dragState: {
      isDragging: false,
      draggedRowId: null,
      draggedRowIndex: null,
      dropTargetIndex: null,
      dropPosition: null,
    },
    pinnedRowsTop: [],
    pinnedRowsBottom: [],
  };
};

// Reducer function for managing grid state
export const gridReducer = (state: GridState, action: GridAction): GridState => {
  switch (action.type) {
    case 'SET_SORT': {
      const { field, direction } = action.payload;
      return {
        ...state,
        sortConfig: { field, direction },
        currentPage: 0, // Reset to first page on sort
      };
    }

    case 'SET_FILTER': {
      const { field, value } = action.payload;
      const newFilterConfig = { ...state.filterConfig };
      
      if (value === null || value === undefined) {
        delete newFilterConfig[field];
      } else {
        newFilterConfig[field] = value;
      }
      
      return {
        ...state,
        filterConfig: newFilterConfig,
        currentPage: 0, // Reset to first page on filter
      };
    }

    case 'CLEAR_FILTERS': {
      return {
        ...state,
        filterConfig: {},
        currentPage: 0,
      };
    }

    case 'SET_PAGE': {
      return {
        ...state,
        currentPage: action.payload,
      };
    }

    case 'SET_PAGE_SIZE': {
      return {
        ...state,
        pageSize: action.payload,
        currentPage: 0, // Reset to first page on page size change
      };
    }

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
      
      rowIds.forEach(id => newSelectedRows.add(id));

      return {
        ...state,
        selection: {
          ...state.selection,
          selectedRows: newSelectedRows,
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
      
      columns.forEach(col => {
        columnWidths[col.field] = col.width || 150;
        columnOrder.push(col.field);
      });

      const validFields = new Set(columnOrder);
      const pinnedColumnsLeft = state.pinnedColumnsLeft.filter(field => validFields.has(field));
      const pinnedColumnsRight = state.pinnedColumnsRight.filter(field => validFields.has(field));

      return {
        ...state,
        columns,
        columnOrder,
        columnWidths,
        pinnedColumnsLeft,
        pinnedColumnsRight,
      };
    }

    case 'ADD_GROUP': {
      const field = action.payload;
      if (state.groupBy.includes(field)) {
        return state;
      }

      return {
        ...state,
        groupBy: [...state.groupBy, field],
        currentPage: 0,
      };
    }

    case 'REMOVE_GROUP': {
      const field = action.payload;
      return {
        ...state,
        groupBy: state.groupBy.filter(f => f !== field),
        currentPage: 0,
      };
    }

    case 'REORDER_GROUPS': {
      const { fromIndex, toIndex } = action.payload;
      const newGroupBy = [...state.groupBy];
      const [movedItem] = newGroupBy.splice(fromIndex, 1);
      newGroupBy.splice(toIndex, 0, movedItem);

      return {
        ...state,
        groupBy: newGroupBy,
      };
    }

    case 'TOGGLE_GROUP': {
      const groupKey = action.payload;
      return {
        ...state,
        expandedGroups: {
          ...state.expandedGroups,
          [groupKey]: !state.expandedGroups[groupKey],
        },
      };
    }

    case 'CLEAR_GROUPS': {
      return {
        ...state,
        groupBy: [],
        expandedGroups: {},
        currentPage: 0,
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
        const visibleColumns = state.columnOrder.filter(f => !hiddenSet.has(f));
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
      const columnOrder = state.columns.map(col => col.field);
      const columnWidths: { [field: string]: number } = {};
      
      state.columns.forEach(col => {
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

    case 'TOGGLE_TREE_NODE': {
      const nodeId = action.payload;
      const nodeKey = String(nodeId);
      const currentState = state.expandedNodes[nodeKey] !== false; // Default expanded
      
      return {
        ...state,
        expandedNodes: {
          ...state.expandedNodes,
          [nodeKey]: !currentState,
        },
      };
    }

    case 'EXPAND_ALL_NODES': {
      // This will be handled by the DataGrid component which has access to the tree structure
      return state;
    }

    case 'COLLAPSE_ALL_NODES': {
      // This will be handled by the DataGrid component which has access to the tree structure
      return state;
    }

    case 'SET_EXPANDED_NODES': {
      return {
        ...state,
        expandedNodes: action.payload,
      };
    }

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
      const pinnedRowsBottom = state.pinnedRowsBottom.filter(id => id !== rowId);
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
      const pinnedRowsTop = state.pinnedRowsTop.filter(id => id !== rowId);
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
        pinnedRowsTop: state.pinnedRowsTop.filter(id => id !== rowId),
        pinnedRowsBottom: state.pinnedRowsBottom.filter(id => id !== rowId),
      };
    }

    default:
      return state;
  }
};
