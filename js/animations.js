(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasLibs = window.gsap && window.ScrollTrigger;

  // --- Build per-word spans for the event statement ---
  var statement = document.querySelector('.statement-text');
  if (statement) {
    var accent = (statement.getAttribute('data-accent') || '')
      .split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    var words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'word';
      var clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (accent.indexOf(clean) !== -1) span.classList.add('accent');
      span.textContent = w;
      statement.appendChild(span);
      if (i < words.length - 1) statement.appendChild(document.createTextNode(' '));
    });
  }

  if (reduceMotion || !hasLibs) {
    // No animation: leave statement fully readable (word colors come from CSS vars)
    document.querySelectorAll('.statement-text .word').forEach(function (el) {
      el.style.opacity = '1';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // --- Word-by-word reveal as the section scrolls through view ---
  // Animate opacity only; the ink color comes from CSS vars so it adapts to light/dark.
  var wordEls = document.querySelectorAll('.statement-text .word');
  if (wordEls.length) {
    gsap.to(wordEls, {
      ease: 'none',
      opacity: 1,
      stagger: { each: 0.25 },
      scrollTrigger: {
        trigger: '.event-statement',
        start: 'top top',
        end: '+=120%',
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1
      }
    });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
