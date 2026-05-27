"use client";

import { useState } from "react";
import { Lock, Loader2, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface PaywallGateProps {
  /** Preview of content shown before the gate */
  previewHtml: string;
}

export function PaywallGate({ previewHtml }: PaywallGateProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // error
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div
        className="prose prose-base dark:prose-invert max-w-none mb-0 relative"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      {/* Gate card */}
      <div className="relative mt-0 border border-border rounded-2xl bg-surface shadow-card p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
          <Lock className="h-5 w-5" />
        </div>
        <h3 className="font-serif text-xl font-bold text-text mb-2">
          This article is for subscribers
        </h3>
        <p className="text-muted text-sm max-w-md mx-auto mb-6">
          Unlock unlimited access to premium articles, exclusive content, and support independent writing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {session ? (
            <Button onClick={subscribe} disabled={loading} variant="primary" size="lg" className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Subscribe — unlock now
            </Button>
          ) : (
            <>
              <Link href="/register">
                <Button variant="primary" size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Create free account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Sign in</Button>
              </Link>
            </>
          )}
          <Link href="/subscribe" className="text-sm text-muted hover:text-text underline underline-offset-4">
            Learn more
          </Link>
        </div>

        <p className="mt-4 text-xs text-muted">Cancel anytime. Secure payment via Stripe.</p>
      </div>
    </div>
  );
}
