import React from 'react';
export interface FocusTrapProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    enabled?: boolean;
    initialFocus?: 'first' | 'last' | HTMLElement | null;
    returnFocus?: boolean;
    escapeDeactivates?: boolean;
    onEscape?: () => void;
}
export declare const FocusTrap: React.FC<FocusTrapProps>;
