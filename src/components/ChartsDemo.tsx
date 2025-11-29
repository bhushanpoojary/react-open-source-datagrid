/**
 * Charts Demo Page
 * 
 * Demonstrates the integrated charting functionality with Quick Charts
 */

import React, { useState, useMemo, useCallback } from 'react';
import { DataGrid } from './DataGrid';
import type { Column, Row } from './DataGrid/types';
import {
  ChartOverlay,
  buildChartConfigFromRange,
  updateChartType,
  updateChartTheme,
  type ChartConfig,
  type ChartType,
  type GridCellRange,
} from '../charts';
import { CodeBlock } from './CodeBlock';
import './ChartsDemo.css';

// Sample sales data for charts demo
interface SalesData extends Row {
  id: number;
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  units: number;
}

// Generate sample sales data
const generateSalesData = (): SalesData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map((month, index) => {
    const revenue = Math.floor(Math.random() * 50000) + 30000;
    const expenses = Math.floor(Math.random() * 30000) + 15000;
    const profit = revenue - expenses;
    const units = Math.floor(Math.random() * 1000) + 500;

    return {
      id: index + 1,
      month,
      revenue,
      expenses,
      profit,
      units,
    };
  });
};

export const ChartsDemo: React.FC = () => {
  const [salesData] = useState<SalesData[]>(generateSalesData());
  const [selectedRange, setSelectedRange] = useState<GridCellRange | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [showChart, setShowChart] = useState(false);

  // Define columns
  const columns: Column[] = useMemo(() => [
    { field: 'month', headerName: 'Month', width: 100, sortable: true },
    { 
      field: 'revenue', 
      headerName: 'Revenue ($)', 
      width: 130, 
      sortable: true,
      renderCell: (row: Row) => `$${(row.revenue as number).toLocaleString()}`,
    },
    { 
      field: 'expenses', 
      headerName: 'Expenses ($)', 
      width: 130, 
      sortable: true,
      renderCell: (row: Row) => `$${(row.expenses as number).toLocaleString()}`,
    },
    { 
      field: 'profit', 
      headerName: 'Profit ($)', 
      width: 130, 
      sortable: true,
      renderCell: (row: Row) => {
        const profit = row.profit as number;
        const className = profit >= 0 ? 'profit-positive' : 'profit-negative';
        return <span className={className}>${profit.toLocaleString()}</span>;
      },
    },
    { 
      field: 'units', 
      headerName: 'Units Sold', 
      width: 120, 
      sortable: true,
      renderCell: (row: Row) => (row.units as number).toLocaleString(),
    },
  ], []);

  // Handle row selection - convert to range selection
  const handleSelectionChange = useCallback((selectedIds: (string | number)[]) => {
    if (selectedIds.length > 0) {
      // Find indices of selected rows
      const indices = selectedIds.map(id => salesData.findIndex(row => row.id === id)).filter(i => i >= 0);
      if (indices.length > 0) {
        const minRow = Math.min(...indices);
        const maxRow = Math.max(...indices);
        
        // Create a range from selected rows (all numeric columns)
        setSelectedRange({
          start: { rowIndex: minRow, colIndex: 1 }, // Start from first numeric column
          end: { rowIndex: maxRow, colIndex: columns.length - 1 },
        });
      }
    } else {
      setSelectedRange(null);
    }
  }, [salesData, columns.length]);

  // Create chart from selected range
  const handleCreateChart = useCallback((chartType: ChartType = 'line') => {
    if (!selectedRange) return;

    try {
      const config = buildChartConfigFromRange({
        range: selectedRange,
        rows: salesData,
        columns,
        chartType,
        useFirstColumnAsCategory: true,
        title: `Sales ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        theme: 'light',
      });

      setChartConfig(config);
      setShowChart(true);
    } catch (error) {
      console.error('Failed to create chart:', error);
      alert(error instanceof Error ? error.message : 'Failed to create chart');
    }
  }, [selectedRange, salesData, columns]);

  // Handle chart type change
  const handleChangeChartType = useCallback((newType: ChartType) => {
    if (!chartConfig) return;
    const updatedConfig = updateChartType(chartConfig, newType);
    setChartConfig(updatedConfig);
  }, [chartConfig]);

  // Handle theme toggle
  const handleToggleTheme = useCallback(() => {
    if (!chartConfig) return;
    const newTheme = chartConfig.theme === 'light' ? 'dark' : 'light';
    const updatedConfig = updateChartTheme(chartConfig, newTheme);
    setChartConfig(updatedConfig);
  }, [chartConfig]);

  // Close chart overlay
  const handleCloseChart = useCallback(() => {
    setShowChart(false);
  }, []);

  // Handle chart creation from context menu
  const handleCreateChartFromContext = useCallback((
    chartType: ChartType,
    selectedRows: Set<string | number>
  ) => {
    if (selectedRows.size === 0) return;

    // Find indices of selected rows
    const indices = Array.from(selectedRows)
      .map(id => salesData.findIndex(row => row.id === id))
      .filter(i => i >= 0);
    
    if (indices.length === 0) return;

    const minRow = Math.min(...indices);
    const maxRow = Math.max(...indices);
    
    // Create range from selected rows
    const range: GridCellRange = {
      start: { rowIndex: minRow, colIndex: 1 },
      end: { rowIndex: maxRow, colIndex: columns.length - 1 },
    };

    try {
      const config = buildChartConfigFromRange({
        range,
        rows: salesData,
        columns,
        chartType,
        useFirstColumnAsCategory: true,
        title: `Sales ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        theme: 'light',
      });

      setChartConfig(config);
      setShowChart(true);
    } catch (error) {
      console.error('Failed to create chart:', error);
      alert(error instanceof Error ? error.message : 'Failed to create chart');
    }
  }, [salesData, columns]);

  return (
    <div className="charts-demo">
      <div className="charts-demo__header">
        <h1 className="charts-demo__title">Integrated Charts</h1>
        <p className="charts-demo__description">
          Select rows in the grid and create charts via toolbar buttons or right-click context menu.
          You can switch between different chart types and export as PNG.
        </p>
      </div>

      <div className="charts-demo__instructions">
        <h2>How to Use:</h2>
        <ol>
          <li>Select one or more rows in the grid below (click to select, Ctrl+click for multiple)</li>
          <li><strong>Option 1:</strong> Click one of the toolbar "Create Chart" buttons</li>
          <li><strong>Option 2:</strong> Right-click on a selected row and choose "Create Chart" from the menu</li>
          <li>Use the chart controls to switch chart types, toggle theme, or export as PNG</li>
          <li>Click anywhere outside the chart or press ESC to close it</li>
        </ol>
      </div>

      <div className="charts-demo__toolbar">
        <button
          className="charts-demo__btn charts-demo__btn--primary"
          onClick={() => handleCreateChart('line')}
          disabled={!selectedRange}
          title="Create a line chart from selection"
        >
          📈 Create Line Chart
        </button>
        <button
          className="charts-demo__btn charts-demo__btn--primary"
          onClick={() => handleCreateChart('bar')}
          disabled={!selectedRange}
          title="Create a bar chart from selection"
        >
          📊 Create Bar Chart
        </button>
        <button
          className="charts-demo__btn charts-demo__btn--primary"
          onClick={() => handleCreateChart('area')}
          disabled={!selectedRange}
          title="Create an area chart from selection"
        >
          📉 Create Area Chart
        </button>
        <button
          className="charts-demo__btn charts-demo__btn--primary"
          onClick={() => handleCreateChart('pie')}
          disabled={!selectedRange}
          title="Create a pie chart from selection"
        >
          🥧 Create Pie Chart
        </button>
        {selectedRange && (
          <span className="charts-demo__selection-info">
            Range selected: Rows {selectedRange.start.rowIndex + 1}-{selectedRange.end.rowIndex + 1}, 
            Cols {selectedRange.start.colIndex + 1}-{selectedRange.end.colIndex + 1}
          </span>
        )}
      </div>

      <div className="charts-demo__grid-container">
        <DataGrid
          columns={columns}
          rows={salesData}
          pageSize={12}
          onSelectionChange={handleSelectionChange}
          contextMenuConfig={{
            enabled: true,
            showCopy: true,
            showExport: true,
            showChartOptions: true,
            onCreateChart: handleCreateChartFromContext,
          }}
        />
      </div>

      {showChart && chartConfig && (
        <ChartOverlay
          config={chartConfig}
          onClose={handleCloseChart}
          onChangeType={handleChangeChartType}
          onToggleTheme={handleToggleTheme}
          position="center"
          draggable={true}
        />
      )}

      <div className="charts-demo__code-section">
        <h2>Implementation Example</h2>
        <CodeBlock language="tsx" code={`import React, { useState, useCallback } from 'react';
import {
  DataGrid,
  ChartOverlay,
  buildChartConfigFromRange,
  type GridCellRange,
  type ChartConfig,
} from 'react-open-source-datagrid';

export const MyChartDemo = () => {
  const [selectedRange, setSelectedRange] = useState<GridCellRange | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [showChart, setShowChart] = useState(false);

  const handleCreateChart = useCallback(() => {
    if (!selectedRange) return;

    const config = buildChartConfigFromRange({
      range: selectedRange,
      rows: myData,
      columns: myColumns,
      chartType: 'line',
      useFirstColumnAsCategory: true,
    });

    setChartConfig(config);
    setShowChart(true);
  }, [selectedRange]);

  return (
    <>
      <button onClick={handleCreateChart} disabled={!selectedRange}>
        Create Chart
      </button>
      
      <DataGrid
        columns={myColumns}
        rows={myData}
        enableRangeSelection={true}
        onRangeSelectionChange={setSelectedRange}
      />

      {showChart && chartConfig && (
        <ChartOverlay
          config={chartConfig}
          onClose={() => setShowChart(false)}
        />
      )}
    </>
  );
};`} />
      </div>

      <div className="charts-demo__features">
        <h2>Features</h2>
        <div className="charts-demo__feature-grid">
          <div className="charts-demo__feature">
            <h3>📊 Multiple Chart Types</h3>
            <p>Support for line, bar, area, and pie charts with easy switching between types</p>
          </div>
          <div className="charts-demo__feature">
            <h3>🎨 Theme Support</h3>
            <p>Light and dark themes for better visualization in different environments</p>
          </div>
          <div className="charts-demo__feature">
            <h3>📥 Export to PNG</h3>
            <p>Download charts as high-quality PNG images for reports and presentations</p>
          </div>
          <div className="charts-demo__feature">
            <h3>🎯 Range Selection</h3>
            <p>Select any rectangular range of cells to create charts from your data</p>
          </div>
          <div className="charts-demo__feature">
            <h3>🖱️ Draggable</h3>
            <p>Move charts around the screen to position them exactly where you need</p>
          </div>
          <div className="charts-demo__feature">
            <h3>⚡ High Performance</h3>
            <p>Built with Recharts for smooth rendering and interactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsDemo;
