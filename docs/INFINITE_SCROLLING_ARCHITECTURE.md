# Infinite Scrolling Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Application                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         InfiniteScrollDataGrid Component                   │ │
│  │                                                             │ │
│  │  • Column management                                        │ │
│  │  • Sorting/Filtering UI                                     │ │
│  │  • Virtual scrolling                                        │ │
│  │  • Selection management                                     │ │
│  └──────────────┬──────────────────────────────────────────────┘ │
│                 │                                                 │
│                 │ Uses                                            │
│                 ▼                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         ServerSideDataSource                               │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Block Cache (LRU)                                  │  │ │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │  │ │
│  │  │  │Block0│ │Block1│ │Block2│ │...20 │             │  │ │
│  │  │  └──────┘ └──────┘ └──────┘ └──────┘             │  │ │
│  │  │  100 rows each = 2,000 rows cached               │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Request Queue                                      │  │ │
│  │  │  • Manages concurrent requests (max: 2)            │  │ │
│  │  │  • Prioritizes visible blocks                      │  │ │
│  │  │  • Prefetches adjacent blocks                      │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Observable Pattern                                 │  │ │
│  │  │  • Notifies subscribers on data changes            │  │ │
│  │  │  • Triggers re-renders                              │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └──────────────┬──────────────────────────────────────────────┘ │
│                 │                                                 │
│                 │ HTTP POST                                       │
│                 ▼                                                 │
└─────────────────────────────────────────────────────────────────┘
                  │
                  │ Network
                  │
┌─────────────────▼─────────────────────────────────────────────┐
│                    Server API                                  │
│                                                                 │
│  POST /api/data                                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Request Handler                                         │ │
│  │  • Parse request (startRow, endRow, filters, sorts)     │ │
│  │  • Build SQL query                                       │ │
│  │  • Apply filters                                         │ │
│  │  • Apply sorting                                         │ │
│  │  • Apply pagination (LIMIT/OFFSET)                      │ │
│  └──────────────┬───────────────────────────────────────────┘ │
│                 │                                               │
│                 │ SQL Query                                     │
│                 ▼                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         Database (100M+ rows)                           │ │
│  │                                                           │ │
│  │  SELECT * FROM users                                     │ │
│  │  WHERE age > 25 AND country = 'USA'                     │ │
│  │  ORDER BY name ASC                                       │ │
│  │  LIMIT 100 OFFSET 0                                      │ │
│  └──────────────┬───────────────────────────────────────────┘ │
│                 │                                               │
│                 │ Results (100 rows)                            │
│                 ▼                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Response Builder                                         │ │
│  │  • Format rows                                            │ │
│  │  • Include total count                                    │ │
│  │  • Set lastRow (for infinite scroll)                     │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Initial Load

```
User opens grid
      │
      ▼
InfiniteScrollDataGrid renders
      │
      ▼
ServerSideDataSource initialized
      │
      ▼
Request blocks 0-2 (300 rows)
      │
      ▼
Server processes requests
      │
      ▼
Blocks cached locally
      │
      ▼
Grid displays rows 0-99
```

### 2. User Scrolls Down

```
User scrolls down
      │
      ▼
Virtual scroller calculates visible range
      │
      ▼
ServerSideDataSource checks cache
      │
      ├─── Block in cache? → Return immediately
      │
      └─── Block not in cache?
             │
             ▼
           Queue request for block
             │
             ▼
           Show loading placeholder
             │
             ▼
           Server fetches block
             │
             ▼
           Block cached + displayed
             │
             ▼
           Prefetch next block
```

### 3. User Applies Filter

```
User enters filter
      │
      ▼
Filter model updated
      │
      ▼
ServerSideDataSource.setFilterModel()
      │
      ▼
Clear all cached blocks
      │
      ▼
Request new blocks with filter
      │
      ▼
Server applies filter in SQL
      │
      ▼
New blocks cached + displayed
```

### 4. Cache Management

```
Block requested
      │
      ▼
Check cache size
      │
      ├─── Cache full? (> 20 blocks)
      │      │
      │      ▼
      │    Evict oldest block (LRU)
      │
      └─── Cache has space?
             │
             ▼
           Add new block to cache
             │
             ▼
           Update timestamp
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Interface                               │
└────────┬─────────────┬─────────────┬─────────────┬──────────────┘
         │             │             │             │
         │             │             │             │
    Scroll         Filter        Sort         Select
         │             │             │             │
         ▼             ▼             ▼             ▼
┌────────────────────────────────────────────────────────────────┐
│              InfiniteScrollDataGrid                            │
│  • Manages UI state                                            │
│  • Delegates data operations to DataSource                     │
│  • Renders virtual viewport                                    │
└────────┬───────────────────────────────────────────────────────┘
         │
         │ getRowsInRange(start, end)
         │ setFilterModel(filters)
         │ setSortModel(sorts)
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│              ServerSideDataSource                              │
│  • Manages block loading                                       │
│  • Maintains cache                                              │
│  • Coordinates server requests                                 │
└────────┬───────────────────────────────────────────────────────┘
         │
         │ getRows({ startRow, endRow, filters, sorts })
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│                   Server API                                   │
│  • Executes queries                                             │
│  • Returns data blocks                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Block Loading Strategy

```
Viewport (visible rows)
    │
    ▼
