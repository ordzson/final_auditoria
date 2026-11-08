import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const cdp = await page.context().newCDPSession(page);
await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 1000 }); await cdp.send('Profiler.start');
await page.addInitScript(() => { window.__renderCosts = []; });
await page.route('**/src/scene/OfficeScene.ts', async (route) => {
  const response = await route.fetch();
  const body = (await response.text()).replace('this.renderer.render(this.scene, this.camera);', `const renderStarted = performance.now(); this.renderer.render(this.scene, this.camera); window.__renderCosts.push({ ms: performance.now() - renderStarted, calls: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles });`);
  await route.fulfill({ response, body });
});
const errors = [];page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://127.0.0.1:4173/');
try { await page.getByRole('button', { name: 'Pausar reconstrucción' }).click({ timeout: 15000 }); } catch(e) { console.log(e.message); }
const metrics = await page.evaluate(() => window.__renderCosts);
const { profile } = await cdp.send('Profiler.stop');
writeFileSync('artifacts/cierre-p1/intro-cpu-profile.json', JSON.stringify(profile));
const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
const totals = new Map();
for (let i=0; i<profile.samples.length; i++) {
  const node=nodes.get(profile.samples[i]);const frame=node.callFrame;
  const name=`${frame.functionName || '(anonymous)'} ${frame.url}:${frame.lineNumber}`;
  totals.set(name,(totals.get(name)||0)+profile.timeDeltas[i]);
}
const result = { errors, renders: metrics, topSelfMs: [...totals].sort((a,b)=>b[1]-a[1]).slice(0,40).map(([name,us])=>({name,ms:us/1000})) };
writeFileSync('artifacts/cierre-p1/perfil-apertura.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
await browser.close();
