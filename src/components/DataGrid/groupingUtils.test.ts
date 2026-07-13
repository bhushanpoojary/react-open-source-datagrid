import { describe, it, expect } from 'vitest';
import { groupRows, flattenGroupedRows, isGroupedRow, computeAggregate } from './groupingUtils';
import type { Row, GroupedRow } from './types';

const rows: Row[] = [
  { id: 1, city: 'London', dept: 'Eng', salary: 100 },
  { id: 2, city: 'London', dept: 'Sales', salary: 200 },
  { id: 3, city: 'Paris', dept: 'Eng', salary: 300 },
];

describe('computeAggregate', () => {
  it('computes count, sum, avg, min, max', () => {
    expect(computeAggregate(rows, 'salary', 'count')).toBe(3);
    expect(computeAggregate(rows, 'salary', 'sum')).toBe(600);
    expect(computeAggregate(rows, 'salary', 'avg')).toBe(200);
    expect(computeAggregate(rows, 'salary', 'min')).toBe(100);
    expect(computeAggregate(rows, 'salary', 'max')).toBe(300);
  });

  it('returns 0 when there are no numeric values', () => {
    expect(computeAggregate([], 'salary', 'sum')).toBe(0);
    expect(computeAggregate(rows, 'city', 'sum')).toBe(0);
  });
});

describe('groupRows', () => {
  it('returns rows unchanged when there are no group fields', () => {
    expect(groupRows(rows, [], {})).toEqual(rows);
  });

  it('groups rows by a single field', () => {
    const result = groupRows(rows, ['city'], {}) as GroupedRow[];
    expect(result).toHaveLength(2);
    expect(result.every((g) => g.isGroup)).toBe(true);
    const london = result.find((g) => g.groupValue === 'London')!;
    expect(london.children).toHaveLength(2);
    expect(london.aggregates.count).toBe(2);
    expect(london.aggregates.salary_sum).toBe(300);
    expect(london.aggregates.salary_avg).toBe(150);
  });

  it('creates nested groups for multiple fields when expanded', () => {
    const result = groupRows(rows, ['city', 'dept'], {}) as GroupedRow[];
    const london = result.find((g) => g.groupValue === 'London')!;
    // Children should themselves be groups (by dept)
    expect(london.children.every((c) => 'isGroup' in c && c.isGroup)).toBe(true);
    expect(london.children).toHaveLength(2);
  });

  it('uses "(empty)" as the key for null/undefined values', () => {
    const withEmpty: Row[] = [{ id: 1, city: null }, { id: 2, city: 'Paris' }];
    const result = groupRows(withEmpty, ['city'], {}) as GroupedRow[];
    expect(result.map((g) => g.groupValue)).toContain('(empty)');
  });
});

describe('flattenGroupedRows', () => {
  it('includes children of expanded groups', () => {
    const grouped = groupRows(rows, ['city'], {});
    const flat = flattenGroupedRows(grouped);
    // 2 group headers + 3 leaf rows
    expect(flat).toHaveLength(5);
  });

  it('hides children of collapsed groups', () => {
    const grouped = groupRows(rows, ['city'], {});
    // Collapse the London group by flipping its isExpanded flag
    (grouped[0] as GroupedRow).isExpanded = false;
    const flat = flattenGroupedRows(grouped);
    const collapsedChildrenCount = (grouped[0] as GroupedRow).children.length;
    expect(flat).toHaveLength(5 - collapsedChildrenCount);
  });
});

describe('isGroupedRow', () => {
  it('distinguishes grouped rows from plain rows', () => {
    const grouped = groupRows(rows, ['city'], {});
    expect(isGroupedRow(grouped[0])).toBe(true);
    expect(isGroupedRow(rows[0])).toBe(false);
  });
});
