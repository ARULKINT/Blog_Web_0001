"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const PERKS = [
  "Unlimited access to all subscriber-only articles",
  "Early access to new posts before public release",
  "No ads on any page",
  "Support independent writing directly",
  "Cancel anytime — no questions asked",
];

export default function SubscribePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // ignore
    }
    setLoading(false);
  };

  return (
    <Container narrow className="py-20 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6">
        <Sparkles className="h-6 w-6" />
      </div>

      <h1 className="font-serif text-hero font-bold text-text mb-4">
        Become a Subscriber
      </h1>
      <p className="text-muted text-lg max-w-xl mx-auto mb-10">
        Get unlimited access to premium articles and support independent writing with a simple monthly subscription.
      </p>

      {/* Perks */}
      <ul className="text-left max-w-sm mx-auto space-y-3 mb-10">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-start gap-3 text-sm text-text">
            <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
            {perk}
          </li>
        ))}
      </ul>

      {session ? (
        <Button onClick={handleSubscribe} disabled={loading} variant="primary" size="lg" className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Subscribe now
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Link href="/register?callbackUrl=/subscribe">
            <Button variant="primary" size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Get started — create an account
            </Button>
          </Link>
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login?callbackUrl=/subscribe" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">Powered by Stripe. Cancel anytime.</p>
    </Container>
  );
}
