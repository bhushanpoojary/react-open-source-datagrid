import { describe, it, expect } from 'vitest';
import {
  applyFilters,
  hasActiveFilters,
  getActiveFilterCount,
  clearAllFilters,
} from './filterUtils';
import type { Row, FilterConfig } from './types';

const rows: Row[] = [
  { id: 1, name: 'Alice', age: 30, city: 'London', joined: '2020-01-15' },
  { id: 2, name: 'Bob', age: 25, city: 'Paris', joined: '2021-06-10' },
  { id: 3, name: 'Charlie', age: 40, city: 'London', joined: '2019-03-20' },
  { id: 4, name: 'Dave', age: 35, city: 'Berlin', joined: '2022-11-01' },
];

describe('applyFilters — text', () => {
  it('returns all rows when config is empty', () => {
    expect(applyFilters(rows, {})).toHaveLength(4);
  });

  it('filters by contains (case-insensitive)', () => {
    const config: FilterConfig = { name: { type: 'contains', value: 'a' } };
    expect(applyFilters(rows, config).map((r) => r.name)).toEqual([
      'Alice',
      'Charlie',
      'Dave',
    ]);
  });

  it('filters by equals', () => {
    const config: FilterConfig = { city: { type: 'equals', value: 'London' } };
    expect(applyFilters(rows, config).map((r) => r.id)).toEqual([1, 3]);
  });

  it('filters by startsWith and endsWith', () => {
    expect(
      applyFilters(rows, { name: { type: 'startsWith', value: 'Ch' } }).map((r) => r.name)
    ).toEqual(['Charlie']);
    expect(
      applyFilters(rows, { name: { type: 'endsWith', value: 'e' } }).map((r) => r.name)
    ).toEqual(['Alice', 'Charlie', 'Dave']);
  });
});

describe('applyFilters — number', () => {
  it('filters greaterThan', () => {
    const config: FilterConfig = { age: { type: 'greaterThan', value: '30' } };
    expect(applyFilters(rows, config).map((r) => r.name)).toEqual(['Charlie', 'Dave']);
  });

  it('filters inRange (inclusive)', () => {
    const config: FilterConfig = { age: { type: 'inRange', value: '25', value2: '35' } };
    expect(applyFilters(rows, config).map((r) => r.name)).toEqual(['Alice', 'Bob', 'Dave']);
  });
});

describe('applyFilters — text edge cases', () => {
  it('filters notContains and notEquals', () => {
    expect(
      applyFilters(rows, { city: { type: 'notContains', value: 'London' } }).map((r) => r.id)
    ).toEqual([2, 4]);
    expect(
      applyFilters(rows, { city: { type: 'notEquals', value: 'London' } }).map((r) => r.id)
    ).toEqual([2, 4]);
  });

  it('filters isEmpty and isNotEmpty', () => {
    const withBlank: Row[] = [
      { id: 1, note: 'hello' },
      { id: 2, note: '' },
      { id: 3, note: null },
      { id: 4, note: '   ' },
    ];
    expect(applyFilters(withBlank, { note: { type: 'isEmpty' } }).map((r) => r.id)).toEqual([2, 3, 4]);
    expect(applyFilters(withBlank, { note: { type: 'isNotEmpty' } }).map((r) => r.id)).toEqual([1]);
  });
});

describe('applyFilters — number edge cases', () => {
  it('filters equals / notEquals / lessThan / >= / <=', () => {
    expect(applyFilters(rows, { age: { type: 'equals', value: '30' } }).map((r) => r.id)).toEqual([1]);
    expect(applyFilters(rows, { age: { type: 'notEquals', value: '30' } }).map((r) => r.id)).toEqual([2, 3, 4]);
    expect(applyFilters(rows, { age: { type: 'lessThan', value: '30' } }).map((r) => r.id)).toEqual([2]);
    expect(applyFilters(rows, { age: { type: 'greaterThanOrEqual', value: '35' } }).map((r) => r.id)).toEqual([3, 4]);
    expect(applyFilters(rows, { age: { type: 'lessThanOrEqual', value: '30' } }).map((r) => r.id)).toEqual([1, 2]);
  });
});

describe('applyFilters — date', () => {
  it('filters before and after a date', () => {
    expect(
      applyFilters(rows, { joined: { type: 'before', value: '2020-06-01' } }).map((r) => r.id)
    ).toEqual([1, 3]);
    expect(
      applyFilters(rows, { joined: { type: 'after', value: '2021-01-01' } }).map((r) => r.id)
    ).toEqual([2, 4]);
  });

  it('filters an inclusive date range', () => {
    expect(
      applyFilters(rows, {
        joined: { type: 'inRange', value: '2020-01-01', value2: '2021-12-31' },
      }).map((r) => r.id)
    ).toEqual([1, 2]);
  });
});

describe('applyFilters — set / multi-select', () => {
  it('includes only rows whose value is in the set', () => {
    const config: FilterConfig = { city: { type: 'in', values: ['London', 'Berlin'] } };
    expect(applyFilters(rows, config).map((r) => r.id)).toEqual([1, 3, 4]);
  });

  it('excludes rows for notIn', () => {
    const config: FilterConfig = { city: { type: 'notIn', values: ['London'] } };
    expect(applyFilters(rows, config).map((r) => r.id)).toEqual([2, 4]);
  });
});

describe('applyFilters — combined (AND across fields)', () => {
  it('requires a row to pass every field filter', () => {
    const config: FilterConfig = {
      city: { type: 'equals', value: 'London' },
      age: { type: 'greaterThan', value: '35' },
    };
    expect(applyFilters(rows, config).map((r) => r.name)).toEqual(['Charlie']);
  });
});

describe('applyFilters — advanced multi-condition', () => {
  it('applies OR across conditions on the same field', () => {
    const config: FilterConfig = {
      name: {
        operator: 'OR',
        conditions: [
          { type: 'equals', value: 'Alice' },
          { type: 'equals', value: 'Bob' },
        ],
      },
    };
    expect(applyFilters(rows, config).map((r) => r.name)).toEqual(['Alice', 'Bob']);
  });
});

describe('filter config helpers', () => {
  it('hasActiveFilters reflects presence of non-null filters', () => {
    expect(hasActiveFilters({})).toBe(false);
    expect(hasActiveFilters({ name: { type: 'contains', value: 'x' } })).toBe(true);
    expect(hasActiveFilters({ name: null })).toBe(false);
  });

  it('getActiveFilterCount counts non-null filters', () => {
    const config: FilterConfig = {
      name: { type: 'contains', value: 'x' },
      city: null,
      age: { type: 'equals', value: '30' },
    };
    expect(getActiveFilterCount(config)).toBe(2);
  });

  it('clearAllFilters returns an empty config', () => {
    expect(clearAllFilters()).toEqual({});
  });
});
