import React from 'react';
/**
 * Helper component to render the live region for screen readers
 */
export declare const ScreenReaderAnnouncer: React.FC<{
    message: string;
    priority?: 'polite' | 'assertive';
}>;
