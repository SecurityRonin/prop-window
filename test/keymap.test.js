import { describe, it, expect } from 'vitest';
import { classifyEnter } from '../src/keymap.js';

describe('classifyEnter', () => {
  it('plain Enter means "navigate" (go to the real site, like any browser)', () => {
    expect(classifyEnter({ key: 'Enter', shiftKey: false })).toBe('navigate');
  });

  it('Shift+Enter means "spoof" (change only the displayed URL)', () => {
    expect(classifyEnter({ key: 'Enter', shiftKey: true })).toBe('spoof');
  });

  it('treats a missing shiftKey as plain Enter (navigate)', () => {
    expect(classifyEnter({ key: 'Enter' })).toBe('navigate');
  });

  it('returns null for any other key', () => {
    expect(classifyEnter({ key: 'a', shiftKey: false })).toBeNull();
  });
});
