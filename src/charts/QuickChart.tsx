/**
 * QuickChart - A reusable chart component using Recharts
 * Supports line, bar, area, and pie charts with customization options
 */

import React, { useRef } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toPng } from 'html-to-image';
import { DEFAULT_COLORS } from './rangeToChart';
import type { ChartConfig, ChartType } from './types';
import './QuickChart.css';

export interface QuickChartProps {
  config: ChartConfig;
  onClose?: () => void;
  onChangeType?: (type: ChartType) => void;
  onToggleTheme?: () => void;
  allowTypeSwitch?: boolean;
  allowThemeSwitch?: boolean;
  width?: number;
  height?: number;
}

/**
 * QuickChart component for rendering interactive charts
 */
export const QuickChart: React.FC<QuickChartProps> = ({
  config,
  onClose,
  onChangeType,
  onToggleTheme,
  allowTypeSwitch = true,
  allowThemeSwitch = true,
  width = 600,
  height = 400,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const theme = config.theme || 'light';

  // Transform data for Recharts format
  const transformedData = config.xLabels.map((label, index) => {
    const dataPoint: Record<string, string | number> = { name: label };
    config.series.forEach((series) => {
      dataPoint[series.name] = series.data[index] || 0;
    });
    return dataPoint;
  });

  // For pie charts, transform differently
  const pieData = config.series.length > 0
    ? config.xLabels.map((label, index) => ({
        name: label,
        value: config.series[0].data[index] || 0,
      }))
    : [];

  // Export chart as PNG
  const handleExportPNG = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await toPng(chartRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `${config.title || 'chart'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export chart:', error);
    }
  };

  // Chart type icons
  const chartTypeIcon = (type: ChartType) => {
    switch (type) {
      case 'line':
        return '📈';
      case 'bar':
        return '📊';
      case 'area':
        return '📉';
      case 'pie':
        return '🥧';
      default:
        return '📊';
    }
  };

  // Render the appropriate chart based on type
  const renderChart = () => {
    const commonProps = {
      data: config.type === 'pie' ? pieData : transformedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const axisProps = {
      stroke: theme === 'dark' ? '#888' : '#666',
    };

    const gridProps = {
      strokeDasharray: '3 3',
      stroke: theme === 'dark' ? '#333' : '#ddd',
    };

    switch (config.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
              />
              <Legend />
              {config.series.map((series) => (
                <Line
                  key={series.name}
                  type="monotone"
                  dataKey={series.name}
                  stroke={series.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
              />
              <Legend />
              {config.series.map((series) => (
                <Bar key={series.name} dataKey={series.name} fill={series.color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
              />
              <Legend />
              {config.series.map((series) => (
                <Area
                  key={series.name}
                  type="monotone"
                  dataKey={series.name}
                  fill={series.color}
                  stroke={series.color}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={Math.min(height, width) / 4}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div
      ref={chartRef}
      className={`quick-chart quick-chart--${theme}`}
      style={{ width, height }}
    >
      <div className="quick-chart__header">
        <h3 className="quick-chart__title">{config.title}</h3>
        <div className="quick-chart__controls">
          {allowTypeSwitch && onChangeType && (
            <div className="quick-chart__type-selector">
              {(['line', 'bar', 'area', 'pie'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  className={`quick-chart__type-btn ${
                    config.type === type ? 'quick-chart__type-btn--active' : ''
                  }`}
                  onClick={() => onChangeType(type)}
                  title={`${type.charAt(0).toUpperCase() + type.slice(1)} Chart`}
                  aria-label={`Switch to ${type} chart`}
                >
                  {chartTypeIcon(type)}
                </button>
              ))}
            </div>
          )}
          {allowThemeSwitch && onToggleTheme && (
            <button
              className="quick-chart__btn"
              onClick={onToggleTheme}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
          <button
            className="quick-chart__btn"
            onClick={handleExportPNG}
            title="Export as PNG"
            aria-label="Export chart as PNG"
          >
            📥
          </button>
          {onClose && (
            <button
              className="quick-chart__btn quick-chart__close"
              onClick={onClose}
              title="Close"
              aria-label="Close chart"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="quick-chart__body">{renderChart()}</div>
    </div>
  );
};

export default QuickChart;
