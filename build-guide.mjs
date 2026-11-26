import {code,recordings,media} from './content.mjs';
import {writeFile} from 'node:fs/promises';
const directions=[
 '', 'Empty duty desk; a grey coat hangs behind the speaker. Introduce the cylinder desk.',
 'Engineering report identifies the disconnected network cable beneath the server-room service panel.',
 'Frame a chalkboard behind the researcher. Hold the full board showing '+code.board+'. Keep digits out of spoken captions.',
 'ISB officer speaks. No spoken digits; damaged key card is in the trapped safe in the ISB office.',
 'Two blank signature boxes on an occupancy permit. Make the repairs look routine.',
 'Track empty slide racks, then hold on a surviving label and the vault direction marker. Lead to physical storage.',
 'Heavy breathing. At 8s hear movement; at 16s metal strikes; at 23s the commander names the air. At 32s footsteps approach. Cut the last word mid-syllable, hold silence, then alarm.'
];
let out='# Recording and prop book · DM only\n\nDamaged key card complementary digits: **'+code.prefix+'**. Recording 003 board suffix: **'+code.board+'**. Authorized entry: **'+code.prefix+code.board+'**. The ID is a string.\n\n';
for(let i=1;i<recordings.length;i++){const [title,speaker,lines]=recordings[i],id=String(i).padStart(3,'0');out+='## REC-'+id+' · '+title+'\n\n'+speaker+' · approximately '+Math.round(lines.reduce((n,l)=>n+Math.max(4500,l.length*58),0)/1000)+' seconds · future file: media/rec-'+id+'.mp4 or .mp3\n\n'+directions[i]+'\n\n'+lines.map(x=>'> '+x).join('\n\n')+'\n\n';}
out+='## Adding your performance\n\nPlace the finished file under media/ and set its relative path in the media entry for that recording in content.mjs, for example media[3].video = "media/rec-003.mp4". Set the audio field for an audio-only performance. Leave unused fields empty. The built-in transcript and timed visual clue remain available. Play, pause, replay and completion use the same progression gates. Check the board at laptop viewing distance before release. Run node build-guide.mjs and node build-offline.mjs after changes. The offline file works with its built-in text even without a media folder.\n';
await writeFile(new URL('./MEDIA.md',import.meta.url),out);
