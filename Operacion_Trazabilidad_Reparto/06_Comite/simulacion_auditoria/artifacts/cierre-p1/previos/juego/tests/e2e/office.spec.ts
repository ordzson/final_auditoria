import { selectInterviewSource } from './interview-helpers';
import { test, expect, type Page } from '@playwright/test';
import { reviewRules, type ReviewRule } from '../../src/audit/rules';
import type { ReviewId } from '../../src/audit/types';
import { openPcApp, pcWindow, usePcSource } from './desktop-helpers';

const sourcesForReview: Record<ReviewId, { station: string; ids: string[] }> = {
  'AU-01': { station: 'accesos', ids: ['E-01', 'E-02'] },
  'AU-02': { station: 'sql_red', ids: ['E-03', 'E-04', 'DECL-05'] },
  'AU-03': { station: 'crm_cambios', ids: ['EVT-06', 'EVT-07', 'E-06', 'DECL-03', 'DECL-04'] },
  'AU-04': { station: 'siem', ids: ['EVT-02', 'EVT-08', 'E-07'] },
  'AU-05': { station: 'respaldos', ids: ['E-08', 'DECL-07', 'EVT-09', 'EVT-11', 'EVT-12'] },
  'AU-06': { station: 'mesa_auditor', ids: ['META-CUSTODIA', 'META-TIEMPO'] },
};

async function screenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `artifacts/screenshots/${name}.png` });
}

async function enterFlat(page: Page): Promise<void> {
  await page.addInitScript(() => {
    if (!localStorage.getItem('rednova.auditoria.oficina.v2')) {
      localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({
        schemaVersion: 2,
        introSeen: true,
        settings: { flatMode: true },
      }));
    }
  });
  await page.goto('/');
  await expect(page.locator('#flat-office')).toBeVisible();
}

async function closePanel(page: Page): Promise<void> {
  const dialog = page.locator('dialog[open]');
  if (await dialog.count()) {
    if (await page.locator('.computer-session').count()) {
      await page.locator('.computer-hud [data-desktop-action="exit"]').click();
      await expect(dialog).toHaveCount(0);
      return;
    }
    if (await page.getByRole('button', { name: 'Volver al ordenador', exact: true }).count()) {
      await page.getByRole('button', { name: 'Volver al ordenador', exact: true }).click();
      await closePanel(page);
      return;
    }
    await dialog.locator('.dialog-header [data-action="close"]').click();
    await expect(dialog).toHaveCount(0);
  }
}

async function openStation(page: Page, station: string): Promise<void> {
  await closePanel(page);
  await page.locator(`[data-flat="${station}"]`).click();
  await expect(page.locator('#panel-dialog')).toBeVisible();
}

async function openInterviewSource(page: Page, sourceId: string, pin = false): Promise<void> {
  await closePanel(page);
  await page.locator('[data-flat="liaison"]').click();
  await selectInterviewSource(page, sourceId);
  await page.locator(`[data-action="source"][data-source="${sourceId}"]`).click();
  await expect(page.locator('#panel-dialog .source-document')).toHaveAttribute('data-document', sourceId);
  if (pin) await page.locator('[data-action="pin-source"]').click();
}

async function pinSource(page: Page, sourceId: string): Promise<void> {
  if (await page.locator('.computer-session').count()) { await usePcSource(page, sourceId); return; }
  await page.locator(`.source-link[data-action="select-source"][data-source="${sourceId}"]`).first().click();
  await page.locator(`[data-action="pin-source"][data-source="${sourceId}"]`).click();
}

