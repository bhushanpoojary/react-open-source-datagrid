# Integrated Charts Feature

## Overview

The React DataGrid now includes powerful integrated charting capabilities, allowing you to create beautiful, interactive charts directly from your grid data. Similar to AG Grid's Quick Charts feature, you can select data ranges and visualize them with line, bar, area, and pie charts.

## Features

### ✨ Key Features

- **📊 Multiple Chart Types**: Line, Bar, Area, and Pie charts
- **🎨 Theme Support**: Light and dark themes with smooth transitions
- **📥 PNG Export**: Download charts as high-quality images
- **🖱️ Interactive Controls**: Switch chart types on the fly
- **🎯 Range Selection**: Create charts from selected grid data
- **💨 High Performance**: Built with Recharts for smooth rendering
- **🔧 Highly Customizable**: Extensive configuration options
- **📦 NPM Package**: Fully exportable for external use

## Installation

The charting feature is included in the main package. Install the required dependencies:

```bash
npm install react-open-source-datagrid recharts html-to-image
```

## Quick Start

### Basic Example

```tsx
import React, { useState, useCallback } from 'react';
import {
  DataGrid,
  ChartOverlay,
  buildChartConfigFromRange,
  type GridCellRange,
  type ChartConfig,
  type Column,
  type Row,
} from 'react-open-source-datagrid';

const MyChartDemo = () => {
  const [selectedRange, setSelectedRange] = useState<GridCellRange | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [showChart, setShowChart] = useState(false);

  const columns: Column[] = [
    { field: 'month', headerName: 'Month', width: 100 },
    { field: 'revenue', headerName: 'Revenue', width: 130 },
    { field: 'expenses', headerName: 'Expenses', width: 130 },
  ];

  const rows: Row[] = [
    { id: 1, month: 'Jan', revenue: 45000, expenses: 28000 },
    { id: 2, month: 'Feb', revenue: 52000, expenses: 30000 },
    { id: 3, month: 'Mar', revenue: 48000, expenses: 29000 },
    // ... more data
  ];

  const handleCreateChart = useCallback(() => {
    if (!selectedRange) return;

    const config = buildChartConfigFromRange({
      range: selectedRange,
      rows,
      columns,
      chartType: 'line',
      useFirstColumnAsCategory: true,
      title: 'Sales Chart',
      theme: 'light',
    });

    setChartConfig(config);
    setShowChart(true);
  }, [selectedRange, rows, columns]);

  const handleSelectionChange = useCallback((selectedIds: (string | number)[]) => {
    // Convert row selection to range
    if (selectedIds.length > 0) {
      const indices = selectedIds.map(id => rows.findIndex(row => row.id === id));
      const minRow = Math.min(...indices);
      const maxRow = Math.max(...indices);
      
      setSelectedRange({
        start: { rowIndex: minRow, colIndex: 1 },
        end: { rowIndex: maxRow, colIndex: columns.length - 1 },
      });
    } else {
      setSelectedRange(null);
    }
  }, [rows, columns]);

  return (
    <div>
      <button onClick={handleCreateChart} disabled={!selectedRange}>
        Create Chart
      </button>
      
      <DataGrid
        columns={columns}
        rows={rows}
        onSelectionChange={handleSelectionChange}
      />

      {showChart && chartConfig && (
        <ChartOverlay
          config={chartConfig}
          onClose={() => setShowChart(false)}
          onChangeType={(type) => setChartConfig({ ...chartConfig, type })}
          onToggleTheme={() => setChartConfig({
            ...chartConfig,
            theme: chartConfig.theme === 'light' ? 'dark' : 'light',
          })}
        />
      )}
    </div>
  );
};
```

## API Reference

### Types

#### `ChartType`

```typescript
type ChartType = 'line' | 'bar' | 'area' | 'pie';
```

#### `GridCellRange`

```typescript
interface GridCellRange {
  start: CellAddress;
  end: CellAddress; // inclusive, can be in any order
}

interface CellAddress {
  rowIndex: number;
  colIndex: number;
}
```

#### `ChartConfig`

```typescript
interface ChartConfig {
  id: string;
  type: ChartType;
  title?: string;
  xLabels: (string | number)[];
  series: ChartSeries[];
  theme?: 'light' | 'dark';
}

interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}
```

#### `RangeToChartOptions`

