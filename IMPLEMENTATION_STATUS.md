# Current release gate — 25 November 2026

Candidate branch `feature/pershing-live-session`, PR #1. Revised application core commit 1873f496be208ac9b2bc00889520d4effa500691. The follow-up synchronizes test cases, guide, checkpoint version and UI. Do not merge until live browser rehearsal and production smoke pass.

Verified in a JS harness: full MEN and KIDS route; wrong/early codes; card recovery; two relays; independent per-specimen scans; optional ORDER 66 persistence and duplicate rejection; incorrect reader rejection; Sigma disclosure; Director's cylinder and closed/obstructed door gate; other doors ignored; single crisis. Syntax parsed for combined offline modules. The Node tests and Chromium rehearsal have been updated but not executed in their actual runtimes in this session. Firebase rules unchanged; no new production verification. Actual portraits and AV assets, physical map geometry, trap mechanics and prop labels remain pending. Use a fresh version 2 session; version 1 checkpoints are not compatible. Declining to save a scan does not remove access to the pre-existing matched dossier (implementation decision pending DM review).

## Previous verification (historical only; does not establish current release readiness)

# December 11 station release

Branch: feature/pershing-live-session. Previous Pages release: 8eaf2b6cc5209fa64ab308a4ee47d70aa4603ce7.

Baseline: main contains README and one inline HTML station requiring a local cartridge. No tests, rules or build workflow. Existing Pages address responded. Preserve legacy file at legacy.html in the candidate. Reviewed master sections 1–16, all five Chronicle tabs, existing recap extracts and prior DM kit. Kids scanner outcomes remain undecided.

Content milestone: complete gated terminal, DM dashboard, rules, two campaign paths, scripts and public DM materials. Prior station retained in legacy.html. Staged source and single-file offline build are available on this branch.

## Verification, 25 November 2026

Tested implementation commit: 2e845b446fb0a874342b559dafc021b0aa23084a. Remote file hashes matched the tested checkout. [Release PR #1](https://github.com/TemuFalconLabs/PERSHING-Imperial-Terminal1/pull/1).

|Environment|Result|
|---|---|
|Node progression suite|Passed MEN and KIDS from fresh state to crisis, including early/wrong credentials, both relays, optional scanner path, decoy, receipt, current-room privacy and duplicate crisis rejection.|
|Firebase Auth and RTDB emulators|Passed 3-identity authorization checks for host, member and outsider: private state, cross-session isolation, seat ownership, request validation, protected mutations and duplicate pending requests.|
|Real Chromium, two independent storage contexts, actual emulator service connections|Three full UI playthroughs passed: MEN clean path; MEN optional scanner + equipment + decoy; KIDS clean path and correct isolated ledger. Each went from waking the station to cueing the reanimations.|
|Recovery|Passed player refresh, host refresh, simulated disconnection/reconnection with a DM action during the interruption, local continuation, automatic before-final restore, reset, undo, checkpoint export and import into a fresh local-file station.|
|Presentation|Paused the visual board in REC-003, verified the suffix and resumed; replay controls available. Tested muted, reduced-motion player at 390px width. Source includes no audio or video binaries. Actual performance files remain the DM’s future production work.|
|Production|The current Pages root returned the exact original HTML. Anonymous sign-in to the specified Firebase project returned 200. A conditional write to a new disposable session returned 401 Permission denied. No test session was created. Anonymous test identity deletion returned 200. No authenticated Firebase CLI administrator was available.|

## Resume at the production rules gate

1. Project owner: open Realtime Database → Rules for pershing-imperial-terminal and its default RTDB. With locked defaults only, publish database.rules.json. If other applications share this database, merge only pershingV1 into the existing rules and preserve other paths. No billing or hosting changes required.
2. Using the tested feature branch and production configuration, create a disposable DM session, join via an independent player browser, verify owner-only physical controls, membership restrictions, player playback and synchronized state. Recheck credentials and scoped rules if production rejects the session. Keep the existing production release while the gate is blocked.
3. Merge PR #1 after production authorization and the staged live smoke pass. Confirm Pages serves that commit and both root and ?dm entry points, all modules, refresh and a two-browser action work under the actual repository-relative Pages URL. Record the release SHA and results here. Remove only disposable test data.
4. Use DM-GUIDE.md for the actual two-laptop rehearsal, sound level, board legibility, prop handoffs and crisis timing. The available environment verified independent browser identities; hardware, room acoustics and physical props remain table checks.


## Latest creative protection checkpoint — 25 November 2026

The current development candidate adds [CREATIVE_BASELINE.md](CREATIVE_BASELINE.md), restores the full approved relay messages and final biohazard display, restores the purple DM reminder at crisis-ready step 17, and synchronizes REC-007 performance directions and the media guide generator. Existing dialogue/record source remains byte-for-byte unchanged. All 30 recording paragraphs and 191 nonblank archive/dossier lines match the walkthrough after normalization. Adapted JS harness passed MEN: 40, KIDS: 34 assertions. Offline assembly syntax parsed; media generator output exactly matches MEDIA.md. Browser rehearsal assertions added but not run. No new native Node, emulator, Firebase or production verification. Main and preview remain unchanged. Historical release claims above are not current readiness evidence. Fresh v2 session still required. Open decisions are recorded in the creative baseline. Next: first-time player comprehension rehearsal and actual two-browser synchronization; no creative rewrite or production release until authorized/verified.
