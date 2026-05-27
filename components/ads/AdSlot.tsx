"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type AdFormat = "rectangle" | "leaderboard" | "sidebar" | "inline";

interface AdSlotProps {
  format?: AdFormat;
  className?: string;
  /** AdSense slot id — set in env when ready */
  slotId?: string;
}

const FORMAT_SIZES: Record<AdFormat, { w: number; h: number; label: string }> = {
  rectangle:  { w: 300, h: 250, label: "300 × 250 — Medium Rectangle" },
  leaderboard:{ w: 728, h: 90,  label: "728 × 90 — Leaderboard" },
  sidebar:    { w: 300, h: 600, label: "300 × 600 — Half Page" },
  inline:     { w: 468, h: 60,  label: "468 × 60 — Banner" },
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

export function AdSlot({ format = "rectangle", className, slotId }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const { w, h, label } = FORMAT_SIZES[format];
  const isProduction = ADSENSE_CLIENT && slotId;

  useEffect(() => {
    if (!isProduction) return;
    try {
      // @ts-expect-error — adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, [isProduction]);

  if (isProduction) {
    return (
      <ins
        ref={ref}
        className={cn("adsbygoogle block", className)}
        style={{ display: "block", width: w, height: h }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }

  // Development / staging placeholder
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-2 text-muted text-xs select-none",
        className
      )}
      style={{ width: "100%", maxWidth: w, minHeight: h }}
      aria-hidden="true"
    >
      <span className="font-semibold mb-1">Ad</span>
      <span>{label}</span>
    </div>
  );
}

/** Inject AdSense script once into <head> */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;
  return (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
