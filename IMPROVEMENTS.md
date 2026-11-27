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


## Creative baseline reconciliation — 25 November 2026

This section supersedes historical proposals only where the approved walkthrough does so. Preserve the original entries for history. See [CREATIVE_BASELINE.md](CREATIVE_BASELINE.md) and [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md). Status is source/harness evidence, not production acceptance.

| ID | Current disposition |
|---|---|
| IMP-001 | Implemented approved handover and security desk insertion objective. |
| IMP-002 | Implemented engineering report and cable restoration; review exact transition display during rehearsal. |
| IMP-003 | Major creative writing matched to walkthrough; first-time player clarity and ordinary-record audit remain open. |
| IMP-004 | Earlier Director locker design superseded by deceased ISB officer's cylinder and trapped safe; separate final Director's office. |
| IMP-005 | Bare six-digit code and AUTH alias implemented; physical card prerequisite. |
| IMP-006 | Popup replacement remains proposed/unapproved; no change. |
| IMP-007 | Scanner naming and diagnostic review remains open pending presentation rehearsal. |
| IMP-008 | Qualitative adult results present; full structured presentation and provisional fields need DM review; KIDS unknown. |
| IMP-009 | Director-only cylinder/door gate implemented; full final alert and DM reminder restored; browser verification pending. |
| IMP-010 | Folder navigation and scanner controls present; review first-time player use. |
| IMP-011 | Persistent objectives implemented; exact transition wording and UX rehearsal pending. |
| IMP-012 | Tape lifecycle implemented and duplicate rejection tested in JS harness. |
| IMP-013 | REC-003 approved writing and visual-only clue present; actual media/board legibility pending. |
| IMP-014 | REC-004–006 and revised physical route implemented; full relay notices restored. |
| IMP-015 | ISB-only durable tape records implemented; live recovery test pending; v1 migration superseded by fresh v2 session requirement. |
| IMP-016 | Recording gates and notices present; browser clarity/replay review pending. |
| IMP-017 | Scan/save and independently matched dossiers present; decline persistence decision and full UI review pending. |
| IMP-018 | DM controls present; practical rehearsal pending. |
| IMP-019 | Settings can still overwrite the mutable last notice; persistent objective and final alert remain; review as separate UX issue. |
| IMP-020 | Wake/processing present; real browser and visual review pending. |
| IMP-021 | Help/command feedback present; first-time player spoiler and comprehension review pending. |
| IMP-022 | Offline rebuilt; main/mobile preview and Pages intentionally unchanged until release gate. |
| IMP-023 | First-time player and actual two-browser rehearsal outstanding. |
| IMP-024 | Physical station supervision vs player digital switching remains review item; no architecture change authorized. |
| IMP-025 | Media guide and generator synchronized; actual map, props, media and final DM kit pending. |

## Approved alert wording amendment — 25 November 2026

IMP-009/025: supersede the old final-alert wording with the approved containment directive in CREATIVE_BASELINE.md. Preserve all recording dialogue, three-second silence, DM cue and escape choices. Engine/offline and media/DM guide synchronized; automated voice and actual browser rehearsal remain pending.

## Final development usability pass — 25 November 2026

IMP-020: redraw six-spoke Imperial cog with segmented geometry, 60-second non-destructive idle overlay, suppress overlay on playback and crisis, count pointer movement while awake. IMP-010/021/023/024: visible HELP from ordinary home, return from dark archive and early Director station, return to reception for replay. No new puzzle or changes to approved writing, prerequisites or final alarm. Source-based first-time walkthrough completed; actual first-time human/browser and live two-laptop rehearsal remain pending. Added browser test coverage for idle/wake and early-room navigation; unexecuted. Offline regenerated; cache namespace advanced. No production changes.

## Phone rehearsal audio amendment

Original synthesized terminal feedback added at DM request; distinct non-looping sounds, volume envelopes and mute controls, including final containment klaxon after approved silence. No narrative, progression, rules or recording dialogue changes. Actual phone audio audition pending.

## Browser narration trial

Free Web Speech device voices for all seven recordings, text fallback, individual delivery profiles and separate alert narration; no modifications to exact scripts or gate engine. Preview only; phone audition pending.

## Phone sound repair

Raised terminal cue audibility, added awake-only hum and explicit sound check, moved activation to mobile click, added generated WAV fallback and visible diagnostics. Actual phone sound output remains user test; no narrative or progression changes.

Phone sound test passed per DM. Softened input keystroke only. Proposed DOS command echo on player buttons remains pending design approval; no implementation yet.

Approved hybrid command UX supersedes pending proposal: automatic command echo and soft keystroke feedback on ordinary player shortcuts; manual code/query entry remains deliberate. Existing gate engine and narrative unchanged. Phone rehearsal pending.

