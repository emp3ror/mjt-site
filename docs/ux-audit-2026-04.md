# UI/UX Audit — April 2026

**Scope.** Every public route in `src/app/**`, the global shell (`Header`,
`SubpageNavigation`, `PageSurface`, `Footer`), and the shared component
system (cards, dividers, MDX, action panels). 56 Playwright captures at
desktop (1440 × 900) and mobile (390 × 844) drive every observation.
Screenshots live in [`output/playwright/audit/`](../output/playwright/audit).

**Method.** Each route is reviewed against a 10-criterion rubric (layout,
typography, color/contrast, hierarchy, interactivity, motion, responsive,
accessibility, content, brand). Findings are tagged **Critical / High /
Medium / Nit** and rolled up into a P0/P1/P2 backlog at the end.

> The "1 issue" red toast and "N" pellet visible in some screenshots are
> Next.js dev-mode overlays, not part of the design.

---

## Executive summary

Five themes account for almost every defect found.

1. **Long-form titles wrap to single words on every detail page.** The
   `max-w-[22ch]` on the header wrapper inside [`longform-entry.tsx`](../src/components/longform-entry.tsx)
   is sized by the header's own font (~9px), not the h1's font
   (clamp 39–77px), so 22ch resolves to ~200px and forces words like
   "champadevi" or "Foundations" onto their own line. This breaks the
   reading hierarchy on `/posts/[slug]`, `/events/[slug]`, and every
   `/art-college/[...slug]` page — i.e. the bulk of the archive.
2. **The cover-image system is broken on `/posts`.** Every post card
   in [`posts/page.tsx`](../src/app/posts/page.tsx) falls back to the
   same `/portfolio.jpg`, so the grid reads as a wallpaper of identical
   thumbnails. The frontmatter `cover` paths reference images that are
   not in `public/`.
3. **Editorial copy and capitalization leak placeholder voice.** "posts
   home", "artisan shop", "sticker printing" all surface lower-case as
   page titles, undermining the otherwise quiet, deliberate tone.
   Several index pages also render the same description twice (overview
   description + intro) and re-use section descriptions verbatim on
   every child card.
4. **Information architecture splits between primary nav and footer.**
   The header only exposes home anchors (Home / Volunteering / Journal /
   Stories). The actual archive — Notes, Gatherings, Study, Traces —
   lives only in the footer "Archive" column. Once a user scrolls past
   the home hero, the most important content is one footer-trip away,
   and on mobile there is no menu at all (the nav relies on
   `overflow-x-auto`).
5. **Section/leaf routing dead-ends and duplicates content.** Hitting
   `/art-college/first-year` shows only the section's `index.mdx` with
   no list of children, and `/traces` repeats "Ink Study: Learning the
   Weight of Water" twice (one note, one gathering) because both
   content files share a title.

The visual language itself — paper background, Newsreader italic +
Inter Tight, the editorial dot dividers, the dimmed video hero — is
strong and worth preserving. Most of the work is structural: scope
the title bug, fix the cover image pipeline, and lift the archive
into the primary nav.

## Strengths to preserve

- **Hero pacing.** The italic given name → bold family name → rule →
  craft line → CTAs → chips cadence is a polished entry. The
  ken-burns + flare animation respects `prefers-reduced-motion`.
- **Editorial palette.** `#f6f2ea` paper, `#225e66` deep teal, `#95503f`
  clay, and `#4f6952` leaf form a cohesive natural set. The body grid
  texture (`body::before`) is faint enough to add warmth without
  noise.
- **Trace card.** [`trace-card.tsx`](../src/components/trace-card.tsx)
  is the strongest list primitive — clean meta strip, generous title,
  good underline-on-hover affordance.
- **MDX defaults.** Heading scale, blockquote rule, code background, and
  inline link decoration in [`mdx/mdx.tsx`](../src/components/mdx/mdx.tsx)
  are tasteful and consistent.
- **Sticky breadcrumbs.** [`subpage-navigation.tsx`](../src/components/subpage-navigation.tsx)
  gives a calm "you are here" cue under the header without competing
  for attention.
- **Hike map embed** on the hike post is genuinely impressive — three
  stat boxes, interactive map, elevation profile, GPX download.
- **Reduced-motion handling** is wired correctly in
  [`globals.css`](../src/app/globals.css) for hero animations and
  scroll dot.

---

## Per-route findings

For each route the desktop full-page is the canonical capture; mobile
notes follow when they diverge. Severity tags: **Critical**, **High**,
**Medium**, **Nit**.

### 1. `/` — Home

Captures: [`home-desktop-fold.png`](../output/playwright/audit/home-desktop-fold.png),
[`home-desktop-full.png`](../output/playwright/audit/home-desktop-full.png),
[`home-mobile-fold.png`](../output/playwright/audit/home-mobile-fold.png),
[`home-mobile-full.png`](../output/playwright/audit/home-mobile-full.png).

