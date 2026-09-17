/**
 * Royal Curtain House — Homepage Specific JavaScript (home.js)
 * Dedicated functionality for index.html:
 * - Minimalist wave drapery loading screen with failsafe dismissal
 * - Signature collection filter tabs
 * - Architectural Curtain Sizing & Specification Engine
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const loadingScreen = document.getElementById('loadingScreen');
    const currentHash = window.location.hash;
    const sessionKey = 'royal-curtain-house-loaded';
    const hasLoadedThisSession = sessionStorage.getItem(sessionKey) === 'true';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // -----------------------------------------------------------------------
    // 1. Minimalist Wave Drapery Loading Screen Controller
    // -----------------------------------------------------------------------
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

    if (loadingScreen) {
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

      // Failsafe: Ensures loading screen is dismissed within 1500ms under all conditions
      window.setTimeout(() => {
        dismissLoadingScreen(true);
      }, 1500);
    }

    // -----------------------------------------------------------------------
    // 2. Signature Collections Filter Tabs
    // -----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
      filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const selectedFilter = button.dataset.filter;
          filterButtons.forEach((item) => item.classList.toggle('active', item === button));

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
    }

    // -----------------------------------------------------------------------
    // 3. Architectural Curtain Sizing & Specification Engine
    // -----------------------------------------------------------------------
    const calcForm = document.getElementById('curtainCalculatorForm');
    if (calcForm) {
      // Cleanly prevent form submit without needing inline onsubmit="return false;"
      calcForm.addEventListener('submit', (e) => e.preventDefault());

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

        const fabricWidthInches = totalRodWidth * headingConfig.factor;
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

        if (whatsappBtn && window.RoyalApp && RoyalApp.buildWhatsAppUrl) {
          const branchName = RoyalApp.BRANCHES[selectedBranch]?.name || RoyalApp.BRANCHES.general.name;
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

          whatsappBtn.href = RoyalApp.buildWhatsAppUrl({
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
  });
})();

