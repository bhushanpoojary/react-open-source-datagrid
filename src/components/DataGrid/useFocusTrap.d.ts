/**
 * useFocusTrap Hook
 *
 * Traps focus within a container element (useful for modals, dialogs, and popups).
 * Ensures keyboard navigation stays within the trapped area for accessibility.
 */
import React from 'react';
interface FocusTrapOptions {
    enabled?: boolean;
    initialFocus?: 'first' | 'last' | HTMLElement | null;
    returnFocus?: boolean;
    escapeDeactivates?: boolean;
    onEscape?: () => void;
}
/**
 * Hook to trap focus within a container element
 */
export declare const useFocusTrap: (options?: FocusTrapOptions) => React.RefObject<HTMLElement | null>;
/**
 * Component wrapper for focus trap
 */
interface FocusTrapProps extends FocusTrapOptions {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
export declare const FocusTrap: React.FC<FocusTrapProps>;
export {};
