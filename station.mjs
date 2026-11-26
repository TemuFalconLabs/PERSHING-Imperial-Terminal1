import {findEgg,eggReply,newEggHistory} from './easter-eggs.mjs';
import {files,tapes,code,media,recordings} from './content.mjs';
import {route,rooms,stages,recordingAt,physical,scans,validSave,canPlay,objective,biohazardAlert} from './engine.mjs';
import {localSession,networkSession,newCode,cacheKey} from './session.mjs';
const $=id=>document.getElementById(id), params=new URLSearchParams(location.search),standalone=document.documentElement.hasAttribute('data-offline'),dm=standalone||params.has('dm'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let host,s,net,localPlayer=false,page='Home',selected='',query='',lastActivity=Date.now(),busy=false,renderTicket=0,mediaKey='',audioCtx,muted=false;
let eggHistory=newEggHistory();
const player=()=>!dm||localPlayer;
const el=(tag,txt='',parent)=>{const n=document.createElement(tag);n.textContent=txt;if(parent)parent.append(n);return n};
function button(node,label,fn,shortcut=''){const b=el('button',label,node);b.type='button';if(shortcut)b.dataset.command=shortcut;b.onclick=()=>{if(player()&&(busy||commandPending))return;Promise.resolve().then(()=>shortcut?autoCommand(shortcut,fn):fn()).catch(report)};return b}
// Local presentation only: each shortcut invokes its existing guarded action once.
let commandPending=false;
function echoCommand(value){$('commandEcho').hidden=false;$('commandEchoText').textContent=value}
function displayCommand(value){const v=value.trim();return /^(?:AUTH\s+)?\d{6}$/i.test(v)?'AUTH ******':v.toUpperCase()}
function commandTypingPlan(value,instant){return instant?{step:value.length||1,delay:0}:{step:Math.max(1,Math.ceil(value.length/23)),delay:44}}
async function autoCommand(value,fn){
 if(commandPending||busy||!s||!player()||s.playing)return;
 commandPending=true;const revision=s.revision,deck=s.deck,session=net.code,input=$('command'),draft=input.value,previousReadonly=input.readOnly;
 const valid=()=>player()&&s.revision===revision&&s.deck===deck&&net.code===session&&!s.playing;
 input.readOnly=true;input.value='';echoCommand('');$('error').textContent='';
 const plan=commandTypingPlan(value,s.fast||reduced);
 try{
  for(let i=plan.step;i<value.length+plan.step;i+=plan.step){
   if(!valid())return;
   const fragment=value.slice(0,i);input.value=fragment;echoCommand(fragment);
   if(plan.delay){playCue('key');await new Promise(resolve=>setTimeout(resolve,plan.delay))}
  }
  if(!valid())return;
  input.value=draft;input.readOnly=previousReadonly;
  await fn();
 }finally{input.value=draft;input.readOnly=previousReadonly;commandPending=false}
}
function prepareManual(prefix){const input=$('command');input.value=prefix;input.focus();input.setSelectionRange(prefix.length,prefix.length)}
// Original, synthesized Imperial-style UI effects. No files, network or speech synthesis.
const cuePatterns={
 tap:[[0,.075,820,390,'triangle',.065]],
 key:[[0,.026,510,460,'triangle',.013],[.003,.016,270,245,'sine',.005]],
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
 crisis:[[0,.19,360,210,'triangle',.045],[.23,.19,360,210,'triangle',.045]],
 test:[[0,.12,620,820,'triangle',.07],[.16,.13,850,1100,'triangle',.07],[.34,.18,1120,840,'sine',.07]]
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
let audioBus,humBus,humOsc=[],finalSilence=false,lastShortCue=0,fallbackAudio=null,audioDetail='Tap Test sound to check output.',audioAttempt=0;
const cueWavs=new Map();
// Browser-provided speech, not a recorded media asset. Voice availability varies by device.
const voiceProfiles={
 1:{gender:'male',rate:.94,pitch:.90,preferred:/nigel|daniel|george|ryan/i},
 2:{gender:'male',rate:1.00,pitch:.85,preferred:/craig|arthur|oliver|ryan/i},
 3:{gender:'female',rate:.92,pitch:1.03,preferred:/penelope|kate|sonia|hazel/i},
 4:{gender:'male',rate:.90,pitch:.78,preferred:/roderic|george|daniel|ryan/i},
 5:{gender:'male',rate:1.02,pitch:1.10,preferred:/liam|oliver|arthur|ryan/i},
 6:{gender:'female',rate:.91,pitch:.90,preferred:/prudence|hazel|kate|sonia/i},
 7:{gender:'male',rate:1.05,pitch:.83,preferred:/alistaire|daniel|george|ryan/i},
 8:{gender:'female',rate:.94,pitch:1.07,preferred:/sonia|kate|hazel|female/i}
};
function chooseSpeechVoice(voices,id){
 const profile=voiceProfiles[id],uk=voices.filter(v=>/^en[-_]GB$/i.test(v.lang||'')),english=voices.filter(v=>/^en(?:[-_]|$)/i.test(v.lang||''));
 const pool=uk.length?uk:english;
 const gender=v=>/female|woman|kate|hazel|sonia|libby|susan|zira|victoria|samantha|moira|fiona/i.test(v.name)?'female':/male|man|daniel|george|ryan|oliver|arthur|david|james|thomas|guy/i.test(v.name)?'male':'unknown';
 // Prefer British, then requested voice type; unknown names are not assumed to have a gender.
 return pool.slice().sort((a,b)=>score(b)-score(a))[0]||null;
 function score(v){return (gender(v)===profile.gender?8:gender(v)==='unknown'?2:0)+(profile.preferred.test(v.name)?4:0)+(v.localService?1:0)}
}
const synth=window.speechSynthesis;
let speechJob=null,announcementTicket=0;
try{synth?.getVoices()}catch{}
function narrationAllowed(){return !!synth&&typeof window.SpeechSynthesisUtterance==='function'&&player()&&!muted&&!s?.mute&&!s?.fast&&!finalSilence}
function cancelSpeech(){const job=speechJob;speechJob=null;if(job){job.u.onend=null;job.u.onerror=null;try{synth.cancel()}catch{}}}
function speakParagraph(text,id,onEnd,onError){
 if(!narrationAllowed())return false;
 cancelSpeech();
 try{
  const u=new window.SpeechSynthesisUtterance(text),p=voiceProfiles[id],v=chooseSpeechVoice(synth.getVoices(),id);
  u.lang=v?.lang||'en-GB';if(v)u.voice=v;u.rate=p.rate;u.pitch=p.pitch;u.volume=.86;
  const job={u};speechJob=job;
  u.onend=()=>{if(speechJob!==job)return;speechJob=null;onEnd?.()};
  u.onerror=()=>{if(speechJob!==job)return;speechJob=null;onError?.()};
  synth.speak(u);return true;
 }catch{cancelSpeech();return false}
}
function cancelAnnouncement(){announcementTicket++;cancelSpeech()}
function announce(text,delay=0){
 const ticket=++announcementTicket,session=net?.code,step=s?.step;
 setTimeout(()=>{if(ticket!==announcementTicket||net?.code!==session||s?.step!==step||!narrationAllowed()||s.playing)return;speakParagraph(text,8,()=>{},()=>{})},delay);
}

function soundAllowed(){return !muted&&!s?.mute&&!finalSilence&&!document.hidden&&(player()||standalone||net?.local)}
function cueLevel(level){return Math.min(.24,level*3.3)}
function audioStatus(message){if(message)audioDetail=message;const n=$('audioStatus');if(n)n.textContent=s?.mute?'Audio: muted by operator — use Mute station / Enable station sound.':muted?'Audio: muted on this device.':audioDetail}
function stopFallback(){if(fallbackAudio){fallbackAudio.pause();fallbackAudio=null}}
function syncAudio(){
 const allowed=soundAllowed();
 if(audioBus)audioBus.gain.setValueAtTime(allowed?1:0,audioCtx.currentTime);
 if(humBus)humBus.gain.setValueAtTime(allowed&&s&&player()&&!s.playing&&s.step<17&&$('saver').hidden?1:0,audioCtx.currentTime);
 if(!allowed)stopFallback();
 const b=$('soundToggle');if(b){b.textContent=s?.mute?'Sound muted by operator':muted?'Enable sound':'Mute sound';b.disabled=!!s?.mute;b.setAttribute('aria-pressed',String(!!(muted||s?.mute)))}
 const test=$('soundTest');if(test)test.disabled=!!(s?.mute||muted||finalSilence||s?.playing);
 const av=$('screen').querySelector('video,audio');if(av)av.muted=!!(muted||s?.mute);
 audioStatus();
}
function setupAudio(){
 if(audioCtx)return;
 const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return;
 audioCtx=new AudioCtor();audioBus=audioCtx.createGain();audioBus.connect(audioCtx.destination);
 humBus=audioCtx.createGain();humBus.gain.value=0;humBus.connect(audioBus);
 // Quiet continuous electronics bed, with harmonics that small phone speakers can reproduce.
 for(const [freq,level] of [[146,.009],[292,.014],[438,.006]]){
   const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=freq;g.gain.value=level;o.connect(g);g.connect(humBus);o.start();humOsc.push(o);
 }
 audioCtx.onstatechange=()=>{syncAudio();if(audioCtx.state==='running')audioStatus('Audio engine running · tap Test sound to audition.');else audioStatus('Audio engine '+audioCtx.state+' · tap Test sound to resume.')};
 syncAudio();
}
function wavForCue(name){
 if(cueWavs.has(name))return cueWavs.get(name);
 const notes=cuePatterns[name],rate=22050,size=Math.ceil(rate*(Math.max(...notes.map(n=>n[0]+n[1]))+.025));
 const bytes=new Uint8Array(44+2*size),v=new DataView(bytes.buffer),mix=new Float32Array(size);
 const tag=(offset,str)=>{for(let i=0;i<str.length;i++)bytes[offset+i]=str.charCodeAt(i)};
 tag(0,'RIFF');v.setUint32(4,36+size*2,true);tag(8,'WAVE');tag(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);tag(36,'data');v.setUint32(40,size*2,true);
 for(const [delay,duration,start,end,type,level] of notes){
   const offset=Math.round(delay*rate),length=Math.floor(duration*rate);let phase=0;
   for(let i=0;i<length;i++){
     const t=i/rate;phase+=2*Math.PI*start*Math.pow(end/start,t/duration)/rate;
     const x=Math.sin(phase),wave=type==='square'?Math.sign(x):type==='triangle'?2/Math.PI*Math.asin(x):type==='sawtooth'?2*(phase/(2*Math.PI)-Math.floor(.5+phase/(2*Math.PI))):x;
     const envelope=Math.min(1,t/.008)*Math.max(0,1-t/duration)**1.3;
     mix[offset+i]+=wave*cueLevel(level)*envelope;
   }
 }
 for(let i=0;i<size;i++)v.setInt16(44+2*i,Math.round(Math.max(-1,Math.min(1,mix[i]))*32767),true);
 let raw='';for(let i=0;i<bytes.length;i+=4096)raw+=String.fromCharCode(...bytes.subarray(i,i+4096));
 const uri='data:audio/wav;base64,'+btoa(raw);cueWavs.set(name,uri);return uri;
}
function fallbackCue(name){
 if(!soundAllowed()||!cuePatterns[name])return;
 try{stopFallback();const a=new Audio(wavForCue(name));fallbackAudio=a;a.volume=1;
   const result=a.play();if(result?.then)result.then(()=>{if(fallbackAudio===a)audioStatus('Audio file fallback playing · confirm you can hear it.')}).catch(e=>{if(fallbackAudio===a)audioStatus('Audio blocked: '+(e.name||'playback error')+' · tap Test sound.')});
 }catch(e){audioStatus('Audio unavailable: '+(e.name||'playback error'))}
}
function playCue(name){
 if(!name||!soundAllowed()||!cuePatterns[name])return;
 if(name==='key'||name==='tap'){const now=Date.now();if(now-lastShortCue<36)return;lastShortCue=now}
 if(audioCtx?.state!=='running'||!audioBus){fallbackCue(name);return}
 try{
 const t=audioCtx.currentTime+.004;
 for(const [delay,duration,start,end,type,level] of cuePatterns[name]){
   const o=audioCtx.createOscillator(),g=audioCtx.createGain(),at=t+delay;
   o.type=type;o.frequency.setValueAtTime(start,at);o.frequency.exponentialRampToValueAtTime(end,at+duration);
   g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(cueLevel(level),at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+duration);
   o.connect(g);g.connect(audioBus);o.onended=()=>{o.disconnect();g.disconnect()};o.start(at);o.stop(at+duration+.005);
 }
 if(name==='test')audioStatus('Test tones sent to audio engine · confirm you can hear them.');
 }catch(e){fallbackCue(name)}
}
function gestureCue(name){
 if(!soundAllowed())return;
 const attempt=++audioAttempt;
 try{
   setupAudio();
   if(audioCtx?.state==='running'){syncAudio();playCue(name);return}
   // Start the file fallback synchronously in the actual user activation, not after resume().
   if(name)fallbackCue(name);
   if(audioCtx)audioCtx.resume().then(()=>{if(attempt===audioAttempt&&audioCtx.state==='running'){syncAudio();audioStatus('Audio engine running · tap Test sound to audition.')}}).catch(e=>{if(attempt===audioAttempt)audioStatus('Audio engine '+(e.name||'blocked')+' · file fallback available.')});
   else if(!name)audioStatus('Web Audio unavailable · tap Test sound for file fallback.');
 }catch(e){if(name)fallbackCue(name);else audioStatus('Audio startup failed · tap Test sound.')}
}
function report(e){$('error').textContent=e?.message||String(e);playCue('denied')}
function activity(){lastActivity=Date.now()}
function wake(e){if(!$('saver').hidden){e?.preventDefault();e?.stopImmediatePropagation();$('saver').hidden=true;activity();$('command').focus();syncAudio();gestureCue('wake');return true}}
// A touch click is the reliable mobile activation; do not consume it on pointerdown.
document.addEventListener('pointerdown',()=>activity(),true);
document.addEventListener('keydown',e=>{activity();if(wake(e))return;if((busy||commandPending)&&player()){e.preventDefault();e.stopImmediatePropagation();return}if(e.key==='Enter'&&e.target.id==='command')gestureCue('tap');else gestureCue(null)},true);
document.addEventListener('click',e=>{activity();if(wake(e))return;const button=e.target.closest?.('button');if((busy||commandPending)&&player()&&button?.id!=='soundToggle'&&button?.id!=='soundTest'){e.preventDefault();e.stopImmediatePropagation();return}if(button&&!button.disabled&&button.id!=='soundTest'&&button.id!=='soundToggle'&&!button.dataset.command)gestureCue('tap');else gestureCue(null)},true);
document.addEventListener('input',e=>{if(['command','codeInput'].includes(e.target.id))gestureCue('key')},true);
$('soundToggle').onclick=()=>{muted=!muted;if(muted)cancelAnnouncement();syncAudio();if(!muted)gestureCue('approval')};
$('soundTest').onclick=()=>gestureCue('test');
document.addEventListener('visibilitychange',()=>{syncAudio();if(document.hidden)cancelAnnouncement()});
$('saver').onclick=wake;
document.addEventListener('pointermove',()=>{if($('saver').hidden)activity()},{passive:true});
// Six-spoke Imperial cog, redrawn from the Galactic Empire crest reference.
// https://www.starwars.com/news/5-symbols-in-the-star-wars-universe
// https://commons.wikimedia.org/wiki/File:Emblem_of_the_First_Galactic_Empire.svg
$('insignia').innerHTML='<svg viewBox="0 0 100 100" aria-hidden="true" fill="currentColor"><circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="50" cy="50" r="21"/>'+Array.from({length:6},(_,i)=>'<g transform="rotate('+i*60+' 50 50)"><path d="M30 16 A39.45 39.45 0 0 1 70 16 L64 26 L56 22 L56 35 L44 35 L44 22 L36 26 Z"/><path d="M44 27 H56 V50 H44 Z"/></g>').join('')+'</svg>';
function bounce(t){if(!$('saver').hidden){const pos=(size,rate)=>{let m=Math.max(1,size-76),d=(t*rate)%(2*m);return reduced?m/2:Math.min(d,2*m-d)};$('insignia').style.transform='translate('+pos(innerWidth,.049)+'px,'+pos(innerHeight,.037)+'px)'}requestAnimationFrame(bounce)}requestAnimationFrame(bounce);
const SAVER_IDLE_MS=60000;
function shouldShowSaver(state,isPlayer,isBusy,idleMs){return !!state&&isPlayer&&!isBusy&&!state.playing&&state.step<17&&idleMs>=SAVER_IDLE_MS}
setInterval(()=>{if($('saver').hidden&&shouldShowSaver(s,player(),busy||commandPending,Date.now()-lastActivity)){$('saver').hidden=false;syncAudio()}},250);
async function act(a,arg=''){if(!host)throw Error('Connecting…');$('error').textContent='';await host.send(a,String(arg),player()?'PLAYER':'DM')}
function nav(p,sel=''){if(mediaKey)cancelAnnouncement();page=p;selected=sel;mediaKey='';draw()}
function textOut(str,animate=false){
 const ticket=++renderTicket,out=$('screen');busy=false;out.textContent=str;
 if(!animate||s.fast||reduced||!str)return;
 busy=true;playCue('link');out.textContent='PROCESSING …';const start=performance.now()+750,ms=Math.min(3200,str.length*14);
 function tick(now){if(ticket!==renderTicket)return;if(now>=start){out.textContent=str.slice(0,Math.ceil(str.length*Math.min(1,(now-start)/ms)));if(now>=start+ms){busy=false;return}}requestAnimationFrame(tick)}requestAnimationFrame(tick)
}
function selectPage(p,sel=''){nav(p,sel);if(!s.playing)textOut($('screen').textContent,true)}
function receive(state,info){
 const before=s,first=!s,changed=s?.revision!==state.revision,alarm=s&&s.step<17&&state.step>=17;
 const moved=s?.deck!==state.deck;if(first||net?.code!==info.code||(before?.step>0&&state.step===0))eggHistory=newEggHistory();s=state;net=info;if(moved){page='Home';selected='';mediaKey=''}$('setup').hidden=true;$('work').hidden=false;$('link').textContent=info.local?'LOCAL':(!info.connected?'RECONNECTING':info.peer?'CONNECTED · BOTH STATIONS':'CONNECTED · PEER AWAY');
 if(before&&(before.playing!==s.playing||before.step!==s.step||s.mute||s.fast))cancelAnnouncement();if(!s.playing)finalSilence=false;syncAudio();if(changed){$('notice').textContent=s.notice;if(!first)playCue(cueForState(before,s));activity()}
 if(first||changed){if(alarm||s.playing||s.step>=17)$('saver').hidden=true;draw()}else if(dm&&!localPlayer)dashboard();
 if(first&&player()&&!s.playing&&s.step<17)$('saver').hidden=false;syncAudio();
 if(!first&&alarm&&s.step===17)announce(biohazardAlert,1650);else if(!first&&before.step===10&&s.step===11)announce('Your safety is our priority.',400);
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
 const btn=(label,fn,shortcut='')=>button(out,label,fn,shortcut), go=(p)=>btn(p,()=>selectPage(p),p==='Home'?'DIR':['Help','Status','Doors'].includes(p)?p.toUpperCase():'OPEN '+p.toUpperCase());
 if(s.step>=17){$('heading').textContent=s.step===18?'Unexpected specimen activity':'Biohazard alert';textOut(s.step===18?'Emergency routes: return via the entrance or follow the cave exit. Movement reported in the laboratory.':biohazardAlert);if(localPlayer)btn('Operator view',toggleView);return}
 if(s.deck==='Archive'){
   $('heading').textContent=s.step>=14?'Tape elevator':'Retrieval station';textOut(s.step>=14?'Select a carrier for mechanical delivery. Decryption requires the ISB officer’s terminal.':'Display dark.');
   if(s.step>=14)Object.keys(tapes).filter(x=>!s.retrieved[x]&&!s.inserted[x]&&(page!=='Search'||x.includes(query.toUpperCase()))).forEach(x=>btn('Retrieve '+x,()=>retrieve(x),'RETRIEVE '+x));
   if(s.step>=14)btn('Return to ISB officer’s terminal',()=>act('DECK','ISB'),'ISB');
   btn('Return to laboratory workstation',()=>act('DECK','Lab'),'LAB');
 }else if(s.deck==='Director'){
   $('heading').textContent='Research Director’s terminal';textOut(!s.directorCylinder?'EXECUTIVE AUTHENTICATION REQUIRED\nInsert the Research Director’s security cylinder.':!s.inserted['CLONE BATCH SIGMA']?'Executive credentials verified. Classified archive authorization pending.':s.doors['Director office door']!=='CLOSED'?'Security cylinder detected...\nExecutive credentials verified.\nCONFIDENTIAL TRANSMISSION AVAILABLE\nPRIVACY PROTOCOL ACTIVE\nClose the office door to authorize playback.':'PRIVACY CHECK COMPLETE\nCONFIDENTIAL PLAYBACK AVAILABLE');if(canPlay(s,7)&&s.doors['Director office door']==='CLOSED')btn('Play REC-007',()=>act('PLAY',7),'PLAY REC-007');btn('Return to laboratory workstation',()=>act('DECK','Lab'),'LAB');
 }else if(page==='Home'){
   textOut(s.deck==='ISB'?(s.inserted['CLONE BATCH SIGMA']?'CLONE BATCH SIGMA — AVAILABLE RECORDS\nIndividual specimen records available upon biological specimen scan.':'ISB OFFICER’S READER\nInsert retrieved archive tape to decrypt.'):'Local directories available. Select a directory or enter HELP.');if(s.deck!=='ISB')go('Media Archive');if(s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA'])go('Clone Batch Sigma');go('Records');btn('Search records',()=>prepareManual('SEARCH '));go('Doors');go('Status');go('Help');
 }else if(page==='Media Archive'){textOut('One local index mounted.');go('Research Recordings')}
 else if(page==='Research Recordings'){textOut('Select a recording to play.');for(let i=1;i<recordings.length;i++)if(canPlay(s,i))btn('Play '+rid(i)+' · '+recordings[i][0],()=>act('PLAY',i),'PLAY '+rid(i))}
 else if(page==='Clone Batch Sigma'&&s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA']){textOut('CLONE BATCH SIGMA — AVAILABLE RECORDS\nIndividual specimen records available upon biological specimen scan.');const names=s.campaign==='MEN'?['Specimen Transfer Ledger','Drellis Minor Recovery Operation','Crime Lord Morgan','Research Oversight Authorization']:['Specimen Transfer Ledger','Transfer receipt'];for(const name of names)if(files(s)[name])btn(name,()=>selectPage('Read',name),'OPEN '+name.toUpperCase());}
 else if(page==='Records'||page==='Search'){const names=Object.keys(files(s)).filter(x=>page!=='Search'||(x+' '+files(s)[x]).toLowerCase().includes(query.toLowerCase()));textOut(names.length?'Available records':'No local records match.');names.forEach(x=>btn(x,()=>selectPage('Read',x),'OPEN '+x.toUpperCase()))}
 else if(page==='Read'){const body=files(s)[selected];$('heading').textContent=body?selected:'Record unavailable';textOut(body||'Access unavailable.')}
 else if(page==='Doors'){textOut('Current room · '+s.room+'\n'+rooms[s.room].map(d=>d+' · '+s.doors[d]).join('\n')+'\nSecurity Equipment Room · '+(s.equipment?'RELEASED':'SEALED'));if(s.step>=8){btn('Close current room',closeDoors,'CLOSE CURRENT ROOM');btn('Release equipment room',()=>act('EQUIPMENT'),'UNLOCK SECURITY EQUIPMENT ROOM')}}
 else if(page==='Analysis'&&s.repaired&&s.deck==='Lab'){textOut('Select a subject for local analysis.');Object.keys(scans(s)).forEach(name=>btn('Scan '+name,()=>scan(name),'SCAN '+name.toUpperCase()));go('Saved results');for(const name of Object.keys(s.matches))if(s.matches[name])btn('Individual specimen record — '+name,()=>selectPage('Read','Individual specimen record — '+name),'OPEN INDIVIDUAL SPECIMEN RECORD — '+name.toUpperCase())}
 else if(page==='Saved results'&&s.deck==='Lab'&&s.repaired){const names=Object.keys(s.saved).filter(n=>s.saved[n]);textOut(names.length?names.map(n=>n+' · '+scans(s)[n]).join('\n\n'):'No saved specimens.');go('Analysis')}
 else if(page==='Sample'&&s.repaired&&s.deck==='Lab'&&s.lastScan===selected){textOut(selected+' · '+scans(s)[selected]+'\nSAVE SPECIMEN TO RESEARCH DATABASE?');if(s.matches[selected])btn('View individual specimen record',()=>selectPage('Read','Individual specimen record — '+selected),'OPEN INDIVIDUAL SPECIMEN RECORD — '+selected.toUpperCase());btn('Yes — save locally',()=>saveCurrentScan(),'SAVE SCAN');btn('No — discard',()=>nav('Analysis'),'DISCARD SCAN');go('Analysis')}
 else if(page==='Status'){textOut(s.notice+(s.hint?'\n'+s.hint:''))}
 else {textOut('DIR · OPEN <directory or file> · SEARCH <text> · PLAY <record> · STATUS · DOORS'+(s.step>=6?' · AUTH <code>':'')+(s.repaired?' · SCAN <subject> · SAVE SCAN · DISCARD SCAN':'')+(s.step>=12?' · LAB · RECEPTION':'')+(s.step>=13?' · ARCHIVE':'')+(s.step>=14?' · ISB · INSERT <tape>':''))}
 if(s.deck!=='Archive'&&s.deck!=='Director'){
   if(s.deck==='Primary'&&s.step===7&&s.card)btn('Enter authorization code',()=>prepareManual('AUTH '));
   if(s.step>=13)btn('Use archive station',()=>act('DECK','Archive'),'ARCHIVE');if(s.step>=12&&s.deck!=='Lab')btn('Return to laboratory workstation',()=>act('DECK','Lab'),'LAB');if(s.step>=12&&s.deck!=='Primary')btn('Return to reception terminal',()=>act('DECK','Primary'),'RECEPTION');if(s.step>=14&&s.deck!=='ISB')btn('Return to ISB officer’s terminal',()=>act('DECK','ISB'),'ISB');
   if(s.deck==='ISB')Object.keys(s.retrieved).filter(x=>!s.inserted[x]).forEach(x=>btn('Insert '+x,()=>insertTape(x),'INSERT '+x));
   if(s.deck==='Lab'&&s.repaired&&page!=='Analysis')go('Analysis');if(s.deck==='Lab'&&canPlay(s,6)&&!s.seen[6]&&page!=='Research Recordings')btn('Play REC-006 · Experimental procedures',()=>act('PLAY',6),'PLAY REC-006');if(page!=='Home')go('Home');
 }
 if(localPlayer)btn('Operator view',toggleView);
}
function rid(i){return 'REC-'+String(i).padStart(3,'0')}
function closeDoors(){if(confirm('Close the doors serving '+s.room+'?'))return act('CLOSE')}
async function retrieve(x){$('screen').classList.add('retrieving');try{textOut('Carriage moving…');await new Promise(r=>setTimeout(r,s.fast||reduced?0:900));await act('RETRIEVE',x)}finally{$('screen').classList.remove('retrieving')}}
async function scan(name){await act('SCAN',name);nav('Sample',name)}
async function saveCurrentScan(){if(s.deck!=='Lab'||!s.repaired||page!=='Sample'||s.lastScan!==selected)throw Error('Select a specimen sample first.');await act('SAVE SCAN',selected);nav('Analysis')}
async function insertTape(x){await act('INSERT',x);nav(x==='CLONE BATCH SIGMA'?'Clone Batch Sigma':'Read',x)}
function toggleView(){cancelAnnouncement();finalSilence=false;localPlayer=!localPlayer;nav('Home');if(localPlayer&&s.step<17&&!s.playing)$('saver').hidden=false;else $('saver').hidden=true;syncAudio()}
let pausePlayback=()=>{};
function playback(){
 const id=s.playing,key=net.code+':'+id;if(mediaKey===key)return;cancelAnnouncement();mediaKey=key;busy=false;++renderTicket;
 $('crumb').textContent='Media Archive / Research Recordings';$('heading').textContent=rid(id)+' · '+recordings[id][0];
 const target=$('screen');target.replaceChildren();const [title,speaker,lines]=recordings[id];
 const transcript=el('p','',target),chalk=el('div','',target);chalk.className='chalk';chalk.hidden=true;
 const meter=el('progress','',target),status=el('small','',target),box=el('div','',target);meter.max=lines.length;
 let elapsed=0,paused=false,last=performance.now(),finishing=false,voiceIndex=-1,voiceWaiting=false,voiceAge=0,voiceFailed=false;
 const lineTimes=lines.map(l=>Math.max(4500,l.length*58)),ends=lineTimes.map((_,i)=>lineTimes.slice(0,i+1).reduce((n,v)=>n+v,0)),duration=ends[ends.length-1];
 let av=null;const paths=media[id];
 const valid=()=>mediaKey===key&&s.playing===id&&player();
 function useText(reason){cancelSpeech();voiceWaiting=false;voiceFailed=true;status.textContent=reason}
 function voiceAvailable(){return !av&&!voiceFailed&&narrationAllowed()}
 function updateStatus(){if(av)status.textContent='Recorded media';else if(voiceFailed){}else if(s.fast)status.textContent='Fast mode · text playback';else if(muted||s.mute)status.textContent='Muted · text playback';else if(!synth||typeof window.SpeechSynthesisUtterance!=='function')status.textContent='Device speech unavailable · text playback';else status.textContent='Device narration · British English preferred'}
 if(paths.video||paths.audio){av=el(paths.video?'video':'audio','',target);av.src=paths.video||paths.audio;av.muted=muted||s.mute;av.onended=()=>{elapsed=duration};av.onerror=()=>{av?.remove();av=null;last=performance.now();updateStatus()};av.play().catch(()=>{if(av){av.remove();av=null;updateStatus()}})}
 updateStatus();
 const pause=button(box,'Pause',()=>{if(finishing)return;paused=!paused;pause.textContent=paused?'Resume':'Pause';if(av){if(paused)av.pause();else av.play().catch(report)}else if(voiceWaiting){if(paused){try{synth.pause()}catch{}}else{try{synth.resume()}catch{}}}});
 pausePlayback=()=>pause.click();
 button(box,'Replay from start',()=>{if(finishing)return;cancelSpeech();voiceWaiting=false;voiceIndex=-1;voiceAge=0;voiceFailed=false;elapsed=0;last=performance.now();if(av)av.currentTime=0;paused=false;pause.textContent='Pause';try{synth?.resume()}catch{}av?.play().catch(report);updateStatus()});
 button(box,'Text only',()=>{if(finishing)return;useText('Text-only playback');if(av){av.pause();av.remove();av=null}if(paused){paused=false;pause.textContent='Pause'}});
 if(localPlayer)button(box,'Operator view',toggleView);
 async function frame(now){
   if(!valid())return;
   const dt=Math.min(1000,now-last);last=now;
   if(voiceWaiting&&(!speechJob||!narrationAllowed())){useText('Narration stopped · continuing with text')}
   if(!paused){
     if(av){if(Number.isFinite(av.duration)&&av.duration>0)elapsed=duration*av.currentTime/av.duration;else elapsed+=dt*(s.fast?12:1)}
     else if(voiceAvailable()&&elapsed<duration){
       const i=ends.findIndex(end=>elapsed<end);
       if(i!==voiceIndex){voiceIndex=i;voiceAge=0;voiceWaiting=true;
         const started=speakParagraph(lines[i],id,()=>{if(!valid()||voiceIndex!==i)return;voiceWaiting=false;elapsed=ends[i]},()=>{if(valid()&&voiceIndex===i)useText('Device voice unavailable · continuing with text')});
         if(!started)useText('Device voice unavailable · continuing with text');
       }
       if(voiceWaiting){voiceAge+=dt;if(voiceAge>Math.max(20000,lineTimes[i]*3)){useText('Device voice timed out · continuing with text')}else elapsed=Math.min(ends[i]-1,elapsed+dt)}
       else if(voiceFailed)elapsed+=dt*(s.fast?12:1);
     }else elapsed+=dt*(s.fast?12:1);
   }
   const frac=Math.min(1,elapsed/duration),i=Math.max(0,ends.findIndex(end=>elapsed<end));
   transcript.textContent=speaker+'  /  '+lines[frac===1?lines.length-1:i];meter.value=frac*lines.length;
   chalk.hidden=!(id===3&&frac>=.32);if(!chalk.hidden){chalk.textContent='rack Ⅲ     '+code.board+'     Δ';if(s.boardAid)chalk.setAttribute('aria-label','Frame description: blackboard reads '+code.board);else chalk.setAttribute('aria-hidden','true');if(s.boardAid)chalk.removeAttribute('aria-hidden')}
   if(frac===1&&!finishing){finishing=true;cancelSpeech();try{if(id===7){transcript.textContent='';chalk.hidden=true;finalSilence=true;syncAudio();await new Promise(r=>setTimeout(r,s.fast?100:3000));}if(valid())await act('FINISH',id)}catch(e){finalSilence=false;syncAudio();report(e);button(box,'Confirm playback completion',()=>act('FINISH',id))}return}
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
function showEggProgram(p){
 const out=$('screen');++renderTicket;busy=false;out.replaceChildren();
 el('h3',p.title,out);el('p',p.question,out);const choices=el('div','',out);choices.className='actions';
 for(const [label,response] of p.choices)button(choices,label,()=>{choices.replaceChildren();el('p','RESPONSE RECORDED: '+label.toUpperCase(),choices);el('p',response,choices);el('p',p.ending,choices);button(choices,p.reset,()=>showEggProgram(p));button(choices,'Return to terminal',()=>draw())});
 button(choices,'Return to terminal',()=>draw());
}
function freestyle(raw){if(!raw)return;const reply=eggReply(raw,eggHistory);if(reply.program)showEggProgram(reply.program);else {if(reply.unknown)playCue('denied');textOut(reply.text,true)}}
function recordSearchMatches(raw){const q=raw.toLowerCase().trim();return !!q&&Object.entries(files(s)).some(([name,body])=>(name+' '+body).toLowerCase().includes(q))}
async function command(value){
 let raw=value.trim().replace(/\s+/g,' '),v=raw.toUpperCase();
 if(s.playing){if(v==='PAUSE')pausePlayback();return}
 if(s.deck==='Archive'&&s.step<14){if(v==='LAB')return act('DECK','Lab');return}
 if(s.deck==='Archive'){
   if(v==='DIR'){nav('Archive');return}if(v.startsWith('SEARCH ')){const term=raw.slice(7);if(!Object.keys(tapes).some(x=>x.includes(term.toUpperCase()))&&findEgg(term))return freestyle(term);query=term;nav('Search');return}
   if(v.startsWith('RETRIEVE '))return retrieve(v.slice(9));if(v==='ISB')return act('DECK','ISB');if(v==='LAB')return act('DECK','Lab');return freestyle(raw)
 }
 if(['AUTH BLUE','CODE BLUE','CODE CLEARANCE BLUE','AUTHORIZATION CODE BLUE'].includes(v))return act('BLUE');
 if(/^\d{6}$/.test(v))return act('AUTH',v);if(v.startsWith('AUTH '))return act('AUTH',v.slice(5));
 if(v==='DIR'||v==='HOME')return selectPage('Home');
 if(v==='HELP')return selectPage('Help');if(v==='STATUS')return selectPage('Status');if(v==='DOORS')return selectPage('Doors');
 if(v==='CLOSE CURRENT ROOM')return closeDoors();
 if(v==='UNLOCK SECURITY EQUIPMENT ROOM')return act('EQUIPMENT');
 if(v.startsWith('SEARCH ')){const term=raw.slice(7);if(!recordSearchMatches(term)&&findEgg(term))return freestyle(term);query=term;selectPage('Search');return}
 if(v.startsWith('OPEN ')){const path=v.slice(5);
   const options=['Media Archive','Research Recordings','Doors','Records','Status','Help',...(s.deck==='Lab'&&s.repaired?['Analysis','Saved results']:[]),...(s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA']?['Clone Batch Sigma']:[])];
   const name=options.find(k=>k.toUpperCase()===path);if(name==='Research Recordings'&&!s.seen[1]&&page!=='Media Archive')throw Error('Select the parent media directory first.');if(name)return selectPage(name);
   const doc=Object.keys(files(s)).find(k=>k.toUpperCase()===path);if(doc)return selectPage('Read',doc);
 }
 const m=v.match(/^(?:PLAY|REPLAY) (?:REC-)?0*([1-7])$/);if(m){if(+m[1]===1&&!s.seen[1]&&page!=='Research Recordings')throw Error('Select the local recording directory first.');return act('PLAY',m[1])}
 if(v==='ARCHIVE')return act('DECK','Archive');if(v==='ISB')return s.step>=14?act('DECK','ISB'):freestyle(raw);if(v==='LAB')return act('DECK','Lab');if(v==='RECEPTION')return act('DECK','Primary');if(v.startsWith('INSERT '))return insertTape(v.slice(7));
 if(v==='SAVE SCAN')return saveCurrentScan();if(v==='DISCARD SCAN'&&s.deck==='Lab'&&s.repaired&&page==='Sample'&&s.lastScan===selected)return nav('Analysis');
 if(v.startsWith('SCAN ')&&s.deck==='Lab'&&s.repaired){let key=Object.keys(scans(s)).find(k=>k.toUpperCase()===v.slice(5).replace(/^TODD$/,'T0DD'));if(key)return scan(key)}
 return freestyle(raw)
}
$('commandForm').onsubmit=e=>{e.preventDefault();if(busy||commandPending)return;let value=$('command').value;$('command').value='';$('error').textContent='';echoCommand(displayCommand(value));commandPending=true;command(value).catch(report).finally(()=>{commandPending=false})};
if('serviceWorker' in navigator&&!params.has('emulator'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
