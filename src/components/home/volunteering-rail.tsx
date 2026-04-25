"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

/**
 * Client-side rail for the home Volunteering section.
 *
 * Owns three things the parent server component shouldn't:
 *   1. Per-slide composition for `gathering` (event) vs `note` (post).
 *   2. The thin segmented progress track sitting above the rail.
 *   3. IntersectionObserver-driven active-index tracking that drives
 *      the progress track as the user scrolls.
 *
 * The rail itself remains a CSS scroll-snap container; the observer
 * just listens for which slide is most visible inside the scroller.
 */

export type VolunteeringSlide = {
  id: string;
  kind: "gathering" | "note";
  title: string;
  description: string;
  pullQuote?: string;
  href: string;
  meta: string;
  location?: string;
  image?: string;
};

type Labels = {
  ariaLabel: string;
  kindLabels: { gathering: string; note: string };
  gatheringCtaLabel: string;
  noteCtaLabel: string;
};

type Props = {
  slides: VolunteeringSlide[];
  labels: Labels;
};

export function VolunteeringRail({ slides, labels }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();

  useEffect(() => {
    const root = railRef.current;
    if (!root) return;

    const targets = slideRefs.current.filter(
      (el): el is HTMLElement => el !== null,
    );

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!mostVisible) return;

        const idx = Number(
          (mostVisible.target as HTMLElement).dataset.index ?? "0",
        );

        if (!Number.isNaN(idx)) {
          setActiveIndex(idx);
        }
      },
      { root, threshold: [0.5, 0.75] },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [slides.length]);

  return (
    <>
      <div className="page-wrap mb-5 md:mb-7">
        <div className="volunteering-progress" aria-hidden="true">
          {slides.map((slide, index) => (
            <span
              key={slide.id}
              className="volunteering-progress__segment"
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      <div
        ref={railRef}
        className="volunteering-rail"
        role="region"
        aria-label={labels.ariaLabel}
      >
        {slides.map((slide, index) => {
          const headingId = `${baseId}-${slide.id}-title`;
          const kindLabel =
            slide.kind === "gathering"
              ? labels.kindLabels.gathering
              : labels.kindLabels.note;
          const ctaLabel =
            slide.kind === "gathering"
              ? labels.gatheringCtaLabel
              : labels.noteCtaLabel;

          if (slide.kind === "gathering") {
            const backgroundImage = slide.image
              ? `linear-gradient(105deg, rgba(12, 25, 33, 0.86) 0%, rgba(12, 25, 33, 0.62) 55%, rgba(12, 25, 33, 0.55) 100%), url(${slide.image})`
              : undefined;

            return (
              <article
                key={slide.id}
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
                data-index={index}
                aria-labelledby={headingId}
                className="volunteering-slide volunteering-slide--gathering group"
                style={backgroundImage ? { backgroundImage } : undefined}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,244,229,0.18),transparent_45%)] opacity-70" />
                <div className="relative flex h-full flex-col justify-end gap-4 p-6 md:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-white/80">
                    <span>{kindLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{slide.meta}</span>
                    {slide.location ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{slide.location}</span>
                      </>
                    ) : null}
                  </div>
                  <div className="max-w-[58ch] space-y-3.5">
                    <h3
                      id={headingId}
                      className="text-3xl leading-[1.05] tracking-[-0.02em] text-white md:text-[3.25rem]"
                    >
                      {slide.title}
                    </h3>
                    <p className="max-w-[52ch] text-[0.98rem] leading-8 text-white/85 md:text-[1.08rem]">
                      {slide.description}
                    </p>
                  </div>
                  <div>
                    <Link
                      href={slide.href}
                      className="inline-flex items-center border-b border-white/40 pb-1 text-sm text-white hover:border-white"
                    >
                      {ctaLabel}
                    </Link>
                  </div>
                </div>
              </article>
            );
          }

          return (
            <article
              key={slide.id}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              data-index={index}
              aria-labelledby={headingId}
              className="volunteering-slide volunteering-slide--note group"
            >
              <div className="relative flex h-full flex-col justify-between gap-6 p-6 md:p-8 lg:p-12">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    <span>{kindLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{slide.meta}</span>
                  </div>
                  {slide.image ? (
                    <span
                      aria-hidden="true"
                      className="hidden h-24 w-24 flex-shrink-0 rounded-2xl border border-[color:var(--line)] bg-cover bg-center md:block"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    />
                  ) : null}
                </div>

                <div className="max-w-[58ch] space-y-4">
                  <span aria-hidden="true" className="volunteering-note-quote block">
                    &ldquo;
                  </span>
                  <h3
                    id={headingId}
                    className="font-serif text-2xl italic leading-[1.18] tracking-[-0.01em] text-[color:var(--foreground)] md:text-[2.35rem]"
                  >
                    {slide.title}
                  </h3>
                  <p className="body-copy max-w-[52ch] text-[color:var(--ink-soft)]">
                    {slide.pullQuote ?? slide.description}
                  </p>
                </div>

                <div>
                  <Link
                    href={slide.href}
                    className="story-link inline-flex items-center text-sm font-medium text-[color:var(--accent-strong)]"
                  >
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
