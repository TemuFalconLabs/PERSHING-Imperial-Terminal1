# Recording and prop book · DM only

Director cylinder first pair: **47**. Recording 003 board suffix: **1938**. Authorized entry: **471938**. The ID is a string.

## REC-001 · Shift handover

Duty officer · approximately 16 seconds · future file: media/rec-001.mp4 or .mp3

Empty duty desk; a grey coat hangs behind the speaker. Introduce the cylinder desk.

> If this is your first watch, leave the board exactly as you find it. The relief officer keeps the station copy in the drawer marked MEDIA.

> I counted eleven coats on twelve hooks this morning. Personnel says that is within tolerance. The owner of the grey one may disagree. Sign the book when you take over.

## REC-002 · Bench copy

Engineering clerk · approximately 16 seconds · future file: media/rec-002.mp4 or .mp3

Gloved hand taps a splice in a return lead diagram. Identify the server fault.

> The night shift sent me a reel with the middle missing. Same break on every copy. When I pulled the patch at the server floor box the splice disappeared.

> I left the return lead loose for inspection. Somebody please seat it. The next shift needs the original image, edges and all.

## REC-003 · Framing check

Research technician · approximately 16 seconds · future file: media/rec-003.mp4 or .mp3

Frame a chalkboard behind the technician. At one-third duration hold the full board showing 1938. End on the brass-front locker. Keep digits out of spoken captions.

> Keep the full width this time. When you crop the board out I lose the rack marks along the left edge.

> There. Hold that frame. The Director keeps the other copy in the brass-front locker in her office. If she asks, we have only been checking alignment.

## REC-004 · Personal dictation

Facility Research Director · approximately 16 seconds · future file: media/rec-004.mp4 or .mp3

Director speaks into the cylinder; a packed bag sits beside the locker. Give the first two digits.

> For the relief director taking custody of my cylinder. The first pair on the authorization register is 4, 7. The remainder is on the board in the bench copy.

> Please take the bag by the locker when you leave. My daughter put a note in the pocket. I should like to keep that.

## REC-005 · Occupancy certificate

Facilities supervisor · approximately 16 seconds · future file: media/rec-005.mp4 or .mp3

Two blank signature boxes on an occupancy permit. Make the repairs look routine.

> There are two signatures on the occupancy certificate. One belongs to Engineering. The other belongs to Decontamination. I have accepted neither by proxy.

> Bring each relay back on its own circuit. When both indicators settle, the laboratory door will release. Whoever takes the watch after mine can sign for the air.

## REC-006 · Inventory adjustment

Laboratory researcher · approximately 16 seconds · future file: media/rec-006.mp4 or .mp3

Track empty slide racks, then hold on a surviving label and the vault direction marker. Lead to physical storage.

> I was told to clear the empty racks. I began with the names. That was an error. The names are the only part of the inventory the Director wants kept.

> I have moved the intact record to mechanized storage. Use the archive station beyond this room. Request the tape under its batch designation, then bring it back to the primary reader. Please leave the empty labels where they are.

## REC-007 · Duty transmission

Facility commander · approximately 37 seconds · future file: media/rec-007.mp4 or .mp3

Heavy breathing. At 8s hear movement; at 16s metal strikes; at 23s the commander names the air. At 32s footsteps approach. Cut the last word mid-syllable, hold silence, then alarm.

> This is the facility commander. We have suffered a catastrophic containment failure. All personnel are ordered to evacuate immediately.

> The specimens… they’re moving. They were dead. Every single one of them was dead.

> Security! Seal that corridor! Stop them! STOP THEM!

> The biological agent is airborne. Engineering has shut down the ventilation, but it’s already too late for us.

> If anyone finds this recording, whatever you do, do not restart the air circula—

## Adding your performance

Place the finished file under media/ and set its relative path in the media entry for that recording in content.mjs, for example media[3].video = "media/rec-003.mp4". Set the audio field for an audio-only performance. Leave unused fields empty. The built-in transcript and timed visual clue remain available. Play, pause, replay and completion use the same progression gates. Check the board at laptop viewing distance before release. Run node build-guide.mjs and node build-offline.mjs after changes. The offline file works with its built-in text even without a media folder.
