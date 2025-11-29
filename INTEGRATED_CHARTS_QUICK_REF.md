# Integrated Charts - Quick Reference

## 🚀 Installation

```bash
npm install react-open-source-datagrid recharts html-to-image
```

## 📦 Import

```typescript
import {
  DataGrid,
  ChartOverlay,
  QuickChart,
  buildChartConfigFromRange,
  updateChartType,
  updateChartTheme,
  type ChartConfig,
  type ChartType,
  type GridCellRange,
} from 'react-open-source-datagrid';
```

## ⚡ Quick Start

```tsx
const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
const [showChart, setShowChart] = useState(false);

// Create chart from selected range
const config = buildChartConfigFromRange({
  range: { start: { rowIndex: 0, colIndex: 1 }, end: { rowIndex: 5, colIndex: 3 } },
  rows: myData,
  columns: myColumns,
  chartType: 'line',
});

setChartConfig(config);
setShowChart(true);

// Render overlay
{showChart && chartConfig && (
  <ChartOverlay
    config={chartConfig}
    onClose={() => setShowChart(false)}
    onChangeType={(type) => setChartConfig(updateChartType(chartConfig, type))}
  />
)}
```

## 📊 Chart Types

| Type | Icon | Use Case |
|------|------|----------|
| `line` | 📈 | Trends over time |
| `bar` | 📊 | Comparisons |
| `area` | 📉 | Volume/cumulative data |
| `pie` | 🥧 | Proportions/percentages |

## 🎨 Themes

```typescript
// Light theme
config.theme = 'light';

// Dark theme
config.theme = 'dark';

// Toggle
const newConfig = updateChartTheme(config, config.theme === 'light' ? 'dark' : 'light');
```

## 🎯 Common Patterns

### Pattern 1: Create Chart Button

```tsx
<button 
  onClick={() => handleCreateChart('bar')}
  disabled={!selectedRange}
>
  📊 Create Bar Chart
</button>
```

### Pattern 2: Multiple Chart Types

```tsx
const chartTypes: ChartType[] = ['line', 'bar', 'area', 'pie'];

{chartTypes.map(type => (
  <button key={type} onClick={() => handleCreateChart(type)}>
    Create {type} chart
  </button>
))}
```

### Pattern 3: Export to PNG

```tsx
// Built into QuickChart - just click the 📥 button
// Or programmatically:
const exportChart = async () => {
  const chartElement = document.querySelector('.quick-chart');
  const dataUrl = await toPng(chartElement);
  const link = document.createElement('a');
  link.download = 'chart.png';
  link.href = dataUrl;
  link.click();
};
```

## 🔧 Configuration Options

### `buildChartConfigFromRange`

```typescript
{
  range: GridCellRange,              // Required: Selected cell range
  rows: Row[],                       // Required: Row data
  columns: Column[],                 // Required: Column definitions
  chartType: ChartType,              // Required: Chart type
  useFirstColumnAsCategory?: boolean, // Optional: Use first col as X-axis (default: true)
  title?: string,                    // Optional: Chart title
  theme?: 'light' | 'dark',         // Optional: Theme (default: 'light')
}
```

### `QuickChart` Props

```typescript
{
  config: ChartConfig,               // Required: Chart configuration
  onClose?: () => void,              // Optional: Close handler
  onChangeType?: (type) => void,     // Optional: Type change handler
  onToggleTheme?: () => void,        // Optional: Theme toggle handler
  allowTypeSwitch?: boolean,         // Optional: Show type buttons (default: true)
  allowThemeSwitch?: boolean,        // Optional: Show theme button (default: true)
  width?: number,                    // Optional: Width in pixels (default: 600)
  height?: number,                   // Optional: Height in pixels (default: 400)
}
```

### `ChartOverlay` Props

