import { test, expect } from '@playwright/test';
import previous from '../fixtures/libreta-anterior.json' with { type: 'json' };
import { pcWindow, usePcSource } from './desktop-helpers';

const key = 'rednova.auditoria.oficina.v2';
const desks = [
  ['accesos', 'session-viewer', 'EVT-02'], ['sql_red', 'query-studio', 'E-04'],
  ['crm_cambios', 'order-history', 'EVT-06'], ['siem', 'event-desk', 'E-07'],
  ['respaldos', 'recovery-console', 'EVT-12'], ['mesa_auditor', 'file-explorer', 'META-CUSTODIA'],
] as const;

for (const [width, height] of [[1280, 720], [1920, 1080]]) {
  test(`Clase · lectura, fuentes y libreta con partida anterior, proyector y sin audio a ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.route('**/audio/**', (route) => route.abort());
    await page.addInitScript(({ key, previous }) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, JSON.stringify({
        schemaVersion: 2, contentVersion: previous.contentVersion, rulesVersion: previous.rulesVersion,
        clipboardReceived: true, introSeen: true, settings: { flatMode: true, projector: true, audioEnabled: false, reducedMotion: true },
        inspected: previous.reviews.flatMap((review) => review.sourceRefs),
        assessments: Object.fromEntries(previous.reviews.map((review) => [review.reviewId, { ...review, rulesVersion: previous.rulesVersion }])),
        recommendations: Object.fromEntries(previous.reviews.map((review) => [review.reviewId, review.recommendation])),
      }));
    }, { key, previous });
    await page.goto('/');
    await expect(page.locator('.flat-heading')).toContainText('empresa ficticia');
    await expect(page.locator('.flat-station')).toHaveCount(6);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const [station, app, source] of desks) {
      await page.locator(`[data-flat="${station}"]`).focus();
      await page.keyboard.press('Enter');
      await expect(pcWindow(page, app)).toBeVisible();
      await expect(page.locator('.computer-hud [data-progress]')).toHaveText('Documentado');
      await usePcSource(page, source);
      const dossier = pcWindow(page, 'local-dossier');
      const maximize = dossier.getByRole('button', { name: 'Maximizar Expediente local', exact: true });
      if (await maximize.count()) await maximize.click();
      await expect(dossier.locator('.pc-app-document')).toHaveAttribute('data-document', source);
      await dossier.locator('.pc-app-document').scrollIntoViewIfNeeded();
      const content = await dossier.innerText();
      expect(content).not.toMatch(/\b(?:P[123]|I[1-6]|CR-I4|B1-[12]|H-[ABC])\b/);
      const clipped = await dossier.locator('.pc-app-document p, .review-help p').evaluateAll((elements) => elements.filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent));
      expect(clipped).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const bounds = await dossier.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height);
      await page.screenshot({ path: `artifacts/clase/capturas/${station}-${width}.png` });
      await page.keyboard.press('Escape');
    }
    await page.keyboard.press('KeyJ');
    await expect(page.locator('.notebook-header')).toContainText('6 / 6 documentadas');
    const analysis = page.locator('.classroom-analysis').first();
    await analysis.locator('summary').click();
    await expect(analysis).toContainText('Posible uso indebido de un acceso legítimo');
    await expect(analysis).toContainText('Protección de los registros pendiente de comprobar');
    await page.screenshot({ path: `artifacts/clase/capturas/libreta-${width}.png` });
    await page.locator('.closing-section > summary').click();
    await page.locator('[data-action="export"]').scrollIntoViewIfNeeded();
    const pendingDownload = page.waitForEvent('download');
    await page.locator('[data-action="export"]').click();
    expect((await pendingDownload).suggestedFilename()).toBe('rednova_libreta_auditoria.json');
    await page.locator('[data-action="print"]').scrollIntoViewIfNeeded();
    await page.evaluate(() => { window.print = () => undefined; });
    await page.locator('[data-action="print"]').click();
    await expect(page.locator('#print-report')).toContainText('2.06 megabytes');
    await expect(page.locator('#print-report')).toContainText('Las once acciones siguen siendo propuestas');
    await page.reload();
    await page.keyboard.press('KeyJ');
    await expect(page.locator('.notebook-header')).toContainText('6 / 6 documentadas');
    expect(errors).toEqual([]);
  });
}