```typescript
interface RangeToChartOptions {
  range: GridCellRange;
  rows: Row[];
  columns: Column[];
  chartType: ChartType;
  useFirstColumnAsCategory?: boolean; // default: true
  title?: string;
  theme?: 'light' | 'dark';
}
```

### Functions

#### `buildChartConfigFromRange`

Converts a grid cell range into a chart configuration.

```typescript
function buildChartConfigFromRange(
  options: RangeToChartOptions
): ChartConfig;
```

**Parameters:**
- `options.range`: The selected cell range
- `options.rows`: Array of row data
- `options.columns`: Array of column definitions
- `options.chartType`: Type of chart to create
- `options.useFirstColumnAsCategory`: Use first column as X-axis labels (default: true)
- `options.title`: Chart title (optional)
- `options.theme`: Chart theme (default: 'light')

**Returns:** A `ChartConfig` object ready for rendering

**Throws:** Error if range is invalid or no numeric data found

**Example:**

```typescript
const config = buildChartConfigFromRange({
  range: {
    start: { rowIndex: 0, colIndex: 0 },
    end: { rowIndex: 11, colIndex: 4 },
  },
  rows: salesData,
  columns: columnDefs,
  chartType: 'bar',
  useFirstColumnAsCategory: true,
  title: 'Quarterly Sales',
  theme: 'dark',
});
```

#### `updateChartType`

Updates an existing chart configuration with a new chart type.

```typescript
function updateChartType(
  config: ChartConfig,
  newType: ChartType
): ChartConfig;
```

#### `updateChartTheme`

Updates an existing chart configuration with a new theme.

```typescript
function updateChartTheme(
  config: ChartConfig,
  newTheme: 'light' | 'dark'
): ChartConfig;
```

#### `normalizeRange`

Normalizes a grid cell range so start is always top-left.

```typescript
function normalizeRange(range: GridCellRange): NormalizedRange;
```

### Components

#### `QuickChart`

A reusable chart component that renders different chart types.

```typescript
interface QuickChartProps {
  config: ChartConfig;
  onClose?: () => void;
  onChangeType?: (type: ChartType) => void;
  onToggleTheme?: () => void;
  allowTypeSwitch?: boolean;  // default: true
  allowThemeSwitch?: boolean; // default: true
  width?: number;             // default: 600
  height?: number;            // default: 400
}

export const QuickChart: React.FC<QuickChartProps>;
```

**Features:**
- Renders line, bar, area, and pie charts
- Interactive tooltips and legends
- Chart type switcher buttons
- Theme toggle (light/dark)
- PNG export functionality
- Responsive design

**Example:**

```tsx
<QuickChart
  config={chartConfig}
  onClose={handleClose}
  onChangeType={handleChangeType}
  onToggleTheme={handleToggleTheme}
  allowTypeSwitch={true}
  allowThemeSwitch={true}
  width={800}
  height={500}
/>
```

#### `ChartOverlay`

A floating panel component that displays charts as overlays.

```typescript
interface ChartOverlayProps {
  config: ChartConfig;
  onClose: () => void;
  onChangeType?: (type: ChartType) => void;
  onToggleTheme?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  draggable?: boolean;    // default: true
  resizable?: boolean;    // default: false
}

export const ChartOverlay: React.FC<ChartOverlayProps>;
```

**Features:**
- Floating panel with backdrop
- Draggable positioning
- Multiple anchor positions
- ESC key to close
- Click outside to close
- Smooth animations

**Example:**

```tsx
<ChartOverlay
  config={chartConfig}
  onClose={() => setShowChart(false)}
  onChangeType={(type) => setChartType(type)}
  position="center"
  draggable={true}
/>
```

## Advanced Usage

### Custom Chart Colors

```typescript
const config = buildChartConfigFromRange({
  range: myRange,
  rows: myRows,
  columns: myColumns,
  chartType: 'bar',
});

// Customize series colors
config.series.forEach((series, index) => {
  series.color = customColors[index];
});

setChartConfig(config);
```

### Multiple Charts

```typescript
const [charts, setCharts] = useState<ChartConfig[]>([]);

const handleCreateChart = (chartType: ChartType) => {
  if (!selectedRange) return;
  
  const config = buildChartConfigFromRange({
    range: selectedRange,
    rows: data,
    columns: cols,
    chartType,
  });
  
  setCharts([...charts, config]);
};

// Render multiple overlays
{charts.map((config) => (
  <ChartOverlay
    key={config.id}
    config={config}
    onClose={() => setCharts(charts.filter(c => c.id !== config.id))}
  />
))}
```

