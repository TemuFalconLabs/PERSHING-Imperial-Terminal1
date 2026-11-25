import assert from 'node:assert/strict';
import test from 'node:test';
import {fresh,apply,physical,locallyClosed,scans,route} from '../engine.mjs';
import {code,files} from '../content.mjs';
for(const campaign of ['MEN','KIDS'])test(campaign+' complete progression and disclosure',()=>{
 let s=fresh(campaign);
 const a=(actor,action,arg)=>s=apply(s,actor,action,arg);
 const p=(action,arg)=>a('PLAYER',action,arg),d=(action,arg)=>a('DM',action,arg);
 function play(i){p('PLAY',i);p('FINISH',i)}
 assert.throws(()=>p('AUTH',code.prefix+code.board));assert.throws(()=>p('PLAY',7));
 p('BLUE');assert.equal(s.step,0);assert.equal(files(s)['Specimen ledger'],undefined);
 play(1);d(physical[0]);play(2);d('CONNECT SERVER');play(3);d('MOUNT DIRECTOR');play(4);
 assert.throws(()=>p('AUTH','000000'));p('AUTH',code.prefix+code.board);p('EQUIPMENT');play(5);
 d('RELAY 1');assert.throws(()=>d('ENTER LAB'));d('RELAY 2');assert(s.danger);assert(!files(s)['Laboratory inventory']);d('ENTER LAB');
 if(campaign==='MEN'){d('PARTS');d('REPAIR');for(const name of Object.keys(scans(s)))p('SCAN',name);p('SAVE SCAN','Sam')}
 play(6);p('DECK','Archive');assert.throws(()=>p('RETRIEVE','STARDUST'));d('POWER ARCHIVE');
 p('RETRIEVE','CINDER');p('DECK','Primary');p('INSERT','CINDER');assert.equal(s.step,14);p('DECK','Archive');
 p('RETRIEVE','CLONE BATCH SIGMA');assert.throws(()=>p('INSERT','CLONE BATCH SIGMA'));p('DECK','Primary');p('INSERT','CLONE BATCH SIGMA');
 assert(files(s)['Specimen ledger'].includes(campaign==='MEN'?'1,000':'Kai'));assert.throws(()=>p('PLAY',7));
 d('DOOR','Vestibule|OBSTRUCTED');p('CLOSE');assert(!locallyClosed(s));d('DOOR','Vestibule|OPEN');p('CLOSE');assert(locallyClosed(s));assert.equal(s.doors['Plant hatch'],'OPEN');assert.equal(s.step,16);
 play(7);d('hold');assert.throws(()=>d('BEGIN CRISIS'));d('hold');d('BEGIN CRISIS');assert.equal(s.step,18);assert.throws(()=>d('BEGIN CRISIS'));assert.equal(route[s.step],undefined)
});
