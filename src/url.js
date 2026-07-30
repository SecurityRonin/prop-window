// Pure URL helpers used by both the Electron shell and the toolbar renderer.
// No DOM, no Node APIs — trivially unit-testable.

const SCHEME_RE = /^(https?:\/\/)(.*)$/i;
const IMAGE_EXT_RE = /\.(png|jpe?g|svg|ico|webp)$/i;
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
// A real hierarchical scheme ends in "://"; opaque schemes we leave alone too.
const HAS_SCHEME_RE = /^[a-z][a-z0-9+.-]*:\/\//i;
const OPAQUE_SCHEME_RE = /^(about|data|blob|mailto|chrome|view-source|file):/i;

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

/**
 * Turn whatever was typed into the address bar into a loadable URL: pass through
 * a value that already carries a scheme (`https://…`, `about:`, `file://…`),
 * otherwise assume `https://`. This is why a bare `youtube.com` now navigates —
 * Electron's loadURL rejects a schemeless string. A host:port like
 * `localhost:8234` is NOT mistaken for a scheme (no `://`).
 */
export function normalizeUrl(input) {
  const s = String(input).trim();
  if (!s) return '';
  if (HAS_SCHEME_RE.test(s) || OPAQUE_SCHEME_RE.test(s)) return s;
  return 'https://' + s;
}
