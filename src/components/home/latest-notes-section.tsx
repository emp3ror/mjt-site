import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { PostCard } from "@/components/post-card";
import latestNotesSectionContent from "@/data/home/latest-notes-section.json";
import type { Post } from "contentlayer/generated";

type LatestNotesSectionProps = {
  posts: Array<Post & { featured?: boolean }>;
};

type LatestNotesSectionContent = {
  heading: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cta: {
    label: string;
    icon: string;
  };
};

const content = latestNotesSectionContent as LatestNotesSectionContent;

export function LatestNotesSection({ posts }: LatestNotesSectionProps) {
  return (
    <section id="today-i-learned" className="w-full bg-white/70">
      <div className="container mx-auto max-w-7xl space-y-10 px-4 py-16 sm:py-20 md:px-8">
        <div id="latest-notes" className="sr-only" aria-hidden />
        <SectionHeading
          eyebrow={content.heading.eyebrow}
          title={content.heading.title}
          description={content.heading.description}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        <div className="flex justify-center">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-[color:var(--base)] shadow-[0_18px_40px_rgba(44,45,94,0.3)] transition hover:-translate-y-1 hover:text-white"
          >
            <span className="rounded-full bg-[color:var(--highlight)] px-3 py-1 text-[color:var(--ink)] shadow-[0_12px_30px_rgba(242,150,138,0.35)] transition-colors">
              {content.cta.label}
            </span>
            <span aria-hidden>{content.cta.icon}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
