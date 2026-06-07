"use client";

import { motion } from "framer-motion";
import { SafeImage } from "./SafeImage";

const ease = [0.22, 1, 0.36, 1] as const;

export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  image: string;
}) {
  return (
    <header className="relative flex min-h-[52vh] items-end overflow-hidden bg-ink-900 pt-20">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-black" />
        <SafeImage
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-ink-900/30" />
      <div className="absolute inset-0 bg-radial-warm" />

      <div className="container-luxe relative z-10 pb-16 pt-10">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="eyebrow inline-block"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="heading-xl mt-4 max-w-4xl text-cream-50"
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.32 }}
            className="body-lg mt-6 max-w-2xl"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  );
}
