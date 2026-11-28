// Presentation only. Existing engine gates and stored scan outcomes remain authoritative.
export const analysisFolderAvailable=s=>s.step>=8&&['Primary','ISB'].includes(s.deck);
export const scannerReadyHere=s=>s.step>=12&&s.deck==='ISB'&&s.repaired===true;
export function directorReadiness(s){
 return {sigma:s.step>=16&&!!s.inserted?.['CLONE BATCH SIGMA'],arrived:s.deck==='Director'&&s.room==='Director',cylinder:!!s.directorCylinder,closed:s.doors?.['Director office door']==='CLOSED'};
}
export function recordingGroups(s,recordings,playable){
 const available=[],replays=[];
 for(let id=1;id<recordings.length;id++)if(playable(s,id))(s.seen?.[id]===true?replays:available).push(id);
 return {available,replays};
}
export function recordingStatus(s,id,playable){if(s.playing===id)return 'PLAYBACK IN PROGRESS';if(s.seen?.[id]===true)return 'REVIEWED — REPLAY AVAILABLE';return playable(s,id)?'AVAILABLE — NEW':'ACCESS DENIED'}
export const workstationNames={Primary:'RECEPTION',ISB:'ISB',Archive:'ARCHIVE',Director:'RESEARCH DIRECTOR'};
export function analysisPageAfterRepair(before,after,page){
 if(before?.step>0&&after.step===0)return 'Home';
 if(before?.deck!==after.deck)return page==='Analysis'&&scannerReadyHere(after)||page==='Analysis'&&after.deck==='ISB'&&after.step>=12?'Analysis':'Home';
 return page;
}
const adultReports={
 Glitch:['UNCONFIRMED','ELEVATED','CONFIRMED — MG-1842','Subject matches existing research specimen.'],
 Crosseye:['CLONE','ELEVATED','CONFIRMED — MG-6931','Subject matches existing research specimen.'],
 Erik:['TRANDOSHAN','NORMAL','NONE','Ordinary result.'],
 T0DD:['INORGANIC','NOT APPLICABLE','NONE','Subject appears to be a defective, ambulatory can opener.\nCorrection: Partially ambulatory.'],
 Ryan:['HUMAN','AVERAGE','NONE','Evidence of recent high-voltage exposure detected. Subject emitting sparks during scan.'],
 Chris:['DUROS','ELEVATED','NONE','Subject meets preliminary research criteria.'],
 Merg:['HUMAN','VERY HIGH','UNAVAILABLE','Registry determination unavailable.'],
 Ben:['RODIAN','VERY HIGH','UNAVAILABLE','Recalibrating ethanol sensor. Fictional BAC 0.67%.'],
 Sam:['UNKNOWN','UNKNOWN','UNDETERMINED','WARNING: UNSTABLE. No classification issued.']
};
export function structuredScan(campaign,name,raw){
 if(typeof raw!=='string'||!raw)return null;
 const row=campaign==='MEN'?adultReports[name]:null;
 if(campaign==='MEN'&&!row)return null;
 const [species,count,registry,note]=row||['UNCLASSIFIED','UNKNOWN','UNAVAILABLE',raw];
 return {subject:name.toUpperCase(),species,count,registry,note,...(campaign==='MEN'&&name==='T0DD'?{classification:true,condition:'DEFECTIVE',missing:'RIGHT LEG',warning:'NO BIOLOGICAL SAMPLE DETECTED.'}:{}),tone:campaign==='MEN'&&name==='Sam'?'critical':/^(ELEVATED|VERY HIGH)$/.test(count)?'warning':'normal'};
}

import {humorousAdministrativeRecords} from './content.mjs';
const administrativeRecords=new Set(['Staff directory','Property office','Refreshments','Droid port','Security abstract','Legacy duty circular','Laboratory inventory','Previous service ticket']);
export const isAdministrativeRecord=name=>administrativeRecords.has(name)||Object.hasOwn(humorousAdministrativeRecords,name);
export function administrativePage(names,reviewed,requested=0){const unread=names.filter(n=>!reviewed.has('record:'+n)),viewed=names.filter(n=>reviewed.has('record:'+n)),pages=Math.max(1,Math.ceil(unread.length/6)),index=Math.max(0,Math.min(pages-1,requested));return {unread:unread.slice(index*6,index*6+6),viewed,index,pages,totalUnread:unread.length}}
export function partitionRecords(names){return {important:names.filter(n=>!isAdministrativeRecord(n)),routine:names.filter(isAdministrativeRecord)}}
export const discoveryTone=(key,reviewed,action=false)=>action?'advance':reviewed.has(key)?'reviewed':'new';
export const scanPhases=['Acquiring biological sample...','Analyzing M-count...','Querying Imperial specimen registry...'];
export function scanResultCue(state){return state.campaign==='MEN'&&state.lastScan==='Sam'?'denied':state.matches?.[state.lastScan]?'match':'scan'}

