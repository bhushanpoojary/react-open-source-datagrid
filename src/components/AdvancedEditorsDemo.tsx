import React, { useState } from 'react';
import { DataGrid } from './DataGrid';
import type { Column, Row } from './DataGrid/types';
import { CodeBlock } from './CodeBlock';
import {
  RichSelectEditor,
  DateEditor,
  NumericEditor,
  MultiSelectEditor,
  MarkdownEditor,
  type RichSelectOption,
  type MultiSelectOption,
} from '../editors';

/**
 * AdvancedEditorsDemo - Showcase of Advanced Cell Editors
 * 
 * This demo demonstrates all five advanced cell editors:
 * - RichSelectEditor: Searchable dropdown for single selection
 * - DateEditor: Calendar-based date/time picker
 * - NumericEditor: Numeric input with validation and formatting
 * - MultiSelectEditor: Multiple selection with chips/tags
 * - MarkdownEditor: Rich text editor with markdown preview
 * 
 * These editors are fully integrated with the DataGrid and can also be
 * used as standalone components in your own applications via npm.
 */
export const AdvancedEditorsDemo: React.FC = () => {
  const [activeEditor, setActiveEditor] = useState<string | null>(null);

  // Country options for RichSelectEditor
  const countryOptions: RichSelectOption[] = [
    { label: 'United States', value: 'US', icon: '🇺🇸' },
    { label: 'United Kingdom', value: 'GB', icon: '🇬🇧' },
    { label: 'Canada', value: 'CA', icon: '🇨🇦' },
    { label: 'Germany', value: 'DE', icon: '🇩🇪' },
    { label: 'France', value: 'FR', icon: '🇫🇷' },
    { label: 'Japan', value: 'JP', icon: '🇯🇵' },
    { label: 'Australia', value: 'AU', icon: '🇦🇺' },
    { label: 'Brazil', value: 'BR', icon: '🇧🇷' },
    { label: 'India', value: 'IN', icon: '🇮🇳' },
    { label: 'China', value: 'CN', icon: '🇨🇳' },
  ];

  // Tag options for MultiSelectEditor
  const tagOptions: MultiSelectOption[] = [
    { label: 'Urgent', value: 'urgent', icon: '🔥' },
    { label: 'Important', value: 'important', icon: '⭐' },
    { label: 'Bug', value: 'bug', icon: '🐛' },
    { label: 'Feature', value: 'feature', icon: '✨' },
    { label: 'Documentation', value: 'docs', icon: '📝' },
    { label: 'Testing', value: 'testing', icon: '🧪' },
    { label: 'Review', value: 'review', icon: '👀' },
    { label: 'Backend', value: 'backend', icon: '⚙️' },
    { label: 'Frontend', value: 'frontend', icon: '🎨' },
  ];

  // Sample data
  const [orders, setOrders] = useState<Row[]>([
    {
      id: 1,
      orderNumber: 'ORD-1001',
      country: 'US',
      orderDate: '2024-01-15',
      quantity: 5,
      price: 299.99,
      tags: ['urgent', 'important'],
      notes: '# Priority Order\nPlease expedite shipping.\n\n**Customer requested** express delivery.',
    },
    {
      id: 2,
      orderNumber: 'ORD-1002',
      country: 'GB',
      orderDate: '2024-01-16',
      quantity: 12,
      price: 149.50,
      tags: ['feature', 'frontend'],
      notes: 'Standard order. No special instructions.',
    },
    {
      id: 3,
      orderNumber: 'ORD-1003',
      country: 'CA',
      orderDate: '2024-01-17',
      quantity: 8,
      price: 499.00,
      tags: ['bug', 'testing'],
      notes: '## Quality Check\n- Verify packaging\n- Test all units\n- Document results',
    },
    {
      id: 4,
      orderNumber: 'ORD-1004',
      country: 'DE',
      orderDate: '2024-01-18',
      quantity: 3,
      price: 799.99,
      tags: ['review'],
      notes: 'Customer is a _VIP member_. Provide premium packaging.',
    },
    {
      id: 5,
      orderNumber: 'ORD-1005',
      country: 'FR',
      orderDate: '2024-01-19',
      quantity: 15,
      price: 99.99,
      tags: ['docs', 'backend'],
      notes: 'Bulk order for [ABC Corp](https://example.com).\n\nInvoice to be sent separately.',
    },
  ]);

  // Column definitions with integrated advanced editors
  const columns: Column[] = [
    {
      field: 'orderNumber',
      headerName: 'Order #',
      width: 120,
      editable: false,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 180,
      editable: true,
      renderCell: (row: Row) => {
        const country = countryOptions.find((c) => c.value === row.country);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {country?.icon && <span>{country.icon}</span>}
            <span>{country?.label || row.country}</span>
          </div>
        );
      },
      editor: (props) => (
        <RichSelectEditor
          {...props}
          options={countryOptions}
          filterable={true}
          allowClear={false}
        />
      ),
    },
    {
      field: 'orderDate',
      headerName: 'Order Date',
      width: 140,
      editable: true,
      renderCell: (row: Row) => {
        if (!row.orderDate) return '-';
        const date = new Date(row.orderDate);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
      editor: (props) => (
        <DateEditor
          {...props}
          dateFormat="yyyy-MM-dd"
          showTime={false}
          minDate={new Date('2024-01-01')}
          maxDate={new Date('2024-12-31')}
          autoCommit={true}
        />
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      editable: true,
      editor: (props) => (
        <NumericEditor
          {...props}
          min={1}
          max={1000}
          step={1}
          decimals={0}
          showSteppers={true}
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 130,
      editable: true,
      renderCell: (row: Row) => {
        if (row.price == null) return '-';
        return `$${row.price.toFixed(2)}`;
      },
      editor: (props) => (
        <NumericEditor
          {...props}
          min={0}
          max={100000}
          step={0.01}
          decimals={2}
          prefix="$"
          showSteppers={false}
        />
      ),
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 250,
      editable: true,
      renderCell: (row: Row) => {
        const tags = Array.isArray(row.tags) ? row.tags : [];
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {tags.map((tagValue: string) => {
              const tag = tagOptions.find((t) => t.value === tagValue);
              return (
                <span
                  key={tagValue}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    background: '#e6f2ff',
                    color: '#0066cc',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                >
                  {tag?.icon && <span>{tag.icon}</span>}
                  <span>{tag?.label || tagValue}</span>
                </span>
              );
            })}
          </div>
        );
      },
      editor: (props) => (
        <MultiSelectEditor
          {...props}
          options={tagOptions}
          filterable={true}
          maxTagCount={3}
          allowEmpty={true}
        />
      ),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200,
      editable: true,
      renderCell: (row: Row) => {
        const text = row.notes || '';
        const preview = text.length > 50 ? text.substring(0, 50) + '...' : text;
        return (
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={text}
          >
            {preview}
          </div>
        );
      },
      editor: (props) => (
        <MarkdownEditor
          {...props}
          maxLength={500}
          showPreview={true}
          minHeight={200}
          rows={8}
        />
      ),
    },
  ];

  // Handle cell edit
  const handleCellEdit = (rowIndex: number, field: string, value: any) => {
    setOrders((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return updated;
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px' }}>Advanced Cell Editors</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Demonstrates five enterprise-grade cell editors that integrate seamlessly with the DataGrid
        and are also available as standalone components via npm package.
      </p>

      {/* Info Card */}
      <div
        style={{
          background: '#f0f9ff',
          border: '1px solid #0066cc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#0066cc' }}>📦 NPM Package Export</h3>
        <p style={{ margin: '8px 0' }}>
          These editors are exported from the npm package and can be used in any React application:
        </p>
        <CodeBlock
          code={`import {
  RichSelectEditor,
  DateEditor,
  NumericEditor,
  MultiSelectEditor,
  MarkdownEditor,
} from 'react-open-source-datagrid';`}
          language="typescript"
        />
      </div>

      {/* Editor Features Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <EditorCard
          icon="🎯"
          title="RichSelectEditor"
          features={[
            'Searchable dropdown',
            'Keyboard navigation',
            'Custom icons & labels',
            'Disabled options support',
          ]}
        />
        <EditorCard
          icon="📅"
          title="DateEditor"
          features={[
            'Calendar popup',
            'Manual text input',
            'Date range validation',
            'Optional time picker',
          ]}
        />
        <EditorCard
          icon="🔢"
          title="NumericEditor"
          features={[
            'Min/max validation',
            'Stepper buttons',
            'Decimal formatting',
            'Prefix/suffix support',
          ]}
        />
        <EditorCard
          icon="✅"
          title="MultiSelectEditor"
          features={[
            'Multiple selection',
            'Chip/tag display',
            'Search filtering',
            'Checkbox interface',
          ]}
        />
        <EditorCard
          icon="📝"
          title="MarkdownEditor"
          features={[
            'Markdown support',
            'Live preview',
            'Keyboard shortcuts',
            'Character counter',
          ]}
        />
      </div>

      {/* Instructions */}
      <div
        style={{
          background: '#fffbea',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#f59e0b' }}>💡 Try It Out</h3>
        <p style={{ margin: 0 }}>
          <strong>Double-click any cell</strong> in the editable columns below to activate the
          corresponding editor. Each editor demonstrates different interaction patterns and features.
        </p>
      </div>

      {/* Standalone Editor Examples */}
      <h2>Standalone Editor Examples</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        Click the buttons below to try out each editor independently:
      </p>

      {/* RichSelectEditor Example */}
      <StandaloneEditorExample
        title="RichSelectEditor"
        description="Searchable dropdown with keyboard navigation"
        editorId="richselect"
        activeEditor={activeEditor}
        onActivate={setActiveEditor}
      >
        {activeEditor === 'richselect' && (
          <RichSelectEditor
            value="US"
            onChange={(val) => console.log('Selected:', val)}
            onCommit={() => setActiveEditor(null)}
            onCancel={() => setActiveEditor(null)}
            row={{} as Row}
            column={{ field: 'country', headerName: 'Country' }}
            options={countryOptions}
            filterable={true}
            allowClear={false}
          />
        )}
      </StandaloneEditorExample>

      {/* NumericEditor Example */}
      <StandaloneEditorExample
        title="NumericEditor"
        description="Numeric input with validation and formatting"
        editorId="numeric"
        activeEditor={activeEditor}
        onActivate={setActiveEditor}
      >
        {activeEditor === 'numeric' && (
          <NumericEditor
            value={299.99}
            onChange={(val) => console.log('Value:', val)}
            onCommit={() => setActiveEditor(null)}
            onCancel={() => setActiveEditor(null)}
            row={{} as Row}
            column={{ field: 'price', headerName: 'Price' }}
            min={0}
            max={100000}
            step={0.01}
            decimals={2}
            prefix="$"
            showSteppers={true}
          />
        )}
      </StandaloneEditorExample>

      {/* DateEditor Example */}
      <StandaloneEditorExample
        title="DateEditor"
        description="Calendar-based date picker with validation"
        editorId="date"
        activeEditor={activeEditor}
        onActivate={setActiveEditor}
      >
        {activeEditor === 'date' && (
          <DateEditor
            value="2024-01-15"
            onChange={(val) => console.log('Date:', val)}
            onCommit={() => setActiveEditor(null)}
            onCancel={() => setActiveEditor(null)}
            row={{} as Row}
            column={{ field: 'orderDate', headerName: 'Date' }}
            dateFormat="yyyy-MM-dd"
            showTime={false}
            autoCommit={true}
          />
        )}
      </StandaloneEditorExample>

      {/* MultiSelectEditor Example */}
      <StandaloneEditorExample
        title="MultiSelectEditor"
        description="Multiple selection with chips/tags"
        editorId="multiselect"
        activeEditor={activeEditor}
        onActivate={setActiveEditor}
      >
        {activeEditor === 'multiselect' && (
          <MultiSelectEditor
            value={['urgent', 'important']}
            onChange={(val) => console.log('Tags:', val)}
            onCommit={() => setActiveEditor(null)}
            onCancel={() => setActiveEditor(null)}
            row={{} as Row}
            column={{ field: 'tags', headerName: 'Tags' }}
            options={tagOptions}
            filterable={true}
            maxTagCount={3}
          />
        )}
      </StandaloneEditorExample>

      {/* MarkdownEditor Example */}
      <StandaloneEditorExample
        title="MarkdownEditor"
        description="Rich text editor with markdown preview"
        editorId="markdown"
        activeEditor={activeEditor}
        onActivate={setActiveEditor}
      >
        {activeEditor === 'markdown' && (
          <MarkdownEditor
            value="# Sample Note\nThis is a **markdown** editor with _live preview_."
            onChange={(val) => console.log('Content:', val)}
            onCommit={() => setActiveEditor(null)}
            onCancel={() => setActiveEditor(null)}
            row={{} as Row}
            column={{ field: 'notes', headerName: 'Notes' }}
            maxLength={500}
            showPreview={true}
          />
        )}
      </StandaloneEditorExample>

      {/* DataGrid with Advanced Editors */}
      <h2 style={{ marginTop: '48px' }}>DataGrid Integration</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        <strong>Double-click any editable cell</strong> in the grid below to activate the advanced editors!
        Each column uses a different editor type based on its data:
      </p>
      <ul style={{ marginBottom: '16px', color: '#666' }}>
        <li><strong>Country:</strong> RichSelectEditor with searchable dropdown</li>
        <li><strong>Order Date:</strong> DateEditor with calendar popup</li>
        <li><strong>Quantity:</strong> NumericEditor with stepper buttons</li>
        <li><strong>Price:</strong> NumericEditor with $ prefix and decimals</li>
        <li><strong>Tags:</strong> MultiSelectEditor with chip/tag interface</li>
        <li><strong>Notes:</strong> MarkdownEditor with live preview</li>
      </ul>
      <div style={{ marginBottom: '32px' }}>
        <DataGrid
          columns={columns}
          rows={orders}
          pageSize={10}
          onCellEdit={handleCellEdit}
        />
      </div>

      {/* Editor Examples */}
      <h2>Editor Configuration Examples</h2>

      {/* RichSelectEditor Example */}
      <div style={{ marginBottom: '32px' }}>
        <h3>1. RichSelectEditor</h3>
        <p>Searchable dropdown with icons and filtering:</p>
        <CodeBlock
          code={`const countryOptions = [
  { label: 'United States', value: 'US', icon: '🇺🇸' },
  { label: 'United Kingdom', value: 'GB', icon: '🇬🇧' },
  // ... more options
];

<RichSelectEditor
  value={value}
  onChange={onChange}
  onCommit={onCommit}
  onCancel={onCancel}
  options={countryOptions}
  filterable={true}
  allowClear={false}
/>`}
          language="typescript"
        />
      </div>

      {/* DateEditor Example */}
      <div style={{ marginBottom: '32px' }}>
        <h3>2. DateEditor</h3>
        <p>Calendar-based date picker with validation:</p>
        <CodeBlock
          code={`<DateEditor
  value={value}
  onChange={onChange}
  onCommit={onCommit}
  onCancel={onCancel}
  dateFormat="yyyy-MM-dd"
  showTime={false}
  minDate={new Date('2024-01-01')}
  maxDate={new Date('2024-12-31')}
  autoCommit={true}
/>`}
          language="typescript"
        />
      </div>

      {/* NumericEditor Example */}
      <div style={{ marginBottom: '32px' }}>
        <h3>3. NumericEditor</h3>
        <p>Numeric input with validation and formatting:</p>
        <CodeBlock
          code={`<NumericEditor
  value={value}
  onChange={onChange}
  onCommit={onCommit}
  onCancel={onCancel}
  min={0}
  max={100000}
  step={0.01}
  decimals={2}
  prefix="$"
  showSteppers={true}
/>`}
          language="typescript"
        />
      </div>

      {/* MultiSelectEditor Example */}
      <div style={{ marginBottom: '32px' }}>
        <h3>4. MultiSelectEditor</h3>
        <p>Multiple selection with chips/tags:</p>
        <CodeBlock
          code={`const tagOptions = [
  { label: 'Urgent', value: 'urgent', icon: '🔥' },
  { label: 'Important', value: 'important', icon: '⭐' },
  // ... more options
];

<MultiSelectEditor
  value={value}
  onChange={onChange}
  onCommit={onCommit}
  onCancel={onCancel}
  options={tagOptions}
  filterable={true}
  maxTagCount={3}
  allowEmpty={true}
/>`}
          language="typescript"
        />
      </div>

      {/* MarkdownEditor Example */}
      <div style={{ marginBottom: '32px' }}>
        <h3>5. MarkdownEditor</h3>
        <p>Rich text editor with markdown preview:</p>
        <CodeBlock
          code={`<MarkdownEditor
  value={value}
  onChange={onChange}
  onCommit={onCommit}
  onCancel={onCancel}
  maxLength={500}
  showPreview={true}
  minHeight={200}
  rows={8}
/>`}
          language="typescript"
        />
      </div>

      {/* Integration Guide */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#10b981' }}>✨ DataGrid Integration</h3>
        <p>To use editors in DataGrid columns:</p>
        <CodeBlock
          code={`const columns = [
  {
    field: 'country',
    headerName: 'Country',
    editable: true,
    editor: (props) => (
      <RichSelectEditor
        {...props}
        options={countryOptions}
        filterable={true}
      />
    ),
  },
];`}
          language="typescript"
        />
      </div>

      {/* Features List */}
      <h2>Key Features</h2>
      <ul style={{ lineHeight: '1.8' }}>
        <li>
          <strong>Strongly Typed:</strong> Full TypeScript support with comprehensive type
          definitions
        </li>
        <li>
          <strong>Accessible:</strong> ARIA attributes, keyboard navigation, and screen reader
          support
        </li>
        <li>
          <strong>Theme-Friendly:</strong> Uses CSS variables for seamless theme integration
        </li>
        <li>
          <strong>Customizable:</strong> Extensive props for customization and behavior control
        </li>
        <li>
          <strong>Standalone Ready:</strong> Can be used outside DataGrid in any React application
        </li>
        <li>
          <strong>Production Ready:</strong> Enterprise-grade components with proper validation and
          error handling
        </li>
      </ul>
    </div>
  );
};

// Helper component for editor feature cards
const EditorCard: React.FC<{
  icon: string;
  title: string;
  features: string[];
}> = ({ icon, title, features }) => {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        background: '#fff',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <h4 style={{ margin: '0 0 12px 0' }}>{title}</h4>
      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
        {features.map((feature, idx) => (
          <li key={idx} style={{ marginBottom: '4px' }}>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper component for standalone editor examples
const StandaloneEditorExample: React.FC<{
  title: string;
  description: string;
  editorId: string;
  activeEditor: string | null;
  onActivate: (id: string | null) => void;
  children: React.ReactNode;
}> = ({ title, description, editorId, activeEditor, onActivate, children }) => {
  const isActive = activeEditor === editorId;
  
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        background: '#fff',
        marginBottom: '24px',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{title}</h3>
      <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>{description}</p>
      
      {!isActive ? (
        <button
          onClick={() => onActivate(editorId)}
          style={{
            padding: '12px 24px',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#0052a3')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#0066cc')}
        >
          Try {title} →
        </button>
      ) : (
        <div style={{ border: '2px dashed #e5e7eb', borderRadius: '4px', padding: '16px', position: 'relative' }}>
          {children}
          <button
            onClick={() => onActivate(null)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '4px 12px',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
