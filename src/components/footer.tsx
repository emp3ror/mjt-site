import Link from "next/link";

import { DoodleDivider } from "@/components/doodle-divider";

const navigation = [
  { label: "Portfolio", href: "#works" },
  { label: "Experience", href: "#experience" },
  { label: "Art College", href: "/art-college" },
  { label: "Latest Notes", href: "#latest-notes" },
];

const socials = [
  { label: "Email", href: "mailto:hello@mjt.studio" },
  { label: "Behance", href: "https://www.behance.net" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[color:var(--ink)] text-white/90">
      <div className="absolute inset-x-0 top-0">
        <DoodleDivider variant="line" colorClassName="text-white/20" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-14 pt-20 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            MJT Studio
          </p>
          <h2 className="text-4xl font-semibold text-white">
            Staying playful while shipping thoughtful design systems.
          </h2>
          <p className="text-sm text-white/80">
            Portfolio snapshots, art studies, and experiments in community-led design.
            Come back often; the sketchbook is always open.
          </p>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            © {new Date().getFullYear()} MJT Studio
          </p>
        </div>

        <div className="grid w-full max-w-md gap-10 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Navigate
            </h3>
            <ul className="space-y-3 text-sm text-white/75">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-[color:var(--leaf)]/80" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Connect
            </h3>
            <ul className="space-y-3 text-sm text-white/75">
              {socials.map((item) => (
                <li key={item.href}>
                  <Link
                    className="transition hover:text-[color:var(--leaf)]/80"
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" aria-hidden />
    </footer>
  );
}
