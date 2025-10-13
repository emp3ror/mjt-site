import Link from "next/link";

import { Card } from "@/components/card";
import { cn } from "@/lib/cn";
import type { Post } from "contentlayer/generated";

type PostCardProps = {
  post: Post & { featured?: boolean };
  className?: string;
  titleClassName?: string;
  showTags?: boolean;
  showReadingTime?: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));

export function PostCard({
  post,
  className,
  titleClassName,
  showTags = false,
  showReadingTime = false,
}: PostCardProps) {
  const shouldShowTags = showTags && post.tags?.length;
  const shouldShowReadingTime = showReadingTime && Boolean(post.readingTime);

  return (
    <Card className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
          {formatDate(post.date)}
        </span>
        <Link
          href={post.url}
          className={cn("block text-lg font-semibold text-[color:var(--ink)]", titleClassName)}
        >
          {post.title}
        </Link>
      </div>

      {post.description ? <p className="text-sm text-[color:var(--ink)]/70">{post.description}</p> : null}

      {shouldShowTags ? (
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/55">
          {post.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-white/70 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/50">
        <span>{post.category}</span>
        {shouldShowReadingTime ? <span>{post.readingTime}</span> : null}
      </div>
    </Card>
  );
}
