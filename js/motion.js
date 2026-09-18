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

  gsap.defaults({ ease: 'power3.out', duration: 0.85 });

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
  }

  // 2. Scroll Reveals: Left and Right Entrances
  function initScrollReveals() {
    // Left Reveals: Slide in from the left
    const leftElements = document.querySelectorAll('[data-reveal="slide-left"], .reveal-left');
    leftElements.forEach((el) => {
      gsap.fromTo(el,
        { x: -48, opacity: 0, filter: 'blur(6px)' },
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.95,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true
          }
        }
      );
    });

    // Right Reveals: Slide in from the right
    const rightElements = document.querySelectorAll('[data-reveal="slide-right"], .reveal-right');
    rightElements.forEach((el) => {
      gsap.fromTo(el,
        { x: 48, opacity: 0, filter: 'blur(6px)' },
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.95,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true
          }
        }
      );
    });

    // Fade-up reveals
    const fadeUpElements = document.querySelectorAll('[data-reveal="fade-up"]');
    fadeUpElements.forEach((el) => {
      gsap.fromTo(el,
        { y: 36, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true
          }
        }
      );
    });

    // Group Staggered Reveals (e.g. Catalog Cards, Feature Pillars, Service Steps)
    const groups = document.querySelectorAll('[data-reveal-group]');
    groups.forEach((group) => {
      const items = group.querySelectorAll('[data-reveal-item]');
      if (!items.length) return;

      gsap.fromTo(items,
        { y: 32, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: group,
            start: 'top 84%',
            once: true
          }
        }
      );
    });
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
          duration: 1.0,
          ease: 'power4.out',
          stagger: 0.12,
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
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out' }
      );

      if (img) {
        tl.fromTo(img,
          { scale: 1.08, opacity: 0.8 },
          { scale: 1.0, opacity: 1.0, duration: 1.2, ease: 'power4.out' },
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

