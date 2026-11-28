import test from 'node:test';
import assert from 'node:assert/strict';
import {voiceIdentity,isBritishVoice,orderedVoices,resolveNarrationVoice,voiceControlsLocked} from '../voice-selection.mjs';
const gb={voiceURI:'gb',name:'Daniel',lang:'en-GB'},gb2={voiceURI:'gb2',name:'Alex',lang:'en_GB'},us={voiceURI:'us',name:'American',lang:'en-US'},fr={voiceURI:'fr',name:'French',lang:'fr-FR'};
test('Voice list prioritizes actual British English voices without inventing voices',()=>{
 assert.deepEqual(orderedVoices([fr,us,gb,gb2,gb]).map(v=>v.voiceURI),['gb2','gb','us','fr']);
 assert.deepEqual(orderedVoices([]),[]);assert.equal(isBritishVoice(gb),true);assert.equal(isBritishVoice(gb2),true);assert.equal(isBritishVoice(us),false);
});
test('Chosen voice applies only to research narration; missing voice and announcement use automatic',()=>{
 const automatic=(voices,id)=>id===8?gb2:gb;
 for(let id=1;id<=7;id++)assert.equal(resolveNarrationVoice([gb,us],id,voiceIdentity(us),automatic),us);
 assert.equal(resolveNarrationVoice([gb],1,voiceIdentity(us),automatic),gb);
 assert.equal(resolveNarrationVoice([gb,us],1,'',automatic),gb);
 assert.equal(resolveNarrationVoice([gb,gb2,us],8,voiceIdentity(us),automatic),gb2);
 assert.notEqual(voiceIdentity(gb),voiceIdentity({...gb,lang:'en-US'}));
});
test('Voice controls cannot interrupt active media, muted, emergency or announcement state',()=>{
 assert.equal(voiceControlsLocked(undefined,false,false,false,null,false),false);
 for(const state of [{playing:1},{mute:true},{finalBloodOverlayVisible:true}])assert.equal(voiceControlsLocked(state,false,false,false,null,false),true);
 assert.equal(voiceControlsLocked({},true,false,false,null,false),true);
 assert.equal(voiceControlsLocked({},false,true,false,null,false),true);
 assert.equal(voiceControlsLocked({},false,false,true,null,false),true);
 assert.equal(voiceControlsLocked({},false,false,false,{},false),true);
 assert.equal(voiceControlsLocked({},false,false,false,null,true),true);
});
