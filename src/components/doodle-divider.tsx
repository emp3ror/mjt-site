import { cn } from "@/lib/cn";

type DoodleVariant = "cloud" | "lotus" | "line";

type DoodleDividerProps = {
  variant?: DoodleVariant;
  className?: string;
  colorClassName?: string;
};

const DOODLE_COMPONENTS: Record<DoodleVariant, JSX.Element> = {
  cloud: (
    <svg viewBox="0 0 400 80" role="img" aria-hidden fill="none" stroke="currentColor" strokeWidth="4">
      <path
        d="M10 50c20-20 60-20 80 0 40-40 100-40 140 0 30-30 80-30 110 0 20-20 60-20 80 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  lotus: (
    <svg viewBox="0 0 400 80" role="img" aria-hidden fill="none" stroke="currentColor" strokeWidth="3">
      <path
        d="M20 60c40-40 80-40 120 0 40-40 80-40 120 0 40-40 80-40 120 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M80 40l20-30 20 30" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M200 40l20-30 20 30" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M320 40l20-30 20 30" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  line: (
    <svg viewBox="0 0 400 80" role="img" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5">
      <path
        d="M20 40c25 15 55 15 80 0 30 15 60 15 90 0 30 15 60 15 90 0 30 15 60 15 100 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M40 50l10 10" strokeLinecap="round" />
      <path d="M360 50l-10 10" strokeLinecap="round" />
    </svg>
  ),
};

export function DoodleDivider({ variant = "cloud", className, colorClassName }: DoodleDividerProps) {
  return (
    <div className={cn("pointer-events-none select-none", className)}>
      <div className={cn("mx-auto max-w-3xl", colorClassName)}>{DOODLE_COMPONENTS[variant]}</div>
    </div>
  );
}
