/* =========================================================
   Racing hub data for Porsche Sprint Challenge Indonesia.

   Source: 51GT3 racing database
   https://51gt3.com/id/race/porsche-sprint-challenge-indonesia
   (series, calendar, team and driver standings, race results, qualifying
   results, circuit specifications). Retrieved 21 August 2026.

   The figures in `stats` are 51GT3's own summary. The table rows below are
   the entries actually recorded in their database, which is why the counts
   can come out lower than the summary (the 2023 season, for instance, has
   no indexed official results yet).

   The qualifying "gap" column does not exist in the source: js/racing.js
   computes it from the lap times of the same session.
   ========================================================= */
window.PSCI = {

  meta: {
    series: 'Porsche Sprint Challenge Indonesia',
    short: 'PSCI',
    organiser: 'Superstars Motorsport',
    country: 'Indonesia',
    category: 'GT & Sports Car Racing',
    onemake: 'Porsche',
    source: {
      label: '51GT3 Racing Database',
      /* the track outline is not from 51GT3: redrawn from OSM geometry */
      mapSource: { label: 'OpenStreetMap', url: 'https://www.openstreetmap.org/copyright' },
      url: 'https://51gt3.com/id/race/porsche-sprint-challenge-indonesia',
      captured: '21 August 2026'
    },
    intro: 'The official one-make series licensed by Porsche AG, run at Sepang International Circuit and Pertamina Mandalika International Street Circuit with the Porsche 911 GT3 Cup.'
  },

  /* series summary, verbatim from 51GT3 */
  stats: [
    { k: 'Seasons',      v: '3'   },
    { k: 'Events',       v: '11'  },
    { k: 'Events / season', v: '3.7' },
    { k: 'Circuits',     v: '2'   },
    { k: 'Teams',        v: '7'   },
    { k: 'Drivers',      v: '8'   }
  ],

  seasons: ['2026', '2025', '2024', '2023'],
  /* ---------------------------------------------------------
     1. race calendar
     status: done | provisional | results | tba
     --------------------------------------------------------- */
  calendar: {
    '2026': [],
    '2025': [
      { round: 1, dates: '11 to 13 April',   month: 'Apr', circuit: 'sepang',
        country: 'Malaysia',  code: 'MYS', label: 'Completed', flags: ['done'],
        id: 7415, start: '2025-04-11', end: '2025-04-13', note: 'Pre-season test day' },
      { round: 2, dates: '2 to 4 May',       month: 'May', circuit: 'sepang',
        country: 'Malaysia',  code: 'MYS', label: 'Official results', flags: ['done','results'],
        id: 7416, start: '2025-05-02', end: '2025-05-04', event: 'Round 1 & 2 & 3', sessions: ['R01','R02','R03'] },
      { round: 3, dates: '22 to 24 August', month: 'Aug', circuit: 'mandalika',
        country: 'Indonesia', code: 'IDN', label: 'Provisional', flags: ['done','provisional'],
        id: 7417, start: '2025-08-22', end: '2025-08-24' },
      { round: 4, dates: '24 to 26 October', month: 'Oct', circuit: 'mandalika',
        country: 'Indonesia', code: 'IDN', label: 'Provisional', flags: ['done','provisional'],
        id: 7418, start: '2025-10-24', end: '2025-10-26' }
    ],
    '2024': [
      { round: 1, dates: '12 to 14 January',  month: 'Jan', circuit: 'mandalika', country: 'Indonesia', code: 'IDN', label: 'Completed', flags: ['done'], id: 1433, start: '2024-01-12', end: '2024-01-14' },
      { round: 2, dates: '26 to 28 January',  month: 'Jan', circuit: 'mandalika', country: 'Indonesia', code: 'IDN', label: 'Completed', flags: ['done'], id: 1434, start: '2024-01-26', end: '2024-01-28' },
      { round: 3, dates: '30 August to 1 September', month: 'Aug', circuit: 'mandalika', country: 'Indonesia', code: 'IDN', label: 'Completed', flags: ['done'], id: 1435, start: '2024-08-30', end: '2024-09-01', event: 'Mandalika Festival of Speed' },
      { round: 4, dates: '11 to 13 October',  month: 'Oct', circuit: 'mandalika', country: 'Indonesia', code: 'IDN', label: 'Completed', flags: ['done'], id: 1436, start: '2024-10-11', end: '2024-10-13' },
      { round: 5, dates: '1 to 3 November',   month: 'Nov', circuit: 'mandalika', country: 'Indonesia', code: 'IDN', label: 'Completed', flags: ['done'], id: 1437, start: '2024-11-01', end: '2024-11-03' },
      { round: 6, dates: '6 to 8 December',   month: 'Dec', circuit: 'mandalika', country: 'Indonesia', code: 'IDN', label: 'Completed', flags: ['done'], id: 1438, start: '2024-12-06', end: '2024-12-08' }
    ],
    '2023': [
      { round: 1, dates: '8 to 10 December', month: 'Dec', circuit: 'mandalika', country: 'Indonesia', code: 'IDN', label: 'Completed', flags: ['done'], id: 1439, start: '2023-12-08', end: '2023-12-10' }
    ]
  },

  /* empty-state copy: one place, rather than scattered through the markup */
  empty: {
    calendar:   { title: 'The {year} calendar has not been announced', body: 'The 51GT3 database has no rounds on record for this season yet. This page fills in as soon as the schedule is published.' },
    results:    { title: 'No official results for {year} yet', body: 'This season\u2019s rounds are on the calendar, but their official classification documents have not reached the database.' },
    qualifying: { title: 'No qualifying data for {year} yet', body: 'Qualifying lap records are only on file for the Sepang round on 2 to 4 May 2025.' },
    /* used when the season itself has no schedule yet, as opposed to a season
       whose results simply have not landed */
    noSeason:   { title: 'The {year} season has not started', body: 'Its calendar has not been announced, so there are no race results or qualifying times to show.' }
  },

  circuits: {
    sepang: {
      name: 'Sepang International Circuit', short: 'Sepang', country: 'Malaysia', code: 'MYS',
      length: '5,543 km', turns: 15, fia: 'FIA 1', elevation: '22 m', rounds: 2,
      map: { w: 100, h: 83.5, d: 'M82 27.3 L88.6 34.8 L95.4 42.7 L95.8 43.2 L96 43.7 L96 44.2 L95.9 44.8 L93.4 50.5 L93.1 51.2 L92.8 51.6 L92.3 51.9 L91.5 52.1 L81.9 52.7 L75.6 53.2 L56 55.6 L55.4 55.8 L55 56.1 L54.8 56.3 L54.6 56.7 L54.6 57.1 L54.7 57.6 L54.9 57.9 L55.3 58.2 L59.9 61 L60.8 61.6 L61.4 62.3 L62.2 63.6 L62.6 64.7 L62.8 65.7 L62.9 67 L62.9 68.4 L62.8 69.7 L62.7 70.9 L62.4 71.9 L62.1 73.2 L61.6 74.3 L60.7 76.2 L59.3 78.3 L58.4 79.2 L57.6 79.5 L56.7 79.5 L56 79.4 L55.4 79.1 L38.9 65.4 L37.9 64.8 L36.5 64.4 L35.4 64.3 L34.2 64.5 L33.2 64.9 L29.2 67 L27 68 L25.9 68.4 L24.6 68.6 L23 68.7 L21.6 68.6 L19.6 68.2 L17.5 67.4 L16 66.4 L14.8 65.3 L13.9 64.5 L13.2 63.3 L12.7 62 L12.6 61.2 L12.8 60.4 L13.1 59.8 L13.6 59.2 L14.2 58.9 L14.8 58.7 L24.9 56.9 L53.7 51.7 L67.7 49.1 L74.5 48 L81.1 46.7 L82 46.4 L82.7 45.8 L83.3 45.2 L83.6 44.5 L83.7 43.7 L83.6 42.9 L83 42 L82.4 41.5 L81.8 41.1 L81 41 L79.8 41 L64.6 42.3 L55.1 43 L8.3 46.8 L6.9 46.8 L6.2 46.7 L5.5 46.6 L4.9 46.2 L4.5 45.8 L4.2 45.3 L4 44.8 L4 44.2 L4.1 43.4 L4.3 42.8 L4.6 42.3 L4.9 41.9 L5.3 41.6 L5.8 41.3 L6.3 41.2 L7 41.1 L8 41.4 L9.9 42.1 L10.7 42.2 L11.3 42.2 L11.7 42.1 L12.1 41.7 L12.4 41.2 L12.5 40.6 L12.5 39.9 L12.2 39.2 L11.8 38.5 L10.5 36.7 L9.7 35.7 L9.2 34.7 L8.8 33.6 L8.5 32.4 L8.3 31.3 L8.3 29.7 L8.4 28.1 L8.7 25.5 L9 24.2 L9.5 22.7 L10.2 21.2 L11.1 19.8 L12 18.7 L13.2 17.6 L14.7 16.6 L16.1 15.8 L17.6 15.2 L24.3 13 L30.2 11 L39.3 7.2 L40.6 6.6 L44.5 4.8 L45.8 4.2 L46.2 4 L46.7 4 L47 4 L47.4 4.1 L47.8 4.3 L48.2 4.6 L48.3 4.9 L48.5 5.3 L48.6 5.9 L49.3 9.9 L51.6 22.1 L51.9 23.6 L52.4 24.6 L52.9 25.5 L53.7 26.5 L54.5 27.4 L55.4 28.2 L56.5 28.9 L58 29.6 L59.9 29.9 L61.6 30 L63.1 29.8 L64.2 29.5 L65.4 29 L66.5 28.3 L67.5 27.4 L68.2 26.6 L68.8 25.8 L69.7 25 L70.7 24.3 L71.9 23.7 L73.1 23.3 L74.6 23.1 L76.1 23.3 L77.4 23.6 L78.7 24.2 L80 25.1 L81.1 26.2 L82 27.3 Z' },
      record: { time: '01:49.748', driver: 'Yuji Kunimoto / Sena Sakaguchi', car: 'Toyota GR Supra GT500', event: 'Super GT Series' }
    },
    mandalika: {
      name: 'Pertamina Mandalika International Street Circuit', short: 'Mandalika', country: 'Indonesia', code: 'IDN',
      length: '4,320 km', turns: 17, fia: 'FIA 2', elevation: '20 m', rounds: 9,
      map: { w: 79.3, h: 100, d: 'M17.4 92.6 L18.3 75.3 L18.7 74 L19.6 72.9 L21 72.2 L28.5 69.3 L30.3 68.6 L31.8 67.4 L32.8 66 L33.4 64.3 L33.5 62.7 L31.8 44.3 L31.3 42.8 L30.6 41.8 L29.3 40.8 L27.9 40.4 L25 40.3 L23.1 40 L21.3 39.5 L20.6 39.1 L19.5 38.7 L17.5 37.4 L16.1 36.1 L14.9 34.6 L6.4 22.1 L5 19.5 L4.3 17.3 L4 15.1 L4.1 12.8 L4.5 10.8 L5 9.1 L5.8 7.4 L7.3 5.2 L8.2 4.6 L9.2 4.5 L10.1 4.9 L10.9 5.9 L11.2 7 L11.3 8.6 L10.3 16.1 L10.3 17.3 L10.9 18.4 L11.9 19 L12.9 19.1 L14.7 18.7 L66.6 4 L67.9 4.1 L69.1 4.6 L70.1 5.5 L70.7 6.4 L71 7.6 L71.4 22.5 L71.1 23.6 L70.4 24.6 L69.4 25.3 L68.2 25.3 L66.7 25.4 L65.8 25.4 L64.9 26 L64.4 26.7 L63.1 29.3 L63.1 30.4 L63.5 31.6 L64.8 33.3 L66.7 35.6 L68.4 37 L74 41.5 L74.6 42.3 L75 43.5 L75.2 51.1 L75.3 57.3 L75.2 58.7 L74.8 59.8 L74.1 60.7 L65.4 70.8 L64.3 71.8 L63.1 72.4 L61.7 72.6 L59.1 72.6 L57.4 72.7 L55.7 73.1 L54 73.7 L52.3 74.7 L50.7 76 L49.5 77.5 L47.6 80.1 L46.4 81.5 L45.6 82.2 L45.1 82.7 L42.9 84.1 L25.7 93.5 L21.6 95.7 L20.3 96 L19.2 95.7 L18.2 95.1 L17.5 94 L17.4 92.6 Z' },
      record: { time: '01:27.681', driver: 'Anthony Liu Xu / Loek Hartog', car: 'Porsche 992.1 GT3 R', event: 'GT World Challenge Asia' }
    }
  },

  /* ---------------------------------------------------------
     2. team standings, on 51GT3's metrics: podiums, races, seasons
     --------------------------------------------------------- */
  teams: [
    { name: 'EKS Motorsport',             podium: 6, races: 6, seasons: 1, drivers: ['Todd James Kingsford', 'Yuey Tan'] },
    { name: 'RUKITA RACING',              podium: 3, races: 5, seasons: 2, drivers: ['Hendrik Jaya SOEWATDY'] },
    { name: 'Rizqy Motorsport',           podium: 3, races: 3, seasons: 1, drivers: ['Daffa Ardiansa Boedihardjo'] },
    { name: 'Best Corp Racing MM Gallery',podium: 3, races: 3, seasons: 1, drivers: ['David Djaja'] },
    { name: '610 Racing Febs 78',         podium: 3, races: 3, seasons: 1, drivers: ['Hu Bo'] },
    { name: 'Engine Plus Motorsport',     podium: 2, races: 3, seasons: 1, drivers: ['Luckas Dwinanda'] }
  ],

  /* ---------------------------------------------------------
     3. driver standings
     --------------------------------------------------------- */
  drivers: [
    { name: 'Hu Bo',                      nat: 'CHN', team: '610 Racing Febs 78',          no: 16, cls: 'PRO AM', podium: 3, races: 3, seasons: 1 },
    { name: 'Yuey Tan',                   nat: 'SGP', team: 'EKS Motorsport',              no: 5,  cls: 'PRO AM', podium: 3, races: 3, seasons: 1 },
    { name: 'Hendrik Jaya SOEWATDY',      nat: 'IDN', team: 'RUKITA RACING',               no: 11, cls: 'PRO AM', podium: 3, races: 5, seasons: 2 },
    { name: 'Todd James Kingsford',       nat: 'AUS', team: 'EKS Motorsport',              no: 98, cls: 'GT4',    podium: 3, races: 3, seasons: 1 },
    { name: 'Daffa Ardiansa Boedihardjo', nat: 'IDN', team: 'Rizqy Motorsport',            no: 45, cls: 'PRO',    podium: 3, races: 3, seasons: 1 },
    { name: 'David Djaja',                nat: 'IDN', team: 'Best Corp Racing MM Gallery', no: 10, cls: 'PRO',    podium: 3, races: 3, seasons: 1 },
    { name: 'Luckas Dwinanda',            nat: 'N/A', team: 'Engine Plus Motorsport',      no: 83, cls: 'PRO AM', podium: 2, races: 3, seasons: 1 }
  ],

  /* ---------------------------------------------------------
     4. race results
     pos = overall position, clsPos = position in class
     --------------------------------------------------------- */
  races: [
    { year: '2025', event: 'Round 1 & 2 & 3', date: '2 to 4 May 2025', circuit: 'sepang', session: 'R01', car: 'Porsche 992.1 GT3 Cup', rows: [
      { pos: '1', cls: 'PRO',    clsPos: '1', driver: 'Daffa Ardiansa Boedihardjo', team: 'Rizqy Motorsport',            no: 45 },
      { pos: '2', cls: 'PRO',    clsPos: '2', driver: 'David Djaja',                team: 'Best Corp Racing MM Gallery', no: 10 },
      { pos: '3', cls: 'PRO AM', clsPos: '1', driver: 'Hendrik Jaya SOEWATDY',      team: 'RUKITA RACING',               no: 11 },
      { pos: '4', cls: 'PRO AM', clsPos: '2', driver: 'Yuey Tan',                   team: 'EKS Motorsport',              no: 5  },
      { pos: '5', cls: 'PRO AM', clsPos: '3', driver: 'Hu Bo',                      team: '610 Racing Febs 78',          no: 16 },
      { pos: '6', cls: 'PRO AM', clsPos: '4', driver: 'Luckas Dwinanda',            team: 'Engine Plus Motorsport',      no: 83 },
      { pos: '7', cls: 'GT4',    clsPos: '1', driver: 'Todd James Kingsford',       team: 'EKS Motorsport',              no: 98 }
    ]},
    { year: '2025', event: 'Round 1 & 2 & 3', date: '2 to 4 May 2025', circuit: 'sepang', session: 'R02', car: 'Porsche 992.1 GT3 Cup', rows: [
      { pos: '1', cls: 'PRO',    clsPos: '1', driver: 'Daffa Ardiansa Boedihardjo', team: 'Rizqy Motorsport',            no: 45 },
      { pos: '2', cls: 'PRO',    clsPos: '2', driver: 'David Djaja',                team: 'Best Corp Racing MM Gallery', no: 10 },
      { pos: '3', cls: 'PRO AM', clsPos: '1', driver: 'Hu Bo',                      team: '610 Racing Febs 78',          no: 16 },
      { pos: '4', cls: 'PRO AM', clsPos: '2', driver: 'Yuey Tan',                   team: 'EKS Motorsport',              no: 5  },
      { pos: '5', cls: 'PRO AM', clsPos: '3', driver: 'Luckas Dwinanda',            team: 'Engine Plus Motorsport',      no: 83 },
      { pos: '6', cls: 'GT4',    clsPos: '1', driver: 'Todd James Kingsford',       team: 'EKS Motorsport',              no: 98 },
      { pos: 'DNF', cls: 'PRO AM', clsPos: 'DNF', driver: 'Hendrik Jaya SOEWATDY',  team: 'RUKITA RACING',               no: 11 }
    ]},
    { year: '2025', event: 'Round 1 & 2 & 3', date: '2 to 4 May 2025', circuit: 'sepang', session: 'R03', car: 'Porsche 992.1 GT3 Cup', rows: [
      { pos: '1', cls: 'PRO',    clsPos: '1', driver: 'Daffa Ardiansa Boedihardjo', team: 'Rizqy Motorsport',            no: 45 },
      { pos: '2', cls: 'PRO AM', clsPos: '1', driver: 'Yuey Tan',                   team: 'EKS Motorsport',              no: 5  },
      { pos: '3', cls: 'PRO AM', clsPos: '2', driver: 'Hu Bo',                      team: '610 Racing Febs 78',          no: 16 },
      { pos: '4', cls: 'PRO',    clsPos: '2', driver: 'David Djaja',                team: 'Best Corp Racing MM Gallery', no: 10 },
      { pos: '5', cls: 'PRO AM', clsPos: '3', driver: 'Luckas Dwinanda',            team: 'Engine Plus Motorsport',      no: 83 },
      { pos: '6', cls: 'GT4',    clsPos: '1', driver: 'Todd James Kingsford',       team: 'EKS Motorsport',              no: 98 },
      { pos: 'DNS', cls: 'PRO AM', clsPos: 'DNS', driver: 'Hendrik Jaya SOEWATDY',  team: 'RUKITA RACING',               no: 11 }
    ]},
    { year: '2024', event: 'Mandalika', date: '2024', circuit: 'mandalika', session: 'R01', car: 'Porsche 991.1 GT3 Cup', rows: [
      { pos: 'N/A', cls: 'PRO AM', clsPos: '1', driver: 'Hendrik Jaya SOEWATDY', team: 'RUKITA RACING', no: 11 }
    ]},
    { year: '2024', event: 'Mandalika', date: '2024', circuit: 'mandalika', session: 'R02', car: 'Porsche 991.1 GT3 Cup', rows: [
      { pos: 'N/A', cls: 'PRO AM', clsPos: '2', driver: 'Hendrik Jaya SOEWATDY', team: 'RUKITA RACING', no: 11 }
    ]}
  ],

  /* ---------------------------------------------------------
     5. qualifying results
     --------------------------------------------------------- */
  qualifying: [
    { year: '2025', event: 'Round 1 & 2 & 3', date: '2 to 4 May 2025', circuit: 'sepang', session: 'Q1', car: 'Porsche 992.1 GT3 Cup', rows: [
      { pos: '1', time: '02:22.172', cls: 'PRO',    clsPos: '1', driver: 'Daffa Ardiansa Boedihardjo', team: 'Rizqy Motorsport',            no: 45 },
      { pos: '2', time: '02:22.563', cls: 'PRO AM', clsPos: '1', driver: 'Hendrik Jaya SOEWATDY',      team: 'RUKITA RACING',               no: 11 },
      { pos: '3', time: '02:23.053', cls: 'PRO',    clsPos: '2', driver: 'David Djaja',                team: 'Best Corp Racing MM Gallery', no: 10 },
      { pos: '4', time: '02:25.582', cls: 'PRO AM', clsPos: '2', driver: 'Yuey Tan',                   team: 'EKS Motorsport',              no: 5  },
      { pos: '5', time: '02:35.031', cls: 'PRO AM', clsPos: '3', driver: 'Luckas Dwinanda',            team: 'Engine Plus Motorsport',      no: 83 },
      { pos: 'DSQ', time: 'N/A', cls: 'PRO AM', clsPos: 'DSQ', driver: 'Hu Bo',                team: '610 Racing Febs 78',          no: 16 },
      { pos: 'DSQ', time: 'N/A', cls: 'GT4',    clsPos: 'DSQ', driver: 'Todd James Kingsford', team: 'EKS Motorsport',              no: 98 }
    ]},
    { year: '2025', event: 'Round 1 & 2 & 3', date: '2 to 4 May 2025', circuit: 'sepang', session: 'Q2', car: 'Porsche 992.1 GT3 Cup', rows: [
      { pos: '1', time: '02:20.760', cls: 'PRO',    clsPos: '1', driver: 'Daffa Ardiansa Boedihardjo', team: 'Rizqy Motorsport',            no: 45 },
      { pos: '2', time: '02:22.610', cls: 'PRO AM', clsPos: '1', driver: 'Luckas Dwinanda',            team: 'Engine Plus Motorsport',      no: 83 },
      { pos: '3', time: '02:22.653', cls: 'PRO',    clsPos: '2', driver: 'David Djaja',                team: 'Best Corp Racing MM Gallery', no: 10 },
      { pos: '4', time: '02:22.856', cls: 'PRO AM', clsPos: '2', driver: 'Hendrik Jaya SOEWATDY',      team: 'RUKITA RACING',               no: 11 },
      { pos: '5', time: '02:23.144', cls: 'PRO AM', clsPos: '3', driver: 'Yuey Tan',                   team: 'EKS Motorsport',              no: 5  },
      { pos: '6', time: '02:36.232', cls: 'GT4',    clsPos: '1', driver: 'Todd James Kingsford',       team: 'EKS Motorsport',              no: 98 },
      { pos: 'DNS', time: 'N/A', cls: 'PRO AM', clsPos: 'DNS', driver: 'Hu Bo', team: '610 Racing Febs 78', no: 16 }
    ]},
    { year: '2025', event: 'Round 1 & 2 & 3', date: '2 to 4 May 2025', circuit: 'sepang', session: 'Q3', car: 'Porsche 992.1 GT3 Cup', rows: [
      { pos: '1', time: '02:08.734', cls: 'PRO',    clsPos: '1', driver: 'Daffa Ardiansa Boedihardjo', team: 'Rizqy Motorsport',            no: 45 },
      { pos: '2', time: '02:10.146', cls: 'PRO',    clsPos: '2', driver: 'David Djaja',                team: 'Best Corp Racing MM Gallery', no: 10 },
      { pos: '3', time: '02:10.654', cls: 'PRO AM', clsPos: '1', driver: 'Yuey Tan',                   team: 'EKS Motorsport',              no: 5  },
      { pos: '4', time: '02:11.363', cls: 'PRO AM', clsPos: '2', driver: 'Hendrik Jaya SOEWATDY',      team: 'RUKITA RACING',               no: 11 },
      { pos: '5', time: '02:12.594', cls: 'PRO AM', clsPos: '3', driver: 'Luckas Dwinanda',            team: 'Engine Plus Motorsport',      no: 83 },
      { pos: '6', time: '02:15.849', cls: 'GT4',    clsPos: '1', driver: 'Todd James Kingsford',       team: 'EKS Motorsport',              no: 98 },
      { pos: 'DNF', time: 'N/A', cls: 'PRO AM', clsPos: 'DNF', driver: 'Hu Bo', team: '610 Racing Febs 78', no: 16 }
    ]}
  ],

  /* entry list for the Sepang round, 2 to 4 May 2025 */
  entries: [
    { no: 98, driver: 'Todd James Kingsford',       team: 'EKS Motorsport',              cls: 'GT4',    car: 'Porsche 992.1 GT3 Cup' },
    { no: 10, driver: 'David Djaja',                team: 'Best Corp Racing MM Gallery', cls: 'PRO',    car: 'Porsche 992.1 GT3 Cup' },
    { no: 45, driver: 'Daffa Ardiansa Boedihardjo', team: 'Rizqy Motorsport',            cls: 'PRO',    car: 'Porsche 992.1 GT3 Cup' },
    { no: 16, driver: 'Hu Bo',                      team: '610 Racing Febs 78',          cls: 'PRO AM', car: 'Porsche 992.1 GT3 Cup' },
    { no: 11, driver: 'Hendrik Jaya SOEWATDY',      team: 'RUKITA RACING',               cls: 'PRO AM', car: 'Porsche 992.1 GT3 Cup' },
    { no: 5,  driver: 'Yuey Tan',                   team: 'EKS Motorsport',              cls: 'PRO AM', car: 'Porsche 992.1 GT3 Cup' },
    { no: 83, driver: 'Luckas Dwinanda',            team: 'Engine Plus Motorsport',      cls: 'PRO AM', car: 'Porsche 992.1 GT3 Cup' }
  ]
};
