document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const loadingScreen = document.getElementById('loadingScreen');
  const currentPath = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash;
  const isHomePage = currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/') || currentPath === '';
/**
 * Royal Curtain House — Master Bundle (main.js)
 * Maintained for backward compatibility.
 * Modern pages use dedicated scripts: common.js, home.js, collections.js, services.js, about.js, contact.js.
 */

  const sessionKey = 'royal-curtain-house-loaded';
  const hasLoadedThisSession = sessionStorage.getItem(sessionKey) === 'true';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create or retrieve page progress bar
  let progressBar = document.querySelector('.page-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'page-progress-bar';
    document.body.prepend(progressBar);
  }

  // Create page transition overlay if not present
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

  // Clear transition states helper
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

  // Handle bfcache & hashchange navigation so page never gets stuck
  window.addEventListener('pageshow', clearTransitionState);
  window.addEventListener('hashchange', clearTransitionState);
  window.addEventListener('popstate', clearTransitionState);

  // Homepage Initial Loading Transition — Minimalist Wave Drapery
  const dismissLoadingScreen = (instant = false) => {
    if (!loadingScreen) return;
    if (instant) {
      loadingScreen.classList.add('opening', 'hidden');
      loadingScreen.style.display = 'none';
      if (body) body.classList.remove('has-curtain-reveal');
      return;
    }
    loadingScreen.classList.add('opening');
    window.setTimeout(() => {
      loadingScreen.classList.add('hidden');
      sessionStorage.setItem(sessionKey, 'true');
      window.setTimeout(() => {
        loadingScreen.style.display = 'none';
        if (body) body.classList.remove('has-curtain-reveal');
      }, 450);
    }, 850);
  };

  if (isHomePage && loadingScreen) {
    // If user navigated directly to an anchor (e.g. #calculator), skip reveal immediately
    if (currentHash) {
      dismissLoadingScreen(true);
      const targetElem = document.querySelector(currentHash);
      if (targetElem) {
        setTimeout(() => targetElem.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else if (!hasLoadedThisSession && !prefersReducedMotion) {
      body.classList.add('has-curtain-reveal');
      window.setTimeout(() => {
        dismissLoadingScreen(false);
      }, 450);
    } else {
      dismissLoadingScreen(true);
    }

    // Absolute Failsafe: Loading screen must NEVER stay visible longer than 1500ms
    window.setTimeout(() => {
      dismissLoadingScreen(true);
    }, 1500);
  } else if (loadingScreen) {
    dismissLoadingScreen(true);
  }

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const filterButtons = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');
  const contactForm = document.getElementById('contactForm');

  // Sri Lanka Operational Footprint & WhatsApp Contacts
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

  // Check if browser supports native Cross-Document View Transitions
  const supportsNativeCrossDocTransitions = 'onpagereveal' in window || (
    'ViewTransition' in window && CSS.supports && CSS.supports('view-transition-name', 'root')
  );

  // Check if a target URL points to an anchor on the current page
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

    // Handle same-page hash jump without triggering page-transition overlay
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

    const isExternal = /^https?:\/\//i.test(targetUrl);
    if (isExternal) {
      return false;
    }

    // Trigger sleek gold progress bar
    if (progressBar) {
      progressBar.classList.remove('done');
      progressBar.classList.add('active');
    }

    if (prefersReducedMotion || supportsNativeCrossDocTransitions) {
      window.location.href = targetUrl;
      return true;
    }

    // Fallback animated transition for browsers without native View Transitions
    body.classList.add('page-transitioning');

    // Safety timeout: automatically reset transition after 1200ms in case navigation is cancelled or local
    window.setTimeout(clearTransitionState, 1200);

    window.setTimeout(() => {
      window.location.href = targetUrl;
    }, 200);
    return true;
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

  const setNavbarState = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };

  setNavbarState();
  window.addEventListener('scroll', setNavbarState, { passive: true });

  // Mobile Navigation Drawer & Animated Hamburger Controller
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
    if (navBackdrop) {
      navBackdrop.classList.toggle('active', shouldOpen);
    }
  };

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
  }

  // Filter Tabs Handler
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.toggle('active', item === button));

      // On mobile, scroll the active filter tab into view comfortably
      if (window.innerWidth <= 540 && typeof button.scrollIntoView === 'function') {
        button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      productCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = selectedFilter === 'all' || category === selectedFilter;
        card.classList.toggle('hidden', !shouldShow);
      });
    });
  });

  // Internal Navigation Links Transition & Smooth Anchor Interception
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

      // If this is a same-page anchor (e.g. #calculator or index.html#calculator while on index.html)
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

      // External HTTP(S) links - let browser handle
      if (/^https?:\/\//i.test(href)) {
        return;
      }

      event.preventDefault();
      setMobileNavState(false);
      navigateWithTransition(href);
    });
  });

  // Data-WhatsApp Trigger Elements
  document.querySelectorAll('[data-whatsapp]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const project = element.dataset.whatsapp || 'I would like to enquire about curtains and blinds.';
      const branch = element.dataset.branch || 'general';
      const details = { name: 'Customer', service: project, message: project };
      event.preventDefault();
      openWhatsApp(details, branch);
    });
  });

  // =========================================================================
  // Architectural Curtain Sizing & Specification Engine (Pure Sizing, No Pricing)
  // Architectural Curtain Sizing & Specification Engine (Pure Sizing & Yardage)
  // =========================================================================
  const calcForm = document.getElementById('curtainCalculatorForm');
  if (calcForm) {
    const widthInput = document.getElementById('calcWidth');
    const heightInput = document.getElementById('calcHeight');
    const extInput = document.getElementById('calcExtension');
    const headingSelect = document.getElementById('calcHeading');
    const fabricSelect = document.getElementById('calcFabric');
    const dropSelect = document.getElementById('calcDrop');
    const motorCheckbox = document.getElementById('calcMotorized');
    const branchSelect = document.getElementById('calcBranch');

    const resultFabricMetres = document.getElementById('calcResultFabric');
    const resultPanels = document.getElementById('calcResultPanels');
    const resultTrackSpan = document.getElementById('calcResultTrack');
    const resultFullness = document.getElementById('calcResultFullness');
    const resultDetailsText = document.getElementById('calcResultDetails');
    const whatsappBtn = document.getElementById('calcWhatsappBtn');
    const resultCard = document.querySelector('.calc-result-card');

    let prevLinearMetres = 3.8;
    let prevPanels = 2;
    let prevTrackSpan = 68;

    const animateNumber = (element, start, end, suffix = '', decimals = 1, duration = 280) => {
      if (!element) return;
      if (prefersReducedMotion) {
        element.textContent = (decimals > 0 ? end.toFixed(decimals) : Math.round(end)) + suffix;
        return;
      }
      const startTime = performance.now();
      const update = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        element.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      requestAnimationFrame(update);
    };

    const FULLNESS_FACTORS = {
      wave: { name: 'Ripple Fold (Wave) S-Curve', factor: 2.2 },
      french: { name: 'French Pinch Pleat (Triple Fold)', factor: 2.6 },
      eyelet: { name: 'Eyelet (Grommet Rings)', factor: 1.8 },
      minimal: { name: 'Tailored Minimal Rod Pocket', factor: 1.5 }
    };

    const FABRIC_INFO = {
      linen: { name: 'Natural Belgian Linen Blend' },
      blackout: { name: 'Nightfall 100% Thermal Blackout' },
      sheer: { name: 'Cloud Sheer Light-Filtering Voile' },
      velvet: { name: 'Royal Heritage Velvet' },
      jacquard: { name: 'Textured Damask / Jacquard' },
      monsoon: { name: 'Sauleda Weatherproof Outdoor Fabric' }
    };

    const DROP_ADJUSTMENTS = {
      hover: { label: 'Hovering (0.5" off floor)', delta: -0.5 },
      kiss: { label: 'Kissing Floor (Exact contact)', delta: 0 },
      break: { label: 'Gentle Drape Break (1" break)', delta: 1.0 },
      puddle: { label: 'Dramatic Formal Puddle (+3")', delta: 3.0 }
    };

    const updateCalculations = () => {
      const windowWidth = parseFloat(widthInput?.value) || 60;
      const windowHeight = parseFloat(heightInput?.value) || 84;
      const rodExtension = parseFloat(extInput?.value) || 4;
      const headingKey = headingSelect?.value || 'wave';
      const fabricKey = fabricSelect?.value || 'linen';
      const dropKey = dropSelect?.value || 'kiss';
      const isMotorized = motorCheckbox?.checked || false;
      const selectedBranch = branchSelect?.value || 'general';

      const totalRodWidth = windowWidth + (rodExtension * 2);
      const headingConfig = FULLNESS_FACTORS[headingKey] || FULLNESS_FACTORS.wave;
      const fabricConfig = FABRIC_INFO[fabricKey] || FABRIC_INFO.linen;
      const dropConfig = DROP_ADJUSTMENTS[dropKey] || DROP_ADJUSTMENTS.kiss;

      // Effective Fabric Width (W_f = W_t * F_f)
      const fabricWidthInches = totalRodWidth * headingConfig.factor;
      
      // Panel calculation for custom made-to-measure window dressings
      const panelCount = Math.max(2, Math.ceil(fabricWidthInches / 50));
      const finishedPanelHeight = windowHeight + dropConfig.delta + 8;
      const linearMetres = Math.max(3, Number(((panelCount * finishedPanelHeight) / 39.37).toFixed(1)));

      if (resultCard) {
        resultCard.classList.remove('pulse-update');
        void resultCard.offsetWidth;
        resultCard.classList.add('pulse-update');
      }

      if (resultFabricMetres) {
        animateNumber(resultFabricMetres, prevLinearMetres, linearMetres, ' m', 1);
        prevLinearMetres = linearMetres;
      }

      if (resultPanels) {
        animateNumber(resultPanels, prevPanels, panelCount, ' Custom Panels', 0);
        prevPanels = panelCount;
      }

      if (resultTrackSpan) {
        animateNumber(resultTrackSpan, prevTrackSpan, totalRodWidth, ' Inches', 0);
        prevTrackSpan = totalRodWidth;
      }

      if (resultFullness) {
        resultFullness.textContent = `${headingConfig.factor}x Architectural Fullness`;
      }

      if (resultDetailsText) {
        resultDetailsText.textContent = `Sized for a ${windowWidth}" W × ${windowHeight}" H window. Features ${panelCount} handcrafted panels in ${fabricConfig.name} with ${headingConfig.name} (${headingConfig.factor}x fullness) and ${isMotorized ? 'Smart Motorized Automation' : 'Concealed Silent-Glide Track'}.`;
      }

      if (whatsappBtn) {
        const branchName = BRANCHES[selectedBranch]?.name || BRANCHES.general.name;
        const specSummary = [
          `*Custom Window Sizing & Specification Request:*`,
          `• Window Dimensions: ${windowWidth}" W × ${windowHeight}" H`,
          `• Recommended Track Span: ${totalRodWidth}" (${rodExtension}" stack-back clearance/side)`,
          `• Heading Style: ${headingConfig.name} (${headingConfig.factor}x fullness)`,
          `• Drop Style: ${dropConfig.label}`,
          `• Fabric Selection: ${fabricConfig.name}`,
          `• System: ${isMotorized ? 'Smart Motorized Automation (App & Remote)' : 'Concealed Silent-Glide Track'}`,
          `• Calculated Fabric: ~${linearMetres} Linear Metres (${panelCount} Handcrafted Panels)`,
          `• Preferred Showroom: ${branchName}`,
          `Please provide fabric swatches, custom quotation, and free on-site measurement schedule.`
        ].join('\n');

        whatsappBtn.href = buildWhatsAppUrl({
          name: 'Customer',
          branch: branchName,
          service: 'Custom Window Sizing',
          message: specSummary
        }, selectedBranch);
      }
    };

    [widthInput, heightInput, extInput, headingSelect, fabricSelect, dropSelect, motorCheckbox, branchSelect].forEach((el) => {
      if (el) {
        el.addEventListener('input', updateCalculations);
        el.addEventListener('change', updateCalculations);
      }
    });

    updateCalculations();
  }

  // Contact Form Submission Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const firstName = (formData.get('firstName') || '').toString().trim();
      const lastName = (formData.get('lastName') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const branchKey = (formData.get('branch') || 'general').toString().trim();
      const service = (formData.get('service') || '').toString().trim();
      const messageText = (formData.get('message') || '').toString().trim();
      const messageEl = contactForm.querySelector('.form-note');

      if (!firstName || !lastName || !email) {
        if (messageEl) {
          messageEl.textContent = 'Please complete the required fields before submitting your WhatsApp inquiry.';
          messageEl.style.color = '#a03232';
        }
        return;
      }

      const branchInfo = BRANCHES[branchKey] || BRANCHES.general;

      const whatsappUrl = openWhatsApp({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        branch: branchInfo.name,
        service: service || 'Curtain & Blind Consultation',
        message: messageText || 'I would like to request a quotation & free home measurement.'
      }, branchKey);

      if (messageEl) {
        messageEl.textContent = `Connecting you to our ${branchInfo.name} WhatsApp line...`;
        messageEl.style.color = '#1e7a46';
        messageEl.dataset.whatsappLink = whatsappUrl;
      }

      contactForm.reset();
    });
  }
});
// If common.js is not already loaded, delegate to common
if (typeof window.RoyalApp === 'undefined') {
  const script = document.createElement('script');
  script.src = 'js/common.js';
  document.head.appendChild(script);
}
