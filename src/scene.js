const STRING_FIELDS = ['loadUrl', 'displayUrl', 'title', 'favicon'];
const BOOL_FIELDS = ['secure', 'fullscreen', 'kiosk'];
const INT_FIELDS = ['width', 'height'];
const ALL_FIELDS = new Set([...STRING_FIELDS, ...BOOL_FIELDS, ...INT_FIELDS]);

export function parseScene(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeError('Scene must be a plain object');
  }

  const scene = {};

  for (const key of Object.keys(raw)) {
    if (!ALL_FIELDS.has(key)) continue;
    const val = raw[key];

    if (STRING_FIELDS.includes(key)) {
      if (typeof val !== 'string') throw new TypeError(`${key} must be a string`);
      scene[key] = val;
    } else if (BOOL_FIELDS.includes(key)) {
      if (typeof val !== 'boolean') throw new TypeError(`${key} must be a boolean`);
      scene[key] = val;
    } else if (INT_FIELDS.includes(key)) {
      if (typeof val !== 'number' || !Number.isInteger(val) || val <= 0) {
        throw new TypeError(`${key} must be a positive integer`);
      }
      scene[key] = val;
    }
  }

  return scene;
}
