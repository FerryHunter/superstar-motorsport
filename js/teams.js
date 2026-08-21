/* =========================================================
   Teams: render + interaction.
   Data: window.PSCI_TEAMS (js/teams-data.js)

   The layout follows how formula1.com/en/teams presents teams: one
   grid of cards, each card wearing its own team colour, the car along
   the bottom edge. The visual language stays Porsche though:
   off-black, 1px rules, uppercase letterspaced labels, one easing.

   Team colours never become CSS classes. Each card writes --c / --c2
   inline and the stylesheet reads those two variables, so adding a
   team only means adding an entry to js/teams-data.js.

   1. utils          4. summary table
   2. header         5. detail modal
   3. grid + filter  6. boot
   ========================================================= */
(function () {
  'use strict';

  var D = window.PSCI_TEAMS;
  if (!D) return;

  /* three-letter country code -> file in img/flags (flag-icons set, MIT).
     Mapping to assets is a presentation concern, so it lives here. */
  var FLAG = { IDN: 'id', SGP: 'sg', CHN: 'cn', AUS: 'au', MYS: 'my' };

  /* ---------- 1. utils ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function esc(v) {
    return String(v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function clsMod(c) {
    var k = String(c || '').toUpperCase();
    if (k === 'PRO') return 'pro';
    if (k === 'PRO AM') return 'proam';
    if (k === 'GT4') return 'gt4';
    return 'out';
  }
  function clsChip(c) {
    return '<span class="cls cls--' + clsMod(c) + '">' + esc(c) + '</span>';
  }
  function carNo(no) { return '<span class="carno">' + esc(no) + '</span>'; }

  function nat(code) {
    var iso = FLAG[code];
    if (!iso) return '<span class="nat"><span class="nat__c">' + esc(code) + '</span></span>';
    return '<span class="nat">' +
      '<img class="flag" src="img/flags/' + iso + '.svg" width="20" height="15" alt="" ' +
      'loading="lazy" decoding="async">' +
      '<span class="nat__c">' + esc(code) + '</span></span>';
  }

  /* source badge: green when the numbers come from 51GT3, amber for sample data */
  function srcBadge(src) {
    return src === '51gt3'
      ? '<span class="tsrc tsrc--51gt3">51GT3</span>'
      : '<span class="tsrc tsrc--sample">Sample</span>';
  }

  /* the colour variables every rule in css/teams.css reads */
  function colorVars(t) { return '--c:' + t.color + ';--c2:' + t.color2; }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- 2. header (drawer) ---------- */
  (function header() {
    var burger = $('#burger');
    var drawer = $('#drawer');
    var scrim  = $('#scrim');
    if (!burger || !drawer || !scrim) return;

    function isOpen() { return burger.getAttribute('aria-expanded') === 'true'; }

    function open() {
      drawer.hidden = false; scrim.hidden = false;
      requestAnimationFrame(function () {
        drawer.classList.add('is-on'); scrim.classList.add('is-on');
      });
      document.body.classList.add('is-locked');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      var first = $('a, button', drawer);
      if (first) first.focus();
    }
    function close(refocus) {
      drawer.classList.remove('is-on'); scrim.classList.remove('is-on');
      document.body.classList.remove('is-locked');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      setTimeout(function () {
        if (!drawer.classList.contains('is-on')) { drawer.hidden = true; scrim.hidden = true; }
      }, 400);
      if (refocus !== false) burger.focus();
    }

    burger.addEventListener('click', function () { isOpen() ? close() : open(); });
    $('#drawerClose').addEventListener('click', function () { close(); });
    scrim.addEventListener('click', function () { close(); });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { close(false); });
    });
    /* simple focus trap: Tab cycles inside the drawer while it is open */
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = $$('a[href], button', drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });
  }());

  /* ---------- page head ---------- */
  function paintHead() {
    var nDrivers = D.teams.reduce(function (n, t) { return n + t.drivers.length; }, 0);
    var nLivery  = D.teams.filter(function (t) { return t.liveries.length; }).length;

    $('#tLede').innerHTML = esc(D.meta.intro) +
      ' Figures for teams marked <b>51GT3</b> come from the <a href="' + esc(D.meta.source.url) +
      '" target="_blank" rel="noopener noreferrer">' + esc(D.meta.source.label) + '</a>.';

    /* the first three numbers are derived from the team list so they can
       never drift from the contents of js/teams-data.js */
    var stats = [
      { k: 'Teams',    v: String(D.teams.length) },
      { k: 'Drivers',  v: String(nDrivers) },
      { k: 'Liveries', v: String(nLivery) }
    ].concat(D.stats);

    $('#tStats').innerHTML = stats.map(function (s) {
      return '<div class="rstat"><p class="rstat__v">' + esc(s.v) + '</p>' +
             '<p class="rstat__k">' + esc(s.k) + '</p></div>';
    }).join('');

    $('#tSource').innerHTML =
      'Team names, drivers, car numbers, classes, and the podium/race/season counts for the six teams badged ' +
      '<b>51GT3</b> are taken from the <a href="' + esc(D.meta.source.url) +
      '" target="_blank" rel="noopener noreferrer">' + esc(D.meta.source.label) + '</a> (' +
      esc(D.meta.source.captured) + '). For teams badged <b>Sample</b>, the team name, colours, and sponsors were ' +
      'read straight off the livery artwork, but the driver names, car numbers, and every statistic are sample data. ' +
      esc(D.meta.liveryNote) + ' Each team colour was sampled from the pixels of its own livery PNG.';
  }

  /* ---------- 3. grid + filter ---------- */
  var state = { cls: 'all', sort: 'podium' };

  function match(t) {
    return state.cls === 'all' || t.classes.indexOf(state.cls) !== -1;
  }

  function sorted(list) {
    var by = state.sort;
    return list.slice().sort(function (a, b) {
      if (by === 'name') return a.name.localeCompare(b.name, 'en');
      var d = b.stats[by] - a.stats[by];
      if (d) return d;
      /* stable tie-break: podiums first, then name, so the order never
         shuffles between renders of the same data */
      d = b.stats.podium - a.stats.podium;
      return d || a.name.localeCompare(b.name, 'en');
    });
  }

  function driverRow(d) {
    return '<li class="tdrv">' + nat(d.nat) +
      '<span class="tdrv__n">' + esc(d.name) + '</span>' +
      '<span class="tdrv__no">' + carNo(d.no) + '</span></li>';
  }

  function card(t, i) {
    var noLivery = !t.liveries.length;
    return '<article class="tteam' + (noLivery ? ' tteam--nolivery' : '') +
        '" id="team-' + esc(t.id) + '" style="' + colorVars(t) + '">' +
      '<button class="tteam__hit" type="button" data-open="' + esc(t.id) + '" ' +
        'aria-label="View ' + esc(t.name) + ' details"></button>' +
      '<div class="tteam__body">' +
        '<div class="tteam__top">' +
          '<span class="tteam__rank">' + pad2(i + 1) + '</span>' +
          t.classes.map(clsChip).join('') +
          srcBadge(t.source) +
        '</div>' +
        '<h2 class="tteam__name">' + esc(t.name) + '</h2>' +
        '<p class="tteam__meta">' + esc(t.base) + ' · since ' + esc(t.since) + '</p>' +
        '<ul class="tteam__drivers">' + t.drivers.map(driverRow).join('') + '</ul>' +
        '<div class="tteam__stats">' +
          '<div><p class="tstat__v">' + t.stats.podium  + '</p><p class="tstat__k">Podiums</p></div>' +
          '<div><p class="tstat__v">' + t.stats.races   + '</p><p class="tstat__k">Races</p></div>' +
          '<div><p class="tstat__v">' + t.stats.seasons + '</p><p class="tstat__k">Seasons</p></div>' +
        '</div>' +
      '</div>' +
      '<div class="tteam__car">' +
        '<img src="' + esc(t.car) + '" width="1200" height="347" loading="lazy" decoding="async" alt="' +
          (noLivery
            ? 'Porsche 911 GT3 Cup silhouette. No ' + esc(t.name) + ' livery artwork available yet.'
            : 'Porsche 911 GT3 Cup in ' + esc(t.name) + ' livery, side view') + '">' +
      '</div>' +
      (noLivery ? '<span class="tteam__flag">No livery yet</span>' : '') +
    '</article>';
  }

  function paintGrid() {
    var list = sorted(D.teams.filter(match));
    var grid = $('#tGrid');

    if (!list.length) {
      grid.classList.add('tgrid--empty');
      grid.innerHTML = '<div class="empty"><p class="empty__t">No teams in this class</p>' +
        '<p class="empty__b">Pick another class, or go back to “All” to see all ' +
        D.teams.length + ' teams.</p></div>';
    } else {
      grid.classList.remove('tgrid--empty');
      grid.innerHTML = list.map(card).join('');
    }

    $('#tCount').textContent = list.length + ' of ' + D.teams.length + ' teams';
    $('#tLive').textContent = 'Showing ' + list.length + ' teams, sorted by ' + state.sort + '.';
    paintTable(list);
  }

  /* ---------- 4. summary table ---------- */
  function paintTable(list) {
    $('#tTable').innerHTML =
      '<thead><tr>' +
        '<th>Team</th><th>Class</th><th>Drivers</th><th>Car</th>' +
        '<th class="r">Podiums</th><th class="r">Races</th><th class="r">Seasons</th><th>Source</th>' +
      '</tr></thead><tbody>' +
      list.map(function (t) {
        return '<tr class="is-row" style="' + colorVars(t) + '" data-open="' + esc(t.id) + '" tabindex="0">' +
          '<td class="dt__name"><span class="dt__sw"></span>' + esc(t.name) + '</td>' +
          '<td>' + t.classes.map(clsChip).join(' ') + '</td>' +
          '<td>' + t.drivers.map(function (d) { return esc(d.name); }).join(', ') + '</td>' +
          '<td class="dt__nat">' + esc(t.model) + '</td>' +
          '<td class="r num">' + t.stats.podium + '</td>' +
          '<td class="r num">' + t.stats.races + '</td>' +
          '<td class="r num">' + t.stats.seasons + '</td>' +
          '<td>' + srcBadge(t.source) + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody>';
  }

  /* ---------- 5. detail modal ---------- */
  var modal = $('#tModal');
  var box   = $('#tmBox');
  var lastFocus = null;

  function modalHtml(t) {
    var noLivery = !t.liveries.length;
    var livs = t.liveries;

    return '<div class="tm__head">' +
      '<span class="tm__bar"></span>' +
      '<button class="tm__close" id="tmClose" type="button" aria-label="Close team details">' +
        '<svg class="ico"><use href="#i-close"/></svg></button>' +
      '<div class="tm__eyebrow">' + t.classes.map(clsChip).join('') + srcBadge(t.source) +
        (t.alt ? '<span class="tsrc tsrc--alt">Also written “' + esc(t.alt) + '”</span>' : '') +
      '</div>' +
      '<h2 class="tm__title" id="tmTitle">' + esc(t.name) + '</h2>' +
      '<p class="tm__sub">' + esc(t.base) + ' · since ' + esc(t.since) + ' · ' + esc(t.model) + '</p>' +
      '<div class="tm__car"><img id="tmCar" src="' + esc(noLivery ? t.car : livs[0].src) + '" ' +
        'width="1200" height="347" alt="' +
        (noLivery
          ? 'Porsche 911 GT3 Cup silhouette. No ' + esc(t.name) + ' livery artwork available yet.'
          : 'Porsche 911 GT3 Cup in ' + esc(t.name) + ' livery, side view') + '"></div>' +
    '</div>' +

    (livs.length > 1
      ? '<div class="tm__liv" role="group" aria-label="Choose livery">' +
          livs.map(function (l, i) {
            return '<button class="chip" type="button" data-liv="' + esc(l.src) + '" aria-pressed="' +
              (i === 0 ? 'true' : 'false') + '">' + esc(l.label) + '</button>';
          }).join('') +
        '</div>'
      : '') +

    '<div class="tm__grid">' +
      '<div class="tm__cell">' +
        '<p class="tm__k">About the team</p>' +
        '<p class="tm__about">' + esc(t.about) + '</p>' +
      '</div>' +
      '<div class="tm__cell">' +
        '<p class="tm__k">Record</p>' +
        '<div class="tm__facts">' +
          '<div><p class="tm__fv">' + t.stats.podium  + '</p><p class="tm__fk">Podiums</p></div>' +
          '<div><p class="tm__fv">' + t.stats.races   + '</p><p class="tm__fk">Races</p></div>' +
          '<div><p class="tm__fv">' + t.stats.seasons + '</p><p class="tm__fk">Seasons</p></div>' +
          '<div><p class="tm__fv">' + t.drivers.length + '</p><p class="tm__fk">Drivers</p></div>' +
        '</div>' +
      '</div>' +
      '<div class="tm__cell">' +
        '<p class="tm__k">Drivers</p>' +
        '<div class="tm__drv">' + t.drivers.map(function (d) {
          return '<div class="dcard">' +
            '<span class="dcard__no">' + esc(d.no) + '</span>' +
            '<div class="dcard__b"><p class="dcard__n">' + esc(d.name) + '</p>' +
            '<p class="dcard__m">' + nat(d.nat) + clsChip(d.cls) + '</p></div>' +
          '</div>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="tm__cell">' +
        '<p class="tm__k">Sponsors on the livery</p>' +
        (t.sponsors.length
          ? '<div class="tm__spon">' + t.sponsors.map(function (s) {
              return '<span class="spon">' + esc(s) + '</span>';
            }).join('') + '</div>'
          : '<p class="tm__none">No livery artwork on file yet, so the sponsors cannot be read off the car.</p>') +
      '</div>' +
      '<div class="tm__cell tm__cell--full">' +
        '<p class="tm__k">See also</p>' +
        '<a class="arrowlink" href="racing.html#team-standings">Full team standings on the Racing page ' +
        '<svg class="ico"><use href="#i-arrow"/></svg></a>' +
      '</div>' +
    '</div>';
  }

  function openModal(id) {
    var t = D.teams.filter(function (x) { return x.id === id; })[0];
    if (!t) return;

    lastFocus = document.activeElement;
    box.className = 'tmodal__box' + (t.liveries.length ? '' : ' tm--nolivery');
    box.setAttribute('style', colorVars(t));
    box.innerHTML = modalHtml(t);
    modal.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { modal.classList.add('is-on'); });

    var close = $('#tmClose');
    if (close) close.focus();
    box.scrollTop = 0;
  }

  function closeModal() {
    modal.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    setTimeout(function () {
      if (!modal.classList.contains('is-on')) { modal.hidden = true; box.innerHTML = ''; }
    }, 380);
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }

  function modalOpen() { return !modal.hidden; }

  /* ---------- bind ---------- */
  function bind() {
    /* one listener on document: cards and table rows are re-rendered on
       every filter change, so delegation beats per-element listeners */
    document.addEventListener('click', function (e) {
      var open = e.target.closest('[data-open]');
      if (open) { openModal(open.getAttribute('data-open')); return; }

      if (e.target.closest('#tmClose') || e.target.closest('#tmScrim')) { closeModal(); return; }

      var liv = e.target.closest('[data-liv]');
      if (liv) {
        var img = $('#tmCar');
        if (img) img.src = liv.getAttribute('data-liv');
        $$('[data-liv]', box).forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === liv));
        });
      }
    });

    /* table rows open with the keyboard too */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOpen()) { closeModal(); return; }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var row = e.target.closest('tr[data-open]');
      if (!row) return;
      e.preventDefault();
      openModal(row.getAttribute('data-open'));
    });

    /* modal focus trap */
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = $$('a[href], button', box).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    $('#tClasses').addEventListener('click', function (e) {
      var b = e.target.closest('[data-cls]');
      if (!b) return;
      state.cls = b.getAttribute('data-cls');
      $$('[data-cls]', this).forEach(function (x) {
        x.setAttribute('aria-pressed', String(x === b));
      });
      paintGrid();
    });

    $$('[data-sort]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.sort = b.getAttribute('data-sort');
        $$('[data-sort]').forEach(function (x) {
          x.setAttribute('aria-pressed', String(x === b));
        });
        paintGrid();
      });
    });
  }

  function paintFilters() {
    $('#tClasses').insertAdjacentHTML('beforeend',
      ['all'].concat(D.classes).map(function (c, i) {
        return '<button class="chip" type="button" data-cls="' + esc(c) + '" aria-pressed="' +
          (i === 0 ? 'true' : 'false') + '">' + (c === 'all' ? 'All' : esc(c)) + '</button>';
      }).join(''));
  }

  /* ---------- 6. boot ---------- */
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('no-motion');
  }

  paintHead();
  paintFilters();
  bind();
  paintGrid();

  /* deep link: teams.html#team-rukita opens that team's modal straight away */
  if (/^#team-/.test(location.hash)) openModal(location.hash.replace('#team-', ''));
}());
