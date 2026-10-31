"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/content/projects";
import { levelLabel, skillGroups, type SkillLevel } from "@/content/skills";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const levelDot: Record<SkillLevel, string> = {
  professional: "bg-green",
  "hands-on": "bg-cyan",
  exploring: "bg-violet",
};

/** Map each project tag to skills by loose name matching. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const related = (skill: string) =>
  projects.filter((p) => p.tags.some((t) => norm(t).includes(norm(skill)) || norm(skill).includes(norm(t))));

function Constellation() {
  const [active, setActive] = useState<string | null>(null);
  const skills = useMemo(() => {
    const names = Array.from(new Set(projects.flatMap((p) => p.tags))).slice(0, 18);
    return names;
  }, []);

  // Projects on an inner ellipse, skills on an outer ellipse.
  const W = 800, H = 440, cx = W / 2, cy = H / 2;
  const pPos = projects.map((_, i) => {
    const a = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * 170, y: cy + Math.sin(a) * 105 };
  });
  const sPos = skills.map((_, i) => {
    const a = (i / skills.length) * Math.PI * 2 - Math.PI / 2 + 0.15;
    return { x: cx + Math.cos(a) * 345, y: cy + Math.sin(a) * 190 };
  });

  const isLit = (proj: number, skill: string) =>
    !active || active === projects[proj].slug || active === skill;

  return (
    <div className="card mt-6 hidden overflow-hidden p-4 md:block">
      <div className="flex items-center justify-between px-2 pb-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Technology constellation</p>
        <p className="text-xs text-muted">Hover a project or technology</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Graph connecting projects to the technologies they use">
        {projects.map((p, i) =>
          p.tags.map((t) => {
            const j = skills.indexOf(t);
            if (j < 0) return null;
            const lit = isLit(i, t) && (active === null || active === p.slug || active === t);
            return (
              <line
                key={p.slug + t}
                x1={pPos[i].x} y1={pPos[i].y} x2={sPos[j].x} y2={sPos[j].y}
                stroke={lit && active ? "var(--green)" : "var(--line-strong)"}
                strokeOpacity={active && !lit ? 0.15 : 1}
                strokeWidth={lit && active ? 1.4 : 1}
                style={{ transition: "all .25s" }}
              />
            );
          }),
        )}
        {skills.map((s, j) => {
          const dim = active && active !== s && !projects.some((p) => p.slug === active && p.tags.includes(s));
          return (
            <g key={s} onMouseEnter={() => setActive(s)} onMouseLeave={() => setActive(null)} style={{ cursor: "default", opacity: dim ? 0.3 : 1, transition: "opacity .25s" }}>
              <circle cx={sPos[j].x} cy={sPos[j].y} r={3.5} fill="var(--cyan)" />
              <text x={sPos[j].x} y={sPos[j].y - 9} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--font-mono)">
                {s}
              </text>
            </g>
          );
        })}
        {projects.map((p, i) => {
          const dim = active && active !== p.slug && !p.tags.includes(active);
          return (
            <g key={p.slug} onMouseEnter={() => setActive(p.slug)} onMouseLeave={() => setActive(null)} style={{ opacity: dim ? 0.3 : 1, transition: "opacity .25s" }}>
              <Link href={`/projects/${p.slug}`}>
                <circle cx={pPos[i].x} cy={pPos[i].y} r={7} fill="var(--bg-elev)" stroke="var(--green)" strokeWidth={1.5} />
                <text x={pPos[i].x} y={pPos[i].y + 22} textAnchor="middle" fontSize="12" fontWeight={600} fill="var(--fg)">
                  {p.title.length > 26 ? p.title.slice(0, 24) + "…" : p.title}
                </text>
              </Link>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Tools I reach for — and how well I know them."
      intro="Grouped by domain, and honest about depth: what I use professionally, what I've built with in projects, and what I'm currently exploring."
    >
      <div className="mb-8 flex flex-wrap gap-4 text-sm">
        {(Object.keys(levelLabel) as SkillLevel[]).map((l) => (
          <span key={l} className="flex items-center gap-2 text-muted">
            <span className={cn("size-2 rounded-full", levelDot[l])} /> {levelLabel[l]}
          </span>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.05} className={i === 2 ? "lg:row-span-2" : ""}>
            <motion.div whileHover={{ y: -3 }} className="card h-full p-6 transition hover:border-line-strong">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg border border-line bg-bg">
                  <Icon name={g.icon} size={16} className="text-green" />
                </span>
                <h3 className="font-semibold">{g.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted">{g.blurb}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <li
                    key={s.name}
                    title={`${levelLabel[s.level]}${related(s.name).length ? ` · used in ${related(s.name).map((p) => p.title).join(", ")}` : ""}`}
                    className="flex items-center gap-2 rounded-lg border border-line bg-bg/50 px-2.5 py-1.5 text-sm"
                  >
                    <span className={cn("size-1.5 rounded-full", levelDot[s.level])} />
                    {s.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <Constellation />
      </Reveal>
    </Section>
  );
}
