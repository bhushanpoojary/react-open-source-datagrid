import type { GridState, GridAction } from './types';

/**
 * Handles tree-data node expansion.
 *
 * `EXPAND_ALL_NODES` / `COLLAPSE_ALL_NODES` are deliberate no-ops here: they
 * require access to the built tree structure, which lives in the DataGrid
 * component, so they are handled there.
 */
export const treeReducer = (state: GridState, action: GridAction): GridState => {
  switch (action.type) {
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

    default:
      return state;
  }
};
