import {code,tapes,recordings,adultScans,kidScans} from './content.mjs';
export const biohazardAlert="BIOHAZARD ALERT\nAIRBORNE CONTAMINANT DETECTED\n\nEnvironmental relays: ONLINE\nAir circulation: ACTIVE\nBiological containment: FAILED\n\nEMERGENCY CONTAINMENT PROTOCOL INITIATED\n\nAll personnel are reminded that containment takes precedence over personal safety.\n\nNo evacuation has been authorized.\n\nThe Empire recognizes your service and, should it become necessary, your sacrifice.\n\nLONG LIVE THE EMPIRE.";
export const relayOneStatus="ENVIRONMENTAL RELAY 1: ONLINE\nENVIRONMENTAL RELAY 2: OFFLINE\n\nSafety interlock verification: 1 of 2\nLaboratory access: RESTRICTED";
export const relayTwoStatus="ENVIRONMENTAL RELAYS: 2 OF 2 ONLINE\n\nResuming normal air circulation...\nOccupational safety check: COMPLETE\n\nLABORATORY ACCESS GRANTED\nYOUR SAFETY IS OUR PRIORITY.";
export const route=['PLAY 1','MOUNT CYLINDER','PLAY 2','CONNECT SERVER','PLAY 3','MOUNT ISB','PLAY 4','AUTH','PLAY 5','RELAY 1','RELAY 2','ENTER LAB','PLAY 6','POWER ARCHIVE','RETRIEVE CLONE BATCH SIGMA','INSERT CLONE BATCH SIGMA','PLAY 7','BEGIN CRISIS'];
export const recordingAt=[0,0,2,4,6,8,12,16];
export const rooms={Reception:['Vestibule','Service passage'],Laboratory:['Lab corridor','Analysis door'],Engineering:['Plant hatch'],ISB:['ISB office door'],Archive:['Vault door'],Director:['Director office door']};
export const physical=['MOUNT CYLINDER','CONNECT SERVER','MOUNT ISB','RELAY 1','RELAY 2','ENTER LAB','POWER ARCHIVE','BEGIN CRISIS'];
export const stages=['Duty station','Duty station','Cylinder interface','Server link','Network archive','ISB officer’s office','ISB cylinder','Authorization','Research index','Engineering','Decontamination','Laboratory access','Laboratory','Archive vault','Tape elevator','ISB reader','Director’s terminal','Emergency signal','Emergency response'];
export const clues=[
 ['Inspect the menu.','Find Media Archive.','Open Research Recordings and play 001.'],
 ['The relief officer signed for a cylinder.','Look at the security desk.','Open the evidence drawer marked MEDIA.'],
 ['The archive index changed.','Inspect recovered media.','Play recording 002.'],
 ['The network connection is offline.','Locate the server room service panel.','Reconnect the disconnected network cable.'],
 ['The research archive is back online.','Review Recording 003.','Pause the research briefing and inspect the blackboard.'],
 ['ISB security credentials are required.','Locate the ISB officer’s office.','Recover the partially damaged cylinder from the officer and insert it at reception.'],
 ['ISB authorization is verified.','Open Research Recordings.','Play 004 for the authorization procedure.'],
 ['Locate the ISB officer’s safe.','Recover the damaged authorization key card.','Compare the card with the visual evidence in the research briefing.'],
 ['Omega authorization accepted.','Open Research Recordings.','Play Recording 005.'],
 ['The interlock awaits two returns.','Start with Engineering.','Seat the first relay behind the open panel.'],
 ['One branch is certified.','Follow the map to Decontamination.','Open the stuck pressure door and restore relay 2.'],
 ['The occupancy light is steady.','The main lab is accessible.','Enter the lab; register the party’s arrival.'],
 ['The laboratory workstation is available.','Open local Research Recordings.','Play Recording 006 for vault directions.'],
 ['The lift panel is completely dark.','Inspect its power lead.','Plug the archive terminal in.'],
 ['The arm can fetch physical media.','Look for the cloning project.','Retrieve the Clone Batch Sigma tape.'],
 ['The vault retrieves tapes but cannot decrypt them.','Return to the ISB officer’s office.','Insert Clone Batch Sigma in the ISB terminal.'],
 ['Review the classified records, then explore the Research Director’s office beyond the laboratory.','Recover her security cylinder and insert it into her terminal.','Close the office door and deliberately play the available transmission.'],
 ['Wait for the watch officer.','Emergency signal acknowledged.','DM releases the crisis cue when the table is ready.']
];
export function fresh(campaign='MEN'){return {version:2,campaign,step:0,revision:0,room:'Reception',doors:{Vestibule:'OPEN','Service passage':'CLOSED','Lab corridor':'OPEN','Analysis door':'CLOSED','Plant hatch':'OPEN','ISB office door':'OPEN','Vault door':'OPEN','Director office door':'OPEN'},deck:'Primary',seen:{},playing:0,retrieved:{},inserted:{},matches:{},card:false,authVerified:false,directorCylinder:false,lastScan:'',parts:false,repaired:false,fast:false,mute:false,hold:false,equipment:false,legacy:false,boardAid:false,saved:{},hint:'',objectiveReveal:'',notice:'LOCAL DUTY STATION',danger:0,log:[]}}
export function normalize(s){const v={...fresh(s.campaign),...s,doors:{...fresh().doors,...s.doors},log:Object.values(s.log||{}),retrieved:s.retrieved||{},inserted:s.inserted||{},matches:s.matches||{},seen:s.seen||{},saved:s.saved||{}};v.authVerified=v.step===7&&v.authVerified===true;return reconcileObjective(v)}
export function validSave(s){return s?.version===2&&['MEN','KIDS'].includes(s.campaign)&&Number.isInteger(s.step)&&s.step>=0&&s.step<=18&&Object.hasOwn(rooms,s.room)&&Object.keys(fresh().doors).every(k=>['OPEN','CLOSED','OBSTRUCTED'].includes(normalize(s).doors[k]))}
export const scans=s=>s.campaign==='MEN'?adultScans:kidScans;
export const locallyClosed=s=>rooms[s.room].every(d=>s.doors[d]==='CLOSED');
export const canPlay=(s,id)=>!!recordings[id]&&s.step>=recordingAt[id]&&(id<=5?s.deck==='Primary':id===6?s.deck==='Lab':s.deck==='Director'&&s.room==='Director'&&s.directorCylinder&&s.inserted?.['CLONE BATCH SIGMA']);
export const objectives=['Locate Recording 001 in Media Archive.','Retrieve the authorization cylinder from the security desk and insert it into the terminal reader.','Review Recording 002.','Locate the disconnected network cable beneath the service panel in the server room and reconnect it.','Review Recording 003.','Locate the ISB security credential and insert it into the reception terminal.','Review Recording 004.','Retrieve the authorization key from the safe in the ISB officer’s office and enter the six-digit code.','Review Recording 005.','Restore both environmental relays to resume ventilation and unlock the main laboratory.','Restore the remaining environmental relay in Decontamination.','Proceed to the main laboratory.','Review Recording 006 at the laboratory workstation.','Locate the research archive vault and restore power to its retrieval station.','Locate and retrieve the requested research tape: CLONE BATCH SIGMA.','Return to the ISB officer’s terminal and insert Clone Batch Sigma.','Review the classified records. When ready, explore the Research Director’s office beyond the cloning laboratory.','Emergency protocol initiated.','Emergency response.'];
export const objective=s=>s.step===16&&s.deck==='Director'?(s.directorCylinder?(s.doors['Director office door']==='CLOSED'?'Play the confidential transmission.':'Close the office door to authorize playback.'):'Recover and insert the Research Director’s security cylinder.'):objectives[s.step]||'';

