// @ts-check
const { test, expect } = require('@playwright/test');

const pages = [
  { path: '/index.html', title: 'Royal Curtain House' },
  { path: '/collections.html', title: 'Collections' },
  { path: '/services.html', title: 'Services' },
  { path: '/contact.html', title: 'Contact' },
];

test.describe('1. Universal Page Quality & Console Integrity', () => {
  for (const p of pages) {
    test(`Page ${p.path} loads with zero console errors and 200 OK`, async ({ page }) => {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(p.path);
      expect(response.status()).toBe(200);
      await expect(page).toHaveTitle(new RegExp(p.title, 'i'));

      // Check Three.js Liquid Canvas presence
      const canvas = page.locator('#liquidCanvas');
      await expect(canvas).toBeAttached();

      // Ensure no JavaScript console errors
      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe('2. Sharp Tone Design (Strict 0px Border Radii)', () => {
  test('Key UI components strictly exhibit 0px border radius', async ({ page }) => {
    await page.goto('/index.html');

    // Test buttons, cards, inputs, badges
    const selectors = [
      '.btn-primary',
      '.product-card',
      '.calc-form-card',
      '.calc-result-card',
      '.calc-input',
      '.showroom-card',
      '.hero-tag'
    ];

    for (const sel of selectors) {
      const el = page.locator(sel).first();
      await expect(el).toBeVisible();
      const radius = await el.evaluate((node) => {
        const style = window.getComputedStyle(node);
        return {
          tl: style.borderTopLeftRadius,
          tr: style.borderTopRightRadius,
          bl: style.borderBottomLeftRadius,
          br: style.borderBottomRightRadius,
        };
      });

      expect(radius.tl).toBe('0px');
      expect(radius.tr).toBe('0px');
      expect(radius.bl).toBe('0px');
      expect(radius.br).toBe('0px');
    }
  });
});

test.describe('3. Minimalist Liquid Glass Theme & Border Minimization', () => {
  test('Cards feature frosted glass translucency and no harsh solid borders', async ({ page }) => {
    await page.goto('/index.html');

    // Test product card glass properties
    const card = page.locator('.product-card').first();
    await expect(card).toBeVisible();

    const glassProps = await card.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return {
        backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
        borderStyle: style.borderStyle,
        boxShadow: style.boxShadow,
      };
    });

    // Verify glass blur is present
    expect(glassProps.backdropFilter).toContain('blur');

    // Verify solid 1px borders are removed (borderStyle is none)
    expect(glassProps.borderStyle).toBe('none');

    // Verify specular glass reflection shadow is present
    expect(glassProps.boxShadow).not.toBe('none');
  });

  test('Navbar exhibits frosted glass backdrop', async ({ page }) => {
    await page.goto('/index.html');
    const navbar = page.locator('.navbar');
    const navFilter = await navbar.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return style.backdropFilter || style.webkitBackdropFilter;
    });
    expect(navFilter).toContain('blur');
  });
});

test.describe('4. Scroll Reveal Animations (Left and Right Entrances)', () => {
  test('Left and right reveal elements are marked and positioned properly', async ({ page }) => {
    await page.goto('/index.html');

    const leftElements = page.locator('[data-reveal="slide-left"]');
    const rightElements = page.locator('[data-reveal="slide-right"]');

    expect(await leftElements.count()).toBeGreaterThanOrEqual(2);
    expect(await rightElements.count()).toBeGreaterThanOrEqual(2);

    // Verify hero content has slide-left and hero visual has slide-right
    await expect(page.locator('.hero-content')).toHaveAttribute('data-reveal', 'slide-left');
    await expect(page.locator('.hero-visual')).toHaveAttribute('data-reveal', 'slide-right');
  });
});

test.describe('5. Responsive Breakpoint: 1156px Hamburger Mode', () => {
  test('Navbar collapses to hamburger at exactly 1156px and opens drawer', async ({ page }) => {
    await page.setViewportSize({ width: 1156, height: 1278 });
    await page.goto('/index.html');

    const navToggle = page.locator('#navToggle');
    const navLinks = page.locator('#navLinks');

    // Hamburger button should be visible
    await expect(navToggle).toBeVisible();

    // Click hamburger to open drawer
    await navToggle.click();
    await expect(navLinks).toHaveClass(/open/);

    // Click again to close
    await navToggle.click();
    await expect(navLinks).not.toHaveClass(/open/);
  });

  test('Navbar displays full horizontal links at desktop (> 1156px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');

    const navToggle = page.locator('#navToggle');
    await expect(navToggle).toBeHidden();
  });
});

