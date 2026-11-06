import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const errors = [];
const assets = new Set();
const outputDirectory = process.argv[3] || 'artifacts/red-nova';
await mkdir(outputDirectory, { recursive: true });
try {
  for (const view of [
    { name: 'after', width: 1440, height: 900, pose: { x: 0, z: 4.4, yaw: 0, pitch: 0 } },
    { name: 'technical-area', width: 1440, height: 900, pose: { x: -1.7, z: 4.15, yaw: 0.8, pitch: 0 } },
    { name: 'window', width: 1440, height: 900, pose: { x: 2, z: 0.8, yaw: -1.25, pitch: 0 } },
    { name: 'window-close', width: 1440, height: 900, pose: { x: 4.8, z: -0.7, yaw: -Math.PI / 2, pitch: 0 } },
    { name: 'window-oblique', width: 1440, height: 900, pose: { x: 2.5, z: 2, yaw: -0.95, pitch: 0 } },
    { name: 'compact', width: 960, height: 640, pose: { x: 0, z: 4.4, yaw: 0, pitch: 0 } },
    { name: 'mobile', width: 390, height: 844, pose: { x: 0, z: 4.4, yaw: 0, pitch: 0 } },
  ]) {
    if (process.argv[2] && view.name !== process.argv[2] && !(process.argv[2] === 'window' && view.name.startsWith('window-'))) continue;
    const page = await browser.newPage({ viewport: { width: view.width, height: view.height } });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') console.log(message.type(), message.text()); });
    page.on('response', response => {
      if (response.url().includes('/models/') || response.url().includes('/brand/') || response.url().includes('/environment/')) {
        if (!response.ok()) errors.push(`${response.status()} ${response.url()}`);
        else assets.add(new URL(response.url()).pathname);
      }
    });
    await page.addInitScript(pose => localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({ schemaVersion: 2, introSeen: true, settings: { reducedMotion: true }, pose })), view.pose);
    await page.goto('http://127.0.0.1:4173');
    await page.locator('#office-canvas').waitFor();
    await page.waitForLoadState('networkidle');
    const modelErrors = await page.evaluate(async () => {
      const { placeModel } = await import('/src/scene/models.ts');
      return Promise.all(['/models/fbi-agent/scene.gltf', '/models/rack-monitor/scene.gltf', '/models/rack.glb'].map(path => new Promise(resolve => {
        const timer = setTimeout(() => resolve(`Tiempo agotado al cargar ${path}`), 30000);
        placeModel({ add() {} }, { path, size: { x: 2, y: 2, z: 2 }, position: { x: 0, z: 0 },
          onLoaded() { clearTimeout(timer); resolve(null); },
          onError() { clearTimeout(timer); resolve(`No se pudo cargar ${path}`); },
        });
      })));
    });
    errors.push(...modelErrors.filter(Boolean));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${outputDirectory}/${view.name}.png` });
    await page.close();
  }
  await writeFile(`${outputDirectory}/validation.json`, JSON.stringify({ errors, loadedAssets: [...assets] }, null, 2));
  console.log(JSON.stringify({ errors, loadedAssets: assets.size }));
  if (errors.length) process.exitCode = 1;
} finally { await browser.close(); }
