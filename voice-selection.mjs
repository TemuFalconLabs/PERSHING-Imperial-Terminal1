// Browser/device-specific preferences; never part of campaign state.
export const voicePreferenceKey='pershing.narration.voice.v1';
export const voiceIdentity=v=>JSON.stringify([v.voiceURI||'',v.name||'',v.lang||'']);
export const isBritishVoice=v=>/^en[-_]GB$/i.test(v.lang||'');
export function orderedVoices(voices){
 const rank=v=>isBritishVoice(v)?0:/^en(?:[-_]|$)/i.test(v.lang||'')?1:2;
 return [...new Map(Array.from(voices||[],v=>[voiceIdentity(v),v])).values()].sort((a,b)=>rank(a)-rank(b)||a.name.localeCompare(b.name)||a.lang.localeCompare(b.lang));
}
export function resolveNarrationVoice(voices,id,preference,automatic){
 return (id>=1&&id<=7&&preference?voices.find(v=>voiceIdentity(v)===preference):null)||automatic(voices,id);
}
export function voiceControlsLocked(state,muted,silent,pending,job,hidden=false){
 return !!(state?.playing||state?.mute||muted||silent||pending||job||hidden||state?.finalBloodOverlayVisible);
}