// Local minigame model. No per-frame network writes; only final successful lock is submitted.
export function newCalibration(){return {x:-.58,y:.43,time:0,lock:1,stability:0,inside:false,axis:'',remaining:0,nextPulse:3,done:false,events:[]}}
export function tickCalibration(previous,seconds,keys,enabled,random=Math.random){
 const m={...previous,events:[]};if(m.done)return m;const dt=Math.max(0,Math.min(.05,seconds));m.time+=dt;
 if(!enabled){m.axis='';m.remaining=0;m.nextPulse=m.time+3}else if(m.remaining>0){m.remaining=Math.max(0,m.remaining-dt);if(!m.remaining){m.axis='';m.nextPulse=m.time+(m.lock===1?3:2)+random()*2}}else if(m.time>=m.nextPulse){m.axis=random()<.5?'horizontal':'vertical';m.remaining=.4+random()*.3;m.events.push('interference')}
 const duration=m.lock===1?2:3,frac=Math.min(1,m.stability/duration),speed=.20+(m.lock===2?.13:0)+frac*.30;
 const dx=(keys.d?1:0)-(keys.a?1:0),dy=(keys.down?1:0)-(keys.up?1:0);
 const clamp=v=>Math.max(-.97,Math.min(.97,v));m.x=clamp(m.x+dt*(Math.sin(m.time*2.3+.4)*speed+(m.axis==='horizontal'?0:dx*.96)));m.y=clamp(m.y+dt*(Math.cos(m.time*1.87+1)*speed+(m.axis==='vertical'?0:dy*.96)));
 const inside=Math.abs(m.x)<=.16&&Math.abs(m.y)<=.16;if(inside){if(!m.inside)m.events.push('target');m.stability+=dt}else{if(m.inside&&m.stability>0)m.events.push('lost');m.stability=0}m.inside=inside;
 if(m.stability+1e-8>=duration){if(m.lock===1){m.lock=2;m.stability=0;m.x=.53;m.y=-.46;m.inside=false;m.axis='';m.remaining=0;m.nextPulse=m.time+2.5;m.events.push('lock1')}else{m.stability=duration;m.done=true;m.events.push('lock2')}}return m;
}

// V21: local presentation, not a new story gate.
export const chamberPages=['Analysis','Specimens','Saved results','Sample','Scan dossier'];
export const archiveDiscoveryRows=[
 ['RECORDING 006 COMPLETE','normal'],['Analyzing associated research references...','normal'],['Searching classified archive index...','normal'],['1 RESTRICTED RECORD MATCH FOUND','new'],['CLONE BATCH SIGMA','title'],['CLASSIFICATION: TOP SECRET','critical'],['Authorizing researcher: Dr. Veyra Kest','normal'],['Requesting researcher: Dr. Pershing','normal'],['Subject: Surviving experimental specimens','normal'],['Documentation: Experimental histories','normal'],['Attempting remote document access...','normal'],['ACCESS DENIED','critical'],['Electronic copies unavailable. Original documentation retained on secured physical media.','normal'],['Locating original documentation...','normal'],['PHYSICAL DATA TAPE LOCATED','new'],['Location: Imperial Research Archive Vault','normal'],['ON SITE','onsite']
];
export const archiveProtocolRows=[['SECURE MEDIA RETRIEVAL PROTOCOL','title'],['01. Locate the Imperial Research Archive Vault.','normal'],['02. Retrieve the original Clone Batch Sigma data tape.','normal'],["03. Authenticate the tape at the ISB officer's terminal.",'normal'],['Unauthorized duplication or destruction of research documentation is strictly prohibited.','critical']];
export const archiveReferenceAvailable=s=>s.step>=13&&s.step<17&&s.seen?.[6]===true;