async function completeReview(page: Page, reviewId: ReviewId): Promise<void> {
  const rule: ReviewRule = reviewRules[reviewId];
  const sources = sourcesForReview[reviewId];
  for (const sourceId of sources.ids) {
    if (sourceId.startsWith('DECL-')) continue;
    await pinSource(page, sourceId);
  }
  for (const sourceId of sources.ids) {
    if (sourceId.startsWith('DECL-')) {
      await openInterviewSource(page, sourceId, true);
      await page.locator('[data-action="contrast"]').click();
      await expect(page.locator('.computer-session')).toBeVisible();
    }
  }
  await openPcApp(page, 'local-dossier', 'Expediente local');
  const dossier = pcWindow(page, 'local-dossier');
  for (const check of rule.checks) await dossier.locator(`[data-pc-check="${check.id}"]`).selectOption(check.acceptedAnswerId);
  await openPcApp(page, 'station-report', 'Informe del puesto');
  const report = pcWindow(page, 'station-report');
  await report.locator(`[data-pc-conclusion][value="${rule.acceptedConclusionIds[0]}"]`).check();
  for (const id of rule.requiredLimitationIds) await report.locator(`[data-pc-limitation="${id}"]`).check();
  await report.locator(`[data-pc-request="${rule.requests[0].id}"]`).check();
  await expect(page.locator('.computer-hud [data-progress]')).toHaveText('Documentado');
}

test.beforeEach(async ({ page }) => {
  page.setDefaultTimeout(15_000);
});

test('A · navegación real, entrega, AU-02 y dependencia de fuentes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Omitir y entrar a la oficina' }).click();
  await page.keyboard.press('KeyJ');
  await expect(page.locator('#toast')).toContainText('Primero acércate al enlace');
  await expect(page.locator('#notebook-dialog')).not.toBeVisible();
  await page.locator('#enter-office').click();
  await expect.poll(() => page.evaluate(() => Boolean(document.pointerLockElement))).toBe(true);
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(5000);
  await page.keyboard.up('KeyW');
  await page.evaluate(() => document.dispatchEvent(new MouseEvent('mousemove', { movementX: 240, movementY: 40 })));
  await expect(page.locator('#interaction-prompt')).toContainText('Recibir la tablita');
  await page.keyboard.press('KeyE');
  await expect(page.getByRole('heading', { name: 'Enlace de TI · entrevista' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('rednova.auditoria.oficina.v2')!).clipboardReceived)).toBe(true);
  await selectInterviewSource(page, 'DECL-05');
  await page.locator('[data-action="source"][data-source="DECL-05"]').first().click();
  await page.locator('[data-action="pin-source"]').click();
  await page.locator('[data-action="contrast"]').click();
  await expect(pcWindow(page, 'query-studio')).toBeVisible();
  await pinSource(page, 'E-03');
  await pinSource(page, 'E-04');
  await page.locator('.computer-hud [data-desktop-action="notebook"]').click();
  await page.locator('input[name="conclusion"][value="A02-EXFILTRACION_CONFIRMADA"]').check();
  await page.locator('input[name="C02-CONTENIDO"][value="VOLUMEN_DEMUESTRA_EXFILTRACION"]').check();
  await page.locator('[data-action="save-check"]').click();
  await expect(page.locator('[data-review-status="AU-02"]')).toHaveText('Por contrastar');
  await page.locator('input[name="C02-CONTENIDO"][value="SIN_VINCULO_NI_CONTENIDO"]').check();
  await page.locator('[data-action="save-check"]').click();
  await page.locator('input[name="conclusion"][value="A02-TRANSFERENCIA"]').check();
  for (const id of ['L02-CONTENIDO', 'L02-VINCULO', 'L02-ATRIBUCION']) await page.locator(`[data-limitation="${id}"]`).check();
  await page.locator('[data-request="S02-FLUJO"]').check();
  await expect(page.locator('[data-review-status="AU-02"]')).toHaveText('Documentado');
  await screenshot(page, 'a-au02-documentada');
  await page.locator('[data-action="unpin"][data-source="DECL-05"]').click();
  await expect(page.locator('[data-review-status="AU-02"]')).toHaveText('Por contrastar');
  await expect(page.locator('.pending-details')).toContainText('cambiaron o se retiraron las fuentes');
  await page.locator('[data-action="interview"]').click();
  await selectInterviewSource(page, 'DECL-05');
  await page.locator('[data-action="source"][data-source="DECL-05"]').first().click();
  await page.locator('[data-action="pin-source"]').click();
  await page.locator('[data-action="contrast"]').click();
  await expect(page.locator('.computer-hud [data-progress]')).toHaveText('Documentado');
  await closePanel(page);
  await page.keyboard.press('KeyJ');
  await expect(page.locator('[data-notebook-row="AU-02"]')).toContainText('Documentado');
  expect(errors).toEqual([]);
});

