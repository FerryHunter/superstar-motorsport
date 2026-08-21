/* =========================================================
   Content for Superstars Motorsport.
   Facts (founding, seasons, classes, circuits, partners,
   contact) come from superstars-motorsport.com; captions and
   supporting lines are written to match that voice.
   Images live in /img and were taken from the same site.
   ========================================================= */
window.SSM = {

  brand: {
    name: 'Superstars Motorsport',
    legal: 'PT Star Indonesia Motorsport',
    tagline: ['Motorsport is our main business', 'and racing is our main passion.'],
    instagram: { handle: '/superstarsmotorsport', url: 'https://www.instagram.com/superstarsmotorsport/' },
    email: 'info@superstars-motorsport.com',
    address: [
      'Pertamina Mandalika International Circuit',
      'Mandalika SEZ, Lot WCH-14, Ex Team Office, HPL No. 70',
      'Kuta Village, Pujut District, Central Lombok Regency',
      'West Nusa Tenggara, Indonesia 83573'
    ]
  },

  about: {
    eyebrow: 'About us',
    heading: ['Founded by racers,', 'run like a race team.'],
    body: [
      'Superstars Motorsport was founded in 2007 by racing brothers Bagoes and Satrio Hermanto, who took their own on-track experience and success into an organisation of their own.',
      'Since then the team has expanded from single-seater racing to organising GT racing at international level. From 2023 the company is the organiser of Porsche Sprint Challenge Indonesia, an official series licensed by Porsche AG.'
    ],
    person: { name: 'Bagoes Hermanto', role: 'CEO, Superstars Motorsport', img: 'img/ceo.webp' }
  },

  /* --- pinned timeline: one frame per milestone --- */
  milestonesStatement: ['From single seaters', 'to international GT racing.'],
  milestones: [
    { year: 2007, label: 'The start',        caption: 'Superstars Motorsport is founded',
      img: 'img/aerial.webp',
      alt: 'Superstars Motorsport crew and drivers with three Porsche race cars on the grid',
      text: 'Racing brothers Bagoes and Satrio Hermanto turn their own track experience into an organisation of their own.' },
    { year: 2023, label: 'Inaugural season', caption: 'Porsche Sprint Challenge Indonesia',
      img: 'img/hero-b.webp',
      alt: 'Full grid of Porsche 911 GT3 Cup cars lined up on the Mandalika start-finish straight',
      text: 'The series debuts at Mandalika International Circuit in Lombok with the latest 911 GT3 Cup, the 992.' },
    { year: 2024, label: 'A second class',   caption: '718 Cayman GT4 RS Clubsport joins',
      img: 'img/g-IMG_6008.webp',
      alt: 'Pack of Porsche race cars streaming out of a corner at Mandalika',
      text: 'Season two introduces a new class category alongside the GT3 Cup grid.' },
    { year: 2025, label: 'Two countries',    caption: 'Sepang and Mandalika',
      img: 'img/g-IMG_6481.webp',
      alt: 'Crew pushing a Porsche 911 GT3 Cup along the pit lane',
      text: 'After two seasons in Indonesia the series races at two circuits: Sepang in Malaysia and Mandalika in Indonesia.' }
  ],

  /* --- Porsche Sprint Challenge Indonesia --- */
  series: {
    eyebrow: 'Porsche Sprint Challenge Indonesia',
    heading: ['Indonesia’s premier', 'one-make series.'],
    seasons: [
      {
        id: '2023', name: '2023 · Mandalika',
        img: 'img/g-DSC_1269.webp',
        alt: 'Porsche 911 GT3 Cup cars on the grid at Mandalika with a number one grid board',
        facts: [
          { x: 30, y: 24, title: 'Inaugural season', sub: 'Mandalika, Lombok.',  text: 'The first Porsche Sprint Challenge Indonesia season runs at Mandalika International Circuit.' },
          { x: 72, y: 40, title: 'One make',         sub: '911 GT3 Cup (992).',  text: 'The grid runs the latest generation of the 911 GT3 Cup, identical for every entrant.' },
          { x: 22, y: 66, title: 'Licence',          sub: 'Porsche AG.',         text: 'An official series, licensed by Porsche AG.' }
        ]
      },
      {
        id: '2024', name: '2024 · Mandalika',
        img: 'img/psci.webp',
        alt: 'Porsche race cars battling wheel to wheel on track',
        facts: [
          { x: 26, y: 30, title: 'Season two',   sub: 'A new category.',              text: 'The series adds a second class alongside the GT3 Cup field.' },
          { x: 68, y: 26, title: 'GT4',          sub: '718 Cayman GT4 RS Clubsport.', text: 'The new class category joins the grid for the second season.' },
          { x: 60, y: 68, title: 'Home circuit', sub: 'Mandalika, Lombok.',           text: 'Both seasons so far have been held in Indonesia.' }
        ]
      },
      {
        id: '2025', name: '2025 · Sepang + Mandalika',
        img: 'img/g-IMG_6499.webp',
        alt: 'Crew member pushing a Porsche 911 GT3 Cup with Michelin branding on the rear tyres',
        facts: [
          { x: 24, y: 28, title: 'Two circuits',  sub: 'Sepang and Mandalika.', text: 'The 2025 season races in two countries for the first time.' },
          { x: 70, y: 34, title: 'Malaysia',      sub: 'Sepang International.',  text: 'The series crosses the border to Sepang, Malaysia.' },
          { x: 52, y: 72, title: 'Two classes',   sub: 'GT3 Cup and GT4 RS CS.', text: 'Both categories run across the season.' }
        ]
      }
    ]
  },

  /* --- gallery rail: one tab per category --- */
  galleryStatement: ['Two circuits, two classes,', 'one paddock.'],
  gallery: [
    {
      id: 'track', name: 'On track',
      photos: [
        { img: 'img/g-DSC_2018.webp',   cap: 'Clipping the kerb at speed',      alt: 'White and teal Porsche 911 GT3 Cup cornering, panning shot' },
        { img: 'img/g-DSC_3978.webp',   cap: 'Kerb to kerb',                    alt: 'Red and white Porsche 911 GT3 Cup on track past palm trees' },
        { img: 'img/g-IMG_1812.webp',   cap: 'Lights out',                      alt: 'Race start with the field streaming down the straight' },
        { img: 'img/g-IMG_6008.webp',   cap: 'Leading the pack',                alt: 'Purple Porsche leading a group of cars out of a corner' }
      ]
    },
    {
      id: 'paddock', name: 'Pit lane & garage',
      photos: [
        { img: 'img/g-IMG_6426.webp',   cap: 'Between sessions',                alt: 'Mechanics working on a Porsche 911 GT3 Cup with the bonnet open in the garage' },
        { img: 'img/g-IMG_6481.webp',   cap: 'Pit lane push',                   alt: 'Crew pushing a purple Porsche 911 GT3 Cup along the pit lane' },
        { img: 'img/g-IMG_6499.webp',   cap: 'Rear wing check',                 alt: 'Crew member pushing a white and blue Porsche 911 GT3 Cup from the rear wing' },
        { img: 'img/g-DSC_1269.webp',   cap: 'Grid, one minute',                alt: 'Grid walk with a purple Porsche 911 GT3 Cup and a number one grid board' }
      ]
    },
    {
      id: 'weekend', name: 'Race weekend',
      photos: [
        { img: 'img/g-IMG_5950.webp',   cap: 'Safety car leading the field',    alt: 'Safety car leading the field on a damp track' },
        { img: 'img/g-IMG_8159.webp',   cap: 'Full wet',                        alt: 'Porsche 911 GT3 Cup throwing up spray in heavy rain at dusk' },
        { img: 'img/g-DSC_3878.webp',   cap: 'The train through the esses',     alt: 'High angle of the field snaking through a corner sequence' }
      ]
    }
  ],

  /* --- news bento: dummy editorial, photography from the Superstars site --- */
  news: [
    { area:'a', cat:'News',    title:'Looking ahead: the season opener at Sepang',
      img:'img/hero-a.webp',      alt:'Porsche Sprint Challenge Indonesia grid lined up on the start-finish straight at sunset',
      text:'Dummy entry. Two countries on the calendar means the same crew packs for two very different weekends.' },
    { area:'b', cat:'Racing',  title:'Wet race at Mandalika decided on the final lap',
      img:'img/g-IMG_8159.webp',  alt:'Porsche 911 GT3 Cup throwing up spray in heavy rain at dusk',
      text:'Dummy entry. Standing water at the final corner turned a comfortable lead into a straight fight.' },
    { area:'c', cat:'Racing',  title:'GT4 class debut caps a strong weekend',
      img:'img/psci.webp',        alt:'Porsche race cars battling wheel to wheel on track',
      text:'Dummy entry. The new category ran its first full race distance without a technical issue.' },
    { area:'d', cat:'News',    title:'Entry list confirmed for round three',
      img:'img/g-IMG_6008.webp',  alt:'Purple Porsche leading a group of cars out of a corner',
      text:'Dummy entry. A full grid across both classes, with two returning guest entries.' },
    { area:'e', cat:'Article', title:'What a one-make grid teaches a young driver',
      img:'img/g-IMG_6426.webp',  alt:'Mechanics working on a Porsche 911 GT3 Cup with the bonnet open in the garage',
      text:'Dummy entry. Identical cars remove every excuse, which is exactly why the series works as a school.' },
    { area:'f', cat:'News',    title:'Paddock notes: preparation week at Mandalika',
      img:'img/g-IMG_5950.webp',  alt:'Safety car leading the field on a damp track',
      text:'Dummy entry. Track walk, seat fitting, and a long look at the weather radar.' }
  ],

  /* --- partners, as shown on the site --- */
  partners: [
    { name: 'Pertamax Turbo',                   img: 'img/p1.webp', w: 959,  h: 320 },
    { name: 'Michelin',                         img: 'img/p2.webp', w: 640,  h: 153 },
    { name: 'Mandalika Grand Prix Association', img: 'img/p3.webp', w: 522,  h: 178 },
    { name: 'Telkomsel Prestige',               img: 'img/p4.webp', w: 1536, h: 698, boxed: true }
  ]
};
