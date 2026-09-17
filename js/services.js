/**
 * Royal Curtain House — Services Page Specific JavaScript (services.js)
 * Dedicated functionality for services.html:
 * - Interactive process steps guidance
 * - Regional service coverage interactions
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Process Steps Interactive Focus
    const steps = document.querySelectorAll('.process-step');
    steps.forEach((step, index) => {
      step.setAttribute('tabindex', '0');
      step.setAttribute('role', 'region');
      step.setAttribute('aria-label', `Step ${index + 1}`);

      step.addEventListener('mouseenter', () => {
        steps.forEach((s) => s.classList.remove('active-step'));
        step.classList.add('active-step');
      });
    });

    // Coverage booking triggers
    document.querySelectorAll('.coverage-card .btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        // Track or log showroom visit booking if analytics present
      });
    });
  });
})();

