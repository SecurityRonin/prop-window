import { defineConfig } from 'vitest/config';

// Coverage is gated at 100% on src/ — the pure, testable logic. The Electron
// shell (electron/*.js) is a Humble Object: a thin, side-effecting layer over
// BrowserWindow/BrowserView that carries no decisions, so it is excluded from the
// gate rather than fake-covered (mirrors the fleet's coverage discipline).
export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
