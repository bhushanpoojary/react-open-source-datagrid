import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Core utilities and the reducer are pure functions and don't need a DOM.
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/components/DataGrid/filterUtils.ts',
        'src/components/DataGrid/groupingUtils.ts',
        'src/components/DataGrid/aggregationUtils.ts',
        'src/components/DataGrid/treeDataUtils.ts',
        'src/components/DataGrid/gridReducer.ts',
        'src/components/DataGrid/gridDataUtils.ts',
      ],
    },
  },
});
