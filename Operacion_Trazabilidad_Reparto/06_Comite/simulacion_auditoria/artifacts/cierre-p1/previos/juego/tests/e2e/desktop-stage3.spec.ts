import { test, expect, type Page } from '@playwright/test';
import { openPcApp, pcWindow } from './desktop-helpers';

const auditKey = 'rednova.auditoria.oficina.v2';

async function seed(page: Page, flatMode = true): Promise<void> {
  await page.addInitScript(({ key, flatMode }) => {
    localStorage.setItem(key, JSON.stringify({
      schemaVersion: 2, introSeen: true, clipboardReceived: true,
      settings: { flatMode, reducedMotion: true },
      pose: { x: -3.02, z: 3.85, yaw: 0, pitch: 0 },
    }));
  }, { key: auditKey, flatMode });
  await page.goto('/');
}

async function enterFlat(page: Page, station: string): Promise<void> {
  await seed(page);
  await page.locator(`[data-flat="${station}"]`).click();
  await expect(page.locator('.computer-session')).toBeVisible();
}

const stations = [
  { id: 'accesos', initial: 'session-viewer', initialTitle: 'Visor de sesiones', other: 'account-directory', otherTitle: 'Directorio de cuentas', wallpaper: 'xp-bliss.jpg', source: 'E-01' },
  { id: 'crm_cambios', initial: 'order-history', initialTitle: 'CRM · Historial de órdenes', other: 'change-manager', otherTitle: 'Gestor de cambios', wallpaper: 'xp-isla-tropical.jpg', source: 'E-06' },
  { id: 'siem', initial: 'event-desk', initialTitle: 'Event Desk', other: 'time-tracker', otherTitle: 'Visor de seguimiento y relojes', wallpaper: 'stonehenge.jpg', source: 'E-07' },
  { id: 'respaldos', initial: 'recovery-console', initialTitle: 'Recovery Console', other: 'backup-manager', otherTitle: 'Gestor de respaldos', wallpaper: 'camino-otonal.jpg', source: 'E-08' },
  { id: 'mesa_auditor', initial: 'file-explorer', initialTitle: 'Explorador del expediente', other: 'clock-comparator', otherTitle: 'Comparador de relojes', wallpaper: 'duna-roja-luna.jpg', source: 'META-TIEMPO' },
];

for (const station of stations) {
  test(`etapa 3 · ${station.id}: dos programas propios, estado y recursos locales`, async ({ page }) => {
    const errors: string[] = [];
    const failedResources: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => { if (response.status() >= 400) failedResources.push(response.url()); });
    await enterFlat(page, station.id);
    const initial = pcWindow(page, station.initial);
    await expect(initial).toBeVisible();
    await expect(page.locator('.pc-desktop-area')).toHaveCSS('background-image', new RegExp(station.wallpaper.replace('.', '\\.')));
    await expect(page.locator('.computer-desktop')).toHaveAttribute('data-theme', station.id === 'respaldos' ? 'server-classic' : 'xp');
    await openPcApp(page, station.other, station.otherTitle);
    const other = pcWindow(page, station.other);
    await expect(initial).toBeVisible();
    await other.locator(`[data-pc-open="${station.source}"]`).click();
    await expect(other.locator('.pc-app-document')).toHaveAttribute('data-document', station.source);
    await other.getByRole('button', { name: `Minimizar ${station.otherTitle}`, exact: true }).click();
    await expect(other).toBeHidden();
    await page.locator(`.pc-task[data-app-id="${station.other}"]`).click();
    await expect(other.locator('.pc-app-document')).toHaveAttribute('data-document', station.source);
    await openPcApp(page, station.initial, station.initialTitle);
    await expect(initial).toHaveClass(/is-active/);
    if (station.id === 'crm_cambios') {
      await openPcApp(page, station.other, station.otherTitle);
      await expect(other.locator('[data-pc-open^="DECL-"]')).toHaveCount(0);
    }
    if (station.id === 'respaldos') {
      await openPcApp(page, station.other, station.otherTitle);
      await expect(other.locator('[data-pc-open="DECL-07"]')).toHaveCount(0);
      await expect(other.locator('.pc-app-introduction')).toContainText('no acredita');
    }
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `artifacts/desktop-stage3/${station.id}.png`, fullPage: true });
    expect(errors).toEqual([]);
    expect(failedResources).toEqual([]);
  });
}

test('etapa 3 · Recovery Console móvil conserva controles y lectura dentro del monitor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterFlat(page, 'respaldos');
  const recovery = pcWindow(page, 'recovery-console');
  await recovery.locator('[data-pc-recovery-step="3"]').click();
  await expect(recovery.locator('.pc-app-recovery-snapshot')).toContainText('Escritura restablecida');
  await expect(recovery.getByRole('slider', { name: 'Momento de la revisión' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.computer-monitor').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/desktop-stage3/recovery-mobile.png', fullPage: true });
});

test('etapa 3 · monitor físico junto al rack abre Server sin atravesar muebles', async ({ page }) => {
  const errors: string[] = [];
  const failedResources: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) failedResources.push(response.url()); });
  await page.setViewportSize({ width: 1280, height: 720 });
  await seed(page, false);
  await page.locator('#enter-office').click();
  await expect(page.locator('#interaction-prompt')).toContainText('E · Respaldo y recuperación');
  await expect.poll(() => page.evaluate(() => performance.getEntriesByType('resource').some((entry) => entry.name.endsWith('/models/rack-monitor/scene.gltf')))).toBe(true);
  await page.screenshot({ path: 'artifacts/desktop-stage3/rack-monitor.png', fullPage: true });
  await page.keyboard.press('KeyE');
  await expect(pcWindow(page, 'recovery-console')).toBeVisible();
  await expect(page.locator('.computer-desktop')).toHaveAttribute('data-theme', 'server-classic');
  await page.screenshot({ path: 'artifacts/desktop-stage3/server-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
  expect(failedResources).toEqual([]);
});
