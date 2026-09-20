/**
 * Royal Curtain House — Instant Theme & Viewport Pre-Boot (theme-init.js)
 * Executes synchronously in <head> before DOM rendering to eliminate theme flashbangs.
 */
(function () {
  'use strict';
  try {
    const saved = localStorage.getItem('rch-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = (saved === 'dark' || (!saved && prefersDark)) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // Session intro check: if already seen in this session, pre-mark as ready
    if (sessionStorage.getItem('rch_session_intro_seen') === 'true') {
      document.documentElement.classList.add('rch-session-ready');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

