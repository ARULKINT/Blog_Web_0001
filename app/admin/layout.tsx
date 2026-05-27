import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, FileText, FolderOpen, Tag, Users, MessageSquare, LogOut } from "lucide-react";
import { signOut } from "@/auth";
import type { ReactNode } from "react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Tags", href: "/admin/tags", icon: Tag },
  { label: "Comments", href: "/admin/comments", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-surface border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <span className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-accent/30 bg-white flex-shrink-0 shadow-sm">
              <Image
                src="/logo.png"
                alt="Ink & Ideas"
                height={36}
                width={36}
                className="object-cover w-full h-full"
              />
            </span>
            <span className="font-serif font-bold text-sm text-text leading-tight">
              Ink &amp; Ideas
            </span>
          </Link>
          <p className="mt-1.5 text-xs text-muted font-medium tracking-wide uppercase">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-muted hover:text-text hover:bg-surface-2 transition-all"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-border">
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
          <p className="mt-3 px-3 text-xs text-muted truncate">
            {session.user.name} · {session.user.email}
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
