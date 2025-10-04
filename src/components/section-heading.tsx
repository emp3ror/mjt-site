import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <header className={cn("space-y-3", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl font-semibold leading-tight text-[color:var(--ink)] md:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-base text-[color:var(--ink)]/75">{description}</p>
      ) : null}
    </header>
  );
}