- **High — Hero "rhythm" card duplicates the chips.**
  [`home-hero.tsx`](../src/components/home/home-hero.tsx) renders the
  three chips in two places: the `chips` row under the CTAs and again
  inside the `signal-card` aside. On desktop the duplicate is
  unmistakable. Render the chips once (prefer the rhythm card), or
  give each surface different content.
- **High — Volunteering rail title contrast on bright frames.** The
  white headline over the volunteering slide relies on a
  `linear-gradient(135deg, rgba(12,25,33,0.82), rgba(12,25,33,0.18))`
  overlay. The right edge fades to nearly transparent (0.18); when the
  underlying image is light (e.g. `/art.png`) the trailing description
  drops below WCAG AA. Strengthen the right-edge stop to ~0.55 or add
  a gradient mask inside the text column.
- **Medium — Active state on primary nav rarely fires.** The header
  links are `/`, `/#volunteering`, `/#journal`, `/#stories`. The
  `isActive` test in [`header.tsx`](../src/components/header.tsx)
  excludes `/#…` hrefs, so only "Home" ever lights up. Either treat
  hash links as active when on `/`, or replace the home anchors with
  archive routes (see IA recommendation in cross-cutting).
- **Medium — Dual hero backgrounds compete.** The hero has
  `body::before` grid + `body::after` radial wash + the
  `.hero-section` video poster + ken-burns + flare + grain + vignette
  + seam line. On lower-end devices this stacks ~7 GPU layers above
  the fold. Consider keeping the body decorations pinned but pausing
  ken-burns/flare while the hero is in view, or reducing layers above
  the fold.
- **Medium — Journal "Quiet entries…" headline runs into the rule.**
  In [`journal-section.tsx`](../src/components/home/journal-section.tsx)
  the entry rows use a 10rem date column; under 1280px the
  10rem column shrinks the title space until "Layers of Noise"
  almost touches the date column. Allow the title column to stay at
  least `minmax(0, 1fr)` and the date column to sit on a flexible
  baseline.
- **Medium — Stories grid uneven at lg.** The two top tiles are
  `lg:col-span-7` and `lg:col-span-5`, then story panels are 4/3/5.
  Three story panels totaling 12 columns is fine, but the middle
  panel (3-col) feels cramped at 1280px and the heading clamps to
  ~16ch. Consider 4/4/4 or 5/3/4 with intentional spans.
- **Medium — "N" Next.js indicator and "1 issue" toast are visible
  in dev only.** Not a real issue, but worth confirming production
  builds don't ship them.
- **Nit — Hero given name italic at 78% opacity.** The italic
  `Manish` is `rgba(255,250,240,0.78)`. On the darkest video frames
  it passes; on lighter frames (sky/horizon) it skirts AA at small
  rendered sizes. Bumping to 0.86 would be invisible on the dark
  side and safer on the bright side.
- **Nit — `aria-label` missing on the volunteering rail container.**
  The horizontal scroller has no role/aria, so screen readers hear
  only the article titles. Add `role="region" aria-label="Community
  work"` to the rail.
- **Nit — Scroll cue is far below the chips on desktop.** The
  "Scroll" affordance is on the hero but lives `mt-12` after the
  chips, so on 1440 × 900 it's pushed below the fold. Pin it to the
  hero's bottom-left with `position: absolute` instead of flow.

### 2. `/posts` — Notes index

Captures: [`posts-list-desktop-full.png`](../output/playwright/audit/posts-list-desktop-full.png),
[`posts-list-mobile-full.png`](../output/playwright/audit/posts-list-mobile-full.png).

- **Critical — All cards share the same fallback cover image.** The
  `cover` paths in `content/posts/*.mdx` reference
  `/images/art-placeholder.jpg`, `/images/tech-placeholder.jpg`, etc.
  None of those exist in `public/`. [`post-card.tsx`](../src/components/post-card.tsx)
  catches the error and falls back to `/portfolio.jpg`, and the
  result is a grid of five identical screenshots of an unrelated
  portfolio page. Either ship real covers, replace
  `/portfolio.jpg` with a neutral abstract texture, or render a
  styled placeholder card (eyebrow + title + meta on a tinted
  surface) when no cover is provided.
- **Critical — H1 reads "posts home".** The page falls back to the
  overview frontmatter title which is literally `posts home` (from
  `content/posts/index.mdx`). Either fix the source frontmatter to
  "Notes" / "Field notes" or change the fallback in
  [`posts/page.tsx`](../src/app/posts/page.tsx) to `"Notes"`.
