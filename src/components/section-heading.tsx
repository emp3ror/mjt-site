/**
 * Section header (eyebrow + h2 + optional description) used in section
 * intros across the site. Use `ChapterHeader` for page-level h1 headings.
 */

import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("space-y-3", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="text-3xl leading-tight md:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-base leading-8 text-[color:var(--ink-soft)]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
