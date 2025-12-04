import React, { useState } from 'react';
import { DataGrid } from './DataGrid/DataGrid';
import type { Column, Row } from './DataGrid/types';
import { CodeBlock } from './CodeBlock';

// Sample data: Products with reviews
interface Product extends Row {
  id: number;
  productName: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  reviews?: Review[];
}

interface Review extends Row {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    productName: 'Laptop Pro 15"',
    category: 'Electronics',
    price: 1299.99,
    stock: 45,
    rating: 4.5,
    reviews: [
      { id: 101, reviewer: 'John Doe', rating: 5, comment: 'Excellent laptop! Very fast and reliable.', date: '2024-11-15' },
      { id: 102, reviewer: 'Jane Smith', rating: 4, comment: 'Good performance but a bit pricey.', date: '2024-11-20' },
      { id: 103, reviewer: 'Mike Johnson', rating: 5, comment: 'Best laptop I ever owned!', date: '2024-11-25' },
    ],
  },
  {
    id: 2,
    productName: 'Wireless Mouse',
    category: 'Accessories',
    price: 29.99,
    stock: 120,
    rating: 4.2,
    reviews: [
      { id: 201, reviewer: 'Sarah Wilson', rating: 4, comment: 'Comfortable and responsive.', date: '2024-11-10' },
      { id: 202, reviewer: 'Tom Brown', rating: 4, comment: 'Good value for money.', date: '2024-11-18' },
    ],
  },
  {
    id: 3,
    productName: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 89.99,
    stock: 67,
    rating: 4.7,
    reviews: [
      { id: 301, reviewer: 'Alex Chen', rating: 5, comment: 'Amazing tactile feedback!', date: '2024-11-12' },
      { id: 302, reviewer: 'Emily Davis', rating: 5, comment: 'Love the RGB lighting.', date: '2024-11-16' },
      { id: 303, reviewer: 'Chris Lee', rating: 4, comment: 'Great keyboard, slightly noisy.', date: '2024-11-22' },
    ],
  },
  {
    id: 4,
    productName: '4K Monitor 27"',
    category: 'Electronics',
    price: 399.99,
    stock: 32,
    rating: 4.8,
    reviews: [
      { id: 401, reviewer: 'Robert Garcia', rating: 5, comment: 'Crystal clear display!', date: '2024-11-08' },
      { id: 402, reviewer: 'Lisa Martinez', rating: 5, comment: 'Perfect for video editing.', date: '2024-11-14' },
      { id: 403, reviewer: 'David Kim', rating: 4, comment: 'Excellent quality, but bezel is a bit thick.', date: '2024-11-19' },
      { id: 404, reviewer: 'Anna Lopez', rating: 5, comment: 'Best monitor in this price range!', date: '2024-11-28' },
    ],
  },
  {
    id: 5,
    productName: 'USB-C Hub',
    category: 'Accessories',
    price: 49.99,
    stock: 89,
    rating: 3.9,
    reviews: [
      { id: 501, reviewer: 'Kevin White', rating: 3, comment: 'Works okay but gets warm.', date: '2024-11-21' },
      { id: 502, reviewer: 'Samantha Taylor', rating: 4, comment: 'Good ports selection.', date: '2024-11-26' },
    ],
  },
  {
    id: 6,
    productName: 'Webcam HD 1080p',
    category: 'Electronics',
    price: 79.99,
    stock: 54,
    rating: 4.3,
    reviews: [
      { id: 601, reviewer: 'Mark Thompson', rating: 4, comment: 'Clear video quality for meetings.', date: '2024-11-09' },
      { id: 602, reviewer: 'Jessica Moore', rating: 5, comment: 'Perfect for streaming!', date: '2024-11-17' },
      { id: 603, reviewer: 'Brian Anderson', rating: 4, comment: 'Good webcam, easy setup.', date: '2024-11-23' },
    ],
  },
  {
    id: 7,
    productName: 'Laptop Stand',
    category: 'Accessories',
    price: 34.99,
    stock: 156,
    rating: 4.6,
  },
  {
    id: 8,
    productName: 'Cable Organizer',
    category: 'Accessories',
    price: 12.99,
    stock: 203,
    rating: 4.1,
  },
];

const productColumns: Column[] = [
  { field: 'productName', headerName: 'Product Name', width: 200 },
  { field: 'category', headerName: 'Category', width: 120 },
  { 
    field: 'price', 
    headerName: 'Price', 
    width: 100,
    renderCell: (row: Row) => `$${(row.price as number).toFixed(2)}`
  },
  { field: 'stock', headerName: 'Stock', width: 80 },
  { 
    field: 'rating', 
    headerName: 'Rating', 
    width: 100,
    renderCell: (row: Row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
        <span>{(row.rating as number).toFixed(1)}</span>
      </div>
    )
  },
];

