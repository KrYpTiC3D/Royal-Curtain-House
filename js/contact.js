/**
 * Royal Curtain House — Contact Page Specific JavaScript (contact.js)
 * Dedicated functionality for contact.html:
 * - Contact inquiry form validation and submission
 * - Showroom branch routing and pre-populated WhatsApp dispatch
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

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
          messageEl.textContent = 'Please complete all required fields (* marked) before submitting your WhatsApp inquiry.';
          messageEl.style.color = '#e07a7a';
        }
        return;
      }

      const branchInfo = (window.RoyalApp && RoyalApp.BRANCHES && RoyalApp.BRANCHES[branchKey])
        ? RoyalApp.BRANCHES[branchKey]
        : { name: 'Royal Curtain House', whatsapp: '94773616237' };

      if (window.RoyalApp && RoyalApp.openWhatsApp) {
        RoyalApp.openWhatsApp({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          branch: branchInfo.name,
          service: service || 'Curtain & Blind Consultation',
          message: messageText || 'I would like to request a quotation & free home measurement.'
        }, branchKey);
      } else {
        const text = encodeURIComponent(`Hello ${branchInfo.name},\nMy name is ${firstName} ${lastName}.\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nDetails: ${messageText}`);
        window.open(`https://wa.me/${branchInfo.whatsapp}?text=${text}`, '_blank');
      }

      if (messageEl) {
        messageEl.textContent = `Connecting you to our ${branchInfo.name} WhatsApp line...`;
        messageEl.style.color = '#7ad29e';
      }

      contactForm.reset();
    });
  });
})();

