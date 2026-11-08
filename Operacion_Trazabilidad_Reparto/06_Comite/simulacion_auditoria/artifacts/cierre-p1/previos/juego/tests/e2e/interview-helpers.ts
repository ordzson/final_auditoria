import { expect, type Page } from '@playwright/test';
import { baseQuestions } from '../../src/data/interview';

export async function selectInterviewSource(page: Page, sourceId: string): Promise<void> {
  const question = baseQuestions.find((item) => item.sourceId === sourceId);
  if (!question) throw new Error(`La entrevista no ofrece ${sourceId}`);
  const topics = page.locator('[data-action="topics"]');
  if (await topics.count()) await topics.click();
  await page.locator(`[data-topic="${question.reviewId}"]`).click();
  await page.locator(`[data-question="${question.id}"]`).click();
  await expect(page.locator(`[data-action="source"][data-source="${sourceId}"]`)).toBeVisible();
}
