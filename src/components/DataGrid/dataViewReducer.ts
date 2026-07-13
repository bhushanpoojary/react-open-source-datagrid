import type { GridState, GridAction } from './types';

/**
 * Handles view-shaping actions: sorting, filtering, pagination, and grouping.
 * These are grouped together because they all reset `currentPage` and together
 * define which rows are shown and in what order.
 */
export const dataViewReducer = (state: GridState, action: GridAction): GridState => {
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
        groupBy: state.groupBy.filter((f) => f !== field),
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
