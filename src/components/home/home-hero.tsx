/**
 * Full-viewport home hero: identity, craft line, CTAs, rhythm card, and
 * the looping background video. All copy comes from
 * `content/site/home-hero.json` so editing copy never requires touching JSX.
 */

import Link from "next/link";

import homeHero from "@content/site/home-hero.json";

import { HomeHeroMedia } from "./home-hero-media";

export type HomeHeroContent = typeof homeHero;

const DEFAULT_POSTER = "/hero/hero-poster.jpg";
const DEFAULT_OVERLAY_OPACITY = 0.62;

export function HomeHero() {
  const { backgroundVideo, chips, rhythm } = homeHero;
  const poster = backgroundVideo?.poster ?? DEFAULT_POSTER;
  const overlayOpacity = backgroundVideo?.overlayOpacity ?? DEFAULT_OVERLAY_OPACITY;

  return (
    <section
      id="home"
      className="hero-section relative w-full min-h-[100svh] overflow-hidden scroll-mt-28"
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

      <div className="relative z-10 flex min-h-[100svh] items-end pt-[calc(var(--header-height)+3.5rem)]">
        <div className="page-wrap section-block w-full">
          <div className="grid gap-11 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-9">
              <p className="eyebrow hero-eyebrow text-white/70">
                <span className="hero-eyebrow__seam" aria-hidden />
                {homeHero.eyebrow}
              </p>

              <div className="hero-headline section-heading-stack">
                <h1 className="hero-name">
                  <span className="hero-name__given">{homeHero.name.first}</span>
                  <span className="hero-name__family">{homeHero.name.last}</span>
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
                <Link
                  href={homeHero.primaryCta.href}
                  className="hero-cta hero-cta--primary inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/18 px-5 py-2.5 font-medium text-[color:var(--base)] hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/24"
                >
                  {homeHero.primaryCta.label}
                  <span aria-hidden className="hero-cta__arrow">→</span>
                </Link>
                <Link
                  href={homeHero.secondaryCta.href}
                  className="hero-cta inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 py-2.5 text-[color:var(--base)] hover:-translate-y-0.5 hover:border-white/45 hover:text-white"
                >
                  {homeHero.secondaryCta.label}
                </Link>
              </div>

              <div className="grid gap-3 pt-1 sm:grid-cols-3">
                {chips.map((chip) => (
                  <div
                    key={chip.label}
                    className="rounded-2xl border border-white/18 bg-black/24 px-4 py-3 backdrop-blur-[1px]"
                  >
                    <p className="eyebrow mb-2 text-white/70">{chip.label}</p>
                    <p className="text-sm text-white/86">{chip.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="paper-card-strong relative overflow-hidden bg-[color:var(--surface)]/90 px-7 py-7 backdrop-blur-[1px] md:px-9 md:py-9">
              <div
                aria-hidden
                className="absolute inset-y-6 left-6 w-px bg-[linear-gradient(180deg,transparent,rgba(16,35,49,0.15),transparent)]"
              />
              <div className="relative ml-5 space-y-6">
                <div className="space-y-2.5">
                  <p className="eyebrow">{rhythm.eyebrow}</p>
                  <p className="max-w-[34ch] text-[1.02rem] leading-8 text-[color:var(--foreground)]/86">
                    {rhythm.description}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="page-wrap relative z-10 mt-12 flex items-center gap-4 pb-8 text-xs uppercase tracking-[0.28em] text-white/78 md:mt-16 md:pb-10">
        <span>{homeHero.scrollLabel}</span>
        <span className="h-px w-16 bg-white/40" />
        <span className="scroll-dot h-2 w-2 rounded-full bg-white/78" />
      </div>
    </section>
  );
}
