import { test } from '@playwright/test';

test('mobile heroes + contact + footer', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  // Landing hero
  await page.goto('/');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'tests/screenshots/mobile-hero-landing.png' });

  // Services hero
  await page.goto('/#services');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'tests/screenshots/mobile-hero-services.png' });

  // About hero
  await page.goto('/#about');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'tests/screenshots/mobile-hero-about.png' });

  // Contact
  await page.goto('/#contact');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'tests/screenshots/mobile-contact.png' });

  // Footer (scroll to bottom on landing)
  await page.goto('/');
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/screenshots/mobile-footer.png' });
});
