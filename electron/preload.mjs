// Preload bridge. Exposes the SAME unit-tested pure helpers (../src/*) to the
// renderer, so the shipped address-bar logic is exactly what the tests cover —
// no duplicated, untested copy in the HTML.

import { contextBridge, ipcRenderer } from 'electron';
import { splitScheme, isImageFavicon, escapeHtml, normalizeUrl } from '../src/url.js';
import { classifyEnter } from '../src/keymap.js';

contextBridge.exposeInMainWorld('propURL', {
  splitScheme,
  isImageFavicon,
  escapeHtml,
  normalizeUrl,
  classifyEnter,
});

contextBridge.exposeInMainWorld('prop', {
  onConfig: (cb) => ipcRenderer.on('config', (_e, c) => cb(c)),
  onNavState: (cb) => ipcRenderer.on('navstate', (_e, s) => cb(s)),
  nav: (action, arg) => ipcRenderer.send('nav', action, arg),
  win: (action) => ipcRenderer.send('win', action),
});
