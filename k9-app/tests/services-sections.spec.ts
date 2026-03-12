import { test } from '@playwright/test';

test('screenshot each section of services page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/#services');
  await page.waitForTimeout(3000);

  // Scroll through entire page slowly to trigger reveals and load images
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < totalHeight; y += 400) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(1000);

  // Now take section screenshots
  // Hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tests/screenshots/svc-01-hero.png' });

  // Service cards
  const svcSection = page.locator('#services');
  if (await svcSection.count() > 0) {
    await svcSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'tests/screenshots/svc-02-cards-top.png' });
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'tests/screenshots/svc-03-cards-bottom.png' });
  }

  // K9 Difference
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tests/screenshots/svc-04-difference.png' });

  // Quote / parallax
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tests/screenshots/svc-05-quote.png' });

  // Tails of Joy
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tests/screenshots/svc-06-tails.png' });

  // CTA
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tests/screenshots/svc-07-cta.png' });
});
