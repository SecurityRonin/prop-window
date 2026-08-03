import { describe, it, expect } from 'vitest';
import { parseCli } from '../src/cli.js';

describe('parseCli', () => {
  const electron = '/usr/local/bin/electron';
  const app = '.';

  it('returns defaults when no extra args are given', () => {
    const cli = parseCli([electron, app]);
    expect(cli).toEqual({ sceneFile: null, screenshot: null });
  });

  it('picks up a positional .json file as the scene', () => {
    const cli = parseCli([electron, app, 'shots/hero.json']);
    expect(cli.sceneFile).toBe('shots/hero.json');
  });

  it('picks up a .propscene file as the scene', () => {
    const cli = parseCli([electron, app, 'demo.propscene']);
    expect(cli.sceneFile).toBe('demo.propscene');
  });

  it('parses --screenshot with an output path', () => {
    const cli = parseCli([electron, app, '--screenshot', 'out.png']);
    expect(cli.screenshot).toBe('out.png');
  });

  it('parses --screenshot=path (equals form)', () => {
    const cli = parseCli([electron, app, '--screenshot=capture.png']);
    expect(cli.screenshot).toBe('capture.png');
  });

  it('defaults screenshot output to screenshot.png when no path follows', () => {
    const cli = parseCli([electron, app, '--screenshot']);
    expect(cli.screenshot).toBe('screenshot.png');
  });

  it('does not mistake --screenshot value for a scene file', () => {
    const cli = parseCli([electron, app, '--screenshot', 'out.png']);
    expect(cli.sceneFile).toBeNull();
  });

  it('parses both scene file and --screenshot together', () => {
    const cli = parseCli([electron, app, 'hero.json', '--screenshot', 'hero.png']);
    expect(cli.sceneFile).toBe('hero.json');
    expect(cli.screenshot).toBe('hero.png');
  });

  it('parses --screenshot before the scene file', () => {
    const cli = parseCli([electron, app, '--screenshot', 'out.png', 'hero.json']);
    expect(cli.sceneFile).toBe('hero.json');
    expect(cli.screenshot).toBe('out.png');
  });

  it('ignores unrecognized flags', () => {
    const cli = parseCli([electron, app, '--verbose', 'scene.json']);
    expect(cli.sceneFile).toBe('scene.json');
  });

  it('does not treat a non-json/propscene positional as a scene file', () => {
    const cli = parseCli([electron, app, 'README.md']);
    expect(cli.sceneFile).toBeNull();
  });
});
