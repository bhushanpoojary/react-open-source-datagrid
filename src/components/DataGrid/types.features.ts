// Feature-specific configuration types for the DataGrid
// (row pinning, drag, market data, context menu, tooltips, master/detail).
import React from 'react';
import type { Row, Column } from './types.model';

// Row pinning configuration
export interface RowPinConfig {
  enabled: boolean; // Enable row pinning feature
  showPinButton?: boolean; // Show pin button in row (default: false)
  maxPinnedTop?: number; // Max rows pinned to top (default: unlimited)
  maxPinnedBottom?: number; // Max rows pinned to bottom (default: unlimited)
  onPinChange?: (pinnedTop: (string | number)[], pinnedBottom: (string | number)[]) => void;
}

// Row dragging configuration
export interface DragRowConfig {
  enabled: boolean;
  showDragHandle?: boolean; // Show explicit drag handle (default: true)
  allowCrossGroup?: boolean; // Allow dragging across groups (default: false)
  allowExternalDrop?: boolean; // Allow dropping from external sources (default: false)
  dragHandlePosition?: 'left' | 'right'; // Position of drag handle (default: 'left')
  onDragStart?: (row: Row, rowIndex: number) => void; // Called when drag starts
  onDragEnd?: () => void; // Called when drag ends
  onRowDrop?: (sourceIndex: number, targetIndex: number, row: Row) => void;
  onRowMove?: (sourceIndex: number, targetIndex: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onExternalDrop?: (data: any, targetIndex: number) => void;
}

// Market Data Mode Configuration
export interface MarketDataConfig {
  enabled: boolean; // Enable market data mode
  flashDuration?: number; // Flash animation duration in ms
  enableFlash?: boolean; // Enable cell flash animations
  enableLiveSorting?: boolean; // Enable real-time sorting
  enableRankingMovement?: boolean; // Enable row position changes
  batchInterval?: number; // Update batching interval in ms
  maxUpdatesPerFrame?: number; // Max updates per RAF
  cpuThreshold?: number; // CPU usage threshold for throttling
  densityMode?: boolean; // Use compact layout
}

// Cell Update for Market Data
export interface CellUpdate {
  rowId: string | number;
  field: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oldValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newValue: any;
  timestamp: number;
}

// Flash Animation
export interface FlashAnimation {
  cellKey: string;
  direction: 'up' | 'down';
  startTime: number;
  duration: number;
}

// Context Menu types
export interface ContextMenuItem {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  type?: 'item' | 'separator';
  shortcut?: string;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuConfig {
  enabled?: boolean; // Enable/disable context menu (default: true)
  showCopy?: boolean; // Show copy options (default: true)
  showExport?: boolean; // Show export options (default: true)
  showColumnOptions?: boolean; // Show pin/hide/resize options (default: true)
  showFilterByValue?: boolean; // Show filter by value option (default: true)
  showChartOptions?: boolean; // Show chart creation options (default: true)
  customItems?: ContextMenuItem[]; // Additional custom menu items
  onBeforeShow?: (event: ContextMenuEvent) => ContextMenuItem[] | null; // Customize menu before showing
  onCreateChart?: (chartType: 'line' | 'bar' | 'area' | 'pie', selectedRows: Set<string | number>, row?: Row, column?: Column) => void; // Callback for chart creation
}

export interface ContextMenuEvent {
  type: 'cell' | 'header' | 'row';
  row?: Row;
  column?: Column;
  rowIndex?: number;
  columnIndex?: number;
  event: React.MouseEvent;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  contextType: 'cell' | 'header' | 'row' | null;
  targetRow?: Row;
  targetColumn?: Column;
  targetRowIndex?: number;
  targetColumnIndex?: number;
}

// Tooltip types
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipContent {
  title?: string;
  content: React.ReactNode;
}

export interface TooltipConfig {
  enabled?: boolean; // Enable/disable tooltips (default: true)
  showDelay?: number; // Delay before showing tooltip in ms (default: 500)
  hideDelay?: number; // Delay before hiding tooltip in ms (default: 0)
  placement?: TooltipPlacement; // Preferred placement (default: 'auto')
  offset?: number; // Distance from target in pixels (default: 8)
  maxWidth?: number; // Max width of tooltip in pixels (default: 300)
  showCellTooltips?: boolean; // Show tooltips on cell hover (default: false)
  showRowTooltips?: boolean; // Show tooltips on row hover (default: false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellTooltip?: (row: Row, column: Column, value: any) => TooltipContent | string | null;
  getRowTooltip?: (row: Row, rowIndex: number) => TooltipContent | string | null;
}

export interface TooltipState {
  isVisible: boolean;
  x: number;
  y: number;
  placement: TooltipPlacement;
  content: TooltipContent | null;
  targetRect: DOMRect | null;
}

// Master/Detail types
export interface MasterDetailConfig {
  enabled: boolean; // Enable/disable master-detail mode
  isRowMaster?: (row: Row) => boolean; // Callback to determine if row is a master row
  renderDetailRow: (params: { masterRow: Row; rowIndex: number }) => React.ReactNode; // Render function for detail row content
  detailRowHeight?: number; // Fixed height for detail rows (default: 200)
  detailRowAutoHeight?: boolean; // If true, detail row height adapts to content
  defaultExpandedMasterRowKeys?: (string | number)[]; // Row IDs to expand by default
  onDetailRowToggled?: (params: { masterRow: Row; rowIndex: number; isOpen: boolean }) => void; // Callback when detail row is toggled
}
