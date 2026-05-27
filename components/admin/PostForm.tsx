"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TiptapEditor } from "./TiptapEditor";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader2, Save, Eye, Tag } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import type { Category } from "@/types";

interface TagItem { _id: string; name: string }

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  excerpt: z.string().min(10, "Excerpt required").max(500),
  content: z.string().min(20, "Content is required"),
  coverImage: z.string().optional(),
  categoryId: z.string().min(1, "Pick a category"),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().optional(),
  access: z.enum(["public", "subscriber"]).optional(),
  seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
});

type FormData = z.infer<typeof schema>;

interface PostFormProps {
  categories: Category[];
  tags: TagItem[];
  postId?: string;
  defaultValues?: Partial<FormData>;
}

export function PostForm({ categories, tags, postId, defaultValues }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "draft",
      featured: false,
      tagIds: [],
      content: "",
      ...defaultValues,
    },
  });

  const title = watch("title");
  const selectedTags = watch("tagIds") ?? [];

  const onSubmit = async (data: FormData, publish = false) => {
    setError("");
    setSaving(true);
    const payload = { ...data, status: publish ? "published" : data.status };

    try {
      const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
      const method = postId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json() as { error?: string; slug?: string };
      if (!res.ok) { setError(json.error ?? "Failed to save post."); return; }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: string) => {
    const current = selectedTags;
    setValue("tagIds", current.includes(id) ? current.filter((t) => t !== id) : [...current, id]);
  };

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d, false))} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main column */}
      <div className="xl:col-span-2 space-y-5">
        <Input
          label="Title"
          placeholder="Your article title"
          error={errors.title?.message}
          {...register("title", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              if (!postId) setValue("slug", slugify(e.target.value));
            },
          })}
        />

        <Input
          label="Slug"
          placeholder="url-friendly-slug"
          error={errors.slug?.message}
          {...register("slug")}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text">Excerpt</label>
          <textarea
            rows={2}
            placeholder="A short description of the article (shown in listings and OG tags)…"
            className={cn(
              "w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-text placeholder:text-muted resize-none",
              "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors",
              errors.excerpt && "border-red-400"
            )}
            {...register("excerpt")}
          />
          {errors.excerpt && <p className="text-xs text-red-500">{errors.excerpt.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text">Content</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TiptapEditor content={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
        </div>

        {/* SEO */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-text">SEO overrides <span className="text-muted font-normal">(optional)</span></p>
          <Input label="Meta title" placeholder={title || "Auto-generated from post title"} {...register("seo.title")} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Meta description</label>
            <textarea rows={2} placeholder="Auto-generated from excerpt"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-text placeholder:text-muted resize-none focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              {...register("seo.description")} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        {/* Publish controls */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-text">Publish</p>

          <div className="flex items-center gap-3">
            <label className="text-sm text-muted">Status:</label>
            <select
              className="flex-1 h-9 rounded-xl border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:border-accent"
              {...register("status")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="rounded" {...register("featured")} />
            <span className="text-sm text-text">Featured post</span>
          </label>

          <div>
            <label className="block text-xs text-muted mb-1.5">Access</label>
            <select
              {...register("access")}
              className="w-full h-9 px-3 rounded-xl border border-border bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="public">Public — everyone</option>
              <option value="subscriber">Subscribers only</option>
            </select>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex flex-col gap-2">
            <Button type="submit" variant="secondary" size="md" className="w-full justify-center" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save draft</>}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full justify-center"
              disabled={saving}
              onClick={handleSubmit((d) => onSubmit(d, true))}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Eye className="h-4 w-4" /> Publish</>}
            </Button>
          </div>
        </div>

        {/* Category */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-text mb-3">Category</p>
          <select
            className={cn(
              "w-full h-10 rounded-xl border border-border bg-surface px-3 text-sm text-text",
              "focus:outline-none focus:border-accent",
              errors.categoryId && "border-red-400"
            )}
            {...register("categoryId")}
          >
            <option value="">Select category…</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Tags */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-muted" /> Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag._id}
                type="button"
                onClick={() => toggleTag(tag._id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  selectedTags.includes(tag._id)
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface-2 text-muted hover:text-text"
                )}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-text mb-3">Cover image</p>
          <Input placeholder="https://… image URL" {...register("coverImage")} />
          {watch("coverImage") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={watch("coverImage")} alt="Cover preview" className="mt-3 rounded-xl w-full h-32 object-cover" />
          )}
        </div>
      </div>
    </form>
  );
}
