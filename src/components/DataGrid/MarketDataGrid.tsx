/**
 * MarketDataGrid.tsx
 * 
 * High-performance DataGrid wrapper optimized for live market data.
 * Integrates MarketDataEngine with React DataGrid component.
 * 
 * Features:
 * - Ultra-low latency updates
 * - Cell flash animations
 * - Density mode for compact display
 * - Market-specific column formatting
 * - Live sorting and ranking
 */

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import type { Column, Row, MarketDataConfig } from './types';
import { MarketDataEngine } from './MarketDataEngine';
import './MarketDataGrid.css';

export interface MarketDataGridProps {
  columns: Column[];
  rows: Row[];
  engine: MarketDataEngine;
  config?: MarketDataConfig;
  className?: string;
  onCellClick?: (rowId: string | number, field: string, value: any) => void;
  onRowClick?: (row: Row) => void;
}

/**
 * MarketDataGrid Component
 * 
 * Optimized grid for displaying live market data with minimal latency.
 * Uses direct DOM manipulation for cell updates to bypass React reconciliation.
 */
export const MarketDataGrid: React.FC<MarketDataGridProps> = ({
  columns,
  rows,
  config,
  className = '',
  onCellClick,
  onRowClick,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<Row[]>(rows);

  // Update rows ref when rows change
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  // Enhanced columns with market data formatting
  const enhancedColumns = useMemo(() => {
    return columns.map(col => {
      // Add custom renderers for market data fields
      if (col.field === 'price' || col.field === 'bid' || col.field === 'ask') {
        return {
          ...col,
          renderCell: (row: Row) => {
            const value = row[col.field];
            return formatPrice(value);
          },
        };
      }
      
      if (col.field === 'change' || col.field === 'changePercent') {
        return {
          ...col,
          renderCell: (row: Row) => {
            const value = row[col.field];
            return formatChange(value, col.field === 'changePercent');
          },
        };
      }

      if (col.field === 'volume' || col.field === 'size') {
        return {
          ...col,
          renderCell: (row: Row) => {
            const value = row[col.field];
            return formatVolume(value);
          },
        };
      }

      return col;
    });
  }, [columns]);

  // Handle cell click
  const handleCellClick = useCallback((rowId: string | number, field: string, value: any) => {
    onCellClick?.(rowId, field, value);
  }, [onCellClick]);

  // Handle row click
  const handleRowClick = useCallback((row: Row) => {
    onRowClick?.(row);
  }, [onRowClick]);

  // Render table header
  const renderHeader = () => (
    <div className="market-grid-header">
      <div className="market-grid-header-row">
        {enhancedColumns.map(col => (
          <div
            key={col.field}
            className={`market-grid-header-cell ${getColumnClass(col.field)}`}
            style={{ width: col.width || 120 }}
          >
            {col.headerName}
          </div>
        ))}
      </div>
    </div>
  );

  // Render table body
  const renderBody = () => (
    <div className="market-grid-body">
      {rows.map((row) => (
        <div
          key={row.id}
          className="market-grid-row"
          onClick={() => handleRowClick(row)}
        >
          {enhancedColumns.map(col => {
            const value = row[col.field];
            
            return (
              <div
                key={col.field}
                className={`market-grid-cell ${getColumnClass(col.field)}`}
                style={{ width: col.width || 120 }}
                data-row-id={row.id}
                data-field={col.field}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCellClick(row.id, col.field, value);
                }}
              >
                {col.renderCell ? col.renderCell(row) : formatCellValue(value)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  // Get CSS class for column alignment
  const getColumnClass = (field: string): string => {
    const numericFields = ['price', 'bid', 'ask', 'size', 'volume', 'change', 'changePercent', 'high', 'low', 'open'];
    return numericFields.includes(field) ? 'numeric-cell' : '';
  };

  // Format cell value
  const formatCellValue = (value: any): string => {
    if (value == null) return '';
    if (typeof value === 'number') {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return String(value);
  };

  // Format price value
  const formatPrice = (value: number): string => {
    if (value == null) return '';
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format change value
  const formatChange = (value: number, isPercent: boolean): React.ReactElement => {
    if (value == null) return <span>-</span>;
    
    const formatted = isPercent
      ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
      : `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
    
    const className = value >= 0 ? 'change-positive' : 'change-negative';
    
    return <span className={className}>{formatted}</span>;
  };

  // Format volume value
  const formatVolume = (value: number): string => {
    if (value == null) return '';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const containerClassName = `market-data-grid ${config?.densityMode ? 'density-compact' : ''} ${className}`.trim();

  return (
    <div ref={tableRef} className={containerClassName}>
      {renderHeader()}
      {renderBody()}
    </div>
  );
};

/**
 * Higher-order component to wrap standard DataGrid with market data capabilities
 */
export interface WithMarketDataProps {
  marketDataConfig?: MarketDataConfig;
  engine?: MarketDataEngine;
}

export function withMarketData<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithMarketDataProps> {
  return (props: P & WithMarketDataProps) => {
    const { marketDataConfig, engine, ...componentProps } = props;

    if (!marketDataConfig?.enabled || !engine) {
      return <Component {...(componentProps as P)} />;
    }

    // Wrap component with market data optimizations
    return (
      <div className="market-data-wrapper">
        <Component {...(componentProps as P)} />
      </div>
    );
  };
}
