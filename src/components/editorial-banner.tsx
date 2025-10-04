import Link from "next/link";

import { cn } from "@/lib/cn";

type EditorialBannerProps = {
  className?: string;
};

const quickLinks = [
  {
    title: "Art College",
    description: "Deep-dive modules and critiques catalogued by semester.",
    href: "/art-college",
  },
  {
    title: "Browse tags",
    description: "Jump straight to themes, tools, and recurring motifs.",
    href: "/tags",
  },
];

export function EditorialBanner({ className }: EditorialBannerProps) {
  return (
    <section
      aria-labelledby="home-intro-banner"
      className={cn(
        "rounded-3xl border border-neutral-200/70 bg-white/80 p-10 shadow-sm backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/70",
        className,
      )}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Studio dispatch
          </p>
          <h2
            id="home-intro-banner"
            className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
          >
            A calm corner to document builds, sketchbooks, and community experiments.
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Expect lightweight reads on accessible web tooling, art processes that stay
            playful, and projects that keep neighbors connected.
          </p>
        </div>

        <div className="grid w-full max-w-md gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200/70 bg-neutral-50/80 px-5 py-4 text-sm transition hover:-translate-y-1 hover:border-neutral-200 hover:bg-white/90 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70 dark:hover:border-neutral-700"
            >
              <div className="flex-1 pr-4">
                <p className="text-base font-medium text-neutral-900 transition group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                  {link.title}
                </p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {link.description}
                </p>
              </div>
              <span className="text-lg text-neutral-400 transition group-hover:text-blue-500 dark:group-hover:text-blue-300" aria-hidden>
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
