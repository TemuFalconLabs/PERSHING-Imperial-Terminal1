# PERSHING improvement backlog

## IMP-001 — Cylinder insertion guidance
- Priority: High (gameplay progression)
- Status: Approved / open
- Problem: REC-001 identifies the MEDIA drawer but does not tell players to insert the cylinder into the terminal.
- Solution: Preserve existing recording dialogue. After REC-001 completes, display a player-facing terminal notification:

  AUTHORIZATION CYLINDER: NOT DETECTED

  Insert physical media into the terminal reader to recover additional recordings.

  AWAITING MEDIA INSERTION...

- Acceptance: Players can infer what to retrieve and where to insert it without a DM hint; REC-002 remains gated by DM confirmation of physical insertion.
- Implementation: Pending; verify in mobile preview and live/offline gameplay.

## IMP-002 — Rewrite REC-002 and network diagnostic
- Priority: High
- Status: Approved / open
- Replace opaque reel/splice dialogue with: “Engineering log. The connection between the reception terminal and the facility's main server has been interrupted. Several research recordings are currently inaccessible. I've traced the problem to a disconnected cable beneath the service panel in the server room. Maintenance has been notified, but nobody has responded. Reconnecting the cable should restore access to the research archives.”
- After playback: NETWORK CONNECTION FAILURE / Research archive: OFFLINE / Fault location: Server Room / Awaiting physical reconnection...
- Acceptance: Players understand destination, physical action and expected result without DM hints.

## IMP-003 — Campaign-wide messaging clarity review
- Priority: High
- Status: Approved / open
- User feedback: Writing so far is poor and messaging needs to be much clearer.
- Review every recording, terminal notification, record and progression instruction. Use natural, coherent dialogue and clear actionable objectives. Preserve intentional mysteries and avoid premature spoilers; do not obscure routine maintenance tasks with unnecessary jargon or contrived riddles.
- Acceptance: At every required progression gate, a first-time player can identify the next objective from available clues without DM intervention. Preserve established story and actual puzzles. Review revised dialogue with DM before implementation.

## IMP-004 — Clarify locker release and second cylinder retrieval
- Priority: High
- Status: Approved / open
- Replace ambiguous locker release record with: SECURITY SYSTEM — POWER RESTORED / Location: Research Director's Office / Personal locker: UNLOCKED / Registered contents: Omega authorization cylinder / Retrieve cylinder and insert into reception terminal to access additional research recordings.
- Remove unnecessary brass plate references, including REC-003; retain physical identification only if multiple lockers genuinely require differentiation.
- Acceptance: Players understand that server restoration unlocked the locker, where to find the second cylinder and where to insert it. Reading the notification is not itself a physical action. Keep REC-004 gated by DM confirmation.

## IMP-004 — Clarify locker release and second cylinder retrieval
- Priority: High
- Status: Approved / open
- Replace the ambiguous Locker Release record with: SECURITY SYSTEM — POWER RESTORED / Location: Research Director's Office / Personal locker: UNLOCKED / Registered contents: Omega authorization cylinder. / Retrieve cylinder and insert into reception terminal to access additional research recordings.
- Remove unnecessary brass plate references, including in REC-003 and hints, unless multiple lockers require identification.
- Acceptance: Players understand that restoring server power releases the locker, where to find the cylinder, and what to do with it. Viewing the record is informational, not a separate unlocking action. Preserve DM confirmation of physical retrieval/insertion.

## IMP-005 — Accept bare six-digit authorization code
- Priority: High
- Status: Approved / open
- Accept a six-digit code entered alone in the command field at the authorization gate, without requiring AUTH. Retain existing AUTH syntax and authorization button.
- Provide clear visible success or rejection feedback. Do not bypass progression gates or reveal the correct code on failure.
- Acceptance: Entering 471938 alone at the correct stage unlocks REC-005; incorrect codes receive clear feedback. Verify on mobile.

