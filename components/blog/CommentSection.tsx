"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Send, Loader2, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface CommentUser { name: string; avatar?: string }
interface CommentData {
  _id: string;
  content: string;
  user: CommentUser;
  createdAt: string;
  replies?: CommentData[];
}

export function CommentSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/comments?postId=${postId}`);
    if (res.ok) setComments(await res.json() as CommentData[]);
    setLoading(false);
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const submitComment = async (text: string, parentId?: string) => {
    if (!text.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: text, parentId }),
    });
    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
      setContent("");
      setReplyContent("");
      setReplyTo(null);
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="font-serif text-2xl font-semibold text-text mb-8 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-accent" />
        Discussion
        {comments.length > 0 && <span className="text-base text-muted font-normal">({comments.length})</span>}
      </h2>

      {/* Comment form */}
      {session ? (
        submitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 mb-8 text-sm text-green-700 dark:text-green-400">
            ✓ Comment submitted! It will appear after moderation.
          </div>
        ) : (
          <div className="mb-10">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted resize-none focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => submitComment(content)}
                disabled={submitting || !content.trim()}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Post comment</>}
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="mb-8 bg-surface-2 border border-border rounded-2xl p-5 text-sm text-muted text-center">
          <Link href="/login" className="text-accent hover:underline font-medium">Sign in</Link> to join the discussion.
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 rounded-full skeleton flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 skeleton" />
                <div className="h-16 skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted text-sm">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentThread
              key={comment._id}
              comment={comment}
              session={session}
              replyTo={replyTo}
              replyContent={replyContent}
              submitting={submitting}
              onReplyToggle={(id) => setReplyTo(replyTo === id ? null : id)}
              onReplyChange={setReplyContent}
              onReplySubmit={(parentId) => submitComment(replyContent, parentId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CommentThread({
  comment,
  session,
  replyTo,
  replyContent,
  submitting,
  onReplyToggle,
  onReplyChange,
  onReplySubmit,
}: {
  comment: CommentData;
  session: ReturnType<typeof useSession>["data"];
  replyTo: string | null;
  replyContent: string;
  submitting: boolean;
  onReplyToggle: (id: string) => void;
  onReplyChange: (v: string) => void;
  onReplySubmit: (parentId: string) => void;
}) {
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div>
      <CommentItem comment={comment} />

      <div className="ml-10 mt-3 flex items-center gap-4">
        {session && (
          <button
            onClick={() => onReplyToggle(comment._id)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
          >
            <Reply className="h-3.5 w-3.5" />
            Reply
          </button>
        )}
        {(comment.replies?.length ?? 0) > 0 && (
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors"
          >
            {showReplies ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {replyTo === comment._id && (
        <div className="ml-10 mt-3">
          <textarea
            value={replyContent}
            onChange={(e) => onReplyChange(e.target.value)}
            placeholder={`Reply to ${comment.user.name}…`}
            rows={2}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-muted resize-none focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" size="sm" onClick={() => onReplyToggle(comment._id)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onReplySubmit(comment._id)}
              disabled={submitting || !replyContent.trim()}
            >
              {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reply"}
            </Button>
          </div>
        </div>
      )}

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className={cn("ml-10 mt-4 space-y-4 pl-4 border-l-2 border-border")}>
          {comment.replies.map((reply) => <CommentItem key={reply._id} comment={reply} />)}
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentData }) {
  return (
    <div className="flex gap-3">
      {comment.user.avatar ? (
        <Image src={comment.user.avatar} alt={comment.user.name} width={32} height={32} className="rounded-full object-cover flex-shrink-0 mt-0.5" />
      ) : (
        <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0 mt-0.5">
          {comment.user.name[0]}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-text">{comment.user.name}</span>
          <span className="text-xs text-muted">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-muted leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}
