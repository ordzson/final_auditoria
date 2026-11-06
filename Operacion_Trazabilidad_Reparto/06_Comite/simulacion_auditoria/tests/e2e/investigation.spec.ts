import { test, expect, type Page } from '@playwright/test';
import { openPcApp, pcWindow } from './desktop-helpers';

async function enterDesk(page: Page, station: string): Promise<void> {
  await page.addInitScript(() => localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({
    schemaVersion: 2, introSeen: true, clipboardReceived: true, settings: { flatMode: true },
  })));
  await page.goto('/');
  await page.locator(`[data-flat="${station}"]`).click();
  await expect(page.locator('.computer-session')).toBeVisible();
}

async function inspect(page: Page, source: string): Promise<void> {
  const app = page.locator('.pc-window.is-active');
  await app.locator(`[data-pc-open="${source}"]`).click();
  await expect(app.locator('.pc-app-document')).toHaveAttribute('data-document', source);
}

test('SQL editable: filtros reales, NULL, errores y trazabilidad sin completar por clics', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await enterDesk(page, 'sql_red');
  const query = pcWindow(page, 'query-studio');
  await expect(query.getByRole('heading', { name: 'Query Studio', exact: true })).toBeVisible();
  await expect(page.locator('input[name="conclusion"]')).toHaveCount(0);
  await expect(query.locator('.pc-app-results table')).toHaveCount(0);
  await query.getByRole('button', { name: 'Ejecutar consulta', exact: true }).click();
  await expect(query.locator('.pc-app-results tbody tr')).toHaveCount(2);
  await query.getByRole('button', { name: 'Abrir Lectura masiva de clientes', exact: true }).click();
  await expect(query.locator('.pc-app-inspector')).toContainText('No aportado');
  await query.getByRole('button', { name: 'Usar como sustento', exact: true }).click();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('rednova.auditoria.oficina.v2')!));
  expect(state.assessments['AU-02'].sourceRefs[0].sourceId).toBe('EVT-04');
  expect(state.assessments['AU-02'].conclusionId).toBe(null);
  await page.getByRole('button', { name: 'Libreta', exact: true }).click();
  await expect(page.locator('.linked-sources')).toContainText('Lectura masiva de clientes');
  await page.getByRole('button', { name: 'Volver al ordenador', exact: true }).click();
  await expect(query.getByRole('textbox', { name: 'Consulta SQL' })).toHaveValue(/OR sistema = 'Monitoreo de red'/);
  const editor = query.getByRole('textbox', { name: 'Consulta SQL' });
  await editor.fill("SELECT hora, cuenta FROM registros WHERE cuenta = 'ext_ops_04';");
  await expect(query.locator('.pc-app-results table')).toHaveCount(0);
  await editor.press('Control+Enter');
  await expect(query.locator('.pc-app-results tbody tr')).toHaveCount(1);
  await expect(query.locator('.pc-app-results')).toContainText('02:17');
  await editor.fill('SELECT * FROM clientes;');
  await editor.press('Control+Enter');
  await expect(query.locator('.pc-app-query-error')).toContainText('registros y soportes');
  await expect(query.locator('.pc-app-results table')).toHaveCount(0);
  await editor.fill("SELECT * FROM registros WHERE cuenta = 'nadie';");
  await editor.press('Control+Enter');
  await expect(query.locator('.pc-app-results')).toContainText('Ninguna fila coincide');
  expect(errors).toEqual([]);
});

test('comparar órdenes y despliegue permite descubrir el orden reportado', async ({ page }) => {
  await enterDesk(page, 'crm_cambios');
  const orders = pcWindow(page, 'order-history');
  await inspect(page, 'EVT-06');
  await orders.locator('[data-pc-viewer="compare"]').click();
  await inspect(page, 'EVT-07');
  await orders.locator('[data-pc-viewer="compare"]').click();
  await expect(orders.locator('.pc-app-comparison')).toContainText('20 minutos');
  await expect(orders.locator('.pc-app-comparison')).toContainText('no demuestra causalidad');
  await expect(orders.locator('.pc-app-comparison-records')).toContainText('Modificación de órdenes');
  await expect(orders.locator('.pc-app-comparison-records')).toContainText('Despliegue de integración');
  await orders.getByRole('button', { name: 'Retirar de la mesa', exact: true }).first().click();
  await orders.getByRole('button', { name: 'Retirar de la mesa', exact: true }).click();
  await expect(orders.locator('[data-pc-comparison-records]')).toContainText('Elige «Comparar registro»');
});

