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

## Additional approved lore expansion

Google Doc updated and read back first; GitHub expansion sourced directly from that approved section. 93 items (92 new canonical entries; EXECUTE ORDER 66 merges as alias), four extended repeat responses. Total 256 canonical entries including 11 programs. Specific Skywalker names override generic; SABACC text and SABACC.EXE distinct; ORDER 65 and EXECUTE ORDER 65 distinct. Accent normalization added. 533 canonical, alias, response and precedence checks and 74/74 progression assertions passed; offline syntax parsed. Phone preview only; browser audition and production release pending.

## DM-controlled objective and phosphor palette checkpoint

Google Doc specification updated and verified first. Implemented owner-only SHOW/HIDE OBJECTIVE using persisted reveal ID; old checkpoints normalize hidden, fulfilled reveals cleared even on force advance; public view carries visibility; no new allowed player actions or database rules. Objective-only receive updates avoid redrawing active playback or terminal output. Seven-group DM panel, exact existing text, both-relay and Director subgoal lifecycle. Bright semibold response hierarchy and existing reminders preserved. 63 targeted source checks plus original 74 progression assertions and new regression test assertions passed in adapted harness; offline syntax parsed. Browser and two-laptop verification pending. Production unchanged.

Regression test wired into npm test; two-client rehearsal now asserts hidden/reveal/hide, two-relay persistence and reload persistence. Native browser/emulator rehearsal not yet executed. Colon-separated diagnostic restrictions classified amber; four tone checks passed.

## Approved recording-index and availability refinement

Google Doc updated and verified first. Added sequential locked recording row, no title or playback until existing gates and correct terminal. Significant positive availability notices bold yellow; original notice wording and crisis priority retained. REC-003 temporary visual PLACEHOLDER; original code and optional board aid preserved. Physical clue required until final media. 86 targeted source checks and 100 existing engine/objective assertions passed; offline syntax parsed. Browser rehearsal assertions updated (not executed); phone preview only, production unchanged.

## Authorization acknowledgment and DM confirmation

Google Doc updated and verified before implementation. Correct code at step 7 validates independently of separate card registration; persisted authVerified flag exposes success to player and enables DM-only confirmation, which confirms physical card and advances existing gate. Wrong/premature codes and player confirmation rejected. Existing unlock notice retained. 116 regression assertions and 50 targeted authorization lifecycle checks passed; offline syntax parsed. Browser rehearsal updated but not run. Production unchanged.

## Version 14 — manual final-crisis blood handprint

Screenplay amended and verified before implementation. Owner-only SHOW/HIDE BLOOD OVERLAY during steps 17–18; shared state persists through checkpoints, refresh and crisis progression, with normal immediate undo and dedicated hide. Player commands rejected while shown; offline operator return remains available. Approved JPEG artwork embedded locally, preserving the original alert and unchanged Firebase rules. 188 adapted source assertions across 8 test groups passed (existing progression/objectives plus targeted final visual and session recovery); source syntax parsed. Actual browser visual rendering, live Firebase and two-laptop rehearsal remain unverified. Production root not changed by this development update.


### Version 15 — local narration voice selection
Adds browser-exposed voice selection and audition, British English first; automatic profiles remain default and facility announcements retain their existing profile. Local persistence; no campaign state or Firebase changes. Voice controls guard playback, announcements, mute and final visual. 25 targeted source-level assertions passed in adapted harness; station script parses. Physical-device voice availability and audible playback require browser rehearsal; no new recorded media or production release.
 Additional mocked speech/DOM integration: 15 assertions passed; original automatic voice candidate ordering preserved. Combined offline script syntax parsed.


### Version 16 — late-game usability and scan presentation
Screenplay updated first. Completed replays and secondary workstations grouped; step-16 final recording DM readiness controls preserve physical prerequisites; Analysis opens directly and player page persists across operator switching. Live/saved scan reports label fields individually; preserve content, engine, matching, and campaign separation. 338 adapted source assertions in 12 groups passed; station syntax parsed. Real browser rendering/rehearsal and production release remain pending.
 Further focused page-preservation and local-view switching tests: 8 checks passed; no repeated screensaver when returning from Operator view. Combined offline script syntax parsed.


