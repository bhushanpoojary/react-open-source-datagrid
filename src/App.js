import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { DemoGridPage } from './components/DemoGridPage';
import { VirtualScrollDemo } from './components/VirtualScrollDemo';
import { CellRenderersDemo } from './components/CellRenderersDemo';
import { ColumnFiltersDemo } from './components/ColumnFiltersDemo';
import { FacetedSearchDemo } from './components/FacetedSearchDemo';
import { FilteredSearchDemo } from './components/FilteredSearchDemo';
import { LayoutPersistenceDemo } from './components/LayoutPersistenceDemo';
import { InfiniteScrollDemo } from './components/InfiniteScrollDemo';
import { ThemesDemo } from './components/ThemesDemo';
import { DensityModeDemo } from './components/DensityModeDemo';
import { TreeDataDemo } from './components/TreeDataDemo';
import { RowDraggingDemo } from './components/RowDraggingDemo';
import { LiveMarketDemo } from './components/LiveMarketDemo';
import { AccessibilityDemo } from './components/AccessibilityDemo';
import { ContextMenuDemo } from './components/ContextMenuDemo';
import { RowPinningDemo } from './components/RowPinningDemo';
import { TooltipDemo } from './components/TooltipDemo';
import { BenchmarkDemo } from './components/BenchmarkDemo';
import { FeatureGallery } from './components/FeatureGallery';
import { CompleteApiReferencePage } from './components/CompleteApiReferencePage';
import { GridApiDemoPage } from './components/GridApiDemoPage';
import './App.css';
// Route to DemoType mapping
const pathToDemoMap = {
    '/': 'home',
    '/demo/standard': 'standard',
    '/demo/virtual-scrolling': 'virtual',
    '/demo/cell-renderers': 'renderers',
    '/demo/column-filters': 'filters',
    '/demo/faceted-search': 'faceted',
    '/demo/filtered-search': 'filtered-search',
    '/demo/layout-persistence': 'persistence',
    '/demo/infinite-scroll': 'infinite',
    '/demo/themes': 'themes',
    '/demo/density-mode': 'density',
    '/demo/tree-data': 'tree',
    '/demo/row-dragging': 'drag',
    '/demo/row-pinning': 'rowpin',
    '/demo/market-data': 'market',
    '/demo/accessibility': 'accessibility',
    '/demo/context-menu': 'contextmenu',
    '/demo/tooltip': 'tooltip',
    '/demo/benchmark': 'benchmark',
    '/demo/feature-gallery': 'gallery',
    '/api/reference': 'api-reference',
    '/api/demo': 'api-demo',
};
function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedCategories, setExpandedCategories] = useState(new Set(['gettingstarted', 'performance', 'datafeatures', 'customization', 'documentation']));
    const [searchQuery, setSearchQuery] = useState('');
    // Derive currentDemo directly from URL
    const currentDemo = pathToDemoMap[location.pathname] || 'home';
    const menuCategories = [
        {
            label: 'Getting Started',
            icon: '🏠',
            items: [
                {
                    id: 'home',
                    label: 'Home',
                    icon: '🏠',
                    description: 'Overview and installation',
                    path: '/',
                },
                {
                    id: 'standard',
                    label: 'Standard Demo',
                    icon: '📊',
                    description: 'Basic features with pagination',
                    path: '/demo/standard',
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
                    path: '/demo/virtual-scrolling',
                },
                {
                    id: 'infinite',
                    label: 'Infinite Scroll',
                    icon: '♾️',
                    description: 'Server-side 100M rows',
                    path: '/demo/infinite-scroll',
                },
                {
                    id: 'market',
                    label: 'Market Data',
                    icon: '📈',
                    description: 'Live streaming with 1000+ updates/sec',
                    path: '/demo/market-data',
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
                    path: '/demo/tree-data',
                },
                {
                    id: 'drag',
                    label: 'Row Dragging',
                    icon: '↕️',
                    description: 'Drag & drop row reordering',
                    path: '/demo/row-dragging',
                },
                {
                    id: 'rowpin',
                    label: 'Row Pinning',
                    icon: '📌',
                    description: 'Pin rows to top/bottom (sticky)',
                    path: '/demo/row-pinning',
                },
                {
                    id: 'filters',
                    label: 'Column Filters',
                    icon: '🔍',
                    description: 'Advanced filtering options',
                    path: '/demo/column-filters',
                },
                {
                    id: 'faceted',
                    label: 'Faceted Search',
                    icon: '🎯',
                    description: 'Filter panel with value counts',
                    path: '/demo/faceted-search',
                },
                {
                    id: 'filtered-search',
                    label: 'Filtered Search Bar',
                    icon: '🔍',
                    description: 'GitLab-style token-based search',
                    path: '/demo/filtered-search',
                },
                {
                    id: 'contextmenu',
                    label: 'Context Menu',
                    icon: '📋',
                    description: 'Right-click menu with copy, export, & more',
                    path: '/demo/context-menu',
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
                    path: '/demo/cell-renderers',
                },
                {
                    id: 'themes',
                    label: 'Theme System',
                    icon: '🎨',
                    description: '10 built-in themes: Quartz, Alpine, Material, Dark, Nord, Dracula, Solarized, Monokai, One Dark',
                    path: '/demo/themes',
                },
                {
                    id: 'density',
                    label: 'Density Modes',
                    icon: '📏',
                    description: 'Compact/Normal/Comfortable spacing',
                    path: '/demo/density-mode',
                },
                {
                    id: 'persistence',
                    label: 'Layout Persistence',
                    icon: '💾',
                    description: 'Save & restore layouts',
                    path: '/demo/layout-persistence',
                },
                {
                    id: 'tooltip',
                    label: 'Tooltips',
                    icon: '💬',
                    description: 'Cell & row tooltips with smart placement',
                    path: '/demo/tooltip',
                },
            ],
        },
        {
            label: 'Accessibility',
            icon: '♿',
            items: [
                {
                    id: 'accessibility',
                    label: 'Accessibility (A11y)',
                    icon: '♿',
                    description: 'Keyboard navigation & ARIA support',
                    path: '/demo/accessibility',
                },
            ],
        },
        {
            label: 'Documentation',
            icon: '📚',
            items: [
                {
                    id: 'api-reference',
                    label: 'Grid API Reference',
                    icon: '📖',
                    description: '100+ methods for programmatic control',
                    path: '/api/reference',
                },
                {
                    id: 'api-demo',
                    label: 'Interactive API Demo',
                    icon: '🎮',
                    description: 'Try all API methods with live examples',
                    path: '/api/demo',
                },
            ],
        },
        {
            label: 'Playground',
            icon: '🧪',
            items: [
                {
                    id: 'gallery',
                    label: 'Feature Gallery',
                    icon: '🎯',
                    description: 'Browse all features with live demos',
                    path: '/demo/feature-gallery',
                },
                {
                    id: 'benchmark',
                    label: 'Benchmark (1M rows)',
                    icon: '🚀',
                    description: 'Test performance with massive datasets',
                    path: '/demo/benchmark',
                },
            ],
        },
    ];
    const toggleCategory = (categoryLabel) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryLabel)) {
            newExpanded.delete(categoryLabel);
        }
        else {
            newExpanded.add(categoryLabel);
        }
        setExpandedCategories(newExpanded);
    };
    // Filter menu items based on search query
    const filteredCategories = menuCategories.map(category => ({
        ...category,
        items: category.items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    })).filter(category => category.items.length > 0);
    // Auto-expand categories when searching
    const displayCategories = searchQuery ? filteredCategories : menuCategories;
    const shouldExpand = (categoryLabel) => {
        if (searchQuery)
            return true; // Expand all when searching
        return expandedCategories.has(categoryLabel.toLowerCase().replace(/\s+/g, ''));
    };
    return (_jsxs("div", { style: { display: 'flex', height: '100vh', backgroundColor: '#ffffff' }, children: [_jsxs("aside", { style: {
                    width: '280px',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
                }, children: [_jsxs("div", { style: {
                            padding: '20px 20px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: '#0f172a'
                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }, children: [_jsx("img", { src: "/logo.png", alt: "Logo", style: { width: '32px', height: '32px', objectFit: 'contain' } }), _jsx("span", { style: { fontSize: '24px', fontWeight: 'bold' }, children: "React DataGrid" })] }), _jsx("div", { style: { fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }, children: "Enterprise-grade data grid" })] }), _jsxs("div", { style: { padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }, children: [_jsxs("div", { style: { position: 'relative' }, children: [_jsx("input", { type: "text", placeholder: "Search features...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), style: {
                                            width: '100%',
                                            padding: '8px 12px 8px 36px',
                                            fontSize: '13px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            color: 'white',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '6px',
                                            outline: 'none',
                                            transition: 'all 0.15s',
                                        }, onFocus: (e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                            e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)';
                                        }, onBlur: (e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                        } }), _jsx("svg", { style: {
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '16px',
                                            height: '16px',
                                            fill: 'rgba(255, 255, 255, 0.5)',
                                            pointerEvents: 'none'
                                        }, viewBox: "0 0 24 24", children: _jsx("path", { d: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" }) }), searchQuery && (_jsx("button", { onClick: () => setSearchQuery(''), style: {
                                            position: 'absolute',
                                            right: '8px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: '3px',
                                        }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.color = 'white';
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                        }, children: _jsx("svg", { style: { width: '16px', height: '16px' }, fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) }) }))] }), searchQuery && filteredCategories.length === 0 && (_jsx("div", { style: {
                                    marginTop: '8px',
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    textAlign: 'center'
                                }, children: "No features found" }))] }), _jsx("nav", { style: {
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px 0',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
                        }, children: displayCategories.map((category) => {
                            const isExpanded = shouldExpand(category.label);
                            return (_jsxs("div", { style: { marginBottom: '8px' }, children: [_jsxs("button", { onClick: () => toggleCategory(category.label.toLowerCase().replace(/\s+/g, '')), style: {
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
                                        }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }, children: [_jsx("span", { style: {
                                                    fontSize: '16px',
                                                    transition: 'transform 0.2s',
                                                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                                                }, children: "\u25B6" }), _jsx("span", { style: { fontSize: '16px' }, children: category.icon }), _jsx("span", { style: { flex: 1 }, children: category.label })] }), isExpanded && (_jsx("div", { style: { paddingLeft: '24px' }, children: category.items.map((item) => (_jsxs("button", { onClick: () => navigate(item.path), style: {
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
                                            }, onMouseEnter: (e) => {
                                                if (currentDemo !== item.id) {
                                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                                }
                                            }, onMouseLeave: (e) => {
                                                if (currentDemo !== item.id) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }, children: [_jsx("span", { style: { fontSize: '16px', marginTop: '1px' }, children: item.icon }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: currentDemo === item.id ? 600 : 500 }, children: item.label }), _jsx("div", { style: {
                                                                fontSize: '11px',
                                                                color: currentDemo === item.id ? 'rgba(96, 165, 250, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                                                                marginTop: '2px',
                                                                lineHeight: '1.3'
                                                            }, children: item.description })] })] }, item.id))) }))] }, category.label));
                        }) }), _jsx("div", { style: {
                            padding: '16px 20px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: '#0f172a'
                        }, children: _jsxs("a", { href: "https://github.com/bhushanpoojary/react-open-source-datagrid", target: "_blank", rel: "noopener noreferrer", style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'rgba(255, 255, 255, 0.8)',
                                textDecoration: 'none',
                                fontSize: '13px',
                                transition: 'color 0.15s'
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.color = 'white';
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                            }, children: [_jsx("svg", { style: { width: '18px', height: '18px' }, fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { fillRule: "evenodd", d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z", clipRule: "evenodd" }) }), _jsx("span", { children: "View on GitHub" })] }) })] }), _jsx("main", { style: { flex: 1, overflow: 'auto', backgroundColor: '#f8fafc' }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/demo/standard", element: _jsx(DemoGridPage, {}) }), _jsx(Route, { path: "/demo/virtual-scrolling", element: _jsx(VirtualScrollDemo, {}) }), _jsx(Route, { path: "/demo/infinite-scroll", element: _jsx(InfiniteScrollDemo, {}) }), _jsx(Route, { path: "/demo/market-data", element: _jsx(LiveMarketDemo, {}) }), _jsx(Route, { path: "/demo/accessibility", element: _jsx(AccessibilityDemo, {}) }), _jsx(Route, { path: "/demo/tree-data", element: _jsx(TreeDataDemo, {}) }), _jsx(Route, { path: "/demo/row-dragging", element: _jsx(RowDraggingDemo, {}) }), _jsx(Route, { path: "/demo/row-pinning", element: _jsx(RowPinningDemo, {}) }), _jsx(Route, { path: "/demo/cell-renderers", element: _jsx(CellRenderersDemo, {}) }), _jsx(Route, { path: "/demo/column-filters", element: _jsx(ColumnFiltersDemo, {}) }), _jsx(Route, { path: "/demo/faceted-search", element: _jsx(FacetedSearchDemo, {}) }), _jsx(Route, { path: "/demo/filtered-search", element: _jsx(FilteredSearchDemo, {}) }), _jsx(Route, { path: "/demo/context-menu", element: _jsx(ContextMenuDemo, {}) }), _jsx(Route, { path: "/demo/tooltip", element: _jsx(TooltipDemo, {}) }), _jsx(Route, { path: "/demo/layout-persistence", element: _jsx(LayoutPersistenceDemo, {}) }), _jsx(Route, { path: "/demo/themes", element: _jsx(ThemesDemo, {}) }), _jsx(Route, { path: "/demo/density-mode", element: _jsx(DensityModeDemo, {}) }), _jsx(Route, { path: "/demo/feature-gallery", element: _jsx(FeatureGallery, {}) }), _jsx(Route, { path: "/demo/benchmark", element: _jsx(BenchmarkDemo, {}) }), _jsx(Route, { path: "/api/reference", element: _jsx(CompleteApiReferencePage, {}) }), _jsx(Route, { path: "/api/demo", element: _jsx(GridApiDemoPage, {}) })] }) })] }));
}
export default App;
