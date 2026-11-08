import { chromium, expect } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { closePanel, completeReview, openPcApp, pinSource } from './walkthrough.mjs';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const output = resolve(process.env.RECORD_OUTPUT ?? 'artifacts/entrega');
const screenshots = resolve(process.env.RECORD_SCREENSHOTS ?? 'artifacts/screenshots');
mkdirSync(output, { recursive: true });
mkdirSync(screenshots, { recursive: true });

try {
  const response = await fetch(baseURL);
  if (!response.ok) throw new Error(`El servidor respondió ${response.status}`);
} catch {
  console.error(`No hay un servidor local disponible en ${baseURL}. Ejecuta pnpm dev --port 4173 antes de pnpm record.`);
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined),
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: resolve('artifacts/recording'), size: { width: 1280, height: 720 } },
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.setDefaultTimeout(20_000);
const video = page.video();

async function seek(time, hold = 800) {
  await page.locator('#intro-timeline').evaluate((input, value) => {
    input.value = String(value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, time);
  await page.waitForTimeout(hold);
}

try {
  await page.goto(baseURL);
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  for (const time of [0, 16.5, 37, 53]) await seek(time);
  await seek(64, 1800);
  await expect(page.locator('#ransom-note')).toBeVisible();
  await page.screenshot({ path: resolve(screenshots, 'recorrido-p08.png') });
  await seek(95);
  await page.getByRole('button', { name: 'Omitir y entrar a la oficina' }).click();
  await expect(page.locator('#enter-office')).toBeVisible();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: resolve(screenshots, 'oficina-visita.png') });
  // Recording uses the product's accessible navigation; duration-based W movement
  // depends on rendering speed and did not reach the liaison on this host.
  await page.locator('.settings-menu > summary').click();
  await page.locator('[data-setting="flatMode"]').check();
  await expect(page.locator('#flat-office')).toBeVisible();
  await page.locator('[data-flat="liaison"]').click();
  await expect(page.getByRole('heading', { name: 'Enlace de TI · entrevista' })).toBeVisible();
  await page.waitForTimeout(800);
  await page.locator('[data-topic="AU-02"]').click();
  await page.locator('[data-question="P-FUJO"]').click();
  await page.locator('[data-action="source"][data-source="DECL-05"]').click();
  await page.locator('[data-action="pin-source"]').click();
  await page.locator('[data-action="contrast"]').click();
  for (const sourceId of ['E-03', 'E-04']) {
    await pinSource(page, sourceId);
    await page.waitForTimeout(400);
  }
  await openPcApp(page, 'network-monitor', 'Monitor de red');
  const networkHelp = page.locator('.pc-window[data-app-id="network-monitor"] [data-review-help]');
  await networkHelp.getByText('Comparar tamaños: cálculo de laboratorio', { exact: true }).click();
  await networkHelp.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: resolve(screenshots, 'transferencia-comparacion.png') });
  await page.locator('.computer-hud [data-desktop-action="notebook"]').click();
  await page.locator('input[name="C02-CONTENIDO"][value="SIN_VINCULO_NI_CONTENIDO"]').check();
  await page.locator('[data-action="save-check"]').click();
  await page.locator('input[name="conclusion"][value="A02-TRANSFERENCIA"]').check();
  for (const id of ['L02-CONTENIDO', 'L02-VINCULO', 'L02-ATRIBUCION']) {
    await page.locator(`[data-limitation="${id}"]`).check();
    await page.waitForTimeout(300);
  }
  await page.locator('[data-request="S02-FLUJO"]').check();
  await expect(page.locator('[data-review-status="AU-02"]')).toHaveText('Documentado');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: resolve(screenshots, 'recorrido-au02.png') });
  await closePanel(page);
  await expect(page.locator('#flat-office')).toBeVisible();
  for (const reviewId of ['AU-01', 'AU-03', 'AU-04', 'AU-05', 'AU-06']) {
    await completeReview(page, reviewId);
    await page.waitForTimeout(700);
  }
  await closePanel(page);
  await page.locator('[data-action="notebook"]').first().click();
  await expect(page.locator('.notebook-header')).toContainText('6 / 6 documentadas');
  const analysis = page.locator('.classroom-analysis').first();
  await analysis.locator('summary').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: resolve(screenshots, 'hipotesis-y-pendientes.png') });
  await analysis.locator('summary').click();
  await page.locator('.closing-section > summary').click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: resolve(screenshots, 'libreta-completa.png') });
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export"]').click();
  const download = await downloadPromise;
  const jsonPath = resolve(output, 'libreta-ejemplo.json');
  await download.saveAs(jsonPath);
  const exported = JSON.parse(readFileSync(jsonPath, 'utf8'));
  if (exported.reviews.length !== 6 || !exported.reviews.every((review) => review.isDocumented)) {
    throw new Error('La libreta de ejemplo no conserva las seis revisiones documentadas.');
  }
  await page.evaluate(() => { window.print = () => undefined; });
  await page.locator('[data-action="print"]').click();
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: resolve(output, 'libreta-respaldo.pdf'), format: 'A4', printBackground: false });
  await page.emulateMedia({ media: 'screen' });
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Se documentaron seis revisiones de ejemplo y se exportó la libreta con sus pendientes.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await context.close();
  if (video && !process.exitCode) {
    const videoPath = resolve(output, 'recorrido.webm');
    await video.saveAs(videoPath);
    console.log(`Vídeo WebM: ${videoPath}`);
  }
  await browser.close();
}

if (!process.exitCode) {
  console.log(`PDF: ${resolve(output, 'libreta-respaldo.pdf')}`);
  console.log(`JSON: ${resolve(output, 'libreta-ejemplo.json')}`);
}
