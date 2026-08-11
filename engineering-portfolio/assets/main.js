(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ============ YEAR ============ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ MOBILE NAV ============ */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  function setMobileNav(open) {
    mobileNav.dataset.open = String(open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      setMobileNav(mobileNav.dataset.open !== 'true');
    });
    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMobileNav(false));
    });
  }

  /* ============ NAV SCROLL STATE ============ */
  const navEl = document.getElementById('nav');
  if (navEl) {
    const setNavState = () => navEl.classList.toggle('is-scrolled', window.scrollY > 24);
    setNavState();
    window.addEventListener('scroll', setNavState, { passive: true });
  }

  /* ============ PRELOADER ============ */
  const preloader = document.getElementById('preloader');
  const preloaderMark = preloader ? preloader.querySelector('.preloader-mark') : null;

  function hidePreloader(onDone) {
    if (!preloader) {
      if (onDone) onDone();
      return;
    }
    if (prefersReducedMotion || !hasGSAP) {
      preloader.hidden = true;
      if (onDone) onDone();
      return;
    }
    gsap.timeline({
      onComplete: () => {
        preloader.hidden = true;
        if (onDone) onDone();
      },
    })
      .to(preloaderMark, { opacity: 1, duration: 0.3, ease: 'power1.out' })
      .to(preloader, { opacity: 0, duration: 0.45, ease: 'power1.inOut', delay: 0.25 });
  }

  // Only the first visit in a tab session gets the intro theatrics.
  let skipIntro = false;
  try {
    skipIntro = sessionStorage.getItem('rn-intro-seen') === '1';
    sessionStorage.setItem('rn-intro-seen', '1');
  } catch (err) {
    // Storage unavailable (private mode etc.) — treat every load as first visit.
  }
  if (skipIntro && preloader) preloader.hidden = true;

  /* ============ SIMPLE SCROLL REVEAL (section-level blocks) ============ */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ============ GSAP STAGGER GROUPS (principles / matrix / project grid) ============ */
  function staggerReveal(containerSelector, itemSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const items = container.querySelectorAll(itemSelector);
    if (!items.length) return;

    if (prefersReducedMotion || !hasScrollTrigger) {
      items.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.set(items, { opacity: 0, y: 20 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: container, start: 'top 85%' },
    });
  }
  staggerReveal('.principles', '.principle');
  staggerReveal('.matrix', '.matrix-group');
  staggerReveal('.project-grid', '.project-card');

  /* ============ SCRAMBLE-DECODE SECTION KICKERS ============ */
  const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#0123456789';

  function scrambleInto(el, finalText, duration) {
    const steps = Math.max(8, Math.round(duration / 30));
    let frame = 0;
    const tick = () => {
      const revealed = Math.floor((frame / steps) * finalText.length);
      let out = '';
      for (let i = 0; i < finalText.length; i++) {
        const ch = finalText[i];
        if (ch === ' ' || ch === '/') {
          out += ch;
        } else {
          out += i < revealed ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = out;
      frame++;
      if (frame <= steps) requestAnimationFrame(tick);
      else el.textContent = finalText;
    };
    tick();
  }

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const kickers = document.querySelectorAll('.section-kicker');
    const kickerIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scrambleInto(entry.target, entry.target.textContent.trim(), 500);
            kickerIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    kickers.forEach((el) => kickerIO.observe(el));
  }

  /* ============ ANIMATED COUNTERS (hero stats) ============ */
  function formatCounter(el, value) {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const pad = parseInt(el.dataset.pad || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let str = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
    if (pad > 0) str = str.padStart(pad, '0');
    return `${prefix}${str}${suffix}`;
  }

  function animateCounter(el) {
    const to = parseFloat(el.dataset.countTo);
    if (Number.isNaN(to)) return;
    if (prefersReducedMotion || !hasGSAP) {
      el.textContent = formatCounter(el, to);
      return;
    }
    const counter = { val: 0 };
    gsap.to(counter, {
      val: to,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = formatCounter(el, counter.val);
      },
    });
  }

  /* ============ HERO ENTRANCE ============ */
  function splitIntoWords(el) {
    const text = el.textContent;
    el.textContent = '';
    const words = text.split(' ');
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.word');
  }

  function runHeroEntrance() {
    const heroH1 = document.querySelector('.hero-h1');
    const words = heroH1 ? splitIntoWords(heroH1) : [];
    const heroTargets = ['.eyebrow', '.hero-sub', '.hero-cta', '.hero-meta']
      .map((sel) => document.querySelector(sel))
      .filter(Boolean);
    const counters = document.querySelectorAll('.meta-n[data-count-to]');

    if (prefersReducedMotion || !hasGSAP) {
      counters.forEach(animateCounter);
      return;
    }

    gsap.set(words, { opacity: 0, y: 26, rotateX: -35, filter: 'blur(6px)', transformOrigin: '50% 100%' });
    gsap.set(heroTargets, { opacity: 0, y: 20 });

    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .to(words, { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.055 })
      .to(heroTargets, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, '-=0.45')
      .add(() => counters.forEach(animateCounter), '-=0.2');
  }

  // Hide the preloader first (or immediately, if skipped/reduced-motion), then
  // run the hero entrance so it isn't fighting the preloader for the first paint.
  hidePreloader(runHeroEntrance);

  /* ============ HERO SPOTLIGHT (cursor-reactive) ============ */
  if (!prefersReducedMotion && isFinePointer && hasGSAP) {
    const hero = document.getElementById('hero');
    const spotlight = document.getElementById('heroSpotlight');
    if (hero && spotlight) {
      const setX = gsap.quickSetter(spotlight, '--spotlight-x', '%');
      const setY = gsap.quickSetter(spotlight, '--spotlight-y', '%');
      // quickSetter writes instantly; wrap in a light smoothing tween via quickTo-style proxy.
      const proxy = { x: 50, y: 32 };
      const xTo = gsap.quickTo(proxy, 'x', { duration: 0.5, ease: 'power2.out', onUpdate: () => setX(proxy.x) });
      const yTo = gsap.quickTo(proxy, 'y', { duration: 0.5, ease: 'power2.out', onUpdate: () => setY(proxy.y) });

      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        xTo(((e.clientX - r.left) / r.width) * 100);
        yTo(((e.clientY - r.top) / r.height) * 100);
        spotlight.classList.add('is-active');
      });
      hero.addEventListener('mouseleave', () => spotlight.classList.remove('is-active'));
    }
  }

  /* ============ MAGNETIC CTA ============ */
  if (!prefersReducedMotion && isFinePointer && hasGSAP) {
    const wrap = document.getElementById('magneticCta');
    if (wrap) {
      const xTo = gsap.quickTo(wrap, 'x', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(wrap, 'y', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      wrap.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      wrap.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    }
  }

  /* ============ PROJECT CARD 3D TILT ============ */
  if (!prefersReducedMotion && isFinePointer && hasGSAP) {
    document.querySelectorAll('.project-card').forEach((card) => {
      const rotX = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' });
      const rotY = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' });
      gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' });

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotX(px * -6);
        rotY(py * 6);
      });
      card.addEventListener('mouseleave', () => {
        rotX(0);
        rotY(0);
      });
    });
  }

  /* ============ CUSTOM CURSOR ============ */
  if (!prefersReducedMotion && isFinePointer && hasGSAP) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring) {
      const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

      // Stay hidden until the real cursor position is known, so the ring/dot
      // never flash at their (0,0) default before the first real move.
      window.addEventListener(
        'mousemove',
        () => document.body.classList.add('cursor-ready'),
        { once: true }
      );
      window.addEventListener('mousemove', (e) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      });

      const hoverables = 'a, button, input, textarea, .project-card, [data-open-modal]';
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverables)) document.body.classList.add('cursor-hover');
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverables)) document.body.classList.remove('cursor-hover');
      });
    }
  }

  /* ============ PROJECT BLUEPRINT MODAL ============ */
  const PROJECTS = {
    orchestrator: {
      title: 'Distributed Task Orchestrator',
      desc: 'A control-plane / worker-pool architecture that schedules and tracks 40k+ concurrent jobs with exactly-once execution, even through node failure.',
      stack: [
        'Go control plane with a Raft-backed leader election',
        'PostgreSQL for durable job state, Redis for lease coordination',
        'Idempotency keys + dead-letter queue for exactly-once delivery',
        'Horizontal worker pools with priority-aware scheduling',
      ],
      metrics: [
        { n: '40k+', l: 'Concurrent jobs' },
        { n: '99.99%', l: 'Delivery guarantee' },
        { n: '<200ms', l: 'Schedule latency' },
      ],
    },
    observability: {
      title: 'Real-Time Observability Pipeline',
      desc: 'A streaming ingestion pipeline that turns raw metrics and traces into actionable alerts before an incident becomes an outage.',
      stack: [
        'Kafka ingestion tier with schema-validated topics',
        'Stream processors for rollups, anomaly detection, and alert routing',
        'Columnar store for high-cardinality metric queries',
        'Sub-second alert evaluation against rolling windows',
      ],
      metrics: [
        { n: '2M/min', l: 'Events ingested' },
        { n: '<1s', l: 'Alert latency' },
        { n: '99.95%', l: 'Pipeline uptime' },
      ],
    },
    'edge-cache': {
      title: 'Edge Caching Layer',
      desc: 'A multi-region caching layer that keeps latency low without sacrificing the consistency guarantees the origin API depends on.',
      stack: [
        'Edge nodes across 6 regions with request coalescing',
        'Cache invalidation via origin write-through events',
        'Stale-while-revalidate for tail-latency smoothing',
        'Circuit breakers protecting origin during traffic spikes',
      ],
      metrics: [
        { n: '-63%', l: 'Median latency' },
        { n: '6', l: 'Edge regions' },
        { n: '94%', l: 'Cache hit rate' },
      ],
    },
    ingestion: {
      title: 'High-Throughput Ingestion API',
      desc: 'A horizontally-scaled write path built to absorb bursty traffic without dropping a single record or blocking upstream producers.',
      stack: [
        'Stateless API tier behind an autoscaling load balancer',
        'Write-ahead buffering with backpressure signaling',
        'Partitioned storage keyed for even shard distribution',
        'Load-tested to 3x projected peak before rollout',
      ],
      metrics: [
        { n: '120k/s', l: 'Peak requests' },
        { n: '0', l: 'Dropped writes' },
        { n: '<50ms', l: 'p99 write latency' },
      ],
    },
    'job-queue': {
      title: 'Fault-Tolerant Job Queue',
      desc: 'A durable, priority-aware queue that treats retries and dead-lettering as first-class behavior instead of an afterthought.',
      stack: [
        'Durable queue with visibility timeouts and exponential backoff',
        'Priority lanes to protect latency-sensitive jobs',
        'Dead-letter queue with replay tooling for operators',
        'Consumer autoscaling tied to queue depth',
      ],
      metrics: [
        { n: '99.99%', l: 'Delivery rate' },
        { n: '5', l: 'Priority lanes' },
        { n: '<5s', l: 'Failover time' },
      ],
    },
    'search-index': {
      title: 'Latency-Optimized Search Index',
      desc: 'A purpose-built inverted-index service tuned for full-text relevance at a latency budget general-purpose search engines could not hit.',
      stack: [
        'Custom inverted index with in-memory hot shards',
        'Tiered storage: hot in RAM, warm on NVMe, cold in object storage',
        'Query planner with early termination for top-k retrieval',
        'Continuous relevance evaluation against labeled query sets',
      ],
      metrics: [
        { n: '<15ms', l: 'p95 query time' },
        { n: '300M+', l: 'Indexed documents' },
        { n: '99.9%', l: 'Query availability' },
      ],
    },
  };

  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalStack = document.getElementById('modalStack');
  const modalMetrics = document.getElementById('modalMetrics');
  const modalClose = document.getElementById('modalClose');
  let lastFocused = null;

  function openModal(key, trigger) {
    const data = PROJECTS[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalStack.innerHTML = data.stack.map((item) => `<li>${item}</li>`).join('');
    modalMetrics.innerHTML = data.metrics
      .map(
        (m) =>
          `<div class="modal-metric"><span class="modal-metric-n">${m.n}</span><span class="modal-metric-l">${m.l}</span></div>`
      )
      .join('');

    lastFocused = trigger || document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion && hasGSAP) {
      const staggerTargets = [
        ...modalKickerAndTitle(),
        modalDesc,
        ...modalStack.children,
        ...modalMetrics.children,
      ];
      gsap.set(overlay, { opacity: 0 });
      gsap.set(modal, { opacity: 0, y: 18, scale: 0.97 });
      gsap.set(staggerTargets, { opacity: 0, y: 10 });
      gsap
        .timeline()
        .to(overlay, { opacity: 1, duration: 0.25, ease: 'power1.out' })
        .to(modal, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }, '-=0.15')
        .to(staggerTargets, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }, '-=0.15');
    }

    modalClose.focus();
    document.addEventListener('keydown', onModalKeydown);
  }

  function modalKickerAndTitle() {
    const kicker = document.getElementById('modalKicker');
    return [kicker, modalTitle].filter(Boolean);
  }

  function closeModal() {
    const finish = () => {
      overlay.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onModalKeydown);
      if (lastFocused) lastFocused.focus();
    };
    if (!prefersReducedMotion && hasGSAP) {
      gsap.to(modal, { opacity: 0, y: 12, scale: 0.98, duration: 0.2, ease: 'power1.in' });
      gsap.to(overlay, { opacity: 0, duration: 0.2, ease: 'power1.in', onComplete: finish });
    } else {
      finish();
    }
  }

  function onModalKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, a[href]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.openModal, btn));
  });

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  /* ============ CONTACT FORM ============ */
  // Fill these in once a Supabase project exists — see engineering-portfolio/README.md.
  const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const successCheck = document.getElementById('successCheck');
  const successCheckMark = successCheck ? successCheck.querySelector('.success-check-mark') : null;

  if (successCheckMark && successCheckMark.getTotalLength) {
    const len = successCheckMark.getTotalLength();
    successCheckMark.style.strokeDasharray = String(len);
    successCheckMark.style.strokeDashoffset = String(len);
  }

  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    details: { input: document.getElementById('details'), error: document.getElementById('detailsError') },
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(key, message) {
    const { input, error } = fields[key];
    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
    // Reserved min-height on .field-error (see styles.css) keeps this from
    // shifting the layout when it appears/disappears — a shift here can
    // move the submit button out from under an in-flight click.
    error.textContent = message || '';
  }

  function validateField(key) {
    const value = fields[key].input.value.trim();
    if (key === 'name') {
      if (!value) return setFieldError('name', 'Please enter your name.'), false;
      setFieldError('name', null);
      return true;
    }
    if (key === 'email') {
      if (!value) return setFieldError('email', 'Please enter your email.'), false;
      if (!EMAIL_RE.test(value)) return setFieldError('email', 'Enter a valid email address.'), false;
      setFieldError('email', null);
      return true;
    }
    if (key === 'details') {
      if (!value) return setFieldError('details', 'Tell me a little about the project.'), false;
      if (value.length < 10) return setFieldError('details', 'A few more details would help — 10 characters minimum.'), false;
      setFieldError('details', null);
      return true;
    }
    return true;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validateField(key));
  });

  function playSuccessCheck() {
    if (!successCheck) return;
    if (prefersReducedMotion || !hasGSAP) {
      successCheck.style.opacity = '1';
      if (successCheckMark) successCheckMark.style.strokeDashoffset = '0';
      return;
    }
    gsap.set(successCheck, { opacity: 0, scale: 0.7 });
    gsap
      .timeline()
      .to(successCheck, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' })
      .to(successCheckMark, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15');
  }

  function resetSuccessCheck() {
    if (!successCheck) return;
    successCheck.style.opacity = '0';
    if (successCheckMark && successCheckMark.getTotalLength) {
      successCheckMark.style.strokeDashoffset = String(successCheckMark.getTotalLength());
    }
  }

  function setStatus(message, state) {
    formStatus.textContent = message;
    if (state) {
      formStatus.dataset.state = state;
    } else {
      delete formStatus.dataset.state;
    }
    if (state === 'success') {
      playSuccessCheck();
    } else {
      resetSuccessCheck();
    }
  }

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.querySelector('.btn-label').textContent = isSubmitting ? 'Sending…' : 'Send Message';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validations = Object.keys(fields).map(validateField);
    if (validations.includes(false)) {
      setStatus('Please fix the highlighted fields.', 'error');
      return;
    }

    // Honeypot — if a bot filled the hidden "company" field, silently no-op.
    const honeypot = document.getElementById('company');
    if (honeypot && honeypot.value.trim() !== '') {
      setStatus('Thanks — your message has been sent.', 'success');
      form.reset();
      return;
    }

    if (SUPABASE_URL.startsWith('YOUR_') || SUPABASE_ANON_KEY.startsWith('YOUR_')) {
      setStatus('Form backend is not configured yet — see README.md to connect Supabase.', 'error');
      return;
    }

    setSubmitting(true);
    setStatus('Sending your message…');

    const payload = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      project_details: fields.details.input.value.trim(),
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      setStatus("Message received — I'll be in touch soon.", 'success');
      form.reset();
    } catch (err) {
      setStatus('Something went wrong sending your message. Please try again or email me directly.', 'error');
    } finally {
      setSubmitting(false);
    }
  });
})();
