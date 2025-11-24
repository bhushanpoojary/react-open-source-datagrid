import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TooltipState, TooltipPlacement } from './types';

interface TooltipProps {
  state: TooltipState;
  maxWidth?: number;
  offset?: number;
}

/**
 * Tooltip Component
 * 
 * Renders tooltips using React portals for proper z-index layering.
 * Includes smart placement logic to keep tooltips within viewport bounds.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  state,
  maxWidth = 300,
  offset = 8,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [actualPlacement, setActualPlacement] = useState<TooltipPlacement>(state.placement);

  // Calculate smart placement to keep tooltip within viewport
  useEffect(() => {
    if (!state.isVisible || !tooltipRef.current || !state.targetRect) {
      return;
    }

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetRect = state.targetRect;

    let finalX = state.x;
    let finalY = state.y;
    let finalPlacement = state.placement;

    // Auto placement logic
    if (state.placement === 'auto' || state.placement === 'top' || state.placement === 'bottom') {
      const spaceAbove = targetRect.top;
      const spaceBelow = viewportHeight - targetRect.bottom;
      const spaceLeft = targetRect.left;
      const spaceRight = viewportWidth - targetRect.right;

      // Determine vertical placement
      if (state.placement === 'auto') {
        if (spaceBelow >= tooltipRect.height + offset) {
          finalPlacement = 'bottom';
        } else if (spaceAbove >= tooltipRect.height + offset) {
          finalPlacement = 'top';
        } else if (spaceRight >= tooltipRect.width + offset) {
          finalPlacement = 'right';
        } else if (spaceLeft >= tooltipRect.width + offset) {
          finalPlacement = 'left';
        } else {
          // Default to bottom if no good placement
          finalPlacement = 'bottom';
        }
      }

      // Calculate position based on placement
      if (finalPlacement === 'top') {
        finalX = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        finalY = targetRect.top - tooltipRect.height - offset;
      } else if (finalPlacement === 'bottom') {
        finalX = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        finalY = targetRect.bottom + offset;
      } else if (finalPlacement === 'left') {
        finalX = targetRect.left - tooltipRect.width - offset;
        finalY = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      } else if (finalPlacement === 'right') {
        finalX = targetRect.right + offset;
        finalY = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      }

      // Keep tooltip within horizontal bounds
      if (finalX < 10) {
        finalX = 10;
      } else if (finalX + tooltipRect.width > viewportWidth - 10) {
        finalX = viewportWidth - tooltipRect.width - 10;
      }

      // Keep tooltip within vertical bounds
      if (finalY < 10) {
        finalY = 10;
      } else if (finalY + tooltipRect.height > viewportHeight - 10) {
        finalY = viewportHeight - tooltipRect.height - 10;
      }
    } else {
      // Fixed placement (left or right)
      if (state.placement === 'left') {
        finalX = targetRect.left - tooltipRect.width - offset;
        finalY = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      } else if (state.placement === 'right') {
        finalX = targetRect.right + offset;
        finalY = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      }

      // Keep tooltip within bounds
      if (finalY < 10) {
        finalY = 10;
      } else if (finalY + tooltipRect.height > viewportHeight - 10) {
        finalY = viewportHeight - tooltipRect.height - 10;
      }

      if (finalX < 10) {
        finalX = 10;
      } else if (finalX + tooltipRect.width > viewportWidth - 10) {
        finalX = viewportWidth - tooltipRect.width - 10;
      }
    }

    setPosition({ x: finalX, y: finalY });
    setActualPlacement(finalPlacement);
  }, [state.isVisible, state.x, state.y, state.targetRect, state.placement, offset]);

  if (!state.isVisible || !state.content) {
    return null;
  }

  const content = typeof state.content === 'string'
    ? { content: state.content }
    : state.content;

  const tooltipElement = (
    <div
      ref={tooltipRef}
      role="tooltip"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: `${maxWidth}px`,
        zIndex: 99999,
        pointerEvents: 'none',
        opacity: state.isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          lineHeight: '1.5',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          wordWrap: 'break-word',
        }}
      >
        {content.title && (
          <div
            style={{
              fontWeight: '600',
              marginBottom: '4px',
              fontSize: '14px',
            }}
          >
            {content.title}
          </div>
        )}
        <div>{content.content}</div>
      </div>

      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          borderStyle: 'solid',
          ...(actualPlacement === 'top' && {
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '6px 6px 0 6px',
            borderColor: 'rgba(0, 0, 0, 0.9) transparent transparent transparent',
          }),
          ...(actualPlacement === 'bottom' && {
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '0 6px 6px 6px',
            borderColor: 'transparent transparent rgba(0, 0, 0, 0.9) transparent',
          }),
          ...(actualPlacement === 'left' && {
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: '6px 0 6px 6px',
            borderColor: 'transparent transparent transparent rgba(0, 0, 0, 0.9)',
          }),
          ...(actualPlacement === 'right' && {
            left: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: '6px 6px 6px 0',
            borderColor: 'transparent rgba(0, 0, 0, 0.9) transparent transparent',
          }),
        }}
      />
    </div>
  );

  return createPortal(tooltipElement, document.body);
};
