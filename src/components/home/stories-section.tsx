import Link from "next/link";

import homeContent from "@content/site/home.json";
import type { Post } from "@/content";

/**
 * "Stories & experiments" home block: a wide studio statement, a focus-
 * area card, and a few story panels selected from posts (one per
 * category configured in `content/site/home.json`).
 */

const COPY = homeContent.stories;
const STORY_SPANS = ["lg:col-span-4", "lg:col-span-3", "lg:col-span-5"] as const;

type Category = keyof typeof COPY.fallbackImages;

const imageFor = (category?: string): string => {
  const key = (category as Category | undefined) ?? "tech";
  return COPY.fallbackImages[key] ?? COPY.fallbackImages.tech;
};

type Props = {
  posts: Post[];
};

export function StoriesSection({ posts }: Props) {
  const stories = COPY.categoriesToFeature
    .map((category) => posts.find((post) => post.category === category))
    .filter((post): post is Post => Boolean(post));

  return (
    <section id="stories" className="page-wrap section-block scroll-mt-28">
      <div className="mb-10 flex flex-col gap-5 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="section-heading-stack">
          <p className="eyebrow">{COPY.eyebrow}</p>
          <h2 className="max-w-[18ch] text-h2 leading-[1.03]">
            {COPY.title}
          </h2>
        </div>
        <p className="body-copy max-w-[44ch] text-[color:var(--ink-soft)]">
          {COPY.description}
        </p>
      </div>

      <div className="stories-grid">
        <div className="paper-card-strong relative overflow-hidden p-6 md:p-8 lg:col-span-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(42,84,97,0.14),transparent_38%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="eyebrow">{COPY.studioStatement.eyebrow}</p>
              <h3 className="text-[2rem] leading-[1.08] tracking-[-0.02em] md:text-[2.6rem]">
                {COPY.studioStatement.title}
              </h3>
            </div>
            <p className="body-copy max-w-[48ch] text-[color:var(--ink-soft)]">
              {COPY.studioStatement.description}
            </p>
          </div>
        </div>

        <div className="paper-card relative overflow-hidden bg-[color:var(--surface)]/88 p-6 md:p-8 lg:col-span-5">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">{COPY.focusAreas.eyebrow}</p>
              <h3 className="text-[2rem] leading-[1.1] tracking-[-0.02em]">
                {COPY.focusAreas.title}
              </h3>
            </div>
            <span
              aria-hidden
              className="mt-1 h-12 w-12 rounded-full border border-[color:var(--line-strong)]"
            />
          </div>
          <div className="grid gap-4 text-[0.98rem] leading-8 text-[color:var(--ink-soft)]">
            {COPY.focusAreas.items.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 border-t border-[color:var(--line)] pt-5"
              >
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {stories.map((story, index) => (
          <article
            key={story._id}
            className={`paper-card-strong relative overflow-hidden ${STORY_SPANS[index] ?? "lg:col-span-4"}`}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center opacity-14"
              style={{ backgroundImage: `url(${imageFor(story.category)})` }}
            />
            <div className="relative flex h-full min-h-72 flex-col justify-between p-6 md:p-8">
              <div className="space-y-3">
                <p className="eyebrow">{story.category}</p>
                <h3 className="max-w-[16ch] text-[2rem] leading-[1.08] tracking-[-0.02em]">
                  <Link href={story.url} className="story-link">
                    {story.title}
                  </Link>
                </h3>
              </div>
              <p className="max-w-[40ch] text-[0.98rem] leading-8 text-[color:var(--ink-soft)]">
                {story.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
