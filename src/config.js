// Parse the prop browser's runtime configuration from environment variables,
// with injectable defaults (kept pure so it is unit-testable — the Electron main
// process injects the on-disk default LOAD_URL/window size).

const BUILTINS = {
  load: '',
  display: 'https://www.example.com',
  title: 'New Tab',
  favicon: '🌐',
  width: 1440,
  height: 900,
};

function positiveIntOr(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

/**
 * @param {Record<string,string>} env      process.env (or a subset)
 * @param {object} defaults                 overrides for the built-in defaults
 * @returns normalized config consumed by the Electron shell
 */
export function parseConfig(env = {}, defaults = {}) {
  const d = { ...BUILTINS, ...defaults };
  return {
    load: env.LOAD_URL || d.load,
    display: env.DISPLAY_URL || d.display,
    title: env.TITLE || d.title,
    favicon: env.FAVICON || d.favicon,
    secure: env.SECURE !== '0',
    fullscreen: env.FULLSCREEN === '1' || env.KIOSK === '1',
    kiosk: env.KIOSK === '1',
    width: positiveIntOr(env.WIDTH, d.width),
    height: positiveIntOr(env.HEIGHT, d.height),
  };
}
