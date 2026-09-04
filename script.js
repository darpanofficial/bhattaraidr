// script.js — small progressive enhancements for the portfolio page.
// The site works fine with none of this; these just add polish.

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initScrollReveal();
  initActiveNav();
});

/**
 * Smoothly scroll to in-page sections when a nav link is clicked,
 * instead of the browser's default instant jump.
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.navlinks a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return; // let the browser handle it if the section doesn't exist

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Keep the URL hash in sync without triggering another jump.
      history.pushState(null, '', `#${targetId}`);
    });
  });
}

/**
 * Fade + slide sections into view as the user scrolls to them.
 * Falls back gracefully (content is just visible) if IntersectionObserver
 * isn't supported.
 */
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.stat-strip, .band, .focus-head, .list-item, .contact-head, .info-row, .social-row'
  );

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

/**
 * Highlight the nav link that matches the section currently in view.
 */
function initActiveNav() {
  const sections = ['focus', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = document.querySelectorAll('.navlinks a[href^="#"]');
  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}
