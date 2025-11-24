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
  dispatch,
}) => {
  // Find the column for this group
  const column = columns.find(col => col.field === group.field);
  const columnName = column?.headerName || group.field;

  // Toggle group expansion
  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_GROUP', payload: group.groupKey });
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minWidth: 'fit-content',
        height: 'auto',
        minHeight: '44px',
        paddingLeft: `${group.level * 24 + 16}px`,
        paddingRight: '16px',
        background: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
        backgroundColor: '#eff6ff',
        borderBottom: '1px solid #bfdbfe',
        cursor: 'pointer',
        transition: 'background 150ms ease-in-out',
        zIndex: 100,
      }}
      onClick={handleToggle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(to right, #dbeafe, #c7d2fe)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(to right, #eff6ff, #e0e7ff)';
      }}
    >
      {/* Expand/Collapse Icon */}
      <div style={{ 
        flexShrink: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '20px', 
        height: '20px',
        marginRight: '8px'
      }}>
        <svg
          style={{ 
            width: '14px', 
            height: '14px',
            transform: group.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease-in-out',
          }}
          fill="none"
          stroke="#2563eb"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Group Label */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        flexShrink: 0
      }}>
        <span style={{ fontWeight: 600, color: '#374151', fontSize: '13px', whiteSpace: 'nowrap' }}>
          {columnName}:
        </span>
        <span style={{ 
          color: '#111827', 
          fontWeight: 600, 
          fontSize: '13px',
          whiteSpace: 'nowrap'
        }}>
          {group.groupValue === null || group.groupValue === undefined
            ? '(empty)'
            : String(group.groupValue)}
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1, minWidth: '16px' }} />

      {/* Group Badge */}
      <div style={{ flexShrink: 0 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '32px',
          height: '24px',
          padding: '2px 10px',
          fontSize: '12px',
          fontWeight: 600,
          backgroundColor: '#2563eb',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}>
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
      style.backgroundColor = '#eff6ff';
    } else if (pinnedRightSet.has(field)) {
      style.position = 'sticky';
      style.right = `${rightOffsets[field]}px`;
      style.zIndex = 20;
      style.backgroundColor = '#eff6ff';
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
    <div 
      style={{ 
        display: 'flex',
        minWidth: '100%',
        height: 'auto',
        minHeight: '40px',
        borderTop: '2px solid #93c5fd',
        background: '#eff6ff',
        backgroundColor: '#eff6ff',
        fontWeight: 600,
        fontSize: '13px',
        position: 'relative',
        zIndex: 50
      }}
    >
      {displayColumnOrder.map((field, columnIndex) => {
        const column = columnMap.get(field);
        if (!column) return null;

        const cellStyle = getPinnedCellStyle(field);
        const configs = fieldAggregateMap.get(field);

        // For the first column, show the label
        let cellContent: React.ReactNode;
        if (isFirstColumn(field) && columnIndex === 0) {
          cellContent = (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <span 
                style={{ 
                  color: "#1f2937", 
                  marginLeft: `${group.level * 24 + 16}px`,
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                {groupLabel}
              </span>
            </div>
          );
        } else if (configs && configs.length > 0) {
          // Show aggregates for this field
          cellContent = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center', height: '100%' }}>
              {configs.map((config, idx) => {
                const key = `${config.field}_${config.function}`;
                const value = aggregates[key];
                const formattedValue = formatAggregateValue(value, config.function);
                const displayLabel = config.label || getAggregateLabel(config.function);
                
                return (
                  <div key={idx} style={{ fontSize: "12px" }}>
                    {configs.length > 1 && (
                      <span style={{ color: '#4b5563', marginRight: '4px' }}>{displayLabel}:</span>
                    )}
                    <span style={{ color: '#111827', fontWeight: 600 }}>{formattedValue}</span>
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
            style={{
              ...cellStyle,
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid #bfdbfe',
              flexShrink: 0
            }}
          >
            {cellContent}
          </div>
        );
      })}
    </div>
  );
};
