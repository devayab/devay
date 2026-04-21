/**
 * Devay AB — Huvudskript
 * ─────────────────────────────────────────
 * Hanterar:
 *  1. Mobil hamburger-meny
 *  2. Aktiv nav-länk vid scroll
 *  3. Transparent nav → solid vid scroll
 *  4. Scroll-animationer (IntersectionObserver)
 *  5. GDPR-karta (lazy-load vid samtycke)
 *  6. Hover/tap-animationer (ikoner, värdekort, robot + pratbubbla)
 */

(function () {
  'use strict';

  /* ── 1. MOBIL MENY ─────────────────────────────── */

  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny');
    });

    // Stäng menyn när en länk klickas
    menu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Öppna meny');
      });
    });
  }


  /* ── 2. AKTIV NAV-LÄNK VID SCROLL ─────────────── */

  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ── 3. TRANSPARENT NAV ÖVER HERO → SOLID VID SCROLL ── */

  const nav  = document.querySelector('.nav');
  const hero = document.querySelector('.hero');

  function updateNav() {
    if (!nav) return;
    const threshold = hero ? hero.offsetHeight - 80 : 100;
    if (window.scrollY > threshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  if (nav) {
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

})();


/* ── 4. SCROLL-ANIMATIONER (Intersection Observer) ─── */

(function () {
  // Kontrollera att webbläsaren stöder IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Fallback: visa alla element direkt
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Sluta observera när elementet väl visats
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,       // Triggar när 12% av elementet syns
    rootMargin: '0px 0px -40px 0px'  // Lite marginal nedåt för smidigare känsla
  });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();


/* ── 5. GDPR-KARTA ─────────────────────────────────── */

function loadMap() {
  const consent = document.getElementById('map-consent');
  const iframe  = document.getElementById('map-iframe');

  if (consent) consent.style.display = 'none';
  if (iframe) {
    iframe.src = iframe.getAttribute('data-src') || '';
    iframe.style.display = 'block';
  }
}

window.loadMap = loadMap;


/* ── 6. TAP/HOVER-ANIMATIONER (återspelningsbara) ─── */

(function () {
  function triggerAnim(el) {
    if (el.classList.contains('is-animating')) return;
    el.classList.add('is-animating');
    el.addEventListener('animationend', function handler() {
      el.classList.remove('is-animating');
      el.removeEventListener('animationend', handler);
    });
  }

  // Värdekort — skak vid hover (desktop) och klick/tap (mobil)
  document.querySelectorAll('.value-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () { triggerAnim(card); });
    card.addEventListener('click', function () { triggerAnim(card); });
  });

  // Tjänsteikoner — animation vid hover/tap på kortet
  document.querySelectorAll('.service-card').forEach(function (card) {
    const icon = card.querySelector('.card-icon');
    if (!icon) return;
    function triggerIcon() {
      if (icon.classList.contains('is-animating')) return;
      icon.classList.add('is-animating');
      const svg = icon.querySelector('svg');
      (svg || icon).addEventListener('animationend', function handler() {
        icon.classList.remove('is-animating');
        (svg || icon).removeEventListener('animationend', handler);
      });
    }
    card.addEventListener('mouseenter', triggerIcon);
    card.addEventListener('click', triggerIcon);
  });

  // Robot — hopp + pratbubbla vid hover (desktop) och klick/tap (mobil)
  const robot      = document.querySelector('.ai-robot');
  const bubble     = document.querySelector('.robot-bubble');
  const bubbleMsgs = ['Hej!', 'Är det något jag kan hjälpa till med?', 'Vad tycker du om Agentic AI?'];
  let bubbleIdx    = 0;
  let bubbleActive = false;
  let bubbleTimer;

  function showBubble() {
    if (!bubble || bubbleIdx >= bubbleMsgs.length) return;
    bubbleActive = true;
    bubble.textContent = bubbleMsgs[bubbleIdx++];
    clearTimeout(bubbleTimer);
    bubble.classList.remove('is-hiding');
    bubble.classList.add('is-visible');
    // Håll kvar 1.95 s, tona sedan bort
    bubbleTimer = setTimeout(function () {
      bubble.classList.add('is-hiding');
      bubbleTimer = setTimeout(function () {
        bubble.classList.remove('is-visible', 'is-hiding');
        bubbleActive = false;
      }, 260);
    }, 1950);
  }

  function triggerRobot() {
    if (bubbleActive) return;
    triggerAnim(robot);
    showBubble();
  }

  if (robot) {
    robot.addEventListener('mouseenter', triggerRobot);
    robot.addEventListener('click',      triggerRobot);
  }

  // Hero tap-to-reveal on touch devices
  var hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(hover: none)').matches) {
    hero.addEventListener('click', function () {
      hero.classList.toggle('hero--revealed');
    });
  }
})();
