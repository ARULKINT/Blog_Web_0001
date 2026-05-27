"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyShareBarProps {
  title: string;
  url: string;
}

export function StickyShareBar({ title, url }: StickyShareBarProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const actions = [
    {
      label: "Share on Twitter",
      icon: <Twitter className="h-4 w-4" />,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank"
        ),
    },
    {
      label: "Share on LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        ),
    },
    {
      label: copied ? "Copied!" : "Copy link",
      icon: copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />,
      onClick: copyLink,
    },
  ];

  return (
    <>
      {/* Desktop: left rail */}
      <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
        <p className="text-[10px] uppercase tracking-widest text-muted text-center mb-1 writing-mode-vertical">
          Share
        </p>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            aria-label={action.label}
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center",
              "bg-surface border border-border shadow-card text-muted",
              "hover:text-text hover:border-accent/30 hover:shadow-glow transition-all duration-200"
            )}
          >
            {action.icon}
          </button>
        ))}
      </div>

      {/* Mobile: bottom bar */}
      <div className="xl:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border">
        <div className="flex items-center justify-center gap-3 px-4 py-3">
          <span className="text-xs text-muted font-medium">Share:</span>
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              aria-label={action.label}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-muted hover:text-text hover:bg-surface-2 transition-all"
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