test('B · seis revisiones en distinto orden, entrevistas y libreta', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await enterFlat(page);
  for (const reviewId of ['AU-06', 'AU-02', 'AU-04', 'AU-01', 'AU-05', 'AU-03'] as ReviewId[]) {
    await openStation(page, sourcesForReview[reviewId].station);
    await completeReview(page, reviewId);
    await closePanel(page);
  }
  await page.locator('[data-action="notebook"]').first().click();
  await page.locator('.closing-section > summary').click();
  await expect(page.locator('.notebook-header')).toContainText('6 / 6 documentadas');
  await expect(page.locator('[data-notebook-row]')).toHaveCount(6);
  await page.locator('input[data-review="AU-02"][data-field="action"]').fill('Conservar y correlacionar los registros disponibles.');
  await page.locator('input[data-review="AU-02"][data-field="action"]').blur();
  await page.locator('input[data-review="AU-02"][data-field="owner"]').fill('Seguridad');
  await page.locator('input[data-review="AU-02"][data-field="owner"]').blur();
  await screenshot(page, 'b-seis-documentadas');
  expect(errors).toEqual([]);
});


test('C · diez planos, transporte, nota ilustrativa y estado intacto', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  const seek = async (time: number) => {
    await page.locator('#intro-timeline').evaluate((input: HTMLInputElement, value) => {
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, time);
  };
  await expect(page.locator('#intro-shot')).toHaveText('P01 · 1/10');
  const plan = [['P01', 0], ['P02', 8], ['P03', 16], ['P04', 23], ['P05', 37], ['P06', 45], ['P07', 53], ['P08', 61], ['P09', 77], ['P10', 95]];
  for (const [id, start] of plan) {
    await seek(Number(start));
    await expect(page.locator('#intro-shot')).toContainText(String(id));
  }
  await page.locator('[data-action="previous"]').click();
  await expect(page.locator('#intro-shot')).toContainText('P09');
  await page.locator('[data-action="next"]').click();
  await expect(page.locator('#intro-shot')).toContainText('P10');
  await seek(16.5);
  await expect(page.locator('#intro-time')).toHaveText('02:26');
  await expect(page.locator('#intro-message')).toContainText('La cuenta no está aportada');
  await page.waitForTimeout(300);
  await expect(page.locator('#intro-timeline')).toHaveValue('16.5');
  await seek(53);
  await expect(page.locator('#intro-time')).toHaveText('03:18');
  await expect(page.locator('#intro-message')).toHaveText('Se emite una alerta crítica.');
  await seek(63.95);
  await expect(page.locator('#ransom-note')).toBeHidden();
  await seek(64);
  await expect(page.locator('#ransom-note')).toBeVisible();
  await expect(page.locator('#ransom-note')).toContainText('Sus archivos están bloqueados.');
  await expect(page.locator('#ransom-note')).toContainText('Para recuperarlos, debe realizar un pago.');
  await expect(page.locator('#ransom-note')).toContainText('Recreación ilustrativa · no es el texto original');
  await expect(page.locator('#intro-provenance')).toContainText('EVT-09');
  await screenshot(page, 'c-p08-nota-ilustrativa');
  await seek(74);
  await expect(page.locator('#ransom-note')).toBeHidden();
  await seek(83);
  await expect(page.locator('#intro-time')).toHaveText('08:57');
  await expect(page.locator('#intro-message')).toContainText('solo consulta');
  await seek(89);
  await expect(page.locator('#intro-time')).toHaveText('09:37');
  await expect(page.locator('#intro-message')).toContainText('integridad por verificar');
  await seek(105);
  await expect(page.locator('#intro-date')).toHaveText('Visita de auditoría');
  await expect(page.locator('#intro-time')).toHaveText('SIN HORA ASIGNADA');
  await page.locator('.intro-history > summary').click();
  await expect(page.locator('#intro-history-list li')).toHaveCount(6);
  await page.locator('[data-action="replay"]').click();
  await expect(page.locator('#intro-shot')).toContainText('P01');
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  await page.getByRole('button', { name: 'Omitir y entrar a la oficina' }).click();
  await expect(page.locator('#intro-root')).toBeHidden();
  await expect(page.locator('#enter-office')).toBeVisible();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('rednova.auditoria.oficina.v2')!));
  expect(state.inspected).toEqual([]);
  expect(Object.values(state.assessments).every((assessment) =>
    (assessment as { checkAnswers: unknown[] }).checkAnswers.length === 0
  )).toBe(true);
  expect(errors).toEqual([]);
});

