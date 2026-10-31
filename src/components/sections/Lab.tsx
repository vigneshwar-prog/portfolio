"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { labCategories, labItems, type LabStatus } from "@/content/lab";
import { isPlaceholder } from "@/content/profile";
import { GithubIcon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const statusStyle: Record<LabStatus, string> = {
  Exploring: "text-violet border-violet/30",
  Building: "text-cyan border-cyan/30",
  Completed: "text-green border-green/30",
};

export function Lab() {
  const [filter, setFilter] = useState<string>("All");
  const used = labCategories.filter((c) => labItems.some((l) => l.category === c));
  const items = filter === "All" ? labItems : labItems.filter((l) => l.category === filter);

  return (
    <Section
      id="lab"
      eyebrow="Engineering Lab"
      title={
        <>
          Things I&apos;m building <span className="font-serif font-normal italic text-muted">and exploring.</span>
        </>
      }
      intro="A working notebook of side projects and experiments — where curiosity turns into code."
    >
      <div role="tablist" aria-label="Filter by category" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {["All", ...used].map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={filter === c}
            onClick={() => setFilter(c)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition",
              filter === c ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-3 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((l) => (
            <motion.li
              layout
              key={l.name}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="card flex flex-col p-5 transition hover:border-line-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{l.category}</p>
                  <h3 className="mt-1.5 font-semibold">{l.name}</h3>
                </div>
                <span className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]", statusStyle[l.status])}>
                  {l.status === "Building" ? (
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-70" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-current" />
                    </span>
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                  {l.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{l.description}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5">
                  {l.stack.map((s) => (
                    <li key={s} className="rounded-md bg-fg/[0.05] px-2 py-0.5 font-mono text-[11px] text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
                {l.github && !isPlaceholder(l.github) && (
                  <a href={l.github} target="_blank" rel="noreferrer" aria-label={`${l.name} on GitHub`} className="text-muted hover:text-fg">
                    <GithubIcon />
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Section>
  );
}
