"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  postCount: number;
}

interface Props {
  initial: Category[];
}

const COLORS = [
  "#6366F1", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6",
  "#F97316", "#06B6D4", "#EC4899", "#84CC16", "#64748B",
];

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn(
            "h-6 w-6 rounded-full border-2 transition-transform",
            value === c ? "border-text scale-110" : "border-transparent"
          )}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

export function CategoryManager({ initial }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const blankForm = { name: "", slug: "", description: "", color: "#6366F1", icon: "" };
  const [form, setForm] = useState(blankForm);

  const openNew = () => { setForm(blankForm); setEditId(null); setShowForm(true); setError(""); };
  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, color: cat.color, icon: cat.icon });
    setEditId(cat._id);
    setShowForm(true);
    setError("");
  };
  const cancel = () => { setShowForm(false); setEditId(null); setError(""); };

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: editId ? f.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const save = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setLoading(true);
    setError("");
    try {
      const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
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
      const saved: Category = await res.json();
      setCategories((prev) =>
        editId ? prev.map((c) => (c._id === editId ? saved : c)) : [...prev, saved]
      );
      cancel();
      router.refresh();
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category? Posts in it will lose their category.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c._id !== id));
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted">{categories.length} categories</p>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="mb-6 p-5 bg-surface border border-border rounded-2xl">
          <h3 className="text-sm font-semibold text-text mb-4">{editId ? "Edit category" : "New category"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-muted mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Technology"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="technology"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Icon (emoji)</label>
              <input
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="💡"
                maxLength={4}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-muted mb-1">Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Articles about technology and innovation"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-muted mb-2">Color</label>
              <ColorPicker value={form.color} onChange={(c) => setForm((f) => ({ ...f, color: c }))} />
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
            <button
              onClick={cancel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-text transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {categories.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">No categories yet.</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Posts</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ backgroundColor: cat.color + "20", color: cat.color }}
                      >
                        {cat.icon || cat.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-text">{cat.name}</p>
                        {cat.description && <p className="text-xs text-muted line-clamp-1">{cat.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4 text-muted">{cat.postCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="text-muted hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(cat._id)}
                        className="text-muted hover:text-red-500 transition-colors"
                        title="Delete"
                      >
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