test.describe('6. Compact Mobile Header: < 422px Theme Toggle Relocation', () => {
  test('Under 422px, header theme toggle is hidden and drawer theme item is active', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');

    const headerToggle = page.locator('#themeToggle');
    const drawerThemeItem = page.locator('.drawer-theme-item');

    // In top nav bar, theme toggle should be hidden
    await expect(headerToggle).toBeHidden();

    // Inside drawer, drawer-theme-item should be display: block
    await expect(drawerThemeItem).toBeVisible();
  });
});

test.describe('7. Architectural Dark & Light Mode System', () => {
  test('Theme switcher toggles obsidian dark mode and persists across navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');

    const html = page.locator('html');
    const themeBtn = page.locator('#themeToggle');

    // Initial theme is light
    await expect(html).not.toHaveAttribute('data-theme', 'dark');

    // Click to switch to dark mode
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Navigate to collections page and verify persistence
    await page.goto('/collections.html');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Click again to return to light theme
    await page.locator('#themeToggle').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('8. Interactive Curtain Sizing Engine (index.html)', () => {
  test('Sizing inputs dynamically recalculate fabric meters and update WhatsApp dispatch', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');

    const widthInput = page.locator('#calcWidth');
    const heightInput = page.locator('#calcHeight');
    const fabricResult = page.locator('#calcResultFabric');
    const whatsappBtn = page.locator('#calcWhatsappBtn');

    // Default 60 x 84 fabric
    const initialMeters = await fabricResult.textContent();

    // Update width to 120 inches
    await widthInput.fill('120');
    await widthInput.dispatchEvent('input');

    const updatedMeters = await fabricResult.textContent();
    expect(updatedMeters).not.toBe(initialMeters);

    // Verify WhatsApp button includes encoded Matale branch inquiry
    const href = await whatsappBtn.getAttribute('href');
    expect(href).toContain('wa.me/94772273838');
    expect(href).toContain('Matale');
  });
});

test.describe('9. Collections Catalog Category Filter', () => {
  test('Clicking filter pills toggles product cards accurately', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/collections.html');

    const waveTab = page.locator('.filter-tab[data-filter="wave"]');
    const allTab = page.locator('.filter-tab[data-filter="all"]');

    // Click wave filter
    await waveTab.click();
    await expect(waveTab).toHaveClass(/active/);

    // Only wave cards should be visible
    const visibleCards = page.locator('.product-card:not(.hidden)');
    const hiddenCards = page.locator('.product-card.hidden');

    expect(await visibleCards.count()).toBeGreaterThan(0);
    expect(await hiddenCards.count()).toBeGreaterThan(0);

    // Click all filter
    await allTab.click();
    await expect(page.locator('.product-card.hidden')).toHaveCount(0);
  });
});

test.describe('10. Contact Showroom Booking Form', () => {
  test('Form validation and WhatsApp link generation on submission', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/contact.html');

    await page.fill('#contactName', 'Kasun Perera');
    await page.fill('#contactPhone', '+94 77 987 6543');
    await page.fill('#contactCity', 'Matale Town');
    await page.fill('#contactMessage', '3 Large Living Room Windows');

    // Intercept window.open
    let openedUrl = '';
    await page.exposeFunction('mockWindowOpen', (url) => { openedUrl = url; });
    await page.evaluate(() => {
      window.open = window['mockWindowOpen'];
    });

    await page.click('button[type="submit"]');

    // Check dispatched URL
    expect(openedUrl).toContain('94772273838');
    expect(openedUrl).toContain('Kasun%20Perera');
  });
});

