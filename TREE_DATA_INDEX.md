# Tree Data / Hierarchical Rows - Documentation Index

## 📖 Documentation Overview

This feature provides hierarchical data visualization with expand/collapse functionality, perfect for org charts, file explorers, and nested categories.

## 🗂️ Documentation Files

### 1. [Quick Reference](./TREE_DATA_QUICK_REF.md) ⚡
**Start here for a quick overview**
- Basic setup
- Configuration table
- Common patterns
- Utility functions cheat sheet
- Code snippets
- Troubleshooting

**Best for**: Quick lookups, copying code snippets

### 2. [Full Feature Guide](./TREE_DATA_FEATURE.md) 📚
**Complete documentation**
- Detailed explanations
- All configuration options
- API reference
- Advanced usage patterns
- Best practices
- Performance tips
- Integration guide

**Best for**: In-depth learning, advanced usage

### 3. [Implementation Summary](./TREE_DATA_IMPLEMENTATION.md) ✅
**Technical implementation details**
- Files created/modified
- Features implemented
- Architecture decisions
- Testing recommendations
- Future enhancements

**Best for**: Understanding the codebase, contributing

### 4. [Demo Component](../src/components/TreeDataDemo.tsx) 🎮
**Interactive examples**
- Organizational chart
- File explorer
- Product categories
- Live code examples

**Best for**: Seeing it in action, learning by example

## 🚀 Getting Started

### 30-Second Quickstart

```tsx
import { DataGrid } from './components/DataGrid';

const data = [
  { id: 1, name: 'CEO', parentId: null },
  { id: 2, name: 'CTO', parentId: 1 },
  { id: 3, name: 'Engineer', parentId: 2 },
];

<DataGrid
  columns={[{ field: 'name', headerName: 'Name' }]}
  rows={data}
  treeConfig={{ enabled: true }}
/>
```

## 📋 Common Tasks

