import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
export const CodeBlock = ({ code, language = 'tsx', title, showLineNumbers = true, maxHeight = '500px', }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    return (_jsxs("div", { style: {
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #374151',
            marginBottom: '24px',
        }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#1e293b',
                    borderBottom: '1px solid #374151',
                }, children: [_jsx("span", { style: {
                            color: '#e2e8f0',
                            fontSize: '14px',
                            fontWeight: 600,
                            fontFamily: 'monospace',
                        }, children: title || `${language.toUpperCase()} Code` }), _jsx("button", { onClick: handleCopy, style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            backgroundColor: copied ? '#059669' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                        }, onMouseEnter: (e) => {
                            if (!copied) {
                                e.currentTarget.style.backgroundColor = '#2563eb';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }
                        }, onMouseLeave: (e) => {
                            if (!copied) {
                                e.currentTarget.style.backgroundColor = '#3b82f6';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        }, onMouseDown: (e) => {
                            e.currentTarget.style.transform = 'scale(0.95)';
                        }, onMouseUp: (e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }, children: copied ? (_jsxs(_Fragment, { children: [_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }), "Copied!"] })) : (_jsxs(_Fragment, { children: [_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }), _jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })] }), "Copy"] })) })] }), _jsx("div", { style: {
                    maxHeight,
                    overflow: 'auto',
                    backgroundColor: '#1e293b',
                }, children: _jsx(SyntaxHighlighter, { language: language, style: vscDarkPlus, showLineNumbers: showLineNumbers, customStyle: {
                        margin: 0,
                        padding: '16px',
                        backgroundColor: 'transparent',
                        fontSize: '14px',
                        lineHeight: '1.5',
                    }, codeTagProps: {
                        style: {
                            fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                        },
                    }, children: code }) })] }));
};
export default CodeBlock;
