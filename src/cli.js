const SCENE_EXT_RE = /\.(json|propscene)$/i;

export function parseCli(argv) {
  const args = argv.slice(2);
  let sceneFile = null;
  let screenshot = null;
  let borderless = false;
  let url = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--borderless') {
      borderless = true;
    } else if (arg.startsWith('--url=')) {
      url = arg.slice('--url='.length);
    } else if (arg === '--url') {
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        url = next;
        i++;
      }
    } else if (arg.startsWith('--screenshot=')) {
      screenshot = arg.slice('--screenshot='.length);
    } else if (arg === '--screenshot') {
      const next = args[i + 1];
      if (next && !next.startsWith('--') && !SCENE_EXT_RE.test(next)) {
        screenshot = next;
        i++;
      } else {
        screenshot = 'screenshot.png';
      }
    } else if (!arg.startsWith('--') && SCENE_EXT_RE.test(arg) && sceneFile === null) {
      sceneFile = arg;
    }
  }

  return { sceneFile, screenshot, borderless, url };
}
