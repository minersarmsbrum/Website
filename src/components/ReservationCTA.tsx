"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SafeImage } from "./SafeImage";
import { Reveal } from "./motion";
import { images } from "@/data/images";
import { site } from "@/data/site";

export function ReservationCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="relative flex min-h-[70vh] items-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-black" />
        <SafeImage
          src={images.reserveBackground}
          alt="An inviting table set for dinner"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
      </motion.div>
      <div className="absolute inset-0 bg-ink-900/70" />
      <div className="absolute inset-0 bg-radial-warm" />

      <div className="container-luxe relative z-10 py-24 text-center">
        <Reveal>
          <span className="eyebrow">Reservations</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="heading-lg mx-auto mt-5 max-w-3xl text-cream-50">
            Your table at The Miners Arms is <span className="gold-text">waiting</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="body-lg mx-auto mt-6 max-w-xl">
            Book online in under a minute — for a quiet weekday curry or the full
            family mixed grill on a Saturday night.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/reservations" className="btn-gold">
              Book a Table
            </Link>
            <a href={site.phoneHref} className="btn-ghost">
              Or call {site.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
