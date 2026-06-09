import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { SignatureDishes } from "@/components/SignatureDishes";
import { Intro } from "@/components/Intro";
import { Testimonials } from "@/components/Testimonials";
import { GalleryPreview } from "@/components/GalleryPreview";
import { ReservationCTA } from "@/components/ReservationCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <SignatureDishes />
      <Intro />
      <Testimonials />
      <GalleryPreview />
      <ReservationCTA />
    </>
  );
}
