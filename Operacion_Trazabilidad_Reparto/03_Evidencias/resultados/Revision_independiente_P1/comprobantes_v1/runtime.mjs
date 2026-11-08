import { createRequire } from 'node:module';
import fs from 'node:fs';
const req=createRequire('/home/ordson/final auditoria/final_auditoria/Operacion_Trazabilidad_Reparto/06_Comite/simulacion_auditoria/package.json');
const {chromium}=req('@playwright/test');
const browser=await chromium.launch({executablePath:"/home/ordson/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome",headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1366,height:768}});
const base='http://127.0.0.1:8876/'; await page.goto(base+'index.html');
const links=await page.locator('a').evaluateAll(a=>a.map(x=>({label:x.textContent,path:x.getAttribute('href')})));
const tested=[];for(const x of links){if(x.path.includes('/dist/'))continue;const r=await page.request.get(base+x.path);tested.push({...x,status:r.status()});}
await page.screenshot({path:'/tmp/revision_p1/indice-portatil.png'});
await page.setContent('<video id="v" controls style="width:1280px;height:720px"></video>');
const video=await fs.promises.readFile('/tmp/revision_p1/extraido/P1/06_Comite/simulacion_auditoria/artifacts/entrega/recorrido.webm');
await page.evaluate(async b64=>{const b=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));v.src=URL.createObjectURL(new Blob([b],{type:'video/webm'}));await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=j;});},video.toString('base64'));
const info=await page.evaluate(()=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,canPlay:v.canPlayType('video/webm;codecs="vp8"')}));
await page.evaluate(()=>{v.playbackRate=4;return v.play()});await page.waitForFunction(()=>v.ended,undefined,{timeout:60000});
const playback=await page.evaluate(()=>({ended:v.ended,time:v.currentTime,error:v.error,decoded:v.getVideoPlaybackQuality().totalVideoFrames,dropped:v.getVideoPlaybackQuality().droppedVideoFrames}));
await page.screenshot({path:'/tmp/revision_p1/video-final.png'});
fs.writeFileSync('/tmp/revision_p1/navegador.json',JSON.stringify({links:tested,excluded:'Juego /dist/ no abierto ni revisado',info,playback},null,2));await browser.close();console.log(JSON.stringify({links:tested.length,info,playback}));
