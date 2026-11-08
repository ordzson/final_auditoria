import { test, expect } from '@playwright/test';

test('reproduce la voz local, cambia de frase y detiene el audio al salir', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({
    schemaVersion: 2, introSeen: true, settings: { flatMode: true },
  })));
  await page.goto('/');
  await page.locator('[data-flat="liaison"]').click();
  const voice = page.locator('.dialogue-voice audio');
  await expect(voice).toHaveAttribute('src', /frase_01.mp3$/);
  await expect.poll(() => voice.evaluate((audio: HTMLAudioElement) => audio.duration)).toBeGreaterThan(0);
  await page.locator('[data-action="topic"][data-topic="AU-01"]').click();
  await expect(voice).toHaveAttribute('src', /frase_04.mp3$/);
  await page.locator('[data-question="P-IDENTIDAD"]').click();
  await expect(voice).toHaveAttribute('src', /frase_05.mp3$/);
  await expect.poll(() => voice.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0);
  await voice.evaluate((audio: HTMLAudioElement) => { audio.muted = true; });
  await page.locator('[data-question="R-IDENTIDAD"]').click();
  await expect(voice).toHaveAttribute('src', /frase_06.mp3$/);
  expect(await voice.evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(true);
  await page.locator('[data-action="repeat-voice"]').click();
  await expect.poll(() => voice.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(false);
  await page.screenshot({ path: 'artifacts/interview-audio/desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/interview-audio/mobile.png' });
  const bounds = await voice.boundingBox();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  const handle = await voice.elementHandle();
  await page.locator('[data-action="topics"]').click();
  await expect(voice).toHaveAttribute('src', /frase_03.mp3$/);
  await page.locator('.dialogue-exit').click();
  expect(await handle!.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.locator('[data-flat="liaison"]').click();
  await expect(voice).toHaveAttribute('src', /frase_02.mp3$/);
  expect(await voice.evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(true);
});

test('los 29 MP3 se pueden cargar y decodificar', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rednova.auditoria.oficina.v2', JSON.stringify({
    schemaVersion: 2, introSeen: true, settings: { flatMode: true },
  })));
  await page.goto('/');
  const durations = await page.evaluate(async () => Promise.all(Array.from({ length: 29 }, (_, index) => new Promise<number>((resolve, reject) => {
    const audio = new Audio(`/audio/enlace-ti/frase_${String(index + 1).padStart(2, '0')}.mp3`);
    audio.onloadedmetadata = () => resolve(audio.duration);
    audio.onerror = () => reject(new Error(`No se pudo cargar la frase ${index + 1}`));
    audio.load();
  }))));
  expect(durations).toHaveLength(29);
  for (const duration of durations) expect(duration).toBeGreaterThan(0);
});
