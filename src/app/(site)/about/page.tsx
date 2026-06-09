import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SafeImage } from "@/components/SafeImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { images } from "@/data/images";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of The Miners Arms — a West Bromwich grill house since 2015, born from Indian and Chinese heritage and a love of the classic British pub.",
};

const values = [
  { title: "Fresh, every day", text: "Marinades, sauces and grills prepared from scratch each morning — never cut corners." },
  { title: "Generous by nature", text: "Portions built to share, prices that stay honest, and seconds always welcome." },
  { title: "A genuine welcome", text: "Quick lunches, family dinners or a big night out — every guest is looked after like a regular." },
  { title: "Three cuisines, one heart", text: "English, Indian and Chinese kitchens working side by side, under one roof." },
];

const timeline = [
  { year: "2015", title: "The doors open", text: "The Miners Arms begins serving the Hilltop community — a proper local with a kitchen that refused to pick just one cuisine." },
  { year: "2018", title: "The café finds its rhythm", text: "Morning breakfasts and light bites become a daily ritual for West Brom regulars." },
  { year: "2021", title: "The wok arrives", text: "Bao, dumplings, crispy duck and Vietnamese street food join the grill — the menu becomes truly three-in-one." },
  { year: "Today", title: "A neighbourhood institution", text: "From the full English at 7:30am to the family mixed grill at midnight, every plate is a taste of comfort and community." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={
          <>
            More than a meal —<br />
            <span className="gold-text">comfort & community</span>
          </>
        }
        intro="Since 2015, a West Bromwich grill house bringing three culinary worlds to one warm table."
        image={images.aboutHero}
      />

      <section className="bg-ink-900 py-24 md:py-32">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-cream-200/10 bg-gradient-to-br from-ink-600 to-ink-800">
              <SafeImage
                src={images.aboutFounder}
                alt="The chef at work in the kitchen"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-saffron-500/30 bg-ink-800/95 p-6 backdrop-blur sm:block">
              <p className="font-display text-4xl text-saffron-400">10+</p>
              <p className="text-xs uppercase tracking-luxe text-cream-200/60">
                Years serving<br />West Bromwich
              </p>
            </div>
          </div>

          <div>
            <Reveal>
              <span className="eyebrow">Where it began</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="heading-lg mt-4 text-cream-50">
                Born from two heritages, raised in a British pub
              </h2>
            </Reveal>
            <div className="mt-6 space-y-5 text-cream-200/75">
              <Reveal delay={0.16}>
                <p>
                  The Miners Arms isn&apos;t a restaurant that chose one lane. Our
                  owner grew up between Indian and Chinese kitchens, then fell for
                  the warmth of the classic English pub. Rather than pick a
                  favourite, we put all three on the same menu.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <p>
                  The result is a place where you can order the full English with
                  unlimited tea in the morning, a slow-cooked lamb rogan josh at
                  lunch, and hand-folded bao buns with crispy aromatic duck at
                  night — all cooked fresh, with our chef&apos;s signature
                  marinades, by the same team that knows your name.
                </p>
              </Reveal>
              <Reveal delay={0.32}>
                <p className="font-serif text-xl italic text-cream-100">
                  &ldquo;At Miner&apos;s Arms, every meal is more than just food —
                  it&apos;s a taste of comfort and community.&rdquo;
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-800 py-24 md:py-28">
        <div className="container-luxe">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <span className="eyebrow">What we stand for</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="heading-lg mt-4 text-cream-50">
                The house <span className="gold-text">rules</span>
              </h2>
            </Reveal>
          </div>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="card-surface h-full p-7">
                  <div className="mb-5 h-px w-10 bg-saffron-500" />
                  <h3 className="font-display text-xl text-cream-50">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream-200/65">
                    {v.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-ink-900 py-24 md:py-32">
        <div className="container-luxe">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <span className="eyebrow">The journey</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="heading-lg mt-4 text-cream-50">
                A decade in the <span className="gold-text">making</span>
              </h2>
            </Reveal>
          </div>

          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="absolute left-[15px] top-2 h-full w-px bg-gradient-to-b from-saffron-500/60 via-cream-200/15 to-transparent md:left-1/2" />
            <div className="space-y-12">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={i * 0.05}>
                  <div
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-0 top-1.5 z-10 h-8 w-8 shrink-0 rounded-full border border-saffron-500/50 bg-ink-900 md:left-1/2 md:-translate-x-1/2">
                      <span className="absolute inset-1.5 rounded-full bg-saffron-500" />
                    </div>
                    <div className={`pl-14 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <span className="font-display text-2xl text-saffron-400">{t.year}</span>
                      <h3 className="mt-1 font-display text-xl text-cream-50">{t.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream-200/65">{t.text}</p>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Reveal>
              <Link href="/reservations" className="btn-gold">
                Come and taste it
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
