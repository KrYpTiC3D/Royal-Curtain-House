/**
 * Royal Curtain House — Collections Page Specific JavaScript (collections.js)
 * Dedicated functionality for collections.html:
 * - Architectural catalog filter tabs
 * - Mobile filter bar auto-centering
 * - URL hash/query filter deep linking
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length === 0 || productCards.length === 0) return;

    const applyFilter = (filterKey, shouldScrollMobile = false) => {
      let activeBtn = null;
      filterButtons.forEach((button) => {
        const isMatch = button.dataset.filter === filterKey;
        button.classList.toggle('active', isMatch);
        if (isMatch) activeBtn = button;
      });

      if (shouldScrollMobile && activeBtn && window.innerWidth <= 540 && typeof activeBtn.scrollIntoView === 'function') {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      productCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = filterKey === 'all' || category === filterKey;
        card.classList.toggle('hidden', !shouldShow);
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';
        applyFilter(filter, true);

        // Update URL hash without forcing jump
        if (history.replaceState) {
          history.replaceState(null, null, filter === 'all' ? window.location.pathname : '#' + filter);
        }
      });
    });

    // Check for deep-linked filter in URL hash on load (e.g. collections.html#blackout)
    const initialHash = window.location.hash.replace('#', '').toLowerCase();
    const validFilters = ['all', 'wave', 'modern', 'blackout', 'sheer'];
    if (initialHash && validFilters.includes(initialHash)) {
      applyFilter(initialHash, true);
    }
  });
})();

