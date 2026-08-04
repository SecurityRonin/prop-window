// Electron main process — the Humble Object. It wires a real Chromium BrowserView
// (the content) beneath a chrome we draw ourselves (the toolbar), and carries no
// decisions of its own: all logic lives in ../src/* and is unit-tested there.
//
// See README for the environment-variable configuration.

import { app, BrowserWindow, BrowserView, ipcMain } from 'electron';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { parseConfig } from '../src/config.js';
import { parseScene } from '../src/scene.js';
import { parseCli } from '../src/cli.js';

const here = dirname(fileURLToPath(import.meta.url));
const TOOLBAR_H = 84; // tab strip (40) + toolbar (44); must match toolbar.html

const cli = parseCli(process.argv);

let scene = {};
if (cli.sceneFile) {
  const raw = JSON.parse(readFileSync(resolve(cli.sceneFile), 'utf-8'));
  scene = parseScene(raw);
}

const cfg = parseConfig(
  process.env,
  { load: pathToFileURL(join(here, 'welcome.html')).href },
  scene,
);

// CLI flags win over env/scene: --url swaps the loaded page, --borderless drops
// our own chrome so the page can draw its own frame (e.g. the Kali window mockup).
if (cli.url) cfg.load = cli.url;
if (cli.borderless) cfg.borderless = true;

let win;
let view;

// Capture the visible window to PNG once the content has settled, then quit —
// shared by the framed and borderless paths (--screenshot).
async function captureThenQuit() {
  // Brief delay lets the page render (fonts, images, layout).
  await new Promise((r) => setTimeout(r, 1500));
  const image = await win.webContents.capturePage();
  const { writeFileSync } = await import('node:fs');
  writeFileSync(resolve(cli.screenshot), image.toPNG());
  app.quit();
}

function layout() {
  if (!win || !view) return;
  const [w, h] = win.getContentSize();
  view.setBounds({ x: 0, y: TOOLBAR_H, width: w, height: Math.max(0, h - TOOLBAR_H) });
}

app.whenReady().then(() => {
  if (cfg.borderless) {
    // No chrome of our own: the loaded page supplies its own frame. One frameless
    // window, content loaded straight into it — no toolbar, no BrowserView, no
    // preload injected into the page.
    win = new BrowserWindow({
      width: cfg.width,
      height: cfg.height,
      frame: false,
      fullscreen: cfg.fullscreen,
      kiosk: cfg.kiosk,
      backgroundColor: '#000',
      webPreferences: { contextIsolation: true, nodeIntegration: false },
    });
    win.loadURL(cfg.load);
    if (cli.screenshot) win.webContents.on('did-finish-load', captureThenQuit);
    return;
  }

  win = new BrowserWindow({
    width: cfg.width,
    height: cfg.height,
    frame: false, // we draw our own Chrome-style chrome
    fullscreen: cfg.fullscreen,
    kiosk: cfg.kiosk,
    backgroundColor: '#dee1e6',
    webPreferences: {
      preload: join(here, 'preload.mjs'),
      contextIsolation: true,
      sandbox: false, // required for an ESM preload
      nodeIntegration: false,
    },
  });
  win.loadFile(join(here, 'toolbar.html'));

  // Real top-level browser view for the page content (no iframe restrictions).
  view = new BrowserView({ webPreferences: { contextIsolation: true } });
  win.setBrowserView(view);
  layout();
  view.webContents.loadURL(cfg.load);

  win.on('resize', layout);
  win.on('enter-full-screen', layout);
  win.on('leave-full-screen', layout);

  win.webContents.on('did-finish-load', () => win.webContents.send('config', cfg));

  if (cli.screenshot) view.webContents.on('did-finish-load', captureThenQuit);

  const pushNavState = () => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('navstate', {
        canBack: view.webContents.canGoBack(),
        canForward: view.webContents.canGoForward(),
      });
    }
  };
  view.webContents.on('did-navigate', pushNavState);
  view.webContents.on('did-navigate-in-page', pushNavState);
});

// Address bar / nav buttons drive the REAL content view.
ipcMain.on('nav', (_e, action, arg) => {
  if (!view) return;
  const wc = view.webContents;
  if (action === 'back' && wc.canGoBack()) wc.goBack();
  else if (action === 'forward' && wc.canGoForward()) wc.goForward();
  else if (action === 'reload') wc.reload();
  else if (action === 'go' && arg) wc.loadURL(arg);
});

// Fake window controls.
ipcMain.on('win', (_e, action) => {
  if (!win) return;
  if (action === 'close') win.close();
  else if (action === 'min') win.minimize();
  else if (action === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
});

app.on('window-all-closed', () => app.quit());
