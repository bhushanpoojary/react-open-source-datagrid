import React, { useEffect, useRef, useCallback } from 'react';
import type { ContextMenuProps, ContextMenuItem } from './types';
import './ContextMenu.css';

/**
 * ContextMenu Component
 * 
 * A customizable right-click context menu for the DataGrid.
 * Supports nested submenus, separators, disabled items, and custom menu items.
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  items,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      // Only close if right-clicking outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        event.preventDefault();
        onClose();
      }
    };

    // Add event listeners with a small delay to avoid closing immediately on open
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('contextmenu', handleContextMenu);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust menu position to keep it within viewport
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      // Check if menu goes beyond right edge
      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }

      // Check if menu goes beyond bottom edge
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      // Update position if adjusted
      if (adjustedX !== x || adjustedY !== y) {
        menu.style.left = `${adjustedX}px`;
        menu.style.top = `${adjustedY}px`;
      }
    }
  }, [x, y]);

  const handleItemClick = useCallback((item: ContextMenuItem) => {
    if (item.disabled || item.type === 'separator') {
      return;
    }

    if (item.onClick) {
      item.onClick();
    }

    // Close menu after action (unless it has submenu)
    if (!item.submenu) {
      onClose();
    }
  }, [onClose]);

  const renderMenuItem = (item: ContextMenuItem, index: number) => {
    if (item.type === 'separator') {
      return (
        <div
          key={`separator-${index}`}
          className="context-menu-separator"
          role="separator"
        />
      );
    }

    return (
      <div
        key={item.id || index}
        className={`context-menu-item ${item.disabled ? 'disabled' : ''} ${item.danger ? 'danger' : ''}`}
        onClick={() => handleItemClick(item)}
        role="menuitem"
        aria-disabled={item.disabled}
        tabIndex={item.disabled ? -1 : 0}
      >
        {item.icon && <span className="context-menu-icon">{item.icon}</span>}
        <span className="context-menu-label">{item.label}</span>
        {item.shortcut && (
          <span className="context-menu-shortcut">{item.shortcut}</span>
        )}
        {item.submenu && (
          <span className="context-menu-arrow">▶</span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      role="menu"
      aria-label="Context menu"
    >
      {items.map((item, index) => renderMenuItem(item, index))}
    </div>
  );
};
