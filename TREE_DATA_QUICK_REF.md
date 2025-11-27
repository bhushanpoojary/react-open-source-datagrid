# Tree Data / Hierarchical Rows - Quick Reference

## Basic Setup

```tsx
import { DataGrid } from 'react-open-source-grid';

const data = [
  { id: 1, name: 'Parent', parentId: null },
  { id: 2, name: 'Child', parentId: 1 },
];

const treeConfig = {
  enabled: true,
  idField: 'id',
  parentIdField: 'parentId',
};

<DataGrid
  columns={columns}
  rows={data}
  treeConfig={treeConfig}
/>
```

## TreeConfig Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | - | **Required.** Enable tree mode |
| `idField` | `string` | `'id'` | Field containing node ID |
| `parentIdField` | `string` | `'parentId'` | Field containing parent ID |
| `childrenField` | `string` | `'children'` | Field for children array |
| `indentSize` | `number` | `24` | Pixels to indent per level |
| `showExpandIcon` | `boolean` | `true` | Show expand/collapse icons |
| `showConnectors` | `boolean` | `false` | Show tree connector lines |
| `lazyLoad` | `boolean` | `false` | Enable lazy loading |
| `onNodeExpand` | `function` | - | Callback when node expands |
| `onNodeCollapse` | `function` | - | Callback when node collapses |

## Common Use Cases

### Organizational Chart
```tsx
const employees = [
  { id: 1, name: 'CEO', parentId: null },
  { id: 2, name: 'CTO', parentId: 1 },
  { id: 3, name: 'Engineer', parentId: 2 },
];

<DataGrid
  columns={[
    { field: 'name', headerName: 'Name' },
    { field: 'position', headerName: 'Position' },
  ]}
  rows={employees}
  treeConfig={{ enabled: true }}
/>
```

### File Explorer
```tsx
const files = [
  { id: 'root', name: 'Documents', type: 'folder', parentId: null },
  { id: 'proj', name: 'Projects', type: 'folder', parentId: 'root' },
  { id: 'file1', name: 'readme.txt', type: 'file', parentId: 'proj' },
];

<DataGrid
  columns={[
    { 
      field: 'name', 
      headerName: 'Name',
      renderCell: (row) => (
        <span>{row.type === 'folder' ? '📁' : '📄'} {row.name}</span>
      )
    },
  ]}
  rows={files}
  treeConfig={{ enabled: true, indentSize: 32 }}
/>
```

### Product Categories
```tsx
const categories = [
  { id: 'elec', name: 'Electronics', count: 245, parentId: null },
  { id: 'comp', name: 'Computers', count: 89, parentId: 'elec' },
  { id: 'laptop', name: 'Laptops', count: 45, parentId: 'comp' },
];

<DataGrid
  columns={[
    { field: 'name', headerName: 'Category' },
    { field: 'count', headerName: 'Products' },
  ]}
  rows={categories}
  treeConfig={{ enabled: true }}
/>
```

## Utility Functions

### Build Tree from Flat Data
```tsx
import { buildTreeFromFlat } from 'react-open-source-grid';

const treeNodes = buildTreeFromFlat(flatData, treeConfig);
```

### Flatten Tree
```tsx
import { flattenTree } from 'react-open-source-grid';

const visibleNodes = flattenTree(treeNodes, expandedNodes, treeConfig);
```

### Expand/Collapse All
```tsx
import { expandAllNodes, collapseAllNodes } from 'react-open-source-grid';

// Expand all
const allExpanded = expandAllNodes(treeNodes, treeConfig);
dispatch({ type: 'SET_EXPANDED_NODES', payload: allExpanded });

// Collapse all
const allCollapsed = collapseAllNodes(treeNodes, treeConfig);
dispatch({ type: 'SET_EXPANDED_NODES', payload: allCollapsed });
```

### Toggle Single Node
```tsx
import { toggleNodeExpansion } from 'react-open-source-grid';

const newState = toggleNodeExpansion(nodeId, currentExpandedNodes);
dispatch({ type: 'SET_EXPANDED_NODES', payload: newState });
```

### Get Descendants
```tsx
import { getDescendantIds } from 'react-open-source-grid';

const descendants = getDescendantIds(node, treeConfig);
// Returns: [childId1, childId2, grandchildId1, ...]
```

### Get Node Path
```tsx
import { getNodePath } from 'react-open-source-grid';

const path = getNodePath(nodeId, treeNodes, treeConfig);
// Returns: [rootId, parentId, nodeId] or null
```

### Filter Tree
```tsx
import { filterTree } from 'react-open-source-grid';

const filtered = filterTree(
  treeNodes,
  (node) => node.name.includes('search'),
  treeConfig
);
```

### Check if Tree Node
```tsx
import { isTreeNode } from 'react-open-source-grid';

if (isTreeNode(row)) {
  console.log('Level:', row.level);
  console.log('Has children:', row.hasChildren);
}
```

## Grid Actions

