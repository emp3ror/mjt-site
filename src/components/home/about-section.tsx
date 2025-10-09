import { SectionHeading } from "@/components/section-heading";

const softwareBadges = [
  "Illustrator",
  "Photoshop",
  "InDesign",
  "Figma",
  "Procreate",
  "Blender",
];

export function AboutSection() {
  return (
    <section id="about" className="w-full bg-white/75 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[3rem] bg-white/80 p-10 shadow-[0_24px_70px_rgba(44,45,94,0.12)] backdrop-blur sm:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionHeading
            eyebrow="About"
            title="Curious maker with a sketchbook mindset"
            description="I build in the open--pairing brand systems with illustration, and keeping the web fast, inclusive, and joyful."
          />
          <div className="space-y-5 text-base text-[color:var(--ink)]/75">
            <p>
              Whether I am working on packaging for a new cafe, preparing art college course material, or exploring
              2D game assets, play leads the process. I am fascinated by how tactile artifacts and digital interfaces
              can feel cohesive.
            </p>
            <p>
              Collaboration is essential. I work closely with engineers, printers, and educators to maintain a shared
              visual language. The Studio Notes archive documents experiments, successes, and the lessons learned
              along the way.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-3xl bg-white/80 p-6 shadow-inner">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60">
              Studio snapshot
            </h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="rounded-2xl bg-[color:var(--accent)]/10 p-4 text-sm">
                Packaging and illustration for food, beverage, and education brands.
              </li>
              <li className="rounded-2xl bg-[color:var(--leaf)]/10 p-4 text-sm">
                Documenting process and curricula at the Art College archive.
              </li>
              <li className="rounded-2xl bg-white/80 p-4 text-sm">
                Mixed media experiments--risograph, watercolor, and digital painting.
              </li>
              <li className="rounded-2xl bg-white/80 p-4 text-sm">
                Currently studying gesture mapping while exploring cozy game worlds.
              </li>
            </ul>
          </div>

          <div className="space-y-3 rounded-3xl bg-white/80 p-6 shadow-inner">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60">
              Softwares
            </h3>
            <div className="flex flex-wrap gap-2">
              {softwareBadges.map((tool) => (
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
