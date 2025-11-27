import { useState } from 'react';
import { getDensityConfig, generateDensityCSS, saveDensityMode, loadDensityMode } from './densityModes';
/**
 * useDensityMode Hook
 *
 * Manages density mode state and provides CSS variables for styling.
 * Supports persistence to localStorage.
 *
 * @example
 * ```tsx
 * const { densityMode, setDensityMode, densityStyles } = useDensityMode({
 *   initialMode: 'normal',
 *   persist: true
 * });
 *
 * return (
 *   <div style={densityStyles}>
 *     <DensityToggle value={densityMode} onChange={setDensityMode} />
 *     <DataGrid ... />
 *   </div>
 * );
 * ```
 */
export function useDensityMode(options = {}) {
    const { initialMode = 'normal', persist = true, persistenceKey = 'grid-density-mode', onChange, } = options;
    // Initialize state from localStorage if persistence is enabled
    const [densityMode, setDensityModeState] = useState(() => {
        if (persist) {
            const saved = loadDensityMode(persistenceKey);
            if (saved)
                return saved;
        }
        return initialMode;
    });
    // Update density mode and persist if enabled
    const setDensityMode = (mode) => {
        setDensityModeState(mode);
        if (persist) {
            saveDensityMode(mode, persistenceKey);
        }
        onChange?.(mode);
    };
    // Get current density configuration
    const densityConfig = getDensityConfig(densityMode);
    // Generate CSS variables for current density mode
    const densityStyles = generateDensityCSS(densityMode);
    return {
        densityMode,
        setDensityMode,
        densityConfig,
        densityStyles,
    };
}
