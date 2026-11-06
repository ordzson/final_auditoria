import { expect } from '@playwright/test';

const reviewPaths = {
  'AU-01': {
    station: 'accesos', sources: ['E-01', 'E-02'], declarations: [],
    answers: { 'C01-ALCANCE': 'FALTAN_IDENTIDAD_Y_CRITERIO' },
    conclusion: 'A01-OBSERVACION', limitations: ['L01-ATRIBUCION', 'L01-CRITERIO'], request: 'S01-POLITICA',
  },
  'AU-02': {
    station: 'sql_red', sources: ['E-03', 'E-04'], declarations: ['DECL-05'],
    answers: { 'C02-CONTENIDO': 'SIN_VINCULO_NI_CONTENIDO' },
    conclusion: 'A02-TRANSFERENCIA', limitations: ['L02-CONTENIDO', 'L02-VINCULO', 'L02-ATRIBUCION'], request: 'S02-FLUJO',
  },
  'AU-03': {
    station: 'crm_cambios', sources: ['EVT-06', 'EVT-07', 'E-06'], declarations: ['DECL-03', 'DECL-04'],
    answers: { 'C03-ORDEN': 'ORDENES_ANTES', 'C03-SOPORTES': 'FALTAN_CONCILIACION_Y_APROBACION' },
    conclusion: 'A03-PENDIENTES', limitations: ['L03-CAUSA', 'L03-INTEGRIDAD', 'L03-ATRIBUCION', 'L03-APROBACION'], request: 'S03-CONCILIACION',
  },
  'AU-04': {
    station: 'siem', sources: ['EVT-02', 'EVT-08', 'E-07'], declarations: [],
    answers: { 'C04-INTERVALO': 'INTERVALO_ENTRE_REGISTROS' },
    conclusion: 'A04-INTERVALO', limitations: ['L04-INICIO', 'L04-ATENCION', 'L04-OBJETIVO'], request: 'S04-ATENCION',
  },
  'AU-05': {
    station: 'respaldos', sources: ['E-08', 'EVT-09', 'EVT-11', 'EVT-12'], declarations: ['DECL-07'],
    answers: { 'C05-RECUPERACION': 'FALTAN_PRUEBA_Y_OBJETIVOS' },
    conclusion: 'A05-NO_VERIFICADA', limitations: ['L05-EJECUCION', 'L05-RESTAURACION', 'L05-OBJETIVOS'], request: 'S05-PRUEBA',
  },
  'AU-06': {
    station: 'mesa_auditor', sources: ['META-CUSTODIA', 'META-TIEMPO'], declarations: [],
    answers: { 'C06-CUSTODIA': 'CUSTODIA_NO_ACREDITADA', 'C06-RELOJ': 'SINCRONIZACION_NO_VERIFICADA' },
    conclusion: 'A06-LIMITACION', limitations: ['L06-RESUMEN', 'L06-HASH', 'L06-TIEMPO'], request: 'S06-EXTRACCIONES',
  },
};

export async function closePanel(page) {
  const dialog = page.locator('dialog[open]');
  if (await dialog.count()) {
    await dialog.locator('.dialog-header [data-action="close"]').click();
    await expect(dialog).toHaveCount(0);
  }
}

export async function pinSource(page, sourceId) {
  await page.locator(`.source-link[data-action="select-source"][data-source="${sourceId}"]`).first().click();
  const pin = page.locator(`[data-action="pin-source"][data-source="${sourceId}"]`);
  if (await pin.isEnabled()) await pin.click();
}

export async function openInterviewSource(page, sourceId) {
  await closePanel(page);
  await page.locator('[data-flat="liaison"]').click();
  const topics = page.locator('[data-action="topics"]');
  if (await topics.count()) await topics.click();
  const questionBySource = {
    'DECL-05': ['AU-02', 'P-FUJO'], 'DECL-04': ['AU-03', 'P-INTEGRIDAD'],
    'DECL-03': ['AU-03', 'P-APROBACION'], 'DECL-07': ['AU-05', 'P-RESTAURACION'],
  };
  const [topicId, questionId] = questionBySource[sourceId] ?? [];
  if (!questionId) throw new Error(`Fuente de entrevista desconocida: ${sourceId}`);
  await page.locator(`[data-topic="${topicId}"]`).click();
  await page.locator(`[data-question="${questionId}"]`).click();
  await page.locator(`[data-action="source"][data-source="${sourceId}"]`).click();
  await expect(page.locator('#panel-dialog .source-document')).toHaveAttribute('data-document', sourceId);
  const pin = page.locator('[data-action="pin-source"]');
  if (await pin.isEnabled()) await pin.click();
  await page.locator('[data-action="contrast"]').click();
  await expect(page.locator('#panel-dialog .source-link').first()).toBeVisible();
}

export async function completeReview(page, reviewId) {
  const path = reviewPaths[reviewId];
  if (!path) throw new Error(`Revisión desconocida: ${reviewId}`);
  await closePanel(page);
  await page.locator(`[data-flat="${path.station}"]`).click();
  for (const sourceId of path.sources) await pinSource(page, sourceId);
  for (const sourceId of path.declarations) await openInterviewSource(page, sourceId);
  await page.locator('[data-action="open-review"]').click();
  for (const [checkId, answerId] of Object.entries(path.answers)) {
    await page.locator(`input[name="${checkId}"][value="${answerId}"]`).check();
    await page.locator(`[data-action="save-check"][data-check="${checkId}"]`).click();
  }
  await page.locator(`input[name="conclusion"][value="${path.conclusion}"]`).check();
  for (const id of path.limitations) await page.locator(`[data-limitation="${id}"]`).check();
  await page.locator(`[data-request="${path.request}"]`).check();
  await expect(page.locator(`[data-review-status="${reviewId}"]`)).toHaveText('Documentado');
}