```tsx
// Toggle specific node
dispatch({ type: 'TOGGLE_TREE_NODE', payload: nodeId });

// Expand all nodes
dispatch({ type: 'EXPAND_ALL_NODES' });

// Collapse all nodes
dispatch({ type: 'COLLAPSE_ALL_NODES' });

// Set expanded state
dispatch({ 
  type: 'SET_EXPANDED_NODES', 
  payload: { '1': true, '2': false } 
});
```

## TreeNode Interface

```typescript
interface TreeNode extends Row {
  isTreeNode: true;
  nodeId: string | number;
  parentId: string | number | null;
  level: number;              // 0 = root, 1 = child, etc.
  hasChildren: boolean;
  isExpanded: boolean;
  children?: TreeNode[];
}
```

## Lazy Loading

```tsx
const handleNodeExpand = async (node: TreeNode) => {
  if (node.hasChildren && !node.children?.length) {
    const children = await fetchChildren(node.id);
    setData(prev => [...prev, ...children]);
  }
};

<DataGrid
  rows={data}
  treeConfig={{
    enabled: true,
    lazyLoad: true,
    onNodeExpand: handleNodeExpand
  }}
/>
```

## Custom Indentation

```tsx
<DataGrid
  rows={data}
  treeConfig={{
    enabled: true,
    indentSize: 32  // 32px per level instead of default 24px
  }}
/>
```

## Event Handlers

```tsx
<DataGrid
  rows={data}
  treeConfig={{
    enabled: true,
    onNodeExpand: (node) => {
      console.log('Expanded:', node.name);
    },
    onNodeCollapse: (node) => {
      console.log('Collapsed:', node.name);
    }
  }}
/>
```

## Performance Optimization

### With Virtual Scrolling
```tsx
<DataGrid
  rows={largeDataset}
  treeConfig={{ enabled: true }}
  virtualScrollConfig={{ 
    enabled: true,
    rowHeight: 40,
    containerHeight: 600
  }}
/>
```

### With Pagination
```tsx
<DataGrid
  rows={data}
  treeConfig={{ enabled: true }}
  pageSize={50}
/>
```

### With Lazy Loading
```tsx
<DataGrid
  rows={data}
  treeConfig={{ 
    enabled: true,
    lazyLoad: true,
    onNodeExpand: loadChildrenAsync
  }}
/>
```

## Data Requirements

### ✅ Valid Data Structure
```tsx
const data = [
  { id: 1, name: 'Parent', parentId: null },     // Root node
  { id: 2, name: 'Child', parentId: 1 },         // Child of 1
  { id: 3, name: 'Grandchild', parentId: 2 },    // Child of 2
];
```

### ❌ Invalid - Missing Parent ID Field
```tsx
const data = [
  { id: 1, name: 'Parent' },  // Missing parentId field
  { id: 2, name: 'Child' },
];
```

### ❌ Invalid - Circular References
```tsx
const data = [
  { id: 1, name: 'Node 1', parentId: 2 },  // Points to 2
  { id: 2, name: 'Node 2', parentId: 1 },  // Points to 1 - circular!
];
```

## Combining with Other Features

```tsx
<DataGrid
  columns={columns}
  rows={data}
  treeConfig={{ enabled: true }}           // ✅ Tree data
  virtualScrollConfig={{ enabled: true }}  // ✅ Virtual scrolling
  footerConfig={{ show: true }}            // ✅ Footer
  persistenceConfig={{ enabled: true }}     // ✅ Layout persistence
  theme="quartz"                           // ✅ Theming
  onRowClick={(row) => {}}                 // ✅ Events
  onCellEdit={(i, f, v) => {}}            // ✅ Editing
/>
```

## Tree vs Grouping

**Important**: Tree mode and grouping are mutually exclusive.

```tsx
// ✅ Tree mode (grouping is disabled)
<DataGrid
  rows={data}
  treeConfig={{ enabled: true }}
/>

// ✅ Grouping mode (tree is disabled)
<DataGrid
  rows={data}
  // groupBy functionality available
/>

// ❌ Cannot use both simultaneously
<DataGrid
  rows={data}
  treeConfig={{ enabled: true }}
  // Grouping will be ignored
/>
```

## Common Issues

### Issue: Nodes not hierarchical
**Solution**: Ensure `parentId` values reference valid parent IDs and root nodes have `parentId: null`

### Issue: No expand icons showing
**Solution**: Verify nodes have children and `showExpandIcon` is not `false`

### Issue: Poor performance with large trees
**Solution**: Enable virtual scrolling and/or lazy loading:
```tsx
<DataGrid
  rows={data}
  treeConfig={{ enabled: true, lazyLoad: true }}
  virtualScrollConfig={{ enabled: true }}
/>
```

## Resources

- [Full Documentation](./TREE_DATA_FEATURE.md)
- [Demo Component](../src/components/TreeDataDemo.tsx)
- [DataGrid API](./DATAGRID_README.md)
