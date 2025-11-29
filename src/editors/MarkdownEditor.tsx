// MarkdownEditor - Multi-line markdown editor with live preview

import React, { useState, useRef, useMemo } from 'react';
import type { DataGridEditorProps } from './editorTypes';
import { useEditorAutoFocus, useEditorClickOutside } from './editorUtils';
import './editors.css';

export interface MarkdownEditorProps<TRow = any>
  extends DataGridEditorProps<string, TRow> {
  /** Maximum character length */
  maxLength?: number;
  
  /** Show preview panel */
  showPreview?: boolean;
  
  /** Minimum height of the editor in pixels */
  minHeight?: number;
  
  /** Maximum height of the editor in pixels */
  maxHeight?: number;
  
  /** Number of visible rows in textarea */
  rows?: number;
}

/**
 * MarkdownEditor component for DataGrid cells.
 * Provides a multi-line textarea with optional markdown preview.
 */
export function MarkdownEditor<TRow = any>(
  props: MarkdownEditorProps<TRow>
): React.ReactElement {
  const {
    value = '',
    onChange,
    onCommit,
    onCancel,
    autoFocus = true,
    maxLength,
    showPreview = true,
    minHeight = 150,
    maxHeight = 400,
    rows = 6,
  } = props;

  const [internalValue, setInternalValue] = useState(value || '');
  const [showPreviewPanel, setShowPreviewPanel] = useState(showPreview);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useEditorAutoFocus<HTMLTextAreaElement>(autoFocus, true);

  // Handle click outside
  useEditorClickOutside(
    containerRef,
    () => {
      onCommit();
    },
    true
  );

  // Handle value change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (maxLength && newValue.length > maxLength) {
      return; // Don't exceed max length
    }
    
    setInternalValue(newValue);
    onChange(newValue);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to commit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onCommit();
      return;
    }

    // Escape to cancel
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
      return;
    }

    // Tab key - insert tab character instead of moving focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue =
        internalValue.substring(0, start) + '\t' + internalValue.substring(end);
      setInternalValue(newValue);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 1;
          textareaRef.current.selectionEnd = start + 1;
        }
      }, 0);
      return;
    }

    // Markdown shortcuts
    if (e.ctrlKey || e.metaKey) {
      let insertion = '';
      let cursorOffset = 0;

      switch (e.key) {
        case 'b': // Bold
          insertion = '****';
          cursorOffset = 2;
          break;
        case 'i': // Italic
          insertion = '__';
          cursorOffset = 1;
          break;
        case 'k': // Link
          insertion = '[](url)';
          cursorOffset = 1;
          break;
        default:
          return;
      }

      if (insertion) {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const selectedText = internalValue.substring(start, end);
        
        let newValue: string;
        let newCursorPos: number;
        
        if (selectedText) {
          // Wrap selected text
          const before = insertion.substring(0, cursorOffset);
          const after = insertion.substring(cursorOffset);
          newValue =
            internalValue.substring(0, start) +
            before +
            selectedText +
            after +
            internalValue.substring(end);
          newCursorPos = start + before.length + selectedText.length;
        } else {
          // Insert at cursor
          newValue =
            internalValue.substring(0, start) +
            insertion +
            internalValue.substring(end);
          newCursorPos = start + cursorOffset;
        }
        
        setInternalValue(newValue);
        onChange(newValue);
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newCursorPos;
            textareaRef.current.selectionEnd = newCursorPos;
            textareaRef.current.focus();
          }
        }, 0);
      }
    }
  };

  // Character count
  const charCount = internalValue.length;
  const charCountClass = maxLength && charCount > maxLength * 0.9 ? 'warning' : '';

  // Render markdown preview
  const previewHtml = useMemo(() => {
    return renderMarkdownPreview(internalValue);
  }, [internalValue]);

  return (
    <div
      ref={containerRef}
      className="editor-container editor-markdown-container"
      style={{ minHeight }}
    >
      <div className="editor-markdown-toolbar">
        <div className="editor-markdown-toolbar-group">
          <button
            type="button"
            className="editor-toolbar-btn"
            onClick={() => {
              if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                const selectedText = internalValue.substring(start, end);
                const newValue =
                  internalValue.substring(0, start) +
                  `**${selectedText || 'bold'}**` +
                  internalValue.substring(end);
                setInternalValue(newValue);
                onChange(newValue);
                textareaRef.current.focus();
              }
            }}
            title="Bold (Ctrl+B)"
            aria-label="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="editor-toolbar-btn"
            onClick={() => {
              if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                const selectedText = internalValue.substring(start, end);
                const newValue =
                  internalValue.substring(0, start) +
                  `_${selectedText || 'italic'}_` +
                  internalValue.substring(end);
                setInternalValue(newValue);
                onChange(newValue);
                textareaRef.current.focus();
              }
            }}
            title="Italic (Ctrl+I)"
            aria-label="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="editor-toolbar-btn"
            onClick={() => {
              if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                const selectedText = internalValue.substring(start, end);
                const newValue =
                  internalValue.substring(0, start) +
                  `[${selectedText || 'link text'}](url)` +
                  internalValue.substring(end);
                setInternalValue(newValue);
                onChange(newValue);
                textareaRef.current.focus();
              }
            }}
            title="Link (Ctrl+K)"
            aria-label="Link"
          >
            🔗
          </button>
        </div>
        
        <div className="editor-markdown-toolbar-group">
          <button
            type="button"
            className={`editor-toolbar-btn ${showPreviewPanel ? 'active' : ''}`}
            onClick={() => setShowPreviewPanel(!showPreviewPanel)}
            title="Toggle preview"
            aria-label="Toggle preview"
            aria-pressed={showPreviewPanel}
          >
            👁
          </button>
        </div>
      </div>

      <div className={`editor-markdown-content ${showPreviewPanel ? 'split' : ''}`}>
        <div className="editor-markdown-editor">
          <textarea
            ref={textareaRef}
            className="editor-textarea editor-markdown-textarea"
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={rows}
            maxLength={maxLength}
            placeholder="Enter markdown text..."
            aria-label="Markdown editor"
            style={{ maxHeight }}
          />
          <div className={`editor-markdown-char-count ${charCountClass}`}>
            {charCount}
            {maxLength && ` / ${maxLength}`}
          </div>
        </div>

        {showPreviewPanel && (
          <div className="editor-markdown-preview">
            <div className="editor-markdown-preview-label">Preview</div>
            <div
              className="editor-markdown-preview-content"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        )}
      </div>

      <div className="editor-markdown-footer">
        <div className="editor-markdown-hint">
          <kbd>Ctrl+Enter</kbd> to save • <kbd>Esc</kbd> to cancel
        </div>
        <div className="editor-markdown-actions">
          <button
            type="button"
            className="editor-btn editor-btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="editor-btn editor-btn-primary"
            onClick={onCommit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

MarkdownEditor.displayName = 'MarkdownEditor';

/**
 * Simple and safe markdown renderer for preview.
 * Supports basic markdown without HTML injection risks.
 */
function renderMarkdownPreview(markdown: string): string {
  if (!markdown) return '<p class="editor-markdown-empty">Nothing to preview</p>';

  let html = markdown;

  // Escape HTML to prevent injection
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Code inline
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<p')) {
    html = '<p>' + html + '</p>';
  }

  return html;
}
