import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    // Pure logic — Node + browser safe, no host globals.
    files: ['src/**/*.js'],
    languageOptions: { globals: {} },
  },
  {
    // Electron main/preload run in Node.
    files: ['electron/main.js', 'electron/preload.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // Test files import { describe, it, expect } from 'vitest' explicitly.
    files: ['test/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    ignores: ['node_modules/', 'dist/', 'site/', 'coverage/'],
  },
];
