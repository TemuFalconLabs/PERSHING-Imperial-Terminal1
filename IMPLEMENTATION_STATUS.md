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
