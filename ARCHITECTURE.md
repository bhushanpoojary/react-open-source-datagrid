# React DataGrid Architecture

> **For Contributors:** This document is your map to understanding how the grid works internally and where we need help optimizing performance.

## 🎯 Purpose of This Document

If you're a senior engineer interested in contributing, this guide will help you:
1. Understand the rendering pipeline quickly
2. Locate the performance-critical code paths
3. Identify opportunities for optimization
4. See where we need expert help

---

## 📋 Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Rendering Pipeline](#rendering-pipeline)
3. [State Management](#state-management)
4. [Virtual Scrolling Engine](#virtual-scrolling-engine)
5. [Infinite Scroll with Server-Side Data](#infinite-scroll-with-server-side-data)
6. [Performance Bottlenecks (Need Expert Help)](#performance-bottlenecks-need-expert-help)
7. [Component Hierarchy](#component-hierarchy)
8. [Key Files Reference](#key-files-reference)

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       DataGrid Component                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            State (useReducer)                         │  │
│  │  • columns, sorting, filters, pagination             │  │
│  │  • selection, editing, focus                         │  │
│  │  • column order, widths, visibility                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Data Transformation Pipeline                  │  │
│  │  Raw Data → Sort → Filter → Group → Paginate         │  │
│  │  (each step memoized with useMemo)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Virtual Scrolling Engine                      │  │
│  │  Calculate visible window → Render only visible      │  │
│  │  (VirtualScroller.tsx)                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Rendering Pipeline

### Standard Grid (Pagination Mode)

```
props.rows (user data)
    ↓
sortedRows = useMemo(() => applySort(rows, sortConfig))
    ↓
filteredRows = useMemo(() => applyFilters(sortedRows, filterConfig))
    ↓
groupedRows = useMemo(() => applyGrouping(filteredRows, groupConfig))
    ↓
paginatedRows = filteredRows.slice(start, end)
    ↓
Render in <GridBody> (DOM)
```

**Key Insight:** Each transformation is wrapped in `useMemo` so it only recalculates when dependencies change.

### Virtual Scrolling Mode (50,000+ rows)

```
props.rows (massive dataset)
    ↓
Calculate viewport height & scroll position
    ↓
Calculate visible row indices (startIndex, endIndex)
    ↓
virtualRows = rows.slice(startIndex, endIndex + overscan)
    ↓
Render only visible rows with absolute positioning
    ↓
Add spacer divs (offsetTop, offsetBottom) to maintain scroll height
```

**Key File:** `src/components/DataGrid/VirtualScroller.tsx`

### Infinite Scroll Mode (100M+ rows, server-side)

```
User scrolls
    ↓
Calculate which block (chunk) of rows is needed
    ↓
Check cache: Is block already loaded?
    ↓ No
Fetch from server (ServerSideDataSource)
    ↓
Cache block in memory
    ↓
Render fetched rows in viewport
```

**Key Files:**
- `src/components/DataGrid/InfiniteScrollDataGrid.tsx`
- `src/components/DataGrid/ServerSideDataSource.ts`

---

## 🧠 State Management

We use **`useReducer`** for centralized state management (similar to Redux but lighter).

### State Structure

```typescript
interface GridState {
  // Column configuration
  columns: Column[];
  columnOrder: string[];
  columnWidths: Record<string, number>;
  pinnedColumns: { left: string[]; right: string[] };
  hiddenColumns: Set<string>;
  
  // Data operations
  sortConfig: { field: string; direction: 'asc' | 'desc' } | null;
  filterConfig: Record<string, FilterValue>;
  groupByFields: string[];
  
  // Pagination
  currentPage: number;
  pageSize: number;
  
  // User interactions
  selection: {
    selectedIds: Set<string | number>;
    lastSelected: number | null;
    shiftAnchor: number | null;
  };
  editState: { rowIndex: number; field: string; value: unknown } | null;
  focusState: { rowIndex: number; colIndex: number } | null;
}
```

### Actions (Dispatched Events)

All state changes happen through dispatched actions:

```typescript
dispatch({ type: 'SORT_COLUMN', payload: { field: 'name', direction: 'asc' } })
dispatch({ type: 'FILTER_COLUMN', payload: { field: 'status', value: 'active' } })
dispatch({ type: 'SELECT_ROW', payload: { id: 123 } })
```

**Key File:** `src/components/DataGrid/gridReducer.ts`

---

## ⚡ Virtual Scrolling Engine

### How It Works

The virtual scroller only renders rows that are visible in the viewport, plus a small "overscan" buffer.

#### Core Algorithm

```typescript
// 1. Calculate visible row range
const scrollTop = containerRef.current.scrollTop;
const startIndex = Math.floor(scrollTop / rowHeight);
const visibleCount = Math.ceil(containerHeight / rowHeight);
const endIndex = startIndex + visibleCount;

// 2. Add overscan (buffer rows above/below)
const overscanStart = Math.max(0, startIndex - overscanCount);
const overscanEnd = Math.min(totalRows, endIndex + overscanCount);

// 3. Slice visible rows
const visibleRows = items.slice(overscanStart, overscanEnd);

// 4. Calculate offset for positioning
const offsetTop = overscanStart * rowHeight;
const totalHeight = totalRows * rowHeight;

// 5. Render
return (
  <div style={{ height: totalHeight, position: 'relative' }}>
    <div style={{ transform: `translateY(${offsetTop}px)` }}>
      {visibleRows.map((row, i) => renderRow(row, overscanStart + i))}
    </div>
  </div>
);
```

### Column Virtualization

For grids with 200+ columns, we also virtualize horizontally:

```typescript
// Calculate visible columns based on scrollLeft
const scrollLeft = containerRef.current.scrollLeft;
const startColIndex = findColumnIndexAtOffset(scrollLeft);
const endColIndex = findColumnIndexAtOffset(scrollLeft + containerWidth);

// Render only visible columns
const visibleColumns = columns.slice(startColIndex, endColIndex);
```

### Variable Row Heights

For tree data or expandable rows, row heights can vary:

```typescript
// Maintain a height cache
const measuredHeights = new Map<number, number>();

// Calculate cumulative offsets
const getItemOffset = (index: number): number => {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += measuredHeights.get(i) || defaultHeight;
  }
  return offset;
};
```

**Key File:** `src/components/DataGrid/VirtualScroller.tsx` (lines 1-331)

---

## 🌐 Infinite Scroll with Server-Side Data

### Architecture

```
┌──────────────────────┐
│  InfiniteScrollGrid  │
│                      │
│  ┌────────────────┐ │
│  │ ServerSide     │ │
│  │ DataSource     │ │
│  │                │ │
│  │ • Block cache  │ │
│  │ • Fetch queue  │ │
│  │ • Sort/filter  │ │
│  └────────────────┘ │
└──────────────────────┘
         ↓
    API Server
   (100M+ rows)
```

### Block-Based Caching

Instead of loading all rows, we fetch "blocks" (chunks) on-demand:

```typescript
class ServerSideDataSource {
  private cache = new Map<number, Row[]>();
  private blockSize = 100;
  
  async getRows(startRow: number, endRow: number): Promise<Row[]> {
    const blockIndex = Math.floor(startRow / this.blockSize);
    
    // Check cache
    if (this.cache.has(blockIndex)) {
      return this.cache.get(blockIndex)!;
    }
    
    // Fetch from server
    const block = await this.fetchBlock(blockIndex);
    this.cache.set(blockIndex, block);
    
    return block;
  }
}
```

### Cache Strategy

- **LRU Cache:** Keep most recently used blocks, evict oldest when memory limit reached
- **Prefetch:** Load adjacent blocks in background when user scrolls
- **Debounce:** Wait 150ms after scroll stops before fetching

**Key Files:**
- `src/components/DataGrid/InfiniteScrollDataGrid.tsx`
- `src/components/DataGrid/ServerSideDataSource.ts`

---

## 🚨 Performance Bottlenecks (Need Expert Help!)

### 1. Virtual Scrolling Performance (High Priority)

**Location:** `VirtualScroller.tsx` (lines 80-200)

**The Problem:**
- For 50,000+ rows, scroll jank occurs during rapid scrolling
- `onScroll` handler fires too frequently (every 16ms)
- Recalculating visible range on every scroll event causes frame drops

**Current Implementation:**
```typescript
const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
  const { scrollTop, scrollLeft } = e.currentTarget;
  setScrollPos({ scrollTop, scrollLeft }); // ⚠️ Causes re-render
  onScroll?.(scrollTop, scrollLeft);
}, [onScroll]);
```

**What We Think Might Help:**
- RequestAnimationFrame-based throttling
- Separating scroll state from render state
- Using CSS transforms instead of re-rendering
- Web Workers for offset calculations?

**Ideal Contributor:**
- Experience with `requestAnimationFrame` and browser paint cycles
- Knowledge of React 18 concurrent rendering
- Familiarity with profiling tools (Chrome DevTools Performance tab)

---

### 2. Large Column Sets (200+ columns)

**Location:** `VirtualScroller.tsx` (column virtualization logic, lines 150-220)

**The Problem:**
- Horizontal scrolling with 200+ columns causes layout thrashing
- `getBoundingClientRect()` calls in tight loop
- Column offset calculations block the main thread

**Current Implementation:**
```typescript
// ⚠️ This gets called on every horizontal scroll
const visibleColumns = useMemo(() => {
  return columns.filter((col, i) => {
    const colOffset = columnOffsets[i]; // Recalculated each time
    return colOffset >= scrollLeft && colOffset <= scrollLeft + containerWidth;
  });
}, [scrollLeft, columns, columnOffsets, containerWidth]);
```

**What We Think Might Help:**
- Pre-compute column offset lookup table
- Binary search instead of linear filter
- Memoize column ranges more aggressively

**Ideal Contributor:**
- Experience with DOM performance optimization
- Knowledge of efficient data structures (interval trees?)

---

### 3. Memory Usage with Infinite Scroll

**Location:** `ServerSideDataSource.ts` (cache management, lines 50-150)

**The Problem:**
- Cache grows unbounded as user scrolls
- No intelligent eviction strategy
- Memory leaks if user scrolls for extended periods

**Current Implementation:**
```typescript
class ServerSideDataSource {
  private cache = new Map<number, Row[]>();
  
  // ⚠️ No eviction logic!
  private cacheBlock(blockIndex: number, rows: Row[]) {
    this.cache.set(blockIndex, rows);
  }
}
```

**What We Think Might Help:**
- LRU cache with max size limit
- WeakMap for garbage collection hints?
- Streaming data structures

**Ideal Contributor:**
- Experience with browser memory management
- Knowledge of cache eviction algorithms

---

### 4. React Re-render Optimization

**Location:** `DataGrid.tsx`, `GridBody.tsx`

**The Problem:**
- Grid re-renders entire component tree on state changes
- Even when only one cell is edited, all cells re-render
- Selection changes trigger full re-renders

**Current Implementation:**
```typescript
// ⚠️ Every cell re-renders when selection changes
{visibleRows.map((row, i) => (
  <div key={row.id} className={isSelected(row.id) ? 'selected' : ''}>
    {columns.map(col => <Cell {...} />)}
  </div>
))}
```

**What We Think Might Help:**
- React.memo() on individual cells
- Context API for selection state
- Virtualization-aware reconciliation

**Ideal Contributor:**
- Deep knowledge of React Fiber and reconciliation
- Experience with React DevTools Profiler

---

## 📁 Component Hierarchy

```
<DataGrid>
  │
  ├── <GroupByPanel>              # Drag columns to group
  │
  ├── <ColumnChooser>             # Show/hide columns
  │
  ├── <GridHeader>
  │     ├── Column Headers (sortable, draggable, resizable)
  │     └── <ColumnFilters>       # Filter inputs for each column
  │
  ├── <GridBody>
  │     └── <VirtualScroller>     # Virtual scrolling wrapper
  │           ├── <TreeRow>       # For tree data
  │           ├── <GroupRow>      # For grouped data
  │           └── Regular rows
  │                 └── Cells (editable, selectable)
  │
  ├── <GridFooter>                # Aggregation footers
  │
  └── <GridPagination>            # Page controls
```

---

## 📂 Key Files Reference

### Core Grid
- `src/components/DataGrid/DataGrid.tsx` - Main grid component
- `src/components/DataGrid/gridReducer.ts` - State management
- `src/components/DataGrid/types.ts` - TypeScript interfaces

### Virtual Scrolling
- `src/components/DataGrid/VirtualScroller.tsx` - Virtual scrolling engine ⚡
- `src/components/DataGrid/GridBody.tsx` - Row rendering logic

### Infinite Scroll
- `src/components/DataGrid/InfiniteScrollDataGrid.tsx` - Infinite scroll grid
- `src/components/DataGrid/ServerSideDataSource.ts` - Server-side data fetching & caching

### Features
- `src/components/DataGrid/treeDataUtils.ts` - Tree/hierarchical data
- `src/components/DataGrid/groupingUtils.ts` - Row grouping
- `src/components/DataGrid/aggregationUtils.ts` - Footer aggregations
- `src/components/DataGrid/filterUtils.ts` - Advanced filtering
- `src/components/DataGrid/exportUtils.ts` - Excel export

### UI Components
- `src/components/DataGrid/GridHeader.tsx` - Column headers
- `src/components/DataGrid/GridPagination.tsx` - Pagination controls
- `src/components/DataGrid/ContextMenu.tsx` - Right-click menu
- `src/components/DataGrid/ThemeSelector.tsx` - Theme switching

### Market Data (Real-time)
- `src/components/DataGrid/MarketDataGrid.tsx` - Live data grid
- `src/components/DataGrid/MarketDataEngine.ts` - Update batching
- `src/components/DataGrid/useMarketData.ts` - WebSocket hook

---

## 🛠️ Development Workflow

### 1. Setup
```bash
git clone https://github.com/bhushanpoojary/react-open-source-datagrid.git
cd react-open-source-datagrid
npm install
npm run dev  # Starts dev server at localhost:5173
```

### 2. Performance Profiling
```bash
# Build production bundle
npm run build

# Analyze bundle size
npm run build -- --mode=analyze

# Run benchmark tests
# Navigate to http://localhost:5173/demo/benchmark
```

### 3. Testing Changes
- **Demo Pages:** Use `/demo/virtual-scrolling` and `/demo/infinite-scroll` pages
- **Benchmark:** `/demo/benchmark` has 100k row stress test
- **Chrome DevTools:** Performance tab → Record → Scroll rapidly → Analyze flame graph

---

## 🤝 How to Contribute

### For Performance Optimization

1. **Profile First:** Use Chrome DevTools to identify the exact bottleneck
2. **Create a Branch:** `git checkout -b perf/virtual-scroll-optimization`
3. **Make Incremental Changes:** One optimization at a time
4. **Benchmark:** Compare before/after with `/demo/benchmark`
5. **Submit PR:** Include performance metrics in PR description

### Example PR Description Template

```markdown
## Performance Improvement: Virtual Scroll Optimization

### Problem
Scroll jank with 50k+ rows during rapid scrolling.

### Solution
- Throttled scroll handler with requestAnimationFrame
- Separated scroll state from render state
- Reduced re-renders by 80%

### Benchmarks
**Before:**
- 50k rows: 18fps during scroll
- Time to interactive: 1200ms

**After:**
- 50k rows: 60fps during scroll
- Time to interactive: 450ms

### Files Changed
- `VirtualScroller.tsx` (lines 80-150)
- Added `useRafThrottle.ts` custom hook
```

---

## 📚 Additional Resources

- **Full API Documentation:** [docs/GRID_API_REFERENCE.md](./docs/GRID_API_REFERENCE.md)
- **Feature Guides:** [docs/](./docs/) folder
- **React Performance:** [React Docs - Optimizing Performance](https://react.dev/learn/render-and-commit)
- **Virtual Scrolling Theory:** [Brian Vaughn's react-window](https://github.com/bvaughn/react-window)

---

## 💬 Questions?

- **GitHub Issues:** [Open an issue](https://github.com/bhushanpoojary/react-open-source-datagrid/issues)
- **Discussions:** [GitHub Discussions](https://github.com/bhushanpoojary/react-open-source-datagrid/discussions)

---

**Thank you for considering contributing to React DataGrid!**

We're especially looking for experts in:
- React performance optimization
- Virtual scrolling implementations
- Memory management in browser environments
- Web Worker integration

Your expertise can help make this the fastest open-source data grid! 🚀
