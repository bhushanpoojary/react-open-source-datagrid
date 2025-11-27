import React, { useState } from 'react';
import { DataGrid} from './DataGrid';
import type { Column, Row, PersistenceConfig } from './DataGrid/types';
import { CodeBlock } from './CodeBlock';

// Sample data with varied content
const generateDemoData = (count: number): Row[] => {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const statuses = ['Active', 'Inactive', 'Pending', 'On Leave'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    salary: Math.floor(40000 + Math.random() * 100000),
    age: Math.floor(22 + Math.random() * 40),
    hireDate: new Date(2015 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    performance: Math.floor(60 + Math.random() * 40),
    projects: Math.floor(1 + Math.random() * 10),
  }));
};

const columns: Column[] = [
  { field: 'id', headerName: 'ID', width: 80, sortable: true, filterable: true, filterType: 'number' },
  { field: 'name', headerName: 'Employee Name', width: 180, sortable: true, filterable: true, filterType: 'text' },
  { field: 'email', headerName: 'Email', width: 220, sortable: true, filterable: true, filterType: 'text' },
  { field: 'department', headerName: 'Department', width: 150, sortable: true, filterable: true, filterType: 'set' },
  { field: 'status', headerName: 'Status', width: 120, sortable: true, filterable: true, filterType: 'set' },
  { field: 'priority', headerName: 'Priority', width: 120, sortable: true, filterable: true, filterType: 'set' },
  { field: 'salary', headerName: 'Salary', width: 130, sortable: true, filterable: true, filterType: 'number' },
  { field: 'age', headerName: 'Age', width: 100, sortable: true, filterable: true, filterType: 'number' },
  { field: 'hireDate', headerName: 'Hire Date', width: 130, sortable: true, filterable: true, filterType: 'date' },
  { field: 'performance', headerName: 'Performance %', width: 150, sortable: true, filterable: true, filterType: 'number' },
  { field: 'projects', headerName: 'Projects', width: 110, sortable: true, filterable: true, filterType: 'number' },
];

type StorageStrategyOption = 'localStorage' | 'server' | 'userProfile' | 'disabled';

