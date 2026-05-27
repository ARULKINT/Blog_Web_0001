"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { Container } from "@/components/ui/Container";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0 flex items-center gap-2.5">
            <span className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-accent/30 bg-white flex-shrink-0 shadow-sm">
              <Image
                src="/logo.png"
                alt="Ink & Ideas"
                height={40}
                width={40}
                className="object-cover w-full h-full"
                priority
              />
            </span>
            <span className="font-serif font-bold text-xl text-text leading-tight hidden sm:block">
              Ink &amp; Ideas
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150",
                    active
                      ? "text-text bg-surface-2"
                      : "text-muted hover:text-text hover:bg-surface-2"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/search"
              className="h-9 w-9 rounded-xl flex items-center justify-center text-muted hover:text-text hover:bg-surface-2 transition-all"
              aria-label="Search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-muted hover:text-text hover:bg-surface-2 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-border pt-3 flex flex-col gap-1 animate-fade-in">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "text-text bg-surface-2"
                      : "text-muted hover:text-text hover:bg-surface-2"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/search"
              className="px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-text hover:bg-surface-2 transition-colors"
            >
              Search
            </Link>
          </div>
        )}
      </Container>
    </header>
  );
}
