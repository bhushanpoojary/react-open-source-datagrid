import React from 'react';

/**
 * Cell Renderer Components
 * 
 * Reusable custom cell renderer components for common use cases:
 * - StatusChip: Badge component for status indicators
 * - ProgressBar: Visual progress bar
 * - IconCell: Cell with icon
 * - ImageCell: Cell with image
 * - ButtonCell: Actionable button in cell
 * - BadgeCell: Generic badge component
 */

// Status Chip Component
interface StatusChipProps {
  status: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    const normalized = status.toLowerCase();
    
    switch (normalized) {
      case 'active':
        return {
          bg: '#dcfce7',
          text: '#15803d',
          border: '#86efac',
        };
      case 'inactive':
        return {
          bg: '#fee2e2',
          text: '#991b1b',
          border: '#fca5a5',
        };
      case 'pending':
        return {
          bg: '#fef3c7',
          text: '#92400e',
          border: '#fde047',
        };
      case 'completed':
        return {
          bg: '#dbeafe',
          text: '#1e40af',
          border: '#93c5fd',
        };
      default:
        return {
          bg: '#f3f4f6',
          text: '#374151',
          border: '#d1d5db',
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
      }}
    >
      {status}
    </span>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  color = '#3b82f6',
  showLabel = true,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
      <div
        style={{
          flex: 1,
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clampedValue}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', minWidth: '35px' }}>
          {clampedValue}%
        </span>
      )}
    </div>
  );
};

// Icon Cell Component
interface IconCellProps {
  icon: string; // emoji or text icon
  text?: string;
  iconColor?: string;
}

export const IconCell: React.FC<IconCellProps> = ({ icon, text, iconColor }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '16px', color: iconColor }}>{icon}</span>
      {text && <span style={{ fontSize: '13px' }}>{text}</span>}
    </div>
  );
};

// Image Cell Component
interface ImageCellProps {
  src: string;
  alt: string;
  text?: string;
  size?: number;
}

export const ImageCell: React.FC<ImageCellProps> = ({ 
  src, 
  alt, 
  text,
  size = 32,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #e5e7eb',
        }}
      />
      {text && <span style={{ fontSize: '13px' }}>{text}</span>}
    </div>
  );
};

// Button Cell Component
interface ButtonCellProps {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const ButtonCell: React.FC<ButtonCellProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false,
}) => {
  const getButtonStyles = () => {
    if (disabled) {
      return {
        bg: '#e5e7eb',
        text: '#9ca3af',
        border: '#d1d5db',
        cursor: 'not-allowed',
      };
    }

    switch (variant) {
      case 'primary':
        return {
          bg: '#3b82f6',
          text: '#ffffff',
          border: '#2563eb',
          cursor: 'pointer',
        };
      case 'secondary':
        return {
          bg: '#ffffff',
          text: '#374151',
          border: '#d1d5db',
          cursor: 'pointer',
        };
      case 'danger':
        return {
          bg: '#ef4444',
          text: '#ffffff',
          border: '#dc2626',
          cursor: 'pointer',
        };
    }
  };

  const styles = getButtonStyles();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent row selection
        if (!disabled) onClick(e);
      }}
      disabled={disabled}
      style={{
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
        borderRadius: '4px',
        cursor: styles.cursor,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = '#2563eb';
        } else if (!disabled && variant === 'secondary') {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        } else if (!disabled && variant === 'danger') {
          e.currentTarget.style.backgroundColor = '#dc2626';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = styles.bg;
        }
      }}
    >
      {label}
    </button>
  );
};

// Badge Cell Component
interface BadgeCellProps {
  text: string;
  color?: string;
  backgroundColor?: string;
}

export const BadgeCell: React.FC<BadgeCellProps> = ({ 
  text, 
  color = '#1f2937',
  backgroundColor = '#f3f4f6',
}) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor,
        color,
      }}
    >
      {text}
    </span>
  );
};

// Priority Indicator Component
interface PriorityIndicatorProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority }) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'low':
        return { icon: '●', color: '#10b981', text: 'Low' };
      case 'medium':
        return { icon: '●', color: '#f59e0b', text: 'Medium' };
      case 'high':
        return { icon: '●', color: '#ef4444', text: 'High' };
      case 'critical':
        return { icon: '●', color: '#991b1b', text: 'Critical' };
    }
  };

  const styles = getPriorityStyles();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ color: styles.color, fontSize: '18px' }}>{styles.icon}</span>
      <span style={{ fontSize: '13px', fontWeight: 500 }}>{styles.text}</span>
    </div>
  );
};

// Rating Component
interface RatingProps {
  rating: number; // 0-5
  maxRating?: number;
}

export const Rating: React.FC<RatingProps> = ({ rating, maxRating = 5 }) => {
  const stars = Array.from({ length: maxRating }, (_, i) => i < rating ? '★' : '☆');

  return (
    <div style={{ display: 'flex', gap: '2px', fontSize: '14px', color: '#f59e0b' }}>
      {stars.map((star, i) => (
        <span key={i}>{star}</span>
      ))}
    </div>
  );
};

// Currency Cell Component
interface CurrencyCellProps {
  amount: number;
  currency?: string;
  locale?: string;
}

export const CurrencyCell: React.FC<CurrencyCellProps> = ({ 
  amount, 
  currency = 'USD',
  locale = 'en-US',
}) => {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);

  return (
    <span style={{ fontWeight: 500, color: amount < 0 ? '#ef4444' : '#059669' }}>
      {formatted}
    </span>
  );
};
