// Theme toggle (light/dark)
(function() {
  const root = document.documentElement;
  const stored = localStorage.getItem('qec-theme');
  if (stored === 'light') root.setAttribute('data-theme', 'light');
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('qec-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('qec-theme', 'light');
      }
    });
  }
})();

// Hero video: skip the first 15 seconds and the last 10 seconds (loop within that window)
(function () {
  const v = document.getElementById('heroVideo');
  if (!v) return;
  const START = parseFloat(v.dataset.start || '0') || 0;
  const END_TRIM = parseFloat(v.dataset.endTrim || '0') || 0;
  const seekStart = () => { try { v.currentTime = START; } catch (e) {} };
  const clamp = () => {
    const dur = v.duration;
    const end = (dur && isFinite(dur)) ? dur - END_TRIM : Infinity;
    if (v.currentTime < START || v.currentTime >= end) seekStart();
  };
  v.addEventListener('loadedmetadata', clamp);
  v.addEventListener('timeupdate', clamp);
  if (v.readyState >= 1) clamp();
})();

// Nav scroll behavior
const nav = document.getElementById('nav');
let navTicking = false;
function onNavScroll() {
  if (navTicking) return;
  navTicking = true;
  requestAnimationFrame(() => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
    navTicking = false;
  });
}
window.addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();

// Mobile menu toggle
(function () {
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (!burger || !links) return;
  const setOpen = (open) => {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setOpen(!links.classList.contains('open')));
  // Close after tapping a real navigation link (not the Past Editions toggle)
  links.querySelectorAll('a[href^="#"], .nav-dropdown-menu a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });
})();

// Venue photo slideshow — cross-fade through HICC images every 4 seconds
(function() {
  const wrap = document.getElementById('venueSlides');
  if (!wrap) return;
  const slides = Array.from(wrap.querySelectorAll('img'));
  if (slides.length < 2) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 4000);
})();

// Tracks auto-cycle (left → right, 8s per card; pauses while hovering)
(function() {
  const grid = document.querySelector('.tracks-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.track-card'));
  if (!cards.length) return;
  const INTERVAL = 4500;
  let idx = 0;
  let timer = null;
  let hovering = false;

  function setActive(i) {
    cards.forEach((c, j) => c.classList.toggle('is-active', j === i));
  }
  function clearActive() {
    cards.forEach(c => c.classList.remove('is-active'));
  }
  function tick() {
    if (hovering) return;
    setActive(idx);
    idx = (idx + 1) % cards.length;
  }
  function start() {
    if (timer) return;
    tick();
    timer = setInterval(tick, INTERVAL);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  grid.addEventListener('mouseenter', () => {
    hovering = true;
    stop();
    clearActive();
  });
  grid.addEventListener('mouseleave', () => {
    hovering = false;
    start();
  });

  start();
})();

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Day tabs
// Countdown (ticks every second)
function updateCountdown() {
  const target = new Date('2026-12-11T09:00:00+05:30');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
  document.getElementById('cd-days').textContent = String(days);
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  var secs = Math.floor((diff % (1000*60)) / 1000);
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Count-up animation for stat numbers
function animateCountUp(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  // Ordinal suffixes (th/st/nd/rd) render as a superscript; symbols like "+" stay inline
  const suffixHtml = /^[a-z]+$/i.test(suffix) ? '<sup class="stat-suffix">' + suffix + '</sup>' : suffix;
  const duration = 2000;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.innerHTML = current.toLocaleString() + suffixHtml;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statEls = document.querySelectorAll('.stat-val[data-target]');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCountUp(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
statEls.forEach(el => statObserver.observe(el));

// Video testimonial player
const overlay = document.getElementById('videoPlayerOverlay');
const iframe = document.getElementById('videoPlayerIframe');
const closeBtn = document.getElementById('videoPlayerClose');

document.querySelectorAll('.video-testimonial, .tcard-video').forEach(card => {
  card.addEventListener('click', () => {
    const videoId = card.dataset.video;
    if (!videoId) return;
    iframe.style.display = 'block';
    iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
    overlay.classList.add('active');
  });
});

// Testimonials carousel arrows
(function () {
  const rail = document.getElementById('testimonialsRail');
  const prev = document.getElementById('tPrev');
  const next = document.getElementById('tNext');
  if (!rail || !prev || !next) return;
  const stepSize = () => {
    const card = rail.querySelector('.tcard');
    const gap = parseFloat(getComputedStyle(rail).columnGap || '24') || 24;
    return card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
  };
  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth - 2;
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max;
  };
  // Auto-scroll: advance every few seconds, loop to start at the end
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  const advance = () => {
    const max = rail.scrollWidth - rail.clientWidth - 2;
    if (rail.scrollLeft >= max) rail.scrollTo({ left: 0, behavior: 'smooth' });
    else rail.scrollBy({ left: stepSize(), behavior: 'smooth' });
  };
  const start = () => { if (reduce) return; stop(); timer = setInterval(advance, 4000); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  prev.addEventListener('click', () => { rail.scrollBy({ left: -stepSize() }); start(); });
  next.addEventListener('click', () => { rail.scrollBy({ left: stepSize() }); start(); });
  rail.addEventListener('scroll', update, { passive: true });
  rail.addEventListener('pointerenter', stop);
  rail.addEventListener('pointerleave', start);
  window.addEventListener('resize', update);
  update();
  start();
})();

// Hero "Watch Highlights" button opens the same overlay, playing the local hero reel
const watchHighlightsBtn = document.getElementById('watchHighlightsBtn');
const localVideo = document.getElementById('videoPlayerVideo');
if (watchHighlightsBtn) {
  watchHighlightsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    iframe.style.display = 'none';
    localVideo.style.display = 'block';
    localVideo.src = 'assets/video/herointronewvideo.mp4';
    overlay.classList.add('active');
    localVideo.play().catch(() => {});
  });
}

function closeVideoOverlay() {
  overlay.classList.remove('active');
  iframe.src = '';
  localVideo.pause();
  localVideo.removeAttribute('src');
  localVideo.load();
  localVideo.style.display = 'none';
  iframe.style.display = 'block';
}

closeBtn.addEventListener('click', closeVideoOverlay);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeVideoOverlay();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) closeVideoOverlay();
});

