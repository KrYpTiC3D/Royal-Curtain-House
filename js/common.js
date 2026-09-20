/**
 * Royal Curtain House (Matale Branch) — Shared Global JavaScript (common.js)
 * Minimalist luxury window architecture with island-wide service across Sri Lanka.
 */

(function () {
  'use strict';

  window.RoyalApp = window.RoyalApp || {};

  // ---------------------------------------------------------------------------
  // 1. Matale Showroom & Island-Wide Service Configuration
  // ---------------------------------------------------------------------------
  const MATALE_SHOWROOM = {
    name: 'Royal Curtain House — Matale Showroom',
    brandTitle: 'Royal Curtain House (Pvt) Ltd',
    branch: 'Matale',
    address: 'No 553, Trincomalee Street, Matale 21000, Central Province, Sri Lanka',
    phoneDisplay: '+94 77 227 3838',
    phoneRaw: '+94772273838',
    whatsapp: '94772273838',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM | Sunday by Appointment',
    serviceScope: 'Island-wide on-site measurement, bespoke tailoring & installation across Sri Lanka'
  };

  const buildWhatsAppUrl = (details = {}) => {
    const lines = [
      'Hello Royal Curtain House (Matale),',
      details.name ? `My name is ${details.name}.` : '',
      details.city ? `City / Town: ${details.city}` : '',
      details.service ? `Interest: ${details.service}` : '',
      details.windows ? `Window Details: ${details.windows}` : '',
      details.message ? `Notes: ${details.message}` : 'I would like to request an on-site window measurement & fabric consultation.',
      'Please let me know consultation availability for island-wide service.'
    ].filter(Boolean);

    return `https://wa.me/${MATALE_SHOWROOM.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const openWhatsApp = (details = {}) => {
    const url = buildWhatsAppUrl(details);
    const win = window.open(url, '_blank');
    if (!win) {
      window.location.href = url;
    }
    return url;
  };

  // ---------------------------------------------------------------------------
  // 2. Minimalist Light-First Theme Manager (Light default with Dark option)
  // ---------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'rch-theme';

  const getSavedTheme = () => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'light'; // Default is pristine light theme
  };

  const updateToggleButtons = (theme) => {
    const isLight = theme === 'light';
    const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    document.querySelectorAll('.theme-toggle, #themeToggle, #drawerThemeToggle').forEach((btn) => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  };

  const applyTheme = (theme, persist = true) => {
    const valid = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', valid);
    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, valid);
      } catch (e) {}
    }
    updateToggleButtons(valid);
    return valid;
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    return applyTheme(next, true);
  };

  // Immediate theme execution to prevent visual flash
  applyTheme(getSavedTheme(), false);

  RoyalApp.MATALE_SHOWROOM = MATALE_SHOWROOM;
  RoyalApp.buildWhatsAppUrl = buildWhatsAppUrl;
  RoyalApp.openWhatsApp = openWhatsApp;
  RoyalApp.applyTheme = applyTheme;
  RoyalApp.toggleTheme = toggleTheme;
  RoyalApp.getSavedTheme = getSavedTheme;

  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // -------------------------------------------------------------------------
    // 3. Header & Sticky Navbar Dynamics
    // -------------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const setNavbarState = () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    setNavbarState();
    window.addEventListener('scroll', setNavbarState, { passive: true });

    // -------------------------------------------------------------------------
    // 4. Mobile Navigation Drawer Controller
    // -------------------------------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    let navBackdrop = document.querySelector('.nav-backdrop');
    if (!navBackdrop && body) {
      navBackdrop = document.createElement('div');
      navBackdrop.className = 'nav-backdrop';
      document.body.appendChild(navBackdrop);
    }

    const setMobileNavState = (shouldOpen) => {
      if (!navToggle || !navLinks) return;
      navToggle.classList.toggle('open', shouldOpen);
      navLinks.classList.toggle('open', shouldOpen);
      navToggle.setAttribute('aria-expanded', String(shouldOpen));
      navToggle.setAttribute('aria-label', shouldOpen ? 'Close navigation menu' : 'Toggle navigation');
      if (body) {
        body.classList.toggle('nav-open', shouldOpen);
      }
      if (navBackdrop) {
        navBackdrop.classList.toggle('active', shouldOpen);
      }
    };

    RoyalApp.setMobileNavState = setMobileNavState;
    setMobileNavState(false);

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.contains('open');
        setMobileNavState(!isOpen);
      });

      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          setMobileNavState(false);
        });
      });

      if (navBackdrop) {
        navBackdrop.addEventListener('click', () => {
          setMobileNavState(false);
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
          setMobileNavState(false);
        }
      });

      document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
          setMobileNavState(false);
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 1156 && navLinks.classList.contains('open')) {
          setMobileNavState(false);
        }
      }, { passive: true });
    }

    // -------------------------------------------------------------------------
    // 5. Theme Toggle Listeners (Desktop Header + Mobile Drawer)
    // -------------------------------------------------------------------------
    updateToggleButtons(document.documentElement.getAttribute('data-theme') || 'light');

    document.querySelectorAll('.theme-toggle, #themeToggle, #drawerThemeToggle').forEach((toggleBtn) => {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      });
    });

    document.querySelectorAll('.drawer-theme-box').forEach((box) => {
      box.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-toggle')) {
          toggleTheme();
        }
      });
    });

    // -------------------------------------------------------------------------
    // 6. WhatsApp Inquiry Attribute Handlers
    // -------------------------------------------------------------------------
    document.querySelectorAll('[data-whatsapp]').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const interest = element.dataset.whatsapp || 'Bespoke Curtains & Blinds';
        openWhatsApp({ service: interest });
      });
    });

    // -------------------------------------------------------------------------
    // 7. Smooth Anchor Scrolling for On-Page Elements
    // -------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const hash = anchor.getAttribute('href');
        if (hash && hash !== '#') {
          const target = document.querySelector(hash);
          if (target) {
            e.preventDefault();
            setMobileNavState(false);
            if (window.lenis && !prefersReducedMotion) {
              window.lenis.scrollTo(target, { offset: -70 });
            } else {
              target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
            if (history.pushState) {
              history.pushState(null, null, hash);
            }
          }
        }
      });
    });

    // -------------------------------------------------------------------------
    // 8. Anti-Flashbang Page Transition Controller (Switch & Refresh)
    // -------------------------------------------------------------------------
    const curtain = document.getElementById('pageTransitionCurtain');

    const revealPage = () => {
      if (!curtain) return;
      requestAnimationFrame(() => {
        curtain.classList.add('loaded');
        curtain.classList.remove('exiting');
      });
    };

    revealPage();
    window.addEventListener('pageshow', revealPage);

    // Intercept internal page navigations for smooth cross-page transition
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      // Ignore external links, new tabs, anchors, tel, mailto, wa.me, modifier keys
      if (
        link.target === '_blank' ||
        href.startsWith('#') ||
        href.startsWith('http:') ||
        href.startsWith('https:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.hasAttribute('download') ||
        e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.defaultPrevented
      ) {
        return;
      }

      // Check if target is a different HTML page
      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.href);
      if (currentUrl.origin === targetUrl.origin && currentUrl.pathname === targetUrl.pathname) {
        return; // same page hash or refresh
      }

      if (prefersReducedMotion || !curtain) {
        return; // follow normal navigation
      }

      e.preventDefault();
      curtain.classList.remove('loaded');
      curtain.classList.add('exiting');

      window.setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });
})();
