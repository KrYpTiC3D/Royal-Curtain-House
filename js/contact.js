/**
 * Royal Curtain House (Matale Branch) — Contact Page Specific JavaScript (contact.js)
 * Dedicated functionality for contact.html:
 * - Island-Wide Consultation & Measurement inquiry form validation
 * - Direct WhatsApp dispatch to the Matale Showroom (+94 77 227 3838)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const city = (formData.get('city') || '').toString().trim();
      const service = (formData.get('service') || '').toString().trim();
      const messageText = (formData.get('message') || '').toString().trim();
      const messageEl = contactForm.querySelector('.form-note');

      if (!name || !phone) {
        if (messageEl) {
          messageEl.textContent = 'Please provide your name and contact phone number.';
          messageEl.classList.add('error');
        }
        return;
      }

      const showroom = (window.RoyalApp && RoyalApp.MATALE_SHOWROOM)
        ? RoyalApp.MATALE_SHOWROOM
        : { name: 'Royal Curtain House (Matale)', whatsapp: '94772273838' };

      const summaryDetails = {
        name,
        phone,
        city: city || 'Island-Wide Consultation',
        service: service || 'Bespoke Curtains & Blinds',
        message: messageText || 'I would like to request an on-site window measurement & fabric consultation.'
      };

      if (window.RoyalApp && RoyalApp.openWhatsApp) {
        RoyalApp.openWhatsApp(summaryDetails);
      } else {
        const textLines = [
          'Hello Royal Curtain House (Matale),',
          `My name is ${name}.`,
          `Phone: ${phone}`,
          city ? `Location: ${city}` : '',
          `Service: ${service}`,
          messageText ? `Details: ${messageText}` : 'I would like to schedule an on-site measurement & consultation.',
          'Please let me know availability for island-wide service.'
        ].filter(Boolean);
        window.open(`https://wa.me/${showroom.whatsapp}?text=${encodeURIComponent(textLines.join('\n'))}`, '_blank');
      }

      if (messageEl) {
        messageEl.textContent = 'Connecting you to our Matale Showroom on WhatsApp...';
        messageEl.classList.remove('error');
        messageEl.classList.add('success');
      }

      contactForm.reset();
    });
  });
})();
