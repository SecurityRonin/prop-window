import { describe, it, expect } from 'vitest';
import { splitScheme, isImageFavicon, escapeHtml, normalizeUrl } from '../src/url.js';

describe('normalizeUrl', () => {
  it('keeps a full https URL unchanged', () => {
    expect(normalizeUrl('https://youtube.com/watch?v=x')).toBe('https://youtube.com/watch?v=x');
  });

  it('keeps a full http URL unchanged', () => {
    expect(normalizeUrl('http://localhost:8234/x')).toBe('http://localhost:8234/x');
  });

  it('prepends https:// to a bare domain', () => {
    expect(normalizeUrl('youtube.com')).toBe('https://youtube.com');
  });

  it('prepends https:// to a host:port/path (not mistaking the port for a scheme)', () => {
    expect(normalizeUrl('localhost:8234/x')).toBe('https://localhost:8234/x');
  });

  it('prepends https:// to a www path', () => {
    expect(normalizeUrl('www.google.com/search?q=a')).toBe('https://www.google.com/search?q=a');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeUrl('  example.com  ')).toBe('https://example.com');
  });

  it('leaves opaque schemes (about:, data:, file:) untouched', () => {
    expect(normalizeUrl('about:blank')).toBe('about:blank');
    expect(normalizeUrl('file:///tmp/x.html')).toBe('file:///tmp/x.html');
  });

  it('returns empty string for empty input', () => {
    expect(normalizeUrl('   ')).toBe('');
  });

  it('coerces a non-string input', () => {
    expect(normalizeUrl(123)).toBe('https://123');
  });
});

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
