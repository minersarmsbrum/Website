"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { menu, type Dish } from "@/data/menu";

const ease = [0.22, 1, 0.36, 1] as const;

const tagLabel: Record<NonNullable<Dish["tags"]>[number], { label: string; cls: string }> = {
  veg: { label: "V", cls: "border-jade-400/40 text-jade-400" },
  spicy: { label: "Hot", cls: "border-ember-400/40 text-ember-400" },
  signature: { label: "Signature", cls: "border-saffron-500/40 text-saffron-400" },
  new: { label: "New", cls: "border-cream-200/40 text-cream-100" },
};

export function MenuExplorer() {
  const [sectionId, setSectionId] = useState(menu[0].id);
  const [activeCat, setActiveCat] = useState<string>("all");

  const section = menu.find((s) => s.id === sectionId) ?? menu[0];

  const categories = useMemo(
    () => section.categories.filter((c) => activeCat === "all" || c.id === activeCat),
    [section, activeCat]
  );

  return (
    <div className="container-luxe py-20 md:py-28">
      {/* Service switch */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-cream-200/15 bg-ink-700/60 p-1.5 backdrop-blur">
          {menu.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSectionId(s.id);
                setActiveCat("all");
              }}
              className={`relative rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
                sectionId === s.id ? "text-ink-900" : "text-cream-100/70 hover:text-cream-50"
              }`}
            >
              {sectionId === s.id && (
                <motion.span
                  layoutId="menu-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-xs uppercase tracking-luxe text-cream-200/50">
        {section.kicker}
      </p>

      {/* Category filter */}
      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        <FilterChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>
          All
        </FilterChip>
        {section.categories.map((c) => (
          <FilterChip
            key={c.id}
            active={activeCat === c.id}
            onClick={() => setActiveCat(c.id)}
          >
            {c.title}
          </FilterChip>
        ))}
      </div>

      {/* Categories */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sectionId + activeCat}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease }}
          className="mt-14 space-y-16"
        >
          {categories.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-28">
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-cream-200/10 pb-4">
                <div>
                  <h2 className="heading-md text-cream-50">{cat.title}</h2>
                  {cat.blurb && (
                    <p className="mt-1.5 text-sm text-cream-200/60">{cat.blurb}</p>
                  )}
                </div>
                <span className="font-display text-sm text-saffron-500/70">
                  {cat.items.length} dishes
                </span>
              </div>

              <div className="grid gap-x-12 gap-y-1 md:grid-cols-2">
                {cat.items.map((dish, i) => (
                  <motion.div
                    key={dish.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.02, 0.3) }}
                    className="group flex items-baseline gap-3 py-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-medium text-cream-50 transition-colors group-hover:text-saffron-400">
                          {dish.name}
                        </h3>
                        {dish.tags?.map((t) => (
                          <span
                            key={t}
                            className={`rounded-full border px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider ${tagLabel[t].cls}`}
                          >
                            {tagLabel[t].label}
                          </span>
                        ))}
                      </div>
                      {dish.desc && (
                        <p className="mt-1 text-sm leading-relaxed text-cream-200/55">
                          {dish.desc}
                        </p>
                      )}
                    </div>
                    <span
                      aria-hidden
                      className="mb-1 hidden flex-1 translate-y-[-2px] border-b border-dotted border-cream-200/20 sm:block"
                    />
                    <span className="shrink-0 font-display text-lg text-saffron-400">
                      {dish.price}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-4 border-t border-cream-200/10 pt-8 text-xs text-cream-200/60">
        <span className="rounded-full border border-jade-400/40 px-2 py-0.5 text-jade-400">V</span>
        Vegetarian
        <span className="rounded-full border border-ember-400/40 px-2 py-0.5 text-ember-400">Hot</span>
        Spicy
        <span className="rounded-full border border-saffron-500/40 px-2 py-0.5 text-saffron-400">Signature</span>
        House favourite
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
        active
          ? "border-saffron-500 bg-saffron-500/10 text-saffron-400"
          : "border-cream-200/15 text-cream-200/60 hover:border-cream-200/30 hover:text-cream-100"
      }`}
    >
      {children}
    </button>
  );
}
