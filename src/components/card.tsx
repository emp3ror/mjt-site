import { cn } from "@/lib/cn";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[color:var(--muted)]/40 bg-white/85 p-6 shadow-[0_16px_40px_rgba(44,45,94,0.12)] transition will-change-transform hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(44,45,94,0.18)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
