"use client";

import { motion } from "framer-motion";

const words = [
  "Full English",
  "Butter Chicken",
  "Crispy Aromatic Duck",
  "Bao Buns",
  "Miners Mixed Grill",
  "Lamb Chops",
  "Chow Mein",
  "Tandoori King Prawns",
  "Char Siu Ribs",
  "Lamb Biryani",
];

export function Marquee() {
  return (
    <div className="relative flex overflow-hidden border-y border-cream-200/10 bg-ink-800 py-6">
      <motion.div
        className="flex shrink-0 items-center gap-10 pr-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="whitespace-nowrap font-display text-2xl text-cream-200/55 sm:text-3xl">
              {w}
            </span>
            <span className="text-saffron-500">✦</span>
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-800 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-800 to-transparent" />
    </div>
  );
}
