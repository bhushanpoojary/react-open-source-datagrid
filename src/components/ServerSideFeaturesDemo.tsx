/**
 * ServerSideFeaturesDemo Component
 *
 * Showcases server-side sorting, pagination, and column filtering
 * with a traditional paginated grid. Includes a live request log
 * so users can observe each server request/response.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ColumnChooser } from './DataGrid/ColumnChooser';
import type { Column, Row } from './DataGrid/types';
import { CodeBlock } from './CodeBlock';

// ---------------------------------------------------------------------------
// Mock server – generates deterministic data and understands sort/filter/page
// ---------------------------------------------------------------------------

interface ServerRequest {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters: Record<string, string>;
}

interface ServerResponse {
  rows: Row[];
  totalRows: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface RequestLogEntry {
  id: number;
  timestamp: string;
  request: ServerRequest;
  response: { totalRows: number; returnedRows: number; totalPages: number };
  durationMs: number;
}

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations', 'Legal', 'Support'];
const STATUSES = ['Active', 'Inactive', 'On Leave', 'Probation'];
const COUNTRIES = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Australia', 'Japan', 'India', 'Brazil'];

function generateAllRows(total: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < total; i++) {
    rows.push({
      id: i + 1,
      name: `Employee ${i + 1}`,
      position: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'Manager', 'Director', 'VP', 'Analyst', 'Designer'][i % 8],
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      salary: 40000 + ((i * 7919) % 160000),
      joinDate: `${2015 + (i % 10)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      status: STATUSES[i % STATUSES.length],
      country: COUNTRIES[i % COUNTRIES.length],
      email: `employee${i + 1}@example.com`,
    });
  }
  return rows;
}

const TOTAL_ROWS = 10_000;
let _cachedRows: Row[] | null = null;
function getAllRows() {
  if (!_cachedRows) _cachedRows = generateAllRows(TOTAL_ROWS);
  return _cachedRows;
}

async function mockServerFetch(req: ServerRequest): Promise<ServerResponse> {
  // Simulate network delay (80-200 ms)
  const delay = 80 + Math.random() * 120;
  await new Promise((r) => setTimeout(r, delay));

  let data = [...getAllRows()];

  // --- Server-side filtering ---
  for (const [field, value] of Object.entries(req.filters)) {
    if (!value) continue;
    const lower = value.toLowerCase();
    data = data.filter((row) => {
      const cellVal = row[field];
      if (cellVal == null) return false;
      return String(cellVal).toLowerCase().includes(lower);
    });
  }

  // --- Server-side sorting ---
  if (req.sortField) {
    const dir = req.sortDirection === 'desc' ? -1 : 1;
    const field = req.sortField;
    data.sort((a, b) => {
      const va = a[field];
      const vb = b[field];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }

  // --- Server-side pagination ---
  const totalRows = data.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / req.pageSize));
  const start = req.page * req.pageSize;
  const pageRows = data.slice(start, start + req.pageSize);

  return { rows: pageRows, totalRows, page: req.page, pageSize: req.pageSize, totalPages };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ServerSideFeaturesDemo: React.FC = () => {
  // Column definitions
  const columns: Column[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80, sortable: true, filterable: true },
      { field: 'name', headerName: 'Name', width: 180, sortable: true, filterable: true },
      { field: 'position', headerName: 'Position', width: 170, sortable: true, filterable: true },
      { field: 'department', headerName: 'Department', width: 140, sortable: true, filterable: true },
      { field: 'salary', headerName: 'Salary', width: 120, sortable: true, filterable: true },
      { field: 'country', headerName: 'Country', width: 120, sortable: true, filterable: true },
      { field: 'joinDate', headerName: 'Join Date', width: 130, sortable: true, filterable: true },
      { field: 'status', headerName: 'Status', width: 110, sortable: true, filterable: true },
      { field: 'email', headerName: 'Email', width: 220, sortable: true, filterable: true },
    ],
    []
  );

  // Server-side state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Data state
  const [rows, setRows] = useState<Row[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Column chooser state
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((c) => c.field));
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  // Request log
  const [requestLog, setRequestLog] = useState<RequestLogEntry[]>([]);
  const logIdRef = useRef(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Fetch data from mock server
  useEffect(() => {
    let cancelled = false;
    const request: ServerRequest = { page, pageSize, sortField, sortDirection, filters };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading indicator for async fetch is intentional
    setLoading(true);
    const start = performance.now();
    mockServerFetch(request).then((response) => {
      if (cancelled) return;
      const duration = Math.round(performance.now() - start);
      setRows(response.rows);
      setTotalRows(response.totalRows);
      setTotalPages(response.totalPages);
      setLoading(false);

      const entry: RequestLogEntry = {
        id: ++logIdRef.current,
        timestamp: new Date().toLocaleTimeString(),
        request,
        response: { totalRows: response.totalRows, returnedRows: response.rows.length, totalPages: response.totalPages },
        durationMs: duration,
      };
      setRequestLog((prev) => [...prev.slice(-49), entry]); // keep last 50
    });
    return () => { cancelled = true; };
  }, [page, pageSize, sortField, sortDirection, filters]);

  // Auto-scroll log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [requestLog]);

  // Handlers
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(undefined);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(0);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleToggleVisibility = (field: string) => {
    setHiddenColumns((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]));
  };

  const handleReorderColumns = (fromIndex: number, toIndex: number) => {
    setColumnOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleResetLayout = () => {
    setColumnOrder(columns.map((c) => c.field));
    setHiddenColumns([]);
  };

  // Visible columns in order
  const visibleColumns = useMemo(
    () => columnOrder.filter((f) => !hiddenColumns.includes(f)).map((f) => columns.find((c) => c.field === f)!).filter(Boolean),
    [columnOrder, hiddenColumns, columns]
  );

  // Pagination helpers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (page > 2) pages.push('...');
      for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) pages.push(i);
      if (page < totalPages - 3) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Server-Side Features Demo
        </h1>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>
          This demo showcases <strong>server-side sorting, pagination, and column filtering</strong> with
          a traditional paginated grid backed by <strong>{TOTAL_ROWS.toLocaleString()} rows</strong>.
          Every sort, filter, and page change triggers a real server request — watch the request log below.
        </p>

        <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Features:</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#475569', lineHeight: '1.6' }}>
            <li><strong>Server-side pagination:</strong> Fetches only the current page from the server</li>
            <li><strong>Server-side sorting:</strong> Click column headers — sorting is applied on the server</li>
            <li><strong>Server-side filtering:</strong> Type in filter boxes — filters are applied on the server</li>
            <li><strong>Column chooser:</strong> Show/hide &amp; reorder columns (client-side — no server round-trip needed)</li>
            <li><strong>Request log:</strong> Watch live server requests and response times</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#dbeafe', padding: '16px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #93c5fd' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1e40af' }}>Try it out:</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#1e3a8a', lineHeight: '1.6' }}>
            <li>Click column headers to sort (watch the request log update)</li>
            <li>Type in the filter boxes below each header</li>
            <li>Navigate between pages using the pagination controls</li>
            <li>Use the <strong>Columns</strong> button to show/hide and reorder columns</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #fcd34d' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#92400e' }}>
            Why column chooser doesn&apos;t need server-side handling:
          </h2>
          <p style={{ color: '#78350f', lineHeight: '1.6' }}>
            Column visibility is purely a <strong>UI concern</strong>. The server returns all fields for each row, and the client
            simply decides which columns to render. This keeps the API simple and avoids unnecessary coupling between
            the frontend layout and backend queries.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <ColumnChooser
          columns={columns}
          columnOrder={columnOrder}
          hiddenColumns={hiddenColumns}
          onToggleVisibility={handleToggleVisibility}
          onReorderColumns={handleReorderColumns}
          onResetLayout={handleResetLayout}
        />
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {totalRows.toLocaleString()} total rows &middot; Page {page + 1} of {totalPages}
          {loading && <span style={{ marginLeft: '8px', color: '#3b82f6' }}>⏳ Loading...</span>}
        </span>
      </div>

      {/* Data Grid */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              {/* Header row */}
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {visibleColumns.map((col) => {
                  const isSorted = sortField === col.field;
                  return (
                    <th
                      key={col.field}
                      onClick={() => col.sortable !== false && handleSort(col.field)}
                      style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: 600,
                        color: '#334155',
                        borderBottom: '2px solid #e2e8f0',
                        cursor: col.sortable !== false ? 'pointer' : 'default',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                        width: col.width,
                        minWidth: col.width,
                        position: 'relative',
                      }}
                    >
                      {col.headerName}
                      {isSorted && (
                        <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
              {/* Filter row */}
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                {visibleColumns.map((col) => (
                  <th key={`filter-${col.field}`} style={{ padding: '4px 8px', borderBottom: '1px solid #e2e8f0' }}>
                    {col.filterable !== false && (
                      <input
                        type="text"
                        placeholder={`Filter ${col.headerName}...`}
                        value={filters[col.field] || ''}
                        onChange={(e) => handleFilterChange(col.field, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '4px 8px',
                          fontSize: '12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length}
                    style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}
                  >
                    {loading ? 'Loading...' : 'No rows match the current filters'}
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget.style.backgroundColor = '#eff6ff'); }}
                    onMouseLeave={(e) => { (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc'); }}
                  >
                    {visibleColumns.map((col) => (
                      <td
                        key={col.field}
                        style={{
                          padding: '8px 12px',
                          borderBottom: '1px solid #f1f5f9',
                          color: '#475569',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col.field === 'salary'
                          ? `$${Number(row[col.field]).toLocaleString()}`
                          : col.field === 'status'
                            ? <StatusBadge status={String(row[col.field])} />
                            : String(row[col.field] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          >
            {[10, 20, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <PageButton disabled={page === 0} onClick={() => setPage(0)} label="«" />
          <PageButton disabled={page === 0} onClick={() => setPage(page - 1)} label="‹" />
          {getPageNumbers().map((p, i) =>
            typeof p === 'string' ? (
              <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#94a3b8' }}>…</span>
            ) : (
              <PageButton key={p} active={p === page} onClick={() => setPage(p)} label={String(p + 1)} />
            )
          )}
          <PageButton disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} label="›" />
          <PageButton disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)} label="»" />
        </div>

        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, totalRows)} of {totalRows.toLocaleString()}
        </span>
      </div>

      {/* Request Log */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>📡 Server Request Log</h2>
          <button
            onClick={() => setRequestLog([])}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
        <div
          ref={logContainerRef}
          style={{
            maxHeight: '240px',
            overflowY: 'auto',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: '#1e293b',
            padding: '12px',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#e2e8f0',
          }}
        >
          {requestLog.length === 0 ? (
            <div style={{ color: '#64748b' }}>No requests yet — interact with the grid to see server requests appear here.</div>
          ) : (
            requestLog.map((entry) => (
              <div key={entry.id} style={{ marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>[{entry.timestamp}]</span>
                {' '}
                <span style={{ color: '#38bdf8' }}>GET</span>
                {' '}
                <span style={{ color: '#a5f3fc' }}>
                  /api/employees?page={entry.request.page + 1}&amp;pageSize={entry.request.pageSize}
                  {entry.request.sortField && `&sort=${entry.request.sortField}:${entry.request.sortDirection}`}
                  {Object.entries(entry.request.filters).filter(([, v]) => v).map(([k, v]) => `&${k}=${v}`).join('')}
                </span>
                {' → '}
                <span style={{ color: '#4ade80' }}>
                  {entry.response.returnedRows} rows / {entry.response.totalRows.toLocaleString()} total
                </span>
                {' '}
                <span style={{ color: '#fbbf24' }}>({entry.durationMs}ms)</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Code Example */}
      <div style={{ marginTop: '40px', position: 'relative', zIndex: 0 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Implementation Example</h2>

        <CodeBlock
          title="Connecting to your backend"
          examples={[
            {
              label: 'React',
              language: 'tsx',
              code: `import { useState, useEffect, useCallback } from 'react';
import { DataGrid } from 'react-open-source-grid';

function ServerSideGrid() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [sort, setSort] = useState({ field: 'id', dir: 'asc' });
  const [filters, setFilters] = useState({});
  const [totalRows, setTotalRows] = useState(0);

  // Fetch data from your API whenever page/sort/filter changes
  const fetchData = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(page + 1),
      pageSize: String(pageSize),
      ...(sort.field && { sortField: sort.field, sortDir: sort.dir }),
      ...filters,
    });

    const res = await fetch(\`/api/employees?\${params}\`);
    const data = await res.json();

    setRows(data.rows);
    setTotalRows(data.totalRows);
  }, [page, pageSize, sort, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pageSize={pageSize}
      // Hook into grid events to trigger server requests
      onSortChange={(field, dir) => {
        setSort({ field, dir });
        setPage(0);
      }}
      onFilterChange={(newFilters) => {
        setFilters(newFilters);
        setPage(0);
      }}
      onPageChange={(newPage) => setPage(newPage)}
    />
  );
}`,
            },
            {
              label: 'REST API',
              language: 'json',
              code: `// GET /api/employees?page=1&pageSize=20&sortField=name&sortDir=asc&department=Engineering

// Response:
{
  "rows": [
    { "id": 42, "name": "Alice Chen", "department": "Engineering", ... },
    { "id": 87, "name": "Bob Park", "department": "Engineering", ... }
  ],
  "totalRows": 3420,
  "page": 1,
  "pageSize": 20,
  "totalPages": 171
}`,
            },
          ]}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PageButton: React.FC<{ label: string; onClick: () => void; disabled?: boolean; active?: boolean }> = ({
  label,
  onClick,
  disabled,
  active,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '4px 10px',
      fontSize: '13px',
      border: active ? '1px solid #3b82f6' : '1px solid #cbd5e1',
      borderRadius: '4px',
      background: active ? '#3b82f6' : disabled ? '#f1f5f9' : '#fff',
      color: active ? '#fff' : disabled ? '#94a3b8' : '#334155',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: active ? 600 : 400,
      minWidth: '32px',
    }}
  >
    {label}
  </button>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    Active: { bg: '#dcfce7', text: '#16a34a' },
    Inactive: { bg: '#fee2e2', text: '#dc2626' },
    'On Leave': { bg: '#fef9c3', text: '#ca8a04' },
    Probation: { bg: '#dbeafe', text: '#2563eb' },
  };
  const c = colors[status] || { bg: '#f1f5f9', text: '#475569' };
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: c.bg,
        color: c.text,
      }}
    >
      {status}
    </span>
  );
};

export default ServerSideFeaturesDemo;
