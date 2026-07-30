# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial prop browser: real Chromium (Electron) with a self-drawn Chrome chrome whose address
  bar is decoupled from the loaded page.
- Pure `src/` logic (URL parsing, favicon detection, config, Enter-key semantics) under 100%
  test coverage.
- Environment-variable configuration (`LOAD_URL`, `DISPLAY_URL`, `TITLE`, `FAVICON`, `SECURE`,
  `FULLSCREEN`, `KIOSK`, `WIDTH`, `HEIGHT`).