- **High — Card grid uses 4-up on `xl` but the page typography
  expects ~3.** The `text-[1.9rem]` (30 px) title clamps to two
  lines per card; combined with the 16/10 cover, four cards in a
  row are very tall. A 3-up grid (`xl:grid-cols-3`) would let titles
  breathe and read more like notebook spreads.
- **Medium — `<dl>` rows duplicate "CATEGORY" / "DATE" labels on
  every card.** Five cards × two label rows × uppercase tracking is
  visually loud. Demote labels to a single meta strip (e.g. `Art ·
  May 28, 2024`) and free up vertical room.
- **Medium — Card image hover scale (`group-hover:scale-[1.02]`) is
  imperceptible.** Either bump to 1.04–1.06 or drop and let the
  card lift do the work.
- **Nit — Mobile cards use `100vw` sizes hint but the page-wrap
  caps at ~92vw.** Tweak `sizes` in `<Image>` to `"(max-width:
  767px) 92vw, …"` for sharper mobile thumbnails.

### 3. `/posts/[slug]` — Note detail

Captures (longform): [`posts-detail-note-desktop-full.png`](../output/playwright/audit/posts-detail-note-desktop-full.png),
[`posts-detail-note-mobile-full.png`](../output/playwright/audit/posts-detail-note-mobile-full.png).
Captures (hike): [`posts-detail-hike-desktop-full.png`](../output/playwright/audit/posts-detail-hike-desktop-full.png),
[`posts-detail-hike-mobile-full.png`](../output/playwright/audit/posts-detail-hike-mobile-full.png).

- **Critical — `max-w-[22ch]` on `<header>` shrinks to ~200 px and
  forces every word of the H1 onto its own line.** In
  [`longform-entry.tsx`](../src/components/longform-entry.tsx) line 66:
  `<header className="max-w-[22ch] space-y-5">` — the `ch` unit
  resolves against the header's own (body) font-size of ~18 px, so
  22ch ≈ 200 px. The h1 inside is `clamp(2.45rem, 6vw, 4.8rem)`
  (~39–77 px), and at 4.8rem a word like "Hittiban" or "Sunrise"
  needs ~250+ px on its own. The cleanest fix is to move the
  constraint to the h1 itself (where `ch` matches the heading
  font), e.g.
  `<h1 className="max-w-[16ch] text-[clamp(...)] …">`, or to use a
  `rem`-based cap on the header (`max-w-2xl` / `max-w-3xl`). This
  one change repairs every long-form route.
- **Critical — Hike post slug used as title.** The hike post's
  rendered title is `Hittiban - champadevi - bhasmasur -
  chandragiri` — five separate words connected by hyphens, all
  lowercase except the first. This appears to be the slug surfacing
  as the title (or a hand-typed title that mirrors it). Replace
  with editorial casing such as "Hatiban → Champadevi → Bhasmasur
  → Chandragiri". Once the 22ch fix lands, the hyphens become real
  visual separators rather than line-break magnets.
- **High — Action panel shares stack vertically and unlabeled.**
  [`actions/content-actions.tsx`](../src/components/actions/content-actions.tsx)
  renders five small icon buttons in a column with no visible
  labels (share, copy, send, like, link). Either lay them out as a
  horizontal pill row with labels-on-hover, or add visible eyebrow
  copy ("Share / Save / Copy") next to the icons. Confirm each
  button has an `aria-label` or visually hidden text.
- **High — Lede paragraph wraps to ~3 words per line.** Same root
  cause as the title — the header wrapper is 22ch (~200 px) and the
  description `<p>` lives inside it. Fix at the same place.
- **Medium — Numbered/bulleted lists feel cramped.** `space-y-3`
  (12 px) at line-height 1.85 and font-size ~17 px gives roughly
  the same gap as a single line, so list items run into each other
  visually. Consider `space-y-5` or `space-y-6`, particularly inside
  `<ol>`.
- **Medium — No "previous / next" navigation between notes.** The
  back link is the only egress; longer reading sessions rely on
  going back to the index. Add a small "Next note" / "Earlier
  note" pair at the bottom of the article.
- **Nit — `<aside>` meta has no semantic header.** The eyebrow
  ("Entry" / "Gathering" / "Study") is a `<p>`. Promote to an `<h2
  class="sr-only">` or use the eyebrow as a labeled heading for AT.
- **Nit — Reading time format inconsistency.** The note shows "1
  min read" (lowercase "min"); the hike shows "1 min read" too,
  but other surfaces sometimes use "1 MIN READ" uppercase
  (TraceCard meta strip). Pick one.

### 4. `/events` — Gatherings index

Captures: [`events-list-desktop-full.png`](../output/playwright/audit/events-list-desktop-full.png),
[`events-list-mobile-full.png`](../output/playwright/audit/events-list-mobile-full.png).

