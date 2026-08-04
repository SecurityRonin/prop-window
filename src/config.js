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
 * @param {object} [scene]                  scene file fields (override defaults, env overrides scene)
 * @returns normalized config consumed by the Electron shell
 */
export function parseConfig(env = {}, defaults = {}, scene = {}) {
  const s = scene || {};
  const d = { ...BUILTINS, ...defaults };

  const load = env.LOAD_URL || s.loadUrl || d.load;
  const display = env.DISPLAY_URL || s.displayUrl || d.display;
  const title = env.TITLE || s.title || d.title;
  const favicon = env.FAVICON || s.favicon || d.favicon;

  const secureFromScene = s.secure !== undefined ? s.secure : true;
  const secure = 'SECURE' in env ? env.SECURE !== '0' : secureFromScene;

  const fsEnv = env.FULLSCREEN === '1' || env.KIOSK === '1';
  const kioskEnv = env.KIOSK === '1';
  const fullscreen =
    'FULLSCREEN' in env || 'KIOSK' in env
      ? fsEnv
      : s.fullscreen !== undefined
        ? s.fullscreen
        : false;
  const kiosk = 'KIOSK' in env ? kioskEnv : s.kiosk !== undefined ? s.kiosk : false;

  // Borderless drops all of our own chrome (toolbar + fake address bar) so the
  // page can supply its own frame — e.g. the Kali window mockup drawing a single
  // native-looking border. Same env-over-scene-over-default precedence as kiosk.
  const borderless =
    'BORDERLESS' in env
      ? env.BORDERLESS === '1'
      : s.borderless !== undefined
        ? s.borderless
        : false;

  return {
    load,
    display,
    title,
    favicon,
    secure,
    fullscreen,
    kiosk,
    borderless,
    width: positiveIntOr(env.WIDTH, s.width || d.width),
    height: positiveIntOr(env.HEIGHT, s.height || d.height),
  };
}
