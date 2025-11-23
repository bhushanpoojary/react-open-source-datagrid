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
      if (index > 0) {
        const globalIndex = columnOrder.indexOf(selectedVisible);
        const targetField = visibleColumns[index - 1].field;
        const targetGlobalIndex = columnOrder.indexOf(targetField);
        onReorderColumns(globalIndex, targetGlobalIndex);
      }
    }
  };

  const moveVisibleDown = () => {
    if (selectedVisible) {
      const index = visibleColumns.findIndex(col => col.field === selectedVisible);
      if (index < visibleColumns.length - 1) {
        const globalIndex = columnOrder.indexOf(selectedVisible);
        const targetField = visibleColumns[index + 1].field;
        const targetGlobalIndex = columnOrder.indexOf(targetField);
        onReorderColumns(globalIndex, targetGlobalIndex);
      }
    }
  };

  const panelContent = isOpen && (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} onClick={() => setIsOpen(false)} />
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          backgroundColor: '#fff',
          border: '2px solid #9ca3af',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          zIndex: 10000,
          opacity: 1,
          top: `${panelPosition.top}px`,
          left: `${panelPosition.left}px`,
          width: '600px',
          maxHeight: '500px',
        }}
      >
        <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Select Columns</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onResetLayout} style={{ fontSize: '12px', color: '#2563eb', fontWeight: '500', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'none', padding: 0 }} onMouseEnter={(e) => { e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.textDecoration = 'none'; }}>Reset</button>
            <button onClick={() => setIsOpen(false)} style={{ color: '#6b7280', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: 0, margin: 0 }} onMouseEnter={(e) => e.currentTarget.style.color = '#374151'} onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}>✕</button>
          </div>
        </div>
        <div style={{ padding: '16px', display: 'flex', gap: '12px', height: '400px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Available Columns ({availableColumns.length})</div>
            <div style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '4px', overflowY: 'scroll', backgroundColor: '#fff' }}>
              {availableColumns.map((column) => {
                const isSelected = selectedAvailable === column.field;
                return (
                  <div 
                    key={column.field} 
                    onClick={() => { 
                      setSelectedAvailable(column.field); 
                      setSelectedVisible(null); 
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#111827',
                      fontWeight: isSelected ? '600' : '400',
                    }}
                    onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#eff6ff')}
                    onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    {column.headerName}
                  </div>
                );
              })}
              {availableColumns.length === 0 && <div style={{ padding: '32px 12px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>All columns are visible</div>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
            <button onClick={moveToVisible} disabled={!selectedAvailable} style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: !selectedAvailable ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: !selectedAvailable ? 'not-allowed' : 'pointer' }} onMouseEnter={(e) => !selectedAvailable ? null : e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseLeave={(e) => !selectedAvailable ? null : e.currentTarget.style.backgroundColor = '#3b82f6'} title="Add selected">&gt;</button>
            <button onClick={moveAllToVisible} disabled={availableColumns.length === 0} style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: availableColumns.length === 0 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: availableColumns.length === 0 ? 'not-allowed' : 'pointer' }} onMouseEnter={(e) => availableColumns.length === 0 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseLeave={(e) => availableColumns.length === 0 ? null : e.currentTarget.style.backgroundColor = '#3b82f6'} title="Add all">&gt;&gt;</button>
            <button onClick={moveToAvailable} disabled={!selectedVisible || visibleColumns.length === 1} style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: !selectedVisible || visibleColumns.length === 1 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: !selectedVisible || visibleColumns.length === 1 ? 'not-allowed' : 'pointer' }} onMouseEnter={(e) => !selectedVisible || visibleColumns.length === 1 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseLeave={(e) => !selectedVisible || visibleColumns.length === 1 ? null : e.currentTarget.style.backgroundColor = '#3b82f6'} title="Remove selected">&lt;</button>
            <button onClick={moveAllToAvailable} disabled={visibleColumns.length === 0} style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: visibleColumns.length === 0 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: visibleColumns.length === 0 ? 'not-allowed' : 'pointer' }} onMouseEnter={(e) => visibleColumns.length === 0 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseLeave={(e) => visibleColumns.length === 0 ? null : e.currentTarget.style.backgroundColor = '#3b82f6'} title="Remove all">&lt;&lt;</button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Visible Columns ({visibleColumns.length})</div>
            <div style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '4px', overflowY: 'scroll', backgroundColor: '#fff' }}>
              {visibleColumns.map((column) => {
                const isSelected = selectedVisible === column.field;
                return (
                  <div 
                    key={column.field} 
                    onClick={() => { 
                      setSelectedVisible(column.field); 
                      setSelectedAvailable(null); 
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#111827',
                      fontWeight: isSelected ? '600' : '400',
                    }}
                    onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#eff6ff')}
                    onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    {column.headerName}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
            <button 
              onClick={() => {
                moveVisibleUp();
              }} 
              disabled={!selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0}
              style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '18px', backgroundColor: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0 ? 'not-allowed' : 'pointer' }}
              onMouseEnter={(e) => !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === 0 ? null : e.currentTarget.style.backgroundColor = '#3b82f6'}
              title="Move up">
              ▲
            </button>
            <button 
              onClick={() => {
                moveVisibleDown();
              }} 
              disabled={!selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1}
              style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '18px', backgroundColor: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1 ? '#d1d5db' : '#3b82f6', color: '#fff', borderRadius: '4px', border: 'none', cursor: !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1 ? 'not-allowed' : 'pointer' }}
              onMouseEnter={(e) => !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1 ? null : e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => !selectedVisible || visibleColumns.findIndex(c => c.field === selectedVisible) === visibleColumns.length - 1 ? null : e.currentTarget.style.backgroundColor = '#3b82f6'}
              title="Move down">
              ▼
            </button>
          </div>
        </div>
        <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => {
              setSelectedAvailable(null);
              setSelectedVisible(null);
              setIsOpen(false);
            }} 
            style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#2563eb', color: '#fff', fontSize: '14px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
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
        style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', fontSize: '14px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', transitionProperty: 'colors', cursor: 'pointer' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        title="Select Columns">
        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Columns
      </button>
      {panelContent && createPortal(panelContent, document.body)}
    </>
  );
};