## IMP-005 — Accept bare six-digit authorization code
- Priority: High
- Status: Approved / open
- Accept six digits alone in the terminal command field as authorization input; retain AUTH <code> compatibility and existing progression gates.
- Show unmistakable success or rejection feedback and identify newly unlocked content on success.
- Acceptance: At the authorization stage, entering 471938 alone unlocks REC-005 exactly as AUTH 471938 does. Incorrect codes receive clear feedback; premature entry does not bypass progression.

## IMP-007 — Rename Scanner diagnostic
- Status: Approved / open
- Rename player-facing “Scanner diagnostic” to “M-count scanner diagnostic”; ensure directory and search references remain consistent.
- Implementation pending. IMP-006 is reserved for the proposed browser popup replacement, not yet approved.

## IMP-008 — Restore approved M-count analysis presentation
- Priority: High
- Status: Open / user-reported defect
- Current output is unlabeled, inconsistent and does not match prior design discussions.
- Recover the exact approved scanner format and character-specific results from authoritative campaign sources and prior design discussions before rewriting. Do not invent replacement values or classifications. Present clearly labeled subject, species, M-count classification and specimen registry match fields, subject to exact approved format. Preserve campaign separation and special cases.
- Acceptance: DM verifies the presentation and results against the original design before release.

### IMP-003 expanded audit scope — design fidelity
- User reports Facility section is unclear and writing diverges from prior discussions. Audit every screen, record, recording, status, scanner result and control against the authoritative master adventure design and prior approved decisions. Identify unsupported inventions and deviations; remove or seek DM approval. Do not substitute another creative rewrite for source verification. Treat exact format and content fidelity as release acceptance requirements.

## IMP-009 — Final recording playback and door closure
- Priority: High / progression blocker
- Status: Open / user-reported defect
- User cannot trigger final recording; suspects inability to close current room doors. Root cause not yet confirmed.
- Verify REC-007 prerequisites, door closure controls, obstruction handling and feedback against approved adventure design. Make any required action clear and achievable; do not silently block playback. Confirm whether the door prerequisite itself is approved before retaining it.
- Acceptance: Complete mobile player progression through final recording and crisis cue; verify clear feedback for unmet prerequisites and no unintended deadlock.

## IMP-010 — Simplify navigation and consolidate M-count controls
- Priority: High
- Status: Open / user-requested
- Preserve generally good underlying mechanics. Focus on writing, progression clarity and interface organization rather than unnecessary mechanical redesign.
- Organize selectable options into meaningful folders/subfolders; reduce screen clutter and redundant controls. Consolidate M-count scanner activation and analysis into one logical workflow/location, retaining necessary DM physical-action controls separately.
- Proposed navigation for DM review: Research Recordings, Facility Systems, Research Archives, M-count Analysis. Use progressive disclosure and mobile-friendly navigation.
- Acceptance: No redundant player-facing scanner entry points; clear navigation and manageable option counts on mobile; all required functions remain accessible.

### IMP-003 expanded progression clarity requirement
- At every required transition, terminal provides an actionable, in-universe clue identifying the next objective and relevant location/action without spoiling genuine puzzles. Clearly distinguish physical DM-confirmed actions from terminal interactions. Explain unmet prerequisites and confirm successful actions. Review all seven recordings and intervening gates against approved design; preserve mechanics unless a specific defect or design deviation warrants change.

### IMP-010 — Folder hierarchy approved
- User approves Research Recordings, Facility Systems (network, doors, ventilation), Research Archives (personnel, project, engineering), M-count Analysis (diagnostic, analyze sample, saved results). Progressive disclosure; consolidate scanner entry points.

## IMP-011 — Persistent current objective and explicit unlock feedback
- Priority: High
- Status: Proposed implementation approach / user-requested clarity
- Home screen shows current objective, completed action, newly available content, and outstanding prerequisite in in-universe language. Update automatically on DM-confirmed physical actions and player actions. Do not reveal future objectives or genuine puzzle solutions.
- Cover REC-001 through REC-007 and all intervening physical actions, authorization, relays, lab entry, archive power, tape retrieval/insertion. Verify exact transitions against approved design, especially final recording security conditions. Review final wording with DM.

