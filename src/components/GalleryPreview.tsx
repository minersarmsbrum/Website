"use client";

import Link from "next/link";
import { SafeImage } from "./SafeImage";
import { SectionHeading } from "./SectionHeading";
import { Stagger, StaggerItem } from "./motion";
import { gallery } from "@/data/images";

export function GalleryPreview() {
  const shots = gallery.slice(0, 5);
  return (
    <section className="bg-ink-800 py-24 md:py-32">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="The Gallery"
            title={
              <>
                A look <span className="gold-text">inside</span>
              </>
            }
            intro="Sizzling grills, warm corners and full tables. A feel for the room before you arrive."
          />
          <Link href="/gallery" className="btn-ghost shrink-0">
            View full gallery
          </Link>
        </div>

        <Stagger className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
          {shots.map((shot, i) => (
            <StaggerItem
              key={shot.src}
              className={`group relative overflow-hidden rounded-2xl border border-cream-200/10 bg-ink-600 ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <SafeImage
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