Approved freestyle library implemented; see TERMINAL-COMMANDS.md. No gate engine or creative baseline edits.

Expanded approved standalone lore across Skywalker saga, sequel-era database jokes, syndicates, Clone Wars, Rogue One/Andor and galactic culture. Google Doc updated first; no gate changes.

Approved DM-only objective reveal and phosphor response palette implemented. Existing objective wording and progression gates retained; no automatic next objective. Preview verification pending.

Approved REC-003 placeholder, red locked next recording and yellow availability notifications implemented without gate changes. Physical blackboard clue remains necessary until final visual.

Approved code validation acknowledgment and dedicated DM confirmation for authorization gate implemented. No change to code or other gates.


## V18 future refinements — 26 November 2026

Backlog only. User requested recording these ideas without implementing or amending approved creative canon. Both remain pending design review and explicit implementation approval.

### IMP-026 — Distinct workstation visual identities
- Status: Proposed / deferred; not implemented.
- Give the Reception terminal, Imperial Security Bureau (ISB) officer's terminal and Research Director's terminal subtly different persistent visual identities, such as a prominent but restrained corner watermark, insignia or background treatment. The active workstation should be immediately recognizable without the decoration dominating the screen or competing with text, objectives, records, recordings, M-count analysis or crisis effects.
- Candidate treatments for later review: general Imperial facility emblem for Reception; ISB insignia for the officer; specialized Imperial research division insignia for the Director. These are suggestions, not approved artwork. Determine treatment of other existing stations, including the lab workstation, during design review.
- Acceptance proposal: identity follows the actual active workstation, remains legible on phone and laptop, and does not suggest access to a locked station or change any navigation, physical confirmation, security gate or recording behavior. Preserve existing status colors and full-screen crisis overlay. Review visuals with DM before implementation.

### IMP-027 — Rival Imperial research director and facility identity
- Status: Proposed narrative refinement / deferred; not implemented or canonized.
- User wants this lab to be associated with a frightening female Imperial research director of comparable stature to Dr. Penn Pershing, rather than duplicating Pershing's own work directly. Explore her as a rival research leader competing with Pershing for Moff Gideon's favor, sponsorship or career advancement. Exact patronage, rank, relationship to Gideon and nature of the rivalry remain undecided; do not establish them as facts yet.
- Proposed name for DM review: Dr. Veyra Kest (not approved; alternative names may be considered). She is intended to be the already-established deceased female Research Director found headless in her office, not an additional corpse or new character encounter.
- Preserve the approved Director's office, readily recovered cylinder, closed-door REC-007 gate, existing clone research mysteries, Morgan record, and exact recording scripts until any affected creative amendments are explicitly approved. Review facility/project naming and the extent of Pershing references separately; no automatic rename of Project PERSHING, repository or campaign. Do not prematurely disclose Gideon's role to players.
- If approved later, inspect affected canonical documents and source references, propose precise changes, update and verify the applicable Google Doc first, then make targeted implementation changes and test. No production release without separate approval.


## V18 phone-rehearsal refinement requests — 26 November 2026

Backlog only, no implementation or canon amendment. Source inspection: current master adventure, screenplay, engine.mjs, station.mjs, station-presentation.mjs and content.mjs. Actual phone symptom not reproduced. Existing V18 requirements remain authoritative until explicitly amended.

### IMP-028 — Contextual doors and equipment-room release
- Proposed: remove early player-facing Doors clutter; move optional Security Equipment Room release to authorized ISB officer's terminal (not Research Director). Preserve DM door controls and final Director office physical-closure confirmation. Review typed DOORS/UNLOCK/HELP accessibility alongside buttons; current engine permits equipment release from step 8 without a station check. Current Home shows Doors unconditionally. Exact early ISB access and supply placement pending review.
- Existing optional reward: security equipment room, separate from scanner components in technical stores; suggested masks, power cells/ammunition, vibroknife, medkit, lamp and shield, quantities/stats undecided. No main-route gate.

### IMP-029 — Stop previously completed media and return to parent folder
- User requests Stop recording once a media file has been completed at least once, so accidental replay can end immediately. Preserve first-time full-play gate; stopping a replay must not issue FINISH, advance, overwrite important notices, or retrigger alarm. Cancel audio/video/TTS and pending callbacks; return to correct originating folder. Current playback has Pause, Replay from start and Text only, no Stop.
- Add contextual Go back to record detail, recording and folder navigation, preserving prior directory/search where applicable; not merely Home. Confirm replay behavior after station changes, reconnect, and local Operator/Player toggling.

