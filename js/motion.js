/**
 * Royal Curtain House — Cinematic Motion System
 * GSAP + ScrollTrigger + Lenis Smooth Scroll Integration
 * Follows cinematic-gsap-lenis-motion-system and vercel-react-best-practices.
 */

(function initCinematicMotion() {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: Immediately reveal all content cleanly and exit
  if (reduceMotion) {
    document.documentElement.classList.add('reduced-motion');
    document.querySelectorAll('[data-reveal], [data-reveal-item], .reveal-left, .reveal-right, [data-motion-text]').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    return;
  }

  // Register GSAP plugins if available
  if (typeof gsap === 'undefined') {
    // Fallback if GSAP is not loaded: standard IntersectionObserver
    initObserverFallback();
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap.defaults({ ease: 'power3.out', duration: 0.72 });

  // 0. Signature Bi-Parting Drapery Session Intro Transition (First Visit of Session)
  function initSessionIntroTransition() {
    const overlay = document.getElementById('sessionIntroOverlay');
    if (!overlay) return;

    let hasSeenIntro = false;
    try {
      hasSeenIntro = sessionStorage.getItem('rch_session_intro_seen') === 'true';
    } catch (e) {
      hasSeenIntro = false;
    }

    if (hasSeenIntro || reduceMotion) {
      overlay.style.display = 'none';
      try {
        sessionStorage.setItem('rch_session_intro_seen', 'true');
      } catch (e) {}
      document.documentElement.classList.add('rch-session-ready');
      return;
    }

    const panelLeft = overlay.querySelector('.intro-curtain-left');
    const panelRight = overlay.querySelector('.intro-curtain-right');
    const brandCenter = overlay.querySelector('.intro-brand-center');
    const brandLine = overlay.querySelector('.intro-brand-line');

    let isFinished = false;
    const finishIntro = (immediate = false) => {
      if (isFinished) return;
      isFinished = true;
      try {
        sessionStorage.setItem('rch_session_intro_seen', 'true');
      } catch (e) {}
      document.documentElement.classList.add('rch-session-ready');

      if (immediate) {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
      } else {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.22,
          ease: 'power3.out',
          onComplete: () => {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
          }
        });
      }
      document.removeEventListener('keydown', handleKeydown);
      overlay.removeEventListener('click', () => finishIntro(false));
    };

    const handleKeydown = (e) => {
      // Emil rule: Never animate keyboard-initiated actions (instant dismissal)
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        finishIntro(true);
      }
    };

    overlay.addEventListener('click', () => finishIntro(false));
    document.addEventListener('keydown', handleKeydown);

    // Fail-safe max timer in case tab backgrounded
    const fallbackTimer = window.setTimeout(() => finishIntro(false), 2200);

    const tl = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(fallbackTimer);
        finishIntro(false);
      }
    });

    // 1. Reveal Brand Center & Hairline Accent Thread
    tl.fromTo(brandCenter,
      { opacity: 0, y: 14, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
    )
    .fromTo(brandLine,
      { scaleX: 0.1, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.38, ease: 'power2.out' },
      '-=0.2'
    )
    // 2. Pause briefly for visual appreciation
    .to({}, { duration: 0.2 })
    // 3. Ascend and dissolve brand center mark
    .to(brandCenter, {
      opacity: 0,
      y: -12,
      duration: 0.28,
      ease: 'power3.out'
    })
    // 4. Bi-Parting Drapery Draw: Left and right panels slide smoothly outward
    .to(panelLeft, {
      xPercent: -100,
      duration: 0.72,
      ease: 'power4.inOut'
    }, 'draw')
    .to(panelRight, {
      xPercent: 100,
      duration: 0.72,
      ease: 'power4.inOut'
    }, 'draw');
  }

  // 1. Lenis Smooth Scroll Initialization synced to GSAP Ticker
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.5,
      anchors: true
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
    }

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    window.lenis = lenisInstance;
  }

  // 2. Scroll Reveals: Left and Right Entrances & Initial Scroll Choreography
  function initScrollReveals() {
    const isMobile = window.innerWidth <= 768;
    const xOffset = isMobile ? 0 : 28;
    const yOffset = isMobile ? 16 : 0;

    // Left Reveals: Slide in from the left on desktop, fade up on mobile
    const leftElements = document.querySelectorAll('[data-reveal="slide-left"]:not([data-reveal-group] *), .reveal-left:not([data-reveal-group] *)');
    leftElements.forEach((el) => {
      gsap.fromTo(el,
        { x: -xOffset, y: yOffset, opacity: 0, filter: 'blur(4px)' },
        {
          x: 0,
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        }
      );
    });

    // Right Reveals: Slide in from the right on desktop, fade up on mobile
    const rightElements = document.querySelectorAll('[data-reveal="slide-right"]:not([data-reveal-group] *), .reveal-right:not([data-reveal-group] *)');
    rightElements.forEach((el) => {
      gsap.fromTo(el,
        { x: xOffset, y: yOffset, opacity: 0, filter: 'blur(4px)' },
        {
          x: 0,
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        }
      );
    });

    // Fade-up reveals (Page headers, banners, footers, cards)
    const fadeUpElements = document.querySelectorAll('[data-reveal="fade-up"]');
    fadeUpElements.forEach((el) => {
      gsap.fromTo(el,
        { y: 22, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.68,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true
          }
        }
      );
    });

    // Group Staggered Reveals (e.g. Catalog Cards, Feature Pillars, Service Steps, Gallery Grid)
    const groups = document.querySelectorAll('[data-reveal-group]');
    groups.forEach((group) => {
      const items = group.querySelectorAll('[data-reveal-item]');
      if (!items.length) return;

      gsap.fromTo(items,
        { y: 20, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: group,
            start: 'top 88%',
            once: true
          }
        }
      );
    });

    // Initial page scroll choreography:
    // On first user scroll, ensure all view-adjacent elements seamlessly trigger their reveal
    let hasScrolledOnce = false;
    const onInitialScroll = () => {
      if (hasScrolledOnce) return;
      hasScrolledOnce = true;
      window.removeEventListener('scroll', onInitialScroll);
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('scroll', onInitialScroll, { passive: true, once: true });
  }

  // 3. Typographic Masked Line Reveals
  function initTextReveals() {
    const textHeaders = document.querySelectorAll('[data-motion-text="lines"]');
    textHeaders.forEach((el) => {
      const lines = el.querySelectorAll('.motion-line');
      if (!lines.length) return;

      gsap.fromTo(lines,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        }
      );
    });
  }

  // 4. Image Clip-Path Reveals
  function initImageReveals() {
    const figures = document.querySelectorAll('[data-image-reveal]');
    figures.forEach((figure) => {
      const img = figure.querySelector('img');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: figure,
          start: 'top 84%',
          once: true
        }
      });

      tl.fromTo(figure,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power3.out' }
      );

      if (img) {
        tl.fromTo(img,
          { scale: 1.05, opacity: 0.85 },
          { scale: 1.0, opacity: 1.0, duration: 0.95, ease: 'power3.out' },
          0
        );
      }
    });
  }

  // 5. Magnetic Hover Micro-Interactions on CTAs
  function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const magnetics = document.querySelectorAll('[data-magnetic]');
    magnetics.forEach((el) => {
      const strength = Number(el.dataset.magnetic || 0.18);
      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        xTo(x);
        yTo(y);
      }, { passive: true });

      el.addEventListener('pointerleave', () => {
        xTo(0);
        yTo(0);
      }, { passive: true });
    });
  }

  // Fallback IntersectionObserver in case of missing plugins
  function initObserverFallback() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-reveal], .reveal-left, .reveal-right').forEach(el => observer.observe(el));
  }

  // Initialization lifecycle
  function init() {
    initSessionIntroTransition();
    initTextReveals();
    initScrollReveals();
    initImageReveals();
    initMagnetic();

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
})();

