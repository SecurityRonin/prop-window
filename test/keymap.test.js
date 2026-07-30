import { describe, it, expect } from 'vitest';
import { classifyEnter } from '../src/keymap.js';

describe('classifyEnter', () => {
  it('plain Enter means "spoof" (set the displayed URL only)', () => {
    expect(classifyEnter({ key: 'Enter', shiftKey: false })).toBe('spoof');
  });

  it('Shift+Enter means "navigate" (actually load the typed URL)', () => {
    expect(classifyEnter({ key: 'Enter', shiftKey: true })).toBe('navigate');
  });

  it('treats a missing shiftKey as not held', () => {
    expect(classifyEnter({ key: 'Enter' })).toBe('spoof');
  });

  it('returns null for any other key', () => {
    expect(classifyEnter({ key: 'a', shiftKey: false })).toBeNull();
  });
});
