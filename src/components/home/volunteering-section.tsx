import homeContent from "@content/site/home.json";
import type { Event, Post } from "@/content";

import { VolunteeringRail, type VolunteeringSlide } from "./volunteering-rail";

/**
 * Server-rendered shell for the home Volunteering section.
 *
 * Prepares the slide data (mixing recent events with tagged supporting
 * posts up to `maxSlides`) and hands it to the client `VolunteeringRail`,
 * which owns the interactive bits (scroll snap + progress track).
 *
 * Editorial copy and tag triggers come from `content/site/home.json`.
 */

const COPY = homeContent.volunteering;

const cleanCover = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const buildSlides = (
  events: Event[],
  posts: Post[],
  formatDate: (value?: string) => string,
): VolunteeringSlide[] => {
  const eventSlides: VolunteeringSlide[] = events.map((event, index) => ({
    id: event._id,
    kind: "gathering",
    title: event.title,
    description: event.description,
    href: event.url,
    location: event.location,
    meta: formatDate(event.date),
    image:
      cleanCover(event.cover) ??
      (index % 2 === 0
        ? COPY.fallbackImages.primary
        : COPY.fallbackImages.secondary),
  }));

  const supportingPosts = posts
    .filter((post) =>
      post.tags.some((tag) => COPY.supportingPostTags.includes(tag)),
    )
    .slice(0, 2);

  const postSlides: VolunteeringSlide[] = supportingPosts.map((post, index) => ({
    id: post._id,
    kind: "note",
    title: post.title,
    description: post.description,
    pullQuote: post.pullQuote,
    href: post.url,
    meta: formatDate(post.date),
    image:
      cleanCover(post.cover) ??
      (index % 2 === 0
        ? COPY.fallbackImages.secondary
        : COPY.fallbackImages.primary),
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

      <VolunteeringRail
        slides={slides}
        labels={{
          ariaLabel: "Community work",
          kindLabels: COPY.kindLabels,
          gatheringCtaLabel: COPY.gatheringCtaLabel,
          noteCtaLabel: COPY.noteCtaLabel,
        }}
      />
    </section>
  );
}
