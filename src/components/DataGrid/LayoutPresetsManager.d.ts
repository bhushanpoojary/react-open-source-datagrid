import React from 'react';
import type { LayoutPreset } from './types';
import { LayoutPersistenceManager } from './layoutPersistence';
interface LayoutPresetsManagerProps {
    manager: LayoutPersistenceManager;
    currentLayout: LayoutPreset['layout'];
    onLoadPreset: (layout: LayoutPreset['layout']) => void;
    onResetLayout: () => void;
}
export declare const LayoutPresetsManager: React.FC<LayoutPresetsManagerProps>;
export {};
