import React from 'react';
import type { GroupedRow, Column, GridAction, AggregateConfig } from './types';
import { formatAggregateValue, getAggregateLabel } from './aggregationUtils';

interface GroupRowProps {
  group: GroupedRow;
  columns: Column[];
  columnOrder: string[];
  displayColumnOrder: string[];
  columnWidths: { [field: string]: number };
  dispatch: React.Dispatch<GridAction>;
  pinnedLeft: string[];
  pinnedRight: string[];
}

export const GroupRow: React.FC<GroupRowProps> = ({
  group,
  columns,
  columnOrder,
  columnWidths,
  dispatch,
}) => {
  // Find the column for this group
  const column = columns.find(col => col.field === group.field);
  const columnName = column?.headerName || group.field;

  // Toggle group expansion
  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_GROUP', payload: group.groupKey });
  };

  // Format aggregate values
  const formatAggregate = (key: string, value: any): string => {
    if (key === 'count') return `${value} items`;
    if (key.endsWith('_sum')) return `Sum: ${value.toFixed(2)}`;
    if (key.endsWith('_avg')) return `Avg: ${value.toFixed(2)}`;
    return `${value}`;
  };

  // Get key aggregates to display
  const displayAggregates = Object.entries(group.aggregates || {})
    .filter(([key]) => key === 'count' || key.endsWith('_sum') || key.endsWith('_avg'))
    .slice(0, 3); // Show max 3 aggregates

  return (
    <div
      className="
        sticky left-0 flex items-center border-b border-gray-200
        bg-gray-100 hover:bg-gray-150 transition-colors
        cursor-pointer
      "
      style={{
        minWidth: '100%',
        paddingLeft: `${group.level * 24 + 12}px`,
      }}
      onClick={handleToggle}
    >
      {/* Expand/Collapse Icon */}
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '24px', height: '24px' }}>
        <svg
          className={`text-gray-600 transition-transform duration-200 ${
            group.isExpanded ? 'rotate-90' : ''
          }`}
          style={{ width: '16px', height: '16px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Group Label */}
      <div className="flex items-center gap-2 flex-1 py-2">
        <span className="font-semibold text-gray-700">
          {columnName}:
        </span>
        <span className="text-gray-900 font-medium">
          {group.groupValue === null || group.groupValue === undefined
            ? '(empty)'
            : String(group.groupValue)}
        </span>
        
        {/* Aggregates */}
        {displayAggregates.length > 0 && (
          <div className="flex items-center gap-3 ml-4 text-sm text-gray-600">
            {displayAggregates.map(([key, value]) => (
              <span key={key} className="flex items-center gap-1">
                <span style={{ color: "#6b7280" }}>•</span>
                {formatAggregate(key, value)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Group Badge */}
      <div className="flex-shrink-0 mr-4">
        <span className="
          px-2 py-1 text-xs font-medium 
          bg-blue-100 text-blue-700 rounded
        ">
          {group.aggregates?.count || 0}
        </span>
      </div>
    </div>
  );
};

interface GroupFooterRowProps {
  group: GroupedRow;
  columns: Column[];
  displayColumnOrder: string[];
  columnWidths: { [field: string]: number };
  aggregates: { [key: string]: number | null };
  aggregateConfigs: AggregateConfig[];
  pinnedLeft: string[];
  pinnedRight: string[];
}

export const GroupFooterRow: React.FC<GroupFooterRowProps> = ({
  group,
  columns,
  displayColumnOrder,
  columnWidths,
  aggregates,
  aggregateConfigs,
  pinnedLeft,
  pinnedRight,
}) => {
  // Create a map for quick column lookup
  const columnMap = new Map(columns.map(col => [col.field, col]));

  // Create a map of field -> aggregate configs
  const fieldAggregateMap = new Map<string, AggregateConfig[]>();
  aggregateConfigs.forEach(config => {
    if (!fieldAggregateMap.has(config.field)) {
      fieldAggregateMap.set(config.field, []);
    }
    fieldAggregateMap.get(config.field)!.push(config);
  });

  const pinnedLeftSet = new Set(pinnedLeft);
  const pinnedRightSet = new Set(pinnedRight);

  const leftOffsets: { [field: string]: number } = {};
  let leftAccumulator = 0;
  pinnedLeft.forEach((field) => {
    leftOffsets[field] = leftAccumulator;
    leftAccumulator += columnWidths[field] || 150;
  });

  const rightOffsets: { [field: string]: number } = {};
  let rightAccumulator = 0;
  [...pinnedRight].reverse().forEach((field) => {
    rightOffsets[field] = rightAccumulator;
    rightAccumulator += columnWidths[field] || 150;
  });

  const getPinnedCellStyle = (field: string): React.CSSProperties => {
    const width = `${columnWidths[field] || 150}px`;
    const style: React.CSSProperties = { width };

    if (pinnedLeftSet.has(field)) {
      style.position = 'sticky';
      style.left = `${leftOffsets[field]}px`;
      style.zIndex = 20;
      style.backgroundColor = '#f3f4f6';
    } else if (pinnedRightSet.has(field)) {
      style.position = 'sticky';
      style.right = `${rightOffsets[field]}px`;
      style.zIndex = 20;
      style.backgroundColor = '#f3f4f6';
    }

    return style;
  };

  const isFirstColumn = (field: string): boolean => {
    return displayColumnOrder[0] === field;
  };

  const column = columns.find(col => col.field === group.field);
  const columnName = column?.headerName || group.field;
  const groupLabel = `${columnName}: ${group.groupValue} Subtotal`;

  return (
    <div className="flex border-t border-gray-300 bg-gray-100 font-medium text-sm" style={{ minWidth: '100%' }}>
      {displayColumnOrder.map((field, columnIndex) => {
        const column = columnMap.get(field);
        if (!column) return null;

        const cellStyle = getPinnedCellStyle(field);
        const configs = fieldAggregateMap.get(field);

        // For the first column, show the label
        let cellContent: React.ReactNode;
        if (isFirstColumn(field) && columnIndex === 0) {
          cellContent = (
            <span style={{ color: "#374151", marginLeft: `${group.level * 24 + 12}px` }}>
              {groupLabel}
            </span>
          );
        } else if (configs && configs.length > 0) {
          // Show aggregates for this field
          cellContent = (
            <div className="flex flex-col gap-0.5">
              {configs.map((config, idx) => {
                const key = `${config.field}_${config.function}`;
                const value = aggregates[key];
                const formattedValue = formatAggregateValue(value, config.function);
                const displayLabel = config.label || getAggregateLabel(config.function);
                
                return (
                  <div key={idx} style={{ fontSize: "12px" }}>
                    {configs.length > 1 && (
                      <span className="text-gray-500 mr-1">{displayLabel}:</span>
                    )}
                    <span className="text-gray-800">{formattedValue}</span>
                  </div>
                );
              })}
            </div>
          );
        } else {
          cellContent = null;
        }

        return (
          <div
            key={`group-footer-${group.groupKey}-${field}`}
            className="px-3 py-2 border-r border-gray-200 flex-shrink-0"
            style={cellStyle}
          >
            {cellContent}
          </div>
        );
      })}
    </div>
  );
};
