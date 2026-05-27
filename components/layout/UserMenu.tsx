"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") {
    return <div className="h-8 w-8 rounded-full bg-surface-2 animate-pulse" />;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium text-muted hover:text-text hover:bg-surface-2 transition-all"
      >
        <LogIn className="h-4 w-4" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl hover:bg-surface-2 p-1 transition-all"
        aria-label="User menu"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? ""}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
            {(session.user.name ?? "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border rounded-2xl shadow-card-hover py-1.5 z-50 animate-fade-in">
          <div className="px-3.5 py-2.5 border-b border-border">
            <p className="text-sm font-semibold text-text truncate">{session.user.name}</p>
            <p className="text-xs text-muted truncate">{session.user.email}</p>
          </div>

          {session.user.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text hover:bg-surface-2 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-muted" />
              Admin dashboard
            </Link>
          )}

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text hover:bg-surface-2 transition-colors"
          >
            <User className="h-4 w-4 text-muted" />
            Profile
          </Link>

          <button
            onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            )}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
