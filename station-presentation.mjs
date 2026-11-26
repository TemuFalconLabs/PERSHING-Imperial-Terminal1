// Presentation only. Existing engine gates and stored scan outcomes remain authoritative.
export const analysisFolderAvailable=s=>s.step>=8&&['Primary','Lab','ISB'].includes(s.deck);
export const scannerReadyHere=s=>s.step>=12&&s.deck==='Lab'&&s.repaired===true;
export function directorReadiness(s){
 return {sigma:s.step>=16&&!!s.inserted?.['CLONE BATCH SIGMA'],arrived:s.deck==='Director'&&s.room==='Director',cylinder:!!s.directorCylinder,closed:s.doors?.['Director office door']==='CLOSED'};
}
export function recordingGroups(s,recordings,playable){
 const available=[],replays=[];
 for(let id=1;id<recordings.length;id++)if(playable(s,id))(s.step>=9&&s.seen?.[id]?replays:available).push(id);
 return {available,replays};
}
export function analysisPageAfterRepair(before,after,page){
 if(before?.step>0&&after.step===0)return 'Home';
 if(before?.deck!==after.deck)return page==='Analysis'&&scannerReadyHere(after)||page==='Analysis'&&after.deck==='Lab'&&after.step>=12?'Analysis':'Home';
 return page;
}
const adultReports={
 Glitch:['UNCONFIRMED','ELEVATED','CONFIRMED — MG-1842','Subject matches existing research specimen.'],
 Crosseye:['CLONE','ELEVATED','CONFIRMED — MG-6931','Subject matches existing research specimen.'],
 Erik:['TRANDOSHAN','NORMAL','NONE','Ordinary result.'],
 T0DD:['INORGANIC','NOT APPLICABLE','NONE','Subject appears to be a defective, ambulatory can opener.\nCorrection: Partially ambulatory.'],
 Ryan:['HUMAN','AVERAGE','NONE','Ordinary result.'],
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

const administrativeRecords=new Set(['Staff directory','Property office','Refreshments','Droid port','Security abstract','Legacy duty circular','Laboratory inventory','Previous service ticket']);
export const isAdministrativeRecord=name=>administrativeRecords.has(name);
export function partitionRecords(names){return {important:names.filter(n=>!isAdministrativeRecord(n)),routine:names.filter(isAdministrativeRecord)}}
export const discoveryTone=(key,reviewed,action=false)=>action?'advance':reviewed.has(key)?'reviewed':'new';
export const scanPhases=['Acquiring biological sample...','Analyzing M-count...','Querying Imperial specimen registry...'];
export function scanResultCue(state){return state.campaign==='MEN'&&state.lastScan==='Sam'?'denied':state.matches?.[state.lastScan]?'match':'scan'}
