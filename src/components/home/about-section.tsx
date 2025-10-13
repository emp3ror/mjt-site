import { SectionHeading } from "@/components/section-heading";
import aboutSectionContent from "@/data/home/about-section.json";

type AboutSectionContent = {
  heading: {
    eyebrow: string;
    title: string;
    description: string;
  };
  introParagraphs: string[];
  studioSnapshot: {
    title: string;
    items: string[];
  };
  softwareSection: {
    title: string;
    badges: string[];
  };
};

const content = aboutSectionContent as AboutSectionContent;
const snapshotItemClasses = [
  "bg-[color:var(--accent)]/10",
  "bg-[color:var(--leaf)]/10",
  "bg-white/80",
  "bg-white/80",
];

export function AboutSection() {
  return (
    <section id="about" className="w-full bg-white/75 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[3rem] bg-white/80 p-10 shadow-[0_24px_70px_rgba(44,45,94,0.12)] backdrop-blur sm:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionHeading
            eyebrow={content.heading.eyebrow}
            title={content.heading.title}
            description={content.heading.description}
          />
          <div className="space-y-5 text-base text-[color:var(--ink)]/75">
            {content.introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-3xl bg-white/80 p-6 shadow-inner">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60">
              {content.studioSnapshot.title}
            </h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {content.studioSnapshot.items.map((item, index) => (
                <li
                  key={item}
                  className={`rounded-2xl p-4 text-sm ${snapshotItemClasses[index] ?? "bg-white/80"}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 rounded-3xl bg-white/80 p-6 shadow-inner">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60">
              {content.softwareSection.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {content.softwareSection.badges.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-[color:var(--muted)]/40 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
