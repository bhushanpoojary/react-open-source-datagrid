import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { HomePage } from './components/HomePage'
import { DemoGridPage } from './components/DemoGridPage'
import { VirtualScrollDemo } from './components/VirtualScrollDemo'
import { CellRenderersDemo } from './components/CellRenderersDemo'
import { ColumnFiltersDemo } from './components/ColumnFiltersDemo'
import { FacetedSearchDemo } from './components/FacetedSearchDemo'
import { FilteredSearchDemo } from './components/FilteredSearchDemo'
import { LayoutPersistenceDemo } from './components/LayoutPersistenceDemo'
import { InfiniteScrollDemo } from './components/InfiniteScrollDemo'
import { ThemesDemo } from './components/ThemesDemo'
import { DensityModeDemo } from './components/DensityModeDemo'
import { TreeDataDemo } from './components/TreeDataDemo'
import { RowDraggingDemo } from './components/RowDraggingDemo'
import { LiveMarketDemo } from './components/LiveMarketDemo'
import { AccessibilityDemo } from './components/AccessibilityDemo'
import { ContextMenuDemo } from './components/ContextMenuDemo'
import { RowPinningDemo } from './components/RowPinningDemo'
import { TooltipDemo } from './components/TooltipDemo'
import { BenchmarkDemo } from './components/BenchmarkDemo'
import { FeatureGallery } from './components/FeatureGallery'
import { CompleteApiReferencePage } from './components/CompleteApiReferencePage';
import { GridApiDemoPage } from './components/GridApiDemoPage';
import { PivotDemo } from './components/PivotDemo';
import { AdvancedEditorsDemo } from './components/AdvancedEditorsDemo';
import { ChartsDemo } from './components/ChartsDemo';
import { MasterDetailDemo } from './components/MasterDetailDemo';
import './App.css'

type DemoType = 'home' | 'standard' | 'virtual' | 'renderers' | 'filters' | 'faceted' | 'filtered-search' | 'persistence' | 'infinite' | 'themes' | 'density' | 'tree' | 'drag' | 'rowpin' | 'market' | 'accessibility' | 'contextmenu' | 'tooltip' | 'benchmark' | 'gallery' | 'api-reference' | 'api-demo' | 'pivot' | 'advanced-editors' | 'charts' | 'master-detail';

interface MenuItem {
  id: DemoType;
  label: string;
  icon: string;
  description: string;
  path: string;
}

interface MenuCategory {
  label: string;
  icon: string;
  items: MenuItem[];
}

