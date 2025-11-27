import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable */
/**
 * FacetedSearchDemo Component
 *
 * Demonstrates the FacetedSearch feature with e-commerce and analytics use cases.
 */
import React, { useState, useMemo } from 'react';
import { DataGrid } from './DataGrid';
import { FacetedSearch } from './DataGrid/FacetedSearch';
import CodeBlock from './CodeBlock';
// E-commerce sample data
const generateEcommerceData = () => {
    const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Microsoft', 'Google', 'Amazon', 'Dell'];
    const categories = ['Electronics', 'Computers', 'Smart Home', 'Audio', 'Gaming', 'Wearables'];
    const conditions = ['New', 'Refurbished', 'Open Box'];
    const ratings = [5, 4.5, 4, 3.5, 3];
    const colors = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Gray'];
    const inStock = [true, false];
    const products = [
        'Smartphone', 'Laptop', 'Tablet', 'Smart Watch', 'Headphones',
        'Speaker', 'Monitor', 'Keyboard', 'Mouse', 'Camera',
        'TV', 'Console', 'Router', 'Drone', 'Printer'
    ];
    return Array.from({ length: 150 }, (_, i) => ({
        id: i + 1,
        name: `${brands[i % brands.length]} ${products[i % products.length]} ${Math.floor(Math.random() * 100)}`,
        brand: brands[i % brands.length],
        category: categories[i % categories.length],
        price: Math.floor(Math.random() * 2000) + 50,
        rating: ratings[Math.floor(Math.random() * ratings.length)],
        condition: conditions[i % conditions.length],
        color: colors[i % colors.length],
        inStock: inStock[i % inStock.length],
        sales: Math.floor(Math.random() * 1000),
        discount: Math.floor(Math.random() * 50),
    }));
};
// Analytics sample data
const generateAnalyticsData = () => {
    const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
    const channels = ['Organic', 'Paid Search', 'Social', 'Direct', 'Email', 'Referral'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
    const status = ['Active', 'Completed', 'Pending', 'Cancelled'];
    return Array.from({ length: 100 }, (_, i) => {
        const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        return {
            id: i + 1,
            campaignName: `Campaign ${String.fromCharCode(65 + (i % 26))}`,
            region: regions[i % regions.length],
            channel: channels[i % channels.length],
            device: devices[i % devices.length],
            browser: browsers[i % browsers.length],
            status: status[i % status.length],
            impressions: Math.floor(Math.random() * 100000),
            clicks: Math.floor(Math.random() * 5000),
            conversions: Math.floor(Math.random() * 500),
            revenue: Math.floor(Math.random() * 50000),
            date: date.toISOString().split('T')[0],
        };
    });
};
export const FacetedSearchDemo = () => {
    const [activeDemo, setActiveDemo] = useState('ecommerce');
    // E-commerce state
    const [ecommerceData] = useState(generateEcommerceData());
    const [ecommerceFilters, setEcommerceFilters] = useState({});
    // Analytics state
    const [analyticsData] = useState(generateAnalyticsData());
    const [analyticsFilters, setAnalyticsFilters] = useState({});
    // E-commerce configuration
    const ecommerceColumns = [
        { field: 'name', headerName: 'Product', width: 250, sortable: true },
        { field: 'brand', headerName: 'Brand', width: 120, sortable: true },
        { field: 'category', headerName: 'Category', width: 140, sortable: true },
        {
            field: 'price',
            headerName: 'Price',
            width: 120,
            sortable: true,
            renderCell: (row) => `$${row.price.toLocaleString()}`
        },
        { field: 'rating', headerName: 'Rating', width: 100, sortable: true },
        { field: 'condition', headerName: 'Condition', width: 120, sortable: true },
        { field: 'color', headerName: 'Color', width: 100, sortable: true },
        {
            field: 'inStock',
            headerName: 'In Stock',
            width: 100,
            renderCell: (row) => row.inStock ? '✓ Yes' : '✗ No'
        },
        { field: 'sales', headerName: 'Sales', width: 100, sortable: true },
        {
            field: 'discount',
            headerName: 'Discount',
            width: 100,
            renderCell: (row) => row.discount > 0 ? `${row.discount}%` : '-'
        },
    ];
    const ecommerceFacets = [
        { field: 'brand', label: 'Brand', sortBy: 'alpha', maxItems: 8 },
        { field: 'category', label: 'Category', sortBy: 'count', maxItems: 6 },
        { field: 'condition', label: 'Condition', sortBy: 'count' },
        { field: 'color', label: 'Color', sortBy: 'alpha', maxItems: 6 },
        { field: 'inStock', label: 'Availability', sortBy: 'count' },
        { field: 'rating', label: 'Rating', sortBy: 'value' },
    ];
    // Analytics configuration
    const analyticsColumns = [
        { field: 'campaignName', headerName: 'Campaign', width: 180, sortable: true },
        { field: 'region', headerName: 'Region', width: 150, sortable: true },
        { field: 'channel', headerName: 'Channel', width: 130, sortable: true },
        { field: 'device', headerName: 'Device', width: 110, sortable: true },
        { field: 'browser', headerName: 'Browser', width: 110, sortable: true },
        { field: 'status', headerName: 'Status', width: 110, sortable: true },
        {
            field: 'impressions',
            headerName: 'Impressions',
            width: 130,
            sortable: true,
            renderCell: (row) => row.impressions.toLocaleString()
        },
        { field: 'clicks', headerName: 'Clicks', width: 100, sortable: true },
        { field: 'conversions', headerName: 'Conversions', width: 120, sortable: true },
        {
            field: 'revenue',
            headerName: 'Revenue',
            width: 120,
            sortable: true,
            renderCell: (row) => `$${row.revenue.toLocaleString()}`
        },
        { field: 'date', headerName: 'Date', width: 120, sortable: true },
    ];
    const analyticsFacets = [
        { field: 'region', label: 'Region', sortBy: 'alpha', maxItems: 6 },
        { field: 'channel', label: 'Channel', sortBy: 'count', maxItems: 6 },
        { field: 'device', label: 'Device', sortBy: 'count' },
        { field: 'browser', label: 'Browser', sortBy: 'count' },
        { field: 'status', label: 'Status', sortBy: 'count' },
    ];
    // Handle filter changes for e-commerce
    const handleEcommerceFilterChange = (field, values) => {
        setEcommerceFilters(prev => ({
            ...prev,
            [field]: values ? { type: 'set', values } : null,
        }));
    };
    // Handle filter changes for analytics
    const handleAnalyticsFilterChange = (field, values) => {
        setAnalyticsFilters(prev => ({
            ...prev,
            [field]: values ? { type: 'set', values } : null,
        }));
    };
    // Apply filters to data
    const filteredEcommerceData = useMemo(() => {
        return ecommerceData.filter(row => {
            return Object.entries(ecommerceFilters).every(([field, filter]) => {
                if (!filter || !('values' in filter) || !filter.values || filter.values.length === 0) {
                    return true;
                }
                return filter.values.includes(row[field]);
            });
        });
    }, [ecommerceData, ecommerceFilters]);
    const filteredAnalyticsData = useMemo(() => {
        return analyticsData.filter(row => {
            return Object.entries(analyticsFilters).every(([field, filter]) => {
                if (!filter || !('values' in filter) || !filter.values || filter.values.length === 0) {
                    return true;
                }
                return filter.values.includes(row[field]);
            });
        });
    }, [analyticsData, analyticsFilters]);
    const activeData = activeDemo === 'ecommerce' ? ecommerceData : analyticsData;
    const filteredData = activeDemo === 'ecommerce' ? filteredEcommerceData : filteredAnalyticsData;
    return (_jsxs("div", { style: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }, children: [_jsxs("div", { children: [_jsx("h1", { style: { fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', margin: '0 0 12px 0' }, children: "Faceted Search" }), _jsx("p", { style: { fontSize: '18px', color: '#4b5563', maxWidth: '48rem', margin: 0 }, children: "Filter panel that shows value counts for categorical data. Perfect for e-commerce and analytics dashboards." })] }), _jsxs("div", { style: { display: 'flex', gap: '16px' }, children: [_jsxs("button", { onClick: () => setActiveDemo('ecommerce'), style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: activeDemo === 'ecommerce' ? '#2563eb' : '#f3f4f6',
                            color: activeDemo === 'ecommerce' ? '#ffffff' : '#374151'
                        }, onMouseOver: (e) => {
                            if (activeDemo !== 'ecommerce') {
                                e.currentTarget.style.backgroundColor = '#e5e7eb';
                            }
                        }, onMouseOut: (e) => {
                            if (activeDemo !== 'ecommerce') {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                            }
                        }, children: [_jsx("span", { style: { fontSize: '20px' }, children: "\uD83D\uDED2" }), "E-commerce Demo"] }), _jsxs("button", { onClick: () => setActiveDemo('analytics'), style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: activeDemo === 'analytics' ? '#2563eb' : '#f3f4f6',
                            color: activeDemo === 'analytics' ? '#ffffff' : '#374151'
                        }, onMouseOver: (e) => {
                            if (activeDemo !== 'analytics') {
                                e.currentTarget.style.backgroundColor = '#e5e7eb';
                            }
                        }, onMouseOut: (e) => {
                            if (activeDemo !== 'analytics') {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                            }
                        }, children: [_jsx("span", { style: { fontSize: '20px' }, children: "\uD83D\uDCC8" }), "Analytics Demo"] })] }), _jsx("div", { style: {
                    background: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #bfdbfe'
                }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '24px' }, children: [_jsx("span", { style: { fontSize: '36px' }, children: "\uD83D\uDCE6" }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '14px', color: '#4b5563', marginBottom: '4px' }, children: "Showing Results" }), _jsxs("div", { style: { fontSize: '30px', fontWeight: 'bold', color: '#111827' }, children: [filteredData.length, _jsxs("span", { style: { fontSize: '18px', color: '#4b5563', fontWeight: 'normal', marginLeft: '8px' }, children: ["of ", activeData.length] })] })] }), filteredData.length < activeData.length && (_jsxs("div", { style: { marginLeft: 'auto', fontSize: '14px', color: '#4b5563' }, children: [Math.round((filteredData.length / activeData.length) * 100), "% of total"] }))] }) }), _jsxs("div", { style: {
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }, children: [_jsxs("div", { style: {
                            borderBottom: '1px solid #e5e7eb',
                            backgroundColor: '#f9fafb',
                            padding: '16px 24px'
                        }, children: [_jsx("h2", { style: {
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    margin: '0 0 4px 0'
                                }, children: activeDemo === 'ecommerce' ? 'E-commerce Products' : 'Marketing Analytics' }), _jsx("p", { style: {
                                    fontSize: '14px',
                                    color: '#4b5563',
                                    margin: 0
                                }, children: activeDemo === 'ecommerce'
                                    ? 'Filter products by brand, category, condition, and more'
                                    : 'Filter campaigns by region, channel, device, and status' })] }), _jsx("div", { style: { display: 'flex', overflow: 'hidden', height: '700px' }, children: activeDemo === 'ecommerce' ? (_jsxs(_Fragment, { children: [_jsx("div", { style: { width: '320px', flexShrink: 0 }, children: _jsx(FacetedSearch, { columns: ecommerceColumns, rows: ecommerceData, facetConfigs: ecommerceFacets, filterConfig: ecommerceFilters, onFilterChange: handleEcommerceFilterChange, onClearAll: () => setEcommerceFilters({}), showSearch: true, collapsible: true }) }), _jsx("div", { style: { flex: 1, overflow: 'hidden' }, children: _jsx(DataGrid, { columns: ecommerceColumns, rows: filteredEcommerceData, pageSize: 20 }) })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { style: { width: '320px', flexShrink: 0 }, children: _jsx(FacetedSearch, { columns: analyticsColumns, rows: analyticsData, facetConfigs: analyticsFacets, filterConfig: analyticsFilters, onFilterChange: handleAnalyticsFilterChange, onClearAll: () => setAnalyticsFilters({}), showSearch: true, collapsible: true }) }), _jsx("div", { style: { flex: 1, overflow: 'hidden' }, children: _jsx(DataGrid, { columns: analyticsColumns, rows: filteredAnalyticsData, pageSize: 20 }) })] })) })] }), _jsxs("div", { style: {
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '32px'
                }, children: [_jsx("h2", { style: {
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#111827',
                            marginBottom: '24px',
                            margin: '0 0 24px 0'
                        }, children: "\u2728 Key Features" }), _jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '24px'
                        }, children: [_jsxs("div", { children: [_jsx("h3", { style: { fontWeight: 600, color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }, children: "\uD83D\uDCCA Value Counts" }), _jsx("p", { style: { color: '#4b5563', fontSize: '14px', margin: 0 }, children: "Shows count for each filter option, helping users understand data distribution at a glance." })] }), _jsxs("div", { children: [_jsx("h3", { style: { fontWeight: 600, color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }, children: "\uD83D\uDD0D Search Within Facets" }), _jsx("p", { style: { color: '#4b5563', fontSize: '14px', margin: 0 }, children: "Search functionality for facets with many values, making it easy to find specific options." })] }), _jsxs("div", { children: [_jsx("h3", { style: { fontWeight: 600, color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }, children: "\uD83D\uDCC8 Dynamic Updates" }), _jsx("p", { style: { color: '#4b5563', fontSize: '14px', margin: 0 }, children: "Counts update in real-time as filters are applied, showing only relevant combinations." })] }), _jsxs("div", { children: [_jsx("h3", { style: { fontWeight: 600, color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }, children: "\u26A1 Multi-Select" }), _jsx("p", { style: { color: '#4b5563', fontSize: '14px', margin: 0 }, children: "Select multiple values per facet with checkboxes for powerful filtering combinations." })] }), _jsxs("div", { children: [_jsx("h3", { style: { fontWeight: 600, color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }, children: "\uD83C\uDFAF Sort Options" }), _jsx("p", { style: { color: '#4b5563', fontSize: '14px', margin: 0 }, children: "Sort by count, value, or alphabetically to organize facets in the most useful way." })] }), _jsxs("div", { children: [_jsx("h3", { style: { fontWeight: 600, color: '#111827', marginBottom: '8px', margin: '0 0 8px 0' }, children: "\uD83D\uDCE6 Collapsible Sections" }), _jsx("p", { style: { color: '#4b5563', fontSize: '14px', margin: 0 }, children: "Expand/collapse facet groups to focus on relevant filters and save screen space." })] })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '24px' }, children: [_jsx("h2", { style: {
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#111827',
                            margin: 0
                        }, children: "\uD83D\uDCDD Code Examples" }), _jsx(CodeBlock, { title: "Basic Setup", language: "typescript", code: `import { FacetedSearch } from './components/DataGrid/FacetedSearch';
import { DataGrid} from './components/DataGrid';

const columns = [
  { field: 'name', headerName: 'Product', width: 200 },
  { field: 'brand', headerName: 'Brand', width: 120 },
  { field: 'category', headerName: 'Category', width: 140 },
  { field: 'price', headerName: 'Price', width: 100 },
];

const facetConfigs = [
  { field: 'brand', label: 'Brand', sortBy: 'alpha' },
  { field: 'category', label: 'Category', sortBy: 'count' },
];

function ProductCatalog() {
  const [filterConfig, setFilterConfig] = useState({});
  
  const handleFilterChange = (field: string, values: any[] | null) => {
    setFilterConfig(prev => ({
      ...prev,
      [field]: values ? { type: 'set', values } : null,
    }));
  };

  return (
    <div style={{ display: 'flex' }}>
      <FacetedSearch
        columns={columns}
        rows={data}
        facetConfigs={facetConfigs}
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onClearAll={() => setFilterConfig({})}
      />
      <DataGrid
        columns={columns}
        rows={filteredData}
        pageSize={20}
      />
    </div>
  );
}` }), _jsx(CodeBlock, { title: "Advanced Facet Configuration", language: "typescript", code: `const facetConfigs: FacetConfig[] = [
  {
    field: 'brand',
    label: 'Brand',
    sortBy: 'alpha',      // Sort alphabetically
    maxItems: 8,          // Show 8 items, then "Show More"
    expanded: true,       // Start expanded
  },
  {
    field: 'category',
    label: 'Category',
    sortBy: 'count',      // Sort by count (most common first)
    maxItems: 6,
    expanded: true,
  },
  {
    field: 'price_range',
    label: 'Price Range',
    sortBy: 'value',      // Sort by numeric value
    maxItems: 5,
    expanded: false,      // Start collapsed
  },
];` }), _jsx(CodeBlock, { title: "Complete Integration with Filtering", language: "typescript", code: `import { useMemo } from 'react';

function ProductListing() {
  const [data] = useState(products);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({});

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filterConfig).every(([field, filter]) => {
        if (!filter || !filter.values || filter.values.length === 0) {
          return true;
        }
        return filter.values.includes(row[field]);
      });
    });
  }, [data, filterConfig]);

  const handleFilterChange = (field: string, values: any[] | null) => {
    setFilterConfig(prev => ({
      ...prev,
      [field]: values ? { type: 'set', values } : null,
    }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Faceted Search Sidebar */}
      <FacetedSearch
        columns={columns}
        rows={data}
        facetConfigs={facetConfigs}
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onClearAll={() => setFilterConfig({})}
        style={{ width: '320px' }}
        showSearch={true}
        collapsible={true}
      />
      
      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '16px' }}>
          <h2>Showing {filteredData.length} of {data.length} products</h2>
        </div>
        <DataGrid
          columns={columns}
          rows={filteredData}
          pageSize={20}
        />
      </div>
    </div>
  );
}` })] }), _jsxs("div", { style: {
                    background: 'linear-gradient(to bottom right, #faf5ff, #fce7f3)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid #e9d5ff'
                }, children: [_jsx("h2", { style: {
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#111827',
                            marginBottom: '24px',
                            margin: '0 0 24px 0'
                        }, children: "\uD83C\uDFAF Perfect For" }), _jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '24px'
                        }, children: [_jsxs("div", { style: {
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    padding: '24px',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }, children: [_jsx("div", { style: { fontSize: '30px', marginBottom: '12px' }, children: "\uD83D\uDED2" }), _jsx("h3", { style: {
                                            fontWeight: 600,
                                            color: '#111827',
                                            marginBottom: '8px',
                                            margin: '0 0 8px 0'
                                        }, children: "E-commerce" }), _jsxs("ul", { style: {
                                            fontSize: '14px',
                                            color: '#4b5563',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px',
                                            margin: 0,
                                            paddingLeft: '20px'
                                        }, children: [_jsx("li", { children: "\u2022 Product catalogs" }), _jsx("li", { children: "\u2022 Filter by brand, price, etc." }), _jsx("li", { children: "\u2022 Show available inventory" }), _jsx("li", { children: "\u2022 Dynamic count updates" })] })] }), _jsxs("div", { style: {
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    padding: '24px',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }, children: [_jsx("div", { style: { fontSize: '30px', marginBottom: '12px' }, children: "\uD83D\uDCCA" }), _jsx("h3", { style: {
                                            fontWeight: 600,
                                            color: '#111827',
                                            marginBottom: '8px',
                                            margin: '0 0 8px 0'
                                        }, children: "Analytics Dashboards" }), _jsxs("ul", { style: {
                                            fontSize: '14px',
                                            color: '#4b5563',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px',
                                            margin: 0,
                                            paddingLeft: '20px'
                                        }, children: [_jsx("li", { children: "\u2022 Campaign analysis" }), _jsx("li", { children: "\u2022 Regional breakdowns" }), _jsx("li", { children: "\u2022 Channel performance" }), _jsx("li", { children: "\u2022 Device segmentation" })] })] }), _jsxs("div", { style: {
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    padding: '24px',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }, children: [_jsx("div", { style: { fontSize: '30px', marginBottom: '12px' }, children: "\uD83D\uDCC1" }), _jsx("h3", { style: {
                                            fontWeight: 600,
                                            color: '#111827',
                                            marginBottom: '8px',
                                            margin: '0 0 8px 0'
                                        }, children: "Data Exploration" }), _jsxs("ul", { style: {
                                            fontSize: '14px',
                                            color: '#4b5563',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px',
                                            margin: 0,
                                            paddingLeft: '20px'
                                        }, children: [_jsx("li", { children: "\u2022 Large datasets" }), _jsx("li", { children: "\u2022 Multi-dimensional data" }), _jsx("li", { children: "\u2022 Quick filtering" }), _jsx("li", { children: "\u2022 Visual discovery" })] })] })] })] }), _jsxs("div", { style: {
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '12px',
                    padding: '24px'
                }, children: [_jsx("h3", { style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#78350f',
                            marginBottom: '16px',
                            margin: '0 0 16px 0'
                        }, children: "\uD83D\uDCA1 Pro Tips" }), _jsxs("ul", { style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#78350f',
                            margin: 0,
                            paddingLeft: 0,
                            listStyle: 'none'
                        }, children: [_jsxs("li", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#d97706', marginTop: '2px' }, children: "\u25B8" }), _jsxs("span", { children: [_jsx("strong", { children: "Works best with categorical data:" }), " Use for fields like brand, category, status, region, etc."] })] }), _jsxs("li", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#d97706', marginTop: '2px' }, children: "\u25B8" }), _jsxs("span", { children: [_jsx("strong", { children: "Requires solid filtering:" }), " Build on top of advanced filtering foundation for best results."] })] }), _jsxs("li", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#d97706', marginTop: '2px' }, children: "\u25B8" }), _jsxs("span", { children: [_jsx("strong", { children: "Set reasonable maxItems:" }), " Show 5-10 items by default, with \"Show More\" for longer lists."] })] }), _jsxs("li", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#d97706', marginTop: '2px' }, children: "\u25B8" }), _jsxs("span", { children: [_jsx("strong", { children: "Sort strategically:" }), " Use 'count' for discovery, 'alpha' for known values, 'value' for ranges."] })] }), _jsxs("li", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("span", { style: { color: '#d97706', marginTop: '2px' }, children: "\u25B8" }), _jsxs("span", { children: [_jsx("strong", { children: "Enable search for long lists:" }), " Search becomes essential when facets have 10+ unique values."] })] })] })] })] }));
};
export default FacetedSearchDemo;
