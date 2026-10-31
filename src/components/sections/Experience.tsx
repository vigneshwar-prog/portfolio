"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { experience } from "@/content/experience";
import { Reveal, Section } from "@/components/ui/Section";

function Logo({ company, logo }: { company: string; logo?: string }) {
  const initials = company.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
  return (
    <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-line-strong bg-elev font-mono text-sm font-semibold">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={`${company} logo`} className="size-7 object-contain" />
      ) : (
        initials
      )}
    </div>
  );
}

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="From full-stack internships to enterprise engineering."
      intro="Four years across software development, backend services, automation frameworks and network systems."
    >
      <ol ref={ref} className="relative">
        {/* rail */}
        <div aria-hidden className="absolute bottom-0 left-[21px] top-0 w-px bg-line md:left-[calc(30%+21px)]" />
        <motion.div
          aria-hidden
          style={{ scaleY }}
          className="absolute bottom-0 left-[21px] top-0 w-px origin-top bg-gradient-to-b from-green via-cyan to-violet md:left-[calc(30%+21px)]"
        />
        {experience.map((r, i) => (
          <li key={r.company + r.title} className="relative pb-12 last:pb-0 md:grid md:grid-cols-[30%_1fr]">
            <div className="hidden pr-10 pt-2 text-right md:block">
              <p className="font-mono text-sm text-fg">{r.period}</p>
              {r.location && <p className="mt-1 text-sm text-muted">{r.location}</p>}
              <p className="mt-1 font-mono text-xs text-muted">{r.type}</p>
            </div>
            <Reveal delay={i * 0.03} className="flex gap-5">
              <Logo company={r.company} logo={r.logo} />
              <div className="card min-w-0 flex-1 p-5 transition hover:border-line-strong sm:p-6">
                <p className="mb-2 font-mono text-xs text-muted md:hidden">
                  {r.period}
                  {r.location && ` · ${r.location}`} · {r.type}
                </p>
                <h3 className="text-lg font-semibold tracking-tight">
                  {r.title} <span className="text-muted">· {r.company}</span>
                </h3>
                <p className="mt-2 text-muted">{r.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed">
                  {r.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-green" />
                      <span className="text-fg/85">{h}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {r.stack.map((s) => (
                    <li key={s} className="rounded-md bg-fg/[0.05] px-2 py-0.5 font-mono text-[11px] text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
