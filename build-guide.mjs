import {code,recordings} from './content.mjs';
import {writeFile} from 'node:fs/promises';
// Keep approved media directions and prop notes synchronized with MEDIA.md.
const directions=[
  "",
  "Duty handover: identify MEDIA drawer, insertion and return.",
  "Engineering report: identify disconnected server cable.",
  "Frame the board with 1938; no spoken digits.",
  "ISB officer's personal log. Physical card in trapped ISB safe; no spoken digits.",
  "Routine occupational safety report; both relays.",
  "Lab workstation; memory suppression and archive designation.",
  "Commander visibly distressed, attempting to maintain composure. Distant blaster fire. After “they didn't stay dead,” loud impact; commander turns toward something outside the camera’s field of view. After “I said seal it,” blaster fire intensifies; commander returns to recording. On final cutoff, violent noise and abrupt termination. Allow approximately three seconds of complete silence before the red biohazard alarm appears. Actual media still to be produced."
];
let out='# Recording and prop book · DM only\n\nProvisional damaged card **'+code.prefix+code.board.slice(0,2)+'??**, blackboard **'+code.board+'**, full code **'+code.prefix+code.board+'**. Three cylinders: duty, partially damaged ISB, Research Director. REC-001–005 reception; REC-006 lab; REC-007 Director only after Sigma and closed office door.\n\n';
for(let i=1;i<recordings.length;i++){const [title,speaker,lines]=recordings[i],id=String(i).padStart(3,'0');out+='## REC-'+id+' · '+title+'\n\n'+speaker+'\n\n'+directions[i]+'\n\n'+lines.map(x=>'> '+x).join('\n\n')+'\n\n';}
out+="Actual audio/video media still pending; built-in captions and the visual blackboard are available. Run npm run guides after edits.\n";
await writeFile(new URL('./MEDIA.md',import.meta.url),out);
