import { test } from '@playwright/test';

test('services hero screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/#services');
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/screenshots/hero-services.png' });
});

test('landing hero screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tests/screenshots/hero-landing.png' });
});
