/* =========================================================
   Porsche homepage — interactions
   1. helpers          5. reveal on scroll
   2. header state     6. counters
   3. mega menu        7. carousel (arrows / drag / progress / filter)
   4. mobile drawer    8. parallax  9. forms  10. cookie + to-top
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. helpers ---------- */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = function () { return window.matchMedia('(min-width: 1025px)').matches; };

  function raf(fn) {
    var queued = false;
    return function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; fn(); });
    };
  }

  /* ---------- 2. header state ---------- */
  var hdr = $('#hdr');
  var lastY = window.scrollY;

  var onScrollHeader = raf(function () {
    var y = window.scrollY;
    hdr.classList.toggle('is-solid', y > 40);

    var menuOpen = hdr.getAttribute('data-nav-open') === 'true' || document.body.classList.contains('is-locked');
    var goingDown = y > lastY + 4;
    var goingUp   = y < lastY - 4;

    if (!menuOpen && y > 400 && goingDown)      hdr.classList.add('is-hidden');
    else if (goingUp || y <= 400 || menuOpen)   hdr.classList.remove('is-hidden');

    lastY = y;
  });
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- 3. mega menu ---------- */
  var megaBtns   = $$('[data-mega]');
  var megaPanels = $$('[data-mega-panel]');
  var openMega   = null;
  var closeTimer = null;

  function setMega(name) {
    openMega = name;
    hdr.setAttribute('data-nav-open', name ? 'true' : 'false');

    megaPanels.forEach(function (p) {
      var on = p.getAttribute('data-mega-panel') === name;
      if (on) p.hidden = false;
      p.classList.toggle('is-open', on);
      if (!on) {
        // keep it in the flow until the collapse transition finishes
        window.setTimeout(function () { if (!p.classList.contains('is-open')) p.hidden = true; }, 450);
      }
    });
    megaBtns.forEach(function (b) {
      b.setAttribute('aria-expanded', String(b.getAttribute('data-mega') === name));
    });
  }

  megaBtns.forEach(function (btn) {
    var name = btn.getAttribute('data-mega');
    btn.addEventListener('click', function () { setMega(openMega === name ? null : name); });
    btn.addEventListener('mouseenter', function () {
      if (!desktop()) return;
      window.clearTimeout(closeTimer);
      setMega(name);
    });
  });

  hdr.addEventListener('mouseleave', function () {
    if (!desktop() || !openMega) return;
    closeTimer = window.setTimeout(function () { setMega(null); }, 220);
  });
  hdr.addEventListener('mouseenter', function () { window.clearTimeout(closeTimer); });

  document.addEventListener('click', function (e) {
    if (openMega && !hdr.contains(e.target)) setMega(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openMega) {
      setMega(null);
      var active = $('[data-mega][aria-expanded]');
      if (active) active.focus();
    }
  });

  /* ---------- 4. mobile drawer ---------- */
  var burger = $('#burger');
  var drawer = $('#drawer');
  var scrim  = $('#scrim');
  var dClose = $('#drawerClose');

  function openDrawer() {
    setMega(null);
    drawer.hidden = false;
    scrim.hidden = false;
    // next frame so the transition actually runs
    requestAnimationFrame(function () {
      drawer.classList.add('is-on');
      scrim.classList.add('is-on');
    });
    document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded', 'true');
    hdr.classList.remove('is-hidden');
    var first = $('a, button', drawer);
    if (first) first.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-on');
    scrim.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    burger.setAttribute('aria-expanded', 'false');
    window.setTimeout(function () {
      if (!drawer.classList.contains('is-on')) { drawer.hidden = true; scrim.hidden = true; }
    }, 450);
    burger.focus();
  }

  burger.addEventListener('click', function () {
    if (burger.getAttribute('aria-expanded') === 'true') closeDrawer(); else openDrawer();
  });
  dClose.addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') closeDrawer();
  });
  // close when navigating to an anchor
  $$('a[href^="#"]', drawer).forEach(function (a) { a.addEventListener('click', closeDrawer); });

  // focus trap inside the drawer
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var items = $$('a[href], button, input, select', drawer).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // drawer accordions
  $$('.acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  });

  /* ---------- 5. reveal on scroll ---------- */
  var revealables = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = en.target.getAttribute('data-reveal-delay');
        if (d) en.target.style.setProperty('--d', d + 'ms');
        en.target.classList.add('is-in');
        revealObs.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- 6. spec counters ---------- */
  var nums = $$('.num[data-count]');
  function runCount(el) {
    var target   = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduced) { el.textContent = target.toFixed(decimals); return; }

    var dur = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var numObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        runCount(en.target);
        numObs.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { numObs.observe(el); });
  } else {
    nums.forEach(runCount);
  }

  /* ---------- 7. carousel ---------- */
  var track = $('#track');
  var prev  = $('#prev');
  var next  = $('#next');
  var bar   = $('#progressBar');

  function step() {
    var card = track.querySelector('.card:not(.is-hidden)');
    if (!card) return track.clientWidth;
    var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  }

  var syncCarousel = raf(function () {
    var max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;

    var ratio = track.clientWidth / track.scrollWidth;
    var pos   = max > 0 ? track.scrollLeft / max : 0;
    bar.style.width = Math.min(ratio * 100, 100) + '%';
    bar.style.transform = 'translateX(' + (pos * (100 / Math.max(ratio, 0.0001) - 100)) + '%)';
  });

  prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }); });
  next.addEventListener('click', function () { track.scrollBy({ left:  step(), behavior: reduced ? 'auto' : 'smooth' }); });
  track.addEventListener('scroll', syncCarousel, { passive: true });
  window.addEventListener('resize', syncCarousel);
  syncCarousel();

  // keyboard support on the track itself
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev.click(); }
  });

  // pointer drag
  var dragging = false, startX = 0, startScroll = 0, moved = 0;
  track.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;      // let native touch scrolling handle it
    dragging = true; moved = 0;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    moved = Math.abs(dx);
    track.scrollLeft = startScroll - dx;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    if (e && e.pointerId != null && track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    syncCarousel();
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  // swallow the click that ends a real drag
  track.addEventListener('click', function (e) { if (moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);

  // filter tabs
  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.getAttribute('data-filter');
      $$('.tab').forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      $$('.card', track).forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
        card.classList.toggle('is-hidden', filter !== 'all' && cats.indexOf(filter) === -1);
      });
      track.scrollTo({ left: 0, behavior: reduced ? 'auto' : 'smooth' });
      syncCarousel();
    });
  });

  /* ---------- 8. parallax ---------- */
  var players = $$('[data-parallax]');
  if (!reduced && players.length) {
    var onScrollParallax = raf(function () {
      var vh = window.innerHeight;
      players.forEach(function (el) {
        var host = el.parentElement;
        var r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        // -1 .. 1 across the viewport, 0 when the section is centred
        var progress = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translate3d(0,' + (progress * speed * 100).toFixed(2) + 'px,0)';
      });
    });
    window.addEventListener('scroll', onScrollParallax, { passive: true });
    window.addEventListener('resize', onScrollParallax);
    onScrollParallax();
  }

  /* ---------- 9. forms (demo only — no network) ---------- */
  var finderForm = $('.finder__form');
  finderForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var model = $('#f-model').value;
    var loc   = $('#f-loc').value.trim();
    $('#finderHint').textContent = 'Demo only — would search ' + model.toLowerCase() +
      (loc ? ' near ' + loc : ' nationwide') + '.';
  });

  var newsForm = $('.news__form');
  newsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#n-mail');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    $('#newsHint').textContent = ok
      ? 'Thanks — demo form, nothing was sent.'
      : 'Please enter a valid email address.';
    input.setAttribute('aria-invalid', String(!ok));
  });

  /* ---------- 10. back-to-top + cookie banner ---------- */
  var totop = $('#totop');
  var onScrollTop = raf(function () { totop.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.8); });
  window.addEventListener('scroll', onScrollTop, { passive: true });
  onScrollTop();
  totop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  var cookie = $('#cookie');
  var KEY = 'p-cookie-choice';
  var stored = null;
  try { stored = window.localStorage.getItem(KEY); } catch (err) { stored = 'skip'; }

  if (!stored) {
    window.setTimeout(function () {
      cookie.hidden = false;
      requestAnimationFrame(function () { cookie.classList.add('is-on'); });
    }, 900);
  }
  $$('[data-cookie]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      try { window.localStorage.setItem(KEY, btn.getAttribute('data-cookie')); } catch (err) {}
      cookie.classList.remove('is-on');
      window.setTimeout(function () { cookie.hidden = true; }, 400);
    });
  });
})();
