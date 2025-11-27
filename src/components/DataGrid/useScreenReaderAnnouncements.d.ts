/**
 * useScreenReaderAnnouncements Hook
 *
 * Manages live region announcements for screen readers.
 * Provides accessible feedback for grid actions like sorting, filtering, selection, and navigation.
 */
import React from 'react';
interface AnnouncementOptions {
    priority?: 'polite' | 'assertive';
    delay?: number;
}
export declare const useScreenReaderAnnouncements: () => {
    announcementRef: React.RefObject<string>;
    announce: (message: string, options?: AnnouncementOptions) => void;
    announceSorting: (columnName: string, direction: "asc" | "desc" | null) => void;
    announceSelection: (count: number) => void;
    announceFiltering: (columnName: string, hasFilter: boolean, resultCount?: number) => void;
    announcePagination: (currentPage: number, totalPages: number, rowCount: number) => void;
    announceFocus: (rowIndex: number, columnName: string, value?: any) => void;
    announceEditing: (columnName: string, isStarting: boolean) => void;
    announceRowReorder: (fromIndex: number, toIndex: number) => void;
    announceColumnVisibility: (columnName: string, isVisible: boolean) => void;
    announceLoading: (isLoading: boolean, message?: string) => void;
};
/**
 * Helper component to render the live region
 */
export declare const ScreenReaderAnnouncer: React.FC<{
    message: string;
    priority?: 'polite' | 'assertive';
}>;
export {};
