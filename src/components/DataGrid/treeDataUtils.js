/**
 * Tree Data Utilities
 *
 * Utilities for managing hierarchical/tree data structures in the DataGrid.
 * Useful for org charts, file explorers, product categories, etc.
 */
/**
 * Type guard to check if a row is a tree node
 */
export const isTreeNode = (row) => {
    return 'isTreeNode' in row && row.isTreeNode === true;
};
/**
 * Build tree structure from flat data
 * Converts a flat array of rows with parent-child relationships into a hierarchical tree structure.
 *
 * @param rows - Flat array of rows
 * @param config - Tree configuration specifying id, parentId, and children fields
 * @returns Array of root-level tree nodes
 */
export const buildTreeFromFlat = (rows, config) => {
    const { idField = 'id', parentIdField = 'parentId', childrenField = 'children' } = config;
    // Create a map for quick lookup
    const nodeMap = new Map();
    const rootNodes = [];
    // First pass: create tree nodes
    rows.forEach(row => {
        const nodeId = row[idField];
        const treeNode = {
            ...row,
            isTreeNode: true,
            nodeId,
            parentId: row[parentIdField] || null,
            level: 0, // Will be calculated later
            hasChildren: false,
            isExpanded: true, // Default to expanded
            [childrenField]: [],
        };
        nodeMap.set(nodeId, treeNode);
    });
    // Second pass: build hierarchy and calculate levels
    nodeMap.forEach(node => {
        const parentId = node.parentId;
        if (parentId === null || parentId === undefined || !nodeMap.has(parentId)) {
            // Root node
            rootNodes.push(node);
        }
        else {
            // Child node
            const parent = nodeMap.get(parentId);
            const childrenArray = parent[childrenField];
            childrenArray.push(node);
            parent.hasChildren = true;
            node.level = parent.level + 1;
        }
    });
    // Recursively set levels for all descendants
    const setLevels = (nodes, level) => {
        nodes.forEach(node => {
            node.level = level;
            const children = node[childrenField];
            if (children && children.length > 0) {
                setLevels(children, level + 1);
            }
        });
    };
    setLevels(rootNodes, 0);
    return rootNodes;
};
/**
 * Flatten tree structure for rendering
 * Converts a hierarchical tree structure into a flat array respecting expand/collapse state.
 *
 * @param nodes - Array of tree nodes (can be root or any level)
 * @param expandedNodes - Map of node IDs to their expanded state
 * @param config - Tree configuration
 * @returns Flat array of visible tree nodes
 */
export const flattenTree = (nodes, expandedNodes, config) => {
    const { childrenField = 'children' } = config;
    const result = [];
    const traverse = (nodeArray) => {
        nodeArray.forEach(node => {
            // Add the node itself
            result.push(node);
            // If the node is expanded and has children, traverse them
            const nodeKey = String(node.nodeId);
            const isExpanded = expandedNodes[nodeKey] !== false; // Default to expanded
            const children = node[childrenField];
            if (isExpanded && children && children.length > 0) {
                traverse(children);
            }
        });
    };
    traverse(nodes);
    return result;
};
/**
 * Toggle expand/collapse state of a tree node
 *
 * @param nodeId - ID of the node to toggle
 * @param expandedNodes - Current expanded state map
 * @returns Updated expanded state map
 */
export const toggleNodeExpansion = (nodeId, expandedNodes) => {
    const nodeKey = String(nodeId);
    const currentState = expandedNodes[nodeKey] !== false; // Default expanded
    return {
        ...expandedNodes,
        [nodeKey]: !currentState,
    };
};
/**
 * Expand all nodes in the tree
 *
 * @param nodes - Array of tree nodes
 * @param config - Tree configuration
 * @returns Expanded state map with all nodes set to expanded
 */
