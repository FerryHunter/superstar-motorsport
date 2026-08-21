# Superstars Motorsport

A site for **Superstars Motorsport**, built with vanilla HTML, CSS, and JS: no build
step, no libraries. All content and assets come from `superstars-motorsport.com`.

Serve it over static HTTP (it needs HTTP rather than `file://`, because the assets are
referenced relatively):

```bash
python3 -m http.server 5173
```

then open `http://127.0.0.1:5173/index.html`.

## File structure

| File | Contents |
|---|---|
| `index.html` | markup for 7 sections plus the icon sprite |
| `racing.html` | race data page: calendar, team and driver standings, race results, qualifying results |
| `css/racing.css` | 9 numbered blocks for `racing.html` (page tokens, page head, tab rail, calendar, tables, standings, results, reduced motion, responsive) |
| `js/racing-data.js` | all race data scraped from 51GT3, plus track outlines from OSM |
| `js/racing.js` | renders tables and cards, plus tabs, season picker, filters, sort |
| `teams.html` | teams page: all 15 Porsche Sprint Challenge Indonesia teams on one page |
| `css/teams.css` | 8 numbered blocks for `teams.html` (page head, filter bar, team card, card contents, detail modal, summary table, reduced motion, responsive) |
| `js/teams-data.js` | 15 teams: livery colours, drivers, sponsors, statistics |
| `js/teams.js` | renders the grid, class filter, sort, and detail modal |
| `css/style.css` | 11 numbered blocks: tokens, reset, header, hero, about/timeline, showcase, gallery, partners/contact, footer/modal, reduced motion, responsive |
| `js/data.js` | all homepage content: brand, about, 4 milestones, 3 seasons, 3 gallery categories, 4 partners |
| `js/main.js` | scroll engine and every homepage interaction |
| `img/` | 21 assets downloaded from the Superstars site |
| `img/teams/` | 15 livery renders (webp) plus 1 silhouette, built from `PSCI Cars/` |
| `PSCI Cars/` | source livery artwork: 16 PNGs at 9071x3628 with alpha |
| `archive/porsche-com/` | the first build (porsche.com), before the target changed |

## Section order

1. **`#home`**: hero photo grid from Mandalika, tagline, thumbnail chips
2. **`#about-us`**: CEO photo and company profile
3. **`#milestones`**: pinned timeline 2007, 2023, 2024, 2025, with odometer year figures
4. **`#sprint-challenge`**: Porsche Sprint Challenge Indonesia, a tab per season with fact hotspots
5. **`#gallery`**: 3 categories (On track / Pit lane & garage / Race weekend) on a sliding rail
6. **`#partners`**: 4 partner logos
7. **`#contact`**: address, email, Instagram, and a form

## `racing.html`: five lists on one page

Entry points from the homepage: the **Event** item in the navbar and side menu, the
"Sprint Challenge" panel, and the Racing column in the footer. The five lists are split
across five tabs on one page, each with its own hash so it can be deep-linked:

| Tab | Hash | Contents |
|---|---|---|
| Race calendar | `#calendar` | focus strip (last round / next round / latest results), a card per round, circuit cards |
| Team standings | `#team-standings` | 6 teams, sortable per metric |
| Driver standings | `#driver-standings` | 7 drivers with country flag, number, class |
| Race results | `#race-results` | 23 rows grouped by session, with session and class filters |
| Qualifying results | `#qualifying-results` | 21 rows plus a fastest-lap card and a gap column |

**The information structure follows Formula1.com** (`/racing/2026`, `/results/2026/races`,
`/results/2026/drivers`): a season picker at the top, tabs per data type, round cards with
a podium, and standings tables. The round card follows the anatomy of the F1 schedule
card: a round label and a date pill with a chequered-flag icon on the top row, a large
venue name with a round flag, a small-caps event title, then a three-box podium strip
(`1st / 2nd / 3rd`). The difference is that the value column in that strip holds the
**class**, not a finishing time: the source records no race times. **The presentation is
the Porsche design language**, continuing from `porsche-racing-teardown.md`: off-black,
1px rules, uppercase labels at `letter-spacing:.2em`, red only for the active state, one
easing and two durations (0.25s / 0.4s).