### IMP-030 — Richer archive lore
- User wants more substantive archival records and backstory, not more filler. Review existing optional tapes and records, propose stronger in-universe content that rewards investigation. Preserve exact approved Sigma/Morgan/individual dossier material unless separately amended; do not invent resolution of mysteries or expose Gideon early. Avoid adding clutter or required gates. Draft for approval later.

### IMP-031 — Resolve four-terminal physical layout and optional calibration
- User recalls Reception, ISB, Archive and Research Director only; proposes merging laboratory workstation with ISB terminal. Current approved master/screenplay explicitly include a fifth distinct Lab workstation, REC-006 there after physical lab entry, scanner available at Lab, ISB decryption after retrieval. Current code returns to Lab from Archive and other stations and gates ISB selection until step 14; Director room can be DM-selected from step 12 even though REC-007 requires step 16/Sigma/cylinder/door. Not a nonexistent software station; physical map mismatch/new proposed design.
- Proposed four-station model: Reception, ISB, Archive, Research Director; keep physical cloning lab and analysis bench but remove separate Lab computer if approved. Decide REC-006 destination (recommend ISB after confirmed lab entry), when ISB terminal first becomes usable, how scanner control relates to physical bench, and whether any earlier Director physical exploration is permitted (user requests terminal only at end; recommend step 16 and confirmed physical arrival). Preserve archive retrieval-only, ISB decryption, Sigma and final cylinder/door gating. Review physical map and both documents before any change.
- Current repair path: after authorization diagnostic S-4 keyed sensor + P-2 regulator; manifest B17 regulated instruments contains both, B71 general lighting contains P-2 only; Engineering relay 1 crew retained technical-stores cage key, work order points to B17; recommended stores cage beside Engineering, fallback engineering spare; DM PARTS registers recovery, physical bench beyond main lab; Ryan fits keyed module, Glitch may calibrate, other PCs can help. DM REPAIR currently only checks step >=12 and parts, not actual local room. No approved exact calibration prop, DC or finalized map geometry; design a short practical physical/skill interaction later. No mandatory gate.

### IMP-032 — Manual crisis activation
- User requests no automatic red biohazard alert after REC-007; DM clicks Activate crisis to cue red screen, Empire alarm and exact existing warning announcement. Current FINISH 7 advances to step 17, auto renders alert, cue/announcement; BEGIN CRISIS is separate reanimation/escape cue at step 18 and requires hold off. Hold button does not prevent initial alert. Proposed: default waiting state after final playback/silence, no automatic alert, explicit DM activation, remove routine Hold/Release controls if no longer useful. Preserve manual handprint reveal after alert and decide whether reanimation stays separate (recommended) or is part of activation. No premature warning; persist state/recovery, exactly-once cues, player cannot trigger. Preserve exact approved alarm wording and three-second silence. No implementation yet.

### IMP-033 — Archive retrieval animation
- User requests approximately five-second retrieval and simple 8-bit animation of mechanical claw picking up a round disc. Current retrieve() waits 900ms (0 fast/reduced) then sends RETRIEVE. Proposed pixel-art terminal green animation: move claw over carrier, descend, grip round disc, lift and deliver, then show physical retrieval confirmation. Guard duplicate clicks, stale state/session and interrupted retrieval; fast/reduced-motion bypass or accessible static progress. Preserve existing tape lifecycle, physical carrier and Sigma gate. Visual concept only; no asset created.

### IMP-034 — Ryan scan assessment and completion highlighting
- User wants Ryan's assessment to mention recent high-voltage exposure and subject emitting sparks during scan. Proposed wording for later review: "Evidence of recent high-voltage exposure detected. Subject emitting sparks during scan." Preserve HUMAN / AVERAGE / NONE and no new mechanical effect.
- Once all biological specimens intended for the session have been scanned, Analyze biological specimen should stop being bright yellow, remain available for rescans. Current station renders action priority unconditionally, and engine tracks only lastScan, saved, matches, not all completed scans. Need distinguish completion from save/decline, persistent session state, undo/reset, campaign separation. Clarify eligible roster (present PCs vs full list; T0DD inorganic, Sam unknown, Tom unfinalized); propose DM-defined present/eligible subjects or agreed roster, do not invent.
 
### IMP-035 — REC-006 premature reviewed state
- User reports REC-006 appeared reviewed before viewing. Source: recordingGroups groups by s.seen[id]; UI marks seen recordings reviewed, and engine FINISH sets seen. Local reviewed-key data does not itself move an unseen recording into completed-replay group. Fast mode, previous checkpoint, completion callback or a display distinction require investigation; no confirmed cause from source alone. Obtain exact observed screen/session and reproduce with fresh disposable run, first-time playback, replay/stop, refresh and undo; inspect state/log and ensure no reviewed status until actual first completion. Preserve approved progression. Do not reset the user's current rehearsal to investigate.
