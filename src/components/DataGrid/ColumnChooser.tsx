import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
  const [selectedAvailable, setSelectedAvailable] = useState<string | null>(null);
  const [selectedVisible, setSelectedVisible] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Split columns into available (hidden) and visible - memoize to prevent re-creation on every render
  const availableColumns = useMemo(() => {
    const hiddenSet = new Set(hiddenColumns);
    const columnMap = new Map(columns.map(col => [col.field, col]));
    return columnOrder
      .map(field => columnMap.get(field))
      .filter((col): col is Column => col !== undefined && hiddenSet.has(col.field));
  }, [columnOrder, hiddenColumns, columns]);

  const visibleColumns = useMemo(() => {
    const hiddenSet = new Set(hiddenColumns);
    const columnMap = new Map(columns.map(col => [col.field, col]));
    return columnOrder
      .map(field => columnMap.get(field))
      .filter((col): col is Column => col !== undefined && !hiddenSet.has(col.field));
  }, [columnOrder, hiddenColumns, columns]);

  // Update panel position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 8,
        left: Math.max(20, rect.right - 600), // 600px wide panel
      });
    }
  }, [isOpen]);

  const moveToVisible = () => {
    if (selectedAvailable) {
      onToggleVisibility(selectedAvailable);
      setSelectedAvailable(null);
    }
  };

  const moveToAvailable = () => {
    if (selectedVisible) {
      onToggleVisibility(selectedVisible);
      setSelectedVisible(null);
    }
  };

  const moveAllToVisible = () => {
    availableColumns.forEach(col => onToggleVisibility(col.field));
    setSelectedAvailable(null);
  };

  const moveAllToAvailable = () => {
    visibleColumns.forEach(col => onToggleVisibility(col.field));
    setSelectedVisible(null);
  };

  const moveVisibleUp = () => {
    if (selectedVisible) {
      const index = visibleColumns.findIndex(col => col.field === selectedVisible);
      console.log('Move Up - Current index in visible list:', index, 'Total visible:', visibleColumns.length);
      if (index > 0) {
        const globalIndex = columnOrder.indexOf(selectedVisible);
        const targetField = visibleColumns[index - 1].field;
        const targetGlobalIndex = columnOrder.indexOf(targetField);
        console.log('Moving from global index', globalIndex, 'to', targetGlobalIndex);
        onReorderColumns(globalIndex, targetGlobalIndex);
      } else {
        console.log('Already at top of visible list');
      }
    } else {
      console.log('No column selected');
    }
  };

  const moveVisibleDown = () => {
    if (selectedVisible) {
      const index = visibleColumns.findIndex(col => col.field === selectedVisible);
      console.log('Move Down - Current index in visible list:', index, 'Total visible:', visibleColumns.length);
      if (index < visibleColumns.length - 1) {
        const globalIndex = columnOrder.indexOf(selectedVisible);
        const targetField = visibleColumns[index + 1].field;
        const targetGlobalIndex = columnOrder.indexOf(targetField);
        console.log('Moving from global index', globalIndex, 'to', targetGlobalIndex);
        onReorderColumns(globalIndex, targetGlobalIndex);
      } else {
        console.log('Already at bottom of visible list');
      }
    } else {
      console.log('No column selected');
    }
  };

  const panelContent = isOpen && (
    <>
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-30" onClick={() => setIsOpen(false)} />
      <div
        ref={panelRef}
        className="fixed bg-white border-2 border-gray-400 rounded-lg shadow-2xl z-[10000] opacity-100"
        style={{
          top: `${panelPosition.top}px`,
          left: `${panelPosition.left}px`,
          width: '600px',
          maxHeight: '500px',
        }}
      >
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Select Columns</h3>
          <div className="flex gap-2">
            <button onClick={onResetLayout} className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">Reset</button>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
        </div>
        <div className="p-4 flex gap-3" style={{ height: '400px' }}>
          <div className="flex-1 flex flex-col">
            <div className="text-xs font-semibold text-gray-700 mb-2">Available Columns ({availableColumns.length})</div>
            <div className="flex-1 border border-gray-300 rounded overflow-y-auto bg-white">
              {availableColumns.map((column) => {
                const isSelected = selectedAvailable === column.field;
                return (
                  <div 
                    key={column.field} 
                    onClick={() => { 
                      console.log('Selected available column:', column.headerName);
                      setSelectedAvailable(column.field); 
                      setSelectedVisible(null); 
                    }}
                    className={`px-3 py-2 cursor-pointer border-b border-gray-200 ${
                      isSelected 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-white text-gray-900 hover:bg-blue-50'
                    }`}
                  >
                    {column.headerName}
                  </div>
                );
              })}
              {availableColumns.length === 0 && <div className="px-3 py-8 text-center text-gray-400 text-sm">All columns are visible</div>}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <button onClick={moveToVisible} disabled={!selectedAvailable} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed" title="Add selected">&gt;</button>
            <button onClick={moveAllToVisible} disabled={availableColumns.length === 0} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed" title="Add all">&gt;&gt;</button>
            <button onClick={moveToAvailable} disabled={!selectedVisible || visibleColumns.length === 1} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed" title="Remove selected">&lt;</button>
            <button onClick={moveAllToAvailable} disabled={visibleColumns.length === 0} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed" title="Remove all">&lt;&lt;</button>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="text-xs font-semibold text-gray-700 mb-2">Visible Columns ({visibleColumns.length})</div>
            <div className="flex-1 border border-gray-300 rounded overflow-y-auto bg-white">
              {visibleColumns.map((column) => {
                const isSelected = selectedVisible === column.field;
                return (
                  <div 
                    key={column.field} 
                    onClick={() => { 
                      console.log('Selected visible column:', column.headerName, 'field:', column.field);
                      setSelectedVisible(column.field); 
                      setSelectedAvailable(null); 
                    }}
                    className={`px-3 py-2 cursor-pointer border-b border-gray-200 ${
                      isSelected 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-white text-gray-900 hover:bg-blue-50'
                    }`}
                  >
                    {column.headerName}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <button 
              onClick={() => {
                console.log('▲ Up button clicked. Selected:', selectedVisible);
                moveVisibleUp();
              }} 
              disabled={!selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0}
              className="px-3 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500" 
              title="Move up">
              ▲
            </button>
            <button 
              onClick={() => {
                console.log('▼ Down button clicked. Selected:', selectedVisible);
                moveVisibleDown();
              }} 
              disabled={!selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1}
              className="px-3 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500" 
              title="Move down">
              ▼
            </button>
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            onClick={() => {
              setSelectedAvailable(null);
              setSelectedVisible(null);
              setIsOpen(false);
            }} 
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
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
        onClick={() => {
          if (!isOpen) {
            setSelectedAvailable(null);
            setSelectedVisible(null);
          }
          setIsOpen(!isOpen);
        }}
        className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors" title="Select Columns">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Columns
      </button>
      {panelContent && createPortal(panelContent, document.body)}
    </>
  );
};
