import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve('../..');
const out=resolve(root,'03_Evidencias/resultados/I6');
const base=process.env.PORTABLE_URL ?? 'http://127.0.0.1:8765';
const path='06_Comite/simulacion_auditoria/artifacts/entrega/recorrido.webm';
const bytes=readFileSync(resolve(root,path));
if(bytes.subarray(0,4).toString('hex')!=='1a45dfa3' || !bytes.subarray(0,200).includes(Buffer.from('webm'))) throw Error('No es contenedor WebM EBML');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
try {
 const context=await browser.newContext({viewport:{width:1280,height:800}});const page=await context.newPage();
 await page.goto(base+'/index.html');
 const broken=[];
 for(const href of await page.locator('a[href]').evaluateAll(links=>links.map(l=>l.getAttribute('href')))) {
  const r=await context.request.get(new URL(href,base).href); if(!r.ok()) broken.push({href,status:r.status()});
 }
 if(broken.length)throw Error(JSON.stringify(broken));
 await page.setContent(`<video controls muted width="1280" src="${base}/${path}"></video>`);
 const video=page.locator('video');await video.evaluate(async v=>{const b=await (await fetch(v.src)).blob();v.src=URL.createObjectURL(b);v.load();});
 await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
 const info=await video.evaluate(async v=>{
  if(!Number.isFinite(v.duration)){v.currentTime=1e10;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));}
  const d=v.duration;v.currentTime=0;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));
  return {duration:d,width:v.videoWidth,height:v.videoHeight,canPlayWebM:v.canPlayType('video/webm; codecs="vp8"')};
 });
 if(!(info.duration>10 && info.width===1280 && info.height===720))throw Error(JSON.stringify(info));
 const samples=[];
 for(const fraction of [.20,.5,.95]) {
  await video.evaluate(async(v,t)=>{v.currentTime=t;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));await v.play();await new Promise(r=>v.requestVideoFrameCallback(r));v.pause();},info.duration*fraction);
  const sample=await video.evaluate(v=>{const c=document.createElement('canvas');c.width=160;c.height=90;const ctx=c.getContext('2d');ctx.drawImage(v,0,0,160,90);const data=ctx.getImageData(0,0,160,90).data;let lo=255,hi=0;for(let i=0;i<data.length;i+=4){lo=Math.min(lo,data[i]);hi=Math.max(hi,data[i]);}return {time:v.currentTime,range:hi-lo,decoded:v.getVideoPlaybackQuality().totalVideoFrames};});
  if(sample.range<30)throw Error('Fotograma vacío '+JSON.stringify(sample));samples.push(sample);
  await video.screenshot({path:resolve(out,`video-${Math.round(fraction*100)}.png`)});
 }
 await video.evaluate(v=>{v.currentTime=0;v.playbackRate=4;v.play();});
 await page.waitForFunction(()=>document.querySelector('video').ended,{},{timeout:Math.ceil(info.duration/4*1000)+30000});
 const playback=await video.evaluate(v=>({ended:v.ended,time:v.currentTime,error:v.error?.message??null,...v.getVideoPlaybackQuality().toJSON?.(),decodedFrames:v.getVideoPlaybackQuality().totalVideoFrames,droppedFrames:v.getVideoPlaybackQuality().droppedVideoFrames}));
 if(!playback.ended||playback.error||playback.decodedFrames<100)throw Error(JSON.stringify(playback));
 // Load the portable production bundle, all required resources served locally.
 await page.goto(base+'/06_Comite/simulacion_auditoria/dist/');
 await page.getByRole('button',{name:'Omitir y entrar a la oficina'}).click({timeout:30000});
 await page.locator('.settings-menu > summary').click();await page.locator('[data-setting="flatMode"]').check();
 await page.locator('[data-flat="liaison"]').click();
 await page.getByRole('heading',{name:'Enlace de TI · entrevista'}).waitFor();
 await page.screenshot({path:resolve(out,'arranque-portatil.png')});
 writeFileSync(resolve(out,'Reproduccion_video_I6.json'),JSON.stringify({container:'WebM (EBML DocType webm)',bytes:bytes.length,info,samples,playback,linksVerified:true,portableBundleStarted:true,environment:await browser.version(),physicalDefenseHardwareTested:false,audio:'La captura Playwright no incluye una pista de audio; las 29 voces MP3 se conservan en el juego.'},null,2)+'\n');
 console.log(JSON.stringify({container:'WebM',duration:info.duration,playback,portableBundleStarted:true}));
 await context.close();
}finally{await browser.close();}
