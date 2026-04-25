/**
 * Page-level header (eyebrow + h1 + optional description) used at the top
 * of index/listing routes like `/posts`, `/events`, `/traces`, `/tags`.
 */

import { cn } from "@/lib/cn";

type ChapterHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function ChapterHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: ChapterHeaderProps) {
  return (
    <header
      className={cn(
        "space-y-4",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="max-w-[18ch] text-h1 leading-[1.02] tracking-[-0.03em]">{title}</h1>
      {description ? (
        <p className="body-copy text-[color:var(--ink-soft)]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
