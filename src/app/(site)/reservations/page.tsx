import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ReservationForm } from "@/components/ReservationForm";
import { Reveal } from "@/components/motion";
import { images } from "@/data/images";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Reservations",
  description:
    "Book your table at The Miners Arms, West Bromwich. Reserve online for lunch, dinner or a large group.",
};

const perks = [
  { title: "Walk-ins welcome", text: "Booking guarantees your table, but you're always welcome to drop by." },
  { title: "Groups & events", text: "Birthdays, work dinners, family gatherings — tell us and we'll set it up." },
  { title: "Flexible times", text: "From the lunch service to the late kitchen, find a slot that suits you." },
];

export default function ReservationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book With Us"
        title={
          <>
            Reserve your <span className="gold-text">table</span>
          </>
        }
        intro="A minute to book, a night to remember. Tell us when you're coming and how many."
        image={images.reserveBackground}
      />

      <section className="bg-ink-900 py-20 md:py-28">
        <div className="container-luxe grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <span className="eyebrow">Why book ahead</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="heading-md mt-4 text-cream-50">
                We&apos;ll have everything ready for you
              </h2>
            </Reveal>
            <div className="mt-8 space-y-px">
              {perks.map((p, i) => (
                <Reveal key={p.title} delay={0.12 + i * 0.06}>
                  <div className="flex items-start gap-4 rounded-xl px-4 py-4 transition-colors hover:bg-ink-700/50">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-saffron-500" />
                    <div>
                      <h3 className="font-display text-lg text-cream-50">{p.title}</h3>
                      <p className="mt-1 text-sm text-cream-200/65">{p.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4}>
              <div className="card-surface mt-8 p-6">
                <p className="text-xs uppercase tracking-luxe text-cream-200/50">Find us</p>
                <p className="mt-2 text-cream-100">
                  {site.address.line1}, {site.address.line2}, {site.address.postcode}
                </p>
                <a href={site.phoneHref} className="mt-3 inline-block text-saffron-400 hover:underline">
                  {site.phone}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:pt-2">
            <ReservationForm />
          </div>
        </div>
      </section>
    </>
  );
}
