import {files,tapes,code,media,recordings} from './content.mjs';
import {route,rooms,stages,recordingAt,physical,scans,validSave,canPlay,objective,biohazardAlert} from './engine.mjs';
import {localSession,networkSession,newCode,cacheKey} from './session.mjs';
const $=id=>document.getElementById(id), params=new URLSearchParams(location.search),standalone=document.documentElement.hasAttribute('data-offline'),dm=standalone||params.has('dm'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let host,s,net,localPlayer=false,page='Home',selected='',query='',lastActivity=Date.now(),busy=false,renderTicket=0,mediaKey='',audioCtx,muted=false;
const player=()=>!dm||localPlayer;
const el=(tag,txt='',parent)=>{const n=document.createElement(tag);n.textContent=txt;if(parent)parent.append(n);return n};
function button(node,label,fn){const b=el('button',label,node);b.type='button';b.onclick=()=>{if(!player()||!busy)Promise.resolve().then(fn).catch(report)};return b}
// Original, synthesized Imperial-style UI effects. No files, network or speech synthesis.
const cuePatterns={
 tap:[[0,.045,420,250,'triangle',.035]],
 key:[[0,.025,780,520,'square',.009]],
 wake:[[0,.11,180,310,'triangle',.045],[.11,.12,460,690,'sine',.045],[.24,.14,820,920,'triangle',.025]],
 denied:[[0,.15,175,105,'sawtooth',.035],[.19,.19,145,85,'square',.022]],
 approval:[[0,.09,440,560,'triangle',.045],[.11,.10,650,810,'triangle',.04]],
 unlock:[[0,.09,320,420,'triangle',.045],[.11,.10,520,660,'triangle',.04],[.23,.16,780,1040,'sine',.045]],
 link:[[0,.07,210,370,'square',.014],[.09,.07,450,680,'square',.014],[.19,.14,680,940,'triangle',.04]],
 relay:[[0,.15,95,58,'triangle',.05],[.08,.13,260,190,'sawtooth',.018],[.24,.12,450,660,'triangle',.035]],
 archive:[[0,.23,145,65,'triangle',.04],[.21,.08,250,180,'square',.015],[.33,.09,660,810,'triangle',.035]],
 scan:[[0,.19,360,930,'sine',.035],[.21,.16,930,460,'sine',.027]],
 match:[[0,.11,440,550,'triangle',.035],[.13,.11,660,800,'triangle',.035],[.27,.19,960,1120,'sine',.04]],
 playback:[[0,.07,350,480,'triangle',.03],[.08,.09,680,820,'sine',.025]],
 complete:[[0,.08,720,540,'sine',.03],[.10,.11,460,330,'triangle',.03]],
 door:[[0,.13,130,65,'triangle',.05],[.14,.07,420,270,'triangle',.025]],
 alarm:[[0,.42,180,330,'sawtooth',.055],[.53,.42,180,330,'sawtooth',.055],[1.06,.42,180,330,'sawtooth',.055]],
 crisis:[[0,.19,220,125,'triangle',.045],[.23,.19,220,125,'triangle',.045]]
};
function cueForState(before,after){
 if(!before||!after)return null;
 if(before.step<17&&after.step===17)return 'alarm';
 if(before.step<18&&after.step===18)return 'crisis';
 if(after.step>=17)return null;
 if(after.playing&&after.playing!==before.playing)return 'playback';
 if(before.playing&&!after.playing)return 'complete';
 const n=after.notice||'';
 if(after.playing)return null;
 if(/Authorization accepted|EXECUTIVE|Executive credentials|ISB SECURITY CREDENTIAL VERIFIED|CODE CLEARANCE BLUE|Sample filed/.test(n))return 'approval';
 if(/Obstruction detected| · OBSTRUCTED/.test(n))return 'denied';
 if(/NETWORK CONNECTION RESTORED/.test(n))return 'link';
 if(/ENVIRONMENTAL RELAY/.test(n))return 'relay';
 if(/Carrier delivered|IMPERIAL RESEARCH ARCHIVE · Power supply/.test(n))return 'archive';
 if(/TAPE AUTHENTICATED|Cylinder mounted|Equipment Room released|Analysis bench calibrated/.test(n))return 'unlock';
 if(after.lastScan&&n.startsWith(after.lastScan+' · '))return after.matches?.[after.lastScan]?'match':'scan';
 if(/Current room closed| · CLOSED$| · OPEN$/.test(n))return 'door';
 if(after.step>before.step)return 'unlock';
 return null;
}
let audioBus,queuedCue='',finalSilence=false,lastShortCue=0;
function soundAllowed(){return !muted&&!s?.mute&&!finalSilence&&(player()||standalone||net?.local)}
function syncAudio(){
 if(audioBus)audioBus.gain.setValueAtTime(soundAllowed()?1:0,audioCtx.currentTime);
 const b=$('soundToggle');if(b){b.textContent=s?.mute?'Sound muted by operator':muted?'Enable sound':'Mute sound';b.disabled=!!s?.mute;b.setAttribute('aria-pressed',String(!!(muted||s?.mute)))}
 const av=$('screen').querySelector('video,audio');if(av)av.muted=!!(muted||s?.mute);
}
function playCue(name){
 if(!name||!soundAllowed()||audioCtx?.state!=='running'||!audioBus||!cuePatterns[name])return;
 if(name==='key'||name==='tap'){const now=Date.now();if(now-lastShortCue<32)return;lastShortCue=now}
 const t=audioCtx.currentTime+.004;
 for(const [delay,duration,start,end,type,level] of cuePatterns[name]){
   const o=audioCtx.createOscillator(),g=audioCtx.createGain(),at=t+delay;
   o.type=type;o.frequency.setValueAtTime(start,at);o.frequency.exponentialRampToValueAtTime(end,at+duration);
   g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(level,at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+duration);
   o.connect(g);g.connect(audioBus);o.onended=()=>{o.disconnect();g.disconnect()};o.start(at);o.stop(at+duration+.005);
 }
}
function gestureCue(name){
 if(!soundAllowed())return;
 try{
   if(!audioCtx){const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return;audioCtx=new AudioCtor();audioBus=audioCtx.createGain();audioBus.connect(audioCtx.destination);syncAudio()}
   if(audioCtx.state==='running'){queuedCue='';playCue(name);return}
   if(name)queuedCue=name;
   audioCtx.resume().then(()=>{const pending=queuedCue;queuedCue='';playCue(pending)}).catch(()=>{});
 }catch{} // Sound is optional; unsupported audio must not interrupt the station.
}
function report(e){$('error').textContent=e?.message||String(e);playCue('denied')}
function activity(){lastActivity=Date.now()}
function wake(e){if(!$('saver').hidden){e?.preventDefault();e?.stopImmediatePropagation();$('saver').hidden=true;activity();$('command').focus();gestureCue('wake');return true}}
for(const event of ['keydown','pointerdown'])document.addEventListener(event,e=>{activity();if(wake(e))return;if(busy&&player()){e.preventDefault();e.stopImmediatePropagation();return}const button=e.target.closest?.('button');if(event==='pointerdown')gestureCue(button&&!button.disabled?'tap':null);else if((button&&(e.key==='Enter'||e.key===' '))||e.key==='Enter')gestureCue('tap');else gestureCue(null)},true);
// Touch browsers may only grant audio activation at pointer-up/click.
for(const event of ['pointerup','click','touchend'])document.addEventListener(event,()=>{if(audioCtx?.state!=='running'&&queuedCue)gestureCue(null)},true);
document.addEventListener('input',e=>{if(['command','codeInput'].includes(e.target.id))gestureCue('key')},true);
$('soundToggle').onclick=()=>{muted=!muted;syncAudio();if(!muted)gestureCue('approval')};
$('saver').onclick=wake;
document.addEventListener('pointermove',()=>{if($('saver').hidden)activity()},{passive:true});
// Six-spoke Imperial cog, redrawn from the Galactic Empire crest reference.
// https://www.starwars.com/news/5-symbols-in-the-star-wars-universe
// https://commons.wikimedia.org/wiki/File:Emblem_of_the_First_Galactic_Empire.svg
$('insignia').innerHTML='<svg viewBox="0 0 100 100" aria-hidden="true" fill="currentColor"><circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="50" cy="50" r="21"/>'+Array.from({length:6},(_,i)=>'<g transform="rotate('+i*60+' 50 50)"><path d="M30 16 A39.45 39.45 0 0 1 70 16 L64 26 L56 22 L56 35 L44 35 L44 22 L36 26 Z"/><path d="M44 27 H56 V50 H44 Z"/></g>').join('')+'</svg>';
function bounce(t){if(!$('saver').hidden){const pos=(size,rate)=>{let m=Math.max(1,size-76),d=(t*rate)%(2*m);return reduced?m/2:Math.min(d,2*m-d)};$('insignia').style.transform='translate('+pos(innerWidth,.049)+'px,'+pos(innerHeight,.037)+'px)'}requestAnimationFrame(bounce)}requestAnimationFrame(bounce);
const SAVER_IDLE_MS=60000;
function shouldShowSaver(state,isPlayer,isBusy,idleMs){return !!state&&isPlayer&&!isBusy&&!state.playing&&state.step<17&&idleMs>=SAVER_IDLE_MS}
setInterval(()=>{if(shouldShowSaver(s,player(),busy,Date.now()-lastActivity))$('saver').hidden=false},250);
async function act(a,arg=''){if(!host)throw Error('Connecting…');$('error').textContent='';await host.send(a,String(arg),player()?'PLAYER':'DM')}
function nav(p,sel=''){page=p;selected=sel;mediaKey='';draw()}
function textOut(str,animate=false){
 const ticket=++renderTicket,out=$('screen');busy=false;out.textContent=str;
 if(!animate||s.fast||reduced||!str)return;
 busy=true;out.textContent='PROCESSING …';const start=performance.now()+750,ms=Math.min(3200,str.length*14);
 function tick(now){if(ticket!==renderTicket)return;if(now>=start){out.textContent=str.slice(0,Math.ceil(str.length*Math.min(1,(now-start)/ms)));if(now>=start+ms){busy=false;return}}requestAnimationFrame(tick)}requestAnimationFrame(tick)
}
function selectPage(p,sel=''){nav(p,sel);if(!s.playing)textOut($('screen').textContent,true)}
function receive(state,info){
 const before=s,first=!s,changed=s?.revision!==state.revision,alarm=s&&s.step<17&&state.step>=17;
 const moved=s?.deck!==state.deck;s=state;net=info;if(moved){page='Home';selected='';mediaKey=''}$('setup').hidden=true;$('work').hidden=false;$('link').textContent=info.local?'LOCAL':(!info.connected?'RECONNECTING':info.peer?'CONNECTED · BOTH STATIONS':'CONNECTED · PEER AWAY');
 if(!s.playing)finalSilence=false;syncAudio();if(changed){$('notice').textContent=s.notice;if(!first)playCue(cueForState(before,s));activity()}
 if(first||changed){if(alarm||s.playing||s.step>=17)$('saver').hidden=true;draw()}else if(dm&&!localPlayer)dashboard();
 if(first&&player()&&!s.playing&&s.step<17)$('saver').hidden=false;
}
async function connect(create=false,local=false,source=''){
 $('error').textContent='';const codeId=create?newCode():$('codeInput').value.trim().toUpperCase();if(!local&&!/^[A-Z2-9]{8}$/.test(codeId))throw Error('Enter the eight-character code from the DM.');
 const campaign=$('camp').value;$('link').textContent='CONNECTING';
 try{host=local?localSession(campaign,source,receive):await networkSession({dm,code:codeId,campaign,create,emulate:params.has('emulator'),update:receive,error:report});
 if(!local){params.set('session',codeId);history.replaceState(null,'','?'+params);localStorage.setItem(dm?'pershing.lastDM':'pershing.lastPlayer',codeId)}
 }catch(e){$('link').textContent='CONNECTION FAILED';throw Error('Station could not connect. '+e.message)}
}
$('setupTitle').textContent=dm?'Open operator watch':'Join duty station';$('title').textContent=dm?'Watch supervisor':'Duty station';
$('codeInput').value=params.get('session')||'';$('dmSetup').hidden=!dm;
$('join').onsubmit=e=>{e.preventDefault();connect().catch(report)};
$('create').onclick=()=>connect(true).catch(report);$('local').onclick=()=>connect(false,true).catch(report);
if(standalone){$('join').hidden=true;$('create').hidden=true;$('setupTitle').textContent='Local watch · select campaign';$('local').textContent='Open offline station'}
if(dm){const last=localStorage.getItem('pershing.lastDM');if(last&&localStorage.getItem(cacheKey(last)))button($('recover'),'Continue offline from '+last,()=>connect(false,true,last))}
if(params.has('session'))connect().catch(report);
function draw(){
 if(!s)return;document.body.classList.toggle('emergency',s.step>=17);
 $('top').textContent=(player()?s.deck.toUpperCase()+' STATION':'WATCH CONTROL · '+s.campaign)+'   /   '+net.code;
 $('board').hidden=player();$('monitor').hidden=!player();syncAudio();
 if(!player()){dashboard();return}
 const out=$('choices');out.replaceChildren();$('objective').textContent=s.step<17?'CURRENT OBJECTIVE\n'+objective(s):'';$('dmReminder').hidden=![1,3,5,7,9,10,11,13,16,17].includes(s.step)||!!s.playing;$('commandForm').hidden=!!s.playing||(s.deck==='Archive'&&s.step<14);
 if(s.playing){playback();return}
 mediaKey='';$('crumb').textContent=s.deck+' / '+page;$('heading').textContent=page;
 const btn=(label,fn)=>button(out,label,fn), go=(p)=>btn(p,()=>selectPage(p));
 if(s.step>=17){$('heading').textContent=s.step===18?'Unexpected specimen activity':'Biohazard alert';textOut(s.step===18?'Emergency routes: return via the entrance or follow the cave exit. Movement reported in the laboratory.':biohazardAlert);if(localPlayer)btn('Operator view',toggleView);return}
 if(s.deck==='Archive'){
   $('heading').textContent=s.step>=14?'Tape elevator':'Retrieval station';textOut(s.step>=14?'Select a carrier for mechanical delivery. Decryption requires the ISB officer’s terminal.':'Display dark.');
   if(s.step>=14)Object.keys(tapes).filter(x=>!s.retrieved[x]&&!s.inserted[x]&&(page!=='Search'||x.includes(query.toUpperCase()))).forEach(x=>btn('Retrieve '+x,()=>retrieve(x)));
   if(s.step>=14)btn('Return to ISB officer’s terminal',()=>act('DECK','ISB'));
   btn('Return to laboratory workstation',()=>act('DECK','Lab'));
 }else if(s.deck==='Director'){
   $('heading').textContent='Research Director’s terminal';textOut(!s.directorCylinder?'EXECUTIVE AUTHENTICATION REQUIRED\nInsert the Research Director’s security cylinder.':!s.inserted['CLONE BATCH SIGMA']?'Executive credentials verified. Classified archive authorization pending.':s.doors['Director office door']!=='CLOSED'?'Security cylinder detected...\nExecutive credentials verified.\nCONFIDENTIAL TRANSMISSION AVAILABLE\nPRIVACY PROTOCOL ACTIVE\nClose the office door to authorize playback.':'PRIVACY CHECK COMPLETE\nCONFIDENTIAL PLAYBACK AVAILABLE');if(canPlay(s,7)&&s.doors['Director office door']==='CLOSED')btn('Play REC-007',()=>act('PLAY',7));btn('Return to laboratory workstation',()=>act('DECK','Lab'));
 }else if(page==='Home'){
   textOut(s.deck==='ISB'?(s.inserted['CLONE BATCH SIGMA']?'CLONE BATCH SIGMA — AVAILABLE RECORDS\nIndividual specimen records available upon biological specimen scan.':'ISB OFFICER’S READER\nInsert retrieved archive tape to decrypt.'):'Local directories available. Select a directory or enter HELP.');if(s.deck!=='ISB')go('Media Archive');if(s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA'])go('Clone Batch Sigma');go('Records');go('Doors');go('Status');go('Help');
 }else if(page==='Media Archive'){textOut('One local index mounted.');go('Research Recordings')}
 else if(page==='Research Recordings'){textOut('Select a recording to play.');for(let i=1;i<recordings.length;i++)if(canPlay(s,i))btn('Play '+rid(i)+' · '+recordings[i][0],()=>act('PLAY',i))}
 else if(page==='Clone Batch Sigma'&&s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA']){textOut('CLONE BATCH SIGMA — AVAILABLE RECORDS\nIndividual specimen records available upon biological specimen scan.');const names=s.campaign==='MEN'?['Specimen Transfer Ledger','Drellis Minor Recovery Operation','Crime Lord Morgan','Research Oversight Authorization']:['Specimen Transfer Ledger','Transfer receipt'];for(const name of names)if(files(s)[name])btn(name,()=>selectPage('Read',name));}
 else if(page==='Records'||page==='Search'){const names=Object.keys(files(s)).filter(x=>page!=='Search'||(x+' '+files(s)[x]).toLowerCase().includes(query.toLowerCase()));textOut(names.length?'Available records':'No local records match.');names.forEach(x=>btn(x,()=>selectPage('Read',x)))}
 else if(page==='Read'){const body=files(s)[selected];$('heading').textContent=body?selected:'Record unavailable';textOut(body||'Access unavailable.')}
 else if(page==='Doors'){textOut('Current room · '+s.room+'\n'+rooms[s.room].map(d=>d+' · '+s.doors[d]).join('\n')+'\nSecurity Equipment Room · '+(s.equipment?'RELEASED':'SEALED'));if(s.step>=8){btn('Close current room',closeDoors);btn('Release equipment room',()=>act('EQUIPMENT'))}}
 else if(page==='Analysis'&&s.repaired&&s.deck==='Lab'){textOut('Select a subject for local analysis.');Object.keys(scans(s)).forEach(name=>btn('Scan '+name,()=>scan(name)));go('Saved results');for(const name of Object.keys(s.matches))if(s.matches[name])btn('Individual specimen record — '+name,()=>selectPage('Read','Individual specimen record — '+name))}
 else if(page==='Saved results'&&s.deck==='Lab'&&s.repaired){const names=Object.keys(s.saved).filter(n=>s.saved[n]);textOut(names.length?names.map(n=>n+' · '+scans(s)[n]).join('\n\n'):'No saved specimens.');go('Analysis')}
 else if(page==='Sample'&&s.repaired&&s.deck==='Lab'&&s.lastScan===selected){textOut(selected+' · '+scans(s)[selected]+'\nSAVE SPECIMEN TO RESEARCH DATABASE?');if(s.matches[selected])btn('View individual specimen record',()=>selectPage('Read','Individual specimen record — '+selected));btn('Yes — save locally',async()=>{await act('SAVE SCAN',selected);nav('Analysis')});btn('No — discard',()=>nav('Analysis'));go('Analysis')}
 else if(page==='Status'){textOut(s.notice+(s.hint?'\n'+s.hint:''))}
 else {textOut('DIR · OPEN <directory or file> · SEARCH <text> · PLAY <record> · STATUS · DOORS'+(s.step>=6?' · AUTH <code>':'')+(s.repaired?' · SCAN <subject>':''))}
 if(s.deck!=='Archive'&&s.deck!=='Director'){
   if(s.deck==='Primary'&&s.step===7&&s.card)btn('Enter authorization code',()=>{const v=prompt('Six-digit facility authorization');if(v)return act('AUTH',v.trim())});
   if(s.step>=13)btn('Use archive station',()=>act('DECK','Archive'));if(s.step>=12&&s.deck!=='Lab')btn('Return to laboratory workstation',()=>act('DECK','Lab'));if(s.step>=12&&s.deck!=='Primary')btn('Return to reception terminal',()=>act('DECK','Primary'));if(s.step>=14&&s.deck!=='ISB')btn('Return to ISB officer’s terminal',()=>act('DECK','ISB'));
   if(s.deck==='ISB')Object.keys(s.retrieved).filter(x=>!s.inserted[x]).forEach(x=>btn('Insert '+x,async()=>{await act('INSERT',x);nav(x==='CLONE BATCH SIGMA'?'Clone Batch Sigma':'Read',x)}));
   if(s.deck==='Lab'&&s.repaired&&page!=='Analysis')go('Analysis');if(s.deck==='Lab'&&canPlay(s,6)&&!s.seen[6]&&page!=='Research Recordings')btn('Play REC-006 · Experimental procedures',()=>act('PLAY',6));if(page!=='Home')go('Home');
 }
 if(localPlayer)btn('Operator view',toggleView);
}
function rid(i){return 'REC-'+String(i).padStart(3,'0')}
function closeDoors(){if(confirm('Close the doors serving '+s.room+'?'))return act('CLOSE')}
async function retrieve(x){$('screen').classList.add('retrieving');try{textOut('Carriage moving…');await new Promise(r=>setTimeout(r,s.fast||reduced?0:900));await act('RETRIEVE',x)}finally{$('screen').classList.remove('retrieving')}}
async function scan(name){await act('SCAN',name);nav('Sample',name)}
function toggleView(){localPlayer=!localPlayer;nav('Home');if(localPlayer&&s.step<17&&!s.playing)$('saver').hidden=false;else $('saver').hidden=true}
let pausePlayback=()=>{};
function playback(){
 const id=s.playing,key=net.code+':'+id;if(mediaKey===key)return;mediaKey=key;busy=false;++renderTicket;
 $('crumb').textContent='Media Archive / Research Recordings';$('heading').textContent=rid(id)+' · '+recordings[id][0];
 const target=$('screen');target.replaceChildren();const [title,speaker,lines]=recordings[id];
 const transcript=el('p','',target),chalk=el('div','',target);chalk.className='chalk';chalk.hidden=true;
 const meter=el('progress','',target),box=el('div','',target);meter.max=lines.length;
 let elapsed=0,paused=false,last=performance.now(),finishing=false;
 const lineTimes=lines.map(l=>Math.max(4500,l.length*58));const duration=lineTimes.reduce((n,v)=>n+v,0);
 let av=null;const paths=media[id];
 if(paths.video||paths.audio){av=el(paths.video?'video':'audio','',target);av.src=paths.video||paths.audio;av.muted=muted||s.mute;av.onended=()=>{elapsed=duration};av.onerror=()=>{av?.remove();av=null;last=performance.now()};av.play().catch(()=>{if(av){av.remove();av=null}})}
 const pause=button(box,'Pause',()=>{paused=!paused;pause.textContent=paused?'Resume':'Pause';if(av){if(paused)av.pause();else av.play().catch(report)}});
 pausePlayback=()=>pause.click();
 button(box,'Replay from start',()=>{elapsed=0;if(av)av.currentTime=0;paused=false;pause.textContent='Pause';av?.play().catch(report)});
 if(localPlayer)button(box,'Operator view',toggleView);
 async function frame(now){
   if(mediaKey!==key||s.playing!==id||!player())return;
   if(!paused){elapsed+=Math.min(1000,now-last)*(s.fast?12:1);if(av&&Number.isFinite(av.duration))elapsed=duration*av.currentTime/av.duration}
   last=now;const frac=Math.min(1,elapsed/duration),i=Math.max(0,lineTimes.findIndex((_,i)=>elapsed<lineTimes.slice(0,i+1).reduce((n,v)=>n+v,0)));
   transcript.textContent=speaker+'  /  '+lines[frac===1?lines.length-1:i];meter.value=frac*lines.length;
   chalk.hidden=!(id===3&&frac>=.32);if(!chalk.hidden){chalk.textContent='rack Ⅲ     '+code.board+'     Δ';if(s.boardAid)chalk.setAttribute('aria-label','Frame description: blackboard reads '+code.board);else chalk.setAttribute('aria-hidden','true');if(s.boardAid)chalk.removeAttribute('aria-hidden')}
   if(frac===1&&!finishing){finishing=true;try{if(id===7){transcript.textContent='';chalk.hidden=true;finalSilence=true;syncAudio();await new Promise(r=>setTimeout(r,s.fast?100:3000));}await act('FINISH',id)}catch(e){finalSilence=false;syncAudio();report(e);button(box,'Confirm playback completion',()=>act('FINISH',id))}return}
   requestAnimationFrame(frame)
 }requestAnimationFrame(frame)
}
function dashboard(){
 const board=$('board');board.replaceChildren();
 const card=(title)=>{let n=el('section','',board);n.className='card';el('h3',title,n);return n};
 const main=card(stages[s.step]||'Watch');el('p',s.step+'/18 · '+(route[s.step]||'Encounter underway'),main);
 el('p',s.playing?'Currently playing '+rid(s.playing):'Awaiting '+(physical.includes(route[s.step])?'physical confirmation':'player interaction'),main);
 const op=(n,label,a,arg='')=>button(n,label,()=>act(a,arg));
 if(physical.includes(route[s.step]))button(main,route[s.step],()=>{if(route[s.step]!=='BEGIN CRISIS'||confirm('Cue the reanimations now?'))return act(route[s.step])});
 if(s.danger){const clock=el('p','',main);clock.id='dangerClock';clock.dataset.time=s.danger;updateClock()}
 if(s.step>=5&&s.step<8&&!s.card)op(main,'Confirm authorization card recovered','CARD');if(s.step>=12&&s.deck==='Director'&&!s.directorCylinder)op(main,'Confirm Director’s cylinder inserted','DIRECTOR CYLINDER');
 if(s.step>=10)op(main,s.hold?'Release crisis hold':'Hold crisis','hold');
 const session=card('Session');el('p',net.code+' · '+(net.local?'Local rehearsal':net.peer?'Player connected':'Awaiting player'),session);
 if(net.local)button(session,'Player view',toggleView);
 else {let link=new URL(location.href);link.searchParams.delete('dm');let a=el('a','Player link',session);a.href=link.href;a.style.color='var(--mint)';button(session,'Continue on this laptop offline',()=>{if(confirm('Start an independent offline copy of this checkpoint?')){location.href='?dm&offline='+net.code}})}
 op(session,s.fast?'Normal output':'Fast mode','fast');op(session,s.mute?'Enable station sound':'Mute station','mute');
 const hints=card('Operator assistance');if(s.step<18)[1,2,3].forEach(i=>op(hints,'Hint '+i,'HINT',i-1));if(s.step>=4)op(hints,'Accessible board clue','BOARD AID');
 const sys=card('Facility');el('p','Server '+(s.step>=4?'online':'offline')+' · relays '+(s.step>=11?2:s.step>=10?1:0)+'/2 · bench '+(s.repaired?'ready':s.parts?'parts received':'offline'),sys);
 if(s.step>=8&&!s.parts)op(sys,'Register scanner parts','PARTS');if(s.parts&&s.step>=12&&!s.repaired)op(sys,'Calibrate repaired bench','REPAIR');
 el('p','In possession: '+(Object.keys(s.retrieved).join(', ')||'none')+' · Inserted: '+(Object.keys(s.inserted).join(', ')||'none'),sys);
 const doors=card('Room & doors');let room=el('select','',doors);room.ariaLabel='Physical station / room';Object.keys(rooms).forEach(r=>room.add(new Option(r,r,false,r===s.room)));room.onchange=()=>act('ROOM',room.value).catch(report);
 for(const [d,v] of Object.entries(s.doors)){const row=el('label',d+' ',doors),sel=el('select','',row);['OPEN','CLOSED','OBSTRUCTED'].forEach(x=>sel.add(new Option(x,x,false,x===v)));sel.onchange=()=>act('DOOR',d+'|'+sel.value).catch(report)}
 const archive=card('Recording index');for(let i=1;i<=7;i++){let label=rid(i)+' · '+(s.playing===i?'playing':s.seen[i]?'completed':s.step>=recordingAt[i]?'available':'sealed');if(canPlay(s,i))op(archive,label,'PLAY',i);else el('div',label,archive)}
 const recovery=card('Checkpoints');button(recovery,'Export checkpoint',()=>{const href=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:'application/json'}));const a=el('a');a.href=href;a.download='pershing-'+net.code+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(href),1000)});
 const saved=JSON.parse(localStorage.getItem(cacheKey(net.code)+'.checkpoints')||'{}');
 for(const [key,label] of [['beforeCirculation','Before relay 2'],['beforeTransmission','Before final playback']])if(saved[key])button(recovery,'Restore: '+label,()=>{if(confirm('Restore '+label+'?'))return act('IMPORT',JSON.stringify(saved[key]))});
 let load=el('input','',recovery);load.type='file';load.accept='.json';load.ariaLabel='Import checkpoint';load.onchange=async()=>{try{const v=JSON.parse(await load.files[0].text());if(!validSave(v)||v.campaign!==s.campaign)throw Error('Incompatible checkpoint.');if(confirm('Restore this campaign checkpoint?'))await act('IMPORT',JSON.stringify(v))}catch(e){report(e)}};
 for(const [label,action] of [['Undo last action','UNDO'],['Force next gate','ADVANCE'],['Reset session','RESET']])button(recovery,label,()=>{if(confirm(label+' for '+net.code+'?'))return act(action)});
 const history=card('Watch log');for(const row of s.log.slice(-12).reverse())el('div',new Date(row.at).toLocaleTimeString()+' · '+row.who+' · '+row.action+' '+row.detail,history)
}
function updateClock(){let n=$('dangerClock');if(n)n.textContent='Circulation elapsed · '+Math.max(0,Math.floor((Date.now()-Number(n.dataset.time))/60000))+' min · manual cue'}setInterval(updateClock,3000);
if(dm&&params.has('offline'))connect(false,true,params.get('offline')).catch(report);
async function command(value){
 let raw=value.trim().replace(/\s+/g,' '),v=raw.toUpperCase();
 if(s.playing){if(v==='PAUSE')pausePlayback();return}
 if(s.deck==='Archive'&&s.step<14)return;
 if(s.deck==='Archive'){
   if(v==='DIR'){nav('Archive');return}if(v.startsWith('SEARCH ')){query=raw.slice(7);nav('Search');return}
   if(v.startsWith('RETRIEVE '))return retrieve(v.slice(9));if(v==='ISB')return act('DECK','ISB');if(v==='LAB')return act('DECK','Lab');throw Error('Use DIR, SEARCH, RETRIEVE, ISB or LAB.')
 }
 if(['AUTH BLUE','CODE BLUE','CODE CLEARANCE BLUE','AUTHORIZATION CODE BLUE'].includes(v))return act('BLUE');
 if(/^\d{6}$/.test(v))return act('AUTH',v);if(v.startsWith('AUTH '))return act('AUTH',v.slice(5));
 if(v==='DIR'||v==='HOME')return selectPage('Home');
 if(v==='HELP')return selectPage('Help');if(v==='STATUS')return selectPage('Status');if(v==='DOORS')return selectPage('Doors');
 if(v==='CLOSE CURRENT ROOM')return closeDoors();
 if(v==='UNLOCK SECURITY EQUIPMENT ROOM')return act('EQUIPMENT');
 if(v.startsWith('SEARCH ')){query=raw.slice(7);selectPage('Search');return}
 if(v.startsWith('OPEN ')){const path=v.slice(5);
   const options=['Media Archive','Research Recordings','Doors','Records','Status','Help',...(s.deck==='Lab'&&s.repaired?['Analysis','Saved results']:[]),...(s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA']?['Clone Batch Sigma']:[])];
   const name=options.find(k=>k.toUpperCase()===path);if(name==='Research Recordings'&&!s.seen[1]&&page!=='Media Archive')throw Error('Select the parent media directory first.');if(name)return selectPage(name);
   const doc=Object.keys(files(s)).find(k=>k.toUpperCase()===path);if(doc)return selectPage('Read',doc);
 }
 const m=v.match(/^(?:PLAY|REPLAY) (?:REC-)?0*([1-7])$/);if(m){if(+m[1]===1&&!s.seen[1]&&page!=='Research Recordings')throw Error('Select the local recording directory first.');return act('PLAY',m[1])}
 if(v==='ARCHIVE')return act('DECK','Archive');if(v==='ISB')return act('DECK','ISB');if(v==='LAB')return act('DECK','Lab');if(v.startsWith('INSERT '))return act('INSERT',v.slice(7));
 if(v.startsWith('SCAN ')&&s.deck==='Lab'&&s.repaired){let key=Object.keys(scans(s)).find(k=>k.toUpperCase()===v.slice(5).replace(/^TODD$/,'T0DD'));if(key)return scan(key)}
 if(['WHOAMI','PLEASE','ADMIN'].includes(v))return textOut({WHOAMI:'Unregistered duty operator.',PLEASE:'Magic word accepted. Authorization still denied.',ADMIN:'Nice try.'}[v],true);
 throw Error('Entry unavailable. Use DIR to browse or HELP for commands.')
}
$('commandForm').onsubmit=e=>{e.preventDefault();if(busy)return;let value=$('command').value;$('command').value='';$('error').textContent='';command(value).catch(report)};
if('serviceWorker' in navigator&&!params.has('emulator'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