// Reveal IDs represent the exact existing objective wording, not a new progression gate.
const directorObjectives={cylinder:'Recover and insert the Research Director’s security cylinder.',door:'Close the office door to authorize playback.',play:'Play the confidential transmission.'};
export function currentObjectiveId(s){
 if(s.step>=17)return '';
 if(s.step===16&&s.deck==='Director')return 'director:'+(s.directorCylinder?(s.doors['Director office door']==='CLOSED'?'play':'door'):'cylinder');
 return 'step:'+s.step;
}
export function objectiveTextFor(id){
 if(typeof id!=='string')return '';
 if(/^step:(?:[0-9]|1[0-6])$/.test(id))return objectives[Number(id.slice(5))]||'';
 if(id.startsWith('director:')){const sub=id.slice(9);return Object.hasOwn(directorObjectives,sub)?directorObjectives[sub]:''}
 return '';
}
export function objectivePending(s,id){
 if(!objectiveTextFor(id)||s.step>=17)return false;
 if(id==='director:cylinder')return s.step===16&&!s.directorCylinder;
 if(id==='director:door')return s.step===16&&s.doors['Director office door']!=='CLOSED';
 if(id==='director:play')return s.step===16;
 const n=Number(id.slice(5));
 if(n===9)return s.step===9||s.step===10;
 if(n===16)return s.step===16&&s.deck!=='Director';
 return s.step===n;
}
export function reconcileObjective(s){
 if(!objectivePending(s,s.objectiveReveal))s.objectiveReveal='';
 return s;
}
export function visibleObjective(s){return objectivePending(s,s.objectiveReveal)?objectiveTextFor(s.objectiveReveal):''}
export function objectiveGroup(s){return s.step>=17?8:s.step>=16?7:s.step>=12?6:s.step>=8?5:s.step>=6?4:s.step>=4?3:s.step>=2?2:1}
export function apply(raw,who,action,arg='',now=Date.now()){
 const s=structuredClone(normalize(raw)),dm=who==='DM',next=route[s.step];
 const need=(ok,msg='Operation unavailable at this station.')=>{if(!ok)throw Error(msg)};
 const advance=()=>{s.step++;s.hint=''};
 let note='';
 if(action==='PLAY'){
   const id=Number(arg);need(s.step<17&&canPlay(s,id),id===7?'Confidential playback unavailable at this station.':'Recording unavailable at this station.');
   if(id===7)need(s.doors['Director office door']==='CLOSED','Confidential playback withheld. Close the Research Director’s office door.');
   need(!s.playing||s.playing===id,'A recording is in progress.');s.playing=id;note='Playback · '+recordings[id][0];
 }else if(action==='FINISH'){
   const id=Number(arg);need(id&&id===s.playing);s.seen[id]=true;s.playing=0;
   if(next==='PLAY '+id)advance();note=id===7?biohazardAlert:'Playback complete. Archive index synchronized.';
 }else if(action==='AUTH'){
   need(s.deck==='Primary'&&next==='AUTH'&&!s.playing&&arg===code.prefix+code.board,'Authorization denied. Review registered media.');
   s.authVerified=true;note='Authorization code accepted. Awaiting DM confirmation.';
 }else if(action==='CONFIRM AUTH'){
   need(dm&&next==='AUTH'&&s.authVerified&&!s.playing,'Correct code must be entered before DM confirmation.');
   s.card=true;s.authVerified=false;advance();note='Authorization accepted. Research index expanded. Laboratory safety interlock active.';
 }else if(physical.includes(action)){
   need(dm&&next===action);if(action==='BEGIN CRISIS')need(!s.hold,'Release the crisis hold first.');
   advance();note=({'MOUNT CYLINDER':'Cylinder mounted. Recovered recording available.','CONNECT SERVER':'Server link restored. Remote index synchronized.','MOUNT ISB':'ISB SECURITY CREDENTIAL VERIFIED. RECORDING 004 AVAILABLE.','RELAY 1':'Environmental relay 1 online. Interlock 1 of 2.','RELAY 2':'Occupational safety check complete. Your safety is our priority.','ENTER LAB':'Local laboratory archive detected.','POWER ARCHIVE':'Retrieval station online. External power restored. No technical fault detected.','BEGIN CRISIS':'SPECIMEN ACTIVITY · Fall back to the exit junction. Surface and cave routes available.'})[action];
   if(action==='RELAY 2')s.danger=now;if(action==='ENTER LAB'){s.deck='Lab';s.room='Laboratory'}if(action==='POWER ARCHIVE'){s.deck='Archive';s.room='Archive'}
 }else if(action==='CARD'){need(dm&&s.step>=5&&s.step<8);s.card=true;note='Authorization key card recovered.';
 }else if(action==='DIRECTOR CYLINDER'){need(dm&&s.step>=12&&s.room==='Director'&&s.deck==='Director');s.directorCylinder=true;note='Executive credentials verified.';
 }else if(action==='DECK'){need(s.step>=12&&!s.playing&&['Lab','ISB','Archive','Primary'].includes(arg));need(arg!=='Archive'||s.step>=13);need(arg!=='ISB'||s.step>=14);s.deck=arg;s.room={Lab:'Laboratory',ISB:'ISB',Archive:'Archive',Primary:'Reception'}[arg];note=arg+' station selected.';
 }else if(action==='RETRIEVE'){need(s.step>=14&&s.deck==='Archive'&&Object.hasOwn(tapes,arg)&&!s.retrieved[arg]&&!s.inserted[arg],'Tape unavailable or already retrieved.');s.retrieved[arg]=true;if(next==='RETRIEVE '+arg)advance();note='Lift aligned. Carrier delivered: '+arg+'. Take physical tape.';
 }else if(action==='INSERT'){need(s.deck==='ISB'&&s.retrieved[arg]&&!s.inserted[arg]&&Object.hasOwn(tapes,arg),'Archive tape decryption is available only at the ISB officer’s terminal. Tape must be in possession and not already inserted.');s.inserted[arg]=true;delete s.retrieved[arg];if(next==='INSERT '+arg)advance();note='TAPE AUTHENTICATED · '+arg+' · Record saved to Research Archives.';
 }else if(action==='CLOSE'){need(s.step>=8);if(s.room==='Director')need(dm,'Close the office door physically; the DM will confirm closure.');for(const d of rooms[s.room])if(s.doors[d]!=='OBSTRUCTED')s.doors[d]='CLOSED';note=locallyClosed(s)?'Current room closed. Doors remain unlocked.':'Obstruction detected. Check current-room door list.';
 }else if(action==='DOOR'){const [d,v]=arg.split('|');need(dm&&Object.hasOwn(s.doors,d)&&['OPEN','CLOSED','OBSTRUCTED'].includes(v));s.doors[d]=v;note=d+' · '+v;
 }else if(action==='ROOM'){need(dm&&Object.hasOwn(rooms,arg));need(!s.playing);if(['Director','Laboratory'].includes(arg))need(s.step>=12,'Laboratory access required.');if(arg==='Archive')need(s.step>=13,'Archive access required.');if(arg==='ISB'&&s.step<14){s.room=arg;note='ISB office selected; reception reader required for authorization.';}else{s.room=arg;const deck={Reception:'Primary',Laboratory:'Lab',Archive:'Archive',ISB:'ISB',Director:'Director'}[arg];if(deck)s.deck=deck;note='Local interface moved to '+arg;}
 }else if(action==='BLUE'){s.legacy=true;note='CODE CLEARANCE BLUE RECEIVED. LEGACY IMPERIAL AUTHENTICATION. THIS IS AN OLDER CODE, BUT IT CHECKS OUT. GENERAL ACCESS GRANTED. OMEGA RESEARCH ACCESS REMAINS RESTRICTED.';
 }else if(action==='EQUIPMENT'){need(s.step>=8);s.equipment=true;note='Security Equipment Room released.';
 }else if(action==='PARTS'){need(dm&&s.step>=8);s.parts=true;note='Instrument consignment received.';
 }else if(action==='REPAIR'){need(dm&&s.step>=12&&s.parts);s.repaired=true;note='Analysis bench calibrated. Sample reader ready.';
 }else if(action==='SCAN'||action==='SAVE SCAN'){need(s.deck==='Lab'&&s.repaired&&Object.hasOwn(scans(s),arg));if(action==='SCAN'){s.lastScan=arg;if(s.campaign==='MEN'&&['Glitch','Crosseye'].includes(arg))s.matches[arg]=true;note=arg+' · '+scans(s)[arg];}else{need(s.lastScan===arg,'Scan this specimen before saving.');s.saved[arg]=true;note='Sample filed in this session.';}
 }else if(action==='SHOW OBJECTIVE'){need(dm&&s.step<17&&arg===currentObjectiveId(s)&&objectivePending(s,arg)&&(!s.objectiveReveal||s.objectiveReveal===arg),'Current objective unavailable. Review the operator panel.');s.objectiveReveal=arg;note='Objective displayed.';
 }else if(action==='HIDE OBJECTIVE'){need(dm);s.objectiveReveal='';note='Objective withdrawn.';
 }else if(action==='HINT'){need(dm&&clues[s.step]&&[0,1,2].includes(+arg));s.hint=clues[s.step][+arg];note=s.hint;
 }else if(action==='BOARD AID'){need(dm&&s.step>=4);s.boardAid=true;note='Accessible board description enabled during frame playback.';
 }else if(['fast','mute','hold'].includes(action)){need(dm);s[action]=!s[action];note='Operator setting updated.';
 }else throw Error('Unknown operation.');
 if(action==='FINISH'&&Number(arg)!==7)note=({1:'IMPERIAL SECURITY AUTHENTICATION · Authorization cylinder: NOT DETECTED · Research archive access: RESTRICTED',2:'NETWORK DIAGNOSTIC · Local terminal: OPERATIONAL · Server connection: OFFLINE · Remote research archive: UNAVAILABLE · Fault location: Server Room',3:'ISB SECURITY AUTHENTICATION REQUIRED · Registered duty location: ISB Officer’s Office',4:'MULTIFACTOR AUTHENTICATION · ISB security credentials: VERIFIED · Omega clearance: PENDING · Six-digit authorization key: REQUIRED',5:'ENVIRONMENTAL CONTROL SYSTEM · Ventilation relay 1 and 2: OFFLINE · Laboratory access: RESTRICTED',6:'CLASSIFIED RESEARCH ARCHIVE · Requested records: CLONE BATCH SIGMA · Storage medium: Physical data tape · Location: Imperial Research Archive Vault · Retrieval station: OFFLINE'})[Number(arg)]||note;
 if(action==='CONNECT SERVER')note='NETWORK CONNECTION RESTORED · Synchronization complete. RECORDING 003 AVAILABLE';if(action==='RELAY 2')note=relayTwoStatus;
 if(action==='POWER ARCHIVE')note='IMPERIAL RESEARCH ARCHIVE · Power supply: RESTORED · Mechanical systems: OPERATIONAL · Archive inventory: AVAILABLE · Outstanding maintenance ticket: Terminal broken again. Diagnostic findings: Terminal was unplugged. Corrective action: Connected power. Technical expertise required: NONE. Ticket automatically closed.';if(action==='RELAY 1')note=relayOneStatus;
 reconcileObjective(s);if(!['SHOW OBJECTIVE','HIDE OBJECTIVE'].includes(action))s.notice=note;s.revision++;s.log=[...s.log.slice(-59),{at:now,who,action:action==='AUTH'?'Authorization code validated':action,detail:action==='AUTH'?'':String(arg)}];return s;
}