### Dynamic Data Updates

```typescript
useEffect(() => {
  if (!chartConfig || !selectedRange) return;
  
  // Rebuild chart when data changes
  const updatedConfig = buildChartConfigFromRange({
    range: selectedRange,
    rows: liveData, // Updated data
    columns,
    chartType: chartConfig.type,
    title: chartConfig.title,
    theme: chartConfig.theme,
  });
  
  setChartConfig(updatedConfig);
}, [liveData, selectedRange]);
```

### Export All Charts

```typescript
const exportAllCharts = async () => {
  const promises = charts.map(async (config) => {
    // Create a temporary chart element
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    document.body.appendChild(div);
    
    // Render chart
    const root = createRoot(div);
    root.render(<QuickChart config={config} />);
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Export to PNG
    const dataUrl = await toPng(div);
    
    // Download
    const link = document.createElement('a');
    link.download = `${config.title}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    
    // Cleanup
    root.unmount();
    document.body.removeChild(div);
  });
  
  await Promise.all(promises);
};
```

## Chart Data Processing

### How Data is Processed

1. **Range Normalization**: The selected range is normalized so start is always top-left
2. **Category Extraction**: First column values become X-axis labels (or row indices if `useFirstColumnAsCategory` is false)
3. **Series Extraction**: Remaining columns with numeric data become chart series
4. **Filtering**: Non-numeric values are converted to 0
5. **Pie Chart Special Handling**: For pie charts, all series are summed into one

### Data Requirements

- **Minimum**: At least one numeric column in the selection
- **Recommended**: One category column (text) + one or more numeric columns
- **Pie Charts**: Best with one category column and one numeric column

### Example Data Structure

```typescript
// Good for line/bar/area charts
const data = [
  { month: 'Jan', revenue: 45000, expenses: 28000, profit: 17000 },
  { month: 'Feb', revenue: 52000, expenses: 30000, profit: 22000 },
  // ...
];

// Good for pie charts
const pieData = [
  { category: 'North', value: 25000 },
  { category: 'South', value: 18000 },
  { category: 'East', value: 32000 },
  { category: 'West', value: 22000 },
];
```

## Styling and Theming

### Built-in Themes

The charts support two built-in themes:

- **Light Theme**: White background, dark text
- **Dark Theme**: Dark background, light text

### Custom Styling

You can override styles using CSS:

```css
/* Override chart container */
.quick-chart {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Override header */
.quick-chart__header {
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
}

/* Override buttons */
.quick-chart__btn {
  border-radius: 8px;
}
```

## Performance Tips

1. **Limit Data Range**: Select only the data you need for the chart
2. **Use Pagination**: For large datasets, select data from current page
3. **Debounce Updates**: When data updates frequently, debounce chart rebuilds
4. **Memoize Configs**: Use `useMemo` for chart configurations
5. **Virtual Scrolling**: Enable virtual scrolling for grids with 1000+ rows

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (14+)
- Mobile: ✅ Responsive design

## Accessibility

The charts feature includes:

- Keyboard navigation (ESC to close)
- ARIA labels on buttons
- Screen reader announcements
- High contrast theme support

## Troubleshooting

### Chart Not Displaying

- Verify `selectedRange` is not null
- Check that selected data includes numeric columns
- Ensure rows and columns arrays are not empty

### Export Not Working

- Check browser console for errors
- Verify `html-to-image` is installed
- Try with a smaller chart size

### Theme Not Updating

- Ensure you're calling `onToggleTheme` or `updateChartTheme`
- Check that new config is being passed to component

## Future Enhancements

Planned features for future releases:

- 📊 More chart types (scatter, combo, heatmap)
- 🎨 Custom color schemes
- 📐 Chart resizing
- 💾 Save chart configurations
- 📊 Chart templates
- 🔗 Share chart URLs
- 📱 Better mobile support
- 🖼️ SVG export option

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 📖 [Documentation](https://bhushanpoojary.github.io/react-open-source-datagrid)
- 🐛 [Issue Tracker](https://github.com/bhushanpoojary/react-open-source-datagrid/issues)
- 💬 [Discussions](https://github.com/bhushanpoojary/react-open-source-datagrid/discussions)

---

Made with ❤️ by the React DataGrid team
