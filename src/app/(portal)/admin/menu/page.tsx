"use client";

import { useEffect, useState, useCallback } from "react";
import type { StoreSection, StoreCategory, StoreDish } from "@/lib/store";

type Tag = "veg" | "spicy" | "signature" | "new";
const ALL_TAGS: Tag[] = ["veg", "spicy", "signature", "new"];

function TagPill({ tag }: { tag: Tag }) {
  const cls = tag === "veg" ? "bg-jade-500/15 text-jade-400" :
    tag === "spicy" ? "bg-ember-500/15 text-ember-400" :
    tag === "signature" ? "bg-saffron-500/15 text-saffron-400" :
    "bg-cream-200/10 text-cream-200/60";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{tag}</span>;
}

type EditItem = { name: string; price: string; desc: string; tags: Tag[] };
type EditCat = { title: string; blurb: string };

export default function AdminMenuPage() {
  const [sections, setSections] = useState<StoreSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  // Add category
  const [addingCat, setAddingCat] = useState<string | null>(null);
  const [newCat, setNewCat] = useState<EditCat>({ title: "", blurb: "" });

  // Edit category
  const [editingCat, setEditingCat] = useState<{ sId: string; cId: string } | null>(null);
  const [editCatData, setEditCatData] = useState<EditCat>({ title: "", blurb: "" });

  // Add item
  const [addingItem, setAddingItem] = useState<{ sId: string; cId: string } | null>(null);
  const [newItem, setNewItem] = useState<EditItem>({ name: "", price: "", desc: "", tags: [] });

  // Edit item
  const [editingItem, setEditingItem] = useState<{ sId: string; cId: string; iId: string } | null>(null);
  const [editItemData, setEditItemData] = useState<EditItem>({ name: "", price: "", desc: "", tags: [] });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/menu");
    if (res.ok) setSections(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const section = sections[activeTab];

  // ── Category actions ──────────────────────────────────────────────────────

  async function submitAddCat(sId: string) {
    if (!newCat.title.trim()) return;
    setSaving(true);
    await fetch(`/api/menu/sections/${sId}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    setAddingCat(null);
    setNewCat({ title: "", blurb: "" });
    await load();
    setSaving(false);
  }

  async function submitEditCat(sId: string, cId: string) {
    setSaving(true);
    await fetch(`/api/menu/sections/${sId}/categories/${cId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCatData),
    });
    setEditingCat(null);
    await load();
    setSaving(false);
  }

  async function deleteCat(sId: string, cId: string) {
    if (!confirm("Delete this category and all its items?")) return;
    setSaving(true);
    await fetch(`/api/menu/sections/${sId}/categories/${cId}`, { method: "DELETE" });
    if (expandedCat === cId) setExpandedCat(null);
    await load();
    setSaving(false);
  }

  // ── Item actions ──────────────────────────────────────────────────────────

  async function submitAddItem(sId: string, cId: string) {
    setError("");
    if (!newItem.name.trim() || !newItem.price.trim()) { setError("Name and price are required."); return; }
    setSaving(true);
    await fetch(`/api/menu/sections/${sId}/categories/${cId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setAddingItem(null);
    setNewItem({ name: "", price: "", desc: "", tags: [] });
    await load();
    setSaving(false);
  }

  async function submitEditItem(sId: string, cId: string, iId: string) {
    setError("");
    if (!editItemData.name.trim() || !editItemData.price.trim()) { setError("Name and price are required."); return; }
    setSaving(true);
    await fetch(`/api/menu/sections/${sId}/categories/${cId}/items/${iId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editItemData),
    });
    setEditingItem(null);
    await load();
    setSaving(false);
  }

  async function deleteItem(sId: string, cId: string, iId: string) {
    if (!confirm("Delete this item?")) return;
    setSaving(true);
    await fetch(`/api/menu/sections/${sId}/categories/${cId}/items/${iId}`, { method: "DELETE" });
    await load();
    setSaving(false);
  }

  function toggleTag(tags: Tag[], tag: Tag): Tag[] {
    return tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
  }

  if (loading) return <div className="card-surface p-8 text-center text-cream-200/40">Loading menu…</div>;

  return (
    <div className="pt-14 lg:pt-0 max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-cream-50">Menu</h1>
        <p className="mt-1 text-sm text-cream-200/50">Manage categories, items and prices</p>
      </div>

      {/* Section tabs */}
      <div className="mb-5 flex gap-2 border-b border-cream-200/10 pb-1">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(i)}
            className={`rounded-t-lg px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === i
                ? "border-b-2 border-saffron-500 text-saffron-400"
                : "text-cream-200/50 hover:text-cream-100"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {section && (
        <div className="space-y-3">
          {section.categories.map((cat: StoreCategory) => (
            <div key={cat.id} className="card-surface overflow-hidden">
              {/* Category header */}
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  className="flex flex-1 items-center gap-3 text-left"
                  onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                >
                  <span className="text-xs text-cream-200/30">{expandedCat === cat.id ? "▲" : "▼"}</span>
                  {editingCat?.sId === section.id && editingCat.cId === cat.id ? (
                    <div className="flex flex-1 flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        className="flex-1 min-w-32 rounded-lg border border-cream-200/10 bg-ink-800 px-3 py-1.5 text-sm text-cream-100 outline-none focus:border-saffron-500/40"
                        value={editCatData.title}
                        onChange={(e) => setEditCatData((d) => ({ ...d, title: e.target.value }))}
                        placeholder="Category title"
                      />
                      <input
                        className="flex-1 min-w-32 rounded-lg border border-cream-200/10 bg-ink-800 px-3 py-1.5 text-sm text-cream-100 outline-none focus:border-saffron-500/40"
                        value={editCatData.blurb}
                        onChange={(e) => setEditCatData((d) => ({ ...d, blurb: e.target.value }))}
                        placeholder="Optional blurb"
                      />
                      <button onClick={() => submitEditCat(section.id, cat.id)} disabled={saving} className="btn-gold !px-3 !py-1.5 text-xs">Save</button>
                      <button onClick={() => setEditingCat(null)} className="btn-ghost !px-3 !py-1.5 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <span className="font-display text-base text-cream-50">{cat.title}</span>
                      {cat.blurb && <span className="ml-2 text-xs text-cream-200/40">{cat.blurb}</span>}
                      <span className="ml-2 text-xs text-cream-200/30">({cat.items.length} items)</span>
                    </div>
                  )}
                </button>
                {!(editingCat?.cId === cat.id) && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => { setEditingCat({ sId: section.id, cId: cat.id }); setEditCatData({ title: cat.title, blurb: cat.blurb || "" }); }}
                      className="rounded-lg border border-cream-200/10 px-3 py-1 text-xs text-cream-200/60 hover:border-saffron-500/30 hover:text-saffron-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCat(section.id, cat.id)}
                      className="rounded-lg border border-ember-500/20 px-3 py-1 text-xs text-ember-400 hover:bg-ember-500/10"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Expanded items list */}
              {expandedCat === cat.id && (
                <div className="border-t border-cream-200/10">
                  {cat.items.map((item: StoreDish) => (
                    <div key={item.id} className="border-b border-cream-200/5 px-4 py-3 last:border-0">
                      {editingItem?.iId === item.id ? (
                        <ItemForm
                          data={editItemData}
                          onChange={setEditItemData}
                          onSave={() => submitEditItem(section.id, cat.id, item.id)}
                          onCancel={() => setEditingItem(null)}
                          saving={saving}
                          error={error}
                        />
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-cream-100">{item.name}</span>
                              <span className="font-display text-sm text-saffron-400">{item.price}</span>
                              {item.tags?.map((t) => <TagPill key={t} tag={t as Tag} />)}
                            </div>
                            {item.desc && <p className="mt-0.5 text-xs text-cream-200/45">{item.desc}</p>}
                          </div>
                          <div className="flex shrink-0 gap-1.5">
                            <button
                              onClick={() => { setEditingItem({ sId: section.id, cId: cat.id, iId: item.id }); setEditItemData({ name: item.name, price: item.price, desc: item.desc || "", tags: (item.tags || []) as Tag[] }); }}
                              className="rounded-lg border border-cream-200/10 px-2.5 py-1 text-xs text-cream-200/60 hover:border-saffron-500/30 hover:text-saffron-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteItem(section.id, cat.id, item.id)}
                              className="rounded-lg border border-ember-500/20 px-2.5 py-1 text-xs text-ember-400 hover:bg-ember-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add item form */}
                  {addingItem?.cId === cat.id ? (
                    <div className="px-4 py-3">
                      <ItemForm
                        data={newItem}
                        onChange={setNewItem}
                        onSave={() => submitAddItem(section.id, cat.id)}
                        onCancel={() => { setAddingItem(null); setNewItem({ name: "", price: "", desc: "", tags: [] }); }}
                        saving={saving}
                        error={error}
                        isNew
                      />
                    </div>
                  ) : (
                    <div className="px-4 py-3">
                      <button
                        onClick={() => setAddingItem({ sId: section.id, cId: cat.id })}
                        className="text-xs text-saffron-400 hover:underline"
                      >
                        + Add item
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add category */}
          {addingCat === section.id ? (
            <div className="card-surface p-4">
              <p className="mb-3 font-display text-sm text-cream-50">New Category</p>
              <div className="flex flex-wrap gap-2">
                <input
                  className="flex-1 min-w-40 rounded-xl border border-cream-200/10 bg-ink-800 px-3 py-2 text-sm text-cream-100 outline-none focus:border-saffron-500/40"
                  value={newCat.title}
                  onChange={(e) => setNewCat((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Category title *"
                />
                <input
                  className="flex-1 min-w-40 rounded-xl border border-cream-200/10 bg-ink-800 px-3 py-2 text-sm text-cream-100 outline-none focus:border-saffron-500/40"
                  value={newCat.blurb}
                  onChange={(e) => setNewCat((d) => ({ ...d, blurb: e.target.value }))}
                  placeholder="Optional blurb"
                />
                <button onClick={() => submitAddCat(section.id)} disabled={saving || !newCat.title.trim()} className="btn-gold !px-4 !py-2 text-sm disabled:opacity-50">
                  Add
                </button>
                <button onClick={() => { setAddingCat(null); setNewCat({ title: "", blurb: "" }); }} className="btn-ghost !px-4 !py-2 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingCat(section.id)}
              className="btn-ghost w-full"
            >
              + Add Category
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ItemForm({
  data,
  onChange,
  onSave,
  onCancel,
  saving,
  error,
  isNew = false,
}: {
  data: EditItem;
  onChange: (d: EditItem) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
  isNew?: boolean;
}) {
  const ALL_TAGS: Tag[] = ["veg", "spicy", "signature", "new"];
  return (
    <div className="rounded-xl border border-saffron-500/20 bg-ink-800/60 p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-cream-200/40">{isNew ? "New Item" : "Edit Item"}</p>
      <div className="flex flex-wrap gap-2">
        <input
          className="flex-1 min-w-36 rounded-lg border border-cream-200/10 bg-ink-800 px-3 py-1.5 text-sm text-cream-100 outline-none focus:border-saffron-500/40"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Item name *"
        />
        <input
          className="w-24 rounded-lg border border-cream-200/10 bg-ink-800 px-3 py-1.5 text-sm text-cream-100 outline-none focus:border-saffron-500/40"
          value={data.price}
          onChange={(e) => onChange({ ...data, price: e.target.value })}
          placeholder="£0.00 *"
        />
        <input
          className="flex-1 min-w-48 rounded-lg border border-cream-200/10 bg-ink-800 px-3 py-1.5 text-sm text-cream-100 outline-none focus:border-saffron-500/40"
          value={data.desc}
          onChange={(e) => onChange({ ...data, desc: e.target.value })}
          placeholder="Description (optional)"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <label key={tag} className="flex cursor-pointer items-center gap-1.5 text-xs text-cream-200/60">
              <input
                type="checkbox"
                checked={data.tags.includes(tag)}
                onChange={() => onChange({ ...data, tags: data.tags.includes(tag) ? data.tags.filter((t) => t !== tag) : [...data.tags, tag] })}
                className="accent-saffron-500"
              />
              {tag}
            </label>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={onSave} disabled={saving} className="btn-gold !px-3 !py-1.5 text-xs disabled:opacity-50">Save</button>
          <button onClick={onCancel} className="btn-ghost !px-3 !py-1.5 text-xs">Cancel</button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-ember-400">{error}</p>}
    </div>
  );
}
