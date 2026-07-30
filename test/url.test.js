import { describe, it, expect } from 'vitest';
import { splitScheme, isImageFavicon, escapeHtml } from '../src/url.js';

describe('splitScheme', () => {
  it('splits an https URL into scheme + rest', () => {
    expect(splitScheme('https://www.peanutforum.com/thread/48213')).toEqual({
      scheme: 'https://',
      rest: 'www.peanutforum.com/thread/48213',
    });
  });

  it('splits an http URL', () => {
    expect(splitScheme('http://localhost:8234/x')).toEqual({
      scheme: 'http://',
      rest: 'localhost:8234/x',
    });
  });

  it('preserves the scheme exactly as typed (case-insensitive match)', () => {
    expect(splitScheme('HTTPS://Example.COM')).toEqual({
      scheme: 'HTTPS://',
      rest: 'Example.COM',
    });
  });

  it('returns an empty scheme for a non-http(s) value', () => {
    expect(splitScheme('about:blank')).toEqual({ scheme: '', rest: 'about:blank' });
  });

  it('coerces a non-string input to string', () => {
    expect(splitScheme(42)).toEqual({ scheme: '', rest: '42' });
  });
});

describe('isImageFavicon', () => {
  it('is false for an emoji', () => {
    expect(isImageFavicon('🥜')).toBe(false);
  });

  it('is false for plain text', () => {
    expect(isImageFavicon('peanut')).toBe(false);
  });

  it('is false for an empty string', () => {
    expect(isImageFavicon('')).toBe(false);
  });

  it('is true for an http(s) URL', () => {
    expect(isImageFavicon('https://cdn.example.com/i')).toBe(true);
  });

  it.each([['icon.png'], ['a.JPG'], ['b.jpeg'], ['logo.svg'], ['favicon.ico'], ['x.webp']])(
    'is true for image extension %s',
    (f) => {
      expect(isImageFavicon(f)).toBe(true);
    },
  );
});

describe('escapeHtml', () => {
  it('escapes &, <, and >', () => {
    expect(escapeHtml('a<b>c&d')).toBe('a&lt;b&gt;c&amp;d');
  });

  it('does not double-escape', () => {
    expect(escapeHtml('&amp;')).toBe('&amp;amp;');
  });

  it('coerces a non-string input to string', () => {
    expect(escapeHtml(5)).toBe('5');
  });

  it('leaves safe text untouched', () => {
    expect(escapeHtml('www.peanutforum.com')).toBe('www.peanutforum.com');
  });
});
