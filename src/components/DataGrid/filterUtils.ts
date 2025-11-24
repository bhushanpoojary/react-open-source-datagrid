import type { Row, FilterConfig, FilterValue, FilterCondition, AdvancedFilterValue } from './types';

/**
 * Apply text filter to a value
 */
const applyTextFilter = (value: any, filter: FilterValue | FilterCondition): boolean => {
  // Handle isEmpty/isNotEmpty
  if (filter.type === 'isEmpty') {
    return value == null || String(value).trim() === '';
  }
  if (filter.type === 'isNotEmpty') {
    return value != null && String(value).trim() !== '';
  }

  if (value == null) return false;
  const stringValue = String(value).toLowerCase();
  const filterValue = String(filter.value || '').toLowerCase();

  switch (filter.type) {
    case 'contains':
      return stringValue.includes(filterValue);
    case 'notContains':
      return !stringValue.includes(filterValue);
    case 'equals':
      return stringValue === filterValue;
    case 'notEquals':
      return stringValue !== filterValue;
    case 'startsWith':
      return stringValue.startsWith(filterValue);
    case 'endsWith':
      return stringValue.endsWith(filterValue);
    default:
      return stringValue.includes(filterValue);
  }
};

/**
 * Apply number filter to a value
 */
const applyNumberFilter = (value: any, filter: FilterValue | FilterCondition): boolean => {
  // Handle isEmpty/isNotEmpty
  if (filter.type === 'isEmpty') {
    return value == null || (typeof value === 'number' && isNaN(value));
  }
  if (filter.type === 'isNotEmpty') {
    return value != null && !(typeof value === 'number' && isNaN(value));
  }

  if (value == null) return false;
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numValue)) return false;

  const filterValue = parseFloat(filter.value);
  if (isNaN(filterValue)) return false;

  switch (filter.type) {
    case 'equals':
      return numValue === filterValue;
    case 'notEquals':
      return numValue !== filterValue;
    case 'greaterThan':
      return numValue > filterValue;
    case 'greaterThanOrEqual':
      return numValue >= filterValue;
    case 'lessThan':
      return numValue < filterValue;
    case 'lessThanOrEqual':
      return numValue <= filterValue;
    case 'inRange': {
      const filterValue2 = parseFloat(filter.value2);
      if (isNaN(filterValue2)) return numValue >= filterValue;
      return numValue >= filterValue && numValue <= filterValue2;
    }
    default:
      return numValue === filterValue;
  }
};

/**
 * Apply date filter to a value
 */
const applyDateFilter = (value: any, filter: FilterValue | FilterCondition): boolean => {
  // Handle isEmpty/isNotEmpty
  if (filter.type === 'isEmpty') {
    return value == null;
  }
  if (filter.type === 'isNotEmpty') {
    return value != null;
  }

  if (value == null) return false;
  
  let dateValue: Date;
  if (value instanceof Date) {
    dateValue = value;
  } else {
    dateValue = new Date(value);
  }
  
  if (isNaN(dateValue.getTime())) return false;

  const filterDate = new Date(filter.value);
  if (isNaN(filterDate.getTime())) return false;

  // Normalize dates to midnight for comparison
  const normalizedValue = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
  const normalizedFilter = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());

  switch (filter.type) {
    case 'equals':
      return normalizedValue.getTime() === normalizedFilter.getTime();
    case 'before':
      return normalizedValue.getTime() < normalizedFilter.getTime();
    case 'after':
      return normalizedValue.getTime() > normalizedFilter.getTime();
    case 'inRange': {
      const filterDate2 = new Date(filter.value2);
      if (isNaN(filterDate2.getTime())) return normalizedValue.getTime() >= normalizedFilter.getTime();
      const normalizedFilter2 = new Date(filterDate2.getFullYear(), filterDate2.getMonth(), filterDate2.getDate());
      return normalizedValue.getTime() >= normalizedFilter.getTime() && 
             normalizedValue.getTime() <= normalizedFilter2.getTime();
    }
    default:
      return normalizedValue.getTime() === normalizedFilter.getTime();
  }
};

/**
 * Apply set/multi-select filter to a value
 */
