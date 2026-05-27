"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("article h2, article h3")
    );
    const parsed: Heading[] = els.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: Number(el.tagName[1]),
    }));
    setHeadings(parsed);
  }, []);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <p className="text-xs uppercase tracking-widest font-semibold text-muted mb-3">
        On this page
      </p>
      {headings.map(({ id, text, level }) => (
        <a
          key={id}
          href={`#${id}`}
          className={cn(
            "block text-sm leading-snug py-0.5 transition-colors duration-150",
            level === 3 && "pl-3",
            active === id
              ? "text-accent font-medium"
              : "text-muted hover:text-text"
          )}
        >
          {text}
        </a>
      ))}
    </nav>
  );
}
