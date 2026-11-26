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

## Approved final-alert amendment — 25 November 2026

Exact revised containment directive implemented in engine and regenerated offline station, with browser/engine expectations and creative baseline, media generator/guide and DM guide synchronized. REC-007 spoken dialogue and all archive content unchanged; escape remains available and crisis stays DM-controlled. Voice performance is a future media task. Adapted JS harness passed MEN 40/40 and KIDS 34/34; no native browser or live Firebase tests run. Production unchanged.

## Final development usability checkpoint — 25 November 2026

The approved screensaver uses a redrawn six-spoke Imperial cog (reference: https://www.starwars.com/news/5-symbols-in-the-star-wars-universe and https://commons.wikimedia.org/wiki/File:Emblem_of_the_First_Galactic_Empire.svg). Idle threshold 60 seconds, sampled every 250ms when active; wake is local UI-only and never resets state. Playback, processing, operator view and crisis excluded. Fixed visible HELP and return routes from early Director/dark archive; ordinary unlocked stations can return to reception. No changes to dialogue, dossiers, approved final alert, session version, Firebase rules or puzzle gates. Source review covered opening, REC-001–007, relays, archive, scanner, final directive and recovery controls. MEN 40/40 and KIDS 34/34 in adapted JS harness; nine idle guard checks and two campaign early-room return/locked retrieval checks passed. Offline assembly syntax parsed. Actual logo/browser rendering, timed idle/wake browser test, first-time player and live Firebase two-browser rehearsal remain unverified; browser tests added but not run. Main and mobile preview unchanged. Ready for staged release rehearsal, not production merge. Preserve fresh v2 session and existing release gate.

## Phone rehearsal audio amendment — 25 November 2026

Added 16 original synthesized UI cues with distinct tap/key, authorization, unlock, scan, relay, archive, playback and emergency sounds. Local and operator mute respected; playback/crisis mute available; no external audio dependencies. Reduced-motion setting remains a visual setting; use sound mute for audio. Preserved final silence, all creative text, game gates and session state. Offline rebuilt. Adapted engine tests 74/74 and 17 audio-routing cases passed; waveform parameters and assembled syntax checked. Actual speaker output/mobile autoplay and native browser/live Firebase tests remain pending. Main game root is not authorized for release; only standalone preview is to be refreshed.

## Browser narration phone-preview checkpoint — 25 November 2026

Added free device speech for REC-001–007 and separate containment alert; British voices preferred, eight rate/pitch profiles, exact approved spoken paragraphs, automatic paragraph progression after speech completion, native pause/resume, replay and text-only fallback. Earlier safety phrase uses the same automated voice profile. Existing media path precedence, all 16 effects, 60-second idle overlay, final silence and engine/creative content preserved. Fast mode bypasses narration. Adapted progression harness 74/74 and six voice-selection checks passed; offline syntax parsed. Device speech callbacks, actual accent, timing, pause/resume and quality require phone rehearsal. No new paid audio or bundled sound files; phone preview only, production root and Firebase unchanged.

## Phone audio output repair checkpoint — 25 November 2026

User reported device narration audible but terminal effects absent. Code review found very low keystroke gain and duration, no hum, silent touch activation failure and no diagnostics. Implemented direct click activation, louder bounded cue gain, audible keystroke timing, generated PCM WAV/HTMLAudio fallback, subtle awake-only Web Audio hum, processing cue, visible sound test and status, and operator/local mute feedback. Neither phone-specific root cause nor audibility independently established. Validated 17 WAV headers, lengths, nonzero bounded PCM peaks and offline syntax; adapted progression suite 74/74 passed. No browser/phone audio audition or live Firebase tests. Narration, creative text, state and gates unchanged. Refresh isolated preview only.

## Phone audition — soft keystrokes

DM confirmed sound test audible on phone; requested softer typing sound after a squeaky key cue. Replaced square-wave sweep with short low-level triangle/sine click; PCM verification confirmed reduced peak and energy and identical output for every other cue. Adapted progression suite 74/74; offline syntax parsed. Actual softer cue awaits phone audition. Button-driven automatic command typing discussed as a proposal only; no gate/UI flow change. Refresh isolated preview, not production.

## Approved hybrid command UI checkpoint — 25 November 2026

Implemented player shortcut DOS-style command echo with quiet per-step keystrokes and approximately one second maximum scheduled typing delay, skipping animation in Fast/reduced-motion modes. Existing gated action executes once; duplicate input blocked, revision/deck/session change cancels stale typing. Manual AUTH and SEARCH input preserved (prefill only); secret six-digit echo masked. Added matching manual reception, scan save/discard and tape-insert navigation behavior. Playback/audio/operator controls remain immediate. Offline regenerated; source harness checked command echo, duplicate rejection, stale revision cancellation, draft restoration, masking, instant mode; 74/74 progression assertions passed. Native browser test assertions added but not run. Phone preview only; main root and Firebase remain unchanged.

## Approved freestyle library checkpoint — 25 November 2026

Implemented 153 response entries, 11 self-contained interactive programs, 20 rotating unknown responses and six milestones. Previously underspecified examples and executable branches completed as creative additions. Flexible keyword/spacing/punctuation and bounded typo recognition; exact progression commands and accessible searches prioritized. ORDER 66 wins embedded lore conflicts. DM catalog generated from implementation. All 164 canonical and 30 variation checks, repeated GONK and unknown milestones passed; command-routing mock checks and adapted progression suite 74/74 passed; offline syntax parsed. Browser rehearsal pending; phone preview only, production root/Firebase unchanged.
