import React from 'react';
import type { Row } from './types';
import './MasterDetailCell.css';

interface DetailRowProps {
  masterRow: Row;
  rowIndex: number;
  renderDetailRow: (params: { masterRow: Row; rowIndex: number }) => React.ReactNode;
  columnCount: number;
  detailRowHeight?: number;
  detailRowAutoHeight?: boolean;
}

/**
 * DetailRow component - renders the detail content below an expanded master row
 */
export const DetailRow: React.FC<DetailRowProps> = ({
  masterRow,
  rowIndex,
  renderDetailRow,
  columnCount,
  detailRowHeight = 200,
  detailRowAutoHeight = false,
}) => {
  const style: React.CSSProperties = detailRowAutoHeight
    ? { minHeight: detailRowHeight }
    : { height: detailRowHeight };

  return (
    <tr className="detail-row-wrapper">
      <td 
        className="detail-row-cell" 
        colSpan={columnCount}
        style={{ padding: 0 }}
      >
        <div className="detail-row" style={style}>
          <div className="detail-row-content">
            {renderDetailRow({ masterRow, rowIndex })}
          </div>
        </div>
      </td>
    </tr>
  );
};
