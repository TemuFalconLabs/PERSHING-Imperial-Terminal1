import {readFile,writeFile} from 'node:fs/promises';
const source=async n=>readFile(new URL(n,import.meta.url),'utf8');
const parts=await Promise.all(['content.mjs','engine.mjs','session.mjs','easter-eggs.mjs','crisis-art.mjs','voice-selection.mjs','station-presentation.mjs','station.mjs'].map(source));
const js=parts.map(x=>x.replace(/^import .*;$/gm,'').replace(/^export /gm,'')).join('\n');
const css=await source('station.css');
const doc=(await source('index.html')).replace('<html lang','<html data-offline lang').replace('<link rel="stylesheet" href="station.css">',()=>'<style>'+css+'</style>');
function assemble(html,script){return html.replace('<script type="module" src="station.mjs"></script>',()=>'<script type="module">'+script+'</script>')}
async function build(){await writeFile(new URL('./offline.html',import.meta.url),assemble(doc,js))}
// Text, style, application code and approved inline crisis artwork are embedded.
await build();