```typescript
{
  config: ChartConfig,               // Required: Chart configuration
  onClose: () => void,               // Required: Close handler
  onChangeType?: (type) => void,     // Optional: Type change handler
  onToggleTheme?: () => void,        // Optional: Theme toggle handler
  position?: string,                 // Optional: Position (default: 'bottom-right')
  draggable?: boolean,               // Optional: Enable drag (default: true)
}
```

### Positions

- `'top-right'`
- `'top-left'`
- `'bottom-right'`
- `'bottom-left'`
- `'center'`

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "No numeric data found" | Ensure selection includes numeric columns |
| Chart not showing | Check `showChart` state and `chartConfig` is not null |
| Export fails | Verify `html-to-image` is installed |
| Theme not changing | Pass updated config to component |

## 💡 Pro Tips

1. **Select Wisely**: Include category column + numeric columns
2. **Row Selection**: Use Shift+Click for range selection
3. **Quick Switch**: Use chart type buttons in overlay
4. **Keyboard**: Press ESC to close overlay
5. **Theme Match**: Match chart theme to your app theme

## 📝 Type Definitions

```typescript
// Cell address in grid
interface CellAddress {
  rowIndex: number;
  colIndex: number;
}

// Range of cells
interface GridCellRange {
  start: CellAddress;
  end: CellAddress;
}

// Chart types
type ChartType = 'line' | 'bar' | 'area' | 'pie';

// Chart series
interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

// Complete chart config
interface ChartConfig {
  id: string;
  type: ChartType;
  title?: string;
  xLabels: (string | number)[];
  series: ChartSeries[];
  theme?: 'light' | 'dark';
}
```

## 🎯 Examples

### Example 1: Sales Dashboard

```tsx
const salesColumns = [
  { field: 'month', headerName: 'Month' },
  { field: 'revenue', headerName: 'Revenue' },
  { field: 'expenses', headerName: 'Expenses' },
  { field: 'profit', headerName: 'Profit' },
];

// Select all rows, revenue to profit columns
const range = {
  start: { rowIndex: 0, colIndex: 1 },
  end: { rowIndex: 11, colIndex: 3 },
};

const config = buildChartConfigFromRange({
  range,
  rows: salesData,
  columns: salesColumns,
  chartType: 'line',
  title: 'Sales Trends 2024',
});
```

### Example 2: Market Share Pie

```tsx
const marketColumns = [
  { field: 'region', headerName: 'Region' },
  { field: 'sales', headerName: 'Sales' },
];

const range = {
  start: { rowIndex: 0, colIndex: 0 },
  end: { rowIndex: 4, colIndex: 1 },
};

const config = buildChartConfigFromRange({
  range,
  rows: marketData,
  columns: marketColumns,
  chartType: 'pie',
  title: 'Market Share by Region',
});
```

### Example 3: Comparison Bar Chart

```tsx
const comparisonColumns = [
  { field: 'product', headerName: 'Product' },
  { field: 'q1', headerName: 'Q1' },
  { field: 'q2', headerName: 'Q2' },
  { field: 'q3', headerName: 'Q3' },
  { field: 'q4', headerName: 'Q4' },
];

const range = {
  start: { rowIndex: 0, colIndex: 0 },
  end: { rowIndex: 6, colIndex: 4 },
};

const config = buildChartConfigFromRange({
  range,
  rows: quarterlyData,
  columns: comparisonColumns,
  chartType: 'bar',
  title: 'Quarterly Performance',
});
```

## 🔗 Links

- 📖 [Full Documentation](INTEGRATED_CHARTS.md)
- 🎮 [Live Demo](http://localhost:5173/demo/charts)
- 💻 [GitHub](https://github.com/bhushanpoojary/react-open-source-datagrid)
- 🐛 [Report Issues](https://github.com/bhushanpoojary/react-open-source-datagrid/issues)

---

**Need help?** Check the [full documentation](INTEGRATED_CHARTS.md) or [open an issue](https://github.com/bhushanpoojary/react-open-source-datagrid/issues).
