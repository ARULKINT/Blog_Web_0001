import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <p className="text-[10rem] font-serif font-bold leading-none gradient-text select-none animate-fade-in">
          404
        </p>
        <h1 className="font-serif text-2xl font-semibold text-text mt-2 mb-3 animate-fade-in [animation-delay:100ms]">
          Page not found
        </h1>
        <p className="text-muted text-base leading-relaxed mb-8 animate-fade-in [animation-delay:200ms]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you somewhere useful.
        </p>

        <div className="flex items-center justify-center gap-3 animate-fade-in [animation-delay:300ms]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text text-sm font-medium hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse articles
          </Link>
        </div>
      </div>
    </div>
  );
}
