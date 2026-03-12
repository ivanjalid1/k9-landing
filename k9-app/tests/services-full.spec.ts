import { test } from '@playwright/test';

test('services page full screenshot', async ({ page }) => {
  await page.goto('/#services');
  // Wait for images to load
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/screenshots/services-full.png', fullPage: true });
});
