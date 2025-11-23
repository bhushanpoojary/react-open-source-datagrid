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
    <div style={{ display: 'flex', borderTop: '2px solid #d1d5db', backgroundColor: '#f9fafb', fontWeight: '600' }}>
      {displayColumnOrder.map((field, columnIndex) => {
        const column = columnMap.get(field);
        if (!column) return null;

        const cellStyle = getPinnedCellStyle(field);
        const configs = fieldAggregateMap.get(field);

        // For the first column, show the label
        let cellContent: React.ReactNode;
        if (isFirstColumn(field) && columnIndex === 0) {
          cellContent = <span style={{ color: '#4b5563' }}>{label}</span>;
        } else if (configs && configs.length > 0) {
          // Show aggregates for this field
          cellContent = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {configs.map((config, idx) => {
                const key = `${config.field}_${config.function}`;
                const value = aggregates[key];
                const formattedValue = formatAggregateValue(value, config.function);
                const displayLabel = config.label || getAggregateLabel(config.function);
                
                return (
                  <div key={idx} style={{ fontSize: '12px' }}>
                    {configs.length > 1 && (
                      <span style={{ color: '#6b7280', marginRight: '4px' }}>{displayLabel}:</span>
                    )}
                    <span style={{ color: '#111827' }}>{formattedValue}</span>
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
            style={{
              ...cellStyle,
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              fontSize: '14px',
              borderRight: '1px solid #e5e7eb',
              flexShrink: 0,
            }}
          >
            {cellContent}
          </div>
        );
      })}
    </div>
  );
};