### Version 17 — hierarchy, focused M-count instrument and T0DD override
Screenplay amended first. Routine records grouped; meaningful new records and available advancement choices receive distinct visual priority, with local acknowledgments. Dedicated instrument, focused subject selection, labelled reports and three-phase guarded scan animation; T0DD approved replacement assessment. 351 adapted assertions across 13 groups passed; station script parsed. Browser/phone visual and sound verification remains pending. No engine or Firebase rules changes.
 Focused mocked scan sequence and cancellation: 7 checks passed, including timing, fast skip, registry/error cues and stale revision guard. Combined offline script syntax parsed. Acknowledgment is browser-local; actual Firebase callback timing still requires rehearsal.


### Version 18 — Morgan dossier revision
Screenplay amended and read back first. Morgan already knows too much; Varrick and Rane are to eliminate her after successful apprehension of the two surviving clone specimens. Exact approved dossier synchronized with content and creative baseline; Drellis Minor Recovery Operation and all gates unchanged. 356 adapted source assertions in 14 groups passed; includes exact text, MEN-only and station/tape access checks. Browser/Pages serving and production remain unverified.


## Approved V18 follow-up — documentation checkpoint
Both authoritative Google Docs amended and read back. Approved four-station/Armory, replay Stop and Back, five-second retrieval, all-subject scan highlighting, manual crisis and dual-operator calibration requirements are recorded in CREATIVE_BASELINE.md and IMPROVEMENTS.md. Implementation, rules changes if needed, offline rebuild, browser/live testing and preview remain pending. Production unchanged. Maintenance-kit placement, final rival name, insignia art and exact richer archive text remain unresolved; REC-006 reviewed report not reproduced.


### V19 staged implementation
Approved amendment implemented in development source: four terminals, Armory, contextual Back, replay-only Stop, timed mechanical carrier retrieval, Ryan assessment, all-subject scan tracking, manual alarm and independent handprint, two-lock calibration and DM interference toggle/override. Initial adapted engine/model checks: 80 passed. Native browser/emulator and production testing are not yet performed. Repository request allowlist updated for STOP PLAYBACK and CALIBRATE; production Firebase rules are not published by this change. Exact new archive record writing, insignia artwork, rival director name, kit placement and REC-006 defect reproduction remain open.

V19 source verification: 378 adapted assertions across 12 groups passed after test reconciliation (separate from earlier 80 targeted checks; not native Node/Chromium/Firebase results). The standalone HTML was regenerated using the repository build algorithm; combined embedded JavaScript parsed. Offline artifact: blob 35e2580e0db67a6a4f341ac2715450db0dd0f601, 600635 characters. The source request allowlist has changed, so existing production Firebase rules must be reconciled before live use of new actions. Actual rendering, calibration difficulty/keyboard ghosting, audio, synchronization, browser regression and production acceptance remain unverified. Isolated V18 preview and production remain unchanged unless separately authorized.


### V20 approved final five refinements — candidate
Both Google Docs amended and read back first. Four original station emblems, named Dr. Veyra Kest and six exact approved-direction optional MEN archive entries, single Armory maintenance kit, authoritative recording status and per-playback instance guards. Existing recording scripts and Sigma/Morgan/dossiers preserved. Original REC-006 report still requires real reproduction; no claim of root cause. Native browser/live testing pending; production not changed.

V20 source verification: 416 adapted assertions across 15 groups passed; standalone embedded script parsed, offline HTML regenerated (611373 characters, blob ddb7952ee767bd1a453bf9a5be8b64d3a5dde54e). Exact original recordings, existing tapes, Sigma/Morgan records, dossiers and MEN/KIDS scan result data compared to V19 and preserved. New lore is MEN-only, kit replaces old logistics puzzle for both campaigns. Five weaker MEN filler records suppressed, six optional records added, selected administrative humor and existing clues preserved. Original REC-006 symptom not reproduced in actual browser; per-playback identity and authoritative status hardening implemented. Native browser, real audio/keyboard, Firebase integration, and production/preview acceptance remain pending. V19 Firebase allowlist changes not published. No production deployment.


