/**
 * ChartOverlay - Floating panel component for displaying charts over the grid
 */

import React, { useEffect, useRef, useState } from 'react';
import { QuickChart } from './QuickChart';
import type { ChartConfig, ChartType } from './types';
import './ChartOverlay.css';

export interface ChartOverlayProps {
  config: ChartConfig;
  onClose: () => void;
  onChangeType?: (type: ChartType) => void;
  onToggleTheme?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  draggable?: boolean;
  resizable?: boolean;
}

/**
 * ChartOverlay component - renders a floating chart panel
 */
export const ChartOverlay: React.FC<ChartOverlayProps> = ({
  config,
  onClose,
  onChangeType,
  onToggleTheme,
  position = 'bottom-right',
  draggable = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [chartPosition, setChartPosition] = useState({ x: 0, y: 0 });
  const [dimensions] = useState({ width: 600, height: 400 });

  // Initialize position based on prop
  useEffect(() => {
    if (!overlayRef.current) return;

    const updatePosition = () => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top-right':
          x = viewport.width - dimensions.width - 40;
          y = 40;
          break;
        case 'top-left':
          x = 40;
          y = 40;
          break;
        case 'bottom-right':
          x = viewport.width - dimensions.width - 40;
          y = viewport.height - dimensions.height - 40;
          break;
        case 'bottom-left':
          x = 40;
          y = viewport.height - dimensions.height - 40;
          break;
        case 'center':
          x = (viewport.width - dimensions.width) / 2;
          y = (viewport.height - dimensions.height) / 2;
          break;
      }

      setChartPosition({ x, y });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [position, dimensions]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggable) return;
    if ((e.target as HTMLElement).closest('.quick-chart__body')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - chartPosition.x,
      y: e.clientY - chartPosition.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - dimensions.width;
      const maxY = window.innerHeight - dimensions.height;

      setChartPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, dimensions]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="chart-overlay">
      <div className="chart-overlay__backdrop" onClick={onClose} />
      <div
        ref={overlayRef}
        className={`chart-overlay__container ${
          isDragging ? 'chart-overlay__container--dragging' : ''
        } ${draggable ? 'chart-overlay__container--draggable' : ''}`}
        style={{
          left: chartPosition.x,
          top: chartPosition.y,
          width: dimensions.width,
          height: dimensions.height,
        }}
        onMouseDown={handleMouseDown}
      >
        <QuickChart
          config={config}
          onClose={onClose}
          onChangeType={onChangeType}
          onToggleTheme={onToggleTheme}
          allowTypeSwitch={true}
          allowThemeSwitch={true}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
    </div>
  );
};

export default ChartOverlay;
