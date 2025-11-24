import { useState } from 'react';
import { ThemedDataGrid } from './DataGrid';
import type { Column, Row, TooltipConfig } from './DataGrid/types';

interface SampleData {
  id: number;
  symbol: string;
  company: string;
  price: number;
  change: number;
  volume: number;
  marketCap: string;
  sector: string;
}

const generateData = (count: number): SampleData[] => {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT'];
  const companies = [
    'Apple Inc.',
    'Microsoft Corporation',
    'Alphabet Inc.',
    'Amazon.com Inc.',
    'Meta Platforms Inc.',
    'Tesla Inc.',
    'NVIDIA Corporation',
    'JPMorgan Chase & Co.',
    'Visa Inc.',
    'Walmart Inc.',
  ];
  const sectors = ['Technology', 'Consumer', 'Finance', 'Healthcare', 'Energy'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    symbol: symbols[i % symbols.length],
    company: companies[i % companies.length],
    price: Math.random() * 500 + 50,
    change: (Math.random() - 0.5) * 10,
    volume: Math.floor(Math.random() * 100000000),
    marketCap: `${(Math.random() * 2000 + 100).toFixed(0)}B`,
    sector: sectors[Math.floor(Math.random() * sectors.length)],
  }));
};

export const TooltipDemo = () => {
  const [data] = useState<SampleData[]>(generateData(20));
  const [showDelay, setShowDelay] = useState(500);
  const [hideDelay, setHideDelay] = useState(200);
  const [defaultPlacement, setDefaultPlacement] = useState<'auto' | 'top' | 'bottom' | 'left' | 'right'>('auto');

  const columns: Column[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
    },
    { 
      field: 'symbol', 
      headerName: 'Symbol', 
      width: 100,
    },
    { 
      field: 'company', 
      headerName: 'Company', 
      width: 200,
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      renderCell: (row: Row) => `$${(row as SampleData).price.toFixed(2)}`
    },
    { 
      field: 'change', 
      headerName: 'Change', 
      width: 120,
      renderCell: (row: Row) => {
        const data = row as SampleData;
        return (
          <span style={{ color: data.change >= 0 ? 'green' : 'red' }}>
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
          </span>
        );
      }
    },
    { 
      field: 'volume', 
      headerName: 'Volume', 
      width: 150,
      renderCell: (row: Row) => (row as SampleData).volume.toLocaleString()
    },
    { 
      field: 'marketCap', 
      headerName: 'Market Cap', 
      width: 120,
    },
    { 
      field: 'sector', 
      headerName: 'Sector', 
      width: 150,
    },
  ];

  const tooltipConfig: TooltipConfig = {
    enabled: true,
    showCellTooltips: true,
    showRowTooltips: true,
    showDelay,
    hideDelay,
    placement: defaultPlacement,
    maxWidth: 300,
    offset: 8,
    
    // Cell-level tooltips
    getCellTooltip: (row: Row, column: Column) => {
      const data = row as SampleData;
      if (column.field === 'symbol') {
        return `${data.symbol} - ${data.company}`;
      }
      if (column.field === 'price') {
        return `Current price: $${data.price.toFixed(2)}\n52-week range: $${(data.price * 0.8).toFixed(2)} - $${(data.price * 1.2).toFixed(2)}`;
      }
      if (column.field === 'change') {
        return {
          content: (
            <div>
              <strong>{data.change >= 0 ? 'Gain' : 'Loss'}: {Math.abs(data.change).toFixed(2)}%</strong>
              <div style={{ marginTop: '4px', fontSize: '0.9em' }}>
                ${Math.abs(data.price * data.change / 100).toFixed(2)} per share
              </div>
            </div>
          ),
          placement: 'right'
        };
      }
      if (column.field === 'volume') {
        return {
          content: `Trading Volume: ${data.volume.toLocaleString()} shares\nAvg Daily: ${(data.volume * 0.8).toLocaleString()}`,
          placement: 'top'
        };
      }
      return null;
    },
    
    // Row-level tooltips
    getRowTooltip: (row: Row) => {
      const data = row as SampleData;
      return {
        content: (
          <div style={{ padding: '4px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1em' }}>
              {data.symbol} - {data.company}
            </div>
            <table style={{ width: '100%', fontSize: '0.9em' }}>
              <tbody>
                <tr>
                  <td style={{ paddingRight: '16px', color: '#888' }}>Price:</td>
                  <td style={{ fontWeight: 'bold' }}>${data.price.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '16px', color: '#888' }}>Change:</td>
                  <td style={{ color: data.change >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                    {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '16px', color: '#888' }}>Volume:</td>
                  <td>{data.volume.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '16px', color: '#888' }}>Market Cap:</td>
                  <td>{data.marketCap}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '16px', color: '#888' }}>Sector:</td>
                  <td>{data.sector}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ),
        placement: 'right',
      };
    },
  };

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '8px' }}>Tooltip Feature</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        Hover over cells or rows to see tooltips. Both string and custom React content are supported.
      </p>

      {/* Controls */}
      <div style={{ 
        marginBottom: '16px', 
        padding: '16px', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Show Delay (ms)
          </label>
          <input
            type="number"
            value={showDelay}
            onChange={(e) => setShowDelay(Number(e.target.value))}
            style={{ padding: '4px 8px', width: '100px' }}
            min="0"
            max="2000"
            step="100"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Hide Delay (ms)
          </label>
          <input
            type="number"
            value={hideDelay}
            onChange={(e) => setHideDelay(Number(e.target.value))}
            style={{ padding: '4px 8px', width: '100px' }}
            min="0"
            max="2000"
            step="100"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Default Placement
          </label>
          <select
            value={defaultPlacement}
            onChange={(e) => setDefaultPlacement(e.target.value as any)}
            style={{ padding: '4px 8px', width: '120px' }}
          >
            <option value="auto">Auto</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* Feature Guide */}
      <div style={{ 
        marginBottom: '16px', 
        padding: '16px', 
        background: '#e3f2fd', 
        borderRadius: '8px',
        fontSize: '0.9em'
      }}>
        <strong>Tooltip Features:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>Symbol:</strong> Simple string tooltip with company name</li>
          <li><strong>Price:</strong> Multi-line string tooltip with price range</li>
          <li><strong>Change:</strong> Custom React content with styled gain/loss (placement: right)</li>
          <li><strong>Volume:</strong> Custom placement (top) with volume details</li>
          <li><strong>Row Hover:</strong> Hover over row number or empty space to see comprehensive row tooltip</li>
          <li><strong>Smart Placement:</strong> Tooltips automatically adjust to stay within viewport</li>
        </ul>
      </div>

      {/* DataGrid */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ThemedDataGrid
          columns={columns}
          rows={data}
          theme="quartz"
          tooltipConfig={tooltipConfig}
        />
      </div>
    </div>
  );
};
