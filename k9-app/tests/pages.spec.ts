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
    await page.getByRole('button', { name: /^🐕\s*Dog/ }).click();
    await page.getByRole('button', { name: /^🎓\s*Training/ }).click();
    await expect(page.getByRole('checkbox')).toHaveCount(2);
    await page.screenshot({ path: 'tests/screenshots/intake-service-selected.png', fullPage: true });
    await page.getByRole('button', { name: /Next/ }).click();
    await expect(page.getByText('Owner Information')).toBeVisible();
  });

  test('asks for pet type before showing categories', async ({ page }) => {
    await page.goto('/#intake');
    await expect(page.getByText('What kind of pet do you have?')).toBeVisible();
    await expect(page.getByRole('button', { name: /Other Pets/ })).toBeVisible();
    // Categories only appear once a pet type is chosen
    await expect(page.getByRole('button', { name: /^🎓\s*Training/ })).toHaveCount(0);
  });

  test('dog: training category pre-checks both training forms', async ({ page }) => {
    await page.goto('/#intake');
    await page.getByRole('button', { name: /^🐕\s*Dog/ }).click();
    await expect(page.getByRole('button', { name: /Walking \/ Sitting \/ Boarding/ })).toBeVisible();
    await page.getByRole('button', { name: /^🎓\s*Training/ }).click();

    const assessment = page.locator('label', { hasText: 'Dog Training Assessment' }).getByRole('checkbox');
    const application = page.locator('label', { hasText: 'Training Application Form' }).getByRole('checkbox');
    await expect(assessment).toBeChecked();
    await expect(application).toBeChecked();
    await expect(page.getByText('automatically included with your selection')).toBeVisible();

    // User can still uncheck
    await application.uncheck();
    await expect(application).not.toBeChecked();
    await expect(assessment).toBeChecked();
  });

  test('dog: walking/sitting/boarding category pre-checks its form', async ({ page }) => {
    await page.goto('/#intake');
    await page.getByRole('button', { name: /^🐕\s*Dog/ }).click();
    await page.getByRole('button', { name: /Walking \/ Sitting \/ Boarding/ }).click();
    const form = page.locator('label', { hasText: 'Walking / Sitting & Boarding Application' }).getByRole('checkbox');
    await expect(form).toBeChecked();
    await expect(page.getByText('automatically included with your selection')).toBeVisible();
  });

  test('other pets: no training, sitting/boarding without walking', async ({ page }) => {
    await page.goto('/#intake');
    await page.getByRole('button', { name: /Other Pets/ }).click();
    await expect(page.getByRole('button', { name: /^🎓\s*Training/ })).toHaveCount(0);
    await expect(page.getByText(/Walking/)).toHaveCount(0);

    await page.getByRole('button', { name: /Sitting \/ Boarding/ }).click();
    const form = page.locator('label', { hasText: 'Sitting & Boarding Application' }).getByRole('checkbox');
    await expect(form).toBeChecked();

    // Animal type is required
    await page.getByRole('button', { name: /Next/ }).click();
    await expect(page.getByText('Please tell us what type of animal').first()).toBeVisible();
    await page.getByPlaceholder('e.g., cat, guinea pig, rabbit...').fill('Guinea pig');
    await page.getByRole('button', { name: /Next/ }).click();
    await expect(page.getByText('Owner Information')).toBeVisible();
  });

  // Fills steps 1-3 for a dog with the given category; lands on step 4
  async function dogToStep4(page: import('@playwright/test').Page, category: RegExp) {
    await page.goto('/#intake');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole('button', { name: /^🐕\s*Dog/ }).click();
    await page.getByRole('button', { name: category }).click();
    await page.getByRole('button', { name: /Next/ }).click();
    await page.getByPlaceholder('John Smith').fill('Test Owner');
    await page.getByPlaceholder('(416) 555-0123').fill('4165550123');
    await page.getByPlaceholder('john@example.com').fill('test@example.com');
    await page.getByPlaceholder('123 Main Street').fill('1 Test St');
    await page.getByPlaceholder('Jane Smith').fill('Emergency Person');
    await page.getByPlaceholder('(416) 555-0199').fill('4165550000');
    await page.getByRole('button', { name: /Next/ }).click();
    await page.getByPlaceholder('Buddy').fill('Rex');
    await page.getByPlaceholder('Golden Retriever').fill('Lab');
    await page.getByPlaceholder('3 years').fill('3 years');
    await page.locator('select').first().selectOption('male');
    await page.getByRole('button', { name: /Next/ }).click();
  }

  test('dog: boarding application has no toy/food possessive question', async ({ page }) => {
    await dogToStep4(page, /Walking \/ Sitting \/ Boarding/);
    await expect(page.getByText(/attempted to bite/i)).toBeVisible();
    await expect(page.getByText(/possessive/i)).toHaveCount(0);
    // Required questions (without possessive) are enough to move on
    await page.getByText('Has your dog ever attempted to bite another dog or person?').locator('..').getByRole('button', { name: 'No' }).click();
    await page.getByText('Does your dog have problems with dogs smaller or larger than them?').locator('..').getByRole('button', { name: 'No' }).click();
    await page.getByText(/up to date on all vaccinations/).locator('..').getByRole('button', { name: 'Yes' }).click();
    await page.getByText('I have read, understand, and agree to all terms and conditions of this service agreement.').click();
    await page.getByRole('button', { name: /Next Form/ }).click();
    await expect(page.getByText('Waiver & Release Form').first()).toBeVisible();
  });

  test('dog: pet step shows "Feeding Information"; training app keeps feeding-area question', async ({ page }) => {
    await page.goto('/#intake');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole('button', { name: /^🐕\s*Dog/ }).click();
    await page.getByRole('button', { name: /^🎓\s*Training/ }).click();
    await page.getByRole('button', { name: /Next/ }).click();
    await page.getByPlaceholder('John Smith').fill('Test Owner');
    await page.getByPlaceholder('(416) 555-0123').fill('4165550123');
    await page.getByPlaceholder('john@example.com').fill('test@example.com');
    await page.getByPlaceholder('123 Main Street').fill('1 Test St');
    await page.getByPlaceholder('Jane Smith').fill('Emergency Person');
    await page.getByPlaceholder('(416) 555-0199').fill('4165550000');
    await page.getByRole('button', { name: /Next/ }).click();
    // Step 3 — pet: feeding field is labelled "Feeding Information"
    await expect(page.getByText('Feeding Information', { exact: true })).toBeVisible();
    await expect(page.getByText('Feeding Instructions', { exact: true })).toHaveCount(0);
    await expect(page.getByPlaceholder(/Food type, amount and schedule/)).toBeVisible();
    await page.getByPlaceholder('Buddy').fill('Rex');
    await page.getByPlaceholder('Golden Retriever').fill('Lab');
    await page.getByPlaceholder('3 years').fill('3 years');
    await page.locator('select').first().selectOption('male');
    await page.getByRole('button', { name: /Next/ }).click();
    // Step 4 — training application keeps the original feeding-area question
    await page.getByRole('button', { name: /Training Application/ }).click();
    await expect(page.getByText('Where is the area in your home where you feed your dog?')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., kitchen, laundry room...')).toBeVisible();
  });

  test('other pets: full flow hides dog-only questions and requires photo ID', async ({ page }) => {
    await page.goto('/#intake');
    await page.getByRole('button', { name: /Other Pets/ }).click();
    await page.getByPlaceholder('e.g., cat, guinea pig, rabbit...').fill('Guinea pig');
    await page.getByRole('button', { name: /Sitting \/ Boarding/ }).click();
    await page.getByRole('button', { name: /Next/ }).click();

    // Step 2 — owner
    await page.getByPlaceholder('John Smith').fill('Test Owner');
    await page.getByPlaceholder('(416) 555-0123').fill('4165550123');
    await page.getByPlaceholder('john@example.com').fill('test@example.com');
    await page.getByPlaceholder('123 Main Street').fill('1 Test St');
    // Emergency contact is now two required fields: name + phone
    await expect(page.getByPlaceholder('Name and phone number')).toHaveCount(0);
    await page.getByRole('button', { name: /Next/ }).click();
    await expect(page.getByText('Emergency contact name is required')).toBeVisible();
    await expect(page.getByText('Emergency contact phone is required')).toBeVisible();
    await page.getByPlaceholder('Jane Smith').fill('Someone Else');
    await page.getByPlaceholder('(416) 555-0199').fill('4165550000');
    await expect(page.getByPlaceholder('(416) 555-0199')).toHaveAttribute('type', 'tel');
    await page.getByRole('button', { name: /Next/ }).click();

    // Step 3 — pet: breed optional, "I don't know" spayed option, vet + feeding
    await expect(page.getByText('Breed (if known)')).toBeVisible();
    await page.getByPlaceholder('Buddy').fill('Peanut');
    await page.getByPlaceholder('3 years').fill('2 years');
    await page.locator('select').first().selectOption('female');
    await page.getByRole('button', { name: "I don't know" }).click();
    await page.getByPlaceholder('e.g., Dr. Jane Smith').fill('Dr. Vet');
    await page.getByPlaceholder(/Food type, amount and schedule/).fill('Pellets and hay twice a day');
    await page.getByRole('button', { name: /Next/ }).click();

    // Step 4 — dog-only questions hidden, pet wording used
    await expect(page.getByText(/toy or food possessive/i)).toHaveCount(0);
    await expect(page.getByText(/attempted to bite/i)).toHaveCount(0);
    await expect(page.getByText(/dog parks/i)).toHaveCount(0);
    await expect(page.getByText(/smaller or larger/i)).toHaveCount(0);
    await expect(page.getByText(/fight with another dog/i)).toHaveCount(0);
    // Vet info carried over from the Pet step
    await expect(page.getByPlaceholder('Name of the veterinarian')).toHaveValue('Dr. Vet');

    await page.getByText('Is your pet up to date on all vaccinations?').locator('..').getByRole('button', { name: 'Yes' }).click();
    await page.getByText('I have read, understand, and agree to all terms and conditions of this service agreement.').click();
    await page.getByRole('button', { name: /Next Form/ }).click();
    await page.locator('input[type="checkbox"]').first().check();
    await page.getByRole('button', { name: /^Next/ }).click();

    // Step 5 — sign; submit is blocked until a photo ID is added
    await expect(page.getByText('Photo ID', { exact: false }).first()).toBeVisible();
    await page.locator('input[type="checkbox"]').first().check();
    const canvas = page.locator('canvas');
    await canvas.scrollIntoViewIfNeeded();
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + 20, box.y + 40);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y + 90, { steps: 5 });
    await page.mouse.move(box.x + 200, box.y + 50, { steps: 5 });
    await page.mouse.up();

    await page.getByRole('button', { name: /Submit Application/ }).click();
    await expect(page.getByText('A photo of your ID is required')).toBeVisible();

    // 1x1 PNG
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    await page.getByTestId('id-photo-input').setInputFiles({ name: 'id.png', mimeType: 'image/png', buffer: png });
    await expect(page.getByAltText('ID preview')).toBeVisible();
    await expect(page.getByText('A photo of your ID is required')).toHaveCount(0);
    await page.screenshot({ path: 'tests/screenshots/intake-other-step5.png', fullPage: true });
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