### Task: Display an org chart
→ See [Quick Reference - Org Chart](./TREE_DATA_QUICK_REF.md#organizational-chart)

### Task: Build a file explorer
→ See [Quick Reference - File Explorer](./TREE_DATA_QUICK_REF.md#file-explorer)

### Task: Configure tree options
→ See [Feature Guide - Configuration](./TREE_DATA_FEATURE.md#configuration)

### Task: Use tree utilities
→ See [Feature Guide - Utility Functions](./TREE_DATA_FEATURE.md#utility-functions)

### Task: Implement lazy loading
→ See [Feature Guide - Lazy Loading](./TREE_DATA_FEATURE.md#lazy-loading-children)

### Task: Expand/collapse all nodes
→ See [Quick Reference - Expand/Collapse All](./TREE_DATA_QUICK_REF.md#expandcollapse-all)

### Task: Filter tree data
→ See [Feature Guide - Filtering](./TREE_DATA_FEATURE.md#filtering-tree-data)

## 🎯 Use Cases

| Use Case | Example | Documentation |
|----------|---------|---------------|
| **Organizational Chart** | Employee hierarchies | [Demo](../src/components/TreeDataDemo.tsx) |
| **File Explorer** | Folder/file structures | [Quick Ref](./TREE_DATA_QUICK_REF.md#file-explorer) |
| **Product Categories** | Nested product taxonomy | [Feature Guide](./TREE_DATA_FEATURE.md#example-3-product-categories-with-metrics) |
| **Comment Threads** | Nested comments | [Feature Guide](./TREE_DATA_FEATURE.md#use-cases-covered) |
| **Task Hierarchies** | Project task breakdown | [Feature Guide](./TREE_DATA_FEATURE.md#best-practices) |

## 🔧 Configuration Quick Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | - | Enable tree mode |
| `idField` | string | 'id' | Node ID field |
| `parentIdField` | string | 'parentId' | Parent ID field |
| `indentSize` | number | 24 | Pixels per level |
| `showExpandIcon` | boolean | true | Show expand icons |

[See all options →](./TREE_DATA_FEATURE.md#treeconfig-interface)

## 🛠️ Available Utilities

| Function | Purpose | Link |
|----------|---------|------|
| `buildTreeFromFlat()` | Convert flat to tree | [Docs](./TREE_DATA_FEATURE.md#buildtreefromflat) |
| `flattenTree()` | Flatten for rendering | [Docs](./TREE_DATA_FEATURE.md#flattentree) |
| `expandAllNodes()` | Expand all | [Docs](./TREE_DATA_FEATURE.md#expandallnodes) |
| `collapseAllNodes()` | Collapse all | [Docs](./TREE_DATA_FEATURE.md#collapseallnodes) |
| `filterTree()` | Filter nodes | [Docs](./TREE_DATA_FEATURE.md#filtertree) |
| `getNodePath()` | Get path to node | [Docs](./TREE_DATA_FEATURE.md#getnodepath) |

[See all utilities →](./TREE_DATA_FEATURE.md#utility-functions)

## 💡 Examples by Complexity

### Beginner: Basic Tree
```tsx
<DataGrid
  rows={flatData}
  treeConfig={{ enabled: true }}
/>
```
[Full example →](./TREE_DATA_QUICK_REF.md#basic-setup)

### Intermediate: Custom Icons
```tsx
<DataGrid
  rows={fileData}
  columns={[{
    field: 'name',
    renderCell: (row) => (
      <span>{row.type === 'folder' ? '📁' : '📄'} {row.name}</span>
    )
  }]}
  treeConfig={{ enabled: true, indentSize: 32 }}
/>
```
[Full example →](./TREE_DATA_FEATURE.md#example-2-file-explorer)

### Advanced: Lazy Loading
```tsx
<DataGrid
  rows={data}
  treeConfig={{
    enabled: true,
    lazyLoad: true,
    onNodeExpand: async (node) => {
      const children = await fetchChildren(node.id);
      setData(prev => [...prev, ...children]);
    }
  }}
/>
```
[Full example →](./TREE_DATA_FEATURE.md#lazy-loading-children)

## 🎨 Integration Examples

### With Virtual Scrolling
```tsx
<DataGrid
  treeConfig={{ enabled: true }}
  virtualScrollConfig={{ enabled: true, rowHeight: 40 }}
/>
```

### With Filtering
```tsx
const filtered = filterTree(
  treeNodes,
  (node) => node.name.includes(searchTerm),
  treeConfig
);
```

### With Custom Theme
```tsx
<DataGrid
  treeConfig={{ enabled: true }}
  theme="dark"
/>
```

## 📊 Performance Guide

| Scenario | Recommendation | Documentation |
|----------|---------------|---------------|
| < 100 nodes | Default settings | [Quick Ref](./TREE_DATA_QUICK_REF.md) |
| 100-1000 nodes | Virtual scrolling | [Performance](./TREE_DATA_FEATURE.md#performance-optimization) |
| 1000+ nodes | Virtual + lazy load | [Best Practices](./TREE_DATA_FEATURE.md#best-practices) |
| Deep nesting | Limit initial depth | [Advanced Usage](./TREE_DATA_FEATURE.md#advanced-usage) |

## 🐛 Troubleshooting

| Issue | Solution | Documentation |
|-------|----------|---------------|
| Nodes not hierarchical | Check parent IDs | [Troubleshooting](./TREE_DATA_FEATURE.md#troubleshooting) |
| No expand icons | Verify node has children | [Quick Ref](./TREE_DATA_QUICK_REF.md#common-issues) |
| Performance issues | Enable virtual scrolling | [Performance](./TREE_DATA_FEATURE.md#5-optimize-large-trees) |

## 🔗 Related Features

- [DataGrid Main Docs](./DATAGRID_README.md)
- [Virtual Scrolling](./VIRTUAL_SCROLLING.md)
- [Column Filters](./COLUMN_FILTERS_FEATURE.md)
- [Layout Persistence](./LAYOUT_PERSISTENCE_FEATURE.md)
- [Grouping (mutually exclusive)](./DATAGRID_README.md)

## 📞 Quick Links

- [Demo Component](../src/components/TreeDataDemo.tsx)
- [Tree Utilities Source](../src/components/DataGrid/treeDataUtils.ts)
- [TreeRow Component](../src/components/DataGrid/TreeRow.tsx)
- [Type Definitions](../src/components/DataGrid/types.ts)

## 🎓 Learning Path

1. **First Time?** → Start with [Quick Reference](./TREE_DATA_QUICK_REF.md)
2. **Building Something?** → Check [Demo Component](../src/components/TreeDataDemo.tsx)
3. **Need Details?** → Read [Feature Guide](./TREE_DATA_FEATURE.md)
4. **Contributing?** → Review [Implementation](./TREE_DATA_IMPLEMENTATION.md)

## 🌟 Key Features at a Glance

✅ Automatic tree building from flat data  
✅ Expand/collapse with animations  
✅ Visual indentation per level  
✅ Unlimited nesting depth  
✅ Custom expand icons  
✅ Lazy loading support  
✅ 11 utility functions  
✅ Full TypeScript support  
✅ Works with all DataGrid features  
✅ Three comprehensive demos  
✅ Production-ready performance  

## 📝 Feedback & Support

- Found an issue? → Check [Troubleshooting](./TREE_DATA_FEATURE.md#troubleshooting)
- Have a question? → See [Feature Guide](./TREE_DATA_FEATURE.md)
- Want to contribute? → Review [Implementation](./TREE_DATA_IMPLEMENTATION.md)

---

**Ready to build?** Start with the [Quick Reference](./TREE_DATA_QUICK_REF.md) →
