"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  content: string;
  status: string;
  date: string;
  userName: string;
  postTitle: string;
  postSlug: string;
}

export function CommentModerationRow({ id, content, status, date, userName, postTitle, postSlug }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const update = async (newStatus: string) => {
    setLoading(true);
    await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setCurrentStatus(newStatus);
    setLoading(false);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Delete this comment permanently?")) return;
    setLoading(true);
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    spam: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors align-top">
      <td className="px-6 py-4 max-w-xs">
        <p className="text-xs text-muted mb-1 font-medium">{userName}</p>
        <p className="text-sm text-text line-clamp-2">{content}</p>
      </td>
      <td className="px-6 py-4">
        {postSlug ? (
          <Link href={`/blog/${postSlug}`} target="_blank" className="text-xs text-accent hover:underline line-clamp-1 max-w-[140px] block">
            {postTitle}
          </Link>
        ) : (
          <span className="text-xs text-muted">{postTitle}</span>
        )}
      </td>
      <td className="px-6 py-4 text-xs text-muted whitespace-nowrap">{date}</td>
      <td className="px-6 py-4">
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", STATUS_STYLES[currentStatus] ?? "bg-surface-2 text-muted")}>
          {currentStatus}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted" />
          ) : (
            <>
              {currentStatus !== "approved" && (
                <button onClick={() => update("approved")} title="Approve" className="text-green-500 hover:text-green-600 transition-colors">
                  <Check className="h-4 w-4" />
                </button>
              )}
              {currentStatus !== "spam" && (
                <button onClick={() => update("spam")} title="Mark spam" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
              <button onClick={remove} title="Delete" className="text-muted hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
