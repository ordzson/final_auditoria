import { selectInterviewSource } from './interview-helpers';
import { test, expect, type Page } from '@playwright/test';
import { openPcApp, pcWindow, usePcSource } from './desktop-helpers';

const auditKey = 'rednova.auditoria.oficina.v2';
const workspaceKey = 'rednova.computers.workspace.v1';
const sql = "SELECT hora, sistema, cuenta, detalle FROM registros WHERE sistema = 'SQL Server' OR sistema = 'Monitoreo de red' ORDER BY fecha, hora;";
const savedAudit = (page: Page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), auditKey);
const savedWorkspace = (page: Page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).stations.sql_red, workspaceKey);

async function seed(page: Page, flatMode = true): Promise<void> {
  await page.addInitScript(({ key, flatMode }) => {
    if (sessionStorage.getItem('desktop-b-seeded')) return;
    sessionStorage.setItem('desktop-b-seeded', 'true');
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({
      schemaVersion: 2, introSeen: true, settings: { flatMode, reducedMotion: true },
      pose: { x: -0.75, z: -2.15, yaw: 0, pitch: 0 },
    }));
  }, { key: auditKey, flatMode });
  await page.goto('/');
}

async function enterB(page: Page): Promise<void> {
  await page.locator('[data-flat="sql_red"]').click();
  await expect(pcWindow(page, 'query-studio')).toBeVisible();
}

