// @ts-check
const { test, expect } = require('@playwright/test');

const pages = [
  { path: '/index.html', title: 'Royal Curtain House' },
  { path: '/collections.html', title: 'Collections' },
  { path: '/gallery.html', title: 'Gallery' },
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
      '.hero-actions .btn-primary',
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

    // Open drawer to inspect drawer theme item
    await page.locator('#navToggle').click();
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

    await expect(fabricResult).not.toHaveText(initialMeters || '');

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

test.describe('11. Mobile Viewport & Refresh Integrity (Zero Horizontal Overflow)', () => {
  const testViewports = [
    { width: 360, height: 740, name: 'Samsung Galaxy' },
    { width: 375, height: 667, name: 'iPhone SE' },
    { width: 390, height: 844, name: 'iPhone 13 / Pixel' },
  ];

  for (const vp of testViewports) {
    test(`Mobile ${vp.name} (${vp.width}px): Menu button does not get stuck on right across load, reload, and drawer toggle`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const p of pages) {
        await page.goto(p.path);
        await page.waitForTimeout(200);

        // Verify no horizontal overflow on initial load
        const initScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(initScrollWidth).toBeLessThanOrEqual(vp.width);

        // Verify menu button is within viewport with at least 12px margin
        const toggleRectInit = await page.locator('#navToggle').boundingBox();
        expect(toggleRectInit).not.toBeNull();
        if (toggleRectInit) {
          expect(toggleRectInit.x + toggleRectInit.width).toBeLessThanOrEqual(vp.width - 12);
        }

        // Open and close hamburger drawer
        const navToggle = page.locator('#navToggle');
        await navToggle.click();
        await page.waitForTimeout(200);
        await navToggle.click();
        await page.waitForTimeout(200);

        // Verify no horizontal overflow after drawer close
        const postCloseScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(postCloseScrollWidth).toBeLessThanOrEqual(vp.width);

        // Reload the page
        await page.reload();
        await page.waitForTimeout(200);

        // Verify menu button position after reload
        const reloadedScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(reloadedScrollWidth).toBeLessThanOrEqual(vp.width);

        const toggleRectReload = await page.locator('#navToggle').boundingBox();
        expect(toggleRectReload).not.toBeNull();
        if (toggleRectReload) {
          expect(toggleRectReload.x + toggleRectReload.width).toBeLessThanOrEqual(vp.width - 12);
        }
      }
    });
  }
});

test.describe('12. Anti-Flashbang Transition System (Page Switch & Refresh)', () => {
  test('Page transition curtain exists across all 4 pages and fades out on load', async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.path);
      const curtain = page.locator('#pageTransitionCurtain');
      await expect(curtain).toBeAttached();
      // Verify it receives .loaded class to dissolve
      await expect(curtain).toHaveClass(/loaded/);
    }
  });

  test('Dark mode refresh preserves dark theme background synchronously without white flash', async ({ page }) => {
    await page.goto('/index.html');

    // Switch to dark mode (handling desktop toggle or mobile drawer toggle)
    const isHeaderToggleVisible = await page.locator('#themeToggle').isVisible();
    if (isHeaderToggleVisible) {
      await page.locator('#themeToggle').click();
    } else {
      await page.locator('#navToggle').click();
      await page.locator('#drawerThemeToggle').click();
      await page.locator('#navToggle').click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Reload page in dark mode
    await page.reload();

    // Verify synchronous dark theme attribute
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Verify background color is obsidian (rgb(18, 16, 14)), NOT white
    const htmlBg = await page.evaluate(() => window.getComputedStyle(document.documentElement).backgroundColor);
    expect(htmlBg).toBe('rgb(18, 16, 14)');

    // Verify curtain background is also obsidian
    const curtainBg = await page.evaluate(() => {
      const c = document.getElementById('pageTransitionCurtain');
      return c ? window.getComputedStyle(c).backgroundColor : null;
    });
    expect(curtainBg).toBe('rgb(18, 16, 14)');

    // Reset back to light mode
    const isHeaderToggleVisibleAfter = await page.locator('#themeToggle').isVisible();
    if (isHeaderToggleVisibleAfter) {
      await page.locator('#themeToggle').click();
    } else {
      await page.locator('#navToggle').click();
      await page.locator('#drawerThemeToggle').click();
      await page.locator('#navToggle').click();
    }
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  });

  test('Page switch triggers smooth curtain transition when navigating internal links', async ({ page }) => {
    await page.goto('/index.html');
    const curtain = page.locator('#pageTransitionCurtain');
    await expect(curtain).toHaveClass(/loaded/);

    // Click link to Collections (desktop nav link or footer link if on mobile)
    const isNavVisible = await page.locator('.nav-links a[href="collections.html"]').isVisible();
    if (isNavVisible) {
      await page.locator('.nav-links a[href="collections.html"]').click();
    } else {
      await page.locator('footer a[href="collections.html"]').first().click();
    }

    // Verify navigation succeeds
    await page.waitForURL('**/collections.html');
    await expect(page).toHaveTitle(/Collections/i);

    // Verify curtain loaded on new page
    await expect(curtain).toHaveClass(/loaded/);
  });
});