- **High — Single-event archive feels empty.** With only one past
  event, the trace-grid `md:col-span-7` slot leaves the right half
  of the row blank for ~600 px. When the archive is sparse, render
  one event card at a wider span (`md:col-span-12` or `md:col-span-9`)
  rather than 7-of-12.
- **High — H1 "Event lineup" plus description plus intro plus MDX
  overview is four overlapping blocks.** [`events/page.tsx`](../src/app/events/page.tsx)
  prints `ChapterHeader.description`, `overview.intro`, and the MDX
  body; visually this is three near-identical paragraphs at the top
  of the page. Either drop one, or differentiate them visually
  (intro = lede serif, MDX = standard body).
- **Medium — No "upcoming" empty state.** When there are no
  upcoming events the section is silently dropped, so the page
  effectively reads "Past sessions and recaps". A small "Nothing
  on the calendar — subscribe via …" line would set expectations.
- **Medium — Tags in the card show as `#SKETCHBOOK` (uppercase) on
  events but `#civic-tech` (lowercase) on tag pages.** Trace card
  tags are uppercase via `text-[0.72rem] uppercase tracking-…`,
  while `/tags/[tag]` keeps the original case. Pick a single
  rendering rule.

### 5. `/events/[slug]` — Gathering detail

Captures: [`events-detail-desktop-full.png`](../output/playwright/audit/events-detail-desktop-full.png),
[`events-detail-mobile-full.png`](../output/playwright/audit/events-detail-mobile-full.png).

- **Critical — Same 22ch title wrap.** "Ink / Study: / Learning /
  the / Weight / of / Water" — every word on its own line. Fixed
  by the LongformEntry change in §3.
- **High — Calendar + share controls collide.** In
  [`events/event-actions.tsx`](../src/components/events/event-actions.tsx)
  the `ADD TO CALENDAR` button sits next to vertically-stacked share
  icons. On desktop the column rule looks unbalanced and on mobile
  the two columns wrap awkwardly. Lay out actions in a single row,
  or stack them with a header (`Calendar` / `Share`).
- **Medium — `EVENT TOOLS` repeats date/place already in the meta
  list.** "Mar 18, 2024 · 2:00 PM – 4:00 PM · Studio M — Patan,
  Kathmandu" appears once as `Date` + `Place` meta and again under
  `Event tools`. Drop the duplicate.
- **Medium — `ADD TO CALENDAR` opens a dropdown with no visible
  caret beyond the small `^` glyph.** Use a `chevron-down` lucide
  icon and make the trigger clearly tappable (≥44 px hit area).

### 6. `/art-college` — Study index

Captures: [`art-college-list-desktop-full.png`](../output/playwright/audit/art-college-list-desktop-full.png),
[`art-college-list-mobile-full.png`](../output/playwright/audit/art-college-list-mobile-full.png).

