import type { MarketDataConfig } from './types';
import { MarketDataEngine } from './MarketDataEngine';
import React from 'react';

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

// Helper functions for formatting
export const getColumnClass = (field: string): string => {
  const numericFields = ['price', 'bid', 'ask', 'size', 'volume', 'change', 'changePercent', 'high', 'low', 'open'];
  return numericFields.includes(field) ? 'numeric-cell' : '';
};

export const formatCellValue = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'number') {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return String(value);
};

export const formatPrice = (value: number): string => {
  if (value == null) return '';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatChange = (value: number, isPercent: boolean): React.ReactElement => {
  if (value == null) return <span>-</span>;
  const formatted = isPercent
    ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
    : `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
  const className = value >= 0 ? 'change-positive' : 'change-negative';
  return <span className={className}>{formatted}</span>;
};

export const formatVolume = (value: number): string => {
  if (value == null) return '';
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};
