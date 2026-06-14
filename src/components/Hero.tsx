"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SafeImage } from "./SafeImage";
import { images } from "@/data/images";
import { site } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-900"
    >
      {/* Parallax background */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-700 via-ink-900 to-black" />
        <SafeImage
          src={images.heroBackground}
          alt="The Miners Arms dining room at night"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
      </motion.div>

      {/* Tints & vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-ink-900/70" />
      <div className="absolute inset-0 bg-radial-warm" />

      {/* Floating decorative orbs */}
      <FloatingOrbs />

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="container-luxe relative z-10 py-32"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1.8 }}
          className="eyebrow inline-block"
        >
          {site.hero.eyebrow}
        </motion.span>

        <h1 className="heading-xl mt-6 max-w-4xl text-cream-50">
          {site.hero.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease, delay: 1.85 + i * 0.13 }}
              >
                {i === 2 ? <span className="gold-text">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 2.3 }}
          className="body-lg mt-8 max-w-xl"
        >
          {site.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 2.45 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/reservations" className="btn-gold">
            Reserve a Table
          </Link>
          <Link href="/menu" className="btn-ghost">
            Explore the Menu
          </Link>
        </motion.div>

        {/* Quick facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.6 }}
          className="mt-16 flex flex-wrap gap-x-10 gap-y-4 text-sm text-cream-200/60"
        >
          {site.highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
              <span className="text-cream-100">{h.label}</span>
              <span className="hidden sm:inline">, {h.detail}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.6rem] uppercase tracking-luxe text-cream-200/50">
            Scroll
          </span>
          <div className="flex h-10 w-6 justify-center rounded-full border border-cream-200/25 p-1.5">
            <motion.span
              className="h-2 w-1 rounded-full bg-saffron-400"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FloatingOrbs() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-ember-500/10 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-saffron-500/10 blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, -25, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-ember-500/10 blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
