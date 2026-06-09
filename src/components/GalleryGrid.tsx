"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { SafeImage } from "./SafeImage";
import { gallery as staticGallery } from "@/data/images";

type GalleryItem = { src: string; alt: string; tall?: boolean };

export function GalleryGrid({ items }: { items?: GalleryItem[] }) {
  const gallery = items ?? staticGallery;
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % gallery.length)),
    [gallery.length]
  );
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length)),
    [gallery.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  return (
    <div className="container-luxe py-20 md:py-28">
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {gallery.map((shot, i) => (
          <motion.button
            key={shot.src}
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.4) }}
            className={`group relative block w-full overflow-hidden rounded-2xl border border-cream-200/10 bg-ink-600 ${
              shot.tall ? "aspect-[3/4]" : "aspect-square"
            }`}
          >
            <SafeImage
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-900/80 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="text-sm text-cream-100">{shot.alt}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-900/95 p-4 backdrop-blur-md"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-cream-200/20 text-cream-100 transition-colors hover:border-saffron-500 hover:text-saffron-400"
            >
              ✕
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-cream-200/20 text-2xl text-cream-100 transition-colors hover:border-saffron-500 hover:text-saffron-400 sm:left-8"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-cream-200/20 text-2xl text-cream-100 transition-colors hover:border-saffron-500 hover:text-saffron-400 sm:right-8"
            >
              ›
            </button>
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[78vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-ink-700"
            >
              <SafeImage
                src={gallery[open].src.replace(/w=\d+/, "w=1600")}
                alt={gallery[open].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/90 to-transparent p-6 text-center">
                <p className="text-sm text-cream-100">{gallery[open].alt}</p>
                <p className="mt-1 text-xs text-cream-200/50">
                  {open + 1} / {gallery.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
