import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { MenuExplorer } from "@/components/MenuExplorer";
import { images } from "@/data/images";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore The Miners Arms menu — full English breakfasts, Indian curries & tandoori grills, Chinese & Vietnamese small plates, mixed grills, biryani and more. West Bromwich.",
};

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="Eat & Drink"
        title={
          <>
            The <span className="gold-text">Menu</span>
          </>
        }
        intro="Two kitchens, one appetite. Swap between the day café and the evening pub kitchen — every price exactly as served."
        image={images.menuBackground}
      />
      <section className="bg-ink-900">
        <MenuExplorer />
      </section>
    </>
  );
}
