/**
 * Royal Curtain House — Shared Global JavaScript (common.js)
 * Core site-wide functionality: Navigation, Drawer, Transitions, Anchor Routing, and WhatsApp
 */

(function () {
  'use strict';

  window.RoyalApp = window.RoyalApp || {};

  // -------------------------------------------------------------------------
  // 1. Sri Lanka Operational Footprint & WhatsApp Contacts
  // -------------------------------------------------------------------------
  const BRANCHES = {
    kekirawa: {
      name: 'Kekirawa Showroom',
      address: 'Cooperative Building, A9 Road / Kandy - Jaffna Highway, Kekirawa',
      phone: '+94 77 361 6237',
      whatsapp: '94773616237'
    },
    katugastota: {
      name: 'Katugastota (Kandy) Showroom',
      address: 'No 196/A Madawala Road, Katugastota',
      phone: '+94 77 646 6680',
      whatsapp: '94776466680'
    },
    matale: {
      name: 'Matale Showroom',
      address: 'No 553, Trincomalee Street, Matale 21000',
      phone: '+94 77 227 3838',
      whatsapp: '94772273838'
    },
    general: {
      name: 'Royal Curtain House (Central Hotline)',
      phone: '+94 77 361 6237',
      whatsapp: '94773616237'
    }
  };

  const buildWhatsAppUrl = (details, branchKey = 'general') => {
    const targetBranch = BRANCHES[branchKey] || BRANCHES.general;
    const summaryLines = [
      `Hello ${targetBranch.name},`,
      details.name ? `My name is ${details.name}.` : '',
      details.branch ? `Preferred Showroom: ${details.branch}` : '',
      details.email ? `Email: ${details.email}` : '',
      details.phone ? `Phone: ${details.phone}` : '',
      details.service ? `Service Interest: ${details.service}` : '',
      details.message ? `Details: ${details.message}` : 'I would like to request a quotation & free home measurement.',
      'Please let me know about fabric swatches and consultation availability.'
    ].filter(Boolean);

    return `https://wa.me/${targetBranch.whatsapp}?text=${encodeURIComponent(summaryLines.join('\n'))}`;
  };

  const openWhatsApp = (details, branchKey = 'general') => {
    const whatsappUrl = buildWhatsAppUrl(details, branchKey);
    const windowRef = window.open(whatsappUrl, '_blank');
    if (!windowRef) {
      window.location.href = whatsappUrl;
    }
    return whatsappUrl;
  };

  // -------------------------------------------------------------------------
  // 2. Theme Management Engine (Obsidian Dark & Warm Linen Light)
  // -------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'rch-theme';

  const getSystemTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const getSavedTheme = () => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // Graceful degradation when storage is inaccessible
    }
    return getSystemTheme();
  };

  const updateToggleButtons = (theme) => {
    const isLight = theme === 'light';
    const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    document.querySelectorAll('.theme-toggle, #themeToggle').forEach((btn) => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  };

  const applyTheme = (theme, persist = true) => {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, validTheme);
      } catch (e) {}
    }
    updateToggleButtons(validTheme);
    return validTheme;
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    return applyTheme(nextTheme, true);
  };

  // Immediate theme application to eliminate flash
  applyTheme(getSavedTheme(), false);

  // Expose on namespace
  RoyalApp.BRANCHES = BRANCHES;
  RoyalApp.buildWhatsAppUrl = buildWhatsAppUrl;
  RoyalApp.openWhatsApp = openWhatsApp;
  RoyalApp.applyTheme = applyTheme;
  RoyalApp.toggleTheme = toggleTheme;
  RoyalApp.getSavedTheme = getSavedTheme;

  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const currentPath = window.location.pathname.toLowerCase();
    const isHomePage = currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/') || currentPath === '';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // -----------------------------------------------------------------------
    // 2. View Transitions & Top Progress Bar
    // -----------------------------------------------------------------------
    let progressBar = document.querySelector('.page-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'page-progress-bar';
      document.body.prepend(progressBar);
    }

    let overlay = document.querySelector('.page-transition-overlay');
    if (!overlay && body) {
      overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      document.body.appendChild(overlay);
    }

    if (body) {
      body.classList.add('page-ready');
      body.classList.remove('page-transitioning');
    }

    const clearTransitionState = () => {
      if (body) {
        body.classList.remove('page-transitioning');
      }
      if (progressBar) {
        progressBar.classList.remove('active');
        progressBar.classList.add('done');
        setTimeout(() => {
          progressBar.classList.remove('done');
          progressBar.style.width = '0%';
        }, 300);
      }
    };

    window.addEventListener('pageshow', clearTransitionState);
    window.addEventListener('hashchange', clearTransitionState);
    window.addEventListener('popstate', clearTransitionState);

    const isSamePageAnchor = (targetUrl) => {
      if (!targetUrl) return false;
      if (targetUrl.startsWith('#')) return true;
      try {
        const parsed = new URL(targetUrl, window.location.href);
        const isSamePath = parsed.pathname.toLowerCase() === window.location.pathname.toLowerCase() ||
          (isHomePage && (parsed.pathname.endsWith('/index.html') || parsed.pathname === '/' || parsed.pathname === ''));
        return isSamePath && parsed.hash !== '';
      } catch (e) {
        return false;
      }
    };

    const navigateWithTransition = (targetUrl) => {
      if (!targetUrl || targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:')) {
        return false;
      }

      if (isSamePageAnchor(targetUrl)) {
        const hash = targetUrl.includes('#') ? '#' + targetUrl.split('#')[1] : '';
        if (hash) {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            if (history.pushState) {
              history.pushState(null, null, hash);
            } else {
              window.location.hash = hash;
            }
          }
        }
        return true;
      }

      if (/^https?:\/\//i.test(targetUrl)) {
        return false;
      }

      if (progressBar) {
        progressBar.classList.remove('done');
        progressBar.classList.add('active');
      }

      if (prefersReducedMotion) {
        window.location.href = targetUrl;
        return true;
      }

      body.classList.add('page-transitioning');
      window.setTimeout(clearTransitionState, 1200);

      window.setTimeout(() => {
        window.location.href = targetUrl;
      }, 200);
      return true;
    };

    RoyalApp.clearTransitionState = clearTransitionState;
    RoyalApp.isSamePageAnchor = isSamePageAnchor;
    RoyalApp.navigateWithTransition = navigateWithTransition;

    // -----------------------------------------------------------------------
    // 3. Header & Sticky Navbar
    // -----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const setNavbarState = () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    };

    setNavbarState();
    window.addEventListener('scroll', setNavbarState, { passive: true });

    // -----------------------------------------------------------------------
    // 4. Mobile Navigation Drawer & Hamburger Controller
    // -----------------------------------------------------------------------
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

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyOpen = navLinks.classList.contains('open');
        setMobileNavState(!isCurrentlyOpen);
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

    // -----------------------------------------------------------------------
    // 5. Internal Links Transition Interception
    // -----------------------------------------------------------------------
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }

      link.addEventListener('click', (event) => {
        const target = link.getAttribute('target');
        if (target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey) {
          return;
        }

        if (isSamePageAnchor(href)) {
          event.preventDefault();
          setMobileNavState(false);
          const hash = href.includes('#') ? '#' + href.split('#')[1] : href;
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            if (history.pushState) {
              history.pushState(null, null, hash);
            } else {
              window.location.hash = hash;
            }
          }
          return;
        }

        if (/^https?:\/\//i.test(href)) {
          return;
        }

        event.preventDefault();
        setMobileNavState(false);
        navigateWithTransition(href);
      });
    });

    // -----------------------------------------------------------------------
    // 6. Theme Toggle DOM Listeners & MatchMedia Synchronization
    // -----------------------------------------------------------------------
    updateToggleButtons(document.documentElement.getAttribute('data-theme') || 'dark');

    document.querySelectorAll('.theme-toggle, #themeToggle').forEach((toggleBtn) => {
      toggleBtn.addEventListener('click', (event) => {
        event.preventDefault();
        toggleTheme();
      });
    });

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      const handleSystemThemeChange = (e) => {
        try {
          const userTheme = localStorage.getItem(THEME_STORAGE_KEY);
          if (!userTheme) {
            applyTheme(e.matches ? 'light' : 'dark', false);
          }
        } catch (err) {}
      };
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleSystemThemeChange);
      }
    }

    // -----------------------------------------------------------------------
    // 7. Data-WhatsApp Attribute Delegation
    // -----------------------------------------------------------------------
    document.querySelectorAll('[data-whatsapp]').forEach((element) => {
      element.addEventListener('click', (event) => {
        const project = element.dataset.whatsapp || 'I would like to enquire about curtains and blinds.';
        const branch = element.dataset.branch || 'general';
        const details = { name: 'Customer', service: project, message: project };
        event.preventDefault();
        openWhatsApp(details, branch);
      });
    });
  });
})();

