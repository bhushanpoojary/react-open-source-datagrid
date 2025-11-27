import React from 'react';
/**
 * Cell Renderer Components
 *
 * Reusable custom cell renderer components for common use cases:
 * - StatusChip: Badge component for status indicators
 * - ProgressBar: Visual progress bar
 * - IconCell: Cell with icon
 * - ImageCell: Cell with image
 * - ButtonCell: Actionable button in cell
 * - BadgeCell: Generic badge component
 */
interface StatusChipProps {
    status: string;
}
export declare const StatusChip: React.FC<StatusChipProps>;
interface ProgressBarProps {
    value: number;
    color?: string;
    showLabel?: boolean;
}
export declare const ProgressBar: React.FC<ProgressBarProps>;
interface IconCellProps {
    icon: string;
    text?: string;
    iconColor?: string;
}
export declare const IconCell: React.FC<IconCellProps>;
interface ImageCellProps {
    src: string;
    alt: string;
    text?: string;
    size?: number;
}
export declare const ImageCell: React.FC<ImageCellProps>;
interface ButtonCellProps {
    label: string;
    onClick: (e: React.MouseEvent) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}
export declare const ButtonCell: React.FC<ButtonCellProps>;
interface BadgeCellProps {
    text: string;
    color?: string;
    backgroundColor?: string;
}
export declare const BadgeCell: React.FC<BadgeCellProps>;
interface PriorityIndicatorProps {
    priority: 'low' | 'medium' | 'high' | 'critical';
}
export declare const PriorityIndicator: React.FC<PriorityIndicatorProps>;
interface RatingProps {
    rating: number;
    maxRating?: number;
}
export declare const Rating: React.FC<RatingProps>;
interface CurrencyCellProps {
    amount: number;
    currency?: string;
    locale?: string;
}
export declare const CurrencyCell: React.FC<CurrencyCellProps>;
export {};
