import Link from "next/link";
import { Layers } from "lucide-react";
import type { Category } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  technology: "💻",
  design: "🎨",
  productivity: "⚡",
  lifestyle: "🌿",
  culture: "🌍",
};

export function CategoryPills({ categories }: { categories: Category[] }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Layers className="h-5 w-5 text-highlight" />
        <h2 className="section-title font-serif font-semibold text-text">
          Explore Topics
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            <span
              className="h-10 w-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${cat.color}20` }}
            >
              {CATEGORY_ICONS[cat.slug] ?? cat.icon ?? "📝"}
            </span>
            <span className="text-sm font-medium text-text group-hover:text-accent transition-colors">
              {cat.name}
            </span>
            <span className="text-xs text-muted">{cat.postCount} posts</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
