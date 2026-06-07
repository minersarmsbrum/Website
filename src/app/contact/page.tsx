import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion";
import { images } from "@/data/images";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with The Miners Arms, West Bromwich — address, opening hours, phone and enquiry form. 58 Bagnall Street, B70 0TW.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Say Hello"
        title={
          <>
            Get in <span className="gold-text">touch</span>
          </>
        }
        intro="Questions, big-group bookings or feedback — we'd love to hear from you."
        image={images.menuBackground}
      />

      <section className="bg-ink-900 py-20 md:py-28">
        <div className="container-luxe grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          {/* Details */}
          <div className="space-y-8">
            <Reveal>
              <InfoBlock label="Address">
                <p className="text-cream-100">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.postcode}, {site.address.country}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${site.mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-saffron-400 hover:underline"
                >
                  Open in Google Maps →
                </a>
              </InfoBlock>
            </Reveal>

            <Reveal delay={0.08}>
              <InfoBlock label="Contact">
                <a href={site.phoneHref} className="block text-cream-100 hover:text-saffron-400">
                  {site.phone}
                </a>
                <p className="text-sm text-cream-200/60">
                  Or send us a message using the form.
                </p>
                <div className="mt-3 flex gap-4 text-sm">
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="text-saffron-400 hover:underline">
                    Instagram
                  </a>
                  <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="text-saffron-400 hover:underline">
                    Facebook
                  </a>
                </div>
              </InfoBlock>
            </Reveal>

            <Reveal delay={0.16}>
              <InfoBlock label="Opening Hours">
                <p className="mb-2 text-xs uppercase tracking-luxe text-saffron-500/80">Pub Kitchen</p>
                <ul className="space-y-1.5 text-sm">
                  {site.hours.pub.map((h) => (
                    <li key={h.day} className="flex justify-between gap-4 text-cream-200/80">
                      <span>{h.day}</span>
                      <span className="text-right text-cream-200/55">
                        {h.time}
                        {"note" in h && h.note ? <span className="block text-xs text-saffron-500/70">{h.note}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mb-2 mt-5 text-xs uppercase tracking-luxe text-saffron-500/80">Day Café</p>
                <ul className="space-y-1.5 text-sm">
                  {site.hours.cafe.map((h) => (
                    <li key={h.day} className="flex justify-between gap-4 text-cream-200/80">
                      <span>{h.day}</span>
                      <span className="text-cream-200/55">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </InfoBlock>
            </Reveal>
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-ink-800 pb-20">
        <div className="container-luxe">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-cream-200/10">
              <iframe
                title="Map to The Miners Arms"
                src="https://www.google.com/maps?q=58+Bagnall+Street+West+Bromwich+B70+0TW&output=embed"
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full grayscale-[0.3] invert-[0.92] hue-rotate-180"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card-surface p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-luxe text-cream-200/50">{label}</p>
      {children}
    </div>
  );
}
