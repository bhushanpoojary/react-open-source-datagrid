import { useState } from 'react'
import { DemoGridPage } from './components/DemoGridPage'
import { VirtualScrollDemo } from './components/VirtualScrollDemo'
import './App.css'

function App() {
  const [currentDemo, setCurrentDemo] = useState<'standard' | 'virtual'>('standard')

  return (
    <div>
      {/* Demo Switcher */}
      <div className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">React DataGrid Demos</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDemo('standard')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentDemo === 'standard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Standard Demo
            </button>
            <button
              onClick={() => setCurrentDemo('virtual')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentDemo === 'virtual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Virtual Scrolling (50K+ Rows)
            </button>
          </div>
        </div>
      </div>

      {/* Render selected demo */}
      {currentDemo === 'standard' ? <DemoGridPage /> : <VirtualScrollDemo />}
    </div>
  )
}

export default App
