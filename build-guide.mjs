import {code,recordings,media} from './content.mjs';
import {writeFile} from 'node:fs/promises';
const directions=[
 '', 'Empty duty desk; a grey coat hangs behind the speaker. Introduce the cylinder desk.',
 'Gloved hand taps a splice in a return lead diagram. Identify the server fault.',
 'Frame a chalkboard behind the technician. At one-third duration hold the full board showing '+code.board+'. End on the brass-front locker. Keep digits out of spoken captions.',
 'Director speaks into the cylinder; a packed bag sits beside the locker. Give the first two digits.',
 'Two blank signature boxes on an occupancy permit. Make the repairs look routine.',
 'Track empty slide racks, then hold on a surviving label and the vault direction marker. Lead to physical storage.',
 'Heavy breathing. At 8s hear movement; at 16s metal strikes; at 23s the commander names the air. At 32s footsteps approach. Cut the last word mid-syllable, hold silence, then alarm.'
];
let out='# Recording and prop book · DM only\n\nDirector cylinder first pair: **'+code.prefix+'**. Recording 003 board suffix: **'+code.board+'**. Authorized entry: **'+code.prefix+code.board+'**. The ID is a string.\n\n';
for(let i=1;i<recordings.length;i++){const [title,speaker,lines]=recordings[i],id=String(i).padStart(3,'0');out+='## REC-'+id+' · '+title+'\n\n'+speaker+' · approximately '+(i===7?37:lines.length*8)+' seconds · future file: media/rec-'+id+'.mp4 or .mp3\n\n'+directions[i]+'\n\n'+lines.map(x=>'> '+x).join('\n\n')+'\n\n';}
out+='## Adding your performance\n\nPlace the finished file under media/ and set its relative path in the media entry for that recording in content.mjs, for example media[3].video = "media/rec-003.mp4". Set the audio field for an audio-only performance. Leave unused fields empty. The built-in transcript and timed visual clue remain available. Play, pause, replay and completion use the same progression gates. Check the board at laptop viewing distance before release. Run node build-guide.mjs and node build-offline.mjs after changes. The offline file works with its built-in text even without a media folder.\n';
await writeFile(new URL('./MEDIA.md',import.meta.url),out);
