// Isolated response substitutions for diagnosis; never writes production sources.
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const results = [];
for (const variant of ['half-resolution', 'half-resolution-shadow', 'low-resolution']) {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.context().tracing.start({ screenshots: variant !== 'trace-no-screencast', snapshots: true, sources: true });
  const substitutions = [];
  await page.route('**/src/ui/IntroPlayer.ts', async (route) => {
    const response = await route.fetch(); let body = await response.text();
    if (variant === 'stable-controls' || variant === 'both') {
      body = body.replace('play.innerHTML =', 'if (play.dataset.playing !== String(this.playing)) play.innerHTML =');
      body = body.replace('play.setAttribute("aria-label",', 'play.dataset.playing = String(this.playing); play.setAttribute("aria-label",');
      body = body.replace('if (audio) audio.innerHTML =', 'if (audio && audio.dataset.enabled !== String(this.store.state.settings.audioEnabled)) audio.innerHTML =');
      body = body.replace('const noteRoot =', 'if (audio) audio.dataset.enabled = String(this.store.state.settings.audioEnabled); const noteRoot =');
      substitutions.push('controls');
    }
    await route.fulfill({ response, body });
  });
  await page.route('**/src/scene/OfficeScene.ts', async (route) => {
    const response = await route.fetch(); let body = await response.text();
    if (['half-resolution', 'half-resolution-shadow', 'low-resolution'].includes(variant)) {
      const scale = variant === 'low-resolution' ? '0.35' : '0.5';
      if (!body.includes('Math.min(window.devicePixelRatio, 1.5)')) throw new Error('No pixel ratio matched');
      body = body.replace('Math.min(window.devicePixelRatio, 1.5)', scale);
      if (variant === 'half-resolution-shadow') body = body.replace('mapSize.set(1024, 1024)', 'mapSize.set(512, 512)');
      substitutions.push(scale);
    }
    if (variant === 'gpu-backpressure') {
      if (!body.includes('  frame(time) {')) throw new Error('No frame method matched');
      body = body.replace('  frame(time) {', `  frame(time) {
    const gl = this.renderer.getContext();
    if (this.renderFence) {
      const status = gl.clientWaitSync(this.renderFence, 0, 0);
      if (status === gl.TIMEOUT_EXPIRED) return;
      gl.deleteSync(this.renderFence); this.renderFence = null;
    }`);
      body = body.replace('this.renderer.render(this.scene, this.camera);', `this.renderer.render(this.scene, this.camera);
    this.renderFence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0); gl.flush();`);
      substitutions.push('gpu-fence');
    }
    if (variant === 'paced-render' || variant === 'both') {
      if (!body.includes('1e3 / 30') && !body.includes('1000 / 30')) throw new Error('No render cadence matched');
      body = body.replace('1e3 / 30', '1000 / 10').replace('1000 / 30', '1000 / 10');
      substitutions.push('10fps');
    }
    await route.fulfill({ response, body });
  });
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__introMetrics = { frames: 0, mutations: 0, longTasks: [] };
    new PerformanceObserver((list) => window.__introMetrics.longTasks.push(...list.getEntries().map((e) => e.duration))).observe({ type: 'longtask', buffered: true });
    const observe = () => {
      const controls = document.querySelector('.intro-controls');
      if (!controls) return requestAnimationFrame(observe);
      new MutationObserver((entries) => { window.__introMetrics.mutations += entries.length; }).observe(controls, { childList: true, subtree: true });
      const tick = () => { window.__introMetrics.frames++; requestAnimationFrame(tick); }; requestAnimationFrame(tick);
    }; requestAnimationFrame(observe);
  });
  let result = { variant, substitutions, errors };
  try {
    await page.goto(process.env.BASE_URL ?? 'http://127.0.0.1:4173/');
    const started = Date.now();
    await page.getByRole('button', { name: 'Pausar reconstrucción' }).click({ timeout: 15000 });
    result.pauseMs = Date.now() - started;
    await page.getByRole('button', { name: 'Reanudar reconstrucción' }).waitFor();
    await page.getByRole('button', { name: 'Omitir y entrar a la oficina' }).click({ timeout: 15000 });
    result.finished = await page.locator('#intro-root').isHidden();
  } catch (error) { result.error = error.message; }
  result.metrics = await page.evaluate(() => window.__introMetrics).catch(() => null);
  await page.context().tracing.stop({ path: `artifacts/cierre-p1/diagnostico-${variant}.zip` });
  results.push(result); console.log(JSON.stringify(result));
  await browser.close();
}
writeFileSync('artifacts/cierre-p1/diagnostico-resolucion.json', JSON.stringify(results, null, 2) + '\n');
