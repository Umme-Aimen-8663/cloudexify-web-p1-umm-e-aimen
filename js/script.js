/* =========================================================
   UMME AIMEN — PORTFOLIO SCRIPT
   Signature features: theme switcher (localStorage),
   typewriter hero intro, scroll-triggered skill bars,
   live project filter, plus scroll reveal, tilt cards,
   cursor glow and validated contact form.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function setMenuOpen(isOpen) {
    hamburger.classList.toggle('active', isOpen);
    navLinks.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', isOpen);
  }

  hamburger.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('active'));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener('click', (event) => {
    const clickedOutsideNav = !event.target.closest('.navbar-inner');
    if (clickedOutsideNav && navLinks.classList.contains('active')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  });

  /* ---------- Theme switcher (Signature Feature) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'ua-portfolio-theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ---------- Typewriter hero intro (Signature Feature) ---------- */
  const roles = [
    'Web & Mobile Application Developer',
    'Flutter & React Native Builder',
    'Firebase + AI Integrator',
    'CloudExify Full-Stack Intern'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const current = roles[roleIndex];

    if (!deleting) {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  if (prefersReducedMotion && typedEl) {
    typedEl.textContent = roles[0];
  } else {
    typeLoop();
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Scroll-triggered skill bars (Signature Feature) ---------- */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.fill');
        fill.style.width = entry.target.dataset.percent + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill').forEach(el => skillObserver.observe(el));

  /* ---------- Live project filter (Signature Feature) ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const tags = card.dataset.tags.split(',');
        const match = filter === 'all' || tags.includes(filter);
        card.classList.toggle('hide', !match);
      });

      requestAnimationFrame(() => {
        projectCards.forEach((card, index) => {
          if (!card.classList.contains('hide')) {
            card.style.setProperty('--stagger', `${index * 60}ms`);
          }
        });
      });
    });
  });

  /* ---------- Active nav link highlighting on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('is-active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('is-active');
      }
    });
  }, { threshold: 0.5, rootMargin: '-80px 0px -40% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- Tilt effect on project & glass cards ---------- */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        const rotateY = ((x / rect.width) - 0.5) * 8;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    /* Hero device stack subtle parallax */
    const deviceStack = document.getElementById('deviceStack');
    if (deviceStack) {
      document.querySelector('.hero').addEventListener('mousemove', (e) => {
        const rect = deviceStack.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        deviceStack.style.transform = `rotateX(${dy * -6}deg) rotateY(${dx * 8}deg)`;
      });
      document.querySelector('.hero').addEventListener('mouseleave', () => {
        deviceStack.style.transform = '';
      });
    }

    /* Cursor glow */
    const glow = document.getElementById('cursorGlow');
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  /* ---------- Contact form validation (no backend — Month 2) ---------- */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  function setError(fieldId, message) {
    const errorEl = document.getElementById(`err-${fieldId}`);
    const row = document.getElementById(fieldId).closest('.form-row');
    if (errorEl) errorEl.textContent = message;
    if (row) row.classList.toggle('invalid', Boolean(message));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let valid = true;
    setError('name', ''); setError('email', ''); setError('message', '');

    if (name === '') { setError('name', 'Please enter your name.'); valid = false; }
    if (!emailOK) { setError('email', 'Please enter a valid email address.'); valid = false; }
    if (message === '') { setError('message', 'Please write a short message.'); valid = false; }

    if (!valid) {
      statusEl.style.color = '#c0564f';
      statusEl.textContent = 'Please fix the highlighted fields.';
      return;
    }

    statusEl.style.color = '';
    statusEl.textContent = `Thanks, ${name.split(' ')[0]}! Your message has been noted — I'll reply by email soon.`;
    form.reset();
  });

});
