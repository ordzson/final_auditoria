import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4174';
const out = resolve('artifacts/clase');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined), headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const results = { browser: await browser.version(), intro: [], video: null, physicalClassroomTested: false };
try {
  for (const [width, height] of [[1280, 720], [1920, 1080]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.addInitScript(() => localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({ schemaVersion: 2, settings: { flatMode: true, reducedMotion: true } })));
    await page.goto(base);
    await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
    await page.evaluate(async () => { await document.fonts.ready; });
    for (const projector of [false, true]) {
      if (projector) {
        await page.locator('.settings-menu > summary').click();
        await page.locator('[data-setting="projector"]').check();
        await page.evaluate(async () => { await document.fonts.ready; });
      }
      for (const time of [4, 12, 20, 27, 34, 41, 49, 57, 66, 81, 87, 93, 99, 107]) {
        await page.locator('#intro-timeline').evaluate((input, time) => { input.value = String(time); input.dispatchEvent(new Event('input', { bubbles: true })); }, time);
        if (time === 66 && projector) await page.screenshot({ path: resolve(out, `intro-proyector-${width}.png`) });
        results.intro.push(await page.evaluate(({ width, height, projector, time }) => {
          const controls = document.querySelector('.intro-controls').getBoundingClientRect();
          return { width, height, projector, time, regions: ['.intro-message-wrap', '#ransom-note'].map((selector) => {
            const el = document.querySelector(selector); const rect = el.getBoundingClientRect();
            return { selector, clientHeight: el.clientHeight, scrollHeight: el.scrollHeight, visible: !el.hidden, clipped: !el.hidden && el.scrollHeight > el.clientHeight + 2, overlapsControls: !el.hidden && rect.bottom > controls.top, text: el.hidden ? '' : el.innerText };
          }) };
        }, { width, height, projector, time }));
      }
    }
    await page.close();
  }
  const path = resolve('artifacts/entrega/recorrido.webm');
  if (existsSync(path) && process.env.CHECK_VIDEO === '1') {
    const bytes = readFileSync(path);
    if (bytes.subarray(0, 4).toString('hex') !== '1a45dfa3') throw Error('El archivo no es WebM EBML.');
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({ schemaVersion: 2, settings: { flatMode: true } })));
    await page.route('**/__recorrido.webm', (route) => route.fulfill({ contentType: 'video/webm', body: bytes }));
    await page.goto(base);
    await page.setContent(`<video muted controls src="${base}/__recorrido.webm"></video>`);
    const video = page.locator('video');
    await video.evaluate(async (v) => { const blob = await (await fetch(v.src)).blob(); v.src = URL.createObjectURL(blob); v.load(); });
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
    const info = await video.evaluate(async (v) => {
      if (!Number.isFinite(v.duration)) { v.currentTime = 1e10; await new Promise((r) => v.addEventListener('seeked', r, { once: true })); }
      return { duration: v.duration, width: v.videoWidth, height: v.videoHeight };
    });
    const samples = [];
    for (const fraction of [.2, .5, .95]) {
      await video.evaluate(async (v, t) => { v.currentTime = t; await new Promise((r) => v.addEventListener('seeked', r, { once: true })); await v.play(); await new Promise((r) => v.requestVideoFrameCallback(r)); v.pause(); }, info.duration * fraction);
      const sample = await video.evaluate((v) => { const c = document.createElement('canvas'); c.width = 160; c.height = 90; const ctx = c.getContext('2d'); ctx.drawImage(v, 0, 0, 160, 90); const pixels = ctx.getImageData(0, 0, 160, 90).data; let min = 255, max = 0; for (let i = 0; i < pixels.length; i += 4) { min = Math.min(min, pixels[i]); max = Math.max(max, pixels[i]); } return { time: v.currentTime, range: max - min }; });
      if (sample.range < 30) throw Error('Fotograma vacío.'); samples.push(sample);
    }
    await video.evaluate((v) => { v.currentTime = 0; v.playbackRate = 4; void v.play(); });
    await page.waitForFunction(() => document.querySelector('video').ended, {}, { timeout: info.duration * 250 + 30000 });
    const playback = await video.evaluate((v) => ({ ended: v.ended, error: v.error?.message ?? null, decodedFrames: v.getVideoPlaybackQuality().totalVideoFrames }));
    if (!playback.ended || playback.error || info.width !== 1280 || info.height !== 720) throw Error('Reproducción incompleta.');
    results.video = { container: 'WebM', bytes: bytes.length, ...info, samples, playback, audio: 'Grabación muda' };
    await page.close();
  }
  writeFileSync(resolve(out, 'media.json'), JSON.stringify(results, null, 2) + '\n');
  const clipped = results.intro.filter((item) => item.regions.some((region) => region.clipped || region.overlapsControls));
  console.log(JSON.stringify({ introFrames: results.intro.length, clipped: clipped.map(({ width, projector, time, regions }) => ({ width, projector, time, regions })), video: results.video }));
  if (clipped.length) process.exitCode = 1;
} finally { await browser.close(); }