┌───────────────────────────────────────────────────────┐
│ Visible: Rows 200-219 (Block 2)                      │
│ ┌─────────────────────────────────────────────────┐  │
│ │ [200] John Doe      | 30 | Engineering          │  │
│ │ [201] Jane Smith    | 28 | Marketing            │  │
│ │ [202] Bob Johnson   | 35 | Sales                │  │
│ │ ...                                              │  │
│ │ [219] Alice Brown   | 32 | HR                   │  │
│ └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
         ▲                                    │
         │                                    │
    Currently                             Scroll
     in cache                             direction
         │                                    │
         │                                    ▼
    ┌────┴────┐                         ┌─────────┐
    │ Block 1 │                         │ Block 3 │
    │ (100-199)│                        │ (300-399)│
    └─────────┘                         └─────────┘
    Prefetched                          Prefetch
    (behind)                            (ahead)
```

## Cache Lifecycle

```
                    ┌──────────────┐
                    │  New Block   │
                    │  Requested   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ In Cache?    │
                    └──────┬───────┘
                           │
                    ┌──────┴────────┐
                    │               │
                   Yes              No
                    │               │
                    │               ▼
                    │        ┌─────────────┐
                    │        │ Queue for   │
                    │        │ Loading     │
                    │        └──────┬──────┘
                    │               │
                    │               ▼
                    │        ┌─────────────┐
                    │        │ HTTP Request│
                    │        └──────┬──────┘
                    │               │
                    │               ▼
                    │        ┌─────────────┐
                    │        │ Cache Full? │
                    │        └──────┬──────┘
                    │               │
                    │        ┌──────┴────────┐
                    │        │               │
                    │       Yes              No
                    │        │               │
                    │        ▼               ▼
                    │   ┌─────────┐    ┌─────────┐
                    │   │ Evict   │    │  Add to │
                    │   │ Oldest  │    │  Cache  │
                    │   └────┬────┘    └────┬────┘
                    │        │              │
                    │        └──────┬───────┘
                    │               │
                    ▼               ▼
               ┌─────────────────────────┐
               │   Return Block Data     │
               └─────────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Display    │
                    │   Rows      │
                    └─────────────┘
```

## Performance Optimization

```
                    Large Dataset
                    (100M rows)
                         │
              ───────────┴───────────
              │                     │
              ▼                     ▼
        Block Loading          Virtual Scrolling
        (Server-side)          (Client-side)
              │                     │
    ┌─────────┴─────────┐          │
    │                   │          │
    ▼                   ▼          ▼
 Caching          Prefetching   Windowing
    │                   │          │
    │                   │          │
    └─────────┬─────────┴──────────┘
              │
              ▼
        Fast & Smooth
        User Experience
          (60 FPS)
```

## Request Timeline

```
Time →

Scroll starts
│
├─ t=0ms:   Request Block 5 (visible)
├─ t=0ms:   Request Block 6 (prefetch)
│           [Queue: 2 requests]
│
├─ t=50ms:  Block 5 response received
├─ t=50ms:  Block 5 cached & displayed
├─ t=50ms:  Request Block 4 (prefetch behind)
│           [Queue: 2 requests]
│
├─ t=100ms: Block 6 response received
├─ t=100ms: Block 6 cached
│           [Queue: 1 request]
│
├─ t=150ms: Block 4 response received
├─ t=150ms: Block 4 cached
│           [Queue: 0 requests]
│
User continues scrolling...
│
├─ t=200ms: Block 7 needed
├─ t=200ms: Block 7 in cache? No
├─ t=200ms: Request Block 7
│
└─ t=250ms: Block 7 response received & displayed
```

## Memory Management

```
┌────────────────────────────────────────────────────────┐
│                  Client Memory                         │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Block Cache (2MB max)                           │ │
│  │  ┌────┐ ┌────┐ ┌────┐     ┌────┐               │ │
│  │  │ B0 │ │ B1 │ │ B2 │ ... │B19 │               │ │
│  │  └────┘ └────┘ └────┘     └────┘               │ │
│  │  100KB  100KB  100KB       100KB                │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Virtual Scroller Viewport (30KB)               │ │
│  │  • 20 visible rows                               │ │
│  │  • 10 overscan rows                              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Component State (5MB)                           │ │
│  │  • Grid state, filters, sorts                    │ │
│  │  • UI components                                 │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  Total: ~7MB                                           │
└────────────────────────────────────────────────────────┘

vs.

┌────────────────────────────────────────────────────────┐
│          Loading All 100M Rows                         │
│                                                         │
│  100,000,000 rows × 1KB = 100GB                        │
│  ❌ NOT FEASIBLE                                       │
└────────────────────────────────────────────────────────┘
```

This architecture allows handling 100M+ rows with only ~7MB of client memory!
