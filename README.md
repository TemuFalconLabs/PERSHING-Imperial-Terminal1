# Project PERSHING · Imperial Science Division

GitHub Pages serves the application directly from the repository. Open the root for the player and append `?dm` for the operator. Live play uses Firebase anonymous identities and Realtime Database. Keep the Spark plan.

**Run the adventure:** [DM quick start and prop checklist](DM-GUIDE.md) · [script book and media guide](MEDIA.md) · [narrative integration](NARRATIVE.md) · [verification and recovery](IMPLEMENTATION_STATUS.md). Download [offline.html](offline.html) for a standalone one-computer station that accepts exported checkpoints.

### Production database

Project `pershing-imperial-terminal`. Open Firebase Console → Realtime Database → Rules. For a dedicated database with only locked defaults, publish [database.rules.json](database.rules.json). For a shared database, integrate only the `pershingV1` child under the existing rules object. Inspect inherited root grants; public root grants also apply to children. Preserve unrelated applications.

### Verify a checkout

With Node 22+ and Java 21, run `npm install`, `npx playwright install chromium`, `npm test` and `npm run test:rehearsal`. Two real browser contexts use separate storage and anonymous identities. The rehearsal writes to emulators. Set CHROMIUM_PATH for a locally installed Chromium. SDK_FIXTURES may point to unmodified firebase-app.js, firebase-auth.js and firebase-database.js from the version pinned in sdk.mjs for offline testing. Run `npm run guides` after changing content or UI to regenerate the single-file station and scripts.

The prior cartridge-based station is preserved at legacy.html. See IMPLEMENTATION_STATUS.md for release and recovery information.

**Current candidate:** use a fresh version 2 session. The updated terminal route is on the feature branch; do not assume Pages production has been updated before release verification.

## V21 development candidate
REC001–006 universal access after gates, REC007 local Director only. Scanning chamber inside the cloning room with single DM repair confirmation and isolated scan workflow. Classified on-site archive discovery after REC006. V20 preview remains separate; V21 not deployed.
