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
