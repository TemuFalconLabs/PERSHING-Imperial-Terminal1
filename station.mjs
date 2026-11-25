import {files,tapes,code,media,recordings} from './content.mjs';
import {route,rooms,stages,recordingAt,physical,scans,validSave} from './engine.mjs';
import {localSession,networkSession,newCode,cacheKey} from './session.mjs';
const $=id=>document.getElementById(id), params=new URLSearchParams(location.search),standalone=document.documentElement.hasAttribute('data-offline'),dm=standalone||params.has('dm'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let host,s,net,localPlayer=false,page='Home',selected='',query='',lastActivity=Date.now(),busy=false,renderTicket=0,mediaKey='',audioCtx,muted=false;
const player=()=>!dm||localPlayer;
const el=(tag,txt='',parent)=>{const n=document.createElement(tag);n.textContent=txt;if(parent)parent.append(n);return n};
function button(node,label,fn){const b=el('button',label,node);b.type='button';b.onclick=()=>{if(!player()||!busy)Promise.resolve().then(fn).catch(report)};return b}
function report(e){$('error').textContent=e?.message||String(e)}
function beep(alarm=false){if(s?.mute||muted||reduced||!audioCtx||audioCtx.state!=='running')return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=alarm?196:520;g.gain.value=.035;g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+(alarm?.55:.08));o.start();o.stop(audioCtx.currentTime+(alarm?.6:.1))}
function activity(){lastActivity=Date.now()}
function wake(e){if(!$('saver').hidden){e?.preventDefault();e?.stopImmediatePropagation();$('saver').hidden=true;activity();$('command').focus();try{audioCtx||=new AudioContext();audioCtx.resume().catch(()=>{})}catch{};return true}}
for(const event of ['keydown','pointerdown'])document.addEventListener(event,e=>{activity();if(wake(e))return;if(busy&&player()){e.preventDefault();e.stopImmediatePropagation()}},true);
$('saver').onclick=wake;
$('insignia').innerHTML='<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" stroke-width="8"/>'+Array.from({length:6},(_,i)=>'<path d="M45 8h10v21l5 5-7 10h-6l-7-10 5-5z" transform="rotate('+i*60+' 50 50)"/>').join('')+'<circle cx="50" cy="50" r="9"/></svg>';
function bounce(t){if(!$('saver').hidden){const pos=(size,rate)=>{let m=Math.max(1,size-76),d=(t*rate)%(2*m);return reduced?m/2:Math.min(d,2*m-d)};$('insignia').style.transform='translate('+pos(innerWidth,.049)+'px,'+pos(innerHeight,.037)+'px)'}requestAnimationFrame(bounce)}requestAnimationFrame(bounce);
setInterval(()=>{if(s&&player()&&!busy&&!s.playing&&s.step<17&&Date.now()-lastActivity>90000)$('saver').hidden=false},2000);
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
 const first=!s,changed=s?.revision!==state.revision,alarm=s&&s.step<17&&state.step>=17;
 s=state;net=info;$('setup').hidden=true;$('work').hidden=false;$('link').textContent=info.local?'LOCAL':(!info.connected?'RECONNECTING':info.peer?'CONNECTED · BOTH STATIONS':'CONNECTED · PEER AWAY');
 if(changed){$('notice').textContent=s.notice;if(!first)beep(alarm);activity()}
 if(first||changed){if(alarm||s.step>=17)$('saver').hidden=true;draw()}else if(dm&&!localPlayer)dashboard();
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
 $('board').hidden=player();$('monitor').hidden=!player();
 if(!player()){dashboard();return}
 const out=$('choices');out.replaceChildren();$('commandForm').hidden=!!s.playing||(s.deck==='Archive'&&s.step<14);
 if(s.playing){playback();return}
 mediaKey='';$('crumb').textContent=s.deck+' / '+page;$('heading').textContent=page;
 const btn=(label,fn)=>button(out,label,fn), go=(p)=>btn(p,()=>selectPage(p));
 if(s.step>=17){$('heading').textContent=s.step===18?'Unexpected specimen activity':'Biohazard alert';textOut(s.step===18?'Emergency routes: return via the entrance or follow the cave exit. Movement reported in the laboratory.':'Airborne contaminant detected. Emergency channel open.');if(localPlayer)btn('Operator view',toggleView);return}
 if(s.deck==='Archive'){
   $('heading').textContent=s.step>=14?'Tape elevator':'Retrieval station';textOut(s.step>=14?'Select a carrier for mechanical delivery. Decryption requires the primary reader.':'Display dark.');
   if(s.step>=14)Object.keys(tapes).filter(x=>page!=='Search'||x.includes(query.toUpperCase())).forEach(x=>btn('Retrieve '+x,()=>retrieve(x)));
   btn('Return to primary station',()=>act('DECK','Primary'));
 }else if(page==='Home'){
   textOut('Local directories available. Select a directory or enter HELP.');go('Media Archive');go('Records');go('Doors');go('Status');
 }else if(page==='Media Archive'){textOut('One local index mounted.');go('Research Recordings')}
 else if(page==='Research Recordings'){textOut('Select a recording to play.');for(let i=1;i<recordings.length;i++)if(s.step>=recordingAt[i])btn('Play '+rid(i)+' · '+recordings[i][0],()=>act('PLAY',i))}
 else if(page==='Records'||page==='Search'){const names=Object.keys(files(s)).filter(x=>page!=='Search'||(x+' '+files(s)[x]).toLowerCase().includes(query.toLowerCase()));textOut(names.length?'Available records':'No local records match.');names.forEach(x=>btn(x,()=>selectPage('Read',x)))}
 else if(page==='Read'){const body=files(s)[selected];$('heading').textContent=body?selected:'Record unavailable';textOut(body||'Access unavailable.')}
 else if(page==='Doors'){textOut('Current room · '+s.room+'\n'+rooms[s.room].map(d=>d+' · '+s.doors[d]).join('\n')+'\nSecurity Equipment Room · '+(s.equipment?'RELEASED':'SEALED'));if(s.step>=8){btn('Close current room',closeDoors);btn('Release equipment room',()=>act('EQUIPMENT'))}}
 else if(page==='Analysis'&&s.repaired){textOut('Select a subject for local analysis.');Object.keys(scans(s)).forEach(name=>btn('Scan '+name,()=>scan(name)))}
 else if(page==='Sample'&&s.repaired){textOut(selected+' · '+scans(s)[selected]+'\nSave specimen to this session?');btn('Save specimen',async()=>{await act('SAVE SCAN',selected);nav('Analysis')});go('Analysis')}
 else if(page==='Status'){textOut(s.notice+(s.hint?'\n'+s.hint:''))}
 else {textOut('DIR · OPEN <directory or file> · SEARCH <text> · PLAY <record> · STATUS · DOORS'+(s.step>=6?' · AUTH <code>':'')+(s.repaired?' · SCAN <subject>':''))}
 if(s.deck==='Primary'){
   if(s.step===7)btn('Enter authorization code',()=>{const v=prompt('Six-digit facility authorization');if(v)return act('AUTH',v.trim())});
   if(s.step>=13)btn('Use archive station',()=>act('DECK','Archive'));
   Object.keys(s.retrieved).forEach(x=>btn('Insert '+x,()=>act('INSERT',x)));
   if(s.repaired&&page!=='Analysis')go('Analysis');if(page!=='Home')go('Home');
 }
 btn(muted?'Enable sound':'Mute sound',()=>{muted=!muted;draw()});if(localPlayer)btn('Operator view',toggleView);
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
 const duration=id===7?37000:lines.length*8000;
 let av=null;const paths=media[id];
 if(paths.video||paths.audio){av=el(paths.video?'video':'audio','',target);av.src=paths.video||paths.audio;av.muted=muted||s.mute;av.onended=()=>{elapsed=duration};av.onerror=()=>{av?.remove();av=null;last=performance.now()};av.play().catch(()=>{if(av){av.remove();av=null}})}
 const pause=button(box,'Pause',()=>{paused=!paused;pause.textContent=paused?'Resume':'Pause';if(av){if(paused)av.pause();else av.play().catch(report)}});
 pausePlayback=()=>pause.click();
 button(box,'Replay from start',()=>{elapsed=0;if(av)av.currentTime=0;paused=false;pause.textContent='Pause';av?.play().catch(report)});
 if(localPlayer)button(box,'Operator view',toggleView);
 async function frame(now){
   if(mediaKey!==key||s.playing!==id||!player())return;
   if(!paused){elapsed+=Math.min(1000,now-last)*(s.fast?12:1);if(av&&Number.isFinite(av.duration))elapsed=duration*av.currentTime/av.duration}
   last=now;const frac=Math.min(1,elapsed/duration),i=Math.min(lines.length-1,Math.floor(frac*lines.length));
   transcript.textContent=speaker+'  /  '+lines[i];meter.value=frac*lines.length;
   chalk.hidden=!(id===3&&frac>=.32);if(!chalk.hidden){chalk.textContent='rack Ⅲ     '+code.board+'     Δ';if(s.boardAid)chalk.setAttribute('aria-label','Frame description: blackboard reads '+code.board);else chalk.setAttribute('aria-hidden','true');if(s.boardAid)chalk.removeAttribute('aria-hidden')}
   if(frac===1&&!finishing){finishing=true;try{if(id===7)await new Promise(r=>setTimeout(r,700));await act('FINISH',id)}catch(e){report(e);button(box,'Confirm playback completion',()=>act('FINISH',id))}return}
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
 if(s.step>=10)op(main,s.hold?'Release crisis hold':'Hold crisis','hold');
 const session=card('Session');el('p',net.code+' · '+(net.local?'Local rehearsal':net.peer?'Player connected':'Awaiting player'),session);
 if(net.local)button(session,'Player view',toggleView);
 else {let link=new URL(location.href);link.searchParams.delete('dm');let a=el('a','Player link',session);a.href=link.href;a.style.color='var(--mint)';button(session,'Continue on this laptop offline',()=>{if(confirm('Start an independent offline copy of this checkpoint?')){location.href='?dm&offline='+net.code}})}
 op(session,s.fast?'Normal output':'Fast mode','fast');op(session,s.mute?'Enable station sound':'Mute station','mute');
 const hints=card('Operator assistance');if(s.step<18)[1,2,3].forEach(i=>op(hints,'Hint '+i,'HINT',i-1));if(s.step>=4)op(hints,'Accessible board clue','BOARD AID');
 const sys=card('Facility');el('p','Server '+(s.step>=4?'online':'offline')+' · relays '+(s.step>=11?2:s.step>=10?1:0)+'/2 · bench '+(s.repaired?'ready':s.parts?'parts received':'offline'),sys);
 if(s.step>=8&&!s.parts)op(sys,'Register scanner parts','PARTS');if(s.parts&&s.step>=12&&!s.repaired)op(sys,'Calibrate repaired bench','REPAIR');
 el('p','Retrieved: '+(Object.keys(s.retrieved).join(', ')||'none')+' · Sigma '+(s.step>=16?'inserted':'pending'),sys);
 const doors=card('Room & doors');let room=el('select','',doors);room.ariaLabel='Playback room';Object.keys(rooms).forEach(r=>room.add(new Option(r,r,false,r===s.room)));room.onchange=()=>act('ROOM',room.value).catch(report);
 for(const [d,v] of Object.entries(s.doors)){const row=el('label',d+' ',doors),sel=el('select','',row);['OPEN','CLOSED','OBSTRUCTED'].forEach(x=>sel.add(new Option(x,x,false,x===v)));sel.onchange=()=>act('DOOR',d+'|'+sel.value).catch(report)}
 const archive=card('Recording index');for(let i=1;i<=7;i++){let label=rid(i)+' · '+(s.playing===i?'playing':s.seen[i]?'completed':s.step>=recordingAt[i]?'available':'sealed');if(s.step>=recordingAt[i])op(archive,label,'PLAY',i);else el('div',label,archive)}
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
   if(v.startsWith('RETRIEVE '))return retrieve(v.slice(9));if(v==='PRIMARY')return act('DECK','Primary');throw Error('Use DIR, SEARCH, RETRIEVE or PRIMARY.')
 }
 if(['AUTH BLUE','CODE BLUE','CODE CLEARANCE BLUE','AUTHORIZATION CODE BLUE'].includes(v))return act('BLUE');
 if(v.startsWith('AUTH '))return act('AUTH',v.slice(5));
 if(v==='DIR'||v==='HOME')return selectPage('Home');
 if(v==='HELP')return selectPage('Help');if(v==='STATUS')return selectPage('Status');if(v==='DOORS')return selectPage('Doors');
 if(v==='CLOSE CURRENT ROOM')return closeDoors();
 if(v==='UNLOCK SECURITY EQUIPMENT ROOM')return act('EQUIPMENT');
 if(v.startsWith('SEARCH ')){query=raw.slice(7);selectPage('Search');return}
 if(v.startsWith('OPEN ')){const path=v.slice(5);
   const options=['Media Archive','Research Recordings','Doors','Records','Status',...(s.repaired?['Analysis']:[])];
   const name=options.find(k=>k.toUpperCase()===path);if(name)return selectPage(name);
   const doc=Object.keys(files(s)).find(k=>k.toUpperCase()===path);if(doc)return selectPage('Read',doc);
 }
 const m=v.match(/^(?:PLAY|REPLAY) (?:REC-)?0*([1-7])$/);if(m)return act('PLAY',m[1]);
 if(v==='ARCHIVE')return act('DECK','Archive');if(v.startsWith('INSERT '))return act('INSERT',v.slice(7));
 if(v.startsWith('SCAN ')&&s.repaired){let key=Object.keys(scans(s)).find(k=>k.toUpperCase()===v.slice(5).replace(/^TODD$/,'T0DD'));if(key)return scan(key)}
 if(['WHOAMI','PLEASE','ADMIN'].includes(v))return textOut({WHOAMI:'Unregistered duty operator.',PLEASE:'Magic word accepted. Authorization still denied.',ADMIN:'Nice try.'}[v],true);
 throw Error('Entry unavailable. Use DIR to browse or HELP for commands.')
}
$('commandForm').onsubmit=e=>{e.preventDefault();if(busy)return;let value=$('command').value;$('command').value='';$('error').textContent='';command(value).catch(report)};
if('serviceWorker' in navigator&&!params.has('emulator'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
