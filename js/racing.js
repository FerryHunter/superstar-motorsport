/* =========================================================
   Racing hub: render + interaction.
   Data: window.PSCI (js/racing-data.js)

   The page follows how Formula1.com splits race data (a card per
   calendar round, results per session, standings as tables), but the
   whole presentation uses the Porsche design language: off-black, 1px
   rules, uppercase letterspaced labels, red only for the active state,
   one easing and two durations.

   1. utils         4. standings panels
   2. header        5. results + qualifying panels
   3. calendar      6. tabs + season + boot
   ========================================================= */
(function () {
  'use strict';

  var D = window.PSCI;
  if (!D) return;

  /* three-letter country code -> file in img/flags (flag-icons set, MIT).
     Mapping to assets is presentation, so it lives here, not in the data. */
  var FLAG = { IDN: 'id', SGP: 'sg', CHN: 'cn', AUS: 'au', MYS: 'my' };

  /* ---------- 1. util ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function esc(v) {
    return String(v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* PRO / PRO AM / GT4 -> chip modifier name */
  function clsMod(c) {
    if (!c) return 'out';
    var k = c.toUpperCase();
    if (k === 'PRO') return 'pro';
    if (k === 'PRO AM') return 'proam';
    if (k === 'GT4') return 'gt4';
    return 'out';
  }
  function clsChip(c) {
    return '<span class="cls cls--' + clsMod(c) + '">' + esc(c) + '</span>';
  }
  /* non-numeric positions (DNF/DNS/DSQ) are flagged so they are not read as a rank */
  function isOut(pos) { return !/^\d+$/.test(String(pos)); }
  function posCell(pos) {
    return '<td class="dt__pos' + (isOut(pos) ? ' dt__pos--out' : '') + '">' + esc(pos) + '</td>';
  }
  function nameCell(driver, team) {
    return '<td class="dt__name">' + esc(driver) +
           '<span class="dt__sub">' + esc(team) + '</span></td>';
  }
  function carNo(no) { return '<span class="carno">' + esc(no) + '</span>'; }

  /* Flag + country code. Codes missing from the map (a driver whose
     nationality the source does not record) show as the code alone. */
  function nat(code, label, flagOnly) {
    var iso = FLAG[code];
    var txt = flagOnly ? '' : '<span class="nat__c">' + esc(code) + '</span>';
    if (!iso) return '<span class="nat">' + esc(code) + '</span>';
    return '<span class="nat">' +
      '<img class="flag" src="img/flags/' + iso + '.svg" width="20" height="15" alt="" ' +
      'loading="lazy" decoding="async">' + txt +
      (label ? '<span class="sr-only"> ' + esc(label) + '</span>' : '') +
    '</span>';
  }

  /* "02:08.734" -> 128.734 seconds. Anything that is not a time returns null. */
  function toSec(t) {
    var m = /^(\d+):(\d+)\.(\d+)$/.exec(String(t).trim());
    if (!m) return null;
    return (+m[1]) * 60 + (+m[2]) + (+m[3]) / 1000;
  }
  function gapText(t, best) {
    var s = toSec(t);
    /* the leader has no gap to show, and a value that will not parse is
       reported as unknown rather than as a zero gap */
    if (s === null || best === null) return 'N/A';
    if (s === best) return '';
    return '+' + (s - best).toFixed(3);
  }

  function emptyBlock(kind, year) {
    /* a season with no schedule needs a different explanation from one that
       has a schedule but whose result documents have not landed yet */
    if (kind !== 'calendar' && !(D.calendar[year] || []).length) kind = 'noSeason';
    var e = D.empty[kind];
    return '<div class="empty">' +
      '<p class="empty__t">' + esc(e.title.replace('{year}', year)) + '</p>' +
      '<p class="empty__b">' + esc(e.body) + '</p>' +
      '</div>';
  }

  var live = $('#rLive');
  function announce(msg) { if (live) live.textContent = msg; }

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

  /* The navbar height grows with --pad, so the 64px token is not always right
     and the sticky tab rail can end up under it. Measure the element instead. */
  (function navHeight() {
    var nav = $('#nav');
    if (!nav) return;
    var apply = function () {
      document.documentElement.style.setProperty('--nav-h', Math.round(nav.offsetHeight) + 'px');
    };
    apply();
    if (window.ResizeObserver) new ResizeObserver(apply).observe(nav);
    else window.addEventListener('resize', apply);
    window.addEventListener('load', apply);
  }());

  /* ---------- page head ---------- */
  function paintHead() {
    $('#rLede').innerHTML = esc(D.meta.intro) +
      ' Every figure on this page comes from the <a href="' + esc(D.meta.source.url) +
      '" target="_blank" rel="noopener noreferrer">' + esc(D.meta.source.label) + '</a>.';

    $('#rStats').innerHTML = D.stats.map(function (s) {
      return '<div class="rstat"><p class="rstat__v">' + esc(s.v) + '</p>' +
             '<p class="rstat__k">' + esc(s.k) + '</p></div>';
    }).join('');

    $('#rSource').innerHTML =
      'Data source: <a href="' + esc(D.meta.source.url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(D.meta.source.label) + '</a>, retrieved ' + esc(D.meta.source.captured) +
      '. Team and driver standings use the 51GT3 metrics (total podiums, races, seasons) rather than championship points: the series publishes no points table in that database. ' +
      'The gap column in qualifying is computed here from the lap times of the same session. ' +
      'Track outlines are redrawn from <a href="' + esc(D.meta.source.mapSource.url) +
      '" target="_blank" rel="noopener noreferrer">' + esc(D.meta.source.mapSource.label) + '</a> geometry (ODbL). ' +
      'The series summary lists 7 teams and 8 drivers, while the entries actually on record number ' +
      D.teams.length + ' teams and ' + D.drivers.length + ' drivers. That gap sits on the source side and is not papered over here.';
  }

  /* ---------- ticker: hitung mundur putaran berikutnya ----------
     Bentuknya mengikuti strip acara di formula1.com (bendera, tempat, nama
     putaran, lalu satuan waktu berjalan). Isinya murni dari kalender: kalau
     tidak ada putaran berjadwal, strip ini mengatakan jadwalnya belum ada,
     bukan memasang tanggal karangan. */
  function datedEvents() {
    var out = [];
    D.seasons.forEach(function (y) {
      (D.calendar[y] || []).forEach(function (ev) {
        if (ev.start) out.push({ year: y, ev: ev });
      });
    });
    return out.sort(function (a, b) { return a.ev.start < b.ev.start ? -1 : 1; });
  }

  function startOf(ev) { return new Date(ev.start + 'T00:00:00').getTime(); }
  function endOf(ev)   { return new Date((ev.end || ev.start) + 'T23:59:59').getTime(); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function paintTicker() {
    var box = $('#ticker');
    if (!box) return;
    var list = datedEvents();
    var now = Date.now();

    var upcoming = null, running = null, last = null;
    list.forEach(function (it) {
      if (endOf(it.ev) < now) { last = it; return; }
      if (startOf(it.ev) <= now) { if (!running) running = it; return; }
      if (!upcoming) upcoming = it;
    });

    var pendingSeason = D.seasons.filter(function (y) { return !(D.calendar[y] || []).length; })[0];
    var shown = running || upcoming || last;
    if (!shown) { box.hidden = true; setBarHeight(); return; }

    var ev = shown.ev, c = D.circuits[ev.circuit];
    var label = running ? 'Race weekend' : upcoming ? 'Next round' : 'Latest round';

    $('#tickerPlace').innerHTML =
      '<span class="ticker__k">' + label + '</span>' +
      nat(ev.code, ev.country, true) +
      '<span class="ticker__p">' + esc(c.short) + '</span>' +
      '<span class="ticker__sep" aria-hidden="true">\u203a</span>' +
      '<span class="ticker__ev">' + (running || upcoming
        ? esc(/test/i.test(ev.note || '') ? 'Testing' : 'Round ' + ev.round)
        : esc(ev.dates) + ' ' + esc(shown.year)) + '</span>';

    $('#tickerMeta').innerHTML = running || upcoming
      ? esc(ev.dates) + ' ' + esc(shown.year)
      : (pendingSeason
          ? '<span class="ticker__tba">' + esc(pendingSeason) + ' calendar</span>' +
            '<span class="badge badge--tba">Coming soon</span>'
          : '');

    box.hidden = false;
    setBarHeight();

    if (upcoming && !running) startClock(startOf(upcoming.ev));
    else stopClock(running ? 'Under way'
                           : (pendingSeason ? 'Schedule not announced' : '\u2014'));
  }

  var clockTimer = null;
  function stopClock(text) {
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
    $('#tickerClock').innerHTML = '<span class="ticker__flat">' + esc(text) + '</span>';
    $('#tickerSr').textContent = text === '\u2014' ? '' : text;
  }

  function startClock(target) {
    if (clockTimer) clearInterval(clockTimer);
    var srAt = 0;

    function unit(v, u) {
      return '<span class="ticker__u"><b>' + pad(v) + '</b><i>' + u + '</i></span>';
    }

    function tick() {
      var left = target - Date.now();
      if (left <= 0) { paintTicker(); return; }   /* lewat tengah malam: state dihitung ulang */
      var s = Math.floor(left / 1000);
      var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600),
          m = Math.floor(s % 3600 / 60), sec = s % 60;

      $('#tickerClock').innerHTML =
        (d ? unit(d, 'd') : '') + unit(h, 'h') + unit(m, 'm') + unit(sec, 's');

      /* Detik yang berdetak tidak dibacakan: layar pembaca cuma dapat kabar
         sekali per menit, lewat teks ringkas di luar clock. */
      if (Date.now() - srAt > 60000) {
        srAt = Date.now();
        $('#tickerSr').textContent =
          'Next round in ' + (d ? d + ' days ' : '') + h + ' hours ' + m + ' minutes';
      }
    }
    tick();
    clockTimer = setInterval(tick, 1000);
  }

  /* tab rail menempel di bawah navbar + ticker, jadi tingginya diukur */
  function setBarHeight() {
    var box = $('#ticker');
    var h = box && !box.hidden ? Math.round(box.offsetHeight) : 0;
    document.documentElement.style.setProperty('--bar-h', h + 'px');
  }

  /* ---------- 3. calendar ---------- */

  /* Mini podium on the round card: the overall top three from that round's
     last race, following the F1 calendar-card pattern. The class is written
     out too, because this series runs several classes on one grid. */
  function podiumFor(ev, year) {
    if (!ev.event) return null;
    var groups = D.races.filter(function (g) {
      return g.year === year && g.event === ev.event && g.circuit === ev.circuit;
    });
    if (!groups.length) return null;
    var last = groups[groups.length - 1];
    var top = last.rows.filter(function (r) { return /^[123]$/.test(r.pos); })
      .sort(function (a, b) { return (+a.pos) - (+b.pos); });
    if (!top.length) return null;
    return { session: last.session, rows: top.slice(0, 3) };
  }

  function roundCard(ev, year) {
    var c = D.circuits[ev.circuit];
    var badge = ev.flags.indexOf('results') > -1 ? 'results'
              : ev.flags.indexOf('provisional') > -1 ? 'provisional' : 'done';
    var pod = podiumFor(ev, year);
    var testing = /test/i.test(ev.note || '');
    var ORD = ['1st', '2nd', '3rd'];

    /* Three-box podium strip, following the F1 schedule card. The value
       column holds the class, not a race time: the source records no
       finishing times. */
    var strip = pod
      ? '<div class="round__podium">' + pod.rows.map(function (r, i) {
          return '<div class="pod">' +
            '<span class="pod__p">' + ORD[i].charAt(0) + '<sup>' + ORD[i].slice(1) + '</sup></span>' +
            '<span class="pod__b">' +
              '<span class="pod__n" title="' + esc(r.driver) + '">' + esc(r.driver) + '</span>' +
              '<span class="pod__v">' + esc(r.cls) + '</span>' +
            '</span></div>';
        }).join('') + '</div>'
      : '<p class="round__none">No official results recorded</p>';

    return '<article class="round">' +
      '<div class="round__top">' +
        '<span class="round__no">' + (testing ? 'Testing' : 'Round ' + ev.round) + '</span>' +
        '<span class="badge badge--' + badge + '">' + esc(ev.label) + '</span>' +
        '<span class="round__date"><svg class="ico" aria-hidden="true"><use href="#i-flag"/></svg>' +
          esc(ev.dates) + '</span>' +
      '</div>' +
      '<div class="round__body">' +
        '<h3 class="round__place">' + nat(ev.code, ev.country, true) +
          '<span>' + esc(c.short) + '</span></h3>' +
        '<p class="round__event">' +
          esc(D.meta.series + (ev.event ? ' ' + ev.event : '') + ' ' + year) + '</p>' +
        '<p class="round__where">' + esc(c.name) + ' · ' + esc(ev.country) +
          (ev.note ? ' · ' + esc(ev.note) : '') + '</p>' +
      '</div>' + strip +
    '</article>';
  }

  function paintCalendar(year) {
    var list = D.calendar[year] || [];
    $('#calTitle').textContent = year + ' race calendar';
    $('#calNote').textContent = list.length
      ? list.length + ' rounds · ' + uniqueCircuits(list) + ' circuits'
      : 'No rounds on record';

    $('#calBody').innerHTML = list.length
      ? '<div class="rounds">' + list.map(function (ev) { return roundCard(ev, year); }).join('') + '</div>'
      : emptyBlock('calendar', year);

    paintFocus();
    paintTracks();
  }

  function uniqueCircuits(list) {
    var seen = {};
    list.forEach(function (e) { seen[e.circuit] = 1; });
    return Object.keys(seen).length;
  }

  /* Focus strip: last round, next round, latest official results. It reads the
     same ISO dates as the ticker, so the two can never disagree about which
     round comes next. */
  function paintFocus() {
    var list = datedEvents();
    var now = Date.now();
    var past = list.filter(function (it) { return endOf(it.ev) < now; });
    var future = list.filter(function (it) { return startOf(it.ev) > now; });
    var last = past[past.length - 1];
    var next = future[0];
    var pending = D.seasons.filter(function (y) { return !(D.calendar[y] || []).length; })[0];

    var withResults = null, resultYear = null;
    D.seasons.forEach(function (y) {
      (D.calendar[y] || []).forEach(function (ev) {
        if (ev.flags.indexOf('results') > -1 && !withResults) { withResults = ev; resultYear = y; }
      });
    });

    function statusBadge(ev) {
      return '<span class="badge badge--' +
        (ev.flags.indexOf('provisional') > -1 ? 'provisional' : 'done') + '">' +
        esc(ev.label) + '</span>';
    }

    var cells = [];

    if (last) {
      cells.push(
        '<div class="focus__cell">' +
          '<p class="focus__k">Latest round</p>' +
          '<p class="focus__v">' + esc(last.ev.dates) + ' ' + esc(last.year) + '</p>' +
          '<p class="focus__m">' + esc(D.circuits[last.ev.circuit].name) + '</p>' +
          '<p class="focus__cta">' + statusBadge(last.ev) + '</p>' +
        '</div>');
    }

    cells.push(
      '<div class="focus__cell">' +
        '<p class="focus__k">Next round</p>' +
        '<p class="focus__v">' + (next ? esc(next.ev.dates) + ' ' + esc(next.year) : 'TBA') + '</p>' +
        '<p class="focus__m">' + (next
          ? esc(D.circuits[next.ev.circuit].name)
          : (pending ? 'The ' + esc(pending) + ' calendar has not been announced'
                     : 'No rounds scheduled')) + '</p>' +
        '<p class="focus__cta">' + (next
          ? statusBadge(next.ev)
          : '<span class="badge badge--tba">Coming soon</span>') + '</p>' +
      '</div>');

    if (withResults) {
      var wTrack = D.circuits[withResults.circuit];
      cells.push(
        '<div class="focus__cell">' +
          '<p class="focus__k">Latest official results</p>' +
          '<p class="focus__v">' + esc(withResults.dates) + ' ' + esc(resultYear) + '</p>' +
          '<p class="focus__m">' + esc(wTrack.short) + ' \u00b7 ' + esc(withResults.event || '') + '</p>' +
          '<p class="focus__cta"><button class="arrowlink" type="button" data-goto="results">' +
            'View results <svg class="ico"><use href="#i-arrow"/></svg></button></p>' +
        '</div>');
    }

    $('#rFocus').innerHTML = cells.join('');
  }

  function paintTracks() {
    $('#trackBody').innerHTML = Object.keys(D.circuits).map(function (k) {
      var c = D.circuits[k];
      return '<article class="track">' +
        '<div class="track__head">' +
          '<div>' +
            '<h3 class="track__name">' + esc(c.name) + '</h3>' +
            '<p class="track__meta">' + nat(c.code, null, true) + ' ' + esc(c.country) +
            ' · ' + esc(c.fia) + ' · ' + c.rounds + ' PSCI rounds</p>' +
          '</div>' +
          trackMap(c) +
        '</div>' +
        '<div class="track__specs">' +
          spec(c.length, 'Length') + spec(c.turns, 'Turns') +
          spec(c.elevation, 'Elevation') + spec(c.rounds, 'Rounds') +
        '</div>' +
        '<p class="track__rec">Lap record <b>' + esc(c.record.time) + '</b>, ' +
          esc(c.record.driver) + ', ' + esc(c.record.car) + ' (' + esc(c.record.event) + ')</p>' +
      '</article>';
    }).join('');
  }

  /* Track outline: a single <path> from OpenStreetMap geometry, normalised to
     its own viewBox. The SVG height is pinned in CSS, so both circuits render
     at the same height even though their proportions differ. */
  function trackMap(c) {
    if (!c.map) return '';
    return '<svg class="tmap" viewBox="0 0 ' + c.map.w + ' ' + c.map.h + '" role="img" ' +
      'aria-label="Track map, ' + esc(c.name) + '">' +
      '<path class="tmap__line" d="' + c.map.d + '"/>' +
    '</svg>';
  }

  function spec(v, k) {
    return '<div class="spec"><p class="spec__v">' + esc(v) + '</p><p class="spec__k">' + esc(k) + '</p></div>';
  }

  /* ---------- 4. standings panels ---------- */
  var sortState = { teams: 'podium', drivers: 'podium' };
  var METRIC = { podium: 'Podiums', races: 'Races', seasons: 'Seasons' };

  /* Sort on the chosen metric only. Array sort in JS is stable, so teams and
     drivers on equal numbers keep the order of the data file, and that order
     is 51GT3's own ranking. No invented tie-break here. */
  function ranked(list, key) {
    return list.slice().sort(function (a, b) { return b[key] - a[key]; });
  }

  function barCell(v, max) {
    return '<td><span class="bar"><span class="bar__t">' +
      '<span class="bar__f" style="transform:scaleX(' + (v / max).toFixed(3) + ')"></span></span>' +
      '<span class="bar__n">' + v + '</span></span></td>';
  }
  /* the active metric column gets a bar, the rest stay plain numbers */
  function metricCell(v, max, on) {
    return on ? barCell(v, max) : '<td class="num">' + v + '</td>';
  }
  function metricHead(label, on) {
    return '<th' + (on ? ' aria-sort="descending"' : '') + '>' + label + '</th>';
  }

  function paintTeams() {
    var key = sortState.teams;
    var rows = ranked(D.teams, key);
    var max = Math.max.apply(null, rows.map(function (t) { return t[key]; }));

    $('#teamTable').innerHTML =
      '<thead><tr><th>Pos.</th><th>Team</th>' +
      metricHead('Podiums', key === 'podium') +
      metricHead('Races', key === 'races') +
      metricHead('Seasons', key === 'seasons') +
      '<th>Drivers</th></tr></thead><tbody>' +
      rows.map(function (t, i) {
        return '<tr><td class="dt__pos">' + (i + 1) + '</td>' +
          '<td class="dt__name">' + esc(t.name) + '</td>' +
          metricCell(t.podium, max, key === 'podium') +
          metricCell(t.races, max, key === 'races') +
          metricCell(t.seasons, max, key === 'seasons') +
          '<td class="dt__gap">' + esc(t.drivers.join(', ')) + '</td></tr>';
      }).join('') + '</tbody>';
  }

  function paintDrivers() {
    var key = sortState.drivers;
    var rows = ranked(D.drivers, key);
    var max = Math.max.apply(null, rows.map(function (d) { return d[key]; }));

    $('#driverTable').innerHTML =
      '<thead><tr><th>Pos.</th><th>Driver</th><th>Nat.</th><th>No.</th><th>Class</th>' +
      metricHead('Podiums', key === 'podium') +
      metricHead('Races', key === 'races') +
      metricHead('Seasons', key === 'seasons') +
      '</tr></thead><tbody>' +
      rows.map(function (d, i) {
        return '<tr><td class="dt__pos">' + (i + 1) + '</td>' +
          nameCell(d.name, d.team) +
          '<td class="dt__nat">' + nat(d.nat) + '</td>' +
          '<td>' + carNo(d.no) + '</td>' +
          '<td>' + clsChip(d.cls) + '</td>' +
          metricCell(d.podium, max, key === 'podium') +
          metricCell(d.races, max, key === 'races') +
          metricCell(d.seasons, max, key === 'seasons') +
          '</tr>';
      }).join('') + '</tbody>';
  }

  /* ---------- 5. results + qualifying ---------- */
  var filterState = {
    results:       { session: 'all', cls: 'all' },
    qualifying: { session: 'all', cls: 'all' }
  };

  function groupsFor(view, year) {
    var src = view === 'results' ? D.races : D.qualifying;
    return src.filter(function (g) { return g.year === year; });
  }

  function chipRow(label, values, active, attr) {
    return '<span class="fgroup__k">' + label + '</span>' +
      ['all'].concat(values).map(function (v) {
        return '<button class="chip" type="button" ' + attr + '="' + esc(v) + '" aria-pressed="' +
          (active === v ? 'true' : 'false') + '">' + (v === 'all' ? 'All' : esc(v)) + '</button>';
      }).join('');
  }

  function paintFilters(view, year) {
    var groups = groupsFor(view, year);
    var st = filterState[view];
    var sessions = groups.map(function (g) { return g.session; });
    var classes = [];
    groups.forEach(function (g) {
      g.rows.forEach(function (r) { if (classes.indexOf(r.cls) < 0) classes.push(r.cls); });
    });

    /* a filter whose value no longer exists this season falls back to "All" */
    if (st.session !== 'all' && sessions.indexOf(st.session) < 0) st.session = 'all';
    if (st.cls !== 'all' && classes.indexOf(st.cls) < 0) st.cls = 'all';

    var sBox = $(view === 'results' ? '#raceSessions' : '#qualiSessions');
    var cBox = $(view === 'results' ? '#raceClasses'  : '#qualiClasses');
    sBox.innerHTML = groups.length ? chipRow('Session', sessions, st.session, 'data-session') : '';
    cBox.innerHTML = groups.length ? chipRow('Class', classes, st.cls, 'data-cls') : '';
  }

  function sessionBlock(g, view) {
    var st = filterState[view];
    var rows = g.rows.filter(function (r) { return st.cls === 'all' || r.cls === st.cls; });
    if (!rows.length) return { html: '', count: 0 };

    var track = D.circuits[g.circuit];
    var head, body;

    if (view === 'results') {
      head = '<thead><tr><th>Pos.</th><th>Class</th><th>Class pos.</th><th>No.</th>' +
             '<th>Driver / Team</th><th>Car</th></tr></thead>';
      body = rows.map(function (r) {
        return '<tr>' + posCell(r.pos) +
          '<td>' + clsChip(r.cls) + '</td>' +
          '<td class="num' + (isOut(r.clsPos) ? ' dt__gap' : '') + '">' + esc(r.clsPos) + '</td>' +
          '<td>' + carNo(r.no) + '</td>' +
          nameCell(r.driver, r.team) +
          '<td class="dt__gap">' + esc(g.car) + '</td></tr>';
      }).join('');
    } else {
      var best = null;
      g.rows.forEach(function (r) {
        var s = toSec(r.time);
        if (s !== null && (best === null || s < best)) best = s;
      });
      head = '<thead><tr><th>Pos.</th><th>Lap time</th><th>Gap</th><th>Class</th>' +
             '<th>Class pos.</th><th>No.</th><th>Driver / Team</th></tr></thead>';
      body = rows.map(function (r) {
        var lead = toSec(r.time) !== null && toSec(r.time) === best;
        return '<tr' + (lead ? ' class="is-lead"' : '') + '>' + posCell(r.pos) +
          '<td class="dt__time">' + esc(r.time) + '</td>' +
          '<td class="dt__gap">' + esc(gapText(r.time, best)) + '</td>' +
          '<td>' + clsChip(r.cls) + '</td>' +
          '<td class="num' + (isOut(r.clsPos) ? ' dt__gap' : '') + '">' + esc(r.clsPos) + '</td>' +
          '<td>' + carNo(r.no) + '</td>' +
          nameCell(r.driver, r.team) + '</tr>';
      }).join('');
    }

    var title = view === 'results'
      ? (g.session === 'R01' ? 'Race 1' : g.session === 'R02' ? 'Race 2' : g.session === 'R03' ? 'Race 3' : g.session)
      : 'Qualifying ' + g.session.replace('Q', '');

    return {
      count: rows.length,
      html: '<section class="session">' +
        '<div class="session__head">' +
          '<span class="session__tag">' + esc(g.session) + '</span>' +
          '<h3 class="session__title">' + esc(title) + '</h3>' +
          '<p class="session__meta">' + esc(track.short) + ' · ' + esc(g.date) +
            (g.event && g.event !== track.short ? ' · ' + esc(g.event) : '') + '</p>' +
        '</div>' +
        '<div class="tablewrap scroll-fade-x"><table class="dt">' + head + '<tbody>' + body + '</tbody></table></div>' +
      '</section>'
    };
  }

  function paintResults(view, year) {
    var st = filterState[view];
    var groups = groupsFor(view, year).filter(function (g) {
      return st.session === 'all' || g.session === st.session;
    });
    var titleEl = $(view === 'results' ? '#raceTitle' : '#qualiTitle');
    var bodyEl  = $(view === 'results' ? '#raceBody'  : '#qualiBody');
    var countEl = $(view === 'results' ? '#raceCount' : '#qualiCount');

    titleEl.textContent = year + (view === 'results' ? ' race results' : ' qualifying results');

    if (view === 'qualifying') paintBest(year);

    if (!groupsFor(view, year).length) {
      bodyEl.innerHTML = emptyBlock(view === 'results' ? 'results' : 'qualifying', year);
      countEl.textContent = '';
      announce('No data for the ' + year + ' season');
      return;
    }

    var total = 0;
    var html = groups.map(function (g) {
      var b = sessionBlock(g, view);
      total += b.count;
      return b.html;
    }).join('');

    /* the source does not tie 2024 to a specific calendar round: say so rather than guess */
    if (year === '2024' && view === 'results') {
      html = '<p class="rsec__note" style="margin-bottom:18px">The source records both results at Mandalika in 2024 without tying them to a specific calendar round.</p>' + html;
    }

    bodyEl.innerHTML = html || emptyBlock(view === 'results' ? 'results' : 'qualifying', year);
    countEl.textContent = total + ' rows';
    announce(total + (view === 'results' ? ' race result' : ' qualifying') + ' rows for the ' + year + ' season');
  }

  /* fastest lap card for this season */
  function paintBest(year) {
    var box = $('#qualiBest');
    var best = null;
    D.qualifying.filter(function (g) { return g.year === year; }).forEach(function (g) {
      g.rows.forEach(function (r) {
        var s = toSec(r.time);
        if (s !== null && (!best || s < best.sec)) best = { sec: s, row: r, g: g };
      });
    });
    if (!best) { box.innerHTML = ''; return; }
    var track = D.circuits[best.g.circuit];
    box.innerHTML = '<div class="best">' +
      '<span class="best__checker" aria-hidden="true"></span>' +
      '<p class="best__t">' + esc(best.row.time) + '</p>' +
      '<div><p class="best__k">Fastest qualifying lap ' + esc(year) + '</p>' +
        '<p class="best__who">' + carNo(best.row.no) + ' ' + esc(best.row.driver) + '</p>' +
        '<p class="best__meta">' + esc(best.row.team) + ' · ' + esc(track.short) +
          ' · ' + esc(best.g.session) + ' · ' + esc(best.g.car) + '</p></div>' +
    '</div>';
  }

  /* ---------- 6. tabs + season + boot ---------- */
  var VIEWS = ['calendar', 'teams', 'drivers', 'results', 'qualifying'];
  var HASH = {
    calendar: 'calendar', teams: 'team-standings', drivers: 'driver-standings',
    results: 'race-results', qualifying: 'qualifying-results'
  };
  var state = { view: 'calendar', season: '2025' };

  function paintView(view) {
    if (view === 'calendar')    paintCalendar(state.season);
    else if (view === 'teams')    paintTeams();
    else if (view === 'drivers') paintDrivers();
    else { paintFilters(view, state.season); paintResults(view, state.season); }
  }

  function setView(view, opts) {
    if (VIEWS.indexOf(view) < 0) view = 'calendar';
    state.view = view;

    $$('.rtab').forEach(function (t) {
      var on = t.dataset.view === view;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    VIEWS.forEach(function (v) {
      var p = $('#p-' + v);
      p.hidden = v !== view;
      p.classList.remove('is-swap');
    });

    paintView(view);

    var panel = $('#p-' + view);
    /* force reflow so the enter animation replays on every tab change */
    void panel.offsetWidth;
    panel.classList.add('is-swap');

    if (!opts || opts.hash !== false) {
      if (history.replaceState) history.replaceState(null, '', '#' + HASH[view]);
      else location.hash = HASH[view];
    }
    if (opts && opts.focus) panel.focus();
  }

  function setSeason(year) {
    state.season = year;
    $$('.season').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.season === year ? 'true' : 'false');
    });
    if (state.view === 'calendar' || state.view === 'results' || state.view === 'qualifying') {
      paintView(state.view);
    }
    announce(year + ' season selected');
  }

  function bind() {
    /* tabs: click + Left/Right/Home/End */
    var tabs = $$('.rtab');
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { setView(t.dataset.view); keepRailInView(); });
      t.addEventListener('keydown', function (e) {
        var next = -1;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next < 0) return;
        e.preventDefault();
        tabs[next].focus();
        setView(tabs[next].dataset.view);
        keepRailInView();
      });
    });

    $$('.season').forEach(function (b) {
      b.addEventListener('click', function () { setSeason(b.dataset.season); });
    });

    /* standings sort + results filter: one listener, delegated per panel */
    document.addEventListener('click', function (e) {
      var goto = e.target.closest('[data-goto]');
      if (goto) { setView(goto.dataset.goto, { focus: true }); return; }

      var sort = e.target.closest('[data-sort]');
      if (sort) {
        var panel = sort.closest('.rpanel').id === 'p-teams' ? 'teams' : 'drivers';
        sortState[panel] = sort.dataset.sort;
        $$('[data-sort]', sort.parentNode).forEach(function (b) {
          b.setAttribute('aria-pressed', b === sort ? 'true' : 'false');
        });
        panel === 'teams' ? paintTeams() : paintDrivers();
        announce('Sorted by total ' + METRIC[sort.dataset.sort].toLowerCase());
        return;
      }

      var ses = e.target.closest('[data-session]');
      var cls = e.target.closest('[data-cls]');
      if (!ses && !cls) return;
      var view = (ses || cls).closest('.rpanel').id === 'p-results' ? 'results' : 'qualifying';
      if (ses) filterState[view].session = ses.dataset.session;
      if (cls) filterState[view].cls = cls.dataset.cls;
      paintFilters(view, state.season);
      paintResults(view, state.season);
    });

    window.addEventListener('hashchange', function () {
      var v = viewFromHash();
      if (v && v !== state.view) setView(v, { hash: false });
    });
  }

  /* Switching tabs after scrolling far down can land mid-table. If the tab
     rail has already passed above the viewport, pull back to it. */
  function keepRailInView() {
    var rail = $('.rtabs');
    var top = rail.getBoundingClientRect().top + window.scrollY -
              parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || 64);
    if (window.scrollY <= top) return;
    var reduce = document.documentElement.classList.contains('no-motion');
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
  }

  function viewFromHash() {
    var h = location.hash.replace('#', '');
    for (var k in HASH) { if (HASH[k] === h) return k; }
    return null;
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('no-motion');
  }

  paintHead();
  paintTicker();
  window.addEventListener('resize', setBarHeight);
  bind();
  setSeason('2025');
  setView(viewFromHash() || 'calendar', { hash: false });
}());
