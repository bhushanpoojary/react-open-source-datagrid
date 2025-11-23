import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Column } from './types';

interface ColumnChooserProps {
  columns: Column[];
  columnOrder: string[];
  hiddenColumns: string[];
  onToggleVisibility: (field: string) => void;
  onReorderColumns: (fromIndex: number, toIndex: number) => void;
  onResetLayout: () => void;
}

export const ColumnChooser: React.FC<ColumnChooserProps> = ({
  columns,
  columnOrder,
  hiddenColumns,
  onToggleVisibility,
  onReorderColumns,
  onResetLayout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hiddenSet = new Set(hiddenColumns);

  // Create a map for quick column lookup
  const columnMap = new Map(columns.map(col => [col.field, col]));

  // Get ordered columns
  const orderedColumns = columnOrder
    .map(field => columnMap.get(field))
    .filter((col): col is Column => col !== undefined);

  // Update panel position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 8,
        left: rect.right - 320, // 320px = w-80
      });
    }
  }, [isOpen]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && index !== draggedIndex) {
      setDropTargetIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && index !== draggedIndex) {
      onReorderColumns(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && index !== draggedIndex) {
      setDropTargetIndex(index);
    }
  };

  const visibleCount = orderedColumns.filter(col => !hiddenSet.has(col.field)).length;

  const panelContent = isOpen && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100]"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed w-80 bg-white border-2 border-gray-300 rounded-lg shadow-2xl z-[101] overflow-hidden"
        style={{
          top: `${panelPosition.top}px`,
          left: `${panelPosition.left}px`,
          maxHeight: '500px',
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Column Visibility
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {visibleCount} of {orderedColumns.length} visible
            </p>
          </div>
          <button
            onClick={onResetLayout}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
            title="Reset to default layout"
          >
            Reset Layout
          </button>
        </div>

        {/* Column List */}
        <div className="max-h-96 overflow-y-auto bg-white">
          <div className="p-3 text-xs text-gray-600 bg-gray-50 border-b border-gray-200 font-semibold">
            ⬍ Drag to reorder columns
          </div>
          <div className="bg-white">
            {orderedColumns.map((column, index) => {
              const isVisible = !hiddenSet.has(column.field);
              const isDragging = draggedIndex === index;
              const isDropTarget = dropTargetIndex === index;

              return (
                <div
                  key={column.field}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100
                    ${isDragging ? 'opacity-50 bg-blue-50' : ''}
                    ${isDropTarget ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}
                  `}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab', minHeight: '48px' }}
                >
                  {/* Drag Handle */}
                  <div className="text-gray-400 flex-shrink-0" style={{ fontSize: '18px', lineHeight: '1' }}>
                    ⋮⋮
                  </div>

                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onToggleVisibility(column.field)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  {/* Column Name */}
                  <div className="flex-1 text-sm font-medium text-gray-900">
                    {column.headerName || column.field}
                  </div>

                  {/* Visibility Indicator */}
                  <div className="text-xs flex-shrink-0">
                    {isVisible ? (
                      <span className="text-green-600">👁</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <span>Tip: Drag items to reorder</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
        title="Show/Hide Columns"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
        Columns
      </button>

      {panelContent && createPortal(panelContent, document.body)}
    </>
  );
};
