import {code,tapes,recordings,adultScans,kidScans} from './content.mjs';
export const route=['PLAY 1','MOUNT CYLINDER','PLAY 2','CONNECT SERVER','PLAY 3','MOUNT DIRECTOR','PLAY 4','AUTH','PLAY 5','RELAY 1','RELAY 2','ENTER LAB','PLAY 6','POWER ARCHIVE','RETRIEVE CLONE BATCH SIGMA','INSERT CLONE BATCH SIGMA','PLAY 7','BEGIN CRISIS'];
export const recordingAt=[0,0,2,4,6,8,12,16];
export const rooms={Reception:['Vestibule','Service passage'],Laboratory:['Lab corridor','Analysis door'],Engineering:['Plant hatch']};
export const physical=['MOUNT CYLINDER','CONNECT SERVER','MOUNT DIRECTOR','RELAY 1','RELAY 2','ENTER LAB','POWER ARCHIVE','BEGIN CRISIS'];
export const stages=['Duty station','Duty station','Cylinder interface','Server link','Network archive','Director’s office','Personal cylinder','Authorization','Research index','Engineering','Decontamination','Laboratory access','Laboratory','Archive vault','Tape elevator','Primary reader','Classified archive','Emergency signal','Emergency response'];
export const clues=[
 ['Inspect the menu.','Find Media Archive.','Open Research Recordings and play 001.'],
 ['The relief officer signed for a cylinder.','Look at the security desk.','Open the evidence drawer marked MEDIA.'],
 ['The archive index changed.','Inspect recovered media.','Play recording 002.'],
 ['A carrier has lost its return signal.','Trace the server-room floor box.','Seat the loose lead under the scuffed flap.'],
 ['The remote bench is back online.','Look beyond the researcher.','Pause the alignment reel and inspect the board.'],
 ['A locker controller has power.','Match the brass locker in the Director’s office.','Open it and bring the Omega cylinder to reception.'],
 ['There is personal dictation on the cylinder.','Open recovered recordings.','Play 004 and listen to the first pair.'],
 ['The register has six spaces.','The personal cylinder identifies the beginning.','Enter the spoken pair followed by the four board digits.'],
 ['A certificate is now available.','Find the occupancy certificate.','Play recording 005.'],
 ['The interlock awaits two returns.','Start with Engineering.','Seat the first relay behind the open panel.'],
 ['One branch is certified.','Follow the map to Decontamination.','Open the stuck pressure door and restore relay 2.'],
 ['The occupancy light is steady.','The main lab is accessible.','Enter the lab; register the party’s arrival.'],
 ['A local reel survived.','Check the lab recording.','Play 006 for vault directions.'],
 ['The lift panel is completely dark.','Inspect its power lead.','Plug the archive terminal in.'],
 ['The arm can fetch physical media.','Look for the cloning project.','Retrieve the Clone Batch Sigma tape.'],
 ['Retrieval and reading use different heads.','Return to reception with the tape.','Use the primary reader and insert Clone Batch Sigma.'],
 ['A confidential message remains.','Check the doors on this room.','Clear obstructions, close this room, then choose PLAY.'],
 ['Wait for the watch officer.','Emergency signal acknowledged.','DM releases the crisis cue when the table is ready.']
];
export function fresh(campaign='MEN'){return {version:1,campaign,step:0,revision:0,room:'Reception',doors:{Vestibule:'OPEN','Service passage':'CLOSED','Lab corridor':'OPEN','Analysis door':'CLOSED','Plant hatch':'OPEN'},deck:'Primary',seen:{},playing:0,retrieved:{},parts:false,repaired:false,fast:false,mute:false,hold:false,equipment:false,legacy:false,boardAid:false,saved:{},hint:'',notice:'LOCAL DUTY STATION',danger:0,log:[]}}
export function normalize(s){return {...fresh(s.campaign),...s,log:Object.values(s.log||{}),retrieved:s.retrieved||{},seen:s.seen||{},saved:s.saved||{}}}
export function validSave(s){return s?.version===1&&['MEN','KIDS'].includes(s.campaign)&&Number.isInteger(s.step)&&s.step>=0&&s.step<=18&&Object.hasOwn(rooms,s.room)&&Object.keys(fresh().doors).every(k=>['OPEN','CLOSED','OBSTRUCTED'].includes(s.doors?.[k]))}
export const scans=s=>s.campaign==='MEN'?adultScans:kidScans;
export const locallyClosed=s=>rooms[s.room].every(d=>s.doors[d]==='CLOSED');
export function apply(raw,who,action,arg='',now=Date.now()){
 const s=structuredClone(normalize(raw)),dm=who==='DM',next=route[s.step];
 const need=(ok,msg='Operation unavailable at this station.')=>{if(!ok)throw Error(msg)};
 const advance=()=>{s.step++;s.hint=''};
 let note='';
 if(action==='PLAY'){
   const id=Number(arg);need(s.deck==='Primary'&&recordings[id]&&s.step>=recordingAt[id]);
   if(id===7)need(locallyClosed(s),'Confidential playback withheld. Inspect DOORS.');
   need(!s.playing||s.playing===id,'A recording is in progress.');s.playing=id;note='Playback · '+recordings[id][0];
 }else if(action==='FINISH'){
   const id=Number(arg);need(id&&id===s.playing);s.seen[id]=true;s.playing=0;
   if(next==='PLAY '+id)advance();note=id===7?'BIOHAZARD ALERT · Airborne contaminant detected. Stand by.':'Playback complete. Archive index synchronized.';
 }else if(action==='AUTH'){
   need(next==='AUTH'&&arg===code.prefix+code.board,'Authorization denied. Review registered media.');
   advance();note='Authorization accepted. Research index expanded. Laboratory safety interlock active.';
 }else if(physical.includes(action)){
   need(dm&&next===action);if(action==='BEGIN CRISIS')need(!s.hold,'Release the crisis hold first.');
   advance();note=({'MOUNT CYLINDER':'Cylinder mounted. Recovered recording available.','CONNECT SERVER':'Server link restored. Remote index synchronized.','MOUNT DIRECTOR':'Omega media mounted. Personal recording recovered.','RELAY 1':'Environmental relay 1 online. Interlock 1 of 2.','RELAY 2':'Occupational safety check complete. Your safety is our priority.','ENTER LAB':'Local laboratory archive detected.','POWER ARCHIVE':'Retrieval station online. External power restored. No technical fault detected.','BEGIN CRISIS':'SPECIMEN ACTIVITY · Fall back to the exit junction. Surface and cave routes available.'})[action];
   if(action==='RELAY 2')s.danger=now;if(action==='POWER ARCHIVE')s.deck='Archive';
 }else if(action==='DECK'){need(s.step>=13&&['Archive','Primary'].includes(arg)&&!s.playing);s.deck=arg;note=arg==='Archive'&&s.step<14?'No carrier. Display dark.':arg+' station selected.';
 }else if(action==='RETRIEVE'){need(s.step>=14&&s.deck==='Archive'&&Object.hasOwn(tapes,arg));s.retrieved[arg]=true;if(next==='RETRIEVE '+arg)advance();note='Lift aligned. Carrier delivered: '+arg+'. Take physical tape.';
 }else if(action==='INSERT'){need(s.deck==='Primary'&&s.retrieved[arg]&&Object.hasOwn(tapes,arg));if(next==='INSERT '+arg)advance();note=arg==='CLONE BATCH SIGMA'?'Tape authenticated. Specimen records decrypted.':tapes[arg];
 }else if(action==='CLOSE'){need(s.step>=8);for(const d of rooms[s.room])if(s.doors[d]!=='OBSTRUCTED')s.doors[d]='CLOSED';note=locallyClosed(s)?'Current room closed. Doors remain unlocked.':'Obstruction detected. Check current-room door list.';
 }else if(action==='DOOR'){const [d,v]=arg.split('|');need(dm&&Object.hasOwn(s.doors,d)&&['OPEN','CLOSED','OBSTRUCTED'].includes(v));s.doors[d]=v;note=d+' · '+v;
 }else if(action==='ROOM'){need(dm&&Object.hasOwn(rooms,arg));s.room=arg;note='Local interface moved to '+arg;
 }else if(action==='BLUE'){s.legacy=true;note='THIS IS AN OLDER CODE, BUT IT CHECKS OUT. Legacy duty circular available.';
 }else if(action==='EQUIPMENT'){need(s.step>=8);s.equipment=true;note='Security Equipment Room released.';
 }else if(action==='PARTS'){need(dm&&s.step>=8);s.parts=true;note='Instrument consignment received.';
 }else if(action==='REPAIR'){need(dm&&s.step>=12&&s.parts);s.repaired=true;note='Analysis bench calibrated. Sample reader ready.';
 }else if(action==='SCAN'||action==='SAVE SCAN'){need(s.repaired&&Object.hasOwn(scans(s),arg));if(action==='SAVE SCAN')s.saved[arg]=true;note=action==='SCAN'?arg+' · '+scans(s)[arg]:'Sample filed in this session.';
 }else if(action==='HINT'){need(dm&&clues[s.step]&&[0,1,2].includes(+arg));s.hint=clues[s.step][+arg];note=s.hint;
 }else if(action==='BOARD AID'){need(dm&&s.step>=4);s.boardAid=true;note='Accessible board description enabled during frame playback.';
 }else if(['fast','mute','hold'].includes(action)){need(dm);s[action]=!s[action];note='Operator setting updated.';
 }else throw Error('Unknown operation.');
 s.notice=note;s.revision++;s.log=[...s.log.slice(-59),{at:now,who,action:action==='AUTH'?'Authorization accepted':action,detail:action==='AUTH'?'':String(arg)}];return s;
}
