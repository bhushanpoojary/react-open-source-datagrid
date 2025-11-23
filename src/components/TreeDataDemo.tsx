import React, { useState } from 'react';
import { ThemedDataGrid } from './DataGrid';
import type { Column, Row, TreeConfig } from './DataGrid';

/**
 * TreeDataDemo Component
 * 
 * Demonstrates tree data / hierarchical row functionality with three examples:
 * 1. Organizational Chart - Employee hierarchy
 * 2. File Explorer - Folder/file structure
 * 3. Product Categories - Nested product categorization
 */

// Example 1: Organizational Chart Data
const orgChartData: Row[] = [
  { id: 1, name: 'Sarah Johnson', position: 'CEO', department: 'Executive', email: 'sarah.j@company.com', parentId: null },
  { id: 2, name: 'Michael Chen', position: 'CTO', department: 'Technology', email: 'michael.c@company.com', parentId: 1 },
  { id: 3, name: 'Emily Davis', position: 'CFO', department: 'Finance', email: 'emily.d@company.com', parentId: 1 },
  { id: 4, name: 'Robert Wilson', position: 'VP Engineering', department: 'Technology', email: 'robert.w@company.com', parentId: 2 },
  { id: 5, name: 'Jennifer Martinez', position: 'VP Product', department: 'Product', email: 'jennifer.m@company.com', parentId: 2 },
  { id: 6, name: 'David Brown', position: 'Engineering Manager', department: 'Technology', email: 'david.b@company.com', parentId: 4 },
  { id: 7, name: 'Lisa Anderson', position: 'Senior Engineer', department: 'Technology', email: 'lisa.a@company.com', parentId: 6 },
  { id: 8, name: 'James Taylor', position: 'Senior Engineer', department: 'Technology', email: 'james.t@company.com', parentId: 6 },
  { id: 9, name: 'Maria Garcia', position: 'Junior Engineer', department: 'Technology', email: 'maria.g@company.com', parentId: 6 },
  { id: 10, name: 'Christopher Lee', position: 'Product Manager', department: 'Product', email: 'chris.l@company.com', parentId: 5 },
  { id: 11, name: 'Amanda White', position: 'Controller', department: 'Finance', email: 'amanda.w@company.com', parentId: 3 },
  { id: 12, name: 'Daniel Harris', position: 'Accountant', department: 'Finance', email: 'daniel.h@company.com', parentId: 11 },
];

const orgChartColumns: Column[] = [
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 250, 
    sortable: true,
    renderCell: (row: Row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          fontSize: '16px',
          filter: 'grayscale(0.2)',
        }}>
          👤
        </span>
        <span style={{ fontWeight: row.level === 0 ? 600 : 400 }}>
          {row.name}
        </span>
      </div>
    )
  },
  { field: 'position', headerName: 'Position', width: 200, sortable: true },
  { field: 'department', headerName: 'Department', width: 150, sortable: true },
  { field: 'email', headerName: 'Email', width: 220 },
];

// Example 2: File Explorer Data
const fileExplorerData: Row[] = [
  { id: 'root', name: 'My Documents', type: 'folder', size: null, modified: '2024-01-15', parentId: null },
  { id: 'projects', name: 'Projects', type: 'folder', size: null, modified: '2024-01-14', parentId: 'root' },
  { id: 'documents', name: 'Documents', type: 'folder', size: null, modified: '2024-01-10', parentId: 'root' },
  { id: 'media', name: 'Media', type: 'folder', size: null, modified: '2024-01-05', parentId: 'root' },
  
  { id: 'proj1', name: 'Website Redesign', type: 'folder', size: null, modified: '2024-01-14', parentId: 'projects' },
  { id: 'proj2', name: 'Mobile App', type: 'folder', size: null, modified: '2024-01-12', parentId: 'projects' },
  
  { id: 'file1', name: 'design-mockup.fig', type: 'file', size: '2.5 MB', modified: '2024-01-14', parentId: 'proj1' },
  { id: 'file2', name: 'requirements.docx', type: 'file', size: '125 KB', modified: '2024-01-13', parentId: 'proj1' },
  { id: 'file3', name: 'wireframes.pdf', type: 'file', size: '850 KB', modified: '2024-01-12', parentId: 'proj1' },
  
  { id: 'file4', name: 'app-design.sketch', type: 'file', size: '4.2 MB', modified: '2024-01-12', parentId: 'proj2' },
  { id: 'file5', name: 'user-stories.xlsx', type: 'file', size: '95 KB', modified: '2024-01-11', parentId: 'proj2' },
  
  { id: 'doc1', name: 'Annual Report 2023.pdf', type: 'file', size: '1.8 MB', modified: '2024-01-10', parentId: 'documents' },
  { id: 'doc2', name: 'Meeting Notes.docx', type: 'file', size: '45 KB', modified: '2024-01-09', parentId: 'documents' },
  
  { id: 'photos', name: 'Photos', type: 'folder', size: null, modified: '2024-01-05', parentId: 'media' },
  { id: 'videos', name: 'Videos', type: 'folder', size: null, modified: '2024-01-04', parentId: 'media' },
  
  { id: 'photo1', name: 'vacation-2023.jpg', type: 'file', size: '3.2 MB', modified: '2024-01-05', parentId: 'photos' },
  { id: 'photo2', name: 'team-photo.png', type: 'file', size: '2.1 MB', modified: '2024-01-03', parentId: 'photos' },
  
  { id: 'video1', name: 'presentation.mp4', type: 'file', size: '45 MB', modified: '2024-01-04', parentId: 'videos' },
];