test('C · guardar, editar, reevaluar versión, exportar JSON e imprimir', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await enterFlat(page);
  await page.locator('[data-flat="liaison"]').click();
  await closePanel(page);
  await openStation(page, 'accesos');
  await pinSource(page, 'E-01');
  await page.locator('.computer-hud [data-desktop-action="notebook"]').click();
  await page.locator('input[name="conclusion"][value="A01-AUTOR_IDENTIFICADO"]').check();
  await page.locator('[data-request="S01-POLITICA"]').check();
  await page.locator('#free-note').fill('Falta la política aplicable; no atribuyo la sesión a una persona.');
  await page.locator('#free-note').press('Tab');
  await page.locator('[data-action="hint"]').click();
  await expect(page.locator('.hint-block')).toContainText('Usuarios y privilegios');
  await page.reload();
  await openStation(page, 'accesos');
  await expect(page.locator('.computer-hud [data-progress]')).toHaveText('Por contrastar');
  await page.locator('.computer-hud [data-desktop-action="notebook"]').click();
  await expect(page.locator('#free-note')).toHaveValue('Falta la política aplicable; no atribuyo la sesión a una persona.');
  await expect(page.locator('input[value="A01-AUTOR_IDENTIFICADO"]')).toBeChecked();
  await expect(page.locator('[data-request="S01-POLITICA"]')).toBeChecked();
  await closePanel(page);
  await page.locator('[data-action="notebook"]').first().click();
  await page.locator('.closing-section > summary').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export"]').click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let json = '';
  for await (const chunk of stream!) json += chunk.toString();
  const exported = JSON.parse(json);
  const review = exported.reviews.find((item: { reviewId: string }) => item.reviewId === 'AU-01');
  expect(exported.schema).toBe('rednova_libreta_v2');
  expect(review.sourceRefs[0]).toEqual({ sourceId: 'E-01', sourceVersion: 'auditoria_oficina_v2.1' });
  expect(review.freeNote).toContain('no atribuyo');
  expect(review.isDocumented).toBe(false);
  expect(review.pendingReasons.length).toBeGreaterThan(0);
  expect(download.suggestedFilename()).toBe('rednova_libreta_auditoria.json');
  await page.evaluate(() => {
    const key = 'rednova.auditoria.oficina.v2';
    const data = JSON.parse(localStorage.getItem(key)!);
    data.assessments['AU-01'].rulesVersion = 'auditoria_reglas_v1';
    data.assessments['AU-01'].sourceRefs[0].sourceVersion = 'version_anterior';
    localStorage.setItem(key, JSON.stringify(data));
  });
  await page.reload();
  await openStation(page, 'accesos');
  await page.locator('.computer-hud [data-desktop-action="notebook"]').click();
  await expect(page.locator('.pending-details')).toContainText('versión de reglas');
  await expect(page.locator('.pending-details')).toContainText('desactualizadas');
  await expect(page.locator('[data-review-status="AU-01"]')).toHaveText('Por contrastar');
  await page.evaluate(() => { window.print = () => undefined; });
  await closePanel(page);
  await page.locator('[data-action="notebook"]').first().click();
  await page.locator('.closing-section > summary').click();
  await page.locator('[data-action="print"]').click();
  await expect(page.locator('body')).toHaveClass(/printing-report/);
  await expect(page.locator('#print-report')).toContainText('No sustituye el informe del curso');
  await expect(page.locator('#print-report')).toContainText('Falta la política aplicable');
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: test.info().outputPath('libreta-incompleta-prueba.pdf'), format: 'A4', printBackground: true });
  await page.emulateMedia({ media: 'screen' });
  expect(errors).toEqual([]);
});