- **Critical — Description and intro repeat verbatim under both the
  page header and every section.** The overview frontmatter sets a
  description ("Browse the modules and studies currently in
  rotation…") and an intro ("An open syllabus documenting studio
  experiments, critiques, and materials research."). Both are
  rendered, then on the section block the section description is
  rendered, then the section intro, then the same description on
  every TraceCard. Total: the same paragraph appears up to 5 times
  on one screen. Either de-duplicate in
  [`art-college/page.tsx`](../src/app/art-college/page.tsx) (drop
  intro when description matches) or fix the source frontmatter.
- **High — Card descriptions are identical placeholder copy.** Each
  card under "BFA Year 01 — Foundations" shows "Where we obsess
  over gesture, light, and translating references with confidence."
  This is the *section* description leaking into the per-entry
  trace shape via `entry.description` defaults. Fix by ensuring
  `getArtCollegeListing` doesn't propagate the section description
  to entries.
- **Medium — "FIRST YEAR" eyebrow uses the raw slug.** The eyebrow
  is `section.slug.replace(/[-_]/g, " ")` so "first-year" becomes
  "first year". Title-case it ("First Year") for consistency with
  navigation labels.
- **Nit — "Loose notes" empty section is dropped silently.** Only
  shown when `rootEntries.length > 0`. When children move around,
  the page changes layout dramatically. Consider always rendering
  the "Loose notes" header with an explicit empty state.

### 7. `/art-college/[...slug]` — Study section + leaf

Captures (section): [`art-college-section-desktop-full.png`](../output/playwright/audit/art-college-section-desktop-full.png).
Captures (leaf): [`art-college-leaf-desktop-full.png`](../output/playwright/audit/art-college-leaf-desktop-full.png).

- **Critical — Section index pages dead-end.** Hitting
  `/art-college/first-year` shows only the section's `index.mdx`
  body (here just a description), with no list of children, no
  "in this section" links, no breadcrumb forward. The user has to
  go back to `/art-college` to find leaves. Render a child
  TraceCard list under the section's MDX content.
- **Critical — Leaf title wraps catastrophically (22ch bug).**
  "Gesture / Mapping: / Finding / the / Axis" — same root cause as §3.
- **High — Path meta shows raw slug.** "first-year /
  gesture-mapping" is the breadcrumb-style path on the leaf page.
  Title-case it to "First Year / Gesture Mapping" for parity with
  the rest of the editorial chrome.
- **Medium — `Updated` date may be empty.** When a leaf has no
  `updated` and no `date` frontmatter, the `LongformEntry` meta
  filter removes the row, leaving a `Path` row alone. Add a
  fallback ("Date — …") so the meta block always anchors.
- **Nit — Source content typo.** `content/art-college/first-year/history-of-art-and-asthetics`
  reads "asthetics"; should be "aesthetics". Affects the URL and
  the breadcrumb.

### 8. `/shop` — Studio shop index

Captures: [`shop-list-desktop-full.png`](../output/playwright/audit/shop-list-desktop-full.png),
[`shop-list-mobile-full.png`](../output/playwright/audit/shop-list-mobile-full.png).

- **Critical — H1 reads "artisan shop".** Lower-case from the
  overview frontmatter. Edit `content/shop/index.mdx` to "Studio
  shop" or "Artisan shop", or fall back to title-case in
  [`shop/page.tsx`](../src/app/shop/page.tsx).
- **High — Single shop item lives alone on a half-width grid.** The
  grid is `md:grid-cols-2`; with one item, the right cell is empty
  for ~600 px. Render a "Coming soon" placeholder card or
  `md:grid-cols-1` until items > 2.
- **High — "Buy / Details" CTA implies transaction the site does
  not provide.** The shop is a contact-driven service ("Drop a
  note with your design files…"). Either rename to "View details"
  / "Request a run" or build out the actual transactional flow.
- **Medium — Mixed badge systems.** The page uses `<Badge>`,
  inline pill `div`s, and inline icon chips in the same section
  ([`shop/page.tsx`](../src/app/shop/page.tsx)). Standardize on the
  `Badge` component with a `variant` prop.
- **Medium — `DoodleDivider` clouds feel out-of-tone with the
  archive.** The hand-drawn cloud doodles are charming on the shop
  page but absent from the rest of the site. Either embrace them
  more broadly or drop them in favor of the editorial path divider
  used elsewhere.
- **Nit — `Updated DEC 15, 2025` date format mixes month casing.**
  The `Intl.DateTimeFormat("en", { month: "short" })` gives "Dec",
  but the surrounding eyebrow `text-transform: uppercase` makes it
  "DEC". Fine, but readers may parse it as a typo; consider full
  month names in eyebrow positions.

### 9. `/shop/posts/[slug]` — Shop item detail

Captures: [`shop-detail-desktop-full.png`](../output/playwright/audit/shop-detail-desktop-full.png),
[`shop-detail-mobile-full.png`](../output/playwright/audit/shop-detail-mobile-full.png).

- **High — Full ContactSection embedded under every shop detail.**
  [`shop/posts/[slug]/page.tsx`](../src/app/shop/posts/[slug]/page.tsx)
  renders `<ContactSection />` after the MDX. The full form +
  recaptcha note + socials list at the bottom of every product
  page is heavy and pushes the footer further out of reach.
  Replace with a compact "Order this run" CTA that scrolls to the
  full contact form on `/contact` (or wherever the canonical form
  lives).
- **High — No back link to the shop.** Unlike posts/events/study,
  the shop detail page does not use `LongformEntry`, so there is no
  "← Back to shop" affordance. Wrap with `LongformEntry` or add an
  equivalent back link.
- **Medium — Title `sticker printing` is lowercase.** Source content
  fix in `content/shop/stickers.mdx`.
- **Medium — Container width changes between list (`max-w-6xl`)
  and detail (`max-w-5xl`).** Subtle but noticeable when navigating
  back and forth. Pick one.
- **Nit — `DoodleDivider variant="lotus"` mid-content** changes the
  page mood mid-flow. Decide: is the doodle a section divider or
  decorative flourish, then apply consistently.

### 10. `/tags` — Tag index

Captures: [`tags-index-desktop-full.png`](../output/playwright/audit/tags-index-desktop-full.png),
[`tags-index-mobile-full.png`](../output/playwright/audit/tags-index-mobile-full.png).

- **Medium — `#Studio Notes` renders with a space.** `formatTagLabel`
  splits on `[-_]`, so `studio-notes` becomes `Studio Notes`. The
  resulting hashtag with a space inside reads as broken syntax.
  Either drop the space (`#StudioNotes`) or drop the `#` prefix
  on multi-word tags.
- **Medium — Date column right-aligned but with no clear hierarchy.**
  The "2 traces" left and date right are at the same weight. Make
  the count primary (eyebrow) and the date secondary muted.
- **Nit — Empty space below the grid before the footer.** Six tag
  cards in a 2-col grid leaves a single row of three pairs and ~30%
  vertical whitespace. Fine for now; if tags grow, switch to
  `lg:grid-cols-3`.
- **Nit — No way to discover tags from a post detail page.** The
  trace card has tag links, but the post `/posts/[slug]` page does
  not surface the post's own tags. Add a tag row to the LongformEntry
  meta sidebar.

### 11. `/tags/[tag]` — Tagged collection

Captures: [`tags-detail-desktop-full.png`](../output/playwright/audit/tags-detail-desktop-full.png),
[`tags-detail-mobile-full.png`](../output/playwright/audit/tags-detail-mobile-full.png).

- **Medium — `#Community` h1 vs `#community` tag pill** — the page
  title shows the tag in title case but the tag pills inside the
  card render lowercase. Resolve in `formatTagLabel` or in the
  TraceCard tag rendering.
- **Medium — One-trace tags feel orphaned.** Render at least 2 cards
  on the row (or full-width feature card) when `matchingPosts.length
  === 1`.
- **Nit — No "back to all tags" link.** Add one above the divider so
  tag-hopping is one click.

### 12. `/traces` — Unified archive

Captures: [`traces-desktop-full.png`](../output/playwright/audit/traces-desktop-full.png),
[`traces-mobile-full.png`](../output/playwright/audit/traces-mobile-full.png).

- **High — Duplicate "Ink Study: Learning the Weight of Water"
  appears as both NOTE and GATHERING.** Two source files (a post
  and an event) share the same title. Either de-duplicate in
  `getAllTraces`, or render a small kind disambiguator next to the
  title (e.g. "Ink Study … (event recap)").
- **High — Source typo in card title:** "History of Art and
  asthetics" → "aesthetics". Fix in
  `content/art-college/first-year/history-of-art-and-asthetics`.
- **Medium — Span pattern (`index % 5 === 0 ? 7 : 5`) creates
  unbalanced rows.** Two consecutive 5-col cards in a 12-col grid
  leave 2 columns blank. Either always pair 7+5 (`index % 2`) or
  use a denser 6+6 / 7+5 alternation that reads consistently.
- **Medium — No filter/sort.** "Traces" is the unified archive but
  has no faceting (kind, year, tag). Add a small filter row so
  `?kind=note` etc. are URL-addressable.
- **Nit — No total count.** A tiny eyebrow "127 traces" at the
  chapter header would set scale.

---

## Global shell

Captures: any subpage shows the shell — see e.g.
[`posts-list-desktop-full.png`](../output/playwright/audit/posts-list-desktop-full.png).

### Header — [`src/components/header.tsx`](../src/components/header.tsx)

- **High — No archive routes in primary nav.** Home / Volunteering /
  Journal / Stories are the four nav items, all home anchors. The
  actual archive (Notes, Gatherings, Study, Traces) lives only in
  the footer. Restructure to either:
  - **Option A:** Replace home anchors with archive routes, and let
    the home page itself host the section anchors via the subpage
    nav (already a breadcrumb component, easy to extend).
  - **Option B:** Add a second nav row (or a "Browse archive"
    dropdown) for archive items.
- **High — Mobile nav has no menu.** Header relies on
  `nav` + `overflow-x-auto`. Four short labels happen to fit at 390
  px today; any change breaks the layout. Add a hamburger drawer
  for screens < 640 px (or restructure under the breadcrumb).
- **Medium — Logo "MJT" is the only brand mark.** A 0.68rem
  uppercase mono-style wordmark is small and easy to miss. Increase
  to ~0.85rem and lift tracking slightly for mark presence.
- **Nit — Active underline is 1 px and 100% opacity, but inactive
  links offer no underline at all.** Consider giving inactive links
  a 0.2-opacity underline that resolves to 1 on hover so the active
  state is a brightening rather than a binary appear.

### SubpageNavigation — [`src/components/subpage-navigation.tsx`](../src/components/subpage-navigation.tsx)

- **Medium — Crumbs shrink to `Archive / #Tags` style on mobile and
  can be hard to read at `0.69rem`.** Bump to ~0.75rem and reduce
  `tracking-[0.3em]` to `0.22em` on small screens.
- **Nit — The leading hollow circle has no semantic meaning.** Keep
  as decoration but ensure `aria-hidden`. (It is already.)
- **Nit — `dynamicParams = false` on every detail page** means
  unknown slugs 404 rather than rendering a friendly empty state.
  That is correct; consider adding a custom 404 with archive
  shortcuts.

### PageSurface — [`src/components/page-surface.tsx`](../src/components/page-surface.tsx)

- **Medium — `pb-10 md:pb-14` on the surface plus `pb-20 md:pb-28`
  on the home `<div>` plus `mt-24` on the footer creates ~10rem of
  whitespace before the footer on home.** Pick one source of
  truth.

### Footer — [`src/components/footer.tsx`](../src/components/footer.tsx)

- **High — Footer carries the entire archive nav.** Because primary
  nav lacks archive items, the footer is doing IA work. Once the
  header issue is resolved, the footer can shed the duplicate
  primary column.
- **Medium — Closing-note headline is the same weight as page H2s.**
  `text-[2.05rem] md:text-[2.7rem]` on a ~33% column width feels
  cramped on tablet. Drop to ~2.25rem max or widen the column.
- **Nit — Email/Instagram/LinkedIn use the same icon-less link
  style as the archive column.** Adding small inline icons (mail /
  external) would aid scanning.

---

## Design system

### Tokens — [`src/app/globals.css`](../src/app/globals.css)

- **Medium — Three "ink" tokens overlap.** `--ink`, `--foreground`,
  and bespoke `text-[color:var(--ink)]/70` are used interchangeably.
  Standardize on `--foreground` and tier opacities (`--foreground`,
  `--foreground-soft`, `--foreground-muted`).
- **Medium — Type scale lives inline.** Every page repeats
  `text-[clamp(2.4rem,5.6vw,4.65rem)]` etc. Hoist to Tailwind
  arbitrary aliases (e.g. `text-display`, `text-h1`, `text-h2`)
  declared in `globals.css` via `@theme inline` for consistency
  and easy tuning.
- **Medium — Spacing scale gap.** `--space-section: clamp(4rem,
  8vw, 7rem)` is used in `.section-block`, but most pages use raw
  `py-14 md:py-18`. Either route every page through `.section-block`
  or expose a Tailwind utility (`section-y`).
- **Medium — Card recipes drift.** `shell-card`, `signal-card`,
  `editorial-surface`, `story-panel`, `post-card`'s inline gradient,
  and `trace-card`'s inline gradient all use slightly different
  cream gradients and shadow recipes. Consolidate into 2 named
  recipes (`paper-card`, `paper-card-strong`) and apply via class.
- **Nit — `--measure-prose: 70ch` and `--measure-wide: 92ch` are
  declared but only `mdx-content` uses them.** Use them across
  long-form copy (`body-copy`, `chapter-header` description) so the
  reading measure stays predictable.

### Cards

- **Medium — TraceCard underline-on-hover (`decoration-transparent`
  → `decoration-line-strong`) is subtle.** Bump
  `decoration-line-strong` to `decoration-foreground` on hover so
  the affordance is visible without leaning in.
- **Medium — PostCard right-aligns dl values which separates label
  from value across a wide gap on `xl`.** Move to `flex
  items-baseline gap-3 justify-between` so the value still tracks
  the label.

### MDX — [`src/components/mdx/mdx.tsx`](../src/components/mdx/mdx.tsx)

- **Medium — Ordered list spacing tight.** `space-y-3` becomes
  visually `0` at line-height 1.85. Bump to `space-y-5`.
- **Medium — Code block dark theme is a single `#1f1d1a` background
  with no syntax highlighting.** Add `rehype-pretty-code` or
  `shiki` so multi-line code blocks read.
- **Medium — `<a>` underline color is `--accent`/55.** That's a
  teal underline on a paper background — tasteful — but the
  contrast under "decoration-1 underline-offset-4" is borderline at
  small sizes. Consider `accent-strong/70`.
- **Nit — No `<table>` or `<img>` styles.** Add `<table>`, `<img>`
  (with caption support), and `<figure>` to `mdxComponents` so
  long-form posts can embed richer content.

### Motion

- **Medium — Hero animations always run.** Even when off-screen,
  ken-burns + grain + flare keep ticking. Add an
  `IntersectionObserver` to pause when not visible.
- **Nit — Volunteering rail scroll snap behavior on touchpad.**
  Sometimes overshoots with mouse-wheel scrolling; consider
  `scroll-snap-type: x proximity` instead of `mandatory` for a
  softer feel.

### Accessibility

- **High — Focus styles depend on `outline: 2px solid rgba(81, 100,
  87, 0.7)` against the paper background.** Contrast is ~3.2:1
  which passes 3:1 for non-text elements but is not generous. Bump
  to `--accent-strong` for more pop.
- **High — Volunteering slides are `<article>` with no headings
  exposed at semantic level.** The H3 inside is wrapped in white
  text on a gradient — fine — but screen readers reading the
  region will hear "Region: Community work, article …" repeatedly.
  Add `aria-labelledby` referencing the slide H3.
- **Medium — Skip link missing.** Long-form pages have a back
  link but no "skip to main content" anchor before the header.
- **Nit — Hero CTAs use `→` glyphs**, not iconography, which is
  fine, but ensure the arrow is wrapped in `aria-hidden`.

---

## Prioritized backlog

### P0 — Ship before the next public share

1. **Fix the LongformEntry 22ch wrapper.** Move `max-w-[22ch]` from
   the parent `<header>` onto the `<h1>` (and adjust to ~16–18ch),
   or replace with a `rem`-based cap (`max-w-3xl`). Single change,
   repairs `/posts/[slug]`, `/events/[slug]`, and every
   `/art-college/[...slug]` route.
2. **Repair the `/posts` cover-image pipeline.** Either ship real
   covers, swap `FALLBACK_COVER` from `/portfolio.jpg` to a neutral
   abstract texture, or render a typographic fallback card when no
   cover is available.
3. **Fix lower-case page titles.** Edit `content/posts/index.mdx`,
   `content/shop/index.mdx`, and `content/shop/stickers.mdx` to use
   editorial casing (or update fallbacks in their `page.tsx`).
4. **De-dup the art-college index.** Stop printing description +
   intro twice on the page header, and stop propagating section
   description to entry cards.
5. **De-dead-end art-college section pages.** Render a child list
   on `/art-college/<section>` so the route is not a leaf.
6. **Lift archive into primary nav.** Replace home anchors with
   Notes / Gatherings / Study / Traces (or add them as a second
   row), and ship a mobile drawer.

### P1 — Next iteration

1. **Cover image strategy.** Decide whether posts get covers at all.
   If not, redesign `PostCard` as a typographic card (eyebrow +
   title + meta + small accent rule) and remove `/portfolio.jpg`.
2. **Trace duplication.** Disambiguate the two "Ink Study: Learning
   the Weight of Water" entries on `/traces`.
3. **Source-content typo:** "asthetics" → "aesthetics".
4. **Copy and case consistency:** `Studio Notes` tag, hike post
   title, `Updated DEC 15, 2025` casing rules.
5. **Hero rhythm card vs. chips duplication.** Render once.
6. **Volunteering slide right-edge gradient.** Strengthen for AA
   contrast on bright frames.
7. **Action panel ergonomics.** Lay out share actions in a row,
   add visible labels or eyebrow header.
8. **Shop transactional copy.** Rename "Buy / Details" and
   simplify the embedded contact form to a CTA.
9. **Trace-card decoration-on-hover** bump to `--foreground` for
   a clearer hover affordance.
10. **Skip link** + active-state behavior on home anchors.

### P2 — Polish

1. **Type scale, spacing, and card recipes** lifted to tokens or
   shared utilities; reduce drift between `shell-card`,
   `signal-card`, `story-panel`, etc.
2. **MDX**: pretty-code highlighter, `<table>`, `<img>` /
   `<figure>` styles, list spacing.
3. **Hero motion** pauses when off-screen.
4. **Volunteering rail** scroll-snap softened to `proximity`.
5. **Filter/sort on `/traces`** with URL params.
6. **Footer**: drop primary nav once header carries archive, add
   inline icons to socials.
7. **Tags**: hashtag formatting rule, "back to all tags" link, tag
   row on `LongformEntry`.
8. **Microcopy**: empty states for `/events` (no upcoming),
   `/shop` (single item), `/tags/[tag]` (single trace).
9. **Footer headline**: cap to `2.25rem` to relieve the closing
   note column.
10. **`prefers-reduced-motion` audit pass** across the volunteering
    rail and any new animation work.

---

## Reading the screenshots

All 56 captures live under [`output/playwright/audit/`](../output/playwright/audit).
Naming pattern: `<route>-<viewport>-<framing>.png`.

- `<route>`: `home`, `posts-list`, `posts-detail-note`,
  `posts-detail-hike`, `events-list`, `events-detail`,
  `art-college-list`, `art-college-section`, `art-college-leaf`,
  `shop-list`, `shop-detail`, `tags-index`, `tags-detail`, `traces`.
- `<viewport>`: `desktop` (1440 × 900) or `mobile` (390 × 844).
- `<framing>`: `fold` (above-the-fold viewport) or `full` (entire
  scrollable page).

To regenerate after a fix, run:

```bash
PLAYWRIGHT_PATH=/Users/manishjungthapa/.npm/_npx/9833c18b2d85bc59/node_modules/playwright/index.js \
  node scripts/capture-audit.mjs
```

Replace the `PLAYWRIGHT_PATH` with the local install once Playwright
is added as a dev dependency.
