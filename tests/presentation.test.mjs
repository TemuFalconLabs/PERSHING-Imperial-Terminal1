import test from 'node:test';
import assert from 'node:assert/strict';
import {analysisFolderAvailable,scannerReadyHere,directorReadiness,recordingGroups,structuredScan,analysisPageAfterRepair,partitionRecords,discoveryTone,scanPhases,scanResultCue,newCalibration,tickCalibration} from '../station-presentation.mjs';
import {fresh,canPlay,scans} from '../engine.mjs';
import {recordings} from '../content.mjs';
for(const camp of ['MEN','KIDS'])test(camp+' station display and scanner gates',()=>{
 let s=fresh(camp);assert.equal(analysisFolderAvailable(s),false);
 s={...s,step:8};assert.equal(analysisFolderAvailable(s),true);assert.equal(scannerReadyHere(s),false);
 s={...s,step:12,deck:'ISB'};assert.equal(scannerReadyHere(s),false);const ready={...s,repaired:true};
 assert.equal(scannerReadyHere(ready),true);assert.equal(scannerReadyHere({...ready,deck:'Primary'}),false);assert.equal(analysisFolderAvailable({...ready,deck:'Director'}),false);assert.equal(analysisPageAfterRepair(s,ready,'Analysis'),'Analysis');
 for(const name of Object.keys(scans(ready))){const r=structuredScan(camp,name,scans(ready)[name]);assert(r);assert.equal(r.subject,name.toUpperCase());assert(r.species);assert(r.count);assert(r.registry);assert(r.note);if(camp==='KIDS'){assert.equal(r.species,'UNCLASSIFIED');assert.equal(r.registry,'UNAVAILABLE');}}
 assert.equal(structuredScan(camp,'Missing',undefined),null);
 s={...fresh(camp),step:9,seen:{1:true,2:true,3:true,4:true,5:true}};let g=recordingGroups(s,recordings,canPlay);assert.deepEqual(g.replays,[1,2,3,4,5]);assert.deepEqual(g.available,[]);
 s={...s,step:12,deck:'ISB'};g=recordingGroups(s,recordings,canPlay);assert.deepEqual(g.available,[6]);assert.deepEqual(g.replays,[]);
 s={...s,step:16,deck:'ISB',inserted:{'CLONE BATCH SIGMA':true}};assert.equal(directorReadiness(s).arrived,false);assert.equal(directorReadiness(s).sigma,true);
 s={...s,deck:'Director',room:'Director',directorCylinder:true,doors:{...s.doors,'Director office door':'CLOSED'}};assert(Object.values(directorReadiness(s)).every(Boolean));assert.equal(canPlay(s,7),true);assert.equal(directorReadiness({...s,doors:{...s.doors,'Director office door':'OPEN'}}).closed,false);
});
test('MEN structured results preserve specimen matches, counts and humor',()=>{
 const s=fresh('MEN'),r=n=>structuredScan('MEN',n,scans(s)[n]);
 assert.equal(r('Glitch').registry,'CONFIRMED — MG-1842');assert.equal(r('Glitch').species,'UNCONFIRMED');assert.equal(r('Crosseye').registry,'CONFIRMED — MG-6931');assert.equal(r('Chris').species,'DUROS');assert.equal(r('Chris').registry,'NONE');assert.equal(r('Chris').tone,'warning');assert.equal(r('Erik').tone,'normal');assert.equal(r('Merg').count,'VERY HIGH');assert.equal(r('Ben').note,'Recalibrating ethanol sensor. Fictional BAC 0.67%.');assert.equal(r('T0DD').note,'Subject appears to be a defective, ambulatory can opener.\nCorrection: Partially ambulatory.');assert.equal(r('T0DD').missing,'RIGHT LEG');assert.equal(r('T0DD').warning,'NO BIOLOGICAL SAMPLE DETECTED.');assert.equal(r('T0DD').registry,'NONE');assert.equal(r('Sam').tone,'critical');
});

test('priority groups, acknowledgement, scan timing and sounds',()=>{const p=partitionRecords(['Staff directory','Shipping manifest','Patch ticket','Refreshments']);assert.deepEqual(p.routine,['Staff directory','Refreshments']);assert.deepEqual(p.important,['Shipping manifest','Patch ticket']);const seen=new Set();assert.equal(discoveryTone('record:a',seen),'new');seen.add('record:a');assert.equal(discoveryTone('record:a',seen),'reviewed');assert.equal(discoveryTone('record:a',seen,true),'advance');assert.equal(scanPhases.length,3);assert.equal(scanResultCue({campaign:'MEN',lastScan:'Sam'}),'denied');assert.equal(scanResultCue({campaign:'MEN',lastScan:'Glitch',matches:{Glitch:true}}),'match');assert.equal(scanResultCue({campaign:'MEN',lastScan:'T0DD'}),'scan');assert.equal(scanResultCue({campaign:'KIDS',lastScan:'James'}),'scan')});

test('V19 cooperative calibration: two locks, visible bounded interference, immediate disable',()=>{let m=newCalibration(),one=false,two=false,pulse=false;for(let i=0;i<3600&&!m.done;i++){const keys={a:m.x>.025,d:m.x<-.025,up:m.y>.025,down:m.y<-.025};m=tickCalibration(m,.016,keys,true,()=>.4);one||=m.events.includes('lock1');two||=m.events.includes('lock2');pulse||=!!m.axis}assert(one&&two&&m.done);assert(pulse);let q={...newCalibration(),axis:'horizontal',remaining:.5,stability:1,x:0,y:0,inside:true};q=tickCalibration(q,.016,{},false);assert.equal(q.axis,'');assert.equal(q.remaining,0);assert(q.stability>=1);q={...q,lock:2,x:.9,inside:true,stability:2};q=tickCalibration(q,.016,{},false);assert.equal(q.lock,2);assert.equal(q.stability,0)});
