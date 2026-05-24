/**
 * ambient.js — Interactive depth for Linear design system
 * Adds: ambient blobs · card mouse spotlights · hero parallax
 * Zero interaction-logic changes — purely visual enrichment.
 */
(function () {
  'use strict';

  // ── 1. Ambient blobs ──────────────────────────────────────────────
  function injectBlobs () {
    if (document.getElementById('ambient-blobs')) return; // guard
    var wrap = document.createElement('div');
    wrap.id = 'ambient-blobs';
    wrap.innerHTML =
      '<div class="amb-blob amb-blob--1"></div>' +
      '<div class="amb-blob amb-blob--2"></div>' +
      '<div class="amb-blob amb-blob--3"></div>' +
      '<div class="amb-blob amb-blob--4"></div>';
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  // ── 2. Card spotlight (mouse tracking) ───────────────────────────
  function initSpotlights () {
    document.querySelectorAll('.work-card').forEach(function (card) {
      if (card.querySelector('.card-spotlight')) return; // guard

      var spot = document.createElement('div');
      spot.className = 'card-spotlight';
      card.appendChild(spot);

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--ms-x', (e.clientX - r.left) + 'px');
        card.style.setProperty('--ms-y', (e.clientY - r.top)  + 'px');
      }, { passive: true });
    });
  }

  // ── 3. Hero parallax ─────────────────────────────────────────────
  function initHeroParallax () {
    var heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    var heroSection = document.getElementById('hero') ||
                      heroContent.closest('section') ||
                      heroContent.parentElement;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      requestAnimationFrame(function () {
        var scrollY     = window.scrollY;
        var heroHeight  = heroSection ? heroSection.offsetHeight : window.innerHeight;
        if (scrollY >= heroHeight) { ticking = false; return; }

        var progress    = scrollY / (heroHeight * 0.65);
        var opacity     = Math.max(1 - progress * 0.72, 0.28);
        var translateY  = scrollY * 0.22;
        var scale       = 1 - Math.min(progress * 0.038, 0.038);

        heroContent.style.opacity   = opacity;
        heroContent.style.transform = 'translateY(' + translateY + 'px) scale(' + scale + ')';
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  // ── 4. Staggered entrance refinement ─────────────────────────────
  // Adds a tiny per-card delay so work cards feel sequential, not simultaneous.
  function refineStagger () {
    document.querySelectorAll('#work .work-card').forEach(function (card, i) {
      if (!card.style.transitionDelay) {
        card.style.transitionDelay = (i * 0.06) + 's';
      }
    });
  }

  // ── 5. Expertise-card mouse spotlight (subtle) ────────────────────
  function initExpertiseSpotlights () {
    document.querySelectorAll('.expertise-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r  = card.getBoundingClientRect();
        var px = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
        var py = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
        card.style.backgroundImage =
          'radial-gradient(260px circle at ' + px + ' ' + py + ', ' +
          'rgba(94,106,210,0.055) 0%, transparent 70%), ' +
          'linear-gradient(160deg, rgba(255,255,255,0.082) 0%, rgba(255,255,255,0.032) 100%)';
      }, { passive: true });

      card.addEventListener('mouseleave', function () {
        card.style.backgroundImage = '';
      });
    });
  }

  // ── 6. Mobile navigation panel ──────────────────────────────────
  function initMobileNav () {
    var btn = document.querySelector('.nav-menu-btn');
    var links = document.querySelector('.nav-links');
    var nav = document.getElementById('nav');
    if (!btn || !links || !nav) return;

    var panel = document.querySelector('.mobile-nav-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'mobile-nav-panel';
      panel.setAttribute('aria-hidden', 'true');

      links.querySelectorAll('a').forEach(function (link) {
        var clone = link.cloneNode(true);
        clone.addEventListener('click', closePanel);
        panel.appendChild(clone);
      });

      nav.appendChild(panel);
    }

    function closePanel () {
      btn.classList.remove('is-open');
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var isOpen = !panel.classList.contains('is-open');
      btn.classList.toggle('is-open', isOpen);
      panel.classList.toggle('is-open', isOpen);
      panel.setAttribute('aria-hidden', String(!isOpen));
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closePanel();
    }, { passive: true });
  }

  // ── init ──────────────────────────────────────────────────────────
  function init () {
    injectBlobs();
    initSpotlights();
    initHeroParallax();
    refineStagger();
    initExpertiseSpotlights();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
