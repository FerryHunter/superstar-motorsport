/* =========================================================
   Teams data for Porsche Sprint Challenge Indonesia.

   Two sources, and every team declares its own through `source`:

   source: '51gt3'   team name, drivers, car numbers, class, and the
                     podium/race/season counts are taken verbatim from the
                     51GT3 racing database,
                     https://51gt3.com/id/race/porsche-sprint-challenge-indonesia
                     (captured 21 August 2026). Identical to the figures in
                     js/racing-data.js so the two pages never disagree.

   source: 'sample'  teams whose livery artwork lives in the "PSCI Cars"
                     folder but which are not in the 51GT3 database yet. Team
                     name, colours, and sponsor list are REAL: read straight
                     off the livery artwork. Driver names, car numbers, and
                     every statistic are SAMPLE DATA, and these teams carry a
                     "Sample" badge in the UI.

   `color` / `color2` were sampled from the pixels of each livery PNG
   (saturated-colour histogram), not guessed.

   Teams with no livery file fall back to img/teams/silhouette.webp, a
   silhouette built from the alpha channel of the same render, so the
   proportions still match.
   ========================================================= */
window.PSCI_TEAMS = {

  meta: {
    series: 'Porsche Sprint Challenge Indonesia',
    organiser: 'Superstars Motorsport',
    car: 'Porsche 911 GT3 Cup',
    intro: 'Fifteen teams, one marque. Every Porsche Sprint Challenge Indonesia entry runs the same 911 GT3 Cup chassis. The only things that separate them are the crew, the driver, and the livery.',
    source: {
      label: '51GT3 Racing Database',
      url: 'https://51gt3.com/id/race/porsche-sprint-challenge-indonesia',
      captured: '21 August 2026'
    },
    liveryNote: 'Livery renders come from the series’ official artwork folder (PSCI Cars).'
  },

  /* Summary strip. The team, driver, and livery counts are recomputed from
     the list below by js/teams.js, so only the rest lives here. */
  stats: [
    { k: 'Seasons',  v: '3' },
    { k: 'Circuits', v: '2' },
    { k: 'Classes',  v: '3' }
  ],

  /* class filter: the UI follows the order of this array */
  classes: ['PRO', 'PRO AM', 'GT4'],

  teams: [
    /* ---------- recorded in 51GT3 ---------- */
    {
      id: 'eks',
      name: 'EKS Motorsport',
      short: 'EKS',
      base: 'Singapore',
      since: 2025,
      color: '104 112 122',
      color2: '62 68 76',
      car: 'img/teams/silhouette.webp',
      liveries: [],
      model: 'Porsche 992.1 GT3 Cup · 718 Cayman GT4 RS CS',
      classes: ['PRO AM', 'GT4'],
      source: '51gt3',
      stats: { podium: 6, races: 6, seasons: 1 },
      drivers: [
        { name: 'Todd James Kingsford', nat: 'AUS', no: 98, cls: 'GT4' },
        { name: 'Yuey Tan',             nat: 'SGP', no: 5,  cls: 'PRO AM' }
      ],
      sponsors: [],
      about: 'The best podium record in the 51GT3 database: six podiums from six races. The only entrant fielding cars in two classes at once: a 911 GT3 Cup in PRO AM and a Cayman GT4 RS Clubsport in GT4.'
    },
    {
      id: 'rukita',
      name: 'Rukita Racing',
      short: 'Rukita',
      base: 'Jakarta, Indonesia',
      since: 2024,
      color: '232 92 40',
      color2: '27 160 137',
      car: 'img/teams/rukita.webp',
      liveries: [{ id: 'rukita', src: 'img/teams/rukita.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO AM'],
      source: '51gt3',
      stats: { podium: 3, races: 5, seasons: 2 },
      drivers: [
        { name: 'Hendrik Jaya Soewatdy', nat: 'IDN', no: 11, cls: 'PRO AM' }
      ],
      sponsors: ['Rukita', 'Pertamax Turbo', 'Michelin Pilot Sport'],
      about: 'Besides EKS, the only team on record across more than one season, with five races spanning 2024 and 2025. The livery runs Rukita’s orange and teal identity, with the large "ru" mark on the door.'
    },
    {
      id: 'rizqy',
      name: 'Rizqy Motorsport',
      short: 'Rizqy',
      base: 'Jakarta, Indonesia',
      since: 2025,
      color: '122 38 196',
      color2: '232 185 35',
      car: 'img/teams/rizqy.webp',
      liveries: [
        { id: 'rizqy',     src: 'img/teams/rizqy.webp',     label: 'Livery A' },
        { id: 'rizqy-alt', src: 'img/teams/rizqy-alt.webp', label: 'Livery B' }
      ],
      model: 'Porsche 992.1 GT3 Cup',
      classes: ['PRO'],
      source: '51gt3',
      stats: { podium: 3, races: 3, seasons: 1 },
      drivers: [
        { name: 'Daffa Ardiansa Boedihardjo', nat: 'IDN', no: 45, cls: 'PRO' }
      ],
      sponsors: ['Rizqy Motorsport', 'JVS Group', 'Michelin Pilot Sport'],
      about: 'Swept the PRO class at the Sepang round on 2 to 4 May 2025, winning R01, R02, and R03. Runs two purple livery variants: one with a black nose, one full purple with white sweeps.'
    },
    {
      id: 'bestcorp',
      name: 'Best Corp Racing MM Gallery',
      short: 'Best Corp',
      base: 'Jakarta, Indonesia',
      since: 2025,
      color: '201 162 39',
      color2: '120 96 20',
      car: 'img/teams/silhouette.webp',
      liveries: [],
      model: 'Porsche 992.1 GT3 Cup',
      classes: ['PRO'],
      source: '51gt3',
      stats: { podium: 3, races: 3, seasons: 1 },
      drivers: [
        { name: 'David Djaja', nat: 'IDN', no: 10, cls: 'PRO' }
      ],
      sponsors: [],
      about: 'Rizqy’s closest rival in PRO across the Sepang round: three starts, three podiums, and two second places overall.'
    },
    {
      id: 'febs78',
      name: '610 Racing Febs 78',
      short: 'Febs 78',
      alt: 'Febs 87',
      base: 'Jakarta, Indonesia',
      since: 2025,
      color: '194 24 91',
      color2: '110 14 52',
      car: 'img/teams/silhouette.webp',
      liveries: [],
      model: 'Porsche 992.1 GT3 Cup',
      classes: ['PRO AM'],
      source: '51gt3',
      stats: { podium: 3, races: 3, seasons: 1 },
      drivers: [
        { name: 'Hu Bo', nat: 'CHN', no: 16, cls: 'PRO AM' }
      ],
      sponsors: [],
      about: 'A PRO AM entry with Chinese driver Hu Bo. Three class podiums from three races at Sepang, including third overall in R02.'
    },
    {
      id: 'engine-plus',
      name: 'Engine Plus Motorsport',
      short: 'Engine+',
      base: 'Jakarta, Indonesia',
      since: 2025,
      color: '34 116 220',
      color2: '26 28 32',
      car: 'img/teams/engine-plus.webp',
      liveries: [
        { id: 'engine-plus',     src: 'img/teams/engine-plus.webp',     label: 'Livery A' },
        { id: 'engine-plus-alt', src: 'img/teams/engine-plus-alt.webp', label: 'Livery B' }
      ],
      model: 'Porsche 992.1 GT3 Cup',
      classes: ['PRO AM'],
      source: '51gt3',
      stats: { podium: 2, races: 3, seasons: 1 },
      drivers: [
        { name: 'Luckas Dwinanda', nat: 'N/A', no: 83, cls: 'PRO AM' }
      ],
      sponsors: ['engine+', 'Focal', 'Sport Lab Official Club', 'Apriwa', 'Pertamax Turbo', 'Michelin Pilot Sport'],
      about: 'A white-and-blue livery with the "engine+" wordmark running the length of the door. Two class podiums from three races in its debut season.'
    },

    /* ---------- livery on file, statistics still sample data ---------- */
    {
      id: 'amm',
      name: 'AMM Racing',
      short: 'AMM',
      base: 'Jakarta, Indonesia',
      since: 2025,
      color: '208 18 40',
      color2: '90 94 99',
      car: 'img/teams/amm.webp',
      liveries: [{ id: 'amm', src: 'img/teams/amm.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO AM'],
      source: 'sample',
      stats: { podium: 2, races: 4, seasons: 1 },
      drivers: [
        { name: 'Aryo Mahendra', nat: 'IDN', no: 7, cls: 'PRO AM' }
      ],
      sponsors: ['Acti Racing', 'Obsidian', 'Qinfa', 'Dua Raja Energi', 'Mineral Bangka Sejati', 'Pertamax Turbo', 'Michelin Pilot Sport'],
      about: 'White with red and graphite shards that sharpen towards the rear wing. Its headline sponsors come from energy and mining.'
    },
    {
      id: 'apriwa',
      name: 'Apriwa Motorsport',
      short: 'Apriwa',
      base: 'Tangerang, Indonesia',
      since: 2024,
      color: '237 212 0',
      color2: '24 24 26',
      car: 'img/teams/apriwa.webp',
      liveries: [{ id: 'apriwa', src: 'img/teams/apriwa.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO'],
      source: 'sample',
      stats: { podium: 3, races: 5, seasons: 2 },
      drivers: [
        { name: 'Bimo Prasetya', nat: 'IDN', no: 21, cls: 'PRO' }
      ],
      sponsors: ['Apriwa Motorsport', 'Jakarta Ban', 'Prapanca Racing', 'Michelin Pilot Sport'],
      about: 'Solid yellow from nose to roof, split by a white band below the door. The Apriwa name also appears as a sponsor on the Engine Plus car.'
    },
    {
      id: 'asc',
      name: 'ASC Racing Team',
      short: 'ASC',
      base: 'Surabaya, Indonesia',
      since: 2025,
      color: '42 63 208',
      color2: '160 38 87',
      car: 'img/teams/asc.webp',
      liveries: [{ id: 'asc', src: 'img/teams/asc.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO AM'],
      source: 'sample',
      stats: { podium: 1, races: 3, seasons: 1 },
      drivers: [
        { name: 'Reza Anandika', nat: 'IDN', no: 33, cls: 'PRO AM' }
      ],
      sponsors: ['ASC', 'Pertamax Turbo', 'Michelin Pilot Sport'],
      about: 'Metallic silver with royal blue and magenta sweeps, and a giant "ASC" spanning both doors. The most graphic livery in the paddock.'
    },
    {
      id: 'btpn',
      name: 'BTPN Racing',
      short: 'BTPN',
      base: 'Jakarta, Indonesia',
      since: 2025,
      color: '42 87 232',
      color2: '245 208 0',
      car: 'img/teams/btpn.webp',
      liveries: [{ id: 'btpn', src: 'img/teams/btpn.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO AM'],
      source: 'sample',
      stats: { podium: 1, races: 4, seasons: 1 },
      drivers: [
        { name: 'Dimas Arkananta', nat: 'IDN', no: 28, cls: 'PRO AM' }
      ],
      sponsors: ['Sillo Maritime Perdana', 'JVS Group', 'Stalk', 'Otohype', 'FF Luxury Watch', 'Taxatap', 'Sari Cosmetics', 'Michelin Pilot Sport'],
      about: 'A white base with blue blocks at both ends and a thin yellow line along the sill. The busiest sponsor list on the grid.'
    },
    {
      id: 'citadel',
      name: 'Citadel Motorsport',
      short: 'Citadel',
      base: 'Badung, Bali',
      since: 2025,
      color: '29 176 198',
      color2: '242 149 0',
      car: 'img/teams/citadel.webp',
      liveries: [{ id: 'citadel', src: 'img/teams/citadel.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO'],
      source: 'sample',
      stats: { podium: 2, races: 3, seasons: 1 },
      drivers: [
        { name: 'Gilang Wicaksana', nat: 'IDN', no: 55, cls: 'PRO' }
      ],
      sponsors: ['Citadel', 'Pertamax Turbo', 'Balicopter', 'PARQ', 'Michelin Pilot Sport'],
      about: 'The only black-based livery on the grid: teal and orange shards over a dark body, with a fine texture across the rear fender.'
    },
    {
      id: 'jvs',
      name: 'JVS Racing',
      short: 'JVS',
      base: 'Jakarta, Indonesia',
      since: 2024,
      color: '224 36 36',
      color2: '58 61 64',
      car: 'img/teams/jvs.webp',
      liveries: [
        { id: 'jvs',     src: 'img/teams/jvs.webp',     label: 'Graphite / red' },
        { id: 'jvs-alt', src: 'img/teams/jvs-alt.webp', label: 'White / red' }
      ],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO AM'],
      source: 'sample',
      stats: { podium: 2, races: 5, seasons: 2 },
      drivers: [
        { name: 'Yudha Nugroho', nat: 'IDN', no: 8, cls: 'PRO AM' }
      ],
      sponsors: ['JVS Group', 'MS Glow for Men', 'Karma', 'Nixx', 'Tokopedia', 'Pods', 'Kemasan Tjap Kepala Gajah', 'Michelin Pilot Sport'],
      about: 'Two very different liveries carrying the same core sponsors: one dark graphite with red blocks, one clean white with a red band along the sill.'
    },
    {
      id: 'rocket',
      name: 'Rocket Racing',
      short: 'Rocket',
      base: 'Bandung, Indonesia',
      since: 2025,
      color: '18 107 84',
      color2: '228 180 60',
      car: 'img/teams/rocket-racing.webp',
      liveries: [{ id: 'rocket', src: 'img/teams/rocket-racing.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO AM'],
      source: 'sample',
      stats: { podium: 1, races: 3, seasons: 1 },
      drivers: [
        { name: 'Satria Adiputra', nat: 'IDN', no: 77, cls: 'PRO AM' }
      ],
      sponsors: ['PARQ', 'Flynet', 'Pertamax Turbo', 'Michelin Pilot Sport'],
      about: 'Racing green with a yellow diagonal running from the front fender to the tail. The furthest departure from a grid otherwise dominated by red and blue.'
    },
    {
      id: 'smp',
      name: 'Semen Merah Putih Racing',
      short: 'Merah Putih',
      base: 'Jakarta, Indonesia',
      since: 2025,
      color: '228 36 60',
      color2: '235 235 238',
      car: 'img/teams/semen-merah-putih.webp',
      liveries: [{ id: 'smp', src: 'img/teams/semen-merah-putih.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO'],
      source: 'sample',
      stats: { podium: 2, races: 4, seasons: 1 },
      drivers: [
        { name: 'Fajar Ramadhan', nat: 'IDN', no: 19, cls: 'PRO' }
      ],
      sponsors: ['Semen Merah Putih', 'Michelin Pilot Sport'],
      about: 'Red and white taken literally: white front half, fully red tail, and a large bull illustration across the rear door.'
    },
    {
      id: 'sillo',
      name: 'Sillo Racing',
      short: 'Sillo',
      base: 'Jakarta, Indonesia',
      since: 2025,
      color: '196 36 48',
      color2: '34 196 204',
      car: 'img/teams/sillo.webp',
      liveries: [{ id: 'sillo', src: 'img/teams/sillo.webp', label: '2025 livery' }],
      model: 'Porsche 911 GT3 Cup (992)',
      classes: ['PRO AM'],
      source: 'sample',
      stats: { podium: 1, races: 3, seasons: 1 },
      drivers: [
        { name: 'Naufal Hardiansyah', nat: 'IDN', no: 88, cls: 'PRO AM' }
      ],
      sponsors: ['PT Maritime Power', 'HPT Motosport', 'BRI', 'Michelin Pilot Sport'],
      about: 'White with red and teal shards meeting mid-door. The number 88 is clearly printed on the rear sill, the only car number actually present in the artwork.'
    }
  ]
};
