import { cn } from "@/lib/cn";

export type TimelineItem = {
  title: string;
  organization: string;
  timeframe: string;
  highlights: string[];
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-10 border-l-4 border-[color:var(--muted)]/50 pl-10", className)}>
      {items.map((item, index) => (
        <li key={`${item.title}-${item.timeframe}`} className="group relative">
          <span className="absolute -left-[2.05rem] top-1 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(44,45,94,0.16)]">
            <span className="h-3.5 w-3.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_6px_rgba(242,92,39,0.18)] transition group-hover:scale-110" />
          </span>

          <div className="flex flex-col gap-3 rounded-3xl bg-white/85 p-6 shadow-[0_18px_50px_rgba(44,45,94,0.12)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-semibold text-[color:var(--ink)]">{item.title}</h3>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                {item.timeframe}
              </p>
            </div>
            <p className="text-sm font-medium text-[color:var(--ink)]/70">{item.organization}</p>
            <ul className="space-y-2 text-sm text-[color:var(--ink)]/80">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-3 rounded-full bg-[color:var(--leaf)]" aria-hidden />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <span className="absolute -left-10 top-1 text-3xl font-semibold text-[color:var(--muted)]/30">
            {(index + 1).toString().padStart(2, "0")}
          </span>
        </li>
      ))}
    </ol>
  );
}
