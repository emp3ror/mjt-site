import { cn } from "@/lib/cn";

type SkillBarProps = {
  label: string;
  level: number;
  accent?: "accent" | "leaf";
  className?: string;
};

export function SkillBar({ label, level, accent = "accent", className }: SkillBarProps) {
  const percentage = Math.min(Math.max(level, 0), 100);

  const accentClass =
    accent === "leaf"
      ? "from-[color:var(--leaf)]/80 via-[color:var(--leaf)] to-[color:var(--accent)]/70"
      : "from-[color:var(--accent)] via-[color:var(--accent)]/80 to-[color:var(--leaf)]/70";

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink)]/70">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/70 shadow-inner">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", accentClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
