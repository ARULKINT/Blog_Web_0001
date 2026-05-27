import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Ink & Ideas — who we are, what we stand for, and why we write.",
};

const TEAM = [
  {
    name: "Alex Rivera",
    role: "Founder & Editor",
    bio: "Design engineer who writes about systems thinking, craft, and the future of the web.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
  {
    name: "Jordan Lee",
    role: "Contributing Writer",
    bio: "Engineer and essayist. Writes about productivity systems, open source, and mental models.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
  {
    name: "Maya Patel",
    role: "Contributing Writer",
    bio: "UX researcher and writer. Covers design ethics, accessibility, and human-centered technology.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-16 max-w-4xl">
      {/* Mission */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-display font-bold text-text mb-6">
          Built for curious minds
        </h1>
        <p className="text-xl text-muted leading-relaxed max-w-2xl mx-auto">
          Ink & Ideas is a premium publication for people who care deeply about design, technology,
          and ideas that move the world forward. We write for practitioners, not pundits.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          {
            icon: "✍️",
            title: "Craft",
            body: "Every piece is written, edited, and published with care. No AI-generated filler, no SEO churn.",
          },
          {
            icon: "🔎",
            title: "Depth",
            body: "We go beyond the surface. Expect original research, nuanced takes, and long-form analysis.",
          },
          {
            icon: "🌱",
            title: "Openness",
            body: "Ideas are better when shared. We publish openly and link generously.",
          },
        ].map((v) => (
          <div
            key={v.title}
            className="bg-surface border border-border rounded-2xl p-6 shadow-card"
          >
            <span className="text-3xl mb-3 block">{v.icon}</span>
            <h3 className="font-serif text-lg font-semibold text-text mb-2">{v.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{v.body}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="mb-20">
        <h2 className="font-serif text-2xl font-semibold text-text mb-8 text-center">
          The team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <Image
                src={member.avatar}
                alt={member.name}
                width={80}
                height={80}
                className="rounded-full object-cover mx-auto mb-4 border-2 border-border"
              />
              <h3 className="font-semibold text-text">{member.name}</h3>
              <p className="text-xs text-accent mb-2">{member.role}</p>
              <p className="text-sm text-muted leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterCTA />
    </Container>
  );
}
