import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
import { CodeBlock } from './CodeBlock';
// Sample data with varied content
const generateDemoData = (count) => {
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
const columns = [
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
export const LayoutPersistenceDemo = () => {
    const [data] = useState(() => generateDemoData(100));
    const [storageStrategy, setStorageStrategy] = useState('localStorage');
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);
    const [storageKey, setStorageKey] = useState('demo-grid-layout');
    const [userId, setUserId] = useState('user123');
    const [serverUrl, setServerUrl] = useState('http://localhost:3000/api');
    const [layoutChangeCount, setLayoutChangeCount] = useState(0);
    // Build persistence config based on user selections
    const persistenceConfig = storageStrategy === 'disabled' ? undefined : {
        enabled: true,
        storageKey: storageKey,
        strategy: storageStrategy,
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
    return (_jsxs("div", { style: { padding: '20px', maxWidth: '1400px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '30px' }, children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a202c' }, children: "Layout Persistence Demo" }), _jsx("p", { style: { color: '#718096', fontSize: '14px' }, children: "Save and load grid layouts with column order, widths, pinning, filters, sorting, and more." })] }), _jsxs("div", { style: {
                    backgroundColor: '#f7fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px'
                }, children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#2d3748' }, children: "Persistence Configuration" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4a5568' }, children: "Storage Strategy" }), _jsxs("select", { value: storageStrategy, onChange: (e) => setStorageStrategy(e.target.value), style: {
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '6px',
                                            backgroundColor: 'white',
                                            fontSize: '14px'
                                        }, children: [_jsx("option", { value: "localStorage", children: "LocalStorage" }), _jsx("option", { value: "server", children: "Server (REST API)" }), _jsx("option", { value: "userProfile", children: "User Profile" }), _jsx("option", { value: "disabled", children: "Disabled" })] }), _jsxs("p", { style: { fontSize: '12px', color: '#718096', marginTop: '4px' }, children: [storageStrategy === 'localStorage' && 'Store in browser localStorage', storageStrategy === 'server' && 'Store on remote server via API', storageStrategy === 'userProfile' && 'Store per-user with localStorage', storageStrategy === 'disabled' && 'Persistence disabled'] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4a5568' }, children: "Storage Key" }), _jsx("input", { type: "text", value: storageKey, onChange: (e) => setStorageKey(e.target.value), disabled: storageStrategy === 'disabled', style: {
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        } }), _jsx("p", { style: { fontSize: '12px', color: '#718096', marginTop: '4px' }, children: "Unique identifier for this grid's layouts" })] }), storageStrategy === 'userProfile' && (_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4a5568' }, children: "User ID" }), _jsx("input", { type: "text", value: userId, onChange: (e) => setUserId(e.target.value), style: {
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        } }), _jsx("p", { style: { fontSize: '12px', color: '#718096', marginTop: '4px' }, children: "User-specific storage identifier" })] })), storageStrategy === 'server' && (_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4a5568' }, children: "Server Base URL" }), _jsx("input", { type: "text", value: serverUrl, onChange: (e) => setServerUrl(e.target.value), style: {
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        } }), _jsx("p", { style: { fontSize: '12px', color: '#718096', marginTop: '4px' }, children: "API endpoint for layout persistence" })] }))] }), _jsxs("div", { style: { display: 'flex', gap: '24px', marginTop: '16px' }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4a5568' }, children: [_jsx("input", { type: "checkbox", checked: autoSaveEnabled, onChange: (e) => setAutoSaveEnabled(e.target.checked), disabled: storageStrategy === 'disabled', style: { width: '16px', height: '16px' } }), "Auto-save layouts"] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4a5568' }, children: [_jsx("input", { type: "checkbox", checked: autoLoadEnabled, onChange: (e) => setAutoLoadEnabled(e.target.checked), disabled: storageStrategy === 'disabled', style: { width: '16px', height: '16px' } }), "Auto-load on mount"] })] }), _jsx("div", { style: { marginTop: '16px', padding: '12px', backgroundColor: '#edf2f7', borderRadius: '6px' }, children: _jsxs("p", { style: { fontSize: '14px', color: '#2d3748' }, children: [_jsx("strong", { children: "Layout Changes:" }), " ", layoutChangeCount, autoSaveEnabled && storageStrategy !== 'disabled' && (_jsx("span", { style: { color: '#718096', marginLeft: '8px' }, children: "(Auto-saving after 1 second of inactivity)" }))] }) })] }), _jsxs("div", { style: {
                    backgroundColor: '#ebf8ff',
                    border: '1px solid #bee3f8',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px'
                }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2c5282' }, children: "\uD83D\uDCA1 How to Use Layout Persistence" }), _jsxs("ul", { style: { marginLeft: '20px', color: '#2d3748', fontSize: '14px', lineHeight: '1.6' }, children: [_jsxs("li", { children: ["Use the ", _jsx("strong", { children: "\"Layout Presets\"" }), " button in the grid toolbar to manage layouts"] }), _jsx("li", { children: "Modify the grid: resize columns, reorder, pin, hide, filter, sort, change page size" }), _jsxs("li", { children: ["Click ", _jsx("strong", { children: "\"Save Current\"" }), " to save your layout with a custom name"] }), _jsx("li", { children: "Your saved presets appear in the dropdown - click to load them" }), _jsx("li", { children: "With auto-save enabled, layouts are automatically saved as you make changes" }), _jsx("li", { children: "With auto-load enabled, your last layout is restored when the page loads" }), _jsx("li", { children: "Try different storage strategies to see how persistence works" }), _jsx("li", { children: "Update existing presets by clicking the refresh icon next to them" })] })] }), _jsx("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px'
                }, children: [
                    { icon: '📊', label: 'Column Order' },
                    { icon: '↔️', label: 'Column Widths' },
                    { icon: '📌', label: 'Pinned Columns' },
                    { icon: '🔍', label: 'Filters' },
                    { icon: '🔤', label: 'Sorting' },
                    { icon: '👁️', label: 'Hidden Columns' },
                    { icon: '📄', label: 'Page Size' },
                    { icon: '📦', label: 'Grouping' },
                ].map(({ icon, label }) => (_jsxs("div", { style: {
                        padding: '12px',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#2d3748'
                    }, children: [_jsx("span", { style: { fontSize: '16px' }, children: icon }), _jsx("span", { children: label })] }, label))) }), _jsx(DataGrid, { columns: columns, rows: data, pageSize: 10, theme: "quartz", showColumnPinning: true, persistenceConfig: persistenceConfig, onLayoutChange: () => setLayoutChangeCount(prev => prev + 1), footerConfig: {
                    show: true,
                    aggregates: [
                        { field: 'salary', function: 'avg', label: 'Avg Salary' },
                        { field: 'age', function: 'avg', label: 'Avg Age' },
                        { field: 'projects', function: 'sum', label: 'Total Projects' },
                    ],
                } }), _jsxs("div", { style: { marginTop: '20px', padding: '16px', backgroundColor: '#fffaf0', border: '1px solid #fbd38d', borderRadius: '8px' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#7c2d12' }, children: "\u26A0\uFE0F Server Strategy Note" }), _jsx("p", { style: { fontSize: '14px', color: '#744210', lineHeight: '1.6' }, children: "The server strategy requires a backend API. Expected endpoints:" }), _jsxs("ul", { style: { marginLeft: '20px', marginTop: '8px', color: '#744210', fontSize: '14px', lineHeight: '1.6' }, children: [_jsxs("li", { children: [_jsx("code", { children: "POST /layouts" }), " - Save layout preset"] }), _jsxs("li", { children: [_jsx("code", { children: "GET /layouts/:key" }), " - List all presets for a key"] }), _jsxs("li", { children: [_jsx("code", { children: "GET /layouts/:key/:presetId" }), " - Load specific preset"] }), _jsxs("li", { children: [_jsx("code", { children: "DELETE /layouts/:key/:presetId" }), " - Delete preset"] })] })] }), _jsxs("div", { style: { marginTop: '40px' }, children: [_jsx("h2", { style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }, children: "Implementation Examples" }), _jsx(CodeBlock, { title: "Basic Configuration - LocalStorage", language: "tsx", code: `import { DataGrid} from './components/DataGrid';

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
/>` }), _jsx(CodeBlock, { title: "Server-Side Persistence", language: "tsx", code: `<DataGrid
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
/>` }), _jsx(CodeBlock, { title: "User Profile Persistence", language: "tsx", code: `<DataGrid
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
/>` })] })] }));
};