## V21 development candidate — 27 November 2026
Both Google Docs amended first and matching 5,797 characters of retrieved amendment verified. Implemented approved seven changes; relay sequencing unchanged following user rehearsal. 476 adapted source assertions across 21 groups passed; 36 additional mocked DOM/presentation checks passed, including chamber isolation, matching dossier return, actual receive-triggered archive reveal, five-second animation and single discovery cue, protocol/no early power clue, archive power gate, persistent reference/recovery, cross-station replays and final red title. Source test harness strips imports/exports and substitutes JSON clone; mock DOM is not a real browser. Combined standalone script parsed; offline artifact rebuilt (619257 characters). Compared V20 and V21 content: all six other recording scripts, existing tapes, media references, code, MEN/KIDS scan data and six optional records unchanged. Media guide generator checked; matches checked-in guide. Native Node/browser/emulator and physical phone/two-laptop acceptance not performed; container could not resolve GitHub hostname. No new Firebase action/rules or production/preview publication. Existing V20 main/preview left unchanged. Original REC006 premature reviewed incident not independently reproduced.


## V22 development verification — 27 November 2026
Approved changes V22-001 through V22-006. Both authoritative Docs revision-guarded, updated first, matching 8,769-character amendments independently read back. Four staged implementation/documentation commits: 5cdb8dc (CINDER, tape visibility, administrative UI), 8ec8978 (144 new Easter eggs, conduct filter and echo masking), 38673ae (paging and new regression tests), f16d0db (creative/DM/command documentation). Existing 256 eggs retained, 400 total; additional 25 bathroom and 119 computer/keyboard keys. Existing overlapping keys keep prior responses. Administrative records MEN-only to avoid cross-campaign leakage; shared Easter eggs and conduct screening. Viewed tracking is the existing local browser/session/campaign record acknowledgement, not a cross-browser shared store. All seven scripts, code, media, scans, research/Sigma/dossier data, five other tapes and all existing CINDER text verified unchanged; Firebase rules blob unchanged. 862 adapted assertions across 27 test groups passed with zero failures (imports/exports stripped, JSON-clone substitution, local assert adapter; not native Node). Standalone script parsed successfully; offline rebuilt using build-offline.mjs algorithm, 657583 characters, Git blob e4fa2e48989ce2da7eb50f9e68210184a9093114. Cache pershing-duty-v2.22. No native browser/emulator/two-device testing or user acceptance; V21 remains published; no production or Firebase changes. Preview publication separately authorized only. Original REC006 symptom remains unverified.


## Creative audit checkpoint — Reviews 1–3, 27 November 2026
Both authoritative Google Docs contain matching, read-back verified amendments. Approved Kest still (visible suffix 938, unchanged code 471938) is embedded in REC-003 and standalone playback. Generic DM door indicators removed; room selector and dedicated final privacy control retained. Lab interlock prevents early entry and Armory release; after relay 2 the lab entrance unlocks, Armory release becomes available at ISB without additional password, and physical layout is Armory left/scanner center/archive right/Director ahead. Sigma authentication identifies REC-007 as executive-only without its title or subject and provides one-time DM-confirmed arrival prompt; existing DM arrival, cylinder and closure controls remain. Player confirmation is an attestation, not a separate operator authorization transaction. Normal revisits retain confirmation; checkpoint restoration can restore prior state. Adapted JavaScript checks: 474 assertions, 18 test groups, zero failures after synchronizing the Morgan fixture; standalone combined JS syntax parsed and committed offline HTML read back exactly. DM guide and browser test cases updated. No native browser, Firebase or production deployment verification performed. No further audit proposals authorized. Continue the design workshop at Review 4; avoid expanding scope without approval.


