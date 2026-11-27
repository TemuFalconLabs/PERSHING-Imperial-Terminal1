import {apply,fresh,normalize,validSave} from './engine.mjs';
const config={apiKey:'AIzaSyCoeR3eJ_2kQsRfXi_c2c4MTS4GSpl2STg',authDomain:'pershing-imperial-terminal.firebaseapp.com',databaseURL:'https://pershing-imperial-terminal-default-rtdb.firebaseio.com',projectId:'pershing-imperial-terminal',storageBucket:'pershing-imperial-terminal.firebasestorage.app',messagingSenderId:'126649528532',appId:'1:126649528532:web:6b7c1df73178283e3b8b41'};
const allowed=new Set(['PLAY','FINISH','STOP PLAYBACK','CALIBRATE','AUTH','CLOSE','DECK','INSERT','RETRIEVE','EQUIPMENT','BLUE','SCAN','SAVE SCAN']);
const letters='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const newCode=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),n=>letters[n%letters.length]).join('');
export const cacheKey=(code)=>'pershing.v2.dm.'+code;
export const publicView=s=>{const {log,danger,hold,...view}=s;return view};
function save(code,s){localStorage.setItem(cacheKey(code),JSON.stringify(s))}
function change(session,role,action,arg,now){
 let old=normalize(session.state),s;
 if(['RESET','UNDO','IMPORT','ADVANCE'].includes(action)){
   if(role!=='DM')throw Error('Operator access required.');
   if(action==='RESET')s=fresh(old.campaign);
   if(action==='UNDO')s=session.previous;
   if(action==='IMPORT')s=JSON.parse(arg);
   if(action==='ADVANCE'){
     if(old.step>=17)throw Error('Use crisis controls.');
     s={...old,step:old.step+1,playing:0,hint:''};
     if(s.step===11){s.danger=now;s.doors={...s.doors,'Lab corridor':'OPEN'};}if(s.step===8)s.card=true;if(s.step===17){s.directorCylinder=true;s.deck='Director';s.room='Director';s.doors={...s.doors,'Director office door':'CLOSED'};}
     if(s.step===12){s.deck='ISB';s.room='Laboratory'}if(s.step===14){s.deck='Archive';s.room='Archive'}if(s.step===16){s.deck='ISB';s.room='ISB';s.inserted={...s.inserted,'CLONE BATCH SIGMA':true};delete s.retrieved['CLONE BATCH SIGMA'];}
   }
   if(!validSave(s)||s.campaign!==old.campaign)throw Error('Checkpoint unavailable or belongs to a different campaign.');
   s=normalize(s);s.playbackSerial=Math.max(old.playbackSerial||0,s.playbackSerial||0)+1;s.revision=old.revision+1;s.notice='Station checkpoint synchronized.';
   s.log=[...old.log.slice(-59),{at:now,who:role,action,detail:'Operator checkpoint'}];
 }else s=apply(old,role,action,arg,now);
 const checkpoints=action==='RESET'?{}:{...session.checkpoints};
 if(old.step===10&&s.step===11)checkpoints.beforeCirculation=old;
 if(old.step===16&&action==='PLAY'&&Number(arg)===7)checkpoints.beforeTransmission=old;
 return {...session,checkpoints,previous:old,state:s,view:publicView(s)};
}
export function localSession(campaign,source,update){
 let id=source?'LOCAL-'+source:'LOCAL-'+campaign;
 let restored=JSON.parse(localStorage.getItem(cacheKey(source||id))||'null');
 if(restored&&!validSave(restored))throw Error('Incompatible older checkpoint. Start a fresh revised watch or import a version 2 checkpoint.');
 let data={state:normalize(restored||fresh(campaign))};
 const refresh=()=>{save(id,data.state);if(data.checkpoints)localStorage.setItem(cacheKey(id)+'.checkpoints',JSON.stringify(data.checkpoints));update(data.state,{code:id,local:true,connected:true,peer:false})};
 data.checkpoints=JSON.parse(localStorage.getItem(cacheKey(source||id)+'.checkpoints')||'{}');
 refresh();
 return {send:async(action,arg='',actor='DM')=>{data=change(data,actor,action,arg,Date.now());refresh()}};
}
export async function networkSession({dm,code,campaign,create,emulate,update,error}){
 const f=await import('./sdk.mjs');
 const app=f.initializeApp(emulate?{...config,projectId:'demo-pershing',databaseURL:'https://demo-pershing-default-rtdb.firebaseio.com'}:config);
 const auth=f.getAuth(app),db=f.getDatabase(app);
 if(emulate){
   if(!['localhost','127.0.0.1'].includes(location.hostname))throw Error('Emulator requires localhost.');
   f.connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});f.connectDatabaseEmulator(db,'127.0.0.1',9000);
 }
 await auth.authStateReady();const uid=(auth.currentUser|| (await f.signInAnonymously(auth)).user).uid;
 const path='pershingV1/'+code, at=s=>f.ref(db,path+(s?'/'+s:''));
 if(create){const state=fresh(campaign);await f.set(at(''),{owner:uid,state,view:publicView(state),hostOnline:false});}
 else if(dm){if((await f.get(at('owner'))).val()!==uid)throw Error('Use the browser profile that created this session.');}
 else {try{await f.set(at('seat'),uid)}catch(e){if((await f.get(at('seat'))).val()!==uid)throw e}}
 let state=null,online=false,peer=false,busy=false;
 const show=()=>{if(state)update(normalize(state),{code,connected:online,peer,local:false})};
 f.onValue(f.ref(db,'.info/connected'),async snap=>{
   online=snap.val()===true;show();if(!online)return;
   const presence=at(dm?'hostOnline':'playerOnline');
   try{await f.onDisconnect(presence).set(false);await f.set(presence,true)}catch(e){error(e.message)}
 });
 f.onValue(at(dm?'playerOnline':'hostOnline'),snap=>{peer=snap.val()===true;show()},e=>error(e.message));
 f.onValue(at(dm?'state':'view'),snap=>{state=snap.val();if(state?.version!==2){state=null;error('This session uses an older checkpoint. Create a new revised session.');return}if(state&&dm)save(code,normalize(state));show()},e=>error(e.message));
 if(dm)f.onValue(at('checkpoints'),snap=>{localStorage.setItem(cacheKey(code)+'.checkpoints',JSON.stringify(snap.val()||{}));show()},e=>error(e.message));
 async function transact(fn){
   // Prime the SDK cache; a first transaction callback can otherwise receive null.
   await f.get(at(''));let failure='';
   const res=await f.runTransaction(at(''),root=>{if(!root)return root;try{return fn(root)}catch(e){failure=e.message;return undefined}},{applyLocally:false});
   if(!res.committed||!res.snapshot.exists())throw Error(failure||'Session changed. Try again.');
 }
 if(dm)f.onValue(at('request'),async snap=>{
   const q=snap.val();if(!q)return;
   try{await transact(root=>{
     if(root.request?.id!==q.id)return root;
     let message='';try{if(!allowed.has(q.action)||root.state.revision!==q.revision)throw Error('State changed. Review the current station and retry.');
       root=change(root,'PLAYER',q.action,q.arg,Date.now());
     }catch(e){message=e.message;let s=normalize(root.state);s.log=[...s.log.slice(-59),{at:Date.now(),who:'PLAYER',action:'Rejected '+q.action,detail:message}];root.state=s;}
     delete root.request;root.reply={id:q.id,message};return root;
   })}catch(e){error(e.message)}
 },e=>error(e.message));
 return {send:async(action,arg='')=>{
   if(!online||(!dm&&!peer))throw Error('Connection interrupted. Wait for both stations.');
   if(dm)return transact(root=>change(root,'DM',action,arg,Date.now()));
   if(busy)throw Error('Command pending.');busy=true;
   const id=crypto.randomUUID(),request={id,action,arg:String(arg),revision:state.revision};
   let stop,timer;
   try{await f.set(at('request'),request);await new Promise((resolve,reject)=>{
     timer=setTimeout(()=>reject(Error('Host confirmation pending. Inspect station state before retrying.')),12000);
     stop=f.onValue(at('reply'),snap=>{const r=snap.val();if(r?.id===id){if(r.message)reject(Error(r.message));else resolve()}},reject);
   })}finally{clearTimeout(timer);stop?.();busy=false}
 }};
}
