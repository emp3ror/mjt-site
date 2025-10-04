import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";
import { ArrowUpRight } from "lucide-react";

const works = [
  {
    title: "Sunrise Sips Packaging",
    category: "Packaging",
    description: "A fizzy morning beverage campaign layered with doodled fruit bursts and collage photography.",
    cover: "https://picsum.photos/seed/sunrise-sips/800/600",
    tags: ["Packaging", "Illustration", "Print"],
    link: "/art-college",
  },
  {
    title: "Neighborhood Library Microsite",
    category: "Graphic",
    description: "Modular web components built for a volunteer-led library network with community spotlights.",
    cover: "https://picsum.photos/seed/library-web/800/600",
    tags: ["Web", "Design System", "Next.js"],
    link: "/posts",
  },
  {
    title: "Festival Identity Kit",
    category: "Illustration",
    description: "Illustrated flora, friendly typography, and signage for a week-long arts festival.",
    cover: "https://picsum.photos/seed/lotus-festival/800/600",
    tags: ["Illustration", "Branding", "Wayfinding"],
    link: "/art-college/first-year",
  },
  {
    title: "Cozy Corner Game Assets",
    category: "2D Game",
    description: "Hand-painted tilesets and UI overlays for a slice-of-life mobile game prototype.",
    cover: "https://picsum.photos/seed/cozy-corner/800/600",
    tags: ["Game Art", "UI", "Concept"],
    link: "/posts",
  },
  {
    title: "Studio Notebook Series",
    category: "Illustration",
    description: "Risograph notebook covers celebrating gesture studies and color theory drills.",
    cover: "https://picsum.photos/seed/studio-notes/800/600",
    tags: ["Print", "Illustration"],
    link: "/art-college",
  },
  {
    title: "Village Market Rebrand",
    category: "Packaging",
    description: "A farm-to-table identity with illustrated produce stamps and responsive menu boards.",
    cover: "https://picsum.photos/seed/village-market/800/600",
    tags: ["Packaging", "Brand"],
    link: "/posts",
  },
];

export function WorksSection() {
  return (
    <section id="works" className="space-y-10">
      <SectionHeading
        eyebrow="Portfolio"
        title="Selected projects mixing illustration and photography"
        description="A peek into the launch kits, digital experiences, and storytelling experiments from the studio."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {works.map((work) => (
          <Card key={work.title} className="space-y-4 overflow-hidden p-0">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={work.cover}
                alt={work.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
              <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
                {work.category}
              </span>
            </div>
            <div className="space-y-3 px-6 pb-6 pt-2">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-[color:var(--ink)]">{work.title}</h3>
                <Link
                  href={work.link}
                  className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent)]/15 text-[color:var(--ink)] transition hover:bg-[color:var(--accent)] hover:text-white"
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <p className="text-sm text-[color:var(--ink)]/75">{work.description}</p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]/60">
                {work.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/80 px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
