import { test, expect } from '@playwright/test';

// ── Landing Page ──────────────────────────────────────────────
test.describe('Landing Page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/K9/i);
    // Check nav is visible
    const nav = page.locator('nav');
    await expect(nav.first()).toBeVisible();
    // Hero section should be present
    await expect(page.locator('text=/movement|k9|dog/i').first()).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/landing.png', fullPage: true });
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    // Check nav links exist
    const navLinks = page.locator('nav a, nav button');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ── Services Page ─────────────────────────────────────────────
test.describe('Services Page', () => {
  test('loads and shows services content', async ({ page }) => {
    await page.goto('/#services');
    await page.waitForTimeout(500);
    // Should show service-related content
    await expect(page.locator('text=/walk|train|sit|board|service/i').first()).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/services.png', fullPage: true });
  });
});

// ── About Page ────────────────────────────────────────────────
test.describe('About Page', () => {
  test('loads and shows about content', async ({ page }) => {
    await page.goto('/#about');
    await page.waitForTimeout(500);
    await expect(page.locator('text=/story|about|pack|team|mission/i').first()).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/about.png', fullPage: true });
  });
});

// ── Contact Page ──────────────────────────────────────────────
test.describe('Contact Page', () => {
  test('loads and shows contact form', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForTimeout(500);
    // Contact form should have input fields
    const inputs = page.locator('input, textarea, select');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(2);
    await page.screenshot({ path: 'tests/screenshots/contact.png', fullPage: true });
  });

  test('form fields are interactive', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForTimeout(500);
    // Try filling name field
    const nameInput = page.locator('input[type="text"], input[name*="name"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
      await expect(nameInput).toHaveValue('Test User');
    }
  });
});

// ── Intake App (Wizard) ───────────────────────────────────────
test.describe('Intake App', () => {
  test('loads step 1 - service selection', async ({ page }) => {
    await page.goto('/#intake');
    await page.waitForTimeout(500);
    // Should show service selection
    await expect(page.locator('text=/service|select|category/i').first()).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/intake-step1.png', fullPage: true });
  });

  test('can select a service and proceed', async ({ page }) => {
    await page.goto('/#intake');
    await page.waitForTimeout(500);

    // Click on a service category or service option
    const serviceOption = page.locator('text=/training|walking|boarding|sitting/i').first();
    if (await serviceOption.isVisible()) {
      await serviceOption.click();
      await page.waitForTimeout(300);
    }

    // Look for checkboxes or clickable service items
    const clickable = page.locator('[role="button"], button, [class*="cursor-pointer"], label').filter({ hasText: /training|walking|assessment|waiver/i });
    const count = await clickable.count();
    if (count > 0) {
      await clickable.first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({ path: 'tests/screenshots/intake-service-selected.png', fullPage: true });
  });
});

// ── Visual / Layout Checks ────────────────────────────────────
test.describe('Layout & Design Checks', () => {
  test('no horizontal overflow on desktop', async ({ page }) => {
    await page.goto('/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance
  });

  test('no horizontal overflow on services', async ({ page }) => {
    await page.goto('/#services');
    await page.waitForTimeout(500);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('no horizontal overflow on about', async ({ page }) => {
    await page.goto('/#about');
    await page.waitForTimeout(500);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('no horizontal overflow on contact', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForTimeout(500);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('no horizontal overflow on intake', async ({ page }) => {
    await page.goto('/#intake');
    await page.waitForTimeout(500);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('no console errors on landing page', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForTimeout(1000);
    // Filter out known non-critical errors (like favicon)
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('404'));
    expect(critical).toEqual([]);
  });

  test('no broken images on landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src);
    });
    expect(brokenImages).toEqual([]);
  });

  test('footer is present on all pages', async ({ page }) => {
    for (const route of ['/', '/#services', '/#about', '/#contact']) {
      await page.goto(route);
      await page.waitForTimeout(500);
      const footer = page.locator('footer');
      await expect(footer.first()).toBeVisible();
    }
  });
});
