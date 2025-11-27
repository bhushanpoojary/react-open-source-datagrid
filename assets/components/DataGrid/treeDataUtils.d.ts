import type { Row, TreeNode, TreeConfig, ExpandedNodes } from './types';
/**
 * Tree Data Utilities
 *
 * Utilities for managing hierarchical/tree data structures in the DataGrid.
 * Useful for org charts, file explorers, product categories, etc.
 */
/**
 * Type guard to check if a row is a tree node
 */
export declare const isTreeNode: (row: Row | TreeNode) => row is TreeNode;
/**
 * Build tree structure from flat data
 * Converts a flat array of rows with parent-child relationships into a hierarchical tree structure.
 *
 * @param rows - Flat array of rows
 * @param config - Tree configuration specifying id, parentId, and children fields
 * @returns Array of root-level tree nodes
 */
export declare const buildTreeFromFlat: (rows: Row[], config: TreeConfig) => TreeNode[];
/**
 * Flatten tree structure for rendering
 * Converts a hierarchical tree structure into a flat array respecting expand/collapse state.
 *
 * @param nodes - Array of tree nodes (can be root or any level)
 * @param expandedNodes - Map of node IDs to their expanded state
 * @param config - Tree configuration
 * @returns Flat array of visible tree nodes
 */
export declare const flattenTree: (nodes: TreeNode[], expandedNodes: ExpandedNodes, config: TreeConfig) => TreeNode[];
/**
 * Toggle expand/collapse state of a tree node
 *
 * @param nodeId - ID of the node to toggle
 * @param expandedNodes - Current expanded state map
 * @returns Updated expanded state map
 */
export declare const toggleNodeExpansion: (nodeId: string | number, expandedNodes: ExpandedNodes) => ExpandedNodes;
/**
 * Expand all nodes in the tree
 *
 * @param nodes - Array of tree nodes
 * @param config - Tree configuration
 * @returns Expanded state map with all nodes set to expanded
 */
export declare const expandAllNodes: (nodes: TreeNode[], config: TreeConfig) => ExpandedNodes;
/**
 * Collapse all nodes in the tree
 *
 * @param nodes - Array of tree nodes
 * @param config - Tree configuration
 * @returns Expanded state map with all nodes set to collapsed
 */
export declare const collapseAllNodes: (nodes: TreeNode[], config: TreeConfig) => ExpandedNodes;
/**
 * Get all descendant node IDs of a given node
 *
 * @param node - The tree node
 * @param config - Tree configuration
 * @returns Array of all descendant node IDs
 */
export declare const getDescendantIds: (node: TreeNode, config: TreeConfig) => (string | number)[];
/**
 * Get the path from root to a specific node
 *
 * @param nodeId - ID of the target node
 * @param nodes - Array of root tree nodes
 * @param config - Tree configuration
 * @returns Array of node IDs representing the path, or null if not found
 */
export declare const getNodePath: (nodeId: string | number, nodes: TreeNode[], config: TreeConfig) => (string | number)[] | null;
/**
 * Get the maximum depth of the tree
 *
 * @param nodes - Array of tree nodes
 * @param config - Tree configuration
 * @returns Maximum depth (levels) of the tree
 */
export declare const getTreeDepth: (nodes: TreeNode[], config: TreeConfig) => number;
/**
 * Count total number of nodes in the tree
 *
 * @param nodes - Array of tree nodes
 * @param config - Tree configuration
 * @returns Total count of nodes
 */
export declare const countTreeNodes: (nodes: TreeNode[], config: TreeConfig) => number;
/**
 * Filter tree nodes by a predicate function
 * Returns a new tree structure containing only matching nodes and their ancestors
 *
 * @param nodes - Array of tree nodes
 * @param predicate - Function to test each node
 * @param config - Tree configuration
 * @returns Filtered tree structure
 */
export declare const filterTree: (nodes: TreeNode[], predicate: (node: TreeNode) => boolean, config: TreeConfig) => TreeNode[];
