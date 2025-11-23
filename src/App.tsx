import { useState } from 'react'
import { DemoGridPage } from './components/DemoGridPage'
import { VirtualScrollDemo } from './components/VirtualScrollDemo'
import { CellRenderersDemo } from './components/CellRenderersDemo'
import { ColumnFiltersDemo } from './components/ColumnFiltersDemo'
import { LayoutPersistenceDemo } from './components/LayoutPersistenceDemo'
import { InfiniteScrollDemo } from './components/InfiniteScrollDemo'
import { ThemesDemo } from './components/ThemesDemo'
import { TreeDataDemo } from './components/TreeDataDemo'
import './App.css'

type DemoType = 'standard' | 'virtual' | 'renderers' | 'filters' | 'persistence' | 'infinite' | 'themes' | 'tree';

interface MenuItem {
  id: DemoType;
  label: string;
  icon: string;
  description: string;
}

function App() {
  const [currentDemo, setCurrentDemo] = useState<DemoType>('standard')

  const menuItems: MenuItem[] = [
    {
      id: 'standard',
      label: 'Standard Demo',
      icon: '',
      description: 'Basic features with pagination',
    },
    {
      id: 'virtual',
      label: 'Virtual Scrolling',
      icon: '',
      description: 'High-performance rendering',
    },
    {
      id: 'infinite',
      label: 'Infinite Scroll',
      icon: '',
      description: 'Server-side 100M rows',
    },
    {
      id: 'tree',
      label: 'Tree Data',
      icon: '🌲',
      description: 'Hierarchical rows & expand/collapse',
    },
    {
      id: 'renderers',
      label: 'Cell Renderers',
      icon: '',
      description: 'Custom cell components',
    },
    {
      id: 'filters',
      label: 'Column Filters',
      icon: '',
      description: 'Advanced filtering options',
    },
    {
      id: 'persistence',
      label: 'Layout Persistence',
      icon: '',
      description: 'Save & restore layouts',
    },
    {
      id: 'themes',
      label: 'Theme System',
      icon: '🎨',
      description: 'Light, Dark, Quartz, Alpine themes',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header with Navigation */}
      <header style={{ backgroundColor: '#2563eb', color: 'white', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>React DataGrid</span>
          </div>

          {/* Menu Items */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentDemo(item.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: currentDemo === item.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: currentDemo === item.id ? 'white' : 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (currentDemo !== item.id) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentDemo !== item.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a 
              href="https://github.com/bhushanpoojary/react-open-source-datagrid" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none' }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#f8fafc' }}>
        {currentDemo === 'standard' && <DemoGridPage />}
        {currentDemo === 'virtual' && <VirtualScrollDemo />}
        {currentDemo === 'infinite' && <InfiniteScrollDemo />}
        {currentDemo === 'tree' && <TreeDataDemo />}
        {currentDemo === 'renderers' && <CellRenderersDemo />}
        {currentDemo === 'filters' && <ColumnFiltersDemo />}
        {currentDemo === 'persistence' && <LayoutPersistenceDemo />}
        {currentDemo === 'themes' && <ThemesDemo />}
      </main>
    </div>
  )
}

export default App