const fileExplorerColumns: Column[] = [
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 300, 
    sortable: true,
    renderCell: (row: Row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>
          {row.type === 'folder' ? '📁' : '📄'}
        </span>
        <span>{row.name}</span>
      </div>
    )
  },
  { field: 'type', headerName: 'Type', width: 100, sortable: true },
  { field: 'size', headerName: 'Size', width: 120, sortable: true },
  { field: 'modified', headerName: 'Modified', width: 150, sortable: true },
];

// Example 3: Product Categories Data
const productCategoriesData: Row[] = [
  { id: 'elec', name: 'Electronics', count: 245, revenue: 125000, parentId: null },
  { id: 'cloth', name: 'Clothing', count: 189, revenue: 89000, parentId: null },
  { id: 'home', name: 'Home & Garden', count: 156, revenue: 67000, parentId: null },
  
  { id: 'comp', name: 'Computers', count: 89, revenue: 65000, parentId: 'elec' },
  { id: 'phone', name: 'Phones & Tablets', count: 112, revenue: 45000, parentId: 'elec' },
  { id: 'audio', name: 'Audio', count: 44, revenue: 15000, parentId: 'elec' },
  
  { id: 'laptop', name: 'Laptops', count: 45, revenue: 42000, parentId: 'comp' },
  { id: 'desktop', name: 'Desktops', count: 28, revenue: 18000, parentId: 'comp' },
  { id: 'access', name: 'Accessories', count: 16, revenue: 5000, parentId: 'comp' },
  
  { id: 'iphone', name: 'iPhones', count: 56, revenue: 28000, parentId: 'phone' },
  { id: 'android', name: 'Android Phones', count: 42, revenue: 12000, parentId: 'phone' },
  { id: 'tablets', name: 'Tablets', count: 14, revenue: 5000, parentId: 'phone' },
  
  { id: 'headphone', name: 'Headphones', count: 32, revenue: 12000, parentId: 'audio' },
  { id: 'speaker', name: 'Speakers', count: 12, revenue: 3000, parentId: 'audio' },
  
  { id: 'men', name: "Men's Clothing", count: 89, revenue: 45000, parentId: 'cloth' },
  { id: 'women', name: "Women's Clothing", count: 78, revenue: 38000, parentId: 'cloth' },
  { id: 'kids', name: "Kids' Clothing", count: 22, revenue: 6000, parentId: 'cloth' },
  
  { id: 'furn', name: 'Furniture', count: 67, revenue: 42000, parentId: 'home' },
  { id: 'garden', name: 'Garden', count: 45, revenue: 15000, parentId: 'home' },
  { id: 'decor', name: 'Decor', count: 44, revenue: 10000, parentId: 'home' },
];

