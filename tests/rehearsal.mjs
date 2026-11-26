// Real Chromium clients against the loopback-only Hosting, Auth and Database emulators.
import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const url='http://127.0.0.1:5108/';
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
async function client(width=1200){
 const ctx=await b.newContext({viewport:{width,height:850},reducedMotion:'reduce'});
 if(process.env.SDK_FIXTURES)await ctx.route('https://www.gstatic.com/firebasejs/11.10.0/*',async r=>r.fulfill({body:await readFile(path.join(process.env.SDK_FIXTURES,path.basename(r.request().url()))),contentType:'text/javascript',headers:{'access-control-allow-origin':'*'}}));
 const p=await ctx.newPage();p.setDefaultTimeout(18000);p.on('pageerror',e=>console.error('browser error',e.message));p.on('requestfailed',r=>console.error('Network',new URL(r.url()).origin,r.failure()?.errorText));p.on('console',m=>{if(m.type()==='error')console.error(m.text().split('?')[0].slice(0,250))});p.on('dialog',d=>d.accept());return p
}
const click=(p,label)=>p.getByRole('button',{name:label,exact:true}).click();
async function cmd(p,t){await p.locator('#command').fill(t);await p.locator('#command').press('Enter')}
const waitStep=(p,i)=>p.locator('#board .card').first().getByText(new RegExp('^'+i+'/18')).waitFor();
const visible=(p,sel)=>p.locator(sel).waitFor();
const optional=process.argv.includes('--optional')||process.env.OPTIONAL_PATH==='1';
const kids=process.argv.includes('--kids');
let dm,player;try{
 dm=await client();player=await client(390);await dm.goto(url+'?dm&emulator');if(kids)await dm.locator('#camp').selectOption('KIDS');await click(dm,'Create live session');await waitStep(dm,0);
 const session=new URL(dm.url()).searchParams.get('session');assert(session);
 await player.goto(url+'?emulator&session='+session);await visible(player,'#saver');await player.locator('#saver').click();
 await click(dm,'Fast mode');await click(dm,'Mute station');await cmd(player,'PLAY 1');await player.getByText('Select the local recording directory first.').waitFor();await click(player,'Media Archive');await click(player,'Research Recordings');
 const play=async(id,step)=>{await cmd(player,'PLAY '+id);await waitStep(dm,step)};
 const phys=async(label,step)=>{await click(dm,label);await waitStep(dm,step)};
 await cmd(player,'AUTH 471938');await player.getByText('Authorization denied. Review registered media.',{exact:true}).waitFor();
 await cmd(player,'AUTHORIZATION CODE BLUE');await player.getByText(/THIS IS AN OLDER CODE/).first().waitFor();
 await click(player,'Play REC-001 · Shift handover');await waitStep(dm,1);await phys('MOUNT CYLINDER',2);await play(2,3);await phys('CONNECT SERVER',4);
 await cmd(player,'PLAY 3');await player.locator('.chalk:visible').waitFor();await click(player,'Pause');assert.match(await player.locator('.chalk').innerText(),/1938/);await click(player,'Resume');await waitStep(dm,5);
 await phys('MOUNT ISB',6);await play(4,7);await click(dm,'Confirm authorization card recovered');await cmd(player,'AUTH 000000');await player.getByText('Authorization denied. Review registered media.',{exact:true}).waitFor();await cmd(player,'AUTH 471938');await waitStep(dm,8);
 if(optional){
   await player.context().setOffline(true);await click(dm,'Register scanner parts');await player.context().setOffline(false);
   await player.locator('#notice').getByText('Instrument consignment received.').waitFor();
   await cmd(player,'UNLOCK SECURITY EQUIPMENT ROOM');await player.locator('#notice').getByText('Security Equipment Room released.').waitFor();
 }
 await play(5,9);await phys('RELAY 1',10);await player.locator('#notice').getByText(/Safety interlock verification: 1 of 2/).waitFor();await phys('RELAY 2',11);await player.locator('#notice').getByText(/Resuming normal air circulation/).waitFor();await phys('ENTER LAB',12);
 await player.reload();await visible(player,'#saver');await player.locator('#saver').click();
 if(optional){await click(dm,'Calibrate repaired bench');await click(player,'Analysis');await click(player,'Scan Sam');await player.getByText(/SAVE SPECIMEN TO RESEARCH DATABASE/).waitFor();await click(player,'Yes — save locally');await player.locator('#notice').getByText('Sample filed in this session.').waitFor()}
 await play(6,13);await phys('POWER ARCHIVE',14);
 if(optional){await click(player,'Retrieve CINDER');await player.locator('#notice').getByText(/Carrier delivered: CINDER/).waitFor();await click(player,'Return to ISB officer’s terminal');await click(player,'Insert CINDER');await player.locator('#screen').getByText(/OPERATION CINDER/).waitFor();await click(player,'Use archive station')}
 await click(player,'Retrieve CLONE BATCH SIGMA');await waitStep(dm,15);await click(player,'Return to ISB officer’s terminal');await click(player,'Insert CLONE BATCH SIGMA');await waitStep(dm,16);
 await cmd(player,'OPEN Specimen Transfer Ledger');await player.locator('#screen').getByText(kids?/James and Kai/:/Known survivors: 6/).waitFor();
 assert(!((await player.locator('#screen').innerText()).includes(kids?'Crosseye':'James and Kai')));
 await cmd(player,'PLAY 7');await player.getByText(/Confidential playback unavailable/).waitFor();await dm.getByLabel('Physical station / room').selectOption('Director');await player.getByText(/EXECUTIVE AUTHENTICATION REQUIRED/).waitFor();await click(dm,'Confirm Director’s cylinder inserted');
 await dm.getByLabel('Director office door').selectOption('OBSTRUCTED');await player.locator('#notice').getByText('Director office door · OBSTRUCTED').waitFor();await cmd(player,'PLAY 7');await player.getByText(/Confidential playback withheld/).waitFor();
 await dm.getByLabel('Director office door').selectOption('CLOSED');await player.getByText(/CONFIDENTIAL PLAYBACK AVAILABLE/).waitFor();
 await click(dm,'Hold crisis');await player.locator('#notice').getByText('Operator setting updated.').waitFor();await play(7,17);await player.locator('#screen').getByText(/Biological containment: FAILED/).waitFor();await visible(player,'#dmReminder');await click(dm,'BEGIN CRISIS');await dm.getByText('Release the crisis hold first.').waitFor();await click(dm,'Release crisis hold');await phys('BEGIN CRISIS',18);
 await player.getByRole('heading',{name:'Unexpected specimen activity'}).waitFor();await dm.reload();await waitStep(dm,18);
 await click(dm,'Continue on this laptop offline');await waitStep(dm,18);await click(dm,'Player view');await dm.getByRole('heading',{name:'Unexpected specimen activity'}).waitFor();
 if(optional){
   await click(dm,'Operator view');await click(dm,'Restore: Before final playback');await waitStep(dm,16);
   await click(dm,'Reset session');await waitStep(dm,0);await click(dm,'Undo last action');await waitStep(dm,16);
   const download=dm.waitForEvent('download');await click(dm,'Export checkpoint');const checkpoint=await (await download).path();
   const offline=await b.newPage();offline.on('dialog',d=>d.accept());await offline.goto(new URL('../offline.html',import.meta.url).href);
   await click(offline,'Open offline station');await waitStep(offline,0);await offline.getByLabel('Import checkpoint').setInputFiles(checkpoint);await waitStep(offline,16);
   await click(offline,'Player view');await offline.locator('#saver').click();await cmd(offline,'PLAY 7');await offline.getByRole('heading',{name:'Biohazard alert'}).waitFor({timeout:45000});
 }
 console.log('PASS independent identities; optional path='+optional+'; full main route, clue, code errors, privacy, refresh, hold, local continuation, single crisis, narrow screen.');
}catch(e){for(const p of [dm,player])if(p)console.error((await p.locator('body').innerText()).slice(0,2600));throw e}finally{await b.close()}
