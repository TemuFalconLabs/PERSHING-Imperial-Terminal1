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
