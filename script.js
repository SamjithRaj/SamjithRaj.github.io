/* ============================================================
   script.js — Samjith Raj Bondla Portfolio
   Professional motion system — no external libraries
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. THEME ──────────────────────────────────────────────
     Persists user preference in localStorage.
  ──────────────────────────────────────────────────────────── */

  const root      = document.documentElement;
  const themeBtn  = document.getElementById('themeToggle');
  const saved     = localStorage.getItem('srb-theme') || 'dark';

  root.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('srb-theme', next);
  });


  /* ── 2. PAGE LOADER ────────────────────────────────────────
     Hides after CSS fill animation completes (~1.4s).
     Triggers hero entrance animations.
  ──────────────────────────────────────────────────────────── */

  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1500);
  });

  // Fallback in case load fires late
  setTimeout(() => loader.classList.add('hidden'), 2200);


  /* ── 3. CUSTOM CURSOR ──────────────────────────────────────
     Dot snaps immediately; ring lags behind with lerp.
     Detects hoverable elements for scale-up state.
  ──────────────────────────────────────────────────────────── */

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return; // mobile fallback

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow with lerp
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state
  const hoverTargets = 'a, button, .pill, .tag, .project-card, .tilt-card';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));


  /* ── 4. SCROLL-AWARE NAVBAR ────────────────────────────────
     Appears on scroll-down; hides on scroll-up (smart hide).
     Gains glass background once user scrolls past 60px.
  ──────────────────────────────────────────────────────────── */

  const navbar  = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Glass effect
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Smart hide/show
    if (y > lastScroll && y > 160) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScroll = y;
  }, { passive: true });


  /* ── 5. TYPING ANIMATION ───────────────────────────────────
     Typewriter with variable speed: types slowly,
     deletes quickly, pauses at completion.
  ──────────────────────────────────────────────────────────── */

  const phrases = [
    'Backend Systems Engineer.',
    'C++ Performance Builder.',
    'Concurrency & Architecture.',
    'I build things that scale.',
  ];

  const typingEl   = document.getElementById('typing-text');
  let phraseIndex  = 0;
  let letterIndex  = 0;
  let isDeleting   = false;
  let isPaused     = false;

  function type() {
    if (isPaused) return;

    const current = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = current.substring(0, --letterIndex);
    } else {
      typingEl.textContent = current.substring(0, ++letterIndex);
    }

    if (!isDeleting && letterIndex === current.length) {
      isPaused = true;
      setTimeout(() => { isDeleting = true; isPaused = false; type(); }, 1600);
      return;
    }

    if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(type, isDeleting ? 32 : 72);
  }

  // Start after loader clears
  setTimeout(type, 1600);


  /* ── 6. SPLIT TEXT HEADINGS ────────────────────────────────
     Wraps each word in a clip container for reveal-from-below.
     Triggered by IntersectionObserver.
  ──────────────────────────────────────────────────────────── */

  function splitHeading(el) {
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words.map((w, i) =>
      `<span class="word" style="--wd:${i * 0.07}s">` +
      `<span class="word-inner">${w}</span></span>`
    ).join(' ');
  }

  document.querySelectorAll('.split-heading').forEach(splitHeading);

  const headingObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        headingObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.split-heading').forEach((el) => headingObs.observe(el));


  /* ── 7. SCROLL REVEAL — sr-fade ────────────────────────────
     General fade + slide up for sections, cards, etc.
     Uses threshold: 0.12 for early-ish trigger.
  ──────────────────────────────────────────────────────────── */

  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.sr-fade').forEach((el) => fadeObs.observe(el));


  /* ── 8. 3D CARD TILT ───────────────────────────────────────
     Tracks mouse position within each card and applies
     a subtle perspective tilt + glow follow effect.
  ──────────────────────────────────────────────────────────── */

  document.querySelectorAll('.tilt-card').forEach((card) => {
    const glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 6;
      const rotY   =  dx * 6;

      card.style.transform =
        `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;

      // Move glow to cursor position inside card
      if (glow) {
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top  = (e.clientY - rect.top)  + 'px';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 9. PHOTO FRAME — PARALLAX TILT ───────────────────────
     Subtle tilt on the hero headshot based on global mouse.
  ──────────────────────────────────────────────────────────── */

  const photoFrame = document.getElementById('photoFrame');

  if (photoFrame) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      photoFrame.style.transform =
        `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg)`;
    });

    photoFrame.addEventListener('mouseleave', () => {
      photoFrame.style.transform = '';
    });
  }


  /* ── 10. MAGNETIC BUTTONS ──────────────────────────────────
     Buttons with class .magnetic slightly follow the cursor.
  ──────────────────────────────────────────────────────────── */

  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.22;
      const dy     = (e.clientY - cy) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ── 11. ACTIVE NAV LINK HIGHLIGHT ────────────────────────
     Highlights the current nav link as sections come in view.
  ──────────────────────────────────────────────────────────── */

  const sections  = document.querySelectorAll('section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + e.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach((s) => navObs.observe(s));


  /* ── 12. TERMINAL EASTER EGG ───────────────────────────────
     Ctrl+Shift+S toggles the hidden terminal panel.
  ──────────────────────────────────────────────────────────── */

  const terminal       = document.getElementById('terminal');
  const terminalCursor = document.getElementById('tcursor');

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      const isVisible = terminal.style.display === 'block';
      terminal.style.display = isVisible ? 'none' : 'block';
    }
  });

  setInterval(() => {
    if (terminalCursor) {
      terminalCursor.style.opacity = terminalCursor.style.opacity === '0' ? '1' : '0';
    }
  }, 500);

});
