"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-surface to-highlight/5 animate-gradient-slow bg-[size:300%_300%]" />
      <div className="glass absolute inset-0 rounded-3xl" />

      <div className="relative z-10 px-8 py-14 md:px-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6">
          <Mail className="h-5 w-5" />
        </div>

        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-text mb-3">
          Stay in the loop
        </h2>
        <p className="text-muted text-base leading-relaxed mb-8">
          Get the best articles delivered to your inbox. No spam — ever. Unsubscribe anytime.
        </p>

        {state === "success" ? (
          <p className="text-accent font-medium text-lg">
            You&apos;re on the list! Check your inbox.
          </p>
        ) : state === "error" ? (
          <p className="text-red-500 font-medium">
            Something went wrong. Please try again.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={state === "loading"}
              className="whitespace-nowrap"
            >
              {state === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}

        <p className="text-xs text-muted mt-4">Join 5,000+ curious readers.</p>
      </div>
    </section>
  );
}
