"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type PointerEvent } from "react";
import { SafeImage } from "./SafeImage";
import { SectionHeading } from "./SectionHeading";
import { Stagger, StaggerItem } from "./motion";
import { signatures } from "@/data/menu";

export function SignatureDishes() {
  return (
    <section className="relative bg-ink-900 py-24 md:py-32">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Chef's Signatures"
            title={
              <>
                The plates people <span className="gold-text">come back for</span>
              </>
            }
            intro="A taste across all three kitchens, grilled, simmered and steamed to order."
          />
        </div>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {signatures.map((dish) => (
            <StaggerItem key={dish.name}>
              <TiltCard dish={dish} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function TiltCard({
  dish,
}: {
  dish: (typeof signatures)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ["8deg", "-8deg"]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ["-8deg", "8deg"]), {
    stiffness: 200,
    damping: 20,
  });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }}
      className="group relative h-[420px] overflow-hidden rounded-2xl border border-cream-200/10 bg-gradient-to-br from-ink-600 to-ink-800"
    >
      <SafeImage
        src={dish.image}
        alt={dish.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />

      <div
        style={{ transform: "translateZ(45px)" }}
        className="absolute inset-x-0 bottom-0 p-6"
      >
        <span className="text-[0.65rem] uppercase tracking-luxe text-saffron-400">
          {dish.origin}
        </span>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl text-cream-50">{dish.name}</h3>
          <span className="font-display text-xl text-saffron-400">{dish.price}</span>
        </div>
        <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-cream-200/70 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
          {dish.desc}
        </p>
      </div>
    </motion.div>
  );
}
