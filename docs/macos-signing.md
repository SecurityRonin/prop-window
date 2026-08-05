# macOS code signing + notarization

To hand a Mac user a build that **just opens** — no "damaged app" Gatekeeper block, no
`npm run mac:trust` dance — the `.app`/`.dmg` must be **Developer-ID-signed and notarized by
Apple**. This mirrors the fleet's [timeglyph](https://github.com/SecurityRonin/timeglyph) model,
done here by **electron-builder** (which runs `codesign` → `notarytool` → `stapler` for you).

`release.yml` already contains the signing path. It is **gated on the secrets below**
(`HAS_MACOS_SIGNING`), so releases stay green and ship an **unsigned** build until the secrets
exist. The moment all six are set, the next `v[0-9]*` tag signs + notarizes automatically.

> Local dev doesn't need any of this — `npm run mac:trust` ad-hoc signs the local copy so you
> can run it. Signing here is only for **distributable** builds.

## One-time setup

### 1. Apple Developer Program membership ($99/yr)

Enrol / sign in at [developer.apple.com](https://developer.apple.com/programs/) with the Apple ID
**`info@securityronin.com`** — the account that holds this project's membership, Developer ID
certificate, and notary key. An **individual** account is fine for a personal project (org
enrolment needs a D-U-N-S number; only do that if you want the publisher to read as a company).
Note your **Team ID** (10 chars, e.g. `AB12CD34EF`) under Membership.

### 2. Developer ID Application certificate

developer.apple.com → Certificates → **+** → **Developer ID Application** → follow the CSR flow
(Keychain Access → Certificate Assistant → _Request a Certificate from a CA_). Install the issued
cert, then in Keychain Access **export the certificate + its private key as a `.p12`** (set a
strong password).

### 3. Notarization API key (App Store Connect)

[appstoreconnect.apple.com](https://appstoreconnect.apple.com) → Users and Access →
**Integrations → App Store Connect API** → **+** → role **Developer** → download the
**`AuthKey_XXXX.p8`** (downloadable once). Note the **Key ID** and the **Issuer ID** (a UUID).

### 4. Add the six GitHub secrets

Repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret                       | Value                                                      |
| ---------------------------- | ---------------------------------------------------------- |
| `MACOS_CERT_P12_BASE64`      | `base64 -i cert.p12` (the exported `.p12`, base64-encoded) |
| `MACOS_CERT_PASSWORD`        | the `.p12` export password                                 |
| `MACOS_NOTARY_KEY_P8_BASE64` | `base64 -i AuthKey_XXXX.p8`                                |
| `MACOS_NOTARY_KEY_ID`        | the API **Key ID**                                         |
| `MACOS_NOTARY_ISSUER_ID`     | the API **Issuer ID** (UUID)                               |
| `MACOS_TEAM_ID`              | your 10-char **Team ID**                                   |

```sh
# base64 helpers (macOS)
base64 -i cert.p12 | pbcopy            # → MACOS_CERT_P12_BASE64
base64 -i AuthKey_XXXX.p8 | pbcopy     # → MACOS_NOTARY_KEY_P8_BASE64
```

## What the CI does (macOS leg, per release)

1. `electron-builder` builds `prop-window.app`, signs it with the **Developer ID Application**
   cert (hardened runtime + `build/entitlements.mac.plist`).
2. Submits it to Apple with `notarytool` (App Store Connect API key) and **waits** (~1–5 min).
3. **Staples** the notarization ticket so Gatekeeper passes even offline.
4. Publishes the signed `.dmg` + `.zip` to the GitHub Release.

## Distribution (Homebrew Cask)

Once notarized, ship it as a Cask so `brew install --cask h4x0r/tap/prop-window` drops the app
straight into `/Applications` with a working icon. Create a `h4x0r/homebrew-tap` repo with a
`Casks/prop-window.rb` pointing at the release `.dmg` + its SHA256. (An unsigned cask is
Gatekeeper-blocked — hence signing is the prerequisite above.)
