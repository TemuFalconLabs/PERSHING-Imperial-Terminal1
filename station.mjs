import {findEgg,eggReply,newEggHistory} from './easter-eggs.mjs';
import {crisisArtwork} from './crisis-art.mjs';
import {analysisFolderAvailable,scannerReadyHere,directorReadiness,recordingGroups,analysisPageAfterRepair,structuredScan,isAdministrativeRecord,partitionRecords,discoveryTone,scanPhases,scanResultCue,newCalibration,tickCalibration} from './station-presentation.mjs';
import {voicePreferenceKey,voiceIdentity,isBritishVoice,orderedVoices,resolveNarrationVoice,voiceControlsLocked} from './voice-selection.mjs';
import {files,tapes,code,media,recordings} from './content.mjs';
import {route,rooms,stages,recordingAt,physical,scans,validSave,canPlay,objective,visibleObjective,currentObjectiveId,objectiveGroup,biohazardAlert} from './engine.mjs';
import {localSession,networkSession,newCode,cacheKey} from './session.mjs';
const $=id=>document.getElementById(id), params=new URLSearchParams(location.search),standalone=document.documentElement.hasAttribute('data-offline'),dm=standalone||params.has('dm'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let host,s,net,localPlayer=false,localPlayerOpened=false,page='Home',selected='',query='',lastActivity=Date.now(),busy=false,renderTicket=0,mediaKey='',audioCtx,muted=false;
let eggHistory=newEggHistory(),reviewed=new Set(),reviewKey='',scanJob=null,calibrationJob=null,retrievalJob=null,pageTrail=[];
function readReviewState(info,state,reset=false){const key='pershing.review.v17.'+info.code+'.'+state.campaign;if(key!==reviewKey||reset){reviewKey=key;reviewed=new Set();try{if(reset)localStorage.removeItem(key);else reviewed=new Set(JSON.parse(localStorage.getItem(key)||'[]'))}catch{}}}
function acknowledge(key){if(!key)return;reviewed.add(key);try{localStorage.setItem(reviewKey,JSON.stringify([...reviewed]))}catch{}}
function markChoice(node,key,action=false){node.dataset.priority=discoveryTone(key,reviewed,action);if(node.dataset.priority==='new'||(action&&key.startsWith('rec:')&&!reviewed.has(key))){const tag=el('span','NEW — ',null);tag.className='newFlag';tag.setAttribute('aria-hidden','true');node.prepend(tag)}return node}
function recordChoice(node,name,label=name){const b=button(node,label,()=>selectPage('Read',name),'OPEN '+name.toUpperCase());return isAdministrativeRecord(name)?(b.dataset.priority='reviewed',b):markChoice(b,'record:'+name)}
const player=()=>!dm||localPlayer;
const bloodVisible=()=>!!(s&&player()&&s.step===18&&s.finalBloodOverlayVisible);
const el=(tag,txt='',parent)=>{const n=document.createElement(tag);n.textContent=txt;if(parent)parent.append(n);return n};
function button(node,label,fn,shortcut=''){const b=el('button',label,node);b.type='button';if(shortcut)b.dataset.command=shortcut;b.onclick=()=>{if(player()&&(busy||commandPending||scanJob))return;Promise.resolve().then(()=>shortcut?autoCommand(shortcut,fn):fn()).catch(report)};return b}
// Local presentation only: each shortcut invokes its existing guarded action once.
let commandPending=false;
function echoCommand(value){$('commandEcho').hidden=false;$('commandEchoText').textContent=value}
function displayCommand(value){const v=value.trim();return /^(?:AUTH\s+)?\d{6}$/i.test(v)?'AUTH ******':v.toUpperCase()}
function commandTypingPlan(value,instant){return instant?{step:value.length||1,delay:0}:{step:Math.max(1,Math.ceil(value.length/23)),delay:44}}
async function autoCommand(value,fn){
 if(commandPending||busy||scanJob||!s||!player()||s.playing||bloodVisible())return;
 commandPending=true;const revision=s.revision,deck=s.deck,session=net.code,input=$('command'),draft=input.value,previousReadonly=input.readOnly;
 const valid=()=>player()&&s.revision===revision&&s.deck===deck&&net.code===session&&!s.playing&&!bloodVisible();
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
 if(before.step<18&&after.step===18)return 'alarm';
 if(after.step>=17)return null;
 if(after.playing&&after.playing!==before.playing)return 'playback';
 if(before.playing&&!after.playing)return 'complete';
 const n=after.notice||'';
 if(after.playing)return null;
 if(/Authorization code accepted|Authorization accepted|EXECUTIVE|Executive credentials|ISB SECURITY CREDENTIAL VERIFIED|CODE CLEARANCE BLUE|Sample filed/.test(n))return 'approval';
 if(/Obstruction detected| · OBSTRUCTED/.test(n))return 'denied';
 if(/NETWORK CONNECTION RESTORED/.test(n))return 'link';
 if(/ENVIRONMENTAL RELAY/.test(n))return 'relay';
 if(/Carrier delivered|IMPERIAL RESEARCH ARCHIVE · Power supply/.test(n))return 'archive';
 if(/TAPE AUTHENTICATED|Cylinder mounted|Equipment Room released|Analysis bench calibrated/.test(n))return 'unlock';
 if(after.lastScan&&n.startsWith(after.lastScan+' · '))return scanResultCue(after);
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
let speechJob=null,announcementTicket=0,announcementPending=false,voicePreference='',voiceTestMessage='';
try{voicePreference=localStorage.getItem(voicePreferenceKey)||''}catch{}
function deviceVoices(){try{return Array.from(synth?.getVoices()||[])}catch{return []}}
function speechSupported(){return !!synth&&typeof window.SpeechSynthesisUtterance==='function'}
function syncVoiceControls(){
 const select=$('narrationVoice'),test=$('voiceTest'),status=$('voiceStatus');if(!select||!test||!status)return;
 const locked=voiceControlsLocked(s,muted,finalSilence,announcementPending,speechJob,document.hidden);
 select.disabled=!speechSupported()||locked;test.disabled=!speechSupported()||locked;
 const voices=deviceVoices(),selected=voices.find(v=>voiceIdentity(v)===voicePreference),uk=voices.filter(isBritishVoice).length;
 status.textContent=!speechSupported()?'Browser speech unavailable; recordings use text.':voiceTestMessage||(!voices.length?'Voice list not exposed yet. Automatic narration may still work.':voicePreference&&!selected?'Saved voice not available on this device; using Automatic.':(voices.length+' available · '+uk+' British English. Voice choice is local to this device.'));
}
function refreshVoiceList(){
 const select=$('narrationVoice');if(!select)return;
 const voices=orderedVoices(deviceVoices());select.replaceChildren();
 const option=(value,label)=>{const n=el('option',label,select);n.value=value;return n};
 option('','Automatic (existing speaker profiles)');
 for(const v of voices)option(voiceIdentity(v),v.name+' ('+v.lang+')');
 if(voicePreference&&!voices.some(v=>voiceIdentity(v)===voicePreference))option(voicePreference,'Saved voice (currently unavailable)');
 select.value=voicePreference;syncVoiceControls();
}
function previewNarrationVoice(){
 if(!speechSupported()||voiceControlsLocked(s,muted,finalSilence,announcementPending,speechJob,document.hidden))return;
 try{
  const u=new window.SpeechSynthesisUtterance('Imperial Science Division. Your safety is our priority.'),p=voiceProfiles[1],v=resolveNarrationVoice(deviceVoices(),1,voicePreference,chooseSpeechVoice);
  u.lang=v?.lang||'en-GB';if(v)u.voice=v;u.rate=p.rate;u.pitch=p.pitch;u.volume=.86;
  const job={u,preview:true};speechJob=job;voiceTestMessage='Testing '+(v?.name||'automatic voice')+'…';syncVoiceControls();
  const finish=message=>{if(speechJob!==job)return;speechJob=null;voiceTestMessage=message;syncVoiceControls()};
  u.onend=()=>finish('Voice test complete.');u.onerror=()=>finish('Voice test unavailable. Try another voice.');
  synth.speak(u);
  setTimeout(()=>{if(speechJob===job){cancelSpeech();voiceTestMessage='Voice test timed out. Try another voice.';syncVoiceControls()}},12000);
 }catch{cancelSpeech();voiceTestMessage='Voice test unavailable. Try another voice.';syncVoiceControls()}
}
$('narrationVoice').onchange=()=>{voicePreference=$('narrationVoice').value;voiceTestMessage='';try{localStorage.setItem(voicePreferenceKey,voicePreference)}catch{voiceTestMessage='Voice selected for this visit; local storage is unavailable.'}syncVoiceControls()};
$('voiceTest').onclick=previewNarrationVoice;
try{synth?.addEventListener('voiceschanged',refreshVoiceList)}catch{}
window.addEventListener('focus',refreshVoiceList);
refreshVoiceList();
function narrationAllowed(){return !!synth&&typeof window.SpeechSynthesisUtterance==='function'&&player()&&!muted&&!s?.mute&&!s?.fast&&!finalSilence}
function cancelSpeech(){const job=speechJob;speechJob=null;if(job){job.u.onend=null;job.u.onerror=null;try{synth.cancel()}catch{}if(job.preview)voiceTestMessage=''}syncVoiceControls()}
function speakParagraph(text,id,onEnd,onError){
 if(!narrationAllowed())return false;
 cancelSpeech();
 try{
  const u=new window.SpeechSynthesisUtterance(text),p=voiceProfiles[id],v=resolveNarrationVoice(deviceVoices(),id,voicePreference,chooseSpeechVoice);
  u.lang=v?.lang||'en-GB';if(v)u.voice=v;u.rate=p.rate;u.pitch=p.pitch;u.volume=.86;
  const job={u};speechJob=job;syncVoiceControls();
  u.onend=()=>{if(speechJob!==job)return;speechJob=null;syncVoiceControls();onEnd?.()};
  u.onerror=()=>{if(speechJob!==job)return;speechJob=null;syncVoiceControls();onError?.()};
  synth.speak(u);return true;
 }catch{cancelSpeech();return false}
}
function cancelAnnouncement(){announcementTicket++;announcementPending=false;cancelSpeech()}
function announce(text,delay=0){
 const ticket=++announcementTicket,session=net?.code,step=s?.step;announcementPending=true;syncVoiceControls();
 setTimeout(()=>{if(ticket!==announcementTicket)return;announcementPending=false;syncVoiceControls();if(net?.code!==session||s?.step!==step||!narrationAllowed()||s.playing)return;speakParagraph(text,8,()=>{},()=>{})},delay);
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
 audioStatus();syncVoiceControls();
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
document.addEventListener('keydown',e=>{activity();if(calibrationJob&&player()&&calibrationKey(e,true))return;if(wake(e))return;if((busy||commandPending)&&player()){e.preventDefault();e.stopImmediatePropagation();return}if(e.key==='Enter'&&e.target.id==='command')gestureCue('tap');else gestureCue(null)},true);
document.addEventListener('click',e=>{activity();if(wake(e))return;if(retrievalJob&&player()){e.preventDefault();e.stopImmediatePropagation();return}const button=e.target.closest?.('button');if((busy||commandPending)&&player()&&button?.id!=='soundToggle'&&button?.id!=='soundTest'&&button?.id!=='bloodOperator'&&button?.id!=='voiceTest'){e.preventDefault();e.stopImmediatePropagation();return}if(button&&!button.disabled&&button.id!=='soundTest'&&button.id!=='soundToggle'&&button.id!=='voiceTest'&&!button.dataset.command)gestureCue('tap');else gestureCue(null)},true);
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
setInterval(()=>{if($('saver').hidden&&shouldShowSaver(s,player(),busy||commandPending||!!calibrationJob||!!retrievalJob,Date.now()-lastActivity)){$('saver').hidden=false;syncAudio()}},250);
async function act(a,arg=''){if(!host)throw Error('Connecting…');$('error').textContent='';await host.send(a,String(arg),player()?'PLAYER':'DM')}
function nav(p,sel='',track=true){if(mediaKey)cancelAnnouncement();if(track&&(page!==p||selected!==sel)){pageTrail.push({page,selected,query});if(pageTrail.length>20)pageTrail.shift()}page=p;selected=sel;mediaKey='';draw()}
function goBack(){const prior=pageTrail.pop();if(prior){query=prior.query;nav(prior.page,prior.selected,false)}else nav(page==='Read'?'Records':page==='Research Recordings'&&s.deck==='Primary'?'Media Archive':'Home','',false)}
function responseTone(str){
 const v=String(str||'');
 if(/BIOHAZARD ALERT|AIRBORNE CONTAMINANT DETECTED|EMERGENCY CONTAINMENT PROTOCOL|SPECIMEN ACTIVITY/i.test(v))return 'critical';
 if(/access(?:\s*:\s*|\s+)(?:denied|unavailable|restricted)|request denied|authorization(?:\s*:\s*|\s+)(?:denied|required|still denied)|operation unavailable|security (?:warning|notified)|obstruction detected|personnel file has been flagged|disciplinary proceedings|(?:^|\b)error (?:403|418):|authorization key: REQUIRED|containment: FAILED|credentials are required|EXECUTIVE AUTHENTICATION REQUIRED|PRIVACY PROTOCOL ACTIVE|CONFIDENTIAL PLAYBACK WITHHELD|warning: unstable/i.test(v))return 'warning';
 return 'normal';
}
function recordingPlayable(s,id){return s.step<17&&canPlay(s,id)&&(id!==7||s.doors['Director office door']==='CLOSED')}
function nextLockedRecording(s){
 if(s.step>=17)return 0;
 // Only the next sequential recording, and only after its predecessor is completed.
 // Earlier stations may display the numeric identifier but not the location or title.
 for(let id=2;id<=7;id++){
   if(!s.seen[id-1]||s.seen[id])continue;
   const priorDeck=id<=5?'Primary':'ISB';
   if(s.deck===priorDeck||(id===7&&s.deck==='Director')){
     if(!recordingPlayable(s,id))return id;
   }
 }
 return 0;
}
function lockedRecordingRow(node,id){
 const row=el('div',rid(id)+' · ACCESS DENIED',node);row.className='lockedRecording';return row;
}
function noticeTone(str){
 const v=String(str||'');
 if(responseTone(v)==='critical')return 'critical';
 // Positive resource/authorization events only; the engine's approved text remains untouched.
 if(/^(?:Cylinder mounted\. Recovered recording available\.|NETWORK CONNECTION RESTORED|ISB SECURITY CREDENTIAL VERIFIED|Authorization accepted\. Research index expanded|ENVIRONMENTAL RELAYS: 2 OF 2 ONLINE|Local laboratory archive detected\.|IMPERIAL RESEARCH ARCHIVE · Power supply: RESTORED|TAPE AUTHENTICATED|Executive credentials verified\.|Armory released\.|BIOLOGICAL ANALYSIS SYSTEM ONLINE|CODE CLEARANCE BLUE RECEIVED|Lift aligned\. Carrier delivered:)/i.test(v))return 'available';
 return responseTone(v);
}
function paintObjective(){const n=$('objective'),v=visibleObjective(s);n.hidden=!v;n.textContent=v?'CURRENT OBJECTIVE\n'+v:''}
function objectiveOnlyUpdate(before,after){
 if(!before||before.objectiveReveal===after.objectiveReveal)return false;
 const comparable=v=>Object.fromEntries(Object.entries(v).filter(([k])=>!['revision','objectiveReveal','log'].includes(k)));
 // Stable field ordering even when Firebase returns maps with different key order.
 const canonical=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(canonical):Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
 return JSON.stringify(canonical(comparable(before)))===JSON.stringify(canonical(comparable(after)));
}
function textOut(str,animate=false,tone=responseTone(str)){
 const ticket=++renderTicket,out=$('screen');busy=false;out.dataset.tone=tone;out.textContent=str;
 if(!animate||s.fast||reduced||!str)return;
 busy=true;playCue('link');out.dataset.tone='normal';out.textContent='PROCESSING …';const start=performance.now()+750,ms=Math.min(3200,str.length*14);
 function tick(now){if(ticket!==renderTicket)return;if(now>=start){out.dataset.tone=tone;out.textContent=str.slice(0,Math.ceil(str.length*Math.min(1,(now-start)/ms)));if(now>=start+ms){busy=false;return}}requestAnimationFrame(tick)}requestAnimationFrame(tick)
}
function selectPage(p,sel=''){if(p==='Read'&&Object.hasOwn(files(s),sel))acknowledge('record:'+sel);if(p==='Analysis'&&analysisFolderAvailable(s))acknowledge(scannerReadyHere(s)?'analysis:online':'analysis');if(p==='Clone Batch Sigma'&&s.inserted?.['CLONE BATCH SIGMA'])acknowledge('sigma');nav(p,sel);if(!s.playing&&!['Analysis','Specimens','Saved results','Sample'].includes(p))textOut($('screen').textContent,true)}
function instrumentHeader(out){el('small','IMPERIAL ADVANCED SCIENCE DIVISION',out).className='scanDivision';el('h3','M-COUNT ANALYSIS',out).className='scanHeading';el('small','BIOLOGICAL SPECIMEN CLASSIFICATION SYSTEM',out).className='scanDivision';}
function drawScanReport(name,parent){const report=structuredScan(s.campaign,name,scans(s)[name]);if(!report)return;const box=el('section','',parent);box.className='scanReport';const fields=[['SUBJECT',report.subject],[report.classification?'CLASSIFICATION':'SPECIES',report.species],['M-COUNT',report.count],['REGISTRY MATCH',report.registry]];if(report.classification)fields.push(['PHYSICAL CONDITION',report.condition],['MISSING COMPONENTS',report.missing]);for(const [label,value] of fields){const row=el('div','',box);row.className='scanRow';el('span',label,row).className='scanLabel';const result=el('strong',value,row);if(label==='M-COUNT')result.dataset.scanTone=report.tone;if(label==='REGISTRY MATCH'&&s.matches[name])result.dataset.scanTone=reviewed.has('record:Individual specimen record — '+name)?'normal':'new';if(['PHYSICAL CONDITION','MISSING COMPONENTS'].includes(label))result.dataset.scanTone='warning'}if(report.classification)el('small','ASSESSMENT:',box).dataset.scanTone='warning';el('p',report.note,box).dataset.scanTone=report.tone;if(report.warning)el('p',report.warning,box).dataset.scanTone='critical'}
function scanScreen(names,live=false){textOut('');const out=$('screen');instrumentHeader(out);for(const name of names)drawScanReport(name,out);if(live)el('p','SAVE SPECIMEN TO RESEARCH DATABASE?',out).className='scanSavePrompt';else if(!names.length)el('p','No saved specimens.',out);}
function instrumentScreen(message,tone='normal'){textOut('');const out=$('screen');instrumentHeader(out);const p=el('p',message,out);p.className='instrumentStatus';p.dataset.scanTone=tone;}
function playerNotice(state){return state.lastScan&&state.notice===state.lastScan+' · '+scans(state)[state.lastScan]?'Specimen scan complete.':state.notice;}
function receive(state,info){
 const before=s,first=!s,changed=s?.revision!==state.revision,alarm=s&&s.step<18&&state.step===18,objectiveOnly=changed&&objectiveOnlyUpdate(s,state);
 const completedRecording=before?.playing&&!state.playing&&state.seen?.[before.playing]&&!before.seen?.[before.playing]&&state.step>before.step&&state.step<17;const moved=s?.deck!==state.deck;if(first||net?.code!==info.code||(before?.step>0&&state.step===0))eggHistory=newEggHistory();s=state;net=info;readReviewState(info,state,!!(before?.step>0&&state.step===0));if(moved||before?.step>0&&state.step===0){pageTrail=[];page=analysisPageAfterRepair(before,s,page);selected='';mediaKey=''}else if(completedRecording&&['Primary','ISB'].includes(s.deck)){page='Research Recordings';selected=''}else{page=analysisPageAfterRepair(before,s,page)}$('setup').hidden=true;$('work').hidden=false;$('link').textContent=info.local?'LOCAL':(!info.connected?'RECONNECTING':info.peer?'CONNECTED · BOTH STATIONS':'CONNECTED · PEER AWAY');
 if(!objectiveOnly&&before&&(before.playing!==s.playing||before.step!==s.step||s.mute||s.fast))cancelAnnouncement();if(!s.playing)finalSilence=false;syncAudio();if(changed&&!objectiveOnly){$('notice').textContent=playerNotice(s);$('notice').dataset.tone=noticeTone(playerNotice(s));if(!first&&(!scanJob||!(s.lastScan&&s.notice===s.lastScan+' · '+scans(s)[s.lastScan])))playCue(cueForState(before,s));activity()}
 if(objectiveOnly){if(player())paintObjective();else dashboard()}else if(first||changed){if(alarm||s.playing||s.step>=17)$('saver').hidden=true;draw()}else if(dm&&!localPlayer)dashboard();
 if(first&&player()&&!s.playing&&s.step<17)$('saver').hidden=false;syncAudio();
 if(!first&&alarm&&s.step===18)announce(biohazardAlert,1650);else if(!first&&before.step===10&&s.step===11)announce('Your safety is our priority.',400);
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
$('bloodOperator').onclick=()=>{if(localPlayer)toggleView()};
function draw(){
 if(!s)return;document.body.classList.toggle('emergency',s.step===18);
 const blood=bloodVisible(),overlay=$('bloodOverlay');overlay.hidden=!blood;document.querySelector('main').inert=blood;$('bloodOperator').hidden=!localPlayer;
 if(blood){++renderTicket;busy=false;$('saver').hidden=true;const art=$('bloodArtwork');if(!art.getAttribute('src'))art.src=crisisArtwork;syncAudio();return;}
 $('top').textContent=(player()?s.deck.toUpperCase()+' STATION':'WATCH CONTROL · '+s.campaign)+'   /   '+net.code;
 $('board').hidden=player();$('monitor').hidden=!player();syncAudio();
 if(!player()){if(calibrationJob)calibrationJob.keys={};dashboard();return}
 const out=$('choices');out.replaceChildren();paintObjective();$('authSuccess').hidden=!(s.step===7&&s.authVerified);$('dmReminder').hidden=![1,3,5,7,9,10,11,13,16,17].includes(s.step)||!!s.playing;$('commandForm').hidden=!!s.playing||(s.deck==='Archive'&&s.step<14);
 if(s.playing){if(calibrationJob)endCalibration(false);playback();return}
 if(calibrationJob){if(calibrationValid(calibrationJob)){drawCalibration();return}endCalibration(false)}
 if(retrievalJob&&retrievalValid(retrievalJob)){drawRetrieval(retrievalJob);return}
 if(scanJob&&scanJob.code===net.code&&scannerReadyHere(s)&&s.step<17){instrumentScreen(scanJob.message,'new');$('heading').textContent='M-count Analysis';$('commandForm').hidden=true;return}
 mediaKey='';$('crumb').textContent=s.deck+' / '+page;$('heading').textContent=page;
 const btn=(label,fn,shortcut='')=>button(out,label,fn,shortcut), go=(p,label=p)=>btn(label,()=>selectPage(p),p==='Home'?'DIR':['Help','Status','Doors'].includes(p)?p.toUpperCase():'OPEN '+p.toUpperCase());
 const important=(label,fn,shortcut,key,action=false)=>markChoice(btn(label,fn,shortcut),key,action);
 const group=label=>{const d=el('details','',out);d.className='choiceGroup';el('summary',label,d);const inner=el('div','',d);inner.className='actions';return inner};
 if(s.step>=17){$('commandForm').hidden=true;$('heading').textContent=s.step===18?'Biohazard alert':'Transmission ended';textOut(s.step===18?biohazardAlert:'TRANSMISSION TERMINATED.\nAwaiting further instructions.');if(localPlayer)btn('Operator view',toggleView);return}
 if(s.deck==='Archive'){
   $('heading').textContent=s.step>=14?'Tape elevator':'Retrieval station';textOut(s.step>=14?'Select a carrier for mechanical delivery. Decryption requires the ISB officer’s terminal.':'Display dark.');
   if(s.step>=14)Object.keys(tapes).filter(x=>!s.retrieved[x]&&!s.inserted[x]&&(page!=='Search'||x.includes(query.toUpperCase()))).forEach(x=>x==='CLONE BATCH SIGMA'?important('Retrieve '+x,()=>retrieve(x),'RETRIEVE '+x,'retrieve:'+x,true):btn('Retrieve '+x,()=>retrieve(x),'RETRIEVE '+x));
   {const b=btn('Return to ISB officer’s terminal',()=>act('DECK','ISB'),'ISB');if(s.retrieved?.['CLONE BATCH SIGMA'])markChoice(b,'isb',true)}
 }else if(s.deck==='Director'){
   $('heading').textContent='Research Director’s terminal';textOut(!s.directorCylinder?'EXECUTIVE AUTHENTICATION REQUIRED\nInsert the Research Director’s security cylinder.':!s.inserted['CLONE BATCH SIGMA']?'Executive credentials verified. Classified archive authorization pending.':s.doors['Director office door']!=='CLOSED'?'Security cylinder detected...\nExecutive credentials verified.\nCONFIDENTIAL TRANSMISSION AVAILABLE\nPRIVACY PROTOCOL ACTIVE\nClose the office door to authorize playback.':'PRIVACY CHECK COMPLETE\nCONFIDENTIAL PLAYBACK AVAILABLE');if(recordingPlayable(s,7)){const b=btn('Play REC-007',()=>act('PLAY',7),'PLAY REC-007');b.classList.add('availableRecording');markChoice(b,'rec:7',true)}else if(nextLockedRecording(s)===7)lockedRecordingRow(out,7);btn('Return to ISB officer’s terminal',()=>act('DECK','ISB'),'ISB');
 }else if(page==='Home'){
   textOut(s.deck==='ISB'?(s.inserted['CLONE BATCH SIGMA']?'CLONE BATCH SIGMA — AVAILABLE RECORDS\nIndividual specimen records available upon biological specimen scan.':'ISB OFFICER’S READER\nInsert retrieved archive tape to decrypt.'):'Local directories available. Select a directory or enter HELP.');if(s.deck!=='ISB')go('Media Archive');else{go('Research Recordings');if(!s.equipment)btn('Release Armory',()=>act('EQUIPMENT'),'UNLOCK ARMORY');else el('small','ARMORY: RELEASED',out)}if(s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA'])markChoice(go('Clone Batch Sigma'),'sigma');go('Records');btn('Search records',()=>prepareManual('SEARCH '));go('Status');go('Help');
 }else if(page==='Media Archive'){textOut('One local index mounted.');go('Research Recordings')}
 else if(page==='Research Recordings'){textOut('Select a recording to play.');const {available,replays}=recordingGroups(s,recordings,recordingPlayable);const add=(node,i)=>{const b=button(node,'Play '+rid(i)+' · '+recordings[i][0],()=>act('PLAY',i),'PLAY '+rid(i));b.classList.add('availableRecording');if(!s.seen[i])markChoice(b,'rec:'+i,true);else b.dataset.priority='reviewed'};available.forEach(i=>add(out,i));const locked=nextLockedRecording(s);if(locked)lockedRecordingRow(out,locked);if(replays.length){const replay=group('Completed recordings · replay ('+replays.length+')');replays.forEach(i=>add(replay,i))}}
 else if(page==='Clone Batch Sigma'&&s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA']){textOut('CLONE BATCH SIGMA — AVAILABLE RECORDS\nIndividual specimen records available upon biological specimen scan.\n\nExecutive terminal: Research Director’s office beyond the cloning laboratory. Local access only.');const names=s.campaign==='MEN'?['Specimen Transfer Ledger','Drellis Minor Recovery Operation','Crime Lord Morgan','Research Oversight Authorization']:['Specimen Transfer Ledger','Transfer receipt'];for(const name of names)if(files(s)[name])recordChoice(out,name);}
 else if(page==='Records'||page==='Search'){const names=Object.keys(files(s)).filter(x=>page!=='Search'||(x+' '+files(s)[x]).toLowerCase().includes(query.toLowerCase()));textOut(names.length?'Available records':'No local records match.');const {important:relevant,routine}=partitionRecords(names);relevant.forEach(x=>recordChoice(out,x));if(routine.length){const admin=group('Administrative Archives ('+routine.length+')');routine.forEach(x=>recordChoice(admin,x))}}
 else if(page==='Read'){const body=files(s)[selected];$('heading').textContent=body?(selected==='Scanner diagnostic'?'M-count analysis diagnostic':selected):'Record unavailable';textOut(body||'Access unavailable.')}
 else if(page==='Doors'&&s.deck==='ISB'&&s.step>=8){textOut('ARMORY · '+(s.equipment?'RELEASED':'SEALED'));if(!s.equipment)btn('Release Armory',()=>act('EQUIPMENT'),'UNLOCK ARMORY')}
 else if(page==='Analysis'&&analysisFolderAvailable(s)){
   $('heading').textContent='M-count Analysis';
   if(scannerReadyHere(s)){instrumentScreen('BIOLOGICAL ANALYSIS SYSTEM ONLINE','new');if(Object.keys(scans(s)).every(n=>s.scanned?.[n]))btn('Analyze biological specimen',()=>nav('Specimens'),'OPEN SPECIMENS');else important('Analyze biological specimen',()=>nav('Specimens'),'OPEN SPECIMENS','analyze',true);go('Saved results','Review saved specimen results');const matched=Object.keys(s.matches).filter(n=>s.matches[n]);if(matched.length){const records=group('Matched specimen records ('+matched.length+')');for(const name of matched)recordChoice(records,'Individual specimen record — '+name)}}
   else if(s.installed&&!s.repaired&&s.deck==='ISB'&&s.step>=12){instrumentScreen('REPLACEMENT COMPONENTS INSTALLED\nHARDWARE DIAGNOSTICS: PASSED','normal');const p=el('p','SENSOR CALIBRATION: REQUIRED',$('screen'));p.dataset.scanTone='warning';el('p','TWO TECHNICIANS REQUIRED',$('screen')).dataset.scanTone='new';important('BEGIN M-COUNT SCANNER CALIBRATION',startCalibration,'','calibration',true);el('small','Awaiting dual-operator input...',$('screen')).className='scanDivision'}
 else{instrumentScreen(s.repaired?'BIOLOGICAL ANALYSIS SYSTEM ONLINE\nAuthorized ISB terminal required.':s.parts?'SYSTEM STATUS: PARTS RECEIVED\nInstall replacement modules at analysis bench and calibrate.\nAwaiting local repair...':'SYSTEM STATUS: OFFLINE\n\nRequired components:\nS-4 Sensor Assembly\nP-2 Regulator\nPacking class: regulated instruments',s.parts||s.repaired?'warning':'critical');if(files(s)['Scanner diagnostic'])recordChoice(out,'Scanner diagnostic','Run system diagnostic');if(files(s)['Shipping manifest'])recordChoice(out,'Shipping manifest','Review shipping manifest');if(s.step>=8&&s.deck!=='ISB')important('Use ISB officer’s terminal',()=>act('DECK','ISB'),'ISB','local-bench',true)}
   go('Home','Return to terminal');if(localPlayer)btn('Operator view',toggleView);return
 }
 else if(page==='Specimens'&&scannerReadyHere(s)){ $('heading').textContent='M-count Analysis';instrumentScreen('SELECT BIOLOGICAL SPECIMEN');Object.keys(scans(s)).forEach(name=>btn('Scan '+name,()=>scan(name),'SCAN '+name.toUpperCase()));go('Analysis','Return to M-count Analysis');if(localPlayer)btn('Operator view',toggleView);return}
 else if(page==='Saved results'&&scannerReadyHere(s)){const names=Object.keys(s.saved).filter(n=>s.saved[n]&&Object.hasOwn(scans(s),n));scanScreen(names);go('Analysis','Return to M-count Analysis');if(localPlayer)btn('Operator view',toggleView);return}
 else if(page==='Sample'&&scannerReadyHere(s)&&s.lastScan===selected){scanScreen([selected],true);if(s.matches[selected]){const name='Individual specimen record — '+selected;const label=reviewed.has('record:'+name)?'View classified specimen record':'CLASSIFIED SPECIMEN RECORD AVAILABLE';recordChoice(out,name,label)}btn('YES — SAVE',()=>saveCurrentScan(),'SAVE SCAN');btn('NO — DISCARD',()=>nav('Specimens'),'DISCARD SCAN');if(localPlayer)btn('Operator view',toggleView);return}
 else if(page==='Status'){textOut(playerNotice(s)+(s.hint?'\n'+s.hint:''))}
 else {textOut('DIR · OPEN <directory or file> · SEARCH <text> · PLAY <record> · STATUS'+(s.deck==='ISB'?' · UNLOCK ARMORY':'')+(s.step>=6?' · AUTH <code>':'')+(s.repaired?' · SCAN <subject> · SAVE SCAN · DISCARD SCAN':'')+(s.step>=8?' · ISB · RECEPTION':'')+(s.step>=13?' · ARCHIVE':'')+(s.step>=14?' · INSERT <tape>':''))}
 if(s.deck!=='Archive'&&s.deck!=='Director'){
   if(s.deck==='Primary'&&s.step===7&&!s.authVerified)btn('Enter authorization code',()=>prepareManual('AUTH '));
   const links=[];if(s.step>=13)links.push(['Use archive station','Archive','ARCHIVE',s.deck==='ISB'&&(s.step===13||s.step===14)]);if(s.step>=8&&s.deck!=='Primary')links.push(['Return to reception terminal','Primary','RECEPTION',s.step===8]);if(s.step>=8&&s.deck!=='ISB')links.push(['Use ISB officer’s terminal','ISB','ISB',s.step>=9]);const primary=links.filter(x=>x[3]),secondary=links.filter(x=>!x[3]);for(const [label,deck,cmd] of primary)important(label,()=>act('DECK',deck),cmd,'station:'+deck,true);if(secondary.length){const other=group('Other workstations');for(const [label,deck,cmd] of secondary)button(other,label,()=>act('DECK',deck),cmd)}
   if(s.deck==='ISB')Object.keys(s.retrieved).filter(x=>!s.inserted[x]).forEach(x=>important('Insert '+x,()=>insertTape(x),'INSERT '+x,'insert:'+x,x==='CLONE BATCH SIGMA'));
   if(analysisFolderAvailable(s)&&!['Analysis','Specimens','Saved results','Sample'].includes(page)){const analysis=markChoice(go('Analysis','M-count Analysis'),scannerReadyHere(s)?'analysis:online':'analysis',!s.repaired&&reviewed.has('analysis'));out.prepend(analysis)}if(s.deck==='ISB'&&canPlay(s,6)&&!s.seen[6]&&page!=='Research Recordings'&&!['Analysis','Sample','Saved results'].includes(page))important('Play REC-006 · Experimental procedures',()=>act('PLAY',6),'PLAY REC-006','rec:6',true);if(page!=='Home'){btn('Go back',goBack);go('Home');}
 }
 if(localPlayer)btn('Operator view',toggleView);
}
function rid(i){return 'REC-'+String(i).padStart(3,'0')}
function closeDoors(){if(confirm('Close the doors serving '+s.room+'?'))return act('CLOSE')}
async function retrieve(x){$('screen').classList.add('retrieving');try{textOut('Carriage moving…');await new Promise(r=>setTimeout(r,s.fast||reduced?0:900));await act('RETRIEVE',x)}finally{$('screen').classList.remove('retrieving')}}
async function scan(name){
 if(!scannerReadyHere(s)||!Object.hasOwn(scans(s),name)||scanJob||s.playing||s.step>=17)throw Error('M-count analysis unavailable.');
 const job={code:net.code,revision:s.revision,message:scanPhases[0]},valid=()=>player()&&net.code===job.code&&s.revision===job.revision&&scannerReadyHere(s)&&!s.playing&&s.step<17;scanJob=job;
 try{if(!s.fast&&!reduced){for(const phase of scanPhases){if(!valid())return;job.message=phase;draw();busy=true;await new Promise(r=>setTimeout(r,1000))}}if(!valid())return;await act('SCAN',name);const received=()=>net.code===job.code&&s.revision>job.revision&&scannerReadyHere(s)&&s.lastScan===name&&s.notice===name+' · '+scans(s)[name]&&!s.playing&&s.step<17;for(let i=0;i<20&&!received()&&net.code===job.code&&s.revision===job.revision;i++)await new Promise(r=>setTimeout(r,100));if(received()){scanJob=null;playCue(scanResultCue(s));nav('Sample',name)}else if(net.code===job.code&&s.revision===job.revision)throw Error('Scan confirmation pending. Review station state before retrying.')}
 finally{if(scanJob===job){scanJob=null;busy=false;draw()}}
}
async function saveCurrentScan(){if(s.deck!=='ISB'||!s.repaired||page!=='Sample'||s.lastScan!==selected)throw Error('Select a specimen sample first.');await act('SAVE SCAN',selected);nav('Specimens')}
async function insertTape(x){await act('INSERT',x);selectPage(x==='CLONE BATCH SIGMA'?'Clone Batch Sigma':'Read',x)}
function toggleView(){if(calibrationJob)calibrationJob.keys={};cancelAnnouncement();finalSilence=false;localPlayer=!localPlayer;mediaKey='';draw();const firstPlayer=localPlayer&&!localPlayerOpened;if(localPlayer)localPlayerOpened=true;activity();$('saver').hidden=!(firstPlayer&&s.step<17&&!s.playing&&!calibrationJob);syncAudio()}
let pausePlayback=()=>{},stopPlayback=()=>{};
function playback(){
 const id=s.playing,key=net.code+':'+id;if(mediaKey===key)return;cancelAnnouncement();mediaKey=key;busy=false;++renderTicket;
 $('crumb').textContent='Media Archive / Research Recordings';$('heading').textContent=rid(id)+' · '+recordings[id][0];
 const target=$('screen');target.dataset.tone='normal';target.replaceChildren();const [title,speaker,lines]=recordings[id];
 const transcript=el('p','',target),chalk=el('div','',target);chalk.className='chalk';chalk.hidden=true;
 const meter=el('progress','',target),status=el('small','',target),box=el('div','',target);meter.max=lines.length;
 let elapsed=0,paused=false,last=performance.now(),finishing=false,voiceIndex=-1,voiceWaiting=false,voiceAge=0,voiceFailed=false;
 const lineTimes=lines.map(l=>Math.max(4500,l.length*58)),ends=lineTimes.map((_,i)=>lineTimes.slice(0,i+1).reduce((n,v)=>n+v,0)),duration=ends[ends.length-1];
 let av=null;const paths=media[id];
 const valid=()=>mediaKey===key&&s.playing===id&&player();
 function useText(reason){cancelSpeech();voiceWaiting=false;voiceFailed=true;status.textContent=reason}
 function voiceAvailable(){return !av&&!voiceFailed&&narrationAllowed()}
 function updateStatus(){if(av)status.textContent='Recorded media';else if(voiceFailed){}else if(s.fast)status.textContent='Fast mode · text playback';else if(muted||s.mute)status.textContent='Muted · text playback';else if(!synth||typeof window.SpeechSynthesisUtterance!=='function')status.textContent='Device speech unavailable · text playback';else {const chosen=deviceVoices().find(v=>voiceIdentity(v)===voicePreference);status.textContent=chosen?'Device narration · '+chosen.name+' ('+chosen.lang+')':'Device narration · British English preferred'}}
 if(paths.video||paths.audio){av=el(paths.video?'video':'audio','',target);av.src=paths.video||paths.audio;av.muted=muted||s.mute;av.onended=()=>{elapsed=duration};av.onerror=()=>{av?.remove();av=null;last=performance.now();updateStatus()};av.play().catch(()=>{if(av){av.remove();av=null;updateStatus()}})}
 updateStatus();
 const pause=button(box,'Pause',()=>{if(finishing)return;paused=!paused;pause.textContent=paused?'Resume':'Pause';if(av){if(paused)av.pause();else av.play().catch(report)}else if(voiceWaiting){if(paused){try{synth.pause()}catch{}}else{try{synth.resume()}catch{}}}});
 pausePlayback=()=>pause.click();stopPlayback=()=>{};if(s.seen[id]){const stop=button(box,'Stop recording',async()=>{if(finishing)return;finishing=true;paused=true;cancelSpeech();av?.pause();try{await act('STOP PLAYBACK',id)}catch(e){finishing=false;paused=false;report(e);av?.play().catch(report)}});stopPlayback=()=>stop.click();}
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
   chalk.hidden=!(id===3&&frac>=.32);if(!chalk.hidden){chalk.textContent='PLACEHOLDER';if(s.boardAid)chalk.setAttribute('aria-label','Frame description: blackboard reads '+code.board);else chalk.setAttribute('aria-hidden','true');if(s.boardAid)chalk.removeAttribute('aria-hidden')}
   if(frac===1&&!finishing){finishing=true;cancelSpeech();try{if(id===7){transcript.textContent='';chalk.hidden=true;finalSilence=true;syncAudio();await new Promise(r=>setTimeout(r,s.fast?100:3000));}if(valid())await act('FINISH',id)}catch(e){finalSilence=false;syncAudio();report(e);button(box,'Confirm playback completion',()=>act('FINISH',id))}return}
   requestAnimationFrame(frame)
 }requestAnimationFrame(frame)
}
function dashboard(){
 const board=$('board');board.replaceChildren();
 const card=(title)=>{let n=el('section','',board);n.className='card';el('h3',title,n);return n};
 const main=card(stages[s.step]||'Watch');el('p',s.step+'/18 · '+(route[s.step]||'Encounter underway'),main);
 el('p',s.playing?'Currently playing '+rid(s.playing):s.step===7&&s.authVerified?'Correct code validated · awaiting DM confirmation':'Awaiting '+(physical.includes(route[s.step])?'physical confirmation':'player interaction'),main);
 const op=(n,label,a,arg='')=>button(n,label,()=>act(a,arg));
 if(physical.includes(route[s.step]))button(main,route[s.step]==='ACTIVATE CRISIS'?'Activate Crisis':route[s.step],()=>act(route[s.step]));
 if(s.danger){const clock=el('p','',main);clock.id='dangerClock';clock.dataset.time=s.danger;updateClock()}
 if(s.step===7&&s.authVerified){el('p','Confirm that the party recovered the physical authorization card, then unlock Recording 005.',main);op(main,'Confirm successful entry & advance','CONFIRM AUTH')}if(s.step>=5&&s.step<8&&!s.card&&!s.authVerified)op(main,'Confirm authorization card recovered','CARD');if(s.step>=12&&s.step<16&&s.deck==='Director'&&!s.directorCylinder)op(main,'Confirm Director’s cylinder inserted','DIRECTOR CYLINDER');
 if(s.step===16){const ready=directorReadiness(s),panel=el('div','',main);panel.className='directorChecklist';el('h3','Final recording · readiness',panel);for(const [label,done] of [['Clone Batch Sigma authenticated',ready.sigma],['Party at Research Director’s office',ready.arrived],['Director’s cylinder inserted',ready.cylinder],['Director office door closed',ready.closed]]){const line=el('div',(done?'✓ ':'○ ')+label,panel);line.dataset.ready=String(done)}if(!s.playing){if(!ready.arrived)button(panel,'Confirm arrival at Director’s office',()=>{if(confirm('Confirm the party physically reached the Research Director’s office?'))return act('ROOM','Director')});else{if(!ready.cylinder)op(panel,'Confirm Director’s cylinder inserted','DIRECTOR CYLINDER');if(!ready.closed)button(panel,'Confirm Director office door closed',()=>{if(confirm('Confirm the office door is physically closed and unobstructed?'))return act('DOOR','Director office door|CLOSED')});if(Object.values(ready).every(Boolean))el('p','REC-007 READY · Play from Player view.',panel).dataset.ready='true'}}}
 if(s.step===18){el('p','Final crisis visual · manual cue, ideally ~20 seconds after the biohazard alert.',main);op(main,s.finalBloodOverlayVisible?'Hide blood handprint':'Show blood handprint',s.finalBloodOverlayVisible?'HIDE BLOOD OVERLAY':'SHOW BLOOD OVERLAY');}
 const session=card('Session');el('p',net.code+' · '+(net.local?'Local rehearsal':net.peer?'Player connected':'Awaiting player'),session);
 if(net.local)button(session,'Player view',toggleView);
 else {let link=new URL(location.href);link.searchParams.delete('dm');let a=el('a','Player link',session);a.href=link.href;a.style.color='var(--mint)';button(session,'Continue on this laptop offline',()=>{if(confirm('Start an independent offline copy of this checkpoint?')){location.href='?dm&offline='+net.code}})}
 op(session,s.fast?'Normal output':'Fast mode','fast');op(session,s.mute?'Enable station sound':'Mute station','mute');
 const objectivePanel=card('Display current objective');objectivePanel.classList.add('objectivePanel');
 const group=objectiveGroup(s);el('p',Object.keys(s.seen).filter(k=>s.seen[k]).length+'/7 recordings completed',objectivePanel);
 for(let i=1;i<=7;i++){const status=i<group?'completed':i===group?'current':'future';const line=el('div','Objective '+i+' · '+rid(i)+' · '+status.toUpperCase(),objectivePanel);line.dataset.status=status}
 if(s.step<17){const shown=visibleObjective(s),current=objective(s);el('p','Current: '+current,objectivePanel);if(shown){const shownLine=el('p','DISPLAYED: '+shown,objectivePanel);shownLine.className='shownObjective';op(objectivePanel,'Hide current objective','HIDE OBJECTIVE')}else op(objectivePanel,'Display current objective','SHOW OBJECTIVE',currentObjectiveId(s))}else el('p','All recording-linked objectives completed.',objectivePanel);
 const hints=card('Operator assistance');if(s.step<18)[1,2,3].forEach(i=>op(hints,'Hint '+i,'HINT',i-1));if(s.step>=4)op(hints,'Accessible board clue','BOARD AID');
 const sys=card('Facility');el('p','Server '+(s.step>=4?'online':'offline')+' · relays '+(s.step>=11?2:s.step>=10?1:0)+'/2 · bench '+(s.repaired?'ready':s.parts?'parts received':'offline'),sys);
 if(s.step>=8&&!s.parts)op(sys,'Register M-count analysis parts','PARTS');if(s.parts&&s.step>=12&&s.step<17&&!s.installed)op(sys,'Confirm M-count components installed','REPAIR');if(s.installed&&!s.repaired&&s.step<17){const cal=card('Calibration controls');el('p','Signal interference: '+(s.calibrationInterference?'ENABLED':'DISABLED'),cal);op(cal,s.calibrationInterference?'Disable interference':'Enable interference','SET INTERFERENCE',s.calibrationInterference?'OFF':'ON');button(cal,'Override calibration — complete manually',()=>{if(confirm('Confirm manual calibration completion?'))return act('OVERRIDE CALIBRATION')})}
 el('p','In possession: '+(Object.keys(s.retrieved).join(', ')||'none')+' · Inserted: '+(Object.keys(s.inserted).join(', ')||'none'),sys);
 const doors=card('Room & doors');let room=el('select','',doors);room.ariaLabel='Physical station / room';Object.keys(rooms).filter(r=>r!=='Director'||s.step===16&&s.inserted['CLONE BATCH SIGMA']||s.room==='Director').forEach(r=>room.add(new Option(r,r,false,r===s.room)));room.onchange=()=>act('ROOM',room.value).catch(report);
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
 const out=$('screen');++renderTicket;busy=false;out.dataset.tone='normal';out.replaceChildren();
 el('h3',p.title,out);el('p',p.question,out);const choices=el('div','',out);choices.className='actions';
 for(const [label,response] of p.choices)button(choices,label,()=>{choices.replaceChildren();el('p','RESPONSE RECORDED: '+label.toUpperCase(),choices);el('p',response,choices);el('p',p.ending,choices);button(choices,p.reset,()=>showEggProgram(p));button(choices,'Return to terminal',()=>draw())});
 button(choices,'Return to terminal',()=>draw());
}
function freestyle(raw){if(!raw)return;const reply=eggReply(raw,eggHistory);if(reply.program)showEggProgram(reply.program);else {if(reply.unknown)playCue('denied');textOut(reply.text,true,reply.unknown?'warning':responseTone(reply.text))}}
function recordSearchMatches(raw){const q=raw.toLowerCase().trim();return !!q&&Object.entries(files(s)).some(([name,body])=>(name+' '+body).toLowerCase().includes(q))}
async function command(value){
 if(bloodVisible())return;
 let raw=value.trim().replace(/\s+/g,' '),v=raw.toUpperCase();
 if(s.playing){if(v==='PAUSE')pausePlayback();if(v==='STOP'||v==='STOP RECORDING')stopPlayback();return}if(calibrationJob||retrievalJob)return;
 if(s.deck==='Archive'&&s.step<14){if(v==='ISB')return act('DECK','ISB');return}
 if(s.deck==='Archive'){
   if(v==='DIR'){nav('Archive');return}if(v.startsWith('SEARCH ')){const term=raw.slice(7);if(!Object.keys(tapes).some(x=>x.includes(term.toUpperCase()))&&findEgg(term))return freestyle(term);query=term;nav('Search');return}
   if(v.startsWith('RETRIEVE '))return retrieve(v.slice(9));if(v==='ISB')return act('DECK','ISB');return freestyle(raw)
 }
 if(['AUTH BLUE','CODE BLUE','CODE CLEARANCE BLUE','AUTHORIZATION CODE BLUE'].includes(v))return act('BLUE');
 if(/^\d{6}$/.test(v))return act('AUTH',v);if(v.startsWith('AUTH '))return act('AUTH',v.slice(5));
 if(v==='DIR'||v==='HOME')return selectPage('Home');
 if(v==='HELP')return selectPage('Help');if(v==='STATUS')return selectPage('Status');if(v==='DOORS'&&s.deck==='ISB'&&s.step>=8)return selectPage('Doors');if(v==='BACK')return goBack();
 if(v==='CLOSE CURRENT ROOM')return closeDoors();
 if(v==='UNLOCK ARMORY'||v==='UNLOCK SECURITY EQUIPMENT ROOM')return act('EQUIPMENT');
 if(v.startsWith('SEARCH ')){const term=raw.slice(7);if(!recordSearchMatches(term)&&findEgg(term))return freestyle(term);query=term;selectPage('Search');return}
 if(v.startsWith('OPEN ')){const path=v.slice(5).replace(/^M[- ]COUNT ANALYSIS$/,'ANALYSIS').replace(/^REVIEW SAVED SPECIMEN RESULTS$/,'SAVED RESULTS');
   const options=['Media Archive','Research Recordings',...(s.deck==='ISB'&&s.step>=8?['Doors']:[]),'Records','Status','Help',...(analysisFolderAvailable(s)?['Analysis']:[]),...(scannerReadyHere(s)?['Saved results','Specimens']:[]),...(s.deck==='ISB'&&s.inserted['CLONE BATCH SIGMA']?['Clone Batch Sigma']:[])];
   const name=options.find(k=>k.toUpperCase()===path);if(name==='Research Recordings'&&!s.seen[1]&&page!=='Media Archive')throw Error('Select the parent media directory first.');if(name)return selectPage(name);
   const doc=Object.keys(files(s)).find(k=>k.toUpperCase()===path);if(doc)return selectPage('Read',doc);
 }
 const m=v.match(/^(?:PLAY|REPLAY) (?:REC-)?0*([1-7])$/);if(m){if(+m[1]===1&&!s.seen[1]&&page!=='Research Recordings')throw Error('Select the local recording directory first.');return act('PLAY',m[1])}
 if(v==='ARCHIVE')return act('DECK','Archive');if(v==='ISB')return s.step>=8?act('DECK','ISB'):freestyle(raw);if(v==='RECEPTION')return act('DECK','Primary');if(v.startsWith('INSERT '))return insertTape(v.slice(7));
 if(v==='SAVE SCAN')return saveCurrentScan();if(v==='DISCARD SCAN'&&s.deck==='ISB'&&s.repaired&&page==='Sample'&&s.lastScan===selected)return nav('Specimens');
 if(v.startsWith('SCAN ')&&s.deck==='ISB'&&s.repaired){let key=Object.keys(scans(s)).find(k=>k.toUpperCase()===v.slice(5).replace(/^TODD$/,'T0DD'));if(key)return scan(key)}
 return freestyle(raw)
}
$('commandForm').onsubmit=e=>{e.preventDefault();if(busy||commandPending||bloodVisible()||scanJob||calibrationJob||retrievalJob)return;let value=$('command').value;$('command').value='';$('error').textContent='';echoCommand(displayCommand(value));commandPending=true;command(value).catch(report).finally(()=>{commandPending=false})};
if('serviceWorker' in navigator&&!params.has('emulator'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