const applySetFilter = (value: any, filter: FilterValue | FilterCondition): boolean => {
  if (!filter.values || filter.values.length === 0) return true;
  
  const isIncluded = filter.values.includes(value);
  
  // Support both 'in' and 'notIn' operations
  if (filter.type === 'notIn') {
    return !isIncluded;
  }
  
  return isIncluded;
};

/**
 * Determine filter type based on filter value structure
 */
const getFilterOperationType = (filter: FilterValue | FilterCondition): 'text' | 'number' | 'date' | 'set' => {
  if (filter.type === 'set' || filter.type === 'in' || filter.type === 'notIn' || filter.values) return 'set';
  
  // Check if it's a number filter
  if (['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'inRange'].includes(filter.type || '')) {
    if (typeof filter.value === 'number' || !isNaN(parseFloat(filter.value))) {
      return 'number';
    }
  }
  
  // Check if it's a date filter
  if (['before', 'after'].includes(filter.type || '')) {
    return 'date';
  }
  
  // Try to parse as date
  if (filter.value && !isNaN(new Date(filter.value).getTime())) {
    // Check if it looks like a date string (has dashes or slashes)
    if (String(filter.value).match(/\d{4}-\d{2}-\d{2}|\\d{1,2}\/\d{1,2}\/\d{4}/)) {
      return 'date';
    }
  }
  
  return 'text';
};

/**
 * Check if a filter is an advanced filter with multiple conditions
 */
const isAdvancedFilter = (filter: FilterValue | AdvancedFilterValue | null): filter is AdvancedFilterValue => {
  return filter != null && 'operator' in filter && 'conditions' in filter;
};

/**
 * Apply a single condition to a row
 */
const applySingleCondition = (row: Row, field: string, condition: FilterCondition): boolean => {
  const value = row[field];
  const filterType = getFilterOperationType(condition);

  switch (filterType) {
    case 'number':
      return applyNumberFilter(value, condition);
    case 'date':
      return applyDateFilter(value, condition);
    case 'set':
      return applySetFilter(value, condition);
    default:
      return applyTextFilter(value, condition);
  }
};

/**
 * Apply an advanced filter with multiple conditions
 */
const applyAdvancedFilter = (row: Row, field: string, filter: AdvancedFilterValue): boolean => {
  const { operator, conditions } = filter;

  if (!conditions || conditions.length === 0) return true;

  if (operator === 'AND') {
    // All conditions must pass
    return conditions.every(condition => applySingleCondition(row, field, condition));
  } else {
    // At least one condition must pass
    return conditions.some(condition => applySingleCondition(row, field, condition));
  }
};

/**
 * Apply a single filter (simple or advanced) to a row
 */
const applyFilter = (row: Row, field: string, filter: FilterValue | AdvancedFilterValue): boolean => {
  if (!filter) return true;
  
  // Check if it's an advanced filter with multiple conditions
  if (isAdvancedFilter(filter)) {
    return applyAdvancedFilter(row, field, filter);
  }

  // Simple filter
  const value = row[field];
  const filterType = getFilterOperationType(filter);

  switch (filterType) {
    case 'number':
      return applyNumberFilter(value, filter);
    case 'date':
      return applyDateFilter(value, filter);
    case 'set':
      return applySetFilter(value, filter);
    default:
      return applyTextFilter(value, filter);
  }
};

/**
 * Apply all filters to rows
 */
export const applyFilters = (rows: Row[], filterConfig: FilterConfig): Row[] => {
  if (!filterConfig || Object.keys(filterConfig).length === 0) {
    return rows;
  }

  return rows.filter(row => {
    // Row must pass all active filters
    return Object.entries(filterConfig).every(([field, filter]) => {
      if (!filter) return true;
      return applyFilter(row, field, filter);
    });
  });
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (filterConfig: FilterConfig): boolean => {
  return Object.values(filterConfig).some(filter => filter != null);
};

/**
 * Get count of active filters
 */
export const getActiveFilterCount = (filterConfig: FilterConfig): number => {
  return Object.values(filterConfig).filter(filter => filter != null).length;
};

/**
 * Clear all filters
 */
export const clearAllFilters = (): FilterConfig => {
  return {};
};
