const SCENE_EXT_RE = /\.(json|propscene)$/i;

export function parseCli(argv) {
  const args = argv.slice(2);
  let sceneFile = null;
  let screenshot = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--screenshot=')) {
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

  return { sceneFile, screenshot };
}
