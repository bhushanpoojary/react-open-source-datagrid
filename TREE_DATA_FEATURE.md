# Tree Data / Hierarchical Rows Feature

## Overview

The Tree Data feature allows you to display hierarchical data structures in the DataGrid with expand/collapse functionality, visual indentation, and tree navigation controls. This is perfect for representing organizational charts, file systems, product categories, comment threads, and any data with parent-child relationships.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Data Structure](#data-structure)
- [API Reference](#api-reference)
- [Utility Functions](#utility-functions)
- [Examples](#examples)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)

## Quick Start

### Basic Tree Data Example

```tsx
import { DataGrid, TreeConfig } from 'react-open-source-grid';

// Your flat data with parent-child relationships
const employees = [
  { id: 1, name: 'Sarah Johnson', position: 'CEO', parentId: null },
  { id: 2, name: 'Michael Chen', position: 'CTO', parentId: 1 },
  { id: 3, name: 'Emily Davis', position: 'CFO', parentId: 1 },
  { id: 4, name: 'Robert Wilson', position: 'VP Engineering', parentId: 2 },
  { id: 5, name: 'David Brown', position: 'Engineering Manager', parentId: 4 },
];

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'position', headerName: 'Position', width: 180 },
];

const treeConfig: TreeConfig = {
  enabled: true,
  idField: 'id',
  parentIdField: 'parentId',
};

function App() {
  return (
    <DataGrid
      columns={columns}
      rows={employees}
      treeConfig={treeConfig}
    />
  );
}
```

## Configuration

### TreeConfig Interface

```typescript
interface TreeConfig {
  enabled: boolean;                    // Enable tree mode
  idField?: string;                    // Field name for node ID (default: 'id')
  parentIdField?: string;              // Field name for parent ID (default: 'parentId')
  childrenField?: string;              // Field name for children array (default: 'children')
  indentSize?: number;                 // Pixels to indent per level (default: 24)
  showExpandIcon?: boolean;            // Show expand/collapse icons (default: true)
  showConnectors?: boolean;            // Show tree connector lines (default: false)
  lazyLoad?: boolean;                  // Enable lazy loading (default: false)
  onNodeExpand?: (node: TreeNode) => void | Promise<TreeNode[]>;
  onNodeCollapse?: (node: TreeNode) => void;
}
```

### Configuration Options Explained

#### `enabled` (required)
Enables tree data mode. When `true`, the grid will process rows as hierarchical data.

```tsx
treeConfig={{ enabled: true }}
```

#### `idField` (optional, default: 'id')
Specifies which field contains the unique identifier for each node.

```tsx
treeConfig={{ 
  enabled: true,
  idField: 'employeeId'  // Use 'employeeId' instead of 'id'
}}
```

#### `parentIdField` (optional, default: 'parentId')
Specifies which field contains the parent node's ID.

```tsx
treeConfig={{ 
  enabled: true,
  parentIdField: 'managerId'  // Use 'managerId' to indicate parent
}}
```

#### `childrenField` (optional, default: 'children')
Specifies the field name where child nodes will be stored in the tree structure.

```tsx
treeConfig={{ 
  enabled: true,
  childrenField: 'subordinates'  // Store children in 'subordinates' field
}}
```

#### `indentSize` (optional, default: 24)
Number of pixels to indent each level of the tree hierarchy.

```tsx
treeConfig={{ 
  enabled: true,
  indentSize: 32  // Larger indentation for more visual separation
}}
```

#### `showExpandIcon` (optional, default: true)
Controls whether expand/collapse icons are displayed.

```tsx
treeConfig={{ 
  enabled: true,
  showExpandIcon: false  // Hide expand/collapse icons
}}
```

#### `onNodeExpand` (optional)
Callback function triggered when a node is expanded. Can be used for lazy loading.

```tsx
const handleNodeExpand = async (node: TreeNode) => {
  console.log('Expanding node:', node.name);
  // Load children if needed
  if (node.hasChildren && !node.children?.length) {
    const children = await fetchChildren(node.id);
    return children;
  }
};

treeConfig={{ 
  enabled: true,
  onNodeExpand: handleNodeExpand
}}
```

#### `onNodeCollapse` (optional)
Callback function triggered when a node is collapsed.

```tsx
const handleNodeCollapse = (node: TreeNode) => {
  console.log('Collapsing node:', node.name);
};

treeConfig={{ 
  enabled: true,
  onNodeCollapse: handleNodeCollapse
}}
```

## Data Structure

### Flat Data Format (Recommended)

The easiest way to provide tree data is as a flat array with parent-child relationships:

```typescript
const data = [
  { id: 1, name: 'Parent', parentId: null },
  { id: 2, name: 'Child 1', parentId: 1 },
  { id: 3, name: 'Child 2', parentId: 1 },
  { id: 4, name: 'Grandchild', parentId: 2 },
];
```

The DataGrid will automatically build the tree structure using `buildTreeFromFlat()`.

### TreeNode Interface

When processed, each row becomes a TreeNode with additional properties:

```typescript
interface TreeNode extends Row {
  isTreeNode: true;
  nodeId: string | number;
  parentId: string | number | null;
  level: number;                    // 0 for root, 1 for children, etc.
  hasChildren: boolean;
  isExpanded: boolean;
  children?: TreeNode[];
}
```

## API Reference

### Grid State

Tree-related state is stored in the grid's reducer:

```typescript
interface GridState {
  // ... other state
  expandedNodes: ExpandedNodes;  // Tracks which nodes are expanded
}

interface ExpandedNodes {
  [nodeKey: string]: boolean;
}
```

### Grid Actions

Control tree expansion programmatically:

```typescript
// Toggle a specific node
dispatch({ type: 'TOGGLE_TREE_NODE', payload: nodeId });

// Expand all nodes
dispatch({ type: 'EXPAND_ALL_NODES' });

// Collapse all nodes
dispatch({ type: 'COLLAPSE_ALL_NODES' });

// Set expanded state for multiple nodes
dispatch({ 
  type: 'SET_EXPANDED_NODES', 
  payload: { '1': true, '2': false, '3': true } 
});
```

## Utility Functions

The DataGrid exports several utility functions for working with tree data:

### `buildTreeFromFlat()`

Converts flat data into a hierarchical tree structure.

```typescript
import { buildTreeFromFlat } from 'react-open-source-grid';

const treeNodes = buildTreeFromFlat(flatData, {
  idField: 'id',
  parentIdField: 'parentId',
  childrenField: 'children'
});
```

### `flattenTree()`

Flattens a tree structure into an array respecting expand/collapse state.

```typescript
import { flattenTree } from 'react-open-source-grid';

const visibleNodes = flattenTree(treeNodes, expandedNodes, treeConfig);
```

### `toggleNodeExpansion()`

Toggles the expanded state of a single node.

```typescript
import { toggleNodeExpansion } from 'react-open-source-grid';

const newExpandedNodes = toggleNodeExpansion(nodeId, currentExpandedNodes);
```

### `expandAllNodes()`

Creates an expanded state map with all nodes expanded.

```typescript
import { expandAllNodes } from 'react-open-source-grid';

const allExpanded = expandAllNodes(treeNodes, treeConfig);
dispatch({ type: 'SET_EXPANDED_NODES', payload: allExpanded });
```

### `collapseAllNodes()`

Creates an expanded state map with all nodes collapsed.

```typescript
import { collapseAllNodes } from 'react-open-source-grid';

const allCollapsed = collapseAllNodes(treeNodes, treeConfig);
dispatch({ type: 'SET_EXPANDED_NODES', payload: allCollapsed });
```

### `getDescendantIds()`

Gets all descendant node IDs of a given node.

```typescript
import { getDescendantIds } from 'react-open-source-grid';

const descendants = getDescendantIds(node, treeConfig);
// Returns: [childId1, childId2, grandchildId1, ...]
```

### `getNodePath()`

Gets the path from root to a specific node.

```typescript
import { getNodePath } from 'react-open-source-grid';

const path = getNodePath(targetNodeId, treeNodes, treeConfig);
// Returns: [rootId, parentId, targetNodeId] or null if not found
```

### `getTreeDepth()`

Gets the maximum depth of the tree.

```typescript
import { getTreeDepth } from 'react-open-source-grid';

const maxDepth = getTreeDepth(treeNodes, treeConfig);
// Returns: number (e.g., 3 for a tree with 3 levels)
```

### `countTreeNodes()`

Counts total number of nodes in the tree.

```typescript
import { countTreeNodes } from 'react-open-source-grid';

const totalNodes = countTreeNodes(treeNodes, treeConfig);
```

### `filterTree()`

Filters tree nodes by a predicate, keeping matching nodes and their ancestors.

```typescript
import { filterTree } from 'react-open-source-grid';

const filteredTree = filterTree(
  treeNodes,
  (node) => node.name.toLowerCase().includes('engineer'),
  treeConfig
);
```

### `isTreeNode()`

Type guard to check if a row is a tree node.

```typescript
import { isTreeNode } from 'react-open-source-grid';

if (isTreeNode(row)) {
  console.log('Node level:', row.level);
  console.log('Has children:', row.hasChildren);
}
```

## Examples

### Example 1: Organizational Chart

```tsx
const orgChartData = [
  { id: 1, name: 'Sarah Johnson', position: 'CEO', parentId: null },
  { id: 2, name: 'Michael Chen', position: 'CTO', parentId: 1 },
  { id: 3, name: 'Emily Davis', position: 'CFO', parentId: 1 },
  { id: 4, name: 'Robert Wilson', position: 'VP Engineering', parentId: 2 },
  { id: 5, name: 'David Brown', position: 'Engineering Manager', parentId: 4 },
];

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'position', headerName: 'Position', width: 180 },
];

<DataGrid
  columns={columns}
  rows={orgChartData}
  treeConfig={{ enabled: true }}
/>
```

### Example 2: File Explorer

```tsx
const fileData = [
  { id: 'root', name: 'My Documents', type: 'folder', size: null, parentId: null },
  { id: 'proj', name: 'Projects', type: 'folder', size: null, parentId: 'root' },
  { id: 'file1', name: 'design.fig', type: 'file', size: '2.5 MB', parentId: 'proj' },
  { id: 'file2', name: 'notes.txt', type: 'file', size: '12 KB', parentId: 'proj' },
];

const columns = [
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 300,
    renderCell: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{row.type === 'folder' ? '📁' : '📄'}</span>
        <span>{row.name}</span>
      </div>
    )
  },
  { field: 'type', headerName: 'Type', width: 100 },
  { field: 'size', headerName: 'Size', width: 120 },
];

<DataGrid
  columns={columns}
  rows={fileData}
  treeConfig={{ enabled: true, indentSize: 32 }}
/>
```

### Example 3: Product Categories with Metrics

```tsx
const categoryData = [
  { id: 'elec', name: 'Electronics', count: 245, revenue: 125000, parentId: null },
  { id: 'comp', name: 'Computers', count: 89, revenue: 65000, parentId: 'elec' },
  { id: 'laptop', name: 'Laptops', count: 45, revenue: 42000, parentId: 'comp' },
  { id: 'desktop', name: 'Desktops', count: 28, revenue: 18000, parentId: 'comp' },
];

const columns = [
  { field: 'name', headerName: 'Category', width: 250 },
  { field: 'count', headerName: 'Products', width: 120 },
  { 
    field: 'revenue', 
    headerName: 'Revenue', 
    width: 150,
    renderCell: (row) => (
      <span style={{ fontWeight: 500, color: '#16a34a' }}>
        ${row.revenue?.toLocaleString()}
      </span>
    )
  },
];

<DataGrid
  columns={columns}
  rows={categoryData}
  treeConfig={{ enabled: true }}
/>
```

## Advanced Usage

### Lazy Loading Children

```tsx
const [data, setData] = useState(initialData);

const handleNodeExpand = async (node: TreeNode) => {
  if (node.hasChildren && !node.children?.length) {
    // Fetch children from API
    const children = await fetchChildrenFromAPI(node.id);
    
    // Update data with new children
    setData(prevData => [...prevData, ...children]);
  }
};

<DataGrid
  columns={columns}
  rows={data}
  treeConfig={{
    enabled: true,
    lazyLoad: true,
    onNodeExpand: handleNodeExpand
  }}
/>
```

### Expand/Collapse All Buttons

```tsx
import { useReducer } from 'react';
import { expandAllNodes, collapseAllNodes, buildTreeFromFlat } from 'react-open-source-grid';

function TreeGridWithControls() {
  const [state, dispatch] = useReducer(gridReducer, initialState);
  
  const treeNodes = buildTreeFromFlat(data, treeConfig);
  
  const handleExpandAll = () => {
    const expanded = expandAllNodes(treeNodes, treeConfig);
    dispatch({ type: 'SET_EXPANDED_NODES', payload: expanded });
  };
  
  const handleCollapseAll = () => {
    const collapsed = collapseAllNodes(treeNodes, treeConfig);
    dispatch({ type: 'SET_EXPANDED_NODES', payload: collapsed });
  };
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={handleExpandAll}>Expand All</button>
        <button onClick={handleCollapseAll}>Collapse All</button>
      </div>
      <DataGrid
        columns={columns}
        rows={data}
        treeConfig={treeConfig}
      />
    </div>
  );
}
```

### Custom Expand Icons

You can customize the expand/collapse icons by modifying the TreeRow component or using CSS:

```css
.tree-toggle-button svg {
  color: #3b82f6;  /* Custom color */
  width: 18px;
  height: 18px;
}

.tree-toggle-button:hover svg {
  color: #1d4ed8;
}
```

### Filtering Tree Data

```tsx
import { filterTree } from 'react-open-source-grid';

const [searchTerm, setSearchTerm] = useState('');

const filteredData = useMemo(() => {
  if (!searchTerm) return data;
  
  const treeNodes = buildTreeFromFlat(data, treeConfig);
  const filtered = filterTree(
    treeNodes,
    (node) => node.name.toLowerCase().includes(searchTerm.toLowerCase()),
    treeConfig
  );
  
  // Convert back to flat array
  return flattenToArray(filtered);
}, [data, searchTerm]);

<DataGrid
  columns={columns}
  rows={filteredData}
  treeConfig={treeConfig}
/>
```

## Best Practices

### 1. Use Flat Data Format
Always provide data as a flat array with parent-child relationships. The DataGrid handles tree building automatically.

```tsx
// ✅ Good - Flat data
const data = [
  { id: 1, name: 'Parent', parentId: null },
  { id: 2, name: 'Child', parentId: 1 },
];

// ❌ Avoid - Pre-built tree (not needed)
const data = [
  { 
    id: 1, 
    name: 'Parent', 
    children: [
      { id: 2, name: 'Child' }
    ] 
  },
];
```

### 2. Ensure Unique IDs
Every node must have a unique identifier.

```tsx
// ✅ Good
const data = [
  { id: 1, name: 'Node 1', parentId: null },
  { id: 2, name: 'Node 2', parentId: 1 },
];

// ❌ Bad - Duplicate IDs
const data = [
  { id: 1, name: 'Node 1', parentId: null },
  { id: 1, name: 'Node 2', parentId: null },  // Same ID!
];
```

### 3. Handle Null Parents for Root Nodes
Root nodes (nodes without parents) should have `parentId: null` or `parentId: undefined`.

```tsx
const data = [
  { id: 1, name: 'Root', parentId: null },  // ✅ Root node
  { id: 2, name: 'Child', parentId: 1 },
];
```

### 4. Prevent Circular References
Ensure no node references itself or creates a circular dependency.

```tsx
// ❌ Bad - Circular reference
const data = [
  { id: 1, name: 'Node 1', parentId: 2 },
  { id: 2, name: 'Node 2', parentId: 1 },  // Points back to Node 1!
];
```

### 5. Optimize Large Trees
For large datasets, consider:
- Using pagination
- Implementing lazy loading
- Limiting initial depth
- Virtualizing with `virtualScrollConfig`

```tsx
<DataGrid
  columns={columns}
  rows={largeDataset}
  treeConfig={{ enabled: true, lazyLoad: true }}
  virtualScrollConfig={{ enabled: true, rowHeight: 40 }}
  pageSize={50}
/>
```

### 6. Combine with Other Features
Tree data works seamlessly with other DataGrid features:

```tsx
<DataGrid
  columns={columns}
  rows={data}
  treeConfig={{ enabled: true }}
  virtualScrollConfig={{ enabled: true }}  // ✅ Virtual scrolling
  footerConfig={{ show: true }}            // ✅ Footers
  persistenceConfig={{ enabled: true }}     // ✅ Layout persistence
  onRowClick={(row) => console.log(row)}   // ✅ Row click events
  onCellEdit={(idx, field, val) => {}}     // ✅ Cell editing
/>
```

### 7. Performance Tips
- Memoize tree configuration
- Use callbacks to handle expansion events
- Avoid rebuilding tree on every render

```tsx
const treeConfig = useMemo(() => ({
  enabled: true,
  idField: 'id',
  parentIdField: 'parentId',
}), []);  // Memoize config

const handleExpand = useCallback((node) => {
  console.log('Expanded:', node);
}, []);  // Memoize callback

<DataGrid
  columns={columns}
  rows={data}
  treeConfig={{ ...treeConfig, onNodeExpand: handleExpand }}
/>
```

## Integration with Grouping

**Note**: Tree data and grouping features are mutually exclusive. When `treeConfig.enabled` is `true`, grouping is automatically disabled. This is by design as both features provide hierarchical views of data in different ways.

```tsx
// Tree mode takes precedence
<DataGrid
  columns={columns}
  rows={data}
  treeConfig={{ enabled: true }}  // Tree mode active
  // groupBy prop is ignored when tree mode is enabled
/>
```

## Troubleshooting

### Nodes Not Showing as Hierarchical
- Verify `treeConfig.enabled` is `true`
- Check that `parentId` values correctly reference parent node IDs
- Ensure root nodes have `parentId: null`

### Expand Icons Not Appearing
- Verify `treeConfig.showExpandIcon` is not `false`
- Check that nodes have children (only nodes with children show icons)
- Ensure data is correctly structured with parent-child relationships

### Performance Issues with Large Trees
- Enable virtual scrolling: `virtualScrollConfig={{ enabled: true }}`
- Implement lazy loading: `treeConfig={{ lazyLoad: true }}`
- Use pagination: `pageSize={50}`
- Limit initial tree depth

## See Also

- [DataGrid Documentation](./DATAGRID_README.md)
- [Virtual Scrolling](./VIRTUAL_SCROLLING.md)
- [Grouping Feature](./COLUMN_FILTERS_FEATURE.md)
- [TreeDataDemo Component](../src/components/TreeDataDemo.tsx)
