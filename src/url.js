// Pure URL helpers used by both the Electron shell and the toolbar renderer.
// No DOM, no Node APIs — trivially unit-testable.

const SCHEME_RE = /^(https?:\/\/)(.*)$/i;
const IMAGE_EXT_RE = /\.(png|jpe?g|svg|ico|webp)$/i;
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

/**
 * Split a URL into its scheme (`http://` / `https://`, exactly as typed) and the
 * remainder, so the renderer can dim the scheme like Chrome does. A value with no
 * http(s) scheme yields an empty scheme and the whole string as `rest`.
 */
export function splitScheme(u) {
  const s = String(u);
  const m = s.match(SCHEME_RE);
  return m ? { scheme: m[1], rest: m[2] } : { scheme: '', rest: s };
}

/**
 * True when a favicon value should be rendered as an <img> (a URL or an image
 * filename); false for an emoji or plain text.
 */
export function isImageFavicon(f) {
  const s = String(f);
  return /^https?:\/\//i.test(s) || IMAGE_EXT_RE.test(s);
}

/** Escape the three HTML-significant characters for safe innerHTML insertion. */
export function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => HTML_ESCAPES[c]);
}
