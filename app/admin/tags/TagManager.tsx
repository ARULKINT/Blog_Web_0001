"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";

interface Tag {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface Props {
  initial: Tag[];
}

export function TagManager({ initial }: Props) {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", slug: "" });

  const openNew = () => { setForm({ name: "", slug: "" }); setEditId(null); setShowForm(true); setError(""); };
  const openEdit = (tag: Tag) => { setForm({ name: tag.name, slug: tag.slug }); setEditId(tag._id); setShowForm(true); setError(""); };
  const cancel = () => { setShowForm(false); setEditId(null); setError(""); };

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      name,
      slug: editId ? f.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const save = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setLoading(true);
    setError("");
    try {
      const url = editId ? `/api/admin/tags/${editId}` : "/api/admin/tags";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to save");
        setLoading(false);
        return;
      }
      const saved: Tag = await res.json();
      setTags((prev) =>
        editId ? prev.map((t) => (t._id === editId ? saved : t)) : [...prev, saved]
      );
      cancel();
      router.refresh();
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this tag?")) return;
    const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTags((prev) => prev.filter((t) => t._id !== id));
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted">{tags.length} tags</p>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Tag
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-5 bg-surface border border-border rounded-2xl">
          <h3 className="text-sm font-semibold text-text mb-4">{editId ? "Edit tag" : "New tag"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-muted mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="react"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="react"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Save
            </button>
            <button onClick={cancel} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-text transition-colors">
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {tags.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">No tags yet.</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Posts</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag._id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      #{tag.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted font-mono text-xs">{tag.slug}</td>
                  <td className="px-6 py-4 text-muted">{tag.postCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(tag)} className="text-muted hover:text-accent transition-colors" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(tag._id)} className="text-muted hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
