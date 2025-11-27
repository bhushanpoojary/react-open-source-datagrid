import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function HomePage() {
    return (_jsxs("div", { style: {
            padding: '40px',
            maxWidth: '1200px',
            margin: '0 auto',
        }, children: [_jsxs("div", { style: { marginBottom: '48px' }, children: [_jsx("h1", { style: {
                            fontSize: '48px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }, children: "React DataGrid" }), _jsx("p", { style: {
                            fontSize: '20px',
                            color: '#64748b',
                            marginBottom: '32px',
                            lineHeight: '1.6'
                        }, children: "A powerful, enterprise-grade data grid built with React. High-performance virtual scrolling, advanced filtering, and modern UI out of the box." }), _jsxs("div", { style: {
                            backgroundColor: '#1e293b',
                            color: 'white',
                            padding: '24px',
                            borderRadius: '12px',
                            marginBottom: '32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }, children: [_jsx("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px'
                                }, children: _jsx("h3", { style: { fontSize: '18px', fontWeight: '600', margin: 0 }, children: "\uD83D\uDCE6 Installation" }) }), _jsxs("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    backgroundColor: '#0f172a',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    fontFamily: 'monospace',
                                    fontSize: '14px'
                                }, children: [_jsx("code", { style: { flex: 1 }, children: "npm install react-open-source-grid" }), _jsx("button", { onClick: () => {
                                            navigator.clipboard.writeText('npm install react-open-source-grid');
                                        }, style: {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            transition: 'all 0.15s'
                                        }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                        }, children: "Copy" })] })] }), _jsx("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '48px'
                        }, children: [
                            { icon: '⚡', label: 'Virtual Scrolling', value: '100M+ rows' },
                            { icon: '📈', label: 'Live Updates', value: '1000+/sec' },
                            { icon: '🎨', label: 'Themes', value: '4 built-in' },
                            { icon: '🚀', label: 'Performance', value: 'Optimized' },
                        ].map((stat) => (_jsxs("div", { style: {
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                textAlign: 'center',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                            }, children: [_jsx("div", { style: { fontSize: '32px', marginBottom: '8px' }, children: stat.icon }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }, children: stat.value }), _jsx("div", { style: { fontSize: '14px', color: '#64748b' }, children: stat.label })] }, stat.label))) })] }), _jsx("h2", { style: {
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                    color: '#1e293b'
                }, children: "\u2728 Features" }), _jsxs("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginBottom: '48px'
                }, children: [_jsx(FeatureCard, { icon: "\uD83D\uDCCA", title: "Core Grid Features", description: "Essential data grid functionality with pagination, sorting, and responsive design.", features: [
                            'Pagination & sorting',
                            'Responsive columns',
                            'Row selection',
                            'Excel export'
                        ] }), _jsx(FeatureCard, { icon: "\u26A1", title: "High Performance", description: "Handle massive datasets with ease using virtual scrolling and infinite loading.", features: [
                            'Virtual scrolling',
                            'Infinite scroll (100M rows)',
                            'Lazy loading',
                            'Optimized rendering'
                        ] }), _jsx(FeatureCard, { icon: "\uD83D\uDCC8", title: "Live Market Data", description: "Real-time streaming updates with flash indicators and efficient DOM updates.", features: [
                            '1000+ updates/second',
                            'Flash indicators',
                            'Batch rendering',
                            'Market data optimized'
                        ] }), _jsx(FeatureCard, { icon: "\uD83C\uDF32", title: "Hierarchical Data", description: "Display and manage tree structures with expand/collapse functionality.", features: [
                            'Tree data support',
                            'Expand/collapse',
                            'Parent-child relations',
                            'Recursive structures'
                        ] }), _jsx(FeatureCard, { icon: "\u2195\uFE0F", title: "Row Dragging", description: "Intuitive drag-and-drop for reordering rows with visual feedback.", features: [
                            'Drag & drop rows',
                            'Visual drag handle',
                            'Reorder callback',
                            'Smooth animations'
                        ] }), _jsx(FeatureCard, { icon: "\uD83D\uDD0D", title: "Advanced Filtering", description: "Powerful column filters with multiple data type support.", features: [
                            'Text filtering',
                            'Number ranges',
                            'Date filters',
                            'Boolean filters'
                        ] }), _jsx(FeatureCard, { icon: "\uD83C\uDFAD", title: "Custom Renderers", description: "Create custom cell components for rich data visualization.", features: [
                            'Status badges',
                            'Progress bars',
                            'Action buttons',
                            'Custom formatting'
                        ] }), _jsx(FeatureCard, { icon: "\uD83C\uDFA8", title: "Theme System", description: "10 beautiful built-in themes with modern design aesthetics and easy customization.", features: [
                            'Quartz & Alpine themes',
                            'Material Design theme',
                            'Dark mode theme',
                            'Nord (Arctic) theme',
                            'Dracula theme',
                            'Solarized Light & Dark',
                            'Monokai theme',
                            'One Dark theme',
                            'Easy theme switching',
                            'Custom theme support'
                        ] }), _jsx(FeatureCard, { icon: "\uD83D\uDCBE", title: "Layout Persistence", description: "Save and restore grid state including columns, filters, and sorting.", features: [
                            'Save layouts',
                            'Restore state',
                            'Column visibility',
                            'Filter persistence'
                        ] }), _jsx(FeatureCard, { icon: "\u267F", title: "Accessibility (A11y)", description: "WCAG 2.1 AA compliant with full keyboard navigation and screen reader support.", features: [
                            'Keyboard navigation',
                            'ARIA attributes',
                            'Screen reader support',
                            'Focus management'
                        ] })] }), _jsxs("div", { style: {
                    backgroundColor: '#f1f5f9',
                    padding: '32px',
                    borderRadius: '12px',
                    marginBottom: '48px'
                }, children: [_jsx("h2", { style: {
                            fontSize: '28px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            color: '#1e293b'
                        }, children: "\uD83D\uDE80 Getting Started" }), _jsx("p", { style: { fontSize: '16px', color: '#475569', marginBottom: '16px' }, children: "Explore the demos in the sidebar to see each feature in action. Each demo includes:" }), _jsxs("ul", { style: {
                            fontSize: '16px',
                            color: '#475569',
                            lineHeight: '1.8',
                            paddingLeft: '24px'
                        }, children: [_jsx("li", { children: "Live interactive examples" }), _jsx("li", { children: "Code snippets and implementation details" }), _jsx("li", { children: "Configuration options" }), _jsx("li", { children: "Performance metrics where applicable" })] })] }), _jsxs("div", { style: {
                    textAlign: 'center',
                    padding: '32px',
                    color: '#64748b',
                    fontSize: '14px'
                }, children: [_jsx("p", { children: "Built with \u2764\uFE0F using React, TypeScript, and Vite" }), _jsx("p", { style: { marginTop: '8px' }, children: _jsx("a", { href: "https://github.com/bhushanpoojary/react-open-source-datagrid", target: "_blank", rel: "noopener noreferrer", style: {
                                color: '#2563eb',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }, children: "View on GitHub \u2192" }) })] })] }));
}
function FeatureCard({ icon, title, description, features }) {
    return (_jsxs("div", { style: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s'
        }, onMouseEnter: (e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }, onMouseLeave: (e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
        }, children: [_jsx("div", { style: { fontSize: '36px', marginBottom: '12px' }, children: icon }), _jsx("h3", { style: {
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#1e293b'
                }, children: title }), _jsx("p", { style: {
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '16px',
                    lineHeight: '1.5'
                }, children: description }), _jsx("ul", { style: {
                    fontSize: '13px',
                    color: '#475569',
                    paddingLeft: '20px',
                    margin: 0,
                    lineHeight: '1.8'
                }, children: features.map((feature, index) => (_jsx("li", { children: feature }, index))) })] }));
}