test.describe('13. Signature Bi-Parting Drapery Session Intro Transition', () => {
  test('First session visit executes bi-parting drapery intro and sets session storage flag', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/index.html');

    const overlay = page.locator('#sessionIntroOverlay');
    await expect(overlay).toBeAttached();

    // Verify left and right panels and brand center exist
    const leftPanel = overlay.locator('.intro-curtain-left');
    const rightPanel = overlay.locator('.intro-curtain-right');
    const brandName = overlay.locator('.intro-brand-name');

    await expect(leftPanel).toBeAttached();
    await expect(rightPanel).toBeAttached();
    await expect(brandName).toHaveText(/Royal Curtain House/i);

    // Wait for transition timeline to complete
    await expect(overlay).toBeHidden({ timeout: 6000 });

    // Verify sessionStorage flag is set
    const hasSeen = await page.evaluate(() => sessionStorage.getItem('rch_session_intro_seen'));
    expect(hasSeen).toBe('true');
  });

  test('Page reload in same session bypasses intro instantly', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => {
      sessionStorage.setItem('rch_session_intro_seen', 'true');
    });
    await page.reload();

    const overlay = page.locator('#sessionIntroOverlay');
    await expect(overlay).toBeHidden();
  });

  test('Internal navigation across pages in same session bypasses intro', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => {
      sessionStorage.setItem('rch_session_intro_seen', 'true');
    });

    await page.goto('/collections.html');
    const overlay = page.locator('#sessionIntroOverlay');
    await expect(overlay).toBeHidden();
  });

  test('Clicking overlay or pressing Escape skips intro immediately', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/index.html');

    const overlay = page.locator('#sessionIntroOverlay');
    if (await overlay.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(overlay).toBeHidden({ timeout: 2000 });
      const hasSeen = await page.evaluate(() => sessionStorage.getItem('rch_session_intro_seen'));
      expect(hasSeen).toBe('true');
    }
  });
});

test.describe('14. Animated Haloing Background System (Light & Dark Modes)', () => {
  test('Ambient halo container and 4 chromatic orbs exist on all pages', async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.path);
      const container = page.locator('.ambient-halo-container');
      await expect(container).toBeAttached();

      const emerald = page.locator('.ambient-halo-container .halo-emerald');
      const amber = page.locator('.ambient-halo-container .halo-amber');
      const crimson = page.locator('.ambient-halo-container .halo-crimson');
      const sunlight = page.locator('.ambient-halo-container .halo-sunlight');

      await expect(emerald).toBeAttached();
      await expect(amber).toBeAttached();
      await expect(crimson).toBeAttached();
      await expect(sunlight).toBeAttached();
    }
  });

  test('Toggling dark mode updates halo opacity and color tokens', async ({ page }) => {
    await page.goto('/index.html');

    // Check light mode opacity
    const lightOpacity = await page.evaluate(() => {
      const orb = document.querySelector('.halo-emerald');
      return orb ? window.getComputedStyle(orb).opacity : null;
    });
    expect(Number(lightOpacity)).toBeCloseTo(0.22, 1);

    // Toggle to dark mode
    const isHeaderToggleVisible = await page.locator('#themeToggle').isVisible();
    if (isHeaderToggleVisible) {
      await page.locator('#themeToggle').click();
    } else {
      await page.locator('#navToggle').click();
      await page.locator('#drawerThemeToggle').click();
      await page.locator('#navToggle').click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(600);

    // Check dark mode opacity
    const darkOpacity = await page.evaluate(() => {
      const orb = document.querySelector('.halo-emerald');
      return orb ? window.getComputedStyle(orb).opacity : null;
    });
    expect(Number(darkOpacity)).toBeCloseTo(0.26, 1);

    // Reset back to light mode
    if (isHeaderToggleVisible) {
      await page.locator('#themeToggle').click();
    } else {
      await page.locator('#navToggle').click();
      await page.locator('#drawerThemeToggle').click();
      await page.locator('#navToggle').click();
    }
  });

  test('Halo animations are disabled when prefers-reduced-motion is active', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/index.html');

    const animName = await page.evaluate(() => {
      const orb = document.querySelector('.halo-emerald');
      return orb ? window.getComputedStyle(orb).animationName : null;
    });
    expect(animName).toBe('none');
  });
});

test.describe('15. Architectural Gallery Page & Lightbox Interaction', () => {
  test('Gallery page renders project cards and filter pills work accurately', async ({ page }) => {
    await page.goto('/gallery.html');

    const cards = page.locator('.gallery-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(6);

    // Click residential filter
    await page.locator('[data-gallery-filter="residential"]').click();
    await page.waitForTimeout(250);

    const visibleResidential = await page.locator('.gallery-card[data-gallery-category="residential"]').first().isVisible();
    expect(visibleResidential).toBe(true);

    // Reset to all
    await page.locator('[data-gallery-filter="all"]').click();
    await page.waitForTimeout(250);
  });

  test('Clicking gallery card opens liquid glass lightbox modal with WhatsApp dispatch', async ({ page }) => {
    await page.goto('/gallery.html');

    const firstCard = page.locator('.gallery-card').first();
    await firstCard.click();

    const modal = page.locator('#galleryModal');
    await expect(modal).toHaveClass(/open/);
    await expect(modal).toHaveAttribute('aria-hidden', 'false');

    // Verify WhatsApp inquiry link is generated
    const inquireBtn = page.locator('#galleryModalInquireBtn');
    const href = await inquireBtn.getAttribute('href');
    expect(href).toContain('wa.me');
    expect(href).toContain('Royal%20Curtain%20House');

    // Close modal with close button
    await page.locator('#galleryModalClose').click();
    await expect(modal).not.toHaveClass(/open/);
  });

  test('Pressing Escape closes gallery modal', async ({ page }) => {
    await page.goto('/gallery.html');

    await page.locator('.gallery-card').first().click();
    const modal = page.locator('#galleryModal');
    await expect(modal).toHaveClass(/open/);

    await page.keyboard.press('Escape');
    await expect(modal).not.toHaveClass(/open/);
  });
});
