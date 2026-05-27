import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "This blog has fundamentally changed how I think about design systems. Every article is carefully researched and genuinely insightful.",
    author: "Sarah Chen",
    role: "Design Lead at Vercel",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 2,
    quote:
      "I've learned more from these posts than from most books I've read. The depth of coverage on engineering topics is unmatched.",
    author: "Marcus Johnson",
    role: "Senior Engineer at Stripe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 3,
    quote:
      "The writing is crisp, the ideas are bold, and the newsletter keeps me sane on Monday mornings. Highly recommended.",
    author: "Priya Sharma",
    role: "Founder, BuildFast",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
  },
];

export function Testimonials() {
  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="font-serif section-title font-semibold text-text mb-3">
          What readers say
        </h2>
        <p className="text-muted text-base max-w-xl mx-auto">
          Trusted by designers, engineers, and thinkers around the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-surface rounded-2xl border border-border shadow-card p-6 flex flex-col gap-4"
          >
            <Quote className="h-5 w-5 text-accent/40" />
            <p className="text-sm text-muted leading-relaxed flex-1">{t.quote}</p>
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.avatar}
                alt={t.author}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-text">{t.author}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
