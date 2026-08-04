import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { Post } from "@/content";

type PostCardProps = {
  post: Post;
  className?: string;
};

const toCategoryLabel = (value: string) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const initialsFromTitle = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("") || "MJT";

export function PostCard({ post, className }: PostCardProps) {
  const hasCover = Boolean(post.cover && post.cover.trim().length > 0);
  const initials = initialsFromTitle(post.title);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)] shadow-[0_16px_34px_rgba(38,31,20,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(38,31,20,0.12)]",
        className,
      )}
    >
      <Link href={post.url} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {hasCover ? (
            <Image
              src={post.cover as string}
              alt=""
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,var(--surface),var(--accent-soft))] text-[color:var(--accent-strong)]"
            >
              <span className="font-serif text-[clamp(2.4rem,4vw,3.4rem)] tracking-[-0.02em]">
                {initials}
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--ink-soft)]">
                {toCategoryLabel(post.category)}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[color:var(--line)] p-6">
          <h2 className="line-clamp-2 text-[1.9rem] leading-[1.08] tracking-[-0.02em] text-[color:var(--foreground)]">
            {post.title}
          </h2>
        </div>

        <dl className="border-t border-[color:var(--line)]">
          <div className="grid grid-cols-[auto_1fr] items-center gap-3 p-5 text-[0.86rem]">
            <dt className="font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Category</dt>
            <dd className="justify-self-end font-medium text-[color:var(--ink-soft)]">{toCategoryLabel(post.category)}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center gap-3 border-t border-[color:var(--line)] p-5 text-[0.86rem]">
            <dt className="font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Date</dt>
            <dd className="justify-self-end font-medium text-[color:var(--ink-soft)]">{formatDate(post.date, "short")}</dd>
          </div>
        </dl>
      </Link>
    </article>
  );
}
