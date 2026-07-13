import { describe, it, expect } from 'vitest';
import { sortRows, separatePinnedRows } from './gridDataUtils';
import type { Row, GroupedRow, SortConfig } from './types';

const rows: Row[] = [
  { id: 1, name: 'Charlie', age: 30, score: null },
  { id: 2, name: 'alice', age: 25, score: 90 },
  { id: 3, name: 'Bob', age: 42, score: 75 },
];

describe('sortRows', () => {
  it('returns the original reference when no field is set', () => {
    const config: SortConfig = { field: '', direction: 'asc' };
    expect(sortRows(rows, config)).toBe(rows);
  });

  it('returns the original reference when direction is null', () => {
    const config: SortConfig = { field: 'age', direction: null };
    expect(sortRows(rows, config)).toBe(rows);
  });

  it('sorts numbers ascending', () => {
    const config: SortConfig = { field: 'age', direction: 'asc' };
    expect(sortRows(rows, config).map((r) => r.age)).toEqual([25, 30, 42]);
  });

  it('sorts numbers descending', () => {
    const config: SortConfig = { field: 'age', direction: 'desc' };
    expect(sortRows(rows, config).map((r) => r.age)).toEqual([42, 30, 25]);
  });

  it('sorts strings case-insensitively via localeCompare', () => {
    const config: SortConfig = { field: 'name', direction: 'asc' };
    expect(sortRows(rows, config).map((r) => r.name)).toEqual(['alice', 'Bob', 'Charlie']);
  });

  it('places null/undefined values last regardless of ascending', () => {
    const config: SortConfig = { field: 'score', direction: 'asc' };
    const result = sortRows(rows, config).map((r) => r.score);
    expect(result).toEqual([75, 90, null]);
  });

  it('moves null/undefined values to the front when descending (reverse of nulls-last)', () => {
    const config: SortConfig = { field: 'score', direction: 'desc' };
    const result = sortRows(rows, config).map((r) => r.score);
    // Comparator keeps nulls last; desc then reverses the whole array, so
    // nulls end up first. This documents the existing behavior.
    expect(result).toEqual([null, 90, 75]);
  });

  it('does not mutate the input array', () => {
    const config: SortConfig = { field: 'age', direction: 'asc' };
    const copy = [...rows];
    sortRows(rows, config);
    expect(rows).toEqual(copy);
  });

  it('treats two null values as equal', () => {
    const data: Row[] = [
      { id: 1, v: null },
      { id: 2, v: null },
    ];
    const config: SortConfig = { field: 'v', direction: 'asc' };
    expect(sortRows(data, config).map((r) => r.id)).toEqual([1, 2]);
  });
});

describe('separatePinnedRows', () => {
  const dataRows: Row[] = [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
    { id: 'c', name: 'C' },
    { id: 'd', name: 'D' },
  ];

  it('returns all rows as unpinned when nothing is pinned', () => {
    const result = separatePinnedRows(dataRows, [], []);
    expect(result.pinnedRowsTopData).toEqual([]);
    expect(result.pinnedRowsBottomData).toEqual([]);
    expect(result.unpinnedRows).toEqual(dataRows);
  });

  it('separates top and bottom pinned rows', () => {
    const result = separatePinnedRows(dataRows, ['a'], ['d']);
    expect(result.pinnedRowsTopData.map((r) => (r as Row).id)).toEqual(['a']);
    expect(result.pinnedRowsBottomData.map((r) => (r as Row).id)).toEqual(['d']);
    expect(result.unpinnedRows.map((r) => (r as Row).id)).toEqual(['b', 'c']);
  });

  it('preserves the pin order stored in state, not row order', () => {
    const result = separatePinnedRows(dataRows, ['c', 'a'], []);
    expect(result.pinnedRowsTopData.map((r) => (r as Row).id)).toEqual(['c', 'a']);
  });

  it('ignores pinned ids that are not present in the rows', () => {
    const result = separatePinnedRows(dataRows, ['zzz'], ['a']);
    expect(result.pinnedRowsTopData).toEqual([]);
    expect(result.pinnedRowsBottomData.map((r) => (r as Row).id)).toEqual(['a']);
  });

  it('supports grouped rows via groupKey', () => {
    const grouped: GroupedRow = {
      isGroup: true,
      groupKey: 'g1',
      groupValue: 'Group 1',
      field: 'name',
      level: 0,
      children: [],
      isExpanded: true,
    };
    const mixed: (Row | GroupedRow)[] = [grouped, ...dataRows];
    const result = separatePinnedRows(mixed, ['g1'], []);
    expect(result.pinnedRowsTopData).toEqual([grouped]);
    expect(result.unpinnedRows).toEqual(dataRows);
  });
});
