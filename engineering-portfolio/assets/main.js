(() => {
  'use strict';

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

  /* ============ SCROLL REVEAL ============ */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
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
    modalClose.focus();
    document.addEventListener('keydown', onModalKeydown);
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onModalKeydown);
    if (lastFocused) lastFocused.focus();
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

  function setStatus(message, state) {
    formStatus.textContent = message;
    if (state) {
      formStatus.dataset.state = state;
    } else {
      delete formStatus.dataset.state;
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
