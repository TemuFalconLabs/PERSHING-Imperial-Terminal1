import assert from 'node:assert/strict';
import test from 'node:test';
import {fresh,apply,scans,route,validSave} from '../engine.mjs';
import {code,files} from '../content.mjs';
for(const campaign of ['MEN','KIDS'])test(campaign+' approved station progression and disclosure',()=>{
 let s=fresh(campaign);
 const p=(action,arg)=>s=apply(s,'PLAYER',action,arg),d=(action,arg)=>s=apply(s,'DM',action,arg),play=i=>{p('PLAY',i);p('FINISH',i)};
 assert.throws(()=>p('AUTH',code.prefix+code.board));assert.throws(()=>p('PLAY',7));p('BLUE');assert.equal(s.step,0);
 play(1);d('MOUNT CYLINDER');play(2);d('CONNECT SERVER');play(3);d('MOUNT ISB');play(4);
 assert.throws(()=>p('AUTH',code.prefix+code.board));d('CARD');assert.throws(()=>p('AUTH','000000'));p('AUTH',code.prefix+code.board);p('EQUIPMENT');play(5);
 d('RELAY 1');assert.equal(s.notice,"ENVIRONMENTAL RELAY 1: ONLINE\nENVIRONMENTAL RELAY 2: OFFLINE\n\nSafety interlock verification: 1 of 2\nLaboratory access: RESTRICTED");assert.throws(()=>d('ENTER LAB'));assert.throws(()=>d('ROOM','Director'));d('RELAY 2');assert.equal(s.notice,"ENVIRONMENTAL RELAYS: 2 OF 2 ONLINE\n\nResuming normal air circulation...\nOccupational safety check: COMPLETE\n\nLABORATORY ACCESS GRANTED\nYOUR SAFETY IS OUR PRIORITY.");assert(s.danger);d('ENTER LAB');assert.equal(s.deck,'Lab');
 if(campaign==='MEN'){d('PARTS');d('REPAIR');assert.throws(()=>p('SAVE SCAN','Glitch'));assert(!files(s)['Individual specimen record — Glitch']);p('SCAN','Glitch');assert(files(s)['Individual specimen record — Glitch']);assert(!files(s)['Individual specimen record — Crosseye']);p('SCAN','Crosseye');assert(files(s)['Individual specimen record — Crosseye']);for(const n of Object.keys(scans(s)))p('SCAN',n);p('SAVE SCAN','Sam');assert(s.saved.Sam)}
 play(6);p('DECK','Archive');assert.throws(()=>p('RETRIEVE','STARDUST'));d('POWER ARCHIVE');
 p('RETRIEVE','ORDER 66');assert.throws(()=>p('RETRIEVE','ORDER 66'));assert.throws(()=>p('INSERT','ORDER 66'));p('DECK','ISB');p('INSERT','ORDER 66');assert(files(s)['ORDER 66']);assert.throws(()=>p('INSERT','ORDER 66'));assert.equal(s.step,14);p('DECK','Archive');
 p('RETRIEVE','CLONE BATCH SIGMA');p('DECK','Primary');assert.throws(()=>p('INSERT','CLONE BATCH SIGMA'));p('DECK','ISB');p('INSERT','CLONE BATCH SIGMA');
 assert(files(s)['Specimen Transfer Ledger'].includes(campaign==='MEN'?'1,000':'Kai'));assert(!Object.values(files(s)).join().includes('Moff Gideon'));assert.throws(()=>p('PLAY',7));assert.equal(s.step,16);
 d('ROOM','Director');assert.throws(()=>p('PLAY',7));d('DIRECTOR CYLINDER');assert.throws(()=>p('PLAY',7));assert.throws(()=>p('CLOSE'));d('DOOR','Director office door|OBSTRUCTED');assert.throws(()=>p('PLAY',7));d('DOOR','Director office door|CLOSED');assert.equal(s.doors['Plant hatch'],'OPEN');assert(validSave(s));
 play(7);assert.equal(s.notice,"BIOHAZARD ALERT\nAIRBORNE CONTAMINANT DETECTED\n\nEnvironmental relays: ONLINE\nAir circulation: ACTIVE\nBiological containment: FAILED\n\nEMERGENCY PROTOCOL INITIATED");assert.throws(()=>p('PLAY',7));d('hold');assert.throws(()=>d('BEGIN CRISIS'));d('hold');d('BEGIN CRISIS');assert.equal(s.step,18);assert.throws(()=>d('BEGIN CRISIS'));assert.equal(route[s.step],undefined)
});
