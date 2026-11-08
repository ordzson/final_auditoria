import { openPcApp, pcWindow } from './desktop-helpers';
import { test, expect, type Page } from '@playwright/test';

async function enterFlat(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({
      schemaVersion: 2,
      introSeen: true,
      settings: { flatMode: true },
    }));
  });
  await page.goto('/');
  await expect(page.locator('#flat-office')).toBeVisible();
}

async function seek(page: Page, time: number): Promise<void> {
  await page.locator('#intro-timeline').evaluate((input: HTMLInputElement, value) => {
    input.value = String(value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, time);
}

test.beforeEach(async ({ page }) => {
  page.setDefaultTimeout(15_000);
});

for (const [width, height] of [[1280, 720], [1920, 1080]]) {
  test(`D · apertura legible y encuadrada a ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
    await seek(page, 64);
    await expect(page.locator('#ransom-note')).toBeVisible();
    await page.evaluate(async () => { await document.fonts.ready; });
    const metrics = await page.evaluate(() => {
      const size = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize);
      const rect = (selector: string) => {
        const box = document.querySelector(selector)!.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
      };
      return {
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        hour: size('#intro-time'),
        message: size('#intro-message'),
        provenance: size('.intro-provenance'),
        controls: size('.intro-controls'),
        messageBox: rect('.intro-message-wrap'),
        noteBox: rect('#ransom-note'),
        controlsBox: rect('.intro-controls'),
        messageClipped: document.querySelector('.intro-message-wrap')!.scrollHeight > document.querySelector('.intro-message-wrap')!.clientHeight + 2,
        noteClipped: document.querySelector('#ransom-note')!.scrollHeight > document.querySelector('#ransom-note')!.clientHeight + 2,
      };
    });
    expect(metrics.horizontalOverflow).toBe(false);
    expect(metrics.hour).toBeGreaterThanOrEqual(40);
    expect(metrics.message).toBeGreaterThanOrEqual(24);
    expect(metrics.provenance).toBeGreaterThanOrEqual(20);
    expect(metrics.controls).toBeGreaterThanOrEqual(20);
    const overlaps = metrics.messageBox.left < metrics.noteBox.right
      && metrics.messageBox.right > metrics.noteBox.left
      && metrics.messageBox.top < metrics.noteBox.bottom
      && metrics.messageBox.bottom > metrics.noteBox.top;
    expect(overlaps).toBe(false);
    expect(metrics.messageBox.bottom).toBeLessThan(metrics.controlsBox.top);
    expect(metrics.noteBox.bottom).toBeLessThan(metrics.controlsBox.top);
    expect(metrics.messageClipped).toBe(false);
    expect(metrics.noteClipped).toBe(false);
    await page.screenshot({ path: `artifacts/screenshots/d-apertura-${width}.png` });
    await page.locator('.settings-menu > summary').click();
    await page.locator('[data-setting="projector"]').check();
    await expect(page.locator('#app')).toHaveClass(/projector/);
    expect(Number.parseFloat(await page.locator('#intro-time').evaluate((element) => getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(60);
  });
}

test('D · acceso plano móvil, teclado, J y Esc', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enterFlat(page);
  await expect(page.locator('.flat-station')).toHaveCount(6);
  await expect(page.locator('[data-setting="reducedMotion"]')).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('[data-flat="accesos"]').click();
  await page.locator('.pc-start').click();
  await page.locator('.pc-start-menu').getByRole('button', { name: 'Directorio de cuentas', exact: true }).click();
  await page.locator('.pc-window.is-active [data-pc-open="E-01"]').click();
  await expect(page.locator('.pc-window.is-active .pc-app-document')).toHaveAttribute('data-document', 'E-01');
  await page.keyboard.press('Escape');
  await expect(page.locator('#panel-dialog')).not.toBeVisible();
  await page.keyboard.press('KeyJ');
  await expect(page.locator('#notebook-dialog')).not.toBeVisible();
  await expect(page.locator('#toast')).toContainText('Primero acércate');
  await page.locator('[data-flat="liaison"]').click();
  await expect(page.locator('#panel-dialog h2')).toHaveText('Enlace de TI · entrevista');
  await page.keyboard.press('Escape');
  await page.keyboard.press('KeyJ');
  await expect(page.locator('#notebook-dialog')).toBeVisible();
  await page.keyboard.press('KeyJ');
  await expect(page.locator('#notebook-dialog')).not.toBeVisible();
  await page.locator('[data-flat="crm_cambios"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.pc-window[data-app-id="order-history"] .pc-window-title')).toHaveText('CRM · Historial de órdenes');
  await page.keyboard.press('Escape');
  await page.screenshot({ path: 'artifacts/screenshots/d-movil-plano.png', fullPage: true });
});

test('D · silencio, aviso opcional y reducción de movimiento', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeAudioContext = window.AudioContext;
    let audioStarts = 0;
    window.AudioContext = new Proxy(NativeAudioContext, {
      construct(target, args) {
        audioStarts += 1;
        return Reflect.construct(target, args);
      },
    });
    Object.defineProperty(window, '__audioStarts', { get: () => audioStarts });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  await expect(page.locator('[data-action="audio"]')).toHaveText('Sin sonido');
  await seek(page, 52.8);
  await page.locator('[data-action="speed"]').click();
  await page.locator('[data-action="speed"]').click();
  await page.getByRole('button', { name: 'Reanudar reconstrucción' }).click();
  await expect.poll(() => page.locator('#intro-timeline').inputValue().then(Number)).toBeGreaterThan(54);
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  expect(await page.evaluate(() => (window as unknown as { __audioStarts: number }).__audioStarts)).toBe(0);
  await page.locator('.settings-menu > summary').click();
  await page.locator('[data-setting="reducedMotion"]').check();
  await expect(page.locator('#app')).toHaveClass(/reduced-motion/);
  await page.locator('.settings-menu > summary').click();
  await page.locator('[data-setting="audioEnabled"]').check();
  await page.locator('[data-action="replay"]').click();
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  await seek(page, 52.8);
  await page.getByRole('button', { name: 'Reanudar reconstrucción' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __audioStarts: number }).__audioStarts)).toBe(1);
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  const paused = await page.locator('#intro-timeline').inputValue();
  await page.waitForTimeout(300);
  await expect(page.locator('#intro-timeline')).toHaveValue(paused);
  await expect(page.locator('#intro-message')).toBeVisible();
});

test('D · WebGL denegado conserva los seis accesos y la entrevista', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: function (type: string) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
        return Reflect.apply(original, this, [type]);
      },
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Omitir y entrar a la oficina' }).click();
  await expect(page.locator('#flat-office')).toBeVisible();
  await expect(page.locator('.flat-station')).toHaveCount(6);
  await page.locator('[data-flat="liaison"]').click();
  await expect(page.locator('#panel-dialog h2')).toHaveText('Enlace de TI · entrevista');
  await page.keyboard.press('Escape');
  await page.locator('[data-flat="respaldos"]').click();
  await expect(page.locator('.pc-window[data-app-id="recovery-console"]')).toBeVisible();
  await expect(page.locator('.computer-desktop')).toHaveAttribute('data-theme', 'server-classic');
});

test('D · bloqueo del puntero denegado activa la alternativa completa', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'requestPointerLock', {
      configurable: true,
      value: () => Promise.reject(new DOMException('Bloqueado para la prueba', 'NotAllowedError')),
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Omitir y entrar a la oficina' }).click();
  await page.locator('#enter-office').click();
  await expect(page.locator('#flat-office')).toBeVisible();
  await expect(page.locator('#toast')).toContainText('toda la revisión sigue disponible');
  await expect(page.locator('.flat-station')).toHaveCount(6);
  for (const station of ['accesos', 'sql_red', 'crm_cambios', 'siem', 'respaldos', 'mesa_auditor']) {
    await page.locator(`[data-flat="${station}"]`).click();
    await expect(page.locator('#panel-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  }
});

test('D · inicio local sin acceso externo y revisión con el contexto offline', async ({ page, context }) => {
  const externalRequests: string[] = [];
  const localOrigin = new URL(test.info().project.use.baseURL as string).origin;
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (!url.startsWith('http') || url.startsWith(`${localOrigin}/`)) {
      await route.continue();
      return;
    }
    externalRequests.push(url);
    await route.abort();
  });
  const requiredModels = [
    'rack.glb', 'filing-cabinet.glb', 'desk.glb', 'chair.glb', 'lamp.glb',
    'office-props/books.glb', 'office-props/cardboardBoxClosed.glb', 'office-props/cardboardBoxOpen.glb',
    'office-props/computerKeyboard.glb', 'office-props/computerMouse.glb', 'office-props/radio.glb',
    'fbi-agent/scene.gltf', 'rack-monitor/scene.gltf',
  ].map((path) => `/models/${path}`);
  let offline = false;
  const loaded = new Set<string>();
  const failed: string[] = [];
  page.on('response', (response) => {
    if (!response.ok()) failed.push(`${response.status()} ${response.url()}`);
    else loaded.add(new URL(response.url()).pathname);
  });
  page.on('requestfailed', (request) => { if (!offline) failed.push(request.url()); });
  page.on('console', (message) => {
    if (message.type() === 'warning' && message.text().includes('No se pudo cargar el modelo')) failed.push(message.text());
  });
  await page.goto('/');
  await expect.poll(() => requiredModels.filter((path) => !loaded.has(path))).toEqual([]);
  await page.getByRole('button', { name: 'Pausar reconstrucción' }).click();
  await page.getByRole('button', { name: 'Omitir y entrar a la oficina' }).click();
  await page.locator('.settings-menu > summary').click();
  await page.locator('[data-setting="flatMode"]').check();
  offline = true;
  await context.setOffline(true);
  await expect(page.locator('#flat-office')).toBeVisible();
  await page.locator('[data-flat="liaison"]').click();
  await page.keyboard.press('Escape');
  for (const [station, source] of [['accesos', 'E-02'], ['sql_red', 'E-03'], ['crm_cambios', 'E-05'], ['siem', 'E-07'], ['respaldos', 'E-08'], ['mesa_auditor', 'META-CUSTODIA']]) {
    await page.locator(`[data-flat="${station}"]`).click();
    await openPcApp(page, 'local-dossier', 'Expediente local');
    const dossier = pcWindow(page, 'local-dossier');
    await dossier.locator(`[data-pc-open="${source}"]`).click();
    await expect(dossier.locator('.pc-app-document')).toHaveAttribute('data-document', source);
    await page.keyboard.press('Escape');
  }
  expect(failed).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});
