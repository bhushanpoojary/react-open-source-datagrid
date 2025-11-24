import { useState } from 'react'
import { DemoGridPage } from './components/DemoGridPage'
import { VirtualScrollDemo } from './components/VirtualScrollDemo'
import { CellRenderersDemo } from './components/CellRenderersDemo'
import { ColumnFiltersDemo } from './components/ColumnFiltersDemo'
import { LayoutPersistenceDemo } from './components/LayoutPersistenceDemo'
import { InfiniteScrollDemo } from './components/InfiniteScrollDemo'
import { ThemesDemo } from './components/ThemesDemo'
import { TreeDataDemo } from './components/TreeDataDemo'
import { RowDraggingDemo } from './components/RowDraggingDemo'
import { LiveMarketDemo } from './components/LiveMarketDemo'
import './App.css'

type DemoType = 'standard' | 'virtual' | 'renderers' | 'filters' | 'persistence' | 'infinite' | 'themes' | 'tree' | 'drag' | 'market';

interface MenuItem {
  id: DemoType;
  label: string;
  icon: string;
  description: string;
}

interface MenuCategory {
  label: string;
  icon: string;
  items: MenuItem[];
}

function App() {
  const [currentDemo, setCurrentDemo] = useState<DemoType>('standard')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['core', 'performance', 'features', 'customization']))

  const menuCategories: MenuCategory[] = [
    {
      label: 'Core Features',
      icon: '📊',
      items: [
        {
          id: 'standard',
          label: 'Standard Demo',
          icon: '🏠',
          description: 'Basic features with pagination',
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
        },
        {
          id: 'infinite',
          label: 'Infinite Scroll',
          icon: '♾️',
          description: 'Server-side 100M rows',
        },
        {
          id: 'market',
          label: 'Market Data',
          icon: '📈',
          description: 'Live streaming with 1000+ updates/sec',
        },
      ],
    },
    {
      label: 'Data Features',
      icon: '🌲',
      items: [
        {
          id: 'tree',
          label: 'Tree Data',
          icon: '🌲',
          description: 'Hierarchical rows & expand/collapse',
        },
        {
          id: 'drag',
          label: 'Row Dragging',
          icon: '↕️',
          description: 'Drag & drop row reordering',
        },
        {
          id: 'filters',
          label: 'Column Filters',
          icon: '🔍',
          description: 'Advanced filtering options',
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
        },
        {
          id: 'themes',
          label: 'Theme System',
          icon: '🎨',
          description: 'Light, Dark, Quartz, Alpine themes',
        },
        {
          id: 'persistence',
          label: 'Layout Persistence',
          icon: '💾',
          description: 'Save & restore layouts',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>React DataGrid</span>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Enterprise-grade data grid
          </div>
        </div>

        {/* Navigation Tree */}
        <nav style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px 0',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
        }}>
          {menuCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.label.toLowerCase().replace(/\s+/g, ''));
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
                        onClick={() => setCurrentDemo(item.id)}
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
        {currentDemo === 'standard' && <DemoGridPage />}
        {currentDemo === 'virtual' && <VirtualScrollDemo />}
        {currentDemo === 'infinite' && <InfiniteScrollDemo />}
        {currentDemo === 'market' && <LiveMarketDemo />}
        {currentDemo === 'tree' && <TreeDataDemo />}
        {currentDemo === 'drag' && <RowDraggingDemo />}
        {currentDemo === 'renderers' && <CellRenderersDemo />}
        {currentDemo === 'filters' && <ColumnFiltersDemo />}
        {currentDemo === 'persistence' && <LayoutPersistenceDemo />}
        {currentDemo === 'themes' && <ThemesDemo />}
      </main>
    </div>
  )
}

export default App
