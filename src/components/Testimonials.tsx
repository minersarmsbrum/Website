"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SectionHeading } from "./SectionHeading";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const active = testimonials[index];

  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-warm" />
      <div className="container-luxe relative">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Loved Locally"
            title={<>What West Brom is saying</>}
            align="center"
          />
        </div>

        <div className="relative mx-auto mt-14 min-h-[260px] max-w-3xl text-center sm:min-h-[220px]">
          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-display text-[8rem] leading-none text-saffron-500/15">
            &ldquo;
          </span>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <p className="font-serif text-2xl leading-relaxed text-cream-100 sm:text-3xl">
                {active.quote}
              </p>
              <footer className="mt-8">
                <p className="font-display text-lg text-saffron-400">{active.name}</p>
                <p className="text-xs uppercase tracking-luxe text-cream-200/50">
                  {active.detail}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-saffron-400" : "w-2 bg-cream-200/25 hover:bg-cream-200/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
