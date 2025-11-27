import React from 'react';
import type { DataGridProps } from './types';
import type { GridApi } from './gridApi.types';
/**
 * DataGrid Component
 *
 * A feature-rich data grid component with sorting, filtering, pagination,
 * column resizing, column reordering, row selection, cell editing, and keyboard navigation.
 *
 * Features:
 * - Sortable columns (click header to sort asc/desc/none)
 * - Column filtering (text filter for each column)
 * - Pagination with configurable page size (10, 20, 50)
 * - Column resizing (drag column border to resize)
 * - Column reorder (drag and drop column headers)
 * - Row selection (single click, Ctrl+click for multi, Shift+click for range)
 * - Editable cells (double-click to edit, Enter to confirm, Escape to cancel)
 * - Keyboard navigation (arrow keys to move focus, Enter to edit)
 * - Sticky header (header stays visible when scrolling)
 * - Grid API: Programmatic control via ref (AG Grid-inspired API)
 */
export declare const DataGrid: React.ForwardRefExoticComponent<DataGridProps & React.RefAttributes<GridApi>>;
