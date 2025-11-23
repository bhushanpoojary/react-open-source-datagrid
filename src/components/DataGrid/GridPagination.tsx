import React from 'react';
import type { GridAction } from './types';

interface GridPaginationProps {
  currentPage: number;
  pageSize: number;
  totalRows: number;
  dispatch: React.Dispatch<GridAction>;
}

export const GridPagination: React.FC<GridPaginationProps> = ({
  currentPage,
  pageSize,
  totalRows,
  dispatch,
}) => {
  const totalPages = Math.ceil(totalRows / pageSize);
  const startRow = currentPage * pageSize + 1;
  const endRow = Math.min((currentPage + 1) * pageSize, totalRows);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      dispatch({ type: 'SET_PAGE', payload: newPage });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch({ type: 'SET_PAGE_SIZE', payload: newPageSize });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Max number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, current page and neighbors
      pages.push(0); // First page

      if (currentPage > 2) {
        pages.push('...');
      }

      // Show current page and neighbors
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      pages.push(totalPages - 1); // Last page
    }

    return pages;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', backgroundColor: 'var(--grid-footer-bg, #fafafa)', borderTop: 'var(--grid-border-width, 1px) solid var(--grid-border, #e2e8f0)' }}>
      {/* Left side: Page size selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: 'var(--grid-font-size, 13px)', color: 'var(--grid-text, #262626)', fontWeight: '500' }}>Rows per page:</span>
        <select
          style={{ 
            paddingLeft: '8px', 
            paddingRight: '8px', 
            paddingTop: '6px', 
            paddingBottom: '6px', 
            fontSize: 'var(--grid-font-size, 13px)', 
            border: 'var(--grid-border-width, 1px) solid var(--grid-border, #d9d9d9)', 
            borderRadius: 'var(--grid-border-radius, 3px)',
            backgroundColor: 'var(--grid-bg, #fff)',
            color: 'var(--grid-text, #262626)', 
            outline: 'none',
            cursor: 'pointer',
          }}
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--grid-primary, #0066cc)';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--grid-border, #d9d9d9)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Center: Row count info */}
      <div style={{ fontSize: 'var(--grid-font-size, 13px)', color: 'var(--grid-text-secondary, #666666)', fontWeight: '500' }}>
        {totalRows === 0 ? (
          'No rows'
        ) : (
          <>
            {startRow}-{endRow} of {totalRows}
          </>
        )}
      </div>

      {/* Right side: Page navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        {/* First page button */}
        <button
          style={{ 
            paddingLeft: '8px', 
            paddingRight: '8px', 
            paddingTop: '6px', 
            paddingBottom: '6px', 
            fontSize: 'var(--grid-font-size, 13px)', 
            border: 'var(--grid-border-width, 1px) solid var(--grid-border, #d9d9d9)', 
            borderRadius: 'var(--grid-border-radius, 3px)', 
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer', 
            opacity: currentPage === 0 ? 0.5 : 1,
            backgroundColor: 'var(--grid-bg, #ffffff)',
            color: 'var(--grid-text, #262626)',
          }}
          onMouseEnter={(e) => currentPage !== 0 && (e.currentTarget.style.backgroundColor = 'var(--grid-hover, #f0f2f5)')}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg, #ffffff)'}
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          title="First page"
        >
          «
        </button>

        {/* Previous page button */}
        <button
          style={{ 
            paddingLeft: '8px', 
            paddingRight: '8px', 
            paddingTop: '6px', 
            paddingBottom: '6px', 
            fontSize: 'var(--grid-font-size, 13px)', 
            border: 'var(--grid-border-width, 1px) solid var(--grid-border, #d9d9d9)', 
            borderRadius: 'var(--grid-border-radius, 3px)', 
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer', 
            opacity: currentPage === 0 ? 0.5 : 1,
            backgroundColor: 'var(--grid-bg, #ffffff)',
            color: 'var(--grid-text, #262626)',
          }}
          onMouseEnter={(e) => currentPage !== 0 && (e.currentTarget.style.backgroundColor = 'var(--grid-hover, #f0f2f5)')}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg, #ffffff)'}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          title="Previous page"
        >
          ‹
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '6px', paddingBottom: '6px', fontSize: 'var(--grid-font-size, 13px)', color: 'var(--grid-text-secondary, #bfbfbf)' }}>
                ...
              </span>
            );
          }

          const isCurrentPage = currentPage === page;
          return (
            <button
              key={page}
              style={{
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '6px',
                paddingBottom: '6px',
                fontSize: 'var(--grid-font-size, 13px)',
                fontWeight: isCurrentPage ? '500' : '400',
                border: isCurrentPage ? 'var(--grid-border-width, 1px) solid var(--grid-primary, #0066cc)' : 'var(--grid-border-width, 1px) solid var(--grid-border, #d9d9d9)',
                borderRadius: 'var(--grid-border-radius, 3px)',
                backgroundColor: isCurrentPage ? 'var(--grid-primary, #0066cc)' : 'var(--grid-bg, #ffffff)',
                color: isCurrentPage ? 'var(--grid-text-inverse, #fff)' : 'var(--grid-text, #262626)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => !isCurrentPage && (e.currentTarget.style.backgroundColor = 'var(--grid-hover, #f0f2f5)')}
              onMouseLeave={(e) => !isCurrentPage && (e.currentTarget.style.backgroundColor = 'var(--grid-bg, #ffffff)')}
              onClick={() => handlePageChange(page as number)}
            >
              {(page as number) + 1}
            </button>
          );
        })}

        {/* Next page button */}
        <button
          style={{ 
            paddingLeft: '8px', 
            paddingRight: '8px', 
            paddingTop: '6px', 
            paddingBottom: '6px', 
            fontSize: 'var(--grid-font-size, 13px)', 
            border: 'var(--grid-border-width, 1px) solid var(--grid-border, #d9d9d9)', 
            borderRadius: 'var(--grid-border-radius, 3px)', 
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', 
            opacity: currentPage === totalPages - 1 ? 0.5 : 1,
            backgroundColor: 'var(--grid-bg, #ffffff)',
            color: 'var(--grid-text, #262626)',
          }}
          onMouseEnter={(e) => currentPage !== totalPages - 1 && (e.currentTarget.style.backgroundColor = 'var(--grid-hover, #f0f2f5)')}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg, #ffffff)'}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          title="Next page"
        >
          ›
        </button>

        {/* Last page button */}
        <button
          style={{ 
            paddingLeft: '8px', 
            paddingRight: '8px', 
            paddingTop: '6px', 
            paddingBottom: '6px', 
            fontSize: 'var(--grid-font-size, 13px)', 
            border: 'var(--grid-border-width, 1px) solid var(--grid-border, #d9d9d9)', 
            borderRadius: 'var(--grid-border-radius, 3px)', 
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', 
            opacity: currentPage === totalPages - 1 ? 0.5 : 1,
            backgroundColor: 'var(--grid-bg, #ffffff)',
            color: 'var(--grid-text, #262626)',
          }}
          onMouseEnter={(e) => currentPage !== totalPages - 1 && (e.currentTarget.style.backgroundColor = 'var(--grid-hover, #f0f2f5)')}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--grid-bg, #ffffff)'}
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          title="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
};
