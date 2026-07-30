// Electron main process — the Humble Object. It wires a real Chromium BrowserView
// (the content) beneath a chrome we draw ourselves (the toolbar), and carries no
// decisions of its own: all logic lives in ../src/* and is unit-tested there.
//
// See README for the environment-variable configuration.

import { app, BrowserWindow, BrowserView, ipcMain } from 'electron';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { parseConfig } from '../src/config.js';

const here = dirname(fileURLToPath(import.meta.url));
const TOOLBAR_H = 84; // tab strip (40) + toolbar (44); must match toolbar.html

const cfg = parseConfig(process.env, {
  load: pathToFileURL(join(here, 'welcome.html')).href,
});

let win;
let view;

function layout() {
  if (!win || !view) return;
  const [w, h] = win.getContentSize();
  view.setBounds({ x: 0, y: TOOLBAR_H, width: w, height: Math.max(0, h - TOOLBAR_H) });
}

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: cfg.width,
    height: cfg.height,
    frame: false, // we draw our own Chrome-style chrome
    fullscreen: cfg.fullscreen,
    kiosk: cfg.kiosk,
    backgroundColor: '#dee1e6',
    webPreferences: {
      preload: join(here, 'preload.js'),
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
