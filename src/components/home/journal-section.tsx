import Link from "next/link";

import homeContent from "@content/site/home.json";
import { excerptFromMarkdown } from "@/lib/excerpt";
import type { Post } from "@/content";

/**
 * Quiet journal column on the home page: a list of recent posts rendered
 * as long-form rows (date / category / excerpt). Layout is constrained
 * so it reads at "reading speed" rather than as a grid of cards.
 *
 * Copy comes from `content/site/home.json`.
 */

const COPY = homeContent.journal;

type Props = {
  posts: Post[];
  formatDate: (value?: string) => string;
};

export function JournalSection({ posts, formatDate }: Props) {
  const entries = posts.slice(0, COPY.maxEntries).map((post) => ({
    id: post._id,
    title: post.title,
    href: post.url,
    date: formatDate(post.date),
    category: post.category,
    excerpt: excerptFromMarkdown(post.body.raw, COPY.excerptLength),
  }));

  if (entries.length === 0) {
    return null;
  }

  return (
    <section id="journal" className="page-wrap section-block scroll-mt-28">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-5">
          <p className="eyebrow">{COPY.eyebrow}</p>
          <h2 className="max-w-[14ch] text-h2 leading-[1.05]">
            {COPY.title}
          </h2>
          <p className="body-copy max-w-[40ch] text-[color:var(--ink-soft)]">
            {COPY.description}
          </p>
        </div>

        <div className="space-y-9">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="journal-entry grid gap-4 border-t border-[color:var(--line)] pt-7 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8"
            >
              <div className="space-y-2 text-sm text-[color:var(--muted)]">
                <p>{entry.date}</p>
                <p className="eyebrow text-[0.65rem]">{entry.category}</p>
              </div>
              <div className="space-y-3.5">
                <h3 className="text-2xl leading-[1.08] tracking-[-0.02em] md:text-[2.15rem]">
                  <Link href={entry.href} className="story-link">
                    {entry.title}
                  </Link>
                </h3>
                <p className="body-copy max-w-[56ch] text-[color:var(--ink-soft)]">
                  {entry.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