test('sesiones: buscar una cuenta conserva foco y no atribuye la elevación sin usuario', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await enterDesk(page, 'accesos');
  const sessions = pcWindow(page, 'session-viewer');
  const search = sessions.getByRole('searchbox', { name: 'Filtrar registros' });
  await search.pressSequentially('ext_ops_04');
  await expect(search).toBeFocused();
  await expect(sessions.locator('.pc-app-record-layout tbody tr')).toHaveCount(1);
  await expect(sessions.locator('.pc-app-record-layout')).toContainText('Sesión remota sin MFA');
  await search.fill('');
  await inspect(page, 'EVT-03');
  await expect(sessions.locator('.pc-app-document')).toContainText('No aportado');
  await expect(sessions.locator('.pc-app-document')).toContainText('Cuenta');
  await expect(sessions.locator('[data-pc-viewer="follow-account"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('recuperación: recorrer estados no acredita integridad ni ejecuta restauraciones', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await enterDesk(page, 'respaldos');
  const recovery = pcWindow(page, 'recovery-console');
  await expect(recovery.locator('.pc-app-recovery-snapshot')).toContainText('03:42');
  await recovery.locator('[data-pc-recovery-step="2"]').click();
  await expect(recovery.locator('.pc-app-recovery-snapshot')).toContainText('08:57');
  await expect(recovery.locator('.pc-app-recovery-snapshot dl > div').nth(1)).toContainText('Sin retorno reportado todavía');
  const slider = recovery.getByRole('slider', { name: 'Momento de la revisión' });
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(slider).toBeFocused();
  await expect(recovery.locator('.pc-app-recovery-snapshot')).toContainText('09:37');
  await expect(recovery.locator('.pc-app-recovery-snapshot dl > div').nth(2)).toContainText('No aportada');
  await recovery.getByRole('button', { name: 'Abrir registro de este momento', exact: true }).click();
  await expect(recovery.locator('.pc-app-document')).toHaveAttribute('data-document', 'EVT-12');
  await expect(recovery.getByRole('button', { name: /restaurar ahora/i })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('archivo: comprobar un original ausente produce una limitación, sin hashes inventados', async ({ page }) => {
  await enterDesk(page, 'mesa_auditor');
  const files = pcWindow(page, 'file-explorer');
  await files.getByRole('button', { name: 'Comprobar archivo', exact: true }).first().click();
  await expect(files.locator('.pc-app-feedback')).toContainText('No hay archivo original ni SHA-256');
  await expect(files.locator('.pc-app-document')).toHaveAttribute('data-document', 'META-CUSTODIA');
  await files.getByRole('button', { name: 'Usar como sustento', exact: true }).click();
  await openPcApp(page, 'clock-comparator', 'Comparador de relojes');
  const clocks = pcWindow(page, 'clock-comparator');
  await expect(clocks.locator('.pc-app-clock-table')).toContainText('Sin verificar');
  await inspect(page, 'EVT-02');
  await expect(clocks.locator('[data-pc-viewer="follow-account"]')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.locator('[data-flat="mesa_auditor"]').click();
  await expect(pcWindow(page, 'clock-comparator').locator('.pc-app-clock-table')).toContainText('Sin verificar');
});

test('SIEM: seguir la cuenta conserva una cronología válida y permite reabrir el puesto', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await enterDesk(page, 'siem');
  const events = pcWindow(page, 'event-desk');
  await inspect(page, 'EVT-02');
  await events.getByRole('button', { name: 'Buscar más actividad de ext_ops_04', exact: true }).click();
  await expect(events.getByRole('searchbox', { name: 'Filtrar registros' })).toHaveValue('ext_ops_04');
  await expect(events.locator('.pc-app-event')).toHaveCount(1);
  await expect(events.locator('.pc-app-event')).toContainText('Sesión remota sin MFA');
  await page.keyboard.press('Escape');
  await page.locator('[data-flat="siem"]').click();
  await expect(events.locator('.pc-app-event')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('móvil: editor, inspector y guardado funcionan sin desbordar la pantalla', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enterDesk(page, 'sql_red');
  const query = pcWindow(page, 'query-studio');
  await query.getByRole('button', { name: 'Ejecutar consulta', exact: true }).click();
  await query.getByRole('button', { name: 'Abrir Lectura masiva de clientes', exact: true }).click();
  await query.getByRole('button', { name: 'Usar como sustento', exact: true }).click();
  await expect(page.locator('.computer-save-status')).toHaveText('Libreta actualizada');
  await expect(query.locator('.pc-app-inspector h3')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.computer-monitor').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#panel-dialog')).not.toBeVisible();
  expect(errors).toEqual([]);
});
