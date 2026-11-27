import assert from 'node:assert/strict';
const auth='http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator';
const identity=async()=>{const r=await fetch(auth,{method:'POST',headers:{'content-type':'application/json'},body:'{"returnSecureToken":true}'});assert(r.ok);return r.json()};
const [dm,p,other]=await Promise.all([identity(),identity(),identity()]);
const room='ABCDEFGH';
async function op(user,method,key,body,which=room){let url=new URL('http://127.0.0.1:9000/pershingV1/'+which+(key?'/'+key:'')+'.json');url.searchParams.set('ns','demo-pershing-default-rtdb');if(user)url.searchParams.set('auth',user.idToken);let r=await fetch(url,{method,body:body===undefined?undefined:JSON.stringify(body)});return r.status}
const ok=async p=>assert.equal(await p,200),deny=async p=>assert([401,403].includes(await p));
await ok(op(dm,'PUT','',{owner:dm.localId,state:{step:0},view:{step:0}}));
await deny(op(null,'GET',''));await deny(op(other,'GET','view'));await ok(op(p,'PUT','seat',p.localId));await deny(op(other,'PUT','seat',other.localId));
await ok(op(p,'GET','view'));await deny(op(p,'GET','state'));await deny(op(p,'PUT','owner',p.localId));await deny(op(p,'PUT','view/step',18));await deny(op(p,'PUT','request',{action:'ACTIVATE CRISIS',id:'one',arg:'',revision:0}));
await ok(op(p,'PUT','request',{action:'PLAY',id:'one',arg:'1',revision:0}));await deny(op(p,'PUT','request',{action:'PLAY',id:'two',arg:'2',revision:0}));await deny(op(other,'GET','reply'));
await ok(op(other,'PUT','',{owner:other.localId,state:{step:0},view:{step:0}},'BCDEFGHJ'));await deny(op(dm,'GET','state',undefined,'BCDEFGHJ'));await deny(op(p,'GET','view',undefined,'BCDEFGHJ'));
await ok(op(dm,'DELETE',''));await ok(op(other,'DELETE','',undefined,'BCDEFGHJ'));
console.log('PASS emulator authorization: owner, seat claim, public view, private state, cross-session reads, DM mutation, command allowlist and pending-request protection.');
