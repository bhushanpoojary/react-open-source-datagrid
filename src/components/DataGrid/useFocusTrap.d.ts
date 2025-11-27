/**
 * useFocusTrap Hook
 *
 * Traps focus within a container element (useful for modals, dialogs, and popups).
 * Ensures keyboard navigation stays within the trapped area for accessibility.
 */
import React from 'react';
export declare const useFocusTrap: (options?: {
    enabled?: boolean;
    initialFocus?: "first" | "last" | HTMLElement | null;
    returnFocus?: boolean;
    escapeDeactivates?: boolean;
    onEscape?: () => void;
}) => React.RefObject<HTMLElement | null>;
