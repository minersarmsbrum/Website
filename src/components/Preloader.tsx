"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={site.logo}
                alt="The Miners Arms crest"
                width={88}
                height={88}
                priority
                className="h-20 w-20 rounded-full sm:h-[5.5rem] sm:w-[5.5rem]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="font-display text-3xl text-cream-50 sm:text-4xl">
                The Miners Arms
              </p>
              <p className="mt-2 text-xs uppercase tracking-luxe text-saffron-500">
                Est. 2015 · West Bromwich
              </p>
            </motion.div>
            <div className="relative h-px w-48 overflow-hidden bg-cream-200/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-saffron-400 to-ember-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
