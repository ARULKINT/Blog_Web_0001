import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB, isDBConfigured } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Post } from "@/lib/models/Post";
import { Container } from "@/components/ui/Container";
import { ProfileForm } from "./ProfileForm";
import { PostCard } from "@/components/blog/PostCard";
import type { Metadata } from "next";
import type { Post as PostType } from "@/types";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

async function getUserData(id: string) {
  if (!isDBConfigured()) return null;
  await connectDB();

  const [user, bookmarkedPosts] = await Promise.all([
    User.findById(id).select("-passwordHash").lean(),
    User.findById(id)
      .select("bookmarks")
      .populate({
        path: "bookmarks",
        model: Post,
        populate: [
          { path: "category", select: "name slug color" },
          { path: "author", select: "name avatar" },
        ],
        options: { limit: 12 },
      })
      .lean(),
  ]);

  return { user, bookmarks: (bookmarkedPosts as { bookmarks?: unknown[] })?.bookmarks ?? [] };
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/profile");

  const data = await getUserData(session.user.id);
  const user = data?.user;

  return (
    <Container className="py-14">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? "Avatar"}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl font-semibold">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-serif text-2xl font-bold text-text">{session.user.name}</h1>
            <p className="text-muted text-sm">{session.user.email}</p>
            <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent capitalize">
              {session.user.role}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <section className="mb-14">
          <h2 className="font-serif text-xl font-semibold text-text mb-6">Edit Profile</h2>
          <ProfileForm
            initial={{
              name: (user as { name?: string })?.name ?? session.user.name ?? "",
              bio: (user as { bio?: string })?.bio ?? "",
              avatar: (user as { avatar?: string })?.avatar ?? "",
              social: (user as { social?: { twitter?: string; github?: string; website?: string } })?.social,
            }}
          />
        </section>

        {/* Bookmarked posts */}
        {data && data.bookmarks.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-semibold text-text mb-6">
              Saved Posts ({data.bookmarks.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data.bookmarks as PostType[]).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}
