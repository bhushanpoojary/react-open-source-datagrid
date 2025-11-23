import { useState } from 'react'
import { DemoGridPage } from './components/DemoGridPage'
import { VirtualScrollDemo } from './components/VirtualScrollDemo'
import { CellRenderersDemo } from './components/CellRenderersDemo'
import { ColumnFiltersDemo } from './components/ColumnFiltersDemo'
import './App.css'

function App() {
  const [currentDemo, setCurrentDemo] = useState<'standard' | 'virtual' | 'renderers' | 'filters'>('filters')

  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">React DataGrid</h1>
                <p className="text-xs text-neutral-500">Professional Data Table Component</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setCurrentDemo('standard')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  currentDemo === 'standard'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Standard Demo
              </button>
              <button
                onClick={() => setCurrentDemo('virtual')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  currentDemo === 'virtual'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Virtual Scrolling
              </button>
              <button
                onClick={() => setCurrentDemo('renderers')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  currentDemo === 'renderers'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Cell Renderers
              </button>
              <button
                onClick={() => setCurrentDemo('filters')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  currentDemo === 'filters'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Column Filters
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentDemo === 'standard' && <DemoGridPage />}
        {currentDemo === 'virtual' && <VirtualScrollDemo />}
        {currentDemo === 'renderers' && <CellRenderersDemo />}
        {currentDemo === 'filters' && <ColumnFiltersDemo />}
      </main>
    </div>
  )
}

export default App