async function screenshot(page: Page, name: string): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/desktop-b/${name}.png`, fullPage: true });
}

test('B integrada: acceso físico, pista, dos programas, TI, autosave, libreta y restauración', async ({ page }) => {
  const errors: string[] = [];
  const failedResources: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) failedResources.push(response.url()); });
  await page.setViewportSize({ width: 1280, height: 720 });
  await seed(page, false);
  await page.locator('#enter-office').click();
  await expect(page.locator('#interaction-prompt')).toContainText('SQL y red');
  await page.keyboard.press('KeyE');
  await expect(page.locator('#panel-dialog')).toHaveClass('computer-dialog');
  await expect(pcWindow(page, 'query-studio')).toHaveClass(/is-active/);
  await expect(pcWindow(page, 'network-monitor')).toBeVisible();
  await expect(pcWindow(page, 'query-studio').getByRole('textbox', { name: 'Consulta SQL' })).toHaveValue(sql);
  expect(await page.evaluate(() => Boolean(document.pointerLockElement))).toBe(false);
  const pose = (await savedAudit(page)).pose;
  await page.locator('.computer-hud [data-desktop-action="exit"]').focus();
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(200);
  await page.keyboard.up('KeyW');
  expect((await savedAudit(page)).pose).toEqual(pose);
  const beforeHint = await savedAudit(page);
  await page.getByRole('button', { name: 'Revisar la lectura masiva de clientes', exact: true }).click();
  await expect(page.locator('.pc-note-hint:visible')).toContainText('Abre Query Studio');
  expect(await savedAudit(page)).toEqual(beforeHint);
  await screenshot(page, 'office-1280');

  const query = pcWindow(page, 'query-studio');
  await query.getByRole('textbox', { name: 'Consulta SQL' }).fill(sql);
  await query.getByRole('textbox', { name: 'Consulta SQL' }).press('Control+Enter');
  await expect(query.locator('.pc-app-results tbody tr')).toHaveCount(2);
  await expect(query.locator('.pc-app-results')).toContainText('NULL');
  expect(await savedAudit(page)).toEqual(beforeHint);
  await query.locator('[data-pc-open="EVT-04"]').click();
  await query.locator('[data-pc-viewer="compare"]').click();
  await openPcApp(page, 'network-monitor', 'Monitor de red');
  const network = pcWindow(page, 'network-monitor');
  await network.locator('[data-pc-open="EVT-05"]').click();
  await network.locator('[data-pc-viewer="compare"]').click();
  await expect(network.locator('[data-pc-comparison-records]')).toContainText('4 minutos');
  await expect(page.locator('.computer-save-status')).toHaveText('Libreta actualizada');
  // La confirmación comparte la capa modal y está fuera del área simulada.
  expect(await page.locator('.computer-save-status').evaluate((node) => {
    const monitor = document.querySelector('.computer-monitor')!.getBoundingClientRect();
    const hud = node.getBoundingClientRect();
    return node.closest('dialog')?.open && !node.closest('.computer-desktop') && hud.bottom <= monitor.top;
  })).toBe(true);
  await screenshot(page, 'two-programs-saved');
  const check = network.locator('[data-pc-check="C02-CONTENIDO"]');
  await check.selectOption('SIN_VINCULO_NI_CONTENIDO');
  await expect(network.locator('[data-pc-check-status]')).toContainText('Borrador');
  expect((await savedAudit(page)).assessments['AU-02'].checkAnswers).toEqual([]);
  const scroller = network.locator('[data-pc-scroll="browser-body"]');
  await scroller.evaluate((element) => { element.scrollTop = 140; });
  const scrollTop = await scroller.evaluate((element) => element.scrollTop);
  expect(scrollTop).toBeGreaterThan(0);

  await page.locator('.computer-hud').getByRole('button', { name: 'Enlace de TI', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Enlace de TI · entrevista' })).toBeVisible();
  expect((await savedAudit(page)).clipboardReceived).toBe(true);
  await selectInterviewSource(page, 'DECL-05');
  await page.locator('[data-action="source"][data-source="DECL-05"]').click();
  await expect(page.locator('.source-document')).toHaveAttribute('data-document', 'DECL-05');
  await page.getByRole('button', { name: 'Cerrar documento', exact: true }).click();
  await expect(network).toBeVisible();
  expect(await scroller.evaluate((element) => element.scrollTop)).toBe(scrollTop);
  await expect(check).toHaveValue('SIN_VINCULO_NI_CONTENIDO');
  await usePcSource(page, 'DECL-05');
  expect((await savedAudit(page)).assessments['AU-02'].checkAnswers[0].answerId).toBe('SIN_VINCULO_NI_CONTENIDO');
  await openPcApp(page, 'station-report', 'Informe del puesto');
  const report = pcWindow(page, 'station-report');
  await report.locator('[data-pc-conclusion][value="A02-TRANSFERENCIA"]').check();
  await expect(page.locator('.computer-save-status')).toHaveText('Conclusión guardada');
  for (const id of ['L02-CONTENIDO', 'L02-VINCULO', 'L02-ATRIBUCION']) await report.locator(`[data-pc-limitation="${id}"]`).check();
  await report.locator('[data-pc-request="S02-FLUJO"]').check();
  await expect(page.locator('.computer-hud [data-progress]')).toHaveText('Documentado');
  await report.locator('.pc-app-free-note').fill('Última frase antes de abrir la libreta, sin desenfocar.');
  await page.locator('.computer-hud').getByRole('button', { name: 'Libreta', exact: true }).click();
  await expect(page.locator('#free-note')).toHaveValue('Última frase antes de abrir la libreta, sin desenfocar.');
  await expect(page.locator('input[value="A02-TRANSFERENCIA"]')).toBeChecked();
  await expect(page.locator('[data-review-status="AU-02"]')).toHaveText('Documentado');
  await page.locator('[data-action="unpin"][data-source="DECL-05"]').click();
  await expect(page.locator('[data-review-status="AU-02"]')).toHaveText('Por contrastar');
  await page.keyboard.press('Escape');
  await expect(report).toBeVisible();
  await expect(page.locator('.computer-hud [data-progress]')).toHaveText('Por contrastar');
  await page.getByRole('button', { name: 'Mostrar escritorio', exact: true }).click();
  await expect(page.locator('.pc-note li').nth(1)).toContainText('Por consultar');
  const shortcut = page.locator('.pc-shortcut[data-app-id="query-studio"]');
  await shortcut.click();
  await expect(query).toBeHidden();
  await shortcut.press('Enter');
  await expect(query).toBeVisible();
  await expect(page.locator('.pc-window[data-app-id="query-studio"]')).toHaveCount(1);
  await expect(query.getByRole('textbox', { name: 'Consulta SQL' })).toHaveValue(sql);
  await query.getByRole('button', { name: 'Maximizar Query Studio', exact: true }).click();
  await expect(query).toHaveClass(/is-maximized/);
  await query.getByRole('button', { name: 'Restaurar Query Studio', exact: true }).click();
  await query.getByRole('button', { name: 'Minimizar Query Studio', exact: true }).click();
  await page.locator('.pc-task[data-app-id="query-studio"]').click();
  await expect(query.getByRole('textbox', { name: 'Consulta SQL' })).toHaveValue(sql);
  await page.locator('.pc-start').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.pc-start-menu')).toBeHidden();
  await expect(query).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#panel-dialog')).not.toBeVisible();
  expect((await savedAudit(page)).pose).toEqual(pose);
  await page.locator('#enter-office').click();
  await expect(page.locator('#interaction-prompt')).toContainText('SQL y red');
  // Chrome headless no libera el puntero con una tecla sintetizada.
  await page.evaluate(() => document.exitPointerLock());
  await expect(page.locator('#entry-overlay')).toBeVisible();
  // Volver desde el acceso plano conserva el mismo equipo y no bloquea el foco.
  await page.locator('.settings-menu > summary').click();
  await page.locator('[data-setting="flatMode"]').check();
  await enterB(page);
  await expect(query.getByRole('textbox', { name: 'Consulta SQL' })).toHaveValue(sql);
  await expect(query.getByRole('textbox', { name: 'Consulta SQL' })).toBeFocused();
  const inspected = (await savedAudit(page)).inspected;
  await page.reload();
  await enterB(page);
  await expect(query.locator('.pc-app-results tbody tr')).toHaveCount(2);
  expect((await savedAudit(page)).inspected).toEqual(inspected);
  expect((await savedWorkspace(page)).comparisonSourceIds).toEqual(['EVT-04', 'EVT-05']);
  await page.keyboard.press('Escape');
  await page.locator('[data-flat="accesos"]').click();
  await page.getByRole('searchbox', { name: 'Filtrar registros' }).fill('ext_ops_04');
  await page.locator('.computer-hud [data-desktop-action="exit"]').click();
  await enterB(page);
  await expect(query.getByRole('textbox', { name: 'Consulta SQL' })).toHaveValue(sql);
  expect(errors).toEqual([]);
  expect(failedResources).toEqual([]);
});

test('B a 1920: oficina y bisel visibles, retorno de TI y foco contenido', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await seed(page, false);
  await page.locator('#enter-office').click();
  await expect(page.locator('#interaction-prompt')).toContainText('SQL y red');
  await page.keyboard.press('KeyE');
  await expect(pcWindow(page, 'query-studio')).toBeVisible();
  await screenshot(page, 'office-1920');
  await page.locator('.computer-hud').getByRole('button', { name: 'Enlace de TI', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(pcWindow(page, 'query-studio').getByRole('textbox', { name: 'Consulta SQL' })).toBeFocused();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('#panel-dialog')))).toBe(true);
  }
});

test('B móvil táctil: nota, aplicaciones, última frase y restauración', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  try {
    await seed(page);
    await enterB(page);
    await expect(page.locator('.computer-session')).toHaveAttribute('data-single-window', 'true');
    await expect(page.locator('.pc-window:visible')).toHaveCount(1);
    await screenshot(page, 'mobile-390');
    await page.getByRole('button', { name: 'Mostrar escritorio', exact: true }).tap();
    await page.getByRole('button', { name: 'Obtener el contexto de Seguridad', exact: true }).tap();
    await expect(page.locator('.pc-note-hint:visible')).toContainText('Solicita');
    await screenshot(page, 'mobile-note');
    await page.locator('.pc-shortcut[data-app-id="query-studio"]').tap();
    const editor = pcWindow(page, 'query-studio').getByRole('textbox', { name: 'Consulta SQL' });
    await editor.fill(sql);
    await pcWindow(page, 'query-studio').getByRole('button', { name: 'Ejecutar consulta', exact: true }).tap();
    await openPcApp(page, 'network-monitor', 'Monitor de red');
    await expect(page.locator('.pc-window:visible')).toHaveCount(1);
    await openPcApp(page, 'station-report', 'Informe del puesto');
    await pcWindow(page, 'station-report').locator('.pc-app-free-note').fill('Anotación táctil sin perder foco.');
    await page.locator('.computer-hud').getByRole('button', { name: 'Libreta', exact: true }).tap();
    await expect(page.locator('#free-note')).toHaveValue('Anotación táctil sin perder foco.');
    await page.getByRole('button', { name: 'Volver al ordenador', exact: true }).tap();
    await openPcApp(page, 'query-studio', 'Query Studio');
    await expect(editor).toHaveValue(sql);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.reload();
    await enterB(page);
    await expect(editor).toHaveValue(sql);
    await expect(pcWindow(page, 'query-studio').locator('.pc-app-results tbody tr')).toHaveCount(2);
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('.computer-session')).toHaveAttribute('data-single-window', 'false');
    await expect(pcWindow(page, 'query-studio').locator('.pc-window-title')).toBeInViewport();
  } finally { await context.close(); }
});

test('B sin WebGL y con almacenamiento bloqueado: trabajo en sesión sin falso guardado', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { value: function (type: string) {
      return type.includes('webgl') ? null : Reflect.apply(original, this, [type]);
    } });
  });
  await seed(page, false);
  await enterB(page);
  await screenshot(page, 'flat-no-webgl');
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Prueba', 'QuotaExceededError'); }; });
  await openPcApp(page, 'station-report', 'Informe del puesto');
  await pcWindow(page, 'station-report').locator('[data-pc-conclusion]').first().check();
  await expect(page.locator('.computer-save-status')).toHaveText('Solo en esta sesión');
  await screenshot(page, 'session-only');
  await page.locator('.computer-hud').getByRole('button', { name: 'Libreta', exact: true }).click();
  await expect(page.locator('input[name="conclusion"]:checked')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(pcWindow(page, 'station-report').locator('[data-pc-conclusion]:checked')).toHaveCount(1);
  await expect(page.locator('.computer-save-status')).toHaveText('Solo en esta sesión');
});

test('B: reiniciar desde la tablita limpia la auditoría y el escritorio', async ({ page }) => {
  await seed(page);
  await enterB(page);
  await pcWindow(page, 'query-studio').getByRole('textbox', { name: 'Consulta SQL' }).fill('Borrador para reiniciar');
  await page.locator('.computer-hud').getByRole('button', { name: 'Enlace de TI', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.keyboard.press('KeyJ');
  await expect(page.getByRole('heading', { name: 'Tablita de auditoría' })).toBeVisible();
  await page.getByRole('button', { name: 'Reiniciar partida y borrar guardado', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Conservar mi partida', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Conservar mi partida', exact: true }).click();
  await expect(page.locator('.reset-confirmation')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reiniciar partida y borrar guardado', exact: true }).click();
  await page.getByRole('button', { name: 'Borrar guardado y reiniciar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Omitir y entrar a la oficina' })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), workspaceKey)).toBe(null);
});