// Pop-up form modals (Become a Sponsor / Become a Speaker)
(function () {
  const openers = document.querySelectorAll('[data-open-modal]');
  if (!openers.length) return;
  let openEl = null;
  const open = (id) => {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('active');
    document.body.style.overflow = 'hidden';
    openEl = m;
    const first = m.querySelector('input, select, textarea');
    if (first) setTimeout(() => first.focus(), 50);
  };
  const close = () => {
    if (!openEl) return;
    openEl.classList.remove('active');
    document.body.style.overflow = '';
    openEl = null;
  };
  openers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    open(btn.dataset.openModal);
  }));
  document.querySelectorAll('.form-modal-overlay').forEach(ov => {
    ov.addEventListener('click', (e) => {
      if (e.target === ov || e.target.closest('[data-close-modal]')) close();
    });
    ov.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      f.innerHTML = '<div style="text-align:center;padding:24px 0;font-family:var(--font-ui);"><div style="font-size:40px;line-height:1">✓</div><p style="margin-top:12px;color:var(--text-secondary)">Thanks! We\'ve received your details and will be in touch soon.</p></div>';
    });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// Footer "Back to top"
var footerToTop = document.getElementById('footerToTop');
if (footerToTop) {
  footerToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Speaker talk: move the talk line into the image so it overlays the bottom on hover
document.querySelectorAll('.speaker-card').forEach(function (card) {
  var img = card.querySelector('.speaker-img');
  var talk = card.querySelector('.speaker-talk');
  if (img && talk) img.appendChild(talk);
});

// Sponsor logo fallback: swap broken/unavailable logo images for a clean text wordmark
document.querySelectorAll('.sponsor-logo img').forEach(function (img) {
  function toText() {
    if (!img.parentNode) return;
    var span = document.createElement('span');
    span.className = 'sponsor-name';
    span.textContent = img.getAttribute('alt') || '';
    img.replaceWith(span);
  }
  img.addEventListener('error', toText);
  if (img.complete && img.naturalWidth === 0) toText();
});
