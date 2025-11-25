import React from 'react';
import type { DensityMode } from './densityModes';
import { getDensityLabel } from './densityModes';

export interface DensityToggleProps {
  value: DensityMode;
  onChange: (mode: DensityMode) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * DensityToggle Component
 * 
 * A segmented control for switching between Compact, Normal, and Comfortable density modes.
 * Displays as a horizontal button group with clear visual feedback.
 * 
 * @example
 * ```tsx
 * <DensityToggle 
 *   value={densityMode} 
 *   onChange={setDensityMode}
 * />
 * ```
 */
export const DensityToggle: React.FC<DensityToggleProps> = ({
  value,
  onChange,
  className = '',
  disabled = false,
}) => {
  const modes: DensityMode[] = ['ultraCompact', 'compact', 'normal', 'comfortable'];

  return (
    <div 
      className={`density-toggle ${className}`}
      style={{
        display: 'inline-flex',
        backgroundColor: 'var(--grid-bg-alt, #f3f4f6)',
        borderRadius: '6px',
        padding: '2px',
        border: '1px solid var(--grid-border, #e5e7eb)',
        gap: '2px',
      }}
      role="group"
      aria-label="Density mode selector"
    >
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          disabled={disabled}
          className={`density-toggle-button ${value === mode ? 'active' : ''}`}
          style={{
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: value === mode ? '600' : '500',
            color: value === mode 
              ? 'var(--grid-primary, #3b82f6)' 
              : 'var(--grid-text-secondary, #6b7280)',
            backgroundColor: value === mode 
              ? 'var(--grid-bg, #ffffff)' 
              : 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.5 : 1,
            outline: 'none',
            whiteSpace: 'nowrap',
            boxShadow: value === mode 
              ? '0 1px 2px rgba(0, 0, 0, 0.05)' 
              : 'none',
          }}
          onMouseEnter={(e) => {
            if (!disabled && value !== mode) {
              e.currentTarget.style.color = 'var(--grid-text, #111827)';
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && value !== mode) {
              e.currentTarget.style.color = 'var(--grid-text-secondary, #6b7280)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--grid-primary-light, #93c5fd)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = value === mode 
              ? '0 1px 2px rgba(0, 0, 0, 0.05)' 
              : 'none';
          }}
          aria-pressed={value === mode}
          aria-label={`${getDensityLabel(mode)} density mode`}
          type="button"
        >
          {getDensityLabel(mode)}
        </button>
      ))}
    </div>
  );
};
