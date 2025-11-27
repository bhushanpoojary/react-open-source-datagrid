import { useState, useCallback, useRef, useEffect } from 'react';
/**
 * useTooltip Hook
 *
 * Manages tooltip state with hover detection, delay handling, and smart positioning.
 */
export const useTooltip = ({ config = {} } = {}) => {
    const [tooltipState, setTooltipState] = useState({
        isVisible: false,
        x: 0,
        y: 0,
        placement: config.placement || 'auto',
        content: null,
        targetRect: null,
    });
    const showTimeoutRef = useRef(null);
    const hideTimeoutRef = useRef(null);
    const isHoveringRef = useRef(false);
    const { enabled = true, showDelay = 500, hideDelay = 0, placement = 'auto', showCellTooltips = false, showRowTooltips = false, getCellTooltip, getRowTooltip, } = config;
    // Clear all timeouts
    const clearTimeouts = useCallback(() => {
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = null;
        }
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    }, []);
    // Show tooltip with delay
    const showTooltip = useCallback((event, content) => {
        if (!enabled || !content) {
            return;
        }
        clearTimeouts();
        isHoveringRef.current = true;
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const tooltipContent = typeof content === 'string'
            ? { content }
            : content;
        showTimeoutRef.current = setTimeout(() => {
            if (isHoveringRef.current) {
                setTooltipState({
                    isVisible: true,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    placement,
                    content: tooltipContent,
                    targetRect: rect,
                });
            }
        }, showDelay);
    }, [enabled, showDelay, placement, clearTimeouts]);
    // Hide tooltip with delay
    const hideTooltip = useCallback(() => {
        clearTimeouts();
        isHoveringRef.current = false;
        if (hideDelay > 0) {
            hideTimeoutRef.current = setTimeout(() => {
                setTooltipState((prev) => ({
                    ...prev,
                    isVisible: false,
                }));
            }, hideDelay);
        }
        else {
            setTooltipState((prev) => ({
                ...prev,
                isVisible: false,
            }));
        }
    }, [hideDelay, clearTimeouts]);
    // Cell tooltip handlers
    const onCellMouseEnter = useCallback((event, row, column, value) => {
        if (!enabled || !showCellTooltips || !getCellTooltip) {
            return;
        }
        const content = getCellTooltip(row, column, value);
        if (content) {
            showTooltip(event, content);
        }
    }, [enabled, showCellTooltips, getCellTooltip, showTooltip]);
    const onCellMouseLeave = useCallback(() => {
        hideTooltip();
    }, [hideTooltip]);
    // Row tooltip handlers
    const onRowMouseEnter = useCallback((event, row, rowIndex) => {
        if (!enabled || !showRowTooltips || !getRowTooltip) {
            return;
        }
        const content = getRowTooltip(row, rowIndex);
        if (content) {
            showTooltip(event, content);
        }
    }, [enabled, showRowTooltips, getRowTooltip, showTooltip]);
    const onRowMouseLeave = useCallback(() => {
        hideTooltip();
    }, [hideTooltip]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimeouts();
        };
    }, [clearTimeouts]);
    // Hide tooltip when scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (tooltipState.isVisible) {
                hideTooltip();
            }
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [tooltipState.isVisible, hideTooltip]);
    const handlers = {
        onCellMouseEnter,
        onCellMouseLeave,
        onRowMouseEnter,
        onRowMouseLeave,
    };
    return {
        tooltipState,
        tooltipHandlers: handlers,
        hideTooltip,
    };
};
