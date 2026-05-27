import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="py-5 px-6 flex items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="h-11 w-11 rounded-full overflow-hidden ring-2 ring-accent/30 bg-white flex-shrink-0 shadow-sm">
            <Image
              src="/logo.png"
              alt="Ink & Ideas"
              height={44}
              width={44}
              className="object-cover w-full h-full"
              priority
            />
          </span>
          <span className="font-serif font-bold text-xl text-text">Ink &amp; Ideas</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
