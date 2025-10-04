import { cn } from "@/lib/cn";

type BadgeProps = {
  className?: string;
  children: React.ReactNode;
};

export function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[color:var(--accent)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
