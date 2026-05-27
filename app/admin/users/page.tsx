import { auth } from "@/auth";
import { connectDB, isDBConfigured } from "@/lib/db";
import { User } from "@/lib/models/User";
import { UserManager } from "./UserManager";

async function getUsers() {
  if (!isDBConfigured()) return [];
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).select("-passwordHash").lean();
  return users.map((u) => ({
    _id: String(u._id),
    name: u.name,
    email: u.email,
    role: (u.role as "admin" | "author" | "reader") ?? "reader",
    avatar: u.avatar ?? "",
    createdAt: (u as unknown as { createdAt: Date }).createdAt?.toISOString() ?? new Date().toISOString(),
  }));
}

export default async function AdminUsersPage() {
  const [session, users] = await Promise.all([auth(), getUsers()]);
  const currentUserId = session?.user?.id ?? "";

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Users</h1>
        <p className="text-muted text-sm mt-1">
          Manage user accounts and roles.
        </p>
      </div>
      <UserManager initial={users} currentUserId={currentUserId} />
    </div>
  );
}
