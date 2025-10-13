import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";
import { SkillBar } from "@/components/skill-bar";
import skillsSectionContent from "@/data/home/skills-section.json";

type SkillGroup = {
  title: string;
  blurb: string;
  accent: "accent" | "leaf";
  skills: Array<{ label: string; level: number }>;
};

type SkillsSectionContent = {
  heading: {
    eyebrow: string;
    title: string;
    description: string;
  };
  groups: SkillGroup[];
};

const content = skillsSectionContent as SkillsSectionContent;

export function SkillsSection() {
  return (
    <section id="skills" className="space-y-12">
      <SectionHeading
        eyebrow={content.heading.eyebrow}
        title={content.heading.title}
        description={content.heading.description}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {content.groups.map((group) => (
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
