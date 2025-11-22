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
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-300">
      {/* Left side: Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <select
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Center: Row count info */}
      <div className="text-sm text-gray-700">
        {totalRows === 0 ? (
          'No rows'
        ) : (
          <>
            {startRow}-{endRow} of {totalRows}
          </>
        )}
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        <button
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          title="First page"
        >
          «
        </button>

        {/* Previous page button */}
        <button
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => handlePageChange(page as number)}
            >
              {(page as number) + 1}
            </button>
          );
        })}

        {/* Next page button */}
        <button
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          title="Next page"
        >
          ›
        </button>

        {/* Last page button */}
        <button
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
