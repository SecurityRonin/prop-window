# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Deferred

- **Windows Authenticode** signing — release `.exe` is currently unsigned.
- **Homebrew Cask** auto-publish to a personal tap (recipe documented; tap repo pending).

## [0.2.0] - 2026-08-04

### Added

- **Borderless mode** (`--borderless` / `BORDERLESS=1`): drops our own chrome and loads the page
  full-window so it can draw its own frame — e.g. the Kali window mockup's native-looking border,
  with no second border to give the prop away.
- `--url` and `--screenshot` CLI flags (override the loaded page; render-capture-quit).
- Scene files (JSON / `.propscene`) for per-shot config, parsed by `parseScene`; scene fields
  override injected defaults, environment variables still win over scene fields.

### Changed

- **Renamed `prop-browser` → `prop-window`** to reflect that the tool now frames any prop window
  (framed browser _or_ borderless), not just a fake browser.

## [0.1.0] - 2026-08-02

### Added

- Initial prop browser: real Chromium (Electron) with a self-drawn Chrome chrome whose address
  bar is decoupled from the loaded page.
- Pure `src/` logic (URL parsing, favicon detection, config, Enter-key semantics) under 100%
  test coverage.
- Environment-variable configuration (`LOAD_URL`, `DISPLAY_URL`, `TITLE`, `FAVICON`, `SECURE`,
  `FULLSCREEN`, `KIOSK`, `WIDTH`, `HEIGHT`).
- CI (lint + format + 100% coverage gate), MkDocs → Pages, and a tag-driven multi-OS release
  workflow (electron-builder).
- **macOS signing + notarization** wired (electron-builder, Developer-ID + App Store Connect
  API notarization + staple), gated on the `MACOS_*` secrets — ships unsigned until they exist.
  See `docs/macos-signing.md`.
