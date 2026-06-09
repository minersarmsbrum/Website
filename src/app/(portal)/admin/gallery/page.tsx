"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import type { GalleryItem } from "@/lib/store";

const MAX_PHOTOS = 50;

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [alt, setAlt] = useState("");
  const [tall, setTall] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/gallery");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const file = fileRef.current?.files?.[0];
    if (!file) { setError("Please select an image file."); return; }
    if (items.length >= MAX_PHOTOS) { setError(`Maximum ${MAX_PHOTOS} photos reached. Delete some to upload more.`); return; }

    setUploading(true);
    setUploadProgress("Uploading…");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", alt || file.name.replace(/\.[^.]+$/, ""));
    fd.append("tall", String(tall));

    const res = await fetch("/api/gallery", { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Upload failed.");
    } else {
      setAlt("");
      setTall(false);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    }

    setUploading(false);
    setUploadProgress("");
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this photo?")) return;
    setDeleting(id);
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  return (
    <div className="pt-14 lg:pt-0 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-cream-50">Gallery</h1>
        <p className="mt-1 text-sm text-cream-200/50">{items.length} / {MAX_PHOTOS} photos</p>
      </div>

      {/* Upload form */}
      <div className="card-surface mb-6 p-5">
        <h2 className="mb-4 font-display text-lg text-cream-50">Upload Photo</h2>
        <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-48">
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-cream-200/50">Image file</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="w-full rounded-xl border border-cream-200/10 bg-ink-800 px-3 py-2.5 text-sm text-cream-100 file:mr-3 file:rounded-lg file:border-0 file:bg-saffron-500/20 file:px-3 file:py-1 file:text-xs file:text-saffron-400 outline-none focus:border-saffron-500/40"
            />
          </div>
          <div className="flex-1 min-w-36">
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-cream-200/50">Alt text</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the photo"
              className="w-full rounded-xl border border-cream-200/10 bg-ink-800 px-3 py-2.5 text-sm text-cream-100 placeholder:text-cream-200/20 outline-none focus:border-saffron-500/40"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-cream-200/10 px-3 py-2.5 text-sm text-cream-200/60 hover:border-saffron-500/30">
            <input type="checkbox" checked={tall} onChange={(e) => setTall(e.target.checked)} className="accent-saffron-500" />
            Tall crop
          </label>
          <button
            type="submit"
            disabled={uploading || items.length >= MAX_PHOTOS}
            className="btn-gold !py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? uploadProgress : "Upload"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-ember-400">{error}</p>}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="card-surface p-8 text-center text-cream-200/40">Loading gallery…</div>
      ) : items.length === 0 ? (
        <div className="card-surface p-8 text-center text-cream-200/40">No photos yet. Upload one above.</div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 md:columns-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative mb-3 overflow-hidden rounded-xl border border-cream-200/10 bg-ink-700 ${item.tall ? "aspect-[3/4]" : "aspect-square"}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-ink-900/90 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="mb-2 line-clamp-2 text-xs text-cream-100">{item.alt}</p>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="rounded-lg bg-ember-500/90 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-ember-600 disabled:opacity-50"
                >
                  {deleting === item.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