// Route to DemoType mapping
const pathToDemoMap: Record<string, DemoType> = {
  '/': 'home',
  '/demo/standard': 'standard',
  '/demo/virtual-scrolling': 'virtual',
  '/demo/cell-renderers': 'renderers',
  '/demo/column-filters': 'filters',
  '/demo/faceted-search': 'faceted',
  '/demo/filtered-search': 'filtered-search',
  '/demo/layout-persistence': 'persistence',
  '/demo/infinite-scroll': 'infinite',
  '/demo/themes': 'themes',
  '/demo/density-mode': 'density',
  '/demo/tree-data': 'tree',
  '/demo/row-dragging': 'drag',
  '/demo/row-pinning': 'rowpin',
  '/demo/market-data': 'market',
  '/demo/accessibility': 'accessibility',
  '/demo/context-menu': 'contextmenu',
  '/demo/tooltip': 'tooltip',
  '/demo/benchmark': 'benchmark',
  '/demo/feature-gallery': 'gallery',
  '/api/reference': 'api-reference',
  '/api/demo': 'api-demo',
  '/demo/pivot-table': 'pivot',
  '/demo/advanced-editors': 'advanced-editors',
  '/demo/charts': 'charts',
  '/demo/master-detail': 'master-detail',
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['gettingstarted', 'performance', 'datafeatures', 'customization', 'documentation']))
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Derive currentDemo directly from URL
  const currentDemo = pathToDemoMap[location.pathname] || 'home';

  const menuCategories: MenuCategory[] = [
    {
      label: 'Getting Started',
      icon: '🏠',
      items: [
        {
          id: 'home',
          label: 'Home',
          icon: '🏠',
          description: 'Overview and installation',
          path: '/',
        },
        {
          id: 'standard',
          label: 'Standard Demo',
          icon: '📊',
          description: 'Basic features with pagination',
          path: '/demo/standard',
        },
      ],
    },
    {
      label: 'Performance',
      icon: '⚡',
      items: [
        {
          id: 'virtual',
          label: 'Virtual Scrolling',
          icon: '🚀',
          description: 'High-performance rendering',
          path: '/demo/virtual-scrolling',
        },
        {
          id: 'infinite',
          label: 'Infinite Scroll',
          icon: '♾️',
          description: 'Server-side 100M rows',
          path: '/demo/infinite-scroll',
        },
        {
          id: 'market',
          label: 'Market Data',
          icon: '📈',
          description: 'Live streaming with 1000+ updates/sec',
          path: '/demo/market-data',
        },
      ],
    },
    {
      label: 'Data Features',
      icon: '🌲',
      items: [
        {
          id: 'pivot',
          label: 'Pivot Table',
          icon: '📊',
          description: 'Dynamic pivot tables with aggregation',
          path: '/demo/pivot-table',
        },
        {
          id: 'tree',
          label: 'Tree Data',
          icon: '🌲',
          description: 'Hierarchical rows & expand/collapse',
          path: '/demo/tree-data',
        },
        {
          id: 'drag',
          label: 'Row Dragging',
          icon: '↕️',
          description: 'Drag & drop row reordering',
          path: '/demo/row-dragging',
        },
        {
          id: 'rowpin',
          label: 'Row Pinning',
          icon: '📌',
          description: 'Pin rows to top/bottom (sticky)',
          path: '/demo/row-pinning',
        },
        {
          id: 'filters',
          label: 'Column Filters',
          icon: '🔍',
          description: 'Advanced filtering options',
          path: '/demo/column-filters',
        },
        {
          id: 'faceted',
          label: 'Faceted Search',
          icon: '🎯',
          description: 'Filter panel with value counts',
          path: '/demo/faceted-search',
        },
        {
          id: 'filtered-search',
          label: 'Filtered Search Bar',
          icon: '🔍',
          description: 'GitLab-style token-based search',
          path: '/demo/filtered-search',
        },
        {
          id: 'contextmenu',
          label: 'Context Menu',
          icon: '📋',
          description: 'Right-click menu with copy, export, & more',
          path: '/demo/context-menu',
        },
        {
          id: 'advanced-editors',
          label: 'Advanced Editors',
          icon: '✏️',
          description: '5 enterprise cell editors (Select, Date, Numeric, Multi-Select, Markdown)',
          path: '/demo/advanced-editors',
        },
        {
          id: 'charts',
          label: 'Integrated Charts',
          icon: '📊',
          description: 'Quick charts from grid selections',
          path: '/demo/charts',
        },
        {
          id: 'master-detail',
          label: 'Master/Detail',
          icon: '🔽',
          description: 'Expandable rows with nested content',
          path: '/demo/master-detail',
        },
      ],
    },
    {
      label: 'Customization',
      icon: '🎨',
      items: [
        {
          id: 'renderers',
          label: 'Cell Renderers',
          icon: '🎭',
          description: 'Custom cell components',
          path: '/demo/cell-renderers',
        },
        {
          id: 'themes',
          label: 'Theme System',
          icon: '🎨',
          description: '10 built-in themes: Quartz, Alpine, Material, Dark, Nord, Dracula, Solarized, Monokai, One Dark',
          path: '/demo/themes',
        },
        {
          id: 'density',
          label: 'Density Modes',
          icon: '📏',
          description: 'Compact/Normal/Comfortable spacing',
          path: '/demo/density-mode',
        },
        {
          id: 'persistence',
          label: 'Layout Persistence',
          icon: '💾',
          description: 'Save & restore layouts',
          path: '/demo/layout-persistence',
        },
        {
          id: 'tooltip',
          label: 'Tooltips',
          icon: '💬',
          description: 'Cell & row tooltips with smart placement',
          path: '/demo/tooltip',
        },
      ],
    },
    {
      label: 'Accessibility',
      icon: '♿',
      items: [
        {
          id: 'accessibility',
          label: 'Accessibility (A11y)',
          icon: '♿',
          description: 'Keyboard navigation & ARIA support',
          path: '/demo/accessibility',
        },
      ],
    },
    {
      label: 'Documentation',
      icon: '📚',
      items: [
        {
          id: 'api-reference',
          label: 'Grid API Reference',
          icon: '📖',
          description: '100+ methods for programmatic control',
          path: '/api/reference',
        },
        {
          id: 'api-demo',
          label: 'Interactive API Demo',
          icon: '🎮',
          description: 'Try all API methods with live examples',
          path: '/api/demo',
        },
      ],
    },
    {
      label: 'Playground',
      icon: '🧪',
      items: [
        {
          id: 'gallery',
          label: 'Feature Gallery',
          icon: '🎯',
          description: 'Browse all features with live demos',
          path: '/demo/feature-gallery',
        },
        {
          id: 'benchmark',
          label: 'Benchmark (1M rows)',
          icon: '🚀',
          description: 'Test performance with massive datasets',
          path: '/demo/benchmark',
        },
      ],
    },
  ];

  const toggleCategory = (categoryLabel: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryLabel)) {
      newExpanded.delete(categoryLabel);
    } else {
      newExpanded.add(categoryLabel);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter menu items based on search query
  const filteredCategories = menuCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  // Auto-expand categories when searching
  const displayCategories = searchQuery ? filteredCategories : menuCategories;
  const shouldExpand = (categoryLabel: string) => {
    if (searchQuery) return true; // Expand all when searching
    return expandedCategories.has(categoryLabel.toLowerCase().replace(/\s+/g, ''));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff' }}>
      {/* Left Sidebar Navigation */}
      <aside style={{ 
        width: '280px', 
        backgroundColor: '#1e293b', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Sidebar Header */}
        <div style={{ 
          padding: '20px 20px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#0f172a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>React DataGrid</span>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Enterprise-grade data grid
          </div>
        </div>

        {/* Search Box */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                fontSize: '13px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                outline: 'none',
                transition: 'all 0.15s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
            <svg 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: '16px', 
                height: '16px',
                fill: 'rgba(255, 255, 255, 0.5)',
                pointerEvents: 'none'
              }} 
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '3px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
          {searchQuery && filteredCategories.length === 0 && (
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px', 
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center'
            }}>
              No features found
            </div>
          )}
        </div>

        {/* Navigation Tree */}
        <nav style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px 0',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
        }}>
          {displayCategories.map((category) => {
            const isExpanded = shouldExpand(category.label);
            return (
              <div key={category.label} style={{ marginBottom: '8px' }}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.label.toLowerCase().replace(/\s+/g, ''))}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ 
                    fontSize: '16px',
                    transition: 'transform 0.2s',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                  }}>▶</span>
                  <span style={{ fontSize: '16px' }}>{category.icon}</span>
                  <span style={{ flex: 1 }}>{category.label}</span>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div style={{ paddingLeft: '24px' }}>
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          padding: '10px 16px',
                          fontSize: '13px',
                          backgroundColor: currentDemo === item.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                          color: currentDemo === item.id ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
                          border: 'none',
                          borderLeft: currentDemo === item.id ? '3px solid #60a5fa' : '3px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          if (currentDemo !== item.id) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentDemo !== item.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <span style={{ fontSize: '16px', marginTop: '1px' }}>{item.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: currentDemo === item.id ? 600 : 500 }}>
                            {item.label}
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: currentDemo === item.id ? 'rgba(96, 165, 250, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                            marginTop: '2px',
                            lineHeight: '1.3'
                          }}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#0f172a'
        }}>
          <a 
            href="https://github.com/bhushanpoojary/react-open-source-datagrid/issues" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.8)', 
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'color 0.15s',
              marginBottom: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#60a5fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>Report Issue / Feature</span>
          </a>
          <a 
            href="https://github.com/bhushanpoojary/react-open-source-datagrid" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.8)', 
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#f8fafc' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo/standard" element={<DemoGridPage />} />
          <Route path="/demo/virtual-scrolling" element={<VirtualScrollDemo />} />
          <Route path="/demo/infinite-scroll" element={<InfiniteScrollDemo />} />
          <Route path="/demo/market-data" element={<LiveMarketDemo />} />
          <Route path="/demo/accessibility" element={<AccessibilityDemo />} />
          <Route path="/demo/pivot-table" element={<PivotDemo />} />
          <Route path="/demo/tree-data" element={<TreeDataDemo />} />
          <Route path="/demo/row-dragging" element={<RowDraggingDemo />} />
          <Route path="/demo/row-pinning" element={<RowPinningDemo />} />
          <Route path="/demo/cell-renderers" element={<CellRenderersDemo />} />
          <Route path="/demo/column-filters" element={<ColumnFiltersDemo />} />
          <Route path="/demo/faceted-search" element={<FacetedSearchDemo />} />
          <Route path="/demo/filtered-search" element={<FilteredSearchDemo />} />
          <Route path="/demo/context-menu" element={<ContextMenuDemo />} />
          <Route path="/demo/tooltip" element={<TooltipDemo />} />
          <Route path="/demo/layout-persistence" element={<LayoutPersistenceDemo />} />
          <Route path="/demo/themes" element={<ThemesDemo />} />
          <Route path="/demo/density-mode" element={<DensityModeDemo />} />
          <Route path="/demo/feature-gallery" element={<FeatureGallery />} />
          <Route path="/demo/benchmark" element={<BenchmarkDemo />} />
          <Route path="/demo/advanced-editors" element={<AdvancedEditorsDemo />} />
          <Route path="/demo/charts" element={<ChartsDemo />} />
          <Route path="/demo/master-detail" element={<MasterDetailDemo />} />
          <Route path="/api/reference" element={<CompleteApiReferencePage />} />
          <Route path="/api/demo" element={<GridApiDemoPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
