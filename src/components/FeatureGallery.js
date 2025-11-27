import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const FeatureGallery = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const features = [
        {
            id: 'virtual-scroll',
            title: 'Virtual Scrolling',
            description: 'Render millions of rows with smooth 60 FPS scrolling. Only visible rows are in the DOM.',
            icon: '⚡',
            category: 'Performance',
            demoLink: 'virtual',
            tags: ['performance', 'core', 'essential'],
        },
        {
            id: 'infinite-scroll',
            title: 'Infinite Scrolling',
            description: 'Load data on-demand as users scroll. Perfect for paginated APIs and large remote datasets.',
            icon: '🔄',
            category: 'Performance',
            demoLink: 'infinite',
            tags: ['performance', 'async', 'pagination'],
        },
        {
            id: 'column-filters',
            title: 'Column Filters',
            description: 'Advanced filtering with 10+ operators: equals, contains, starts with, date ranges, and more.',
            icon: '🔍',
            category: 'Data Features',
            demoLink: 'filters',
            tags: ['filtering', 'search', 'essential'],
        },
        {
            id: 'faceted-search',
            title: 'Faceted Search',
            description: 'Filter panel with value counts. Perfect for e-commerce catalogs and analytics dashboards.',
            icon: '📊',
            category: 'Data Features',
            demoLink: 'faceted',
            tags: ['filtering', 'analytics', 'e-commerce'],
        },
        {
            id: 'tree-data',
            title: 'Tree Data',
            description: 'Hierarchical data with expand/collapse. Ideal for org charts, file trees, and nested categories.',
            icon: '🌳',
            category: 'Data Features',
            demoLink: 'tree',
            tags: ['hierarchy', 'structure', 'nested'],
        },
        {
            id: 'market-data',
            title: 'Market Data Mode',
            description: 'Real-time updates with cell flashing. Built for financial trading apps and live dashboards.',
            icon: '📈',
            category: 'Performance',
            demoLink: 'market',
            tags: ['realtime', 'financial', 'updates'],
        },
        {
            id: 'cell-renderers',
            title: 'Custom Cell Renderers',
            description: 'Rich cell rendering: avatars, badges, progress bars, buttons, images, and more.',
            icon: '🎨',
            category: 'Customization',
            demoLink: 'renderers',
            tags: ['customization', 'ui', 'components'],
        },
        {
            id: 'row-dragging',
            title: 'Row Dragging',
            description: 'Drag & drop rows to reorder. Perfect for task lists, prioritization, and kanban boards.',
            icon: '↕️',
            category: 'Interaction',
            demoLink: 'drag',
            tags: ['interaction', 'reorder', 'dnd'],
        },
        {
            id: 'row-pinning',
            title: 'Row Pinning',
            description: 'Pin important rows to top or bottom. Keep key data always visible while scrolling.',
            icon: '📌',
            category: 'Interaction',
            demoLink: 'rowpin',
            tags: ['pinning', 'sticky', 'fixed'],
        },
        {
            id: 'context-menu',
            title: 'Context Menu',
            description: 'Right-click menus on rows, cells, and headers. Fully customizable actions and shortcuts.',
            icon: '📋',
            category: 'Interaction',
            demoLink: 'contextmenu',
            tags: ['menu', 'actions', 'shortcuts'],
        },
        {
            id: 'layout-persistence',
            title: 'Layout Persistence',
            description: 'Save column order, widths, and sort state. Perfect for personalized user experiences.',
            icon: '💾',
            category: 'UX Features',
            demoLink: 'persistence',
            tags: ['persistence', 'state', 'localStorage'],
        },
        {
            id: 'themes',
            title: 'Theming',
            description: 'Multiple built-in themes: Light, Dark, Blue, Green. Fully customizable styling system.',
            icon: '🎨',
            category: 'Customization',
            demoLink: 'themes',
            tags: ['themes', 'styling', 'appearance'],
        },
        {
            id: 'accessibility',
            title: 'Accessibility',
            description: 'WCAG 2.1 AA compliant. Full keyboard navigation, ARIA labels, and screen reader support.',
            icon: '♿',
            category: 'UX Features',
            demoLink: 'accessibility',
            tags: ['a11y', 'wcag', 'keyboard'],
        },
        {
            id: 'tooltips',
            title: 'Tooltips',
            description: 'Rich tooltips on hover. Show additional context without cluttering the grid.',
            icon: '💬',
            category: 'UX Features',
            demoLink: 'tooltip',
            tags: ['tooltip', 'hover', 'info'],
        },
    ];
    const categories = ['all', 'Performance', 'Data Features', 'Interaction', 'Customization', 'UX Features'];
    const filteredFeatures = features.filter(feature => {
        const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
        const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feature.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });
    return (_jsx("div", { style: { height: '100%', overflow: 'auto', padding: '32px' }, children: _jsxs("div", { style: { maxWidth: '1400px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '32px' }, children: [_jsx("h1", { style: {
                                fontSize: '36px',
                                fontWeight: 'bold',
                                marginBottom: '12px',
                                color: '#111827',
                                margin: '0 0 12px 0'
                            }, children: "\uD83C\uDFAF Feature Gallery" }), _jsx("p", { style: {
                                fontSize: '18px',
                                color: '#6b7280',
                                margin: '0 0 24px 0'
                            }, children: "Explore all DataGrid features with interactive demos. Click any card to try it live." })] }), _jsxs("div", { style: { marginBottom: '32px' }, children: [_jsx("div", { style: { marginBottom: '16px' }, children: _jsx("input", { type: "text", placeholder: "\uD83D\uDD0D Search features, tags, descriptions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: {
                                    width: '100%',
                                    padding: '12px 16px',
                                    fontSize: '16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    outline: 'none',
                                }, onFocus: (e) => e.currentTarget.style.borderColor = '#3b82f6', onBlur: (e) => e.currentTarget.style.borderColor = '#e5e7eb' }) }), _jsx("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' }, children: categories.map(category => (_jsx("button", { onClick: () => setSelectedCategory(category), style: {
                                    padding: '8px 20px',
                                    backgroundColor: selectedCategory === category ? '#3b82f6' : '#ffffff',
                                    color: selectedCategory === category ? '#ffffff' : '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    transition: 'all 0.2s',
                                }, onMouseOver: (e) => {
                                    if (selectedCategory !== category) {
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    }
                                }, onMouseOut: (e) => {
                                    if (selectedCategory !== category) {
                                        e.currentTarget.style.backgroundColor = '#ffffff';
                                    }
                                }, children: category === 'all' ? 'All Features' : category }, category))) })] }), _jsxs("div", { style: {
                        marginBottom: '24px',
                        fontSize: '14px',
                        color: '#6b7280',
                        fontWeight: 500
                    }, children: ["Showing ", filteredFeatures.length, " of ", features.length, " features"] }), _jsx("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px',
                        marginBottom: '32px'
                    }, children: filteredFeatures.map(feature => (_jsxs("a", { href: `#${feature.demoLink}`, style: {
                            display: 'block',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '24px',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                        }, onMouseOver: (e) => {
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }, onMouseOut: (e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }, children: [_jsx("div", { style: {
                                    fontSize: '48px',
                                    marginBottom: '16px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }, children: feature.icon }), _jsx("h3", { style: {
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                    color: '#111827',
                                    margin: '0 0 8px 0'
                                }, children: feature.title }), _jsx("p", { style: {
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    lineHeight: '1.6',
                                    marginBottom: '16px',
                                    margin: '0 0 16px 0'
                                }, children: feature.description }), _jsx("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }, children: feature.tags.map(tag => (_jsx("span", { style: {
                                        padding: '4px 12px',
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                    }, children: tag }, tag))) }), _jsx("div", { style: {
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    backgroundColor: '#eff6ff',
                                    color: '#1e40af',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                }, children: feature.category })] }, feature.id))) }), filteredFeatures.length === 0 && (_jsxs("div", { style: {
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px'
                    }, children: [_jsx("div", { style: { fontSize: '64px', marginBottom: '16px' }, children: "\uD83D\uDD0D" }), _jsx("h3", { style: { fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }, children: "No features found" }), _jsx("p", { style: { color: '#6b7280', margin: 0 }, children: "Try adjusting your search or filter criteria" })] })), _jsxs("div", { style: {
                        marginTop: '48px',
                        padding: '32px',
                        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        color: '#ffffff'
                    }, children: [_jsx("h2", { style: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 12px 0' }, children: "Ready to build something amazing?" }), _jsx("p", { style: { fontSize: '16px', marginBottom: '24px', opacity: 0.9, margin: '0 0 24px 0' }, children: "Get started with our comprehensive documentation and examples" }), _jsxs("div", { style: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }, children: [_jsx("button", { style: {
                                        padding: '12px 32px',
                                        backgroundColor: '#ffffff',
                                        color: '#3b82f6',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }, children: "\uD83D\uDCDA View Documentation" }), _jsx("button", { style: {
                                        padding: '12px 32px',
                                        backgroundColor: 'transparent',
                                        color: '#ffffff',
                                        border: '2px solid #ffffff',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }, children: "\uD83D\uDCBB View on GitHub" })] })] })] }) }));
};
export default FeatureGallery;
