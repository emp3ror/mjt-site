/**
 * Full-viewport home hero: identity, craft line, CTAs, rhythm card, and
 * the looping background video. All copy comes from
 * `content/site/home-hero.json` so editing copy never requires touching JSX.
 */

import Link from "next/link";

import homeHero from "@content/site/home-hero.json";

import { getHomeSectionIds } from "@/lib/home-sections";

import { HomeHeroMedia } from "./home-hero-media";

export type HomeHeroContent = typeof homeHero;

const DEFAULT_POSTER = "/hero/hero-poster.jpg";
const DEFAULT_OVERLAY_OPACITY = 0.62;

/**
 * Home sections hide themselves when they have no content, so an in-page CTA
 * can point at a section that isn't on the page. Drop those CTAs rather than
 * render a button that does nothing when clicked.
 */
const ctaResolves = (href: string, sectionIds: ReadonlySet<string>) =>
  href.startsWith("#") ? sectionIds.has(href.slice(1)) : true;

export function HomeHero() {
  const { backgroundVideo } = homeHero;
  const poster = backgroundVideo?.poster ?? DEFAULT_POSTER;
  const overlayOpacity = backgroundVideo?.overlayOpacity ?? DEFAULT_OVERLAY_OPACITY;

  const sectionIds = getHomeSectionIds();
  const showPrimaryCta = ctaResolves(homeHero.primaryCta.href, sectionIds);
  const showSecondaryCta = ctaResolves(homeHero.secondaryCta.href, sectionIds);
  // If the primary CTA fell away, the secondary one carries the emphasis.
  const secondaryIsLead = !showPrimaryCta;

  return (
    <section
      id="home"
      className="hero-section relative flex w-full flex-col overflow-hidden scroll-mt-28"
    >
      <HomeHeroMedia
        poster={poster}
        mp4={backgroundVideo?.mp4}
        webm={backgroundVideo?.webm}
        overlayOpacity={overlayOpacity}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-10 z-10 h-px bg-[radial-gradient(circle,_rgba(255,250,240,0.32)_0,_rgba(255,250,240,0.32)_1px,transparent_1.5px)] bg-[length:18px_1px] opacity-50"
      />

      <div className="relative z-10 flex flex-1 items-end pt-[calc(var(--header-height)+3.5rem)] pb-20 md:pb-24">
        <div className="page-wrap section-block w-full">
          <div className="max-w-[64ch] space-y-9">
            <p className="eyebrow hero-eyebrow text-white/70">
              <span className="hero-eyebrow__seam" aria-hidden />
              {homeHero.eyebrow}
            </p>

            <div className="hero-headline section-heading-stack">
              <h1 className="hero-name">
                <span className="hero-name__line">
                  <span className="hero-name__given">{homeHero.name.first}</span>
                  <span className="hero-name__family">{homeHero.name.last}</span>
                </span>
                <span className="hero-name__rule" aria-hidden />
              </h1>
              <p className="hero-craft max-w-[34ch] text-xl leading-9 text-white/86 md:text-[1.38rem] md:leading-10">
                {homeHero.craftLine.prefix}{" "}
                <em className="hero-craft__emphasis">{homeHero.craftLine.emphasis}</em>{" "}
                {homeHero.craftLine.suffix}
              </p>
              <p className="hero-lede max-w-[52ch] text-[1.03rem] leading-8 text-white/80 md:text-[1.12rem] md:leading-9">
                {homeHero.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 text-sm text-white/82">
              {showPrimaryCta ? (
                <Link
                  href={homeHero.primaryCta.href}
                  className="hero-cta hero-cta--primary inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/18 px-5 py-2.5 font-medium text-[color:var(--base)] hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/24"
                >
                  {homeHero.primaryCta.label}
                  <span aria-hidden className="hero-cta__arrow">→</span>
                </Link>
              ) : null}
              {showSecondaryCta ? (
                <Link
                  href={homeHero.secondaryCta.href}
                  className={
                    secondaryIsLead
                      ? "hero-cta hero-cta--primary inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/18 px-5 py-2.5 font-medium text-[color:var(--base)] hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/24"
                      : "hero-cta inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 py-2.5 text-[color:var(--base)] hover:-translate-y-0.5 hover:border-white/45 hover:text-white"
                  }
                >
                  {homeHero.secondaryCta.label}
                  {secondaryIsLead ? (
                    <span aria-hidden className="hero-cta__arrow">→</span>
                  ) : null}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrap absolute inset-x-0 bottom-0 z-10 flex items-center gap-4 pb-8 text-xs uppercase tracking-[0.28em] text-white/78 md:pb-10">
        <span>{homeHero.scrollLabel}</span>
        <span className="h-px w-16 bg-white/40" />
        <span className="scroll-dot h-2 w-2 rounded-full bg-white/78" />
      </div>
    </section>
  );
}