export const expandAllNodes = (nodes, config) => {
    const { childrenField = 'children' } = config;
    const expanded = {};
    const traverse = (nodeArray) => {
        nodeArray.forEach(node => {
            expanded[String(node.nodeId)] = true;
            const children = node[childrenField];
            if (children && children.length > 0) {
                traverse(children);
            }
        });
    };
    traverse(nodes);
    return expanded;
};
/**
 * Collapse all nodes in the tree
 *
 * @param nodes - Array of tree nodes
 * @param config - Tree configuration
 * @returns Expanded state map with all nodes set to collapsed
 */
export const collapseAllNodes = (nodes, config) => {
    const { childrenField = 'children' } = config;
    const expanded = {};
    const traverse = (nodeArray) => {
        nodeArray.forEach(node => {
            expanded[String(node.nodeId)] = false;
            const children = node[childrenField];
            if (children && children.length > 0) {
                traverse(children);
            }
        });
    };
    traverse(nodes);
    return expanded;
};
/**
 * Get all descendant node IDs of a given node
 *
 * @param node - The tree node
 * @param config - Tree configuration
 * @returns Array of all descendant node IDs
 */
export const getDescendantIds = (node, config) => {
    const { childrenField = 'children' } = config;
    const descendants = [];
    const traverse = (currentNode) => {
        const children = currentNode[childrenField];
        if (children && children.length > 0) {
            children.forEach(child => {
                descendants.push(child.nodeId);
                traverse(child);
            });
        }
    };
    traverse(node);
    return descendants;
};
/**
 * Get the path from root to a specific node
 *
 * @param nodeId - ID of the target node
 * @param nodes - Array of root tree nodes
 * @param config - Tree configuration
 * @returns Array of node IDs representing the path, or null if not found
 */
export const getNodePath = (nodeId, nodes, config) => {
    const { childrenField = 'children' } = config;
    const search = (nodeArray, path) => {
        for (const node of nodeArray) {
            const currentPath = [...path, node.nodeId];
            if (node.nodeId === nodeId) {
                return currentPath;
            }
            const children = node[childrenField];
            if (children && children.length > 0) {
                const result = search(children, currentPath);
                if (result)
                    return result;
            }
        }
        return null;
    };
    return search(nodes, []);
};
/**
 * Get the maximum depth of the tree
 *
 * @param nodes - Array of tree nodes
 * @param config - Tree configuration
 * @returns Maximum depth (levels) of the tree
 */
export const getTreeDepth = (nodes, config) => {
    const { childrenField = 'children' } = config;
    let maxDepth = 0;
    const traverse = (nodeArray, depth) => {
        nodeArray.forEach(node => {
            maxDepth = Math.max(maxDepth, depth);
            const children = node[childrenField];
            if (children && children.length > 0) {
                traverse(children, depth + 1);
            }
        });
    };
    traverse(nodes, 1);
    return maxDepth;
};
/**
 * Count total number of nodes in the tree
 *
 * @param nodes - Array of tree nodes
 * @param config - Tree configuration
 * @returns Total count of nodes
 */
export const countTreeNodes = (nodes, config) => {
    const { childrenField = 'children' } = config;
    let count = 0;
    const traverse = (nodeArray) => {
        nodeArray.forEach(node => {
            count++;
            const children = node[childrenField];
            if (children && children.length > 0) {
                traverse(children);
            }
        });
    };
    traverse(nodes);
    return count;
};
/**
 * Filter tree nodes by a predicate function
 * Returns a new tree structure containing only matching nodes and their ancestors
 *
 * @param nodes - Array of tree nodes
 * @param predicate - Function to test each node
 * @param config - Tree configuration
 * @returns Filtered tree structure
 */
export const filterTree = (nodes, predicate, config) => {
    const { childrenField = 'children' } = config;
    const filter = (nodeArray) => {
        const result = [];
        nodeArray.forEach(node => {
            const children = node[childrenField];
            const filteredChildren = children && children.length > 0 ? filter(children) : [];
            // Include node if it matches or has matching children
            if (predicate(node) || filteredChildren.length > 0) {
                result.push({
                    ...node,
                    [childrenField]: filteredChildren,
                    hasChildren: filteredChildren.length > 0,
                });
            }
        });
        return result;
    };
    return filter(nodes);
};