const reviewColumns: Column[] = [
  { field: 'reviewer', headerName: 'Reviewer', width: 150 },
  { 
    field: 'rating', 
    headerName: 'Rating', 
    width: 100,
    renderCell: (row: Row) => {
      const rating = row.rating as number;
      return (
        <div style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < rating ? '#f59e0b' : '#d1d5db', fontSize: '14px' }}>
              ★
            </span>
          ))}
        </div>
      );
    }
  },
  { field: 'comment', headerName: 'Comment', width: 300 },
  { field: 'date', headerName: 'Date', width: 100 },
];

export const MasterDetailDemo: React.FC = () => {
  const [products] = useState<Product[]>(sampleProducts);
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([1, 4]);

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '16px', fontSize: '28px', fontWeight: '700' }}>
        Master/Detail Demo - Products & Reviews
      </h1>
      <p style={{ marginBottom: '24px', color: '#6b7280' }}>
        Demonstrates master/detail rows where products can be expanded to show their reviews.
        Click the ▶/▼ icon to expand or collapse review details.
      </p>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setExpandedKeys([1, 2, 3, 4, 5, 6])}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Expand All
        </button>
        <button
          onClick={() => setExpandedKeys([])}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Collapse All
        </button>
      </div>

      <DataGrid
        columns={productColumns}
        rows={products}
        pageSize={20}
        masterDetailConfig={{
          enabled: true,
          isRowMaster: (row) => {
            const product = row as Product;
            return !!product.reviews && product.reviews.length > 0;
          },
          renderDetailRow: ({ masterRow }) => {
            const product = masterRow as Product;
            if (!product.reviews || product.reviews.length === 0) {
              return (
                <div style={{ padding: '16px', color: '#9ca3af', fontStyle: 'italic' }}>
                  No reviews available for this product.
                </div>
              );
            }

            return (
              <div style={{ padding: '12px', backgroundColor: '#f9fafb' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '12px',
                  color: '#374151'
                }}>
                  Customer Reviews ({product.reviews.length})
                </h3>
                <div className="nested-grid-simple">
                  <style>{`
                    .nested-grid-simple .data-grid > div:first-child {
                      display: none !important;
                    }
                  `}</style>
                  <DataGrid
                    columns={reviewColumns}
                    rows={product.reviews}
                    pageSize={10}
                  />
                </div>
              </div>
            );
          },
          detailRowHeight: 300,
          defaultExpandedMasterRowKeys: expandedKeys,
          onDetailRowToggled: ({ masterRow, isOpen }) => {
            console.log(`Product "${(masterRow as Product).productName}" ${isOpen ? 'expanded' : 'collapsed'}`);
            if (isOpen) {
              setExpandedKeys([...expandedKeys, masterRow.id]);
            } else {
              setExpandedKeys(expandedKeys.filter(id => id !== masterRow.id));
            }
          },
        }}
      />

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Features Demonstrated:</h3>
        <ul style={{ marginLeft: '20px', color: '#4b5563', lineHeight: '1.8' }}>
          <li>Master/detail rows with expand/collapse functionality</li>
          <li>Nested DataGrid inside detail rows</li>
          <li>Custom isRowMaster function to determine expandable rows</li>
          <li>Default expanded rows on initial load</li>
          <li>onDetailRowToggled callback for tracking expand/collapse events</li>
          <li>Custom rendering with styled components</li>
          <li>Products without reviews don't show expand icon</li>
        </ul>
      </div>

      {/* Implementation Example */}
      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Implementation Example
        </h2>
        <CodeBlock
          title="Master/Detail Configuration"
          examples={[
            {
              label: 'TypeScript',
              code: `import { DataGrid } from 'react-open-source-grid';
import type { Column, Row } from 'react-open-source-grid';

interface Product extends Row {
  id: number;
  productName: string;
  category: string;
  price: number;
  rating: number;
  reviews?: Review[];
}

interface Review extends Row {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

const productColumns: Column[] = [
  { field: 'productName', headerName: 'Product Name', width: 200 },
  { field: 'category', headerName: 'Category', width: 120 },
  { field: 'price', headerName: 'Price', width: 100 },
  { field: 'rating', headerName: 'Rating', width: 100 },
];

const reviewColumns: Column[] = [
  { field: 'reviewer', headerName: 'Reviewer', width: 150 },
  { field: 'rating', headerName: 'Rating', width: 100 },
  { field: 'comment', headerName: 'Comment', width: 300 },
  { field: 'date', headerName: 'Date', width: 100 },
];

function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>(/* your data */);

  return (
    <DataGrid
      columns={productColumns}
      rows={products}
      masterDetailConfig={{
        enabled: true,
        
        // Only show expand icon for products with reviews
        isRowMaster: (row) => {
          const product = row as Product;
          return !!product.reviews && product.reviews.length > 0;
        },
        
        // Render nested grid with reviews
        renderDetailRow: ({ masterRow }) => {
          const product = masterRow as Product;
          return (
            <div style={{ padding: '12px' }}>
              <h3>Customer Reviews ({product.reviews?.length || 0})</h3>
              <div className="nested-grid-simple">
                <style>{\`
                  .nested-grid-simple .data-grid > div:first-child {
                    display: none !important;
                  }
                \`}</style>
                <DataGrid
                  columns={reviewColumns}
                  rows={product.reviews || []}
                  pageSize={10}
                />
              </div>
            </div>
          );
        },
        
        // Fixed height for detail rows
        detailRowHeight: 300,
        
        // Expand some rows by default
        defaultExpandedMasterRowKeys: [1, 2],
        
        // Track expand/collapse events
        onDetailRowToggled: ({ masterRow, isOpen }) => {
          console.log(\`Product \${masterRow.id} \${isOpen ? 'expanded' : 'collapsed'}\`);
        },
      }}
    />
  );
}`,
              language: 'tsx',
            },
            {
              label: 'JavaScript',
              code: `import { DataGrid } from 'react-open-source-grid';
import { useState } from 'react';

const productColumns = [
  { field: 'productName', headerName: 'Product Name', width: 200 },
  { field: 'category', headerName: 'Category', width: 120 },
  { field: 'price', headerName: 'Price', width: 100 },
  { field: 'rating', headerName: 'Rating', width: 100 },
];

const reviewColumns = [
  { field: 'reviewer', headerName: 'Reviewer', width: 150 },
  { field: 'rating', headerName: 'Rating', width: 100 },
  { field: 'comment', headerName: 'Comment', width: 300 },
  { field: 'date', headerName: 'Date', width: 100 },
];

function ProductsGrid() {
  const [products, setProducts] = useState(/* your data */);

  return (
    <DataGrid
      columns={productColumns}
      rows={products}
      masterDetailConfig={{
        enabled: true,
        
        // Only show expand icon for products with reviews
        isRowMaster: (row) => {
          return !!row.reviews && row.reviews.length > 0;
        },
        
        // Render nested grid with reviews
        renderDetailRow: ({ masterRow }) => {
          return (
            <div style={{ padding: '12px' }}>
              <h3>Customer Reviews ({masterRow.reviews?.length || 0})</h3>
              <DataGrid
                columns={reviewColumns}
                rows={masterRow.reviews || []}
                pageSize={10}
              />
            </div>
          );
        },
        
        // Fixed height for detail rows
        detailRowHeight: 300,
        
        // Expand some rows by default
        defaultExpandedMasterRowKeys: [1, 2],
        
        // Track expand/collapse events
        onDetailRowToggled: ({ masterRow, isOpen }) => {
          console.log(\`Product \${masterRow.id} \${isOpen ? 'expanded' : 'collapsed'}\`);
        },
      }}
    />
  );
}`,
              language: 'jsx',
            },
          ]}
        />
      </section>

      {/* API Reference */}
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          API Reference
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Property</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Default</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#dc2626' }}>enabled</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>boolean</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>-</td>
                <td style={{ padding: '12px' }}>Enable/disable master-detail mode</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#dc2626' }}>isRowMaster</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>(row: Row) =&gt; boolean</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>() =&gt; true</td>
                <td style={{ padding: '12px' }}>Callback to determine if a row can be expanded</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#dc2626' }}>renderDetailRow</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>(params) =&gt; ReactNode</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>-</td>
                <td style={{ padding: '12px' }}>Required. Function that returns the JSX for the detail row</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#dc2626' }}>detailRowHeight</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>number</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>200</td>
                <td style={{ padding: '12px' }}>Fixed height in pixels for detail rows</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#dc2626' }}>detailRowAutoHeight</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>boolean</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>false</td>
                <td style={{ padding: '12px' }}>If true, detail row height adapts to content</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#dc2626' }}>defaultExpandedMasterRowKeys</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>(string | number)[]</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>[]</td>
                <td style={{ padding: '12px' }}>Array of row IDs to expand by default</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#dc2626' }}>onDetailRowToggled</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>(params) =&gt; void</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>-</td>
                <td style={{ padding: '12px' }}>Callback fired when a detail row is expanded or collapsed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
