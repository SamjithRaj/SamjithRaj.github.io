/* ============================================================
   script.js — Samjith Raj Bondla Portfolio
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── THEME TOGGLE ──────────────────────────────────────────
     Reads saved preference from localStorage on load.
     Persists the user's choice across visits.
  ──────────────────────────────────────────────────────────── */

  const root      = document.documentElement;
  const themeBtn  = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('srb-theme') || 'dark';

  root.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('srb-theme', next);
  });


  /* ── TYPING ANIMATION ──────────────────────────────────────
     Cycles through phrases with a typewriter effect.
     Types forward, pauses, then deletes before moving on.
  ──────────────────────────────────────────────────────────── */

  const phrases = [
    'Backend Systems Engineer.',
    'C++ Performance Builder.',
    'Concurrency & Architecture.',
    'I build things that scale.',
  ];

  const typingEl = document.getElementById('typing-text');
  let phraseIndex  = 0;
  let letterIndex  = 0;
  let isDeleting   = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = current.substring(0, --letterIndex);
    } else {
      typingEl.textContent = current.substring(0, ++letterIndex);
    }

    if (!isDeleting && letterIndex === current.length) {
      // Finished typing — pause before deleting
      setTimeout(() => { isDeleting = true; }, 1400);
    } else if (isDeleting && letterIndex === 0) {
      // Finished deleting — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(type, isDeleting ? 36 : 70);
  }

  type();


  /* ── SCROLL REVEAL ─────────────────────────────────────────
     Uses IntersectionObserver to fade + slide in elements
     with the .reveal class as they enter the viewport.
     Sibling .reveal elements stagger with 80ms delay each.
  ──────────────────────────────────────────────────────────── */

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      siblings.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });

      entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


  /* ── TERMINAL EASTER EGG ───────────────────────────────────
     Toggle the hidden terminal panel with Ctrl+Shift+S.
     Blink the terminal cursor independently.
  ──────────────────────────────────────────────────────────── */

  const terminal       = document.getElementById('terminal');
  const terminalCursor = document.getElementById('tcursor');

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      terminal.style.display = terminal.style.display === 'block' ? 'none' : 'block';
    }
  });

  setInterval(() => {
    if (terminalCursor) {
      terminalCursor.style.opacity = terminalCursor.style.opacity === '0' ? '1' : '0';
    }
  }, 500);

});
