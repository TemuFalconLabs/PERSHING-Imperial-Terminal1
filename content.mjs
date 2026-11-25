export const code = Object.freeze({ prefix: '47', board: '1938' });
// Leave media paths empty for built-in captions. URLs are relative to this station.
export const media = Object.fromEntries(Array.from({length:7}, (_,i)=>[i+1,{video:'',audio:''}]));
export const recordings = [
  null,
  ['Shift handover','Duty officer',[
    'If this is your first watch, leave the board exactly as you find it. The relief officer keeps the station copy in the drawer marked MEDIA.',
    'I counted eleven coats on twelve hooks this morning. Personnel says that is within tolerance. The owner of the grey one may disagree. Sign the book when you take over.']],
  ['Bench copy','Engineering clerk',[
    'The night shift sent me a reel with the middle missing. Same break on every copy. When I pulled the patch at the server floor box the splice disappeared.',
    'I left the return lead loose for inspection. Somebody please seat it. The next shift needs the original image, edges and all.']],
  ['Framing check','Research technician',[
    'Keep the full width this time. When you crop the board out I lose the rack marks along the left edge.',
    'There. Hold that frame. The Director keeps the other copy in the brass-front locker in her office. If she asks, we have only been checking alignment.']],
  ['Personal dictation','Facility Research Director',[
    'For the relief director taking custody of my cylinder. The first pair on the authorization register is '+code.prefix.split('').join(', ')+'. The remainder is on the board in the bench copy.',
    'Please take the bag by the locker when you leave. My daughter put a note in the pocket. I should like to keep that.']],
  ['Occupancy certificate','Facilities supervisor',[
    'There are two signatures on the occupancy certificate. One belongs to Engineering. The other belongs to Decontamination. I have accepted neither by proxy.',
    'Bring each relay back on its own circuit. When both indicators settle, the laboratory door will release. Whoever takes the watch after mine can sign for the air.']],
  ['Inventory adjustment','Laboratory researcher',[
    'I was told to clear the empty racks. I began with the names. That was an error. The names are the only part of the inventory the Director wants kept.',
    'I have moved the intact record to mechanized storage. Use the archive station beyond this room. Request the tape under its batch designation, then bring it back to the primary reader. Please leave the empty labels where they are.']],
  ['Duty transmission','Facility commander',[
    'This is the facility commander. We have suffered a catastrophic containment failure. All personnel are ordered to evacuate immediately.',
    'The specimens… they’re moving. They were dead. Every single one of them was dead.',
    'Security! Seal that corridor! Stop them! STOP THEM!',
    'The biological agent is airborne. Engineering has shut down the ventilation, but it’s already too late for us.',
    'If anyone finds this recording, whatever you do, do not restart the air circula—']]
];
export const tapes = {
  STARDUST:'Optical alignment plates. Oversize carrier returned empty. Technical drawings retained by the originating office.',
  NECROMANCER:'Interdepartmental routing sheet. Three requisitions share a stamp. Subject and destination redacted in the local copy.',
  CINDER:'Sentinel courier docket. Contingency activated upon confirmation of the Emperor’s death. Target annex withdrawn. No facility tasking attached.',
  'CLONE BATCH SIGMA':'Specimen transfer ledger. Full index requires primary reader.',
  'LIFT INSPECTION':'Four load tests passed. Fifth load discovered to be the inspector standing on the platform.'
};
export const adultScans = {
  Glitch:'ELEVATED · specimen match MG-1842.', Crosseye:'ELEVATED · specimen match MG-6931.',
  Erik:'Trandoshan · NORMAL · no specimen match.', T0DD:'Inorganic · N/A · no biological material. This instrument is not a multimeter.',
  Ryan:'Human · AVERAGE · no specimen match.', Chris:'Duros · ELEVATED · explicitly no specimen match.',
  Merg:'Human · VERY HIGH · registry determination unavailable.',
  Ben:'Rodian · VERY HIGH · registry determination unavailable. Recalibrating ethanol sensor. Fictional BAC 0.67%.',
  Sam:'Species UNKNOWN · count UNKNOWN · WARNING: UNSTABLE · no classification issued.'
};
export const kidScans = Object.fromEntries(['James','Kai','Van','Liz','Henry','Colson','Jasper'].map(n=>[n,'Sample received. Reference interval unavailable. No clinical interpretation issued.']));
// Minimum milestone, title, record. All scene text is served through the same access predicate.
export function files(s){
  const rows=[
    [0,'Staff directory','Duty desk: reception. Server service: floor junction. Equipment Room: sealed. Keep cylinders with the issuing officer.'],
    [0,'Property office','Lost authorization cylinders must be reported using an authorization cylinder. Equipment requests marked URGENT will be processed in the order received.'],
    [0,'Refreshments','Six cups of recycled caf were issued on night shift. Seven complaints were received. Stores requests the return of the extra cup.'],
    [0,'Droid port','Self-test complete. Maintenance staff may borrow the diagnostic lead. Organic personnel must stop using it as a belt.'],
    [3,'Patch ticket','Floor junction SR-2. Return lead loose behind service flap. Do not disturb the other three carriers.'],
    [5,'Security abstract','An escort reported a missing receipt. The incident office retained the envelope, filed the report and requested the receipt as supporting evidence.'],
    [5,'Locker release','Power restored to the Director’s office. Personal locker uses a brass front plate.'],
    [8,'Scanner diagnostic','Bench offline. Replace keyed sensor assembly S-4 and regulator P-2. Matching packing class: instrument, regulated. Calibration requires local access in Analysis.'],
    [8,'Shipping manifest','TECHNICAL STORES • Crate B17: regulated instruments, S-4 + P-2. B71: general lighting, P-2 only. Two similar labels; compare contents before signing.'],
    [9,'Engineering work order','Relay 1 service crew retained the cage key. Parts docket B17. Branch pressure readings disagree by one division. Instrument service deferred.'],
    [11,'Laboratory inventory','Slide frames returned: all. Staff effects returned: none. A researcher has written a forwarding address inside the cover, then rubbed it away.'],
    [11,'Archive directions','Beyond the main laboratory: mechanized tape vault. The local arm can deliver a carrier. The primary station holds the reader.'],
    [13,'Previous service ticket','The archive terminal is broken again. Resolution: Connected power.']
  ];
  if(s.legacy) rows.push([0,'Legacy duty circular','ISSUING OFFICER: NO LONGER EMPLOYED. PLEASE DIRECT COMPLAINTS TO YOUR SURVIVING SUPERVISOR.']);
  if(s.campaign==='MEN') rows.push(
    [5,'Traffic receipt','A transmission without an acknowledgement is entered as disposition unknown. A clerk has crossed out both DELIVERED and LOST.'],
    [11,'Approach docket','SKELD. Flight complement: droid billets throughout. Freight, passengers and contents inspection require separate forms. Neither inspection nor an acknowledgement is attached.'],
    [15,'Specimen ledger','CLONE BATCH SIGMA. Intake 1,000. Surviving transfers 6. Two matched field dossiers. Four subsequent locations unaccounted for. A blank destination is not a death record.'],
    [15,'Optical comparison','Scope reticle: align the notches along the left edge. Crosseye, MG-6931, has the same nick across both field plates. Glitch, MG-1842, appears on the companion plate. Recognition requires no scanner.'],
    [15,'Recovery dispatch','Commander Varrik / Rayne. Drellis Minor: both assets sought alive. Extraction unsuccessful. A bartender was shown the two faces. This copy lacks his reply. The receiving escort never countersigned.'],
    [15,'Research authority','Scientific lead: Dr. Penn Pershing. Authority: Moff Gideon. Transfer requested for further study of surviving subjects and midi-chlorian harvesting. Subsequent disposition annex absent.']);
  else rows.push([11,'Archive shelf slip','A small handprint on the transfer sleeve cuts through two layers of dust. The clerk has kept the sleeve.'],[15,'Specimen ledger','CLONE BATCH SIGMA. Dr. Penn Pershing, late Imperial register. James and Kai appear on separate specimen cards bearing the same project stamp. The purpose column has been removed from both cards.'],[15,'Transfer receipt','Two impressions on the transfer copy match the shelf slip. The archive contains no later disposition.']);
  const minimum={3:2,5:4,9:10,11:12,13:14,15:16};
  return Object.fromEntries(rows.filter(([n])=>s.step>=(minimum[n]??n)).map(([,a,b])=>[a,b]));
}
