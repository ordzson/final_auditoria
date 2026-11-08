import { test, expect, type Page } from '@playwright/test';

async function enterInterview(page: Page, flatMode = true): Promise<void> {
  await page.addInitScript((flat) => {
    localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({
      schemaVersion: 2, introSeen: true, settings: { flatMode: flat, reducedMotion: true },
      pose: { x: 0.8, z: 2.2, yaw: 0, pitch: 0.04 },
    }));
  }, flatMode);
  await page.goto('/');
  if (flatMode) await page.locator('[data-flat="liaison"]').click();
  else {
    await page.locator('#enter-office').click();
    await expect(page.locator('#interaction-prompt')).toContainText('Recibir la tablita');
    await page.keyboard.press('KeyE');
  }
}

test('conversación por teclado: respuestas por turno, ramas y temas ya hablados', async ({ page }) => {
  await enterInterview(page);
  await expect(page.locator('.dialogue-response')).toContainText('Hola.');
  await expect(page.locator('[data-action="source"]')).toHaveCount(0);
  const initial = await page.evaluate(() => JSON.parse(localStorage.getItem('rednova.auditoria.oficina.v2')!).assessments);
  await expect(page.locator('[data-topic="AU-01"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-question="R-IDENTIDAD"]')).toHaveCount(0);
  await expect(page.locator('.dialogue-response')).not.toContainText('No puedo darte un nombre.');
  await page.keyboard.press('Enter');
  await expect(page.locator('.dialogue-response')).toContainText('No puedo darte un nombre.');
  await expect(page.locator('[data-question="P-IDENTIDAD"]')).toHaveClass(/is-discussed/);
  await expect(page.locator('[data-question="R-IDENTIDAD"]')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-question="P-POLITICA"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-question="P-POLITICA"]')).toBeFocused();
  await page.locator('[data-action="topics"]').click();
  await expect(page.locator('[data-topic="AU-01"]')).toHaveClass(/is-discussed/);
  await expect(page.locator('[data-topic="AU-01"]')).toBeFocused();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('rednova.auditoria.oficina.v2')!).assessments)).toEqual(initial);
  await page.keyboard.press('End');
  await expect(page.locator('[data-choice="goodbye"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Cerrar entrevista', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('[data-choice="goodbye"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#panel-dialog')).not.toBeVisible();
});

test('consultar documentos conserva el turno y desbloquea solo las repreguntas pertinentes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await enterInterview(page);
  await page.locator('[data-topic="AU-02"]').click();
  await page.locator('[data-question="P-FUJO"]').click();
  await expect(page.locator('[data-question="R-FLUJO"]')).toHaveCount(0);
  await page.locator('[data-action="source"]').click();
  await expect(page.locator('.source-document')).toHaveAttribute('data-document', 'DECL-05');
  await page.getByRole('button', { name: 'Volver a la conversación' }).click();
  await expect(page.locator('.dialogue-response')).toContainText('Eso todavía no lo sabemos.');
  await expect(page.locator('[data-question="P-FUJO"]')).toHaveClass(/is-discussed/);
  await expect(page.locator('[data-question="R-FLUJO"]')).toHaveCount(0);
  await page.locator('[data-question="R-VOLUMEN"]').click();
  await page.locator('[data-action="source"]').click();
  await expect(page.locator('.source-document')).toHaveAttribute('data-document', 'E-04');
  await page.getByRole('button', { name: 'Volver a la conversación' }).click();
  await page.locator('[data-question="R-FLUJO"]').click();
  await expect(page.locator('.dialogue-response')).toContainText('No todavía.');
  await page.keyboard.press('Escape');
  await page.locator('[data-flat="liaison"]').click();
  await expect(page.locator('.dialogue-response')).toContainText('No todavía.');
  expect(errors).toEqual([]);
});

for (const [width, height] of [[1280, 720], [1920, 1080], [390, 844]]) {
  test(`entrevista legible a ${width}×${height}, con modo proyector`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await enterInterview(page, width < 760);
    await page.locator('[data-topic="AU-03"]').click();
    await page.locator('[data-question="P-APROBACION"]').click();
    await expect(page.locator('.dialogue-response blockquote')).toBeVisible();
    expect(await page.locator('#panel-dialog').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/interview/entrevista-${width}.png` });
    await page.keyboard.press('Escape');
    await page.locator('.settings-menu > summary').click();
    await page.locator('[data-setting="projector"]').check();
    if (width < 760) await page.locator('[data-flat="liaison"]').click();
    else {
      await page.locator('#enter-office').click();
      await expect(page.locator('#interaction-prompt')).toContainText('Hablar con el enlace');
      await page.keyboard.press('KeyE');
    }
    await expect(page.locator('.dialogue-response blockquote')).toBeVisible();
    expect(await page.locator('#panel-dialog').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.locator('[data-action="topics"]').click();
    await page.locator('[data-choice="goodbye"]').click();
    await expect(page.locator('#panel-dialog')).not.toBeVisible();
  });
}
