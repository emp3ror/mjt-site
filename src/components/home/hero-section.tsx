import Link from "next/link";

import { Badge } from "@/components/badge";
import { PhotoIllustration } from "@/components/photo-illustration";
import {
  ArrowUpRight,
  Gamepad2,
  LayoutTemplate,
  Package2,
  Palette,
} from "lucide-react";

const heroBadges = [
  { label: "Packaging", icon: Package2 },
  { label: "Graphic Design", icon: LayoutTemplate },
  { label: "Illustration", icon: Palette },
  { label: "2D Game Art", icon: Gamepad2 },
];

export function HeroSection() {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <Badge className="bg-white/80 text-[color:var(--accent)]">
          Playful designer developer
        </Badge>
        <h1 className="text-5xl font-semibold leading-[1.05] text-[color:var(--ink)] md:text-6xl">
          Translating joyful ideas into packaging, illustration, and fast digital experiences.
        </h1>
        <p className="max-w-2xl text-lg text-[color:var(--ink)]/75">
          Hi, I am Manish--balancing tactile print design with web systems that stay friendly and accessible.
          The portfolio is an ever-growing sketchbook featuring client launches, art college studies, and
          community projects.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="#works"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(242,92,39,0.3)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(242,92,39,0.35)]"
          >
            View projects
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--muted)]/60 bg-white/70 px-6 py-3 text-sm font-semibold text-[color:var(--ink)] shadow-[0_12px_28px_rgba(44,45,94,0.12)] transition hover:-translate-y-1 hover:bg-white"
          >
            Let&apos;s collaborate
          </Link>
        </div>

        <ul className="flex flex-wrap gap-3 text-sm font-semibold text-[color:var(--ink)]/80">
          {heroBadges.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-[0_12px_30px_rgba(44,45,94,0.12)]"
            >
              <Icon className="h-4 w-4 text-[color:var(--accent)]" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <PhotoIllustration className="justify-self-center" />
    </section>
  );
}
