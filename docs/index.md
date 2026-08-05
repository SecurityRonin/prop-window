# prop-window

**A film prop window: put any URL on camera, no matter where the page comes from.**

prop-window is a small [Electron](https://www.electronjs.org/) app — real Chromium — with a
Chrome-style toolbar drawn in HTML. The address bar shows whatever you set, decoupled from the
page actually loaded, so a shot can read `https://www.yourfilm.example` with a padlock while the
content is served from a local mock or a live site.

## Quick start

```bash
git clone https://github.com/h4x0r/prop-window
cd prop-window && npm install

DISPLAY_URL="https://www.peanutforum.com/thread/48213" \
LOAD_URL="http://localhost:8234/forum.html" \
FULLSCREEN=1 npm start
```

## Configuration

Everything is set by environment variables — see the [README](https://github.com/h4x0r/prop-window#configure-per-shot-environment-variables)
for the full table (`LOAD_URL`, `DISPLAY_URL`, `TITLE`, `FAVICON`, `SECURE`, `FULLSCREEN`,
`KIOSK`, `WIDTH`, `HEIGHT`).

## How it works

The page content is a real top-level Chromium `BrowserView` (not an `<iframe>`), so it loads any
site with no `X-Frame-Options` limits. The toolbar is a separate render layer whose address bar
is a widget under our control — that decoupling is the one thing a real browser, and every
browser extension, forbids.

## What this is — and isn't

A stage prop: a picture of a browser, for a camera. It performs no network deception; the address
bar is drawn, not forged on the wire.
