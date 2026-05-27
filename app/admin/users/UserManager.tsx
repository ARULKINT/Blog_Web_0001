"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, User as UserIcon, BookOpen, Trash2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "author" | "reader";
  avatar: string;
  createdAt: string;
}

interface Props {
  initial: User[];
  currentUserId: string;
}

const ROLE_STYLES = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  author: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  reader: "bg-surface-2 text-muted",
};

const ROLE_ICONS = {
  admin: ShieldCheck,
  author: BookOpen,
  reader: UserIcon,
};

export function UserManager({ initial, currentUserId }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initial);
  const [updating, setUpdating] = useState<string | null>(null);

  const changeRole = async (id: string, role: string) => {
    setUpdating(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const updated: User = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: updated.role } : u)));
      router.refresh();
    }
    setUpdating(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    setUpdating(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? "Failed to delete");
    }
    setUpdating(null);
  };

  return (
    <div>
      <p className="text-sm text-muted mb-6">{users.length} users</p>
      {users.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">No users yet.</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const RoleIcon = ROLE_ICONS[user.role];
                const isSelf = user._id === currentUserId;
                const isLoading = updating === user._id;
                return (
                  <tr key={user._id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-text">
                            {user.name}
                            {isSelf && <span className="ml-1.5 text-xs text-muted">(you)</span>}
                          </p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium", ROLE_STYLES[user.role])}>
                        <RoleIcon className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted whitespace-nowrap">
                      {formatDate(new Date(user.createdAt))}
                    </td>
                    <td className="px-6 py-4">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted" />
                      ) : (
                        <div className="flex items-center gap-2">
                          {!isSelf && (
                            <>
                              <select
                                value={user.role}
                                onChange={(e) => changeRole(user._id, e.target.value)}
                                className="h-8 px-2 rounded-lg border border-border bg-bg text-xs text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
                              >
                                <option value="reader">Reader</option>
                                <option value="author">Author</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => remove(user._id)}
                                className="text-muted hover:text-red-500 transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
