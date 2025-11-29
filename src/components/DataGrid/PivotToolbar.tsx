/**
 * PivotToolbar Component
 * 
 * Exportable toolbar for configuring pivot table settings
 * Can be used standalone by npm package consumers
 */

import React, { useState, useMemo } from 'react';
import type { PivotConfig, AggregatorType } from './pivotEngine';

export interface PivotToolbarProps {
  /** Available columns for pivot/grouping/values */
  columns: Array<{ field: string; headerName: string }>;
  /** Current pivot configuration */
  pivotConfig?: Partial<PivotConfig> | null;
  /** Callback when pivot is enabled/disabled */
  onPivotToggle: (enabled: boolean) => void;
  /** Callback when configuration changes */
  onConfigChange: (config: PivotConfig | null) => void;
  /** Whether pivot mode is currently active */
  isPivotMode?: boolean;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

const AGGREGATOR_OPTIONS: Array<{ value: AggregatorType; label: string }> = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
];

export const PivotToolbar: React.FC<PivotToolbarProps> = ({
  columns,
  pivotConfig,
  onPivotToggle,
  onConfigChange,
  isPivotMode = false,
  style,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(isPivotMode);
  const [rowGroupColumn, setRowGroupColumn] = useState(pivotConfig?.rowGroupColumn || '');
  const [pivotColumn, setPivotColumn] = useState(pivotConfig?.pivotColumn || '');
  const [valueColumn, setValueColumn] = useState(pivotConfig?.valueColumn || '');
  const [aggregator, setAggregator] = useState<AggregatorType>(
    (pivotConfig?.aggregator as AggregatorType) || 'sum'
  );
  const [showTotals, setShowTotals] = useState(pivotConfig?.showTotals ?? true);
  const [showGrandTotal, setShowGrandTotal] = useState(pivotConfig?.showGrandTotal ?? true);

  // Check if configuration is valid
  const isConfigValid = useMemo(() => {
    return rowGroupColumn && pivotColumn && valueColumn;
  }, [rowGroupColumn, pivotColumn, valueColumn]);

  // Handle Apply Pivot
  const handleApply = () => {
    if (!isConfigValid) return;

    const config: PivotConfig = {
      rowGroupColumn,
      pivotColumn,
      valueColumn,
      aggregator,
      showTotals,
      showGrandTotal,
    };

    onConfigChange(config);
    onPivotToggle(true);
  };

  // Handle Clear Pivot
  const handleClear = () => {
    setRowGroupColumn('');
    setPivotColumn('');
    setValueColumn('');
    setAggregator('sum');
    setShowTotals(true);
    setShowGrandTotal(true);
    onConfigChange(null);
    onPivotToggle(false);
    setIsExpanded(false);
  };

  // Toggle expansion
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px',
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isExpanded ? '12px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            Pivot Table
          </h3>
          {isPivotMode && (
            <span style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontSize: '11px',
              fontWeight: '600'
            }}>
              Active
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {isPivotMode && (
            <button
              onClick={handleClear}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#dc2626',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fecaca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
              }}
            >
              Clear Pivot
            </button>
          )}
          <button
            onClick={handleToggle}
            style={{
              padding: '6px 10px',
              fontSize: '13px',
              color: '#64748b',
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Configuration Panel */}
      {isExpanded && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {/* Row Group Column */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
              Row Group By <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={rowGroupColumn}
              onChange={(e) => setRowGroupColumn(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '13px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              <option value="">Select column...</option>
              {columns.map((col) => (
                <option key={col.field} value={col.field}>
                  {col.headerName}
                </option>
              ))}
            </select>
          </div>

          {/* Pivot Column */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
              Pivot Column <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={pivotColumn}
              onChange={(e) => setPivotColumn(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '13px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              <option value="">Select column...</option>
              {columns.map((col) => (
                <option key={col.field} value={col.field}>
                  {col.headerName}
                </option>
              ))}
            </select>
          </div>

          {/* Value Column */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
              Value Column <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={valueColumn}
              onChange={(e) => setValueColumn(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '13px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              <option value="">Select column...</option>
              {columns.map((col) => (
                <option key={col.field} value={col.field}>
                  {col.headerName}
                </option>
              ))}
            </select>
          </div>

          {/* Aggregation */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
              Aggregation
            </label>
            <select
              value={aggregator}
              onChange={(e) => setAggregator(e.target.value as AggregatorType)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '13px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              {AGGREGATOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showTotals}
                onChange={(e) => setShowTotals(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Show Totals Row
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showGrandTotal}
                onChange={(e) => setShowGrandTotal(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Show Grand Total Column
            </label>
          </div>

          {/* Apply Button */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleApply}
              disabled={!isConfigValid}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: isConfigValid ? '#2563eb' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: isConfigValid ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                boxShadow: isConfigValid ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (isConfigValid) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseLeave={(e) => {
                if (isConfigValid) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }
              }}
            >
              Apply Pivot
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      {isExpanded && (
        <div style={{ 
          marginTop: '12px', 
          padding: '10px', 
          backgroundColor: '#eff6ff', 
          border: '1px solid #bfdbfe',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#1e40af'
        }}>
          <strong>💡 Tip:</strong> Select a Row Group column to organize data by, a Pivot column whose values become new columns, and a Value column to aggregate.
        </div>
      )}
    </div>
  );
};

export default PivotToolbar;
