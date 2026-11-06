import { expect, type Page } from '@playwright/test';

export const pcWindow = (page: Page, id: string) => page.locator(`.pc-window[data-app-id="${id}"]`);

export async function openPcApp(page: Page, id: string, title: string): Promise<void> {
  await page.locator('.pc-start').click();
  await page.locator('.pc-start-menu').getByRole('button', { name: title, exact: true }).click();
  await expect(pcWindow(page, id)).toBeVisible();
  await expect(pcWindow(page, id)).toHaveClass(/is-active/);
}

export async function usePcSource(page: Page, sourceId: string): Promise<void> {
  await openPcApp(page, 'local-dossier', 'Expediente local');
  const dossier = pcWindow(page, 'local-dossier');
  await dossier.locator(`[data-pc-open="${sourceId}"]`).click();
  await expect(dossier.locator('.pc-app-document')).toHaveAttribute('data-document', sourceId);
  const use = dossier.locator('[data-pc-viewer="use"]');
  if (await use.isEnabled()) await use.click();
}
