import assert from 'node:assert/strict';
import test from 'node:test';
import {fresh,apply,normalize,visibleObjective,objective} from '../engine.mjs';
for(const campaign of ['MEN','KIDS'])test(campaign+' DM-only objective lifecycle',()=>{
 let s=fresh(campaign);assert.equal(visibleObjective(s),'');assert.throws(()=>apply(s,'PLAYER','SHOW OBJECTIVE','step:0'));assert.throws(()=>apply(s,'DM','SHOW OBJECTIVE','step:1'));
 s=apply(s,'DM','SHOW OBJECTIVE','step:0');assert.equal(visibleObjective(s),objective(s));assert.equal(visibleObjective(normalize(JSON.parse(JSON.stringify(s)))),objective(s));s=apply(s,'PLAYER','PLAY','1');assert.equal(visibleObjective(s),objective(s));s=apply(s,'PLAYER','FINISH','1');assert.equal(visibleObjective(s),'');
 s={...fresh(campaign),step:9};s=apply(s,'DM','SHOW OBJECTIVE','step:9');const both=visibleObjective(s);s=apply(s,'DM','RELAY 1');assert.equal(visibleObjective(s),both);s=apply(s,'DM','RELAY 2');assert.equal(visibleObjective(s),'');
 s={...fresh(campaign),step:16,room:'Director',deck:'Director',inserted:{'CLONE BATCH SIGMA':true}};s=apply(s,'DM','SHOW OBJECTIVE','director:cylinder');s=apply(s,'DM','DIRECTOR CYLINDER');assert.equal(visibleObjective(s),'');s=apply(s,'DM','SHOW OBJECTIVE','director:door');s=apply(s,'DM','DOOR','Director office door|CLOSED');assert.equal(visibleObjective(s),'');s=apply(s,'DM','SHOW OBJECTIVE','director:play');s=apply(s,'PLAYER','PLAY','7');assert.equal(visibleObjective(s),objective(s));s=apply(s,'PLAYER','FINISH','7');assert.equal(visibleObjective(s),'');
});
