import { useState } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  demoLink: string;
  tags: string[];
  imageUrl?: string;
}

export const FeatureGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const features: Feature[] = [
    {
      id: 'virtual-scroll',
      title: 'Virtual Scrolling',
      description: 'Render millions of rows with smooth 60 FPS scrolling. Only visible rows are in the DOM.',
      icon: '⚡',
      category: 'Performance',
      demoLink: 'virtual',
      tags: ['performance', 'core', 'essential'],
    },
    {
      id: 'infinite-scroll',
      title: 'Infinite Scrolling',
      description: 'Load data on-demand as users scroll. Perfect for paginated APIs and large remote datasets.',
      icon: '🔄',
      category: 'Performance',
      demoLink: 'infinite',
      tags: ['performance', 'async', 'pagination'],
    },
    {
      id: 'column-filters',
      title: 'Column Filters',
      description: 'Advanced filtering with 10+ operators: equals, contains, starts with, date ranges, and more.',
      icon: '🔍',
      category: 'Data Features',
      demoLink: 'filters',
      tags: ['filtering', 'search', 'essential'],
    },
    {
      id: 'faceted-search',
      title: 'Faceted Search',
      description: 'Filter panel with value counts. Perfect for e-commerce catalogs and analytics dashboards.',
      icon: '📊',
      category: 'Data Features',
      demoLink: 'faceted',
      tags: ['filtering', 'analytics', 'e-commerce'],
    },
    {
      id: 'tree-data',
      title: 'Tree Data',
      description: 'Hierarchical data with expand/collapse. Ideal for org charts, file trees, and nested categories.',
      icon: '🌳',
      category: 'Data Features',
      demoLink: 'tree',
      tags: ['hierarchy', 'structure', 'nested'],
    },
    {
      id: 'market-data',
      title: 'Market Data Mode',
      description: 'Real-time updates with cell flashing. Built for financial trading apps and live dashboards.',
      icon: '📈',
      category: 'Performance',
      demoLink: 'market',
      tags: ['realtime', 'financial', 'updates'],
    },
    {
      id: 'cell-renderers',
      title: 'Custom Cell Renderers',
      description: 'Rich cell rendering: avatars, badges, progress bars, buttons, images, and more.',
      icon: '🎨',
      category: 'Customization',
      demoLink: 'renderers',
      tags: ['customization', 'ui', 'components'],
    },
    {
      id: 'row-dragging',
      title: 'Row Dragging',
      description: 'Drag & drop rows to reorder. Perfect for task lists, prioritization, and kanban boards.',
      icon: '↕️',
      category: 'Interaction',
      demoLink: 'drag',
      tags: ['interaction', 'reorder', 'dnd'],
    },
    {
      id: 'row-pinning',
      title: 'Row Pinning',
      description: 'Pin important rows to top or bottom. Keep key data always visible while scrolling.',
      icon: '📌',
      category: 'Interaction',
      demoLink: 'rowpin',
      tags: ['pinning', 'sticky', 'fixed'],
    },
    {
      id: 'context-menu',
      title: 'Context Menu',
      description: 'Right-click menus on rows, cells, and headers. Fully customizable actions and shortcuts.',
      icon: '📋',
      category: 'Interaction',
      demoLink: 'contextmenu',
      tags: ['menu', 'actions', 'shortcuts'],
    },
    {
      id: 'layout-persistence',
      title: 'Layout Persistence',
      description: 'Save column order, widths, and sort state. Perfect for personalized user experiences.',
      icon: '💾',
      category: 'UX Features',
      demoLink: 'persistence',
      tags: ['persistence', 'state', 'localStorage'],
    },
    {
      id: 'themes',
      title: 'Theming',
      description: 'Multiple built-in themes: Light, Dark, Blue, Green. Fully customizable styling system.',
      icon: '🎨',
      category: 'Customization',
      demoLink: 'themes',
      tags: ['themes', 'styling', 'appearance'],
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: 'WCAG 2.1 AA compliant. Full keyboard navigation, ARIA labels, and screen reader support.',
      icon: '♿',
      category: 'UX Features',
      demoLink: 'accessibility',
      tags: ['a11y', 'wcag', 'keyboard'],
    },
    {
      id: 'tooltips',
      title: 'Tooltips',
      description: 'Rich tooltips on hover. Show additional context without cluttering the grid.',
      icon: '💬',
      category: 'UX Features',
      demoLink: 'tooltip',
      tags: ['tooltip', 'hover', 'info'],
    },
  ];

  const categories = ['all', 'Performance', 'Data Features', 'Interaction', 'Customization', 'UX Features'];

  const filteredFeatures = features.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '32px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            marginBottom: '12px',
            color: '#111827',
            margin: '0 0 12px 0'
          }}>
            🎯 Feature Gallery
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280',
            margin: '0 0 24px 0'
          }}>
            Explore all DataGrid features with interactive demos. Click any card to try it live.
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{ marginBottom: '32px' }}>
          {/* Search */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="🔍 Search features, tags, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: selectedCategory === category ? '#3b82f6' : '#ffffff',
                  color: selectedCategory === category ? '#ffffff' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                {category === 'all' ? 'All Features' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div style={{ 
          marginBottom: '24px', 
          fontSize: '14px', 
          color: '#6b7280',
          fontWeight: 500
        }}>
          Showing {filteredFeatures.length} of {features.length} features
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {filteredFeatures.map(feature => (
            <a
              key={feature.id}
              href={`#${feature.demoLink}`}
              style={{
                display: 'block',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Icon */}
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px',
                height: '60px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                lineHeight: '1.6',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                {feature.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {feature.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Category Badge */}
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {feature.category}
              </div>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {filteredFeatures.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
              No features found
            </h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <div style={{
          marginTop: '48px',
          padding: '32px',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
            Ready to build something amazing?
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.9, margin: '0 0 24px 0' }}>
            Get started with our comprehensive documentation and examples
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '12px 32px',
                backgroundColor: '#ffffff',
                color: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📚 View Documentation
            </button>
            <button
              style={{
                padding: '12px 32px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              💻 View on GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGallery;
