
import { Badge } from "@/components/badge";
import { PhotoIllustration } from "@/components/photo-illustration";
import heroSectionContent from "@/data/home/hero-section.json";

type HeroSectionContent = {
  badgeLabel: string;
  title: string;
  description: string[];
};

const content = heroSectionContent as HeroSectionContent;

export function HeroSection() {
  return (
    <section className="w-full bg-[color:var(--base)]">
      <div className="container mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <Badge className="bg-white/80 text-[color:var(--accent)]">
            {content.badgeLabel}
          </Badge>
          <h1 className="text-5xl font-semibold leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            {content.title}
          </h1>
          <div className="max-w-2xl space-y-4 text-lg text-[color:var(--ink)]/75">
            {content.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <PhotoIllustration className="justify-self-center" />
      </div>
    </section>
  );
}
