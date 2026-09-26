/* OpenGeni landing v1 — behaviour
   1. Nav: frosted pill after 24px of scroll; slides out while the footer is on screen.
   2. Eased wheel scrolling (lerp). Trackpad momentum, touch, keyboard and scrollbar stay native.
   3. Copy-to-clipboard for the command button. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.getElementById('nav');
  var footer = document.querySelector('footer');

  /* 1. Nav state */
  function updateNav() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('is-scrolled', y > 24);
    var footerVisible = footer && footer.getBoundingClientRect().top < window.innerHeight;
    nav.classList.toggle('is-hidden', !!footerVisible);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  /* 2. Eased scrolling */
  var target = window.scrollY, current = target, raf = 0, active = false;
  function maxScroll() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
  function tick() {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.5) { current = target; active = false; window.scrollTo(0, current); return; }
    window.scrollTo(0, current);
    raf = requestAnimationFrame(tick);
  }
  function go(to) {
    if (!active) { current = window.scrollY; }
    target = Math.min(maxScroll(), Math.max(0, to));
    if (!active) { active = true; raf = requestAnimationFrame(tick); }
  }
  function cancel() { if (active) { cancelAnimationFrame(raf); active = false; } }

  if (!reduceMotion) {
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.metaKey) return;                       // pinch-zoom
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;      // horizontal
      e.preventDefault();
      var step = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      go((active ? target : window.scrollY) + step);
    }, { passive: false });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);
  }

  // In-page anchors: eased when motion is allowed, native otherwise.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    var top = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 24;
    if (reduceMotion) { window.scrollTo(0, top); } else { go(top); }
    history.replaceState(null, '', '#' + id);
  });

  /* 3. Copy command */
  var btn = document.getElementById('copy-cmd');
  if (btn) {
    var label = btn.querySelector('.cmd__label');
    var original = label.textContent;
    var timer = 0;
    btn.addEventListener('click', function () {
      var cmd = btn.getAttribute('data-cmd');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).catch(function () {});
      }
      label.textContent = 'copied to clipboard';
      clearTimeout(timer);
      timer = setTimeout(function () { label.textContent = original; }, 1600);
    });
  }
})();
