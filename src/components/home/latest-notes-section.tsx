import Link from "next/link";

import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";
import type { Post } from "contentlayer/generated";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

type LatestNotesSectionProps = {
  posts: Array<Post & { featured?: boolean }>;
};

export function LatestNotesSection({ posts }: LatestNotesSectionProps) {
  return (
    <section id="latest-notes" className="space-y-10">
      <SectionHeading
        eyebrow="Latest Notes"
        title="Fresh from the studio log"
        description="MDX-powered posts exploring process, art studies, and experiments in public."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Card key={post._id} className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
              {formatDate(post.date)}
            </span>
            <Link href={post.url} className="text-lg font-semibold text-[color:var(--ink)]">
              {post.title}
            </Link>
            <p className="text-sm text-[color:var(--ink)]/70">{post.description}</p>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/50">
              {post.category}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-white/90 shadow-[0_18px_40px_rgba(44,45,94,0.3)] transition hover:-translate-y-1 hover:text-white"
        >
          Browse all posts
          <span aria-hidden>{">"}</span>
        </Link>
      </div>
    </section>
  );
}
