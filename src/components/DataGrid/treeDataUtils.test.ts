import { describe, it, expect } from 'vitest';
import {
  isTreeNode,
  buildTreeFromFlat,
  flattenTree,
  toggleNodeExpansion,
  expandAllNodes,
  collapseAllNodes,
  getDescendantIds,
  getNodePath,
  getTreeDepth,
  countTreeNodes,
  filterTree,
} from './treeDataUtils';
import type { Row, TreeConfig } from './types';

const config: TreeConfig = { idField: 'id', parentIdField: 'parentId', childrenField: 'children' };

// A small org tree:
// 1 (root)
//   ├── 2
//   │     └── 4
//   └── 3
const flat: Row[] = [
  { id: 1, parentId: null, name: 'CEO' },
  { id: 2, parentId: 1, name: 'VP Eng' },
  { id: 3, parentId: 1, name: 'VP Sales' },
  { id: 4, parentId: 2, name: 'Engineer' },
];

describe('buildTreeFromFlat', () => {
  it('builds a hierarchy with correct levels and hasChildren flags', () => {
    const tree = buildTreeFromFlat(flat, config);
    expect(tree).toHaveLength(1);
    const root = tree[0];
    expect(root.nodeId).toBe(1);
    expect(root.level).toBe(0);
    expect(root.hasChildren).toBe(true);
    expect(root.children).toHaveLength(2);

    const vpEng = root.children.find((c) => c.nodeId === 2)!;
    expect(vpEng.level).toBe(1);
    expect(vpEng.children[0].nodeId).toBe(4);
    expect(vpEng.children[0].level).toBe(2);
  });

  it('treats rows with missing parents as roots', () => {
    const orphaned: Row[] = [{ id: 10, parentId: 999, name: 'orphan' }];
    const tree = buildTreeFromFlat(orphaned, config);
    expect(tree).toHaveLength(1);
    expect(tree[0].nodeId).toBe(10);
  });
});

describe('flattenTree', () => {
  it('returns all nodes when everything is expanded', () => {
    const tree = buildTreeFromFlat(flat, config);
    expect(flattenTree(tree, {}, config)).toHaveLength(4);
  });

  it('omits descendants of collapsed nodes', () => {
    const tree = buildTreeFromFlat(flat, config);
    // Collapse node 2 -> its child 4 should be hidden
    const flatResult = flattenTree(tree, { '2': false }, config);
    expect(flatResult.map((n) => n.nodeId)).toEqual([1, 2, 3]);
  });
});

describe('toggleNodeExpansion', () => {
  it('collapses an expanded (default) node', () => {
    expect(toggleNodeExpansion(2, {})).toEqual({ '2': false });
  });

  it('re-expands a collapsed node', () => {
    expect(toggleNodeExpansion(2, { '2': false })).toEqual({ '2': true });
  });
});

describe('expandAllNodes / collapseAllNodes', () => {
  it('expandAllNodes marks every node expanded', () => {
    const tree = buildTreeFromFlat(flat, config);
    const expanded = expandAllNodes(tree, config);
    expect(expanded).toEqual({ '1': true, '2': true, '3': true, '4': true });
  });

  it('collapseAllNodes marks every node collapsed', () => {
    const tree = buildTreeFromFlat(flat, config);
    const collapsed = collapseAllNodes(tree, config);
    expect(Object.values(collapsed).every((v) => v === false)).toBe(true);
  });
});

describe('tree query helpers', () => {
  it('getDescendantIds returns all descendants of a node', () => {
    const tree = buildTreeFromFlat(flat, config);
    expect(getDescendantIds(tree[0], config).sort()).toEqual([2, 3, 4]);
  });

  it('getNodePath returns the path from root to a node', () => {
    const tree = buildTreeFromFlat(flat, config);
    expect(getNodePath(4, tree, config)).toEqual([1, 2, 4]);
    expect(getNodePath(999, tree, config)).toBeNull();
  });

  it('getTreeDepth returns the deepest level count', () => {
    const tree = buildTreeFromFlat(flat, config);
    expect(getTreeDepth(tree, config)).toBe(3);
  });

  it('countTreeNodes counts every node', () => {
    const tree = buildTreeFromFlat(flat, config);
    expect(countTreeNodes(tree, config)).toBe(4);
  });
});

describe('filterTree', () => {
  it('keeps matching nodes and their ancestors', () => {
    const tree = buildTreeFromFlat(flat, config);
    const result = filterTree(tree, (n) => n.name === 'Engineer', config);
    // Path 1 -> 2 -> 4 should be preserved; VP Sales (3) dropped
    expect(result).toHaveLength(1);
    expect(result[0].nodeId).toBe(1);
    const ids = getDescendantIds(result[0], config);
    expect(ids).toContain(2);
    expect(ids).toContain(4);
    expect(ids).not.toContain(3);
  });
});

describe('isTreeNode', () => {
  it('detects tree nodes', () => {
    const tree = buildTreeFromFlat(flat, config);
    expect(isTreeNode(tree[0])).toBe(true);
    expect(isTreeNode(flat[0])).toBe(false);
  });
});
