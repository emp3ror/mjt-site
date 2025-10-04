import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";
import { SkillBar } from "@/components/skill-bar";

const skillGroups = [
  {
    title: "Packaging Design",
    blurb: "Color-forward storytelling, dielines that feel friendly, and finishes that sparkle on the shelf.",
    accent: "accent" as const,
    skills: [
      { label: "Concept Boards", level: 95 },
      { label: "Print Production", level: 92 },
      { label: "3D Mockups", level: 85 },
    ],
  },
  {
    title: "Graphic Design",
    blurb: "Editorial layouts, campaign systems, and social kits stitched together for communities.",
    accent: "leaf" as const,
    skills: [
      { label: "Brand Systems", level: 90 },
      { label: "Motion Loops", level: 84 },
      { label: "Web Components", level: 88 },
    ],
  },
  {
    title: "Illustration Art",
    blurb: "Playful palettes, loose lines, and layered textures across digital and traditional media.",
    accent: "accent" as const,
    skills: [
      { label: "Character Studies", level: 93 },
      { label: "Mixed Media", level: 89 },
      { label: "Editorial Spots", level: 87 },
    ],
  },
  {
    title: "2D Game Art",
    blurb: "Game-ready assets, UI kits, and atmospheric backgrounds rooted in narrative.",
    accent: "leaf" as const,
    skills: [
      { label: "Sprite Sheets", level: 82 },
      { label: "Environment Paintings", level: 86 },
      { label: "UI Polish", level: 84 },
    ],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="space-y-12">
      <SectionHeading
        eyebrow="Skills"
        title="Where craft meets curiosity"
        description="Dynamic skill sets that flex from brand strategy to painterly explorations and UI polish."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {skillGroups.map((group) => (
          <Card key={group.title} className="space-y-5">
            <div className="space-y-2">
              <p className="inline-flex rounded-full bg-[color:var(--muted)]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/70">
                {group.title}
              </p>
              <p className="text-sm text-[color:var(--ink)]/75">{group.blurb}</p>
            </div>
            <div className="space-y-3">
              {group.skills.map((skill) => (
                <SkillBar key={skill.label} label={skill.label} level={skill.level} accent={group.accent} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