## Creative audit checkpoint — Reviews 4–6, 27 November 2026
Both authoritative Google Docs contain identical, read-back verified amendments. Reviews 4–6 implemented on feature/pershing-live-session. DM-only DECK action enforced by engine and network request allowlist; four prominent operator buttons replace the room selector and player confirmation prompts; player commands only provide directions. Physical ENTER LAB does not switch the active terminal; Archive must be selected by DM before POWER ARCHIVE. Important reviewed records and recordings bold green, ordinary administrative records regular green, important records have Previously Viewed Important Records group. Existing special red directives retained. Dashboard has top Return to Player View in local mode, separate player link in live mode, stage and next-action narrative, terminal controls, folded secondary panels and promoted scanner controls. Adapted engine/objective/presentation checks: 512 assertions in 20 test groups, zero failures; combined JS syntax parsed and offline HTML rebuilt and read back exactly. Browser rehearsal updated for DM terminal selection; an additional edit to open folded recovery controls in rehearsal was blocked by the tool, so that test adjustment is outstanding. Native browser, Firebase and deployment checks not performed. No main/production changes. Next design workshop item is Review 7; do not implement other audit proposals without approval.


## Creative audit checkpoint — Review 7, 27 November 2026
Approved MEN character engagement and escape narrative, Sam secret clone identity and provisional emotional outburst, and revised Sigma counts documented in both authoritative Google Docs (identical amendment read back) and DM-GUIDE.md. Source updates: adult ledger 1,000/992/8/0.8%, two with subsequent intelligence records and six without; Sam scan remains UNKNOWN and his identity DM-only. Shared CINDER report includes approved delayed implementation wording; kids ledger unchanged. MEN-only stage-specific DM spotlight reminders added, including arrival, cargo lift, safe, catwalk relay, scanner and escape. No new terminal gates; character sheet, base powers and DCs provisional. 525 adapted source assertions in 22 groups passed; combined JS syntax parsed; standalone offline build read back exactly; cache v2.25. Browser rehearsal expected ledger updated, not executed. Previously outstanding folded recovery test adjustment and live Firebase/browser checks remain pending. Production unchanged.


## Final creative audit checkpoint — Reviews 8–12, 27 November 2026
The two authoritative Google Docs have identical, read-back verified amendments covering Reviews 8–11 and the technical readiness decision in Review 12. Reviews 8 and 11 closed without software changes. Reviews 9 and 10 preserve the approved tabletop-only rules in those documents. The DM-GUIDE.md synchronization attempt was blocked; it remains outstanding. Browser rehearsal recovery-panel interaction updated in commit 9bb19600b25525ee23b4334fda807c23be27aed6; read-back confirmed five calls to open the panel and adapted JavaScript syntax parse passed. Native browser execution and Firebase synchronization remain unverified. No application source, offline build, main branch, or production changes in this checkpoint. Feature development frozen pending regression rehearsal and separate deployment approval.


## Audit documentation synchronization — resolved
DM-GUIDE.md synchronized with the exact approved Reviews 8–12 checkpoint from Master Adventure Design in commit 35eebd928c7db10f8367a9cb6e195668c6aeb05a; exact text read-back verified. The previous blocked guide write is resolved. Feature freeze, browser and Firebase rehearsal requirements, and separate production authorization remain unchanged.


## Mobile rehearsal defect — 27 November 2026
DM reported that opening the M-Count chamber first appeared to mark REC-005 as reviewed. Source inspection confirmed premature chamber navigation at step 8 (Omega authorization); no direct recording completion mutation in chamber navigation was identified. Restrict chamber navigation to steps 12–16, after confirmed laboratory entry; existing repair/scan gates and early diagnostic records retained. Added MEN/KIDS regression coverage for early chamber access and recording flag/stage independence during scanner operations. 1034 adapted assertions in 35 groups passed; standalone JavaScript parsed and offline build regenerated, cache v2.26. Original phone symptom not independently reproduced; phone retest required. No production or Firebase changes authorized.
