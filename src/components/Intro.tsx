"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SafeImage } from "./SafeImage";
import { Reveal } from "./motion";
import { images } from "@/data/images";

const kitchens = [
  {
    flag: "🇬🇧",
    title: "The British Table",
    text: "A proper full English, pub classics and bakes — comfort that tastes like home.",
  },
  {
    flag: "🇮🇳",
    title: "The Indian Kitchen",
    text: "Slow-cooked curries, tandoori grills and signature marinades, made fresh daily.",
  },
  {
    flag: "🥢",
    title: "The Chinese Wok",
    text: "Bao, dumplings, crispy duck and Vietnamese street food, fired over high heat.",
  },
];

export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["12%", "-8%"]);

  return (
    <section className="relative overflow-hidden bg-ink-800 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-ember-grain opacity-50" />
      <div className="container-luxe relative grid items-center gap-16 lg:grid-cols-2">
        {/* Images */}
        <div ref={ref} className="relative h-[480px] sm:h-[560px]">
          <motion.div
            style={{ y: y1 }}
            className="absolute left-0 top-0 h-72 w-56 overflow-hidden rounded-2xl border border-cream-200/10 bg-ink-600 shadow-2xl sm:h-80 sm:w-64"
          >
            <SafeImage
              src={images.introInterior}
              alt="The Miners Arms warm dining room"
              fill
              sizes="320px"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-0 right-0 h-80 w-60 overflow-hidden rounded-2xl border border-cream-200/10 bg-ink-600 shadow-2xl sm:h-96 sm:w-72"
          >
            <SafeImage
              src={images.introDetail}
              alt="Freshly prepared dishes"
              fill
              sizes="320px"
              className="object-cover"
            />
          </motion.div>
          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-saffron-500/40 bg-ink-900/90 text-center backdrop-blur"
          >
            <span className="font-display text-3xl text-saffron-400">3</span>
            <span className="text-[0.6rem] uppercase tracking-luxe text-cream-200/70">
              Kitchens
            </span>
          </motion.div>
        </div>

        {/* Copy */}
        <div>
          <Reveal>
            <span className="eyebrow">Our Story</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="heading-lg mt-4 text-cream-50">
              Three culinary worlds, <span className="gold-text">one warm welcome</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="body-lg mt-6">
              Since 2015, The Miners Arms has been West Bromwich&apos;s favourite
              all-rounder. Born from our owner&apos;s Indian and Chinese heritage and
              raised in a classic British pub, every meal here is more than food —
              it&apos;s a taste of comfort and community.
            </p>
          </Reveal>

          <div className="mt-10 space-y-px">
            {kitchens.map((k, i) => (
              <Reveal key={k.title} delay={0.2 + i * 0.08}>
                <div className="group flex items-start gap-5 rounded-xl px-4 py-5 transition-colors hover:bg-ink-700/60">
                  <span className="text-2xl">{k.flag}</span>
                  <div>
                    <h3 className="font-display text-xl text-cream-50">{k.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-cream-200/70">
                      {k.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <Link href="/about" className="btn-ghost mt-8">
              Read our full story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
