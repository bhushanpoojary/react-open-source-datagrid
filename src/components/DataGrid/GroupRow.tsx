import React from 'react';
import type { GroupedRow, Column, GridAction } from './types';

interface GroupRowProps {
  group: GroupedRow;
  columns: Column[];
  columnOrder: string[];
  columnWidths: { [field: string]: number };
  dispatch: React.Dispatch<GridAction>;
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

  // Calculate total width
  const totalWidth = columnOrder.reduce(
    (sum, field) => sum + (columnWidths[field] || 150),
    0
  );

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
        width: `${totalWidth}px`,
        paddingLeft: `${group.level * 24 + 12}px`,
      }}
      onClick={handleToggle}
    >
      {/* Expand/Collapse Icon */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            group.isExpanded ? 'rotate-90' : ''
          }`}
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
                <span className="text-gray-500">•</span>
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
