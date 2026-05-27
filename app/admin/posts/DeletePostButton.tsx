"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "./actions";

export function DeletePostButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm("Delete this post? This cannot be undone.")) return;
        await deletePost(id);
      }}
      className="text-muted hover:text-red-500 transition-colors"
      title="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
