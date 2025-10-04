Here’s a copy-paste **super-prompt** you can drop into VSCode ChatGPT (or similar) to scaffold a Next.js theme that matches the portfolio look you shared.

---

### Prompt to generate the theme (paste everything below)

**Role**: You are a senior Next.js/Tailwind engineer and brand designer.
**Goal**: Build a playful, illustration-friendly **portfolio theme** matching this aesthetic: warm cream background, orange highlights, navy text, quirky headings, doodle dividers, mixed illustration + photography.

**Tech & constraints**

* Next.js 15+ (App Router), TypeScript, Tailwind CSS, Framer Motion.
* Fonts: Google **Baloo 2** (headings) + **Inter** (body).
* Icons: lucide-react.
* Content in `/content` as JSON/MDX so it’s easy to edit.
* Fully responsive, accessible (WCAG AA), keyboard navigable.
* Optimized images with `next/image`.
* Deploy-ready (Vercel). Use `yarn`.
* Keep it lightweight—no CMS for v1.

**Brand tokens (use Tailwind custom colors)**

* `bg` (page): `#FFF7F0` (soft cream)
* `ink` (body text): `#2C2D5E` (navy)
* `accent` (primary): `#F25C27` (warm orange)
* `muted` (lines/icons): `#B6B9D3`
* `leaf` (secondary): `#4AAE69`
* Never use pure black/white; keep contrast comfortable.

**Design language**

* Friendly, youthful, professional.
* Hand-drawn display headings, clean body copy.
* Subtle paper grain/noise overlay (CSS layer, very light).
* Curved section separators and **doodle SVG dividers** (clouds/flowers/lines).
* Photo + vector collages (as in the reference).
* Hover micro-interactions; gentle entrance motions.

**App structure to generate**

```
/app
  /[locale] (optional for i18n later)
  /api/contact/route.ts (vercel serverless email stub)
  /components
    Header.tsx
    Footer.tsx
    Container.tsx
    DoodleDivider.tsx (SVG patterns w/ props: variant="cloud|lotus|line")
    SectionHeading.tsx
    Badge.tsx
    Timeline.tsx
    SkillBar.tsx
    Card.tsx
    PhotoIllustration.tsx (image + svg mask collage)
  /sections
    Hero.tsx
    About.tsx
    Experience.tsx
    Skills.tsx
    Works.tsx
    Testimonials.tsx
    Contact.tsx
  /content
    site.json       (name, socials, nav)
    hero.json       (title, subtitle, cta)
    about.mdx
    experience.json (timeline items)
    skills.json     (groups + levels)
    works.json      (projects grid)
    testimonials.json
  globals.css
  layout.tsx
  page.tsx
/tailwind.config.ts
```

**Section specs**

1. **Header**

   * Logo (text or SVG), nav items with pill hover underlines in `accent`.
   * Mobile menu: animated sheet.

2. **Hero**

   * Left: big greeting in Baloo 2, 2-line subtitle.
   * Right: `PhotoIllustration`—one portrait over soft blob + doodles.
   * CTA buttons: “View Work”, “Contact”.
   * Floating badges (Framer Motion) with icons: Packaging, Graphic Design, Illustration, 2D Game Art.

3. **About**

   * Two-column layout: short bio + “Softwares” badges (Ai, Ps, Pr, Id, Figma).
   * Light doodle background strip (lotus/cloud pattern).

4. **Experience (Timeline)**

   * Items with role, org, year range, bullet achievements.
   * Add small illustrated markers on the line.
   * Accepts data from `experience.json`.

5. **Skills**

   * Grouped badges + optional `SkillBar` (0–100).
   * Categories: Packaging Design, Graphic Design, Illustration Art, 2D Game Art.
   * Each card uses subtle shadow and doodle corner.

6. **Works / Projects**

   * Masonry/auto-fit grid of cards.
   * Each card: cover image, tags, quick view modal with details & link.
   * Filter chips at top (All/Packaging/Graphic/Illustration/2D Game).

7. **Testimonials**

   * 2–3 quotes with avatar circle crops; gentle auto-carousel.

8. **Contact**

   * Copy block + form (name, email, message).
   * Server route at `/api/contact` (stub that logs payload). Ready to swap to email provider later.
   * Social icons row.

9. **Footer**

   * Small nav + copyright + “Made with ❤️”.

**Animations**

* Section fade/slide on enter (reduced motion respected).
* Hover: scale 1.02 on cards, underline slides on links.

**Doodles & textures**

* Provide 3 inline SVG variants in `DoodleDivider.tsx` (cloud, lotus, line), color with `currentColor` and set `text-muted`/`text-accent`.
* Add super-subtle page-wide paper grain via CSS background `radial-gradient` + `background-blend-mode:multiply` (keep <2% strength).

**Accessibility**

* Semantic landmarks, `aria-label`s where needed.
* Focus styles visible, color contrast AA.
* All images with alt text from content files.

**Generate starter content** (replace with placeholders where needed):

* `site.json` with name, email, Behance/Instagram/Dribbble/LinkedIn links.
* `about.mdx` ~120 words.
* 5 timeline items (2019–2025).
* 12 projects spread across 4 categories with placeholder images from `https://picsum.photos/seed/{slug}/800/600`.
* 3 testimonials.

**Tailwind config snippet**

* Extend theme with the brand tokens, Baloo 2/Inter as fonts.
* Add container padding defaults.
* Add `drop-shadow-soft` utility.

**Scripts**

* `yarn dlx create-next-app@latest` (but output full project directly).
* Include `yarn dev`, `yarn build`, `yarn lint`.

**Deliverables**

1. All files listed above with working code.
2. Compiles with `yarn dev` out of the box.
3. README with setup steps, how to edit `/content`, and where to replace images.
4. Clear TODOs: connect real email, swap placeholder images, tune SEO.

**Acceptance criteria**

* The homepage renders all sections with the defined style.
* Theme visually matches the provided aesthetic (cream bg, orange highlights, navy text, playful headings, doodles, photo+illustration collage).
* Lighthouse ≥90 for Performance/Best Practices/SEO (on placeholder content).
* No console errors; mobile menu and filters work.

**Now build it. Output the complete project file tree and all file contents.**

---

If you want, I can also generate the **tailwind config + tokens** and a couple of key components here so you can start coding immediately.
