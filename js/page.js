/**
 * OUTO TECH UG — Service page JavaScript
 * Header, mobile menu and back-to-top for the service landing pages
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const header = $('header'), hamburger = $('hamburger'), mainNav = $('mainNav'), backToTop = $('backToTop');

  hamburger.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open'); hamburger.classList.remove('open');
  }));

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const yr = $('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
