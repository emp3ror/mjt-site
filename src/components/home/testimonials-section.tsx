import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";
import testimonialsJson from "@/data/testimonials.json";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

const testimonials = testimonialsJson as Testimonial[];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full bg-white">
      <div className="container mx-auto max-w-7xl space-y-10 px-4 py-16 sm:py-20 md:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Kind words from collaborators"
          description="Teams and partners who invited playful thinking into their products and programs."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="h-full space-y-4 bg-white/90">
              <blockquote className="text-sm text-[color:var(--ink)]/80">
                {testimonial.quote}
              </blockquote>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-[color:var(--ink)]">{testimonial.name}</p>
                <p className="text-[color:var(--ink)]/60">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
