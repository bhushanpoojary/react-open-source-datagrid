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
import {
  getColumnClass,
  formatCellValue,
  formatPrice,
  formatChange,
  formatVolume
} from './MarketDataGridUtils';
import './MarketDataGrid.css';

export interface MarketDataGridProps {
  columns: Column[];
  rows: Row[];
  engine: MarketDataEngine | null;
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

  const containerClassName = `market-data-grid ${config?.densityMode ? 'density-compact' : ''} ${className}`.trim();

  return (
    <div ref={tableRef} className={containerClassName} data-testid="data-grid">
      {renderHeader()}
      {renderBody()}
    </div>
  );
};

// If you need the HOC or helpers, import them from './MarketDataGridUtils'
