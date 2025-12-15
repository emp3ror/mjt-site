import { Activity, Cpu, HelpingHand, Palette } from "lucide-react";

const highlights = [
  {
    icon: Cpu,
    title: "Software Development",
    description: "Building tools, products, and digital experiences.",
  },
  {
    icon: Palette,
    title: "Art & Creativity",
    description: "Painting, printmaking, design, and storytelling.",
  },
  {
    icon: Activity,
    title: "Running & Sports",
    description: "Marathons, football, and community challenges.",
  },
  {
    icon: HelpingHand,
    title: "Supporting the Powerless",
    description: "Youth scholarships, local causes, and grassroots projects.",
  },
];

export default function AboutMeSection() {
  return (
    <section className="w-full bg-white/80 dark:bg-neutral-950/70">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <header className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              About Me
            </h2>
            <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
              I am a software developer first—also an artist, runner, and community member staying involved.
            </p>
          </header>

          <ul className="grid gap-6 sm:grid-cols-2">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-neutral-200/60 bg-neutral-50/60 p-6 shadow-inner transition hover:-translate-y-1 hover:border-neutral-200 hover:bg-white/80 hover:shadow-lg dark:border-neutral-800/50 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900/90 text-white shadow-sm transition group-hover:scale-105 group-hover:bg-neutral-900 dark:bg-neutral-100/10 dark:text-neutral-50">
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="text-lg font-medium text-neutral-900 transition group-hover:text-neutral-950 dark:text-neutral-100 dark:group-hover:text-neutral-50">
                    {title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
