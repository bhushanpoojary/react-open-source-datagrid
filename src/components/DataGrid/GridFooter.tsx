import React from 'react';
import type { Column, AggregateConfig } from './types';
import { formatAggregateValue, getAggregateLabel } from './aggregationUtils';

interface GridFooterProps {
  columns: Column[];
  displayColumnOrder: string[];
  columnWidths: { [field: string]: number };
  aggregates: { [key: string]: number | null };
  aggregateConfigs: AggregateConfig[];
  pinnedLeft: string[];
  pinnedRight: string[];
  label?: string;
}

export const GridFooter: React.FC<GridFooterProps> = ({
  columns,
  displayColumnOrder,
  columnWidths,
  aggregates,
  aggregateConfigs,
  pinnedLeft,
  pinnedRight,
  label = 'Total',
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
      style.backgroundColor = '#f9fafb';
    } else if (pinnedRightSet.has(field)) {
      style.position = 'sticky';
      style.right = `${rightOffsets[field]}px`;
      style.zIndex = 20;
      style.backgroundColor = '#f9fafb';
    }

    return style;
  };

  const isFirstColumn = (field: string): boolean => {
    return displayColumnOrder[0] === field;
  };

  return (
    <div className="flex border-t-2 border-gray-300 bg-gray-50 font-semibold">
      {displayColumnOrder.map((field, columnIndex) => {
        const column = columnMap.get(field);
        if (!column) return null;

        const cellStyle = getPinnedCellStyle(field);
        const configs = fieldAggregateMap.get(field);

        // For the first column, show the label
        let cellContent: React.ReactNode;
        if (isFirstColumn(field) && columnIndex === 0) {
          cellContent = <span className="text-gray-700">{label}</span>;
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
                  <div key={idx} className="text-xs">
                    {configs.length > 1 && (
                      <span className="text-gray-500 mr-1">{displayLabel}:</span>
                    )}
                    <span className="text-gray-900">{formattedValue}</span>
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
            key={`footer-${field}`}
            className="px-3 py-2 text-sm border-r border-gray-200 flex-shrink-0"
            style={cellStyle}
          >
            {cellContent}
          </div>
        );
      })}
    </div>
  );
};
