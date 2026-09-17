/**
 * Royal Curtain House — About Page Specific JavaScript (about.js)
 * Dedicated functionality for about.html:
 * - 25-year heritage showcase interactions
 * - Showroom hub direct communication helpers
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Value item micro-interaction
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item) => {
      item.setAttribute('tabindex', '0');
    });

    // Showroom cards direct interaction
    const showroomCards = document.querySelectorAll('.showroom-card');
    showroomCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'var(--border-gold)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.borderColor = '';
      });
    });
  });
})();