const productCategoriesColumns: Column[] = [
  { 
    field: 'name', 
    headerName: 'Category', 
    width: 280, 
    sortable: true,
    renderCell: (row: Row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>
          {row.level === 0 ? '📦' : row.level === 1 ? '📂' : '📄'}
        </span>
        <span style={{ 
          fontWeight: row.level === 0 ? 600 : row.level === 1 ? 500 : 400,
          color: row.level === 0 ? '#1f2937' : '#4b5563',
        }}>
          {row.name}
        </span>
      </div>
    )
  },
  { 
    field: 'count', 
    headerName: 'Products', 
    width: 120, 
    sortable: true,
    renderCell: (row: Row) => (
      <span style={{ 
        fontWeight: 500,
        color: '#6b7280',
      }}>
        {row.count?.toLocaleString()}
      </span>
    )
  },
  { 
    field: 'revenue', 
    headerName: 'Revenue', 
    width: 150, 
    sortable: true,
    renderCell: (row: Row) => (
      <span style={{ 
        fontWeight: 600, 
        color: '#16a34a',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>$</span>
        {row.revenue?.toLocaleString()}
      </span>
    )
  },
];

type DemoType = 'orgChart' | 'fileExplorer' | 'productCategories';

export const TreeDataDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<DemoType>('orgChart');

  const treeConfig: TreeConfig = {
    enabled: true,
    idField: 'id',
    parentIdField: 'parentId',
    childrenField: 'children',
    indentSize: 28,
    showExpandIcon: true,
  };

  const getDemoConfig = () => {
    switch (selectedDemo) {
      case 'orgChart':
        return {
          title: 'Organizational Chart',
          description: 'Hierarchical employee structure showing reporting relationships',
          data: orgChartData,
          columns: orgChartColumns,
        };
      case 'fileExplorer':
        return {
          title: 'File Explorer',
          description: 'Folder and file structure with nested directories',
          data: fileExplorerData,
          columns: fileExplorerColumns,
        };
      case 'productCategories':
        return {
          title: 'Product Categories',
          description: 'Nested product categorization with metrics',
          data: productCategoriesData,
          columns: productCategoriesColumns,
        };
    }
  };

  const config = getDemoConfig();

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        .tree-toggle-button button:active {
          transform: scale(0.95) !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .tree-demo-card {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
          🌲 Tree Data / Hierarchical Rows
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
          Display hierarchical data with expand/collapse functionality, smooth animations, and visual indentation.
        </p>

        {/* Demo Selector */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'orgChart' as DemoType, label: '📊 Org Chart', color: '#3b82f6' },
            { id: 'fileExplorer' as DemoType, label: '📁 File Explorer', color: '#8b5cf6' },
            { id: 'productCategories' as DemoType, label: '🏷️ Product Categories', color: '#10b981' },
          ].map((demo) => (
            <button
              key={demo.id}
              onClick={() => setSelectedDemo(demo.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: selectedDemo === demo.id ? `2px solid ${demo.color}` : '2px solid transparent',
                backgroundColor: selectedDemo === demo.id ? `${demo.color}15` : 'white',
                color: selectedDemo === demo.id ? demo.color : '#4b5563',
                fontWeight: selectedDemo === demo.id ? 600 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedDemo === demo.id 
                  ? `0 0 0 3px ${demo.color}20` 
                  : '0 1px 2px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                if (selectedDemo !== demo.id) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDemo !== demo.id) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                }
              }}
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Demo Info */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#0c4a6e' }}>
          {config.title}
        </h2>
        <p style={{ fontSize: '14px', color: '#0369a1', marginBottom: '12px' }}>
          {config.description}
        </p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#075985' }}>
          <span>✓ Expand/collapse controls</span>
          <span>✓ Visual indentation</span>
          <span>✓ Hierarchical relationships</span>
          <span>✓ All DataGrid features supported</span>
        </div>
      </div>

      {/* DataGrid */}
      <div 
        className="tree-demo-card"
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}
      >
        <ThemedDataGrid
          columns={config.columns}
          rows={config.data}
          pageSize={20}
          treeConfig={treeConfig}
          theme="quartz"
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </div>

      {/* Features Section */}
      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#1f2937' }}>
            🎯 Key Features
          </h3>
          <ul style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Automatic tree structure from flat data</li>
            <li>Expand/collapse functionality per node</li>
            <li>Visual indentation based on level</li>
            <li>Configurable indent size</li>
            <li>Custom expand icons</li>
          </ul>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#1f2937' }}>
            🔧 Configuration
          </h3>
          <ul style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Specify parent-child relationships</li>
            <li>Control initial expansion state</li>
            <li>Customize field mappings</li>
            <li>Optional lazy loading support</li>
            <li>Event handlers for expand/collapse</li>
          </ul>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#1f2937' }}>
            💡 Use Cases
          </h3>
          <ul style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Organization charts</li>
            <li>File system browsers</li>
            <li>Product category trees</li>
            <li>Comment threads</li>
            <li>Task hierarchies</li>
          </ul>
        </div>
      </div>

      {/* Code Example */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1f2937' }}>
          Quick Example
        </h3>
        <pre style={{
          backgroundColor: '#1f2937',
          color: '#e5e7eb',
          padding: '20px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
{`import { ThemedDataGrid } from './components/DataGrid';

const data = [
  { id: 1, name: 'CEO', department: 'Executive', parentId: null },
  { id: 2, name: 'CTO', department: 'Technology', parentId: 1 },
  { id: 3, name: 'CFO', department: 'Finance', parentId: 1 },
  { id: 4, name: 'Engineer', department: 'Technology', parentId: 2 },
  // ... more rows
];

const treeConfig = {
  enabled: true,
  idField: 'id',
  parentIdField: 'parentId',
  indentSize: 24,
};

<ThemedDataGrid
  columns={columns}
  rows={data}
  treeConfig={treeConfig}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default TreeDataDemo;
