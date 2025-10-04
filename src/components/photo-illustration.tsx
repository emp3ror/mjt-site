import Image from "next/image";

import { cn } from "@/lib/cn";

type PhotoIllustrationProps = {
  className?: string;
  alt?: string;
};

export function PhotoIllustration({ className, alt = "Portfolio portrait" }: PhotoIllustrationProps) {
  return (
    <div
      className={cn(
        "relative isolate flex items-center justify-center",
        "rounded-[3rem] bg-gradient-to-br from-[color:var(--accent)]/15 via-white to-[color:var(--leaf)]/10 p-6 shadow-[0_24px_80px_rgba(44,45,94,0.18)]",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[3rem]">
        <div className="absolute -top-12 -left-10 h-48 w-48 rounded-full bg-[color:var(--accent)]/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-[color:var(--leaf)]/20 blur-3xl" aria-hidden />
      </div>

      <span
        className="absolute -top-6 left-8 inline-flex rotate-[-12deg] rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)] shadow-sm"
      >
        illustrator
      </span>

      <span
        className="absolute -bottom-5 right-6 inline-flex rotate-6 rounded-2xl bg-white/80 px-3 py-2 text-xs font-semibold text-[color:var(--ink)] shadow"
      >
        mixed media
      </span>

      <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-[2.25rem] border-4 border-white/80 shadow-inner">
        <Image
          src="/portfolio.jpg"
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 60vw, 320px"
        />
      </div>

      <svg
        aria-hidden
        className="absolute bottom-10 left-4 h-20 w-20 text-[color:var(--muted)]/80"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      >
        <path d="M60 10l18 36 40 6-29 28 7 40-36-19-36 19 7-40-29-28 40-6z" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