Three things from the teardown are genuinely in use:

- **Scroll-fade with `@property` + `animation-timeline`** (`.scroll-fade-x`) on the tab
  rail and every table wrapper. The edge stays hazy while there is content off to the
  side and clears itself at the stop, with no scroll listener. There is an
  `@supports not` branch.
- **Layered tokens, brand to semantic to domain**: the racing classes (`--cls-pro`,
  `--cls-proam`, `--cls-gt4`) and event statuses (`--state-results`,
  `--state-provisional`) are their own domain tokens, not folded into the semantic set.
- **Empty-state copy lives in the data** (`PSCI.empty`) rather than the markup, including
  a `noSeason` variant for a season with no schedule yet, which is a different case from
  a season that has a schedule but whose result documents have not landed.

`aria-live` earns its keep here (`#rLive`): every season change, filter, or re-sort
announces the resulting row count. That is the most serious gap on the Porsche site.

### Data: where it comes from and where it stops

Every figure is scraped from the [51GT3 database](https://51gt3.com/id/race/porsche-sprint-challenge-indonesia)
(21 August 2026), including the detail page of each result so that overall position and
class position both come through. The summary list caps at 20 rows for anonymous
visitors.

- **Standings use 51GT3's metrics** (total podiums, races, seasons), **not championship
  points**: the series does not publish a points table there.
- Ordering uses a stable `Array.sort` with **no invented tie-break**, so teams and drivers
  on equal numbers keep 51GT3's own ranking order.
- **The qualifying gap column is computed here** from the lap times of the same session.
  It is the only number on the page that does not come from the source.
- The series summary claims 7 teams and 8 drivers, but only 6 teams and 7 drivers are
  actually listed. That gap is **left alone and explained** in the source note rather than
  papered over.
- The 2024 results are recorded without a link to any specific calendar round. The page
  says so plainly instead of guessing which round.
- The 2026 season has no schedule in the source, so the 2026 calendar renders as an empty
  state.

### Event ticker

A sticky strip under the navbar, modelled on the event strip on formula1.com: flag,
place, round label, then a live countdown in days/hours/minutes/seconds, with the date
range on the right. It is driven entirely by the calendar, not by a hardcoded date:

- **Upcoming round on the calendar** -> counts down to its `start` date.
- **Round under way** (today falls between `start` and `end`) -> "Race weekend / Under way".
- **No dated round left** -> shows the latest round plus "Schedule not announced" and a
  "Coming soon" badge. Which is today's real state: 51GT3 has no 2026 rounds on record,
  so nothing is invented to fill the timer.

Every event carries ISO `start` / `end` in `js/racing-data.js`. Add the 2026 rounds there
and the countdown starts working on its own; the focus strip on the calendar tab reads the
same dates, so the two can never disagree about which round is next. The source has no
session start times, so the countdown targets 00:00 local time on the start date, not a
session time.

The ticking seconds are `aria-hidden`: a screen reader would otherwise be interrupted
every second. A separate live region announces "Next round in N days H hours M minutes"
once a minute instead. The tab rail sticks below navbar + ticker, whose heights are both
measured at runtime (`--nav-h`, `--bar-h`) rather than assumed.

### Flags

The **Nat.** column, the round labels on the calendar cards, and the circuit cards use SVG
flags from [flag-icons](https://github.com/lipis/flag-icons) (MIT). Five files (`id`, `sg`,
`cn`, `au`, `my`) are downloaded into `img/flags/` rather than hotlinked from a CDN. The
three-letter code to file mapping lives in `js/racing.js` (`FLAG`), not in the data,
because it is a presentation concern. A driver whose nationality the source does not
record shows as `N/A` with no flag, rather than being guessed from the name.

The fastest qualifying lap card carries a chequered-flag accent on its right edge: a board
from a single `conic-gradient`, skewed by `skewX(-8deg)` and faded to the left with
`mask-image`, with no image file.

### Track outlines

Not somebody else's asset: two SVG `<path>` elements redrawn from OpenStreetMap geometry
(ODbL) via the Overpass API, then projected and normalised to their own viewBox. Each
polyline length was checked against the circuit's official length before use: Sepang
5,554 m against 5,543 m (+0.2%), Mandalika 4,313 m against 4,320 m (0.2% under). Sepang
needed two OSM ways joined together; the closed way that comes back most easily turned
out to be only 1,129 m, which is not the main circuit. The SVG height is pinned in CSS so
both circuit cards come out the same height even though the track proportions differ.

## `teams.html`: 15 teams on one page

Entry points from the homepage: the **Teams** item in the navbar and side menu,
plus the Sections and Racing columns in the footer. The Racing page links to it from
the same places.

**The information structure follows `formula1.com/en/teams`**: one grid of cards, each
card wearing its own team colour, the car cropped at the bottom edge, driver names and
car numbers readable without clicking. **The presentation stays Porsche**, same as
`racing.html`: off-black, 1px rules, uppercase letterspaced labels, one easing. Header,
footer, `.dt`, `.cls`, `.chip`, `.rstats`, `.empty`, and `.scroll-fade-x` are reused from
`style.css` + `racing.css`, so `teams.css` only holds what is genuinely new.

Top to bottom:

| Block | Contents |
|---|---|
| Page head | title and lede |
| Stats strip | 6 numbers; teams, drivers, and liveries are recomputed from the data rather than hard-coded |
| Filter bar (sticky) | class filter (All / PRO / PRO AM / GT4) and sort (podiums / races / name) |
| Team grid | 15 cards: rank, class, source badge, name, base, drivers with car numbers, three figures, car |
| Team summary | a table of every team with a colour swatch; rows open the detail |
| Detail modal | large car, livery picker, about, four figures, driver cards, sponsors |

Details open as a modal on the same page rather than a page per team, per the
"one page only" brief. `teams.html#team-rukita` opens that team's modal directly.

### Team colours

There is not a single per-team CSS class. Each card writes two custom properties
inline, `--c` (primary) and `--c2` (accent), and every rule in `teams.css` reads those
two variables. Adding a team only means adding an entry to `js/teams-data.js`.

The values were **sampled from the pixels of each livery PNG** (saturated-colour
histogram, saturation >= .45), not guessed. Because the channels are space separated,
the alpha must use a slash: `rgb(var(--c) / .4)`. The form `rgba(var(--c), .4)` is
invalid, and it fails silently: the whole colour gradient disappears with no console
error.

The colour appears in four places: the left edge bar, a diagonal band across the card
background, a glow under the car, and the rank number. The band starts transparent at
16% so the text column on the left stays dark. Class chips and source badges get their
own opaque dark base, because either can land on a light colour (Apriwa yellow, EKS
silver).

### Data sources: what is real, what is sample

Every team carries a `source` field, and the UI shows a badge to match:

- **`51gt3`**: 6 teams (EKS Motorsport, Rukita Racing, Rizqy Motorsport, Best Corp Racing
  MM Gallery, 610 Racing Febs 78, Engine Plus Motorsport). Team name, drivers, car
  numbers, class, and the podium/race/season counts come straight from the 51GT3
  database. The figures match `js/racing-data.js` exactly, so the two pages never
  disagree.
- **`sample`**: the other 9 teams, whose liveries are in `PSCI Cars/` but which are not in
  51GT3 yet. Team name, colours, and sponsors are **real**, read straight off the livery
  artwork. Driver names, car numbers, and every statistic are **sample data**, badged
  amber as "Sample" on the card, in the modal, and in the table.

The three teams that are in 51GT3 but have no livery artwork use
`img/teams/silhouette.webp`, a silhouette built from the alpha channel of the same
render so the proportions match, plus a "No livery yet" badge. The team the brief called
"Febs 87" uses its database name, "610 Racing Febs 78", with the alternate spelling shown
in the modal.

### Car assets

The 16 PNGs in `PSCI Cars/` (9071x3628, alpha, roughly 2.7 MB each) are cropped to their
alpha bounding box, resized to 1200px wide, and saved as webp at quality 84: 976 KB for
all 16 files, every one `loading="lazy"`.

Four pairs turned out to be twin liveries for the same team (Apriwa, Engine Plus, JVS,
Rizqy). Three became one team with a livery picker in the modal; the Apriwa pair is
effectively identical, so only one is used.

Two rendering traps already handled:

- **The car shadow is painted as a blurred ellipse behind the image, not with
  `filter: drop-shadow()`.** On a raster this wide, drop-shadow forces a render path that
  makes the image itself vanish on some engines, not just the shadow.
- **`height:auto` is required on the car `<img>`.** The `width`/`height` attributes are in
  the markup so the browser can reserve space before the image lands, but without
  `height:auto` that value is also used as the final height and the car renders squat.

## Content: which parts are their facts, which are added copy

**Taken verbatim from their site** (company facts): founded in 2007 by Bagoes and Satrio
Hermanto; expansion from single seaters into international GT racing; organiser of the
Porsche Sprint Challenge Indonesia since 2023, licensed by Porsche AG; season 1 at
Mandalika with the 911 GT3 Cup (992); season 2 adding the 718 Cayman GT4 RS Clubsport
class; 2025 racing at Sepang and Mandalika; PT Star Indonesia Motorsport; the address,
email, and Instagram; all four partners.

**Written here** (matching their tone, inventing no new facts): the section headings
("Founded by racers, run like a race team.", "From single seaters to international GT
racing.", "Two circuits, two classes, one paddock."), the photo captions, and the hotspot
labels. All of it only rearranges the facts above.

**Captions and alt text were written after looking at each photo**, so the descriptions
match what is actually in the image rather than guessing from the filename.

## Implementation notes

- **A single rAF loop** reads `scrollY` and then only writes CSS variables; CSS runs the
  animation. Metrics are cached in `measure()` and recomputed on `resize`, `load`, and
  `visibilitychange`.
- **`[hidden]{display:none!important}` is mandatory.** `.modal` and `.panels` set
  `display`, which beats `[hidden]` from the UA stylesheet. Without that line a "hidden"
  dialog is still a full-viewport overlay that blocks scrolling and every click.
- **The gallery rail** uses `scroll-behavior:smooth` from CSS rather than
  `behavior:'smooth'` from JS. The latter gets swallowed by `scroll-snap-type: x mandatory`
  on this container.
- **Accessibility**: a skip link, `aria-expanded` on the nav, a `role="status"` that
  announces the active year, modals with a focus trap and Escape, every control a real
  `<button>`, and descriptive alt text on every photo.
- **`prefers-reduced-motion`**: `html.no-motion` turns off all pinning. Sections return to
  their natural height, the timeline becomes an ordinary scroll container, and the arrows
  and dots move the rail instead of the page.
- **The contact form has no backend.** After validation it does not pretend to send:
  it shows a `mailto:` link pre-filled with the message. To send for real, point it at a
  form endpoint.

## Assets

The 21 files in `img/` were downloaded from `superstars-motorsport.com` (logo, CEO photo,
3 grid photos, 11 gallery photos, 4 partner logos) so the page does not depend on
hotlinking their WordPress install. The brand red `rgb(218, 2, 2)` was taken straight from
the pixels of the logo.

`hero.avif` in the root is a Porsche asset from an earlier iteration and is **no longer
used**.

The photos, partner logos, and company data belong to Superstars Motorsport.
