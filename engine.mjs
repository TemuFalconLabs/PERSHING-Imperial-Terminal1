import {code,tapes,recordings,adultScans,kidScans} from './content.mjs';
export const route=['PLAY 1','MOUNT CYLINDER','PLAY 2','CONNECT SERVER','PLAY 3','MOUNT ISB','PLAY 4','AUTH','PLAY 5','RELAY 1','RELAY 2','ENTER LAB','PLAY 6','POWER ARCHIVE','RETRIEVE CLONE BATCH SIGMA','INSERT CLONE BATCH SIGMA','PLAY 7','BEGIN CRISIS'];
export const recordingAt=[0,0,2,4,6,8,12,16];
export const rooms={Reception:['Vestibule','Service passage'],Laboratory:['Lab corridor','Analysis door'],Engineering:['Plant hatch'],ISB:['ISB office door'],Archive:['Vault door'],Director:['Director office door']};
export const physical=['MOUNT CYLINDER','CONNECT SERVER','MOUNT ISB','RELAY 1','RELAY 2','ENTER LAB','POWER ARCHIVE','BEGIN CRISIS'];
export const stages=['Duty station','Duty station','Cylinder interface','Server link','Network archive','ISB officer’s office','ISB cylinder','Authorization','Research index','Engineering','Decontamination','Laboratory access','Laboratory','Archive vault','Tape elevator','ISB reader','Director’s terminal','Emergency signal','Emergency response'];
export const clues=[
 ['Inspect the menu.','Find Media Archive.','Open Research Recordings and play 001.'],
 ['The relief officer signed for a cylinder.','Look at the security desk.','Open the evidence drawer marked MEDIA.'],
 ['The archive index changed.','Inspect recovered media.','Play recording 002.'],
 ['A carrier has lost its return signal.','Trace the server-room floor box.','Seat the loose lead under the scuffed flap.'],
 ['The remote bench is back online.','Look beyond the researcher.','Pause the alignment reel and inspect the board.'],
 ['ISB security credentials are required.','Locate the ISB officer’s office.','Recover the partially damaged cylinder from the officer and insert it at reception.'],
 ['ISB authorization is verified.','Open Research Recordings.','Play 004 for the authorization procedure.'],
 ['Locate the ISB officer’s safe.','Recover the damaged authorization key card.','Compare the card with the visual evidence in the research briefing.'],
 ['A certificate is now available.','Find the occupancy certificate.','Play recording 005.'],
 ['The interlock awaits two returns.','Start with Engineering.','Seat the first relay behind the open panel.'],
 ['One branch is certified.','Follow the map to Decontamination.','Open the stuck pressure door and restore relay 2.'],
 ['The occupancy light is steady.','The main lab is accessible.','Enter the lab; register the party’s arrival.'],
 ['A local reel survived.','Check the lab recording.','Play 006 for vault directions.'],
 ['The lift panel is completely dark.','Inspect its power lead.','Plug the archive terminal in.'],
 ['The arm can fetch physical media.','Look for the cloning project.','Retrieve the Clone Batch Sigma tape.'],
 ['The vault retrieves tapes but cannot decrypt them.','Return to the ISB officer’s office.','Insert Clone Batch Sigma in the ISB terminal.'],
 ['Review the classified records, then explore the Research Director’s office beyond the laboratory.','Recover her security cylinder and insert it into her terminal.','Close the office door and deliberately play the available transmission.'],
 ['Wait for the watch officer.','Emergency signal acknowledged.','DM releases the crisis cue when the table is ready.']
];
export function fresh(campaign='MEN'){return {version:1,campaign,step:0,revision:0,room:'Reception',doors:{Vestibule:'OPEN','Service passage':'CLOSED','Lab corridor':'OPEN','Analysis door':'CLOSED','Plant hatch':'OPEN','ISB office door':'OPEN','Vault door':'OPEN','Director office door':'OPEN'},deck:'Primary',seen:{},playing:0,retrieved:{},inserted:{},matches:{},card:false,directorCylinder:false,lastScan:'',parts:false,repaired:false,fast:false,mute:false,hold:false,equipment:false,legacy:false,boardAid:false,saved:{},hint:'',notice:'LOCAL DUTY STATION',danger:0,log:[]}}
export function normalize(s){return {...fresh(s.campaign),...s,doors:{...fresh().doors,...s.doors},log:Object.values(s.log||{}),retrieved:s.retrieved||{},inserted:s.inserted||{},matches:s.matches||{},seen:s.seen||{},saved:s.saved||{}}}
export function validSave(s){return s?.version===1&&['MEN','KIDS'].includes(s.campaign)&&Number.isInteger(s.step)&&s.step>=0&&s.step<=18&&Object.hasOwn(rooms,s.room)&&Object.keys(fresh().doors).every(k=>['OPEN','CLOSED','OBSTRUCTED'].includes(normalize(s).doors[k]))}
export const scans=s=>s.campaign==='MEN'?adultScans:kidScans;
export const locallyClosed=s=>rooms[s.room].every(d=>s.doors[d]==='CLOSED');
export const canPlay=(s,id)=>!!recordings[id]&&s.step>=recordingAt[id]&&(id<=5?s.deck==='Primary':id===6?s.deck==='Lab':s.deck==='Director'&&s.room==='Director'&&s.directorCylinder&&s.inserted?.['CLONE BATCH SIGMA']);
export const objectives=['Locate Recording 001 in Media Archive.','Retrieve the authorization cylinder from the security desk and insert it into the terminal reader.','Review Recording 002.','Locate the disconnected network cable beneath the service panel in the server room and reconnect it.','Review Recording 003.','Locate the ISB security credential and insert it into the reception terminal.','Review Recording 004.','Retrieve the authorization key from the safe in the ISB officer’s office and enter the six-digit code.','Review Recording 005.','Restore both environmental relays to resume ventilation and unlock the main laboratory.','Restore the remaining environmental relay in Decontamination.','Proceed to the main laboratory.','Review Recording 006 at the laboratory workstation.','Locate the research archive vault and restore power to its retrieval station.','Locate and retrieve the requested research tape: CLONE BATCH SIGMA.','Return to the ISB officer’s terminal and insert Clone Batch Sigma.','Review the classified records. When ready, explore the Research Director’s office beyond the cloning laboratory.','Emergency protocol initiated.','Emergency response.'];
export const objective=s=>s.step===16&&s.deck==='Director'?(s.directorCylinder?(s.doors['Director office door']==='CLOSED'?'Play the confidential transmission.':'Close the office door to authorize playback.'):'Recover and insert the Research Director’s security cylinder.'):objectives[s.step]||'';
export function apply(raw,who,action,arg='',now=Date.now()){
 const s=structuredClone(normalize(raw)),dm=who==='DM',next=route[s.step];
 const need=(ok,msg='Operation unavailable at this station.')=>{if(!ok)throw Error(msg)};
 const advance=()=>{s.step++;s.hint=''};
 let note='';
 if(action==='PLAY'){
   const id=Number(arg);need(canPlay(s,id),id===7?'Confidential playback unavailable at this station.':'Recording unavailable at this station.');
   if(id===7)need(s.doors['Director office door']==='CLOSED','Confidential playback withheld. Close the Research Director’s office door.');
   need(!s.playing||s.playing===id,'A recording is in progress.');s.playing=id;note='Playback · '+recordings[id][0];
 }else if(action==='FINISH'){
   const id=Number(arg);need(id&&id===s.playing);s.seen[id]=true;s.playing=0;
   if(next==='PLAY '+id)advance();note=id===7?'BIOHAZARD ALERT · Airborne contaminant detected. Stand by.':'Playback complete. Archive index synchronized.';
 }else if(action==='AUTH'){
   need(s.deck==='Primary'&&next==='AUTH'&&s.card&&arg===code.prefix+code.board,'Authorization denied. Review registered media.');
   advance();note='Authorization accepted. Research index expanded. Laboratory safety interlock active.';
 }else if(physical.includes(action)){
   need(dm&&next===action);if(action==='BEGIN CRISIS')need(!s.hold,'Release the crisis hold first.');
   advance();note=({'MOUNT CYLINDER':'Cylinder mounted. Recovered recording available.','CONNECT SERVER':'Server link restored. Remote index synchronized.','MOUNT ISB':'ISB SECURITY CREDENTIAL VERIFIED. RECORDING 004 AVAILABLE.','RELAY 1':'Environmental relay 1 online. Interlock 1 of 2.','RELAY 2':'Occupational safety check complete. Your safety is our priority.','ENTER LAB':'Local laboratory archive detected.','POWER ARCHIVE':'Retrieval station online. External power restored. No technical fault detected.','BEGIN CRISIS':'SPECIMEN ACTIVITY · Fall back to the exit junction. Surface and cave routes available.'})[action];
   if(action==='RELAY 2')s.danger=now;if(action==='ENTER LAB'){s.deck='Lab';s.room='Laboratory'}if(action==='POWER ARCHIVE'){s.deck='Archive';s.room='Archive'}
 }else if(action==='CARD'){need(dm&&s.step>=7);s.card=true;note='Authorization key card recovered.';
 }else if(action==='DIRECTOR CYLINDER'){need(dm&&s.step>=12&&s.room==='Director'&&s.deck==='Director');s.directorCylinder=true;note='Executive credentials verified.';
 }else if(action==='DECK'){need(s.step>=12&&!s.playing&&['Lab','ISB','Archive','Primary'].includes(arg));need(arg!=='Archive'||s.step>=13);need(arg!=='ISB'||s.step>=14);s.deck=arg;s.room={Lab:'Laboratory',ISB:'ISB',Archive:'Archive',Primary:'Reception'}[arg];note=arg+' station selected.';
 }else if(action==='RETRIEVE'){need(s.step>=14&&s.deck==='Archive'&&Object.hasOwn(tapes,arg)&&!s.retrieved[arg]&&!s.inserted[arg],'Tape unavailable or already retrieved.');s.retrieved[arg]=true;if(next==='RETRIEVE '+arg)advance();note='Lift aligned. Carrier delivered: '+arg+'. Take physical tape.';
 }else if(action==='INSERT'){need(s.deck==='ISB'&&s.retrieved[arg]&&!s.inserted[arg]&&Object.hasOwn(tapes,arg),'Archive tape decryption is available only at the ISB officer’s terminal. Tape must be in possession and not already inserted.');s.inserted[arg]=true;delete s.retrieved[arg];if(next==='INSERT '+arg)advance();note='TAPE AUTHENTICATED · '+arg+' · Record saved to Research Archives.';
 }else if(action==='CLOSE'){need(s.step>=8);if(s.room==='Director')need(dm,'Close the office door physically; the DM will confirm closure.');for(const d of rooms[s.room])if(s.doors[d]!=='OBSTRUCTED')s.doors[d]='CLOSED';note=locallyClosed(s)?'Current room closed. Doors remain unlocked.':'Obstruction detected. Check current-room door list.';
 }else if(action==='DOOR'){const [d,v]=arg.split('|');need(dm&&Object.hasOwn(s.doors,d)&&['OPEN','CLOSED','OBSTRUCTED'].includes(v));s.doors[d]=v;note=d+' · '+v;
 }else if(action==='ROOM'){need(dm&&Object.hasOwn(rooms,arg));need(!s.playing);if(arg==='Director')need(s.step>=12,'Laboratory access required.');if(arg==='ISB'&&s.step<14){s.room=arg;note='ISB office selected; reception reader required for authorization.';}else{s.room=arg;const deck={Reception:'Primary',Laboratory:'Lab',Archive:'Archive',ISB:'ISB',Director:'Director'}[arg];if(deck)s.deck=deck;note='Local interface moved to '+arg;}
 }else if(action==='BLUE'){s.legacy=true;note='THIS IS AN OLDER CODE, BUT IT CHECKS OUT. Legacy duty circular available.';
 }else if(action==='EQUIPMENT'){need(s.step>=8);s.equipment=true;note='Security Equipment Room released.';
 }else if(action==='PARTS'){need(dm&&s.step>=8);s.parts=true;note='Instrument consignment received.';
 }else if(action==='REPAIR'){need(dm&&s.step>=12&&s.parts);s.repaired=true;note='Analysis bench calibrated. Sample reader ready.';
 }else if(action==='SCAN'||action==='SAVE SCAN'){need(s.deck==='Lab'&&s.repaired&&Object.hasOwn(scans(s),arg));if(action==='SCAN'){s.lastScan=arg;if(s.campaign==='MEN'&&['Glitch','Crosseye'].includes(arg))s.matches[arg]=true;note=arg+' · '+scans(s)[arg];}else{need(s.lastScan===arg,'Scan this specimen before saving.');s.saved[arg]=true;note='Sample filed in this session.';}
 }else if(action==='HINT'){need(dm&&clues[s.step]&&[0,1,2].includes(+arg));s.hint=clues[s.step][+arg];note=s.hint;
 }else if(action==='BOARD AID'){need(dm&&s.step>=4);s.boardAid=true;note='Accessible board description enabled during frame playback.';
 }else if(['fast','mute','hold'].includes(action)){need(dm);s[action]=!s[action];note='Operator setting updated.';
 }else throw Error('Unknown operation.');
 if(action==='FINISH'&&Number(arg)!==7)note=({1:'IMPERIAL SECURITY AUTHENTICATION · Authorization cylinder: NOT DETECTED · Research archive access: RESTRICTED',2:'NETWORK DIAGNOSTIC · Local terminal: OPERATIONAL · Server connection: OFFLINE · Remote research archive: UNAVAILABLE · Fault location: Server Room',3:'ISB SECURITY AUTHENTICATION REQUIRED · Registered duty location: ISB Officer’s Office',4:'MULTIFACTOR AUTHENTICATION · ISB security credentials: VERIFIED · Omega clearance: PENDING · Six-digit authorization key: REQUIRED',5:'ENVIRONMENTAL CONTROL SYSTEM · Ventilation relay 1 and 2: OFFLINE · Laboratory access: RESTRICTED',6:'CLASSIFIED RESEARCH ARCHIVE · Requested records: CLONE BATCH SIGMA · Storage medium: Physical data tape · Location: Imperial Research Archive Vault · Retrieval station: OFFLINE'})[Number(arg)]||note;
 if(action==='CONNECT SERVER')note='NETWORK CONNECTION RESTORED · Synchronization complete. RECORDING 003 AVAILABLE';if(action==='RELAY 2')note='ENVIRONMENTAL RELAYS: 2 OF 2 ONLINE · LABORATORY ACCESS GRANTED · YOUR SAFETY IS OUR PRIORITY.';
 s.notice=note;s.revision++;s.log=[...s.log.slice(-59),{at:now,who,action:action==='AUTH'?'Authorization accepted':action,detail:action==='AUTH'?'':String(arg)}];return s;
}
