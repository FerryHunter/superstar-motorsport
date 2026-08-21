/* =========================================================
   Superstars Motorsport: interactions
   1. helpers            6. gallery rail
   2. copy injection     7. partners
   3. hero scene         8. contact form
   4. milestones rail    9. modal
   5. series showcase   10. init + listeners
   ========================================================= */
(function () {
  'use strict';

  var D  = window.SSM;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('no-motion');

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var ramp  = function (v, a, b) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  var nav      = $('#nav');
  var stage    = $('#home');
  var heritage = $('#milestones');
  var showcase = $('#sprint-challenge');
  var about    = $('#about-us');
  var strip    = $('#strip');
  var odo      = $('#odo');
  var dots     = $('#dots');
  var teamRail = $('#teamRail');

  var state = { index: -1, season: D.series.seasons[0].id, cat: D.gallery[0].id, metrics: null };

  /* ---------- 2. copy injection ---------- */
  function fillCopy() {
    var b = D.brand, a = D.about, s = D.series;

    $('#aboutEyebrow').textContent = a.eyebrow;
    $('#aboutH1').textContent = a.heading[0];
    $('#aboutH2').textContent = a.heading[1];
    $('#aboutText').innerHTML = a.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    $('#aboutName').textContent = a.person.name;
    $('#aboutRole').textContent = a.person.role;

    $('#msLine1').textContent = D.milestonesStatement[0];
    $('#msLine2').textContent = D.milestonesStatement[1];

    $('#seriesH1').textContent = s.heading[0];
    $('#seriesH2').textContent = s.heading[1];

    $('#galLine1').textContent = D.galleryStatement[0];
    $('#galLine2').textContent = D.galleryStatement[1];

    $('#cAddress').innerHTML = b.address.map(esc).join('<br>');
    $('#cEmail').textContent = b.email;
    $('#cEmail').href = 'mailto:' + b.email;
    $('#cIg').textContent = b.instagram.handle;
    $('#cIg').href = b.instagram.url;

    $('#fLegal').textContent = b.legal;
    /* icon-only links: the value has to live in the label instead */
    $('#fEmail').href = 'mailto:' + b.email;
    $('#fEmail').setAttribute('aria-label', 'Email ' + b.email);
    $('#fEmail').title = b.email;
    $('#fIg').href = b.instagram.url;
    $('#fIg').setAttribute('aria-label', 'Instagram ' + b.instagram.handle);
    $('#fIg').title = 'Instagram ' + b.instagram.handle;
    $('#fCopy').textContent = '© ' + b.name + '. All rights reserved.';

    $('#drawerMail').href = 'mailto:' + b.email;
    $('#drawerIg').href = b.instagram.url;
    $('#drawerIg').querySelector('span').textContent = b.instagram.handle;
  }

  /* ---------- 4. milestones rail ---------- */
  function buildStrip() {
    strip.innerHTML = D.milestones.map(function (m, i) {
      return '' +
        '<figure class="frame" data-i="' + i + '">' +
          '<img src="' + m.img + '" width="1620" height="1080" loading="lazy" decoding="async" alt="' + esc(m.alt) + '">' +
          '<figcaption class="cap">' +
            '<span class="cap__bar" aria-hidden="true"><i></i></span>' +
            '<span class="cap__body">' +
              '<span class="cap__car">' + esc(m.caption) + '</span>' +
              '<span class="cap__event">' + m.year + ' · ' + esc(m.label) + '</span>' +
            '</span>' +
            '<button class="cap__x" type="button" data-expand="' + i + '" aria-label="More about ' + esc(m.caption) + '">' +
              '<svg class="ico"><use href="#i-expand"/></svg></button>' +
          '</figcaption>' +
        '</figure>';
    }).join('');

    dots.innerHTML = D.milestones.map(function (m, i) {
      return '<li><button type="button" data-go="' + i + '" aria-current="' + (i === 0) + '" ' +
             'aria-label="Go to ' + m.year + ', ' + esc(m.caption) + '"></button></li>';
    }).join('');
  }

  function buildOdo() {
    var html = '';
    for (var c = 0; c < 4; c++) {
      html += '<span class="odo__digit"><span class="odo__reel" style="--delay:' + (c * 70) + 'ms">';
      for (var d = 0; d < 10; d++) html += '<span>' + d + '</span>';
      html += '</span></span>';
    }
    odo.innerHTML = html;
  }

  function setActive(i) {
    if (i === state.index) return;
    state.index = i;
    var m = D.milestones[i];
    String(m.year).split('').forEach(function (ch, k) {
      var reel = $$('.odo__reel', odo)[k];
      if (reel) reel.style.setProperty('--d', ch);
    });
    $('#odoLive').textContent = m.year + ': ' + m.caption;
    $$('#dots button').forEach(function (b, bi) { b.setAttribute('aria-current', String(bi === i)); });
    $$('.frame', strip).forEach(function (f, fi) {
      var bar = $('.cap__bar i', f);
      if (bar) bar.style.width = fi === i ? '100%' : '0%';
    });
    $('#railPrev').disabled = i === 0;
    $('#railNext').disabled = i === D.milestones.length - 1;
  }

  /* ---------- 3. + scroll engine ---------- */
  function measure() {
    var vh = window.innerHeight;
    if (!reduced) heritage.style.height = (100 + D.milestones.length * 85) + 'vh';
    state.metrics = {
      vh: vh,
      stage:    { top: stage.offsetTop,    range: Math.max(stage.offsetHeight - vh, 1) },
      heritage: { top: heritage.offsetTop, range: Math.max(heritage.offsetHeight - vh, 1) },
      showcase: { top: showcase.offsetTop, range: Math.max(showcase.offsetHeight - vh, 1) },
      about:    { top: about.offsetTop,    h: about.offsetHeight },
      vw: window.innerWidth,
      stripMax: Math.max(strip.scrollWidth - window.innerWidth, 0)
    };
  }

  function progressOf(key, y) {
    var m = state.metrics[key];
    return clamp((y - m.top) / m.range, 0, 1);
  }

  function frameStyles(y) {
    var p = progressOf('stage', y);
    /* keep the zoom shallow: the source is 1621px wide, so magnifying it much
       past the viewport width is what makes the hero look soft */
    stage.style.setProperty('--cam', (1.06 - 0.06 * ramp(p, 0, 0.75)).toFixed(4));
    stage.style.setProperty('--pan', (-36 * ramp(p, 0, 1)).toFixed(2));
    stage.style.setProperty('--copy-o', (1 - ramp(p, 0.55, 0.85)).toFixed(3));

    /* only the ghost year drifts; the portrait stays put */
    var am = state.metrics.about;
    var apr = clamp((y + state.metrics.vh - am.top) / (state.metrics.vh + am.h), 0, 1);
    about.style.setProperty('--gp', ((apr - 0.5) * 120).toFixed(1));

    /* heritage choreography:
       0 .. ENTER  the statement holds centre stage while the strip slides in
                   from the right, blurring the statement away
       ENTER .. 1  the strip travels through the milestones as before          */
    var ENTER = 0.18;
    var hp = progressOf('heritage', y);
    var entered = ramp(hp, 0, ENTER);              /* 0 -> 1 as the strip arrives */
    var after = hp < ENTER ? 0 : (hp - ENTER) / (1 - ENTER);

    var x = hp < ENTER
      ? -state.metrics.vw * (1 - entered)          /* parked off-screen right */
      : after * state.metrics.stripMax;
    heritage.style.setProperty('--x', x.toFixed(1));
    heritage.style.setProperty('--stmt-o', (1 - entered).toFixed(3));
    heritage.style.setProperty('--stmt-blur', (entered * 16).toFixed(2));
    heritage.style.setProperty('--ui-o', entered.toFixed(3));

    var n = D.milestones.length;
    setActive(clamp(Math.round(after * (n - 1)), 0, n - 1));

    var sp = progressOf('showcase', y);
    var lit = ramp(sp, 0.02, 0.4);
    var ui  = ramp(sp, 0.38, 0.58);
    showcase.style.setProperty('--lit', lit.toFixed(3));
    showcase.style.setProperty('--title-o', ramp(sp, 0.06, 0.28).toFixed(3));
    showcase.style.setProperty('--hot-o', ui.toFixed(3));
    showcase.style.setProperty('--tools-o', ui.toFixed(3));
    showcase.style.setProperty('--tools-p', ui > 0.5 ? 'auto' : 'none');
  }

  var ticking = false;
  function onScroll() {
    if (reduced) return;
    /* rAF never fires while the page is hidden, so a flag cleared only inside
       the callback would stay stuck and freeze the scene for good */
    if (document.hidden) { frameStyles(window.scrollY); return; }
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; frameStyles(window.scrollY); });
  }

  function goTo(i) {
    if (reduced) {
      var f = $$('.frame', strip)[i];
      if (f) {
        var rail = $('.rail');
        rail.scrollTo({ left: f.offsetLeft - (rail.clientWidth - f.offsetWidth) / 2, behavior: 'auto' });
        setActive(i);
      }
      return;
    }
    var m = state.metrics.heritage;
    var n = D.milestones.length - 1;
    window.scrollTo({ top: m.top + (n ? (i / n) * m.range : 0), behavior: 'smooth' });
  }

  /* ---------- 5. series showcase ---------- */
  function currentSeason() {
    return D.series.seasons.filter(function (s) { return s.id === state.season; })[0];
  }

  function buildSeasons() {
    $('#seasonTabs').innerHTML = D.series.seasons.map(function (s, i) {
      return '<button class="model' + (i === 0 ? ' is-active' : '') + '" role="tab" ' +
             'aria-selected="' + (i === 0) + '" data-season="' + s.id + '">' + esc(s.name) + '</button>';
    }).join('');
    var jump = $('#seasonJump');
    if (jump) jump.innerHTML = D.series.seasons.map(function (s) {
      return '<li><a href="#sprint-challenge" data-jump="' + s.id + '">' + esc(s.name) + '</a></li>';
    }).join('');
    paintSeason();
  }

  function paintSeason() {
    var s = currentSeason();
    var img = $('#seasonImg');
    img.src = s.img;
    img.alt = s.alt;
    $('#hotspots').innerHTML = s.facts.map(function (f, i) {
      return '' +
        '<div class="hot" style="--hx:' + f.x + '%;--hy:' + f.y + '%">' +
          '<span class="hot__body"><span class="hot__t">' + esc(f.title) + '</span>' +
          '<span class="hot__s">' + esc(f.sub) + '</span></span>' +
          '<button class="hot__x" type="button" data-hot="' + i + '" aria-label="More about ' + esc(f.title) + '">' +
            '<svg class="ico"><use href="#i-expand"/></svg></button>' +
        '</div>';
    }).join('');
  }

  function setSeason(id) {
    if (!D.series.seasons.some(function (s) { return s.id === id; })) return;
    state.season = id;
    $$('.model').forEach(function (b) {
      var on = b.getAttribute('data-season') === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    paintSeason();
  }

  /* ---------- 6. gallery rail ---------- */
  function buildGallery() {
    $('#galleryTabs').innerHTML = D.gallery.map(function (g, i) {
      return '<button class="team' + (i === 0 ? ' is-active' : '') + '" role="tab" ' +
             'aria-selected="' + (i === 0) + '" data-cat="' + g.id + '">' + esc(g.name) + '</button>';
    }).join('');
    paintGallery();
  }

  function paintGallery() {
    var g = D.gallery.filter(function (x) { return x.id === state.cat; })[0];
    teamRail.innerHTML = g.photos.map(function (p, i) {
      return '' +
        '<figure class="tcard" style="--d:' + (i * 70) + 'ms">' +
          '<img src="' + p.img + '" width="1620" height="1080" loading="lazy" decoding="async" alt="' + esc(p.alt) + '">' +
          '<figcaption>' + esc(p.cap) + '</figcaption>' +
          '<button class="tcard__x" type="button" data-photo="' + i + '" aria-label="Enlarge: ' + esc(p.cap) + '">' +
            '<svg class="ico"><use href="#i-expand"/></svg></button>' +
        '</figure>';
    }).join('');
    teamRail.scrollTo({ left: 0, behavior: 'auto' });
    observe($$('.tcard', teamRail));
  }

  function setCat(id) {
    if (!D.gallery.some(function (g) { return g.id === id; })) return;
    state.cat = id;
    $$('.team').forEach(function (b) {
      var on = b.getAttribute('data-cat') === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    paintGallery();
  }

  /* ---------- news bento ---------- */
  function buildNews() {
    $('#bento').innerHTML = D.news.map(function (c, i) {
      return '' +
        '<article class="story" style="--area:' + c.area + ';--d:' + (i * 60) + 'ms" data-in>' +
          '<img class="story__img" src="' + c.img + '" loading="lazy" decoding="async" alt="' + esc(c.alt) + '">' +
          '<button class="story__x" type="button" data-story="' + i + '" aria-label="Open: ' + esc(c.title) + '">' +
            '<svg class="ico"><use href="#i-arrow"/></svg></button>' +
          '<div class="story__body">' +
            '<p class="story__cat">' + esc(c.cat) + '</p>' +
            '<h3 class="story__t">' + esc(c.title) + '</h3>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  /* ---------- 7. partners ---------- */
  function buildPartners() {
    $('#partnerWall').innerHTML = D.partners.map(function (p) {
      return '<li' + (p.boxed ? ' class="is-boxed"' : '') + '>' +
             '<img src="' + p.img + '" width="' + p.w + '" height="' + p.h + '" ' +
             'loading="lazy" decoding="async" alt="' + esc(p.name) + '"></li>';
    }).join('');
  }

  /* ---------- reveal ---------- */
  var revealObs = ('IntersectionObserver' in window) && !reduced
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var d = en.target.getAttribute('data-delay');
          if (d) en.target.style.setProperty('--d', d + 'ms');
          en.target.classList.add('is-in');
          revealObs.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    : null;

  function observe(els) {
    els.forEach(function (el) {
      if (revealObs) revealObs.observe(el); else el.classList.add('is-in');
    });
  }

  /* ---------- 9. modal ---------- */
  var modal = $('#modal');
  var lastFocus = null;

  function openModal(o) {
    lastFocus = document.activeElement;
    $('#modalEyebrow').textContent = o.eyebrow || '';
    $('#modalTitle').textContent = o.title || '';
    $('#modalText').textContent = o.text || '';
    var art = $('#modalArt');
    art.innerHTML = o.img ? '<img src="' + o.img + '" alt="' + esc(o.alt || '') + '" decoding="async">' : '';
    art.hidden = !o.img;

    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('is-on'); });
    document.body.classList.add('is-locked');
    nav.classList.add('is-tucked');
    $('.modal__x').focus();
  }

  function closeModal() {
    modal.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    nav.classList.remove('is-tucked');
    window.setTimeout(function () {
      if (!modal.classList.contains('is-on')) modal.hidden = true;
    }, 500);
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var items = $$('button, a[href]', modal).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- nav panel ---------- */
  var panels = $('#panels');
  var openPanel = null;

  function setPanel(name) {
    if (!panels) return;          /* dropdown was removed from the markup */
    openPanel = name;
    if (name) panels.hidden = false;
    panels.classList.toggle('is-open', !!name);
    $$('.panel').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-panel-body') === name);
    });
    $$('[data-panel]').forEach(function (b) {
      b.setAttribute('aria-expanded', String(b.getAttribute('data-panel') === name));
    });
    if (!name) window.setTimeout(function () { if (!openPanel) panels.hidden = true; }, 500);
  }

  /* ---------- 10. init ---------- */
  fillCopy();
  buildStrip();
  buildOdo();
  buildSeasons();
  buildGallery();
  buildNews();
  buildPartners();
  measure();
  setActive(0);
  observe($$('[data-in]'));
  if (!reduced) frameStyles(window.scrollY);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  window.addEventListener('load', function () { measure(); onScroll(); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    ticking = false;          /* release a frame that never ran */
    measure();
    onScroll();
  });

  if (reduced) {
    $('.rail').addEventListener('scroll', function () {
      var rail = this, mid = rail.scrollLeft + rail.clientWidth / 2, best = 0, bestD = Infinity;
      $$('.frame', strip).forEach(function (f, i) {
        var d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setActive(best);
    }, { passive: true });
  }

  /* milestone rail controls */
  $('#railPrev').addEventListener('click', function () { goTo(Math.max(state.index - 1, 0)); });
  $('#railNext').addEventListener('click', function () { goTo(Math.min(state.index + 1, D.milestones.length - 1)); });
  dots.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]');
    if (b) goTo(parseInt(b.getAttribute('data-go'), 10));
  });
  strip.addEventListener('click', function (e) {
    var b = e.target.closest('[data-expand]');
    if (!b) return;
    var m = D.milestones[parseInt(b.getAttribute('data-expand'), 10)];
    openModal({ eyebrow: m.year + ' · ' + m.label, title: m.caption, text: m.text, img: m.img, alt: m.alt });
  });

  /* showcase */
  $('#seasonTabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-season]');
    if (b) setSeason(b.getAttribute('data-season'));
  });
  $('#hotspots').addEventListener('click', function (e) {
    var b = e.target.closest('[data-hot]');
    if (!b) return;
    var s = currentSeason();
    var f = s.facts[parseInt(b.getAttribute('data-hot'), 10)];
    openModal({ eyebrow: s.name, title: f.title, text: f.text });
  });

  var hotToggle = $('#hotToggle');
  hotToggle.addEventListener('click', function () {
    var on = hotToggle.getAttribute('aria-pressed') === 'true';
    hotToggle.setAttribute('aria-pressed', String(!on));
    hotToggle.setAttribute('aria-label', on ? 'Show details' : 'Hide details');
    $('#hotspots').hidden = on;
    $('use', hotToggle).setAttribute('href', on ? '#i-eye-off' : '#i-eye');
  });

  $('#explore').addEventListener('click', function () {
    var s = currentSeason();
    openModal({
      eyebrow: D.series.eyebrow,
      title: s.name,
      text: s.facts.map(function (f) { return f.title + ': ' + f.text; }).join(' '),
      img: s.img,
      alt: s.alt
    });
  });

  /* hero chip */
  $('#thumbchip').addEventListener('click', function () {
    openModal({
      eyebrow: D.series.eyebrow,
      title: 'The grid at Mandalika',
      text: 'The full Porsche Sprint Challenge Indonesia field lined up on the start-finish straight.',
      img: 'img/hero-b.webp',
      alt: 'Full grid of Porsche race cars lined up on the Mandalika start-finish straight'
    });
  });

  /* gallery */
  $('#galleryTabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (b) setCat(b.getAttribute('data-cat'));
  });
  teamRail.addEventListener('click', function (e) {
    var b = e.target.closest('[data-photo]');
    if (!b) return;
    var g = D.gallery.filter(function (x) { return x.id === state.cat; })[0];
    var p = g.photos[parseInt(b.getAttribute('data-photo'), 10)];
    openModal({ eyebrow: g.name, title: p.cap, text: p.alt, img: p.img, alt: p.alt });
  });

  /* gallery rail: pointer drag + arrow keys */
  (function () {
    var down = false, startX = 0, startScroll = 0, moved = 0;
    teamRail.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; moved = 0;
      startX = e.clientX; startScroll = teamRail.scrollLeft;
      teamRail.classList.add('is-dragging');
      teamRail.setPointerCapture(e.pointerId);
    });
    teamRail.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      teamRail.scrollLeft = startScroll - dx;
    });
    function up(e) {
      if (!down) return;
      down = false;
      teamRail.classList.remove('is-dragging');
      if (e && e.pointerId != null && teamRail.hasPointerCapture(e.pointerId)) teamRail.releasePointerCapture(e.pointerId);
    }
    teamRail.addEventListener('pointerup', up);
    teamRail.addEventListener('pointercancel', up);
    teamRail.addEventListener('click', function (e) { if (moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
    teamRail.addEventListener('keydown', function (e) {
      var card = $('.tcard', teamRail);
      var stepW = card ? card.getBoundingClientRect().width + 24 : 300;
      if (e.key === 'ArrowRight') { e.preventDefault(); teamRail.scrollBy({ left:  stepW }); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); teamRail.scrollBy({ left: -stepW }); }
    });
  })();

  /* news cards */
  $('#bento').addEventListener('click', function (e) {
    var b = e.target.closest('[data-story]');
    if (!b) return;
    var c = D.news[parseInt(b.getAttribute('data-story'), 10)];
    openModal({ eyebrow: c.cat, title: c.title, text: c.text, img: c.img, alt: c.alt });
  });

  /* nav panel */
  $$('[data-panel]').forEach(function (b) {
    b.addEventListener('click', function () {
      var name = b.getAttribute('data-panel');
      setPanel(openPanel === name ? null : name);
    });
  });
  if ($('#seasonJump')) {
    $('#seasonJump').addEventListener('click', function (e) {
      var a = e.target.closest('[data-jump]');
      if (!a) return;
      setSeason(a.getAttribute('data-jump'));
      setPanel(null);
    });
  }
  document.addEventListener('click', function (e) {
    if (openPanel && !e.target.closest('#panels') && !e.target.closest('[data-panel]')) setPanel(null);
  });

  /* ---------- side menu (mobile) ---------- */
  var burger = $('#burger');
  var drawer = $('#drawer');
  var scrim  = $('#scrim');

  function openDrawer() {
    setPanel(null);
    drawer.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(function () {
      drawer.classList.add('is-on');
      scrim.classList.add('is-on');
    });
    document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    var first = $('a, button', drawer);
    if (first) first.focus();
  }

  function closeDrawer(refocus) {
    drawer.classList.remove('is-on');
    scrim.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    window.setTimeout(function () {
      if (!drawer.classList.contains('is-on')) { drawer.hidden = true; scrim.hidden = true; }
    }, 500);
    if (refocus !== false) burger.focus();
  }

  function drawerOpen() { return burger.getAttribute('aria-expanded') === 'true'; }

  burger.addEventListener('click', function () { drawerOpen() ? closeDrawer() : openDrawer(); });
  $('#drawerClose').addEventListener('click', function () { closeDrawer(); });
  scrim.addEventListener('click', function () { closeDrawer(); });
  /* let the anchor jump happen, just get out of the way */
  $$('a[href^="#"]', drawer).forEach(function (a) {
    a.addEventListener('click', function () { closeDrawer(false); });
  });
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var items = $$('a[href], button', drawer).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- 8. contact form (no backend: hands over to email) ---------- */
  $('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#f-name'), mail = $('#f-email'), msg = $('#f-msg'), hint = $('#formHint');
    var okMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
    var missing = [];
    if (!name.value.trim()) missing.push('name');
    if (!okMail) missing.push('a valid email');
    if (!msg.value.trim()) missing.push('a message');

    [[name, !name.value.trim()], [mail, !okMail], [msg, !msg.value.trim()]].forEach(function (pair) {
      pair[0].setAttribute('aria-invalid', String(pair[1]));
    });

    if (missing.length) {
      hint.innerHTML = 'Please add ' + esc(missing.join(', ')) + '.';
      return;
    }
    var href = 'mailto:' + D.brand.email +
      '?subject=' + encodeURIComponent('Website enquiry from ' + name.value.trim()) +
      '&body=' + encodeURIComponent(msg.value.trim() + '\n\n' + name.value.trim() + '\n' + mail.value.trim());
    hint.innerHTML = 'This build has no server, so nothing was sent. ' +
      '<a href="' + href + '">Open this message in your email app</a> or write to ' +
      '<a href="mailto:' + D.brand.email + '">' + D.brand.email + '</a>.';
  });

  /* global keys + modal close */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal();
    else if (drawerOpen()) closeDrawer();
    else if (openPanel) setPanel(null);
  });
  $$('[data-close]', modal).forEach(function (el) { el.addEventListener('click', closeModal); });
})();
