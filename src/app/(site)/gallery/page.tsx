import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { GalleryGrid } from "@/components/GalleryGrid";
import { images } from "@/data/images";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A look inside The Miners Arms — food, interior and atmosphere. West Bromwich grill house.",
};

export default function GalleryPage() {
  const galleryItems = store.gallery.list();

  return (
    <>
      <PageHeader
        eyebrow="In Pictures"
        title={
          <>
            The <span className="gold-text">Gallery</span>
          </>
        }
        intro="The food, the room, the full tables. Tap any image to view it large."
        image={images.aboutHero}
      />
      <section className="bg-ink-900">
        <GalleryGrid items={galleryItems} />
      </section>
    </>
  );
}
