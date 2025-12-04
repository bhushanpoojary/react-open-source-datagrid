import React from 'react';
import type { Row } from './types';
import './MasterDetailCell.css';

interface MasterDetailCellProps {
  row: Row;
  isExpanded: boolean;
  isMasterRow: boolean;
  onToggle: () => void;
}

/**
 * MasterDetailCell component - renders the expand/collapse icon for master rows
 */
export const MasterDetailCell: React.FC<MasterDetailCellProps> = ({
  row: _row,
  isExpanded,
  isMasterRow,
  onToggle,
}) => {
  if (!isMasterRow) {
    return <div className="master-detail-cell-empty" />;
  }

  return (
    <div className="master-detail-cell">
      <button
        type="button"
        className="master-detail-toggle"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={isExpanded ? 'Collapse detail row' : 'Expand detail row'}
        aria-expanded={isExpanded}
      >
        <span className={`master-detail-icon ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>
    </div>
  );
};
