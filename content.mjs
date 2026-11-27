export const code = Object.freeze({ prefix: '47', board: '1938' });
// Leave media paths empty for built-in captions. URLs are relative to this station.
export const media = Object.fromEntries(Array.from({length:7}, (_,i)=>[i+1,{video:'',audio:''}]));
export const recordings = [
  null,
  [
    "Shift handover",
    "Duty officer",
    [
      "Routine security handover. For those recently assigned to this facility, the Research Division requires that all personnel authenticate their credentials before accessing the internal archive.",
      "A duty authorization cylinder has been provided at the security desk. You'll find it in the drawer marked MEDIA. Insert it into the terminal reader to establish your credentials.",
      "And please return it when you're finished. The last officer who misplaced one spent three weeks completing the paperwork necessary to report it missing."
    ]
  ],
  [
    "Engineering report",
    "Engineering clerk",
    [
      "Engineering report. The reception terminal has lost its connection to the facility's main server. The terminal itself is functional, but most of the Research Division's records are currently inaccessible.",
      "I've traced the problem to a disconnected network cable beneath the service panel in the server room. I've submitted two maintenance requests, neither of which has been acknowledged.",
      "If you're taking over the engineering shift, reconnect the cable and verify that the research archives are accessible from reception. The Director has made it abundantly clear that interruptions to her research will not be tolerated."
    ]
  ],
  [
    "Research briefing",
    "Research scientist",
    [
      "Research log. The latest series of trials has concluded. As anticipated, the mortality rate among the experimental clone specimens was exceptionally high. However, the results were not entirely without merit.",
      "A small number of clones demonstrated remarkable biological resilience, surviving procedures that proved fatal to the remainder of their cohort. Interestingly, blood analysis has also revealed slightly elevated M-counts among the surviving specimens.",
      "Dr. Pershing believes these characteristics may prove particularly valuable to his ongoing research. At his request, I have authorized the transfer of the surviving specimens to another research facility for more extensive examination.",
      "We have spent considerable resources investigating why so many specimens have failed. Perhaps we have been asking the wrong question.",
      "What makes these particular specimens so difficult to kill?"
    ]
  ],
  [
    "ISB security authorization",
    "ISB security officer",
    [
      "ISB security officer’s personal log. Given the sensitive nature of our work, our benefactors have mandated multifactor authentication for access to restricted research materials and facility controls.",
      "An ISB security credential must first be authenticated at the reception terminal. Once those credentials have been verified, my six-digit authorization key will grant the necessary Omega clearance. A physical copy of the key is secured in the safe in my office.",
      "I consider these additional security procedures an unnecessary administrative burden. Nevertheless, our benefactors have made it quite clear that discretion is not a matter of personal preference."
    ]
  ],
  [
    "Ventilation interlock",
    "Facilities supervisor",
    [
      "Facilities engineering report. Following several complaints from the research staff regarding air quality within the main laboratory, the Director has authorized maintenance of the facility's environmental control systems.",
      "Imperial occupational safety regulations prohibit access to the laboratory while its ventilation systems are offline. Both environmental relays must be restored before the entrance will release.",
      "The first relay is located in Engineering. The second is in the Decontamination section. Once both are operational, normal air circulation and laboratory access will resume automatically.",
      "Remember, personnel safety is the responsibility of every Imperial employee."
    ]
  ],
  [
    "Experimental procedures",
    "Laboratory researcher",
    [
      "Supplemental research log. One of the more persistent complications associated with repeated experimentation has been the psychological deterioration of the specimens. Those surviving an initial procedure frequently exhibit considerable resistance to subsequent testing.",
      "To address this complication, we have adapted the inhibitor chip technology originally developed for the Republic's clone army. Unlike their predecessors, these implants are not intended to enforce obedience or behavioral directives.",
      "Their purpose is to prevent the formation of long-term memories. A specimen may remain fully conscious throughout an experimental procedure without retaining any recollection of the experience afterward.",
      "The results have been encouraging. Several specimens have now undergone repeated procedures without exhibiting any recognition of the researchers responsible for their treatment.",
      "Dr. Pershing has requested the complete experimental histories of the surviving specimens. Given the sensitive nature of these records, the original documentation has been transferred to the secured research archive under the designation Clone Batch Sigma.",
      "The specimens may have no memory of what we have done to them, but it is imperative that we maintain a complete record of every procedure and its outcome."
    ]
  ],
  [
    "Confidential commander transmission",
    "Facility commander",
    [
      "This is the facility commander. We have suffered a catastrophic containment failure. I am ordering the immediate evacuation of all surviving personnel.",
      "We initially believed the experimental agent had failed. The specimens were pronounced dead and preparations were underway for their disposal.",
      "They weren't dead. Or at least… they didn't stay dead.",
      "Security! Seal that corridor! I said seal it!",
      "Engineering has confirmed that the biological agent is airborne. We've shut down the ventilation systems in an attempt to contain it, but it's already too late for most of us.",
      "If anyone receives this transmission, do not enter the laboratory. Do not attempt to recover the specimens. And whatever you do, DO NOT RESTART THE AIR CIRCULA—"
    ]
  ]
];
export const tapes = {
  "STARDUST": "PROJECT STARDUST\n\nIMPERIAL CLASSIFIED RESEARCH ARCHIVE\n\nClassification: TOP SECRET\n\nProject oversight: Director Orson Krennic\n\nLead research scientist: Dr. Galen Erso\n\nResearch installation: Eadu\n\nProject status: TERMINATED\n\nPROJECT SUMMARY\n\nOriginally presented as an advanced energy research initiative, Project Stardust successfully developed a method of amplifying and concentrating energy through the use of kyber crystals.\n\nThe resulting technology was incorporated into the primary weapons system of the Empire's DS-1 orbital battle station, commonly known as the Death Star.\n\nPOST-INCIDENT SECURITY REVIEW\n\nFollowing the destruction of the battle station at Yavin, an internal investigation determined that deliberate sabotage by research personnel contributed to its loss.\n\nEffective immediately, all personnel assigned to classified Imperial research initiatives shall be subject to enhanced surveillance, compartmentalized access and independent verification of experimental results.\n\nPERSONNEL COMPLIANCE NOTICE\n\nScientific expertise does not exempt an individual from suspicion of treason.\n\nEND OF RECORD",
  "NECROMANCER": "PROJECT NECROMANCER\n\nIMPERIAL ADVANCED SCIENCE DIVISION\n\nClassification: TOP SECRET\n\nOriginal research director: Dr. Royce Hemlock\n\nOriginal research installation: Mount Tantiss, Wayland\n\nCurrent research installations: CLASSIFIED\n\nPrimary beneficiary: RESTRICTED\n\nPROJECT SUMMARY\n\nProject Necromancer was established to overcome the biological limitations of conventional cloning technology, with particular emphasis on the successful replication and preservation of elevated M-counts.\n\nEarly experiments demonstrated that genetically viable clones did not necessarily retain the biological characteristics of their donors. Attempts to introduce these characteristics artificially resulted in exceptionally high specimen mortality.\n\nRESEARCH CONTINUITY DIRECTIVE\n\nDespite the loss of the Mount Tantiss research installation, the objectives of Project Necromancer remain a matter of the highest Imperial priority.\n\nSurviving research materials have been distributed among classified installations. All viable specimens demonstrating resistance to experimental procedures or elevated M-counts are to be preserved for further examination.\n\nSPECIAL AUTHORIZATION\n\nThe ultimate purpose of Project Necromancer is restricted to executive-level personnel. Research staff are reminded that successful execution of their assigned duties does not require knowledge of the project's final objective.\n\nEND OF RECORD",
  "CINDER": "OPERATION CINDER\n\nIMPERIAL EXECUTIVE CONTINGENCY DIRECTIVE\n\nClassification: TOP SECRET\n\nIssuing authority: Emperor Palpatine\n\nActivation criteria: Confirmed death of the Emperor\n\nDelivery method: Sentinel messenger droids\n\nOperational status: ACTIVATED\n\nOPERATIONAL SUMMARY\n\nFollowing confirmation of the Emperor's death at Endor, designated Imperial commanders received instructions to commence punitive operations against selected inhabited worlds.\n\nThe authorized deployment of climate disruption arrays and Imperial naval forces was intended to render targeted population centers uninhabitable.\n\nREGISTERED TARGETS\n\nNaboo\n\nVardos\n\nBurnin Konn\n\nNacronis\n\nAdditional targets: CLASSIFIED\n\nEXECUTIVE CLARIFICATION\n\nA world's demonstrated loyalty to the Empire does not constitute grounds for exemption.\n\nImperial commanders are reminded that the Emperor's final orders supersede all previous commitments to the protection of Imperial citizens and military personnel.\n\nCOMPLIANCE DIRECTIVE\n\nThe death of the Emperor does not absolve his servants of their obligation to obey him.\n\nEND OF RECORD",
  "ORDER 66": "ORDER 66\n\nIMPERIAL SECURITY BUREAU — HISTORICAL REVIEW\n\nClassification: TOP SECRET\n\nIssuing authority: Supreme Chancellor Palpatine\n\nOriginal installation: Kamino\n\nProgram: Clone behavioral modification\n\nDirective status: EXECUTED\n\nPROGRAM OVERVIEW\n\nDuring the development of the Grand Army of the Republic, Kaminoan scientists implanted biological inhibitor chips within the developing clone specimens.\n\nAlthough the Jedi were informed that these implants were intended to regulate aggressive behavior, their actual purpose was to ensure unconditional compliance with certain classified executive directives.\n\nDIRECTIVE EXECUTION\n\nUpon activation of Order 66, clone personnel were compelled to regard their Jedi commanders as enemies of the Republic, overriding established personal relationships, loyalties and independent judgment.\n\nRESEARCH FINDINGS\n\nWhile the program was overwhelmingly successful, isolated instances of noncompliance were documented. Genetic abnormalities, implant defects and unauthorized surgical removal were identified as potential contributing factors.\n\nIMPERIAL RESEARCH APPLICATIONS\n\nThe success of the inhibitor chip program demonstrated that biological implants could be utilized to modify complex neurological functions.\n\nFurther research into alternative applications of this technology has been authorized by the Imperial Advanced Science Division.\n\nFINAL ASSESSMENT\n\nLoyalty is considerably more reliable when it is not left to the discretion of the individual.\n\nEND OF RECORD",
  "CLONE BATCH SIGMA": "CLONE BATCH SIGMA — general classified records",
  "LIFT INSPECTION": "ARCHIVE LIFT INSPECTION\n\nIMPERIAL DEPARTMENT OF OCCUPATIONAL SAFETY\n\nClassification: ADMINISTRATIVE\n\nInspection type: Routine mechanical safety\n\nEquipment: Archive retrieval lift\n\nInspection result: PASSED WITH EXCEPTIONS\n\nINSPECTION FINDINGS\n\nDuring routine load testing, the archive retrieval lift consistently reported an unexplained excess weight of 87 kilograms.\n\nEngineering conducted an extensive diagnostic examination of the lift's sensors, mechanical components and calibration software. No deficiencies were identified.\n\nROOT CAUSE ANALYSIS\n\nThe inspecting officer was standing on the lift.\n\nCORRECTIVE ACTION\n\nThe inspecting officer was instructed to step off the lift. Subsequent readings were within acceptable tolerances.\n\nADMINISTRATIVE FOLLOW-UP\n\nThe inspecting officer has formally disputed the findings, citing concerns regarding the accuracy of his recorded body weight.\n\nThe matter has been referred to Personnel for further investigation.\n\nEquipment status: OPERATIONAL\n\nPersonnel grievance: PENDING\n\nEND OF RECORD"
};
export const sigmaRecords = {
  "Specimen Transfer Ledger": "CLONE BATCH SIGMA\n\nCLASSIFIED SPECIMEN TRANSFER LEDGER\n\nOriginal specimens: 1,000\n\nDid not survive: 994\n\nKnown survivors: 6\n\nRecorded survival rate: 0.6%\n\nEXPERIMENTAL ASSESSMENT\n\nDespite the exceptionally high mortality rate, six specimens demonstrated sufficient biological resilience to warrant continued experimentation. Blood analysis confirmed elevated M-counts among the surviving specimens.\n\nTRANSFER AUTHORIZATION\n\nAll six surviving specimens were designated priority research assets and authorized for transfer to another classified Imperial research installation.\n\nSUBSEQUENT DISPOSITION\n\nReceiving facility confirmation was never obtained. Subsequent attempts to establish the whereabouts of the surviving specimens have yielded only limited intelligence.\n\nSpecimens with subsequent intelligence records: 2\n\nSpecimens without subsequent intelligence records: 4\n\nRESEARCH ASSET RECOVERY DIRECTIVE\n\nAll surviving specimens are considered irreplaceable research assets. Recovery alive remains a priority.\n\nASSOCIATED CLASSIFIED RECORDS\n\nIndividual specimen records available upon biological specimen scan.\n\n[Recovery Dispatch]\n\n[Research Oversight Authorization]\n\n[Crime Lord Morgan]",
  "Drellis Minor Recovery Operation": "DRELLIS MINOR\n\nIMPERIAL SECURITY BUREAU — COVERT RECOVERY OPERATION\n\nClassification: TOP SECRET\n\nAssigned personnel: Commander Varrick and Rane\n\nPrimary objective: Recovery of biological research assets\n\nOperational status: ONGOING\n\nINTELLIGENCE ASSESSMENT\n\nRecent intelligence has confirmed the presence of two surviving Clone Batch Sigma test subjects on Drellis Minor. Commander Varrick and Rane have been dispatched to apprehend both subjects and arrange their transfer to a classified research installation.\n\nOPERATIONAL DISCRETION\n\nGiven the sensitive nature of the research program, direct Imperial involvement is to remain concealed from the local population.\n\nThe utilization of local criminal organizations, including the gang commonly referred to as the Ridiculous Six, has proven useful in disguising Imperial recovery efforts as ordinary criminal activity.\n\nEngineered Sand Razorbacks, specifically modified to detect the scent associated with elevated M-counts, will be utilized to track and locate the surviving specimens.\n\nLocal assets are not to be informed of the identity or scientific significance of the individuals being pursued.\n\nLATEST FIELD TRANSMISSION\n\nBoth assets are alive. Extraction unsuccessful. The Doctor will adjust.\n\nSTANDING DIRECTIVE\n\nRecovery of both specimens remains a priority. The preservation of local criminal assets does not.\n\nEND OF RECORD",
  "Crime Lord Morgan": "MORGAN\n\nIMPERIAL SECURITY BUREAU — PERSON OF INTEREST\n\nClassification: TOP SECRET\n\nArea of influence: Drellis Minor\n\nDesignation: Criminal organization leader\n\nOperational value: DIMINISHING\n\nSecurity risk: CRITICAL\n\nINTELLIGENCE ASSESSMENT\n\nMorgan possesses considerable resources, extensive criminal connections and substantial influence throughout Drellis Minor. Her reach extends well beyond the capabilities of the smaller criminal organizations operating within the region.\n\nRecent intelligence indicates that Morgan has acquired considerably more information regarding our research activities than was authorized.\n\nHer continued survival now represents an unacceptable security risk.\n\nOPERATIONAL DIRECTIVE\n\nUpon successful apprehension of the two surviving clone specimens, Commander Varrick and Rane are to be dispatched to eliminate Morgan.\n\nUntil the specimens have been secured, Morgan is to remain unaware of this directive.\n\nHer continued cooperation is desirable.\n\nHer continued survival is not.\n\nEND OF RECORD",
  "Research Oversight Authorization": "RESEARCH OVERSIGHT AUTHORIZATION\n\nACCESS RESTRICTED\n\nOmega clearance: INSUFFICIENT\n\nAuthorizing personnel: CLASSIFIED\n\nExecutive oversight: CLASSIFIED\n\nEXECUTIVE SECURITY DIRECTIVE\n\nNo electronic or hard-copy records concerning the identity of the executive research authority or the ultimate objectives of this program are to be maintained at this installation.\n\nAll communications concerning these matters shall be conducted directly with authorized personnel.\n\nUnauthorized inquiries will be reported to the Imperial Security Bureau.\n\nNO FURTHER RECORDS AVAILABLE"
};
export const dossiers = {
  "Glitch": "IMPERIAL SPECIMEN DATABASE\n\nBIOLOGICAL REGISTRY MATCH CONFIRMED\n\nSPECIMEN MG-1842\n\nExperimental cohort: SIGMA\n\nM-count: ELEVATED\n\nBiological viability: CONFIRMED\n\nRecovery status: OUTSTANDING\n\nEXPERIMENTAL OBSERVATIONS\n\nSpecimen demonstrated exceptional cognitive aptitude and retained advanced technical problem-solving capabilities despite repeated experimental procedures, with particular proficiency in computer systems, advanced electronics and technological manipulation.\n\nModified inhibitor chip successfully prevented the formation of long-term memories without significantly impairing existing technical knowledge or learned skills.\n\nRESEARCH RECOMMENDATION\n\nPreserve specimen for continued examination. Further neurological assessment may provide valuable insight into the relationship between elevated M-counts, cognitive function and biological resilience.\n\nRECOVERY INSTRUCTIONS\n\nSpecimen may be unaware of its experimental history or assigned research designation. Recovery alive is mandatory.\n\nEND OF SPECIMEN RECORD",
  "Crosseye": "IMPERIAL SPECIMEN DATABASE\n\nBIOLOGICAL REGISTRY MATCH CONFIRMED\n\nSPECIMEN MG-6931\n\nExperimental cohort: SIGMA\n\nM-count: ELEVATED\n\nBiological viability: CONFIRMED\n\nRecovery status: OUTSTANDING\n\nEXPERIMENTAL OBSERVATIONS\n\nSpecimen demonstrated exceptional visual acuity, hand-eye coordination and spatial awareness, with particular proficiency in long-range marksmanship and precision weapons systems.\n\nSpecimen also demonstrated exceptional proficiency in covert movement, infiltration and concealment, consistently evading detection during simulated security exercises.\n\nDespite repeated experimental procedures, the specimen retained remarkable motor control and the ability to maintain concentration under considerable physical and psychological stress.\n\nModified inhibitor chip successfully prevented the formation of long-term memories without significantly impairing previously acquired combat skills.\n\nRESEARCH RECOMMENDATION\n\nPreserve specimen for continued examination. Further testing may establish a correlation between elevated M-counts, sensory perception and neurological response times.\n\nRECOVERY INSTRUCTIONS\n\nSpecimen possesses advanced combat capabilities. Recovery personnel should exercise appropriate caution. Recovery alive is mandatory.\n\nEND OF SPECIMEN RECORD"
};
export const adultScans = {
  Glitch:'ELEVATED · specimen match MG-1842.', Crosseye:'ELEVATED · specimen match MG-6931.',
  Erik:'Trandoshan · NORMAL · no specimen match.', T0DD:'Inorganic · NOT APPLICABLE · no registry match. DEFECTIVE · RIGHT LEG MISSING. Subject appears to be a defective, ambulatory can opener. Correction: Partially ambulatory. NO BIOLOGICAL SAMPLE DETECTED.',
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
    [3,'Patch ticket','Network connection failure. Disconnected cable beneath service panel in Server Room. Reconnect the cable.'],
    [5,'Security abstract','An escort reported a missing receipt. The incident office retained the envelope, filed the report and requested the receipt as supporting evidence.'],
    [5,'ISB credential requirement','ISB security authentication required. Registered duty location: ISB Officer’s Office. Recover the security cylinder and insert it at reception.'],
    [8,'Scanner diagnostic','Bench offline. Replace keyed sensor assembly S-4 and regulator P-2. Matching packing class: instrument, regulated. Calibration requires local access in Analysis.'],
    [8,'Shipping manifest','TECHNICAL STORES • Crate B17: regulated instruments, S-4 + P-2. B71: general lighting, P-2 only. Two similar labels; compare contents before signing.'],
    [9,'Engineering work order','Relay 1 service crew retained the cage key. Parts docket B17. Branch pressure readings disagree by one division. Instrument service deferred.'],
    [11,'Laboratory inventory','Slide frames returned: all. Staff effects returned: none. A researcher has written a forwarding address inside the cover, then rubbed it away.'],
    [11,'Archive directions','Beyond the main laboratory: mechanized tape vault. The local arm can deliver a carrier. Only the ISB officer’s terminal can decrypt the tapes.'],
    [13,'Previous service ticket','The archive terminal is broken again. Resolution: Connected power.']
  ];
  if(s.legacy) rows.push([0,'Legacy duty circular','ISSUING OFFICER: NO LONGER EMPLOYED. PLEASE DIRECT COMPLAINTS TO YOUR SURVIVING SUPERVISOR.']);
  if(s.campaign==='MEN') rows.push(
    [5,'Traffic receipt','A transmission without an acknowledgement is entered as disposition unknown. A clerk has crossed out both DELIVERED and LOST.'],
    [11,'Approach docket','SKELD. Flight complement: droid billets throughout. Freight, passengers and contents inspection require separate forms. Neither inspection nor an acknowledgement is attached.'],
    );
  else rows.push([11,'Archive shelf slip','A small handprint on the transfer sleeve cuts through two layers of dust. The clerk has kept the sleeve.'] );
  if(s.deck==='ISB'){
    for(const [name,body] of Object.entries(tapes))if(name!=='CLONE BATCH SIGMA'&&s.inserted?.[name])rows.push([14,name,body]);
    if(s.inserted?.['CLONE BATCH SIGMA']){
      if(s.campaign==='MEN')for(const [name,body] of Object.entries(sigmaRecords))rows.push([16,name,body]);
      else rows.push([16,'Specimen Transfer Ledger','CLONE BATCH SIGMA. Dr. Penn Pershing, late Imperial register. James and Kai appear on separate specimen cards bearing the same project stamp. The purpose column has been removed from both cards.'],[16,'Transfer receipt','Two impressions on the transfer copy match the shelf slip. The archive contains no later disposition.']);
    }
  }
  if(s.deck==='Lab'&&s.campaign==='MEN')for(const [name,body] of Object.entries(dossiers))if(s.matches?.[name])rows.push([12,'Individual specimen record — '+name,body]);
  const minimum={3:2,5:4,9:10,11:12,13:14,15:16};
  return Object.fromEntries(rows.filter(([n,name])=>s.step>=(name==='ISB credential requirement'?5:(minimum[n]??n))).map(([,a,b])=>[a,b]));
}
