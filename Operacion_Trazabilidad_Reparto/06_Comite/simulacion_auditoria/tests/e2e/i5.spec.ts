import { test, expect } from '@playwright/test';
import { reviewGuidance } from '../../src/data/guidance';
import { openPcApp, pcWindow } from './desktop-helpers';
import type { ReviewId } from '../../src/audit/types';

const auditKey = 'rednova.auditoria.oficina.v2';
const desks = [
  ['accesos', 'session-viewer', 'AU-01'], ['sql_red', 'query-studio', 'AU-02'],
  ['crm_cambios', 'order-history', 'AU-03'], ['siem', 'event-desk', 'AU-04'],
  ['respaldos', 'recovery-console', 'AU-05'], ['mesa_auditor', 'file-explorer', 'AU-06'],
] as const;

test('I5 · ayuda escrita, retorno PC/libreta/TI y persistencia en los seis puestos', async ({ page }) => {
  await page.addInitScript((key) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({
      schemaVersion: 2, introSeen: true, clipboardReceived: true, settings: { flatMode: true },
    }));
  }, auditKey);
  await page.goto('/');
  for (const [station, app, review] of desks) {
    await page.locator(`[data-flat="${station}"]`).click();
    const initial = pcWindow(page, app);
    const help = initial.locator('[data-review-help]');
    await expect(help).toContainText(reviewGuidance[review].terms);
    await openPcApp(page, 'station-report', 'Informe del puesto');
    const note = pcWindow(page, 'station-report').locator('.pc-app-free-note');
    await note.fill(`Revisión ${review}: falta corroboración del incidente.`);
    await page.locator('.computer-hud [data-desktop-action="notebook"]').click();
    await expect(page.locator('#free-note')).toHaveValue(`Revisión ${review}: falta corroboración del incidente.`);
    await expect(page.locator('#panel-dialog [data-review-help]')).toContainText(reviewGuidance[review].terms);
    await page.getByRole('button', { name: 'Volver al ordenador', exact: true }).click();
    await expect(note).toHaveValue(`Revisión ${review}: falta corroboración del incidente.`);
    await page.locator('.computer-hud [data-desktop-action="interview"]').click();
    if (await page.locator('[data-action="topics"]').count()) await page.locator('[data-action="topics"]').click();
    await page.locator(`[data-action="topic"][data-topic="${review}"]`).click();
    await expect(page.locator('.dialogue-response [data-review-help]')).toContainText(reviewGuidance[review].terms);
    await expect(page.locator('.dialogue-voice audio')).toHaveAttribute('src', new RegExp(`frase_${({ 'AU-01': '04', 'AU-02': '09', 'AU-03': '13', 'AU-04': '19', 'AU-05': '22', 'AU-06': '25' } as Record<ReviewId, string>)[review]}.mp3$`));
    await page.locator('.dialogue-exit').click();
    await expect(note).toHaveValue(`Revisión ${review}: falta corroboración del incidente.`);
    await page.locator('.computer-hud [data-desktop-action="exit"]').click();
    await page.reload();
    await page.locator(`[data-flat="${station}"]`).click();
    await expect(note).toHaveValue(`Revisión ${review}: falta corroboración del incidente.`);
    await expect(page.locator('.computer-hud [data-progress]')).not.toHaveText('Documentado');
    await page.locator('.computer-hud [data-desktop-action="exit"]').click();
  }
});

for (const width of [1440, 390]) {
  test(`I5 · metadatos y ayuda legibles a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({
      schemaVersion: 2, introSeen: true, clipboardReceived: true, settings: { flatMode: true },
    })), auditKey);
    await page.goto('/');
    await page.locator('[data-flat="mesa_auditor"]').click();
    const files = pcWindow(page, 'file-explorer');
    await files.getByRole('button', { name: 'Ver metadatos', exact: true }).first().click();
    await expect(files.locator('.pc-app-feedback')).toContainText('No hay archivo original ni SHA-256 aportados');
    await expect(files.locator('.pc-app-document')).toHaveAttribute('data-document', 'META-CUSTODIA');
    await expect(files.locator('[data-review-help]')).toContainText('referencia previamente registrada');
    await expect(files.getByRole('button', { name: 'Comprobar archivo', exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `artifacts/cierre-p1/metadatos-${width}.png`, fullPage: true });
    await page.locator('.computer-hud [data-desktop-action="interview"]').click();
    await page.locator('[data-action="topic"][data-topic="AU-05"]').click();
    await expect(page.locator('[data-review-help]')).toContainText('RPO es la pérdida de datos tolerable expresada en tiempo');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#panel-dialog').evaluate((dialog) => { dialog.scrollTop = 0; });
    await page.screenshot({ path: `artifacts/cierre-p1/recuperacion-ayuda-${width}.png`, fullPage: true });
  });
}


test('I5 · el reloj conserva el tiempo de un fotograma retrasado y la pausa lo congela', async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({ schemaVersion: 2, introSeen: false, settings: { flatMode: true } }));
    const clockWindow = window as unknown as Window & { __testFrameLag: number };
    clockWindow.__testFrameLag = 0;
    const nativeFrame = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => nativeFrame((time) => callback(time + clockWindow.__testFrameLag));
  }, auditKey);
  await page.goto('/');
  const timeline = page.locator('#intro-timeline');
  await expect.poll(async () => Number(await timeline.inputValue())).toBeGreaterThan(0);
  const before = Number(await timeline.inputValue());
  await page.evaluate(() => { (window as unknown as Window & { __testFrameLag: number }).__testFrameLag += 5000; });
  await expect.poll(async () => Number(await timeline.inputValue()), { timeout: 1000 }).toBeGreaterThan(before + 4.9);
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  const paused = await timeline.inputValue();
  await page.waitForTimeout(200);
  await expect(timeline).toHaveValue(paused);
});
