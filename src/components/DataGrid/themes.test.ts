import { describe, it, expect } from 'vitest';
import {
  getTheme,
  resolveTheme,
  mergeTheme,
  generateThemeCSS,
  quartzTheme,
  darkTheme,
} from './themes';
import type { CustomGridTheme } from './themes';

describe('resolveTheme', () => {
  it('resolves a built-in theme name to its GridTheme', () => {
    expect(resolveTheme('dark')).toEqual(getTheme('dark'));
  });

  it('falls back to quartz as the base theme when no baseTheme is given', () => {
    const custom: CustomGridTheme = {
      colors: { primary: '#ff6b00' },
    };
    const resolved = resolveTheme(custom);
    expect(resolved.colors.primary).toBe('#ff6b00');
    // Untouched fields fall back to quartz
    expect(resolved.colors.background).toBe(quartzTheme.colors.background);
    expect(resolved.spacing).toEqual(quartzTheme.spacing);
  });

  it('merges a custom theme on top of an explicit baseTheme', () => {
    const custom: CustomGridTheme = {
      baseTheme: 'dark',
      colors: { primary: '#00ff99' },
      borders: { radius: '12px' },
    };
    const resolved = resolveTheme(custom);
    expect(resolved.colors.primary).toBe('#00ff99');
    expect(resolved.colors.background).toBe(darkTheme.colors.background);
    expect(resolved.borders.radius).toBe('12px');
    expect(resolved.borders.width).toBe(darkTheme.borders.width);
  });

  it('allows overriding name/displayName on a custom theme', () => {
    const custom: CustomGridTheme = {
      name: 'my-brand',
      displayName: 'My Brand Theme',
    };
    const resolved = resolveTheme(custom);
    expect(resolved.name).toBe('my-brand');
    expect(resolved.displayName).toBe('My Brand Theme');
  });

  it('does not mutate the base theme object', () => {
    const before = JSON.stringify(quartzTheme);
    resolveTheme({ colors: { primary: '#123456' } });
    expect(JSON.stringify(quartzTheme)).toBe(before);
  });
});

describe('mergeTheme', () => {
  it('overrides only the provided fields', () => {
    const merged = mergeTheme(quartzTheme, { typography: { fontSize: '20px' } });
    expect(merged.typography.fontSize).toBe('20px');
    expect(merged.typography.fontFamily).toBe(quartzTheme.typography.fontFamily);
    expect(merged.colors).toEqual(quartzTheme.colors);
  });
});

describe('generateThemeCSS with resolved custom theme', () => {
  it('produces CSS variables reflecting the overrides', () => {
    const resolved = resolveTheme({ colors: { primary: '#abcdef' } });
    const css = generateThemeCSS(resolved);
    expect(css['--grid-primary']).toBe('#abcdef');
  });
});