## IMP-012 — Remove inserted tapes from archive selection
- Priority: High
- Status: Approved / open
- Once a tape is inserted into the primary terminal, remove its selectable retrieval option from the archive room. Preserve unlocked contents in primary Research Archives. Track available, retrieved and inserted states consistently, including save/recovery/undo/reset. Do not allow duplicate retrieval of an inserted tape.

## Comprehensive source audit — 25 November 2026
Status: findings recorded; implementation pending. Reviewed against the [Master Adventure Design](https://docs.google.com/document/d/1KbwM-9KeqQCPJ4bx4os9UZB3govfSJyqMgB9w7SJRbs/edit), particularly §§3–8 and 12–16, and content.mjs, engine.mjs, station.mjs, session.mjs, guides, tests and the main-branch standalone preview. No fresh browser or production test was performed. Preserve the core two-cylinder, two-relay, physical tape and deliberately selected recording progression; no architectural redesign. Proposed wording and new findings below are not automatically approved for implementation.

### Clarifications to existing improvements
- IMP-001: preserve initial discovery of REC-001 via Media Archive > Research Recordings; no autoplay. After playback clearly identify the cylinder and primary reader. The master initially leaves location discovery to physical clues; reconcile with the later proposed explicit objective wording before finalizing.
- IMP-002: use approved engineering-log replacement; align title, patch ticket, hints, notices and media/prop guides with the disconnected server cable, not reels/splices.
- IMP-003: audit every recording, file, transition and optional discovery for natural writing, purpose and canonical fidelity. Preserve approved jokes and intentional mysteries; avoid invented plot facts. Review ordinary records (staff directory, security abstract, laboratory inventory, traffic receipt, approach docket, archive directions, optical comparison, recovery dispatch, research authority). Verify campaign callbacks and new optical-identification detail against authoritative sources. Preserve Merg's opportunity to narrate, four unresolved survivors, separate MEN/KIDS timelines, no premature Force powers or hazard disclosure.
- IMP-004: server restoration releases Director's office locker; remove brass-front references from source, hints, media directions and physical prop checklist. Use approved locker release notification.
- IMP-005: retain current implemented 471938 and AUTH alias unless DM changes prop digits. Accept bare six digits only at correct gate; no partial correctness hints.
- IMP-006: native browser popup replacement remains proposed, not approved.
- IMP-007/008: master §6 confirms qualitative result matrix. Glitch and Crosseye ELEVATED, confirmed matches; Glitch species unconfirmed in source. Erik Trandoshan NORMAL, no match proposed; T0DD inorganic N/A; Ryan human AVERAGE, no match proposed; Chris Duros ELEVATED explicitly no match; Merg human and Ben Rodian VERY HIGH, registry determination unresolved; Ben fictional BAC 0.67%; Sam all UNKNOWN, red instability warning. Existing MG-1842/MG-6931 are fictional placeholders, not final approved IDs. Preserve kids unknown results. Use labeled fields, green/amber/red classification as appropriate, explicit save/decline, no external transmission. Confirm exact specimen IDs and unresolved matches rather than inventing.
- IMP-009: current-room closure IS an approved prerequisite (master §§3, 8, 15, 16). Keep deliberate PLAY after privacy check. Identify specific local OPEN/OBSTRUCTED doors, confirm closure without locking escape, provide PRIVACY CHECK COMPLETE and confidential playback available feedback, keep unrelated doors irrelevant; verify room mapping and manual fallback. Recheck at playback start. Preserve REC-007 script, no premature biohazard.
- IMP-010: approved folder hierarchy and consolidated scanner controls; preserve the opening Media Archive discovery path, progressive disclosure, Back/Home controls and existing command aliases.
- IMP-011: derive persistent objective from authoritative progression state, not mutable last notice. Display completed action, current objective, prerequisite and newly unlocked content; update after player/DM actions. Replays, optional activities, failures and DM settings cannot erase the objective. No future puzzle answers, locked content or outbreak clues. Opening objective remains general; code fragments remain separate. Final objective points to classified records and current-room privacy without revealing warning contents. Final exact wording requires DM review.
- IMP-012: track tape availability, retrieval/in possession, insertion and durable archived contents. Reject duplicate retrieval and insertion in engine and UI. Save/recovery/undo/reset must preserve lifecycle, including older checkpoints; see IMP-015.

### Proposed new improvements (all open, pending review)
| ID | Priority | Finding / acceptance |
|---|---|---|
| IMP-013 | High | Restore substantive failed-batch researcher recording from master §7. Suggested placement REC-003 with visible last-four blackboard clue; exact placement and wording require DM approval. Keep digits out of normal terminal text. |
| IMP-014 | High | Rewrite REC-004/005/006 transitions: clear prefix/suffix relationship; routine ventilation interlock and two locations; explain physical archive, tape designation at proper stage, return to primary reader. Move irrelevant personal details to optional environmental discoveries if approved. Preserve REC-007 warning. |
| IMP-015 | High | Persist authenticated optional tape contents in Research Archives; no transient-notice-only records. Check all tapes and checkpoint migration. |
| IMP-016 | High | Explicit recording availability/completion and actionable unlock feedback at every gate; replay must not advance progression or replace current objective. |
| IMP-017 | High | Saved M-count results directory and explicit decline-save option; structured classification and registry fields; retain optional Ryan repair and Glitch calibration path. |
| IMP-018 | Medium | Simplify DM dashboard: human-readable physical actions, location, expected unlock and contextual hints. Keep existing recovery and override controls. |
| IMP-019 | Medium | DM-only fast/mute/hold and other settings must not overwrite meaningful player notices/objectives. |
| IMP-020 | Medium | Restore wake/boot sequence and consistent bounded processing/typewriter output; ensure long text legibility, no interruption during playback/crisis. |
| IMP-021 | Medium | Visible HELP and progressively actionable invalid-command guidance without spoilers. |
| IMP-022 | High | Regenerate and synchronize live modules, offline.html and main preview/index.html; preserve preview publication and reconcile divergent branches without overwriting unrelated work. |
| IMP-023 | High | First-time player comprehension rehearsal, not just scripted known-route mechanical success. Check every gate, rejection, mobile/desktop flow, optional paths and spoilers. |
| IMP-024 | Medium | Review digital terminal switching versus physical room movement; preserve DM supervision unless a change is explicitly approved. |
| IMP-025 | High | Synchronize DM guide, prop checklist, MEDIA.md and build-guide.mjs with approved writing and mechanics; no stale reel/splice/brass locker instructions. |

### Implementation and release order
1. Review and approve revised narrative/recordings and objective wording in sequence, grounded in master design.
2. Implement player navigation, objective/feedback, authorization and writing fixes.
3. Repair tape lifecycle, M-count workflow and confidential playback; preserve recovery and campaign separation.
4. Regenerate offline, scripts and mobile preview for DM review; do not mark approved items complete until verified.
5. Run engine regressions, independent player walkthrough, mobile/desktop and two-browser synchronization, checkpoint/undo/reset/recovery; verify actual production Firebase/Pages separately before release. Test ordinary player navigation for spoilers; public client source is not intended to be cheat-proof. Actual audio/video, hardware, room acoustics and prop rehearsal remain outstanding.

Audit limitations: source inspection, not fresh runtime verification; exact room geometry, specimen IDs, unresolved matches and some dialogue are undecided. Existing test scripts prove a known sequence can be executed, not that a new player can discover it. The preview still contains old writing and lacks persistent objectives at time of audit. No application code or deployed preview changed by saving this register.


## 25 November approved walkthrough implementation checkpoint

Core approved recordings, six tape records, distinct stations, per-subject dossier unlocks, Omega card gate and Director's own cylinder/office-door gate implemented on the feature branch. The original proposals above are historical and superseded where inconsistent. Remaining: actual media and portraits, exact map/trap and prop labels, final player comprehension review, browser/emulator and production smoke tests, preview and Pages release. Some interface polish items remain unverified; do not mark all IMP entries complete.
