import test from 'node:test';
import assert from 'node:assert/strict';
import {eggEntries,findEgg,eggReply,newEggHistory,containsProfanity} from '../easter-eggs.mjs';
import {humorousAdministrativeRecords,tapes,files} from '../content.mjs';
import {fresh} from '../engine.mjs';
import {administrativePage,partitionRecords,isAdministrativeRecord} from '../station-presentation.mjs';

test('V22: all 18 approved humor records are available in MEN only and administrative',()=>{
 const names=Object.keys(humorousAdministrativeRecords);assert.equal(names.length,18);
 const men=files(fresh('MEN')),kids=files(fresh('KIDS'));
 for(const n of names){assert.equal(men[n],humorousAdministrativeRecords[n]);assert(!Object.hasOwn(kids,n));assert(isAdministrativeRecord(n))}
 assert.deepEqual(partitionRecords([...names,'Patch ticket']),{important:['Patch ticket'],routine:names});
});
test('V22: administrative paging, viewed status and clamping',()=>{
 const names=Object.keys(humorousAdministrativeRecords),viewed=new Set();
 let p=administrativePage(names,viewed);assert.equal(p.pages,3);assert.equal(p.unread.length,6);assert.equal(p.totalUnread,18);assert.equal(p.viewed.length,0);
 assert.deepEqual(administrativePage(names,viewed,1).unread,names.slice(6,12));assert.deepEqual(administrativePage(names,viewed,2).unread,names.slice(12));
 viewed.add('record:'+names[0]);p=administrativePage(names,viewed);assert.deepEqual(p.viewed,[names[0]]);assert.equal(p.unread[0],names[1]);assert.equal(p.totalUnread,17);
 names.slice(1,13).forEach(n=>viewed.add('record:'+n));p=administrativePage(names,viewed,2);assert.equal(p.index,0);assert.equal(p.unread.length,5);assert.equal(p.viewed.length,13);
});
test('V22: Cinder supplement is inserted before compliance and existing authentication gate remains',()=>{
 const body=tapes.CINDER;assert(body.includes('IPD-9 Imperial Purge Devices'));assert(body.indexOf('SUPPLEMENTAL DIRECTIVE — ASSET ERADICATION')<body.indexOf('COMPLIANCE DIRECTIVE'));
 assert(body.includes('EVACUATION OF PERSONNEL IS NOT REQUIRED.'));assert(body.includes('REGISTERED TARGETS'));assert(body.endsWith('END OF RECORD'));
 assert(!files({...fresh('MEN'),step:16,deck:'ISB'}).CINDER);
 assert.equal(files({...fresh('MEN'),step:16,deck:'ISB',inserted:{CINDER:true}}).CINDER,body);
 assert(!files({...fresh('MEN'),step:16,deck:'Archive',inserted:{CINDER:true}}).CINDER);
 assert.equal(Object.keys(tapes).length,6);
});
test('V22: 144 new keys resolve exactly; earlier keys remain',()=>{
 assert.equal(eggEntries.length,400);
 for(const e of eggEntries.slice(256)){assert.equal(findEgg(e.key)?.key,e.key)}
 assert.equal(findEgg('ORDER 66').key,'ORDER 66');assert.equal(findEgg('GONK.EXE').key,'GONK.EXE');assert.equal(findEgg('HELLO WORLD').key,'HELLO WORLD');
});
test('V22: keyboard shortcut text normalization',()=>{
 for(const [key,variants] of [['CTRL ALT DEL',['CTRLALTDELETE','CTRL ALT DEL','CONTROL+ALT+DELETE','CTRL+ALT+DEL','CONTROLALTDEL','control + alt delete']],['ALT F4',['ALTF4','ALT F4','ALT+F4','alt + F4']],['CTRL C',['CTRLC','CTRL+C','CONTROL C']],['CTRL V',['CTRLV','CTRL V','CONTROL+V']],['CTRL Z',['CTRLZ','CTRL Z','CTRL+Z']],['CTRL SHIFT ESC',['CTRLSHIFTESC','CTRL SHIFT ESCAPE','CTRL+SHIFT+ESC','CONTROL+SHIFT+ESCAPE']],['ALT TAB',['ALTTAB','ALT TAB','ALT+TAB']],['CTRL S',['CTRLS','CTRL S','CONTROL+S']]])for(const variant of variants)assert.equal(findEgg(variant)?.key,key);
 for(const e of eggEntries.slice(256).filter(x=>/^(?:CTRL|ALT|SHIFT|WIN) /.test(x.key))){assert.equal(findEgg(e.key.replace(/ /g,'+'))?.key,e.key);assert.equal(findEgg(e.key.replace(/ /g,''))?.key,e.key)}
});
test('V22: conduct screening, masking variants, harmless language, and repeat responses',()=>{
 for(const raw of ['shit','ASS','what the fuck','f.u.c.k','sh1t','sh!t','f*ck','a$$','s h i t','B!TCH','motherfucker','damn','bullshit','f u c k'])assert(containsProfanity(raw),raw);
 for(const raw of ['class','classified','assistant','assessment','passage','compass','cockpit','Scunthorpe','assume','poop','butt','fart','butthead','pee','toilet','underwear','number two','CTRL+ALT+DELETE','OPEN Administrative Archives','OPEN Research Director','AUTH 471938','ORDER 66'])assert(!containsProfanity(raw),raw);
 const h=newEggHistory(),first=eggReply('shit',h);assert(first.conduct);assert(first.text.includes('regulation-issue Imperial bar soap.'));assert(!first.text.toLowerCase().includes('shit'));assert(eggReply('ass',h).text.includes('second bar'));assert(eggReply('damn',h).text.includes('Industrial-strength'));assert(eggReply('shit',h).text.includes('sanitation droid'));assert(eggReply('shit',h).text.includes('biological hazard'));assert(eggReply('shit',h).text.includes('biological hazard'));assert.equal(h.unknown,0);
 for(const raw of ['poop','butt','fart','poopy','pee','toot','stinky','booger','butthead','diarrhea','toilet','wipe','number two','underwear','burp']){assert(findEgg(raw));assert(!eggReply(raw,h).conduct)}
 assert(eggReply('shit',newEggHistory()).text.includes('bar soap'));
});
