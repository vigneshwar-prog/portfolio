"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { Reveal, Section } from "@/components/ui/Section";
import { accentText, cn } from "@/lib/utils";

const accentVar: Record<Project["accent"], string> = { green: "var(--green)", cyan: "var(--cyan)", violet: "var(--violet)" };

function ProjectCard({ p, featured, index }: { p: Project; featured?: boolean; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.06} className={cn("h-full", featured && "md:col-span-2")}>
      <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="h-full">
        <Link
          href={`/projects/${p.slug}`}
          className="card group relative flex h-full flex-col overflow-hidden p-6 transition hover:border-line-strong sm:p-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `color-mix(in oklab, ${accentVar[p.accent]} 18%, transparent)` }}
          />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={cn("font-mono text-xs uppercase tracking-[0.18em]", accentText[p.accent])}>{p.kicker}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">{p.title}</h3>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition group-hover:border-line-strong group-hover:bg-fg group-hover:text-bg">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">{p.summary}</p>

          {featured && (
            <ol className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
              {p.architecture.flow.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="rounded-md border border-line bg-bg/60 px-2 py-1">{step}</span>
                  {i < p.architecture.flow.length - 1 && <span aria-hidden className={accentText[p.accent]}>→</span>}
                </li>
              ))}
            </ol>
          )}

          <div className="mt-auto pt-6">
            {p.metrics && (
              <dl className="mb-5 flex gap-6">
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="sr-only">{m.label}</dt>
                    <dd className={cn("text-2xl font-semibold", accentText[p.accent])}>{m.value}</dd>
                    <dd className="text-xs text-muted">{m.label}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">{p.kind}</span>
              {p.tags.slice(0, featured ? 6 : 4).map((t) => (
                <span key={t} className="rounded-md bg-fg/[0.05] px-2 py-0.5 font-mono text-[11px] text-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Featured work"
      title="Systems I've designed and built."
      intro="Click any project for the full case study."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} p={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
