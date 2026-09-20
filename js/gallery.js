/**
 * Royal Curtain House — Gallery Page Controller (js/gallery.js)
 * Interactive Category Filtering, Lightbox Modal Inspection, and Direct WhatsApp Booking
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Gallery Category Filtering
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-gallery-filter');

        // Update active filter pill
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards with smooth fade
        galleryCards.forEach(card => {
          const category = card.getAttribute('data-gallery-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
              }
            }, 200);
          }
        });
      });
    });
  }

  // 2. Lightbox Modal Inspection & WhatsApp Inquiry Dispatch
  const modalOverlay = document.getElementById('galleryModal');
  const modalClose = document.getElementById('galleryModalClose');
  const modalImg = document.getElementById('galleryModalImg');
  const modalTag = document.getElementById('galleryModalTag');
  const modalTitle = document.getElementById('galleryModalTitle');
  const modalDesc = document.getElementById('galleryModalDesc');
  const modalFabric = document.getElementById('galleryModalFabric');
  const modalTrack = document.getElementById('galleryModalTrack');
  const modalLocation = document.getElementById('galleryModalLocation');
  const modalInquireBtn = document.getElementById('galleryModalInquireBtn');

  if (modalOverlay && galleryCards.length > 0) {
    let lastActiveElement = null;

    const openModal = (card) => {
      lastActiveElement = document.activeElement;

      const title = card.getAttribute('data-project-title') || 'Bespoke Installation';
      const tag = card.getAttribute('data-project-tag') || 'Architectural Drapery';
      const desc = card.getAttribute('data-project-desc') || '';
      const img = card.getAttribute('data-project-img') || '';
      const fabric = card.getAttribute('data-project-fabric') || 'Premium Drapery';
      const track = card.getAttribute('data-project-track') || 'Custom Architectural Track';
      const location = card.getAttribute('data-project-location') || 'Sri Lanka';

      if (modalImg) modalImg.src = img;
      if (modalTag) modalTag.textContent = tag;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalFabric) modalFabric.textContent = fabric;
      if (modalTrack) modalTrack.textContent = track;
      if (modalLocation) modalLocation.textContent = location;

      // Build personalized WhatsApp inquiry URL
      if (modalInquireBtn) {
        const text = encodeURIComponent(
          `Hello Royal Curtain House (Matale),\n\nI am viewing your Gallery portfolio and would like to inquire about the installation style:\n\n*Project:* ${title}\n*Category:* ${tag}\n*Fabric:* ${fabric}\n*Track System:* ${track}\n*Location Reference:* ${location}\n\nPlease share estimated pricing and arrange a site measurement consultation.`
        );
        modalInquireBtn.href = `https://wa.me/94772273838?text=${text}`;
      }

      modalOverlay.classList.add('open');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (window.lenis) {
        window.lenis.stop();
      }

      if (modalClose) {
        modalClose.focus();
      }
    };

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
      }

      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    };

    galleryCards.forEach(card => {
      card.addEventListener('click', () => openModal(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });
  }
});