export const LayoutPersistenceDemo: React.FC = () => {
  const [data] = useState(() => generateDemoData(100));
  const [storageStrategy, setStorageStrategy] = useState<StorageStrategyOption>('localStorage');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);
  const [storageKey, setStorageKey] = useState('demo-grid-layout');
  const [userId, setUserId] = useState('user123');
  const [serverUrl, setServerUrl] = useState('http://localhost:3000/api');
  const [layoutChangeCount, setLayoutChangeCount] = useState(0);

  // Build persistence config based on user selections
  const persistenceConfig: PersistenceConfig | undefined = storageStrategy === 'disabled' ? undefined : {
    enabled: true,
    storageKey: storageKey,
    strategy: storageStrategy as 'localStorage' | 'server' | 'userProfile',
    autoSave: autoSaveEnabled,
    autoSaveDelay: 1000,
    autoLoad: autoLoadEnabled,
    ...(storageStrategy === 'server' && {
      serverConfig: {
        baseUrl: serverUrl,
        headers: {
          'Authorization': 'Bearer demo-token',
        },
      },
    }),
    ...(storageStrategy === 'userProfile' && {
      userProfileConfig: {
        userId: userId,
      },
    }),
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a202c' }}>
          Layout Persistence Demo
        </h1>
        <p style={{ color: '#718096', fontSize: '14px' }}>
          Save and load grid layouts with column order, widths, pinning, filters, sorting, and more.
        </p>
      </div>

      {/* Configuration Panel */}
      <div style={{ 
        backgroundColor: '#f7fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#2d3748' }}>
          Persistence Configuration
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {/* Storage Strategy */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4a5568' }}>
              Storage Strategy
            </label>
            <select
              value={storageStrategy}
              onChange={(e) => setStorageStrategy(e.target.value as StorageStrategyOption)}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                border: '1px solid #cbd5e0', 
                borderRadius: '6px',
                backgroundColor: 'white',
                fontSize: '14px'
              }}
            >
              <option value="localStorage">LocalStorage</option>
              <option value="server">Server (REST API)</option>
              <option value="userProfile">User Profile</option>
              <option value="disabled">Disabled</option>
            </select>
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
              {storageStrategy === 'localStorage' && 'Store in browser localStorage'}
              {storageStrategy === 'server' && 'Store on remote server via API'}
              {storageStrategy === 'userProfile' && 'Store per-user with localStorage'}
              {storageStrategy === 'disabled' && 'Persistence disabled'}
            </p>
          </div>

          {/* Storage Key */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4a5568' }}>
              Storage Key
            </label>
            <input
              type="text"
              value={storageKey}
              onChange={(e) => setStorageKey(e.target.value)}
              disabled={storageStrategy === 'disabled'}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                border: '1px solid #cbd5e0', 
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
              Unique identifier for this grid's layouts
            </p>
          </div>

          {/* User ID (for userProfile strategy) */}
          {storageStrategy === 'userProfile' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4a5568' }}>
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #cbd5e0', 
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                User-specific storage identifier
              </p>
            </div>
          )}

          {/* Server URL (for server strategy) */}
          {storageStrategy === 'server' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4a5568' }}>
                Server Base URL
              </label>
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #cbd5e0', 
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                API endpoint for layout persistence
              </p>
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4a5568' }}>
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              disabled={storageStrategy === 'disabled'}
              style={{ width: '16px', height: '16px' }}
            />
            Auto-save layouts
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4a5568' }}>
            <input
              type="checkbox"
              checked={autoLoadEnabled}
              onChange={(e) => setAutoLoadEnabled(e.target.checked)}
              disabled={storageStrategy === 'disabled'}
              style={{ width: '16px', height: '16px' }}
            />
            Auto-load on mount
          </label>
        </div>

        {/* Layout Change Counter */}
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#edf2f7', borderRadius: '6px' }}>
          <p style={{ fontSize: '14px', color: '#2d3748' }}>
            <strong>Layout Changes:</strong> {layoutChangeCount}
            {autoSaveEnabled && storageStrategy !== 'disabled' && (
              <span style={{ color: '#718096', marginLeft: '8px' }}>
                (Auto-saving after 1 second of inactivity)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        backgroundColor: '#ebf8ff', 
        border: '1px solid #bee3f8', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2c5282' }}>
          💡 How to Use Layout Persistence
        </h3>
        <ul style={{ marginLeft: '20px', color: '#2d3748', fontSize: '14px', lineHeight: '1.6' }}>
          <li>Use the <strong>"Layout Presets"</strong> button in the grid toolbar to manage layouts</li>
          <li>Modify the grid: resize columns, reorder, pin, hide, filter, sort, change page size</li>
          <li>Click <strong>"Save Current"</strong> to save your layout with a custom name</li>
          <li>Your saved presets appear in the dropdown - click to load them</li>
          <li>With auto-save enabled, layouts are automatically saved as you make changes</li>
          <li>With auto-load enabled, your last layout is restored when the page loads</li>
          <li>Try different storage strategies to see how persistence works</li>
          <li>Update existing presets by clicking the refresh icon next to them</li>
        </ul>
      </div>

      {/* Features Saved */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '12px', 
        marginBottom: '20px' 
      }}>
        {[
          { icon: '📊', label: 'Column Order' },
          { icon: '↔️', label: 'Column Widths' },
          { icon: '📌', label: 'Pinned Columns' },
          { icon: '🔍', label: 'Filters' },
          { icon: '🔤', label: 'Sorting' },
          { icon: '👁️', label: 'Hidden Columns' },
          { icon: '📄', label: 'Page Size' },
          { icon: '📦', label: 'Grouping' },
        ].map(({ icon, label }) => (
          <div 
            key={label}
            style={{ 
              padding: '12px', 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#2d3748'
            }}
          >
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* DataGrid */}
      <DataGrid
        columns={columns}
        rows={data}
        pageSize={10}
        theme="quartz"
        showColumnPinning={true}
        persistenceConfig={persistenceConfig}
        onLayoutChange={() => setLayoutChangeCount(prev => prev + 1)}
        footerConfig={{
          show: true,
          aggregates: [
            { field: 'salary', function: 'avg', label: 'Avg Salary' },
            { field: 'age', function: 'avg', label: 'Avg Age' },
            { field: 'projects', function: 'sum', label: 'Total Projects' },
          ],
        }}
      />

      {/* Additional Info */}
      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fffaf0', border: '1px solid #fbd38d', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#7c2d12' }}>
          ⚠️ Server Strategy Note
        </h3>
        <p style={{ fontSize: '14px', color: '#744210', lineHeight: '1.6' }}>
          The server strategy requires a backend API. Expected endpoints:
        </p>
        <ul style={{ marginLeft: '20px', marginTop: '8px', color: '#744210', fontSize: '14px', lineHeight: '1.6' }}>
          <li><code>POST /layouts</code> - Save layout preset</li>
          <li><code>GET /layouts/:key</code> - List all presets for a key</li>
          <li><code>GET /layouts/:key/:presetId</code> - Load specific preset</li>
          <li><code>DELETE /layouts/:key/:presetId</code> - Delete preset</li>
        </ul>
      </div>

      {/* Code Examples */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
          Implementation Examples
        </h2>
        
        <CodeBlock
          title="Basic Configuration - LocalStorage"
          language="tsx"
          code={`import { DataGrid} from './components/DataGrid';

<DataGrid
  columns={columns}
  rows={data}
  persistenceConfig={{
    enabled: true,
    storageKey: 'my-grid-layout',
    strategy: 'localStorage',
    autoSave: true,
    autoSaveDelay: 1000,
    autoLoad: true,
  }}
/>`}
        />

        <CodeBlock
          title="Server-Side Persistence"
          language="tsx"
          code={`<DataGrid
  columns={columns}
  rows={data}
  persistenceConfig={{
    enabled: true,
    storageKey: 'company-grid',
    strategy: 'server',
    autoSave: true,
    autoLoad: true,
    serverConfig: {
      baseUrl: 'https://api.example.com',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json',
      },
    },
  }}
/>`}
        />

        <CodeBlock
          title="User Profile Persistence"
          language="tsx"
          code={`<DataGrid
  columns={columns}
  rows={data}
  persistenceConfig={{
    enabled: true,
    storageKey: 'grid-preferences',
    strategy: 'userProfile',
    autoSave: true,
    autoLoad: true,
    userProfileConfig: {
      userId: currentUser.id,
    },
  }}
  onLayoutChange={(layout) => {
    console.log('Layout changed:', layout);
  }}
/>`}
        />
      </div>
    </div>
  );
};
