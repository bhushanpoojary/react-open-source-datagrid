/**
 * useFocusTrap Hook
 *
 * Traps focus within a container element (useful for modals, dialogs, and popups).
 * Ensures keyboard navigation stays within the trapped area for accessibility.
 */
import React, { useEffect, useRef } from 'react';
export const useFocusTrap = (options = {}) => {
    const { enabled = true, initialFocus = 'first', returnFocus = true, escapeDeactivates = true, onEscape, } = options;
    const containerRef = React.useRef(null);
    const previouslyFocusedElement = useRef(null);
    useEffect(() => {
        if (!enabled || !containerRef.current)
            return;
        previouslyFocusedElement.current = document.activeElement;
        
        const getFocusableElements = () => {
            if (!containerRef.current)
                return [];
            const focusableSelectors = [
                'a[href]',
                'button:not([disabled])',
                'textarea:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
            ].join(', ');
            return Array.from(containerRef.current.querySelectorAll(focusableSelectors)).filter((el) => {
                // Filter out hidden elements
                return (el.offsetWidth > 0 &&
                    el.offsetHeight > 0 &&
                    window.getComputedStyle(el).visibility !== 'hidden');
            });
        };
        // Set initial focus
        const setInitialFocus = () => {
            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0) {
                // If no focusable elements, focus the container itself
                if (containerRef.current && containerRef.current.tabIndex === -1) {
                    containerRef.current.tabIndex = 0;
                }
                containerRef.current?.focus();
                return;
            }
            if (initialFocus === 'first') {
                focusableElements[0]?.focus();
            }
            else if (initialFocus === 'last') {
                focusableElements[focusableElements.length - 1]?.focus();
            }
            else if (initialFocus instanceof HTMLElement) {
                initialFocus.focus();
            }
        };
        setInitialFocus();
        // Handle Tab key navigation
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && escapeDeactivates) {
                e.preventDefault();
                onEscape?.();
                return;
            }
            if (e.key !== 'Tab')
                return;
            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0)
                return;
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            const activeElement = document.activeElement;
            if (e.shiftKey) {
                // Shift + Tab: Move backwards
                if (activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            }
            else {
                // Tab: Move forwards
                if (activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Return focus to previously focused element
            if (returnFocus && previouslyFocusedElement.current) {
                previouslyFocusedElement.current.focus();
            }
        };
    }, [enabled, initialFocus, returnFocus, escapeDeactivates, onEscape]);
    return containerRef;
};
// If you need the FocusTrap component, import it from './FocusTrap'
