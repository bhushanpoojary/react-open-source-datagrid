import { describe, it, expect } from 'vitest';
import {
  computeAggregate,
  computeAggregations,
  computeGroupAggregations,
  formatAggregateValue,
  getAggregateLabel,
} from './aggregationUtils';
import type { Row, GroupedRow, AggregateConfig } from './types';

const rows: Row[] = [
  { id: 1, price: 10, qty: 2, name: 'a' },
  { id: 2, price: 20, qty: 4, name: 'b' },
  { id: 3, price: 30, qty: 6, name: 'c' },
];

describe('computeAggregate', () => {
  it('sums numeric values', () => {
    expect(computeAggregate(rows, 'price', 'sum')).toBe(60);
  });

  it('treats "total" as sum', () => {
    expect(computeAggregate(rows, 'price', 'total')).toBe(60);
  });

  it('averages numeric values', () => {
    expect(computeAggregate(rows, 'price', 'avg')).toBe(20);
  });

  it('finds the minimum', () => {
    expect(computeAggregate(rows, 'price', 'min')).toBe(10);
  });

  it('finds the maximum', () => {
    expect(computeAggregate(rows, 'price', 'max')).toBe(30);
  });

  it('counts rows regardless of value', () => {
    expect(computeAggregate(rows, 'price', 'count')).toBe(3);
    // count still returns the row length even when the field is non-numeric
    expect(computeAggregate(rows, 'name', 'count')).toBe(3);
  });

  it('returns null for non-count aggregates when there are no numeric values', () => {
    expect(computeAggregate(rows, 'name', 'sum')).toBeNull();
    expect(computeAggregate([], 'price', 'avg')).toBeNull();
  });

  it('ignores null, empty, and non-numeric values', () => {
    const mixed: Row[] = [
      { id: 1, price: 10 },
      { id: 2, price: null },
      { id: 3, price: '' },
      { id: 4, price: 'abc' },
      { id: 5, price: 5 },
    ];
    expect(computeAggregate(mixed, 'price', 'sum')).toBe(15);
  });
});

describe('computeAggregations', () => {
  it('computes every configured aggregate keyed by field_function', () => {
    const configs: AggregateConfig[] = [
      { field: 'price', function: 'sum' },
      { field: 'qty', function: 'avg' },
    ];
    expect(computeAggregations(rows, configs)).toEqual({
      price_sum: 60,
      qty_avg: 4,
    });
  });
});

describe('computeGroupAggregations', () => {
  it('computes aggregates for each group including nested groups', () => {
    const grouped: (Row | GroupedRow)[] = [
      {
        isGroup: true,
        groupKey: 'g1',
        groupValue: 'g1',
        field: 'name',
        level: 0,
        isExpanded: true,
        aggregates: {},
        children: [
          { id: 1, price: 10 },
          { id: 2, price: 20 },
        ],
      } as GroupedRow,
    ];
    const result = computeGroupAggregations(grouped, [{ field: 'price', function: 'sum' }]);
    expect(result.get('g1')).toEqual({ price_sum: 30 });
  });
});

describe('formatAggregateValue', () => {
  it('returns a dash for null', () => {
    expect(formatAggregateValue(null, 'sum')).toBe('-');
  });

  it('formats averages with two decimals', () => {
    expect(formatAggregateValue(3.14159, 'avg')).toBe('3.14');
  });

  it('keeps whole numbers integer and rounds fractional sums', () => {
    expect(formatAggregateValue(42, 'sum')).toBe('42');
    expect(formatAggregateValue(42.5, 'sum')).toBe('42.50');
  });
});

describe('getAggregateLabel', () => {
  it('maps functions to human labels', () => {
    expect(getAggregateLabel('count')).toBe('Count');
    expect(getAggregateLabel('sum')).toBe('Total');
    expect(getAggregateLabel('total')).toBe('Total');
    expect(getAggregateLabel('avg')).toBe('Average');
    expect(getAggregateLabel('min')).toBe('Min');
    expect(getAggregateLabel('max')).toBe('Max');
  });
});
