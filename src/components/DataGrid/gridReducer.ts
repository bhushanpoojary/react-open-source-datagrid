import type { GridState, GridAction, Column } from './types';

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
      return {
        ...state,
        filterConfig: {
          ...state.filterConfig,
          [field]: value,
        },
        currentPage: 0, // Reset to first page on filter
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

      return {
        ...state,
        columns,
        columnOrder,
        columnWidths,
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

    default:
      return state;
  }
};
