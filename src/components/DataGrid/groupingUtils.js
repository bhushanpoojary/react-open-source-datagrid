/**
 * Compute aggregate value for a group of rows
 */
export const computeAggregate = (rows, field, func) => {
    const values = rows
        .map(row => row[field])
        .filter(val => val != null && !isNaN(Number(val)))
        .map(Number);
    if (values.length === 0)
        return 0;
    switch (func) {
        case 'count':
            return rows.length;
        case 'sum':
            return values.reduce((acc, val) => acc + val, 0);
        case 'avg':
            return values.reduce((acc, val) => acc + val, 0) / values.length;
        case 'min':
            return Math.min(...values);
        case 'max':
            return Math.max(...values);
        default:
            return 0;
    }
};
/**
 * Group rows by specified fields recursively
 */
export const groupRows = (rows, groupByFields, expandedGroups, level = 0) => {
    if (groupByFields.length === 0 || level >= groupByFields.length) {
        return rows;
    }
    const field = groupByFields[level];
    const grouped = new Map();
    // Group rows by current field
    rows.forEach(row => {
        const value = row[field];
        const key = value ?? '(empty)';
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(row);
    });
    // Convert to GroupedRow array
    const result = [];
    grouped.forEach((rowsInGroup, groupValue) => {
        const groupKey = `${field}:${groupValue}:${level}`;
        const isExpanded = expandedGroups[groupKey] !== false; // Default to expanded
        // Recursively group children if there are more grouping levels
        const children = level < groupByFields.length - 1 && isExpanded
            ? groupRows(rowsInGroup, groupByFields, expandedGroups, level + 1)
            : rowsInGroup;
        // Compute aggregates
        const aggregates = {
            count: rowsInGroup.length,
        };
        // For numeric columns, compute sum and avg
        if (rowsInGroup.length > 0) {
            const sampleRow = rowsInGroup[0];
            Object.keys(sampleRow).forEach(key => {
                if (key !== 'id' && key !== field) {
                    const numericValues = rowsInGroup
                        .map(r => r[key])
                        .filter(v => v != null && !isNaN(Number(v)))
                        .map(Number);
                    if (numericValues.length > 0) {
                        aggregates[`${key}_sum`] = numericValues.reduce((a, b) => a + b, 0);
                        aggregates[`${key}_avg`] = aggregates[`${key}_sum`] / numericValues.length;
                    }
                }
            });
        }
        result.push({
            isGroup: true,
            groupKey,
            groupValue,
            field,
            level,
            children,
            isExpanded,
            aggregates,
        });
    });
    return result;
};
/**
 * Flatten grouped rows for rendering
 */
export const flattenGroupedRows = (groupedRows) => {
    const result = [];
    groupedRows.forEach(item => {
        if ('isGroup' in item && item.isGroup) {
            result.push(item);
            if (item.isExpanded) {
                result.push(...flattenGroupedRows(item.children));
            }
        }
        else {
            result.push(item);
        }
    });
    return result;
};
/**
 * Check if a row is a grouped row
 */
export const isGroupedRow = (row) => {
    return 'isGroup' in row && row.isGroup === true;
};
