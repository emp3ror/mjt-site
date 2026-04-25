import Link from "next/link";

import homeContent from "@content/site/home.json";
import type { Event, Post } from "@/content";

/**
 * Full-bleed editorial rail for community work. Mixes recent events with
 * a handful of supporting posts (matched by tag) so volunteering reads
 * as a continuous practice, not a list of isolated items.
 *
 * Copy + tag triggers come from `content/site/home.json`.
 */

const COPY = homeContent.volunteering;

const ACCENTS = [
  "from-[rgba(17,44,59,0.84)]",
  "from-[rgba(95,42,33,0.82)]",
] as const;

type Slide = {
  id: string;
  title: string;
  description: string;
  href: string;
  meta: string;
  location?: string;
  image: string;
  accent: string;
};

const buildSlides = (
  events: Event[],
  posts: Post[],
  formatDate: (value?: string) => string,
): Slide[] => {
  const eventSlides: Slide[] = events.map((event, index) => ({
    id: event._id,
    title: event.title,
    description: event.description,
    href: event.url,
    location: event.location,
    meta: formatDate(event.date),
    image: index % 2 === 0 ? COPY.fallbackImages.primary : COPY.fallbackImages.secondary,
    accent: ACCENTS[index % 2],
  }));

  const supportingPosts = posts
    .filter((post) =>
      post.tags.some((tag) => COPY.supportingPostTags.includes(tag)),
    )
    .slice(0, 2);

  const postSlides: Slide[] = supportingPosts.map((post, index) => ({
    id: post._id,
    title: post.title,
    description: post.description,
    href: post.url,
    location: COPY.fallbackLocation,
    meta: formatDate(post.date),
    image: index % 2 === 0 ? COPY.fallbackImages.secondary : COPY.fallbackImages.primary,
    accent: ACCENTS[(index + 1) % 2],
  }));

  return [...eventSlides, ...postSlides].slice(0, COPY.maxSlides);
};

type Props = {
  events: Event[];
  posts: Post[];
  formatDate: (value?: string) => string;
};

export function VolunteeringSection({ events, posts, formatDate }: Props) {
  const slides = buildSlides(events, posts, formatDate);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section id="volunteering" className="section-block scroll-mt-28">
      <div className="page-wrap mb-10 md:mb-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="section-heading-stack">
            <p className="eyebrow">{COPY.eyebrow}</p>
            <h2 className="max-w-[15ch] text-h2 leading-[1.04]">
              {COPY.title}
            </h2>
          </div>
          <p className="body-copy max-w-[52ch] text-[color:var(--ink-soft)]">
            {COPY.description}
          </p>
        </div>
      </div>

      <div className="volunteering-rail">
        {slides.map((slide) => (
          <article
            key={slide.id}
            className="volunteering-slide group"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(12, 25, 33, 0.82), rgba(12, 25, 33, 0.55)), url(${slide.image})`,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,244,229,0.2),transparent_35%)] opacity-70" />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.accent} via-[rgba(17,44,59,0.35)] to-transparent opacity-90`}
            />
            <div className="relative flex h-full flex-col justify-end gap-4 p-6 md:p-8 lg:p-10">
              <div className="flex flex-wrap gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-white/72">
                <span>{slide.meta}</span>
                {slide.location ? <span>{slide.location}</span> : null}
              </div>
              <div className="max-w-[58ch] space-y-3.5">
                <h3 className="text-3xl leading-[1.05] tracking-[-0.02em] text-white md:text-[3.25rem]">
                  {slide.title}
                </h3>
                <p className="max-w-[52ch] text-[0.98rem] leading-8 text-white/84 md:text-[1.08rem]">
                  {slide.description}
                </p>
              </div>
              <div>
                <Link
                  href={slide.href}
                  className="inline-flex items-center border-b border-white/40 pb-1 text-sm text-white hover:border-white"
                >
                  {COPY.callToActionLabel}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
