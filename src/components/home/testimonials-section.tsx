import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";

const testimonials = [
  {
    name: "Asha Khatri",
    role: "Creative Director, Studio Kathmandu",
    quote:
      "Manish choreographs typography, illustration, and code into a single rhythm. Every delivery feels joyful and intentional.",
  },
  {
    name: "Ravi Pradhan",
    role: "Founder, Neighborhood Library",
    quote:
      "From wayfinding to web, the experience felt handcrafted. Our volunteers still talk about the color stories he proposed.",
  },
  {
    name: "Mina Gurung",
    role: "Game Producer, Cozy Corner",
    quote:
      "The game assets captured warmth and narrative. Iterations were fast, collaborative, and deeply considered.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="space-y-10">
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
    </section>
  );
}
